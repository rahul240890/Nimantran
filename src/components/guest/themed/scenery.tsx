import type { CSSProperties } from "react";
import { patternStrokes, strokeLength, strokePath } from "@/lib/engine/patterns";
import type { GuestFlower, GuestLamp, GuestPattern } from "@/lib/suites/guest-look";
import { Bloom } from "./flowers";

/*
 * The scenery of the themed guest page: a palace skyline and palms by the water, a
 * houseboat, the floor pattern round the date, and the lamps the guest lights. All drawn
 * in the theme's own colours (the suite and guest tokens in globals.css).
 */

const GILT = "var(--guest-gilt)";
const JEWEL = "var(--guest-jewel)";
const DEEP = "var(--guest-deep)";

/** Domes, chhatris and a gateway along the foot of a palace section. */
export function PalaceSkyline({ className }: { className?: string }) {
  const chhatri = (x: number, scale: number) => (
    <g transform={`translate(${x} 120) scale(${scale})`}>
      <path d="M-22 0V-34H22V0" />
      <path d="M-26 -34H26V-40H-26z" />
      <path d="M-20 -40C-20 -62 -8 -70 0 -76 8 -70 20 -62 20 -40z" />
      <path d="M-1.2 -76V-88H1.2V-76z" />
    </g>
  );
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMax slice"
      className={className}
    >
      <g fill="currentColor">
        {chhatri(80, 0.8)}
        {chhatri(230, 1.1)}
        <path d="M330 120V70H420V52H440V70H530V120z" />
        {/* The gateway with its great dome */}
        <path d="M520 120V40H680V120H640V88C640 70 620 60 600 60S560 70 560 88V120z" />
        <path d="M530 40C530 0 580 -18 600 -30 620 -18 670 0 670 40z" />
        <path d="M598 -30V-48H602V-30z" />
        {chhatri(760, 1.1)}
        <path d="M800 120V74H930V56H950V74H1000V120z" />
        {chhatri(1060, 0.9)}
        {chhatri(1160, 0.7)}
      </g>
      {/* Windows that glow at night */}
      <g className="guest-windows" fill="var(--flower-lamp)">
        {[350, 380, 470, 500, 820, 850, 880, 960].map((x) => (
          <path key={x} d={`M${x} 110V96a6 6 0 0 1 12 0V110z`} />
        ))}
        <path d="M586 120V96a14 14 0 0 1 28 0V120z" />
      </g>
    </svg>
  );
}

/** A point on the quadratic curve from a through control c to b. */
const quad = (a: number, c: number, b: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

/** A coconut palm leaning in from the edge, its fronds drooping under their leaflets. */
export function Palm({ className, flip = false }: { className?: string; flip?: boolean }) {
  const crown = [120, 90] as const;
  const fronds = [-168, -140, -112, -80, -52, -24, 4];
  return (
    <svg
      aria-hidden
      viewBox="-10 0 250 300"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M30 300C40 220 70 150 120 90" strokeWidth="10" />
        {fronds.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const length = 105;
          // Out and up at first, then bowing down at the tip
          const cx = crown[0] + Math.cos(rad) * length * 0.6;
          const cy = crown[1] + Math.sin(rad) * length * 0.6 - 26;
          const ex = crown[0] + Math.cos(rad) * length;
          const ey = crown[1] + Math.sin(rad) * length * 0.5 + 38;
          const leaflets = Array.from({ length: 13 }, (_, i) => {
            const t = 0.14 + (i / 13) * 0.84;
            const px = quad(crown[0], cx, ex, t);
            const py = quad(crown[1], cy, ey, t);
            const tx = 2 * (1 - t) * (cx - crown[0]) + 2 * t * (ex - cx);
            const ty = 2 * (1 - t) * (cy - crown[1]) + 2 * t * (ey - cy);
            const tl = Math.hypot(tx, ty) || 1;
            const [ux, uy] = [tx / tl, ty / tl];
            const size = 26 * (1 - t * 0.55);
            // Each side's leaflet leans toward the tip and hangs a little
            const side = (sign: number) => {
              const dx = ux * 0.55 - uy * sign * 0.8;
              const dy = uy * 0.55 + ux * sign * 0.8 + 0.55;
              const dl = Math.hypot(dx, dy);
              return `M${px.toFixed(1)} ${py.toFixed(1)}l${((dx / dl) * size).toFixed(1)} ${((dy / dl) * size).toFixed(1)}`;
            };
            return side(1) + side(-1);
          });
          return (
            <g key={angle}>
              <path d={`M${crown[0]} ${crown[1]}Q${cx} ${cy} ${ex} ${ey}`} strokeWidth="3" />
              <path d={leaflets.join("")} strokeWidth="2.6" />
            </g>
          );
        })}
      </g>
      <g fill="currentColor">
        <circle cx="114" cy="98" r="7" />
        <circle cx="127" cy="96" r="6.5" />
        <circle cx="121" cy="107" r="6.5" />
      </g>
    </svg>
  );
}

/** A kettuvallam houseboat, its thatched roof and a lamp at the prow. */
export function Houseboat({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 220 80" className={className}>
      <path d="M4 50C40 70 180 70 216 44L204 58C170 76 50 76 16 60z" fill={DEEP} />
      <path
        d="M2 48C50 62 170 62 218 42L214 50C170 68 50 68 6 54z"
        fill="var(--flower-clay-deep)"
      />
      <path d="M40 50C40 24 70 14 110 14S180 24 180 48z" fill="var(--flower-thatch)" />
      <path
        d="M52 48C54 30 80 22 110 22S166 30 168 46"
        fill="none"
        stroke="var(--flower-clay-deep)"
        strokeWidth="2"
      />
      {[70, 95, 120, 145].map((x) => (
        <rect key={x} x={x} y="34" width="12" height="10" rx="2" fill="var(--flower-lamp)" />
      ))}
      <circle cx="206" cy="38" r="3" fill="var(--flower-lamp)" className="guest-boat-lamp" />
    </svg>
  );
}

/* ---------------------------------------------------------------- the floor patterns */

/** Which flower colours a drawn pattern's two inks take. */
const INKS = [JEWEL, "var(--flower-marigold)"] as const;

/**
 * The date's floor pattern, drawing itself in when `drawn` (strokes in order, the way a
 * hand draws them) or laid ring by ring for a pookalam of flowers.
 */
export function FloorArt({
  pattern,
  flower,
  second,
}: {
  pattern: GuestPattern;
  flower: GuestFlower;
  second: GuestFlower;
}) {
  if (pattern === "pookalam") return <Pookalam />;
  const strokes = patternStrokes(pattern);
  const lengths = strokes.map((s) => strokeLength(s.points));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  // Where each stroke starts, as a share of the whole drawing
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((sum, l) => sum + l, 0) / total);
  return (
    <svg
      aria-hidden
      viewBox="-1.12 -1.12 2.24 2.24"
      className="guest-floor absolute inset-0 size-full"
    >
      {/* Coloured powder under the lines */}
      <circle r="1.02" fill="color-mix(in oklab, var(--flower-marigold) 22%, transparent)" />
      <circle r="0.8" fill="color-mix(in oklab, var(--guest-jewel) 16%, transparent)" />
      <circle r="0.62" fill="color-mix(in oklab, var(--flower-leaf) 18%, transparent)" />
      {strokes.map((s, i) => {
        const start = starts[i]!;
        return (
          <path
            key={i}
            d={strokePath(s.points, s.closed)}
            pathLength={1}
            fill="none"
            stroke={INKS[s.colour]}
            strokeWidth={0.014 * s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="guest-floor-line"
            style={{ "--at": start.toFixed(3) } as CSSProperties}
          />
        );
      })}
      {/* Flowers at the eight points */}
      <g className="guest-floor-flowers">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <Bloom
              key={i}
              kind={i % 2 ? second : flower}
              x={Math.cos(a) * 1.02}
              y={Math.sin(a) * 1.02}
              size={0.2}
              turn={i * 45}
            />
          );
        })}
      </g>
    </svg>
  );
}

/** A slice of a ring from a0 to a1 (radians) between radii r0 and r1. */
function slice(r0: number, r1: number, a0: number, a1: number, bulge = 0) {
  const p = (r: number, a: number) =>
    `${(Math.cos(a) * r).toFixed(4)} ${(Math.sin(a) * r).toFixed(4)}`;
  const mid = (a0 + a1) / 2;
  const tip = r1 + bulge;
  return `M${p(r0, a0)}L${p(r1, a0)}Q${p(tip * 1.02, mid)} ${p(r1, a1)}L${p(r0, a1)}A${r0} ${r0} 0 0 0 ${p(r0, a0)}Z`;
}

/*
 * A Kerala pookalam: rings of flower petals laid from the rim inwards, marigold and
 * chrysanthemum oranges, rose, jasmine white and leaf green.
 */
function Pookalam() {
  const rings: { r0: number; r1: number; count: number; fills: string[]; bulge: number }[] = [
    {
      r0: 0.84,
      r1: 1.04,
      count: 24,
      fills: ["var(--flower-marigold-deep)", "var(--flower-marigold)"],
      bulge: 0.06,
    },
    { r0: 0.72, r1: 0.84, count: 24, fills: ["var(--flower-jasmine)"], bulge: 0 },
    {
      r0: 0.58,
      r1: 0.72,
      count: 16,
      fills: ["var(--flower-rose)", "var(--guest-jewel)"],
      bulge: 0.05,
    },
    {
      r0: 0.52,
      r1: 0.58,
      count: 32,
      fills: ["var(--flower-leaf)", "var(--flower-leaf-deep)"],
      bulge: 0,
    },
  ];
  return (
    <svg
      aria-hidden
      viewBox="-1.14 -1.14 2.28 2.28"
      className="guest-floor absolute inset-0 size-full"
    >
      {rings.map((ring, r) => (
        <g
          key={r}
          className="guest-floor-ring"
          style={{ "--at": (r / rings.length).toFixed(2) } as CSSProperties}
        >
          {Array.from({ length: ring.count }, (_, i) => {
            const step = (Math.PI * 2) / ring.count;
            return (
              <path
                key={i}
                d={slice(ring.r0, ring.r1, i * step, (i + 1) * step, ring.bulge)}
                fill={ring.fills[i % ring.fills.length]}
                stroke="var(--guest-gilt)"
                strokeWidth="0.004"
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- the lamps */

/** A flame with its halo; lit or not is set by the lamps' data-lit. */
function Flame({ x, y, size, index }: { x: number; y: number; size: number; index: number }) {
  return (
    <g className="guest-flame-wrap" style={{ "--i": index } as CSSProperties}>
      <circle
        cx={x}
        cy={y - size * 0.4}
        r={size * 1.6}
        fill="url(#guest-halo)"
        className="guest-halo"
      />
      <path
        className="guest-flame"
        d={`M${x} ${y - size * 1.4}C${x + size * 0.7} ${y - size * 0.5} ${x + size * 0.55} ${y} ${x} ${y}S${x - size * 0.7} ${y - size * 0.5} ${x} ${y - size * 1.4}z`}
        fill="url(#guest-fire)"
      />
    </g>
  );
}

function LampDefs() {
  return (
    <defs>
      <radialGradient id="guest-halo">
        <stop offset="0" stopColor="var(--flower-lamp)" stopOpacity="0.9" />
        <stop offset="1" stopColor="var(--flower-lamp)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="guest-pool">
        <stop offset="0.4" stopColor="var(--suite-water)" />
        <stop offset="1" stopColor="var(--suite-water)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="guest-fire" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="var(--flower-marigold-deep)" />
        <stop offset="0.5" stopColor="var(--flower-marigold)" />
        <stop offset="1" stopColor="var(--flower-lamp)" />
      </linearGradient>
    </defs>
  );
}

/** A row of clay diyas on a step, with a rangoli of petals in front. */
function Diyas({ flower }: { flower: GuestFlower }) {
  const count = 7;
  return (
    <svg aria-hidden viewBox="0 0 420 110" className="w-full max-w-xl">
      <LampDefs />
      <rect
        x="0"
        y="86"
        width="420"
        height="10"
        rx="5"
        fill="color-mix(in oklab, var(--guest-gilt) 45%, transparent)"
      />
      {Array.from({ length: count }, (_, i) => {
        const x = 30 + i * 60;
        return (
          <g key={i} className={i === 0 || i === count - 1 ? "max-sm:hidden" : undefined}>
            <path d={`M${x - 22} 70Q${x} 96 ${x + 22} 70z`} fill="var(--flower-clay)" />
            <path
              d={`M${x - 22} 70Q${x} 78 ${x + 22} 70`}
              fill="none"
              stroke="var(--flower-clay-deep)"
              strokeWidth="2"
            />
            <path
              d={`M${x + 18} 70l8 -5`}
              stroke="var(--flower-clay)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx={x - 8} cy="81" r="2" fill={GILT} />
            <circle cx={x} cy="83" r="2" fill={GILT} />
            <circle cx={x + 8} cy="81" r="2" fill={GILT} />
            <Flame x={x + 24} y={64} size={10} index={i} />
          </g>
        );
      })}
      {Array.from({ length: 6 }, (_, i) => (
        <Bloom key={i} kind={flower} x={60 + i * 60} y={102} size={12} turn={i * 30} />
      ))}
    </svg>
  );
}

/** A tall brass nilavilakku with five wicks, and diyas floating on the water below. */
function Nilavilakku() {
  const wicks = [-34, -17, 0, 17, 34];
  return (
    <svg aria-hidden viewBox="0 0 320 300" className="w-full max-w-sm">
      <LampDefs />
      <g fill={GILT}>
        {/* The top: a small peacock finial */}
        <path d="M160 40c-6-4-6-14 0-20 6 6 6 16 0 20z" />
        <rect x="157" y="40" width="6" height="30" rx="3" />
        {/* The bowl with its five spouts */}
        <path d="M110 76Q160 96 210 76L204 88Q160 108 116 88z" />
        <path d="M112 76Q160 68 208 76Q160 84 112 76z" fill="var(--flower-thatch)" />
        {/* The stem with its rings */}
        <rect x="154" y="96" width="12" height="130" rx="4" />
        {[118, 150, 182].map((y) => (
          <ellipse key={y} cx="160" cy={y} rx="16" ry="5" />
        ))}
        {/* The base */}
        <path d="M120 250Q160 214 200 250z" />
        <ellipse cx="160" cy="252" rx="46" ry="8" />
      </g>
      {wicks.map((dx, i) => (
        <Flame key={dx} x={160 + dx * 1.35} y={76 - Math.abs(dx) * 0.08} size={9} index={i} />
      ))}
      {/* Water, and floating diyas that light after the lamp */}
      <ellipse cx="160" cy="280" rx="175" ry="22" fill="url(#guest-pool)" />
      {[40, 110, 210, 280].map((x, i) => (
        <g key={x} className="guest-float-diya" style={{ "--i": i } as CSSProperties}>
          <path d={`M${x - 14} 274Q${x} 290 ${x + 14} 274z`} fill="var(--flower-clay)" />
          <Flame x={x} y={272} size={7} index={i + 5} />
        </g>
      ))}
    </svg>
  );
}

/** Paper lanterns hanging at different heights. */
function Lanterns() {
  const drops = [30, 60, 20, 70, 40, 55, 25];
  return (
    <svg aria-hidden viewBox="0 0 420 160" className="w-full max-w-xl">
      <LampDefs />
      <path d="M0 8Q210 40 420 8" stroke={GILT} strokeWidth="2" fill="none" />
      {drops.map((drop, i) => {
        const x = 30 + i * 60;
        return (
          <g key={i} className={i === 0 || i === drops.length - 1 ? "max-sm:hidden" : undefined}>
            <path d={`M${x} 14V${drop + 20}`} stroke={GILT} strokeWidth="1" />
            <rect
              x={x - 16}
              y={drop + 20}
              width="32"
              height="44"
              rx="14"
              fill={i % 2 ? JEWEL : "var(--flower-marigold-deep)"}
            />
            <Flame x={x} y={drop + 50} size={8} index={i} />
            <rect x={x - 10} y={drop + 16} width="20" height="6" rx="2" fill={GILT} />
            <rect x={x - 10} y={drop + 62} width="20" height="6" rx="2" fill={GILT} />
          </g>
        );
      })}
    </svg>
  );
}

/** A strand of coloured bulbs. */
function FairyLights() {
  const colours = [
    "var(--flower-marigold)",
    "var(--flower-rose)",
    "var(--flower-jasmine)",
    "var(--flower-leaf)",
  ];
  return (
    <svg aria-hidden viewBox="0 0 420 90" className="w-full max-w-xl">
      <LampDefs />
      <path d="M0 10Q105 60 210 10T420 10" stroke={DEEP} strokeWidth="2" fill="none" />
      {Array.from({ length: 13 }, (_, i) => {
        const x = 16 + i * 32;
        const t = (x % 210) / 210;
        const y = 10 + Math.sin(t * Math.PI) * 25 + 8;
        return (
          <g key={i} className="guest-flame-wrap" style={{ "--i": i } as CSSProperties}>
            <circle cx={x} cy={y + 6} r="16" fill="url(#guest-halo)" className="guest-halo" />
            <ellipse
              cx={x}
              cy={y + 6}
              rx="6"
              ry="8"
              fill={colours[i % colours.length]}
              className="guest-bulb"
            />
          </g>
        );
      })}
    </svg>
  );
}

export function Lamps({ lamp, flower }: { lamp: GuestLamp; flower: GuestFlower }) {
  if (lamp === "nilavilakku") return <Nilavilakku />;
  if (lamp === "lanterns") return <Lanterns />;
  if (lamp === "fairy") return <FairyLights />;
  return <Diyas flower={flower} />;
}

/** Coloured festoon bulbs strung across the top of the night. */
export function Festoon({ className }: { className?: string }) {
  const colours = [
    "var(--flower-marigold)",
    "var(--flower-rose)",
    "var(--flower-jasmine)",
    "var(--flower-lotus)",
    "var(--guest-gilt)",
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 70"
      preserveAspectRatio="xMidYMin slice"
      className={className}
    >
      {[0, 400, 800].map((x0) => (
        <path
          key={x0}
          d={`M${x0} 4Q${x0 + 200} 70 ${x0 + 400} 4`}
          stroke={GILT}
          strokeWidth="1.2"
          fill="none"
        />
      ))}
      {Array.from({ length: 48 }, (_, i) => {
        const x = 12 + i * 25;
        const t = (x % 400) / 400;
        const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * 70 + t * t * 4;
        return (
          <circle
            key={i}
            cx={x}
            cy={y + 4}
            r="4.5"
            fill={colours[i % colours.length]}
            className="guest-twinkle"
            style={{ "--i": i % 7 } as CSSProperties}
          />
        );
      })}
    </svg>
  );
}
