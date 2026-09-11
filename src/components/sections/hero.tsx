import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Github,
  ListChecks,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mt-16 w-full max-w-5xl sm:mt-24"
    >
      {/* Glow accents */}
      <div className="absolute inset-x-0 -top-16 mx-auto h-48 max-w-3xl rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-xl border bg-card shadow-2xl">
        {/* Top highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b bg-background/60 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="size-2.5 rounded-full bg-muted-foreground/25" />
          <span className="ml-3 hidden rounded-md border bg-muted/50 px-2.5 py-1 font-mono text-[10px] text-muted-foreground sm:block">
            chadnext.app/dashboard
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            gateway connected
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
          {/* Run artifact card */}
          <div className="rounded-lg border bg-background/60">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <span className="font-mono text-[10px] text-muted-foreground">
                run_01J8Q7
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                succeeded
              </span>
            </div>

            <div className="space-y-3 px-4 py-3.5">
              <p className="text-xs text-muted-foreground">
                &ldquo;Write a launch announcement for our new AI
                feature&rdquo;
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  Introducing ChadNext v2 — the agent-native SaaS chassis
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Fork it, swap the noun, and ship this weekend. Runs, agent
                  approvals, and billing come pre-wired.
                </p>
                <ul className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ListChecks className="size-3.5 text-primary" />
                    AI job loop with kept artifacts
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldAlert className="size-3.5 text-primary" />
                    Confirm Gate on every agent write
                  </li>
                </ul>
              </div>
            </div>

            {/* Token meter */}
            <div className="space-y-1.5 border-t px-4 py-3">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>1,842 tokens</span>
                <span>$0.004</span>
                <span>3.2s</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 rounded-full bg-primary/70" />
              </div>
            </div>
          </div>

          {/* Chat exchange with approval card */}
          <div className="flex flex-col gap-3">
            <div className="self-end rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground">
              Create a run for the launch announcement
            </div>
            <div className="flex items-start gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                Σ
              </span>
              <p className="rounded-lg border bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                That writes to your workspace, so I need your approval first.
              </p>
            </div>

            <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <ShieldAlert className="size-3.5 text-amber-500" />
                Sigma wants to create a run
              </div>
              <p className="mt-2 rounded-md bg-background/60 px-2 py-1.5 text-[11px]">
                Write a launch announcement for our new AI feature
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="rounded border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  createRun
                </span>
                <span className="flex-1" />
                <span className="rounded-md border px-2.5 py-1 text-[11px] font-medium">
                  Deny
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                  <Check className="size-3" />
                  Approve
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Faint grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_55%,transparent_100%)]"
      />

      <div className="container relative flex flex-col items-center py-24 text-center md:py-32">
        <div className="motion-safe:animate-fade-up inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium shadow-sm">
          <Sparkles className="size-3.5 text-primary" />
          <span className="text-muted-foreground">
            Free &amp; open source — MIT
          </span>
        </div>

        <h1 className="motion-safe:animate-fade-up mt-6 max-w-3xl text-4xl font-extrabold tracking-tight [animation-delay:100ms] sm:text-5xl md:text-6xl lg:text-7xl">
          The <span className="text-primary">agent-native</span> SaaS starter
        </h1>

        <p className="motion-safe:animate-fade-up mt-6 max-w-2xl text-lg text-muted-foreground [animation-delay:200ms] sm:text-xl">
          Your AI coding agent builds it. Sigma runs it. Fork it, swap the
          noun, and ship this weekend.
        </p>

        <div className="motion-safe:animate-fade-up mt-8 flex flex-col gap-4 [animation-delay:300ms] sm:flex-row">
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

        <p className="motion-safe:animate-fade-up mt-6 font-mono text-xs text-muted-foreground [animation-delay:400ms]">
          Next.js 16 · Convex · better-auth · Polar · Vercel AI Gateway
        </p>

        <div className="motion-safe:animate-fade-up w-full [animation-delay:500ms]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
