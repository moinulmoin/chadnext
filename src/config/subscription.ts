export const freePlan = {
  id: "free",
  name: "Free",
  description: "Perfect for getting started",
  price: 0,
  currency: "USD",
  interval: "month" as const,
  maxRunsPerDay: 10,
  // Mirror of convex/rateLimiter.ts SIGMA_CHAT_LIMITS (Convex can't import
  // from src/; keep the two in sync).
  sigmaMessagesPerHour: 20,
  features: [
    "10 runs per day",
    "20 Sigma messages per hour",
    "Mock mode — works with zero API keys",
    "Email support",
    "Community access",
  ],
} as const

export const proPlan = {
  id: "pro",
  name: "Pro",
  description: "For power users and teams",
  price: 29,
  currency: "USD",
  interval: "month" as const,
  maxRunsPerDay: Infinity,
  sigmaMessagesPerHour: 200,
  features: [
    "Unlimited runs",
    "200 Sigma messages per hour",
    "Advanced AI copilot (unlimited)",
    "Priority email support",
    "Community access",
    "Advanced analytics",
    "Custom domains",
  ],
} as const

export const subscriptionPlans = {
  free: freePlan,
  pro: proPlan,
} as const

export type Plan = typeof freePlan | typeof proPlan
export type PlanId = "free" | "pro"
