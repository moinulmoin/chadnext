import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    picture: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  runs: defineTable({
    userId: v.id("users"),
    instruction: v.string(),
    status: v.union(
      v.literal("queued"),
      v.literal("running"),
      v.literal("succeeded"),
      v.literal("failed"),
    ),
    output: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    tokensUsed: v.number(),
    costCents: v.number(),
    model: v.string(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_status", ["userId", "status"]),

  // Confirm Gate records for Sigma's gated tools. A gated write is only
  // executed when a matching record here is "approved" by the owning user;
  // denial leaves zero data side-effects (only this record + chat messages).
  approvals: defineTable({
    userId: v.id("users"),
    threadId: v.string(),
    toolCallId: v.string(),
    toolName: v.string(),
    args: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("denied"),
    ),
    createdAt: v.number(),
    decidedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_thread", ["threadId"])
    .index("by_toolCallId", ["toolCallId"]),

  // "What Sigma knows" — simple per-user facts (name/preferences style).
  sigmaMemories: defineTable({
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
