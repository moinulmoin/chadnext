/* eslint-disable @typescript-eslint/no-explicit-any
   -- loose ctx/any types until `npx convex dev` generates the real
   codegen; mirrors the established pattern across convex/. */

import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { defaultModelId } from "./aiConfig";
import { authComponent } from "./auth";

/**
 * Demo data so a fresh install shows a lived-in dashboard.
 *
 * The mutation is auth'd and inserts ONLY runs owned by the caller. Guard:
 * no-op once the user has >= 3 runs (never touches real data). Reactive
 * subscriptions pick the rows up immediately — no manual refetch needed.
 */

const MIN_RUNS_BEFORE_SEED = 3;

type DemoRun = {
  instruction: string;
  status: "succeeded" | "failed";
  /** Short markdown artifact, mirroring what processRun stores. */
  output?: string;
  errorMessage?: string;
  tokensUsed: number;
};

const DEMO_RUNS: DemoRun[] = [
  {
    instruction: "Write a launch tweet for our AI run-loop feature",
    status: "succeeded",
    output: `# Launch Tweet

🚀 Just shipped the AI job loop: submit → watch it stream → keep the artifact.

- Live status (queued → running → done)
- Token + cost metering on every run
- Re-run any past run in one click

Ship your AI SaaS faster than fast.`,
    tokensUsed: 214,
  },
  {
    instruction:
      "Summarize the trade-offs between Convex and Postgres for a small SaaS",
    status: "succeeded",
    output: `# Convex vs Postgres for a small SaaS

**Convex**
- Reactive queries: UI updates without a polling layer
- Server functions with end-to-end types; no REST layer to maintain
- Managed: backups, scaling and scheduling included

**Postgres**
- Mature ecosystem: ORMs, migrations, analytics tooling
- Full SQL for ad-hoc reporting and complex joins
- Portable across every host

**Rule of thumb:** pick Convex when product speed and reactive UI dominate; pick Postgres when complex querying or portability dominates.`,
    tokensUsed: 486,
  },
  {
    instruction: "Draft a friendly onboarding email for day-1 users",
    status: "succeeded",
    output: `# Onboarding Email (Day 1)

**Subject:** Welcome aboard 👋

Hi {{name}},

You're in! Here are three things worth trying today:

1. Submit your first run and watch it process live.
2. Ask Sigma about your usage — it can see your own data only.
3. Explore the billing page to see plan limits up front.

Reply to this email if anything feels off — a human reads every message.`,
    tokensUsed: 302,
  },
  {
    instruction:
      "Generate a changelog entry for the Sigma confirm-gate release",
    status: "succeeded",
    output: `# Changelog — Sigma Confirm Gate

## Added
- Server-enforced approval flow for every Sigma write action
- Approve/deny cards rendered inline in chat
- "What Sigma knows" transparency panel in Settings

## Security
- Gated tools physically cannot execute without a user-created approval record; denial leaves zero trace.`,
    tokensUsed: 261,
  },
  {
    instruction: "Produce a Q3 outline for our developer blog",
    status: "failed",
    errorMessage:
      "Model request failed after retries: upstream provider timeout.",
    tokensUsed: 0,
  },
  {
    instruction: "Suggest 5 names for a usage-metering side project",
    status: "succeeded",
    output: `# Name Ideas

1. **Meterly** — metering as a product, said out loud
2. **Tokenbarn** — where your tokens are counted
3. **Quotable** — quotas, but friendly
4. **Usagee** — usage with an extra "e" for extra clarity
5. **Centy** — cents-first cost tracking`,
    tokensUsed: 158,
  },
];

/** Reuses the auth-derived viewer resolution pattern from runs.ts. */
async function requireViewer(ctx: unknown) {
  const authUser = await authComponent.safeGetAuthUser(ctx as any);
  if (!authUser) {
    throw new Error("Unauthorized");
  }
  const user = await (ctx as { db: any }).db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", authUser.email))
    .first();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export const seedDemoRuns = mutation({
  args: {},
  returns: v.object({ inserted: v.number() }),
  handler: async (ctx) => {
    const user = await requireViewer(ctx);

    const existing = await ctx.db
      .query("runs")
      .withIndex("by_userId", (q: any) => q.eq("userId", user._id))
      .collect();
    if (existing.length >= MIN_RUNS_BEFORE_SEED) {
      return { inserted: 0 };
    }

    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    // Offsets spread across ~3 days so stats/history look lived-in.
    const createdOffsets = [
      2.6 * DAY,
      2.1 * DAY,
      1.4 * DAY,
      0.9 * DAY,
      0.2 * DAY,
      0.03 * DAY,
    ];
    const model = defaultModelId();

    for (let i = 0; i < DEMO_RUNS.length; i++) {
      const demo = DEMO_RUNS[i];
      const createdAt = Math.round(now - createdOffsets[i]);
      await ctx.db.insert("runs", {
        userId: user._id,
        instruction: demo.instruction,
        status: demo.status,
        // Optional fields accept undefined (stored as absent).
        output: demo.output,
        errorMessage: demo.errorMessage,
        tokensUsed: demo.tokensUsed,
        costCents: Math.ceil(demo.tokensUsed / 1000),
        model,
        createdAt,
        // Seeded runs are terminal (succeeded/failed) — mirror completeRun/
        // failRun, which stamp completion ~immediately after creation.
        completedAt: createdAt + 30_000,
      });
    }

    // Touch nothing else: stats and lists recompute reactively.
    return { inserted: DEMO_RUNS.length };
  },
});
