# ChadNext v2 — AI-Focused Indie SaaS Template (Convex-Native)

## TL;DR

> **Quick Summary**: Complete v2 rewrite of ChadNext (1.3k star Next.js SaaS template) into an AI-focused indie SaaS template built on a Convex-native stack. The flagship feature is an in-app AI copilot that knows the user's dashboard data and can perform CRUD actions via natural language chat.
> 
> **Deliverables**:
> - New `v2` branch with complete rewrite from scratch
> - Next.js 16 + Tailwind 4 + shadcn/ui + Convex-native backend
> - AI copilot with 7 tools (project CRUD, billing, stats, settings)
> - better-auth (GitHub + Email OTP)
> - Polar.sh billing (Free/Pro fixed tiers)
> - Fumadocs changelog/docs
> - PWA support (Serwist)
> - Landing page with AI-focused marketing sections
> - Complete `example.env` with setup documentation
> 
> **Estimated Effort**: XL (multi-week)
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Scaffold → Convex Schema + Components → Auth → Dashboard CRUD → Billing → AI Copilot → Docs/Polish

---

## Context

### Original Request
Rewrite ChadNext from a general-purpose Next.js SaaS template into an AI-focused indie SaaS template. Build on a Convex-native stack with an AI copilot that can query and mutate the user's dashboard data. Create a clean v2 branch in the same repo.

### Interview Summary
**Key Discussions**:
- **AI Copilot Pattern**: Not a ChatGPT wrapper. An app-aware assistant that knows dashboard data and performs actions (create projects, check billing, view stats). Architecture: Vercel AI SDK + tool calling + Convex queries/mutations as tools.
- **Two Products**: ChadNext (free/indie, this repo) and ChadNext Pro (paid/enterprise, future separate repo).
- **Stack Overhaul**: Convex replaces Prisma+Postgres. Polar.sh replaces Stripe. better-auth replaces custom Arctic. Tailwind 4, Next.js 16, Fumadocs replaces Velite. Drop i18n, drop UploadThing.
- **Indie Mindset**: Ship fast, no tests, minimal config, Vercel-first deployment.

**Research Findings**:
- No competing template offers a Convex-native AI SaaS stack
- Convex component ecosystem is mature (10k-40k weekly downloads each)
- @convex-dev/agent wraps Vercel AI SDK with built-in streaming + persistence
- Polar.sh is MoR with usage event tracking, but the @convex-dev/polar component only supports fixed-price subscriptions (NOT usage-based billing)
- better-auth + Convex integration is production-ready (29.7k weekly downloads)
- Next.js 16 renames middleware.ts → proxy.ts (breaking change)
- Tailwind 4 uses CSS-first config (no tailwind.config.js)
- Serwist doesn't support Turbopack in dev (requires --webpack flag)

### Metis Review
**Identified Gaps** (addressed):
- **Polar usage-based billing gap**: @convex-dev/polar doesn't support metered billing. Resolution: Fixed-price tiers only (Free/Pro). Usage tracking for display only, not billing.
- **persistent-text-streaming not needed**: @convex-dev/agent has built-in streaming. Dropping persistent-text-streaming component (7 → 6 components).
- **R2 overkill for profile pics**: Convex built-in file storage handles profile pictures. Dropping @convex-dev/r2 (6 → 5 components unless user decides otherwise).
- **First-run DX risk**: 15-20 env vars is too many for indie template. Resolution: App must run with zero config (graceful degradation), env vars documented with clear instructions.
- **AI without API key**: Template must not crash without OPENAI_API_KEY. Copilot shows "Configure your AI provider" message.
- **Destructive AI actions**: AI tool calls for delete/update must include confirmation step in the UI.
- **Next.js 16 proxy.ts**: Auth middleware must use new proxy.ts pattern, not middleware.ts.

---

## Work Objectives

### Core Objective
Build ChadNext v2 as the definitive Convex-native AI SaaS starter template for indie hackers — from auth to billing to AI copilot, all wired together and ready to customize.

### Concrete Deliverables
- `v2` branch with complete Next.js 16 application
- 5 Convex components integrated: agent, rate-limiter, polar, better-auth, resend
- AI copilot with 7 demo tools
- Landing page (Hero, Features, Pricing, FAQ, Testimonials, CTA)
- Dashboard (Projects CRUD, Billing, Settings, AI Chat)
- Fumadocs (Getting Started, Environment Variables, Architecture, Changelog)
- PWA manifest + service worker
- `example.env` with documented variables
- Updated README

### Definition of Done
- [ ] `pnpm build` succeeds with zero TypeScript errors
- [ ] `npx convex deploy --dry-run` succeeds
- [ ] Landing page loads at localhost:3000 with no env vars set
- [ ] Auth flow (GitHub + Email OTP) works end-to-end
- [ ] Dashboard CRUD (projects) works
- [ ] AI copilot responds to messages and executes tools
- [ ] Polar billing redirect works (checkout + portal)
- [ ] All env vars documented in `example.env`

### Must Have
- AI copilot with tool-calling (7 tools)
- better-auth with GitHub OAuth + Email OTP
- Polar.sh with Free/Pro fixed-price tiers
- Convex schema with proper indexes
- Rate limiting on AI chat endpoint
- Graceful degradation without AI API key
- Landing page with AI-focused marketing
- Dashboard with projects, billing, settings
- Fumadocs changelog + getting-started docs
- PWA support
- Dark mode

### Must NOT Have (Guardrails)
- ❌ Usage-based / metered billing (Polar component doesn't support it)
- ❌ More than 7 AI copilot tools
- ❌ More auth providers than GitHub + Email OTP
- ❌ Admin panel
- ❌ Onboarding wizard / guided tour
- ❌ In-app notification system
- ❌ Real-time analytics dashboard (simple stats only)
- ❌ Document upload for AI / RAG features
- ❌ i18n / multi-language
- ❌ middleware.ts (Next.js 16 uses proxy.ts)
- ❌ tailwind.config.js (Tailwind 4 uses CSS-first config)
- ❌ @convex-dev/persistent-text-streaming (Agent has built-in streaming)
- ❌ More than 4 email templates
- ❌ Interactive AI demo on landing page
- ❌ Tests (ship fast, indie mindset)

---

## Verification Strategy

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.
> Every criterion is agent-executable using tools (Playwright, Bash, curl, etc.).

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NONE (ship fast)
- **Framework**: N/A

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

**Verification Tool by Deliverable Type:**

| Type | Tool | How Agent Verifies |
|------|------|-------------------|
| **Landing Page / UI** | Playwright | Navigate, assert DOM, screenshot |
| **Auth Flow** | Playwright | Fill forms, click, assert redirects |
| **API Endpoints** | Bash (curl) | Send requests, assert status codes |
| **Build** | Bash | Run `pnpm build`, assert exit code 0 |
| **Convex** | Bash | Run `npx convex deploy --dry-run`, assert success |
| **Config** | Bash | Grep env vars, diff against example.env |

---

## Reference Verification Note

> **ALL file references in this plan have been manually verified via `ls -la`.**
> The `[locale]` dynamic route segment in paths like `src/app/[locale]/...` causes
> glob tools to fail (brackets interpreted as glob patterns), but the files DO exist.
> Verified on 2026-02-11: every referenced v1 file confirmed present on disk.

---

## Revised Component Stack (Post-Metis)

| Layer | Technology | Convex Component | Notes |
|-------|-----------|-----------------|-------|
| Framework | Next.js 16 + React 19 | — | Uses proxy.ts not middleware.ts |
| Styling | Tailwind CSS 4 + shadcn/ui | — | CSS-first config, no JS config |
| Database/Backend | Convex | Core | Real-time, type-safe |
| Auth | better-auth | `@convex-dev/better-auth` | GitHub + Email OTP |
| Payments | Polar.sh | `@convex-dev/polar` | Fixed tiers only (Free/Pro) |
| AI Agent | Vercel AI SDK | `@convex-dev/agent` | Tool calling + built-in streaming |
| Rate Limiting | Convex native | `@convex-dev/rate-limiter` | Token bucket on chat |
| Email | Resend | `@convex-dev/resend` | Welcome + OTP + billing emails |
| File Storage | Convex built-in | — | Profile pictures only |
| Content/Docs | Fumadocs | — | Changelog + getting started |
| PWA | Serwist | — | Keep from v1 |
| Deployment | Vercel | — | One-click deploy |

**Total Convex Components: 5** (agent, rate-limiter, polar, better-auth, resend)

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Foundation):
├── Task 1: Create v2 branch + scaffold Next.js 16 + Tailwind 4 + shadcn/ui
├── Task 2: Design Convex schema + register all 5 components
└── Task 3: Create example.env with all variables documented

Wave 2 (After Wave 1 — Core Features):
├── Task 4: better-auth integration (GitHub + Email OTP)
├── Task 5: Landing page (marketing sections)
└── Task 6: Fumadocs setup (changelog + getting started)

Wave 3 (After Task 4 — Authenticated Features):
├── Task 7: Dashboard layout + Projects CRUD
├── Task 8: Polar.sh billing integration (Free/Pro)
└── Task 9: User settings page (profile, image upload)

Wave 4 (After Wave 3 — AI + Polish):
├── Task 10: AI copilot (7 tools + chat UI + rate limiting)
├── Task 11: Email templates (OTP, welcome, billing)
├── Task 12: PWA setup (Serwist)
└── Task 13: Final polish (README, OG image, SEO, build verification)

Critical Path: Task 1 → Task 2 → Task 4 → Task 7 → Task 10
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4, 5, 6 | 3 |
| 2 | 1 | 4, 5, 7, 8, 9, 10 | 3 |
| 3 | None | — | 1, 2 |
| 4 | 1, 2 | 7, 8, 9, 10 | 5, 6 |
| 5 | 1 | — | 4, 6 |
| 6 | 1 | — | 4, 5 |
| 7 | 4 | 10 | 8, 9 |
| 8 | 4, 2 | 10 | 7, 9 |
| 9 | 4 | — | 7, 8 |
| 10 | 7, 8 | 13 | 11, 12 |
| 11 | 2, 4 | — | 10, 12 |
| 12 | 1 | — | 10, 11 |
| 13 | 10 | — | — |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1, 2, 3 | task(category="unspecified-high") for 1+2, task(category="quick") for 3 |
| 2 | 4, 5, 6 | task(category="deep") for 4, task(category="visual-engineering") for 5, task(category="unspecified-low") for 6 |
| 3 | 7, 8, 9 | task(category="deep") for 7+8, task(category="unspecified-low") for 9 |
| 4 | 10, 11, 12, 13 | task(category="ultrabrain") for 10, task(category="quick") for 11+12+13 |

---

## TODOs

- [x] 1. Scaffold Next.js 16 + Tailwind 4 + shadcn/ui on v2 Branch

  **What to do**:
  - Create `v2` branch from latest `origin/main`
  - Initialize a fresh Next.js 16 application with TypeScript, App Router, `src/` directory
  - Configure Tailwind CSS 4 with CSS-first configuration (no `tailwind.config.js` — use `@import "tailwindcss"` in `globals.css` with CSS variables for shadcn/ui theming)
  - Initialize shadcn/ui with `npx shadcn@latest init` (verify Tailwind 4 + Next.js 16 compatibility)
  - Add core shadcn/ui components needed for the template: button, card, dialog, dropdown-menu, input, label, form, tabs, toast (sonner), sheet, avatar, badge, separator, skeleton, command, tooltip, scroll-area, sidebar
  - Set up path aliases: `@/*` → `./src/*`
  - Set up `next-themes` for dark mode
  - Configure `proxy.ts` (NOT middleware.ts — Next.js 16 breaking change) with basic auth redirect logic stub
  - Create base layout with theme provider
  - Create placeholder pages: `/` (landing), `/login`, `/dashboard`
  - Ensure `pnpm dev` and `pnpm build` both succeed

  **Must NOT do**:
  - Do NOT use `middleware.ts` — Next.js 16 uses `proxy.ts`
  - Do NOT use `tailwind.config.js` — Tailwind 4 is CSS-first
  - Do NOT install any Convex dependencies yet (that's Task 2)
  - Do NOT build actual page content yet (just placeholders)
  - Do NOT add more than 20 shadcn components — install what's needed, not everything

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Scaffolding with multiple new technologies (Next.js 16, Tailwind 4) requires careful setup
  - **Skills**: [`next-best-practices`, `frontend-ui-ux`]
    - `next-best-practices`: Next.js 16 file conventions, App Router patterns, proxy.ts
    - `frontend-ui-ux`: shadcn/ui setup, theme configuration, Tailwind 4 CSS-first config
  - **Skills Evaluated but Omitted**:
    - `next-upgrade`: Not an upgrade, it's a fresh scaffold

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 2, 4, 5, 6, 7, 8, 9, 10, 11, 12
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/app/[locale]/page.tsx` — landing page structure (v2 drops `[locale]` routing)
  - `src/components/shared/theme-provider.tsx` — next-themes dark mode provider pattern to replicate
  - `src/app/[locale]/layout.tsx` — root layout with CSS variable-based shadcn/ui theming (adapt to Tailwind 4 syntax)

  **External References**:
  - Next.js 16 docs: App Router conventions, proxy.ts API
  - Tailwind CSS 4 docs: CSS-first configuration, `@import "tailwindcss"` syntax
  - shadcn/ui docs: `init` command, Tailwind 4 support, component installation

  **WHY Each Reference Matters**:
  - v1 theme provider shows the next-themes integration pattern to replicate
  - v1 globals.css shows CSS variable naming convention for shadcn — must adapt to Tailwind 4 syntax
  - External docs needed because Next.js 16 + Tailwind 4 are breaking changes from v1's stack

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Fresh app builds and runs
    Tool: Bash
    Preconditions: v2 branch created, dependencies installed
    Steps:
      1. Run: pnpm build
      2. Assert: Exit code 0
      3. Assert: No TypeScript errors in output
      4. Run: pnpm dev &
      5. Wait 10 seconds for dev server
      6. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
      7. Assert: HTTP status 200
      8. Kill dev server
    Expected Result: App builds and serves landing page
    Evidence: Build output captured

  Scenario: Dark mode toggle works
    Tool: Playwright
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. Navigate to: http://localhost:3000
      2. Assert: html element has class "light" or data-theme="light"
      3. Click: theme toggle button
      4. Assert: html element has class "dark" or data-theme="dark"
      5. Screenshot: .sisyphus/evidence/task-1-dark-mode.png
    Expected Result: Theme toggles between light and dark
    Evidence: .sisyphus/evidence/task-1-dark-mode.png

  Scenario: Tailwind 4 CSS-first config is correct
    Tool: Bash
    Preconditions: Project scaffolded
    Steps:
      1. Assert: File src/app/globals.css contains "@import \"tailwindcss\""
      2. Assert: File tailwind.config.js does NOT exist
      3. Assert: File tailwind.config.ts does NOT exist
    Expected Result: Tailwind 4 CSS-first configuration, no JS config file
    Evidence: File existence checks captured

  Scenario: proxy.ts exists, middleware.ts does not
    Tool: Bash
    Preconditions: Project scaffolded
    Steps:
      1. Assert: File src/proxy.ts exists (or appropriate Next.js 16 location)
      2. Assert: File src/middleware.ts does NOT exist
    Expected Result: Next.js 16 proxy pattern used
    Evidence: File existence checks captured
  ```

  **Commit**: YES
  - Message: `feat: scaffold Next.js 16 + Tailwind 4 + shadcn/ui base`
  - Files: `All new files in v2 branch`
  - Pre-commit: `pnpm build`

---

- [x] 2. Design Convex Schema + Register All 5 Components

  **What to do**:
  - Install Convex: `pnpm add convex`
  - Install all 5 component packages: `@convex-dev/agent`, `@convex-dev/rate-limiter`, `@convex-dev/polar`, `@convex-dev/better-auth`, `@convex-dev/resend`
  - Install AI SDK dependencies: `ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`
  - Create `convex/convex.config.ts` registering all 5 components via `app.use()`
  - Create `convex/schema.ts` with complete schema:
    - **Users**: id, name, email, emailVerified, picture, stripeCustomerId (from Polar), createdAt, updatedAt
    - **Projects**: id, userId, name, description, status (active/archived), domain, createdAt, updatedAt
    - **Conversations**: id, userId, title, model, tokenCount, createdAt, updatedAt
    - **Messages**: id, conversationId, role (user/assistant/system/tool), content, toolCalls, toolResults, tokens, createdAt
    - **Subscriptions**: (managed by @convex-dev/polar component)
    - **Sessions**: (managed by @convex-dev/better-auth component)
    - Proper indexes: by_userId on Projects, Conversations; by_conversationId on Messages; by_email on Users
  - Create `convex/` directory structure:
    - `convex/auth.ts` — better-auth Convex setup
    - `convex/projects.ts` — Project queries/mutations
    - `convex/chat.ts` — AI agent + conversation management
    - `convex/billing.ts` — Polar integration
    - `convex/email.ts` — Resend integration
    - `convex/rateLimiter.ts` — Rate limiter setup
  - Create stub functions (empty implementations) for each module so schema and components can be verified together
  - Run `npx convex dev` and verify all components initialize without errors
  - Set up ConvexProvider in Next.js app layout

  **Must NOT do**:
  - Do NOT implement full business logic yet — stubs only
  - Do NOT add @convex-dev/persistent-text-streaming (Agent has built-in streaming)
  - Do NOT add @convex-dev/r2 (built-in storage is sufficient for profile pics)
  - Do NOT create more than the listed tables
  - Do NOT add vector indexes yet (that's an AI copilot concern in Task 10)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Schema design + 5 component registrations is architecturally complex, requires understanding component interactions
  - **Skills**: [`convex`, `convex-schema-validator`, `convex-best-practices`]
    - `convex`: Umbrella routing to Convex patterns
    - `convex-schema-validator`: Schema definition with proper typing, indexes, validators
    - `convex-best-practices`: Function organization, TypeScript usage, error handling
  - **Skills Evaluated but Omitted**:
    - `convex-agents`: Will be needed in Task 10, not here (just stubs)
    - `convex-realtime`: Not needed for schema design phase

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 1 completes)
  - **Parallel Group**: Wave 1 (with Task 3) — but depends on Task 1 scaffold existing
  - **Blocks**: Tasks 4, 7, 8, 9, 10, 11
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `prisma/schema.prisma` — existing data model (User, Session, EmailVerificationCode, Project) as migration reference
  - `src/lib/server/db.ts` — Prisma client singleton pattern (to be replaced by Convex client)

  **External References**:
  - Convex schema docs: `docs.convex.dev/database/schemas`
  - @convex-dev/better-auth README: schema requirements for auth tables
  - @convex-dev/polar README: schema requirements for subscription/product tables
  - @convex-dev/agent README: message/thread schema patterns
  - @convex-dev/rate-limiter README: component registration pattern
  - @convex-dev/resend README: component setup

  **WHY Each Reference Matters**:
  - v1 Prisma schema shows the existing domain model to evolve (Projects especially)
  - Each component README documents required schema tables that the component manages — must not conflict
  - Convex schema docs show validator syntax and index patterns

  **Acceptance Criteria**:

  ```
  Scenario: All 5 Convex components initialize
    Tool: Bash
    Preconditions: Convex dev account configured, env vars set
    Steps:
      1. Run: npx convex dev --once
      2. Assert: Exit code 0
      3. Assert: Output does not contain "error" or "Error"
      4. Assert: Output contains successful deployment/push message
    Expected Result: All components registered and schema deployed
    Evidence: Command output captured

  Scenario: Schema has correct tables and indexes
    Tool: Bash
    Preconditions: Convex deployed
    Steps:
      1. Run: npx convex schema --json (or equivalent schema inspection)
      2. Assert: Tables include: users, projects, conversations, messages
      3. Assert: projects table has index by_userId
      4. Assert: conversations table has index by_userId
      5. Assert: messages table has index by_conversationId
    Expected Result: Schema matches design
    Evidence: Schema output captured

  Scenario: ConvexProvider renders in Next.js
    Tool: Playwright
    Preconditions: Dev server + Convex dev running
    Steps:
      1. Navigate to: http://localhost:3000
      2. Assert: Page loads without React errors in console
      3. Assert: No "ConvexProvider" or "Missing" errors
    Expected Result: Convex client connected
    Evidence: Console output captured
  ```

  **Commit**: YES
  - Message: `feat: add Convex schema + register 5 components (agent, auth, polar, rate-limiter, resend)`
  - Files: `convex/`, `package.json`
  - Pre-commit: `npx convex dev --once`

---

- [x] 3. Create example.env with All Variables Documented

  **What to do**:
  - Create `example.env` (NOT `.env.example` — Convex convention) at project root
  - Document EVERY environment variable needed:
    - **Convex**: CONVEX_DEPLOYMENT, NEXT_PUBLIC_CONVEX_URL
    - **Auth (better-auth)**: BETTER_AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
    - **AI**: OPENAI_API_KEY (optional — app works without it)
    - **Polar**: POLAR_ACCESS_TOKEN, POLAR_WEBHOOK_SECRET, POLAR_FREE_PRODUCT_ID, POLAR_PRO_PRODUCT_ID
    - **Resend**: RESEND_API_KEY
    - **App**: NEXT_PUBLIC_APP_URL
  - Each variable has a comment explaining: what it is, where to get it, whether it's required or optional
  - Group variables by service with section headers
  - Mark OPENAI_API_KEY as optional with note: "App works without this — AI copilot will show setup prompt"

  **Must NOT do**:
  - Do NOT include actual secret values
  - Do NOT exceed 15 environment variables total
  - Do NOT add R2/Cloudflare variables (not using R2)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file creation, straightforward documentation task
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - No skills needed for env file creation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: None
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - v1 README "Getting Started" section — lists current env vars needed
  - @convex-dev/polar README — Polar env var requirements
  - @convex-dev/better-auth README — Auth env var requirements

  **WHY Each Reference Matters**:
  - v1 README shows what env vars users currently expect — helps map migration
  - Component READMEs document required env vars per service

  **Acceptance Criteria**:

  ```
  Scenario: example.env contains all required variables
    Tool: Bash
    Preconditions: example.env created
    Steps:
      1. Assert: File example.env exists at project root
      2. Assert: Contains CONVEX_DEPLOYMENT
      3. Assert: Contains NEXT_PUBLIC_CONVEX_URL
      4. Assert: Contains BETTER_AUTH_SECRET
      5. Assert: Contains GITHUB_CLIENT_ID
      6. Assert: Contains OPENAI_API_KEY
      7. Assert: Contains POLAR_ACCESS_TOKEN
      8. Assert: Contains RESEND_API_KEY
      9. Assert: OPENAI_API_KEY line contains "optional" in comment
      10. Count non-comment, non-empty lines ≤ 15
    Expected Result: All variables documented, ≤15 total
    Evidence: File content captured
  ```

  **Commit**: YES (groups with Task 1)
  - Message: `docs: add example.env with all required variables`
  - Files: `example.env`

---

- [ ] 4. better-auth Integration (GitHub + Email OTP)

  **What to do**:
  - Configure `@convex-dev/better-auth` component in `convex/auth.ts`
  - Set up better-auth server config:
    - GitHub OAuth provider (using GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
    - Email OTP provider (using Resend for email delivery)
    - Session configuration (30-day sessions, auto-renewal)
  - Create auth API route handler: `src/app/api/auth/[...all]/route.ts`
  - Create auth client: `src/lib/auth-client.ts` using `@better-auth/client`
  - Implement `proxy.ts` (Next.js 16) with auth redirect logic:
    - `/dashboard/*` routes require authentication → redirect to `/login`
    - `/login` with active session → redirect to `/dashboard`
  - Build login page: `src/app/login/page.tsx`
    - GitHub OAuth button
    - Email input + "Send OTP" button
    - OTP verification input (6-digit code)
    - Styled with shadcn/ui components
  - Build logout button component
  - Create auth hook/utility for getting current user in client components
  - Create server-side auth check for server components (via `auth.api.getSession({ headers: await headers() })`)
  - Verify session persistence: login → refresh page → still logged in

  **Must NOT do**:
  - Do NOT add Google, Discord, or other OAuth providers (GitHub + Email OTP only)
  - Do NOT add magic link auth (OTP only)
  - Do NOT add 2FA/MFA (v2.1 concern)
  - Do NOT use middleware.ts (use proxy.ts)
  - Do NOT build registration page separately — login page handles both signup and signin

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Auth is complex, touches multiple layers (Convex backend, Next.js API route, proxy.ts, client components, session management)
  - **Skills**: [`convex`, `Better Auth Best Practices`, `next-best-practices`]
    - `convex`: Convex function patterns, component usage
    - `Better Auth Best Practices`: better-auth setup, providers, session management
    - `next-best-practices`: API route handlers, proxy.ts pattern, RSC auth patterns
  - **Skills Evaluated but Omitted**:
    - `convex-security-check`: Good practice but auth is the security focus here

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 5, 6)
  - **Blocks**: Tasks 7, 8, 9, 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `src/lib/server/auth/index.ts` — current auth flow: OTP generation (generateOTP), verification (verifyOTP), getCurrentUser pattern
  - `src/lib/server/auth/session.ts` — session creation/validation with @oslojs/crypto (replace with better-auth sessions)
  - `src/lib/server/auth/github.ts` — GitHub OAuth setup with Arctic library (replace with better-auth GitHub provider)
  - `src/lib/server/auth/cookies.ts` — session cookie management (httpOnly, secure, sameSite) — better-auth handles this
  - `src/components/layout/auth-form.tsx` — login form UI with GitHub button + OTP input field pattern
  - `src/app/[locale]/@loginDialog/` — parallel route login modal pattern (consider keeping for v2)

  **External References**:
  - better-auth docs: `better-auth.com` — setup, Next.js integration, GitHub provider, Email OTP
  - @convex-dev/better-auth README: Convex-specific adapter pattern
  - Next.js 16 docs: proxy.ts API for auth redirects

  **WHY Each Reference Matters**:
  - v1 auth form shows the UX pattern users expect (GitHub button + OTP input)
  - better-auth docs are critical — this is a new library not in v1
  - proxy.ts docs needed because this is a breaking change from middleware.ts

  **Acceptance Criteria**:

  ```
  Scenario: GitHub OAuth login flow
    Tool: Playwright
    Preconditions: Dev server + Convex running, GitHub OAuth app configured
    Steps:
      1. Navigate to: http://localhost:3000/login
      2. Assert: GitHub login button visible
      3. Click: GitHub login button
      4. Assert: Redirected to github.com/login/oauth
    Expected Result: OAuth redirect initiates
    Evidence: .sisyphus/evidence/task-4-github-redirect.png

  Scenario: Unauthenticated dashboard redirect
    Tool: Bash
    Preconditions: Dev server running, no auth session
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" -L http://localhost:3000/dashboard
      2. Assert: Final URL contains /login
    Expected Result: Redirects to login page
    Evidence: curl output captured

  Scenario: Login page renders correctly
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/login
      2. Assert: Input[type="email"] exists
      3. Assert: Button containing "GitHub" text exists
      4. Assert: Button containing "Send" or "OTP" text exists
      5. Screenshot: .sisyphus/evidence/task-4-login-page.png
    Expected Result: Login page shows email input + GitHub + OTP buttons
    Evidence: .sisyphus/evidence/task-4-login-page.png
  ```

  **Commit**: YES
  - Message: `feat: add better-auth with GitHub OAuth + Email OTP`
  - Files: `convex/auth.ts`, `src/app/api/auth/`, `src/app/login/`, `src/lib/auth-client.ts`, `src/proxy.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 5. Landing Page (AI-Focused Marketing Sections)

  **What to do**:
  - Build landing page at `src/app/page.tsx` with marketing sections:
    - **Hero**: Headline emphasizing AI SaaS builder, CTA to get started, screenshot/mockup of AI copilot
    - **Features**: 6 feature cards highlighting: AI Copilot, Convex Real-time, better-auth, Polar Billing, shadcn/ui, Vercel Deploy
    - **Pricing**: Free vs Pro tier comparison (matching Polar product structure)
    - **FAQ**: 5-6 common questions about the template
    - **Testimonials**: Placeholder testimonial cards (template users fill in their own)
    - **CTA**: Final call-to-action section
  - Create shared layout components:
    - Header/navbar with logo, nav links, theme toggle, login/dashboard button
    - Footer with links, branding
  - All sections responsive (mobile-first)
  - All sections support dark mode
  - Use shadcn/ui components throughout

  **Must NOT do**:
  - Do NOT add interactive AI demo on landing page
  - Do NOT add animations beyond simple Tailwind transitions
  - Do NOT add more than 6 marketing sections
  - Do NOT add a blog or content feed on the landing page
  - Do NOT add i18n

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Landing page is primarily a UI/design task with responsive layout requirements
  - **Skills**: [`frontend-ui-ux`, `frontend-design`]
    - `frontend-ui-ux`: Responsive design, component composition, accessibility
    - `frontend-design`: Production-grade interface design, avoiding generic AI aesthetics
  - **Skills Evaluated but Omitted**:
    - `next-best-practices`: Landing page is mostly static UI, not complex Next.js patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/hero.tsx` — Hero section with headline, subtitle, CTA buttons
  - `src/components/sections/features.tsx` — Feature cards grid layout (6 features)
  - `src/components/sections/pricing.tsx` — Pricing comparison table (Free vs Pro)
  - `src/components/sections/faq.tsx` — FAQ accordion using shadcn Accordion component
  - `src/components/sections/testimonials.tsx` — Testimonial cards with avatar, name, role
  - `src/components/sections/cta.tsx` — Final CTA section with button
  - `src/components/layout/header/navbar.tsx` — Responsive navbar with mobile menu, theme toggle, auth state
  - `src/components/layout/footer.tsx` — Footer with nav links and branding
  - `src/config/site.ts` — Site metadata (name, description, URL, links)

  **WHY Each Reference Matters**:
  - v1 sections provide proven layout patterns — v2 should feel like an evolution, not a completely alien design
  - Navbar pattern shows mobile menu, theme toggle, auth state switching

  **Acceptance Criteria**:

  ```
  Scenario: Landing page renders all sections
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000
      2. Assert: Hero section visible with headline text
      3. Scroll to features section — assert 6 feature cards visible
      4. Scroll to pricing — assert Free and Pro tiers visible
      5. Scroll to FAQ — assert accordion items present
      6. Scroll to CTA — assert call-to-action button visible
      7. Screenshot (full page): .sisyphus/evidence/task-5-landing-full.png
    Expected Result: All 6 sections render correctly
    Evidence: .sisyphus/evidence/task-5-landing-full.png

  Scenario: Landing page mobile responsive
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Set viewport: 390x844 (iPhone 14)
      2. Navigate to: http://localhost:3000
      3. Assert: Mobile menu hamburger visible (not full nav)
      4. Assert: Feature cards stack vertically
      5. Assert: Pricing cards stack vertically
      6. Screenshot: .sisyphus/evidence/task-5-landing-mobile.png
    Expected Result: Fully responsive on mobile
    Evidence: .sisyphus/evidence/task-5-landing-mobile.png

  Scenario: Landing page loads without env vars
    Tool: Bash
    Preconditions: Dev server running with NO env vars set
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
      2. Assert: HTTP 200
      3. curl -s http://localhost:3000 | grep -q "ChadNext" (or equivalent heading)
      4. Assert: grep matches
    Expected Result: Landing page works with zero configuration
    Evidence: curl output captured
  ```

  **Commit**: YES
  - Message: `feat: add AI-focused landing page with marketing sections`
  - Files: `src/app/page.tsx`, `src/components/sections/`, `src/components/layout/`
  - Pre-commit: `pnpm build`

---

- [ ] 6. Fumadocs Setup (Changelog + Getting Started)

  **What to do**:
  - Install Fumadocs: `fumadocs-mdx`, `fumadocs-core`, `fumadocs-ui`
  - Configure Fumadocs with `source.config.ts`
  - Create docs route: `src/app/docs/[[...slug]]/page.tsx`
  - Create content directory: `content/docs/`
  - Write 4 documentation pages:
    1. **Getting Started**: Clone, install, configure env vars, run dev, deploy to Vercel
    2. **Environment Variables**: Every variable explained with screenshots of where to get values
    3. **Architecture**: High-level overview of the Convex-native stack, component diagram
    4. **Changelog**: v2.0.0 initial release notes
  - Style Fumadocs pages to match template theme (dark mode, fonts, colors)
  - Add "Docs" link to navbar

  **Must NOT do**:
  - Do NOT write API reference docs
  - Do NOT write tutorial series
  - Do NOT add video embeds
  - Do NOT create more than 4 initial doc pages
  - Do NOT build a custom docs theme — use Fumadocs defaults styled to match

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Mostly configuration + content writing, not complex engineering
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `writing`: Could help with prose quality but docs are technical, not creative

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `velite.config.ts` — current Velite content collection config (replace with Fumadocs source.config.ts)
  - `src/content/changelog/` — 7 existing changelog MDX entries (port content to Fumadocs format)

  **External References**:
  - Fumadocs docs: `fumadocs.vercel.app` — setup, Next.js integration, MDX configuration
  - Fumadocs GitHub: `github.com/fuma-nama/fumadocs`

  **WHY Each Reference Matters**:
  - v1 Velite config shows what content collections exist to migrate
  - Fumadocs docs are essential — new dependency not in v1

  **Acceptance Criteria**:

  ```
  Scenario: Docs page renders
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to: http://localhost:3000/docs
      2. Assert: "Getting Started" visible in navigation
      3. Assert: "Environment Variables" visible in navigation
      4. Assert: "Architecture" visible in navigation
      5. Assert: "Changelog" visible in navigation
      6. Screenshot: .sisyphus/evidence/task-6-docs.png
    Expected Result: All 4 doc pages listed in nav
    Evidence: .sisyphus/evidence/task-6-docs.png

  Scenario: Docs build succeeds
    Tool: Bash
    Preconditions: Content files created
    Steps:
      1. Run: pnpm build
      2. Assert: Exit code 0
      3. Assert: No errors related to Fumadocs or MDX
    Expected Result: Build includes docs pages
    Evidence: Build output captured
  ```

  **Commit**: YES
  - Message: `feat: add Fumadocs with getting started, env vars, architecture, changelog`
  - Files: `content/docs/`, `src/app/docs/`, `source.config.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 7. Dashboard Layout + Projects CRUD

  **What to do**:
  - Create dashboard layout: `src/app/dashboard/layout.tsx`
    - Sidebar navigation (using shadcn/ui sidebar): Projects, Billing, Settings, AI Chat
    - Top bar with user avatar, theme toggle, logout
    - Main content area
    - Mobile responsive (sidebar collapses to hamburger)
  - Create Projects page: `src/app/dashboard/projects/page.tsx`
    - List all user's projects (Convex query with by_userId index)
    - "Create Project" button → dialog with form (name, description, domain)
    - Project cards showing name, status, domain, creation date
    - Click project → detail page
  - Create Project detail page: `src/app/dashboard/projects/[projectId]/page.tsx`
    - Editable fields (name, description, domain, status)
    - Delete project with confirmation dialog
  - Implement Convex functions in `convex/projects.ts`:
    - `list`: Query user's projects (paginated)
    - `get`: Get single project by ID (verify ownership)
    - `create`: Create project (validate inputs, check free plan limit of 3)
    - `update`: Update project fields (verify ownership)
    - `remove`: Delete project (verify ownership)
  - Enforce free plan limit: maximum 3 projects on free tier (show upgrade prompt)

  **Must NOT do**:
  - Do NOT add project analytics or charts
  - Do NOT add team/collaboration features
  - Do NOT add project settings beyond basic fields
  - Do NOT add real-time collaborative editing
  - Do NOT add project search/filter (keep simple)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Full-stack feature touching Convex mutations, queries, Next.js pages, UI components, authorization
  - **Skills**: [`convex-functions`, `convex-best-practices`, `frontend-ui-ux`]
    - `convex-functions`: Query/mutation patterns, argument validation, error handling
    - `convex-best-practices`: Function organization, TypeScript, authorization patterns
    - `frontend-ui-ux`: Dashboard layout, responsive sidebar, form UX
  - **Skills Evaluated but Omitted**:
    - `convex-realtime`: Convex is auto-reactive, no special subscription code needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Task 10 (AI copilot needs project tools)
  - **Blocked By**: Task 4 (auth must exist for user context)

  **References**:

  **Pattern References**:
  - `src/app/[locale]/dashboard/layout.tsx` — dashboard layout with sidebar navigation pattern
  - `src/app/[locale]/dashboard/projects/page.tsx` — projects listing page with project cards
  - `src/app/[locale]/dashboard/projects/action.ts` — CRUD server actions (createProject, deleteProject, updateProject) to port to Convex mutations
  - `src/app/[locale]/dashboard/projects/[projectId]/page.tsx` — project detail page with tabbed interface
  - `src/app/[locale]/dashboard/projects/[projectId]/editable-details.tsx` — inline editable fields pattern
  - `src/app/[locale]/dashboard/projects/[projectId]/delete-card.tsx` — delete confirmation pattern
  - `src/app/[locale]/dashboard/projects/create-project-modal.tsx` — modal form for project creation
  - `src/components/ui/sidebar.tsx` — shadcn sidebar component

  **WHY Each Reference Matters**:
  - v1 dashboard layout shows the sidebar + content area pattern to replicate
  - v1 project CRUD actions show the domain logic (name, domain, free plan limit) to port to Convex

  **Acceptance Criteria**:

  ```
  Scenario: Projects CRUD full cycle
    Tool: Playwright
    Preconditions: Authenticated user, dev server + Convex running
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/projects
      2. Assert: Projects page loads (may show empty state)
      3. Click: "Create Project" button
      4. Fill: input[name="name"] → "Test Project"
      5. Fill: input[name="description"] → "A test project"
      6. Click: Submit button
      7. Wait for: "Test Project" to appear in project list
      8. Assert: Project card with "Test Project" visible
      9. Click: "Test Project" card
      10. Assert: Project detail page loads with name "Test Project"
      11. Click: Delete button
      12. Confirm: deletion dialog
      13. Assert: Redirected to projects list, "Test Project" gone
      14. Screenshot: .sisyphus/evidence/task-7-projects-crud.png
    Expected Result: Full create → view → delete cycle works
    Evidence: .sisyphus/evidence/task-7-projects-crud.png

  Scenario: Free plan project limit enforced
    Tool: Playwright
    Preconditions: Authenticated free-tier user with 3 existing projects
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/projects
      2. Click: "Create Project" button
      3. Assert: Upgrade prompt or disabled button appears
      4. Assert: Cannot create 4th project
    Expected Result: Free plan capped at 3 projects
    Evidence: .sisyphus/evidence/task-7-free-limit.png
  ```

  **Commit**: YES
  - Message: `feat: add dashboard with projects CRUD + free plan limits`
  - Files: `src/app/dashboard/`, `convex/projects.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 8. Polar.sh Billing Integration (Free/Pro Fixed Tiers)

  **What to do**:
  - Configure `@convex-dev/polar` component in `convex/billing.ts`:
    - Define products: Free tier, Pro tier (monthly, yearly)
    - Set up `getUserInfo` function to return userId + email
    - Create billing queries: `getCurrentSubscription`, `getSubscriptionStatus`
    - Create billing mutations: `generateCheckoutLink`, `generatePortalLink`
  - Set up Polar webhook endpoint: `convex/http.ts` (Convex HTTP action) at `/polar/events`
    - Handle: product.created, product.updated, subscription.created, subscription.updated, subscription.canceled
    - Ensure idempotent, order-independent processing
  - Build Billing page: `src/app/dashboard/billing/page.tsx`
    - Show current plan (Free or Pro)
    - Upgrade button → Polar checkout (using `<CheckoutLink>` component)
    - Manage subscription → Polar customer portal (using `<CustomerPortalLink>`)
    - Show plan features comparison
  - Wire subscription status to project limits (free = 3 projects, pro = unlimited)
  - Create subscription config: `src/config/subscription.ts` with plan definitions

  **Must NOT do**:
  - Do NOT implement usage-based/metered billing (Polar component doesn't support it)
  - Do NOT implement per-seat pricing
  - Do NOT build custom checkout UI (use Polar's hosted checkout)
  - Do NOT add more than 2 paid tiers (just Pro monthly + yearly)
  - Do NOT add coupon/discount features

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Billing is critical path, involves webhooks, subscription state, Convex HTTP actions
  - **Skills**: [`convex-functions`, `convex-http-actions`]
    - `convex-functions`: Query/mutation patterns for billing state
    - `convex-http-actions`: Webhook endpoint setup, request handling, signature validation
  - **Skills Evaluated but Omitted**:
    - `convex-security-check`: Webhook signature validation is covered in http-actions skill

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 9)
  - **Blocks**: Task 10 (AI copilot billing tools)
  - **Blocked By**: Tasks 2, 4

  **References**:

  **Pattern References**:
  - `src/app/api/stripe/route.ts` — Stripe checkout session + customer portal creation (adapt pattern to Polar)
  - `src/app/api/webhooks/stripe/route.ts` — Webhook handling with signature verification (adapt to Convex HTTP action for Polar)
  - `src/components/billing-form.tsx` — Billing page UI with plan display and upgrade button
  - `src/config/subscription.ts` — Free/Pro plan definitions (freePlan, proPlan objects with features)
  - `src/lib/server/payment.ts` — Stripe helper functions (createCheckoutSession, createBillingPortal) to port to Polar equivalents

  **External References**:
  - @convex-dev/polar README and docs: `labs.convex.dev/polar` — setup, webhook registration, React components
  - Polar.sh docs: `docs.polar.sh` — product creation, subscription management

  **WHY Each Reference Matters**:
  - v1 Stripe patterns show the billing UX flow to replicate with Polar
  - v1 subscription config shows the Free/Pro tier definitions to port
  - Polar docs needed — this is a completely new integration

  **Acceptance Criteria**:

  ```
  Scenario: Billing page shows current plan
    Tool: Playwright
    Preconditions: Authenticated user, Polar configured
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/billing
      2. Assert: Current plan displayed (Free or Pro)
      3. Assert: Upgrade button visible (if on Free)
      4. Assert: Plan features comparison visible
      5. Screenshot: .sisyphus/evidence/task-8-billing.png
    Expected Result: Billing page renders with plan info
    Evidence: .sisyphus/evidence/task-8-billing.png

  Scenario: Polar webhook endpoint exists
    Tool: Bash
    Preconditions: Convex running
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" -X POST https://<convex-url>/polar/events -H "Content-Type: application/json" -d '{}'
      2. Assert: HTTP status is 400 or 401 (bad signature), NOT 404 (missing)
    Expected Result: Webhook endpoint registered and rejects invalid requests
    Evidence: curl output captured

  Scenario: Checkout link generates
    Tool: Playwright
    Preconditions: Authenticated free-tier user
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/billing
      2. Click: Upgrade to Pro button
      3. Assert: Redirected to Polar checkout page (checkout.polar.sh or similar)
    Expected Result: Polar checkout initiates
    Evidence: .sisyphus/evidence/task-8-checkout-redirect.png
  ```

  **Commit**: YES
  - Message: `feat: add Polar.sh billing with Free/Pro tiers + webhooks`
  - Files: `convex/billing.ts`, `convex/http.ts`, `src/app/dashboard/billing/`, `src/config/subscription.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 9. User Settings Page (Profile, Image Upload)

  **What to do**:
  - Build Settings page: `src/app/dashboard/settings/page.tsx`
    - Profile form: name, email (read-only), profile picture
    - Profile picture upload using Convex built-in file storage
    - Save changes via Convex mutation
    - Show success/error toasts (sonner)
  - Implement Convex functions:
    - `convex/users.ts`: `getProfile`, `updateProfile`, `uploadProfilePicture`, `generateUploadUrl`
  - Display user avatar in dashboard header (from Convex file storage URL or OAuth avatar)

  **Must NOT do**:
  - Do NOT add password change (no passwords — OAuth + OTP only)
  - Do NOT add account deletion (v2.1)
  - Do NOT add notification preferences
  - Do NOT add API key management (v2.1)
  - Do NOT use UploadThing or R2 — use Convex built-in file storage

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Standard form + file upload, no complex logic
  - **Skills**: [`convex-file-storage`]
    - `convex-file-storage`: Upload flows, serving files via URL, deletion
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Settings form is standard, not design-heavy

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: None
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `src/app/[locale]/dashboard/settings/page.tsx` — settings page layout with form
  - `src/app/[locale]/dashboard/settings/actions.ts` — profile update + image upload server actions (port to Convex mutations)
  - `src/app/[locale]/dashboard/settings/settings-form.tsx` — settings form UI with name field and image upload
  - `src/components/layout/image-upload-modal.tsx` — image upload modal pattern (port to Convex file storage)

  **External References**:
  - Convex file storage docs: `docs.convex.dev/file-storage`

  **WHY Each Reference Matters**:
  - v1 settings shows the exact form fields and UX pattern to replicate
  - Convex file storage replaces UploadThing — need new upload pattern

  **Acceptance Criteria**:

  ```
  Scenario: Update profile name
    Tool: Playwright
    Preconditions: Authenticated user
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/settings
      2. Clear: input[name="name"]
      3. Fill: input[name="name"] → "Updated Name"
      4. Click: Save button
      5. Wait for: Toast notification with success message
      6. Refresh page
      7. Assert: input[name="name"] value is "Updated Name"
    Expected Result: Name persists after refresh
    Evidence: .sisyphus/evidence/task-9-settings.png
  ```

  **Commit**: YES
  - Message: `feat: add user settings with profile and image upload`
  - Files: `src/app/dashboard/settings/`, `convex/users.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 10. AI Copilot (7 Tools + Chat UI + Rate Limiting)

  **What to do**:
  - Configure `@convex-dev/agent` in `convex/chat.ts`:
    - Create agent with system prompt explaining the app context and available actions
    - Define 7 tools using `createTool` (which provides `ctx.userId` for security scoping):
      1. `listProjects` — Query user's projects
      2. `getProject` — Get project details by name or ID
      3. `createProject` — Create new project (respects free plan limit)
      4. `updateProject` — Update project fields
      5. `deleteProject` — Delete project (with confirmation flag)
      6. `getSubscriptionStatus` — Check current billing plan + features
      7. `getDashboardStats` — Summary stats (project count, plan, account age)
    - Each tool scoped to current user via `ctx.userId` — NEVER allows cross-user data access
    - deleteProject requires a `confirmed: true` parameter (UI shows confirmation before calling)
  - Configure `@convex-dev/rate-limiter` for chat:
    - Free tier: 20 messages/hour (token bucket)
    - Pro tier: 200 messages/hour (token bucket)
    - Rate limit checked before AI invocation
  - Create chat API route: `src/app/api/chat/route.ts`
    - POST handler using Vercel AI SDK `streamText` + Agent
    - Auth check (reject unauthenticated)
    - Rate limit check (return 429 if exceeded)
    - Graceful handling when OPENAI_API_KEY is not set (return helpful error message)
  - Build Chat UI: `src/app/dashboard/chat/page.tsx`
    - Message list with user/assistant bubbles
    - Tool execution display (show what the AI is doing: "Creating project...", "Checking billing...")
    - Streaming text with smooth rendering (`useSmoothText` from agent)
    - Input box with send button
    - Conversation history (stored in Convex, persists across sessions)
    - New conversation button
    - Conversation list in sidebar or panel
    - Mobile responsive (full-screen chat on mobile)
  - Build "AI not configured" state:
    - When OPENAI_API_KEY is not set, show: "Configure your AI provider to enable the copilot" with link to docs
    - Dashboard still fully functional without AI
  - Build confirmation UI for destructive actions:
    - When AI wants to delete/update, show confirmation card inline in chat
    - User must click "Confirm" before action executes

  **Must NOT do**:
  - Do NOT add more than 7 tools
  - Do NOT add RAG / vector search / document embedding
  - Do NOT add image generation tools
  - Do NOT add multi-model selector UI (default to configured model)
  - Do NOT add conversation sharing/export
  - Do NOT add voice input
  - Do NOT use @convex-dev/persistent-text-streaming (use Agent's built-in streaming)

  **Recommended Agent Profile**:
  - **Category**: `ultrabrain`
    - Reason: Most complex task in the plan. Combines AI SDK, Convex agent, tool calling, streaming, rate limiting, authorization, and complex UI state management. Requires deep understanding of all components working together.
  - **Skills**: [`convex-agents`, `convex-functions`, `frontend-ui-ux`]
    - `convex-agents`: Agent setup, tool integration, streaming, thread management
    - `convex-functions`: Query/mutation patterns for tool implementations
    - `frontend-ui-ux`: Chat interface design, streaming UX, responsive layout
  - **Skills Evaluated but Omitted**:
    - `convex-realtime`: Agent handles reactivity internally
    - `native-data-fetching`: AI SDK handles streaming, not raw fetch

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on most other tasks)
  - **Parallel Group**: Wave 4 (with Tasks 11, 12)
  - **Blocks**: Task 13
  - **Blocked By**: Tasks 7, 8 (needs project CRUD + billing to exist for tools)

  **References**:

  **Pattern References**:
  - `convex/projects.ts` (from Task 7) — project queries/mutations that tools will call
  - `convex/billing.ts` (from Task 8) — billing queries that tools will call
  - `src/components/ui/command.tsx` — cmdk command palette pattern (inspiration for chat input UX)
  - `src/components/ui/scroll-area.tsx` — Radix ScrollArea for scrollable message list

  **External References**:
  - @convex-dev/agent docs: `labs.convex.dev/agent` — createTool, streamText, thread management
  - Vercel AI SDK docs: `sdk.vercel.ai` — useChat hook, streamText, tool calling
  - Agent component README: streaming patterns, useSmoothText, tool security

  **WHY Each Reference Matters**:
  - Project/billing Convex functions are the actual backend that tools call — must understand their API
  - Agent docs are essential — this is the core differentiating feature
  - AI SDK docs for the client-side useChat integration pattern

  **Acceptance Criteria**:

  ```
  Scenario: AI copilot responds to messages
    Tool: Playwright
    Preconditions: Authenticated user, OPENAI_API_KEY configured, dev server + Convex running
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/chat
      2. Assert: Chat input visible
      3. Fill: chat input → "How many projects do I have?"
      4. Click: Send button (or press Enter)
      5. Wait for: Assistant message bubble to appear (timeout: 30s)
      6. Assert: Response text contains a number or "no projects"
      7. Screenshot: .sisyphus/evidence/task-10-chat-response.png
    Expected Result: AI responds with project count
    Evidence: .sisyphus/evidence/task-10-chat-response.png

  Scenario: AI creates project via tool call
    Tool: Playwright
    Preconditions: Authenticated user, AI configured
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/chat
      2. Fill: chat input → "Create a project called 'AI Test' with description 'Testing AI creation'"
      3. Send message
      4. Wait for: Tool execution indicator ("Creating project...")
      5. Wait for: Assistant confirmation message
      6. Navigate to: http://localhost:3000/dashboard/projects
      7. Assert: "AI Test" project appears in list
      8. Screenshot: .sisyphus/evidence/task-10-ai-create-project.png
    Expected Result: AI created a real project via tool calling
    Evidence: .sisyphus/evidence/task-10-ai-create-project.png

  Scenario: AI copilot gracefully degrades without API key
    Tool: Playwright
    Preconditions: Authenticated user, OPENAI_API_KEY NOT set
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/chat
      2. Assert: Message or banner visible containing "Configure" or "API key" or "provider"
      3. Assert: No crash, no unhandled error
      4. Screenshot: .sisyphus/evidence/task-10-no-api-key.png
    Expected Result: Helpful setup message, no crash
    Evidence: .sisyphus/evidence/task-10-no-api-key.png

  Scenario: Delete tool requires confirmation
    Tool: Playwright
    Preconditions: Authenticated user, AI configured, at least 1 project exists
    Steps:
      1. Navigate to: http://localhost:3000/dashboard/chat
      2. Fill: chat input → "Delete the project called 'AI Test'"
      3. Send message
      4. Wait for: Confirmation card/button in chat
      5. Assert: Confirmation UI visible (not auto-deleted)
      6. Screenshot: .sisyphus/evidence/task-10-delete-confirmation.png
    Expected Result: Destructive action requires explicit user confirmation
    Evidence: .sisyphus/evidence/task-10-delete-confirmation.png

  Scenario: Rate limiting works
    Tool: Bash
    Preconditions: Authenticated free-tier user, AI configured
    Steps:
      1. Send 25 rapid POST requests to /api/chat with valid auth cookie
      2. Assert: At least one response has HTTP status 429
      3. Assert: 429 response body contains "rate limit" message
    Expected Result: Rate limiting kicks in after threshold
    Evidence: curl output captured
  ```

  **Commit**: YES
  - Message: `feat: add AI copilot with 7 tools, chat UI, rate limiting, and graceful degradation`
  - Files: `convex/chat.ts`, `src/app/api/chat/`, `src/app/dashboard/chat/`, `convex/rateLimiter.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 11. Email Templates (OTP, Welcome, Billing)

  **What to do**:
  - Configure `@convex-dev/resend` in `convex/email.ts`
  - Create 3 React Email templates:
    1. `emails/verification.tsx` — OTP code for email login
    2. `emails/welcome.tsx` — Welcome email after first sign-up
    3. `emails/subscription.tsx` — Subscription confirmation (Pro upgrade)
  - Wire email sending:
    - OTP template triggered by better-auth email verification flow
    - Welcome template triggered after first successful login
    - Subscription template triggered by Polar webhook (subscription.created)
  - Set up email dev server: `pnpm dev:email` for template preview

  **Must NOT do**:
  - Do NOT create more than 3 email templates
  - Do NOT build custom email sending infrastructure (use @convex-dev/resend)
  - Do NOT add email preference management

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward templates with established patterns from v1
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 10, 12)
  - **Blocks**: None
  - **Blocked By**: Tasks 2, 4

  **References**:

  **Pattern References**:
  - `emails/verification.tsx` — OTP verification email template (port layout and content to v2)
  - `emails/thanks.tsx` — Welcome email template (port to v2 branding)
  - `src/lib/server/mail.ts` — Email sending functions: sendWelcomeEmail(), sendOTP() (now via @convex-dev/resend)

  **WHY Each Reference Matters**:
  - v1 email templates provide proven content and layout to adapt

  **Acceptance Criteria**:

  ```
  Scenario: Email templates render without errors
    Tool: Bash
    Preconditions: react-email installed
    Steps:
      1. Run: pnpm dev:email &
      2. Wait 5 seconds
      3. curl -s -o /dev/null -w "%{http_code}" http://localhost:9000
      4. Assert: HTTP 200
      5. Kill dev server
    Expected Result: Email dev server starts and serves templates
    Evidence: curl output captured
  ```

  **Commit**: YES
  - Message: `feat: add email templates (OTP, welcome, subscription) via Resend`
  - Files: `emails/`, `convex/email.ts`
  - Pre-commit: `pnpm build`

---

- [ ] 12. PWA Setup (Serwist)

  **What to do**:
  - Install Serwist: `@serwist/next`, `serwist`
  - Configure in `next.config.ts` (disabled in dev, enabled in production)
  - Create service worker: `src/app/sw.ts` with precaching + runtime caching
  - Create PWA manifest: `src/app/manifest.json` (app name, icons, theme colors, orientation)
  - Note in docs: Serwist doesn't support Turbopack — use `--webpack` flag for local PWA testing

  **Must NOT do**:
  - Do NOT add push notifications
  - Do NOT add complex offline strategies (AI SaaS needs internet)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Direct port from v1 with minimal changes
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 10, 11)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/app/sw.ts` — Serwist service worker with precaching + runtime caching (direct port)
  - `src/app/manifest.json` — PWA manifest with icons, theme colors, orientation (update branding for v2)
  - `next.config.mjs` — Serwist withSerwist() wrapper config (adapt to Next.js 16 `next.config.ts`)

  **WHY Each Reference Matters**:
  - v1 PWA setup is proven and working — minimal changes needed for v2

  **Acceptance Criteria**:

  ```
  Scenario: PWA manifest accessible
    Tool: Bash
    Preconditions: Production build running
    Steps:
      1. Run: pnpm build && pnpm start &
      2. Wait 5 seconds
      3. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/manifest.json
      4. Assert: HTTP 200
      5. curl -s http://localhost:3000/manifest.json | grep -q "ChadNext"
      6. Assert: grep matches
    Expected Result: PWA manifest serves correctly
    Evidence: Manifest content captured
  ```

  **Commit**: YES
  - Message: `feat: add PWA support with Serwist service worker`
  - Files: `src/app/sw.ts`, `src/app/manifest.json`, `next.config.ts` (updated)
  - Pre-commit: `pnpm build`

---

- [ ] 13. Final Polish (README, OG Image, SEO, Build Verification)

  **What to do**:
  - Update `README.md`:
    - New project description emphasizing AI SaaS + Convex stack
    - Updated tech stack section
    - Updated getting started (clone, install, Convex setup, env vars, dev)
    - Updated Vercel deploy button with new env vars
    - Architecture diagram (text-based: mermaid or ASCII)
    - Link to docs (Fumadocs)
    - Credits/license
  - Create OG image route: `src/app/api/og/route.ts` (dynamic OpenGraph images)
  - Configure SEO metadata in root layout: title, description, og:image, twitter:card
  - Create `src/app/robots.ts` and `src/app/sitemap.ts`
  - Create `src/config/site.ts` with site metadata
  - Final full build verification: `pnpm build` with zero errors
  - Final Convex deploy dry-run: `npx convex deploy --dry-run`
  - Verify all env vars in `example.env` match actual usage

  **Must NOT do**:
  - Do NOT add analytics integration (users add their own)
  - Do NOT add error tracking (Sentry etc — users add their own)
  - Do NOT write a migration guide from v1 (v1 users stay on v1)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Polish and documentation, no complex engineering
  - **Skills**: [`next-best-practices`]
    - `next-best-practices`: Metadata API, OG image generation, robots/sitemap

  **Parallelization**:
  - **Can Run In Parallel**: NO (final task)
  - **Parallel Group**: After Wave 4
  - **Blocks**: None (final)
  - **Blocked By**: Task 10

  **References**:

  **Pattern References**:
  - `README.md` — current README structure (tech stack list, getting started, deploy button) — update for v2
  - `src/app/api/og/route.ts` — Dynamic OG image generation using ImageResponse (port pattern)
  - `src/app/sitemap.ts` — XML sitemap generation pattern
  - `src/app/robots.ts` — robots.txt generation pattern
  - `src/config/site.ts` — site config (siteConfig object with name, description, url, links)

  **WHY Each Reference Matters**:
  - v1 README structure is a good foundation — evolve messaging, update tech stack
  - v1 SEO files are proven patterns to port

  **Acceptance Criteria**:

  ```
  Scenario: Full build succeeds
    Tool: Bash
    Preconditions: All tasks complete
    Steps:
      1. Run: pnpm build
      2. Assert: Exit code 0
      3. Assert: Zero TypeScript errors
      4. Run: npx convex deploy --dry-run
      5. Assert: Exit code 0
    Expected Result: Clean build with zero issues
    Evidence: Build output captured

  Scenario: All env vars documented
    Tool: Bash
    Preconditions: All code written
    Steps:
      1. grep -r "process.env\." src/ convex/ --include="*.ts" --include="*.tsx" -oh | sort -u > /tmp/used
      2. grep -v "^#" example.env | grep -oP "^\w+" | sort -u > /tmp/documented
      3. diff /tmp/used /tmp/documented
    Expected Result: No undocumented env vars
    Evidence: diff output captured

  Scenario: OG image generates
    Tool: Bash
    Preconditions: Production build running
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/og
      2. Assert: HTTP 200
      3. curl -s -o /tmp/og.png http://localhost:3000/api/og
      4. Assert: File /tmp/og.png exists and is >0 bytes
    Expected Result: Dynamic OG image generates
    Evidence: OG image file captured

  Scenario: README has updated content
    Tool: Bash
    Preconditions: README updated
    Steps:
      1. grep -q "Convex" README.md
      2. Assert: matches (Convex mentioned)
      3. grep -q "AI" README.md
      4. Assert: matches (AI mentioned)
      5. grep -q "better-auth" README.md OR grep -q "Polar" README.md
      6. Assert: at least one matches
    Expected Result: README reflects v2 stack
    Evidence: grep output captured
  ```

  **Commit**: YES
  - Message: `feat: add README, SEO, OG image, and final polish for v2 launch`
  - Files: `README.md`, `src/app/api/og/`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/config/site.ts`
  - Pre-commit: `pnpm build`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 1 | `feat: scaffold Next.js 16 + Tailwind 4 + shadcn/ui base` | `src/app/`, `package.json`, `src/proxy.ts` | `pnpm build` |
| 2 | `feat: add Convex schema + register 5 components` | `convex/`, `package.json` | `npx convex dev --once` |
| 3 | `docs: add example.env with all required variables` | `example.env` | File exists |
| 4 | `feat: add better-auth with GitHub OAuth + Email OTP` | `convex/auth.ts`, `src/app/login/`, `src/proxy.ts` | `pnpm build` |
| 5 | `feat: add AI-focused landing page with marketing sections` | `src/components/sections/`, `src/app/page.tsx` | `pnpm build` |
| 6 | `feat: add Fumadocs with getting started, env vars, architecture, changelog` | `content/docs/`, `src/app/docs/` | `pnpm build` |
| 7 | `feat: add dashboard with projects CRUD + free plan limits` | `src/app/dashboard/`, `convex/projects.ts` | `pnpm build` |
| 8 | `feat: add Polar.sh billing with Free/Pro tiers + webhooks` | `convex/billing.ts`, `convex/http.ts`, `src/app/dashboard/billing/` | `pnpm build` |
| 9 | `feat: add user settings with profile and image upload` | `src/app/dashboard/settings/`, `convex/users.ts` | `pnpm build` |
| 10 | `feat: add AI copilot with 7 tools, chat UI, rate limiting` | `convex/chat.ts`, `src/app/dashboard/chat/`, `src/app/api/chat/` | `pnpm build` |
| 11 | `feat: add email templates via Resend` | `emails/`, `convex/email.ts` | `pnpm build` |
| 12 | `feat: add PWA support with Serwist` | `src/app/sw.ts`, `src/app/manifest.json` | `pnpm build` |
| 13 | `feat: add README, SEO, OG image, and final polish` | `README.md`, SEO files | `pnpm build` |

---

## Success Criteria

### Verification Commands
```bash
pnpm build                    # Expected: Exit 0, zero errors
npx convex deploy --dry-run   # Expected: Exit 0, schema valid
pnpm dev                      # Expected: App starts, landing page loads
```

### Final Checklist
- [ ] All "Must Have" items present in the codebase
- [ ] All "Must NOT Have" items absent
- [ ] Landing page loads with ZERO env vars configured
- [ ] Dashboard works with all features when fully configured
- [ ] AI copilot shows setup prompt when OPENAI_API_KEY is missing
- [ ] AI copilot responds and executes tools when configured
- [ ] Auth flow works end-to-end (GitHub + Email OTP)
- [ ] Billing redirects to Polar checkout
- [ ] Free plan project limit enforced (3 max)
- [ ] Rate limiting works on chat endpoint
- [ ] All env vars documented in example.env
- [ ] README updated for v2 stack
- [ ] Fumadocs serves getting started + changelog
- [ ] PWA manifest accessible
- [ ] OG image generates
- [ ] Dark mode works throughout
