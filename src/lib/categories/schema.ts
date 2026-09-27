import { z } from "zod";
import { FUNCTION_IDS } from "@/lib/events/functions";
import { SLOT_IDS, SLOT_RULES, TEMPLATE_IDS } from "@/lib/templates/ids";
import {
  CATEGORY_GROUPS,
  CATEGORY_ICONS,
  LOCALES,
  REGION_CODES,
  RSVP_QUESTION_IDS,
  PEOPLE,
  SCHEDULES,
  type Locale,
} from "./ids";

export * from "./ids";

/*
 * The category schema. A category is data, not code: its name in every launch language,
 * an icon, when and where it is most wanted, the functions an invite for it plans, the
 * questions guests are asked, and the designs that suit it. The home screen orders
 * categories by season and region (rank.ts), the editor starts an invite from one, and
 * the database (Step 8) stores them in this shape, checked with categorySchema.
 */

const month = z.number().int().min(1).max(12);

export const categorySchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    group: z.enum(CATEGORY_GROUPS),
    /** The name in every launch language, in its own script. */
    names: z.object(
      Object.fromEntries(LOCALES.map((code) => [code, z.string().trim().min(1).max(40)])) as {
        [K in Locale]: z.ZodString;
      },
    ),
    icon: z.enum(CATEGORY_ICONS),
    /** Base order on the home screen, 0 to 100; season and region add to it. */
    priority: z.number().int().min(0).max(100),
    /** Months (1 to 12) when hosts make these invites, which is before the event itself. */
    season: z.array(month).max(12),
    /** Where it is most celebrated; empty means across India. */
    regions: z.array(z.enum(REGION_CODES)),
    functions: z.object({
      /** Planned from the start. */
      planned: z.array(z.enum(FUNCTION_IDS)).min(1),
      /** Offered first in the editor, planned or not. */
      suggested: z.array(z.enum(FUNCTION_IDS)).min(1),
      /** The one whose date and venue the card shows. */
      primary: z.enum(FUNCTION_IDS),
    }),
    schedule: z.enum(SCHEDULES),
    rsvpQuestions: z.array(z.enum(RSVP_QUESTION_IDS)),
    /** Designs that suit it, best first. A design can suit many categories. */
    templates: z.array(z.enum(TEMPLATE_IDS)).min(1),
    /** Card wording that replaces a design's sample for this occasion (English). */
    wording: z.partialRecord(z.enum(SLOT_IDS), z.string()),
    /**
     * Whose names lead the card: a couple (two names and a joiner), or one name, the
     * birthday child or the party's own title. Missing means a couple.
     */
    people: z.enum(PEOPLE).optional(),
  })
  .refine((category) => category.functions.planned.includes(category.functions.primary), {
    message: "the primary function is planned",
  })
  .refine(
    (category) =>
      category.functions.planned.every((id) => category.functions.suggested.includes(id)),
    { message: "planned functions are suggested too" },
  )
  .refine(
    (category) =>
      Object.entries(category.wording).every(
        ([slot, text]) => text.length <= SLOT_RULES[slot as keyof typeof SLOT_RULES].maxLength,
      ),
    { message: "wording fits its slots" },
  )
  .refine((category) => new Set(category.templates).size === category.templates.length, {
    message: "each design appears once",
  });

export type Category = z.infer<typeof categorySchema>;
