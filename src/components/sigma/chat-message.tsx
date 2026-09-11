"use client";

import { AlertTriangle, CheckCircle2, Loader2, Wrench } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { RunStatusBadge } from "@/components/shared/run-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Generative UI: maps tool results in the message stream to live components.
 * `listRuns` renders a compact runs table; `getDashboardStats` renders stat
 * cards; everything else falls back to a generic tool card.
 */

type MessagePartLike = {
  type?: string;
  text?: unknown;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

type RunSummary = {
  id: string;
  instruction: string;
  status: string;
  tokensUsed?: number;
  createdAt: number;
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function RunsResultCard({ runs }: { runs: RunSummary[] }) {
  if (runs.length === 0) {
    return (
      <Card>
        <CardContent className="py-4 text-center text-sm text-muted-foreground">
          No runs found.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Instruction</TableHead>
              <TableHead className="px-4">Status</TableHead>
              <TableHead className="px-4 text-right">Tokens</TableHead>
              <TableHead className="px-4 text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell className="max-w-[240px] truncate px-4">
                  {run.instruction}
                </TableCell>
                <TableCell className="px-4">
                  <RunStatusBadge status={run.status as "queued" | "running" | "succeeded" | "failed"} />
                </TableCell>
                <TableCell className="px-4 text-right tabular-nums">
                  {(run.tokensUsed ?? 0).toLocaleString()}
                </TableCell>
                <TableCell className="px-4 text-right text-muted-foreground">
                  {timeAgo(run.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatsResultCard({ stats }: { stats: Record<string, number> }) {
  const items = [
    { label: "Total runs", value: (stats.totalRuns ?? 0).toLocaleString() },
    { label: "Runs today", value: (stats.runsToday ?? 0).toLocaleString() },
    {
      label: "Tokens this month",
      value: (stats.tokensThisMonth ?? 0).toLocaleString(),
    },
  ];
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="py-4">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ToolCard({
  toolName,
  state,
  input,
  output,
  errorText,
}: {
  toolName: string;
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
}) {
  const inputSummary = input !== undefined ? JSON.stringify(input) : "";
  const outputPreview = (() => {
    if (output === undefined) return null;
    const text = typeof output === "string" ? output : JSON.stringify(output);
    return text.length > 200 ? `${text.slice(0, 200)}…` : text;
  })();

  return (
    <Card className="border-dashed bg-muted/40">
      <CardContent className="space-y-1.5 py-3">
        <div className="flex items-center gap-2 text-xs font-medium">
          {state === "output-available" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : state === "output-error" ? (
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          ) : (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
          <span className="font-mono">{toolName}</span>
          {inputSummary ? (
            <Badge variant="outline" className="max-w-[280px] truncate font-normal">
              {inputSummary}
            </Badge>
          ) : null}
        </div>
        {errorText ? (
          <p className="text-xs text-destructive">{errorText}</p>
        ) : outputPreview ? (
          <p className="break-all font-mono text-xs text-muted-foreground">
            {outputPreview}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ToolPartView({ part }: { part: MessagePartLike }) {
  const toolName = (part.type ?? "").replace(/^tool-/, "");
  const done = part.state === "output-available" || part.state === "output-error";

  if (done && toolName === "listRuns" && part.output && typeof part.output === "object") {
    const runs = ((part.output as { runs?: RunSummary[] }).runs ?? []) as RunSummary[];
    return <RunsResultCard runs={runs} />;
  }
  if (
    done &&
    toolName === "getDashboardStats" &&
    part.output &&
    typeof part.output === "object" &&
    !Array.isArray(part.output)
  ) {
    return <StatsResultCard stats={part.output as Record<string, number>} />;
  }
  return (
    <ToolCard
      toolName={toolName}
      state={part.state}
      input={part.input}
      output={part.output}
      errorText={part.errorText}
    />
  );
}

export function SigmaChatMessage({
  role,
  parts,
  streaming,
}: {
  role: string;
  parts?: unknown[];
  streaming?: boolean;
}) {
  const isUser = role === "user";
  const toolParts: MessagePartLike[] = (parts ?? []).filter(
    (part): part is MessagePartLike => {
      const candidate = part as MessagePartLike;
      return typeof candidate.type === "string" && candidate.type.startsWith("tool-");
    },
  );
  const textParts = (parts ?? [])
    .map((part) => part as MessagePartLike)
    .filter(
      (part): part is MessagePartLike & { type: "text"; text: string } =>
        part.type === "text" && typeof part.text === "string",
    )
    .map((part) => part.text);
  const body = textParts.length > 0 ? textParts.join("\n") : "";

  return (
    <Message align={isUser ? "end" : "start"}>
      {!isUser && (
        <MessageAvatar>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            Σ
          </div>
        </MessageAvatar>
      )}
      <MessageContent>
        {body ? (
          <div
            className={
              isUser
                ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground [&_a]:underline"
                : "rounded-2xl rounded-bl-sm bg-muted/60 px-4 py-2.5"
            }
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{body}</p>
            ) : (
              <ReactMarkdown
                components={{
                  p: (props) => <p className="whitespace-pre-wrap" {...props} />,
                  a: (props) => (
                    <a
                      className="underline underline-offset-4"
                      target="_blank"
                      rel="noreferrer"
                      {...props}
                    />
                  ),
                  code: (props) => (
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs" {...props} />
                  ),
                }}
              >
                {body}
              </ReactMarkdown>
            )}
          </div>
        ) : null}
        {toolParts.length > 0 && (
          <div className="space-y-2">
            {toolParts.map((part, index) => (
              <ToolPartView key={index} part={part} />
            ))}
          </div>
        )}
        {streaming && !body ? (
          <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <Wrench className="h-3 w-3" />
            Sigma is thinking…
          </div>
        ) : null}
      </MessageContent>
    </Message>
  );
}
