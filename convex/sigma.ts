/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/anyApi types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import {
  Agent,
  abortStream,
  createTool,
  getThreadMetadata,
  listMessages,
  listUIMessages,
  mockModel,
  saveMessages,
  stepCountIs,
  syncStreams,
  vStreamArgs,
} from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, type GenericId, v } from "convex/values";
import { z } from "zod";

import { components, internal } from "./_generated/api";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { aiProvider, defaultModelId, resolveLanguageModel } from "./aiConfig";
import { authComponent } from "./auth";
import { FREE_RUNS_PER_DAY } from "./limits";
import { limiter, sigmaChatLimitName, SIGMA_CHAT_LIMITS } from "./rateLimiter";

/**
 * Sigma — the in-app assistant.
 *
 * CONFIRM GATE INVARIANT (AGENTS.md safety rule 1): every gated write
 * (createRun / retryRun / deleteRun) executed through Sigma is unreachable
 * without an `approvals` record owned by the same user and thread, in
 * "approved" state. This is enforced in two places:
 *   1. Gated tools declare `needsApproval: true`. The AI SDK persists a
 *      tool-approval-request and refuses to execute the tool until
 *      `sigma.approveToolCall` (auth'd, ownership-checked) responds on the
 *      user's behalf.
 *   2. Before any business logic runs, the tool/action re-validates the
 *      approvals record server-side (`assertApprovedToolCall`) and only then
 *      calls the internal runs.ts mutations. Denial leaves zero data
 *      side-effects: the runs mutations are simply never invoked.
 */

const SIGMA_INSTRUCTIONS = `You are Sigma, the in-app assistant for this SaaS. You can see and act on the signed-in user's own data only. Answer briefly and helpfully. Use your tools for anything factual about the user's runs, stats, or plan — never guess. For any action that creates, retries, or deletes data, you MUST call the matching tool, which requires user approval.`;

const MAX_LIST_RUNS = 10;

// ---------------------------------------------------------------------------
// Identity + ownership helpers
// ---------------------------------------------------------------------------

/** Resolve the signed-in app user in query/mutation contexts. */
async function requireViewer(ctx: unknown): Promise<GenericId<"users">> {
  const authUser = await authComponent.safeGetAuthUser(ctx as any);
  if (!authUser) {
    throw new ConvexError("Unauthorized");
  }
  const user = await (ctx as { db: any }).db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", authUser.email))
    .first();
  if (!user) {
    throw new ConvexError("Unauthorized");
  }
  return user._id as GenericId<"users">;
}

/** Resolve the signed-in app user in action contexts (auth flows through). */
async function requireViewerInAction(ctx: any): Promise<GenericId<"users">> {
  const userId = await ctx.runQuery(internal.users.getUserIdInternal, {});
  if (!userId) {
    throw new ConvexError("Unauthorized");
  }
  return userId as GenericId<"users">;
}

/** Every thread access verifies the thread belongs to the viewer. */
async function assertThreadOwner(
  ctx: unknown,
  viewer: GenericId<"users">,
  threadId: string,
) {
  const threadDoc = await getThreadMetadata(ctx as any, components.agent, {
    threadId,
  });
  if (!threadDoc || threadDoc.userId !== viewer) {
    throw new ConvexError("Thread not found");
  }
  return threadDoc;
}

// ---------------------------------------------------------------------------
// Approvals (Confirm Gate records)
// ---------------------------------------------------------------------------

export const recordPendingApproval = internalMutation({
  args: {
    userId: v.id("users"),
    threadId: v.string(),
    toolCallId: v.string(),
    toolName: v.string(),
    args: v.string(),
  },
  returns: v.id("approvals"),
  handler: async (ctx, args) => {
    // Idempotent per tool call so retries never duplicate approval requests.
    const existing = await ctx.db
      .query("approvals")
      .withIndex("by_toolCallId", (q: any) => q.eq("toolCallId", args.toolCallId))
      .first();
    if (existing) {
      return existing._id;
    }
    return await ctx.db.insert("approvals", {
      userId: args.userId,
      threadId: args.threadId,
      toolCallId: args.toolCallId,
      toolName: args.toolName,
      args: args.args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const getApprovalByToolCallId = internalQuery({
  args: { toolCallId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("approvals"),
      userId: v.id("users"),
      threadId: v.string(),
      toolCallId: v.string(),
      toolName: v.string(),
      args: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("denied"),
      ),
      createdAt: v.number(),
      decidedAt: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("approvals")
      .withIndex("by_toolCallId", (q: any) => q.eq("toolCallId", args.toolCallId))
      .first();
    return record ?? null;
  },
});

export const listPendingApprovals = query({
  args: { threadId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("approvals"),
      toolName: v.string(),
      args: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    await assertThreadOwner(ctx, viewer, args.threadId);
    const records = await ctx.db
      .query("approvals")
      .withIndex("by_thread", (q: any) => q.eq("threadId", args.threadId))
      .collect();
    return records
      .filter(
        (record: any) => record.userId === viewer && record.status === "pending",
      )
      .map((record: any) => ({
        _id: record._id,
        toolName: record.toolName,
        args: record.args,
        createdAt: record.createdAt,
      }));
  },
});

/**
 * Server-side Confirm Gate check executed before any gated business logic.
 * The tool wrapper refuses to run the mutation unless the approvals record
 * for this exact tool call is approved by the owning user.
 */
async function assertApprovedToolCall(
  ctx: any,
  userId: GenericId<"users">,
  threadId: string | undefined,
  toolCallId: string,
  toolName: string,
): Promise<{ args: string }> {
  const record = await ctx.runQuery(internal.sigma.getApprovalByToolCallId, {
    toolCallId,
  });
  const owned =
    record &&
    record.userId === userId &&
    (threadId === undefined || record.threadId === threadId) &&
    record.toolName === toolName;
  if (!owned || record.status !== "approved") {
    throw new Error(
      `Blocked by the Confirm Gate: "${toolName}" was not approved by the user, so no data was changed.`,
    );
  }
  return record;
}

/** Locate the AI SDK approvalId for a gated tool call (real-model path). */
async function findSdkApprovalId(
  ctx: any,
  threadId: string,
  toolCallId: string,
): Promise<string | undefined> {
  let cursor: string | null = null;
  for (let page = 0; page < 3; page++) {
    const result = await listMessages(ctx, components.agent, {
      threadId,
      paginationOpts: { numItems: 50, cursor },
    });
    for (const doc of result.page) {
      const content = (doc.message as any)?.content;
      if (!Array.isArray(content)) continue;
      for (const part of content) {
        if (
          part?.type === "tool-approval-request" &&
          part.toolCallId === toolCallId
        ) {
          return part.approvalId as string;
        }
      }
    }
    if (result.isDone) break;
    cursor = result.continueCursor;
  }
  return undefined;
}

export const approveToolCall = mutation({
  args: { threadId: v.string(), approvalId: v.id("approvals") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    await assertThreadOwner(ctx, viewer, args.threadId);

    const record = await ctx.db.get(args.approvalId);
    if (!record || record.userId !== viewer || record.threadId !== args.threadId) {
      throw new ConvexError("Approval not found");
    }
    if (record.status !== "pending") {
      return null; // Already decided; idempotent.
    }

    await ctx.db.patch(record._id, {
      status: "approved",
      decidedAt: Date.now(),
    });

    if (aiProvider() !== "mock" && !record.toolCallId.startsWith("mock-")) {
      const sdkApprovalId = await findSdkApprovalId(
        ctx,
        args.threadId,
        record.toolCallId,
      );
      if (sdkApprovalId) {
        // Persist the AI SDK approval response, then continue the generation:
        // the SDK executes the approved tool, whose execute() re-checks the
        // approvals record above before touching data.
        const { messageId } = await sigma.approveToolCall(ctx, {
          threadId: args.threadId,
          approvalId: sdkApprovalId,
        });
        await ctx.scheduler.runAfter(0, internal.sigma.continueConversation, {
          threadId: args.threadId,
          userId: viewer,
          promptMessageId: messageId,
        });
        return null;
      }
    }

    // Mock mode (or no SDK approval part): execute the approved action
    // directly. executeApprovedTool re-validates the approved record.
    await ctx.scheduler.runAfter(0, internal.sigma.executeApprovedTool, {
      approvalId: record._id,
    });
    return null;
  },
});

export const denyToolCall = mutation({
  args: { threadId: v.string(), approvalId: v.id("approvals") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    await assertThreadOwner(ctx, viewer, args.threadId);

    const record = await ctx.db.get(args.approvalId);
    if (!record || record.userId !== viewer || record.threadId !== args.threadId) {
      throw new ConvexError("Approval not found");
    }

    // Denial: mark the record; the underlying runs mutations are never called.
    await ctx.db.patch(record._id, {
      status: "denied",
      decidedAt: Date.now(),
    });

    if (aiProvider() !== "mock" && !record.toolCallId.startsWith("mock-")) {
      const sdkApprovalId = await findSdkApprovalId(
        ctx,
        args.threadId,
        record.toolCallId,
      );
      if (sdkApprovalId) {
        const { messageId } = await sigma.denyToolCall(ctx, {
          threadId: args.threadId,
          approvalId: sdkApprovalId,
        });
        await ctx.scheduler.runAfter(0, internal.sigma.continueConversation, {
          threadId: args.threadId,
          userId: viewer,
          promptMessageId: messageId,
        });
        return null;
      }
    }

    await saveMessages(ctx, components.agent, {
      threadId: args.threadId,
      userId: viewer,
      messages: [
        {
          role: "assistant",
          content:
            "Understood — I won't do that. The request was denied and nothing was changed.",
        },
      ],
    });
    return null;
  },
});

/** Mock-mode executor: runs an approved gated tool outside the AI SDK loop. */
export const executeApprovedTool = internalAction({
  args: { approvalId: v.id("approvals") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const approval: any = await ctx.runQuery(internal.sigma.getApprovalById, {
      approvalId: args.approvalId,
    });
    if (!approval) return null;
    // CONFIRM GATE: refuse to execute anything that is not an approved,
    // user-owned approval record.
    if (approval.status !== "approved") return null;

    const parsed = JSON.parse(approval.args) as Record<string, unknown>;
    let resultText: string;
    try {
      if (approval.toolName === "createRun") {
        const runId = await ctx.runMutation(internal.runs.createRunInternal, {
          userId: approval.userId,
          instruction: String(parsed.instruction ?? ""),
        });
        resultText = `Run created (id: ${runId}). It is queued and will process shortly.`;
      } else if (approval.toolName === "retryRun") {
        await ctx.runMutation(internal.runs.retryRunInternal, {
          userId: approval.userId,
          runId: String(parsed.runId ?? "") as GenericId<"runs">,
        });
        resultText = "Run re-queued for retry.";
      } else if (approval.toolName === "deleteRun") {
        await ctx.runMutation(internal.runs.deleteRunInternal, {
          userId: approval.userId,
          runId: String(parsed.runId ?? "") as GenericId<"runs">,
        });
        resultText = "Run deleted.";
      } else {
        resultText = `Done: ${approval.toolName}.`;
      }
    } catch (error) {
      resultText = `The approved action failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`;
    }

    await saveMessages(ctx, components.agent, {
      threadId: approval.threadId,
      userId: approval.userId,
      messages: [{ role: "assistant", content: resultText }],
    });
    return null;
  },
});

export const getApprovalById = internalQuery({
  args: { approvalId: v.id("approvals") },
  returns: v.union(
    v.object({
      _id: v.id("approvals"),
      userId: v.id("users"),
      threadId: v.string(),
      toolCallId: v.string(),
      toolName: v.string(),
      args: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("denied"),
      ),
      createdAt: v.number(),
      decidedAt: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.approvalId);
    return record ?? null;
  },
});

/** Continuation after an approval decision (real-model path). */
export const continueConversation = internalAction({
  args: {
    threadId: v.string(),
    userId: v.id("users"),
    promptMessageId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await assertThreadOwner(ctx, args.userId, args.threadId);
    const { thread } = await sigma.continueThread(ctx, {
      threadId: args.threadId,
      userId: args.userId,
    });
    await thread.streamText(
      { promptMessageId: args.promptMessageId },
      { saveStreamDeltas: true },
    );
    return null;
  },
});

// ---------------------------------------------------------------------------
// The 7 tools (reads auto-run; writes gated by the Confirm Gate)
// ---------------------------------------------------------------------------

function summarizeRun(run: any) {
  return {
    id: String(run._id),
    instruction: run.instruction,
    status: run.status,
    tokensUsed: run.tokensUsed,
    createdAt: run.createdAt,
  };
}

const listRunsTool = createTool({
  description:
    "List the signed-in user's most recent runs (id, instruction, status, tokens).",
  inputSchema: z.object({
    limit: z.number().int().min(1).max(MAX_LIST_RUNS).default(5),
  }),
  execute: async (ctx, args) => {
    if (!ctx.userId) throw new Error("No user context");
    const runs = await ctx.runQuery(internal.runs.listRecentInternal, {
      userId: ctx.userId as GenericId<"users">,
      limit: args.limit ?? 5,
    });
    return { runs: runs.map(summarizeRun) };
  },
});

const getRunTool = createTool({
  description: "Get one of the user's runs by id, including its artifact.",
  inputSchema: z.object({ runId: z.string() }),
  execute: async (ctx, args) => {
    if (!ctx.userId) throw new Error("No user context");
    const run = await ctx.runQuery(internal.runs.getRunInternal, {
      runId: args.runId as GenericId<"runs">,
    });
    if (!run || run.userId !== ctx.userId) {
      return { run: null, note: "Run not found in your data." };
    }
    return { run: { ...summarizeRun(run), output: run.output ?? null } };
  },
});

const getDashboardStatsTool = createTool({
  description:
    "Get the user's dashboard stats: total runs, runs today, tokens this month.",
  inputSchema: z.object({}),
  execute: async (ctx) => {
    if (!ctx.userId) throw new Error("No user context");
    return await ctx.runQuery(internal.runs.getStatsInternal, {
      userId: ctx.userId as GenericId<"users">,
    });
  },
});

const getSubscriptionStatusTool = createTool({
  description:
    "Get the user's plan and usage: current plan, runs used today vs the free daily limit, tokens this month.",
  inputSchema: z.object({}),
  execute: async (ctx) => {
    if (!ctx.userId) throw new Error("No user context");
    const userId = ctx.userId as GenericId<"users">;
    const stats = await ctx.runQuery(internal.runs.getStatsInternal, {
      userId,
    });
    const plan = await ctx.runQuery(internal.billing.getUserPlanInternal, {
      userId,
    });
    return {
      plan,
      runsToday: stats.runsToday,
      freeRunsPerDay: plan === "pro" ? null : FREE_RUNS_PER_DAY,
      totalRuns: stats.totalRuns,
      tokensThisMonth: stats.tokensThisMonth,
      note:
        plan === "pro"
          ? "Pro plan: unlimited runs."
          : "Pro upgrades are managed in Billing.",
    };
  },
});

/** Shared needsApproval: persist a pending Confirm Gate record, then pause. */
function gateApproval(toolName: string) {
  return async (ctx: any, input: unknown, options: { toolCallId: string }) => {
    if (!ctx.userId || !ctx.threadId) return true;
    await ctx.runMutation(internal.sigma.recordPendingApproval, {
      userId: ctx.userId,
      threadId: ctx.threadId,
      toolCallId: options.toolCallId,
      toolName,
      args: JSON.stringify(input ?? {}),
    });
    return true;
  };
}

const createRunTool = createTool({
  description:
    "Create a new run for the user. Requires explicit user approval before it executes.",
  inputSchema: z.object({
    instruction: z.string().min(1).max(2000),
  }),
  needsApproval: gateApproval("createRun"),
  execute: async (ctx, args, options) => {
    if (!ctx.userId) throw new Error("No user context");
    // CONFIRM GATE: re-validate the approved record server-side before the
    // business mutation. Never reachable with a pending/denied record.
    await assertApprovedToolCall(
      ctx,
      ctx.userId as GenericId<"users">,
      ctx.threadId,
      options.toolCallId,
      "createRun",
    );
    const runId = await ctx.runMutation(internal.runs.createRunInternal, {
      userId: ctx.userId as GenericId<"users">,
      instruction: args.instruction,
    });
    return { runId: String(runId), status: "queued" };
  },
});

const retryRunTool = createTool({
  description:
    "Re-queue one of the user's failed runs. Requires explicit user approval.",
  inputSchema: z.object({ runId: z.string() }),
  needsApproval: gateApproval("retryRun"),
  execute: async (ctx, args, options) => {
    if (!ctx.userId) throw new Error("No user context");
    await assertApprovedToolCall(
      ctx,
      ctx.userId as GenericId<"users">,
      ctx.threadId,
      options.toolCallId,
      "retryRun",
    );
    await ctx.runMutation(internal.runs.retryRunInternal, {
      userId: ctx.userId as GenericId<"users">,
      runId: args.runId as GenericId<"runs">,
    });
    return { ok: true, runId: args.runId, status: "queued" };
  },
});

const deleteRunTool = createTool({
  description:
    "Permanently delete one of the user's runs. Requires explicit user approval.",
  inputSchema: z.object({ runId: z.string() }),
  needsApproval: gateApproval("deleteRun"),
  execute: async (ctx, args, options) => {
    if (!ctx.userId) throw new Error("No user context");
    await assertApprovedToolCall(
      ctx,
      ctx.userId as GenericId<"users">,
      ctx.threadId,
      options.toolCallId,
      "deleteRun",
    );
    await ctx.runMutation(internal.runs.deleteRunInternal, {
      userId: ctx.userId as GenericId<"users">,
      runId: args.runId as GenericId<"runs">,
    });
    return { ok: true, runId: args.runId };
  },
});

// ---------------------------------------------------------------------------
// The agent
// ---------------------------------------------------------------------------

const providerKind = aiProvider();

export const sigma = new Agent(components.agent, {
  name: "Sigma",
  // Mock mode never reaches the LLM (see sendMessage); the mock model just
  // satisfies the required constructor argument.
  languageModel:
    providerKind === "mock"
      ? mockModel()
      : resolveLanguageModel(providerKind, defaultModelId()),
  instructions: SIGMA_INSTRUCTIONS,
  tools: {
    listRuns: listRunsTool,
    getRun: getRunTool,
    getDashboardStats: getDashboardStatsTool,
    getSubscriptionStatus: getSubscriptionStatusTool,
    createRun: createRunTool,
    retryRun: retryRunTool,
    deleteRun: deleteRunTool,
  },
  stopWhen: stepCountIs(6),
});

// ---------------------------------------------------------------------------
// Threads + messages
// ---------------------------------------------------------------------------

export const createThread = mutation({
  args: { title: v.optional(v.string()) },
  returns: v.string(),
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    const threadId = await sigma.createThread(ctx, {
      userId: viewer,
      title: args.title,
    });
    return threadId;
  },
});

export const listThreads = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    return await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId: viewer,
      order: "desc",
      paginationOpts: args.paginationOpts,
    });
  },
});

/**
 * Reactive message feed for the chat UI (used with `useUIMessages`).
 * Returns full messages plus stream deltas so clients can render live
 * streaming text and tool calls.
 */
export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    await assertThreadOwner(ctx, viewer, args.threadId);
    const paginated = await listUIMessages(ctx, components.agent, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    });
    const streams = await syncStreams(ctx, components.agent, args);
    return { ...paginated, streams };
  },
});

export const stopStream = mutation({
  args: { threadId: v.string(), order: v.number() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    await assertThreadOwner(ctx, viewer, args.threadId);
    return await abortStream(ctx, components.agent, {
      threadId: args.threadId,
      order: args.order,
      reason: "Stopped by user",
    });
  },
});

// ---------------------------------------------------------------------------
// Memory ("What Sigma knows")
// ---------------------------------------------------------------------------

export const listMemories = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("sigmaMemories"),
      content: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const viewer = await requireViewer(ctx);
    const memories = await ctx.db
      .query("sigmaMemories")
      .withIndex("by_userId", (q: any) => q.eq("userId", viewer))
      .collect();
    return memories
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
      .map((memory: any) => ({
        _id: memory._id,
        content: memory.content,
        createdAt: memory.createdAt,
      }));
  },
});

export const deleteMemory = mutation({
  args: { memoryId: v.id("sigmaMemories") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx);
    const memory = await ctx.db.get(args.memoryId);
    if (!memory || memory.userId !== viewer) {
      throw new ConvexError("Memory not found");
    }
    await ctx.db.delete(args.memoryId);
    return null;
  },
});

export const recordMemoryInternal = internalMutation({
  args: { userId: v.id("users"), content: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const content = args.content.trim().slice(0, 200);
    if (!content) return null;
    const existing = await ctx.db
      .query("sigmaMemories")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();
    if (existing.some((memory: any) => memory.content === content)) {
      return null;
    }
    await ctx.db.insert("sigmaMemories", {
      userId: args.userId,
      content,
      createdAt: Date.now(),
    });
    return null;
  },
});

export const listMemoriesInternal = internalQuery({
  args: { userId: v.id("users") },
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    const memories = await ctx.db
      .query("sigmaMemories")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();
    return memories
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map((memory: any) => memory.content);
  },
});

/** Simple, transparent fact extraction — name/preferences style only. */
function extractMemoryFact(prompt: string): string | null {
  const patterns = [
    /\bmy name is ([\p{L}\p{N} '-]{1,40})/iu,
    /\bcall me ([\p{L}\p{N} '-]{1,40})/iu,
    /\bi prefer ([\p{L}\p{N} '-]{1,60})/iu,
  ];
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match?.[1]) {
      const label = pattern.source.includes("prefer")
        ? "Prefers"
        : "Name";
      return `${label}: ${match[1].trim()}`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Chat entry point
// ---------------------------------------------------------------------------

async function instructionsWithMemories(
  ctx: any,
  viewer: GenericId<"users">,
): Promise<string> {
  const memories: string[] = await ctx.runQuery(
    internal.sigma.listMemoriesInternal,
    { userId: viewer },
  );
  if (!memories.length) return SIGMA_INSTRUCTIONS;
  return `${SIGMA_INSTRUCTIONS}\n\nWhat you know about the user (use naturally, don't recite):\n${memories
    .map((memory) => `- ${memory}`)
    .join("\n")}`;
}

function mockReplyForStats(
  stats: {
    totalRuns: number;
    runsToday: number;
    tokensThisMonth: number;
  },
  plan: "free" | "pro",
): string {
  const runsLine =
    plan === "pro"
      ? `- **Runs today:** ${stats.runsToday} (Pro: unlimited)`
      : `- **Runs today:** ${stats.runsToday} (free limit: ${FREE_RUNS_PER_DAY}/day)`;
  return `Here are your current stats:\n\n- **Plan:** ${plan === "pro" ? "Pro" : "Free"}\n${runsLine}\n- **Tokens this month:** ${stats.tokensThisMonth.toLocaleString()}\n\n_Live model responses are disabled — ChadNext is running in demo mode._`;
}

function mockReplyForRuns(runs: any[]): string {
  if (!runs.length) {
    return "You have no runs yet. Create one from the Runs page, or ask me to draft one.";
  }
  const lines = runs
    .map(
      (run) =>
        `- **${run.instruction.slice(0, 60)}${run.instruction.length > 60 ? "…" : ""}** — ${run.status}`,
    )
    .join("\n");
  return `Here are your ${runs.length} most recent runs:\n\n${lines}\n\n_Demo mode: live model responses are disabled._`;
}

/** Deterministic no-key responder: still exercises the read tools. */
async function mockRespond(
  ctx: any,
  viewer: GenericId<"users">,
  threadId: string,
  prompt: string,
): Promise<null> {
  const lowered = prompt.toLowerCase();
  let reply: string;

  if (/\b(create|start|new)\b.*\brun\b|\brun\b.*\b(about|on)\b/.test(lowered)) {
    const afterAbout = prompt.split(/\babout\b/i)[1]?.trim();
    const draftedInstruction = (afterAbout || prompt).slice(0, 2000);
    await ctx.runMutation(internal.sigma.recordPendingApproval, {
      userId: viewer,
      threadId,
      toolCallId: `mock-${Date.now()}-${Math.floor(Math.random() * 1e9)}`,
      toolName: "createRun",
      args: JSON.stringify({ instruction: draftedInstruction }),
    });
    reply = `I've drafted a run for you:\n\n> ${draftedInstruction}\n\nApprove it below and I'll create it. (Demo mode: live model responses are disabled, but the Confirm Gate still applies.)`;
  } else if (/\b(stat|usage|how many|token|plan)\b/.test(lowered)) {
    const stats = await ctx.runQuery(internal.runs.getStatsInternal, {
      userId: viewer,
    });
    const plan = await ctx.runQuery(internal.billing.getUserPlanInternal, {
      userId: viewer,
    });
    reply = mockReplyForStats(stats, plan);
  } else if (/\b(list|show|recent|runs?)\b/.test(lowered)) {
    const runs = await ctx.runQuery(internal.runs.listRecentInternal, {
      userId: viewer,
      limit: 5,
    });
    reply = mockReplyForRuns(runs);
  } else {
    reply = `I'm Sigma, your dashboard assistant. Right now ChadNext is running in **demo mode** — add an AI key (\`VERCEL_AI_GATEWAY_API_KEY\`, \`OPENAI_API_KEY\`, or \`ANTHROPIC_API_KEY\`) to enable live responses.\n\nI can still answer from your data: try "how many runs today?", "show my recent runs", or "my usage". I can also draft a run for you — say "create a run about …" and approve it when prompted.`;
  }

  await saveMessages(ctx, components.agent, {
    threadId,
    userId: viewer,
    messages: [
      { role: "user", content: prompt },
      { role: "assistant", content: reply },
    ],
  });
  return null;
}

export const sendMessage = action({
  args: { threadId: v.string(), prompt: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const viewer = await requireViewerInAction(ctx);
    await assertThreadOwner(ctx, viewer, args.threadId);

    const prompt = args.prompt.trim();
    if (!prompt) throw new ConvexError("Message cannot be empty.");
    if (prompt.length > 4000) {
      throw new ConvexError("Message is too long (max 4000 characters).");
    }

    // Plan-based rate limit (free: 20/hour, pro: 200/hour), branched by
    // plan at send time. Friendly, surfaced in the UI.
    const plan: "free" | "pro" = await ctx.runQuery(
      internal.billing.getUserPlanInternal,
      { userId: viewer },
    );
    const status = await limiter.limit(ctx, sigmaChatLimitName(plan), {
      key: viewer,
      throws: false,
    });
    if (!status.ok) {
      throw new ConvexError(
        `You've reached the Sigma limit of ${SIGMA_CHAT_LIMITS[plan]} messages per hour. ` +
          (plan === "pro"
            ? "Your window resets soon."
            : "Upgrade to Pro on the Billing page for 200 messages per hour."),
      );
    }

    const fact = extractMemoryFact(prompt);
    if (fact) {
      await ctx.runMutation(internal.sigma.recordMemoryInternal, {
        userId: viewer,
        content: fact,
      });
    }

    if (aiProvider() === "mock") {
      return await mockRespond(ctx, viewer, args.threadId, prompt);
    }

    const { thread } = await sigma.continueThread(ctx, {
      threadId: args.threadId,
      userId: viewer,
    });
    await thread.streamText(
      {
        prompt,
        instructions: await instructionsWithMemories(ctx, viewer),
      },
      { saveStreamDeltas: true },
    );
    return null;
  },
});

// ---------------------------------------------------------------------------
// Setup state for the UI (mock banner, model name)
// ---------------------------------------------------------------------------

export const getChatStatus = query({
  args: {},
  returns: v.object({
    provider: v.string(),
    mock: v.boolean(),
    model: v.string(),
  }),
  handler: async () => {
    const provider = aiProvider();
    return {
      provider,
      mock: provider === "mock",
      model: defaultModelId(),
    };
  },
});
