import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import type { PageLine } from "@/lib/editor/pages";
import { invitePlan } from "@/lib/payments/editions";
import { supabaseService } from "@/lib/supabase/service";
import {
  FREE_DRAFTS,
  WORDING_SYSTEM,
  cleanWording,
  wordingPrompt,
  type WordingRequest,
} from "./prompt";

/*
 * Writing a card's wording with AI (Step 12s part 4). Needs ANTHROPIC_API_KEY on the
 * server; without it the editor keeps the invite's own written words. Each draft counts
 * against the invite (three on Free, unlimited on a paid edition), counted in the
 * database before the model is asked, so a slow answer can't be asked for twice for free.
 */

export type WordingResult =
  | { ok: true; pages: Record<string, PageLine[]>; left: number | null }
  | { ok: false; reason: "off" | "not-found" | "used-up" | "failed" };

const MODEL = "claude-opus-5-5";

const answerSchema = z.object({
  pages: z.array(
    z.object({
      id: z.string(),
      lines: z.array(z.object({ style: z.string(), text: z.string() })),
    }),
  ),
});

// Preview mode (tests, local runs without a database) counts in memory
const holder = globalThis as unknown as { __shubhWordingDrafts?: Map<string, number> };
const previewCounts = (holder.__shubhWordingDrafts ??= new Map());

/** Takes one draft for the invite; the number used after it, or null when none are left. */
async function takeDraft(eventId: string, free: number | null): Promise<number | null> {
  if (authMode() === "preview") {
    const used = previewCounts.get(eventId) ?? 0;
    if (free !== null && used >= free) return null;
    previewCounts.set(eventId, used + 1);
    return used + 1;
  }
  const supabase = supabaseService();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("use_wording_draft", { target: eventId, free });
  if (error) throw error;
  return typeof data === "number" ? data : null;
}

export async function writeWording(
  account: Account,
  eventId: string,
  request: WordingRequest,
): Promise<WordingResult> {
  if (!process.env.ANTHROPIC_API_KEY) return { ok: false, reason: "off" };
  const plan = await invitePlan(account, eventId);
  if (!plan) return { ok: false, reason: "not-found" };
  const free = plan === "free" ? FREE_DRAFTS : null;
  const used = await takeDraft(eventId, free);
  if (used === null) return { ok: false, reason: "used-up" };

  const client = new Anthropic();
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    // A decline in one safety category is retried on the model best suited to it
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    // Short wording from facts already written: low effort writes it well and quickly
    output_config: { effort: "low", format: betaZodOutputFormat(answerSchema) },
    system: WORDING_SYSTEM,
    messages: [{ role: "user", content: wordingPrompt(request) }],
  });
  if (response.stop_reason === "refusal" || !response.parsed_output) {
    return { ok: false, reason: "failed" };
  }
  const pages = cleanWording(response.parsed_output, request.pages);
  if (Object.keys(pages).length === 0) return { ok: false, reason: "failed" };
  return { ok: true, pages, left: free === null ? null : Math.max(0, free - used) };
}
