import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { chatAnswerJson, chatRequest, type AiConfig } from "@/lib/wording/providers";

/*
 * One question to whichever AI the server is set up for (src/lib/wording/providers.ts),
 * answered as JSON in the given shape; null when it declines, fails or answers otherwise.
 */
export async function askJson<T>(
  config: AiConfig,
  options: {
    system: string;
    prompt: string;
    schema: z.ZodType<T>;
    shape: string;
    maxTokens?: number;
  },
): Promise<T | null> {
  if (config.provider === "anthropic") {
    const client = new Anthropic({ apiKey: config.apiKey });
    const response = await client.beta.messages.parse({
      model: config.model,
      max_tokens: options.maxTokens ?? 16000,
      // A decline in one safety category is retried on the model best suited to it
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: betaZodOutputFormat(options.schema) },
      system: options.system,
      messages: [{ role: "user", content: options.prompt }],
    });
    if (response.stop_reason === "refusal") return null;
    return (response.parsed_output as T | null) ?? null;
  }
  const { url, init } = chatRequest(config, options.system, options.prompt, options.shape);
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(90_000) });
  if (!response.ok) {
    console.error(`[server-error] AI: ${config.provider} answered ${response.status}`);
    return null;
  }
  return chatAnswerJson(await response.json(), options.schema);
}
