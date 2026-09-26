import { format, parseISO } from "date-fns";
import { z } from "zod";
import { TEMPLATES } from "@/lib/templates/catalog";
import { contentSchema, toCardCopy, type CardCopy } from "@/lib/templates/content";
import {
  RAGA_IDS,
  SLOT_IDS,
  SLOT_RULES,
  TEMPLATE_IDS,
  type RagaId,
  type SlotId,
  type Template,
  type TemplateId,
} from "@/lib/templates/schema";

/*
 * An invite being written in the editor. It lives on this device (local storage for the
 * words, IndexedDB for photos) until accounts and the database arrive in Steps 7 and 8,
 * which will store the same shape.
 */

export const FUNCTION_IDS = ["haldi", "mehendi", "sangeet", "wedding", "reception"] as const;
export type FunctionId = (typeof FUNCTION_IDS)[number];

export const EDITOR_STEPS = ["design", "couple", "functions", "extras", "preview"] as const;
export type EditorStep = (typeof EDITOR_STEPS)[number];

/** The slots the couple step asks for. Date and venue come from the functions instead. */
export const COUPLE_SLOTS: readonly SlotId[] = SLOT_IDS.filter(
  (id) => id !== "date" && id !== "venue",
);

export const FUNCTION_RULES = { venue: 70, address: 120, dressCode: 40 } as const;
export const MAX_PHOTOS = 8;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

const functionSchema = z.object({
  included: z.boolean().catch(false),
  date: isoDate.or(z.literal("")).catch(""),
  time: time.or(z.literal("")).catch(""),
  venue: z.string().max(FUNCTION_RULES.venue).catch(""),
  address: z.string().max(FUNCTION_RULES.address).catch(""),
  dressCode: z.string().max(FUNCTION_RULES.dressCode).catch(""),
});
export type EventFunction = z.infer<typeof functionSchema>;

const photoSchema = z.object({ id: z.string().min(1), width: z.number(), height: z.number() });
export type PhotoRef = z.infer<typeof photoSchema>;

const emptyFunction: EventFunction = {
  included: false,
  date: "",
  time: "",
  venue: "",
  address: "",
  dressCode: "",
};

/** Saved drafts are read leniently: a bad field falls back to its default, never the whole draft. */
export const draftSchema = z.object({
  version: z.literal(1),
  step: z.enum(EDITOR_STEPS).catch("design"),
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
});
export type InviteDraft = z.infer<typeof draftSchema>;

function defaultFunctions(): Record<FunctionId, EventFunction> {
  return Object.fromEntries(
    FUNCTION_IDS.map((id) => [id, { ...emptyFunction, included: id === "wedding" }]),
  ) as Record<FunctionId, EventFunction>;
}

export function newDraft(templateId: TemplateId = "marigold"): InviteDraft {
  return {
    version: 1,
    step: "design",
    templateId,
    content: {},
    functions: defaultFunctions(),
    photos: [],
    music: { raga: null, playOnOpen: true },
    updatedAt: 0,
  };
}

export function parseDraft(value: unknown): InviteDraft | null {
  const result = draftSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function includedFunctions(draft: InviteDraft): FunctionId[] {
  return FUNCTION_IDS.filter((id) => draft.functions[id].included);
}

/** The function the card itself announces: the wedding, or the first one planned. */
export function mainFunction(draft: InviteDraft): FunctionId | null {
  if (draft.functions.wedding.included) return "wedding";
  return includedFunctions(draft)[0] ?? null;
}

/** "Saturday, 12 December 2026", matching the templates' sample wording. */
export function formatCardDate(date: string): string {
  return format(parseISO(date), "EEEE, d MMMM yyyy");
}

/** The design with the host's music choice applied. */
export function draftTemplate(draft: InviteDraft): Template {
  return templateWithRaga(draft.templateId, draft.music.raga);
}

export function templateWithRaga(templateId: TemplateId, raga: RagaId | null): Template {
  const template = TEMPLATES[templateId];
  if (!raga || raga === template.music.raga) return template;
  // Another raga keeps its own tempo, not this design's
  return { ...template, music: { raga } };
}

/**
 * The words the card draws. The host's wording fills the slots; the date and venue come
 * from the main function; anything not written yet shows the design's sample, so the
 * preview always looks finished.
 */
export function draftCopy(draft: InviteDraft): CardCopy {
  const template = TEMPLATES[draft.templateId];
  const content: Partial<Record<SlotId, string>> = {};
  for (const id of COUPLE_SLOTS) {
    const value = draft.content[id];
    if (value !== undefined) content[id] = value;
  }
  const main = mainFunction(draft);
  if (main) {
    const fn = draft.functions[main];
    if (fn.date) content.date = formatCardDate(fn.date).slice(0, SLOT_RULES.date.maxLength);
    if (fn.venue.trim()) content.venue = fn.venue.slice(0, SLOT_RULES.venue.maxLength);
  }
  return toCardCopy(template, content);
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
    const content = Object.fromEntries(
      SLOT_IDS.map((id) => [
        id,
        id === "date" || id === "venue" ? "x" : coupleValue(draft, template, id),
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
      if (!fn.time) errors[`${id}.time`] = "required";
      if (!fn.venue.trim()) errors[`${id}.venue`] = "required";
    }
  }
  return errors;
}

function sampleOf(template: Template, id: SlotId): string {
  return template.slots.find((slot) => slot.id === id)?.sample ?? "";
}

/** What a couple field holds: the host's words, or the design's wording for optional slots. */
export function coupleValue(draft: InviteDraft, template: Template, id: SlotId): string {
  return draft.content[id] ?? (SLOT_RULES[id].required ? "" : sampleOf(template, id));
}

/** Every step's problems, for the preview's checklist. */
export function draftProblems(draft: InviteDraft): { step: EditorStep; count: number }[] {
  return EDITOR_STEPS.map((step) => ({
    step,
    count: Object.keys(stepErrors(draft, step)).length,
  })).filter((entry) => entry.count > 0);
}
