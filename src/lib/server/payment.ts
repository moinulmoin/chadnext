import Stripe from "stripe";
import { freePlan, proPlan } from "~/config/subscription";
import { prisma } from "~/lib/server/db";
import { type UserSubscriptionPlan } from "~/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if user is on a pro plan.
  const isPro = Boolean(
    user.stripePriceId &&
      user.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()
  );

  const plan = isPro ? proPlan : freePlan;

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime()!,
    isPro,
    stripePriceId: user.stripePriceId || "",
  };
}
