/*
 * Event suites (Step 12e): after the doors open, the invitation turns into full-screen
 * pages, one for the cover, the family, each function and the reply, painted in one theme.
 * A theme is only the look (the place, colours, ornaments and page turn). The tradition
 * pack still gives the ceremony names, blessing and sacred symbol, and the language the
 * words, so any theme works for any family; each tradition suggests the one that suits it.
 * Colours live in globals.css under [data-suite] and [data-mood]. Painted backgrounds in
 * `images` replace the vector landscape page by page (docs/SUITES.md).
 */

import type { FunctionId } from "@/lib/events/functions";
import type { TemplateId } from "@/lib/templates/ids";
import type { TraditionId } from "@/lib/traditions/schema";

export const SUITE_IDS = ["rajwada-bagh", "shahi-savari", "kayal", "classic"] as const;
export type SuiteId = (typeof SUITE_IDS)[number];

export function isSuiteId(value: unknown): value is SuiteId {
  return typeof value === "string" && (SUITE_IDS as readonly string[]).includes(value);
}

/** The light a page is painted in: a haldi morning, a sangeet night. */
export const MOODS = ["dawn", "day", "dusk", "night"] as const;
export type Mood = (typeof MOODS)[number];

/** How one page gives way to the next. */
export type PageTurn = "fade" | "arch" | "sweep" | "ripple";

/**
 * The paintings a theme can have, one per kind of page. Functions without their own
 * share the closest one (a garba uses the sangeet's night, a tilak the wedding's mandap).
 */
export const PAGE_ARTS = [
  "cover",
  "family",
  "haldi",
  "mehendi",
  "sangeet",
  "baraat",
  "wedding",
  "reception",
  "reply",
] as const;
export type PageArt = (typeof PAGE_ARTS)[number];

/** Which faiths a theme's own art suits. Faith-specific themes (a Nikah garden) come later. */
export type SuiteFaith = "all" | "hindu" | "muslim" | "christian" | "sikh";

export type Suite = {
  id: SuiteId;
  /** Which vector landscape stands behind the pages; "card" keeps the card's own paper. */
  art: "card" | "bagh" | "savari" | "kayal";
  turn: PageTurn;
  faiths: readonly SuiteFaith[];
  /** The 3D card design that matches it, picked with it in the editor. */
  template: TemplateId | null;
  /** Traditions that suggest this theme. */
  traditions: readonly TraditionId[];
  /** Painted backgrounds under /public, by page. Pages without one draw the vector landscape. */
  images: Partial<Record<PageArt, string>>;
};

export const SUITES: Record<SuiteId, Suite> = {
  "rajwada-bagh": {
    id: "rajwada-bagh",
    art: "bagh",
    turn: "arch",
    faiths: ["all"],
    template: "emerald",
    traditions: ["north-hindu", "marathi"],
    images: {
      cover: "/suites/rajwada-bagh/cover.webp",
      family: "/suites/rajwada-bagh/family.webp",
      haldi: "/suites/rajwada-bagh/haldi.webp",
      mehendi: "/suites/rajwada-bagh/mehendi.webp",
      sangeet: "/suites/rajwada-bagh/sangeet.webp",
      baraat: "/suites/rajwada-bagh/baraat.webp",
      wedding: "/suites/rajwada-bagh/wedding.webp",
      reception: "/suites/rajwada-bagh/reception.webp",
      reply: "/suites/rajwada-bagh/reply.webp",
    },
  },
  "shahi-savari": {
    id: "shahi-savari",
    art: "savari",
    turn: "sweep",
    faiths: ["all"],
    template: "rangmahal",
    traditions: ["rajasthani", "gujarati"],
    images: {
      cover: "/suites/shahi-savari/cover.webp",
      family: "/suites/shahi-savari/family.webp",
      haldi: "/suites/shahi-savari/haldi.webp",
      mehendi: "/suites/shahi-savari/mehendi.webp",
      sangeet: "/suites/shahi-savari/sangeet.webp",
      baraat: "/suites/shahi-savari/baraat.webp",
      wedding: "/suites/shahi-savari/wedding.webp",
      reception: "/suites/shahi-savari/reception.webp",
      reply: "/suites/shahi-savari/reply.webp",
    },
  },
  kayal: {
    id: "kayal",
    art: "kayal",
    turn: "ripple",
    faiths: ["all"],
    template: "kasavu",
    traditions: ["tamil", "bengali"],
    images: {
      cover: "/suites/kayal/cover.webp",
      family: "/suites/kayal/family.webp",
      haldi: "/suites/kayal/haldi.webp",
      mehendi: "/suites/kayal/mehendi.webp",
      sangeet: "/suites/kayal/sangeet.webp",
      baraat: "/suites/kayal/baraat.webp",
      wedding: "/suites/kayal/wedding.webp",
      reception: "/suites/kayal/reception.webp",
      reply: "/suites/kayal/reply.webp",
    },
  },
  classic: {
    id: "classic",
    art: "card",
    turn: "fade",
    faiths: ["all"],
    template: null,
    traditions: ["modern"],
    images: {},
  },
};

/** Designs whose own look already says where they are from. */
const TEMPLATE_SUITES: Partial<Record<TemplateId, SuiteId>> = {
  kasavu: "kayal",
  gopuram: "kayal",
  alpona: "kayal",
  rangmahal: "shahi-savari",
  bandhani: "shahi-savari",
  paithani: "rajwada-bagh",
  emerald: "rajwada-bagh",
};

/** The theme an invite uses: the host's choice, else its tradition's, else its design's. */
export function suiteFor(input: {
  suite: SuiteId | null;
  tradition: TraditionId | null;
  templateId: TemplateId;
}): SuiteId {
  if (input.suite) return input.suite;
  if (input.tradition) {
    const match = SUITE_IDS.find((id) => SUITES[id].traditions.includes(input.tradition!));
    if (match) return match;
  }
  return TEMPLATE_SUITES[input.templateId] ?? "rajwada-bagh";
}

type PageKind = "cover" | "family" | "reply" | FunctionId;

/** Each function's page art and light. */
const FUNCTION_PAGES: Record<FunctionId, { art: PageArt; mood: Mood }> = {
  roka: { art: "reception", mood: "dusk" },
  engagement: { art: "reception", mood: "dusk" },
  tilak: { art: "wedding", mood: "day" },
  "ganesh-puja": { art: "wedding", mood: "dawn" },
  "grah-shanti": { art: "wedding", mood: "dawn" },
  mandap: { art: "wedding", mood: "day" },
  mameru: { art: "family", mood: "day" },
  haldi: { art: "haldi", mood: "dawn" },
  mehendi: { art: "mehendi", mood: "day" },
  sangeet: { art: "sangeet", mood: "night" },
  garba: { art: "sangeet", mood: "night" },
  bhoj: { art: "reception", mood: "night" },
  baraat: { art: "baraat", mood: "dusk" },
  "baraat-welcome": { art: "baraat", mood: "dusk" },
  wedding: { art: "wedding", mood: "dusk" },
  vidaai: { art: "wedding", mood: "dawn" },
  reception: { art: "reception", mood: "night" },
};

/** Which painting and what light a page gets. */
export function pageLook(kind: PageKind): { art: PageArt; mood: Mood } {
  if (kind === "cover") return { art: "cover", mood: "dusk" };
  if (kind === "family") return { art: "family", mood: "day" };
  if (kind === "reply") return { art: "reply", mood: "night" };
  return FUNCTION_PAGES[kind];
}
