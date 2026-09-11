"use client";

import { useState } from "react";
import { Check, Loader2, ShieldAlert, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TOOL_LABELS: Record<string, string> = {
  createRun: "Create a run",
  retryRun: "Retry a run",
  deleteRun: "Delete a run",
};

function describeArgs(toolName: string, argsJson: string): string {
  try {
    const args = JSON.parse(argsJson) as Record<string, unknown>;
    if (toolName === "createRun") {
      return String(args.instruction ?? "");
    }
    if (toolName === "retryRun" || toolName === "deleteRun") {
      return `Run ${String(args.runId ?? "")}`;
    }
    return argsJson;
  } catch {
    return argsJson;
  }
}

export function SigmaApprovalCard({
  approvalId,
  toolName,
  args,
  onApprove,
  onDeny,
}: {
  approvalId: string;
  toolName: string;
  args: string;
  onApprove: (approvalId: string) => Promise<void>;
  onDeny: (approvalId: string) => Promise<void>;
}) {
  const [isBusy, setIsBusy] = useState(false);
  const [decision, setDecision] = useState<"approved" | "denied" | null>(null);

  const run = async (kind: "approve" | "deny") => {
    setIsBusy(true);
    try {
      if (kind === "approve") {
        await onApprove(approvalId);
      } else {
        await onDeny(approvalId);
      }
      setDecision(kind === "approve" ? "approved" : "denied");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to record decision.",
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Card className="border-amber-500/40 bg-amber-500/5">
      <CardContent className="space-y-3 py-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          {decision
            ? decision === "approved"
              ? "Approved — Sigma is executing"
              : "Denied — nothing was changed"
            : `Sigma wants to ${TOOL_LABELS[toolName] ?? toolName}`}
        </div>
        <p className="rounded-md bg-background/60 px-3 py-2 text-sm">
          {describeArgs(toolName, args)}
        </p>
        {!decision && (
          <p className="text-xs text-muted-foreground">
            Nothing happens until you approve. Denial leaves no trace.
          </p>
        )}
        {!decision && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              {toolName}
            </Badge>
            <div className="flex-1" />
            <Button
              size="sm"
              variant="outline"
              disabled={isBusy}
              onClick={() => run("deny")}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Deny
            </Button>
            <Button size="sm" disabled={isBusy} onClick={() => run("approve")}>
              {isBusy ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="mr-1 h-3.5 w-3.5" />
              )}
              Approve
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
