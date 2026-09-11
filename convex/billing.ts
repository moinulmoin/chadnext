/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/any types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import { Polar } from "@convex-dev/polar";
import { ConvexError, type GenericId, v } from "convex/values";

import { components, internal } from "./_generated/api";
import { action, internalQuery, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Polar billing (Free/Pro fixed tiers — never usage-based/metered).
 *
 * Built against the INSTALLED @convex-dev/polar 0.7.3 API surface:
 *  - `polar.getCurrentSubscription(ctx, { userId })` — reads the component's
 *    own subscriptions/products tables (kept in sync by Polar webhooks via
 *    `polar.registerRoutes`). No app-side persistence or duplicate webhook
 *    handling: the component owns subscription state.
 *  - `polar.createCheckoutSession(ctx, { productIds, userId, email, origin,
 *    successUrl })` — creates a hosted Polar checkout (action context; it
 *    performs network I/O and links the Polar customer to our userId).
 *  - `polar.createCustomerPortalSession(ctx, { userId })` — customer portal.
 *
 * Zero-config rule: when POLAR_* env vars are absent, every query returns the
 * Free plan and checkout/portal actions fail with actionable messages instead
 * of breaking the UI.
 */

const PRO_PRODUCT_KEY = "pro";

/** Polar subscription statuses that grant Pro-level quotas. */
const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function proProductId(): string | null {
  const productId = process.env.POLAR_PRO_PRODUCT_ID?.trim();
  return productId ? productId : null;
}

function isBillingConfigured(): boolean {
  return Boolean(process.env.POLAR_ORGANIZATION_TOKEN?.trim()) && proProductId() !== null;
}

export const polar = new Polar(components.polar, {
  // Used by the component's checkout/portal helpers. Must work in action
  // contexts (no ctx.db), so it resolves via an internal query.
  getUserInfo: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUserInfoInternal, {});
    return user ?? { userId: "", email: "" };
  },
  products: {
    // Env var may be unset; an empty product id simply never matches a Polar
    // subscription, so the plan falls back to Free.
    [PRO_PRODUCT_KEY]: process.env.POLAR_PRO_PRODUCT_ID ?? "",
  },
});

/**
 * Single source of truth for the caller's plan, readable from any context
 * (queries, mutations, actions, tools). Free fallback: unconfigured Polar,
 * no subscription, non-active status, or non-Pro product.
 */
export const getUserPlanInternal = internalQuery({
  args: { userId: v.id("users") },
  returns: v.union(v.literal("free"), v.literal("pro")),
  handler: async (ctx, args) => {
    if (!isBillingConfigured()) {
      return "free";
    }
    try {
      const subscription = await polar.getCurrentSubscription(ctx, {
        userId: args.userId,
      });
      if (!subscription || !ACTIVE_STATUSES.has(subscription.status)) {
        return "free";
      }
      return subscription.productKey === PRO_PRODUCT_KEY ? "pro" : "free";
    } catch {
      // A half-synced component state (e.g. product not yet synced) must
      // never wedge someone's quotas — degrade to Free.
      return "free";
    }
  },
});

const subscriptionStateValidator = v.object({
  plan: v.union(v.literal("free"), v.literal("pro")),
  /** Polar subscription status, "free" (no subscription), or "unconfigured". */
  status: v.string(),
  /** False when POLAR_* env vars are missing — the app runs in free mode. */
  configured: v.boolean(),
  /** ISO date of the next renewal for Pro subscribers, else null. */
  renewsAt: v.union(v.string(), v.null()),
  cancelAtPeriodEnd: v.boolean(),
});

/** Current plan state for the signed-in user (billing page + Sigma). */
export const getUserSubscription = query({
  args: {},
  returns: subscriptionStateValidator,
  handler: async (ctx) => {
    const userId = await requireViewer(ctx);
    const configured = isBillingConfigured();

    if (!configured) {
      return {
        plan: "free" as const,
        status: "unconfigured",
        configured: false,
        renewsAt: null,
        cancelAtPeriodEnd: false,
      };
    }

    const plan = await ctx.runQuery(internal.billing.getUserPlanInternal, {
      userId,
    });

    let currentPeriodEnd: string | null = null;
    let cancelAtPeriodEnd = false;
    let status = "free";
    if (plan === "pro") {
      const subscription = await polar.getCurrentSubscription(ctx, { userId });
      if (subscription) {
        status = subscription.status;
        currentPeriodEnd = subscription.currentPeriodEnd;
        cancelAtPeriodEnd = subscription.cancelAtPeriodEnd;
      }
    }

    return {
      plan,
      status,
      configured: true,
      renewsAt: plan === "pro" ? currentPeriodEnd : null,
      cancelAtPeriodEnd,
    };
  },
});

/**
 * Hosted Polar checkout URL for the Pro product. Runs as an action because
 * checkout creation performs network I/O; the client redirects via
 * `window.location.href`. Returns null when billing is not configured so the
 * UI can render a setup card instead of a broken paywall.
 */
export const getCheckoutUrl = action({
  args: { origin: v.string() },
  returns: v.union(v.object({ url: v.string() }), v.null()),
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUserInfoInternal, {});
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const productId = proProductId();
    if (!process.env.POLAR_ORGANIZATION_TOKEN?.trim() || !productId) {
      return null;
    }

    const checkout = await polar.createCheckoutSession(ctx, {
      productIds: [productId],
      userId: user.userId,
      email: user.email,
      origin: args.origin,
      successUrl: `${args.origin}/dashboard/billing?checkout=success`,
    });
    return { url: checkout.url };
  },
});

/**
 * Polar customer portal URL for managing/canceling the Pro subscription.
 * Returns null when billing is unconfigured or the user has no Polar
 * customer yet (e.g. subscribed before this integration existed).
 */
export const getPortalUrl = action({
  args: {},
  returns: v.union(v.object({ url: v.string() }), v.null()),
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUserInfoInternal, {});
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    if (!process.env.POLAR_ORGANIZATION_TOKEN?.trim()) {
      return null;
    }
    try {
      const { url } = await polar.createCustomerPortalSession(ctx, {
        userId: user.userId,
      });
      return { url };
    } catch (error) {
      console.error("Failed to create Polar portal session", error);
      return null;
    }
  },
});

/** Resolve the signed-in app user (better-auth identity → users row). */
async function requireViewer(ctx: unknown): Promise<GenericId<"users">> {
  const authUser = await authComponent.safeGetAuthUser(ctx as any);
  if (!authUser) {
    throw new ConvexError("Unauthorized");
  }
  const user = await (ctx as { db: any }).db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", authUser.email))
    .first();
  if (!user) {
    throw new ConvexError("Unauthorized");
  }
  return user._id as GenericId<"users">;
}
