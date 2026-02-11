import { MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { v } from "convex/values";

import { components } from "./_generated/api";
import { mutation, query } from "./_generated/server";

export const limiter = new RateLimiter(components.rateLimiter, {
  chatMessagesPerMinute: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 20,
  },
});

export const getLimitStatus = query({
  args: { key: v.string() },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});

export const consumeLimit = mutation({
  args: { key: v.string() },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});
