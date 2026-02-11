import { Resend } from "@convex-dev/resend";
import { v } from "convex/values";

import { components } from "./_generated/api";
import { action } from "./_generated/server";

export const resend = new Resend(components.resend, {
  testMode: true,
});

export const sendProjectNotification = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
  },
  returns: v.null(),
  handler: async () => {
    return null;
  },
});
