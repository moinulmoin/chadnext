import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/lib/server/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  emailVerification: {
    enabled: true,
    expiresIn: 60 * 3, // 3 minutes, same as current implementation
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days, same as current implementation
  },
});
