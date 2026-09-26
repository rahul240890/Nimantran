import type { MotifId } from "@/lib/templates/schema";
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
import { arch, DOOR_TEXT, lamp, onDoor, seamX, type DoorSide, type Motif } from "./motif-kit";
import { RANG_MOTIFS } from "./rang-motifs";

export { arch, type DoorSide, type Motif };

/*
 * The ornament sets, one per design (the Rang family lives in rang-motifs.ts). Each says what is drawn on the inside of the card, on the front
 * and the lining of each door, and on the back, plus where the words may sit. Everything
 * is in face units (inside 100 × 80, door 50 × 80); see decor.ts.
 */

/* ---------- Marigold Gate: the Shubhdwar mandala ---------- */

function mandalaShapes(): Shape[] {
  const outer = ring(16, 0, (deg) => ellipse(...turn(0, -70, deg), 8.5, 16, deg));
  const inner = ring(12, 15, (deg) => ellipse(...turn(0, -36, deg), 6, 12, deg));
  const dots = ring(32, 0, (deg) => circle(...turn(0, -92, deg), 2));
  return [
    { d: circle(0, 0, 96), stroke: "gold", width: 2.5 },
    { d: circle(0, 0, 88), stroke: "gold", width: 1.2 },
    { d: circle(0, 0, 52), stroke: "gold", width: 2 },
    { d: circle(0, 0, 20), stroke: "gold", width: 2 },
    // A tint of colour inside each outer petal: ink on paper, not foil
    { d: outer, fill: "accent", opacity: 0.22, finish: "paper" },
    { d: outer, stroke: "gold", width: 2 },
    { d: inner, fill: "accent" },
    { d: dots, fill: "gold" },
    { d: circle(0, 0, 10), fill: "accent" },
  ];
}
const MANDALA = mandalaShapes();
/** A mandala `size` units across. */
const mandala = (x: number, y: number, size: number): Placement => ({
  at: [x, y],
  scale: size / 200,
  shapes: MANDALA,
});

const diamondDivider: Placement = {
  shapes: [
    { d: "M-13 0H-2.4M2.4 0H13", stroke: "gold", width: 0.28 },
    { d: "M0-1.3L1.3 0 0 1.3-1.3 0Z", fill: "gold" },
  ],
};

const marigold: Motif = {
  inside: [
    { items: [{ shapes: doubleBorder(100, 80, 2) }] },
    {
      // Quarter mandalas tucked into the corners
      clip: rect(4, 4, 92, 72),
      opacity: 0.55,
      items: [
        mandala(0, 0, 28.8),
        mandala(100, 0, 28.8),
        mandala(0, 80, 28.8),
        mandala(100, 80, 28.8),
      ],
    },
  ],
  textBox: { top: 9, bottom: 72, width: 70 },
  divider: diamondDivider,
  layout: "stacked",
  door: (side) => [
    // The border runs round the three outer edges, so the doors read as one design shut
    { items: [onDoor(side, [{ shapes: doubleBorder(100, 80, 2.8) }])] },
    // Half of the mandala on each door, meeting at the seam
    { items: [mandala(seamX(side), 40, 57.6)] },
  ],
  doorText: DOOR_TEXT,
  lining: [
    {
      pattern: {
        tile: [50 / 18, 50 / 18],
        items: [{ shapes: [{ d: circle(25 / 18, 25 / 18, 0.28), fill: "gold" }] }],
      },
    },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [mandala(50, 40, 22.4)] }],
};

/* ---------- Rose Garden: climbing roses ---------- */

/** A bloom one unit across: the flower, then its curling petals pressed into it. */
const ROSE: Shape[] = [
  { d: circle(0, 0, 1), fill: "gold", opacity: 0.92 },
  {
    d: "M-.62 .12C-.6-.5.38-.68.56-.12M-.3.5C.3.66.74.24.6-.28M-.22-.14C-.12-.42.3-.38.26-.02.22.26-.16.22-.12-.06",
    stroke: "paper",
    width: 0.1,
    opacity: 0.6,
    finish: "paper",
  },
];
/** A leaf one unit long, from its stem toward +x. Printed, not foiled. */
const LEAF: Shape[] = [
  { d: "M0 0C.28-.3.68-.32 1 0 .68.32.28.3 0 0Z", fill: "accent", finish: "ink" },
  { d: "M.06 0H.86", stroke: "paper", width: 0.05, opacity: 0.45, finish: "paper" },
];
const rose = (x: number, y: number, r: number): Placement => ({
  at: [x, y],
  scale: r,
  shapes: ROSE,
});
const leaf = (x: number, y: number, size: number, deg: number): Placement => ({
  at: [x, y],
  scale: size,
  rotate: deg,
  shapes: LEAF,
});

/** Roses climbing out of a corner, along the top edge and down the side. */
const roseSpray: Placement[] = [
  {
    shapes: [
      { d: "M3 34C4 18 14 7 38 3", stroke: "gold", width: 0.45, opacity: 0.7, finish: "ink" },
    ],
  },
  leaf(14.5, 4, 5, -30),
  leaf(24, 7.8, 4.5, 15),
  leaf(32, 5.8, 4, 8),
  leaf(4, 15, 5, 110),
  leaf(8.5, 24.5, 4.5, 60),
  leaf(2.8, 32, 4, 95),
  rose(27.5, 3.8, 2.2),
  rose(3.6, 28.5, 2.2),
  rose(20.5, 5.5, 3.6),
  rose(5.5, 21.5, 3.6),
  rose(9.5, 10.5, 5.2),
];

/** A ring of roses and leaves `radius` units round. */
function wreath(x: number, y: number, radius: number): Placement {
  const scale = radius / 15;
  const children: Placement[] = [
    { shapes: [{ d: circle(0, 0, 15), stroke: "gold", width: 0.35, opacity: 0.7, finish: "ink" }] },
  ];
  for (let i = 0; i < 8; i++) {
    const deg = i * 45 + 22.5;
    children.push(leaf(...turn(0, -15, deg), 4, deg - 70));
    children.push(leaf(...turn(0, -15, deg), 3.4, deg + 110));
  }
  for (let i = 0; i < 8; i++) children.push(rose(...turn(0, -15, i * 45), i % 2 ? 2 : 2.8));
  return { at: [x, y], scale, children };
}

const roses: Motif = {
  inside: [
    {
      items: [
        {
          shapes: [
            { d: rect(3, 3, 94, 74), stroke: "gold", width: 0.3, opacity: 0.85 },
            { d: rect(4.2, 4.2, 91.6, 71.6), stroke: "gold", width: 0.14, opacity: 0.6 },
          ],
        },
      ],
    },
    {
      items: [
        { at: [1.5, 1.5], scale: 0.72, children: roseSpray },
        { at: [98.5, 78.5], rotate: 180, scale: 0.72, children: roseSpray },
      ],
    },
  ],
  textBox: { top: 11, bottom: 70, width: 60 },
  divider: {
    children: [
      { shapes: [{ d: "M-13 0H-5.2M5.2 0H13", stroke: "gold", width: 0.22 }] },
      leaf(-1.4, 0, 3.4, 180),
      leaf(1.4, 0, 3.4, 0),
      rose(0, 0, 1.3),
    ],
  },
  layout: "stacked",
  door: (side) => [
    {
      items: [
        onDoor(side, [
          {
            shapes: [
              { d: rect(3, 3, 94, 74), stroke: "gold", width: 0.3, opacity: 0.85 },
              { d: rect(4.2, 4.2, 91.6, 71.6), stroke: "gold", width: 0.14, opacity: 0.6 },
            ],
          },
        ]),
      ],
    },
    { items: [wreath(seamX(side), 40, 17)] },
  ],
  doorText: DOOR_TEXT,
  lining: [
    {
      opacity: 0.8,
      pattern: {
        tile: [6, 6],
        items: [
          {
            shapes: [
              { d: "M0 0L6 6M6 0L0 6", stroke: "gold", width: 0.14, opacity: 0.5 },
              { d: circle(3, 3, 0.7), fill: "gold" },
            ],
          },
        ],
      },
    },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [wreath(50, 40, 9)] }],
};

/* ---------- Emerald Palace: a jaali arch ---------- */

/** Carved stone lattice: diamonds with a bead at each centre, one tile 5 units square. */
const JAALI: Placement[] = [
  {
    shapes: [
      { d: "M2.5 0L5 2.5 2.5 5 0 2.5Z", stroke: "gold", width: 0.16 },
      { d: circle(2.5, 2.5, 0.55), fill: "gold" },
    ],
  },
];

const palace: Motif = {
  inside: [
    { items: [{ shapes: doubleBorder(100, 80, 2) }] },
    {
      // Lattice in the spandrels, around the arch
      clip: rect(4, 4, 92, 72) + arch(50, 76, 32, 36, 6, true),
      clipEvenOdd: true,
      opacity: 0.5,
      pattern: { tile: [5, 5], items: JAALI },
    },
    {
      items: [
        {
          shapes: [
            { d: arch(50, 76, 32, 36, 6), stroke: "gold", width: 0.5 },
            { d: arch(50, 76, 30.4, 36.3, 9.2), stroke: "gold", width: 0.2 },
            { d: "M14 76H86", stroke: "gold", width: 0.4 },
          ],
        },
        // A small mandala hangs in the crown of the arch
        mandala(50, 16, 11),
      ],
    },
  ],
  textBox: { top: 24.5, bottom: 74, width: 58 },
  divider: {
    shapes: [
      { d: "M-13 0H-6M6 0H13", stroke: "gold", width: 0.22 },
      { d: "M0-1.2L1.2 0 0 1.2-1.2 0Z", fill: "gold" },
      { d: circle(-4, 0, 0.45) + circle(4, 0, 0.45), fill: "gold" },
    ],
  },
  layout: "stacked",
  door: (side) => {
    const cx = seamX(side);
    return [
      { items: [onDoor(side, [{ shapes: doubleBorder(100, 80, 2.8) }])] },
      // Shut, the doors make one tall arched doorway filled with lattice
      {
        clip: arch(cx, 77, 39.4, 39.3, 9.7, true),
        opacity: 0.45,
        pattern: { tile: [5, 5], items: JAALI },
      },
      {
        items: [
          {
            shapes: [
              { d: arch(cx, 77, 41, 39, 6.5), stroke: "gold", width: 0.6 },
              { d: arch(cx, 77, 39.4, 39.3, 9.7), stroke: "gold", width: 0.22 },
              // A plain medallion so the initial reads clearly over the lattice
              { d: circle(25, 68, 6.6), fill: "paper", finish: "paper" },
              { d: circle(25, 68, 6.6), stroke: "gold", width: 0.4 },
              { d: circle(25, 68, 5.7), stroke: "gold", width: 0.14 },
            ],
          },
        ],
      },
    ];
  },
  doorText: { label: 11, initial: { y: 68, size: 7 } },
  lining: [
    { opacity: 0.55, pattern: { tile: [5, 5], items: JAALI } },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [
    {
      items: [
        {
          shapes: [
            { d: arch(50, 58, 11, 42, 22), stroke: "gold", width: 0.5 },
            { d: arch(50, 58, 9.6, 42.2, 24.6), stroke: "gold", width: 0.18 },
            { d: "M44 58H56", stroke: "gold", width: 0.4 },
          ],
        },
      ],
    },
  ],
};

/* ---------- Royal Scroll: parchment on carved rods ---------- */

/** A turned wooden rod across the scroll, centred on `y`, with brass finials. */
function rod(y: number, shadowBelow: boolean): Shape[] {
  return [
    {
      d: rect(5, shadowBelow ? y + 2 : y - 3.2, 90, 1.2),
      fill: "ink",
      opacity: 0.1,
      finish: "paper",
    },
    {
      d: `M6 ${y - 2}H94A2 2 0 0 1 94 ${y + 2}H6A2 2 0 0 1 6 ${y - 2}Z`,
      fill: "gold",
      finish: "ink",
    },
    { d: rect(6, y - 1.25, 88, 0.6), fill: "paper", opacity: 0.35, finish: "paper" },
    { d: rect(6, y + 0.9, 88, 0.8), fill: "ink", opacity: 0.25, finish: "ink" },
    { d: circle(3.2, y, 2.4) + circle(96.8, y, 2.4), fill: "gold" },
    { d: circle(3.2, y, 0.9) + circle(96.8, y, 0.9), fill: "accent" },
  ];
}

/** A paisley (buta) about 13 units tall, curling to the upper right. */
const PAISLEY: Shape[] = [
  {
    d: "M0 6C-4.2 6-5 1.6-2.8-1.2C-1-3.6 1.8-5.4 4.6-6.4C3.2-4.6 3.6-2.6 4.2-.6C5 2.6 3.4 6 0 6Z",
    stroke: "gold",
    width: 0.45,
  },
  {
    d: "M.2 4C-2.2 4-2.8 1.5-1.5-.3C-.4-1.8 1.2-2.8 2.7-3.4C2-2 2.2-.8 2.6.4C3 2.4 2.1 4 .2 4Z",
    fill: "accent",
    opacity: 0.75,
    finish: "ink",
  },
  { d: circle(0.3, 1.4, 0.7), fill: "gold" },
];
const paisley = (x: number, y: number, scale: number, flipX = false, flipY = false): Placement => ({
  at: [x, y],
  scale,
  flipX,
  flipY,
  shapes: PAISLEY,
});

const n = (value: number) => Number(value.toFixed(2));

/** A lacquer seal with a small flower pressed into it. */
function sealShapes(): Shape[] {
  const points = Array.from({ length: 96 }, (_, i) => {
    const t = (i / 96) * Math.PI * 2;
    const r = 9 + 0.45 * Math.cos(t * 16);
    return `${n(Math.cos(t) * r)} ${n(Math.sin(t) * r)}`;
  });
  return [
    { d: `M${points.join("L")}Z`, fill: "accent" },
    { d: circle(0, 0, 6.4), stroke: "paper", width: 0.3, opacity: 0.5, finish: "paper" },
    {
      d: ring(8, 0, (deg) => ellipse(...turn(0, -3, deg), 1.1, 2.4, deg)) + circle(0, 0, 0.9),
      fill: "paper",
      opacity: 0.55,
      finish: "paper",
    },
  ];
}
const SEAL = sealShapes();

const scroll: Motif = {
  inside: [
    {
      items: [
        {
          shapes: [
            { d: "M8 8V72M92 8V72", stroke: "gold", width: 0.28, opacity: 0.55 },
            { d: "M9.4 8V72M90.6 8V72", stroke: "gold", width: 0.12, opacity: 0.45 },
            ...rod(3.8, true),
            ...rod(76.2, false),
          ],
        },
        paisley(14, 13.5, 0.65),
        paisley(86, 13.5, 0.65, true),
        paisley(14, 66.5, 0.65, false, true),
        paisley(86, 66.5, 0.65, true, true),
      ],
    },
  ],
  textBox: { top: 9.5, bottom: 70.5, width: 58 },
  divider: {
    shapes: [
      { d: "M-15 0H15", stroke: "gold", width: 0.25 },
      { d: circle(0, 0, 0.8), fill: "accent" },
      { d: circle(-17, 0, 0.4) + circle(17, 0, 0.4), fill: "gold" },
    ],
  },
  layout: "stacked",
  door: (side) => {
    const outer = side === "left" ? 9.5 : 40.5;
    const flip = side === "right";
    return [
      {
        items: [
          onDoor(side, [
            {
              shapes: [
                { d: rect(3.5, 3.5, 93, 73), stroke: "gold", width: 0.3 },
                // A red thread tied round the folded card
                { d: "M0 39.3H100M0 40.7H100", stroke: "accent", width: 0.3, finish: "ink" },
              ],
            },
          ]),
          paisley(outer, 13, 0.8, flip),
          paisley(outer, 67, 0.8, flip, true),
          { at: [seamX(side), 40], shapes: SEAL },
        ],
      },
    ];
  },
  doorText: DOOR_TEXT,
  lining: [
    {
      opacity: 0.6,
      pattern: { tile: [8, 9], items: [paisley(4, 4.5, 0.32)] },
    },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [{ at: [50, 40], scale: 0.8, shapes: SEAL }] }],
};

/* ---------- Minimal Monogram: restraint ---------- */

const monogram: Motif = {
  inside: [
    { items: [{ shapes: [{ d: rect(5.6, 5.6, 88.8, 68.8), stroke: "gold", width: 0.22 }] }] },
  ],
  textBox: { top: 10, bottom: 70, width: 70 },
  divider: { shapes: [{ d: "M-4 0H4", stroke: "gold", width: 0.2 }] },
  layout: "monogram",
  door: (side) => [
    {
      items: [
        onDoor(side, [
          { shapes: [{ d: rect(5.6, 5.6, 88.8, 68.8), stroke: "gold", width: 0.22 }] },
        ]),
        { shapes: [{ d: "M21 57H29", stroke: "gold", width: 0.2 }] },
      ],
    },
  ],
  doorText: { label: null, initial: { y: 44, size: 24, ink: "ink" } },
  lining: [{ items: [{ shapes: [{ d: rect(3, 3, 44, 74), stroke: "gold", width: 0.15 }] }] }],
  back: [{ items: [{ shapes: [{ d: "M50 37L53 40 50 43 47 40Z", stroke: "gold", width: 0.2 }] }] }],
};

/* ---------- Kerala Kasavu: the gold border of a mundu, and brass lamps ---------- */

/** A kasavu band `length` long and 5.6 deep: gold, woven zari, a kumkum line, gold. */
function band(length: number): Shape[] {
  let stripes = "";
  for (let x = 0.35; x < length - 0.5; x += 1.6) stripes += rect(x, 1.6, 0.9, 2);
  return [
    { d: rect(0, 0, length, 1), fill: "gold" },
    { d: stripes, fill: "gold", opacity: 0.85 },
    { d: rect(0, 4, length, 0.35), fill: "accent", finish: "ink" },
    { d: rect(0, 4.6, length, 1), fill: "gold" },
  ];
}
const bandAcross = (y: number, length: number, flip = false): Placement => ({
  at: [0, flip ? y + 5.6 : y],
  flipY: flip,
  shapes: band(length),
});
/** A band running down a door, its gold edge on the left of x. */
const bandDown = (x: number, flip = false): Placement =>
  flip
    ? { at: [x, 0], rotate: 90, flipY: true, shapes: band(80) }
    : { at: [x + 5.6, 0], rotate: 90, shapes: band(80) };

const kasavu: Motif = {
  inside: [
    {
      items: [
        bandAcross(4.4, 100),
        bandAcross(70, 100, true),
        lamp(10, 63, 0.95),
        lamp(90, 63, 0.95),
      ],
    },
  ],
  textBox: { top: 13, bottom: 67, width: 64 },
  divider: {
    shapes: [
      { d: "M-12 0H-3M3 0H12", stroke: "gold", width: 0.35 },
      { d: "M0-1.4L1.4 0 0 1.4-1.4 0Z", fill: "accent" },
    ],
  },
  layout: "stacked",
  door: (side) => [
    {
      items:
        side === "left"
          ? [bandDown(0.6), bandDown(44.4, true), lamp(25.3, 57, 1.2)]
          : [bandDown(0, false), bandDown(43.8, true), lamp(24.7, 57, 1.2)],
    },
  ],
  doorText: DOOR_TEXT,
  lining: [
    {
      opacity: 0.8,
      pattern: { tile: [4, 4], items: [{ shapes: [{ d: circle(2, 2, 0.32), fill: "gold" }] }] },
    },
    { items: [{ shapes: [{ d: rect(2.5, 2.5, 45, 75), stroke: "gold", width: 0.3 }] }] },
  ],
  back: [{ items: [lamp(50, 54, 0.8)] }],
};

export const MOTIFS: Record<MotifId, Motif> = {
  mandala: marigold,
  roses,
  palace,
  scroll,
  monogram,
  kasavu,
  ...RANG_MOTIFS,
};
