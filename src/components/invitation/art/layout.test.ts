import { describe, expect, it } from "vitest";
import { sampleCopies } from "@/content/engine-review";
import { TEMPLATES } from "@/lib/templates/catalog";
import { toCardCopy } from "@/lib/templates/content";
import { TEMPLATE_IDS } from "@/lib/templates/schema";
import { balance, estimateWidth, layoutDoor, layoutInside, trackingFor } from "./layout";
import { MOTIFS } from "./motifs";

const wordings = Object.keys(sampleCopies) as (keyof typeof sampleCopies)[];

describe.each(TEMPLATE_IDS)("the %s layout", (id) => {
  const template = TEMPLATES[id];
  const motif = MOTIFS[template.scene.motif];

  it.each(wordings)("fits %s wording inside the text box without overlaps", (wording) => {
    const copy = toCardCopy(template, sampleCopies[wording].content);
    const { runs, divider, monogram, scale } = layoutInside(copy, template, motif);
    const box = motif.textBox;
    const blocks = [
      ...runs.map((run) => [run.top, run.top + run.rows.length * run.lineHeight] as const),
      ...(monogram ? [[monogram.top, monogram.top + monogram.size] as const] : []),
    ].sort((a, b) => a[0] - b[0]);

    expect(scale).toBeGreaterThan(0.6);
    expect(blocks[0]![0]).toBeGreaterThanOrEqual(box.top - 0.01);
    expect(blocks.at(-1)![1]).toBeLessThanOrEqual(box.bottom + 0.01);
    for (let i = 1; i < blocks.length; i++) {
      expect(blocks[i]![0]).toBeGreaterThanOrEqual(blocks[i - 1]![1] - 0.01);
    }
    for (const run of runs) {
      expect(run.size, run.key).toBeGreaterThan(1.5);
      for (const row of run.rows) {
        expect(estimateWidth(row, run.font, run.size, run.tracking)).toBeLessThanOrEqual(
          run.maxWidth + 0.01,
        );
      }
    }
    if (motif.divider) expect(divider).not.toBeNull();
    expect(Boolean(monogram)).toBe(motif.layout === "monogram");
  });

  it("puts each door's initial on its door", () => {
    const copy = toCardCopy(template);
    const left = layoutDoor(copy, template, motif, "left");
    const right = layoutDoor(copy, template, motif, "right");
    expect(left.initial.rows).toEqual([copy.first.charAt(0).toUpperCase()]);
    expect(right.initial.rows).toEqual([copy.second.charAt(0).toUpperCase()]);
    expect(Boolean(left.label)).toBe(motif.doorText.label !== null);
  });
});

it("leaves out empty lines", () => {
  const copy = toCardCopy(TEMPLATES.marigold, { families: "", line: "" });
  const keys = layoutInside(copy, TEMPLATES.marigold, MOTIFS.mandala).runs.map((run) => run.key);
  expect(keys).toEqual(["first", "joiner", "second", "date", "venue"]);
});

it("never spaces out letters in scripts that join them", () => {
  expect(trackingFor("SHUBH VIVAH", 0.3)).toBe(0.3);
  expect(trackingFor("शुभ विवाह", 0.3)).toBe(0);
  expect(trackingFor("திருமண", 0.3)).toBe(0);
});

it("splits a long line into two rows of similar length", () => {
  const rows = balance("invite you to celebrate their wedding", (row) => row.length);
  expect(rows).toHaveLength(2);
  expect(Math.max(...rows.map((row) => row.length))).toBeLessThanOrEqual(23);
  expect(balance("single", (row) => row.length)).toEqual(["single"]);
});

it("shrinks very long names rather than letting them overflow", () => {
  const copy = toCardCopy(TEMPLATES.rose, { first: "Venkatasubramanian Raghunathan" });
  const first = layoutInside(copy, TEMPLATES.rose, MOTIFS.roses).runs.find(
    (r) => r.key === "first",
  )!;
  expect(estimateWidth(first.rows[0]!, first.font, first.size, first.tracking)).toBeLessThanOrEqual(
    MOTIFS.roses.textBox.width + 0.01,
  );
});
