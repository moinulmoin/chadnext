import { type SubscriptionPlan } from "~/types";

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "You can create up to 3 Projects. Upgrade to the PRO plan for unlimited projects.",
  stripePriceId: "",
};

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "Now you have unlimited projects!",
  stripePriceId: process.env.STRIPE_PRO_PLAN_ID as string,
};
