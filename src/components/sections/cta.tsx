import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="container py-24 sm:py-32">
      <div className="flex flex-col items-center gap-4 text-center bg-primary/5 rounded-3xl p-8 md:p-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-2xl">
          Ready to build your next big idea?
        </h2>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Join thousands of developers who are shipping faster with ChadNext. Get started today.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row mt-4">
          <Button size="lg" asChild>
            <Link href="/login">
              Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://github.com/moinulmoin/chadnext" target="_blank">
              View Documentation
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
