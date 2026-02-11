import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container flex flex-col items-center justify-center gap-8 py-24 text-center md:py-32">
      <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
        <span className="text-muted-foreground">New: AI Copilot is now live</span>
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
        Build your AI SaaS <span className="text-primary">faster</span> than ever before
      </h1>
      
      <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
        ChadNext is the ultimate starter template for building AI-powered applications. 
        Packed with Convex, Better Auth, Polar, and Shadcn UI.
      </p>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/login">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="https://github.com/moinulmoin/chadnext" target="_blank">
            View on GitHub
          </Link>
        </Button>
      </div>

      <div className="relative mt-16 w-full max-w-5xl overflow-hidden rounded-xl border bg-background shadow-xl sm:mt-24">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50"></div>
        <div className="aspect-video w-full bg-muted/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Sparkles className="h-12 w-12" />
                <p>AI Copilot Dashboard Mockup</p>
            </div>
        </div>
      </div>
    </section>
  );
}
