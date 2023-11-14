import { type SubscriptionPlan } from "~/types";

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to 3 Projects. Upgrade to the PRO plan for unlimited projects.",
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan has unlimited projects.",
  stripePriceId: process.env.STRIPE_PRO_PLAN_ID || "",
};
