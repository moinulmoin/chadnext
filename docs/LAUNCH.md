# ChadNext v2 — Launch Package

**Status:** code-complete (P1–P5). One user action remains before tagging final v2.0: initialize Convex (see below).
**Tag when verified:** `v2.0.0-rc.1` → after live E2E, `v2.0.0`.

---

## ⚠️ The one required user action (P6 gate)

The backend has never been pushed to a live Convex deployment (codegen stubs are local). Run:

```bash
npx convex dev        # interactive: login/confirm deployment; pushes schema + functions; regenerates _generated/
pnpm build            # re-verify against REAL generated types (strict — may surface typing fixes)
```

Then configure Convex-side env (Dashboard → Settings → Environment Variables, or `npx convex env add`):
`VERCEL_AI_GATEWAY_API_KEY` (or `OPENAI_API_KEY`/`ANTHROPIC_API_KEY`), `GITHUB_CLIENT_ID/SECRET`,
`BETTER_AUTH_SECRET`, `POLAR_ORGANIZATION_TOKEN`, `POLAR_PRO_PRODUCT_ID`, `POLAR_WEBHOOK_SECRET`, `RESEND_API_KEY`, `RESEND_FROM`.

Polar webhook → `https://<deployment>.convex.site/polar/events` (`subscription.*`, `product.*`).

## E2E verification checklist (run after `npx convex dev` + `pnpm dev`)

- [ ] Landing renders (dark + light), hero mock, bento, pricing says Free/Pro $29
- [ ] Zero keys: run loop works in mock mode end-to-end (create → succeeded artifact)
- [ ] "Load demo data" seeds 6 runs on empty state
- [ ] GitHub OAuth + Email OTP login (OTP email arrives if RESEND_API_KEY set)
- [ ] Sigma chat: streaming reply; `listRuns` renders in-chat table; `createRun` → approval card → **Approve** creates the run; **Deny** leaves no trace (verify runs count unchanged)
- [ ] Rate limit: 21st Sigma message in an hour (free) shows friendly limit error
- [ ] Billing page: unconfigured setup card OR checkout redirect + portal with Polar env
- [ ] Pro upgrade lifts runs/day + Sigma hourly limits
- [ ] Settings: rename persists; avatar uploads; "What Sigma knows" lists + deletes memories
- [ ] ⌘K → "Ask Sigma" routes to chat with query prefilled
- [ ] `/privacy`, `/terms` render; no dead links anywhere
- [ ] `pnpm build` green on real codegen types; `pnpm lint` exit 0

## Demo video script (the money shot, ~90s)

1. **0–10s** — Hero scroll: "The agent-native SaaS starter."
2. **10–30s** — Fresh clone, `pnpm dev`, zero keys: create a Run in mock mode → status pill flips queued→running→succeeded live → artifact renders.
3. **30–60s** — Sigma: "How many runs do I have?" → live table in chat. "Create a run about X" → approval card → Approve → run appears.
4. **60–75s** — Deny path: ask for a delete, hit Deny, show nothing changed.
5. **75–90s** — Open Claude Code/Cursor in the repo: type "Add a `priority` field to Runs following AGENTS.md" → agent follows the recipe. Cut to Vercel deploy. End card: repo URL.

## Launch posts

- **HN (Show HN):** "Show HN: ChadNext — an agent-native SaaS starter (Next.js 16 + Convex + AI SDK 7)" — lead with the two loops + Confirm Gate demo GIF; be plain about what's demo vs. real.
- **r/nextjs:** same body, emphasize the stack (Next 16, proxy.ts, TanStack adapter pattern) — that sub loves the technical bits.
- **r/SideProject + X thread:** the fork-flow story ("swap the noun" in one agent session).
- Checklist before posting: repo README final, demo video/GIF hosted, demo site deployed (Vercel + Convex prod deployment), MIT license badge, stars-worthy screenshots in README.

## Repo cosmetics (post-RC)

- GitHub social preview image (1200×640, agent-native tagline)
- Issue templates (bug/feature), CONTRIBUTING.md (point to AGENTS.md)
- Topics: `nextjs`, `convex`, `saas-boilerplate`, `ai-sdk`, `agent-native`, `open-source`
