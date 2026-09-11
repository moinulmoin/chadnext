import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";
import { polar } from "./billing";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Polar webhooks at /polar/events. Signature-verified against
// POLAR_WEBHOOK_SECRET; the component persists subscription/product state
// itself, so plan gating just reads via billing.getUserPlanInternal.
// onSubscriptionCreated is the app-side seam: the component has no
// subscription-lifecycle hook of its own, but it invokes these callbacks
// right after persisting each webhook event (httpAction ctx → runMutation
// works). New subscriptions may start as "trialing" or "active".
polar.registerRoutes(http, {
  onSubscriptionCreated: async (ctx, event) => {
    const status = event.data.status;
    if (status !== "active" && status !== "trialing") {
      return;
    }
    // createCheckoutSession stamps our app userId onto the Polar customer
    // metadata; events from before that existed have no userId and are skipped.
    const userId = (
      event.data.customer.metadata as Record<string, string> | null
    )?.userId;
    if (!userId) {
      return;
    }
    try {
      await ctx.runMutation(internal.email.sendSubscriptionEmail, {
        userId,
        email: event.data.customer.email,
      });
    } catch (error) {
      console.error("[email] Subscription email failed", error);
    }
  },
});

export default http;
