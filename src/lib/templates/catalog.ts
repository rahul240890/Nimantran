import type { StockRole, Template, TemplateId, TypeStyle } from "./schema";

/*
 * The six launch templates. Plain data in the shape of templateSchema, so Step 8 can seed
 * the database from this file and later templates can arrive without code changes.
 * Sample wording is English; hosts replace it in the editor (Step 6).
 */

/** Stock for a launch design that has its own token set (tpl-<name>-…). */
function designColours(name: string, accent: string): Record<StockRole, string> {
  return {
    paper: `tpl-${name}-paper`,
    ink: `tpl-${name}-ink`,
    inkMuted: `tpl-${name}-ink`,
    gold: `tpl-${name}-ornament`,
    goldText: `tpl-${name}-accent`,
    accent,
    accentText: `tpl-${name}-accent`,
    back: `tpl-${name}-back`,
  };
}

const type = (
  font: TypeStyle["font"],
  style: Partial<Omit<TypeStyle, "font">> = {},
): TypeStyle => ({
  font,
  italic: false,
  uppercase: false,
  tracking: 0,
  scale: 1,
  ...style,
});

const labels = type("label", { uppercase: true, tracking: 0.3 });
const italicBody = type("sans", { italic: true });

export const TEMPLATES: Record<TemplateId, Template> = {
  marigold: {
    id: "marigold",
    name: "Marigold Gate",
    description: "Gilded gates that part on a marigold mandala, with sky lanterns and Raag Yaman.",
    occasion: "wedding",
    scene: {
      format: "gate-fold",
      motif: "mandala",
      petals: { colours: ["marigold", "card-accent", "marigold-strong", "rose"], size: 1 },
      lanterns: true,
    },
    colours: {
      paper: "card-ivory",
      ink: "card-ink",
      inkMuted: "card-ink-muted",
      gold: "card-gold",
      goldText: "card-gold-text",
      accent: "card-accent",
      accentText: "card-accent-text",
      back: "card-back",
    },
    fonts: { names: type("display"), labels, body: italicBody },
    music: { raga: "yaman" },
    slots: [
      { id: "doorLeft", sample: "Shubh" },
      { id: "doorRight", sample: "Vivah" },
      { id: "blessing", sample: "" },
      { id: "families", sample: "Together with their families" },
      { id: "first", sample: "Aarav" },
      { id: "joiner", sample: "&" },
      { id: "second", sample: "Meera" },
      { id: "line", sample: "invite you to celebrate their wedding" },
      { id: "date", sample: "Saturday, 12 December 2026" },
      { id: "venue", sample: "Pichola Lakeside Gardens, Udaipur" },
    ],
  },
  rose: {
    id: "rose",
    name: "Rose Garden",
    description: "Climbing roses on blush stock, a rose wreath on the gates, and Raag Khamaj.",
    occasion: "wedding",
    scene: {
      format: "gate-fold",
      motif: "roses",
      petals: {
        colours: ["tpl-rose-ornament", "tpl-rose-accent", "rose", "petal-blush"],
        size: 1.1,
      },
      lanterns: false,
    },
    colours: designColours("rose", "tpl-rose-leaf"),
    fonts: {
      names: type("display", { italic: true, scale: 1.04 }),
      labels,
      body: italicBody,
    },
    music: { raga: "khamaj" },
    slots: [
      { id: "doorLeft", sample: "With" },
      { id: "doorRight", sample: "Love" },
      { id: "blessing", sample: "" },
      { id: "families", sample: "With joy in their hearts" },
      { id: "first", sample: "Rohan" },
      { id: "joiner", sample: "and" },
      { id: "second", sample: "Isha" },
      { id: "line", sample: "would love you to join them as they begin their life together" },
      { id: "date", sample: "Sunday, 14 February 2027" },
      { id: "venue", sample: "The Rose Terrace, Bengaluru" },
    ],
  },
  emerald: {
    id: "emerald",
    name: "Emerald Palace",
    description:
      "Palace doors with a jaali arch on deep emerald, jasmine, lanterns and Raag Bihag.",
    occasion: "wedding",
    scene: {
      format: "gate-fold",
      motif: "palace",
      petals: {
        colours: ["petal-jasmine", "tpl-emerald-accent", "petal-jasmine"],
        size: 0.75,
      },
      lanterns: true,
    },
    colours: designColours("emerald", "tpl-emerald-ruby"),
    fonts: { names: type("display"), labels: { ...labels, tracking: 0.22 }, body: italicBody },
    music: { raga: "bihag" },
    slots: [
      { id: "doorLeft", sample: "The" },
      { id: "doorRight", sample: "Wedding" },
      { id: "blessing", sample: "" },
      { id: "families", sample: "The Reddy and Rao families" },
      { id: "first", sample: "Kabir" },
      { id: "joiner", sample: "&" },
      { id: "second", sample: "Zoya" },
      { id: "line", sample: "request the honour of your presence at their wedding" },
      { id: "date", sample: "Friday, 22 January 2027" },
      { id: "venue", sample: "Moti Mahal Lawns, Hyderabad" },
    ],
  },
  scroll: {
    id: "scroll",
    name: "Royal Scroll",
    description: "A parchment scroll on carved rods, sealed in vermilion, with Raag Desh.",
    occasion: "wedding",
    scene: {
      format: "gate-fold",
      motif: "scroll",
      petals: { colours: ["marigold", "card-accent", "tpl-scroll-vermilion"], size: 1 },
      lanterns: true,
    },
    colours: designColours("scroll", "tpl-scroll-vermilion"),
    fonts: { names: type("display"), labels: { ...labels, tracking: 0.24 }, body: italicBody },
    music: { raga: "desh" },
    slots: [
      { id: "doorLeft", sample: "Shubh" },
      { id: "doorRight", sample: "Lagna" },
      { id: "blessing", sample: "Shri Ganeshaya Namah" },
      { id: "families", sample: "The Rathore and Sisodia families" },
      { id: "first", sample: "Vikram" },
      { id: "joiner", sample: "weds" },
      { id: "second", sample: "Ananya" },
      { id: "line", sample: "seek your blessings as they begin their journey together" },
      { id: "date", sample: "Thursday, 26 November 2026" },
      { id: "venue", sample: "Umaid Haveli, Jodhpur" },
    ],
  },
  monogram: {
    id: "monogram",
    name: "Minimal Monogram",
    description: "Quiet stone-white stock, your initials in large type, and Raag Bhupali.",
    occasion: "wedding",
    scene: {
      format: "gate-fold",
      motif: "monogram",
      petals: { colours: ["petal-jasmine", "tpl-monogram-ornament"], size: 0.7 },
      lanterns: false,
    },
    colours: designColours("monogram", "tpl-monogram-ornament"),
    fonts: {
      names: type("label", { uppercase: true, tracking: 0.34, scale: 0.5 }),
      labels: { ...labels, tracking: 0.28, scale: 0.92 },
      body: type("sans"),
    },
    music: { raga: "bhupali", tempo: 72 },
    slots: [
      { id: "families", sample: "Together with their families" },
      { id: "first", sample: "Dev" },
      { id: "joiner", sample: "&" },
      { id: "second", sample: "Tara" },
      { id: "line", sample: "are getting married" },
      { id: "date", sample: "Saturday, 6 March 2027" },
      { id: "venue", sample: "The Glasshouse, Mumbai" },
    ],
  },
  kasavu: {
    id: "kasavu",
    name: "Kerala Kasavu",
    description: "Gold kasavu borders and brass nilavilakku lamps, jasmine, and Raag Madhyamavati.",
    occasion: "wedding",
    scene: {
      format: "gate-fold",
      motif: "kasavu",
      petals: { colours: ["petal-jasmine", "marigold", "petal-jasmine"], size: 0.8 },
      lanterns: false,
    },
    colours: designColours("kasavu", "tpl-kasavu-kumkum"),
    fonts: { names: type("display"), labels, body: italicBody },
    music: { raga: "madhyamavati" },
    slots: [
      { id: "doorLeft", sample: "Shubha" },
      { id: "doorRight", sample: "Muhurtham" },
      { id: "blessing", sample: "" },
      { id: "families", sample: "The Nair and Menon families" },
      { id: "first", sample: "Arjun" },
      { id: "joiner", sample: "&" },
      { id: "second", sample: "Lakshmi" },
      { id: "line", sample: "invite you to bless them on their wedding day" },
      { id: "date", sample: "Sunday, 17 January 2027 · 10.30 am" },
      { id: "venue", sample: "Sree Krishna Auditorium, Guruvayur" },
    ],
  },
};

export const TEMPLATE_LIST: Template[] = Object.values(TEMPLATES);
