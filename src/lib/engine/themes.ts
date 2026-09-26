import type { CSSProperties } from "react";

/*
 * Engine themes: the card stock, the petals, whether sky lanterns rise, and the music.
 * Colours are design token names from globals.css, never raw values, so the 3D scene,
 * the 2D fallback and the rest of the app always agree. The 3D scene reads the resolved
 * values at runtime with resolveStock().
 */

export type MusicTrackId = "yaman" | "bhupali" | "desh";

export type StockRole =
  "paper" | "ink" | "inkMuted" | "gold" | "goldText" | "accent" | "accentText" | "back";

export type EngineTheme = {
  id: EngineThemeId;
  name: string;
  /** Token names (without the leading --) for each part of the card stock. */
  stock: Record<StockRole, string>;
  /** Token names for the petal colours; an empty list means no petals. */
  petals: string[];
  /** Petal size relative to a marigold petal; jasmine buds are smaller. */
  petalSize: number;
  lanterns: boolean;
  music: MusicTrackId;
};

export type EngineThemeId = "marigold" | "rose" | "emerald" | "scroll" | "monogram" | "kasavu";

/** Builds a stock from one of the launch designs' token sets (tpl-<name>-…). */
function designStock(name: string): Record<StockRole, string> {
  return {
    paper: `tpl-${name}-paper`,
    ink: `tpl-${name}-ink`,
    inkMuted: `tpl-${name}-ink`,
    gold: `tpl-${name}-ornament`,
    goldText: `tpl-${name}-accent`,
    accent: `tpl-${name}-ornament`,
    accentText: `tpl-${name}-accent`,
    back: `tpl-${name}-back`,
  };
}

export const ENGINE_THEMES: Record<EngineThemeId, EngineTheme> = {
  marigold: {
    id: "marigold",
    name: "Marigold Gate",
    stock: {
      paper: "card-ivory",
      ink: "card-ink",
      inkMuted: "card-ink-muted",
      gold: "card-gold",
      goldText: "card-gold-text",
      accent: "card-accent",
      accentText: "card-accent-text",
      back: "card-back",
    },
    petals: ["marigold", "card-accent", "marigold-strong", "rose"],
    petalSize: 1,
    lanterns: true,
    music: "yaman",
  },
  rose: {
    id: "rose",
    name: "Rose Garden",
    stock: designStock("rose"),
    petals: ["tpl-rose-ornament", "tpl-rose-accent", "rose", "petal-blush"],
    petalSize: 1.1,
    lanterns: false,
    music: "desh",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Palace",
    stock: designStock("emerald"),
    petals: ["petal-jasmine", "tpl-emerald-accent", "petal-jasmine"],
    petalSize: 0.75,
    lanterns: true,
    music: "yaman",
  },
  scroll: {
    id: "scroll",
    name: "Royal Scroll",
    stock: designStock("scroll"),
    petals: ["marigold", "card-accent", "tpl-scroll-accent"],
    petalSize: 1,
    lanterns: true,
    music: "desh",
  },
  monogram: {
    id: "monogram",
    name: "Minimal Monogram",
    stock: designStock("monogram"),
    petals: ["petal-jasmine", "tpl-monogram-ornament"],
    petalSize: 0.7,
    lanterns: false,
    music: "bhupali",
  },
  kasavu: {
    id: "kasavu",
    name: "Kerala Kasavu",
    stock: designStock("kasavu"),
    petals: ["petal-jasmine", "marigold", "petal-jasmine"],
    petalSize: 0.8,
    lanterns: false,
    music: "bhupali",
  },
};

export const ENGINE_THEME_IDS = Object.keys(ENGINE_THEMES) as EngineThemeId[];

export function isEngineThemeId(value: unknown): value is EngineThemeId {
  return typeof value === "string" && Object.hasOwn(ENGINE_THEMES, value);
}

/*
 * The 2D card is drawn with the card-* tokens. Pointing those at another stock's tokens
 * on a wrapper re-colours it without touching the component.
 */
const CARD_VARS: Record<StockRole, string> = {
  paper: "--card-ivory",
  ink: "--card-ink",
  inkMuted: "--card-ink-muted",
  gold: "--card-gold",
  goldText: "--card-gold-text",
  accent: "--card-accent",
  accentText: "--card-accent-text",
  back: "--card-back",
};

export function stockStyle(theme: EngineTheme): CSSProperties {
  const style: Record<string, string> = {};
  for (const [role, variable] of Object.entries(CARD_VARS) as [StockRole, string][]) {
    style[variable] = `var(--${theme.stock[role]})`;
  }
  return style as CSSProperties;
}

export type ResolvedStock = Record<StockRole, string>;

/** Reads the current values of a theme's tokens, e.g. for a WebGL material. */
export function resolveStock(
  theme: EngineTheme,
  read: (token: string) => string,
): { stock: ResolvedStock; petals: string[] } {
  const stock = {} as ResolvedStock;
  for (const role of Object.keys(theme.stock) as StockRole[]) {
    stock[role] = read(theme.stock[role]);
  }
  return { stock, petals: theme.petals.map(read) };
}

/** Reads a design token from the document in the browser. */
export function readToken(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim();
}
