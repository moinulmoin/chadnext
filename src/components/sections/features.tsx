import { Bot, CreditCard, Database, FileCode2, Rocket, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/shared/reveal";
import type { ComponentType, ReactNode } from "react";

function FeatureCard({
  icon: Icon,
  title,
  description,
  children,
  className = "",
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`relative h-full overflow-hidden bg-card transition-colors hover:border-primary/40 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg border bg-primary/5">
          <Icon className="size-4.5 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <Reveal className="mb-14 flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          The two loops every AI app needs. Pre-built.
        </h2>
        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Jobs that do work, and an agent that acts safely. ChadNext ships
          both — wired into one chassis you can fork.
        </p>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-6">
        {/* Sigma — large card */}
        <Reveal className="lg:col-span-4 lg:row-span-2">
          <FeatureCard
            icon={Bot}
            title="Sigma, the in-app assistant"
            description="Seven tools scoped to the signed-in user. Reads answer instantly from live Convex data; every write pauses at the Confirm Gate — nothing changes until someone clicks Approve, and denial leaves no trace. With memory and generative UI, answers render as live cards, not prose."
            className="h-full"
          >
            {/* Confirm Gate mock */}
            <div className="mt-auto rounded-lg border border-amber-500/40 bg-amber-500/5 p-3">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-amber-500 motion-safe:animate-pulse" />
                  Sigma wants to create a run
                </span>
                <span className="rounded border px-1.5 py-0.5 font-mono text-[10px] font-normal text-muted-foreground">
                  createRun
                </span>
                <span className="ml-auto inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 motion-safe:animate-pulse dark:text-amber-400">
                  awaiting approval
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
              {["⌘K to ask", "What Sigma knows panel", "server-enforced gate"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border bg-background px-2 py-0.5 font-mono text-[10px]"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </FeatureCard>
        </Reveal>

        {/* Runs loop */}
        <Reveal className="lg:col-span-2" delayMs={80}>
          <FeatureCard
            icon={Zap}
            title="The Runs loop"
            description="Submit an instruction, get a kept artifact. Each run streams queued → running → succeeded, metered in tokens and cents. Free: 10 runs/day. Pro: unlimited."
          />
        </Reveal>

        {/* Agent-native repo */}
        <Reveal className="lg:col-span-2" delayMs={160}>
          <FeatureCard
            icon={FileCode2}
            title="Built by your agent"
            description="AGENTS.md is the canonical brief for Claude Code, Cursor, and Codex — including a Swap-the-Noun recipe that retools the demo for your domain in one session."
          />
        </Reveal>

        {/* Auth + billing */}
        <Reveal className="lg:col-span-2" delayMs={80}>
          <FeatureCard
            icon={CreditCard}
            title="Auth + billing, done"
            description="better-auth with GitHub and email OTP. Polar as merchant of record — VAT and sales tax handled. Fixed Free/Pro tiers, enforced server-side."
          />
        </Reveal>

        {/* Convex backend */}
        <Reveal className="lg:col-span-2" delayMs={160}>
          <FeatureCard
            icon={Database}
            title="Reactive Convex backend"
            description="Typed queries with per-user ownership checks on every record. Status changes stream to the UI live — no polling, nothing to babysit."
          />
        </Reveal>

        {/* DX */}
        <Reveal className="lg:col-span-2" delayMs={240}>
          <FeatureCard
            icon={Rocket}
            title="Ship-fast DX"
            description="TanStack Query over live Convex data, TanStack Table built in, and zero-config boot: no API keys? The whole loop still demos in mock mode."
          />
        </Reveal>
      </div>
    </section>
  );
}
