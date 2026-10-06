import { INVITE_FORMATS } from "./formats";
import { OPENING_GODS, OPENING_STYLES, noOpening } from "@/lib/opening/catalog";
import { z } from "zod";
import { COUPLE_LAYOUTS, noCouplePhotos } from "./couple-photos";
import { MAX_TILT, MAX_ZOOM, MIN_ZOOM } from "./photo-fit";
import { SUITE_IDS } from "@/lib/suites/catalog";
import { clipSchema } from "./music-clip";
import { defaultType, typeSchema } from "./type";
import { GUIDE_RULES, noFunctionGuide } from "./guide";
import {
  CONTACT_NAME_MAX,
  FAMILY_MAX,
  MAX_CONTACTS,
  PHONE_MAX,
  RELATIONS,
  TOWN_MAX,
  noFamily,
  noSide,
} from "./family";
import {
  ALIGNS,
  BOXES,
  EDIT_STYLES,
  LINE_MAX,
  MAX_LINES,
  PAGE_ID_MAX,
  PLACES,
  defaultLayout,
  noPages,
} from "./pages";
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

const guideSchema = z.object({
  pin: z.string().max(GUIDE_RULES.pin).catch(""),
  parking: z.string().max(GUIDE_RULES.parking).catch(""),
});

const photoSchema = z.object({ id: z.string().min(1), width: z.number(), height: z.number() });
export type PhotoRef = z.infer<typeof photoSchema>;

const cropSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  zoom: z.number().min(MIN_ZOOM).max(MAX_ZOOM),
  turn: z.number().int().min(0).max(3),
  tilt: z.number().min(-MAX_TILT).max(MAX_TILT),
});

const couplePhotosSchema = z.object({
  layout: z.enum(COUPLE_LAYOUTS).catch("none"),
  ids: z.array(z.string()).max(2).catch([]),
  /** A crop that doesn't read is dropped, so that photo sits by default. */
  crops: z
    .record(z.string(), z.unknown())
    .transform((crops) =>
      Object.fromEntries(
        Object.entries(crops).flatMap(([id, crop]) => {
          const read = cropSchema.safeParse(crop);
          return read.success ? [[id, read.data]] : [];
        }),
      ),
    )
    .optional()
    .catch(undefined),
});

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

const sideSchema = z.object({
  relation: z.enum(RELATIONS).catch("child"),
  parents: z.string().max(FAMILY_MAX).catch(""),
  town: z.string().max(TOWN_MAX).catch(""),
});
const contactSchema = z.object({
  name: z.string().max(CONTACT_NAME_MAX).catch(""),
  phone: z.string().max(PHONE_MAX).catch(""),
});
const familySchema = z.object({
  first: sideSchema.catch(noSide),
  second: sideSchema.catch(noSide),
  memory: z.string().max(FAMILY_MAX).catch(""),
  contacts: z
    .array(contactSchema.catch({ name: "", phone: "" }))
    .max(MAX_CONTACTS)
    .catch([]),
});

const pageLineSchema = z.object({
  text: z.string().max(LINE_MAX),
  style: z.enum(EDIT_STYLES).catch("body"),
});
const pageLayoutSchema = z.object({
  hidden: z.boolean().catch(false),
  place: z.enum(PLACES).catch("middle"),
  align: z.enum(ALIGNS).catch("center"),
  box: z.enum(BOXES).catch("theme"),
});
const pageId = z.string().max(PAGE_ID_MAX);
const pagesSchema = z.object({
  layout: z.record(pageId, pageLayoutSchema.catch(defaultLayout)).catch({}),
  words: z
    .partialRecord(z.enum(CARD_LANGUAGES), z.record(pageId, z.array(pageLineSchema).max(MAX_LINES)))
    .catch({}),
});

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
      /** The host's own short music clip, played instead of the raga. */
      clip: clipSchema.nullable().catch(null),
    })
    .catch({ raga: null, playOnOpen: true, clip: null }),
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
  /** The couple's photo page (Step 12l): which of the invite's photos fill its frames. */
  couplePhotos: couplePhotosSchema.catch(noCouplePhotos),
  /** Pages one after another, or the whole invitation on one painting (One Scene pilot). */
  format: z.enum(INVITE_FORMATS).catch("story"),
  /** Open with the theme's painted god, where it has one (Step 12r). */
  blessingPage: z.boolean().catch(true),
  /** The guest's first screen and the god above it (Step 12x); see lib/opening. */
  opening: z
    .object({
      style: z.enum(OPENING_STYLES).nullable().catch(null),
      god: z.enum(OPENING_GODS).nullable().catch(null),
    })
    .catch(noOpening),
  /** Parents, a line in memory, and whom to call (Step 12s); see ./family.ts. */
  family: familySchema.catch(noFamily),
  /** The host's own words and placement on each page (Step 12s); see ./pages.ts. */
  pages: pagesSchema.catch(noPages),
  /** Each function's map pin and parking for the event-day guide; see ./guide.ts. */
  guide: z.partialRecord(z.enum(FUNCTION_IDS), guideSchema.catch(noFunctionGuide)).catch({}),
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
