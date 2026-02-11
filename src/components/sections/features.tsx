import { 
  Bot, 
  Database, 
  Lock, 
  CreditCard, 
  Palette, 
  Rocket 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "AI Copilot",
    description: "Built-in AI capabilities powered by Vercel AI SDK and your choice of LLM provider.",
    icon: Bot,
  },
  {
    title: "Convex Real-time",
    description: "Backend-as-a-Service with real-time updates, scheduling, and storage out of the box.",
    icon: Database,
  },
  {
    title: "Better Auth",
    description: "Secure authentication with support for GitHub, Google, and email magic links.",
    icon: Lock,
  },
  {
    title: "Polar Billing",
    description: "Monetize your SaaS with Polar.sh. Handle subscriptions and one-time payments easily.",
    icon: CreditCard,
  },
  {
    title: "Shadcn UI",
    description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
    icon: Palette,
  },
  {
    title: "Vercel Deploy",
    description: "Seamless deployment to Vercel with zero configuration required.",
    icon: Rocket,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <div className="flex flex-col items-center gap-4 text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Everything you need to ship
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Focus on building your product, not the infrastructure. ChadNext handles the boring stuff so you can move fast.
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="bg-background border-border">
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
