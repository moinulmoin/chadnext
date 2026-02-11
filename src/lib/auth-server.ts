import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { headers } from "next/headers";

const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ??
  process.env.CONVEX_URL ??
  "https://placeholder.convex.cloud";

function resolveConvexSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_CONVEX_SITE_URL ?? process.env.CONVEX_SITE_URL;
  if (configured) {
    return configured;
  }

  return convexUrl.replace(".convex.cloud", ".convex.site");
}

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl,
  convexSiteUrl: resolveConvexSiteUrl(),
});

export async function getServerSession() {
  const requestHeaders = await headers();
  const response = await fetch(`${appUrl}/api/auth/get-session`, {
    headers: requestHeaders,
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    user?: unknown;
    session?: unknown;
  } | null;

  if (!payload?.session) {
    return null;
  }

  return payload;
}
