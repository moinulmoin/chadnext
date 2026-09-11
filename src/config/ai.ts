import { createGateway } from "@ai-sdk/gateway";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

import { env } from "@/lib/env";

/**
 * AI provider resolution — "models swap, memory stays".
 *
 * Priority: Vercel AI Gateway (one key → any provider/model, zero markup)
 * → direct OpenAI → direct Anthropic → mock mode (deterministic, no key).
 *
 * This module is for Next.js-side code only. Convex actions (the Sigma
 * agent, run processing) resolve their provider from Convex env vars in
 * convex/aiConfig.ts using the same priority order.
 */

export type AIProviderKind = "gateway" | "openai" | "anthropic" | "mock";

export const aiProvider: AIProviderKind = env.VERCEL_AI_GATEWAY_API_KEY
  ? "gateway"
  : env.OPENAI_API_KEY
    ? "openai"
    : env.ANTHROPIC_API_KEY
      ? "anthropic"
      : "mock";

export const aiConfigured = aiProvider !== "mock";

/**
 * Default chat model id. Gateway ids are `provider/model`; direct provider
 * ids are bare. Override with AI_MODEL for anything else.
 */
export function defaultModelId(): string {
  if (env.AI_MODEL) return env.AI_MODEL;
  switch (aiProvider) {
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

const aiGateway = createGateway({ apiKey: env.VERCEL_AI_GATEWAY_API_KEY });
const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });
const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });

/** Language model for chat/agent use on the Next.js side. Throws in mock mode. */
export function getChatModel() {
  const model = defaultModelId();
  switch (aiProvider) {
    case "gateway":
      return aiGateway(model);
    case "openai":
      return openai(model);
    case "anthropic":
      return anthropic(model);
    default:
      throw new Error(
        "AI is not configured. Set VERCEL_AI_GATEWAY_API_KEY (preferred) or OPENAI_API_KEY / ANTHROPIC_API_KEY.",
      );
  }
}
