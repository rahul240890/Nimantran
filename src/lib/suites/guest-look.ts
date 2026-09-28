/*
 * The guest page below the painted pages (Step 12q). Each theme carries its look on down
 * the page: its colours and paintings, plus a handful of touches the guest can play with
 * (a music player, a seal to break, lights to switch on, the date revealed, photo frames).
 *
 * A theme only names its choices from the lists below, so a new theme, including one added
 * later from the admin, gets a whole guest page by picking a style; every other choice
 * follows the style unless the theme says otherwise. The shape is plain JSON checked by
 * `guestLookSchema`, ready to be stored with a theme row.
 */

import { z } from "zod";
import { MOODS, SUITES, type Mood, type SuiteId } from "./catalog";

/** The page's overall shape: palace arches, a procession's path, water, a party. */
export const GUEST_STYLES = ["palace", "procession", "garden", "party"] as const;
/** What the music plays on. */
export const GUEST_PLAYERS = ["gramophone", "shehnai", "veena", "boombox"] as const;
/** What the guest breaks or opens to see the welcome. */
export const GUEST_SEALS = ["wax", "knot", "lotus", "ribbon"] as const;
/** The string of lights the guest switches on. */
export const GUEST_LIGHTS = ["lanterns", "bells", "diyas", "bulbs"] as const;
/** How the date comes into view. */
export const GUEST_REVEALS = ["doors", "curtain", "ripples", "confetti"] as const;
/** The frames the photos hang in. */
export const GUEST_FRAMES = ["jharokha", "mirror", "lotus", "polaroid"] as const;

export type GuestStyle = (typeof GUEST_STYLES)[number];
export type GuestPlayer = (typeof GUEST_PLAYERS)[number];
export type GuestSeal = (typeof GUEST_SEALS)[number];
export type GuestLights = (typeof GUEST_LIGHTS)[number];
export type GuestReveal = (typeof GUEST_REVEALS)[number];
export type GuestFrame = (typeof GUEST_FRAMES)[number];

export type GuestLook = {
  style: GuestStyle;
  player: GuestPlayer;
  seal: GuestSeal;
  lights: GuestLights;
  reveal: GuestReveal;
  frame: GuestFrame;
  /** The light the page is washed in, from the theme's own palette. */
  mood: Mood;
};

/** What a theme stores: a style, and any choice it makes differently from that style. */
export const guestLookSchema = z
  .object({
    style: z.enum(GUEST_STYLES),
    player: z.enum(GUEST_PLAYERS).optional(),
    seal: z.enum(GUEST_SEALS).optional(),
    lights: z.enum(GUEST_LIGHTS).optional(),
    reveal: z.enum(GUEST_REVEALS).optional(),
    frame: z.enum(GUEST_FRAMES).optional(),
    mood: z.enum(MOODS).optional(),
  })
  .strict();
export type GuestLookChoice = z.infer<typeof guestLookSchema>;

/** Each style's own touches, used wherever a theme doesn't choose otherwise. */
export const STYLE_LOOKS: Record<GuestStyle, GuestLook> = {
  palace: {
    style: "palace",
    player: "gramophone",
    seal: "wax",
    lights: "lanterns",
    reveal: "doors",
    frame: "jharokha",
    mood: "night",
  },
  procession: {
    style: "procession",
    player: "shehnai",
    seal: "knot",
    lights: "bells",
    reveal: "curtain",
    frame: "mirror",
    mood: "dusk",
  },
  garden: {
    style: "garden",
    player: "veena",
    seal: "lotus",
    lights: "diyas",
    reveal: "ripples",
    frame: "lotus",
    mood: "night",
  },
  party: {
    style: "party",
    player: "boombox",
    seal: "ribbon",
    lights: "bulbs",
    reveal: "confetti",
    frame: "polaroid",
    mood: "night",
  },
};

/** A theme's choice filled out from its style. */
export function resolveGuestLook(choice: GuestLookChoice): GuestLook {
  const base = STYLE_LOOKS[choice.style];
  return {
    style: choice.style,
    player: choice.player ?? base.player,
    seal: choice.seal ?? base.seal,
    lights: choice.lights ?? base.lights,
    reveal: choice.reveal ?? base.reveal,
    frame: choice.frame ?? base.frame,
    mood: choice.mood ?? base.mood,
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

/** Two initials for the seal and the record: "A & S", or one for a single name. */
export function monogram(first: string, second: string): string {
  const initial = (name: string) => Array.from(name.trim())[0]?.toLocaleUpperCase() ?? "";
  const a = initial(first);
  const b = initial(second);
  return a && b ? `${a} & ${b}` : a || b;
}
