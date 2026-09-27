import { z } from "zod";
import {
  FONT_ROLES,
  FORMAT_IDS,
  MOTIF_IDS,
  RAGA_IDS,
  SLOT_IDS,
  SLOT_RULES,
  STOCK_ROLES,
  TEMPLATE_IDS,
} from "./ids";

export * from "./ids";

/*
 * The template data schema. A template is data, not code: which card format and ornament
 * set the scene uses, the card stock colours (design token names), the type, the music,
 * and the text slots a host fills in. The editor (Step 6) builds its form from the slots,
 * and the database (Step 8) stores templates in this shape, checked with templateSchema.
 */

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
