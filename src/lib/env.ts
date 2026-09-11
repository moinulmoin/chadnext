import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Single source of truth for environment variables.
 *
 * Zero-config rule: everything except the Convex URL is optional — the app
 * must boot and render meaningful setup states with no keys configured.
 * Never read process.env directly in src/; import `env` from here instead.
 * (Convex functions in convex/ are a separate runtime and read their own
 * process.env via the Convex dashboard.)
 */
export const env = createEnv({
  server: {
    // Auth (better-auth)
    BETTER_AUTH_SECRET: z.string().min(32).optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),

    // AI — Vercel AI Gateway preferred (one key, any provider/model),
    // direct provider keys as fallback, mock mode when neither is set.
    VERCEL_AI_GATEWAY_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    AI_MODEL: z.string().optional(),

    // Billing (Polar) — consumed by the Convex runtime (@convex-dev/polar
    // reads POLAR_ORGANIZATION_TOKEN / POLAR_WEBHOOK_SECRET there); declared
    // here so forks see the full key surface. All optional: no keys = the
    // app runs in free mode with a setup card on the billing page.
    POLAR_ORGANIZATION_TOKEN: z.string().optional(),
    POLAR_WEBHOOK_SECRET: z.string().optional(),
    POLAR_PRO_PRODUCT_ID: z.string().optional(),

    // Email (Resend)
    RESEND_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z
      .string()
      .default("http://localhost:3000"),
    // Analytics (PostHog) — gracefully optional: no key, no tracking
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z
      .string()
      .default("https://us.i.posthog.com"),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    VERCEL_AI_GATEWAY_API_KEY: process.env.VERCEL_AI_GATEWAY_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AI_MODEL: process.env.AI_MODEL,

    POLAR_ORGANIZATION_TOKEN: process.env.POLAR_ORGANIZATION_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    POLAR_PRO_PRODUCT_ID: process.env.POLAR_PRO_PRODUCT_ID,

    RESEND_API_KEY: process.env.RESEND_API_KEY,

    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  emptyStringAsUndefined: true,
});
