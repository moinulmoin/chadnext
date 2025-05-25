import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { createMiddleware } from "next-safe-action";
import { headers } from "next/headers";
import { cache } from "react";
import { prisma } from "~/lib/server/db";
import { sendOTP } from "~/lib/server/mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "chadnext",
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          await sendOTP({
            toMail: email,
            code: otp,
          });
        }
      },
    }),
    nextCookies(),
  ],
});

export const authMiddleware = createMiddleware().define(async ({ next }) => {
  const result = await auth.api.getSession({
    headers: await headers(),
  });
  if (!result?.session) {
    throw new Error("Unauthorized");
  }
  return next({
    ctx: { userId: result.user.id, sessionId: result.session.id },
  });
});

export const getCurrentSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  })
);
