import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GateCard } from "@/components/brand/gate-card";
import { TEMPLATES } from "@/lib/templates/catalog";
import { toCardCopy } from "@/lib/templates/content";
import { MOTIF_IDS, TEMPLATE_IDS } from "@/lib/templates/schema";
import { circle, ellipse, rect, type Layer, type Placement } from "./decor";
import { arch, MOTIFS } from "./motifs";

afterEach(cleanup);

const PATH = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;

function paths(layers: readonly Layer[]): string[] {
  const out: string[] = [];
  const walk = (p: Placement) => {
    for (const shape of p.shapes ?? []) out.push(shape.d);
    p.children?.forEach(walk);
  };
  for (const layer of layers) {
    if (layer.clip) out.push(layer.clip);
    layer.items?.forEach(walk);
    layer.pattern?.items.forEach(walk);
  }
  return out;
}

it("writes compact, well-formed path data", () => {
  expect(rect(1, 2, 3, 4)).toBe("M1 2h3v4h-3Z");
  expect(circle(0, 0, 2)).toBe("M-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0Z");
  expect(ellipse(0, 0, 1, 2)).toBe("M0 -2A1 2 0 1 0 0 2A1 2 0 1 0 0 -2Z");
  expect(arch(50, 76, 32, 36, 6, true)).toMatch(/^M18 76V36C.*V76Z$/);
});

describe.each(MOTIF_IDS)("the %s ornaments", (id) => {
  const motif = MOTIFS[id];
  it("are valid SVG paths on every face", () => {
    const all = [
      ...paths(motif.inside),
      ...paths(motif.door("left")),
      ...paths(motif.door("right")),
      ...paths(motif.lining),
      ...paths(motif.back),
      ...(motif.divider ? paths([{ items: [motif.divider] }]) : []),
    ];
    expect(all.length).toBeGreaterThan(0);
    for (const d of all) expect(d).toMatch(PATH);
  });

  it("keep the words inside the card", () => {
    expect(motif.textBox.top).toBeGreaterThan(0);
    expect(motif.textBox.bottom).toBeLessThan(80);
    expect(motif.textBox.width).toBeLessThanOrEqual(80);
  });
});

describe.each(TEMPLATE_IDS)("the 2D %s card", (id) => {
  it("draws the template's ornaments and words, hidden from screen readers", () => {
    const template = TEMPLATES[id];
    const copy = toCardCopy(template);
    const { container } = render(<GateCard copy={copy} template={template} />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveAttribute("aria-hidden");
    // Inside, both door fronts, both linings
    expect(card.querySelectorAll("svg").length).toBeGreaterThanOrEqual(5);
    expect(card).toHaveTextContent(copy.date.toUpperCase());
    expect(card.textContent).toContain(
      template.fonts.names.uppercase ? copy.first.toUpperCase() : copy.first,
    );
    // Clip paths and patterns get ids unique to this card
    const ids = [...card.querySelectorAll("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
