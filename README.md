![ChadNext – The agent-native SaaS starter](https://repository-images.githubusercontent.com/644861240/7dfaac30-9ee9-4e52-a4f2-daa2b1944d4f)

# ChadNext v2 ✨

**The agent-native SaaS starter.** Your AI coding agent builds it. Sigma — the in-app assistant — runs it. Fork it, swap the noun, ship this weekend.

Free & open source (MIT). Built for solo developers who want to launch an AI product fast — not enterprise plumbing.

## Why ChadNext?

Every AI app has to build the same two loops. ChadNext ships both, wired end-to-end:

| Loop | What you get |
|---|---|
| **The AI Job Loop** (product side) | The `Runs` demo entity: submit an instruction → `queued → running → succeeded` with live status, a markdown **artifact** you keep, token/cost metering, retry, and a free-tier daily limit that fires your upgrade CTA at the moment of value. Works with **zero API keys** (deterministic mock mode). |
| **The Approved-Action Loop** (agent side) | **Sigma**, the in-app assistant: 7 tools over your real data. Reads answer with live UI rendered in chat. Writes hit the **Confirm Gate** — server-enforced approval records; a denied action leaves zero trace. Memory with a "What Sigma knows" transparency panel. |

And the third layer nobody else ships: **the repo itself is agent-native.** `AGENTS.md` is the canonical guide your Cursor / Claude Code / Codex agent reads to extend the template safely — swap the demo noun for your entity (`Invoice`, `Client`, anything), add a Sigma tool, gate a feature behind Pro. The recipes are written and grounded in this codebase.

## What's inside

- **Next.js 16** (App Router, `proxy.ts`) · **Tailwind 4** CSS-first · **shadcn/ui** (incl. the official chat components) · dark mode
- **Convex** — reactive backend: schema, file storage, crons, rate limiting
- **Sigma** — `@convex-dev/agent` on **AI SDK v7** via the **Vercel AI Gateway** (one key → any model; or OpenAI/Anthropic direct)
- **Auth** — better-auth: GitHub OAuth + Email OTP
- **Billing** — Polar.sh fixed tiers (Free / Pro $29) as merchant of record (VAT handled), checkout + portal + webhooks, plan-gated quotas
- **Email** — Resend: OTP, welcome, subscription confirmation (from Convex)
- **Analytics** — PostHog: product analytics + error tracking + AI observability, gracefully optional
- **Data layer** — TanStack Query via the official `@convex-dev/react-query` adapter
- **Env** — `@t3-oss/env-nextjs`: typed, loud failures, zero-config boot
- **Landing** — bento features, agent-native hero, functional motion, PWA, SEO/OG
- **Runs table** — TanStack Table; artifacts render as markdown
- ⌘K "Ask Sigma" command palette, seeded demo data, legal page stubs

## Quickstart

```bash
git clone https://github.com/moinulmoin/chadnext.git
cd chadnext
pnpm install

# 1. Initialize Convex (interactive: creates your free account + deployment)
npx convex dev

# 2. Configure env
cp example.env .env.local   # fill in what you have; everything except Convex is optional

# 3. Run
pnpm dev
```

The app boots with **zero API keys** — runs process in deterministic mock mode, billing shows a setup card, Sigma explains how to go live. Add keys progressively:

| Key | Unlocks |
|---|---|
| `VERCEL_AI_GATEWAY_API_KEY` | Real model responses (one key, every provider — no markup) |
| `GITHUB_CLIENT_ID/SECRET`, `BETTER_AUTH_SECRET` | GitHub OAuth login |
| `POLAR_ORGANIZATION_TOKEN`, `POLAR_PRO_PRODUCT_ID`, `POLAR_WEBHOOK_SECRET` | Checkout, portal, plan-gated quotas |
| `RESEND_API_KEY` | Transactional email |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics + error tracking |

Full docs at the `/docs` route after `pnpm dev`.

## The fork flow (why it's fast)

1. Clone, run, log in — the whole product works in mock mode immediately.
2. Open your AI coding agent and say: *"Replace the Runs entity with `Invoice` — follow AGENTS.md."*
3. The agent follows the **Swap the Noun** recipe: schema → Convex functions (with ownership checks) → quota → UI → Sigma tools.
4. Deploy to Vercel. Done.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmoinulmoin%2Fchadnext&env=NEXT_PUBLIC_CONVEX_URL,CONVEX_DEPLOYMENT,BETTER_AUTH_SECRET,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET)

> Polar webhook: point it at `<your-deployment>.convex.site/polar/events` with `subscription.*` + `product.*` events.

## Contributing 🤝

PRs welcome. Read `AGENTS.md` first (it's for humans too), then `docs/plans/` for the roadmap.

## License 📄

[MIT](./LICENSE) — free for everything, forever.

## Author ✍️

Moinul Moin ([@immoinulmoin](https://twitter.com/immoinulmoin))
