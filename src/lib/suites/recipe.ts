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

/**
 * The versions of each section beyond the layouts above (owner, 2026-10-26: the sections
 * looked alike from design to design). The first of each is the page as it was; the rest
 * are drawn for one experience family each, and a theme's recipe picks them.
 */
export const SECTION_VERSIONS = {
  /**
   * The welcome: names under a garland; a magazine's masthead with the names set large; a
   * love letter on paper; or the names under a palace's great arch.
   */
  welcome: ["garland", "masthead", "letter", "darbar"],
  /**
   * Save the date in one of the layouts above; one oversized number on plain paper; or gold
   * foil the guest scratches away to find the day, month and year in three medallions.
   */
  date: ["layout", "oversized", "scratch"],
  /**
   * The celebrations: each in its own hour as before; numbered chapters, one after another
   * on one page; doors along a palace corridor, each opening on its celebration; or each
   * celebration as its own painted card under a cover the guest rubs away (turmeric over the
   * haldi, henna over the mehendi, gold over the wedding).
   */
  events: ["hours", "chapters", "rooms", "cards"],
  /** The end: a light to give before the reply, or the reply alone. */
  night: ["lamps", "quiet"],
  /**
   * The reply's paper: the theme's card; a bound guest register; a handwritten note; or a
   * plain form between two rules.
   */
  reply: ["card", "register", "note", "form"],
  /**
   * What dresses the whole page: flowers, garlands and the sky through the day; or
   * editorial, plain paper with fine rules and nothing drifting.
   */
  finish: ["flowers", "editorial"],
} as const;
export type SectionVersions = {
  [P in keyof typeof SECTION_VERSIONS]: (typeof SECTION_VERSIONS)[P][number];
};

/** Every version as it was before recipes. */
const FIRST_VERSIONS = Object.fromEntries(
  Object.entries(SECTION_VERSIONS).map(([part, versions]) => [part, versions[0]]),
) as SectionVersions;

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
    versions: z
      .object({
        welcome: z.enum(SECTION_VERSIONS.welcome).optional(),
        date: z.enum(SECTION_VERSIONS.date).optional(),
        events: z.enum(SECTION_VERSIONS.events).optional(),
        night: z.enum(SECTION_VERSIONS.night).optional(),
        reply: z.enum(SECTION_VERSIONS.reply).optional(),
        finish: z.enum(SECTION_VERSIONS.finish).optional(),
      })
      .strict()
      .optional(),
    box: z.enum(ALL_BOXES).optional(),
    flowers: z.enum(FLOWER_BLESSINGS).optional(),
    lamp: z.enum(LAMP_BLESSINGS).optional(),
    /**
     * Whether the painted pages play after the opening, sideways one by one, before this
     * page. False runs the invitation as one page down from the opening (owner, 2026-10-26:
     * the celebrations showed twice, on the pages and again below).
     */
    pages: z.boolean().optional(),
    /**
     * What stays below the painted pages: every section, or only the reply (owner,
     * 2026-10-26: the pages carry the whole invitation, full screen, and one page below
     * keeps the reply and the site's own footer).
     */
    below: z.enum(["sections", "reply"]).optional(),
  })
  .strict();
export type RecipeChoice = z.infer<typeof recipeSchema>;

/** A theme's whole recipe, every choice filled in. */
export type GuestRecipe = {
  family: Family;
  sections: readonly GuestSection[];
  layouts: SectionLayouts;
  versions: SectionVersions;
  box: EventBox;
  flowers: FlowerBlessing;
  lamp: LampBlessing;
  pages: boolean;
  below: "sections" | "reply";
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
    versions: { ...FIRST_VERSIONS, ...choice.versions },
    box,
    flowers: choice.flowers ?? dealt.flowers,
    lamp: choice.lamp ?? dealt.lamp,
    pages: choice.pages ?? true,
    // Only the reply when the pages carry the rest; a page down keeps every section
    below: choice.pages === false ? "sections" : (choice.below ?? "sections"),
  };
}
