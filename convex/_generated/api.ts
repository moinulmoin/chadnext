import { anyApi } from "convex/server";

export const components = {
  agent: {} as any,
  betterAuth: {} as any,
  polar: {} as any,
  rateLimiter: {} as any,
  resend: {} as any,
};

export const api = anyApi;

// Loose stub for internal function references (internal.runs.x) — replaced by
// real codegen when `npx convex dev` runs.
export const internal = anyApi;
