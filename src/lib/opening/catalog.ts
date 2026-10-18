import type { CategoryId } from "@/lib/categories/catalog";
import type { StoryId, SuiteId, ThemedId } from "@/lib/suites/catalog";
import { isStoryId, SUITES, THEMED_IDS } from "@/lib/suites/catalog";
import type { TemplateId } from "@/lib/templates/ids";
import { FAITH_SYMBOLS, type Faith } from "@/lib/traditions/faith";
import { SYMBOL_IDS, type SymbolId } from "@/lib/traditions/schema";
import { DESIGN_OPENINGS } from "./design-openings";

/*
 * The guest's first screen (Step 12x): a full-height opening the host picks, shown before
 * the pages, the One Scene or the colour card. Each style is drawn in code from the
 * theme's own colours, except "doors", which splits the theme's cover painting, the
 * painted gates, which are paintings of their own in three layers, and the fresh openings,
 * paintings in four or five layers that each open with a movement of their own.
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
  "chaand-dwar": {
    move: "swing",
    hole: { left: 13.5, top: 11.6, width: 73.0, height: 88.4 },
  },
  "ritu-dwar": {
    move: "swing",
    hole: { left: 11.6, top: 14.8, width: 77.0, height: 85.2 },
  },
  "raag-dwar": {
    move: "swing",
    hole: { left: 8.8, top: 13.9, width: 82.4, height: 86.1 },
  },
  "van-dwar": {
    move: "swing",
    hole: { left: 8.7, top: 12.1, width: 82.6, height: 87.9 },
  },
  "patang-dwar": {
    move: "swing",
    hole: { left: 14.6, top: 22.3, width: 70.9, height: 77.7 },
  },
  "kumhar-dwar": {
    move: "swing",
    hole: { left: 20.1, top: 17.0, width: 59.8, height: 83.0 },
  },
  "karghaa-dwar": {
    move: "swing",
    hole: { left: 14.5, top: 15.8, width: 71.1, height: 84.2 },
  },
  "navrang-dwar": {
    move: "swing",
    hole: { left: 17.7, top: 18.4, width: 64.5, height: 81.6 },
  },
  "ghat-dwar": {
    move: "swing",
    hole: { left: 13.3, top: 22.5, width: 73.3, height: 77.5 },
  },
  "rekha-dwar": {
    move: "swing",
    hole: { left: 9.1, top: 11.6, width: 81.7, height: 88.4 },
  },
  "naqsha-pat": {
    move: "swing",
    hole: { left: 15.9, top: 10.8, width: 68.2, height: 80.8 },
  },
  "kinkhab-parda": {
    move: "gather",
    hole: { left: 18.0, top: 15.4, width: 64.1, height: 81.7 },
  },
  "taad-patta-dwar": {
    move: "slide",
    hole: { left: 23.1, top: 17.9, width: 53.7, height: 65.6 },
  },
  "pichwai-pat": {
    move: "gather",
    hole: { left: 21.6, top: 28.4, width: 57.0, height: 65.0 },
  },
  "chandi-kiwad": {
    move: "swing",
    hole: { left: 19.6, top: 20.5, width: 60.9, height: 70.6 },
  },
  "swarg-kiwad": {
    move: "swing",
    hole: { left: 24.3, top: 13.2, width: 51.3, height: 83.8 },
  },
  "firoza-darwaza": {
    move: "swing",
    hole: { left: 24.1, top: 19.6, width: 51.8, height: 71.4 },
  },
  "jharokha-pat": {
    move: "swing",
    hole: { left: 21.8, top: 33.9, width: 56.4, height: 60.9 },
  },
  "hina-kiwad": {
    move: "swing",
    hole: { left: 15.2, top: 13.4, width: 69.6, height: 81.1 },
  },
  "mor-pankh": {
    move: "slide",
    hole: { left: 21.7, top: 21.7, width: 56.6, height: 73.2 },
  },
  "jugnu-parda": {
    move: "gather",
    hole: { left: 23.1, top: 19.6, width: 53.9, height: 61.4 },
  },
  "sheesh-kiwad": {
    move: "swing",
    hole: { left: 20.4, top: 8.9, width: 59.2, height: 84.3 },
  },
  "sunehri-phatak": {
    move: "swing",
    hole: { left: 13.1, top: 6.9, width: 73.8, height: 83.6 },
  },
  "pattu-thirai": {
    move: "gather",
    hole: { left: 22.0, top: 12.4, width: 56.0, height: 77.5 },
  },
  "kagaz-kiwad": {
    move: "swing",
    hole: { left: 14.0, top: 9.5, width: 72.1, height: 90.5 },
  },
  "bel-khidki": {
    move: "swing",
    hole: { left: 18.5, top: 15.9, width: 62.4, height: 84.1 },
  },
  "pankhudi-pat": {
    move: "slide",
    hole: { left: 15.8, top: 14.3, width: 67.8, height: 85.7 },
  },
  "gulaab-lifafa": {
    move: "lift",
    hole: { left: 15.6, top: 11.6, width: 69.1, height: 88.4 },
  },
  "os-parda": {
    move: "gather",
    hole: { left: 16.9, top: 13.2, width: 66.1, height: 86.8 },
  },
  "surkh-dwar": {
    move: "swing",
    hole: { left: 18.5, top: 14.5, width: 63.0, height: 85.5 },
  },
  "itr-dibbi": {
    move: "swing",
    hole: { left: 21.2, top: 5.8, width: 57.7, height: 94.2 },
  },
  "gulaab-bhaap": {
    move: "slide",
    hole: { left: 13.1, top: 4.9, width: 73.9, height: 95.1 },
  },
  "oud-darwaza": {
    move: "swing",
    hole: { left: 17.3, top: 8.0, width: 65.5, height: 92.0 },
  },
  "tarkashi-jaali": {
    move: "slide",
    hole: { left: 15.0, top: 8.3, width: 70.0, height: 91.7 },
  },
  "aaina-pat": {
    move: "swing",
    hole: { left: 18.1, top: 7.3, width: 63.9, height: 92.7 },
  },
  "megh-parda": {
    move: "slide",
    hole: { left: 12.6, top: 13.3, width: 74.7, height: 86.7 },
  },
  "pehar-jaali": {
    move: "slide",
    hole: { left: 10.8, top: 9.4, width: 78.3, height: 90.6 },
  },
  "lata-phatak": {
    move: "swing",
    hole: { left: 13.5, top: 10.2, width: 73.0, height: 89.8 },
  },
  "kitaab-jild": {
    move: "swing",
    hole: { left: 8.4, top: 10.0, width: 83.2, height: 90.0 },
  },
  "itr-almari": {
    move: "swing",
    hole: { left: 13.0, top: 7.5, width: 74.1, height: 92.5 },
  },
  "kosh-jild": {
    move: "swing",
    hole: { left: 8.9, top: 8.4, width: 82.1, height: 91.6 },
  },
  "gudiya-pat": {
    move: "swing",
    hole: { left: 15.4, top: 16.6, width: 69.2, height: 83.4 },
  },
  "yantra-pat": {
    move: "swing",
    hole: { left: 14.5, top: 12.3, width: 71.1, height: 87.7 },
  },
  "rang-parda": {
    move: "gather",
    hole: { left: 10.2, top: 7.8, width: 79.6, height: 92.2 },
  },
  "genda-ladi": {
    move: "gather",
    hole: { left: 8.6, top: 6.6, width: 82.8, height: 93.4 },
  },
  "kaleen-parda": {
    move: "slide",
    hole: { left: 9.2, top: 13.8, width: 81.5, height: 86.2 },
  },
  "truck-darwaza": {
    move: "swing",
    hole: { left: 14.2, top: 20.2, width: 71.4, height: 79.8 },
  },
  "kaanch-dhakkan": {
    move: "gather",
    hole: { left: 15.5, top: 8.4, width: 69.0, height: 91.6 },
  },
  "pati-pat": {
    move: "swing",
    hole: { left: 16.6, top: 10.8, width: 66.8, height: 89.2 },
  },
  "jad-jhalar": {
    move: "gather",
    hole: { left: 9.2, top: 12.6, width: 81.6, height: 87.4 },
  },
  "gol-darwaza": {
    move: "swing",
    hole: { left: 19.9, top: 16.7, width: 60.4, height: 83.3 },
  },
  "jhaadi-deewar": {
    move: "slide",
    hole: { left: 13.8, top: 14.8, width: 71.4, height: 85.2 },
  },
  "deco-dibba": {
    move: "slide",
    hole: { left: 19.0, top: 14.5, width: 62.0, height: 85.5 },
  },
  "samundar-parda": {
    move: "slide",
    hole: { left: 15.0, top: 14.2, width: 70.0, height: 85.8 },
  },
  "shatranj-sandook": {
    move: "swing",
    hole: { left: 15.6, top: 10.6, width: 68.8, height: 89.4 },
  },
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

/**
 * The fresh openings (owner's paintings, 2026-10-11): not gates but a fan that folds shut,
 * mirror panels that turn, a pop-up palace, clouds that part, a snow globe to fall into.
 * Each is a place beyond, the thing that opens, edge pieces and loose pieces
 * (shubhdwar/fresh-opening-prompts.md); how each moves is in opening-fresh.tsx.
 */
export const FRESH_OPENINGS = [
  "pankhi",
  "sheesh-mahal",
  "popup-mahal",
  "odhni",
  "kavad-peti",
  "chhatri-utsav",
  "jal-darpan",
  "pushp-varsha",
  "moti-seep",
  "badal-raag",
  "jugnu-van",
  "uday-surya",
  "taaramandal",
  "thar-ki-ret",
  "sheher-ki-raat",
  "choodi-chakra",
  "sanjhi-roshni",
  "chhaya-parda",
  "athangudi-tiles",
  "gulaal-bindu",
  "bioscope",
  "kaanch-ka-gola",
  "phirki",
  "bulbule",
  "chhuk-chhuk",
] as const;
export type FreshOpening = (typeof FRESH_OPENINGS)[number];

export function isFreshOpening(style: string): style is FreshOpening {
  return (FRESH_OPENINGS as readonly string[]).includes(style);
}

/**
 * The themed openings (catalog.ts THEMED_IDS): each theme's own opening, one painting that
 * moves its own way and opens onto the theme's scene. The move is how the painting goes:
 * zoom (fly through it), threads (falls away in strips), deal (bands slide off to either
 * side), rows (bands swing down one by one), roll (rolls up from the bottom), drop (falls in
 * folds), sink, wheel (the wheel rolls away), fold (folds in half and flies off), wave (a
 * wave washes it off), scratch (wiped away in rubs), frost (wiped clear, then melts), flip
 * (pages flip up), puzzle (its tiles lift out), tumble (blocks fall), colour (the colour
 * sweeps in), gather (drawn up to the top), slide (tips back and slides down), spots (lit
 * up spot by spot).
 */
export const THEMED_OPENINGS = {
  "jaali-vriksh": "zoom",
  pachchikari: "sink",
  "chik-baradari": "roll",
  "baori-deep": "zoom",
  "ikat-dhaaga": "threads",
  "olai-chuvadi": "deal",
  "konark-chakra": "wheel",
  "mandvi-dhow": "drop",
  shekhawati: "scratch",
  lehar: "wave",
  "naksha-pangong": "fold",
  "toran-mala": "rows",
  jhilmil: "spots",
  "howrah-tareekh": "flip",
  "barf-khidki": "frost",
  "pondy-gali": "puzzle",
  "irani-carrom": "slide",
  channapatna: "tumble",
  "ped-ghar": "colour",
  "jhalar-palna": "gather",
} as const satisfies Record<ThemedId, string>;
export type ThemedOpening = keyof typeof THEMED_OPENINGS;
export type ThemedMove = (typeof THEMED_OPENINGS)[ThemedOpening];

export function isThemedOpening(style: string): style is ThemedOpening {
  return style in THEMED_OPENINGS;
}

export const OPENING_STYLES = [
  ...(Object.keys(PAINTED_GATES) as [PaintedGate, ...PaintedGate[]]),
  ...FRESH_OPENINGS,
  ...THEMED_IDS,
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

/** How the editor groups the styles, so many choices stay easy to scan. */
export const OPENING_GROUPS: readonly { id: string; styles: readonly OpeningStyle[] }[] = [
  { id: "themed", styles: THEMED_IDS },
  {
    id: "fresh",
    styles: [
      "pankhi",
      "sheesh-mahal",
      "popup-mahal",
      "odhni",
      "kavad-peti",
      "chhatri-utsav",
      "jal-darpan",
      "pushp-varsha",
      "moti-seep",
    ],
  },
  {
    id: "skies",
    styles: [
      "badal-raag",
      "jugnu-van",
      "uday-surya",
      "taaramandal",
      "thar-ki-ret",
      "sheher-ki-raat",
    ],
  },
  {
    id: "crafts",
    styles: [
      "choodi-chakra",
      "sanjhi-roshni",
      "chhaya-parda",
      "athangudi-tiles",
      "gulaal-bindu",
      "bioscope",
    ],
  },
  { id: "play", styles: ["kaanch-ka-gola", "phirki", "bulbule", "chhuk-chhuk"] },
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
  launch: "sheher-ki-raat",
  "shop-opening": "gift",
  "baby-shower": "bulbule",
  diwali: "diyas",
  eid: "noor-darwaza",
  janmashtami: "sanjhi-roshni",
  onam: "rangoli",
  sankranti: "uday-surya",
  lohri: "lanterns",
  navratri: "lanterns",
  engagement: "phoolon-ki-deewar",
  roka: "jugnu-van",
  haldi: "badal-raag",
  mehendi: "choodi-chakra",
  sangeet: "jugnu-van",
  reception: "sheesh-mahal",
  "save-the-date": "envelope",
  anniversary: "popup-mahal",
  housewarming: "haveli-kiwad",
  annaprashan: "uday-surya",
  holi: "gulaal-bindu",
  christmas: "kaanch-ka-gola",
  reunion: "bioscope",
  retirement: "bioscope",
  graduation: "fireworks",
  "gudi-padwa": "rangoli",
  baisakhi: "lanterns",
  bihu: "rangoli",
  christening: "bagiya-gate",
  "naming-ceremony": "mela-tamboo",
  "raksha-bandhan": "gift",
  "karva-chauth": "odhni",
};
export type OpeningStyle = (typeof OPENING_STYLES)[number];

/** The openings that suit a wedding, of any faith (HINDU_OPENINGS are kept to Hindu cards). */
const WEDDING_OPENINGS: readonly OpeningStyle[] = [
  "rajwada-pol",
  "noor-darwaza",
  "haveli-kiwad",
  "shahi-parda",
  "bagiya-gate",
  "deco-gates",
  "sheesh-mahal",
  "popup-mahal",
  "pankhi",
  "odhni",
  "kavad-peti",
  "chhatri-utsav",
  "moti-seep",
  "badal-raag",
  "jugnu-van",
  "taaramandal",
  "thar-ki-ret",
  "sheher-ki-raat",
  "choodi-chakra",
  "chhaya-parda",
  "athangudi-tiles",
  "bioscope",
  "chaand-dwar",
  "ritu-dwar",
  "raag-dwar",
  "karghaa-dwar",
  "navrang-dwar",
  "rekha-dwar",
  "naqsha-pat",
  "kinkhab-parda",
  "taad-patta-dwar",
  "pichwai-pat",
  "chandi-kiwad",
  "swarg-kiwad",
  "firoza-darwaza",
  "jharokha-pat",
  "hina-kiwad",
  "mor-pankh",
  "jugnu-parda",
  "sheesh-kiwad",
  "sunehri-phatak",
  "pattu-thirai",
  "kagaz-kiwad",
  "bel-khidki",
  "pankhudi-pat",
  "gulaab-lifafa",
  "os-parda",
  "surkh-dwar",
  "itr-dibbi",
  "gulaab-bhaap",
  "oud-darwaza",
  "tarkashi-jaali",
  "aaina-pat",
  "megh-parda",
  "pehar-jaali",
  "lata-phatak",
  "itr-almari",
  "rang-parda",
  "genda-ladi",
  "kaleen-parda",
  "kaanch-dhakkan",
  "jad-jhalar",
  "deco-dibba",
  "kitaab-jild",
  "jhaadi-deewar",
  "patang-dwar",
  "kumhar-dwar",
  "van-dwar",
  "samundar-parda",
  "gopuram-kadhavu",
  "phoolon-ki-deewar",
  "pushp-varsha",
  "jal-darpan",
  "ghat-dwar",
  "palace",
  "temple",
  "mandap",
  "jharokha",
  "curtain",
  "envelope",
  "phool",
  "scroll",
  "peacock",
  "storybook",
  "lanterns",
  "moonlit",
  "lotus",
  "rangoli",
  "diyas",
];

/**
 * The openings that suit each occasion, its own first: what a design painted without an
 * opening of its own is given (design-openings.ts), so the designs don't all open alike
 * (owner, 2026-10-17). The days around a wedding take the wedding's openings too.
 */
export const OCCASION_OPENINGS: Partial<Record<CategoryId, readonly OpeningStyle[]>> = {
  wedding: WEDDING_OPENINGS,
  engagement: [
    "phoolon-ki-deewar",
    "gulaab-lifafa",
    "surkh-dwar",
    "kaanch-dhakkan",
    "itr-dibbi",
    "pankhudi-pat",
    "os-parda",
    "sheesh-mahal",
    "bagiya-gate",
    "popup-mahal",
    "phool",
    "moonlit",
  ],
  "save-the-date": [
    "envelope",
    "gulaab-lifafa",
    "popup-mahal",
    "taaramandal",
    "kitaab-jild",
    "scroll",
  ],
  roka: ["jugnu-van", "phoolon-ki-deewar", "genda-ladi", "ritu-dwar", "chhatri-utsav", "phool"],
  haldi: ["badal-raag", "genda-ladi", "bel-khidki", "megh-parda", "ritu-dwar", "phool"],
  mehendi: ["choodi-chakra", "odhni", "pankhi", "bel-khidki", "rang-parda", "aaina-pat", "peacock"],
  sangeet: [
    "jugnu-van",
    "raag-dwar",
    "shahi-parda",
    "chhatri-utsav",
    "chhaya-parda",
    "navrang-dwar",
    "truck-darwaza",
    "bioscope",
    "curtain",
    "lanterns",
    "fireworks",
  ],
  reception: [
    "sheesh-mahal",
    "shahi-parda",
    "taaramandal",
    "tarkashi-jaali",
    "deco-dibba",
    "sheher-ki-raat",
    "curtain",
    "fireworks",
  ],
  anniversary: [
    "popup-mahal",
    "shahi-parda",
    "sheesh-mahal",
    "moti-seep",
    "surkh-dwar",
    "chaand-dwar",
    "itr-almari",
    "gulaab-bhaap",
    "kaanch-dhakkan",
    "bagiya-gate",
    "moonlit",
    "envelope",
  ],
  birthday: [
    "mela-tamboo",
    "bulbule",
    "phirki",
    "chhuk-chhuk",
    "van-dwar",
    "gudiya-pat",
    "gol-darwaza",
    "jhaadi-deewar",
    "kitaab-jild",
    "kosh-jild",
    "samundar-parda",
    "shatranj-sandook",
    "truck-darwaza",
    "patang-dwar",
    "kaleen-parda",
    "pati-pat",
    "kaanch-ka-gola",
    "gulaal-bindu",
    "jugnu-van",
    "taaramandal",
    "bioscope",
    "popup-mahal",
    "moti-seep",
    "badal-raag",
    "deco-gates",
    "sheher-ki-raat",
    "balloons",
    "gift",
    "storybook",
    "fireworks",
  ],
  "naming-ceremony": ["mela-tamboo", "bulbule", "uday-surya", "phirki", "kosh-jild", "storybook"],
  "baby-shower": [
    "bulbule",
    "phirki",
    "gol-darwaza",
    "kosh-jild",
    "gudiya-pat",
    "os-parda",
    "pankhudi-pat",
    "lata-phatak",
    "bagiya-gate",
    "badal-raag",
    "balloons",
    "phool",
  ],
  party: [
    "deco-gates",
    "sheher-ki-raat",
    "bioscope",
    "deco-dibba",
    "shatranj-sandook",
    "truck-darwaza",
    "taaramandal",
    "jugnu-van",
    "thar-ki-ret",
    "curtain",
    "fireworks",
    "lanterns",
  ],
  "farewell-party": ["deco-gates", "sheher-ki-raat", "bioscope", "deco-dibba", "lanterns"],
  retirement: ["bioscope", "kitaab-jild", "ritu-dwar", "sheher-ki-raat", "taaramandal"],
  reunion: ["bioscope", "pati-pat", "kitaab-jild", "shatranj-sandook", "sheher-ki-raat"],
  graduation: ["fireworks", "pati-pat", "kitaab-jild", "yantra-pat", "taaramandal"],
  launch: ["sheher-ki-raat", "deco-dibba", "yantra-pat", "taaramandal", "deco-gates"],
  "shop-opening": ["gift", "sheher-ki-raat", "deco-dibba", "deco-gates", "haveli-kiwad"],
  housewarming: [
    "haveli-kiwad",
    "uday-surya",
    "ritu-dwar",
    "gol-darwaza",
    "lata-phatak",
    "karghaa-dwar",
    "athangudi-tiles",
    "naqsha-pat",
    "kinkhab-parda",
    "taad-patta-dwar",
    "pichwai-pat",
    "chandi-kiwad",
    "swarg-kiwad",
    "firoza-darwaza",
    "jharokha-pat",
    "hina-kiwad",
    "mor-pankh",
    "jugnu-parda",
    "sheesh-kiwad",
    "sunehri-phatak",
    "pattu-thirai",
    "kagaz-kiwad",
    "bel-khidki",
    "palace",
  ],
  puja: ["rajwada-pol", "gopuram-kadhavu", "jal-darpan", "ghat-dwar", "temple", "lotus", "moonlit"],
  diwali: ["diyas", "kumhar-dwar", "jal-darpan", "sheesh-mahal", "lanterns", "rangoli"],
  navratri: ["lanterns", "choodi-chakra", "navrang-dwar", "chhatri-utsav", "odhni", "peacock"],
  eid: ["noor-darwaza", "chaand-dwar", "tarkashi-jaali", "pehar-jaali", "oud-darwaza", "moonlit"],
  christmas: ["kaanch-ka-gola", "gol-darwaza", "taaramandal", "lanterns", "gift"],
  sankranti: ["uday-surya", "patang-dwar", "badal-raag", "rangoli"],
  janmashtami: ["sanjhi-roshni", "chhaya-parda", "peacock", "jal-darpan"],
  onam: ["rangoli", "pushp-varsha", "athangudi-tiles", "gopuram-kadhavu"],
  holi: ["gulaal-bindu", "rang-parda", "navrang-dwar", "badal-raag"],
  "gudi-padwa": ["rangoli", "uday-surya", "oud-darwaza"],
  bihu: ["rangoli", "badal-raag", "lata-phatak"],
  baisakhi: ["lanterns", "phirki", "genda-ladi"],
  lohri: ["lanterns", "thar-ki-ret", "phirki"],
  "raksha-bandhan": ["gift", "genda-ladi", "rang-parda"],
  "karva-chauth": ["odhni", "chaand-dwar", "moonlit"],
  "ganesh-chaturthi": ["rajwada-pol", "temple", "gopuram-kadhavu", "genda-ladi"],
  "thread-ceremony": ["rajwada-pol", "gopuram-kadhavu", "ghat-dwar", "temple"],
  "prayer-meet": ["rajwada-pol", "diyas", "lotus"],
  annaprashan: ["uday-surya", "bulbule", "kosh-jild"],
  christening: ["bagiya-gate", "os-parda", "lata-phatak"],
};

/** Openings onto a Hindu place or rite (a temple, a mandap, a ghat): for a Hindu card only. */
const HINDU_OPENINGS: readonly OpeningStyle[] = [
  "gopuram-kadhavu",
  "phoolon-ki-deewar",
  "pushp-varsha",
  "jal-darpan",
  "ghat-dwar",
  "sanjhi-roshni",
  "temple",
  "mandap",
  "lotus",
  "rangoli",
  "diyas",
];

/** The days around a wedding, which take its openings too. */
const WEDDING_DAYS: readonly CategoryId[] = [
  "engagement",
  "save-the-date",
  "roka",
  "haldi",
  "mehendi",
  "sangeet",
  "reception",
];

/** Whether an opening suits the occasion and the family's faith. */
export function openingSuits(style: OpeningStyle, category: CategoryId, faith: Faith): boolean {
  if (HINDU_OPENINGS.includes(style) && faith !== "hindu") return false;
  if (OCCASION_OPENINGS[category]?.includes(style)) return true;
  return WEDDING_DAYS.includes(category) && WEDDING_OPENINGS.includes(style);
}

/**
 * A design's own opening, by its id as the gallery names it: the theme for its pages, the
 * theme and "-scene" for its Scene, "card-" and the card for a 3D card.
 */
export function designOpening(
  suite: SuiteId,
  scene: boolean,
  template?: TemplateId,
): OpeningStyle | null {
  if (suite === "classic") return (template && DESIGN_OPENINGS[`card-${template}`]) || null;
  const pages = DESIGN_OPENINGS[suite];
  const painting = DESIGN_OPENINGS[`${suite}-scene`];
  return (scene ? (painting ?? pages) : (pages ?? painting)) ?? null;
}

/** The gods painted for us: the owner's own art from the blessing pages, shown whole. */
export const PAINTED_GODS = [
  "ganesha",
  "ganesha-gold",
  "lakshmi-ganesha",
  "shrinathji",
  "venkateswara",
  "jagannath",
] as const;

/**
 * What sits top-centre above the opening: a god painted for us, or one of the sacred
 * symbols drawn in code for every faith's cards (TRADITIONS.md, 5).
 */
export const OPENING_GODS = [...PAINTED_GODS, ...SYMBOL_IDS] as const;
export type OpeningGod = (typeof OPENING_GODS)[number];

/** The symbol an opening's god is, when it isn't a painting. */
export function godSymbol(god: OpeningGod): SymbolId | null {
  return (SYMBOL_IDS as readonly string[]).includes(god) ? (god as SymbolId) : null;
}

/**
 * The gods and symbols offered over a family's opening: the painted gods and Hindu symbols
 * for a Hindu card, only its own faith's symbols for any other, none for a family that
 * wants no religious lines. An occasion with no religious wording (a birthday) offers what
 * a Hindu card does, as it always has, for families who want Ganesha there.
 */
export function openingGods(faith: Faith, chosen: boolean): readonly OpeningGod[] {
  if (faith === "none") return chosen ? [] : [...PAINTED_GODS, ...FAITH_SYMBOLS.hindu];
  return faith === "hindu" ? [...PAINTED_GODS, ...FAITH_SYMBOLS.hindu] : FAITH_SYMBOLS[faith];
}

export type OpeningChoice = {
  /** Null follows the design: its own opening (openingStyle). */
  style: OpeningStyle | null;
  /** Null opens without a god or symbol. */
  god: OpeningGod | null;
  /** The welcome after it; null picks one that suits the opening, another each visit. */
  welcome: WelcomeScene | null;
};

export const noOpening: OpeningChoice = { style: null, god: null, welcome: null };

/** Each painting's file and its width over height, so it is laid out whole. */
export const GOD_PAINTINGS: Partial<Record<OpeningGod, { src: string; aspect: number }>> = {
  ganesha: { src: "/openings/ganesha.webp", aspect: 583 / 518 },
  "ganesha-gold": { src: "/openings/ganesha-gold.webp", aspect: 707 / 668 },
  "lakshmi-ganesha": { src: "/openings/lakshmi-ganesha.webp", aspect: 768 / 546 },
  shrinathji: { src: "/openings/shrinathji.webp", aspect: 768 / 641 },
  venkateswara: { src: "/openings/venkateswara.webp", aspect: 768 / 600 },
  jagannath: { src: "/openings/jagannath.webp", aspect: 768 / 668 },
};

/**
 * Occasions where a god is not offered by default (TRADITIONS.md: not in party categories).
 * Eid and a christening offer their own faith's symbols (openingGods).
 */
const NO_GODS: readonly CategoryId[] = ["party", "farewell-party", "launch", "retirement"];

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

/** Each story theme's own gate, painted with its pages. */
const STORY_GATE: Record<StoryId, PaintedGate> = {
  "chaand-kalayein": "chaand-dwar",
  "ritu-chakra": "ritu-dwar",
  raagmala: "raag-dwar",
  panchatantra: "van-dwar",
  "patang-udaan": "patang-dwar",
  "diya-ki-kahani": "kumhar-dwar",
  "resham-katha": "karghaa-dwar",
  navrang: "navrang-dwar",
  "nadi-safar": "ghat-dwar",
  "ek-rekha": "rekha-dwar",
  "mahal-yatra": "naqsha-pat",
  kinkhab: "kinkhab-parda",
  "saanjh-kinara": "taad-patta-dwar",
  "nathdwara-raat": "pichwai-pat",
  "chandni-mahal": "chandi-kiwad",
  "aakash-mahal": "swarg-kiwad",
  "firoza-bagh": "firoza-darwaza",
  "gulabi-nagar": "jharokha-pat",
  hina: "hina-kiwad",
  "mor-sarovar": "mor-pankh",
  kumudini: "jugnu-parda",
  darbar: "sheesh-kiwad",
  "sunehri-sarovar": "sunehri-phatak",
  pattu: "pattu-thirai",
  "sona-rekha": "kagaz-kiwad",
  "kagzi-phool": "bel-khidki",
  nilofar: "pankhudi-pat",
  "sona-gulaab": "gulaab-lifafa",
  shabnam: "os-parda",
  "surkh-gulaab": "surkh-dwar",
  khushboo: "itr-dibbi",
  "ruh-gulaab": "gulaab-bhaap",
  "oud-raat": "oud-darwaza",
  gulabpash: "tarkashi-jaali",
  "shringaar-mez": "aaina-pat",
  meghdoot: "megh-parda",
  "aath-pehar": "pehar-jaali",
  "beej-se-bagh": "lata-phatak",
  "kissa-kitaab": "kitaab-jild",
  "itr-daan": "itr-almari",
  "pakshi-kosh": "kosh-jild",
  "gudiya-ghar": "gudiya-pat",
  "jantar-mantar": "yantra-pat",
  rangrez: "rang-parda",
  "phool-mandi": "genda-ladi",
  "udan-khatola": "kaleen-parda",
  "rang-raste": "truck-darwaza",
  "kaanch-gumbad": "kaanch-dhakkan",
  "chalk-pati": "pati-pat",
  "jadon-ka-pul": "jad-jhalar",
  "gol-matol": "gol-darwaza",
  "bhool-bhulaiya": "jhaadi-deewar",
  "deco-yatra": "deco-dibba",
  "gehra-neela": "samundar-parda",
  "shatranj-baazi": "shatranj-sandook",
};

/**
 * The style the guest sees: the host's pick when it fits, else the design's own: its theme's
 * opening, the gate given to the design when it suits the occasion and the family's faith,
 * the cover split as doors, or the occasion's own.
 */
export function openingStyle(
  choice: Pick<OpeningChoice, "style"> & Partial<OpeningChoice>,
  suite: SuiteId,
  scene: boolean,
  category?: CategoryId,
  card?: { template?: TemplateId; faith: Faith },
): OpeningStyle {
  const offered = openingStyles(suite, scene);
  if (choice.style && offered.includes(choice.style)) return choice.style;
  // A themed opening's own theme opens with it
  if (isThemedOpening(suite)) return suite;
  // A story theme opens with its own gate
  if (isStoryId(suite)) return STORY_GATE[suite];
  const own = designOpening(suite, scene, card?.template);
  if (own && card && openingSuits(own, category ?? "wedding", card.faith)) return own;
  if (hasCoverDoors(suite) && !scene) return "doors";
  return (category && OCCASION_OPENING[category]) ?? "rajwada-pol";
}

/**
 * The god the guest sees, dropped where the occasion doesn't offer one, or where the
 * family's faith doesn't (a Ganesha picked before the card became a Nikah's).
 */
export function openingGod(
  choice: Pick<OpeningChoice, "god"> & Partial<OpeningChoice>,
  category: CategoryId,
  faith?: { faith: Faith; chosen: boolean },
): OpeningGod | null {
  if (!choice.god || !offersGods(category)) return null;
  if (faith && !openingGods(faith.faith, faith.chosen).includes(choice.god)) return null;
  return choice.god;
}

/**
 * The moment between the opening and the pages takes the opening's own feeling: a toran
 * and turning sun rays after a palace door, a lotus opening after flowers, lamps lit one by
 * one, a moon rising, confetti for a party, or a letter unfolding.
 */
export const WELCOME_KINDS = ["royal", "bloom", "lamps", "night", "party", "letter"] as const;
export type WelcomeKind = (typeof WELCOME_KINDS)[number];

/**
 * Every welcome a guest can see: the six feelings' own scenes, and ten more drawn as
 * scenery (welcome-scenes.tsx): a mandala, a peacock's fan, a sunrise, a garden, a rangoli,
 * diyas on the ghat, fireflies, sky lanterns, kites and the sea.
 */
export const WELCOME_SCENES = [
  ...WELCOME_KINDS,
  "mandala",
  "peacock",
  "sunrise",
  "garden",
  "rangoli",
  "ghat",
  "fireflies",
  "sky-lanterns",
  "kites",
  "waves",
] as const;
export type WelcomeScene = (typeof WELCOME_SCENES)[number];

/** The scenes that share each opening's feeling, its own first. */
export const WELCOME_POOLS: Record<WelcomeKind, readonly WelcomeScene[]> = {
  royal: ["royal", "mandala", "peacock", "sunrise"],
  bloom: ["bloom", "garden", "peacock", "rangoli"],
  lamps: ["lamps", "ghat", "fireflies", "rangoli"],
  night: ["night", "sky-lanterns", "fireflies", "waves"],
  party: ["party", "kites", "sunrise", "garden"],
  letter: ["letter", "rangoli", "mandala", "garden"],
};

/**
 * The welcome a guest sees after this opening: the host's pick, else one of the scenes
 * that share the opening's feeling, `pick` (0 to 1) choosing which, so each visit can
 * bring another.
 */
export function welcomeScene(
  choice: Pick<OpeningChoice, "welcome">,
  style: OpeningStyle,
  pick = 0,
): WelcomeScene {
  if (choice.welcome) return choice.welcome;
  const pool = WELCOME_POOLS[welcomeKind(style)];
  return pool[Math.min(pool.length - 1, Math.floor(pick * pool.length))]!;
}

/** Scenes with a night sky or dark water carry ivory words, as the dark feelings do. */
const DARK_SCENES: readonly WelcomeScene[] = [
  "lamps",
  "night",
  "party",
  "peacock",
  "ghat",
  "fireflies",
  "sky-lanterns",
];
export const darkWelcome = (scene: WelcomeScene) => DARK_SCENES.includes(scene);

/** The video draws the six feelings' scenes; each newer scene films as the nearest one. */
const FILMED_AS: Record<WelcomeScene, WelcomeKind> = {
  royal: "royal",
  bloom: "bloom",
  lamps: "lamps",
  night: "night",
  party: "party",
  letter: "letter",
  mandala: "royal",
  peacock: "night",
  sunrise: "royal",
  garden: "bloom",
  rangoli: "bloom",
  ghat: "lamps",
  fireflies: "lamps",
  "sky-lanterns": "night",
  kites: "party",
  waves: "bloom",
};
export const filmedWelcome = (scene: WelcomeScene): WelcomeKind => FILMED_AS[scene];

const WELCOME_KIND: Record<OpeningStyle, WelcomeKind> = {
  pankhi: "royal",
  "sheesh-mahal": "royal",
  "popup-mahal": "royal",
  "uday-surya": "royal",
  "athangudi-tiles": "royal",
  pachchikari: "royal",
  "chik-baradari": "royal",
  "konark-chakra": "royal",
  shekhawati: "royal",
  "toran-mala": "royal",
  odhni: "bloom",
  "jal-darpan": "bloom",
  "pushp-varsha": "bloom",
  "moti-seep": "bloom",
  "jaali-vriksh": "bloom",
  lehar: "bloom",
  "ped-ghar": "bloom",
  "jhalar-palna": "bloom",
  "jugnu-van": "lamps",
  "sanjhi-roshni": "lamps",
  "chhaya-parda": "lamps",
  "baori-deep": "lamps",
  jhilmil: "lamps",
  "badal-raag": "night",
  taaramandal: "night",
  "thar-ki-ret": "night",
  "sheher-ki-raat": "night",
  "mandvi-dhow": "night",
  "barf-khidki": "night",
  "chhatri-utsav": "party",
  "choodi-chakra": "party",
  "gulaal-bindu": "party",
  "kaanch-ka-gola": "party",
  phirki: "party",
  bulbule: "party",
  "chhuk-chhuk": "party",
  "irani-carrom": "party",
  channapatna: "party",
  "kavad-peti": "letter",
  bioscope: "letter",
  "ikat-dhaaga": "letter",
  "olai-chuvadi": "letter",
  "naksha-pangong": "letter",
  "howrah-tareekh": "letter",
  "pondy-gali": "letter",
  "rajwada-pol": "royal",
  "gopuram-kadhavu": "royal",
  "haveli-kiwad": "royal",
  "shahi-parda": "royal",
  doors: "royal",
  palace: "royal",
  temple: "royal",
  curtain: "royal",
  mandap: "royal",
  jharokha: "royal",
  "phoolon-ki-deewar": "bloom",
  "bagiya-gate": "bloom",
  lotus: "bloom",
  phool: "bloom",
  peacock: "bloom",
  diyas: "lamps",
  lanterns: "lamps",
  rangoli: "lamps",
  "noor-darwaza": "night",
  moonlit: "night",
  "deco-gates": "party",
  "mela-tamboo": "party",
  "chaand-dwar": "night",
  "ritu-dwar": "bloom",
  "raag-dwar": "royal",
  "van-dwar": "bloom",
  "patang-dwar": "party",
  "kumhar-dwar": "lamps",
  "karghaa-dwar": "royal",
  "navrang-dwar": "bloom",
  "ghat-dwar": "lamps",
  "rekha-dwar": "letter",
  "naqsha-pat": "royal",
  "kinkhab-parda": "royal",
  "taad-patta-dwar": "bloom",
  "pichwai-pat": "night",
  "chandi-kiwad": "night",
  "swarg-kiwad": "bloom",
  "firoza-darwaza": "royal",
  "jharokha-pat": "bloom",
  "hina-kiwad": "bloom",
  "mor-pankh": "bloom",
  "jugnu-parda": "night",
  "sheesh-kiwad": "royal",
  "sunehri-phatak": "lamps",
  "pattu-thirai": "lamps",
  "kagaz-kiwad": "letter",
  "bel-khidki": "bloom",
  "pankhudi-pat": "bloom",
  "gulaab-lifafa": "letter",
  "os-parda": "bloom",
  "surkh-dwar": "bloom",
  "itr-dibbi": "royal",
  "gulaab-bhaap": "bloom",
  "oud-darwaza": "night",
  "tarkashi-jaali": "royal",
  "aaina-pat": "bloom",
  "megh-parda": "bloom",
  "pehar-jaali": "royal",
  "lata-phatak": "bloom",
  "kitaab-jild": "letter",
  "itr-almari": "royal",
  "kosh-jild": "letter",
  "gudiya-pat": "party",
  "yantra-pat": "night",
  "rang-parda": "party",
  "genda-ladi": "bloom",
  "kaleen-parda": "royal",
  "truck-darwaza": "party",
  "kaanch-dhakkan": "bloom",
  "pati-pat": "letter",
  "jad-jhalar": "bloom",
  "gol-darwaza": "party",
  "jhaadi-deewar": "bloom",
  "deco-dibba": "royal",
  "samundar-parda": "night",
  "shatranj-sandook": "royal",
  fireworks: "party",
  balloons: "party",
  gift: "party",
  envelope: "letter",
  scroll: "letter",
  storybook: "letter",
  none: "letter",
};

export function welcomeKind(style: OpeningStyle): WelcomeKind {
  return WELCOME_KIND[style];
}
