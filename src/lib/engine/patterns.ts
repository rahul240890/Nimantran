/*
 * Floor patterns that draw themselves behind the card (docs/MOTION.md, section 5): a Tamil
 * kolam, a Marathi rangoli, a Bengali alpona, and a plain gold line for Modern cards.
 * Built from geometry, never traced, as ordered strokes in a unit circle (radius 1), so
 * the 3D scene and the 2D card reveal them in the same order, the way a hand draws them.
 */

export const PATTERN_IDS = ["kolam", "rangoli", "alpona", "frame"] as const;
export type PatternId = (typeof PATTERN_IDS)[number];

export type Stroke = {
  /** x, y pairs. */
  points: Float32Array;
  /** Which of the pattern's two colours it uses. */
  colour: 0 | 1;
  /** Line width relative to the pattern's base width. */
  width: number;
  closed: boolean;
};

const TAU = Math.PI * 2;

function stroke(xy: number[], colour: 0 | 1 = 0, width = 1, closed = false): Stroke {
  return { points: Float32Array.from(xy), colour, width, closed };
}

/** A polar curve r(θ) sampled all the way round, rotated by `turn` radians. */
function polar(r: (theta: number) => number, samples: number, turn = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const theta = (i / samples) * TAU;
    const radius = r(theta);
    out.push(Math.cos(theta + turn) * radius, Math.sin(theta + turn) * radius);
  }
  return out;
}

const circle = (radius: number, samples = 96, cx = 0, cy = 0): number[] => {
  const out: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const theta = (i / samples) * TAU;
    out.push(cx + Math.cos(theta) * radius, cy + Math.sin(theta) * radius);
  }
  return out;
};

/** A teardrop petal from `inner` to `outer` along angle `at`, drawn as one closed loop. */
function petal(at: number, inner: number, outer: number, width: number, samples = 24): number[] {
  const out: number[] = [];
  const length = outer - inner;
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * TAU;
    // A leaf shape: pointed at the tip, round at the base
    const along = inner + ((1 - Math.cos(t)) / 2) * length;
    const across = Math.sin(t) * width * Math.sin(((1 - Math.cos(t)) / 2) * Math.PI) ** 0.8;
    out.push(
      Math.cos(at) * along - Math.sin(at) * across,
      Math.sin(at) * along + Math.cos(at) * across,
    );
  }
  return out;
}

/** Dots on a ring, each a tiny circle, as the pulli (dots) a kolam is drawn around. */
function dots(count: number, radius: number, size: number, turn = 0): Stroke[] {
  return Array.from({ length: count }, (_, i) => {
    const at = turn + (i / count) * TAU;
    return stroke(circle(size, 10, Math.cos(at) * radius, Math.sin(at) * radius), 0, 1.4, true);
  });
}

/**
 * A kolam: rings of dots, each woven round by two strands that cross between the dots,
 * the way a sikku kolam loops round its pulli without lifting the hand.
 */
function kolam(): Stroke[] {
  const ring = (count: number, radius: number, depth: number, turn: number): Stroke[] => [
    ...dots(count, radius, 0.012, turn + Math.PI / count),
    stroke(
      polar((t) => radius + depth * Math.sin(count * t), count * 16, turn),
      0,
      1,
      true,
    ),
    stroke(
      polar((t) => radius - depth * Math.sin(count * t), count * 16, turn),
      0,
      1,
      true,
    ),
  ];
  return [
    ...ring(24, 0.9, 0.06, 0),
    stroke(circle(0.99), 1, 0.8, true),
    ...ring(16, 0.7, 0.07, Math.PI / 16),
    stroke(circle(0.8), 1, 0.6, true),
    ...ring(8, 0.46, 0.09, 0),
  ];
}

/** A rangoli: a lotus of petals in rings, with dots of colour between them. */
function rangoli(): Stroke[] {
  const out: Stroke[] = [stroke(circle(0.5), 1, 1.2, true)];
  for (let i = 0; i < 8; i++) out.push(stroke(petal((i / 8) * TAU, 0.5, 0.74, 0.13), 0, 1, true));
  out.push(stroke(circle(0.76), 1, 0.8, true));
  for (let i = 0; i < 16; i++) {
    out.push(stroke(petal(((i + 0.5) / 16) * TAU, 0.76, 0.96, 0.07), i % 2 ? 1 : 0, 1, true));
  }
  out.push(stroke(circle(0.98), 0, 1.1, true));
  out.push(...dots(16, 1.03, 0.014).map((dot) => ({ ...dot, colour: 1 as const })));
  return out;
}

/**
 * An alpona: a lotus in the middle, then a border of conch-shell curls (shankha lata)
 * running round between two rings, drawn in rice-paste white with a red line.
 */
function alpona(): Stroke[] {
  const out: Stroke[] = [];
  for (let i = 0; i < 8; i++) out.push(stroke(petal((i / 8) * TAU, 0.34, 0.7, 0.16), 0, 1.1, true));
  out.push(stroke(circle(0.74), 1, 0.9, true));
  out.push(stroke(circle(0.84), 0, 1.2, true));
  // The vine, then a curl at each crest
  const curls = 20;
  out.push(
    stroke(
      polar((t) => 0.91 + 0.035 * Math.sin(curls * t), curls * 14),
      0,
      1,
      true,
    ),
  );
  for (let i = 0; i < curls; i++) {
    const at = ((i + 0.25) / curls) * TAU;
    const cx = Math.cos(at) * 0.955;
    const cy = Math.sin(at) * 0.955;
    const spiral: number[] = [];
    for (let k = 0; k <= 24; k++) {
      const t = (k / 24) * TAU * 1.4;
      const r = 0.026 * (1 - k / 30);
      spiral.push(cx + Math.cos(t + at) * r, cy + Math.sin(t + at) * r);
    }
    out.push(stroke(spiral, 1, 0.8));
  }
  out.push(stroke(circle(1), 0, 1.2, true));
  return out;
}

/** Modern cards: a fine gold line drawn round twice, with a mark at each quarter. */
function frame(): Stroke[] {
  const marks = [0, 1, 2, 3].map((i) => {
    const at = (i / 4) * TAU + Math.PI / 2;
    const r = 0.95;
    const d = 0.03;
    const cx = Math.cos(at) * r;
    const cy = Math.sin(at) * r;
    return stroke([cx, cy + d, cx + d, cy, cx, cy - d, cx - d, cy, cx, cy + d], 0, 1, true);
  });
  return [
    stroke(circle(0.92, 128), 0, 0.8, true),
    stroke(circle(0.98, 128), 0, 0.5, true),
    ...marks,
  ];
}

const BUILDERS: Record<PatternId, () => Stroke[]> = { kolam, rangoli, alpona, frame };
const cache = new Map<PatternId, Stroke[]>();

/** The pattern's strokes in drawing order. */
export function patternStrokes(id: PatternId): Stroke[] {
  let strokes = cache.get(id);
  if (!strokes) {
    strokes = BUILDERS[id]();
    cache.set(id, strokes);
  }
  return strokes;
}

export function strokeLength(points: Float32Array): number {
  let length = 0;
  for (let i = 2; i < points.length; i += 2) {
    length += Math.hypot(points[i]! - points[i - 2]!, points[i + 1]! - points[i - 1]!);
  }
  return length;
}

/**
 * How much of each stroke is drawn at `progress` (0 to 1): strokes are drawn one after
 * another at a steady hand speed, so a long border takes longer than a dot.
 */
export function revealStrokes(strokes: readonly Stroke[], progress: number): number[] {
  const lengths = strokes.map((s) => strokeLength(s.points));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let ink = Math.max(0, Math.min(1, progress)) * total;
  return lengths.map((length) => {
    const drawn = Math.max(0, Math.min(length, ink));
    ink -= drawn;
    // Rounding can leave the last stroke a hair short of done
    const fraction = length > 0 ? drawn / length : 1;
    return fraction > 0.9999 ? 1 : fraction;
  });
}

/** One stroke as an SVG path (y flipped, so +y is up as in the 3D scene). */
export function strokePath(points: Float32Array, closed: boolean): string {
  let d = "";
  for (let i = 0; i < points.length; i += 2) {
    d += `${i ? "L" : "M"}${points[i]!.toFixed(4)} ${(-points[i + 1]!).toFixed(4)}`;
  }
  return closed ? `${d}Z` : d;
}
