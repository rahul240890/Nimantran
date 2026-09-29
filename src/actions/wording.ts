"use server";

import { z } from "zod";
import { getAccount } from "@/lib/auth/server";
import { describeError } from "@/lib/errors/report";
import { EDIT_STYLES, LINE_MAX, MAX_LINES, PAGE_ID_MAX } from "@/lib/editor/pages";
import { CARD_LANGUAGES } from "@/lib/templates/card-languages";
import { TONES, WORDING_MODES } from "@/lib/wording/prompt";
import { writeWording, type WordingResult } from "@/lib/wording/server";

/*
 * Asks the AI to write (or shorten) an invite's pages in one of its card languages (Step
 * 12s part 4). Only the invite's own hosts can ask, and only for an invite saved to their
 * account, so each draft can be counted against it.
 */

const wordingSchema = z.object({
  inviteId: z.uuid(),
  language: z.enum(CARD_LANGUAGES),
  tone: z.enum(TONES),
  mode: z.enum(WORDING_MODES),
  occasion: z.string().trim().min(1).max(40),
  tradition: z.string().trim().max(60).nullable(),
  pages: z
    .array(
      z.object({
        id: z.string().max(PAGE_ID_MAX),
        scene: z.string().max(PAGE_ID_MAX),
        lines: z
          .array(z.object({ text: z.string().max(LINE_MAX), style: z.enum(EDIT_STYLES) }))
          .max(MAX_LINES),
      }),
    )
    .min(1)
    .max(30),
});

export async function suggestWording(input: unknown): Promise<WordingResult> {
  const parsed = wordingSchema.safeParse(input);
  const account = await getAccount();
  if (!parsed.success || !account) return { ok: false, reason: "not-found" };
  const { inviteId, ...request } = parsed.data;
  return writeWording(account, inviteId, request).catch((error: unknown) => {
    console.error(
      "[server-error]",
      JSON.stringify({ ...describeError(error), route: "suggestWording", type: "action" }),
    );
    return { ok: false, reason: "failed" } as const;
  });
}
