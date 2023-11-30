import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import { buffer } from "node:stream/consumers";
import type Stripe from "stripe";
import db from "~/lib/db";
import { stripe } from "~/lib/stripe";

export async function POST(req: NextRequest) {
  //@ts-expect-error Argument of type 'ReadableStream<any>' is not assignable to parameter of type 'ReadableStream | Readable | AsyncIterable<any>'
  const body = await buffer(req.body);
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event | undefined = undefined;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
  }

  const session = event?.data.object as Stripe.Checkout.Session;

  if (event?.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    await db.user.update({
      where: {
        id: session?.metadata?.userId,
      },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event?.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the price id and set the new period end.
    await db.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new Response(null, { status: 200 });
}
