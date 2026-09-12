import { httpActionGeneric, httpRouter } from "convex/server";
import type { GenericId } from "convex/values";

import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";
import { polar } from "./billing";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

/**
 * Polar webhook secret guard. The Polar component would happily register its
 * route with a missing/example secret: signature verification then either
 * 500s on every event or — worse — validates against the placeholder string
 * any attacker can read in example.env. Fail loud instead: only register the
 * real handler with a real secret, otherwise answer 403 on all traffic.
 */
const WEBHOOK_SECRET_PLACEHOLDER = "your-polar-webhook-secret";

function polarWebhookSecretIsValid(): boolean {
  const secret = process.env.POLAR_WEBHOOK_SECRET?.trim();
  return Boolean(secret) && secret !== WEBHOOK_SECRET_PLACEHOLDER;
}

if (polarWebhookSecretIsValid()) {
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
          // The metadata value is a plain string; stamp it so the codegen'd
          // `v.id("users")` argument typechecks once codegen exists.
          userId: userId as GenericId<"users">,
          email: event.data.customer.email,
        });
      } catch (error) {
        console.error("[email] Subscription email failed", error);
      }
    },
  });
} else {
  console.error(
    "[billing] POLAR_WEBHOOK_SECRET is missing or still set to the example placeholder — " +
      "the /polar/events route is disabled and returns 403 for all traffic. " +
      "Set a real signing secret from the Polar dashboard to enable billing webhooks.",
  );
  http.route({
    path: "/polar/events",
    method: "POST",
    handler: httpActionGeneric(async () => {
      return new Response(
        JSON.stringify({
          error: "Polar webhook is not configured (missing signing secret).",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    }),
  });
}

export default http;
