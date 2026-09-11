# Make ChadNext a Better AI-First SaaS Template for Solo/Indie Developers

**Date:** 2026-04-28  
**Depth:** Standard  
**Target repo:** `chadnext`

---

## Overview

ChadNext v2 already has the right positioning and stack for an AI-first indie SaaS template: Next.js 16, Convex, Better Auth, Polar, Resend, Fumadocs, shadcn/ui, and AI SDK packages. The gap is that the product still behaves more like a partially wired SaaS scaffold than an opinionated AI product starter. The flagship AI surfaces are stubbed or absent, onboarding is thin, and several promised dashboard surfaces are not yet implemented.

This plan turns ChadNext into a template that helps a solo developer ship an AI SaaS faster by providing:

- a working AI copilot with persistent Convex-backed threads,
- real tool calling against app data with safe human approval,
- plan-aware usage limits and billing upgrade paths,
- zero-config demo behavior before API keys are added,
- agent/editor guidance that helps AI coding tools extend the template correctly,
- stronger docs, setup checks, and debugging/evaluation paths.

---

## Problem Frame

### Current observed repo state

- `README.md` markets ChadNext v2 as an AI-focused indie SaaS template.
- `package.json` includes AI SDK providers (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`) and Convex agent/rate-limiter components.
- `convex/chat.ts` currently returns empty/null stubs and does not use AI SDK or `@convex-dev/agent`.
- No `src/app/dashboard/chat` route exists, even though the dashboard sidebar links to `/dashboard/chat`.
- No `src/app/dashboard/billing` route exists, even though the dashboard sidebar links to `/dashboard/billing`.
- `content/docs/index.mdx` is a very short getting-started page; it does not teach the AI-first template workflow.
- `.sisyphus/plans/chadnext-v2-ai-saas.md` documents the original intent: AI copilot, seven tools, fixed Free/Pro billing, rate limiting, graceful degradation without `OPENAI_API_KEY`, and confirmation for destructive AI actions.

### Research observations

Browser-based research was used for current docs and competitor positioning. The Research panel tools were attempted, but the panel returned `tab_not_open` errors immediately after opening tabs; this was reported via `report_tool_issue`. I then used the actual browser tool to inspect sources.

- AI SDK docs emphasize tool calling, `useChat`, streamed UI messages, local DevTools, and inspection of LLM requests, tool calls, token usage, and multi-step runs.
- Convex Agent docs emphasize persisted threads/messages, live-updating UI, tool composition with Convex functions, rate limiting, usage tracking, debugging/playground, and long-running workflows separated from UI.
- Indie Kit positions strongly around AI-editor readiness: built-in rules/skills/commands, launch timeline, email/billing/auth completeness, mentorship/support, quota management, and production examples.
- A generic AI SaaS starter positions around auth, billing, database, UI, GPT streaming, file attachments, and quick setup.

### Strategic gap

The opportunity is not to become another kitchen-sink SaaS boilerplate. ChadNext should own a sharper niche:

> The Convex-native AI SaaS template for solo developers who want a working in-app AI copilot, safe app-aware tools, plan-aware quotas, and AI-editor-friendly extension patterns on day one.

---

## Requirements

- R1. The app must include a working authenticated AI chat route in the dashboard.
- R2. Chat history must persist across reloads and update reactively through Convex.
- R3. The AI must use app-aware tools against real template data, not mocked-only examples.
- R4. Destructive or mutating AI actions must require explicit user approval before execution.
- R5. The app must degrade gracefully when provider API keys are missing.
- R6. Free/Pro usage limits must be visible and enforced for AI requests.
- R7. Billing and usage must stay fixed-tier; do not introduce metered billing in this plan.
- R8. The first-run path must guide a solo developer from clone to local demo to production setup.
- R9. Docs must explain how to customize the AI agent, tools, prompts, quotas, and provider keys.
- R10. The template must include AI-editor/agent guidance so Cursor, Claude Code, Windsurf, and similar tools extend it consistently.
- R11. Verification must prove the user-visible flows: landing page, auth-gated dashboard, projects, billing, chat, setup-missing states, and AI tool approval.

---

## Scope Boundaries

### In scope

- Dashboard AI chat/copilot implementation.
- Convex Agent-backed threads, messages, streaming, tool calls, rate limits, and usage accounting.
- Billing page and fixed Free/Pro upgrade/portal flows.
- Solo-dev onboarding docs and setup diagnostics.
- Agent/editor instruction files and extension examples.
- Lightweight eval/smoke prompts for template maintainers.

### Out of scope

- RAG, document upload, file search, and embeddings.
- Multi-tenant organizations, teams, RBAC, or admin panels.
- Usage-based or metered billing.
- More than seven bundled copilot tools.
- More auth providers beyond GitHub and Email OTP.
- Full observability platform integration.
- In-app onboarding wizard or guided tour.

### Deferred to Follow-Up Work

- A separate paid `ChadNext Pro` edition.
- Advanced AI workflows that span multiple agents.
- Production analytics dashboard beyond basic usage and plan status.
- Public template gallery or real customer showcase pages.

---

## Context & Research

### Relevant Code and Patterns

- `src/app/dashboard/layout.tsx` — dashboard sidebar and currently dead Chat/Billing navigation links.
- `src/app/dashboard/projects/page.tsx` — Convex `useQuery`/`useMutation` client pattern, loading states, free plan messaging.
- `src/app/dashboard/projects/[projectId]/page.tsx` — project update/delete UI pattern and confirmation dialog pattern.
- `convex/projects.ts` — authenticated Convex CRUD pattern and ownership checks.
- `convex/chat.ts` — current chat stub to replace.
- `convex/schema.ts` — custom conversation/message tables that should be reconciled with Convex Agent component persistence.
- `src/config/subscription.ts` — Free/Pro plan limits and feature copy.
- `convex/billing.ts` — Polar subscription helpers.
- `example.env` — current env-var documentation pattern.
- `content/docs/index.mdx` — current docs entry point to expand.
- `.cursorrules`, `.windsurfrules`, `.agentic-desktop/` — existing AI-editor guidance surfaces to audit and modernize.

### External References

- AI SDK browser docs: `https://ai-sdk.dev/docs/agents`
- Convex Agent browser docs: `https://docs.convex.dev/agents`
- Competitor research via browser: `https://indiekit.pro/`, `https://saas-ai-starter.vercel.app/`, and DuckDuckGo search results for AI SaaS starter templates.

---

## Key Technical Decisions

- **Use Convex Agent as the source of truth for chat threads/messages.** It already provides persisted threads, message history, streaming, tools, debugging, usage tracking, and rate limiting patterns. Keeping a parallel custom `conversations`/`messages` implementation would create two representations of the same domain.
- **Keep fixed-tier billing and quota enforcement separate from metered billing.** Polar remains Free/Pro subscription management; AI usage limits gate product behavior but do not create billable usage events in this plan.
- **Default to zero-config demo behavior.** Missing provider keys should render setup guidance and optionally a deterministic demo assistant path, not crash server actions or client pages.
- **Use human approval for all mutating or destructive tools.** Reads can execute directly; create/update/delete/billing-affecting actions must render approval UI before execution.
- **Make the template AI-editor-native.** Competitors are selling AI rules/skills as a core feature. ChadNext should include concise, repo-specific guidance that tells coding agents how to add tools, preserve safety boundaries, and verify changes.
- **Prefer fewer, richer demo tools.** Seven well-documented tools are more useful than broad one-off examples.

---

## Open Questions

### Resolved During Planning

- **Should the plan include RAG or file upload?** No. The original v2 guardrails explicitly exclude document upload/RAG, and adding it would dilute the solo-dev launch template.
- **Should AI usage become metered billing?** No. The existing Polar component decision is fixed-tier only; usage is for quotas/display.
- **Should custom conversation/message tables stay?** Directionally no. The implementation should first confirm whether they are used elsewhere, then migrate chat persistence to Convex Agent component primitives or delete unused duplicate tables.

### Deferred to Implementation

- **Exact AI SDK package API shape.** The project currently has AI SDK v6-era packages and `@convex-dev/agent` peer warnings were previously noted. Implementation must verify installed package APIs from local `node_modules` before writing code.
- **Exact approval UI bridge.** The implementation should choose the lowest-friction integration compatible with Convex Agent and AI SDK UI after verifying package APIs.
- **Whether to support both OpenAI and Anthropic at runtime in v1 of this improvement.** The repo has both packages installed, but the simplest acceptable version can default to one configured provider while documenting how to switch.

---

## High-Level Technical Design

> This is directional guidance, not implementation code.

```mermaid
flowchart TD
  Dev[solo developer] --> Setup[setup docs + env checker]
  Setup --> Demo[zero-config demo mode]
  Setup --> Provider[configured AI provider]

  User[authenticated user] --> ChatUI[/dashboard/chat]
  ChatUI --> ConvexChat[Convex chat functions]
  ConvexChat --> Agent[Convex Agent thread/message store]
  Agent --> Tools[app-aware tools]
  Tools --> Projects[projects CRUD]
  Tools --> Billing[billing status + checkout]
  Tools --> Usage[usage + quota]
  Tools --> Settings[profile/settings]

  Tools --> Approval{mutating?}
  Approval -->|yes| ApprovalCard[human approval UI]
  Approval -->|no| Execute[execute directly]
  ApprovalCard --> Execute
  Execute --> Audit[tool call + usage log]
```

---

## Implementation Units

- U1. **Ground the current template contract**

  **Goal:** Make the template's promised AI-first surfaces explicit and remove misleading dead ends before adding new behavior.

  **Requirements:** R1, R8, R11

  **Dependencies:** None

  **Files:**
  - Modify: `src/app/dashboard/layout.tsx`
  - Modify: `src/app/dashboard/page.tsx`
  - Modify: `README.md`
  - Modify: `content/docs/index.mdx`

  **Approach:**
  - Audit dashboard links and product copy against implemented routes.
  - Decide whether temporary “configure/coming next” states are acceptable for a short internal step; final state must not leave dead navigation.
  - Update README/docs language so it describes the template truthfully after implementation, not just aspirations.

  **Patterns to follow:**
  - Existing dashboard card layout in `src/app/dashboard/page.tsx`.
  - Existing sectioned README style.

  **Test scenarios:**
  - Happy path: Dashboard navigation exposes only routes that render meaningful pages.
  - Edge case: Missing AI/billing env vars render setup guidance rather than broken pages.

  **Verification:**
  - Browser navigation through dashboard links reaches rendered pages with no 404s.
  - README and docs mention the actual AI setup and fixed-tier billing model.

---

- U2. **Add an AI runtime configuration layer**

  **Goal:** Centralize provider configuration, missing-key behavior, model selection, and development diagnostics.

  **Requirements:** R5, R8, R9

  **Dependencies:** U1

  **Files:**
  - Create: `src/config/ai.ts`
  - Create: `convex/aiConfig.ts` or equivalent Convex-side helper
  - Modify: `example.env`
  - Modify: `content/docs/index.mdx`

  **Approach:**
  - Add a single AI config surface that defines default provider, default chat model, optional fallback messaging, and environment readiness.
  - Preserve zero-config app boot: no provider key means chat page shows setup instructions or deterministic demo behavior.
  - Document OpenAI and Anthropic key setup because both provider packages are installed, while keeping one default provider path.
  - Include AI SDK DevTools instructions for local debugging only.

  **Patterns to follow:**
  - `src/config/site.ts` and `src/config/subscription.ts` for config shape.
  - `example.env` service-section comments.

  **Test scenarios:**
  - Happy path: With provider env configured, AI runtime reports ready.
  - Error path: With provider env missing, the app renders setup guidance and does not crash.
  - Edge case: Unsupported provider value fails loudly during server-side config validation.

  **Verification:**
  - Build passes without provider keys.
  - Chat route can render its missing-provider state locally.

---

- U3. **Replace chat stubs with Convex Agent threads and messages**

  **Goal:** Implement persistent, reactive AI conversations using the Convex Agent component rather than custom no-op chat stubs.

  **Requirements:** R1, R2, R3, R5

  **Dependencies:** U2

  **Files:**
  - Modify: `convex/chat.ts`
  - Modify: `convex/schema.ts`
  - Modify: `convex/convex.config.ts` if needed after verifying component registration
  - Create: `convex/agents/` files as needed, kept small and purpose-specific

  **Approach:**
  - Verify local `@convex-dev/agent` APIs from installed package docs/source before implementation.
  - Create authenticated functions for creating/listing threads, sending messages, listing UI messages, and resuming streams.
  - Use Convex Agent component persistence as the canonical thread/message store.
  - Remove or stop using duplicate custom conversation/message tables if they are not required by the component.
  - Ensure auth context and user ownership protect every thread.

  **Patterns to follow:**
  - `convex/projects.ts` authenticated user guard and ownership checks.
  - Convex Agent docs for threads/messages/streaming.

  **Test scenarios:**
  - Happy path: Authenticated user creates a thread, sends a message, reloads, and sees history.
  - Error path: Unauthenticated user cannot create or read chat threads.
  - Edge case: User cannot read another user's thread.
  - Error path: Provider missing returns a useful setup state without inserting fake assistant content as if it came from a model.

  **Verification:**
  - Convex functions have explicit validators.
  - Browser chat history survives reload.

---

- U4. **Implement seven app-aware copilot tools**

  **Goal:** Give the copilot useful SaaS-builder actions that demonstrate how to connect AI tools to real product data safely.

  **Requirements:** R3, R4, R6, R7

  **Dependencies:** U3

  **Files:**
  - Create: `convex/agents/tools/` files as needed
  - Modify: `convex/projects.ts`
  - Modify: `convex/billing.ts`
  - Modify: `convex/users.ts`
  - Modify: `src/config/subscription.ts`

  **Approach:**
  - Keep the bundled tool count at seven.
  - Suggested tool set:
    1. list projects,
    2. create project,
    3. update project,
    4. archive/delete project,
    5. get dashboard stats,
    6. get billing/plan status,
    7. get AI usage/quota status.
  - Require approval for create/update/archive/delete and any billing-affecting action.
  - Return structured, user-safe results that teach template users how to design tool outputs.
  - Reuse existing Convex functions where possible rather than duplicating business rules inside tools.

  **Patterns to follow:**
  - `convex/projects.ts` as source of project ownership and free-limit truth.
  - `convex/billing.ts` for plan status.
  - Convex Agent `createTool` approval pattern from docs.

  **Test scenarios:**
  - Happy path: Read-only tools answer project, billing, and usage questions without approval.
  - Happy path: Create project tool requests approval, then creates a project after approval.
  - Error path: Free plan project limit is enforced when tool tries to create a fourth project.
  - Error path: Delete/archive request denied in approval UI does not mutate data.
  - Edge case: Tool cannot act on project IDs owned by another user.

  **Verification:**
  - Tool calls use existing business functions or shared helpers.
  - Mutating tool calls cannot execute without approval.

---

- U5. **Build the dashboard chat/copilot UI**

  **Goal:** Add a polished `/dashboard/chat` experience that demonstrates streaming, tool approval, history, setup states, and quota state.

  **Requirements:** R1, R2, R4, R5, R6

  **Dependencies:** U3, U4

  **Files:**
  - Create: `src/app/dashboard/chat/page.tsx`
  - Create: `src/components/ai/` components as needed
  - Modify: `src/app/dashboard/layout.tsx`

  **Approach:**
  - Build a chat page with thread list, active message stream, prompt input, tool-call cards, approval/deny controls, and setup/limit banners.
  - Surface the exact reason chat is unavailable: missing provider key, unauthenticated session, quota exceeded, or backend error.
  - Keep the UI reusable enough for template users to copy, but avoid premature component abstraction.
  - Include starter prompts that showcase the seven tools.

  **Patterns to follow:**
  - shadcn card/dialog/button patterns already in projects pages.
  - Existing dashboard spacing/sidebar layout.

  **Test scenarios:**
  - Happy path: User sends a prompt and sees streamed/persisted response.
  - Happy path: User approves a create-project tool call and sees the project appear.
  - Error path: User denies a destructive tool call and no mutation occurs.
  - Error path: Missing API key state shows setup instructions and disables live send.
  - Edge case: Empty prompt cannot be submitted.

  **Verification:**
  - Browser flow through `/dashboard/chat` works at mobile and desktop widths.
  - No dead sidebar links remain.

---

- U6. **Complete fixed-tier billing and AI quota UX**

  **Goal:** Make billing useful for solo devs by tying Free/Pro plan state to project limits and AI usage limits without implementing metered billing.

  **Requirements:** R6, R7, R8

  **Dependencies:** U2, U4

  **Files:**
  - Create: `src/app/dashboard/billing/page.tsx`
  - Modify: `convex/billing.ts`
  - Modify: `src/config/subscription.ts`
  - Modify: `src/app/dashboard/projects/page.tsx`
  - Modify: `src/app/dashboard/chat/page.tsx`

  **Approach:**
  - Implement a billing page with current plan, feature limits, usage counters, checkout button, and portal button.
  - Enforce daily AI request limits for Free plan and visibly explain how Pro changes limits.
  - Keep Polar fixed subscription behavior only.
  - Make all missing Polar env states explicit and helpful for local development.

  **Patterns to follow:**
  - Existing `subscription.ts` Free/Pro configuration.
  - Existing project free-limit messaging.

  **Test scenarios:**
  - Happy path: Free user sees current limits and upgrade CTA.
  - Happy path: Configured Polar env produces checkout/portal actions.
  - Error path: Missing Polar env shows setup instructions, not a broken button.
  - Edge case: AI quota exceeded blocks new chat sends with upgrade guidance.

  **Verification:**
  - Browser navigation to `/dashboard/billing` renders useful state.
  - Project and chat limit copy agree with `subscription.ts`.

---

- U7. **Improve solo-dev first-run onboarding**

  **Goal:** Reduce setup ambiguity so an indie developer can clone, run, see a demo, then progressively configure Convex, auth, AI, billing, and email.

  **Requirements:** R5, R8, R9

  **Dependencies:** U2, U5, U6

  **Files:**
  - Modify: `README.md`
  - Modify: `content/docs/index.mdx`
  - Create: additional `content/docs/` pages if Fumadocs source config supports them
  - Modify: `example.env`
  - Modify: `.sisyphus/NEXT_STEPS.md` or replace stale status docs if still intended to be kept

  **Approach:**
  - Add a clear “clone to first AI chat” path.
  - Separate required, optional, and production-only env vars.
  - Document local setup for Convex, Better Auth, AI provider, Polar, Resend, and Vercel.
  - Add troubleshooting for common missing-generated Convex types and missing env states.
  - Include a customization checklist: rename product, edit plans, add a tool, change provider, deploy.

  **Patterns to follow:**
  - Existing `example.env` grouping.
  - Fumadocs MDX content style.

  **Test scenarios:**
  - Happy path: A fresh reader can identify the minimum steps to run landing/docs locally.
  - Happy path: A configured reader can identify the steps to test real AI chat.
  - Error path: Missing Convex initialization instructions point to the right fix.

  **Verification:**
  - Docs and README do not contradict each other.
  - All env vars referenced in docs exist in `example.env`.

---

- U8. **Add AI-editor-native extension guidance**

  **Goal:** Make the template better for solo developers using coding agents by giving agents repo-specific rules, safe extension recipes, and example prompts.

  **Requirements:** R9, R10

  **Dependencies:** U3, U4, U7

  **Files:**
  - Modify: `.cursorrules`
  - Modify: `.windsurfrules`
  - Create or modify: `.claude/` guidance if present and appropriate
  - Create: `content/docs/ai-editor-workflow.mdx` or equivalent
  - Modify: `README.md`

  **Approach:**
  - Include concise rules for adding a new AI tool: define business logic in Convex, wrap as tool, require approval for mutations, add UI rendering, add docs, verify browser flow.
  - Include prompts for common solo-dev tasks: “add a new billing-gated tool,” “add a new dashboard entity,” “change AI provider,” “ship a landing-page variant.”
  - Explain safety boundaries: no hidden destructive actions, no bypassing quota checks, no duplicating tool business rules.
  - Avoid huge instruction dumps that become stale.

  **Patterns to follow:**
  - Existing editor rule files.
  - AI SDK docs recommendation to install/use coding-agent skills and local package docs.

  **Test scenarios:**
  - Happy path: A coding agent has enough local guidance to add a new tool consistently.
  - Edge case: Rules explicitly reject destructive tool execution without approval.

  **Verification:**
  - Editor rules reference real repo paths and current concepts.
  - Docs include a concrete extension workflow without implementation code bloat.

---

- U9. **Add lightweight AI debugging and evaluation hooks**

  **Goal:** Give template maintainers practical confidence that the copilot still works after customization.

  **Requirements:** R9, R11

  **Dependencies:** U5, U6

  **Files:**
  - Create: `content/docs/ai-debugging.mdx` or equivalent
  - Create: lightweight eval/smoke prompt fixture file if repo convention supports it
  - Modify: `package.json` only if adding a right-sized script is justified
  - Modify: `.gitignore` if AI SDK DevTools local artifacts need exclusion

  **Approach:**
  - Document AI SDK DevTools for local-only inspection of prompts, tool calls, token usage, and multi-step runs.
  - Add a small set of smoke prompts that exercise read-only, mutating-approved, mutating-denied, quota-exceeded, and missing-provider paths.
  - Avoid building a full eval platform; this is a starter template.

  **Patterns to follow:**
  - AI SDK docs for DevTools and tool-call inspection.
  - Existing project preference for simple scripts.

  **Test scenarios:**
  - Happy path: Maintainer can run through smoke prompts manually/browser-driven.
  - Error path: Missing provider and quota limit paths are included in smoke coverage.

  **Verification:**
  - Docs explain what evidence to capture before shipping template changes.
  - Local-only debug artifacts are not committed.

---

- U10. **Final integration polish and verification**

  **Goal:** Prove the template works as a cohesive AI-first SaaS starter, not as isolated pages.

  **Requirements:** R1-R11

  **Dependencies:** U1-U9

  **Files:**
  - Modify: `README.md`
  - Modify: `content/docs/index.mdx`
  - Modify: affected dashboard, Convex, and config files from earlier units

  **Approach:**
  - Run a complete user journey: landing page → login/setup state → dashboard → projects → billing → chat → tool approval → docs.
  - Remove stale status claims from `.sisyphus` docs or clearly mark them historical if retained.
  - Ensure copy consistently says “AI-first indie SaaS template” and explains why the template is different.

  **Patterns to follow:**
  - Existing README and docs copy tone, but reduce hype where behavior is not implemented.

  **Test scenarios:**
  - Integration: Fresh clone without optional env vars builds and renders landing/docs/setup states.
  - Integration: Configured local environment can create a project and use copilot read tools.
  - Integration: Mutating tool approval changes project state only after approval.
  - Integration: Dashboard links, docs links, and pricing/billing copy are consistent.

  **Verification:**
  - Type/lint/build checks pass.
  - Browser verification covers all dashboard routes.
  - Docs and README match actual behavior.

---

## System-Wide Impact

- **Interaction graph:** Dashboard pages depend on Better Auth session state, Convex Provider, Convex functions, Polar config, and AI provider config. Chat introduces a new high-touch path between UI, Convex Agent, business functions, and billing/usage limits.
- **Error propagation:** Missing provider keys, missing Polar env, missing Convex deployment, quota exhaustion, and unauthenticated access must each surface distinct user-facing states.
- **State lifecycle risks:** AI tool calls can create/update/delete projects; approvals must prevent partial or unintended writes. Chat message persistence must not fork between custom tables and Agent component storage.
- **API surface parity:** Any plan/usage limit displayed in landing, pricing, billing, projects, and chat must come from the same subscription config concepts.
- **Integration coverage:** Unit-level checks are not enough; the important proof is browser-level flow across auth-gated dashboard, chat, tools, quotas, and billing.
- **Unchanged invariants:** Auth remains GitHub + Email OTP; billing remains Polar fixed-tier; dashboard project ownership remains per authenticated user; RAG/uploads/orgs/admin remain out of scope.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| AI SDK v6 and `@convex-dev/agent` API/peer compatibility differs from docs | Verify local `node_modules` APIs before implementation; keep provider integration minimal and version-aligned. |
| Duplicate chat persistence between schema tables and Convex Agent component | Make Convex Agent the canonical representation; remove or ignore unused custom tables only after reference checks. |
| Missing external env vars block verification | Preserve zero-config render paths and separately verify configured flows where secrets are available. |
| Mutating tools accidentally bypass approval | Centralize tool approval policy and test create/update/delete approved vs denied paths. |
| Billing limits drift across UI and backend | Keep limits in `src/config/subscription.ts` or a shared domain config, then consume from UI/backend consistently. |
| Plan grows into enterprise SaaS boilerplate | Enforce scope boundaries: no orgs, admin, RAG, metered billing, or more than seven tools. |
| Existing generated Convex stubs mask real deployment issues | Treat stub-generated files as local bootstrap aids; verify with real Convex codegen/deploy when environment is configured. |

---

## Documentation / Operational Notes

- Update README as a sales and setup document, not just a package checklist.
- Expand Fumadocs into a practical guide: setup, AI architecture, adding tools, billing/quotas, deployment, debugging.
- Include browser-verifiable setup states so users can tell whether they are missing Convex, auth, AI, billing, or email config.
- Keep `.sisyphus` historical docs from contradicting current reality; either update them or mark them as session history.
- Add AI-editor guidance as a first-class feature because solo/indie developers increasingly build through coding agents.

---

## Success Metrics

- A fresh clone can run the landing/docs/dashboard setup states without optional AI/Billing/Email keys.
- A configured local app can send an AI chat message and persist the conversation.
- The copilot can read dashboard data and perform at least one approved mutation against real Convex data.
- Denied destructive/mutating tool calls do not change data.
- Free plan AI usage limits are visible and enforced.
- Billing route exists and provides useful configured and unconfigured states.
- Docs explain how to add a new AI tool safely.
- Dashboard navigation has no dead links.

---

## Sources & References

- Local repo: `README.md`
- Local repo: `package.json`
- Local repo: `.sisyphus/plans/chadnext-v2-ai-saas.md`
- Local repo: `.sisyphus/NEXT_STEPS.md`
- Local repo: `.sisyphus/notepads/chadnext-v2-ai-saas/learnings.md`
- Local repo: `convex/chat.ts`
- Local repo: `convex/schema.ts`
- Local repo: `src/app/dashboard/layout.tsx`
- Local repo: `src/app/dashboard/projects/page.tsx`
- Local repo: `content/docs/index.mdx`
- Browser research: `https://ai-sdk.dev/docs/agents`
- Browser research: `https://docs.convex.dev/agents`
- Browser research: `https://indiekit.pro/`
- Browser research: `https://saas-ai-starter.vercel.app/`
