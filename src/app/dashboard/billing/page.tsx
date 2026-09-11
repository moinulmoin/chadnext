"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAction } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { subscriptionPlans } from "@/config/subscription";
import { cn } from "@/lib/utils";

const FREE_RUNS_PER_DAY = subscriptionPlans.free.maxRunsPerDay;

function formatRenewal(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function UsageMeter({
  label,
  used,
  limit,
  hint,
  unlimited = false,
}: {
  label: string;
  used: number;
  limit?: number;
  hint?: string;
  unlimited?: boolean;
}) {
  const percent =
    !unlimited && limit && limit > 0
      ? Math.min(100, Math.round((used / limit) * 100))
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {unlimited ? (
            <>
              {used.toLocaleString()} · <span className="text-foreground font-medium">Unlimited</span>
            </>
          ) : (
            `${used.toLocaleString()} / ${limit?.toLocaleString()}`
          )}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-colors",
            percent >= 100 ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: unlimited ? "100%" : `${percent}%` }}
        />
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("checkout") === "success";

  const subscriptionQuery = useQuery(convexQuery(api.billing.getUserSubscription, {}));
  const statsQuery = useQuery(convexQuery(api.runs.getStats, {}));
  const sigmaUsageQuery = useQuery(convexQuery(api.rateLimiter.getSigmaChatUsage, {}));

  const getCheckoutUrl = useAction(api.billing.getCheckoutUrl);
  const getPortalUrl = useAction(api.billing.getPortalUrl);

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  if (subscriptionQuery.isPending || statsQuery.isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (subscriptionQuery.isError || statsQuery.isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            Failed to load billing details. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const subscription = subscriptionQuery.data;
  const stats = statsQuery.data ?? { totalRuns: 0, runsToday: 0, tokensThisMonth: 0 };
  const isPro = subscription?.plan === "pro";

  const handleUpgrade = async () => {
    setIsCheckoutLoading(true);
    try {
      const result = await getCheckoutUrl({ origin: window.location.origin });
      if (!result) {
        toast.error("Billing is not configured", {
          description:
            "Add POLAR_ORGANIZATION_TOKEN and POLAR_PRO_PRODUCT_ID to the Convex environment to enable checkout.",
        });
        return;
      }
      window.location.href = result.url;
    } catch (error) {
      toast.error("Could not start checkout", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleManage = async () => {
    setIsPortalLoading(true);
    try {
      const result = await getPortalUrl({});
      if (!result) {
        toast.error("Could not open the customer portal", {
          description:
            "No Polar customer was found for your account. Contact support if you have an active subscription.",
        });
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error("Could not open the customer portal", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {justPaid && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="flex items-start gap-2 py-4 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Payment received — thank you! Your plan switches to Pro
              automatically within a few seconds once Polar confirms it.
            </p>
          </CardContent>
        </Card>
      )}

      {subscription && !subscription.configured ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-amber-500" />
              Billing not configured
            </CardTitle>
            <CardDescription>
              ChadNext is running in free mode — every account gets the Free
              plan and quotas are enforced server-side. To enable real
              checkout, add the Polar environment variables to your Convex
              deployment:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <pre className="overflow-x-auto rounded-md border bg-muted/50 p-3 font-mono text-xs">
{`npx convex env set POLAR_ORGANIZATION_TOKEN your-token
npx convex env set POLAR_PRO_PRODUCT_ID prod_your-pro-product-id
npx convex env set POLAR_WEBHOOK_SECRET your-webhook-secret`}
            </pre>
            <p>
              Then point a Polar webhook at{" "}
              <code className="font-mono text-xs">/polar/events</code> on your
              Convex site URL. Until then, no paywall is shown and nothing is
              broken.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Current plan */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base">Current plan</CardTitle>
            <CardDescription>
              {isPro
                ? "Pro — unlimited runs and higher assistant limits."
                : "Free — upgrade any time for unlimited runs."}
            </CardDescription>
          </div>
          <Badge variant={isPro ? "default" : "secondary"} className="text-sm">
            {isPro ? "Pro" : "Free"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro && subscription?.renewsAt ? (
            <p className="text-sm text-muted-foreground">
              {subscription.cancelAtPeriodEnd ? "Access ends on" : "Renews on"}{" "}
              <span className="font-medium text-foreground">
                {formatRenewal(subscription.renewsAt)}
              </span>
              {subscription.cancelAtPeriodEnd
                ? " — you cancelled and won't be charged again."
                : "."}
            </p>
          ) : null}
          <Separator />
          <div className="grid gap-5 sm:grid-cols-2">
            <UsageMeter
              label="Runs today"
              used={stats.runsToday}
              limit={isPro ? undefined : FREE_RUNS_PER_DAY}
              unlimited={isPro}
              hint={
                isPro
                  ? undefined
                  : "Free plan includes 10 runs per day."
              }
            />
            {sigmaUsageQuery.data ? (
              <UsageMeter
                label="Sigma messages this hour"
                used={sigmaUsageQuery.data.used}
                limit={sigmaUsageQuery.data.limit}
                hint="Resets on a rolling hourly window."
              />
            ) : (
              <UsageMeter
                label="Sigma messages this hour"
                used={0}
                limit={subscriptionPlans.free.sigmaMessagesPerHour}
              />
            )}
            <UsageMeter
              label="Tokens this month"
              used={stats.tokensThisMonth}
              unlimited
              hint="Metered across all runs; display only — never billed."
            />
          </div>
          {isPro ? (
            <Button
              variant="outline"
              onClick={handleManage}
              disabled={isPortalLoading}
            >
              {isPortalLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Manage subscription
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        {[subscriptionPlans.free, subscriptionPlans.pro].map((plan) => {
          const isCurrent = (isPro ? "pro" : "free") === plan.id;
          return (
            <Card
              key={plan.id}
              className={cn(
                isCurrent && "border-primary/50 shadow-sm",
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {isCurrent ? (
                    <Badge variant="secondary">Current</Badge>
                  ) : null}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <p className="pt-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.id === "pro" && !isPro ? (
                  <Button
                    className="w-full"
                    onClick={handleUpgrade}
                    disabled={isCheckoutLoading}
                  >
                    {isCheckoutLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Upgrade to Pro
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Payments are handled by Polar (merchant of record — VAT/sales tax
        included). Fixed monthly tiers only; usage is metered for display, never
        billed. Questions about your data?{" "}
        <Link href="/dashboard/settings" className="underline underline-offset-4">
          Visit settings
        </Link>
        .
      </p>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Your plan, usage, and upgrade options.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <BillingContent />
      </Suspense>
    </div>
  );
}
