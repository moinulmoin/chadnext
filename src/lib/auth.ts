import { prisma } from "@lucia-auth/adapter-prisma";
import { github } from "@lucia-auth/oauth/providers";
import { lucia, type User } from "lucia";
import { nextjs_future } from "lucia/middleware";
import "lucia/polyfill/node";
import * as context from "next/headers";
import { cache } from "react";
import { defineAbilityFor } from "./casl";
import db from "./db";

export const auth = lucia({
  adapter: prisma(db),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: (user) => {
    return {
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };
  },
});

export const githubAuth = github(auth, {
  clientId: process.env.GITHUB_CLIENT_ID ?? "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
});

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate();
});

export type Auth = typeof auth;

export const getAbility = async () => {
  const session = await getPageSession();
  const user = session?.user as User;
  return defineAbilityFor(user);
};
