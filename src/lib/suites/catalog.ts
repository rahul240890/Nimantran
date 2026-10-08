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
import type { Voice } from "./lettering";
import type { FunctionId } from "@/lib/events/functions";
import type { TemplateId } from "@/lib/templates/ids";
import type { TraditionId } from "@/lib/traditions/schema";
import type { GuestLookChoice } from "./guest-look";

/**
 * Illustrated cards: a painted couple (or family) instead of photos, the words in the
 * painting's own empty space, and the art flying in from its sides when the card opens.
 * They are Scene themes with no photo frame (scene.ts ILLUSTRATED), so they need no photos.
 */
export const ILLUSTRATED_IDS = [
  "mor-kamal",
  "rajwada-haathi",
  "madhubani-machhli",
  "pichwai-gaay",
  "kerala-mural",
  "kalyana-vazhai",
  "alpana-topor",
  "kutch-rang",
  "mughal-bagh",
  "phulkari-lavan",
  "safed-gulaab",
  "line-art-gold",
  "samudra-sanjh",
  "kaagaz-chaand",
  "doli-vidaai",
  "haldi-genda",
  "mehendi-jhoola",
  "sangeet-dhol",
  "pehla-janamdin",
  "godh-bharai",
  "griha-kalash",
  "sona-saath",
  "bagh-reception",
  "naamkaran-chanda",
  "swagat-laxmi",
  "holi-rang",
  "christmas-tara",
  "reunion-yaarana",
  "graduation-topi",
  "gudi-padwa",
  "baisakhi-mela",
  "bihu-utsav",
  "gond-vriksh",
  "warli-vivah",
  "kalighat-pat",
  "cheriyal-talambralu",
  "axomiya-biya",
  "antarpat-mangal",
  "kangra-megh",
  "hyderabadi-nikah",
  "goa-azulejo",
  "pressed-phool",
  "tuscan-vineyard",
  "boho-pampas",
  "winter-pine",
  "kantha-silai",
  "tholu-bommalata",
  "chikankari-awadh",
  "bidri-raat",
  "stained-glass",
  "chinoiserie-bagh",
  "nouveau-arch",
  "safar-shaadi",
  "chibi-jodi",
  "jaago-gagar",
  "tilak-thaal",
  "nalangu-vilayattu",
  "sagai-anguthi",
  "chandni-cocktail",
  "kathputli-sangeet",
  "sehrabandi",
  "laxmi-aagman",
  "shashtipurti",
  "circus-tent",
  "toy-train",
  "pet-party",
  "mixtape-party",
  "pehli-salgirah",
  "eid-milan",
  "garba-raas",
  "valaikappu",
  "shubh-labh",
  "retirement-naav",
] as const;
export type IllustratedId = (typeof ILLUSTRATED_IDS)[number];

/**
 * Scene themes: one painting each, with a painted card that flies in with each celebration
 * (scene.ts). They have no pages of their own, so they only show as a Scene, and take the
 * rest of their look (colours, lettering, guest page) from the painted theme they're kin to.
 */
export const SCENE_THEME_IDS = [
  "udaipur-lake",
  "pink-haveli",
  "char-bagh",
  "kashi-ghat",
  "temple-pond",
  "kovil-corridor",
  "arati-mandap",
  "zamindar-bari",
  "kutch-bhunga",
  "punjab-haveli",
  "pune-wada",
  "chinar-dal",
  "space-voyage",
  "rainbow-unicorn",
  "dino-jungle",
  "ocean-pearl",
  "boho-onederland",
  "fairytale-castle",
  "little-racer",
  "gold-gala",
  "amrit-utsav",
  "silver-jubilee",
  "golden-jubilee",
  "oh-baby",
  "new-year-eve",
  "kitty-tea",
  "pool-party",
  "baraat-band",
  "roka-shagun",
  "chooda-ceremony",
  "rishikesh-ganga",
  "jaisalmer-dunes",
  "fort-night",
  "sheesh-mahal",
  "white-rann",
  "mameru-bandhani",
  "sindhi-ajrak",
  "hampi-ruins",
  "coorg-estate",
  "bali-garden",
  "santorini-white",
  "glass-house",
  "minimal-white",
  "fairy-forest",
  "love-letter",
  "parsi-chalk",
  "jazz-lounge",
  "bride-squad",
  "teej-jhoola",
  "cricket-stadium",
  "neon-arcade",
  "retro-bollywood",
  "annaprashan",
  "christening-lilies",
  "new-home-modern",
  "satyanarayan",
  "mata-ki-chowki",
  "upanayana",
  "shraddhanjali",
  "retirement-garden",
  "farewell-night",
  "grand-opening",
  "launch-stage",
  "ganesh-utsav",
  "durga-pujo",
  "janmashtami",
  "onam-pookalam",
  "pongal-kolam",
  "uttarayan-kites",
  "lohri-bonfire",
  "iftar-dawat",
  "kadamb-krishna",
  "ganesh-genda",
  "siya-ram-mala",
  "kailash-kamal",
  "kamal-sarovar",
  "gulmohar",
  "vat-vriksha",
  "mogra-raat",
  "tulip-kashmir",
  "wisteria-tunnel",
  "prem-vriksh",
  "amaltas",
  "palash-van",
  "parijat-angan",
  "aam-bagiya",
  "vazhai-mandap",
  "mor-bagh",
  "orchid-meghalaya",
  "rhododendron-himalaya",
  "sunflower-haldi",
  "lavender-field",
  "hydrangea-blue",
  "peony-blush",
  "magnolia-moon",
  "phool-chandelier",
  ...ILLUSTRATED_IDS,
] as const;
export type SceneThemeId = (typeof SCENE_THEME_IDS)[number];

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
  "ivory-arch",
  "gulaab",
  "deco-noir",
  "taara",
  "kaagaz",
  "mitti",
  "neel",
  "pichwai",
  "tanjore",
  "kashi",
  "sagar",
  "mysuru",
  "kalamkari",
  "pattachitra",
  "chinar",
  "chai-bagan",
  "sufi-raat",
  "chapel",
  "sakura",
  "vigna",
  "himani",
  "van",
  "riad",
  "palna",
  "deepotsav",
  "jungle-party",
  ...SCENE_THEME_IDS,
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
  // A god's own page before the cover, only in themes painted with one (Step 12r)
  "blessing",
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
  /** Pages with a god painted near the top, beyond the blessing page (a wedding's canopy). */
  gods?: readonly PageArt[];
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
  /** How its words are lettered (lettering.ts); missing is regal, the palaces' serif. */
  voice?: Voice;
};

const PAINTED: Record<Exclude<SuiteId, SceneThemeId>, Suite> = {
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
    voice: "playful",
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
    voice: "modern",
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
  // Modern and minimal: ivory plaster arches, pampas grass and soft sunlight
  "ivory-arch": {
    voice: "romantic",
    id: "ivory-arch",
    art: "bagh",
    turn: "arch",
    faiths: ["all"],
    template: "monogram",
    traditions: [],
    guest: {
      style: "palace",
      flower: "jasmine",
      secondFlower: "rose",
      lamp: "lanterns",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/ivory-arch/cover.webp",
      family: "/suites/ivory-arch/family.webp",
      haldi: "/suites/ivory-arch/haldi.webp",
      mehendi: "/suites/ivory-arch/mehendi.webp",
      sangeet: "/suites/ivory-arch/sangeet.webp",
      baraat: "/suites/ivory-arch/baraat.webp",
      wedding: "/suites/ivory-arch/wedding.webp",
      reception: "/suites/ivory-arch/reception.webp",
      reply: "/suites/ivory-arch/reply.webp",
    },
    tones: { reception: "light" },
  },
  // Loose watercolour roses and peonies on white paper
  gulaab: {
    voice: "romantic",
    id: "gulaab",
    art: "bagh",
    turn: "fade",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "palace",
      flower: "rose",
      secondFlower: "lotus",
      lamp: "fairy",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/gulaab/cover.webp",
      family: "/suites/gulaab/family.webp",
      haldi: "/suites/gulaab/haldi.webp",
      mehendi: "/suites/gulaab/mehendi.webp",
      sangeet: "/suites/gulaab/sangeet.webp",
      baraat: "/suites/gulaab/baraat.webp",
      wedding: "/suites/gulaab/wedding.webp",
      reception: "/suites/gulaab/reception.webp",
      reply: "/suites/gulaab/reply.webp",
    },
    tones: { reception: "light" },
  },
  // Black lacquer and gold art deco, like a grand 1920s hotel
  "deco-noir": {
    voice: "modern",
    id: "deco-noir",
    art: "kayal",
    turn: "sweep",
    faiths: ["all"],
    template: "monogram",
    traditions: [],
    guest: {
      style: "palace",
      flower: "jasmine",
      secondFlower: "rose",
      lamp: "lanterns",
      pattern: "burst",
    },
    images: {
      cover: "/suites/deco-noir/cover.webp",
      family: "/suites/deco-noir/family.webp",
      haldi: "/suites/deco-noir/haldi.webp",
      mehendi: "/suites/deco-noir/mehendi.webp",
      sangeet: "/suites/deco-noir/sangeet.webp",
      baraat: "/suites/deco-noir/baraat.webp",
      wedding: "/suites/deco-noir/wedding.webp",
      reception: "/suites/deco-noir/reception.webp",
      reply: "/suites/deco-noir/reply.webp",
    },
    tones: {
      cover: "dark",
      family: "dark",
      haldi: "dark",
      mehendi: "dark",
      baraat: "dark",
      wedding: "dark",
    },
  },
  // A midnight sky of gold moons, stars and soft clouds
  taara: {
    voice: "modern",
    id: "taara",
    art: "kayal",
    turn: "fade",
    faiths: ["all"],
    template: "monogram",
    traditions: [],
    guest: {
      style: "palace",
      flower: "jasmine",
      secondFlower: "lotus",
      lamp: "fairy",
      pattern: "burst",
    },
    images: {
      cover: "/suites/taara/cover.webp",
      family: "/suites/taara/family.webp",
      haldi: "/suites/taara/haldi.webp",
      mehendi: "/suites/taara/mehendi.webp",
      sangeet: "/suites/taara/sangeet.webp",
      baraat: "/suites/taara/baraat.webp",
      wedding: "/suites/taara/wedding.webp",
      reception: "/suites/taara/reception.webp",
      reply: "/suites/taara/reply.webp",
    },
    tones: { cover: "dark", family: "dark", baraat: "dark" },
  },
  // Layers of cut paper in pastel shades, with real depth
  kaagaz: {
    voice: "modern",
    id: "kaagaz",
    art: "bagh",
    turn: "arch",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "procession",
      flower: "rose",
      secondFlower: "lotus",
      lamp: "lanterns",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/kaagaz/cover.webp",
      family: "/suites/kaagaz/family.webp",
      haldi: "/suites/kaagaz/haldi.webp",
      mehendi: "/suites/kaagaz/mehendi.webp",
      sangeet: "/suites/kaagaz/sangeet.webp",
      baraat: "/suites/kaagaz/baraat.webp",
      wedding: "/suites/kaagaz/wedding.webp",
      reception: "/suites/kaagaz/reception.webp",
      reply: "/suites/kaagaz/reply.webp",
    },
  },
  // Boho desert: terracotta arches, pampas grass and the dunes at sunset
  mitti: {
    voice: "romantic",
    id: "mitti",
    art: "savari",
    turn: "sweep",
    faiths: ["all"],
    template: "rangmahal",
    traditions: [],
    guest: {
      style: "procession",
      flower: "marigold",
      secondFlower: "rose",
      lamp: "lanterns",
      pattern: "burst",
    },
    images: {
      cover: "/suites/mitti/cover.webp",
      family: "/suites/mitti/family.webp",
      haldi: "/suites/mitti/haldi.webp",
      mehendi: "/suites/mitti/mehendi.webp",
      sangeet: "/suites/mitti/sangeet.webp",
      baraat: "/suites/mitti/baraat.webp",
      wedding: "/suites/mitti/wedding.webp",
      reception: "/suites/mitti/reception.webp",
      reply: "/suites/mitti/reply.webp",
    },
    tones: { reply: "light" },
  },
  // Jaipur blue pottery: cobalt and turquoise tiles on white marble
  neel: {
    id: "neel",
    art: "bagh",
    turn: "arch",
    faiths: ["all"],
    template: "emerald",
    traditions: [],
    guest: {
      style: "palace",
      flower: "jasmine",
      secondFlower: "lotus",
      lamp: "lanterns",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/neel/cover.webp",
      family: "/suites/neel/family.webp",
      haldi: "/suites/neel/haldi.webp",
      mehendi: "/suites/neel/mehendi.webp",
      sangeet: "/suites/neel/sangeet.webp",
      baraat: "/suites/neel/baraat.webp",
      wedding: "/suites/neel/wedding.webp",
      reception: "/suites/neel/reception.webp",
      reply: "/suites/neel/reply.webp",
    },
    tones: { reception: "light" },
  },
  // A Nathdwara Pichwai: lotus ponds, cows and Shrinathji's blessing
  pichwai: {
    id: "pichwai",
    art: "kayal",
    turn: "ripple",
    faiths: ["all"],
    template: "marigold",
    traditions: [],
    guest: {
      style: "palace",
      flower: "lotus",
      secondFlower: "marigold",
      lamp: "diyas",
      pattern: "rangoli",
    },
    images: {
      blessing: "/suites/pichwai/blessing.webp",
      cover: "/suites/pichwai/cover.webp",
      family: "/suites/pichwai/family.webp",
      haldi: "/suites/pichwai/haldi.webp",
      mehendi: "/suites/pichwai/mehendi.webp",
      sangeet: "/suites/pichwai/sangeet.webp",
      baraat: "/suites/pichwai/baraat.webp",
      wedding: "/suites/pichwai/wedding.webp",
      reception: "/suites/pichwai/reception.webp",
      reply: "/suites/pichwai/reply.webp",
    },
    gods: ["wedding"],
    tones: { blessing: "dark", cover: "dark" },
  },
  // A Thanjavur painting in gold leaf and gems, with Ganesha and Lakshmi
  tanjore: {
    id: "tanjore",
    art: "kayal",
    turn: "arch",
    faiths: ["all"],
    template: "gopuram",
    traditions: [],
    guest: {
      style: "palace",
      flower: "marigold",
      secondFlower: "jasmine",
      lamp: "nilavilakku",
      pattern: "kolam",
    },
    images: {
      blessing: "/suites/tanjore/blessing.webp",
      cover: "/suites/tanjore/cover.webp",
      family: "/suites/tanjore/family.webp",
      haldi: "/suites/tanjore/haldi.webp",
      mehendi: "/suites/tanjore/mehendi.webp",
      sangeet: "/suites/tanjore/sangeet.webp",
      baraat: "/suites/tanjore/baraat.webp",
      wedding: "/suites/tanjore/wedding.webp",
      reception: "/suites/tanjore/reception.webp",
      reply: "/suites/tanjore/reply.webp",
    },
    gods: ["wedding"],
    tones: { blessing: "dark", cover: "dark", mehendi: "dark", baraat: "dark", wedding: "dark" },
  },
  // The ghats of Banaras at dawn, with Ganesha's blessing and lamps on the Ganga
  kashi: {
    id: "kashi",
    art: "kayal",
    turn: "ripple",
    faiths: ["all"],
    template: "marigold",
    traditions: [],
    guest: {
      style: "palace",
      flower: "marigold",
      secondFlower: "lotus",
      lamp: "diyas",
      pattern: "rangoli",
    },
    images: {
      blessing: "/suites/kashi/blessing.webp",
      cover: "/suites/kashi/cover.webp",
      family: "/suites/kashi/family.webp",
      haldi: "/suites/kashi/haldi.webp",
      mehendi: "/suites/kashi/mehendi.webp",
      sangeet: "/suites/kashi/sangeet.webp",
      baraat: "/suites/kashi/baraat.webp",
      wedding: "/suites/kashi/wedding.webp",
      reception: "/suites/kashi/reception.webp",
      reply: "/suites/kashi/reply.webp",
    },
    gods: ["wedding"],
    tones: { reception: "light" },
  },
  // A beach wedding: white drapes, palms and a pastel sunset over the sea
  sagar: {
    voice: "romantic",
    id: "sagar",
    art: "kayal",
    turn: "ripple",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "garden",
      flower: "jasmine",
      secondFlower: "lotus",
      lamp: "lanterns",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/sagar/cover.webp",
      family: "/suites/sagar/family.webp",
      haldi: "/suites/sagar/haldi.webp",
      mehendi: "/suites/sagar/mehendi.webp",
      sangeet: "/suites/sagar/sangeet.webp",
      baraat: "/suites/sagar/baraat.webp",
      wedding: "/suites/sagar/wedding.webp",
      reception: "/suites/sagar/reception.webp",
      reply: "/suites/sagar/reply.webp",
    },
    tones: { reception: "light", reply: "light" },
  },
  // Mysuru Palace lit for Dasara in Mysore gold painting, with Ganesha's blessing
  mysuru: {
    id: "mysuru",
    art: "kayal",
    turn: "arch",
    faiths: ["all"],
    template: "gopuram",
    traditions: [],
    guest: {
      style: "palace",
      flower: "jasmine",
      secondFlower: "marigold",
      lamp: "diyas",
      pattern: "rangoli",
    },
    images: {
      blessing: "/suites/mysuru/blessing.webp",
      cover: "/suites/mysuru/cover.webp",
      family: "/suites/mysuru/family.webp",
      haldi: "/suites/mysuru/haldi.webp",
      mehendi: "/suites/mysuru/mehendi.webp",
      sangeet: "/suites/mysuru/sangeet.webp",
      baraat: "/suites/mysuru/baraat.webp",
      wedding: "/suites/mysuru/wedding.webp",
      reception: "/suites/mysuru/reception.webp",
      reply: "/suites/mysuru/reply.webp",
    },
    tones: { blessing: "dark", mehendi: "dark", reception: "light" },
  },
  // Hand-painted Kalamkari cloth from Srikalahasti, with Lord Venkateswara's blessing
  kalamkari: {
    id: "kalamkari",
    art: "kayal",
    turn: "sweep",
    faiths: ["all"],
    template: "gopuram",
    traditions: [],
    guest: {
      style: "palace",
      flower: "lotus",
      secondFlower: "marigold",
      lamp: "diyas",
      pattern: "kolam",
    },
    images: {
      blessing: "/suites/kalamkari/blessing.webp",
      cover: "/suites/kalamkari/cover.webp",
      family: "/suites/kalamkari/family.webp",
      haldi: "/suites/kalamkari/haldi.webp",
      mehendi: "/suites/kalamkari/mehendi.webp",
      sangeet: "/suites/kalamkari/sangeet.webp",
      baraat: "/suites/kalamkari/baraat.webp",
      wedding: "/suites/kalamkari/wedding.webp",
      reception: "/suites/kalamkari/reception.webp",
      reply: "/suites/kalamkari/reply.webp",
    },
    gods: ["wedding"],
    tones: { blessing: "dark", mehendi: "dark", baraat: "dark", reply: "light" },
  },
  // An Odisha Pattachitra scroll, with Lord Jagannath's blessing
  pattachitra: {
    id: "pattachitra",
    art: "kayal",
    turn: "sweep",
    faiths: ["all"],
    template: "alpona",
    traditions: [],
    guest: {
      style: "procession",
      flower: "lotus",
      secondFlower: "marigold",
      lamp: "diyas",
      pattern: "alpona",
    },
    images: {
      blessing: "/suites/pattachitra/blessing.webp",
      cover: "/suites/pattachitra/cover.webp",
      family: "/suites/pattachitra/family.webp",
      haldi: "/suites/pattachitra/haldi.webp",
      mehendi: "/suites/pattachitra/mehendi.webp",
      sangeet: "/suites/pattachitra/sangeet.webp",
      baraat: "/suites/pattachitra/baraat.webp",
      wedding: "/suites/pattachitra/wedding.webp",
      reception: "/suites/pattachitra/reception.webp",
      reply: "/suites/pattachitra/reply.webp",
    },
    gods: ["wedding"],
    tones: { blessing: "dark", mehendi: "dark" },
  },
  // Kashmir in autumn: Dal Lake, shikaras, chinar leaves and walnut wood
  chinar: {
    id: "chinar",
    art: "kayal",
    turn: "ripple",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "garden",
      flower: "rose",
      secondFlower: "jasmine",
      lamp: "lanterns",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/chinar/cover.webp",
      family: "/suites/chinar/family.webp",
      haldi: "/suites/chinar/haldi.webp",
      mehendi: "/suites/chinar/mehendi.webp",
      sangeet: "/suites/chinar/sangeet.webp",
      baraat: "/suites/chinar/baraat.webp",
      wedding: "/suites/chinar/wedding.webp",
      reception: "/suites/chinar/reception.webp",
      reply: "/suites/chinar/reply.webp",
    },
  },
  // Assam's tea gardens in gamosa red and white, with Bihu drums
  "chai-bagan": {
    id: "chai-bagan",
    art: "kayal",
    turn: "fade",
    faiths: ["all"],
    template: "alpona",
    traditions: [],
    guest: {
      style: "garden",
      flower: "jasmine",
      secondFlower: "rose",
      lamp: "lanterns",
      pattern: "alpona",
    },
    images: {
      cover: "/suites/chai-bagan/cover.webp",
      family: "/suites/chai-bagan/family.webp",
      haldi: "/suites/chai-bagan/haldi.webp",
      mehendi: "/suites/chai-bagan/mehendi.webp",
      sangeet: "/suites/chai-bagan/sangeet.webp",
      baraat: "/suites/chai-bagan/baraat.webp",
      wedding: "/suites/chai-bagan/wedding.webp",
      reception: "/suites/chai-bagan/reception.webp",
      reply: "/suites/chai-bagan/reply.webp",
    },
  },
  // A moonlit Sufi courtyard of lanterns, roses and still water, for a Nikah
  "sufi-raat": {
    id: "sufi-raat",
    art: "kayal",
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
      cover: "/suites/sufi-raat/cover.webp",
      family: "/suites/sufi-raat/family.webp",
      haldi: "/suites/sufi-raat/haldi.webp",
      mehendi: "/suites/sufi-raat/mehendi.webp",
      sangeet: "/suites/sufi-raat/sangeet.webp",
      baraat: "/suites/sufi-raat/baraat.webp",
      wedding: "/suites/sufi-raat/wedding.webp",
      reception: "/suites/sufi-raat/reception.webp",
      reply: "/suites/sufi-raat/reply.webp",
    },
    tones: { cover: "dark", mehendi: "dark", baraat: "dark", reception: "light" },
  },
  // A white garden chapel with stained glass and lilies, opening with the window's blessing
  chapel: {
    voice: "romantic",
    id: "chapel",
    art: "kayal",
    turn: "fade",
    faiths: ["christian", "all"],
    template: "monogram",
    traditions: [],
    guest: {
      style: "garden",
      flower: "jasmine",
      secondFlower: "rose",
      lamp: "fairy",
      pattern: "jaali",
    },
    images: {
      blessing: "/suites/chapel/blessing.webp",
      cover: "/suites/chapel/cover.webp",
      family: "/suites/chapel/family.webp",
      haldi: "/suites/chapel/haldi.webp",
      mehendi: "/suites/chapel/mehendi.webp",
      sangeet: "/suites/chapel/sangeet.webp",
      baraat: "/suites/chapel/baraat.webp",
      wedding: "/suites/chapel/wedding.webp",
      reception: "/suites/chapel/reception.webp",
      reply: "/suites/chapel/reply.webp",
    },
    tones: { reply: "light" },
  },
  // Soft cherry blossoms over a wooden bridge, a still pond and paper lanterns
  sakura: {
    voice: "romantic",
    id: "sakura",
    art: "kayal",
    turn: "fade",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "garden",
      flower: "rose",
      secondFlower: "jasmine",
      lamp: "lanterns",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/sakura/cover.webp",
      family: "/suites/sakura/family.webp",
      haldi: "/suites/sakura/haldi.webp",
      mehendi: "/suites/sakura/mehendi.webp",
      sangeet: "/suites/sakura/sangeet.webp",
      baraat: "/suites/sakura/baraat.webp",
      wedding: "/suites/sakura/wedding.webp",
      reception: "/suites/sakura/reception.webp",
      reply: "/suites/sakura/reply.webp",
    },
  },
  // A Tuscan vineyard at golden hour, with olive trees and a rustic stone villa
  vigna: {
    voice: "romantic",
    id: "vigna",
    art: "kayal",
    turn: "fade",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "garden",
      flower: "rose",
      secondFlower: "jasmine",
      lamp: "fairy",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/vigna/cover.webp",
      family: "/suites/vigna/family.webp",
      haldi: "/suites/vigna/haldi.webp",
      mehendi: "/suites/vigna/mehendi.webp",
      sangeet: "/suites/vigna/sangeet.webp",
      baraat: "/suites/vigna/baraat.webp",
      wedding: "/suites/vigna/wedding.webp",
      reception: "/suites/vigna/reception.webp",
      reply: "/suites/vigna/reply.webp",
    },
    tones: { reception: "light", reply: "light" },
  },
  // Snowy mountains, a pine forest and warm winter lights
  himani: {
    voice: "romantic",
    id: "himani",
    art: "kayal",
    turn: "fade",
    faiths: ["all"],
    template: "monogram",
    traditions: [],
    guest: {
      style: "palace",
      flower: "jasmine",
      secondFlower: "rose",
      lamp: "fairy",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/himani/cover.webp",
      family: "/suites/himani/family.webp",
      haldi: "/suites/himani/haldi.webp",
      mehendi: "/suites/himani/mehendi.webp",
      sangeet: "/suites/himani/sangeet.webp",
      baraat: "/suites/himani/baraat.webp",
      wedding: "/suites/himani/wedding.webp",
      reception: "/suites/himani/reception.webp",
      reply: "/suites/himani/reply.webp",
    },
    tones: { baraat: "dark", reception: "light" },
  },
  // An enchanted forest of moss, ferns, fairy lights and fireflies
  van: {
    voice: "romantic",
    id: "van",
    art: "kayal",
    turn: "fade",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: {
      style: "garden",
      flower: "jasmine",
      secondFlower: "rose",
      lamp: "fairy",
      pattern: "jaali",
    },
    images: {
      cover: "/suites/van/cover.webp",
      family: "/suites/van/family.webp",
      haldi: "/suites/van/haldi.webp",
      mehendi: "/suites/van/mehendi.webp",
      sangeet: "/suites/van/sangeet.webp",
      baraat: "/suites/van/baraat.webp",
      wedding: "/suites/van/wedding.webp",
      reception: "/suites/van/reception.webp",
      reply: "/suites/van/reply.webp",
    },
    tones: { family: "dark", haldi: "dark", mehendi: "dark", baraat: "dark" },
  },
  // A Moroccan riad of zellige fountains, horseshoe arches and brass lanterns
  riad: {
    id: "riad",
    art: "kayal",
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
      cover: "/suites/riad/cover.webp",
      family: "/suites/riad/family.webp",
      haldi: "/suites/riad/haldi.webp",
      mehendi: "/suites/riad/mehendi.webp",
      sangeet: "/suites/riad/sangeet.webp",
      baraat: "/suites/riad/baraat.webp",
      wedding: "/suites/riad/wedding.webp",
      reception: "/suites/riad/reception.webp",
      reply: "/suites/riad/reply.webp",
    },
    tones: { family: "dark", mehendi: "dark", baraat: "dark", reception: "light" },
  },
  // A flower swing cradle among soft pastel clouds, for a baby shower
  palna: {
    voice: "playful",
    id: "palna",
    art: "bagh",
    turn: "fade",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: { style: "party", flower: "rose", secondFlower: "jasmine", pattern: "burst" },
    images: {
      cover: "/suites/palna/cover.webp",
      family: "/suites/palna/family.webp",
      reception: "/suites/palna/reception.webp",
      reply: "/suites/palna/reply.webp",
    },
    tones: { reception: "light", reply: "light" },
    occasions: ["baby-shower"],
  },
  // A Diwali night of diyas, rangoli, lanterns and fireworks, opening with Lakshmi and Ganesha's blessing
  deepotsav: {
    id: "deepotsav",
    art: "kayal",
    turn: "fade",
    faiths: ["all"],
    template: "marigold",
    traditions: [],
    guest: {
      style: "palace",
      flower: "marigold",
      secondFlower: "lotus",
      lamp: "diyas",
      pattern: "rangoli",
    },
    images: {
      blessing: "/suites/deepotsav/blessing.webp",
      cover: "/suites/deepotsav/cover.webp",
      family: "/suites/deepotsav/family.webp",
      reception: "/suites/deepotsav/reception.webp",
      reply: "/suites/deepotsav/reply.webp",
    },
    tones: { blessing: "dark", cover: "dark" },
    occasions: ["diwali"],
  },
  // A storybook jungle of friendly animals, balloons and big leaves
  "jungle-party": {
    voice: "playful",
    id: "jungle-party",
    art: "bagh",
    turn: "fade",
    faiths: ["all"],
    template: "rose",
    traditions: [],
    guest: { style: "party", flower: "marigold", secondFlower: "rose", pattern: "burst" },
    images: {
      cover: "/suites/jungle-party/cover.webp",
      family: "/suites/jungle-party/family.webp",
      reception: "/suites/jungle-party/reception.webp",
      reply: "/suites/jungle-party/reply.webp",
    },
    occasions: ["birthday"],
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

/** The painted theme each Scene theme takes its colours, lettering and guest page from. */
const SCENE_KIN: Record<SceneThemeId, Exclude<SuiteId, SceneThemeId>> = {
  "udaipur-lake": "rajwada-bagh",
  "pink-haveli": "shahi-savari",
  "char-bagh": "noor-bagh",
  "kashi-ghat": "kashi",
  "temple-pond": "kayal",
  "kovil-corridor": "mysuru",
  "arati-mandap": "kalamkari",
  "zamindar-bari": "rajbari",
  "kutch-bhunga": "kutch-toran",
  "punjab-haveli": "phulkari-haveli",
  "pune-wada": "peshwai-wada",
  "chinar-dal": "chinar",
  "space-voyage": "rooftop",
  "rainbow-unicorn": "gubbara",
  "dino-jungle": "jungle-party",
  "ocean-pearl": "gubbara",
  "boho-onederland": "gubbara",
  "fairytale-castle": "gubbara",
  "little-racer": "jungle-party",
  "gold-gala": "rooftop",
  "amrit-utsav": "saath",
  "silver-jubilee": "saath",
  "golden-jubilee": "saath",
  "oh-baby": "palna",
  "new-year-eve": "rooftop",
  "kitty-tea": "gubbara",
  "pool-party": "gubbara",
  "baraat-band": "rajwada-bagh",
  "roka-shagun": "rajwada-bagh",
  "chooda-ceremony": "phulkari-haveli",
  "rishikesh-ganga": "kashi",
  "jaisalmer-dunes": "shahi-savari",
  "fort-night": "rajwada-bagh",
  "sheesh-mahal": "shahi-savari",
  "white-rann": "kutch-toran",
  "mameru-bandhani": "kutch-toran",
  "sindhi-ajrak": "kutch-toran",
  "hampi-ruins": "mysuru",
  "coorg-estate": "mysuru",
  "bali-garden": "sagar",
  "santorini-white": "sagar",
  "glass-house": "ivory-arch",
  "minimal-white": "ivory-arch",
  "fairy-forest": "van",
  "love-letter": "gulaab",
  "parsi-chalk": "gulaab",
  "jazz-lounge": "deco-noir",
  "bride-squad": "gubbara",
  "teej-jhoola": "gubbara",
  "cricket-stadium": "jungle-party",
  "neon-arcade": "rooftop",
  "retro-bollywood": "rooftop",
  annaprashan: "palna",
  "christening-lilies": "chapel",
  "new-home-modern": "ivory-arch",
  satyanarayan: "kashi",
  "mata-ki-chowki": "kashi",
  upanayana: "mysuru",
  shraddhanjali: "ivory-arch",
  "retirement-garden": "saath",
  "farewell-night": "rooftop",
  "grand-opening": "deepotsav",
  "launch-stage": "deco-noir",
  "ganesh-utsav": "peshwai-wada",
  "durga-pujo": "rajbari",
  janmashtami: "pichwai",
  "onam-pookalam": "kayal",
  "pongal-kolam": "tanjore",
  "uttarayan-kites": "kutch-toran",
  "lohri-bonfire": "phulkari-haveli",
  "iftar-dawat": "noor-bagh",
  "kadamb-krishna": "pichwai",
  "ganesh-genda": "peshwai-wada",
  "siya-ram-mala": "rajwada-bagh",
  "kailash-kamal": "himani",
  "kamal-sarovar": "kashi",
  gulmohar: "gulaab",
  "vat-vriksha": "van",
  "mogra-raat": "taara",
  "tulip-kashmir": "chinar",
  "wisteria-tunnel": "sakura",
  "prem-vriksh": "sakura",
  amaltas: "shahi-savari",
  "palash-van": "mitti",
  "parijat-angan": "kashi",
  "aam-bagiya": "van",
  "vazhai-mandap": "kayal",
  "mor-bagh": "rajwada-bagh",
  "orchid-meghalaya": "chai-bagan",
  "rhododendron-himalaya": "himani",
  "sunflower-haldi": "shahi-savari",
  "lavender-field": "vigna",
  "hydrangea-blue": "ivory-arch",
  "peony-blush": "gulaab",
  "magnolia-moon": "taara",
  "phool-chandelier": "ivory-arch",
  "mor-kamal": "gulaab",
  "rajwada-haathi": "shahi-savari",
  "madhubani-machhli": "mitti",
  "pichwai-gaay": "pichwai",
  "kerala-mural": "kayal",
  "kalyana-vazhai": "tanjore",
  "alpana-topor": "rajbari",
  "kutch-rang": "kutch-toran",
  "mughal-bagh": "noor-bagh",
  "phulkari-lavan": "phulkari-haveli",
  "safed-gulaab": "ivory-arch",
  "line-art-gold": "ivory-arch",
  "samudra-sanjh": "sagar",
  "kaagaz-chaand": "taara",
  "doli-vidaai": "mitti",
  "haldi-genda": "shahi-savari",
  "mehendi-jhoola": "van",
  "sangeet-dhol": "rooftop",
  "pehla-janamdin": "gubbara",
  "godh-bharai": "palna",
  "griha-kalash": "peshwai-wada",
  "sona-saath": "saath",
  "bagh-reception": "ivory-arch",
  "naamkaran-chanda": "palna",
  "swagat-laxmi": "palna",
  "holi-rang": "gubbara",
  "christmas-tara": "gulaab",
  "reunion-yaarana": "rooftop",
  "graduation-topi": "gubbara",
  "gudi-padwa": "peshwai-wada",
  "baisakhi-mela": "phulkari-haveli",
  "bihu-utsav": "chai-bagan",
  "gond-vriksh": "mitti",
  "warli-vivah": "mitti",
  "kalighat-pat": "rajbari",
  "cheriyal-talambralu": "tanjore",
  "axomiya-biya": "chai-bagan",
  "antarpat-mangal": "peshwai-wada",
  "kangra-megh": "pichwai",
  "hyderabadi-nikah": "noor-bagh",
  "goa-azulejo": "sagar",
  "pressed-phool": "ivory-arch",
  "tuscan-vineyard": "ivory-arch",
  "boho-pampas": "rooftop",
  "winter-pine": "himani",
  "kantha-silai": "rajbari",
  "tholu-bommalata": "kalamkari",
  "chikankari-awadh": "ivory-arch",
  "bidri-raat": "deco-noir",
  "stained-glass": "chapel",
  "chinoiserie-bagh": "gulaab",
  "nouveau-arch": "ivory-arch",
  "safar-shaadi": "sagar",
  "chibi-jodi": "shahi-savari",
  "jaago-gagar": "phulkari-haveli",
  "tilak-thaal": "shahi-savari",
  "nalangu-vilayattu": "tanjore",
  "sagai-anguthi": "gulaab",
  "chandni-cocktail": "rooftop",
  "kathputli-sangeet": "shahi-savari",
  sehrabandi: "shahi-savari",
  "laxmi-aagman": "shahi-savari",
  shashtipurti: "saath",
  "circus-tent": "gubbara",
  "toy-train": "gubbara",
  "pet-party": "gubbara",
  "mixtape-party": "rooftop",
  "pehli-salgirah": "saath",
  "eid-milan": "noor-bagh",
  "garba-raas": "kutch-toran",
  valaikappu: "palna",
  "shubh-labh": "peshwai-wada",
  "retirement-naav": "saath",
};

/** The occasions a Scene theme is painted for beyond weddings. */
const SCENE_OCCASIONS: Partial<Record<SceneThemeId, readonly CategoryId[]>> = {
  "space-voyage": ["birthday"],
  "rainbow-unicorn": ["birthday"],
  "dino-jungle": ["birthday"],
  "ocean-pearl": ["birthday"],
  "boho-onederland": ["birthday"],
  "fairytale-castle": ["birthday"],
  "little-racer": ["birthday"],
  "gold-gala": ["birthday", "party"],
  "amrit-utsav": ["birthday"],
  "silver-jubilee": ["anniversary"],
  "golden-jubilee": ["anniversary"],
  "oh-baby": ["baby-shower"],
  "new-year-eve": ["party"],
  "kitty-tea": ["party"],
  "pool-party": ["party", "birthday"],
  "bride-squad": ["party"],
  "teej-jhoola": ["party"],
  "cricket-stadium": ["birthday"],
  "neon-arcade": ["birthday", "party"],
  "retro-bollywood": ["party", "birthday"],
  annaprashan: ["annaprashan"],
  "christening-lilies": ["christening"],
  "new-home-modern": ["housewarming"],
  satyanarayan: ["puja"],
  "mata-ki-chowki": ["puja"],
  upanayana: ["thread-ceremony"],
  shraddhanjali: ["prayer-meet"],
  "retirement-garden": ["retirement"],
  "farewell-night": ["farewell-party"],
  "grand-opening": ["shop-opening"],
  "launch-stage": ["launch"],
  "ganesh-utsav": ["ganesh-chaturthi"],
  "durga-pujo": ["navratri"],
  janmashtami: ["janmashtami"],
  "onam-pookalam": ["onam"],
  "pongal-kolam": ["sankranti"],
  "uttarayan-kites": ["sankranti"],
  "lohri-bonfire": ["lohri"],
  "iftar-dawat": ["eid"],
  "pehla-janamdin": ["birthday"],
  "godh-bharai": ["baby-shower"],
  "griha-kalash": ["housewarming"],
  "sona-saath": ["anniversary", "retirement"],
  "naamkaran-chanda": ["naming-ceremony"],
  "swagat-laxmi": ["naming-ceremony", "baby-shower"],
  "holi-rang": ["holi"],
  "christmas-tara": ["christmas"],
  "reunion-yaarana": ["reunion"],
  "graduation-topi": ["graduation"],
  "gudi-padwa": ["gudi-padwa"],
  "baisakhi-mela": ["baisakhi"],
  "bihu-utsav": ["bihu"],
  shashtipurti: ["birthday", "anniversary"],
  "circus-tent": ["birthday"],
  "toy-train": ["birthday"],
  "pet-party": ["birthday", "party"],
  "mixtape-party": ["birthday", "party"],
  "pehli-salgirah": ["anniversary"],
  "eid-milan": ["eid"],
  "garba-raas": ["navratri"],
  valaikappu: ["baby-shower"],
  "shubh-labh": ["shop-opening"],
  "retirement-naav": ["retirement", "farewell-party"],
};

/** A Scene theme: its kin's look, and its painting with the card for thumbnails and link previews. */
function sceneTheme(id: SceneThemeId): Suite {
  const { art, turn, faiths, template, guest, voice } = PAINTED[SCENE_KIN[id]];
  return {
    id,
    art,
    turn,
    faiths,
    template,
    traditions: [],
    guest,
    voice,
    images: { cover: `/suites/${id}/cover.webp` },
    ...(SCENE_OCCASIONS[id] && { occasions: SCENE_OCCASIONS[id] }),
  };
}

export const SUITES: Record<SuiteId, Suite> = {
  ...PAINTED,
  ...(Object.fromEntries(SCENE_THEME_IDS.map((id) => [id, sceneTheme(id)])) as Record<
    SceneThemeId,
    Suite
  >),
};

/** Whether a theme is one of the Scene themes, which only show as a Scene. */
export function isSceneTheme(suite: SuiteId): suite is SceneThemeId {
  return (SCENE_THEME_IDS as readonly SuiteId[]).includes(suite);
}

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

/**
 * The wedding journey: the wedding and its own functions, the categories a wedding theme is
 * painted for. Every other occasion shows only the themes painted for it.
 */
export const WEDDING_JOURNEY = [
  "wedding",
  "engagement",
  "roka",
  "save-the-date",
  "haldi",
  "mehendi",
  "sangeet",
  "reception",
] as const satisfies readonly CategoryId[];
type JourneyId = (typeof WEDDING_JOURNEY)[number];

export function isWeddingJourney(category: CategoryId): category is JourneyId {
  return (WEDDING_JOURNEY as readonly CategoryId[]).includes(category);
}

/** Wedding themes painted for one part of the journey only. */
const WEDDING_FIT: Partial<Record<SuiteId, readonly JourneyId[]>> = {
  "love-letter": ["save-the-date"],
  "roka-shagun": ["roka", "engagement"],
  "jazz-lounge": ["engagement", "sangeet", "reception"],
  // A function within the wedding itself
  "chooda-ceremony": ["wedding"],
  "mameru-bandhani": ["wedding"],
  "baraat-band": ["wedding"],
  // A church wedding has no haldi, mehendi, sangeet or roka
  chapel: ["wedding", "engagement", "save-the-date", "reception"],
  "safed-gulaab": ["wedding", "engagement", "save-the-date", "reception"],
  // Illustrated cards painted for one function, or for the wedding day itself
  "doli-vidaai": ["wedding"],
  "haldi-genda": ["haldi"],
  "mehendi-jhoola": ["mehendi"],
  "sangeet-dhol": ["sangeet", "reception"],
  "bagh-reception": ["reception", "engagement"],
  "hyderabadi-nikah": ["wedding", "engagement", "mehendi", "reception"],
  "goa-azulejo": ["wedding", "engagement", "save-the-date", "reception"],
  "pressed-phool": ["wedding", "engagement", "save-the-date", "reception"],
  "tuscan-vineyard": ["wedding", "engagement", "save-the-date", "reception"],
  "boho-pampas": ["wedding", "engagement", "mehendi", "save-the-date", "reception"],
  "bidri-raat": ["wedding", "engagement", "reception"],
  "stained-glass": ["wedding", "engagement", "save-the-date", "reception"],
  "chinoiserie-bagh": ["wedding", "engagement", "reception"],
  "nouveau-arch": ["wedding", "engagement", "save-the-date"],
  "safar-shaadi": ["wedding", "engagement", "save-the-date"],
  "jaago-gagar": ["sangeet", "mehendi"],
  "tilak-thaal": ["roka", "engagement"],
  "nalangu-vilayattu": ["wedding", "reception"],
  "sagai-anguthi": ["engagement", "roka"],
  "chandni-cocktail": ["sangeet", "reception"],
  "kathputli-sangeet": ["sangeet", "mehendi"],
  sehrabandi: ["wedding"],
  "laxmi-aagman": ["reception", "wedding"],
};

/**
 * Wedding themes from families that don't hold a roka, a north Indian custom: Muslim,
 * Christian, Parsi, south Indian and Bengali themes.
 */
const NO_ROKA: readonly SuiteId[] = [
  "noor-bagh",
  "sufi-raat",
  "char-bagh",
  "riad",
  "parsi-chalk",
  "kayal",
  "tanjore",
  "mysuru",
  "kalamkari",
  "temple-pond",
  "kovil-corridor",
  "arati-mandap",
  "hampi-ruins",
  "coorg-estate",
  "rajbari",
  "zamindar-bari",
  "pattachitra",
  "chai-bagan",
  "vazhai-mandap",
  "mughal-bagh",
  "kerala-mural",
  "kalyana-vazhai",
  "alpana-topor",
  "kalighat-pat",
  "cheriyal-talambralu",
  "axomiya-biya",
  "hyderabadi-nikah",
  "goa-azulejo",
  "kantha-silai",
  "tholu-bommalata",
];

/** The steps of the wedding journey a theme is painted for; none for an occasion's theme. */
export function weddingFit(suite: SuiteId): readonly JourneyId[] {
  if (SUITES[suite].occasions) return [];
  return (
    WEDDING_FIT[suite] ??
    WEDDING_JOURNEY.filter((step) => step !== "roka" || !NO_ROKA.includes(suite))
  );
}

/**
 * Whether a theme is painted for an occasion: wedding themes for the steps of the wedding
 * journey they suit, every other theme for its own occasions only.
 */
export function suiteSuits(suite: SuiteId, category: CategoryId): boolean {
  if (isWeddingJourney(category)) return weddingFit(suite).includes(category);
  return Boolean(SUITES[suite].occasions?.includes(category));
}

/** The occasion a theme opens with: its own, else the first step of the journey it suits. */
export function suiteHome(suite: SuiteId): CategoryId {
  return SUITES[suite].occasions?.[0] ?? weddingFit(suite)[0] ?? "wedding";
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
  if (category && !isWeddingJourney(category)) {
    // An occasion's own theme, else the plain card colours: never a wedding's
    return OCCASION_SUITES.find((id) => SUITES[id].occasions!.includes(category)) ?? "classic";
  }
  // On the wedding journey, only a theme painted for this step of it
  const fits = (id: SuiteId | undefined) => id && (!category || suiteSuits(id, category));
  if (input.tradition) {
    const match = SUITE_IDS.find((id) => SUITES[id].traditions.includes(input.tradition!));
    if (fits(match)) return match!;
  }
  const own = TEMPLATE_SUITES[input.templateId];
  return fits(own) ? own! : "rajwada-bagh";
}

type PageKind = "blessing" | "cover" | "family" | "reply" | FunctionId;

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
  "baby-shower": { art: "reception", mood: "day" },
  diwali: { art: "reception", mood: "night" },
  housewarming: { art: "reception", mood: "day" },
  puja: { art: "reception", mood: "dusk" },
  "thread-ceremony": { art: "reception", mood: "dawn" },
  annaprashan: { art: "reception", mood: "day" },
  christening: { art: "reception", mood: "day" },
  "prayer-meet": { art: "reception", mood: "dawn" },
  retirement: { art: "reception", mood: "dusk" },
  "farewell-party": { art: "reception", mood: "night" },
  "shop-opening": { art: "reception", mood: "day" },
  launch: { art: "reception", mood: "night" },
  "ganesh-chaturthi": { art: "reception", mood: "day" },
  navratri: { art: "reception", mood: "night" },
  janmashtami: { art: "reception", mood: "night" },
  onam: { art: "reception", mood: "day" },
  sankranti: { art: "reception", mood: "day" },
  lohri: { art: "reception", mood: "night" },
  eid: { art: "reception", mood: "dusk" },
  "naming-ceremony": { art: "reception", mood: "day" },
  holi: { art: "reception", mood: "day" },
  christmas: { art: "reception", mood: "day" },
  reunion: { art: "reception", mood: "dusk" },
  graduation: { art: "reception", mood: "day" },
  "gudi-padwa": { art: "reception", mood: "day" },
  baisakhi: { art: "reception", mood: "day" },
  bihu: { art: "reception", mood: "day" },
};

/**
 * Whether a page's painting has a god near its top, which must stay clear of the controls:
 * every blessing page, and the pages a theme lists.
 */
export function hasGodAtTop(suite: SuiteId, art: PageArt): boolean {
  return art === "blessing" || Boolean(SUITES[suite].gods?.includes(art));
}

/** Whether a theme opens with a god's own page before the cover. */
export function hasBlessingPage(suite: SuiteId): boolean {
  return Boolean(SUITES[suite].images.blessing);
}

/** Which painting and what light a page gets. */
export function pageLook(kind: PageKind): { art: PageArt; mood: Mood } {
  if (kind === "blessing") return { art: "blessing", mood: "dawn" };
  if (kind === "cover") return { art: "cover", mood: "dusk" };
  if (kind === "family") return { art: "family", mood: "day" };
  if (kind === "reply") return { art: "reply", mood: "night" };
  return FUNCTION_PAGES[kind];
}

/**
 * The JPEG copy of a painted theme's cover that link previews draw (next/og can't read
 * WebP; scripts/suite-previews.mjs makes it). Null for themes without a painted cover.
 */
export function suitePreview(suite: SuiteId): string | null {
  const cover = SUITES[suite].images.cover;
  return cover ? cover.replace(/[^/]+$/, "preview.jpg") : null;
}
