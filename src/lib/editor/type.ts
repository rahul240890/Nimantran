import { z } from "zod";
import type { CardLanguage } from "@/lib/templates/card-languages";

/*
 * Lettering on the event pages (Step 12n): the host picks a font for the names and one for
 * the words, from a short list chosen to look printed and to carry every card language's
 * script, then the size, weight, slant, capitals and the names' colour. Saved with the
 * invite (religious.type), so the guest sees exactly what the host set.
 */

export type FontScript = "latin" | "devanagari" | "gujarati" | "bengali" | "tamil";

export type FontEntry = {
  /** The family name its @font-face declares. */
  family: string;
  /** What to fall back on while it loads, or for a script it lacks. */
  fallback: string;
  scripts: readonly FontScript[];
  /** Where it suits: the couple's names, the other words, or both. */
  role: "names" | "words" | "both";
  /** How it reads, for the picker's grouping. */
  feel: "classic" | "script" | "bold" | "clean" | "handwritten";
  italic: boolean;
};

export const FONT_IDS = [
  "rozha",
  "playfair",
  "cinzel",
  "cormorant",
  "great-vibes",
  "yeseva",
  "marcellus",
  "karla",
  "tiro-hindi",
  "yatra",
  "kalam",
  "rasa",
  "mogra",
  "hind-vadodara",
  "tiro-bangla",
  "galada",
  "arima",
  "tiro-tamil",
  "alex-brush",
  "amita",
  "martel",
  "shrikhand",
  "farsan",
  "kumar-one",
  "baloo-bhai",
  "baloo-da",
  "atma",
  "catamaran",
  "meera-inimai",
] as const;
export type FontId = (typeof FONT_IDS)[number];

const SERIF = "Georgia, serif";
const SANS = "system-ui, sans-serif";

export const FONTS: Record<FontId, FontEntry> = {
  rozha: {
    family: "Rozha One",
    fallback: SERIF,
    scripts: ["latin", "devanagari"],
    role: "names",
    feel: "bold",
    italic: false,
  },
  playfair: {
    family: "Playfair Display",
    fallback: SERIF,
    scripts: ["latin"],
    role: "both",
    feel: "classic",
    italic: true,
  },
  cinzel: {
    family: "Cinzel",
    fallback: SERIF,
    scripts: ["latin"],
    role: "both",
    feel: "classic",
    italic: false,
  },
  cormorant: {
    family: "Cormorant Garamond",
    fallback: SERIF,
    scripts: ["latin"],
    role: "both",
    feel: "classic",
    italic: true,
  },
  "great-vibes": {
    family: "Great Vibes",
    fallback: "cursive",
    scripts: ["latin"],
    role: "names",
    feel: "script",
    italic: false,
  },
  yeseva: {
    family: "Yeseva One",
    fallback: SERIF,
    scripts: ["latin"],
    role: "names",
    feel: "bold",
    italic: false,
  },
  marcellus: {
    family: "Marcellus",
    fallback: SERIF,
    scripts: ["latin"],
    role: "words",
    feel: "classic",
    italic: false,
  },
  karla: {
    family: "Karla Variable",
    fallback: SANS,
    scripts: ["latin"],
    role: "words",
    feel: "clean",
    italic: true,
  },
  "tiro-hindi": {
    family: "Tiro Devanagari Hindi",
    fallback: SERIF,
    scripts: ["latin", "devanagari"],
    role: "both",
    feel: "classic",
    italic: true,
  },
  yatra: {
    family: "Yatra One",
    fallback: SERIF,
    scripts: ["latin", "devanagari"],
    role: "names",
    feel: "bold",
    italic: false,
  },
  kalam: {
    family: "Kalam",
    fallback: "cursive",
    scripts: ["latin", "devanagari"],
    role: "both",
    feel: "handwritten",
    italic: false,
  },
  rasa: {
    family: "Rasa",
    fallback: SERIF,
    scripts: ["latin", "gujarati"],
    role: "both",
    feel: "classic",
    italic: true,
  },
  mogra: {
    family: "Mogra",
    fallback: SERIF,
    scripts: ["latin", "gujarati"],
    role: "names",
    feel: "bold",
    italic: false,
  },
  "hind-vadodara": {
    family: "Hind Vadodara",
    fallback: SANS,
    scripts: ["latin", "gujarati"],
    role: "words",
    feel: "clean",
    italic: false,
  },
  "tiro-bangla": {
    family: "Tiro Bangla",
    fallback: SERIF,
    scripts: ["latin", "bengali"],
    role: "both",
    feel: "classic",
    italic: true,
  },
  galada: {
    family: "Galada",
    fallback: SERIF,
    scripts: ["latin", "bengali"],
    role: "names",
    feel: "script",
    italic: false,
  },
  arima: {
    family: "Arima",
    fallback: SERIF,
    scripts: ["latin", "tamil"],
    role: "names",
    feel: "bold",
    italic: false,
  },
  "tiro-tamil": {
    family: "Tiro Tamil",
    fallback: SERIF,
    scripts: ["latin", "tamil"],
    role: "both",
    feel: "classic",
    italic: true,
  },
  "alex-brush": {
    family: "Alex Brush",
    fallback: "cursive",
    scripts: ["latin"],
    role: "names",
    feel: "script",
    italic: false,
  },
  amita: {
    family: "Amita",
    fallback: "cursive",
    scripts: ["latin", "devanagari"],
    role: "names",
    feel: "script",
    italic: false,
  },
  martel: {
    family: "Martel",
    fallback: SERIF,
    scripts: ["latin", "devanagari"],
    role: "words",
    feel: "clean",
    italic: false,
  },
  shrikhand: {
    family: "Shrikhand",
    fallback: SERIF,
    scripts: ["latin", "gujarati"],
    role: "names",
    feel: "script",
    italic: false,
  },
  farsan: {
    family: "Farsan",
    fallback: "cursive",
    scripts: ["latin", "gujarati"],
    role: "names",
    feel: "handwritten",
    italic: false,
  },
  "kumar-one": {
    family: "Kumar One",
    fallback: SERIF,
    scripts: ["latin", "gujarati"],
    role: "names",
    feel: "bold",
    italic: false,
  },
  "baloo-bhai": {
    family: "Baloo Bhai 2",
    fallback: SANS,
    scripts: ["latin", "gujarati"],
    role: "both",
    feel: "clean",
    italic: false,
  },
  "baloo-da": {
    family: "Baloo Da 2",
    fallback: SANS,
    scripts: ["latin", "bengali"],
    role: "both",
    feel: "clean",
    italic: false,
  },
  atma: {
    family: "Atma",
    fallback: "cursive",
    scripts: ["latin", "bengali"],
    role: "names",
    feel: "handwritten",
    italic: false,
  },
  catamaran: {
    family: "Catamaran",
    fallback: SANS,
    scripts: ["latin", "tamil"],
    role: "words",
    feel: "clean",
    italic: false,
  },
  "meera-inimai": {
    family: "Meera Inimai",
    fallback: SANS,
    scripts: ["latin", "tamil"],
    role: "both",
    feel: "clean",
    italic: false,
  },
};

const LANGUAGE_SCRIPT: Record<CardLanguage, FontScript> = {
  en: "latin",
  hi: "devanagari",
  mr: "devanagari",
  gu: "gujarati",
  bn: "bengali",
  ta: "tamil",
};

export function scriptOf(language: CardLanguage): FontScript {
  return LANGUAGE_SCRIPT[language];
}

/** Fonts that can write every one of the card's languages, for the names or the words. */
export function fontsFor(languages: readonly CardLanguage[], role: "names" | "words"): FontId[] {
  const scripts = languages.map(scriptOf);
  return FONT_IDS.filter((id) => {
    const font = FONTS[id];
    return (
      (font.role === role || font.role === "both") &&
      scripts.every((script) => font.scripts.includes(script))
    );
  });
}

export const TYPE_SIZES = ["small", "medium", "large"] as const;
export type TypeSize = (typeof TYPE_SIZES)[number];
export const SIZE_SCALE: Record<TypeSize, number> = { small: 0.88, medium: 1, large: 1.14 };

/** The names' colours, all from the card's own stock so they stay in the theme's palette. */
export const NAME_COLOURS = ["theme", "maroon", "gold", "saffron", "ink", "ivory"] as const;
export type NameColour = (typeof NAME_COLOURS)[number];
export const NAME_COLOUR_VALUE: Record<Exclude<NameColour, "theme">, string> = {
  maroon: "var(--card-back)",
  gold: "var(--card-gold-text)",
  saffron: "var(--card-accent-text)",
  ink: "var(--card-ink)",
  ivory: "var(--card-ivory)",
};

export const typeSchema = z.object({
  /** Null keeps the theme's own lettering. */
  names: z.enum(FONT_IDS).nullable().catch(null),
  words: z.enum(FONT_IDS).nullable().catch(null),
  size: z.enum(TYPE_SIZES).catch("medium"),
  bold: z.boolean().catch(false),
  italic: z.boolean().catch(false),
  capitals: z.boolean().catch(false),
  colour: z.enum(NAME_COLOURS).catch("theme"),
});
export type TypeStyle = z.infer<typeof typeSchema>;

export const defaultType: TypeStyle = {
  names: null,
  words: null,
  size: "medium",
  bold: false,
  italic: false,
  capitals: false,
  colour: "theme",
};

/** A font as a CSS font-family list, the chosen face first. */
export function fontStack(id: FontId): string {
  const font = FONTS[id];
  return `"${font.family}", ${font.fallback}`;
}

/**
 * A font the host picked, if it can still write the card's languages (a language added
 * later may need another script); otherwise the theme's own lettering.
 */
export function usableFont(
  id: FontId | null,
  languages: readonly CardLanguage[],
  role: "names" | "words",
): FontId | null {
  return id && fontsFor(languages, role).includes(id) ? id : null;
}

/** Lettering ready to draw: font stacks, or undefined to keep the theme's own. */
export type PageType = {
  names?: string;
  words?: string;
  scale: number;
  bold: boolean;
  italic: boolean;
  capitals: boolean;
  colour?: string;
};

export function pageType(type: TypeStyle, languages: readonly CardLanguage[]): PageType {
  const names = usableFont(type.names, languages, "names");
  const words = usableFont(type.words, languages, "words");
  return {
    names: names ? fontStack(names) : undefined,
    words: words ? fontStack(words) : undefined,
    scale: SIZE_SCALE[type.size],
    bold: type.bold,
    italic: type.italic,
    capitals: type.capitals,
    colour: type.colour === "theme" ? undefined : NAME_COLOUR_VALUE[type.colour],
  };
}

/** A letter in each script, for the picker's samples when no name is typed yet. */
export const SCRIPT_SAMPLE: Record<FontScript, string> = {
  latin: "Aa",
  devanagari: "अक्षर",
  gujarati: "અક્ષર",
  bengali: "অক্ষর",
  tamil: "எழுத்து",
};
