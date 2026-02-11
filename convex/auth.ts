import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";
import { v } from "convex/values";

import { query } from "./_generated/server";

export const authConfig = {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;

export const getCurrentUserId = query({
  args: {},
  returns: v.union(v.id("users"), v.null()),
  handler: async () => {
    return null;
  },
});
