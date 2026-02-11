import { components } from "./_generated/api";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Create the component client
export const authComponent = createClient<DataModel>(components.betterAuth, {
  verbose: false,
});

// Configure Better Auth options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => ({
  baseURL: siteUrl,
  trustedOrigins: [siteUrl],
  database: authComponent.adapter(ctx),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    crossDomain({ siteUrl }),
    convex({ authConfig }),
  ],
}) satisfies BetterAuthOptions;

// Export the createAuth function
export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));
