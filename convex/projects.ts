import { ConvexError, type GenericId, v } from "convex/values";

import { mutation, query } from "./_generated/server";

const projectValidator = v.object({
  _id: v.id("projects"),
  _creationTime: v.number(),
  userId: v.id("users"),
  name: v.string(),
  description: v.optional(v.string()),
  status: v.union(v.literal("active"), v.literal("archived")),
  domain: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

const FREE_PLAN_PROJECT_LIMIT = 3;

function requireUserId(ctx: unknown): GenericId<"users"> {
  const userId = (ctx as { userId?: GenericId<"users"> }).userId;
  if (!userId) {
    throw new ConvexError("Unauthorized");
  }
  return userId;
}

export const list = query({
  args: {},
  returns: v.array(projectValidator),
  handler: async (ctx) => {
    const userId = requireUserId(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { projectId: v.id("projects") },
  returns: v.union(projectValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project || project.userId !== userId) {
      return null;
    }

    return project;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    domain: v.optional(v.string()),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const existingProjects = await ctx.db
      .query("projects")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .collect();

    if (existingProjects.length >= FREE_PLAN_PROJECT_LIMIT) {
      throw new ConvexError(
        "Free plan limited to 3 projects. Upgrade to Pro for unlimited.",
      );
    }

    const now = Date.now();
    return await ctx.db.insert("projects", {
      userId,
      name: args.name.trim(),
      description: args.description?.trim(),
      domain: args.domain?.trim(),
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    domain: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project || project.userId !== userId) {
      throw new ConvexError("Project not found");
    }

    const updates = {
      ...(args.name !== undefined ? { name: args.name.trim() } : {}),
      ...(args.description !== undefined
        ? { description: args.description.trim() }
        : {}),
      ...(args.domain !== undefined ? { domain: args.domain.trim() } : {}),
      ...(args.status !== undefined ? { status: args.status } : {}),
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.projectId, updates);
    return null;
  },
});

export const remove = mutation({
  args: { projectId: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const project = await ctx.db.get(args.projectId);

    if (!project || project.userId !== userId) {
      throw new ConvexError("Project not found");
    }

    await ctx.db.delete(args.projectId);
    return null;
  },
});
