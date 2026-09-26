import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ENGINE_THEME_IDS,
  ENGINE_THEMES,
  isEngineThemeId,
  resolveStock,
  stockStyle,
} from "./themes";

const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
const defined = new Set([...css.matchAll(/--([\w-]+):/g)].map((match) => match[1]));

describe.each(ENGINE_THEME_IDS)("the %s theme", (id) => {
  const theme = ENGINE_THEMES[id];

  it("uses only design tokens that exist", () => {
    for (const token of [...Object.values(theme.stock), ...theme.petals]) {
      expect(defined, `--${token}`).toContain(token);
    }
  });

  it("re-colours every part of the 2D card", () => {
    const style = stockStyle(theme) as Record<string, string>;
    expect(Object.keys(style).sort()).toEqual(
      [
        "--card-accent",
        "--card-accent-text",
        "--card-back",
        "--card-gold",
        "--card-gold-text",
        "--card-ink",
        "--card-ink-muted",
        "--card-ivory",
      ].sort(),
    );
    for (const value of Object.values(style)) expect(value).toMatch(/^var\(--[\w-]+\)$/);
  });

  it("resolves its colours through the reader it is given", () => {
    const { stock, petals } = resolveStock(theme, (token) => `value-of-${token}`);
    expect(stock.paper).toBe(`value-of-${theme.stock.paper}`);
    expect(petals).toHaveLength(theme.petals.length);
  });
});

it("recognises theme ids", () => {
  expect(isEngineThemeId("marigold")).toBe(true);
  expect(isEngineThemeId("nope")).toBe(false);
  expect(isEngineThemeId(undefined)).toBe(false);
  expect(isEngineThemeId("toString")).toBe(false);
});
