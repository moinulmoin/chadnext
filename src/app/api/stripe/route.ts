// /api/stripe

import { getServerSession } from "next-auth";
import { z } from "zod";
import { proPlan } from "~/config/subscription";
import { authOptions } from "~/lib/auth";
import { stripe } from "~/lib/stripe";
import { getUserSubscriptionPlan } from "~/lib/subscription";

const billingUrl = process.env.NEXT_PUBLIC_APP_URL + "/dashboard/billing";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session?.user.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      });

      return Response.json({ url: stripeSession.url });
    }

    // The user is on the free plan.
    // Create a checkout session to upgrade.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email,
      line_items: [
        {
          price: proPlan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    });

    return new Response(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
