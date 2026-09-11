import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./auth";
import { polar } from "./billing";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Polar webhooks at /polar/events. Signature-verified against
// POLAR_WEBHOOK_SECRET; the component persists subscription/product state
// itself, so plan gating just reads via billing.getUserPlanInternal.
polar.registerRoutes(http);

export default http;
