/*
 * The fixed lists templates are made from: designs, formats, ornaments, ragas, stock
 * colours, typefaces and text slots. Kept apart from the zod schema (./schema.ts), so pages
 * that only need the names don't ship the validator to the browser.
 */

export const TEMPLATE_IDS = [
  "marigold",
  "rose",
  "emerald",
  "scroll",
  "monogram",
  "kasavu",
  // The Rang family: bright regional designs
  "rangmahal",
  "paithani",
  "bandhani",
  "alpona",
  "gopuram",
  "phulkari",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

/** Card formats with a 3D scene and a 2D card (src/components/invitation/formats.ts). */
export const FORMAT_IDS = ["gate-fold"] as const;
export type FormatId = (typeof FORMAT_IDS)[number];

/** Ornament sets painted onto the card (src/components/invitation/art/motifs.ts). */
export const MOTIF_IDS = [
  "mandala",
  "roses",
  "palace",
  "scroll",
  "monogram",
  "kasavu",
  "jharokha",
  "peacock",
  "bandhani",
  "alpona",
  "gopuram",
  "phulkari",
] as const;
export type MotifId = (typeof MOTIF_IDS)[number];

/** Ragas the music composer knows (src/lib/engine/music.ts). */
export const RAGA_IDS = [
  "yaman",
  "khamaj",
  "bihag",
  "desh",
  "bhupali",
  "madhyamavati",
  "mand",
  "bhimpalasi",
  "pilu",
  "bhairavi",
  "hamsadhwani",
  "kafi",
] as const;
export type RagaId = (typeof RAGA_IDS)[number];

/** The parts of the card stock a template colours. */
export const STOCK_ROLES = [
  "paper",
  "ink",
  "inkMuted",
  "gold",
  "goldText",
  "accent",
  "accentText",
  "back",
] as const;
export type StockRole = (typeof STOCK_ROLES)[number];

/** The app's three typefaces (see globals.css). Indian scripts fall back per script. */
export const FONT_ROLES = ["display", "label", "sans"] as const;
export type FontRole = (typeof FONT_ROLES)[number];

/**
 * Every piece of text a card can carry, in reading order. Templates choose which they use.
 * `joiner` is the word between the names ("&", "weds", "संग").
 */
export const SLOT_IDS = [
  "doorLeft",
  "doorRight",
  "blessing",
  "families",
  "first",
  "joiner",
  "second",
  "line",
  "date",
  "venue",
] as const;
export type SlotId = (typeof SLOT_IDS)[number];

/** How long each slot may be, and whether a card is incomplete without it. */
export const SLOT_RULES: Record<SlotId, { maxLength: number; required: boolean; kind: SlotKind }> =
  {
    doorLeft: { maxLength: 14, required: false, kind: "short" },
    doorRight: { maxLength: 14, required: false, kind: "short" },
    blessing: { maxLength: 40, required: false, kind: "short" },
    families: { maxLength: 60, required: false, kind: "short" },
    first: { maxLength: 24, required: true, kind: "name" },
    joiner: { maxLength: 8, required: false, kind: "short" },
    second: { maxLength: 24, required: true, kind: "name" },
    line: { maxLength: 110, required: false, kind: "long" },
    date: { maxLength: 48, required: true, kind: "short" },
    venue: { maxLength: 70, required: true, kind: "short" },
  };
export type SlotKind = "short" | "name" | "long";

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === "string" && (TEMPLATE_IDS as readonly string[]).includes(value);
}
