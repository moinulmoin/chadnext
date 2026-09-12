/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/any types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import { generateText } from "ai";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, type GenericId, v } from "convex/values";

import { internal } from "./_generated/api";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import {
  aiProvider,
  defaultModelId,
  resolveLanguageModel,
} from "./aiConfig";
import { authComponent } from "./auth";
import { FREE_RUNS_PER_DAY } from "./limits";
import { limiter } from "./rateLimiter";

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
  isSeed: v.optional(v.boolean()),
});

const statsValidator = v.object({
  totalRuns: v.number(),
  runsToday: v.number(),
  tokensThisMonth: v.number(),
});

/**
 * Resolve the signed-in app user (better-auth identity → users row).
 * Works in query/mutation contexts; actions resolve via
 * `internal.users.getUserIdInternal` (scheduler/action contexts carry no auth).
 */
async function requireUserId(ctx: unknown): Promise<GenericId<"users">> {
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

function startOfUtcDay(time = Date.now()): number {
  const now = new Date(time);
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function startOfUtcMonth(time = Date.now()): number {
  const now = new Date(time);
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
}

/** UTC calendar day as "YYYY-MM-DD" — the usageCounters bucket key. */
function utcDayString(time = Date.now()): string {
  const now = new Date(time);
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(
    now.getUTCDate(),
  ).padStart(2, "0")}`;
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

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: v.object({
    page: v.array(runValidator),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

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
    const userId = await requireUserId(ctx);
    const run = await ctx.db.get(args.runId);

    if (!run || run.userId !== userId) {
      return null;
    }

    return run;
  },
});

export const getStats = query({
  args: {},
  returns: statsValidator,
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return await ctx.runQuery(internal.runs.getStatsInternal, { userId });
  },
});

export const createRun = mutation({
  args: { instruction: v.string() },
  returns: v.id("runs"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    // Abuse guard independent of plan quota (30/hour): a burst of creates
    // still respects the free daily cap below, but never hammers processing.
    const status = await limiter.limit(ctx, "runCreation", {
      key: userId,
      throws: false,
    });
    if (!status.ok) {
      throw new ConvexError(
        "Too many runs created in the last hour — try again a bit later.",
      );
    }

    return await ctx.runMutation(internal.runs.createRunInternal, {
      userId,
      instruction: args.instruction,
    });
  },
});

export const retryRun = mutation({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.runMutation(internal.runs.retryRunInternal, {
      userId,
      runId: args.runId,
    });
  },
});

export const deleteRun = mutation({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await ctx.runMutation(internal.runs.deleteRunInternal, {
      userId,
      runId: args.runId,
    });
  },
});

/**
 * Shared run loop: claim the run (queued → running, compare-and-set), then
 * generate and persist the outcome. The loser of the claim (another
 * dispatcher already won) aborts BEFORE any LLM call, so double dispatch
 * never doubles spend; completeRun/failRun ignore non-running runs so the
 * reaper's terminal states can never be overwritten by a late finisher.
 */
async function runRunLoop(ctx: any, runId: GenericId<"runs">): Promise<null> {
  const run = await ctx.runQuery(internal.runs.getRunInternal, { runId });
  if (!run || run.status !== "queued") {
    return null; // Deleted, or already claimed/finished — nothing to do.
  }

  const claimed = await ctx.runMutation(internal.runs.setRunRunning, {
    runId,
  });
  if (!claimed) {
    return null; // Lost the claim race; the winner owns this run.
  }

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
      runId,
      output,
      tokensUsed,
      costCents,
    });
  } catch (error) {
    await ctx.runMutation(internal.runs.failRun, {
      runId,
      errorMessage:
        error instanceof Error ? error.message : "Run processing failed.",
    });
  }

  return null;
}

/** UI path: the signed-in owner fires processing for their own run. */
export const processRun = action({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await ctx.runQuery(internal.users.getUserIdInternal, {});
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }
    const run = await ctx.runQuery(internal.runs.getRunInternal, {
      runId: args.runId,
    });

    if (!run || run.userId !== userId) {
      throw new ConvexError("Run not found");
    }

    return await runRunLoop(ctx, args.runId);
  },
});

/**
 * Scheduler path (Sigma's gated createRun/retryRun, the stuck-run reaper):
 * no viewer context — the run document itself identifies the owner, and the
 * claim in runRunLoop makes concurrent invocations safe.
 */
export const processRunInternal = internalAction({
  args: { runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    return await runRunLoop(ctx, args.runId);
  },
});

/**
 * Business logic below is owned by runs.ts and takes an explicit userId so
 * both the UI path (auth-derived) and the Sigma path (Confirm-Gate-approved,
 * scheduler-invoked) reuse it without duplication.
 */

export const getStatsInternal = internalQuery({
  args: { userId: v.id("users") },
  returns: statsValidator,
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("runs")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
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

export const listRecentInternal = internalQuery({
  args: { userId: v.id("users"), limit: v.number() },
  returns: v.array(runValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("runs")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit);
  },
});

export const createRunInternal = internalMutation({
  args: { userId: v.id("users"), instruction: v.string() },
  returns: v.id("runs"),
  handler: async (ctx, args) => {
    const instruction = args.instruction.trim();

    if (instruction.length < 1 || instruction.length > MAX_INSTRUCTION_LENGTH) {
      throw new ConvexError(
        `Instruction must be between 1 and ${MAX_INSTRUCTION_LENGTH} characters.`,
      );
    }

    const plan = await ctx.runQuery(internal.billing.getUserPlanInternal, {
      userId: args.userId,
    });

    // Plan-gated quota (Free = 10 runs/day, Pro = unlimited), counted by an
    // immutable per-day usage counter: deleting live rows can't rewind it.
    // Seeded demo runs never touch the counter.
    const day = utcDayString();
    const counter = await ctx.db
      .query("usageCounters")
      .withIndex("by_userId_and_day", (q: any) =>
        q.eq("userId", args.userId).eq("day", day),
      )
      .first();

    if (plan !== "pro") {
      if ((counter?.runsCreated ?? 0) >= FREE_RUNS_PER_DAY) {
        throw new ConvexError(
          `Free plan limited to ${FREE_RUNS_PER_DAY} runs per day. Upgrade to Pro for unlimited runs — see the Billing page.`,
        );
      }
      if (counter) {
        await ctx.db.patch(counter._id, { runsCreated: counter.runsCreated + 1 });
      } else {
        await ctx.db.insert("usageCounters", {
          userId: args.userId,
          day,
          runsCreated: 1,
        });
      }
    }

    return await ctx.db.insert("runs", {
      userId: args.userId,
      instruction,
      status: "queued",
      tokensUsed: 0,
      costCents: 0,
      model: defaultModelId(),
      createdAt: Date.now(),
    });
  },
});

export const retryRunInternal = internalMutation({
  args: { userId: v.id("users"), runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);

    if (!run || run.userId !== args.userId) {
      throw new ConvexError("Run not found");
    }
    if (run.status !== "failed") {
      throw new ConvexError("Only failed runs can be retried.");
    }

    // A retry re-spends tokens, so it counts against the free daily quota
    // the same way a fresh run does (checked + incremented atomically here).
    const plan = await ctx.runQuery(internal.billing.getUserPlanInternal, {
      userId: args.userId,
    });
    if (plan !== "pro") {
      const day = utcDayString();
      const counter = await ctx.db
        .query("usageCounters")
        .withIndex("by_userId_and_day", (q: any) =>
          q.eq("userId", args.userId).eq("day", day),
        )
        .first();
      if ((counter?.runsCreated ?? 0) >= FREE_RUNS_PER_DAY) {
        throw new ConvexError(
          `Free plan limited to ${FREE_RUNS_PER_DAY} runs per day (retries included). Upgrade to Pro for unlimited runs — see the Billing page.`,
        );
      }
      if (counter) {
        await ctx.db.patch(counter._id, { runsCreated: counter.runsCreated + 1 });
      } else {
        await ctx.db.insert("usageCounters", {
          userId: args.userId,
          day,
          runsCreated: 1,
        });
      }
    }

    await ctx.db.patch(args.runId, {
      status: "queued",
      errorMessage: undefined,
    });

    // Self-healing: schedule processing so the retry never sits queued
    // waiting for a client trigger or the reaper.
    await ctx.scheduler.runAfter(0, internal.runs.processRunInternal, {
      runId: args.runId,
    });
    return null;
  },
});

export const deleteRunInternal = internalMutation({
  args: { userId: v.id("users"), runId: v.id("runs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);

    if (!run || run.userId !== args.userId) {
      throw new ConvexError("Run not found");
    }

    await ctx.db.delete(args.runId);
    return null;
  },
});

export const getRunInternal = internalQuery({
  args: { runId: v.id("runs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.runId);
  },
});

/**
 * Compare-and-set claim: transitions queued → running and returns whether
 * THIS caller won. Losers must abort before any LLM work (see runRunLoop).
 */
export const setRunRunning = internalMutation({
  args: { runId: v.id("runs") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.status !== "queued") {
      return false;
    }
    await ctx.db.patch(args.runId, { status: "running" });
    return true;
  },
});

/** Terminal-state guard: only a claimed ("running") run can complete. */
export const completeRun = internalMutation({
  args: {
    runId: v.id("runs"),
    output: v.string(),
    tokensUsed: v.number(),
    costCents: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.status !== "running") {
      return null; // E.g. the reaper already failed it; never overwrite.
    }
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

/** Terminal-state guard: only a claimed ("running") run can fail. */
export const failRun = internalMutation({
  args: { runId: v.id("runs"), errorMessage: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run || run.status !== "running") {
      return null;
    }
    await ctx.db.patch(args.runId, {
      status: "failed",
      errorMessage: args.errorMessage,
      completedAt: Date.now(),
    });
    return null;
  },
});

/**
 * Stuck-run reaper, driven by the cron in convex/crons.ts. (a) Fails runs
 * whose action died mid-flight (running > 10 min) — the guarded
 * completeRun/failRun above make this safe even if the original action is
 * somehow still alive. (b) Re-dispatches queued runs older than 2 min so a
 * dropped client trigger or missed schedule self-heals.
 */
export const reapStuckRuns = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const now = Date.now();
    const MINUTE = 60 * 1000;

    const staleRunning = await ctx.db
      .query("runs")
      .withIndex("by_status_and_createdAt", (q: any) =>
        q.eq("status", "running").lt("createdAt", now - 10 * MINUTE),
      )
      .collect();
    for (const run of staleRunning) {
      await ctx.db.patch(run._id, {
        status: "failed",
        errorMessage: "Timed out",
        completedAt: now,
      });
    }

    const staleQueued = await ctx.db
      .query("runs")
      .withIndex("by_status_and_createdAt", (q: any) =>
        q.eq("status", "queued").lt("createdAt", now - 2 * MINUTE),
      )
      .collect();
    for (const run of staleQueued) {
      await ctx.scheduler.runAfter(0, internal.runs.processRunInternal, {
        runId: run._id,
      });
    }

    return null;
  },
});
