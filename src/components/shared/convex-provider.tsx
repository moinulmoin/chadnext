"use client";

import type { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

import { env } from "@/lib/env";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
  env.NEXT_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud",
);

/**
 * Convex wired to better-auth: the provider fetches short-lived tokens from
 * better-auth's /convex/token endpoint via `authClient` and hands them to the
 * Convex client, so `ctx.auth` is populated for every Convex call. A bare
 * ConvexProvider here means every authed query/mutation throws
 * "Unauthorized".
 */
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  );
}
