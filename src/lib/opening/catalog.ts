import type { CategoryId } from "@/lib/categories/catalog";
import type { SuiteId } from "@/lib/suites/catalog";
import { SUITES } from "@/lib/suites/catalog";

/*
 * The guest's first screen (Step 12x): a full-height opening the host picks, shown before
 * the pages, the One Scene or the colour card. Each style is drawn in code from the
 * theme's own colours, except "doors", which splits the theme's cover painting.
 */

export const OPENING_STYLES = [
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
  { id: "doors", styles: ["doors", "palace", "temple", "jharokha", "mandap", "storybook"] },
  { id: "reveals", styles: ["curtain", "phool", "envelope", "scroll", "gift"] },
  { id: "light", styles: ["lotus", "diyas", "rangoli", "peacock", "lanterns", "moonlit"] },
  { id: "party", styles: ["fireworks", "balloons", "none"] },
];

/** Each occasion's own opening, when the host hasn't picked one and there is no cover. */
const OCCASION_OPENING: Partial<Record<CategoryId, OpeningStyle>> = {
  birthday: "balloons",
  party: "fireworks",
  "farewell-party": "fireworks",
  launch: "fireworks",
  "shop-opening": "gift",
  "baby-shower": "gift",
  diwali: "diyas",
  eid: "moonlit",
  janmashtami: "peacock",
  onam: "rangoli",
  sankranti: "rangoli",
  lohri: "lanterns",
  navratri: "lanterns",
  engagement: "mandap",
  "save-the-date": "envelope",
  anniversary: "storybook",
  housewarming: "jharokha",
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
  /** Null follows the design: the cover's doors on a painted theme, else palace gates. */
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
  return (category && OCCASION_OPENING[category]) ?? "palace";
}

/** The god the guest sees, dropped where the occasion doesn't offer one. */
export function openingGod(choice: OpeningChoice, category: CategoryId): OpeningGod | null {
  return choice.god && offersGods(category) ? choice.god : null;
}
