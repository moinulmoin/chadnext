import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const listByUser = query({
  args: { userId: v.id("users") },
  returns: v.array(
    v.object({
      _id: v.id("projects"),
      _creationTime: v.number(),
      userId: v.id("users"),
      name: v.string(),
      description: v.optional(v.string()),
      status: v.union(v.literal("active"), v.literal("archived")),
      domain: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  ),
  handler: async () => {
    return [];
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    domain: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});

export const archive = mutation({
  args: {
    projectId: v.id("projects"),
  },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});
