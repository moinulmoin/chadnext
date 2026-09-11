import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Simple, transparent pricing
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Choose the plan that&apos;s right for you. No hidden fees.
        </p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Free Tier</CardTitle>
            <CardDescription>Perfect for hobby projects and testing.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">10 runs/day</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">20 AI messages/hour</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">GitHub + Email auth</span>
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
        
        <Card className="flex flex-col border-primary relative">
          <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Popular
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Pro Tier</CardTitle>
            <CardDescription>For serious developers and startups.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground font-medium">Unlimited runs</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">200 AI messages/hour</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Priority support</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Early access to features</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/login">Subscribe</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
