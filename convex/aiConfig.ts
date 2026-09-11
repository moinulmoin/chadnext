/**
 * Convex-side AI provider resolution.
 *
 * Convex functions run in their own runtime and cannot use the Next.js env
 * module — they read deployment env vars (set via the Convex dashboard or
 * `npx convex env add`) directly. Priority mirrors src/config/ai.ts:
 * Vercel AI Gateway → OpenAI → Anthropic → mock.
 *
 * Used by the Sigma agent and run processing (P2/P3). Mock mode means the
 * run loop still works end-to-end with deterministic output and no keys.
 */

export type AIProviderKind = "gateway" | "openai" | "anthropic" | "mock";

export function aiProvider(): AIProviderKind {
  if (process.env.VERCEL_AI_GATEWAY_API_KEY) return "gateway";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return "mock";
}

export const aiConfigured = () => aiProvider() !== "mock";

export function defaultModelId(): string {
  if (process.env.AI_MODEL) return process.env.AI_MODEL;
  switch (aiProvider()) {
    case "gateway":
      return "openai/gpt-5-mini";
    case "openai":
      return "gpt-5-mini";
    case "anthropic":
      return "claude-sonnet-4-5";
    default:
      return "mock";
  }
}
