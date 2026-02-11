import { components } from "./_generated/api";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";
import { query } from "./_generated/server";
import { v } from "convex/values";
import authConfig from "./auth.config";
import { resend } from "./email";

const siteUrl =
  process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const resendFrom = process.env.RESEND_FROM_EMAIL ?? "ChadNext <onboarding@resend.dev>";

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
    plugins: [
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          await resend.sendEmail(requireActionCtx(ctx), {
            from: resendFrom,
            to: email,
            subject: `Your ${type} code for ChadNext`,
            text: `Your ${type} code is ${otp}. If you did not request this code, you can ignore this email.`,
            html: `<p>Your <strong>${type}</strong> code is <strong>${otp}</strong>.</p><p>If you did not request this code, you can ignore this email.</p>`,
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
