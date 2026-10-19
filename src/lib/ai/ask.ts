import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { chatAnswerJson, chatRequest, type AiConfig } from "@/lib/wording/providers";

/** A photo or PDF sent along with the question, as base64. */
export type AiAttachment =
  | { kind: "image"; mediaType: "image/jpeg" | "image/png" | "image/webp"; data: string }
  | { kind: "pdf"; data: string };

/*
 * One question to whichever AI the server is set up for (src/lib/wording/providers.ts),
 * answered as JSON in the given shape; null when it declines, fails or answers otherwise.
 * Photos go to every provider that reads them; PDFs only to Claude (see readsAttachment).
 */
export async function askJson<T>(
  config: AiConfig,
  options: {
    system: string;
    prompt: string;
    schema: z.ZodType<T>;
    shape: string;
    maxTokens?: number;
    effort?: "low" | "medium" | "high";
    attachments?: AiAttachment[];
  },
): Promise<T | null> {
  const attachments = options.attachments ?? [];
  if (config.provider === "anthropic") {
    const client = new Anthropic({ apiKey: config.apiKey });
    const response = await client.beta.messages.parse({
      model: config.model,
      max_tokens: options.maxTokens ?? 16000,
      // A decline in one safety category is retried on the model best suited to it
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: options.effort ?? "low",
        format: betaZodOutputFormat(options.schema),
      },
      system: options.system,
      messages: [
        {
          role: "user",
          content: attachments.length
            ? [
                ...attachments.map((item) =>
                  item.kind === "image"
                    ? {
                        type: "image" as const,
                        source: {
                          type: "base64" as const,
                          media_type: item.mediaType,
                          data: item.data,
                        },
                      }
                    : {
                        type: "document" as const,
                        source: {
                          type: "base64" as const,
                          media_type: "application/pdf" as const,
                          data: item.data,
                        },
                      },
                ),
                { type: "text" as const, text: options.prompt },
              ]
            : options.prompt,
        },
      ],
    });
    if (response.stop_reason === "refusal") return null;
    return (response.parsed_output as T | null) ?? null;
  }
  if (attachments.some((item) => !readsAttachment(config, item.kind))) return null;
  const { url, init } = chatRequest(config, options.system, options.prompt, options.shape, {
    images: attachments.flatMap((item) =>
      item.kind === "image" ? [`data:${item.mediaType};base64,${item.data}`] : [],
    ),
    temperature: attachments.length ? 0 : undefined,
  });
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(90_000) });
  if (!response.ok) {
    console.error(`[server-error] AI: ${config.provider} answered ${response.status}`);
    return null;
  }
  return chatAnswerJson(await response.json(), options.schema);
}

/** Whether the AI the server is set up for reads photos or PDFs. */
export function readsAttachment(config: AiConfig, kind: AiAttachment["kind"]): boolean {
  if (config.provider === "anthropic") return true;
  return kind === "image" && config.provider !== "deepseek";
}
