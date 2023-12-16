import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { getPageSession } from "~/lib/auth";
import { getUserSubscriptionPlan } from "~/lib/subscription";
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

export default async function Pricing() {
  const session = await getPageSession();

  const subscription = session
    ? await getUserSubscriptionPlan(session?.user.userId)
    : null;
  return (
    <section>
      <div className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-4xl md:text-6xl">Pricing</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            <Balancer>
              Choose the plan that’s right for you and start enjoying it all.
            </Balancer>
          </p>
        </div>
        <div className="flex flex-col justify-center gap-8 md:flex-row">
          <Card
            className={cn(
              "relative w-full transition duration-200 ease-in-out hover:shadow-lg xl:w-[300px]"
            )}
          >
            <CardHeader>
              <CardTitle>
                Free Plan{" "}
                {subscription && !subscription?.isPro && (
                  <Badge className=" absolute right-0 top-0 m-4">Current</Badge>
                )}
              </CardTitle>
              <CardDescription>Up to 3 projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="my-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-primary">
                  $0
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                  /month
                </span>
              </p>
            </CardContent>
            <CardFooter className=" justify-center">
              {!subscription ? (
                <Link href="/dashboard/billing" className={buttonVariants()}>
                  Get Started
                </Link>
              ) : (
                ""
              )}
            </CardFooter>
          </Card>
          <Card
            className={cn(
              "relative w-full transition duration-200 ease-in-out hover:shadow-lg xl:w-[300px]",
              !subscription?.isPro && "bg-secondary"
            )}
          >
            <CardHeader>
              <CardTitle>
                Pro Plan{" "}
                {subscription && subscription?.isPro && (
                  <Badge className=" absolute right-0 top-0 m-4">Current</Badge>
                )}
              </CardTitle>
              <CardDescription>Unlimited projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="my-6 flex items-baseline justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-primary">
                  $10
                </span>
                <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                  /month
                </span>
              </p>
            </CardContent>
            <CardFooter className=" justify-center">
              <Link href="/dashboard/billing" className={buttonVariants()}>
                {!subscription
                  ? "Get Started"
                  : subscription?.isPro
                    ? "Manage Plan"
                    : "Upgrade Plan"}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
