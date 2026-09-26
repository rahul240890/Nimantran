import { z } from "zod";

/*
 * The template data schema. A template is data, not code: which card format and ornament
 * set the scene uses, the card stock colours (design token names), the type, the music,
 * and the text slots a host fills in. The editor (Step 6) builds its form from the slots,
 * and the database (Step 8) stores templates in this shape, checked with templateSchema.
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

const tokenName = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/, "a design token name from globals.css, without the leading --");

const typeStyleSchema = z.object({
  font: z.enum(FONT_ROLES),
  italic: z.boolean(),
  uppercase: z.boolean(),
  /** Letter spacing as a fraction of the font size; dropped for scripts that join letters. */
  tracking: z.number().min(0).max(0.5),
  /** Size relative to the format's default for this kind of text. */
  scale: z.number().min(0.4).max(1.6),
});
export type TypeStyle = z.infer<typeof typeStyleSchema>;

export const templateSchema = z.object({
  id: z.enum(TEMPLATE_IDS),
  name: z.string().min(1).max(40),
  /** One line for pickers and the gallery. */
  description: z.string().min(1).max(140),
  occasion: z.enum(["wedding"]),
  scene: z.object({
    format: z.enum(FORMAT_IDS),
    motif: z.enum(MOTIF_IDS),
    /** Petals that drift down once the card opens; none when the list is empty. */
    petals: z.object({
      colours: z.array(tokenName).max(6),
      /** Relative to a marigold petal; jasmine buds are smaller. */
      size: z.number().min(0.4).max(1.6),
    }),
    /** Sky lanterns rising behind the card. */
    lanterns: z.boolean(),
  }),
  colours: z.record(z.enum(STOCK_ROLES), tokenName),
  fonts: z.object({
    /** The couple's names, the joiner and the venue. */
    names: typeStyleSchema,
    /** Small lines: the blessing, families, date and door words. */
    labels: typeStyleSchema,
    /** The invitation line. */
    body: typeStyleSchema,
  }),
  music: z.object({
    raga: z.enum(RAGA_IDS),
    /** Beats per minute; the raga's own tempo when left out. */
    tempo: z.number().int().min(48).max(100).optional(),
  }),
  /** The slots this design shows, each with its sample wording (English). */
  slots: z
    .array(z.object({ id: z.enum(SLOT_IDS), sample: z.string() }))
    .min(1)
    .refine((slots) => new Set(slots.map((slot) => slot.id)).size === slots.length, {
      message: "each slot appears once",
    })
    .refine(
      (slots) =>
        slots.every((slot) => slot.sample.length <= SLOT_RULES[slot.id].maxLength) &&
        SLOT_IDS.filter((id) => SLOT_RULES[id].required).every((id) =>
          slots.some((slot) => slot.id === id && slot.sample.trim()),
        ),
      { message: "samples fit their slots and every required slot is present" },
    ),
});

export type Template = z.infer<typeof templateSchema>;

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === "string" && (TEMPLATE_IDS as readonly string[]).includes(value);
}
