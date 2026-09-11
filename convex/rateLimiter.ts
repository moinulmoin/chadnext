/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/any types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import { HOUR, MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { ConvexError, type GenericId, v } from "convex/values";

import { components, internal } from "./_generated/api";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const limiter = new RateLimiter(components.rateLimiter, {
  chatMessagesPerMinute: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 20,
  },
  // Sigma assistant messages, branched by plan at send time (the rate
  // limiter's TS types don't allow per-call config overrides for named
  // limits, so each plan gets its own named bucket):
  // Free: 20/hour, Pro: 200/hour.
  sigmaChatFree: {
    kind: "token bucket",
    rate: 20,
    period: HOUR,
    capacity: 20,
  },
  sigmaChatPro: {
    kind: "token bucket",
    rate: 200,
    period: HOUR,
    capacity: 200,
  },
});

export const SIGMA_CHAT_LIMITS = {
  free: 20,
  pro: 200,
} as const;

export const SIGMA_CHAT_WINDOW_MS = HOUR;

/** The named rate-limit bucket for the caller's plan. */
export function sigmaChatLimitName(plan: "free" | "pro") {
  return plan === "pro" ? "sigmaChatPro" : "sigmaChatFree";
}

/**
 * Sigma messages used this hour vs the caller's plan limit — powers the
 * usage meter on the billing page (cheap: one plan read + one getValue).
 */
export const getSigmaChatUsage = query({
  args: {},
  returns: v.object({
    used: v.number(),
    limit: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await requireViewer(ctx);
    const plan: "free" | "pro" = await ctx.runQuery(
      internal.billing.getUserPlanInternal,
      { userId },
    );
    const limit = SIGMA_CHAT_LIMITS[plan];
    const status = await limiter.getValue(
      ctx,
      sigmaChatLimitName(plan),
      { key: userId },
    );
    // Token-bucket refills are fractional; report whole messages consumed.
    const used = Math.min(limit, Math.max(0, Math.ceil(limit - status.value)));
    return {
      used,
      limit,
    };
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
