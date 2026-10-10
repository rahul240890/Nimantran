import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import {
  SUITES,
  isSceneTheme,
  suiteHome,
  suiteSuits,
  type PageArt,
  type SuiteId,
} from "@/lib/suites/catalog";
import { hasScene } from "@/lib/suites/scene";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/templates/ids";
import { TRADITIONS } from "@/lib/traditions/catalog";
import type { TraditionId } from "@/lib/traditions/schema";
import type { WeddingKind } from "./ids";
import { mixDesigns } from "./photos";

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

/** The occasion's painted tile, when it has one. */
export const occasionTile = (id: string): string | null =>
  TILES[id] ? `/occasions/${TILES[id]}.webp` : null;

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
  live(
    "annaprashan",
    { suite: "annaprashan", page: "cover" },
    ["mukhe bhaat", "choroonu", "first rice", "rice ceremony", "annaprasana"],
    "family",
  ),
  live(
    "christening",
    { suite: "christening-lilies", page: "cover" },
    ["baptism", "holy communion", "church"],
    "family",
  ),
  live(
    "naming-ceremony",
    { suite: "naamkaran-chanda", page: "cover" },
    ["barsa", "namkaran", "cradle ceremony", "naamkaran"],
    "family",
  ),
  soon("mundan", "family", { en: "Mundan", hi: "मुंडन" }, ["chudakarana", "first haircut"]),
  live(
    "housewarming",
    { suite: "new-home-modern", page: "cover" },
    ["griha pravesh", "vastu", "new home"],
    "family",
  ),
  live(
    "puja",
    { suite: "satyanarayan", page: "cover" },
    ["satyanarayan", "katha", "havan", "jagran", "mata ki chowki", "pooja"],
    "family",
  ),
  live(
    "thread-ceremony",
    { suite: "upanayana", page: "cover" },
    ["janeu", "upanayan", "munj"],
    "family",
  ),
  live(
    "prayer-meet",
    { suite: "shraddhanjali", page: "cover" },
    ["shraddhanjali", "chautha", "uthamna", "besna", "memorial", "condolence", "remembrance"],
    "family",
  ),

  soon("fresher-party", "parties", { en: "Fresher party", hi: "फ्रेशर पार्टी" }, [
    "college",
    "freshers",
  ]),
  soon("welcome-party", "parties", { en: "Welcome party", hi: "वेलकम पार्टी" }, ["welcome"]),
  live(
    "farewell-party",
    { suite: "farewell-night", page: "cover" },
    ["farewell", "send off"],
    "parties",
  ),
  live(
    "graduation",
    { suite: "graduation-topi", page: "cover" },
    ["convocation", "graduation party", "degree", "passing out"],
    "parties",
  ),
  soon("kitty-party", "parties", { en: "Kitty party", hi: "किटी पार्टी" }, ["kitty", "ladies"]),
  live(
    "reunion",
    { suite: "reunion-yaarana", page: "cover" },
    ["alumni", "get together", "batch", "school friends", "college friends"],
    "parties",
  ),
  live(
    "retirement",
    { suite: "retirement-garden", page: "cover" },
    ["retirement party"],
    "parties",
  ),
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
  live(
    "janmashtami",
    { suite: "janmashtami", page: "cover" },
    ["gokulashtami", "krishna janmashtami", "dahi handi", "kanha"],
    "festivals",
  ),
  live(
    "onam",
    { suite: "onam-pookalam", page: "cover" },
    ["sadhya", "pookalam", "thiruvonam"],
    "festivals",
  ),
  live(
    "sankranti",
    { suite: "uttarayan-kites", page: "cover" },
    ["uttarayan", "makar sankranti", "pongal", "kite festival", "bhogi", "khichdi"],
    "festivals",
  ),
  live(
    "lohri",
    { suite: "lohri-bonfire", page: "cover" },
    ["first lohri", "bonfire", "maghi"],
    "festivals",
  ),
  live(
    "gudi-padwa",
    { suite: "gudi-padwa", page: "cover" },
    [
      "ugadi",
      "yugadi",
      "padwa",
      "marathi new year",
      "telugu new year",
      "kannada new year",
      "cheti chand",
    ],
    "festivals",
  ),
  live(
    "baisakhi",
    { suite: "baisakhi-mela", page: "cover" },
    ["vaisakhi", "harvest", "bhangra", "khalsa"],
    "festivals",
  ),
  live(
    "bihu",
    { suite: "bihu-utsav", page: "cover" },
    ["rongali bihu", "bohag bihu", "assamese new year", "magh bihu"],
    "festivals",
  ),
  live(
    "holi",
    { suite: "holi-rang", page: "cover" },
    ["rang", "colours", "holi milan", "dhulandi", "rangwali"],
    "festivals",
  ),
  live(
    "navratri",
    { suite: "durga-pujo", page: "cover" },
    ["garba", "dandiya", "durga puja", "pujo", "dussehra"],
    "festivals",
  ),
  live(
    "ganesh-chaturthi",
    { suite: "ganesh-utsav", page: "cover" },
    ["ganpati", "ganeshotsav", "vinayaka chaturthi", "bappa"],
    "festivals",
  ),
  live(
    "eid",
    { suite: "iftar-dawat", page: "cover" },
    ["iftar", "eid milan", "ramadan", "ramzan", "iftar party", "dawat"],
    "festivals",
  ),
  live(
    "christmas",
    { suite: "christmas-tara", page: "cover" },
    ["xmas", "carols", "santa"],
    "festivals",
  ),
  live(
    "raksha-bandhan",
    { suite: "rakhi-dor", page: "cover" },
    ["rakhi", "rakshabandhan", "rakhri", "bhai behen", "sister", "brother", "bhai dooj"],
    "festivals",
  ),
  live(
    "karva-chauth",
    { suite: "karva-chandni", page: "cover" },
    ["karwa chauth", "karva chouth", "karwachauth", "vrat", "moon", "chaand"],
    "festivals",
  ),

  live(
    "shop-opening",
    { suite: "grand-opening", page: "cover" },
    ["inauguration", "opening", "udghatan", "office opening", "restaurant opening"],
    "business",
  ),
  live(
    "launch",
    { suite: "launch-stage", page: "cover" },
    ["product launch", "book launch", "office event", "conference"],
    "business",
  ),
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
      "baithak-bagh",
      "gajra-ghera",
      "phool-ladi",
      "shevanti-haldi",
      "choodi-jhalar",
      "ghungroo-raat",
      "kachnar",
      "kesar-kyari",
      "deodar-sanjh",
      "tota-bagh",
      "aatishbaazi",
      "jal-mahal",
      "gulmohar-rasta",
      "diya-dhara",
      "genda-barsaat",
      "saawan-bundein",
      "shamiana-raat",
      "hans-jheel",
      "aipan-kumaon",
      "sohrai-khovar",
      "kar-e-kashmir",
      "kundan-jhumka",
      "gond-vriksh",
      "kangra-megh",
      "chikankari-awadh",
      "chibi-jodi",
      "mor-kamal",
      "madhubani-machhli",
      "doli-vidaai",
      "kadamb-krishna",
      "siya-ram-mala",
      "kailash-kamal",
      "kamal-sarovar",
      "gulmohar",
      "vat-vriksha",
      "kashi-ghat",
      "rishikesh-ganga",
      "baraat-band",
      "chooda-ceremony",
      "chinar-dal",
      "char-bagh",
      "rajwada-bagh",
      "kashi",
      "chinar",
      "tulip-kashmir",
      "rhododendron-himalaya",
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
      "phool-ladi",
      "shevanti-haldi",
      "choodi-jhalar",
      "ghungroo-raat",
      "tota-bagh",
      "genda-barsaat",
      "saawan-bundein",
      "pithora-ghoda",
      "patola-bandh",
      "moti-bharat",
      "kutch-rang",
      "pichwai-gaay",
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
      "baithak-bagh",
      "phool-ladi",
      "neeli-pottery",
      "shevanti-haldi",
      "choodi-jhalar",
      "ghungroo-raat",
      "neeli-nagri",
      "aatishbaazi",
      "jhoomar-mahal",
      "jal-mahal",
      "genda-barsaat",
      "saawan-bundein",
      "phad-gatha",
      "mandana-lal",
      "gota-patti",
      "kathputli-sangeet",
      "rajwada-haathi",
      "pichwai-gaay",
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
    suites: [
      "neelgulmohar",
      "shevanti-haldi",
      "konkan-kinara",
      "ganesh-genda",
      "warli-vivah",
      "antarpat-mangal",
      "pune-wada",
      "peshwai-wada",
    ],
    cards: ["paithani"],
    keywords: ["maharashtrian", "lagna", "mumbai", "pune"],
  },
  bengali: {
    id: "bengali",
    ...pack("bengali"),
    art: { suite: "rajbari", page: "cover" },
    suites: [
      "shiuli-bhor",
      "bishnupur-terracotta",
      "pipli-chhata",
      "kalighat-pat",
      "axomiya-biya",
      "kantha-silai",
      "alpana-topor",
      "zamindar-bari",
      "rajbari",
      "pattachitra",
      "chai-bagan",
      "orchid-meghalaya",
    ],
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
      "gajra-ghera",
      "champa-baag",
      "malli-mazhai",
      "kettuvallam-raat",
      "kanjivaram-pattu",
      "kasavu-sona",
      "urli-pookal",
      "ganjifa-patte",
      "cheriyal-talambralu",
      "tholu-bommalata",
      "nalangu-vilayattu",
      "kalyana-vazhai",
      "kerala-mural",
      "vazhai-mandap",
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
    suites: [
      "shevanti-haldi",
      "choodi-jhalar",
      "ghungroo-raat",
      "tota-bagh",
      "sarson-khet",
      "genda-barsaat",
      "shamiana-raat",
      "jaago-gagar",
      "phulkari-lavan",
      "punjab-haveli",
      "phulkari-haveli",
    ],
    cards: ["phulkari"],
    keywords: ["sikh", "anand karaj", "punjab", "sardar"],
  },
  muslim: {
    id: "muslim",
    tradition: null,
    nativeName: { text: "نکاح", lang: "ur" },
    art: { suite: "noor-bagh", page: "cover" },
    suites: [
      "moti-lari",
      "anar-bagh",
      "choodi-jhalar",
      "fawwara-bagh",
      "jhoomar-mahal",
      "kesar-kyari",
      "saawan-bundein",
      "shamiana-raat",
      "zardozi-mehfil",
      "kar-e-kashmir",
      "hyderabadi-nikah",
      "chikankari-awadh",
      "bidri-raat",
      "mughal-bagh",
      "char-bagh",
      "noor-bagh",
      "sufi-raat",
      "riad",
    ],
    cards: ["emerald"],
    keywords: ["nikah", "walima", "shaadi", "islamic", "moroccan"],
  },
  modern: {
    id: "modern",
    ...pack("modern"),
    nativeName: null,
    art: { suite: "rajwada-bagh", page: "reception" },
    suites: [
      "baithak-bagh",
      "do-kone",
      "gajra-ghera",
      "bulbul-jaal",
      "baganbilas",
      "moti-lari",
      "safeda-patti",
      "zaitoon-mala",
      "neelgulmohar",
      "neeli-pottery",
      "kachnar",
      "toota-taara",
      "megh-jharna",
      "jhoomar-mahal",
      "aatishbaazi",
      "wedding-bells",
      "gulmohar-rasta",
      "hans-jheel",
      "shamiana-raat",
      "polaroid-lights",
      "dak-tikat",
      "kadhai-hoop",
      "locket-jodi",
      "syahi-bamboo",
      "lace-ivory",
      "origami-saaras",
      "nimbu-amalfi",
      "rail-yatra",
      "kundan-jhumka",
      "goa-azulejo",
      "pressed-phool",
      "tuscan-vineyard",
      "boho-pampas",
      "winter-pine",
      "bidri-raat",
      "stained-glass",
      "chinoiserie-bagh",
      "nouveau-arch",
      "safar-shaadi",
      "chibi-jodi",
      "safed-gulaab",
      "line-art-gold",
      "samudra-sanjh",
      "kaagaz-chaand",
      "bagh-reception",
      "wisteria-tunnel",
      "prem-vriksh",
      "peony-blush",
      "hydrangea-blue",
      "lavender-field",
      "magnolia-moon",
      "phool-chandelier",
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

/** The designs a wedding kind offers: its painted themes and its 3D cards, mixed. */
export function kindDesigns(kind: WeddingKind): GalleryDesign[] {
  const entry = WEDDING_KIND_ENTRIES[kind];
  return mixDesigns(
    withScenes([
      // A kind's painted theme pairs with the kind's own card (Shahi Savari with Bandhani)
      ...entry.suites
        .filter((suite) => suite !== "classic" && suiteSuits(suite, "wedding"))
        .map((suite) => ({
          ...paintedDesign(suite),
          template: entry.cards[0] ?? paintedDesign(suite).template,
        })),
      ...entry.cards.map(cardDesign),
    ]),
  );
}

/** Painted themes with pictures, in the order the gallery shows them. */
export const PAINTED_SUITES: readonly SuiteId[] = (Object.keys(SUITES) as SuiteId[]).filter(
  (id) => SUITES[id].images.cover,
);

/** Every design for an occasion: the painted themes made for it and the cards that suit it, mixed. */
export function occasionDesigns(category: CategoryId): GalleryDesign[] {
  return mixDesigns(
    withScenes([
      ...PAINTED_SUITES.filter((suite) => suiteSuits(suite, category)).map(paintedDesign),
      ...CATEGORIES[category].templates.map(cardDesign),
    ]),
  );
}

/** The occasion a theme opens in the editor: its own, else the wedding step it suits. */
export function suiteOccasion(suite: SuiteId): CategoryId {
  return suiteHome(suite);
}

/** Every design in the gallery, each kind spread through the list. */
export function allDesigns(): GalleryDesign[] {
  return mixDesigns(
    withScenes([...PAINTED_SUITES.map(paintedDesign), ...TEMPLATE_IDS.map(cardDesign)]),
  );
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
