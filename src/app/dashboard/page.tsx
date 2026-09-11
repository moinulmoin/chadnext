import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RunStatsCards } from "@/components/dashboard/run-stats-cards";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
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
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ChadNext
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <Badge variant="secondary">Dashboard</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your workspace.</p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3 sm:flex-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                Σ
              </div>
              <div>
                <p className="text-sm font-medium">
                  {greeting()} — Sigma here. Ask me anything about your runs.
                </p>
                <p className="text-xs text-muted-foreground">
                  Reads are instant; anything that writes your data needs your
                  approval first.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {SIGMA_SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  asChild
                  variant="secondary"
                  size="sm"
                >
                  <Link href={`/dashboard/chat?q=${encodeURIComponent(suggestion)}`}>
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    {suggestion}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <RunStatsCards />
      </main>
    </div>
  );
}
