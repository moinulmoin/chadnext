import { createAnthropic } from "@ai-sdk/anthropic";
import { createGateway } from "@ai-sdk/gateway";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, type GenericId, v } from "convex/values";

import { internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { aiProvider, defaultModelId, type AIProviderKind } from "./aiConfig";
import { FREE_RUNS_PER_DAY } from "./limits";

const MAX_INSTRUCTION_LENGTH = 2000;

const SYSTEM_PROMPT =
  "You are a helpful assistant embedded in a SaaS product. Produce a concise, well-structured markdown answer to the user's instruction.";

// Rough display-only blend across models; per-model pricing lands with the
// P4 billing wiring.
const ESTIMATED_COST_CENTS_PER_1K_TOKENS = 1;

const runValidator = v.object({
  _id: v.id("runs"),
  _creationTime: v.number(),
  userId: v.id("users"),
  instruction: v.string(),
  status: v.union(
    v.literal("queued"),
    v.literal("running"),
    v.literal("succeeded"),
    v.literal("failed"),
  ),
  output: v.optional(v.string()),
  errorMessage: v.optional(v.string()),
  tokensUsed: v.number(),
  costCents: v.number(),
  model: v.string(),
  createdAt: v.number(),
  completedAt: v.optional(v.number()),
});

function requireUserId(ctx: unknown): GenericId<"users"> {
  const userId = (ctx as { userId?: GenericId<"users"> }).userId;
  if (!userId) {
    throw new ConvexError("Unauthorized");
  }
  return userId;
}

function startOfUtcDay(time = Date.now()): number {
  const now = new Date(time);
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function startOfUtcMonth(time = Date.now()): number {
  const now = new Date(time);
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function mockArtifact(instruction: string): string {
  return `# Mock Run

**You asked:**

> ${instruction}

This is deterministic mock output so the full run loop works with zero API keys. ChadNext runs in mock mode because no AI provider key is configured.

In real mode, the finished artifact would appear here: a concise, well-structured markdown answer produced by the configured model (Vercel AI Gateway → OpenAI → Anthropic priority). Everything else behaves identically in both modes — the status machine (queued → running → succeeded/failed), token and cost metering, the artifact viewer, retry, and the free-tier daily run limit.

Add \`VERCEL_AI_GATEWAY_API_KEY\` (or \`OPENAI_API_KEY\` / \`ANTHROPIC_API_KEY\`) to your deployment env to switch future runs to a real model.`;
}

function resolveLanguageModel(provider: AIProviderKind, modelId: string) {
  switch (provider) {
    case "gateway":
      return createGateway()(modelId);
    case "openai":
      return createOpenAI()(modelId);
    case "anthropic":
      return createAnthropic()(modelId);
    default:
      throw new ConvexError("No AI provider configured");
  }
}

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: v.object({
    page: v.array(runValidator),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);

    return await ctx.db
      .query("runs")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const get = query({
  args: { runId: v.id("runs") },
  returns: v.union(runValidator, v.null()),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const run = await ctx.db.get(args.runId);

    if (!run || run.userId !== userId) {
      return null;
    }

    return run;
  },
});

export const getStats = query({
  args: {},
  returns: v.object({
    totalRuns: v.number(),
    runsToday: v.number(),
    tokensThisMonth: v.number(),
  }),
  handler: async (ctx) => {
    const userId = requireUserId(ctx);
    const runs = await ctx.db
      .query("runs")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .collect();

    const monthStart = startOfUtcMonth();
    const dayStart = startOfUtcDay();

    return {
      totalRuns: runs.length,
      runsToday: runs.filter((run: any) => run.createdAt >= dayStart).length,
      tokensThisMonth: runs
        .filter((run: any) => run.createdAt >= monthStart)
        .reduce((sum: number, run: any) => sum + run.tokensUsed, 0),
    };
  },
});

export const createRun = mutation({
  args: { instruction: v.string() },
  returns: v.id("runs"),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const instruction = args.instruction.trim();

    if (instruction.length < 1 || instruction.length > MAX_INSTRUCTION_LENGTH) {
      throw new ConvexError(
        `Instruction must be between 1 and ${MAX_INSTRUCTION_LENGTH} characters.`,
      );
    }

    const dayStart = startOfUtcDay();
    const runs = await ctx.db
      .query("runs")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .collect();
    const runsToday = runs.filter((run: any) => run.createdAt >= dayStart).length;

    if (runsToday >= FREE_RUNS_PER_DAY) {
      throw new ConvexError(
        `Free plan limited to ${FREE_RUNS_PER_DAY} runs per day. Upgrade to Pro for unlimited runs.`,
      );
    }

    return await ctx.db.insert("runs", {
      userId,
      instruction,
      status: "queued",
      tokensUsed: 0,
      costCents: 0,
      model: defaultModelId(),
      createdAt: Date.now(),
    });
  },
});

export const retryRun = mutation({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const run = await ctx.db.get(args.runId);

    if (!run || run.userId !== userId) {
      throw new ConvexError("Run not found");
    }
    if (run.status !== "failed") {
      throw new ConvexError("Only failed runs can be retried.");
    }

    await ctx.db.patch(args.runId, {
      status: "queued",
      errorMessage: undefined,
    });
    return null;
  },
});

export const deleteRun = mutation({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const run = await ctx.db.get(args.runId);

    if (!run || run.userId !== userId) {
      throw new ConvexError("Run not found");
    }

    await ctx.db.delete(args.runId);
    return null;
  },
});

export const processRun = action({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = requireUserId(ctx);
    const run = await ctx.runQuery(internal.runs.getRunInternal, {
      runId: args.runId,
    });

    if (!run || run.userId !== userId) {
      throw new ConvexError("Run not found");
    }
    if (run.status !== "queued") {
      // The client trigger is fire-and-forget; ignore double-fires.
      return null;
    }

    await ctx.runMutation(internal.runs.setRunRunning, { runId: args.runId });

    const provider = aiProvider();
    try {
      let output: string;
      let tokensUsed: number;
      let costCents = 0;

      if (provider === "mock") {
        output = mockArtifact(run.instruction);
        tokensUsed = estimateTokens(`${run.instruction} ${output}`);
      } else {
        const result = await generateText({
          model: resolveLanguageModel(provider, defaultModelId()),
          system: SYSTEM_PROMPT,
          prompt: run.instruction,
        });
        output = result.text;
        tokensUsed =
          result.usage?.totalTokens ??
          estimateTokens(`${run.instruction} ${output}`);
        costCents = Math.ceil(
          (tokensUsed / 1000) * ESTIMATED_COST_CENTS_PER_1K_TOKENS,
        );
      }

      await ctx.runMutation(internal.runs.completeRun, {
        runId: args.runId,
        output,
        tokensUsed,
        costCents,
      });
    } catch (error) {
      await ctx.runMutation(internal.runs.failRun, {
        runId: args.runId,
        errorMessage:
          error instanceof Error ? error.message : "Run processing failed.",
      });
    }

    return null;
  },
});

export const getRunInternal = internalQuery({
  args: { runId: v.id("runs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.runId);
  },
});

export const setRunRunning = internalMutation({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.runId, { status: "running" });
    return null;
  },
});

export const completeRun = internalMutation({
  args: {
    runId: v.id("runs"),
    output: v.string(),
    tokensUsed: v.number(),
    costCents: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.runId, {
      status: "succeeded",
      output: args.output,
      tokensUsed: args.tokensUsed,
      costCents: args.costCents,
      errorMessage: undefined,
      completedAt: Date.now(),
    });
    return null;
  },
});

export const failRun = internalMutation({
  args: { runId: v.id("runs"), errorMessage: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.runId, {
      status: "failed",
      errorMessage: args.errorMessage,
      completedAt: Date.now(),
    });
    return null;
  },
});
