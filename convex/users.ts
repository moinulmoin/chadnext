/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/any types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import { ConvexError, type GenericId, v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Resolve the signed-in app user from the better-auth identity.
 * `ctx.userId` does not exist on Convex function contexts — the viewer is
 * resolved via the auth component + the app `users` row (kept in sync by
 * the triggers in convex/auth.ts).
 */
async function requireUserId(ctx: unknown): Promise<GenericId<"users">> {
  const authUser = await authComponent.safeGetAuthUser(ctx as any);
  if (!authUser) {
    throw new ConvexError("Unauthorized");
  }
  const user = await (ctx as { db: any }).db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", authUser.email))
    .first();
  if (!user) {
    throw new ConvexError("Unauthorized");
  }
  return user._id as GenericId<"users">;
}

/**
 * Resolve the signed-in app user from the better-auth identity.
 * Used by actions and scheduler contexts that carry no ctx.db-based
 * session lookup (e.g. run processing, Sigma continuations).
 */
export const getUserIdInternal = internalQuery({
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

/**
 * Resolve the signed-in user's id + email in one query. Works in action
 * contexts (no ctx.db) — used by the Polar component's checkout/portal
 * helpers, which need the customer email.
 */
export const getCurrentUserInfoInternal = internalQuery({
  args: {},
  returns: v.union(
    v.object({ userId: v.id("users"), email: v.string() }),
    v.null(),
  ),
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", authUser.email))
      .first();
    if (!user) {
      return null;
    }
    return { userId: user._id, email: user.email };
  },
});

export const getProfile = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("users"),
      name: v.string(),
      email: v.string(),
      picture: v.union(v.string(), v.null()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = requireUserId(ctx);
    const user = await ctx.db.get(userId);

    if (!user) {
      return null;
    }

    let pictureUrl: string | null = null;
    if (user.picture) {
      pictureUrl = await ctx.storage.getUrl(user.picture as GenericId<"_storage">);
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: pictureUrl,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    // null = remove the current picture (the settings page sends exactly this).
    picture: v.optional(v.union(v.id("_storage"), v.null())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    const updates: {
      name?: string;
      picture?: GenericId<"_storage"> | null;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined && args.name.trim()) {
      updates.name = args.name.trim();
    }

    if (args.picture !== undefined) {
      const user = await ctx.db.get(userId);
      if (user?.picture) {
        try {
          await ctx.storage.delete(user.picture as GenericId<"_storage">);
        } catch {
          // Storage might not exist, continue with update
        }
      }
      if (args.picture === null) {
        // Clear the field (patching undefined removes it).
        updates.picture = undefined;
      } else {
        updates.picture = args.picture;
      }
    }

    await ctx.db.patch(userId, updates);
    return null;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    // Uploads are a free resource — gate them behind auth.
    await requireUserId(ctx);
    // NOTE: `maxSizeBytes` needs a newer convex runtime than installed
    // (1.31.7 takes no options); size limiting lands with the upgrade.
    return await ctx.storage.generateUploadUrl();
  },
});
