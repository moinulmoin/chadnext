"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, Play, Zap } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
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
type Run = Doc<"runs">;

const MAX_INSTRUCTION_LENGTH = 2000;
const RUNS_PAGE_SIZE = 100;
const FREE_RUNS_PER_DAY = subscriptionPlans.free.maxRunsPerDay;

const columns: ColumnDef<Run>[] = [
  {
    accessorKey: "instruction",
    header: "Instruction",
    cell: ({ row }) => (
      <span className="block max-w-md truncate">{row.original.instruction}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <RunStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "tokensUsed",
    header: "Tokens",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.tokensUsed.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{timeAgo(row.original.createdAt)}</span>
    ),
  },
];

export default function RunsPage() {
  const router = useRouter();

  const runsQuery = useQuery(
    convexQuery(api.runs.list, {
      paginationOpts: { numItems: RUNS_PAGE_SIZE, cursor: null },
    }),
  );
  const statsQuery = useQuery(convexQuery(api.runs.getStats, {}));
  const subscriptionQuery = useQuery(convexQuery(api.billing.getUserSubscription, {}));

  const createRun = useMutation(api.runs.createRun);
  const processRun = useMutation(api.runs.processRun);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runs = runsQuery.data?.page ?? [];
  const runsToday = statsQuery.data?.runsToday ?? 0;
  const isPro = subscriptionQuery.data?.plan === "pro";
  const freeLimitReached = !isPro && runsToday >= FREE_RUNS_PER_DAY;

  const table = useReactTable({
    data: runs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

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
      // queued → running → succeeded/failed transitions.
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
                  onChange={(e: any) => setInstruction(e.target.value)}
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

      {runsQuery.isPending ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Loading runs...
          </CardContent>
        </Card>
      ) : runsQuery.isError ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-destructive">
            Failed to load runs. Please try again.
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-4">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/runs/${row.original._id}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {Math.max(table.getPageCount(), 1)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
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
