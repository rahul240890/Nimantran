import { z } from "zod";
import { collectionOf } from "@/lib/gallery/collections";
import {
  FLOWER_BLESSINGS,
  LAMP_BLESSINGS,
  blessings,
  type FlowerBlessing,
  type LampBlessing,
} from "./blessings";
import { STORY_IDS, SUITES, type SuiteId } from "./catalog";
import { EVENT_BOXES, eventBox, type EventBox } from "./event-boxes";
import type { GuestLook } from "./guest-look";
import { SECTION_LAYOUTS, sectionLayouts, type SectionLayouts } from "./section-layouts";

/*
 * A theme's recipe for the guest page below its painted pages (owner, 2026-10-26: the
 * sections felt the same in every design). The recipe names the theme's experience family,
 * which sections the guest meets and in what order, and the version of each section it
 * shows. The page (themed-details.tsx) draws whatever the recipe names from its registry
 * of sections, so a theme's page is designed in one place instead of picked by a hash.
 *
 * A theme that writes no recipe gets one from what it showed before recipes existed: its
 * family from its collection and style, the old order, and the layouts, box and blessings
 * its id was dealt. The family's own words, dates and replies never live here, so one
 * recipe serves every invitation made with the theme. The shape is plain JSON checked by
 * `recipeSchema`, ready to be stored with a theme row like `guestLookSchema`.
 */

/** How a whole invitation feels, from the first section to the last. */
export const FAMILIES = [
  /** Entering a royal celebration room by room. */
  "royal",
  /** A love letter coming to life. */
  "floral",
  /** A premium wedding magazine: big type, white space, numbered chapters. */
  "editorial",
  /** An illustrated story read chapter by chapter. */
  "storybook",
  /** A real card opened on a phone. */
  "card",
  /** A party: bright, quick, tickets and confetti. */
  "celebration",
] as const;
export type Family = (typeof FAMILIES)[number];

/**
 * The guest page's sections. The welcome, the celebrations and the night (the reply and the
 * goodbye) are on every page; the others a recipe may leave out.
 */
export const GUEST_SECTIONS = [
  /** The names, the welcome lines and the couple's photos. */
  "welcome",
  /** Flowers the guest gives the family. */
  "flowers",
  /** Save the date. */
  "date",
  /** Every celebration with its time, place, map and calendar. */
  "events",
  /** The photos and the family's words. */
  "dusk",
  /** A light the guest gives, the reply and the goodbye. */
  "night",
] as const;
export type GuestSection = (typeof GUEST_SECTIONS)[number];

/** Sections no page goes without: who is inviting, when and where, and the reply. */
export const REQUIRED_SECTIONS = [
  "welcome",
  "events",
  "night",
] as const satisfies readonly GuestSection[];

/** The order every page had before recipes. */
export const DEFAULT_ORDER: readonly GuestSection[] = GUEST_SECTIONS;

const ALL_BOXES = [...new Set(Object.values(EVENT_BOXES).flat())] as [EventBox, ...EventBox[]];

const sectionsSchema = z
  .array(z.enum(GUEST_SECTIONS))
  .refine((list) => new Set(list).size === list.length, "a section is listed twice")
  .refine(
    (list) => REQUIRED_SECTIONS.every((section) => list.includes(section)),
    "the welcome, events and night are on every page",
  )
  .refine((list) => list.at(-1) === "night", "the night, with the reply, comes last");

/** What a theme stores: any part of its recipe it sets differently from the starting one. */
export const recipeSchema = z
  .object({
    family: z.enum(FAMILIES).optional(),
    sections: sectionsSchema.optional(),
    layouts: z
      .object({
        date: z.enum(SECTION_LAYOUTS.date).optional(),
        plan: z.enum(SECTION_LAYOUTS.plan).optional(),
        hours: z.enum(SECTION_LAYOUTS.hours).optional(),
        photos: z.enum(SECTION_LAYOUTS.photos).optional(),
        family: z.enum(SECTION_LAYOUTS.family).optional(),
      })
      .strict()
      .optional(),
    box: z.enum(ALL_BOXES).optional(),
    flowers: z.enum(FLOWER_BLESSINGS).optional(),
    lamp: z.enum(LAMP_BLESSINGS).optional(),
  })
  .strict();
export type RecipeChoice = z.infer<typeof recipeSchema>;

/** A theme's whole recipe, every choice filled in. */
export type GuestRecipe = {
  family: Family;
  sections: readonly GuestSection[];
  layouts: SectionLayouts;
  box: EventBox;
  flowers: FlowerBlessing;
  lamp: LampBlessing;
};

/** Collections whose themes read as one kind of invitation, whatever their page style. */
const COLLECTION_FAMILIES: Partial<Record<ReturnType<typeof collectionOf>, Family>> = {
  modern: "editorial",
  "love-story": "storybook",
  storybook: "storybook",
  "cards-3d": "card",
};

/** The family a theme belongs to when its recipe names none. */
export function defaultFamily(suite: SuiteId, look: GuestLook): Family {
  if (SUITES[suite].art === "card") return "card";
  if ((STORY_IDS as readonly string[]).includes(suite)) return "storybook";
  const byCollection = COLLECTION_FAMILIES[collectionOf(suite)];
  if (byCollection) return byCollection;
  if (look.style === "party") return "celebration";
  if (look.style === "garden") return "floral";
  return "royal";
}

/** The theme's recipe: its own choices over the ones it showed before recipes existed. */
export function guestRecipe(suite: SuiteId, look: GuestLook): GuestRecipe {
  const choice = SUITES[suite].recipe ?? {};
  const dealt = blessings(suite);
  // A box from another style's set would hang a palace's arch over a party, so it falls back
  const ownBoxes: readonly EventBox[] = EVENT_BOXES[look.style];
  const box =
    choice.box && ownBoxes.includes(choice.box) ? choice.box : eventBox(suite, look.style);
  return {
    family: choice.family ?? defaultFamily(suite, look),
    sections: choice.sections ?? DEFAULT_ORDER,
    layouts: { ...sectionLayouts(suite), ...choice.layouts },
    box,
    flowers: choice.flowers ?? dealt.flowers,
    lamp: choice.lamp ?? dealt.lamp,
  };
}
