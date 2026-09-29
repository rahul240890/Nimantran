"use server";

import { z } from "zod";
import {
  NAME_MAX,
  isLatinName,
  transliterateName,
  type ScriptLanguage,
} from "@/lib/names/transliterate";
import { CARD_LANGUAGES } from "@/lib/templates/card-languages";

/*
 * Offers a name typed in English letters in the card's own script. Open to anyone making
 * an invite, signed in or not, since drafts start on the device; it only ever carries the
 * one name, and answers with nothing when anything is off.
 */

const schema = z.object({
  name: z.string().trim().min(1).max(NAME_MAX),
  language: z.enum(CARD_LANGUAGES).exclude(["en"]),
});

export async function spellName(input: unknown): Promise<string[]> {
  const parsed = schema.safeParse(input);
  if (!parsed.success || !isLatinName(parsed.data.name)) return [];
  return transliterateName(parsed.data.name, parsed.data.language as ScriptLanguage);
}
