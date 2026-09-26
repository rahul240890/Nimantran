import { z } from "zod";
import { FUNCTION_IDS } from "@/lib/events/functions";
import { SLOT_IDS, SLOT_RULES, TEMPLATE_IDS } from "@/lib/templates/schema";

/*
 * The category schema. A category is data, not code: its name in every launch language,
 * an icon, when and where it is most wanted, the functions an invite for it plans, the
 * questions guests are asked, and the designs that suit it. The home screen orders
 * categories by season and region (rank.ts), the editor starts an invite from one, and
 * the database (Step 8) stores them in this shape, checked with categorySchema.
 */

/** The launch languages (docs/PRODUCT.md, section 6). Every category is named in all of them. */
export const LOCALES = ["en", "hi", "mr", "gu", "bn", "ta", "te", "kn", "ml", "pa"] as const;
export type Locale = (typeof LOCALES)[number];

/** Groups on the home screen. Only the wedding journey launches; the rest arrive in Step 23. */
export const CATEGORY_GROUPS = [
  "wedding-journey",
  "birthdays",
  "baby",
  "home-religious",
  "festivals",
  "parties",
  "business",
  "education",
  "global",
] as const;
export type CategoryGroup = (typeof CATEGORY_GROUPS)[number];

/** Icons a category can use, drawn by src/components/categories/category-icon.tsx. */
export const CATEGORY_ICONS = [
  "ring",
  "gem",
  "turmeric",
  "henna",
  "music",
  "flame",
  "celebrate",
  "calendar",
  "diya",
  "flower",
] as const;
export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

/**
 * Indian states and union territories as ISO 3166-2 subdivision codes without the "IN-"
 * prefix, which is how the hosting platform reports a visitor's region.
 */
export const REGION_CODES = [
  "AN", "AP", "AR", "AS", "BR", "CH", "CT", "DH", "DL", "GA", "GJ", "HP", "HR", "JH", "JK",
  "KA", "KL", "LA", "LD", "MH", "ML", "MN", "MP", "MZ", "NL", "OR", "PB", "PY", "RJ", "SK",
  "TG", "TN", "TR", "UP", "UT", "WB",
] as const; // prettier-ignore
export type RegionCode = (typeof REGION_CODES)[number];

/**
 * Questions a host can ask on the RSVP besides "coming or not" and the guest count.
 * Categories switch some on by default; the host changes them in Step 10.
 */
export const RSVP_QUESTION_IDS = ["meal", "arrival", "stay", "pickup", "song", "message"] as const;
export type RsvpQuestionId = (typeof RSVP_QUESTION_IDS)[number];

/** full: date, time and venue. date-only: a date and a city, for save-the-dates. */
export const SCHEDULES = ["full", "date-only"] as const;
export type Schedule = (typeof SCHEDULES)[number];

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
