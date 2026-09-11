"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { optimisticallySendMessage, useUIMessages } from "@convex-dev/agent/react";
import { useMutation } from "convex/react";
import { Bot, Loader2, Plus, Send, Square, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../../convex/_generated/api";
import { SigmaApprovalCard } from "@/components/sigma/approval-card";
import { SigmaChatMessage } from "@/components/sigma/chat-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const THREADS_PAGE_SIZE = 30;
const MESSAGES_PAGE_SIZE = 100;

const SUGGESTIONS = [
  "How many runs today?",
  "Show my recent runs",
  "What's my usage?",
];

function SigmaChat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  // Setup state: mock banner, model name.
  const statusQuery = useQuery(convexQuery(api.sigma.getChatStatus, {}));

  const threadsQuery = useQuery(
    convexQuery(api.sigma.listThreads, {
      paginationOpts: { numItems: THREADS_PAGE_SIZE, cursor: null },
    }),
  );

  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / suggestion entry: pre-fill the input once from ?q=.
  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
      inputRef.current?.focus();
      router.replace("/dashboard/chat");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messagesQuery = useUIMessages(
    api.sigma.listThreadMessages,
    activeThreadId ? { threadId: activeThreadId } : "skip",
    { initialNumItems: MESSAGES_PAGE_SIZE, stream: true },
  );

  const approvalsQuery = useQuery({
    ...convexQuery(api.sigma.listPendingApprovals, { threadId: activeThreadId ?? "" }),
    enabled: Boolean(activeThreadId),
  });

  const createThread = useMutation(api.sigma.createThread);
  const sendMessage = useMutation(api.sigma.sendMessage).withOptimisticUpdate(
    optimisticallySendMessage(api.sigma.listThreadMessages),
  );
  const approveToolCall = useMutation(api.sigma.approveToolCall);
  const denyToolCall = useMutation(api.sigma.denyToolCall);
  const stopStream = useMutation(api.sigma.stopStream);

  const messages = messagesQuery.results ?? [];
  const streamingOrder = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.status === "streaming" && message.role === "assistant") {
        return message.order;
      }
    }
    return null;
  })();
  const isStreaming = isSending || streamingOrder !== null;

  const handleSend = async (rawText?: string) => {
    const prompt = (rawText ?? input).trim();
    if (!prompt || isSending) return;

    setIsSending(true);
    setInput("");
    try {
      let threadId = activeThreadId;
      if (!threadId) {
        threadId = await createThread({ title: prompt.slice(0, 60) });
        setActiveThreadId(threadId);
      }
      await sendMessage({ threadId, prompt });
    } catch (error) {
      setInput(prompt);
      toast.error(
        error instanceof Error ? error.message : "Failed to send message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleApprove = async (approvalId: string) => {
    if (!activeThreadId) return;
    await approveToolCall({ threadId: activeThreadId, approvalId });
  };

  const handleDeny = async (approvalId: string) => {
    if (!activeThreadId) return;
    await denyToolCall({ threadId: activeThreadId, approvalId });
  };

  const handleStop = async () => {
    if (!activeThreadId || streamingOrder === null) return;
    try {
      await stopStream({ threadId: activeThreadId, order: streamingOrder });
    } catch {
      // The stream may have finished between render and click; ignore.
    }
  };

  const handleNewChat = async () => {
    setActiveThreadId(null);
    setInput("");
    inputRef.current?.focus();
  };

  const isMock = statusQuery.data?.mock ?? true;
  const threadTitles = (threadsQuery.data?.page ?? []) as Array<{
    _id: string;
    title?: string;
  }>;

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      {/* Thread list */}
      <aside className="hidden flex-col gap-2 lg:flex">
        <Button variant="outline" className="justify-start" onClick={handleNewChat}>
          <Plus className="mr-2 h-4 w-4" />
          New chat
        </Button>
        <ScrollArea className="flex-1 pr-2">
          <div className="flex flex-col gap-1">
            {threadTitles.length === 0 && (
              <p className="px-2 py-4 text-xs text-muted-foreground">
                No conversations yet.
              </p>
            )}
            {threadTitles.map((thread) => (
              <button
                key={thread._id}
                type="button"
                onClick={() => setActiveThreadId(thread._id)}
                className={cn(
                  "truncate rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted",
                  activeThreadId === thread._id && "bg-muted text-foreground",
                )}
              >
                {thread.title || "New chat"}
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Chat column */}
      <section className="flex min-h-0 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Sigma</h1>
              {statusQuery.data && (
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {statusQuery.data.model}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Answers from your data — writes need your approval.
            </p>
          </div>
          <Button variant="outline" size="sm" className="lg:hidden" onClick={handleNewChat}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            New
          </Button>
        </div>

        {isMock && (
          <div className="flex items-start gap-2 rounded-md border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
            <p>
              Add an AI key to enable live responses — Sigma currently runs in
              demo mode. Reads still answer from your data; writes stay behind
              the approval gate.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col gap-4 pb-4">
              {messages.length === 0 && !activeThreadId && (
                <Card>
                  <CardContent className="flex flex-col items-start gap-3 py-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        Σ
                      </div>
                      <p className="text-sm font-medium">
                        Hi, I&apos;m Sigma — your dashboard assistant.
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      I can answer questions about your runs, stats, and plan —
                      and I can act on them, with your approval. Everything is
                      scoped to your own data.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {SUGGESTIONS.map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSend(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {messages.map((message, index) => (
                <SigmaChatMessage
                  key={`${message.order}:${message.stepOrder}:${index}`}
                  role={message.role}
                  parts={message.parts}
                  streaming={message.status === "streaming"}
                />
              ))}
              {(approvalsQuery.data ?? []).map((approval: { _id: string; toolName: string; args: string }) => (
                <SigmaApprovalCard
                  key={approval._id}
                  approvalId={approval._id}
                  toolName={approval.toolName}
                  args={approval.args}
                  onApprove={handleApprove}
                  onDeny={handleDeny}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Composer */}
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isStreaming ? "Sigma is responding…" : "Ask Sigma about your runs, stats, or plan…"}
            disabled={isSending}
            maxLength={4000}
          />
          {isStreaming ? (
            <Button type="button" variant="outline" size="icon" onClick={handleStop}>
              <Square className="h-4 w-4" />
              <span className="sr-only">Stop generating</span>
            </Button>
          ) : (
            <Button type="submit" size="icon" disabled={isSending || !input.trim()}>
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          )}
        </form>
        <p className="text-center text-[11px] text-muted-foreground">
          Sigma reads your data automatically. Anything that creates, retries,
          or deletes requires your explicit approval.{" "}
          <Link href="/dashboard/settings" className="underline underline-offset-4">
            What Sigma knows
          </Link>
        </p>
      </section>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SigmaChat />
    </Suspense>
  );
}
