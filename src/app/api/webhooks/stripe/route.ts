import { type NextRequest } from "next/server";
import { buffer } from "node:stream/consumers";
import type Stripe from "stripe";
import { prisma } from "~/lib/server/db";
import { stripe } from "~/lib/server/payment";

export async function POST(req: NextRequest) {
  //@ts-expect-error Argument of type 'ReadableStream<any>' is not assignable to parameter of type 'ReadableStream | Readable | AsyncIterable<any>'
  const body = await buffer(req.body);
  const headers = req.headers;
  const signature = headers.get("Stripe-Signature") as string;

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

  const eventData = event?.data.object as
    | Stripe.Checkout.Session
    | Stripe.Invoice;

  if (
    event?.type === "checkout.session.completed" ||
    event?.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = eventData as Stripe.Checkout.Session;
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.
    try {
      await prisma.user.update({
        where: {
          id: session?.metadata?.userId,
        },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.items.data[0].current_period_end! * 1000
          ),
        },
      });
    } catch (error) {
      console.error(error);
    }
  } else if (event?.type === "invoice.payment_succeeded") {
    const invoice = eventData as Stripe.Invoice;

    const subscriptionId = invoice.parent?.subscription_details?.subscription;

    // Retrieve the subscription details from Stripe.
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId as string
    );

    // Update the price id and set the new period end.
    try {
      await prisma.user.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.items.data[0].current_period_end! * 1000
          ),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  return new Response(null, { status: 200 });
}
