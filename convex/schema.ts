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

  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    model: v.string(),
    tokenCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
      v.literal("tool"),
    ),
    content: v.string(),
    toolCalls: v.optional(v.array(v.any())),
    toolResults: v.optional(v.array(v.any())),
    tokens: v.number(),
    createdAt: v.number(),
  }).index("by_conversationId", ["conversationId"]),
});
