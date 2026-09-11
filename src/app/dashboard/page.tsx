import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RunStatsCards } from "@/components/dashboard/run-stats-cards";
import { isAuthenticated } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Dashboard",
};

const SIGMA_SUGGESTIONS = [
  "How many runs today?",
  "Create a run about a product launch",
  "Show my usage",
];

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your runs, your usage, your assistant.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              Σ
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {greeting()} — Sigma here. Ask me anything about your runs.
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Reads are instant; anything that writes your data needs your
                approval first.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {SIGMA_SUGGESTIONS.map((suggestion) => (
              <Link
                key={suggestion}
                href={`/dashboard/chat?q=${encodeURIComponent(suggestion)}`}
                className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                {suggestion}
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <RunStatsCards />
    </div>
  );
}
