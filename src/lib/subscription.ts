/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { freePlan, proPlan } from "~/config/subscription";
import { type UserSubscriptionPlan } from "~/types";
import db from "./db";

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await db.user.findFirst({
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
