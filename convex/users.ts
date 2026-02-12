import { ConvexError, type GenericId, v } from "convex/values";

import { mutation, query } from "./_generated/server";

function requireUserId(ctx: unknown): GenericId<"users"> {
  const userId = (ctx as { userId?: GenericId<"users"> }).userId;
  if (!userId) {
    throw new ConvexError("Unauthorized");
  }
  return userId;
}

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
    picture: v.optional(v.id("_storage")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);

    const updates: {
      name?: string;
      picture?: GenericId<"_storage"> | undefined;
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
        } catch (e) {
          // Storage might not exist, continue with update
        }
      }
      updates.picture = args.picture;
    } else if (args.picture === null && !args.name) {
      updates.picture = undefined;
    }

    await ctx.db.patch(userId, updates);
    return null;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
