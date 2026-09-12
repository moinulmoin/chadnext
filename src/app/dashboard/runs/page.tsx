"use client";

import { Component, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, usePaginatedQuery } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { ArrowDown, Loader2, Play, Zap } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../../convex/_generated/api";
import { RunStatusBadge } from "@/components/shared/run-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { subscriptionPlans } from "@/config/subscription";
import { timeAgo } from "@/lib/utils";

const MAX_INSTRUCTION_LENGTH = 2000;
const RUNS_PAGE_SIZE = 100;
const FREE_RUNS_PER_DAY = subscriptionPlans.free.maxRunsPerDay;

/**
 * Convex `usePaginatedQuery` throws query errors during render (no isError
 * field), so the page wraps itself in a boundary to keep the inline error
 * card instead of crashing the route.
 */
class RunsErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            Failed to load runs. Please try again.
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}

function RunsTable() {
  const router = useRouter();

  // Real cursor pagination: "Load more" below fetches the next page.
  const runsQuery = usePaginatedQuery(api.runs.list, {}, {
    initialNumItems: RUNS_PAGE_SIZE,
  });
  const statsQuery = useQuery(convexQuery(api.runs.getStats, {}));
  const subscriptionQuery = useQuery(convexQuery(api.billing.getUserSubscription, {}));

  const createRun = useMutation(api.runs.createRun);
  const processRun = useMutation(api.runs.processRun);
  const seedDemoRuns = useMutation(api.seed.seedDemoRuns);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const runs = runsQuery.results;
  const runsToday = statsQuery.data?.runsToday ?? 0;
  const isPro = subscriptionQuery.data?.plan === "pro";
  const freeLimitReached = !isPro && runsToday >= FREE_RUNS_PER_DAY;

  const instructionLength = useMemo(() => instruction.trim().length, [instruction]);

  const resetCreateForm = () => {
    setInstruction("");
    setCreateError(null);
  };

  const handleCreate = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!instruction.trim()) {
      setCreateError("Instruction is required.");
      return;
    }

    setIsSubmitting(true);
    setCreateError(null);

    try {
      const runId = await createRun({ instruction });

      toast.success("Run queued");
      resetCreateForm();
      setDialogOpen(false);

      // Fire-and-forget processing; the reactive subscription picks up the
      // queued → running → succeeded/failed transitions. (The server also
      // schedules processing as a safety net — the queued→running claim
      // makes double dispatch harmless.)
      processRun({ runId }).catch((error) => {
        const message =
          error instanceof Error ? error.message : "Failed to start processing.";
        toast.error("Run processing failed", { description: message });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create run.";
      setCreateError(message);

      if (message.includes("Free plan limited")) {
        toast.error("Free plan limit reached", {
          description: `You have used ${runsToday}/${FREE_RUNS_PER_DAY} runs today. Upgrade to Pro for unlimited runs on the Billing page.`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    try {
      const { inserted } = await seedDemoRuns({});
      toast.success(
        inserted > 0
          ? `Loaded ${inserted} demo runs`
          : "You already have runs — demo data skipped",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load demo data.";
      toast.error("Couldn't load demo data", { description: message });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Runs</h1>
          <p className="text-sm text-muted-foreground">
            Submit an instruction and watch the AI job loop process it.
          </p>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              resetCreateForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              New Run
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Run</DialogTitle>
              <DialogDescription>
                Describe what the run should produce.{" "}
                {isPro
                  ? "Pro plan — unlimited runs."
                  : `Free plan includes up to ${FREE_RUNS_PER_DAY} runs per day.`}
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="run-instruction">Instruction</Label>
                  <span className="text-xs text-muted-foreground">
                    {instructionLength}/{MAX_INSTRUCTION_LENGTH}
                  </span>
                </div>
                <Textarea
                  id="run-instruction"
                  placeholder="e.g. Write a launch announcement for our new AI feature"
                  rows={5}
                  maxLength={MAX_INSTRUCTION_LENGTH}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                />
              </div>

              {createError ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {createError}
                </div>
              ) : null}

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Queuing..." : "Start Run"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3 py-4">
          <p className="text-sm text-muted-foreground">
            {statsQuery.data === undefined || subscriptionQuery.isLoading
              ? "Checking your plan usage..."
              : isPro
                ? "Pro plan usage today"
                : "Free plan usage today"}
          </p>
          {isPro ? (
            <Badge>Pro · unlimited</Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant={freeLimitReached ? "destructive" : "secondary"}>
                {runsToday}/{FREE_RUNS_PER_DAY}
              </Badge>
              {freeLimitReached ? (
                <Link
                  href="/dashboard/billing"
                  className="text-sm underline underline-offset-4"
                >
                  Upgrade for unlimited runs
                </Link>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {runsQuery.status === "LoadingFirstPage" ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Loading runs...
          </CardContent>
        </Card>
      ) : runs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">No runs yet</p>
              <p className="text-sm text-muted-foreground">
                Start your first run to see the AI job loop in action.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setDialogOpen(true)}>
                <Play className="mr-2 h-4 w-4" />
                New Run
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isSeeding}
                onClick={handleSeedDemoData}
              >
                {isSeeding ? "Loading..." : "Load demo data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Instruction</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4">Tokens</TableHead>
                  <TableHead className="px-4">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <TableRow
                    key={run._id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/runs/${run._id}`)}
                  >
                    <TableCell className="px-4">
                      <span className="block max-w-md truncate">{run.instruction}</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <RunStatusBadge status={run.status} />
                    </TableCell>
                    <TableCell className="px-4">
                      <span className="tabular-nums">
                        {run.tokensUsed.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-4">
                      <span className="text-muted-foreground">
                        {timeAgo(run.createdAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Showing {runs.length} run{runs.length === 1 ? "" : "s"}
              </p>
              {runsQuery.status === "CanLoadMore" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runsQuery.loadMore(RUNS_PAGE_SIZE)}
                >
                  Load more
                  <ArrowDown className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
              {runsQuery.status === "LoadingMore" ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading...
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Runs are processed asynchronously — status updates stream in live.{" "}
        {isPro
          ? "Pro plan: unlimited runs included."
          : (
            <>
              <Link href="/dashboard/billing" className="underline underline-offset-4">
                Upgrade to Pro
              </Link>{" "}
              for unlimited runs.
            </>
          )}
      </p>
    </div>
  );
}

export default function RunsPage() {
  return (
    <RunsErrorBoundary>
      <RunsTable />
    </RunsErrorBoundary>
  );
}
