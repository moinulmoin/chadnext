export const freePlan = {
  id: "free",
  name: "Free",
  description: "Perfect for getting started",
  price: 0,
  currency: "USD",
  interval: "month" as const,
  maxProjects: 3,
  features: [
    "3 projects",
    "Basic AI copilot (10 requests/day)",
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
  maxProjects: Infinity,
  features: [
    "Unlimited projects",
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
