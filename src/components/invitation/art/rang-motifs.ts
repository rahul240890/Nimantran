import {
  circle,
  doubleBorder,
  ellipse,
  rect,
  ring,
  turn,
  type Placement,
  type Shape,
} from "./decor";
import { arch, DOOR_TEXT, lamp, onDoor, seamX, type Motif } from "./motif-kit";

/*
 * The Rang family: six bright regional designs (TRADITIONS.md, section 6). Every shape is
 * drawn here from geometry, never traced from anyone's artwork. Faces are in the same
 * units as the launch designs (inside 100 × 80, door 50 × 80), and each design also has
 * a portrait cover (80 × 100) for the design pickers.
 */

const n = (value: number) => Number(value.toFixed(2));

/**
 * A frame `depth` deep inside a width × height face. The inner edge winds the other way,
 * so the band fills (or clips) the same under either fill rule.
 */
const frame = (width: number, height: number, inset: number, depth: number) => {
  const inner = inset + depth;
  const w = width - inner * 2;
  const h = height - inner * 2;
  return (
    rect(inset, inset, width - inset * 2, height - inset * 2) +
    `M${n(inner)} ${n(inner)}v${n(h)}h${n(w)}v${n(-h)}Z`
  );
};

/** A pointed petal `length` long and `width` wide, turned `deg` clockwise and pushed out
 * `from` units from the centre. */
function petalAt(length: number, width: number, from: number, deg: number): string {
  const w = width / 2;
  const p = (x: number, y: number) =>
    turn(x, y - from, deg)
      .map(n)
      .join(" ");
  return (
    `M${p(0, 0)}C${p(-w, -length * 0.35)} ${p(-w * 0.6, -length * 0.8)} ${p(0, -length)}` +
    `C${p(w * 0.6, -length * 0.8)} ${p(w, -length * 0.35)} ${p(0, 0)}Z`
  );
}

const lines = (d: string, width: number, opacity = 1): Shape => ({
  d,
  stroke: "gold",
  width,
  opacity,
});

/* ---------- Rang Mahal: meenakari rosettes and palace jharokhas ---------- */

/** An enamelled rosette one unit across: turquoise petals set in gold. */
function rosetteShapes(): Shape[] {
  const petals = ring(8, 0, (deg) => petalAt(0.62, 0.36, 0.18, deg));
  return [
    { d: petals, fill: "accent", finish: "ink" },
    { d: petals, stroke: "gold", width: 0.05 },
    { d: circle(0, 0, 0.2), fill: "gold" },
    { d: ring(8, 22.5, (deg) => circle(...turn(0, -0.68, deg), 0.07)), fill: "gold" },
  ];
}
const ROSETTE = rosetteShapes();
const rosette = (x: number, y: number, size: number): Placement => ({
  at: [x, y],
  scale: size / 1.6,
  shapes: ROSETTE,
});

/** A row of rosettes between two gold rules, centred on `y`. */
function rosetteRow(y: number, from: number, to: number, gap: number): Placement {
  const children: Placement[] = [];
  for (let x = from; x <= to + 0.01; x += gap) children.push(rosette(x, y, 3.2));
  return {
    shapes: [lines(`M${from - 2} ${y - 2.4}H${to + 2}M${from - 2} ${y + 2.4}H${to + 2}`, 0.2)],
    children,
  };
}

/** Drops of pearls hanging from the crown of an arch. */
const tassel = (x: number, y: number, length: number): Placement => ({
  at: [x, y],
  shapes: [
    lines(`M0 0V${length}`, 0.14, 0.8),
    { d: circle(0, length + 0.7, 0.7), fill: "gold" },
    { d: ellipse(0, length + 2.4, 0.5, 0.9), fill: "accent", finish: "ink" },
  ],
});

const jharokha: Motif = {
  inside: [
    { items: [{ shapes: doubleBorder(100, 80, 2) }] },
    { items: [rosetteRow(8.6, 12, 88, 7.6), rosetteRow(71.4, 12, 88, 7.6)] },
    {
      items: [
        {
          shapes: [
            lines(arch(50, 67, 32, 34, 11), 0.45),
            lines(arch(50, 67, 30.6, 34.2, 13.6), 0.16, 0.8),
          ],
        },
        rosette(50, 15.6, 4),
      ],
    },
  ],
  textBox: { top: 20.5, bottom: 67, width: 60 },
  divider: {
    shapes: [lines("M-13 0H-3.4M3.4 0H13", 0.24)],
    children: [rosette(0, 0, 3.4)],
  },
  layout: "stacked",
  door: (side) => {
    const cx = 25;
    return [
      { items: [onDoor(side, [{ shapes: doubleBorder(100, 80, 2.8) }])] },
      // A jharokha window on each door, filled with a lattice of small rosettes
      {
        clip: arch(cx, 58, 15.4, 34, 19, true),
        opacity: 0.5,
        pattern: { tile: [5, 5], items: [rosette(2.5, 2.5, 2.6)] },
      },
      {
        items: [
          {
            shapes: [
              lines(arch(cx, 58, 17, 34, 16), 0.5),
              lines(arch(cx, 58, 15.4, 34.2, 19), 0.18),
              lines(`M${cx - 19} 58H${cx + 19}M${cx - 19} 59.4H${cx + 19}`, 0.3),
              // A plain medallion so the initial reads clearly
              { d: circle(cx, 69.2, 6.4), fill: "paper", finish: "paper" },
              { d: circle(cx, 69.2, 6.4), stroke: "gold", width: 0.4 },
            ],
          },
          { at: [seamX(side), 40], children: [rosette(0, 0, 7)] },
        ],
      },
    ];
  },
  doorText: { label: 11, initial: { y: 69.2, size: 7 } },
  lining: [
    { opacity: 0.7, pattern: { tile: [7, 7], items: [rosette(3.5, 3.5, 3)] } },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [rosette(50, 40, 16)] }],
  cover: {
    layers: [
      { items: [{ shapes: doubleBorder(80, 100, 3) }] },
      { items: [rosetteRow(10, 14, 66, 6.5), rosetteRow(90, 14, 66, 6.5)] },
      {
        items: [
          { shapes: [lines(arch(40, 84, 27, 40, 17), 0.5)] },
          rosette(40, 26, 6),
          tassel(31, 29, 3),
          tassel(49, 29, 3),
        ],
      },
    ],
    textBox: { top: 36, bottom: 82 },
  },
};

/* ---------- Paithani Mor: peacock-feather eyes and a temple border ---------- */

/** A peacock feather one unit long, from its quill at (0, 0) up to its eye. */
const FEATHER: Shape[] = [
  {
    d: "M0 0C-.3-.28-.36-.72 0-1 .36-.72.3-.28 0 0Z",
    fill: "accent",
    opacity: 0.35,
    finish: "paper",
  },
  { d: "M0 0C-.3-.28-.36-.72 0-1 .36-.72.3-.28 0 0Z", stroke: "accent", width: 0.02 },
  { d: "M0 0V-.56", stroke: "gold", width: 0.025 },
  { d: ellipse(0, -0.72, 0.17, 0.22), fill: "gold" },
  { d: ellipse(0, -0.7, 0.11, 0.15), fill: "accent" },
  { d: ellipse(0, -0.69, 0.055, 0.085), fill: "ink", finish: "ink" },
];
const feather = (x: number, y: number, length: number, deg: number): Placement => ({
  at: [x, y],
  scale: length,
  rotate: deg,
  shapes: FEATHER,
});

/** A fan of `count` feathers spread across `spread` degrees, rising from (x, y). */
function fan(x: number, y: number, length: number, count: number, spread: number): Placement {
  const children: Placement[] = [];
  for (let i = 0; i < count; i++) {
    const deg = count === 1 ? 0 : -spread / 2 + (i * spread) / (count - 1);
    const reach = 1 - Math.abs(deg / spread) * 0.35;
    children.push(feather(0, 0, length * reach, deg));
  }
  return { at: [x, y], children };
}

/** The kangura border of a Paithani sari: gold temple teeth along a rule. */
function teeth(length: number, size: number): Shape[] {
  let d = "";
  for (let x = 0; x + size <= length + 0.01; x += size) {
    d += `M${n(x)} 0L${n(x + size / 2)} ${n(-size * 0.9)}L${n(x + size)} 0Z`;
  }
  return [
    { d, fill: "gold" },
    { d: rect(0, 0, length, 0.5), fill: "gold" },
    { d: rect(0, 1.2, length, 0.25), fill: "accent" },
  ];
}
const teethAcross = (x: number, y: number, length: number, size: number, flip = false) => ({
  at: [x, y] as const,
  flipY: flip,
  shapes: teeth(length, size),
});

const peacock: Motif = {
  inside: [
    { items: [{ shapes: doubleBorder(100, 80, 2) }] },
    { items: [teethAcross(6, 10, 88, 3.2, true), teethAcross(6, 70, 88, 3.2)] },
    {
      items: [
        fan(8, 21, 11, 3, 70),
        { at: [92, 21], flipX: true, children: [fan(0, 0, 11, 3, 70)] },
        { at: [8, 59], flipY: true, children: [fan(0, 0, 11, 3, 70)] },
        { at: [92, 59], flipX: true, flipY: true, children: [fan(0, 0, 11, 3, 70)] },
      ],
    },
  ],
  textBox: { top: 14, bottom: 66, width: 60 },
  divider: {
    shapes: [lines("M-13 0H-2.6M2.6 0H13", 0.22)],
    children: [feather(-1.4, 0, 3.4, -90), feather(1.4, 0, 3.4, 90)],
  },
  layout: "stacked",
  door: (side) => [
    {
      items: [
        onDoor(side, [
          { shapes: doubleBorder(100, 80, 2.8) },
          teethAcross(6.5, 18, 87, 3.2, true),
          teethAcross(6.5, 62, 87, 3.2),
        ]),
      ],
    },
    // A full fan of feathers opens across the seam
    { items: [{ at: [seamX(side), 0], children: [fan(0, 58, 36, 9, 150)] }] },
    {
      items: [
        {
          shapes: [
            { d: circle(25, 69.2, 5.6), fill: "paper", finish: "paper" },
            { d: circle(25, 69.2, 5.6), stroke: "gold", width: 0.35 },
          ],
        },
      ],
    },
  ],
  doorText: { label: 11, initial: { y: 69.2, size: 6.6 } },
  lining: [
    { opacity: 0.75, pattern: { tile: [8, 10], items: [feather(4, 8.6, 7, 0)] } },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [fan(50, 52, 18, 7, 120)] }],
  cover: {
    layers: [
      { items: [{ shapes: doubleBorder(80, 100, 3) }] },
      { items: [teethAcross(7, 11, 66, 3.3, true), teethAcross(7, 89, 66, 3.3)] },
      { items: [fan(40, 36, 20, 7, 130)] },
    ],
    textBox: { top: 40, bottom: 84 },
  },
};

/* ---------- Bandhani Utsav: tie-dye dots and mirror-work ---------- */

/** One tie of bandhani: four dots round a fifth, 1.2 units across. */
const DOTS: Shape[] = [
  {
    d: ring(4, 45, (deg) => circle(...turn(0, -0.42, deg), 0.16)) + circle(0, 0, 0.14),
    fill: "gold",
  },
];
const dots = (x: number, y: number, size: number): Placement => ({
  at: [x, y],
  scale: size,
  shapes: DOTS,
});

/** A round mirror stitched on with a ring of thread and a ring of dots, one unit across. */
const MIRROR: Shape[] = [
  { d: ring(14, 0, (deg) => circle(...turn(0, -0.62, deg), 0.06)), fill: "gold" },
  { d: circle(0, 0, 0.5), stroke: "gold", width: 0.07 },
  { d: circle(0, 0, 0.42), fill: "accent" },
  { d: ellipse(-0.12, -0.14, 0.12, 0.2, -35), fill: "paper", opacity: 0.55, finish: "paper" },
];
const mirror = (x: number, y: number, size: number): Placement => ({
  at: [x, y],
  scale: size,
  shapes: MIRROR,
});

/** Rings of ties round a mirror: the medallion at the heart of an odhni. */
function medallion(x: number, y: number, radius: number): Placement {
  const children: Placement[] = [mirror(0, 0, radius * 0.5)];
  const rings: [number, number][] = [
    [0.52, 10],
    [0.74, 16],
    [0.96, 22],
  ];
  for (const [r, count] of rings) {
    for (let i = 0; i < count; i++) {
      children.push(dots(...turn(0, -radius * r, (i * 360) / count), radius * 0.1));
    }
  }
  return {
    at: [x, y],
    shapes: [lines(circle(0, 0, radius * 1.08), 0.25, 0.8)],
    children,
  };
}

const DOT_TILE: Placement[] = [dots(2, 2, 1.6)];

const bandhani: Motif = {
  inside: [
    { clip: frame(100, 80, 2, 7), clipEvenOdd: true, pattern: { tile: [4, 4], items: DOT_TILE } },
    {
      items: [
        {
          shapes: [
            lines(rect(2, 2, 96, 76), 0.4),
            lines(rect(9, 9, 82, 62), 0.3),
            lines(rect(10.2, 10.2, 79.6, 59.6), 0.12, 0.8),
          ],
        },
        mirror(5.5, 5.5, 5.6),
        mirror(94.5, 5.5, 5.6),
        mirror(5.5, 74.5, 5.6),
        mirror(94.5, 74.5, 5.6),
        mirror(50, 5.5, 5),
        mirror(50, 74.5, 5),
      ],
    },
  ],
  textBox: { top: 13, bottom: 67, width: 66 },
  divider: {
    shapes: [lines("M-13 0H-3M3 0H13", 0.22)],
    children: [mirror(0, 0, 3.4), dots(-6, 0, 1.4), dots(6, 0, 1.4)],
  },
  layout: "stacked",
  door: (side) => [
    {
      clip: frame(50, 80, 2.8, 6),
      clipEvenOdd: true,
      pattern: { tile: [4, 4], items: DOT_TILE },
    },
    {
      items: [
        {
          shapes: [lines(rect(2.8, 2.8, 44.4, 74.4), 0.4), lines(rect(8.8, 8.8, 32.4, 62.4), 0.25)],
        },
        { at: [seamX(side), 38], children: [medallion(0, 0, 17)] },
        {
          shapes: [
            { d: circle(25, 69.2, 5.4), fill: "paper", finish: "paper" },
            { d: circle(25, 69.2, 5.4), stroke: "gold", width: 0.35 },
          ],
        },
      ],
    },
  ],
  doorText: { label: 15, initial: { y: 69.2, size: 6.4 } },
  lining: [
    { pattern: { tile: [4, 4], items: DOT_TILE } },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [medallion(50, 40, 13)] }],
  cover: {
    layers: [
      {
        clip: frame(80, 100, 3, 7),
        clipEvenOdd: true,
        pattern: { tile: [4, 4], items: DOT_TILE },
      },
      {
        items: [
          { shapes: [lines(rect(3, 3, 74, 94), 0.4), lines(rect(10, 10, 60, 80), 0.3)] },
          medallion(40, 28, 12),
        ],
      },
    ],
    textBox: { top: 46, bottom: 86 },
  },
};

/* ---------- Alpona Lal: a red-bordered sari and an alpona lotus ---------- */

/** An alpona lotus one unit across: two rings of petals, dotted circles and a seed head. */
function lotusShapes(): Shape[] {
  const outer = ring(12, 0, (deg) => petalAt(0.4, 0.2, 0.52, deg));
  const inner = ring(12, 15, (deg) => petalAt(0.26, 0.16, 0.26, deg));
  return [
    { d: circle(0, 0, 0.98), stroke: "gold", width: 0.025 },
    { d: ring(36, 0, (deg) => circle(...turn(0, -0.98, deg), 0.018)), fill: "gold" },
    { d: outer, fill: "gold", opacity: 0.2, finish: "paper" },
    { d: outer, stroke: "gold", width: 0.03 },
    { d: circle(0, 0, 0.5), stroke: "gold", width: 0.025 },
    { d: inner, fill: "gold" },
    { d: circle(0, 0, 0.2), fill: "accent" },
    { d: ring(6, 0, (deg) => circle(...turn(0, -0.1, deg), 0.03)), fill: "paper", finish: "paper" },
  ];
}
const LOTUS = lotusShapes();
const lotus = (x: number, y: number, size: number): Placement => ({
  at: [x, y],
  scale: size / 2,
  shapes: LOTUS,
});

/** The laal paar: a broad red border with a fine gold line inside it. */
const laalPaar = (width: number, height: number, inset: number, depth: number): Shape[] => [
  { d: frame(width, height, inset, depth), fill: "gold", finish: "ink" },
  {
    d: rect(
      inset + depth + 1,
      inset + depth + 1,
      width - (inset + depth + 1) * 2,
      height - (inset + depth + 1) * 2,
    ),
    stroke: "accent",
    width: 0.3,
  },
];

/** A row of rice-paste dots, the alpona's edging. */
function dotted(x1: number, x2: number, y: number, gap: number): Shape {
  let d = "";
  for (let x = x1; x <= x2 + 0.01; x += gap) d += circle(x, y, 0.32);
  return { d, fill: "gold" };
}

const alpona: Motif = {
  inside: [
    { items: [{ shapes: laalPaar(100, 80, 0, 3.2) }] },
    {
      // Half a lotus rising from the top and bottom borders
      clip: rect(3.2, 3.2, 93.6, 73.6),
      items: [
        lotus(50, 3.2, 20),
        lotus(50, 76.8, 20),
        {
          shapes: [
            dotted(10, 38, 7, 2),
            dotted(62, 90, 7, 2),
            dotted(10, 38, 73, 2),
            dotted(62, 90, 73, 2),
          ],
        },
      ],
    },
  ],
  textBox: { top: 16, bottom: 64, width: 66 },
  divider: {
    shapes: [lines("M-13 0H-3M3 0H13", 0.22)],
    children: [lotus(0, 0, 4.6)],
  },
  layout: "stacked",
  door: (side) => [
    { items: [onDoor(side, [{ shapes: laalPaar(100, 80, 0, 4) }])] },
    { items: [{ at: [seamX(side), 38], children: [lotus(0, 0, 38)] }] },
    {
      items: [
        {
          shapes: [
            { d: circle(25, 69.2, 5.6), fill: "paper", finish: "paper" },
            { d: circle(25, 69.2, 5.6), stroke: "gold", width: 0.35 },
          ],
        },
      ],
    },
  ],
  doorText: { label: 11.5, initial: { y: 69.2, size: 6.6 } },
  lining: [
    { opacity: 0.8, pattern: { tile: [9, 9], items: [lotus(4.5, 4.5, 5)] } },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [lotus(50, 40, 26)] }],
  cover: {
    layers: [
      { items: [{ shapes: laalPaar(80, 100, 0, 3.6) }] },
      { clip: rect(3.6, 3.6, 72.8, 92.8), items: [lotus(40, 3.6, 30), lotus(40, 96.4, 22)] },
    ],
    textBox: { top: 26, bottom: 82 },
  },
};

/* ---------- Gopuram Pon: temple towers, kolam and brass lamps ---------- */

/** A temple gopuram `height` tall standing on (0, 0): tiers narrowing to a barrel roof. */
function gopuram(height: number): Shape[] {
  const tiers = 5;
  const tierH = (height * 0.68) / tiers;
  const base = height * 0.52;
  let body = "";
  let rules = "";
  for (let i = 0; i < tiers; i++) {
    const w = base * (1 - i * 0.14);
    const y = -i * tierH;
    const top = base * (1 - (i + 1) * 0.14);
    body += `M${n(-w / 2)} ${n(y)}L${n(-top / 2)} ${n(y - tierH)}H${n(top / 2)}L${n(w / 2)} ${n(y)}Z`;
    rules += `M${n(-w / 2)} ${n(y - 0.15)}H${n(w / 2)}`;
    // Niches along each tier
    for (let k = -2; k <= 2; k++) {
      const x = (k * top) / 5.2;
      rules += `M${n(x)} ${n(y - tierH * 0.2)}V${n(y - tierH * 0.75)}`;
    }
  }
  const roofY = -tiers * tierH;
  const roofW = base * (1 - tiers * 0.14);
  const roof = `M${n(-roofW / 2 - 0.6)} ${n(roofY)}C${n(-roofW / 2)} ${n(roofY - height * 0.16)} ${n(roofW / 2)} ${n(roofY - height * 0.16)} ${n(roofW / 2 + 0.6)} ${n(roofY)}Z`;
  const kalash = [-1, 0, 1]
    .map((k) => circle(k * roofW * 0.3, roofY - height * 0.14, height * 0.018))
    .join("");
  return [
    { d: body + roof, fill: "paper", finish: "paper" },
    { d: body + roof, stroke: "gold", width: height * 0.012 },
    { d: rules, stroke: "gold", width: height * 0.006, opacity: 0.8 },
    { d: kalash, fill: "gold" },
    {
      d: `M${n(-base * 0.1)} 0V${n(-tierH * 0.8)}A${n(base * 0.1)} ${n(base * 0.1)} 0 0 1 ${n(base * 0.1)} ${n(-tierH * 0.8)}V0Z`,
      fill: "accent",
      finish: "ink",
    },
  ];
}
const tower = (x: number, y: number, height: number): Placement => ({
  at: [x, y],
  shapes: gopuram(height),
});

/** A line of kolam: dots with a looping line woven round them. */
function kolamBand(x1: number, x2: number, y: number, gap: number): Shape[] {
  let points = "";
  let loops = "";
  for (let x = x1; x <= x2 + 0.01; x += gap) {
    points += circle(x, y, 0.3);
    loops += ellipse(x, y, gap * 0.52, gap * 0.36);
  }
  return [
    { d: loops, stroke: "gold", width: 0.18 },
    { d: points, fill: "accent" },
  ];
}

const KOLAM_TILE: Placement[] = [
  {
    shapes: [
      { d: circle(3, 3, 0.35), fill: "gold" },
      { d: "M3 .6C4.6 1.6 4.6 4.4 3 5.4 1.4 4.4 1.4 1.6 3 .6Z", stroke: "gold", width: 0.14 },
      { d: "M.6 3C1.6 1.4 4.4 1.4 5.4 3 4.4 4.6 1.6 4.6.6 3Z", stroke: "gold", width: 0.14 },
    ],
  },
];

const templeGold: Motif = {
  inside: [
    { items: [{ shapes: doubleBorder(100, 80, 2) }] },
    { items: [{ shapes: [...kolamBand(10, 90, 8.4, 4), ...kolamBand(10, 90, 71.6, 4)] }] },
    { items: [lamp(9.5, 64, 0.72), lamp(90.5, 64, 0.72)] },
  ],
  textBox: { top: 14, bottom: 66, width: 62 },
  divider: {
    shapes: [
      lines("M-13 0H-3M3 0H13", 0.22),
      { d: "M0-1.5L1.5 0 0 1.5-1.5 0Z", fill: "accent" },
      { d: circle(-5, 0, 0.45) + circle(5, 0, 0.45), fill: "gold" },
    ],
  },
  layout: "stacked",
  door: (side) => [
    { items: [onDoor(side, [{ shapes: doubleBorder(100, 80, 2.8) }])] },
    { opacity: 0.4, clip: rect(5, 5, 40, 70), pattern: { tile: [6, 6], items: KOLAM_TILE } },
    {
      items: [
        tower(25, 60, 40),
        {
          shapes: [
            lines("M8 60.4H42", 0.4),
            { d: circle(25, 69.2, 5.6), fill: "paper", finish: "paper" },
            { d: circle(25, 69.2, 5.6), stroke: "gold", width: 0.35 },
          ],
        },
      ],
    },
  ],
  doorText: DOOR_TEXT,
  lining: [
    { opacity: 0.75, pattern: { tile: [6, 6], items: KOLAM_TILE } },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [tower(50, 56, 30)] }],
  cover: {
    layers: [
      { items: [{ shapes: doubleBorder(80, 100, 3) }] },
      { items: [tower(40, 38, 28), { shapes: kolamBand(10, 70, 91, 4) }] },
    ],
    textBox: { top: 42, bottom: 86 },
  },
};

/* ---------- Phulkari Rang: silk-floss embroidery on red khaddar ---------- */

/** A phulkari diamond one unit across: gold floss round an orange heart, stitched lines. */
const DIAMOND: Shape[] = [
  { d: "M0-.5L.5 0 0 .5-.5 0Z", fill: "gold" },
  { d: "M0-.28L.28 0 0 .28-.28 0Z", fill: "accent" },
  {
    d: "M-.25-.25L.25.25M.25-.25L-.25.25",
    stroke: "paper",
    width: 0.03,
    opacity: 0.45,
    finish: "paper",
  },
];
const diamond = (x: number, y: number, size: number): Placement => ({
  at: [x, y],
  scale: size,
  shapes: DIAMOND,
});

/** An eight-pointed star of two squares, the bagh's centrepiece, one unit across. */
function starShapes(): Shape[] {
  const square = (deg: number, r: number) =>
    `M${[0, 90, 180, 270]
      .map((a) =>
        turn(0, -r, a + deg)
          .map(n)
          .join(" "),
      )
      .join("L")}Z`;
  return [
    { d: square(0, 0.5) + square(45, 0.5), fill: "gold" },
    { d: square(22.5, 0.27), fill: "accent" },
    { d: circle(0, 0, 0.1), fill: "paper", finish: "paper" },
  ];
}
const STAR = starShapes();
const star = (x: number, y: number, size: number): Placement => ({
  at: [x, y],
  scale: size,
  shapes: STAR,
});

/** A band of chope triangles, the embroidered ends of a dupatta. */
function chope(x1: number, x2: number, y: number, size: number, up: boolean): Shape[] {
  let gold = "";
  let heart = "";
  const s = up ? -1 : 1;
  for (let x = x1; x + size <= x2 + 0.01; x += size) {
    gold += `M${n(x)} ${n(y)}L${n(x + size / 2)} ${n(y + s * size)}L${n(x + size)} ${n(y)}Z`;
    heart += `M${n(x + size * 0.3)} ${n(y + s * size * 0.2)}L${n(x + size / 2)} ${n(y + s * size * 0.6)}L${n(x + size * 0.7)} ${n(y + s * size * 0.2)}Z`;
  }
  return [{ d: gold, fill: "gold" }, { d: heart, fill: "accent" }, lines(`M${x1} ${y}H${x2}`, 0.3)];
}

const LATTICE: Placement[] = [
  diamond(3, 3, 3.4),
  diamond(0, 0, 3.4),
  diamond(6, 0, 3.4),
  diamond(0, 6, 3.4),
  diamond(6, 6, 3.4),
];

const phulkari: Motif = {
  inside: [
    { items: [{ shapes: doubleBorder(100, 80, 2) }] },
    {
      items: [
        { shapes: [...chope(6, 94, 6, 4, false), ...chope(6, 94, 74, 4, true)] },
        star(8, 40, 5),
        star(92, 40, 5),
      ],
    },
  ],
  textBox: { top: 14, bottom: 66, width: 64 },
  divider: {
    shapes: [lines("M-13 0H-3M3 0H13", 0.22)],
    children: [star(0, 0, 3.2)],
  },
  layout: "stacked",
  door: (side) => [
    { items: [onDoor(side, [{ shapes: doubleBorder(100, 80, 2.8) }])] },
    // The bagh: embroidery covering the cloth, leaving room for the words
    { clip: rect(5.6, 17, 38.8, 44), opacity: 0.8, pattern: { tile: [6, 6], items: LATTICE } },
    {
      items: [
        { shapes: [lines("M5.6 17H44.4M5.6 61H44.4", 0.35)] },
        { at: [seamX(side), 39], children: [star(0, 0, 16)] },
        {
          shapes: [
            { d: circle(25, 69.2, 5.6), fill: "paper", finish: "paper" },
            { d: circle(25, 69.2, 5.6), stroke: "gold", width: 0.35 },
          ],
        },
      ],
    },
  ],
  doorText: DOOR_TEXT,
  lining: [
    { opacity: 0.85, pattern: { tile: [6, 6], items: LATTICE } },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [star(50, 40, 14)] }],
  cover: {
    layers: [
      { items: [{ shapes: doubleBorder(80, 100, 3) }] },
      {
        items: [
          { shapes: [...chope(7, 73, 7, 4.4, false), ...chope(7, 73, 93, 4.4, true)] },
          star(40, 27, 12),
        ],
      },
    ],
    textBox: { top: 40, bottom: 86 },
  },
};

export const RANG_MOTIFS = {
  jharokha,
  peacock,
  bandhani,
  alpona,
  gopuram: templeGold,
  phulkari,
} satisfies Record<string, Motif>;
