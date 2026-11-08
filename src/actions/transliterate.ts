"use server";

import { z } from "zod";
import {
  NAME_MAX,
  isLatinName,
  transliterateName,
  type ScriptLanguage,
} from "@/lib/names/transliterate";
import { WORDING_MAX } from "@/lib/traditions/schema";
import { FAMILY_WORDS_MAX, familyChoices, familyPieces, hasLatin } from "@/lib/names/family-script";
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

const familySchema = z.object({
  text: z.string().trim().min(1).max(WORDING_MAX),
  language: z.enum(CARD_LANGUAGES).exclude(["en"]),
});

/**
 * Offers a family line typed in English letters ("Smt. Sunita & Shri Ramesh Patel") in the
 * card's own script: its titles and "&" in that language's words, each name spelled. Only
 * the names are sent to be spelled, one word at a time, as with the couple's names.
 */
export async function spellFamily(input: unknown): Promise<string[]> {
  const parsed = familySchema.safeParse(input);
  if (!parsed.success || !hasLatin(parsed.data.text)) return [];
  const language = parsed.data.language as ScriptLanguage;
  const pieces = familyPieces(parsed.data.text, language);
  const words = [...new Set(pieces.filter((p) => p.spell).map((p) => p.text))];
  if (words.length > FAMILY_WORDS_MAX) return [];
  const spelled = new Map(
    await Promise.all(
      words.map(async (word) => [word, await transliterateName(word, language)] as const),
    ),
  );
  return familyChoices(pieces, (word) => spelled.get(word) ?? []);
}
