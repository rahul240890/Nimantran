import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { SUITES, isSceneTheme, suiteSuits, type PageArt, type SuiteId } from "@/lib/suites/catalog";
import { hasScene } from "@/lib/suites/scene";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/templates/ids";
import { TRADITIONS } from "@/lib/traditions/catalog";
import type { TraditionId } from "@/lib/traditions/schema";
import type { WeddingKind } from "./ids";

export { WEDDING_KINDS, isWeddingKind, type WeddingKind } from "./ids";

/*
 * The gallery (Step 12g): what a host browses before the editor. Occasions come first,
 * a wedding then opens its kinds (Gujarati, Bengali…), and each kind shows only the designs
 * made for it. Plain data, so a master admin can add occasions, kinds and designs later
 * without code. An occasion is live once it has a category (its functions and wording);
 * the rest are listed so hosts see what is coming.
 */

export const OCCASION_SECTIONS = ["wedding", "family", "parties", "festivals", "business"] as const;
export type OccasionSection = (typeof OCCASION_SECTIONS)[number];

export type Occasion = {
  id: string;
  section: OccasionSection;
  /** The editor's category; null until the occasion's words and events exist. */
  category: CategoryId | null;
  names: { en: string; hi: string };
  /** A painting for its tile: a theme and one of its pages. */
  art: { suite: SuiteId; page: PageArt } | null;
  /** A painting made for the tile itself, in public/occasions, used before the theme's page. */
  tile: string | null;
  /** Other words people search with, in any language. */
  keywords: readonly string[];
};

const live = (
  id: CategoryId,
  art: Occasion["art"],
  keywords: readonly string[] = [],
  section: OccasionSection = "wedding",
): Occasion => ({
  id,
  section,
  category: id,
  names: { en: CATEGORIES[id].names.en, hi: CATEGORIES[id].names.hi },
  art,
  tile: null,
  keywords: [...Object.values(CATEGORIES[id].names), ...keywords],
});

const soon = (
  id: string,
  section: OccasionSection,
  names: Occasion["names"],
  keywords: readonly string[] = [],
): Occasion => ({ id, section, category: null, names, art: null, tile: null, keywords });

/*
 * Tile paintings made for occasions, in public/occasions. One painting can serve a few
 * occasions (the baby's swing for a baby shower and a naming ceremony).
 */
const TILES: Record<string, string> = {
  wedding: "wedding",
  engagement: "engagement",
  haldi: "haldi",
  mehendi: "mehendi",
  sangeet: "sangeet",
  anniversary: "anniversary",
  birthday: "birthday",
  "baby-shower": "baby",
  "naming-ceremony": "baby",
  housewarming: "housewarming",
  party: "party",
  diwali: "festival",
  "shop-opening": "business",
};

const withTile = (occasion: Occasion): Occasion =>
  TILES[occasion.id] ? { ...occasion, tile: `/occasions/${TILES[occasion.id]}.webp` } : occasion;

export const OCCASIONS: readonly Occasion[] = [
  live("wedding", { suite: "rajwada-bagh", page: "wedding" }, [
    "shaadi",
    "vivah",
    "lagna",
    "biye",
    "kankotri",
    "marriage",
    "shadi",
  ]),
  live("engagement", { suite: "shahi-savari", page: "reception" }, ["sagai", "ring ceremony"]),
  live("roka", { suite: "phulkari-haveli", page: "family" }, ["tilak", "shagun"]),
  live("save-the-date", { suite: "rajwada-bagh", page: "cover" }, ["std"]),
  live("haldi", { suite: "kayal", page: "haldi" }, ["pithi", "manjha", "gaye holud"]),
  live("mehendi", { suite: "noor-bagh", page: "mehendi" }, ["mehndi", "henna"]),
  live("sangeet", { suite: "rajbari", page: "sangeet" }, ["garba", "dandiya", "ladies sangeet"]),
  live("reception", { suite: "peshwai-wada", page: "reception" }, ["party", "dinner"]),

  live(
    "birthday",
    { suite: "gubbara", page: "cover" },
    ["janamdin", "bday", "first birthday", "happy birthday", "kids party"],
    "family",
  ),
  live(
    "anniversary",
    { suite: "saath", page: "cover" },
    ["wedding anniversary", "silver jubilee", "golden jubilee", "25th", "50th"],
    "family",
  ),
  live(
    "baby-shower",
    { suite: "palna", page: "cover" },
    ["godh bharai", "seemantham", "valaikappu", "shrimant", "dohale jevan", "baby"],
    "family",
  ),
  soon("naming-ceremony", "family", { en: "Naming ceremony", hi: "नामकरण" }, [
    "naamkaran",
    "barsa",
    "cradle ceremony",
  ]),
  soon("mundan", "family", { en: "Mundan", hi: "मुंडन" }, ["chudakarana", "first haircut"]),
  soon("housewarming", "family", { en: "Housewarming", hi: "गृह प्रवेश" }, [
    "griha pravesh",
    "vastu",
    "new home",
  ]),
  soon("puja", "family", { en: "Puja and katha", hi: "पूजा और कथा" }, [
    "satyanarayan",
    "katha",
    "havan",
    "jagran",
  ]),
  soon("thread-ceremony", "family", { en: "Thread ceremony", hi: "जनेऊ संस्कार" }, [
    "janeu",
    "upanayan",
    "munj",
  ]),

  soon("fresher-party", "parties", { en: "Fresher party", hi: "फ्रेशर पार्टी" }, [
    "college",
    "freshers",
  ]),
  soon("welcome-party", "parties", { en: "Welcome party", hi: "वेलकम पार्टी" }, ["welcome"]),
  soon("farewell-party", "parties", { en: "Farewell party", hi: "फेयरवेल पार्टी" }, [
    "farewell",
    "send off",
  ]),
  soon("kitty-party", "parties", { en: "Kitty party", hi: "किटी पार्टी" }, ["kitty", "ladies"]),
  soon("reunion", "parties", { en: "Reunion", hi: "रीयूनियन" }, ["alumni", "get together"]),
  soon("retirement", "parties", { en: "Retirement", hi: "सेवानिवृत्ति" }, ["retirement party"]),
  live(
    "party",
    { suite: "rooftop", page: "cover" },
    ["cocktail", "rooftop", "get together", "dinner party", "new year"],
    "parties",
  ),

  live(
    "diwali",
    { suite: "deepotsav", page: "cover" },
    ["deepavali", "lakshmi puja", "diwali party", "diwali milan", "deepawali"],
    "festivals",
  ),
  soon("holi", "festivals", { en: "Holi", hi: "होली" }, ["rang", "colours"]),
  soon("navratri", "festivals", { en: "Navratri and garba", hi: "नवरात्रि और गरबा" }, [
    "garba",
    "dandiya",
    "durga puja",
  ]),
  soon("ganesh-chaturthi", "festivals", { en: "Ganesh Chaturthi", hi: "गणेश चतुर्थी" }, [
    "ganpati",
  ]),
  soon("eid", "festivals", { en: "Eid", hi: "ईद" }, ["iftar", "eid milan"]),
  soon("christmas", "festivals", { en: "Christmas", hi: "क्रिसमस" }, ["xmas", "new year"]),

  soon("shop-opening", "business", { en: "Shop opening", hi: "दुकान का उद्घाटन" }, [
    "inauguration",
    "opening",
    "udghatan",
  ]),
  soon("launch", "business", { en: "Launch event", hi: "लॉन्च इवेंट" }, ["product launch"]),
  soon("office-party", "business", { en: "Office party", hi: "ऑफ़िस पार्टी" }, [
    "corporate",
    "team",
  ]),
].map(withTile);

export function occasionById(id: string): Occasion | undefined {
  return OCCASIONS.find((occasion) => occasion.id === id);
}

/*
 * A design in the gallery: a theme for the event pages with its matching card, or, for the
 * card-colour theme, one of the 3D card designs on its own.
 */
export type GalleryDesign = {
  id: string;
  suite: SuiteId;
  template: TemplateId;
  /** "scene": the theme as one painting (scene.ts); missing, its story of pages. */
  format?: "scene";
};

export function paintedDesign(suite: SuiteId): GalleryDesign {
  return { id: suite, suite, template: SUITES[suite].template ?? "marigold" };
}

/** A theme as a Scene: its photos, names and every celebration on one painting. */
export function sceneDesign(suite: SuiteId): GalleryDesign {
  return { ...paintedDesign(suite), id: `${suite}-scene`, format: "scene" };
}

/**
 * Each painted design, with its Scene first where the theme has one. A Scene theme has
 * no pages of its own, so it is listed as its Scene alone.
 */
function withScenes(designs: GalleryDesign[]): GalleryDesign[] {
  const scenes = designs
    .filter((design) => design.suite !== "classic" && hasScene(design.suite))
    .map((design) => ({ ...design, id: `${design.suite}-scene`, format: "scene" as const }));
  return [...scenes, ...designs.filter((design) => !isSceneTheme(design.suite))];
}

export function cardDesign(template: TemplateId): GalleryDesign {
  return { id: `card-${template}`, suite: "classic", template };
}

export type WeddingKindEntry = {
  id: WeddingKind;
  /** The tradition pack that gives its ceremony names, blessing and language, if one exists. */
  tradition: TraditionId | null;
  /** Its name in its own script, for the tile. */
  nativeName: { text: string; lang: string } | null;
  /** The painting on its tile. */
  art: { suite: SuiteId; page: PageArt };
  suites: readonly SuiteId[];
  cards: readonly TemplateId[];
  keywords: readonly string[];
};

const pack = (id: TraditionId) => ({
  tradition: id,
  nativeName: { text: TRADITIONS[id].nativeName, lang: TRADITIONS[id].language },
});

export const WEDDING_KIND_ENTRIES: Record<WeddingKind, WeddingKindEntry> = {
  "north-indian": {
    id: "north-indian",
    ...pack("north-hindu"),
    art: { suite: "rajwada-bagh", page: "cover" },
    suites: [
      "kashi-ghat",
      "rishikesh-ganga",
      "baraat-band",
      "roka-shagun",
      "chooda-ceremony",
      "chinar-dal",
      "char-bagh",
      "rajwada-bagh",
      "kashi",
      "chinar",
      "gulaab",
      "ivory-arch",
    ],
    cards: ["marigold", "scroll"],
    keywords: ["hindi", "up", "delhi", "bihar", "punjabi hindu", "kashmiri", "kashmir"],
  },
  gujarati: {
    id: "gujarati",
    ...pack("gujarati"),
    art: { suite: "kutch-toran", page: "sangeet" },
    suites: [
      "kutch-bhunga",
      "white-rann",
      "mameru-bandhani",
      "sindhi-ajrak",
      "kutch-toran",
      "shahi-savari",
      "pichwai",
    ],
    cards: ["bandhani"],
    keywords: ["gujrati", "kutch", "kathiawadi", "patel", "kankotri", "hast melap"],
  },
  rajasthani: {
    id: "rajasthani",
    ...pack("rajasthani"),
    art: { suite: "shahi-savari", page: "cover" },
    suites: [
      "udaipur-lake",
      "pink-haveli",
      "jaisalmer-dunes",
      "fort-night",
      "sheesh-mahal",
      "shahi-savari",
      "pichwai",
      "neel",
      "mitti",
    ],
    cards: ["rangmahal", "scroll"],
    keywords: ["marwari", "rajput", "jaipur", "udaipur"],
  },
  marathi: {
    id: "marathi",
    ...pack("marathi"),
    art: { suite: "peshwai-wada", page: "cover" },
    suites: ["pune-wada", "peshwai-wada"],
    cards: ["paithani"],
    keywords: ["maharashtrian", "lagna", "mumbai", "pune"],
  },
  bengali: {
    id: "bengali",
    ...pack("bengali"),
    art: { suite: "rajbari", page: "cover" },
    suites: ["zamindar-bari", "rajbari", "pattachitra", "chai-bagan"],
    cards: ["alpona"],
    keywords: [
      "bangali",
      "biye",
      "kolkata",
      "gaye holud",
      "odia",
      "oriya",
      "odisha",
      "assamese",
      "assam",
    ],
  },
  tamil: {
    id: "tamil",
    ...pack("tamil"),
    art: { suite: "kayal", page: "cover" },
    suites: [
      "temple-pond",
      "kovil-corridor",
      "arati-mandap",
      "hampi-ruins",
      "coorg-estate",
      "kayal",
      "tanjore",
      "mysuru",
      "kalamkari",
    ],
    cards: ["gopuram", "kasavu"],
    keywords: [
      "south indian",
      "chennai",
      "kalyanam",
      "kerala",
      "malayali",
      "kannada",
      "karnataka",
      "telugu",
      "andhra",
      "telangana",
    ],
  },
  punjabi: {
    id: "punjabi",
    tradition: null,
    nativeName: { text: "ਪੰਜਾਬੀ", lang: "pa" },
    art: { suite: "phulkari-haveli", page: "cover" },
    suites: ["punjab-haveli", "phulkari-haveli"],
    cards: ["phulkari"],
    keywords: ["sikh", "anand karaj", "punjab", "sardar"],
  },
  muslim: {
    id: "muslim",
    tradition: null,
    nativeName: { text: "نکاح", lang: "ur" },
    art: { suite: "noor-bagh", page: "cover" },
    suites: ["char-bagh", "noor-bagh", "sufi-raat", "riad"],
    cards: ["emerald"],
    keywords: ["nikah", "walima", "shaadi", "islamic", "moroccan"],
  },
  modern: {
    id: "modern",
    ...pack("modern"),
    nativeName: null,
    art: { suite: "rajwada-bagh", page: "reception" },
    suites: [
      "ivory-arch",
      "gulaab",
      "deco-noir",
      "taara",
      "kaagaz",
      "sagar",
      "chapel",
      "sakura",
      "vigna",
      "himani",
      "van",
      "riad",
      "mitti",
      "classic",
    ],
    cards: ["monogram", "rose", "marigold"],
    keywords: [
      "simple",
      "minimal",
      "court marriage",
      "english",
      "christian",
      "destination",
      "cherry blossom",
      "vineyard",
      "winter",
      "snow",
      "forest",
      "moroccan",
    ],
  },
};

/** The designs a wedding kind offers: its painted themes, then its 3D cards. */
export function kindDesigns(kind: WeddingKind): GalleryDesign[] {
  const entry = WEDDING_KIND_ENTRIES[kind];
  return withScenes([
    // A kind's painted theme pairs with the kind's own card (Shahi Savari with Bandhani)
    ...entry.suites
      .filter((suite) => suite !== "classic")
      .map((suite) => ({
        ...paintedDesign(suite),
        template: entry.cards[0] ?? paintedDesign(suite).template,
      })),
    ...entry.cards.map(cardDesign),
  ]);
}

/** Painted themes with pictures, in the order the gallery shows them. */
export const PAINTED_SUITES: readonly SuiteId[] = (Object.keys(SUITES) as SuiteId[]).filter(
  (id) => SUITES[id].images.cover,
);

/** Every design for an occasion: the painted themes made for it, then the cards that suit it. */
export function occasionDesigns(category: CategoryId): GalleryDesign[] {
  return withScenes([
    ...PAINTED_SUITES.filter((suite) => suiteSuits(suite, category)).map(paintedDesign),
    ...CATEGORIES[category].templates.map(cardDesign),
  ]);
}

/** The occasion a theme opens in the editor: its own, else a wedding. */
export function suiteOccasion(suite: SuiteId): CategoryId {
  return SUITES[suite].occasions?.[0] ?? "wedding";
}

/** Every design in the gallery, painted first. */
export function allDesigns(): GalleryDesign[] {
  return withScenes([...PAINTED_SUITES.map(paintedDesign), ...TEMPLATE_IDS.map(cardDesign)]);
}

/** Where "Use this design" takes the host: the editor, set up for this choice. */
export function designHref(
  design: GalleryDesign,
  context: { category: CategoryId; kind?: WeddingKind | null },
): string {
  const params = new URLSearchParams({ category: context.category });
  const tradition = context.kind ? WEDDING_KIND_ENTRIES[context.kind].tradition : null;
  if (tradition) params.set("tradition", tradition);
  params.set("suite", design.suite);
  params.set("template", design.template);
  if (design.format) params.set("format", design.format);
  return `/create?${params.toString()}`;
}

/** The painting for a theme's page, or null for the card-colour theme. */
export function suiteImage(suite: SuiteId, page: PageArt = "cover"): string | null {
  return SUITES[suite].images[page] ?? null;
}
