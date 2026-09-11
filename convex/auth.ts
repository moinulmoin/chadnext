/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/any types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import { components } from "./_generated/api";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
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

export const authComponent = createClient<any>(components.betterAuth, {
  verbose: false,
});

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
          // Welcome email on first login/signup. Fires on the users-table row
          // the convex adapter creates, so `user.id` is the app userId.
          after: async (user: { id: string; name: string; email: string }) => {
            try {
              const actionCtx = requireActionCtx(ctx);
              await actionCtx.runMutation(internal.email.sendWelcomeEmail, {
                userId: user.id as any,
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
