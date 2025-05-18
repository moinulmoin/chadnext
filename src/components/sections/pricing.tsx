import { Check } from "lucide-react";
import Link from "next/link";
import { getCurrentSession } from "~/lib/server/auth/session";
import { getUserSubscriptionPlan } from "~/lib/server/payment";
import { cn } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  title: string;
  description: string;
  price: number;
  isPro: boolean;
  features: PlanFeature[];
}

const plans: Plan[] = [
  {
    title: "Free Plan",
    description: "Get started with the basics",
    price: 0,
    isPro: false,
    features: [
      { text: "Up to 3 projects", included: true },
      { text: "Basic analytics", included: true },
      { text: "Community support", included: true },
      { text: "Custom domains", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    title: "Pro Plan",
    description: "Unlock powerful features",
    price: 10,
    isPro: true,
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Community support", included: true },
      { text: "Custom domains", included: true },
      { text: "Priority email support", included: true },
    ],
  },
];

export default async function Pricing() {
  const { user } = await getCurrentSession();
  const subscription = user ? await getUserSubscriptionPlan(user.id) : null;

  return (
    <section>
      <div className="container space-y-8 py-12 md:py-16 lg:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-4xl font-bold md:text-5xl">
            Pricing
          </h2>
          <p className="max-w-md text-balance leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Choose the plan that’s right for you and start building.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:mx-auto lg:max-w-4xl">
          {plans.map((plan) => {
            const isCurrentPlan = subscription
              ? plan.isPro === subscription.isPro
              : false;

            return (
              <Card
                key={plan.title}
                className={cn(
                  "relative flex flex-col transition duration-200 ease-in-out",
                  {
                    "border-2 border-primary shadow-lg": plan.isPro,
                    border: !plan.isPro,
                  }
                )}
              >
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  {isCurrentPlan && (
                    <Badge variant="outline" className="absolute right-4 top-4">
                      Current Plan
                    </Badge>
                  )}
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-6 mt-2 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-primary">
                      ${plan.price}
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                      /month
                    </span>
                  </p>
                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check
                          className={cn(
                            "h-5 w-5",
                            feature.included
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn({
                            "text-muted-foreground line-through":
                              !feature.included,
                          })}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="justify-center pt-6">
                  {plan.isPro ? (
                    <Link
                      href={user ? "/dashboard/billing" : "/login"}
                      className={cn(buttonVariants({ size: "lg" }), "w-full")}
                    >
                      {user
                        ? subscription?.isPro
                          ? "Manage Plan"
                          : "Upgrade to Pro"
                        : "Get Started"}
                    </Link>
                  ) : (
                    (!user || !subscription) && (
                      <Link
                        href="/login"
                        className={cn(
                          buttonVariants({ variant: "outline", size: "lg" }),
                          "w-full"
                        )}
                      >
                        Get Started
                      </Link>
                    )
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
