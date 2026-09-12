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
    "Runs run in mock mode — no AI keys needed",
    "Email support",
    "Community access",
  ],
} as const

export const proPlan = {
  id: "pro",
  name: "Pro",
  description: "For power users running all day",
  price: 29,
  currency: "USD",
  interval: "month" as const,
  maxRunsPerDay: Infinity,
  sigmaMessagesPerHour: 200,
  features: [
    "Unlimited runs per day (Free: 10)",
    "200 Sigma messages per hour (Free: 20)",
    "Priority email support",
    "Community access",
  ],
} as const

export const subscriptionPlans = {
  free: freePlan,
  pro: proPlan,
} as const

export type Plan = typeof freePlan | typeof proPlan
export type PlanId = "free" | "pro"
