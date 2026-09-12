"use client";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionPlans } from "@/config/subscription";

const FREE_RUNS_PER_DAY = subscriptionPlans.free.maxRunsPerDay;

export function RunStatsCards() {
  const { data } = useQuery(convexQuery(api.runs.getStats, {}));
  const { data: subscription } = useQuery(
    convexQuery(api.billing.getUserSubscription, {}),
  );

  const stats = data ?? { totalRuns: 0, runsToday: 0, tokensThisMonth: 0 };
  const isPro = subscription?.plan === "pro";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Total Runs</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {stats.totalRuns.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Runs Today</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {stats.runsToday.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {isPro
              ? `${stats.runsToday.toLocaleString()} today · unlimited on Pro`
              : `Free plan: ${stats.runsToday}/${FREE_RUNS_PER_DAY} used today`}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Tokens This Month</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {stats.tokensThisMonth.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">Metered across all runs</p>
        </CardContent>
      </Card>
    </div>
  );
}
