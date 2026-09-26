import type { FontRole, MotifId, SlotId, StockRole } from "@/lib/templates/schema";

/*
 * Copy for the /templates review page, and the English labels for template slots and
 * parts that the editor (Step 6) will reuse. Moves into next-intl in Step 12.
 */

export const slotLabels: Record<SlotId, string> = {
  doorLeft: "Left door",
  doorRight: "Right door",
  blessing: "Blessing",
  families: "Families",
  first: "First name",
  joiner: "Between the names",
  second: "Second name",
  line: "Invitation line",
  date: "Date and time",
  venue: "Venue",
};

export const stockLabels: Record<StockRole, string> = {
  paper: "Paper",
  ink: "Ink",
  inkMuted: "Soft ink",
  gold: "Foil",
  goldText: "Foil lettering",
  accent: "Second ornament",
  accentText: "Accent lettering",
  back: "Door lining",
};

export const motifLabels: Record<MotifId, string> = {
  mandala: "Marigold mandala",
  roses: "Climbing roses and a rose wreath",
  palace: "Mughal arch with jaali lattice",
  scroll: "Scroll rods, paisleys and a lacquer seal",
  monogram: "Hairline frame and large initials",
  kasavu: "Kasavu borders and nilavilakku lamps",
  jharokha: "Jharokha arches and meenakari rosettes",
  peacock: "Paithani temple border and peacock-feather fans",
  bandhani: "Bandhani dots and mirror-work",
  alpona: "Laal paar border and an alpona lotus",
  gopuram: "Temple gopurams, kolam and brass lamps",
  phulkari: "Phulkari diamonds, stars and chope borders",
};

export const fontLabels: Record<FontRole, string> = {
  display: "Rozha One",
  label: "Tenor Sans",
  sans: "Karla",
};

export const formatLabels = { "gate-fold": "Gate fold" } as const;

export const templatesReview = {
  metaTitle: "Invitation templates",
  metaDescription: "Every invitation design and the schema behind them.",
  eyebrow: "Step 5 · Template system",
  title: "Twelve designs, one schema",
  intro:
    "Each design is data: a scene, card stock colours, type, a raga and the words a host fills in. Pick one to open it in 3D and see what it is made of.",
  preview: "Invitation preview",
  choose: "Choose a design",
  design: "Design",
  wording: "Wording",
  madeOf: "What this design is made of",
  scene: "Scene",
  format: "Card format",
  ornaments: "Ornaments",
  effects: "Around the card",
  petals: "Petals",
  lanterns: "Sky lanterns",
  none: "None",
  colours: "Card stock",
  type: "Type",
  typeRoles: { names: "Names and venue", labels: "Small lines", body: "Invitation line" },
  italic: "italic",
  capitals: "capitals",
  music: "Music",
  tempo: (bpm: number) => `${bpm} beats a minute`,
  slots: "Words the host fills in",
  slotHeaders: { slot: "Slot", sample: "Sample", limit: "Up to" },
  required: "Required",
  empty: "Left empty",
  characters: (count: number) => `${count} characters`,
  footer: "Templates in src/lib/templates, ornaments in src/components/invitation/art",
} as const;
