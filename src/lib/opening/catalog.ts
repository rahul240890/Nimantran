import type { CategoryId } from "@/lib/categories/catalog";
import type { SuiteId } from "@/lib/suites/catalog";
import { SUITES } from "@/lib/suites/catalog";

/*
 * The guest's first screen (Step 12x): a full-height opening the host picks, shown before
 * the pages, the One Scene or the colour card. Each style is drawn in code from the
 * theme's own colours, except "doors", which splits the theme's cover painting, and the
 * painted gates, which are paintings of their own in three layers.
 */

/**
 * The painted gates: the place beyond, the two doors and the arch in front, each a painting.
 * The hole is where the doors hang inside the arch, in % of the painting (941 x 1672). The
 * move is how they open: doors swing in, flowers slide apart, curtains gather, flaps lift.
 */
export const PAINTED_GATES = {
  "rajwada-pol": { move: "swing", hole: { left: 19.7, top: 12.1, width: 60.6, height: 87.9 } },
  "gopuram-kadhavu": {
    move: "swing",
    hole: { left: 15.4, top: 4.9, width: 69, height: 95.1 },
  },
  "noor-darwaza": { move: "swing", hole: { left: 17.9, top: 17.1, width: 64.2, height: 82.9 } },
  "phoolon-ki-deewar": {
    move: "slide",
    hole: { left: 16.8, top: 1.8, width: 66.4, height: 98.2 },
  },
  "haveli-kiwad": { move: "swing", hole: { left: 21.1, top: 19.3, width: 57.5, height: 80.7 } },
  "shahi-parda": { move: "gather", hole: { left: 13.4, top: 2.8, width: 73.1, height: 97.2 } },
  "deco-gates": { move: "swing", hole: { left: 19.8, top: 0.8, width: 60.4, height: 99.2 } },
  "bagiya-gate": { move: "swing", hole: { left: 22.8, top: 6.3, width: 54.6, height: 93.7 } },
  "mela-tamboo": { move: "lift", hole: { left: 9.8, top: 6.2, width: 80.3, height: 93.8 } },
} as const satisfies Record<
  string,
  {
    move: "swing" | "slide" | "gather" | "lift";
    hole: { left: number; top: number; width: number; height: number };
  }
>;
export type PaintedGate = keyof typeof PAINTED_GATES;
const GATE_IDS = Object.keys(PAINTED_GATES) as PaintedGate[];

export function isPaintedGate(style: string): style is PaintedGate {
  return style in PAINTED_GATES;
}

export const OPENING_STYLES = [
  ...(Object.keys(PAINTED_GATES) as [PaintedGate, ...PaintedGate[]]),
  "doors",
  "palace",
  "temple",
  "curtain",
  "envelope",
  "lotus",
  "mandap",
  "jharokha",
  "phool",
  "scroll",
  "diyas",
  "rangoli",
  "peacock",
  "storybook",
  "lanterns",
  "moonlit",
  "fireworks",
  "balloons",
  "gift",
  "none",
] as const;

/** How the editor groups the styles, so twenty choices stay easy to scan. */
export const OPENING_GROUPS: readonly { id: string; styles: readonly OpeningStyle[] }[] = [
  { id: "painted", styles: GATE_IDS },
  { id: "doors", styles: ["doors", "palace", "temple", "jharokha", "mandap", "storybook"] },
  { id: "reveals", styles: ["curtain", "phool", "envelope", "scroll", "gift"] },
  { id: "light", styles: ["lotus", "diyas", "rangoli", "peacock", "lanterns", "moonlit"] },
  { id: "party", styles: ["fireworks", "balloons", "none"] },
];

/** Each occasion's own opening, when the host hasn't picked one and there is no cover. */
const OCCASION_OPENING: Partial<Record<CategoryId, OpeningStyle>> = {
  birthday: "mela-tamboo",
  party: "deco-gates",
  "farewell-party": "deco-gates",
  launch: "deco-gates",
  "shop-opening": "gift",
  "baby-shower": "gift",
  diwali: "diyas",
  eid: "noor-darwaza",
  janmashtami: "peacock",
  onam: "rangoli",
  sankranti: "rangoli",
  lohri: "lanterns",
  navratri: "lanterns",
  engagement: "phoolon-ki-deewar",
  "save-the-date": "envelope",
  anniversary: "shahi-parda",
  housewarming: "haveli-kiwad",
  holi: "fireworks",
  christmas: "gift",
  reunion: "envelope",
  graduation: "fireworks",
  "gudi-padwa": "rangoli",
  baisakhi: "lanterns",
  bihu: "rangoli",
  christening: "bagiya-gate",
  "naming-ceremony": "mela-tamboo",
};
export type OpeningStyle = (typeof OPENING_STYLES)[number];

/**
 * What sits top-centre above the opening: a god painted for us (the owner's own art from
 * the blessing pages, shown whole) or a sacred symbol drawn in code (TRADITIONS.md, 5).
 */
export const OPENING_GODS = [
  "ganesha",
  "ganesha-gold",
  "lakshmi-ganesha",
  "shrinathji",
  "venkateswara",
  "jagannath",
  "om",
  "swastik",
  "kalash",
] as const;
export type OpeningGod = (typeof OPENING_GODS)[number];

export type OpeningChoice = {
  /** Null follows the design: the cover's doors on a painted theme, else a painted gate. */
  style: OpeningStyle | null;
  /** Null opens without a god or symbol. */
  god: OpeningGod | null;
};

export const noOpening: OpeningChoice = { style: null, god: null };

/** Each painting's file and its width over height, so it is laid out whole. */
export const GOD_PAINTINGS: Partial<Record<OpeningGod, { src: string; aspect: number }>> = {
  ganesha: { src: "/openings/ganesha.webp", aspect: 583 / 518 },
  "ganesha-gold": { src: "/openings/ganesha-gold.webp", aspect: 707 / 668 },
  "lakshmi-ganesha": { src: "/openings/lakshmi-ganesha.webp", aspect: 768 / 546 },
  shrinathji: { src: "/openings/shrinathji.webp", aspect: 768 / 641 },
  venkateswara: { src: "/openings/venkateswara.webp", aspect: 768 / 600 },
  jagannath: { src: "/openings/jagannath.webp", aspect: 768 / 668 },
};

/** Occasions where a god is not offered by default (TRADITIONS.md: not in party categories). */
const NO_GODS: readonly CategoryId[] = [
  "party",
  "farewell-party",
  "launch",
  "retirement",
  "eid",
  "christening",
];

export function offersGods(category: CategoryId): boolean {
  return !NO_GODS.includes(category);
}

/** The theme has a cover painting to split as doors. */
export function hasCoverDoors(suite: SuiteId): boolean {
  return SUITES[suite].art !== "card" && Boolean(SUITES[suite].images.cover);
}

/** The styles a host can pick for this theme and kind of invitation. */
export function openingStyles(suite: SuiteId, scene: boolean): readonly OpeningStyle[] {
  return OPENING_STYLES.filter(
    (style) => (style !== "doors" || hasCoverDoors(suite)) && (style !== "none" || scene),
  );
}

/** The style the guest sees: the host's pick when it fits, else the design's own. */
export function openingStyle(
  choice: OpeningChoice,
  suite: SuiteId,
  scene: boolean,
  category?: CategoryId,
): OpeningStyle {
  const offered = openingStyles(suite, scene);
  if (choice.style && offered.includes(choice.style)) return choice.style;
  if (hasCoverDoors(suite) && !scene) return "doors";
  return (category && OCCASION_OPENING[category]) ?? "rajwada-pol";
}

/** The god the guest sees, dropped where the occasion doesn't offer one. */
export function openingGod(choice: OpeningChoice, category: CategoryId): OpeningGod | null {
  return choice.god && offersGods(category) ? choice.god : null;
}
