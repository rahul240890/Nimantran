/*
 * Event suites (Step 12e): after the doors open, the invitation turns into full-screen
 * pages, one for the cover, the family, each function and the reply, painted in one theme.
 * A theme is only the look (the place, colours, ornaments and page turn). The tradition
 * pack still gives the ceremony names, blessing and sacred symbol, and the language the
 * words, so any theme works for any family; each tradition suggests the one that suits it.
 * Colours live in globals.css under [data-suite] and [data-mood]. Painted backgrounds in
 * `images` replace the vector landscape page by page (docs/SUITES.md).
 */

import type { CategoryId } from "@/lib/categories/catalog";
import type { FunctionId } from "@/lib/events/functions";
import type { TemplateId } from "@/lib/templates/ids";
import type { TraditionId } from "@/lib/traditions/schema";
import type { GuestLookChoice } from "./guest-look";

export const SUITE_IDS = [
  "rajwada-bagh",
  "shahi-savari",
  "kayal",
  "noor-bagh",
  "phulkari-haveli",
  "rajbari",
  "peshwai-wada",
  "kutch-toran",
  "gubbara",
  "saath",
  "rooftop",
  "classic",
] as const;
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

/**
 * The paintings made at night have a dark middle, so the words printed on them turn light.
 * Most themes paint their sangeet, reception and closing page at night; a theme that paints
 * a page otherwise says so in its `tones`.
 */
const NIGHT_PAINTINGS: readonly PageArt[] = ["sangeet", "reception", "reply"];

/** Whether the words on a painted page are dark (on a light middle) or light. */
export function paintedTone(art: PageArt, suite?: SuiteId): "light" | "dark" {
  const own = suite ? SUITES[suite].tones?.[art] : undefined;
  return own ?? (NIGHT_PAINTINGS.includes(art) ? "dark" : "light");
}

/** Which faiths a theme's own art suits. Faith-specific themes (a Nikah garden) come later. */
export type SuiteFaith = "all" | "hindu" | "muslim" | "christian" | "sikh";

export type Suite = {
  id: SuiteId;
  /**
   * Which vector landscape stands behind the pages; "card" keeps the card's own paper.
   * Painted themes borrow the nearest landscape for any page without a painting.
   */
  art: "card" | "bagh" | "savari" | "kayal";
  turn: PageTurn;
  faiths: readonly SuiteFaith[];
  /** The 3D card design that matches it, picked with it in the editor. */
  template: TemplateId | null;
  /** Traditions that suggest this theme. */
  traditions: readonly TraditionId[];
  /** Painted backgrounds under /public, by page. Pages without one draw the vector landscape. */
  images: Partial<Record<PageArt, string>>;
  /** Pages painted in a different light from most themes' (a dusk baraat, a lit reception). */
  tones?: Partial<Record<PageArt, "light" | "dark">>;
  /**
   * The occasions a theme is painted for. Missing means the wedding journey; a birthday
   * theme has four pages (cover, family, the party itself as its reception, the reply).
   */
  occasions?: readonly CategoryId[];
  /**
   * The guest page below the painted pages (guest-look.ts): a style, and any touch picked
   * differently from it. Missing keeps the plain details page.
   */
  guest?: GuestLookChoice;
};

export const SUITES: Record<SuiteId, Suite> = {
  "rajwada-bagh": {
    id: "rajwada-bagh",
    art: "bagh",
    turn: "arch",
    faiths: ["all"],
    template: "emerald",
    traditions: ["north-hindu"],
    guest: { style: "palace" },
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
    traditions: ["rajasthani"],
    guest: { style: "procession", flower: "marigold", secondFlower: "jasmine", lamp: "lanterns" },
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
    traditions: ["tamil"],
    guest: { style: "garden" },
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
  // A Mughal garden for Nikah and Walima; its words come from the family's own pack
  "noor-bagh": {
    id: "noor-bagh",
    art: "bagh",
    turn: "arch",
    faiths: ["muslim", "all"],
    template: "emerald",
    traditions: [],
    guest: {
      style: "palace",
      flower: "rose",
      secondFlower: "jasmine",
      lamp: "lanterns",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/noor-bagh/cover.webp",
      family: "/suites/noor-bagh/family.webp",
      haldi: "/suites/noor-bagh/haldi.webp",
      mehendi: "/suites/noor-bagh/mehendi.webp",
      sangeet: "/suites/noor-bagh/sangeet.webp",
      baraat: "/suites/noor-bagh/baraat.webp",
      wedding: "/suites/noor-bagh/wedding.webp",
      reception: "/suites/noor-bagh/reception.webp",
      reply: "/suites/noor-bagh/reply.webp",
    },
  },
  // A Punjab haveli for Sikh and Punjabi weddings
  "phulkari-haveli": {
    id: "phulkari-haveli",
    art: "savari",
    turn: "sweep",
    faiths: ["sikh", "all"],
    template: "phulkari",
    traditions: [],
    guest: {
      style: "procession",
      flower: "marigold",
      secondFlower: "rose",
      lamp: "fairy",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/phulkari-haveli/cover.webp",
      family: "/suites/phulkari-haveli/family.webp",
      haldi: "/suites/phulkari-haveli/haldi.webp",
      mehendi: "/suites/phulkari-haveli/mehendi.webp",
      sangeet: "/suites/phulkari-haveli/sangeet.webp",
      baraat: "/suites/phulkari-haveli/baraat.webp",
      wedding: "/suites/phulkari-haveli/wedding.webp",
      reception: "/suites/phulkari-haveli/reception.webp",
      reply: "/suites/phulkari-haveli/reply.webp",
    },
  },
  rajbari: {
    id: "rajbari",
    art: "kayal",
    turn: "ripple",
    faiths: ["all"],
    template: "alpona",
    traditions: ["bengali"],
    guest: {
      style: "garden",
      flower: "jasmine",
      secondFlower: "rose",
      lamp: "diyas",
      pattern: "alpona",
    },
    images: {
      cover: "/suites/rajbari/cover.webp",
      family: "/suites/rajbari/family.webp",
      haldi: "/suites/rajbari/haldi.webp",
      mehendi: "/suites/rajbari/mehendi.webp",
      sangeet: "/suites/rajbari/sangeet.webp",
      baraat: "/suites/rajbari/baraat.webp",
      wedding: "/suites/rajbari/wedding.webp",
      reception: "/suites/rajbari/reception.webp",
      reply: "/suites/rajbari/reply.webp",
    },
  },
  "peshwai-wada": {
    id: "peshwai-wada",
    art: "bagh",
    turn: "arch",
    faiths: ["all"],
    template: "paithani",
    traditions: ["marathi"],
    guest: { style: "palace", flower: "marigold", secondFlower: "jasmine" },
    images: {
      cover: "/suites/peshwai-wada/cover.webp",
      family: "/suites/peshwai-wada/family.webp",
      haldi: "/suites/peshwai-wada/haldi.webp",
      mehendi: "/suites/peshwai-wada/mehendi.webp",
      sangeet: "/suites/peshwai-wada/sangeet.webp",
      baraat: "/suites/peshwai-wada/baraat.webp",
      wedding: "/suites/peshwai-wada/wedding.webp",
      reception: "/suites/peshwai-wada/reception.webp",
      reply: "/suites/peshwai-wada/reply.webp",
    },
  },
  // A Kutch bhunga courtyard in mirror work and bandhani, the white Rann beyond
  "kutch-toran": {
    id: "kutch-toran",
    art: "savari",
    turn: "sweep",
    faiths: ["all"],
    template: "bandhani",
    traditions: ["gujarati"],
    guest: { style: "procession", flower: "marigold", secondFlower: "rose", lamp: "diyas" },
    images: {
      cover: "/suites/kutch-toran/cover.webp",
      family: "/suites/kutch-toran/family.webp",
      haldi: "/suites/kutch-toran/haldi.webp",
      mehendi: "/suites/kutch-toran/mehendi.webp",
      sangeet: "/suites/kutch-toran/sangeet.webp",
      baraat: "/suites/kutch-toran/baraat.webp",
      wedding: "/suites/kutch-toran/wedding.webp",
      reception: "/suites/kutch-toran/reception.webp",
      reply: "/suites/kutch-toran/reply.webp",
    },
    tones: { baraat: "dark", reception: "light", reply: "light" },
  },
  // A pastel garden arch of balloons and bunting, the cake table under it
  gubbara: {
    id: "gubbara",
    art: "bagh",
    turn: "fade",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: { style: "party" },
    images: {
      cover: "/suites/gubbara/cover.webp",
      family: "/suites/gubbara/family.webp",
      reception: "/suites/gubbara/reception.webp",
      reply: "/suites/gubbara/reply.webp",
    },
    tones: { reception: "light", reply: "light" },
    occasions: ["birthday"],
  },
  // Red roses and candlelight over a lake at sunset, for years together
  saath: {
    id: "saath",
    art: "bagh",
    turn: "arch",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "palace",
      flower: "rose",
      secondFlower: "jasmine",
      lamp: "fairy",
    },
    images: {
      cover: "/suites/saath/cover.webp",
      family: "/suites/saath/family.webp",
      reception: "/suites/saath/reception.webp",
      reply: "/suites/saath/reply.webp",
    },
    tones: { reception: "light", reply: "light" },
    occasions: ["anniversary"],
  },
  // A city rooftop at night: fairy lights, floor cushions, a DJ and fireworks
  rooftop: {
    id: "rooftop",
    art: "kayal",
    turn: "sweep",
    faiths: ["all"],
    template: "monogram",
    traditions: [],
    guest: { style: "party", flower: "marigold", secondFlower: "lotus" },
    images: {
      cover: "/suites/rooftop/cover.webp",
      family: "/suites/rooftop/family.webp",
      reception: "/suites/rooftop/reception.webp",
      reply: "/suites/rooftop/reply.webp",
    },
    tones: { cover: "dark", family: "dark" },
    occasions: ["party"],
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
  alpona: "rajbari",
  rangmahal: "shahi-savari",
  bandhani: "kutch-toran",
  phulkari: "phulkari-haveli",
  paithani: "peshwai-wada",
  emerald: "rajwada-bagh",
};

/** Whether a theme is painted for an occasion: wedding themes for the wedding journey. */
export function suiteSuits(suite: SuiteId, category: CategoryId): boolean {
  const { occasions } = SUITES[suite];
  if (occasions) return occasions.includes(category);
  return !OCCASION_SUITES.some((id) => SUITES[id].occasions!.includes(category));
}

/** Themes painted for one occasion beyond weddings. */
const OCCASION_SUITES = SUITE_IDS.filter((id) => SUITES[id].occasions);

/**
 * The theme an invite uses: the host's choice, else its occasion's own, else its
 * tradition's, else its design's.
 */
export function suiteFor(input: {
  suite: SuiteId | null;
  tradition: TraditionId | null;
  templateId: TemplateId;
  category?: CategoryId;
}): SuiteId {
  if (input.suite) return input.suite;
  const category = input.category;
  if (category) {
    const own = OCCASION_SUITES.find((id) => SUITES[id].occasions!.includes(category));
    if (own) return own;
  }
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
  // The one-function occasions use the reception's painting: their themes paint it as the
  // party itself (the cake table, the dinner, the dance floor)
  birthday: { art: "reception", mood: "day" },
  anniversary: { art: "reception", mood: "dusk" },
  party: { art: "reception", mood: "night" },
};

/** Which painting and what light a page gets. */
export function pageLook(kind: PageKind): { art: PageArt; mood: Mood } {
  if (kind === "cover") return { art: "cover", mood: "dusk" };
  if (kind === "family") return { art: "family", mood: "day" };
  if (kind === "reply") return { art: "reply", mood: "night" };
  return FUNCTION_PAGES[kind];
}
