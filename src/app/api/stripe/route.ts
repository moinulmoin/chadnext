import { type NextRequest } from "next/server";
import { z } from "zod";
import { siteConfig } from "~/config/site";
import { proPlan } from "~/config/subscription";
import { stripe } from "~/lib/stripe";
import { getUserSubscriptionPlan } from "~/lib/subscription";
import { validateRequest } from "~/server/auth";

export async function GET(req: NextRequest) {
  const locale = req.cookies.get("Next-Locale")?.value || "en";

  const billingUrl = siteConfig(locale).url + "/dashboard/billing/";
  try {
    const { user, session } = await validateRequest();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id);

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
      customer_email: user.email,
      line_items: [
        {
          price: proPlan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
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
