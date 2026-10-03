import { z } from "zod";

/*
 * Which AI writes the wording, chosen in Vercel's environment variables:
 *   AI_PROVIDER  anthropic, gemini, openai or deepseek
 *   AI_API_KEY   that provider's key (ANTHROPIC_API_KEY also works for anthropic)
 *   AI_MODEL     optional: the model name from the provider's console
 * Gemini, OpenAI and DeepSeek are all asked through the same OpenAI-style chat API.
 */

export const AI_PROVIDERS = ["anthropic", "gemini", "openai", "deepseek"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

export type AiConfig = { provider: AiProvider; apiKey: string; model: string };

const DEFAULT_MODELS: Record<AiProvider, string> = {
  anthropic: "claude-opus-5-5",
  gemini: "gemini-2.5-flash",
  openai: "gpt-4.1-mini",
  deepseek: "deepseek-chat",
};

const BASE_URLS: Record<Exclude<AiProvider, "anthropic">, string> = {
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai",
  openai: "https://api.openai.com/v1",
  deepseek: "https://api.deepseek.com",
};

/** The AI the server is set up for, or null when wording with AI is off. */
export function aiConfig(env: Record<string, string | undefined> = process.env): AiConfig | null {
  const named = env.AI_PROVIDER?.trim().toLowerCase();
  const provider = (AI_PROVIDERS as readonly string[]).includes(named ?? "")
    ? (named as AiProvider)
    : env.ANTHROPIC_API_KEY?.trim()
      ? "anthropic"
      : null;
  if (!provider) return null;
  const apiKey =
    env.AI_API_KEY?.trim() || (provider === "anthropic" ? env.ANTHROPIC_API_KEY?.trim() : "");
  if (!apiKey) return null;
  return { provider, apiKey, model: env.AI_MODEL?.trim() || DEFAULT_MODELS[provider] };
}

/** The answer's shape, as the system prompt asks for it. */
export const answerSchema = z.object({
  pages: z.array(
    z.object({
      id: z.string(),
      lines: z.array(z.object({ style: z.string(), text: z.string() })),
    }),
  ),
});
export type WordingAnswer = z.infer<typeof answerSchema>;

/** The wording answer's shape, spelled out for models without structured output. */
export const WORDING_SHAPE =
  '{"pages":[{"id":"<page id>","lines":[{"style":"<line kind>","text":"<words>"}]}]}';

/** The request to an OpenAI-style chat API, asking for a JSON answer. */
export function chatRequest(
  config: AiConfig,
  system: string,
  prompt: string,
  shape: string = WORDING_SHAPE,
) {
  if (config.provider === "anthropic") throw new Error("Anthropic uses its own SDK");
  return {
    url: `${BASE_URLS[config.provider]}/chat/completions`,
    init: {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: `${system}\n\nAnswer with only a JSON object, no other text, in this shape: ${shape}`,
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    } satisfies RequestInit,
  };
}

/** The JSON out of a chat API's reply, in the expected shape; null otherwise. */
export function chatAnswerJson<T>(reply: unknown, schema: z.ZodType<T>): T | null {
  const content = z
    .object({ choices: z.array(z.object({ message: z.object({ content: z.string() }) })).min(1) })
    .safeParse(reply);
  if (!content.success) return null;
  const text = content.data.choices[0]!.message.content.trim();
  // Some models wrap JSON in a code fence even when asked not to
  const json = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    const parsed = schema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** The wording out of a chat API's reply; null when it isn't the JSON asked for. */
export const chatAnswer = (reply: unknown): WordingAnswer | null =>
  chatAnswerJson(reply, answerSchema);
