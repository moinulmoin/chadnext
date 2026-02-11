import agent from "@convex-dev/agent/convex.config";
import betterAuth from "@convex-dev/better-auth/convex.config";
import polar from "@convex-dev/polar/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();

app.use(agent);
app.use(betterAuth);
app.use(polar);
app.use(rateLimiter);
app.use(resend);

export default app;
