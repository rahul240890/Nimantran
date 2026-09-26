import { expect, it } from "vitest";
import { TEMPLATES } from "./catalog";
import { resolveStock, stockStyle } from "./stock";

it("points every card variable at a design's tokens", () => {
  const style = stockStyle(TEMPLATES.emerald) as Record<string, string>;
  expect(Object.keys(style)).toHaveLength(8);
  expect(style["--card-ivory"]).toBe("var(--tpl-emerald-paper)");
  expect(style["--card-accent"]).toBe("var(--tpl-emerald-ruby)");
});

it("never points a card variable at itself, which would blank it", () => {
  const style = stockStyle(TEMPLATES.marigold) as Record<string, string>;
  for (const [variable, value] of Object.entries(style)) {
    expect(value).not.toBe(`var(${variable})`);
  }
});

it("resolves colours through the reader it is given", () => {
  const { stock, petals } = resolveStock(TEMPLATES.rose, (token) => `value-of-${token}`);
  expect(stock.paper).toBe("value-of-tpl-rose-paper");
  expect(petals).toHaveLength(TEMPLATES.rose.scene.petals.colours.length);
});
