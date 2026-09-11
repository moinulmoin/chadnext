import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RunStatsCards } from "@/components/dashboard/run-stats-cards";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import { isAuthenticated } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Dashboard",
};

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

        <RunStatsCards />
      </main>
    </div>
  );
}
