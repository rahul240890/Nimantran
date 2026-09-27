import { z } from "zod";
import { SUITE_IDS } from "@/lib/suites/catalog";
import { defaultType, typeSchema } from "./type";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories/catalog";
import type { Category } from "@/lib/categories/schema";
import { RSVP_QUESTION_IDS } from "@/lib/categories/ids";
import { FUNCTION_IDS, type FunctionId } from "@/lib/events/functions";
import { CARD_LANGUAGES } from "@/lib/templates/card-languages";
import { TEMPLATES } from "@/lib/templates/catalog";
import { contentSchema } from "@/lib/templates/content-schema";
import { RAGA_IDS, SLOT_IDS, TEMPLATE_IDS } from "@/lib/templates/ids";
import {
  INVOCATION_MODES,
  SYMBOL_IDS,
  TRADITION_IDS,
  WORDING_IDS,
  WORDING_MAX,
} from "@/lib/traditions/schema";
import {
  EDITOR_STEPS,
  FUNCTION_RULES,
  MAX_PHOTOS,
  coupleValue,
  defaultFunctions,
  emptyFunction,
  includedFunctions,
  needsTime,
  noTradition,
  type EditorStep,
} from "./draft";

/*
 * The draft's shape as a validator: reading saved drafts leniently, and checking what
 * stops a host moving past a step. Kept apart from ./draft.ts so pages that only show an
 * invite don't download zod.
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

const functionSchema = z.object({
  included: z.boolean().catch(false),
  date: isoDate.or(z.literal("")).catch(""),
  time: time.or(z.literal("")).catch(""),
  /** When it ends, for a muhurat window ("9:47 to 10:31"). Kept exactly as chosen. */
  endTime: time.or(z.literal("")).catch(""),
  venue: z.string().max(FUNCTION_RULES.venue).catch(""),
  address: z.string().max(FUNCTION_RULES.address).catch(""),
  dressCode: z.string().max(FUNCTION_RULES.dressCode).catch(""),
});
export type EventFunction = z.infer<typeof functionSchema>;

const photoSchema = z.object({ id: z.string().min(1), width: z.number(), height: z.number() });
export type PhotoRef = z.infer<typeof photoSchema>;

const traditionSchema = z.object({
  /** The pack the card follows; null follows none (the design's own wording). */
  id: z.enum(TRADITION_IDS).nullable().catch(null),
  /** The sacred symbol: null uses the pack's own, "none" shows none. */
  symbol: z
    .enum([...SYMBOL_IDS, "none"])
    .nullable()
    .catch(null),
  invocation: z.enum(INVOCATION_MODES).catch("script"),
  /** The pack's labelled wording blocks, as the family wrote them. */
  wording: z.partialRecord(z.enum(WORDING_IDS), z.string().max(WORDING_MAX)).catch({}),
});
export type DraftTradition = z.infer<typeof traditionSchema>;

/** Saved drafts are read leniently: a bad field falls back to its default, never the whole draft. */
export const draftSchema = z.object({
  version: z.literal(1),
  step: z.enum(EDITOR_STEPS).catch("occasion"),
  /** Drafts saved before categories existed were weddings. */
  categoryId: z.enum(CATEGORY_IDS as [CategoryId, ...CategoryId[]]).catch("wedding"),
  templateId: z.enum(TEMPLATE_IDS).catch("marigold"),
  content: z.partialRecord(z.enum(SLOT_IDS), z.string().max(200)).catch({}),
  functions: z
    .object(
      Object.fromEntries(FUNCTION_IDS.map((id) => [id, functionSchema.catch(emptyFunction)])) as {
        [K in FunctionId]: z.ZodCatch<typeof functionSchema>;
      },
    )
    .catch(() => defaultFunctions()),
  photos: z.array(photoSchema).max(MAX_PHOTOS).catch([]),
  music: z
    .object({
      /** null plays the design's own raga. */
      raga: z.enum(RAGA_IDS).nullable().catch(null),
      playOnOpen: z.boolean().catch(true),
    })
    .catch({ raga: null, playOnOpen: true }),
  updatedAt: z.number().catch(0),
  /** The event this draft is saved as in the signed-in person's account (Step 8). */
  remoteId: z.uuid().nullable().catch(null),
  /** The live link, /i/<slug>, once published (Step 9). Null for drafts. */
  slug: z.string().nullable().catch(null),
  /** What the RSVP asks besides who's coming (Step 10). Null uses the occasion's own. */
  questions: z.array(z.enum(RSVP_QUESTION_IDS)).nullable().catch(null),
  /** The family's tradition and religious elements (Step 12a). */
  tradition: traditionSchema.catch(noTradition),
  /** The card's languages, main first; a second one gives guests a toggle (Step 12a). */
  languages: z
    .array(z.enum(CARD_LANGUAGES))
    .min(1)
    .max(2)
    .refine((list) => new Set(list).size === list.length)
    .catch(["en"]),
  /** The card's wording in the second language; an empty slot repeats the main words. */
  translation: z.partialRecord(z.enum(SLOT_IDS), z.string().max(200)).catch({}),
  /** The event pages' theme (Step 12e). Null follows the tradition's or design's own. */
  suite: z.enum(SUITE_IDS).nullable().catch(null),
  /** A box behind the words on painted pages (Step 12f). Off prints them on the painting. */
  textBox: z.boolean().catch(false),
  /** The host's lettering on the pages (Step 12n): fonts, size, weight, slant, colour. */
  type: typeSchema.catch(defaultType),
});
export type InviteDraft = z.infer<typeof draftSchema>;

export function parseDraft(value: unknown): InviteDraft | null {
  const result = draftSchema.safeParse(value);
  return result.success ? result.data : null;
}

export type StepErrors = Record<string, "required" | "too-long" | "no-functions">;

/** What stops the host moving past a step. Keys are field ids (slot ids or "haldi.date"). */
export function stepErrors(draft: InviteDraft, step: EditorStep): StepErrors {
  const errors: StepErrors = {};
  if (step === "couple") {
    const template = TEMPLATES[draft.templateId];
    const schema = contentSchema(template);
    // Only the couple slots are checked here; date and venue belong to the functions step.
    // Names must be typed by the host; other slots keep the design's wording until changed.
    // A card led by one name (a birthday, a party) asks for no second name
    const one = (CATEGORIES[draft.categoryId] as Category).people === "one";
    const content = Object.fromEntries(
      SLOT_IDS.map((id) => [
        id,
        id === "date" || id === "venue" || (one && (id === "second" || id === "joiner"))
          ? "x"
          : coupleValue(draft, template, id),
      ]),
    );
    const result = schema.safeParse(content);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        errors[key] = issue.message === "too-long" ? "too-long" : "required";
      }
    }
  }
  if (step === "functions") {
    const ids = includedFunctions(draft);
    if (ids.length === 0) errors.functions = "no-functions";
    for (const id of ids) {
      const fn = draft.functions[id];
      if (!fn.date) errors[`${id}.date`] = "required";
      if (!fn.time && needsTime(draft)) errors[`${id}.time`] = "required";
      if (!fn.venue.trim()) errors[`${id}.venue`] = "required";
    }
  }
  return errors;
}

/** Every step's problems, for the preview's checklist. */
export function draftProblems(draft: InviteDraft): { step: EditorStep; count: number }[] {
  return EDITOR_STEPS.map((step) => ({
    step,
    count: Object.keys(stepErrors(draft, step)).length,
  })).filter((entry) => entry.count > 0);
}
