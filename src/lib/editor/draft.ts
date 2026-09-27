import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { RSVP_QUESTION_IDS, type RsvpQuestionId } from "@/lib/categories/ids";
import type { Category } from "@/lib/categories/schema";
import { FUNCTION_IDS, type FunctionId } from "@/lib/events/functions";
import { CARD_LANGUAGES, formatCardDate, type CardLanguage } from "@/lib/templates/card-languages";
import { TEMPLATES } from "@/lib/templates/catalog";
import { toCardCopy, type CardCopy } from "@/lib/templates/content";
import { CARD_SAMPLES, SAMPLE_DATE } from "@/lib/templates/story-words";
import { allowsTradition, TRADITIONS } from "@/lib/traditions/catalog";
import type { SymbolId, TraditionPack } from "@/lib/traditions/schema";
import {
  SLOT_IDS,
  SLOT_RULES,
  type RagaId,
  type SlotId,
  type TemplateId,
} from "@/lib/templates/ids";
import type { Template } from "@/lib/templates/schema";
import type { SuiteId } from "@/lib/suites/catalog";
import { defaultType } from "./type";
import type {
  DraftTradition,
  EventFunction,
  InviteDraft,
  PhotoRef,
  StepErrors,
} from "./draft-checks";

/*
 * An invite being written in the editor. It lives on this device (local storage for the
 * words, IndexedDB for photos) and, once signed in, in the account too: the database
 * stores the same shape and the photos move to storage (Steps 8 and 9).
 *
 * Reading and checking drafts needs the validator, which lives in ./draft-checks.ts, so
 * the guest's page, which only shows a published invite, doesn't download it.
 */

export { FUNCTION_IDS, formatCardDate, type CardLanguage, type FunctionId };
export type { DraftTradition, EventFunction, InviteDraft, PhotoRef, StepErrors };

export const EDITOR_STEPS = [
  "occasion",
  "tradition",
  "design",
  "couple",
  "functions",
  "extras",
  "preview",
] as const;
export type EditorStep = (typeof EDITOR_STEPS)[number];

/** The slots the couple step asks for. Date and venue come from the functions instead. */
export const COUPLE_SLOTS: readonly SlotId[] = SLOT_IDS.filter(
  (id) => id !== "date" && id !== "venue",
);

export const FUNCTION_RULES = { venue: 70, address: 120, dressCode: 40 } as const;
export const MAX_PHOTOS = 8;

export const noTradition: DraftTradition = {
  id: null,
  symbol: null,
  invocation: "script",
  wording: {},
};

export const emptyFunction: EventFunction = {
  included: false,
  date: "",
  time: "",
  endTime: "",
  venue: "",
  address: "",
  dressCode: "",
};

export function defaultFunctions(
  categoryId: CategoryId = "wedding",
): Record<FunctionId, EventFunction> {
  const planned: readonly FunctionId[] = CATEGORIES[categoryId].functions.planned;
  return Object.fromEntries(
    FUNCTION_IDS.map((id) => [id, { ...emptyFunction, included: planned.includes(id) }]),
  ) as Record<FunctionId, EventFunction>;
}

export function newDraft(
  templateId: TemplateId = "marigold",
  categoryId: CategoryId = "wedding",
): InviteDraft {
  return {
    version: 1,
    step: "occasion",
    categoryId,
    templateId,
    content: {},
    functions: defaultFunctions(categoryId),
    photos: [],
    music: { raga: null, playOnOpen: true },
    updatedAt: 0,
    remoteId: null,
    slug: null,
    questions: null,
    tradition: noTradition,
    languages: ["en"],
    translation: {},
    suite: null,
    textBox: false,
    type: defaultType,
  };
}

export function draftCategory(draft: InviteDraft): Category {
  return CATEGORIES[draft.categoryId];
}

/**
 * Switches the occasion. The functions it plans are ticked and the rest unticked, but
 * every date, venue and word already typed is kept, so switching back loses nothing.
 */
export function withCategory(draft: InviteDraft, categoryId: CategoryId): InviteDraft {
  if (draft.categoryId === categoryId) return draft;
  const planned: readonly FunctionId[] = CATEGORIES[categoryId].functions.planned;
  const functions = Object.fromEntries(
    FUNCTION_IDS.map((id) => [id, { ...draft.functions[id], included: planned.includes(id) }]),
  ) as Record<FunctionId, EventFunction>;
  return { ...draft, categoryId, functions };
}

/**
 * Applies a design chosen in the gallery: its occasion, its tradition (or none, for a kind
 * without a pack yet), its page theme and card. The card is written in the tradition's own
 * language, so a Gujarati wedding starts in Gujarati. Every word already typed is kept.
 */
export function withGalleryChoice(
  draft: InviteDraft,
  choice: {
    category: CategoryId | null;
    tradition: TraditionPack["id"] | null;
    suite: SuiteId;
    template: TemplateId | null;
  },
): InviteDraft {
  let next = choice.category ? withCategory(draft, choice.category) : draft;
  if (next.tradition.id !== choice.tradition) {
    next = { ...next, tradition: { ...noTradition, id: choice.tradition } };
  }
  const language = choice.tradition ? TRADITIONS[choice.tradition].language : "en";
  const main = (CARD_LANGUAGES as readonly string[]).includes(language)
    ? (language as CardLanguage)
    : "en";
  return {
    ...next,
    suite: choice.suite,
    templateId: choice.template ?? next.templateId,
    languages: [main],
    step: "couple",
  };
}

/**
 * Functions in the order the editor lists them: the occasion's own first (with a
 * wedding's, the tradition's own too), then the rest, each list in the order they happen.
 */
export function functionOrder(draft: InviteDraft): {
  suggested: FunctionId[];
  more: FunctionId[];
} {
  const category = draftCategory(draft);
  const pack = draft.categoryId === "wedding" ? draftTradition(draft) : null;
  const own: readonly FunctionId[] = [...category.functions.suggested, ...(pack?.functions ?? [])];
  const suggested = FUNCTION_IDS.filter((id) => own.includes(id));
  // A save-the-date announces one date; other occasions can add any function
  const more =
    category.schedule === "date-only" ? [] : FUNCTION_IDS.filter((id) => !suggested.includes(id));
  return { suggested, more };
}

export function includedFunctions(draft: InviteDraft): FunctionId[] {
  const { suggested, more } = functionOrder(draft);
  return [...suggested, ...more].filter((id) => draft.functions[id].included);
}

/**
 * The function the card itself announces: the occasion's own (the roka for a roka invite),
 * else the wedding, else the first one planned.
 */
export function mainFunction(draft: InviteDraft): FunctionId | null {
  const primary = draftCategory(draft).functions.primary;
  if (draft.functions[primary].included) return primary;
  if (draft.functions.wedding.included) return "wedding";
  return includedFunctions(draft)[0] ?? null;
}

/** Whether the occasion needs a start time, or only a date and a city. */
export function needsTime(draft: InviteDraft): boolean {
  return draftCategory(draft).schedule === "full";
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

/** The pack this invite follows, if its occasion takes one. */
export function draftTradition(draft: InviteDraft): TraditionPack | null {
  const { id } = draft.tradition;
  return id && allowsTradition(draftCategory(draft)) ? TRADITIONS[id] : null;
}

/** The sacred symbol on the card: the family's pick, else the pack's own. */
export function draftSymbol(draft: InviteDraft): SymbolId | null {
  const pack = draftTradition(draft);
  if (!pack) return null;
  const { symbol } = draft.tradition;
  if (symbol === "none") return null;
  return symbol && pack.symbols.options.includes(symbol) ? symbol : pack.symbols.default;
}

/**
 * Wording the tradition gives the card, under the host's own: the invocation as the
 * blessing line, and a wedding's door words. The second language's card writes the
 * invocation in its own way: in English letters for English, else in its script.
 */
export function traditionWording(
  draft: InviteDraft,
  language: CardLanguage = cardLanguages(draft)[0],
): Partial<Record<SlotId, string>> {
  const pack = draftTradition(draft);
  if (!pack) return {};
  const wording: Partial<Record<SlotId, string>> = {};
  const chosen = draft.tradition.invocation;
  const mode =
    chosen === "off" || !isSecondLanguage(draft, language)
      ? chosen
      : language === "en"
        ? "latin"
        : "script";
  wording.blessing = pack.invocation && mode !== "off" ? pack.invocation[mode] : "";
  if (pack.doors && draft.categoryId === "wedding") {
    wording.doorLeft = pack.doors[0];
    wording.doorRight = pack.doors[1];
  }
  return wording;
}

/** What the tradition calls the wedding's auspicious time, when it has a name for it. */
export function muhuratName(
  draft: InviteDraft,
  id: FunctionId,
): { native: string; latin: string } | null {
  return id === "wedding" ? (draftTradition(draft)?.muhurat ?? null) : null;
}

/**
 * The languages a card can be written in: the tradition's own and English, or English
 * and Hindi when there is none.
 */
export function languageOptions(draft: InviteDraft): [CardLanguage, CardLanguage] {
  const language = draftTradition(draft)?.language;
  const own = language && language !== "en" ? (language as CardLanguage) : null;
  return own && (CARD_LANGUAGES as readonly string[]).includes(own) ? [own, "en"] : ["en", "hi"];
}

/** The card's languages, main first. A language the tradition no longer offers falls away. */
export function cardLanguages(draft: InviteDraft): [CardLanguage, ...CardLanguage[]] {
  const options: readonly CardLanguage[] = languageOptions(draft);
  const [first, ...rest] = draft.languages.filter((language) => options.includes(language));
  return first ? [first, ...rest] : ["en"];
}

function isSecondLanguage(draft: InviteDraft, language: CardLanguage): boolean {
  const languages = cardLanguages(draft);
  return languages.length === 2 && language === languages[1];
}

/** The local name of a ceremony in this invite's tradition, if it has one. */
export function ceremonyName(
  draft: InviteDraft,
  id: FunctionId,
): { native: string; latin: string } | null {
  return draftTradition(draft)?.ceremonies[id] ?? null;
}

/** The host's words for one of the card's languages; the second repeats the main where empty. */
function hostWording(draft: InviteDraft, language: CardLanguage): Partial<Record<SlotId, string>> {
  if (!isSecondLanguage(draft, language)) return draft.content;
  const translated = Object.entries(draft.translation).filter(([, value]) => value?.trim());
  return { ...draft.content, ...Object.fromEntries(translated) };
}

/**
 * The words the card draws, in one of its languages (the main one unless asked). The
 * host's wording fills the slots; the date and venue come from the main function; anything
 * not written yet shows the design's sample, so the preview always looks finished.
 */
export function draftCopy(
  draft: InviteDraft,
  language: CardLanguage = cardLanguages(draft)[0],
): CardCopy {
  const template = TEMPLATES[draft.templateId];
  const content: Partial<Record<SlotId, string>> = {};
  const words = hostWording(draft, language);
  const second = isSecondLanguage(draft, language);
  const tradition = traditionWording(draft, language);
  // Untyped slots preview in the card's own language: the occasion's and the design's
  // samples are English, so other languages use their own sample wording instead
  const samples = language === "en" ? draftCategory(draft).wording : CARD_SAMPLES[language];
  for (const id of COUPLE_SLOTS) {
    // The tradition's wording in the second language beats the main card's typed words
    const own = second ? draft.translation[id]?.trim() || undefined : draft.content[id];
    const value = own ?? tradition[id] ?? words[id] ?? samples[id];
    if (value !== undefined) content[id] = value;
  }
  if (language !== "en") {
    content.date = formatCardDate(SAMPLE_DATE, language).slice(0, SLOT_RULES.date.maxLength);
    content.venue = samples.venue;
  }
  const main = mainFunction(draft);
  if (main) {
    const fn = draft.functions[main];
    if (fn.date) {
      content.date = formatCardDate(fn.date, language).slice(0, SLOT_RULES.date.maxLength);
    }
    if (fn.venue.trim()) content.venue = fn.venue.slice(0, SLOT_RULES.venue.maxLength);
  }
  const copy = toCardCopy(template, content);
  // The invocation belongs on the card even when the design has no blessing line
  const ownBlessing = second
    ? draft.translation.blessing?.trim() || undefined
    : draft.content.blessing;
  const blessing = ownBlessing ?? tradition.blessing ?? (second ? words.blessing : undefined);
  if (blessing !== undefined) copy.blessing = blessing.trim();
  copy.symbol = draftSymbol(draft);
  return copy;
}

/** The wording a slot starts with: the occasion's, else the design's sample. */
export function sampleOf(template: Template, id: SlotId, category?: Category): string {
  return category?.wording[id] ?? template.slots.find((slot) => slot.id === id)?.sample ?? "";
}

/** A slot's starting wording in the card's main language (the samples are English). */
function languageSample(draft: InviteDraft, template: Template, id: SlotId): string {
  const main = cardLanguages(draft)[0];
  return main === "en"
    ? sampleOf(template, id, draftCategory(draft))
    : (CARD_SAMPLES[main][id] ?? "");
}

/** What a couple field holds: the host's words, or the starting wording for optional slots. */
export function coupleValue(draft: InviteDraft, template: Template, id: SlotId): string {
  return (
    draft.content[id] ??
    (SLOT_RULES[id].required
      ? ""
      : (traditionWording(draft)[id] ?? languageSample(draft, template, id)))
  );
}

/**
 * Questions a host can add to the RSVP. Every reply already has room for a note, so the
 * "message" question isn't offered separately.
 */
export const ASKABLE_QUESTIONS = RSVP_QUESTION_IDS.filter((id) => id !== "message");

/** The questions this invite's RSVP asks, in a fixed order. */
export function draftQuestions(draft: InviteDraft): RsvpQuestionId[] {
  const chosen: readonly RsvpQuestionId[] = draft.questions ?? draftCategory(draft).rsvpQuestions;
  return ASKABLE_QUESTIONS.filter((id) => chosen.includes(id));
}
