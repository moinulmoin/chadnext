/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/any types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import { components } from "./_generated/api";
import {
  createClient,
  type AuthFunctions,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import authConfig from "./auth.config";

const siteUrl =
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * App-side mirror of the component's `user` table. Without the triggers +
 * authFunctions wiring below the app `users` table is never populated and
 * every viewer resolver (by_email lookup) would fail. `authFunctions` MUST
 * point at this module's own `triggersApi()` exports (`internal.auth`) or
 * the triggers never fire.
 */
const authFunctions: AuthFunctions = internal.auth;

type ComponentUser = {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
};

/** Upsert the app `users` row from a component user doc (idempotent). */
async function upsertAppUser(db: any, user: ComponentUser): Promise<void> {
  const now = Date.now();
  const existing = await db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", user.email))
    .first();
  // The component stores `image: null` for "no picture"; the app schema is
  // `v.optional(v.string())`, so null becomes undefined (field absent).
  const picture = user.image ?? undefined;
  if (existing) {
    await db.patch(existing._id, {
      name: user.name ?? existing.name,
      emailVerified: user.emailVerified ?? existing.emailVerified,
      picture,
      updatedAt: now,
    });
    return;
  }
  await db.insert("users", {
    name: user.name ?? "",
    email: user.email,
    emailVerified: user.emailVerified ?? false,
    picture,
    createdAt: now,
    updatedAt: now,
  });
}

export const authComponent = createClient<any>(components.betterAuth, {
  verbose: false,
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, user) => {
        await upsertAppUser(ctx.db, user as ComponentUser);
      },
      onUpdate: async (ctx, user) => {
        await upsertAppUser(ctx.db, user as ComponentUser);
      },
    },
  },
});

// Expose the trigger executors as internal functions — the component invokes
// them (via `authFunctions`) whenever its own user rows change.
export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const createAuthOptions = (ctx: GenericCtx<any>) => {
  return {
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    secret: process.env.BETTER_AUTH_SECRET,
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },
    databaseHooks: {
      user: {
        create: {
          // Welcome email on first login/signup. Fires with the component's
          // user doc; the email senders take name/email directly (the
          // component user id is NOT an app `users` id, so it is never
          // passed as one).
          after: async (user: { id: string; name: string; email: string }) => {
            try {
              const actionCtx = requireActionCtx(ctx);
              await actionCtx.runMutation(internal.email.sendWelcomeEmail, {
                name: user.name ?? "",
                email: user.email,
              });
            } catch (error) {
              // A failed welcome email must never fail the signup itself.
              console.error("[email] Welcome email failed", error);
            }
          },
        },
      },
    },
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          // Auth requests run in an action context; the email module enqueues
          // the send durably from there (skips silently without a key).
          const actionCtx = requireActionCtx(ctx);
          await actionCtx.runMutation(internal.email.sendOtpEmail, {
            email,
            code: otp,
            type,
          });
        },
      }),
      convex({ authConfig }),
    ],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<any>) => {
  return betterAuth(createAuthOptions(ctx));
};

export const getCurrentUserId = query({
  args: {},
  returns: v.union(v.id("users"), v.null()),
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", authUser.email))
      .first();

    return user?._id ?? null;
  },
});
