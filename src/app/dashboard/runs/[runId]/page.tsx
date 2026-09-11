"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type GenericId } from "convex/values";
import { useMutation } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import Markdown from "react-markdown";
import { AlertCircle, ArrowLeft, RotateCcw, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../../../convex/_generated/api";
import { RunStatusBadge } from "@/components/shared/run-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { timeAgo } from "@/lib/utils";

const MARKDOWN_CLASSES =
  "[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_hr]:my-4 [&_border-t]:my-4";

function formatCost(costCents: number) {
  return `$${(costCents / 100).toFixed(2)}`;
}

function formatDuration(createdAt: number, completedAt?: number) {
  if (!completedAt) {
    return "—";
  }
  return `${Math.max((completedAt - createdAt) / 1000, 0).toFixed(1)}s`;
}

export default function RunDetailPage() {
  const router = useRouter();
  const params = useParams<{ runId: string }>();

  const runId = params.runId as GenericId<"runs">;
  const runQuery = useQuery(convexQuery(api.runs.get, { runId }));

  const retryRun = useMutation(api.runs.retryRun);
  const deleteRun = useMutation(api.runs.deleteRun);
  const processRun = useMutation(api.runs.processRun);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryRun({ runId });

      toast.success("Run re-queued");
      processRun({ runId }).catch((error) => {
        const message =
          error instanceof Error ? error.message : "Failed to start processing.";
        toast.error("Run processing failed", { description: message });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to retry run.";
      toast.error(message);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRun({ runId });
      toast.success("Run deleted");
      router.push("/dashboard/runs");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete run.";
      toast.error(message);
      setIsDeleting(false);
    }
  };

  if (runQuery.isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading run...
        </CardContent>
      </Card>
    );
  }

  if (runQuery.isError || runQuery.data === null) {
    return (
      <Card>
        <CardContent className="space-y-3 py-10 text-center">
          <p className="font-medium">Run not found</p>
          <Button variant="outline" asChild>
            <Link href="/dashboard/runs">Back to Runs</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const run = runQuery.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/runs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Runs
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {run.status === "failed" ? (
            <Button size="sm" onClick={handleRetry} disabled={isRetrying}>
              <RotateCcw className="mr-2 h-4 w-4" />
              {isRetrying ? "Retrying..." : "Retry Run"}
            </Button>
          ) : null}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete run?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The run and its artifact will be permanently
                  removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Run</CardTitle>
            <RunStatusBadge status={run.status} />
          </div>
          <CardDescription>Submitted {timeAgo(run.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <blockquote className="whitespace-pre-wrap rounded-md border-l-2 border-muted-foreground/30 bg-muted/50 px-3 py-2 text-sm">
            {run.instruction}
          </blockquote>

          <Separator />

          <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Model</dt>
              <dd className="mt-1 font-medium">{run.model}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tokens</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {run.tokensUsed.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cost</dt>
              <dd className="mt-1 font-medium tabular-nums">{formatCost(run.costCents)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Duration</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {formatDuration(run.createdAt, run.completedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artifact</CardTitle>
          <CardDescription>The markdown output produced by this run.</CardDescription>
        </CardHeader>
        <CardContent>
          {run.status === "succeeded" && run.output ? (
            <div className={`text-sm leading-relaxed ${MARKDOWN_CLASSES}`}>
              <Markdown>{run.output}</Markdown>
            </div>
          ) : run.status === "failed" ? (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{run.errorMessage || "This run failed. Retry it to process again."}</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 rounded-md border px-3 py-6 text-sm text-muted-foreground"
              role="status"
              aria-live="polite"
            >
              <Zap
                className={`h-4 w-4 ${run.status === "running" ? "animate-pulse text-blue-500" : ""}`}
              />
              {run.status === "running"
                ? "Processing your instruction..."
                : "Run is queued for processing..."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
