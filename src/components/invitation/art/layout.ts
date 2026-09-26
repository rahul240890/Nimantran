import type { CardCopy } from "@/lib/templates/content";
import { initialOf } from "@/lib/templates/content";
import type { FontRole, StockRole, Template, TypeStyle } from "@/lib/templates/schema";
import type { DoorSide, Motif } from "./motifs";

/*
 * Where each line of words sits on the card, worked out once and used by both the 2D card
 * (positioned HTML) and the 3D card (painted canvas), so they always match. Pure: text
 * widths are estimated from character counts, which is deterministic on the server and in
 * the browser; the 3D painter still measures and shrinks any line that runs long.
 */

export type TextRun = {
  key: string;
  rows: string[];
  font: FontRole;
  italic: boolean;
  /** Letter spacing as a fraction of the size. */
  tracking: number;
  /** Font size in face units. */
  size: number;
  /** Height of each row in face units. */
  lineHeight: number;
  /** Top edge in face units. */
  top: number;
  /** Horizontal centre in face units. */
  x: number;
  maxWidth: number;
  ink: StockRole;
  /** Foil lettering shines in 3D; the rest is pressed ink. */
  foil: boolean;
};

export type InsideLayout = {
  runs: TextRun[];
  /** The divider's centre line, when there is one. */
  divider: number | null;
  /** The couple's initials with a fine rule between them (monogram layout). */
  monogram: { top: number; size: number; initials: [string, string]; x: number } | null;
  /** How much everything was scaled down to fit the motif's text box. */
  scale: number;
};

const LINE_HEIGHT: Record<FontRole, number> = { display: 1.12, label: 1.35, sans: 1.3 };
/** Average advance of one character, in ems, for Latin text in each face. */
const CHAR_EM: Record<FontRole, number> = { display: 0.52, label: 0.66, sans: 0.5 };
/** Indian scripts: one code point (letters and vowel signs alike) is about this wide. */
const INDIC_EM = 0.55;
const DIVIDER_HEIGHT = 2.6;
const INDIC = /[ऀ-෿਀-੿]/u;
/** Letters that should never be spaced apart: anything outside Latin. */
const JOINED = /[^\p{Script=Latin}\p{P}\p{N}\p{Zs}\p{S}]/u;

export function trackingFor(text: string, tracking: number): number {
  return JOINED.test(text) ? 0 : tracking;
}

/** Estimated width of a line, in face units. */
export function estimateWidth(
  text: string,
  font: FontRole,
  size: number,
  tracking: number,
): number {
  let ems = 0;
  let count = 0;
  for (const char of text) {
    count += 1;
    ems += INDIC.test(char) ? INDIC_EM : char === " " ? 0.28 : CHAR_EM[font];
  }
  return (ems + trackingFor(text, tracking) * count) * size;
}

type Spec = {
  key: string;
  text: string;
  style: TypeStyle;
  size: number;
  ink: StockRole;
  lines: 1 | 2;
  gap: number;
  tracking?: number;
};

/** Splits a line into two rows of similar length, at a space. */
export function balance(text: string, measure: (row: string) => number): string[] {
  const words = text.split(" ");
  if (words.length < 2) return [text];
  let best = [text];
  let widest = Infinity;
  for (let i = 1; i < words.length; i++) {
    const rows = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const width = Math.max(...rows.map(measure));
    if (width < widest) {
      widest = width;
      best = rows;
    }
  }
  return best;
}

function run(spec: Spec, maxWidth: number, x: number): TextRun {
  const text = spec.style.uppercase ? spec.text.toLocaleUpperCase() : spec.text;
  const tracking = trackingFor(text, spec.tracking ?? spec.style.tracking);
  const measure = (row: string) => estimateWidth(row, spec.style.font, 1, tracking);
  let rows = [text];
  if (spec.lines === 2 && measure(text) * spec.size > maxWidth) rows = balance(text, measure);
  const widest = Math.max(...rows.map(measure));
  const size = Math.min(spec.size, maxWidth / Math.max(widest, 0.01));
  return {
    key: spec.key,
    rows,
    font: spec.style.font,
    italic: spec.style.italic,
    tracking,
    size,
    lineHeight: size * LINE_HEIGHT[spec.style.font],
    top: 0,
    x,
    maxWidth,
    ink: spec.ink,
    foil: spec.ink !== "ink" && spec.ink !== "inkMuted",
  };
}

const MONOGRAM_SIZE = 17;

type Item =
  | { kind: "run"; gap: number; run: TextRun }
  | { kind: "divider"; gap: number }
  | { kind: "monogram"; gap: number };

export function layoutInside(copy: CardCopy, template: Template, motif: Motif): InsideLayout {
  const { names, labels, body } = template.fonts;
  const box = motif.textBox;
  const x = 50;
  const items: Item[] = [];
  const text = (spec: Omit<Spec, "gap">, gap: number) => {
    if (spec.text.trim())
      items.push({ kind: "run", gap, run: run({ ...spec, gap }, box.width, x) });
  };

  text(
    {
      key: "blessing",
      text: copy.blessing,
      style: labels,
      size: 2.5 * labels.scale,
      ink: "accentText",
      lines: 1,
    },
    0,
  );
  text(
    {
      key: "families",
      text: copy.families,
      style: labels,
      size: 2.9 * labels.scale,
      ink: "goldText",
      lines: 1,
    },
    2.2,
  );
  if (motif.layout === "monogram") {
    items.push({ kind: "monogram", gap: 3 });
    const inline = [copy.first, copy.joiner, copy.second].filter((part) => part.trim()).join(" ");
    text(
      { key: "names", text: inline, style: names, size: 8.5 * names.scale, ink: "ink", lines: 1 },
      3.4,
    );
  } else {
    text(
      {
        key: "first",
        text: copy.first,
        style: names,
        size: 8.5 * names.scale,
        ink: "ink",
        lines: 1,
      },
      3.2,
    );
    text(
      {
        key: "joiner",
        text: copy.joiner,
        style: names,
        size: 5 * names.scale,
        ink: "accentText",
        lines: 1,
      },
      0.4,
    );
    text(
      {
        key: "second",
        text: copy.second,
        style: names,
        size: 8.5 * names.scale,
        ink: "ink",
        lines: 1,
      },
      0.4,
    );
  }
  text(
    {
      key: "line",
      text: copy.line,
      style: body,
      size: 3.4 * body.scale,
      ink: "inkMuted",
      lines: 2,
    },
    2.6,
  );
  if (motif.divider) items.push({ kind: "divider", gap: 2.2 });
  text(
    {
      key: "date",
      text: copy.date,
      style: labels,
      size: 3.3 * labels.scale,
      ink: "ink",
      lines: 1,
      tracking: labels.tracking * 0.4,
    },
    2.2,
  );
  // The venue shares the names' face, at its own size (a label face stays upright)
  const venueSize = names.font === "display" ? 4.1 : 3;
  text(
    { key: "venue", text: copy.venue, style: names, size: venueSize, ink: "accentText", lines: 2 },
    1.2,
  );

  const heightOf = (item: Item) =>
    item.kind === "run"
      ? item.run.rows.length * item.run.lineHeight
      : item.kind === "divider"
        ? DIVIDER_HEIGHT
        : MONOGRAM_SIZE;
  const gapOf = (item: Item, i: number) => (i === 0 ? 0 : item.gap);

  // Stack everything, then scale it all down together if it overflows the box
  const height = items.reduce((sum, item, i) => sum + gapOf(item, i) + heightOf(item), 0);
  const room = box.bottom - box.top;
  const scale = Math.min(1, room / height);
  let y = box.top + (room - height * scale) / 2;

  const runs: TextRun[] = [];
  let divider: number | null = null;
  let monogram: InsideLayout["monogram"] = null;
  items.forEach((item, i) => {
    y += gapOf(item, i) * scale;
    const h = heightOf(item) * scale;
    if (item.kind === "run") {
      runs.push({
        ...item.run,
        size: item.run.size * scale,
        lineHeight: item.run.lineHeight * scale,
        top: y,
      });
    } else if (item.kind === "divider") {
      divider = y + h / 2;
    } else {
      monogram = {
        top: y,
        size: MONOGRAM_SIZE * scale,
        initials: [initialOf(copy.first), initialOf(copy.second)],
        x,
      };
    }
    y += h;
  });

  return { runs, divider, monogram, scale };
}

export type DoorLayout = { label: TextRun | null; initial: TextRun };

export function layoutDoor(
  copy: CardCopy,
  template: Template,
  motif: Motif,
  side: DoorSide,
): DoorLayout {
  const { labels, names } = template.fonts;
  const { doorText } = motif;
  const word = side === "left" ? copy.doors[0] : copy.doors[1];
  let label: TextRun | null = null;
  if (doorText.label !== null && word.trim()) {
    label = run(
      {
        key: "door",
        text: word,
        style: labels,
        size: 2.6,
        ink: "goldText",
        lines: 1,
        gap: 0,
        tracking: labels.tracking + 0.05,
      },
      40,
      25,
    );
    label.top = doorText.label - label.lineHeight / 2;
  }
  const initial = run(
    {
      key: "initial",
      text: initialOf(side === "left" ? copy.first : copy.second),
      style: {
        font: "display",
        italic: names.font === "display" && names.italic,
        uppercase: false,
        tracking: 0,
        scale: 1,
      },
      size: doorText.initial.size,
      ink: doorText.initial.ink ?? "accentText",
      lines: 1,
      gap: 0,
    },
    40,
    25,
  );
  initial.top = doorText.initial.y - initial.lineHeight / 2;
  return { label, initial };
}
