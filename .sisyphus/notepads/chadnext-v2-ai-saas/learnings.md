
# Task 3: Create example.env with All Variables Documented (2025-02-11)

## What Worked
- Created `example.env` at project root with 12 environment variables (≤15 target)
- Used clear section headers by service (Convex, Auth, AI, Polar, Resend, App)
- Each variable documented with: what it is, where to get it, required/optional status
- OPENAI_API_KEY marked as optional with inline comment for grep detection

## Key Conventions
- Filename: `example.env` (NOT `.env.example`) — Convex convention
- Variables grouped by service with `# ===...===` section headers
- Inline comments required for grep detection (e.g., `OPENAI_API_KEY=...  # Optional - ...`)
- Placeholder values use descriptive prefixes (your-*, sk-*, re_*, prod_*)

## Verification Commands Used
```bash
# File existence
test -f example.env

# Variable presence (grep -q)
grep -q "CONVEX_DEPLOYMENT" example.env
grep -q "NEXT_PUBLIC_CONVEX_URL" example.env
grep -q "BETTER_AUTH_SECRET" example.env
grep -q "GITHUB_CLIENT_ID" example.env
grep -q "OPENAI_API_KEY" example.env
grep -q "POLAR_ACCESS_TOKEN" example.env
grep -q "RESEND_API_KEY" example.env

# Optional marker verification
grep "OPENAI_API_KEY" example.env | grep -i "optional"

# Count variables (non-comment, non-empty)
grep -v "^#" example.env | grep -v "^$" | wc -l
```

## Commit Details
- Commit hash: ff22521
- Message: `docs: add example.env with all required variables`
- Files: `example.env`

---

# Task 1: Scaffold Next.js 16 + Tailwind 4 + shadcn/ui (2025-02-11)

## Key Learnings

### Next.js 16
- Latest stable: 16.1.6
- `middleware.ts` renamed to `proxy.ts` (breaking change)
- `proxy.ts` goes in `src/` (same level as `app/`) when using src/ directory
- Export function name is `proxy()` not `middleware()`
- Proxy runs on Node.js runtime by default (not Edge)
- React Compiler (`babel-plugin-react-compiler`) is built-in
- Turbopack is the default bundler

### Tailwind CSS 4
- CSS-first configuration: `@import "tailwindcss"` in globals.css
- No `tailwind.config.js` or `tailwind.config.ts` needed
- PostCSS config uses `@tailwindcss/postcss` plugin
- shadcn/ui generates `@theme inline` blocks and `@custom-variant dark` for dark mode
- CSS variables use oklch color space (not hsl like v1)
- `tw-animate-css` replaces `tailwindcss-animate`

### shadcn/ui with Tailwind 4
- `shadcn init -d` auto-detects Tailwind v4 and sets up CSS-first config
- components.json has `"config": ""` (empty) for Tailwind 4
- Uses `new-york` style by default now
- Import alias: `@/*` -> `./src/*` (not `~/*` like v1)
- sidebar component auto-installs `use-mobile.ts` hook

### Path Aliases
- v1 used `~/*` -> `./src/*`
- v2 uses `@/*` -> `./src/*` (Next.js default, shadcn default)

### next-themes
- Installed as transitive dep by shadcn/ui
- `attribute="class"` works with `@custom-variant dark (&:is(.dark *))` in Tailwind 4
- `suppressHydrationWarning` on `<html>` element still needed
- `disableTransitionOnChange` prevents flash on theme switch

### Build Output
- All routes: /, /_not-found, /dashboard, /login
- Proxy shows as "f Proxy (Middleware)" in build output
- Build time ~1.4s with Turbopack

## Commit Details
- Commit hash: 74a6524
- Message: `feat: scaffold Next.js 16 + Tailwind 4 + shadcn/ui base`
- Branch: v2

# Task 2: Convex schema + 5 component registration (2026-02-11)

## What Worked
- Registered all five Convex components in convex/convex.config.ts with app.use(...): agent, better-auth, polar, rate-limiter, resend.
- Defined app schema in convex/schema.ts for users/projects/conversations/messages with required indexes: users.by_email, projects.by_userId, conversations.by_userId, messages.by_conversationId.
- Added domain stubs in convex/auth.ts, convex/projects.ts, convex/chat.ts, convex/billing.ts, convex/email.ts, and convex/rateLimiter.ts so modules are present together.
- Added ConvexProvider wiring into src/app/layout.tsx via convex/ConvexProvider.tsx and made provider safe when NEXT_PUBLIC_CONVEX_URL is not set (returns children fallback).
- pnpm build passes after adding local _generated stubs to satisfy TS before first real Convex codegen.

## Gotchas
- npx convex dev --once cannot run in this environment without preconfigured deployment (CONVEX_DEPLOYMENT) and fails in non-interactive terminal when prompting for project setup.
- npx convex codegen --init also requires deployment selection and creates convex/README.md, convex/tsconfig.json, and empty convex/_generated/ folder before failing.
- @convex-dev/agent currently reports peer warnings with ai@6 (@convex-dev/agent@0.3.2 expects ai@^5), but build remains successful for current stubs.

## Verification
- TypeScript diagnostics clean on all changed TS/TSX files.
- pnpm build succeeds.
- Convex deploy verification is blocked until deployment/env setup exists.

---

# Task 5: Landing Page (AI-Focused Marketing Sections) (2026-02-11)

## What Worked
- Assembled landing page at `src/app/page.tsx` with 6 distinct sections:
  - Hero: Headline, CTA, and mock dashboard placeholder
  - Features: 6 cards highlighting tech stack (AI, Convex, Auth, Polar, Shadcn, Vercel)
  - Pricing: Free vs Pro comparison based on plan specs
  - FAQ: Accordion with common questions
  - Testimonials: Placeholder social proof
  - CTA: Final conversion driver
- Created reusable layout components `Navbar` and `Footer` in `src/components/layout/`
- Implemented `siteConfig` for centralized metadata
- Used standard `shadcn/ui` components (Card, Button, Accordion, Badge, Separator)
- Leveraged `lucide-react` for consistent iconography
- Ensured responsiveness with Tailwind classes (mobile-first approach)

## Key Learnings
- **Layout Strategy**: Kept `Navbar` and `Footer` inside `page.tsx` for now to avoid polluting the global `layout.tsx` if the app (dashboard) needs a different layout later. This creates a self-contained marketing page.
- **Icons**: `lucide-react` imports must be specific (e.g., `import { Sparkles } from "lucide-react"`).
- **Theme Toggle**: Reused existing `ThemeToggle` component from `src/components/shared/theme-toggle.tsx`.
- **Navigation**: Used anchor links (`#features`, `#pricing`) for smooth scrolling within the landing page.

## Verification
- `pnpm build` passed successfully
- `curl` test confirmed HTTP 200 response
- Verified responsive classes in code (e.g., `grid-cols-1 md:grid-cols-3`)

## Code Pattern
- Componentized sections in `src/components/sections/` to keep `page.tsx` clean and declarative.
- Each section follows a similar pattern: `container` wrapper -> `header` -> `content`.
