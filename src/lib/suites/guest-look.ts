/*
 * The guest page below the painted pages (Step 12q). Scrolling down, the page lives through
 * the wedding day in the theme's own light, dawn to night: a welcome under a garland of
 * flowers, the date drawn in a floor pattern, the celebrations each in its own hour, photos
 * and family at dusk, and lamps the guest lights before replying.
 *
 * A theme only names its choices from the lists below, so a new theme, including one added
 * later from the admin, gets a whole guest page by picking a style; every other choice
 * follows the style unless the theme says otherwise. Colours come from the theme's own
 * palette. The shape is plain JSON checked by `guestLookSchema`, ready to be stored with a
 * theme row.
 */

import { z } from "zod";
import { SUITES, type SuiteId } from "./catalog";

/** The page's shapes: palace arches, a procession's path, a garden by the water, a party. */
export const GUEST_STYLES = ["palace", "procession", "garden", "party"] as const;
/** The flowers strung in the garlands and showered on the couple. */
export const GUEST_FLOWERS = ["marigold", "rose", "jasmine", "lotus"] as const;
/** The lamps the guest lights for the couple at night. */
export const GUEST_LAMPS = ["diyas", "lanterns", "nilavilakku", "fairy"] as const;
/** The floor pattern the date is drawn in. */
export const GUEST_PATTERNS = [
  "rangoli",
  "kolam",
  "alpona",
  "pookalam",
  /** A Mughal geometric star, for themes of any faith. */
  "jaali",
  /** Rays and dots, for a party. */
  "burst",
] as const;

export type GuestStyle = (typeof GUEST_STYLES)[number];
export type GuestFlower = (typeof GUEST_FLOWERS)[number];
export type GuestLamp = (typeof GUEST_LAMPS)[number];
export type GuestPattern = (typeof GUEST_PATTERNS)[number];

export type GuestLook = {
  style: GuestStyle;
  /** The garland's main flower, and the one strung between. */
  flower: GuestFlower;
  secondFlower: GuestFlower;
  lamp: GuestLamp;
  pattern: GuestPattern;
};

/** What a theme stores: a style, and any choice it makes differently from that style. */
export const guestLookSchema = z
  .object({
    style: z.enum(GUEST_STYLES),
    flower: z.enum(GUEST_FLOWERS).optional(),
    secondFlower: z.enum(GUEST_FLOWERS).optional(),
    lamp: z.enum(GUEST_LAMPS).optional(),
    pattern: z.enum(GUEST_PATTERNS).optional(),
  })
  .strict();
export type GuestLookChoice = z.infer<typeof guestLookSchema>;

/** Each style's own choices, used wherever a theme doesn't choose otherwise. */
export const STYLE_LOOKS: Record<GuestStyle, GuestLook> = {
  palace: {
    style: "palace",
    flower: "marigold",
    secondFlower: "rose",
    lamp: "diyas",
    pattern: "rangoli",
  },
  procession: {
    style: "procession",
    flower: "marigold",
    secondFlower: "jasmine",
    lamp: "lanterns",
    pattern: "rangoli",
  },
  garden: {
    style: "garden",
    flower: "jasmine",
    secondFlower: "marigold",
    lamp: "nilavilakku",
    pattern: "pookalam",
  },
  party: {
    style: "party",
    flower: "rose",
    secondFlower: "marigold",
    lamp: "fairy",
    pattern: "burst",
  },
};

/** A theme's choice filled out from its style. */
export function resolveGuestLook(choice: GuestLookChoice): GuestLook {
  const base = STYLE_LOOKS[choice.style];
  return {
    style: choice.style,
    flower: choice.flower ?? base.flower,
    secondFlower: choice.secondFlower ?? base.secondFlower,
    lamp: choice.lamp ?? base.lamp,
    pattern: choice.pattern ?? base.pattern,
  };
}

/**
 * The guest page look for a theme, or null for a theme that keeps the plain details page
 * (the card-colour themes, and painted themes not switched on yet).
 */
export function guestLook(suite: SuiteId): GuestLook | null {
  const choice = SUITES[suite].guest;
  return choice ? resolveGuestLook(choice) : null;
}
