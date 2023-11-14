import { AlertTriangleIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { BillingForm } from "~/components/billing-form";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { stripe } from "~/lib/stripe";
import { getUserSubscriptionPlan } from "~/lib/subscription";
import { getUser } from "~/server/user";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Billing() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false;
  if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      subscriptionPlan.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }
  return (
    <div className="flex flex-col gap-8">
      <Alert>
        <AlertTriangleIcon className="h-6 w-6" />
        <AlertTitle>This is a template.</AlertTitle>
        <AlertDescription>
          ChadNext is a template using Stripe to show the implementation. You
          can find a list of test card numbers on the{" "}
          <a
            href="https://stripe.com/docs/testing#cards"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Stripe docs
          </a>
          .
        </AlertDescription>
      </Alert>
      <BillingForm
        subscriptionPlan={{
          ...subscriptionPlan,
          isCanceled,
        }}
      />
    </div>
  );
}
