import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { ArrowRight, Github } from "lucide-react";

export function CTASection() {
  return (
    <section className="container py-24 sm:py-32">
      <Reveal className="flex flex-col items-center gap-4 rounded-3xl bg-primary/5 p-8 text-center md:p-16">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to ship your agent-native SaaS?
        </h2>
        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Fork the chassis, swap the noun, and ship this weekend. Free &amp;
          open source under MIT.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/docs">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link
              href="https://github.com/moinulmoin/chadnext"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
