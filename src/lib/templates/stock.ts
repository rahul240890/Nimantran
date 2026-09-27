import type { CSSProperties } from "react";
import { STOCK_ROLES, type StockRole } from "./ids";
import type { Template } from "./schema";

/*
 * A template's card stock is a set of design token names, never raw colours, so the 3D
 * scene, the 2D card and the rest of the app always agree.
 */

/** The CSS variables the 2D card is drawn with, one per part of the stock. */
export const CARD_VARS: Record<StockRole, string> = {
  paper: "--card-ivory",
  ink: "--card-ink",
  inkMuted: "--card-ink-muted",
  gold: "--card-gold",
  goldText: "--card-gold-text",
  accent: "--card-accent",
  accentText: "--card-accent-text",
  back: "--card-back",
};

/** Points the card variables at a template's tokens, re-colouring the 2D card beneath. */
export function stockStyle(template: Template): CSSProperties {
  const style: Record<string, string> = {};
  for (const role of STOCK_ROLES) {
    const variable = CARD_VARS[role];
    const token = `--${template.colours[role]}`;
    // A variable pointing at itself would be a cycle, which blanks it
    if (token !== variable) style[variable] = `var(${token})`;
  }
  return style as CSSProperties;
}

export type ResolvedStock = Record<StockRole, string>;

/** Reads the current values of a template's tokens, e.g. for a WebGL material. */
export function resolveStock(
  template: Template,
  read: (token: string) => string,
): { stock: ResolvedStock; petals: string[] } {
  const stock = {} as ResolvedStock;
  for (const role of STOCK_ROLES) stock[role] = read(template.colours[role]);
  return { stock, petals: template.scene.petals.colours.map(read) };
}

/** Reads a design token from the document in the browser. */
export function readToken(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim();
}
