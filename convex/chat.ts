import { v } from "convex/values";

import { action, mutation, query } from "./_generated/server";

export const listConversations = query({
  args: { userId: v.id("users") },
  returns: v.array(
    v.object({
      _id: v.id("conversations"),
      _creationTime: v.number(),
      userId: v.id("users"),
      title: v.string(),
      model: v.string(),
      tokenCount: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
  ),
  handler: async () => {
    return [];
  },
});

export const createConversation = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    model: v.string(),
  },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});

export const sendMessage = action({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});
