import { Polar } from "@convex-dev/polar";
import { v } from "convex/values";

import { components } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

export const polar = new Polar(components.polar, {
  getUserInfo: async () => ({
    userId: "",
    email: "",
  }),
  products: {},
});

export const getSubscription = query({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});

export const createCheckout = action({
  args: { userId: v.id("users"), productId: v.string() },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});

export const syncPolarProducts = mutation({
  args: {},
  returns: v.null(),
  handler: async () => {
    return null;
  },
});
