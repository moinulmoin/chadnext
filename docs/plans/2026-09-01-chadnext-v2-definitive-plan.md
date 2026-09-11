# ChadNext v2 — The Definitive Plan (One Plan, No More Shifting)

**Date:** 2026-09-01
**Status:** STACK LOCKED — Convex + Vercel + Polar + AI SDK v7 via Vercel AI Gateway. Ready to build.
**Supersedes:** All prior planning docs (`.sisyphus/plans/*`, `docs/plans/2026-04-28-001-*` become historical)

---

## 1. Positioning (locked)

> **ChadNext — the agent-native SaaS chassis.**
> Fork it, swap the noun, ship. Your AI coding agent builds it. Your users get Sigma.
>
> *"Jobs that do work. An agent that acts safely. Both loops every AI app must build — pre-wired."*

- **Model:** Free & open source (MIT) for v2. Pro (paid) later, after traction.
- **Audience:** Solo devs / indie hackers shipping AI-native SaaS fast. NOT enterprise.
- **Agent-native three ways:** built BY agents (AGENTS.md) · runs an agent (Sigma) · serves agents (MCP, Phase 2).

## 2. The two universal loops (the product's reason to exist)

Every 2026 AI app must build these. We ship both.

1. **The AI Job Loop** (product side): submit → queue → work (streamed) → artifact → meter → iterate.
2. **The Approved-Action Loop / "Confirm Gate"** (agent side): intent → proposal → server-enforced human confirmation → execution → rendered result.

## 3. Research-backed feature checklist → V2 answer

What users/buyers of AI-native apps now expect (2026 consensus), mapped to what V2 ships:

| # | 2026 expectation (research) | ChadNext V2 answer | Status |
|---|---|---|---|
| 1 | Streaming responses, interruptible + regenerate | Sigma chat: streaming via AI SDK, stop/regenerate controls | new |
| 2 | Artifacts — outputs users keep, not chat prose | Runs produce viewable artifacts (markdown output, re-runnable) | new |
| 3 | "Show your work" trust: progress, provenance | Run status machine (queued→running→done/failed) streaming live; tool-call cards name the data source | new |
| 4 | Agentic — do, not just answer | Sigma: 7 tools, reads auto-run, writes behind Confirm Gate (server-enforced, not prompt-deep) | new |
| 5 | Memory/personalization as baseline (no longer premium) | Convex Agent built-in memory + "What Sigma knows" transparency panel | new |
| 6 | Transparent usage limits + tiers | Billing page: usage meters (runs/day, tokens/mo), Free/Pro, enforced rate limits | new |
| 7 | Fast first token / latency | Streaming-first UX; Convex reactive updates | new |
| 8 | Feedback capture (thumbs) | 👍/👎 on run artifacts (light: two buttons + one mutation) | new (small) |
| 9 | BYOK — bring your own key | v2.0: app-level provider config (OpenAI/Anthropic via env). Per-user BYOK → **Pro** | partial |
| 10 | Usage metering economics | Per-run token/cost tracking, displayed. Fixed-tier billing only (guardrail); usage-based billing → future | new |
| 11 | Fast time-to-first-AI-value | Zero-config demo mode: runs work via deterministic mock with NO API keys | new |
| 12 | MCP everywhere | Phase 2: app **as** MCP server (out-bound). User-connects-connectors (in-bound) → **Pro** | deferred |
| 13 | Account/billing/landing commodity layer | Auth (GitHub+OTP), Polar Free/Pro, landing, docs, PWA, SEO | ~90% exists |

## 4. The demo noun: Runs (replaces Projects)

"Projects" was 2015 passive-record energy. The V2 noun is the AI run itself:

```
runs: userId, instruction, status(queued|running|succeeded|failed),
      output(artifact), tokensUsed, costCents, model, createdAt, completedAt
      indexes: by_userId, by_status
```

- Free plan limit becomes **runs/day + token metering** (upgrade prompt fires at moment of value).
- Existing Projects CRUD code is migrated/reworked into Runs CRUD (pattern identical).
- No-key mode: deterministic mock processing so the entire loop demos with zero config.
- Fork story unchanged: **"swap the noun"** recipe — AI-app forkers get the job loop pre-built; passive-domain forkers delete async machinery.

## 5. Sigma — the in-app agent

A dashboard assistant scoped to the logged-in user's data. NOT RAG, NOT a general chatbot, NOT a connectors hub.

- **7 tools** — reads (auto-run): `listRuns`, `getRun`, `getDashboardStats`, `getSubscriptionStatus` · writes (gated): `createRun`, `retryRun`, `archiveRun`
- **Confirm Gate:** mutations physically cannot execute without an approval record written by the user's click. Adversarial test case included (agent attempts ungated write).
- **Generative UI:** answers render as live components — run table w/ status pills, artifact viewer, usage meter card (AI SDK tool→component mapping).
- **Memory:** profile, plan, preferences. Transparency panel in Settings (view/edit/delete).
- **Ambient:** greeting + suggestion card on Home; ⌘K "ask Sigma"; per-page "Ask about this". Proactive cron nudges → v2.1.
- **Graceful states:** no API key (setup guidance + mock runs), quota exceeded (upgrade path), unauthenticated (redirect).

## 6. Tech stack (LOCKED — confirmed 2026-09-01)

Selection criterion (user's): **easy to deploy and manage, not free-tier chasing — builders focus on the product, not CI/CD.**

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16.3 (upgrade from 16.1.6 — critical security patch) + Tailwind 4 + shadcn/ui | current, agent-known |
| Backend | **Convex** (Cloud) | reactive queries, Agent component (threads/memory/streaming), 5 components already wired; Starter plan pay-as-you-go; fully managed = zero ops |
| Hosting | **Vercel** (monolith, default) — CONFIRMED | 1-click, preview deploys, OIDC AI Gateway auth (zero-key deploys); frontend portable later via docs recipes |
| Auth | better-auth (GitHub + Email OTP) | code exists |
| Billing | **Polar.sh** — CONFIRMED | MoR handles VAT/sales tax; fixed tiers; component registered |
| AI | **AI SDK v7 (stable June 2026) + Vercel AI Gateway** — CONFIRMED | one key → hundreds of models, zero token markup, $5/mo free credits, OIDC on Vercel. Requires upgrade: `ai@6→7`, `@convex-dev/agent 0.3→0.7+` (`system`→`instructions` migration). Direct OpenAI/Anthropic keys documented as fallback |
| Email | Resend (OTP/welcome/subscription) | templates exist; wire triggers |
| Agent guidance | AGENTS.md canonical + CLAUDE.md/.cursor/rules pointers | Claude Code, Cursor, Codex |

### Complete product integration checklist ("what else a good codebase needs")

| Integration | Decision | Ships |
|---|---|---|
| Auth | better-auth GitHub+OTP | re-verify live |
| Database/files/crons | Convex (+ file storage + `crons.ts` infra for v2.1 proactive) | crons infra in P2 |
| Billing | Polar checkout/portal/webhooks + VAT via MoR | P4 |
| Email | Resend triggers | P5 |
| AI | Gateway provider (`VERCEL_AI_GATEWAY_API_KEY`); direct-key fallback documented | P1 wiring |
| Rate limiting | @convex-dev/rate-limiter | P3 |
| Analytics/errors/AI-obs | **PostHog** (LOCKED) — 3 modules wired by default: product analytics · error tracking (auto-captures LLM errors) · AI Observability (LLM traces: tokens/cost/latency/tool-calls + evals + anomaly alerts). Session replay + feature flags = same SDK, documented config toggles — flip on when wanted, zero code. Gracefully-optional (no key = no tracking). Free: 1M events/mo | P5 |
| Observability/errors | **PostHog covers it** (error tracking + AI observability). AI SDK v7 telemetry as the always-on floor. Sentry/Langfuse = docs recipes only, NOT wired | P5 |
| Data layer | **TanStack Query + Convex official adapter** (`@convex-dev/react-query`, `convexQuery`) — LOCKED as the default data layer: live Convex subscriptions managed as TanStack queries → forkers get the DX they already know, one devtools/cache story for Convex + any external APIs, suspense patterns for React 19. Native `convex/react` `useQuery` documented as the lighter alternative. **TanStack Table** for the Runs table (shadcn DataTable) | P2 |
| Env validation | **`@t3-oss/env-nextjs`** (LOCKED) — zod-based, client/server/shared schemas, catches leaked NEXT_PUBLIC_ | P1 |
| CI/CD | **GitHub Actions** (LOCKED): minimal lint+typecheck+build on PR. Convex deploy via CLI (documented). Nothing exotic — "don't fix CI/CD" | P6 |
| Cron/jobs | **Convex `crons.ts`** (LOCKED) — native, no external scheduler; powers v2.1 proactive nudges; infra lands in P2 | P2 |
| Security | next.config headers; Polar webhook signature verification; CORS on httpActions | baked into P3/P4 |
| Legal | Placeholder privacy/terms pages (footer links) | P5, optional |

## 7. Build order (execution phases)

| Phase | Tasks | Size |
|---|---|---|
| **P1 Foundation** | Next 16.1.6→16.3 (security patch) · `ai@6→7` + `@convex-dev/agent→0.7+` (system→instructions) · Vercel AI Gateway provider wiring (gateway key + direct-key fallback) · `@t3-oss/env-nextjs` env module · `@convex-dev/react-query` adapter + QueryClientProvider (TanStack data layer) · AGENTS.md v1 + CLAUDE.md/.cursor/rules pointers · delete stale `.cursorrules`/`.windsurfrules` · build green | S-M |
| **P2 Runs Loop** | Schema Projects→Runs (runs table, by_userId/by_status indexes) · CRUD + ownership checks · status machine queued/running/succeeded/failed · processing action (real via Gateway; deterministic mock no-key mode) · live status via reactivity · artifacts + viewer · tokensUsed/costCents metering · free-tier runs/day limit + upgrade prompt · `crons.ts` infra · Runs table UI on TanStack Table (shadcn DataTable) · Runs pages + Home stats | M-L |
| **P3 Sigma** | Agent definition (instructions, model via Gateway) · 7 tools (reads: listRuns, getRun, getDashboardStats, getSubscriptionStatus · gated: createRun, retryRun, archiveRun) · Confirm Gate server-enforced + adversarial test · chat UI (threads, streaming, stop/regenerate, @shadcn/helpers) · generative UI (run table w/ status pills, artifact viewer, usage meter) · memory + "What Sigma knows" panel · per-plan rate limits · graceful states (no-key/quota/unauth) · ⌘K entry + Home greeting card | L |
| **P4 Money** | Polar checkout + portal + webhooks (signature verified) · billing page (plan + usage meters runs/day & tokens/mo) · plan→quota enforcement wiring · subscription email trigger | M |
| **P5 Wiring & Polish** | Email triggers (OTP wired, welcome on signup) · PostHog 3 modules (analytics, error tracking, AI observability — gracefully optional) · design refresh (bento features, functional motion, agent-native hero) · AGENTS.md recipes ("Swap the Noun", "Add a Tool") + **Design Sourcing section** (blessed registries + aesthetic tokens so coding agents keep design coherent) · **seed/demo data** (dashboards look alive for docs + demo video) · fonts (Geist) · legal stub pages · dead links fixed · Fumadocs overhaul | S-M |
| **P6 Verify & Launch** | E2E vs live Convex (user runs `npx convex dev`) · prove all flows (auth, runs, gate, billing) · README/landing rewrite (positioning) · "agent builds a feature in 10 min" demo video · GitHub Actions CI (lint+typecheck+build) · example.env audit · repo cosmetics (badges, social preview, issue templates, CONTRIBUTING) · launch checklist (HN, r/nextjs, Product Hunt) · tag v2.0 | M |

### Design sourcing strategy (assembly over invention)

**Tier 1 — Official shadcn foundation** (default source): core components (installed) · **official chat components (June 2026: Message, Bubble, MessageScroller, Attachment, Marker) → Sigma's chat UI** · official **blocks** (dashboard/sidebar/login skeletons) · **shadcn charts** (recharts) → stats + usage meters

**Tier 2 — Registries for pieces**: **21st.dev** (aggregator: 1,000+ components, 133 libraries; agent-installable) · **Origin UI** (polished primitives) · **Magic UI** (animated landing pieces: hero, marquee, blur-fade; Aceternity sparingly) · **tweakcn** (theme tokens → dark techno-futurist palette) · **agent-UI primitives** from the awesome-shadcn-ui ecosystem (tool-call cards, streaming markdown, input bar → Sigma's tool/approval cards)

**Tier 3 — Full-app OSS references** (inspiration, not deps): shadcn Taxonomy (official showcase) · shadcn-admin (dashboard + TanStack Table) · next-saas-stripe-starter (landing+dashboard SaaS)

**Tier 4 — Aesthetic direction**: techno-futurist dark (Linear, Vercel, Resend, Inngest as references) · galleries: godly.website, land-book, SaaSFrame, saaspo/bento · bento grids for features · functional motion only, `prefers-reduced-motion` respected

Then: **v2.1** (proactive cron nudges, feedback aggregation) → **Phase 2** (MCP-out via the Convex-MCP gateway pattern — expose selected typed Convex functions as scoped, OAuth'd, audit-logged MCP tools, so external agents operate the deployed product; no OpenAPI intermediate needed since contracts flow from Convex types. OpenAPI-from-Zod as a docs recipe for REST consumers. Deploy-anywhere docs) → **Pro** (teams/orgs, BYOK, connectors, monorepo).

## 8. Guardrails (what V2 will NOT have)

RAG/uploads/embeddings · MCP connectors (in-bound) · admin panel · teams/orgs · notification center · analytics dashboards · >7 agent tools · more auth providers · usage-based billing · middleware.ts · tailwind.config.js · monorepo split · Pro anything.

## 9. Success criteria

- Fresh clone, zero keys: landing + dashboard + mock run loop + Sigma setup-state all render, `pnpm build` green.
- With keys: real run completes end-to-end; artifact kept; tokens metered; quota enforced.
- Sigma: reads answer grounded; every write blocked until approved; denial leaves no trace; artifact-rendered UI in chat.
- Forker flow: agent-following "Swap the Noun" recipe produces a working custom entity in one session.
- No dead links; docs match reality; demo video recorded.

---

*Research sources: AIUXPlayground Trust Stack; MeasuringU 2026 chat benchmarks; TheFrontKit AI chat UI 2026; BuildMVPFast BYOK 2026; Flexera token economics; Kong rate-limit tiers; personalization-as-baseline analyses (full links in session log).*
