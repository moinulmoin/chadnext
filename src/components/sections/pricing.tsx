import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PricingSection() {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <Reveal className="mb-14 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Simple, transparent pricing
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Two fixed tiers. Usage is metered for display — never billed.
        </p>
      </Reveal>

      <Reveal className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2 lg:gap-12">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Free</CardTitle>
            <CardDescription>
              Everything you need to try the full loop.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">
              $0
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">10 runs per day</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  20 Sigma messages per hour
                </span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  GitHub + email OTP auth
                </span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Mock mode — works with zero API keys
                </span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Community support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative flex flex-col border-primary">
          <div className="absolute -mr-3 -mt-3 right-0 top-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm">
            Popular
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Pro</CardTitle>
            <CardDescription>For power users running all day.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">
              $29
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">
                  Unlimited runs
                </span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  200 Sigma messages per hour
                </span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Token + cost metering on every run
                </span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  Priority email support
                </span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/login">Subscribe</Link>
            </Button>
          </CardFooter>
        </Card>
      </Reveal>

      <p className="mx-auto mt-8 max-w-4xl text-center text-xs text-muted-foreground">
        Payments are handled by Polar as merchant of record — VAT/sales tax
        included. Swap the plan copy in one config file.
      </p>
    </section>
  );
}
