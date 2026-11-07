import { useSyncExternalStore } from "react";
import type { SuiteId } from "./catalog";
import type { GuestStyle } from "./guest-look";
import {
  SECTION_LAYOUTS,
  hash,
  sectionLayouts,
  type SectionLayouts,
  type SectionPart,
} from "./section-layouts";

/*
 * How the guest page below a painted theme is dressed on this visit (owner, 2026-11-07:
 * after the reel every theme's sections looked the same; each should take its colours and
 * decoration from its own theme, and change a little each time). Every section lies on its
 * own painting from the theme, blurred to a soft wash of its colours under a veil of the
 * theme's paper, with a faint printed motif at its edges in the theme's gilt. Which motif,
 * which welcome, which sections are framed and every part's layout are drawn afresh on each
 * visit from the theme's own choices, so a guest who comes back sees the page anew.
 */

/** The welcome: names beside an arch, on a card over the painting, or under a monogram. */
export const WELCOME_LAYOUTS = ["arch", "card", "monogram"] as const;
export type WelcomeLayout = (typeof WELCOME_LAYOUTS)[number];

/**
 * The printed motif at a section's edges: a palace's jaali, block-printed buttis, a
 * mandala's rings, tie-dye bandhani dots, leheriya's waves, a kolam's dots and loops, or a
 * party's confetti.
 */
export const MOTIFS = [
  "jaali",
  "butti",
  "mandala",
  "bandhani",
  "leheriya",
  "kolam",
  "confetti",
] as const;
export type Motif = (typeof MOTIFS)[number];

/** The motifs that suit each guest style, so a party never wears a palace's lattice. */
export const STYLE_MOTIFS: Record<GuestStyle, readonly Motif[]> = {
  palace: ["jaali", "butti", "mandala"],
  procession: ["bandhani", "leheriya", "butti"],
  garden: ["kolam", "leheriya", "butti"],
  party: ["confetti", "bandhani"],
};

/** The sections that can each be framed or not. */
export const FRAMED_SECTIONS = ["welcome", "date", "plan", "photos", "family", "reply"] as const;
export type FramedSection = (typeof FRAMED_SECTIONS)[number];

export type SectionDress = {
  welcome: WelcomeLayout;
  motif: Motif;
  /** Sections drawn inside a fine gilt frame, like a printed card's border. */
  framed: Readonly<Record<FramedSection, boolean>>;
  /** Save the date on the theme's deep jewel, for one darker screen in the morning. */
  deepDate: boolean;
  layouts: SectionLayouts;
};

/** A small seeded generator (mulberry32): the same seed always draws the same page. */
function draws(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** This visit's dress for a theme's guest page, drawn from `seed`. */
export function sectionDress(suite: SuiteId, style: GuestStyle, seed: number): SectionDress {
  // Seed 0 is the theme's own page, the same every time: the server's first paint, and
  // ?dress=0 for tests and reviews
  if (seed === 0) {
    const none = Object.fromEntries(FRAMED_SECTIONS.map((name) => [name, false]));
    return {
      welcome: "arch",
      motif: STYLE_MOTIFS[style][0]!,
      framed: none as Record<FramedSection, boolean>,
      deepDate: false,
      layouts: sectionLayouts(suite),
    };
  }
  const next = draws(hash(`${suite}:${seed}`));
  const pick = <T>(options: readonly T[]): T => options[Math.floor(next() * options.length)]!;
  const part = <P extends SectionPart>(name: P) => pick(SECTION_LAYOUTS[name]) as SectionLayouts[P];
  const layouts: SectionLayouts = {
    date: part("date"),
    plan: part("plan"),
    hours: part("hours"),
    photos: part("photos"),
    family: part("family"),
    countdown: part("countdown"),
  };
  const framed = Object.fromEntries(FRAMED_SECTIONS.map((name) => [name, next() < 0.5])) as Record<
    FramedSection,
    boolean
  >;
  return {
    welcome: pick(WELCOME_LAYOUTS),
    motif: pick(STYLE_MOTIFS[style]),
    framed,
    // A ticket keeps the morning's light: its stub is printed for it
    deepDate: layouts.date !== "ticket" && next() < 0.35,
    layouts,
  };
}

/**
 * This visit's seed: on the server (and while the page hydrates) the theme's own, so the
 * first paint matches; in the browser one drawn once per page load. ?dress=7 fixes it, to
 * review one dress, and ?dress=0 shows the theme's own page.
 */
let visitSeed: number | null = null;
function browserSeed(): number {
  if (visitSeed === null) {
    const param = new URLSearchParams(window.location.search).get("dress");
    const asked = param === null ? NaN : Number(param);
    visitSeed =
      Number.isInteger(asked) && asked >= 0 ? asked : 1 + Math.floor(Math.random() * 1_000_000);
  }
  return visitSeed;
}
const noSubscribe = () => () => {};

export function useVisitSeed(): number {
  return useSyncExternalStore(noSubscribe, browserSeed, () => 0);
}
