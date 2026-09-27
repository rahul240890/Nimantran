/*
 * The fixed lists categories are made from. Kept apart from the zod schema (./schema.ts),
 * so pages that only need the names don't ship the validator to the browser.
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

/** Whose names lead a card: a couple, or one name (a birthday, a party's title). */
export const PEOPLE = ["couple", "one"] as const;
export type People = (typeof PEOPLE)[number];
