import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * Guards the colour tokens against accidental contrast regressions.
 * Reads globals.css, resolves each theme, and checks the pairs components rely on.
 */
const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const tokens: Record<string, string> = {};
  for (const match of css.slice(open, close).matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)) {
    tokens[match[1]!] = match[2]!;
  }
  return tokens;
}

const light = block(":root {");
const dark = { ...light, ...block(':root[data-theme="dark"] {') };

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

/** A colour laid over a background at some opacity, like bg-rose/10. */
function mix(fg: string, bg: string, alpha: number): string {
  const channel = (hex: string, i: number) => parseInt(hex.slice(i, i + 2), 16);
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.round(channel(fg, i) * alpha + channel(bg, i) * (1 - alpha))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

const backgrounds = ["paper", "surface", "surface-2"];
const text = ["ink", "ink-muted", "accent-text", "success", "warning", "danger", "rose"];

describe.each([
  ["light", light],
  ["dark", dark],
])("%s theme", (_, theme) => {
  it.each(text.flatMap((fg) => backgrounds.map((bg) => [fg, bg])))(
    "%s text on %s is at least 4.5:1",
    (fg, bg) => {
      expect(contrast(theme[fg]!, theme[bg]!)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(backgrounds)("field borders on %s are at least 3:1", (bg) => {
    expect(contrast(theme["line-control"]!, theme[bg]!)).toBeGreaterThanOrEqual(3);
  });

  it("button text is at least 4.5:1 on its fill", () => {
    expect(contrast(theme["on-marigold"]!, theme["marigold"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme["on-marigold"]!, theme["marigold-strong"]!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme["on-danger"]!, theme["danger"]!)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(["accent-text", "success", "warning", "danger", "rose"])(
    "%s badge text stays readable on its own tint, on every surface",
    (tone) => {
      for (const bg of backgrounds) {
        const tint = mix(theme[tone]!, theme[bg]!, 0.1);
        expect(contrast(theme[tone]!, tint)).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it("the focus ring is at least 3:1 on every surface", () => {
    for (const bg of backgrounds) {
      expect(contrast(theme["ring"]!, theme[bg]!)).toBeGreaterThanOrEqual(3);
    }
  });
});

it("finds both themes in the stylesheet", () => {
  expect(Object.keys(light).length).toBeGreaterThan(25);
  expect(Object.keys(block(':root[data-theme="dark"] {')).length).toBeGreaterThan(15);
});

it("the dark theme is identical for the OS setting and the explicit switch", () => {
  expect(block('  :root:not([data-theme="light"]) {')).toEqual(block(':root[data-theme="dark"] {'));
});

it.each(["rose", "emerald", "scroll", "monogram", "kasavu"])(
  "the %s design's text is readable on its paper",
  (name) => {
    const paper = light[`tpl-${name}-paper`]!;
    expect(contrast(light[`tpl-${name}-ink`]!, paper)).toBeGreaterThanOrEqual(7);
    expect(contrast(light[`tpl-${name}-accent`]!, paper)).toBeGreaterThanOrEqual(4.5);
  },
);
