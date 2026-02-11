import { betterAuth } from "better-auth";
import { convexAdapter } from "@convex-dev/better-auth";

export const auth = betterAuth({
  database: convexAdapter(),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
  },

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
});

export type Session = typeof auth.$Infer.Session;
