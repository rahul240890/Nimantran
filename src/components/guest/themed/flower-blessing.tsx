"use client";

import type { CSSProperties, ReactNode } from "react";
import type { FlowerBlessing } from "@/lib/suites/blessings";
import type { GuestFlower } from "@/lib/suites/guest-look";
import { Bloom } from "./flowers";

/*
 * The flowers a guest gives after the welcome (blessings.ts), each a small drawing that
 * moves when given: petals lifted off a brass plate, a basket tipped, a flower dropped in
 * an urli, a garland threaded, a lotus opening and more. `given` counts the taps; each tap
 * draws the moving parts again, so they play again. Every piece is drawn where it ends up
 * and moves in from elsewhere (`.bl-in`), or leaves from where it is (`.bl-out`), so with
 * motion off the guest sees the drawing as it ends (guest-blessings.css). Colours are the
 * `--flower-*` and `--guest-*` tokens; the flower heads are FlowerDefs' symbols.
 */

const GILT = "var(--guest-gilt)";
const JEWEL = "var(--guest-jewel)";
const CLOTH = "var(--guest-cloth)";
const DEEP = "var(--guest-deep)";
const LEAF = "var(--flower-leaf)";
const LEAF_DEEP = "var(--flower-leaf-deep)";
const WOOD = "var(--flower-clay-deep)";
const THATCH = "var(--flower-thatch)";
const WATER = "var(--suite-water)";

/** The custom properties a moving piece reads (guest-blessings.css). */
type Move = {
  /** Where it comes from (bl-in) or goes to (bl-out), as an offset from where it's drawn. */
  x?: number;
  y?: number;
  /** Turned by, in degrees, and scaled by. */
  r?: number;
  s?: number;
  /** Delay and length, in milliseconds. */
  d?: number;
  t?: number;
  /** The point it turns about, as a CSS transform-origin. */
  o?: string;
};
const move = ({ x, y, r, s, d, t, o }: Move): CSSProperties =>
  ({
    "--bx": x === undefined ? undefined : `${x}px`,
    "--by": y === undefined ? undefined : `${y}px`,
    "--br": r === undefined ? undefined : `${r}deg`,
    "--bs": s,
    "--bd": d === undefined ? undefined : `${d}ms`,
    "--bt": t === undefined ? undefined : `${t}ms`,
    "--bo": o,
  }) as CSSProperties;

const fine = (n: number) => Math.round(n * 100) / 100;
/* Numbers that look scattered but stay the same on every render */
const scatter = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return fine(v - Math.floor(v));
};
const spread = (i: number, salt: number, size: number) => fine((scatter(i, salt) - 0.5) * size);

/** A loose petal, `size` across, centred on x, y. */
function Petal({
  kind,
  x,
  y,
  size = 12,
  turn = 0,
}: {
  kind: GuestFlower;
  x: number;
  y: number;
  size?: number;
  turn?: number;
}) {
  return (
    <use
      href={`#gp-${kind}`}
      x={-size / 2}
      y={-size / 2}
      width={size}
      height={size}
      transform={`translate(${x} ${y}) rotate(${turn})`}
    />
  );
}

/** A piece placed at x, y that moves in (or out) with its own numbers. */
function Piece({
  x = 0,
  y = 0,
  turn,
  kind = "in",
  m,
  children,
}: {
  x?: number;
  y?: number;
  turn?: number;
  kind?: "in" | "out" | "arc" | "burst" | "sail";
  m: Move;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})${turn ? ` rotate(${turn})` : ""}`}>
      <g className={`bl-${kind}`} style={move(m)}>
        {children}
      </g>
    </g>
  );
}

/** A small four-pointed sparkle. */
function Sparkle({ x, y, size = 6 }: { x: number; y: number; size?: number }) {
  const s = size;
  return (
    <path
      d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}z`}
      fill="var(--flower-lamp)"
    />
  );
}

type Art = { a: GuestFlower; b: GuestFlower; given: number };
const pickOf =
  ({ a, b }: Art) =>
  (i: number) =>
    i % 3 === 1 ? b : a;

/* ------------------------------------------------------------------ the ways */

/** Petals heaped on a brass plate; given, a handful lifts off (the page showers too). */
function Shower(art: Art) {
  const pick = pickOf(art);
  const heap = Array.from({ length: 30 }, (_, i) => ({
    x: 180 + spread(i, 1, 130),
    y: 168 + spread(i, 2, 22) - (1 - Math.abs(scatter(i, 1) - 0.5) * 2) * 10,
  }));
  return (
    <>
      <ellipse cx="180" cy="184" rx="104" ry="22" fill={GILT} />
      <ellipse
        cx="180"
        cy="178"
        rx="92"
        ry="17"
        fill={`color-mix(in oklab, ${GILT} 70%, ${DEEP})`}
      />
      <ellipse cx="180" cy="176" rx="80" ry="12" fill="none" stroke={GILT} strokeDasharray="2 5" />
      <g className="bl-breathe">
        {heap.map((p, i) => (
          <Petal key={i} kind={pick(i)} x={p.x} y={p.y} size={13} turn={i * 47} />
        ))}
        <Bloom kind={art.a} x={150} y={160} size={26} />
        <Bloom kind={art.b} x={182} y={154} size={30} turn={20} />
        <Bloom kind={art.a} x={214} y={162} size={24} turn={40} />
      </g>
      {art.given > 0 && (
        <g key={art.given}>
          {heap.slice(0, 22).map((p, i) => (
            <Piece
              key={i}
              x={p.x}
              y={p.y}
              kind="out"
              m={{ x: spread(i, 3, 260), y: -150 - scatter(i, 4) * 60, r: 300, d: i * 25, t: 1400 }}
            >
              <Petal kind={pick(i + 1)} x={0} y={0} size={14} turn={i * 33} />
            </Piece>
          ))}
        </g>
      )}
    </>
  );
}

/** A woven basket; given, it tips and petals fly out in an arc and settle on the ground. */
function Basket(art: Art) {
  const pick = pickOf(art);
  const landed = Array.from({ length: 24 }, (_, i) => ({
    x: 160 + scatter(i, 5) * 180,
    y: 188 + spread(i, 6, 22),
  }));
  return (
    <>
      <path d="M0 200H360" stroke={GILT} strokeWidth="1.5" strokeDasharray="3 6" />
      <g
        key={`b${art.given}`}
        className={art.given ? "bl-tip" : "bl-sway"}
        style={move({ o: "20% 100%" })}
      >
        <g transform="translate(78 196) rotate(-14)">
          {/* The rim's flowers */}
          {Array.from({ length: 6 }, (_, i) => (
            <Bloom key={i} kind={pick(i)} x={-42 + i * 17} y={-70} size={22} turn={i * 30} />
          ))}
          <path d="M-56 -66L-40 0H40L56 -66z" fill={THATCH} />
          {[-52, -38, -24, -10].map((y) => (
            <path
              key={y}
              d={`M${-56 - y * 0.24} ${y}H${56 + y * 0.24}`}
              stroke={WOOD}
              strokeWidth="2"
              opacity="0.6"
            />
          ))}
          {[-36, -18, 0, 18, 36].map((x) => (
            <path
              key={x}
              d={`M${x * 1.3} -66L${x} 0`}
              stroke={WOOD}
              strokeWidth="1.4"
              opacity="0.5"
            />
          ))}
          <rect x="-60" y="-70" width="120" height="8" rx="4" fill={WOOD} />
        </g>
      </g>
      {art.given > 0 && (
        <g key={art.given}>
          {landed.map((p, i) => (
            <Piece
              key={i}
              x={p.x}
              y={p.y}
              kind="arc"
              m={{ x: 90 - p.x, y: 120 - p.y, r: 360, d: 250 + i * 35, t: 1100 }}
            >
              <Petal kind={pick(i)} x={0} y={0} size={14} turn={i * 41} />
            </Piece>
          ))}
        </g>
      )}
    </>
  );
}

const URLI_SPOTS = [
  [180, 150],
  [128, 146],
  [232, 154],
  [96, 158],
  [264, 144],
  [150, 164],
  [212, 140],
  [74, 148],
  [288, 158],
  [192, 166],
] as const;

/** A brass urli of water; each flower given drops in with a ripple and floats. */
function Urli(art: Art) {
  const pick = pickOf(art);
  const floating = Math.min(2 + art.given, URLI_SPOTS.length);
  const newest = art.given ? floating - 1 : -1;
  return (
    <>
      <path d="M38 152Q50 214 180 216Q310 214 322 152z" fill={GILT} />
      <path
        d="M60 170Q90 206 180 208"
        stroke={CLOTH}
        strokeOpacity="0.35"
        strokeWidth="4"
        fill="none"
      />
      <ellipse cx="180" cy="152" rx="144" ry="34" fill={GILT} />
      <ellipse cx="180" cy="152" rx="132" ry="27" fill={WATER} />
      <ellipse
        cx="180"
        cy="152"
        rx="132"
        ry="27"
        fill="none"
        stroke={DEEP}
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      {Array.from({ length: 8 }, (_, i) => (
        <Petal
          key={i}
          kind={pick(i + 2)}
          x={80 + i * 28}
          y={140 + spread(i, 8, 26)}
          size={9}
          turn={i * 50}
        />
      ))}
      {URLI_SPOTS.slice(0, floating).map(([x, y], i) =>
        i === newest ? (
          <g key={`n${art.given}`}>
            {[0, 1, 2].map((ring) => (
              <ellipse
                key={ring}
                cx={x}
                cy={y + 4}
                rx="16"
                ry="5"
                fill="none"
                stroke={CLOTH}
                strokeWidth="1.6"
                className="bl-ripple"
                style={move({ d: 650 + ring * 260 })}
              />
            ))}
            <Piece x={x} y={y} m={{ y: -170, s: 0.7, r: -90, t: 750 }}>
              <use href="#gf-leaf" x="-14" y="-4" width="10" height="22" transform="rotate(-70)" />
              <Bloom kind={pick(i)} x={0} y={0} size={30} turn={i * 40} />
            </Piece>
          </g>
        ) : (
          <g key={i} className="bl-bob" style={move({ d: i * -700 })}>
            <use
              href="#gf-leaf"
              x={x - 14}
              y={y - 4}
              width="10"
              height="22"
              transform={`rotate(-70 ${x} ${y})`}
            />
            <Bloom kind={pick(i)} x={x} y={y} size={28} turn={i * 40} />
          </g>
        ),
      )}
    </>
  );
}

/** A point on the quadratic curve from a through control c to b. */
const quad = (a: number, c: number, b: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

/** A gold cord between two pegs; given, flowers thread onto it one by one, then it sways. */
function Garland(art: Art) {
  const pick = pickOf(art);
  const heads = 19;
  const along = Array.from({ length: heads }, (_, i) => {
    const t = (i + 1) / (heads + 1);
    return { x: fine(quad(36, 180, 324, t)), y: fine(quad(34, 210, 34, t)) };
  });
  return (
    <>
      {[36, 324].map((x) => (
        <g key={x}>
          <circle cx={x} cy="30" r="9" fill={GILT} />
          <circle cx={x} cy="30" r="4" fill={JEWEL} />
        </g>
      ))}
      <path d="M36 34Q180 210 324 34" stroke={GILT} strokeWidth="2" fill="none" />
      {along
        .filter((_, i) => i % 3 === 0)
        .map((p, i) => (
          <use
            key={i}
            href="#gf-leaf"
            x={p.x - 4}
            y={p.y}
            width="8"
            height="20"
            transform={`rotate(${i * 20 - 50} ${p.x} ${p.y})`}
          />
        ))}
      {art.given > 0 && (
        <g key={art.given}>
          {along.map((p, i) => (
            <Piece
              key={i}
              x={p.x}
              y={p.y}
              m={{ x: 36 - p.x, y: 34 - p.y, s: 0.3, r: -120, d: i * 70, t: 600 }}
            >
              <Bloom kind={pick(i)} x={0} y={0} size={i === 9 ? 30 : 24} turn={i * 37} />
            </Piece>
          ))}
          {/* The tassel at the foot, swaying once it hangs */}
          <Piece x={180} y={124} m={{ y: -30, s: 0, d: heads * 70, t: 500 }}>
            <g className="bl-sway" style={move({ o: "50% 0%" })}>
              <path d="M0 0V64" stroke={GILT} strokeWidth="1.4" />
              {[16, 32, 48].map((y, i) => (
                <Bloom key={y} kind={i % 2 ? art.b : art.a} x={0} y={y} size={16} turn={i * 50} />
              ))}
              <use href="#gf-bell" x="-6" y="58" width="12" height="17" />
            </g>
          </Piece>
        </g>
      )}
    </>
  );
}

const LOTUS = "var(--flower-lotus)";
const LOTUS_DEEP = "var(--flower-lotus-deep)";
const PETAL = "M0 0C-10 -10 -11 -36 0 -54 11 -36 10 -10 0 0z";

/** A lotus bud on the water; given, it opens, layer by layer, and glows. */
function Lotus(art: Art) {
  const layers = [
    { count: 8, angle: 78, scale: 0.86, fill: LOTUS_DEEP },
    { count: 6, angle: 48, scale: 1, fill: LOTUS },
    { count: 4, angle: 20, scale: 0.92, fill: LOTUS },
  ];
  return (
    <>
      <ellipse cx="180" cy="172" rx="170" ry="34" fill={WATER} opacity="0.85" />
      {[
        [70, 178, 34],
        [292, 168, 28],
        [120, 196, 22],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={(r ?? 0) * 0.4} fill={LEAF} />
          <path
            d={`M${x} ${y}L${(x ?? 0) + (r ?? 0)} ${(y ?? 0) - 4}`}
            stroke={WATER}
            strokeWidth="3"
          />
        </g>
      ))}
      {art.given === 0 ? (
        <g className="bl-bob">
          <path d="M180 166C160 150 162 112 180 90 198 112 200 150 180 166z" fill={LOTUS} />
          <path
            d="M180 166C168 146 166 118 172 104"
            stroke={LOTUS_DEEP}
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M180 166C192 146 194 118 188 104"
            stroke={LOTUS_DEEP}
            strokeWidth="1.4"
            fill="none"
          />
          <ellipse cx="180" cy="168" rx="40" ry="8" fill={LEAF} />
        </g>
      ) : (
        <g key={art.given}>
          <Piece x={180} y={136} m={{ s: 0, t: 1600, d: 300 }}>
            <circle r="86" fill="url(#bl-glow)" />
          </Piece>
          <ellipse cx="180" cy="168" rx="48" ry="9" fill={LEAF} />
          {layers.map((layer, l) =>
            Array.from({ length: layer.count }, (_, i) => {
              const angle = -layer.angle + (i / (layer.count - 1)) * layer.angle * 2;
              return (
                <Piece
                  key={`${l}-${i}`}
                  x={180}
                  y={166}
                  turn={angle}
                  m={{ r: -angle, d: l * 120 + 100, t: 1300, o: "50% 100%" }}
                >
                  <path d={PETAL} transform={`scale(${layer.scale})`} fill={layer.fill} />
                  <path
                    d="M0 -4V-40"
                    transform={`scale(${layer.scale})`}
                    stroke={LOTUS_DEEP}
                    strokeOpacity="0.5"
                  />
                </Piece>
              );
            }),
          )}
          <Piece x={180} y={150} m={{ s: 0, d: 900, t: 600 }}>
            <ellipse rx="13" ry="7" fill="var(--flower-marigold)" />
            {[-8, -3, 2, 7].map((x) => (
              <circle key={x} cx={x} cy={-1} r="1.4" fill="var(--flower-marigold-deep)" />
            ))}
          </Piece>
          {Array.from({ length: 8 }, (_, i) => (
            <Piece
              key={`s${i}`}
              x={140 + i * 11}
              y={110}
              kind="out"
              m={{ y: -80 - scatter(i, 9) * 30, x: spread(i, 10, 40), d: 1200 + i * 120, t: 1600 }}
            >
              <Sparkle x={0} y={0} size={4 + scatter(i, 11) * 3} />
            </Piece>
          ))}
        </g>
      )}
    </>
  );
}

const BOUQUET_SPOTS = [
  [180, 52, 34],
  [146, 66, 30],
  [214, 64, 30],
  [124, 94, 26],
  [236, 92, 26],
  [162, 90, 30],
  [198, 92, 30],
  [180, 120, 26],
  [140, 118, 22],
  [220, 118, 22],
] as const;

/** A wrapped bouquet of buds; given, the buds open one after another and a bow is tied. */
function Bouquet(art: Art) {
  const pick = pickOf(art);
  return (
    <>
      {BOUQUET_SPOTS.map(([x, y], i) => (
        <path
          key={`st${i}`}
          d={`M180 196Q${(x + 180) / 2} ${y + 50} ${x} ${y}`}
          stroke={LEAF_DEEP}
          strokeWidth="2.2"
          fill="none"
        />
      ))}
      {(
        [
          [120, 100, -50],
          [240, 100, 50],
          [150, 130, -30],
          [210, 132, 30],
        ] as const
      ).map(([x, y, turn], i) => (
        <use
          key={`lf${i}`}
          href="#gf-leaf"
          x={x - 7}
          y={y}
          width="14"
          height="38"
          transform={`rotate(${turn} ${x} ${y})`}
        />
      ))}
      {BOUQUET_SPOTS.map(([x, y], i) =>
        art.given === 0 ? (
          <g key={`bud${i}`} className="bl-breathe" style={move({ d: i * -300 })}>
            <ellipse cx={x} cy={y} rx="7" ry="10" fill={LEAF} />
            <path
              d={`M${x - 5} ${y - 4}Q${x} ${y - 16} ${x + 5} ${y - 4}z`}
              fill={`var(--flower-${pick(i)}${pick(i) === "jasmine" ? "" : "-deep"})`}
            />
          </g>
        ) : null,
      )}
      {art.given > 0 && (
        <g key={art.given}>
          {BOUQUET_SPOTS.map(([x, y, size], i) => (
            <Piece key={i} x={x} y={y} m={{ s: 0, r: -90, d: i * 110, t: 700 }}>
              <Bloom kind={pick(i)} x={0} y={0} size={size} turn={i * 29} />
            </Piece>
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <Piece
              key={`p${i}`}
              x={180 + spread(i, 12, 120)}
              y={80}
              kind="out"
              m={{ x: spread(i, 13, 160), y: -90, r: 200, d: 1100 + i * 80, t: 1500 }}
            >
              <Petal kind={pick(i)} x={0} y={0} size={11} />
            </Piece>
          ))}
        </g>
      )}
      {/* The paper cone and its bow */}
      <path d="M112 128L180 214 248 128Q180 146 112 128z" fill={JEWEL} />
      <path d="M112 128Q180 146 248 128" stroke={GILT} strokeWidth="3" fill="none" />
      <path d="M146 140L180 214 166 142z" fill={CLOTH} opacity="0.18" />
      <g key={`bow${art.given}`}>
        <Piece x={180} y={176} m={art.given ? { s: 0, d: 1100, t: 500 } : {}}>
          <path
            d="M0 0C-18 -14 -30 -2 -22 6 -16 12 -6 6 0 0zM0 0C18 -14 30 -2 22 6 16 12 6 6 0 0z"
            fill={GILT}
          />
          <path d="M0 0L-10 24M0 0L10 24" stroke={GILT} strokeWidth="3" strokeLinecap="round" />
          <circle r="4.5" fill={GILT} />
        </Piece>
      </g>
    </>
  );
}

const BRANCH_BUDS = [
  [52, 112],
  [86, 96],
  [118, 120],
  [148, 84],
  [178, 106],
  [206, 72],
  [232, 96],
  [258, 62],
  [284, 84],
  [310, 56],
  [330, 74],
  [100, 72],
] as const;

/** A flowering branch; given, its buds open from the trunk out and petals fall off it. */
function Branch(art: Art) {
  const pick = pickOf(art);
  return (
    <>
      <g className="bl-sway" style={move({ o: "0% 60%" })}>
        <path
          d="M-10 140C60 130 120 100 200 88S300 60 352 52"
          stroke={WOOD}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        {[
          "M86 116Q90 100 86 96",
          "M60 126Q48 120 52 112",
          "M120 106Q110 90 100 72",
          "M150 100Q140 92 148 84",
          "M200 88Q200 80 206 72",
          "M240 76Q256 66 258 62",
          "M232 80Q232 90 232 96",
          "M300 62Q312 60 310 56",
          "M178 92Q178 100 178 106",
          "M118 106Q118 114 118 120",
        ].map((d) => (
          <path key={d} d={d} stroke={WOOD} strokeWidth="3" strokeLinecap="round" fill="none" />
        ))}
        {BRANCH_BUDS.map(([x, y], i) => (
          <use
            key={`l${i}`}
            href="#gf-leaf"
            x={x + 2}
            y={y + 2}
            width="8"
            height="20"
            transform={`rotate(${120 + i * 33} ${x} ${y})`}
          />
        ))}
        {BRANCH_BUDS.map(([x, y], i) =>
          art.given ? null : (
            <circle
              key={`b${i}`}
              cx={x}
              cy={y}
              r="5"
              fill={`var(--flower-${pick(i)}${pick(i) === "jasmine" ? "-edge" : "-deep"})`}
            />
          ),
        )}
        {art.given > 0 && (
          <g key={art.given}>
            {BRANCH_BUDS.map(([x, y], i) => (
              <Piece key={i} x={x} y={y} m={{ s: 0, r: 120, d: i * 90, t: 700 }}>
                <Bloom kind={pick(i)} x={0} y={0} size={24 + scatter(i, 14) * 8} turn={i * 31} />
              </Piece>
            ))}
          </g>
        )}
      </g>
      {art.given > 0 && (
        <g key={`f${art.given}`}>
          {Array.from({ length: 16 }, (_, i) => {
            const [x, y] = BRANCH_BUDS[i % BRANCH_BUDS.length]!;
            return (
              <Piece
                key={i}
                x={x}
                y={y}
                kind="out"
                m={{ x: spread(i, 15, 80) + 30, y: 150, r: 400, d: 900 + i * 140, t: 2600 }}
              >
                <Petal kind={pick(i)} x={0} y={0} size={12} />
              </Piece>
            );
          })}
        </g>
      )}
      <path d="M0 210H360" stroke={GILT} strokeWidth="1.5" strokeDasharray="3 6" />
    </>
  );
}

/** Rings drawn faintly on the floor; given, petals fly in to lay a pookalam, which turns. */
function Rangoli(art: Art) {
  const pick = pickOf(art);
  const rings = [
    { r: 94, count: 26, kind: art.a, size: 15 },
    { r: 68, count: 20, kind: art.b, size: 14 },
    { r: 43, count: 14, kind: art.a, size: 13 },
  ];
  return (
    <>
      <ellipse cx="180" cy="114" rx="104" ry="104" fill={CLOTH} opacity="0.35" />
      {[94, 68, 43].map((r) => (
        <circle
          key={r}
          cx="180"
          cy="114"
          r={r}
          fill="none"
          stroke={GILT}
          strokeWidth="1.2"
          strokeDasharray="2 6"
        />
      ))}
      <Bloom kind={art.b} x={180} y={114} size={34} />
      {art.given > 0 && (
        <g key={art.given}>
          <g className="bl-spin" style={move({ d: 2600 })}>
            {rings.map((ring, l) =>
              Array.from({ length: ring.count }, (_, i) => {
                const a = (i / ring.count) * Math.PI * 2;
                const x = fine(180 + Math.cos(a) * ring.r);
                const y = fine(114 + Math.sin(a) * ring.r);
                return (
                  <Piece
                    key={`${l}-${i}`}
                    x={x}
                    y={y}
                    m={{
                      x: fine(Math.cos(a) * 160),
                      y: fine(Math.sin(a) * 160),
                      r: 180,
                      s: 1.6,
                      d: l * 450 + i * 30,
                      t: 700,
                    }}
                  >
                    <Petal
                      kind={ring.kind}
                      x={0}
                      y={0}
                      size={ring.size}
                      turn={fine((a * 180) / Math.PI + 90)}
                    />
                  </Piece>
                );
              }),
            )}
          </g>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2 + 0.2;
            return (
              <Piece
                key={`d${i}`}
                x={fine(180 + Math.cos(a) * 112)}
                y={fine(114 + Math.sin(a) * 112)}
                m={{ s: 0, d: 1500 + i * 60 }}
              >
                <circle r="3.5" fill={GILT} />
              </Piece>
            );
          })}
          <Piece x={180} y={114} m={{ s: 0, r: -180, d: 1400, t: 800 }}>
            <Bloom kind={pick(1)} x={0} y={0} size={40} />
          </Piece>
        </g>
      )}
    </>
  );
}

/** A leaf boat (a sal-leaf donna) heaped with flowers. */
function LeafBoat({ a, b }: { a: GuestFlower; b: GuestFlower }) {
  return (
    <g>
      <path d="M-34 -4Q-30 14 0 16Q30 14 34 -4Q0 6 -34 -4z" fill={LEAF} />
      <path d="M-34 -4Q0 6 34 -4" stroke={LEAF_DEEP} strokeWidth="1.6" fill="none" />
      <path d="M-20 4Q0 12 20 4" stroke={LEAF_DEEP} strokeWidth="0.8" fill="none" />
      <Bloom kind={a} x={-14} y={-6} size={20} />
      <Bloom kind={b} x={6} y={-10} size={22} turn={30} />
      <Bloom kind={a} x={22} y={-4} size={16} turn={60} />
    </g>
  );
}

/** A stream between grassy banks; each flower given sails down it on a leaf boat. */
function Boat(art: Art) {
  return (
    <>
      <path d="M0 118Q90 108 180 116T360 112V220H0z" fill={WATER} />
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={i}
          d={`M${20 + (i % 4) * 92} ${140 + i * 10}q14 -5 28 0`}
          stroke={CLOTH}
          strokeOpacity="0.6"
          strokeWidth="1.6"
          fill="none"
          className="bl-shimmer"
          style={move({ d: i * -400 })}
        />
      ))}
      <path d="M0 118Q90 108 180 116T360 112" stroke={LEAF} strokeWidth="5" fill="none" />
      {[24, 70, 300, 340].map((x, i) => (
        <path
          key={x}
          d={`M${x} 116q-4 -18 -10 -22M${x} 116q2 -20 6 -26M${x} 116q6 -14 14 -18`}
          stroke={LEAF_DEEP}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity={i % 2 ? 0.8 : 1}
        />
      ))}
      <g transform="translate(286 176)">
        <g className="bl-bob">
          <LeafBoat a={art.a} b={art.b} />
        </g>
      </g>
      {art.given > 0 && (
        <g key={art.given}>
          {[0, 1].map((n) => (
            <Piece key={n} x={-40} y={146 + n * 50} kind="sail" m={{ x: 440, d: n * 900, t: 6500 }}>
              <g className="bl-bob">
                <LeafBoat a={n ? art.b : art.a} b={n ? art.a : art.b} />
              </g>
            </Piece>
          ))}
        </g>
      )}
    </>
  );
}

/** A party popper; given, it bursts with petals and streamers that float down. */
function Popper(art: Art) {
  const pick = pickOf(art);
  const tones = [JEWEL, GILT, "var(--flower-rose)", "var(--flower-leaf)", "var(--flower-marigold)"];
  return (
    <>
      {/* Streamers from the last pop, curled over the top */}
      {[
        ["M150 0C140 30 176 40 160 70S180 100 170 120", JEWEL],
        ["M230 0C246 26 214 44 236 66S222 96 240 110", GILT],
        ["M300 0C290 20 318 36 304 58S318 80 310 92", "var(--flower-rose)"],
        ["M90 0C100 18 80 30 94 48", GILT],
      ].map(([d, tone]) => (
        <path key={d} d={d} stroke={tone} strokeWidth="3" strokeLinecap="round" fill="none" />
      ))}
      <path d="M0 212H360" stroke={GILT} strokeWidth="1.5" strokeDasharray="3 6" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={`c${i}`}
          x={150 + scatter(i, 16) * 200}
          y={196 + spread(i, 17, 16)}
          width="4"
          height="10"
          rx="1"
          fill={tones[i % tones.length]}
          transform={`rotate(${i * 40} ${150 + scatter(i, 16) * 200} ${196 + spread(i, 17, 16)})`}
        />
      ))}
      <g
        key={`k${art.given}`}
        className={art.given ? "bl-kick" : "bl-wiggle"}
        style={move({ o: "20% 80%" })}
      >
        <g transform="translate(62 190) rotate(-40)">
          <path d="M-22 0L0 -78 22 0z" fill={JEWEL} />
          {[-62, -42, -22].map((y, i) => (
            <path
              key={y}
              d={`M${(y / 78) * 22} ${y}L${(-y / 78) * 22} ${y}`}
              stroke={i % 2 ? CLOTH : GILT}
              strokeWidth="6"
              opacity="0.85"
            />
          ))}
          <ellipse cx="0" cy="0" rx="22" ry="6" fill={GILT} />
          <ellipse cx="0" cy="-78" rx="5" ry="2" fill={GILT} />
        </g>
      </g>
      {art.given > 0 && (
        <g key={art.given}>
          {Array.from({ length: 34 }, (_, i) => {
            const a = (-75 + scatter(i, 18) * 70) * (Math.PI / 180);
            const reach = 120 + scatter(i, 19) * 130;
            const x = fine(112 + Math.cos(a) * reach);
            const y = fine(130 + Math.sin(a) * reach * 0.7);
            return (
              <Piece
                key={i}
                x={x}
                y={y}
                kind="burst"
                m={{ x: 112 - x, y: 130 - y, r: 540, d: i * 12, t: 2200 }}
              >
                {i % 3 === 0 ? (
                  <rect x="-2" y="-6" width="4" height="12" rx="1" fill={tones[i % tones.length]} />
                ) : (
                  <Petal kind={pick(i)} x={0} y={0} size={14} />
                )}
              </Piece>
            );
          })}
        </g>
      )}
    </>
  );
}

/** A gift box; given, its lid lifts off and flowers rise out of it on springs. */
function Gift(art: Art) {
  const pick = pickOf(art);
  const rise = [
    [140, 70, -24],
    [180, 50, 0],
    [220, 70, 24],
    [118, 104, -40],
    [242, 104, 40],
    [160, 92, -10],
    [200, 92, 10],
  ] as const;
  const lid = (
    <>
      <rect
        x="-70"
        y="-16"
        width="140"
        height="22"
        rx="4"
        fill={CLOTH}
        stroke={GILT}
        strokeWidth="2"
      />
      <rect x="-9" y="-16" width="18" height="22" fill={JEWEL} />
      <path d="M0 -16C-26 -42 -46 -22 -26 -16zM0 -16C26 -42 46 -22 26 -16z" fill={JEWEL} />
    </>
  );
  return (
    <>
      {art.given > 0 && (
        <g key={art.given}>
          {rise.map(([x, y, turn], i) => (
            <Piece key={i} x={180} y={140} m={{ y: 40, s: 0.2, d: 500 + i * 90, t: 800 }}>
              <path
                d={`M0 0Q${(x - 180) / 2 + (i % 2 ? 8 : -8)} ${(y - 140) / 2} ${x - 180} ${y - 140}`}
                stroke={LEAF_DEEP}
                strokeWidth="2"
                fill="none"
              />
              <g transform={`translate(${x - 180} ${y - 140}) rotate(${turn})`}>
                <g className="bl-bob" style={move({ d: i * -500 })}>
                  <Bloom kind={pick(i)} x={0} y={0} size={i === 1 ? 36 : 28} />
                </g>
              </g>
            </Piece>
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <Piece
              key={`s${i}`}
              x={110 + i * 15}
              y={60 + spread(i, 20, 60)}
              kind="out"
              m={{ y: -40, s: 0.2, d: 1000 + i * 90, t: 1400 }}
            >
              <Sparkle x={0} y={0} size={5} />
            </Piece>
          ))}
        </g>
      )}
      <rect
        x="116"
        y="140"
        width="128"
        height="72"
        rx="4"
        fill={CLOTH}
        stroke={GILT}
        strokeWidth="2"
      />
      <rect x="171" y="140" width="18" height="72" fill={JEWEL} />
      <path d="M116 168H244" stroke={GILT} strokeWidth="1" strokeDasharray="2 4" />
      {art.given === 0 ? (
        <g className="bl-wiggle" style={move({ o: "50% 100%" })}>
          <g transform="translate(180 140)">{lid}</g>
        </g>
      ) : (
        <g key={`lid${art.given}`}>
          <Piece x={74} y={190} turn={-24} m={{ x: 106, y: -50, r: 24, t: 700 }}>
            {lid}
          </Piece>
        </g>
      )}
    </>
  );
}

/** A butterfly, its wings beating. */
function Butterfly({ tone, size = 1 }: { tone: string; size?: number }) {
  return (
    <g transform={`scale(${size})`}>
      <g className="bl-flap">
        <path d="M0 0C-14 -20 -26 -12 -20 -2 -16 4 -6 2 0 0z" fill={tone} />
        <path d="M0 0C-12 12 -18 18 -10 18 -4 16 -2 8 0 0z" fill={tone} opacity="0.8" />
        <path d="M0 0C14 -20 26 -12 20 -2 16 4 6 2 0 0z" fill={tone} />
        <path d="M0 0C12 12 18 18 10 18 4 16 2 8 0 0z" fill={tone} opacity="0.8" />
        <circle cx="-13" cy="-8" r="2.4" fill={GILT} />
        <circle cx="13" cy="-8" r="2.4" fill={GILT} />
      </g>
      <ellipse rx="2" ry="9" cy="2" fill={DEEP} />
      <path d="M-1 -6Q-4 -14 -7 -15M1 -6Q4 -14 7 -15" stroke={DEEP} strokeWidth="0.8" fill="none" />
    </g>
  );
}

/** A flowering bush; given, butterflies rise from it, each carrying a petal away. */
function Butterflies(art: Art) {
  const pick = pickOf(art);
  const tones = [
    JEWEL,
    "var(--flower-marigold)",
    "var(--flower-lotus-deep)",
    GILT,
    "var(--flower-rose)",
    JEWEL,
  ];
  const bush = [
    [120, 180],
    [150, 162],
    [184, 170],
    [214, 158],
    [244, 178],
    [168, 190],
    [204, 192],
  ] as const;
  return (
    <>
      <path d="M90 214Q100 150 180 148Q262 150 272 214z" fill={LEAF} opacity="0.85" />
      {Array.from({ length: 9 }, (_, i) => (
        <use
          key={i}
          href="#gf-leaf"
          x={96 + i * 20}
          y={150 + (i % 2) * 10}
          width="12"
          height="30"
          transform={`rotate(${i * 28 - 110} ${102 + i * 20} ${160 + (i % 2) * 10})`}
        />
      ))}
      {bush.map(([x, y], i) => (
        <Bloom key={i} kind={pick(i)} x={x} y={y} size={26} turn={i * 40} />
      ))}
      {art.given === 0 && (
        <>
          <g transform="translate(150 150)" className="bl-bob">
            <Butterfly tone={tones[0]!} size={0.9} />
          </g>
          <g transform="translate(240 160)" className="bl-bob" style={move({ d: -1200 })}>
            <Butterfly tone={tones[1]!} size={0.8} />
          </g>
        </>
      )}
      {art.given > 0 && (
        <g key={art.given}>
          {tones.map((tone, i) => {
            const [x, y] = bush[i]!;
            return (
              <Piece
                key={i}
                x={x}
                y={y - 14}
                kind="out"
                m={{ x: spread(i, 21, 220), y: -230, d: i * 220, t: 3200 }}
              >
                <g className="bl-wave" style={move({ d: i * -300 })}>
                  <Butterfly tone={tone} size={0.8 + scatter(i, 22) * 0.4} />
                  <Petal kind={pick(i + 1)} x={0} y={16} size={12} />
                </g>
              </Piece>
            );
          })}
        </g>
      )}
    </>
  );
}

/** Points along a heart, centred on x, y. */
const heartAt = (t: number, scale: number) => ({
  x: fine(180 + 16 * Math.sin(t) ** 3 * scale),
  y: fine(
    100 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale,
  ),
});

/** A heart drawn faintly; given, petals fly in from all round to fill it, and it beats. */
function Heart(art: Art) {
  const pick = pickOf(art);
  const outline = Array.from({ length: 30 }, (_, i) => heartAt((i / 30) * Math.PI * 2, 5.4));
  const inner = Array.from({ length: 18 }, (_, i) => heartAt((i / 18) * Math.PI * 2, 3.3));
  const all = [...outline, ...inner];
  return (
    <>
      <path
        d={`M${outline.map((p) => `${p.x} ${p.y}`).join("L")}z`}
        fill="none"
        stroke={GILT}
        strokeWidth="1.4"
        strokeDasharray="3 6"
      />
      {art.given === 0 && <Bloom kind={art.b} x={180} y={98} size={30} />}
      {art.given > 0 && (
        <g key={art.given}>
          <g className="bl-beat" style={move({ d: 2200, o: "50% 50%" })}>
            {all.map((p, i) => {
              const a = scatter(i, 23) * Math.PI * 2;
              return (
                <Piece
                  key={i}
                  x={p.x}
                  y={p.y}
                  m={{
                    x: fine(Math.cos(a) * 240),
                    y: fine(Math.sin(a) * 200),
                    r: 360,
                    d: i * 28,
                    t: 900,
                  }}
                >
                  <Petal
                    kind={i < outline.length ? art.a : art.b}
                    x={0}
                    y={0}
                    size={i < outline.length ? 16 : 14}
                    turn={i * 30}
                  />
                </Piece>
              );
            })}
            <Piece x={180} y={98} m={{ s: 0, d: 1500, t: 600 }}>
              <Bloom kind={pick(1)} x={0} y={0} size={34} />
            </Piece>
          </g>
        </g>
      )}
    </>
  );
}

/** A canopy of flowers held on four poles; given, it shakes and petals pour down under it. */
function Chadar(art: Art) {
  const pick = pickOf(art);
  return (
    <>
      <path d="M20 212H340" stroke={GILT} strokeWidth="1.5" strokeDasharray="3 6" />
      {Array.from({ length: 10 }, (_, i) => (
        <Petal
          key={`g${i}`}
          kind={pick(i)}
          x={90 + i * 20}
          y={206 + spread(i, 24, 8)}
          size={10}
          turn={i * 50}
        />
      ))}
      {/* The back poles, then the front */}
      {[
        [96, 56, 196, 0.7],
        [264, 56, 196, 0.7],
        [52, 70, 212, 1],
        [308, 70, 212, 1],
      ].map(([x, top, foot, o], i) => (
        <g key={i} opacity={o}>
          <rect
            x={(x ?? 0) - 3}
            y={top}
            width="6"
            height={(foot ?? 0) - (top ?? 0)}
            rx="3"
            fill={GILT}
          />
          <circle cx={x} cy={(top ?? 0) - 4} r="6" fill={GILT} />
        </g>
      ))}
      <g key={`c${art.given}`} className={art.given ? "bl-shake" : undefined}>
        <path d="M52 70Q180 96 308 70L264 56Q180 70 96 56z" fill={CLOTH} />
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 11 - row * 2 }, (_, i) => {
            const t = (i + 0.5) / (11 - row * 2);
            const x = fine(
              quad(96 - (row === 0 ? 30 : row * 4), 180, 264 + (row === 0 ? 30 : row * 4), t),
            );
            const y = fine(quad(56 + (2 - row) * 6, 70 + (2 - row) * 12, 56 + (2 - row) * 6, t));
            return (
              <Bloom
                key={`${row}-${i}`}
                kind={pick(i + row)}
                x={x}
                y={y}
                size={20 - row * 2}
                turn={i * 37}
              />
            );
          }),
        )}
        {/* Strands down its front edge */}
        {Array.from({ length: 9 }, (_, i) => {
          const t = (i + 0.5) / 9;
          const x = fine(quad(52, 180, 308, t));
          const y = fine(quad(70, 96, 70, t));
          return (
            <g key={`s${i}`} transform={`translate(${x} ${y})`}>
              <g className="bl-sway" style={move({ d: i * -500, o: "50% 0%" })}>
                <path d="M0 0V30" stroke={GILT} strokeWidth="1" />
                <Bloom kind={pick(i)} x={0} y={14} size={12} />
                <Bloom kind={pick(i + 1)} x={0} y={28} size={12} />
              </g>
            </g>
          );
        })}
      </g>
      {art.given > 0 && (
        <g key={art.given}>
          {Array.from({ length: 30 }, (_, i) => (
            <Piece
              key={i}
              x={70 + scatter(i, 25) * 220}
              y={96}
              kind="out"
              m={{
                x: spread(i, 26, 40),
                y: 110 + scatter(i, 27) * 10,
                r: 300,
                d: 200 + i * 60,
                t: 1800,
              }}
            >
              <Petal kind={pick(i)} x={0} y={0} size={13} />
            </Piece>
          ))}
        </g>
      )}
    </>
  );
}

/** One flower turning slowly; given, petals whirl round it and are let go. */
function Whirl(art: Art) {
  const pick = pickOf(art);
  return (
    <>
      {[60, 86].map((r) => (
        <circle
          key={r}
          cx="180"
          cy="110"
          r={r}
          fill="none"
          stroke={GILT}
          strokeWidth="1"
          strokeDasharray="1 7"
        />
      ))}
      {[0, 72, 144, 216, 288].map((turn) => (
        <use
          key={turn}
          href="#gf-leaf"
          x="176"
          y="110"
          width="8"
          height="40"
          transform={`rotate(${turn + 36} 180 110)`}
        />
      ))}
      <g className="bl-spin">
        <Bloom kind={art.a} x={180} y={110} size={54} />
      </g>
      {art.given > 0 && (
        <g key={art.given}>
          <g className="bl-orbit">
            {Array.from({ length: 26 }, (_, i) => {
              const a = (i / 26) * Math.PI * 2;
              const r = 46 + (i % 3) * 18;
              const x = fine(180 + Math.cos(a) * r);
              const y = fine(110 + Math.sin(a) * r);
              return (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <g
                    className="bl-in"
                    style={move({
                      x: fine(-Math.cos(a) * r),
                      y: fine(-Math.sin(a) * r),
                      s: 0,
                      d: i * 20,
                      t: 500,
                    })}
                  >
                    {/* The inner ring stays round the flower as a wreath; the rest fly off */}
                    <g
                      className={i % 3 === 0 ? undefined : "bl-out"}
                      style={move({
                        x: fine(Math.cos(a) * 220),
                        y: fine(Math.sin(a) * 160),
                        r: 270,
                        d: 2000 + i * 25,
                        t: 1300,
                      })}
                    >
                      <Petal
                        kind={pick(i)}
                        x={0}
                        y={0}
                        size={15}
                        turn={fine((a * 180) / Math.PI)}
                      />
                    </g>
                  </g>
                </g>
              );
            })}
          </g>
        </g>
      )}
    </>
  );
}

const WAYS: Record<FlowerBlessing, (art: Art) => ReactNode> = {
  shower: Shower,
  basket: Basket,
  urli: Urli,
  garland: Garland,
  lotus: Lotus,
  bouquet: Bouquet,
  branch: Branch,
  rangoli: Rangoli,
  boat: Boat,
  popper: Popper,
  gift: Gift,
  butterflies: Butterflies,
  heart: Heart,
  chadar: Chadar,
  whirl: Whirl,
};

/** The drawing of one way of giving flowers, moving each time `given` goes up. */
export function FlowerStage({
  way,
  flower,
  second,
  given,
  className,
}: {
  way: FlowerBlessing;
  flower: GuestFlower;
  second: GuestFlower;
  given: number;
  className?: string;
}) {
  const Way = WAYS[way];
  return (
    <svg
      aria-hidden
      viewBox="0 0 360 220"
      data-way={way}
      data-given={given > 0 || undefined}
      className={className}
    >
      <defs>
        <radialGradient id="bl-glow">
          <stop offset="0" stopColor="var(--flower-lamp)" stopOpacity="0.85" />
          <stop offset="1" stopColor="var(--flower-lamp)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Way a={flower} b={second} given={given} />
    </svg>
  );
}
