import type { CSSProperties, ReactNode } from "react";
import type { LampBlessing } from "@/lib/suites/blessings";
import type { GuestFlower, GuestLamp } from "@/lib/suites/guest-look";
import { Bloom } from "./flowers";
import { Flame, LampDefs, Lamps } from "./scenery";

/*
 * The light a guest gives at night (blessings.ts): the first four are the lamps the page
 * always had (scenery.tsx), the rest drawn here: diyas floating down a river, sky lanterns
 * let go, a lotus of diyas, a deepstambh, a star kandil, candles, a jar of fireflies, a
 * jaali lantern, sparklers and a chandelier. All dark until the night's `data-lit`, then
 * lit one after another (`--i`), with flames, halos and their own movement in
 * guest-blessings.css; with motion off they are simply lit.
 */

const GILT = "var(--guest-gilt)";
const JEWEL = "var(--guest-jewel)";
const CLOTH = "var(--guest-cloth)";
const DEEP = "var(--guest-deep)";
const CLAY = "var(--flower-clay)";
const CLAY_DEEP = "var(--flower-clay-deep)";
const LAMP = "var(--flower-lamp)";
const MARIGOLD = "var(--flower-marigold)";
const MARIGOLD_DEEP = "var(--flower-marigold-deep)";
const WATER = "var(--suite-water)";

const fine = (n: number) => Math.round(n * 100) / 100;
const scatter = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return fine(v - Math.floor(v));
};
const at = (i: number, more?: Record<string, string | number>) =>
  ({ "--i": i, ...more }) as CSSProperties;

/** A glow that shows once lit, `r` across, centred on x, y. */
function Glow({ x, y, r, i = 0 }: { x: number; y: number; r: number; i?: number }) {
  return (
    <circle cx={x} cy={y} r={r} fill="url(#guest-halo)" className="guest-halo" style={at(i)} />
  );
}

/** A small clay diya with its flame, centred on its bowl. */
function Diya({ x, y, i, size = 1 }: { x: number; y: number; i: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M-14 0Q0 14 14 0z" fill={CLAY} />
      <path d="M-14 0Q0 5 14 0" stroke={CLAY_DEEP} strokeWidth="1.5" fill="none" />
      <Flame x={0} y={-1} size={7} index={i} />
    </g>
  );
}

/** Diyas floating down a river under the night sky, drifting once lit. */
function River() {
  const diyas = [
    [40, 150],
    [100, 172],
    [160, 146],
    [214, 180],
    [262, 154],
    [318, 174],
    [130, 200],
    [244, 204],
  ] as const;
  return (
    <>
      <path d="M0 126Q120 116 240 124T360 122V220H0z" fill={WATER} />
      <path d="M0 126Q120 116 240 124T360 122" stroke={DEEP} strokeWidth="3" fill="none" />
      {Array.from({ length: 6 }, (_, i) => (
        <path
          key={i}
          d={`M${30 + (i % 3) * 120} ${150 + i * 10}q18 -5 36 0`}
          stroke={CLOTH}
          strokeOpacity="0.4"
          fill="none"
          className="bl-shimmer"
          style={at(i, { "--bd": `${i * -500}ms` })}
        />
      ))}
      {diyas.map(([x, y], i) => (
        <g key={i} className="bl-drift" style={at(i, { "--bd": `${i * -900}ms` })}>
          <ellipse
            cx={x}
            cy={y + 14}
            rx="7"
            ry="18"
            fill="url(#guest-halo)"
            className="guest-halo"
            style={at(i)}
          />
          <g className="bl-bob" style={{ "--bd": `${i * -600}ms` } as CSSProperties}>
            <Diya x={x} y={y} i={i} size={i > 5 ? 1.2 : 1} />
          </g>
        </g>
      ))}
    </>
  );
}

/** Sky lanterns waiting on the ground; lit, they rise to the stars and sway there. */
function Sky() {
  const lanterns = [
    [60, 70, 0.8],
    [112, 30, 1],
    [168, 84, 0.9],
    [214, 20, 1.1],
    [262, 64, 0.85],
    [312, 34, 0.95],
    [140, 140, 0.7],
    [290, 130, 0.7],
  ] as const;
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => (
        <circle
          key={i}
          cx={scatter(i, 1) * 360}
          cy={scatter(i, 2) * 120}
          r={0.8 + scatter(i, 3)}
          fill={LAMP}
          className="guest-twinkle"
          style={at(i % 7)}
        />
      ))}
      <path d="M0 210Q90 196 180 204T360 200V220H0z" fill={DEEP} />
      {lanterns.map(([x, y, size], i) => (
        <g
          key={i}
          className="bl-rise"
          style={at(i, { "--bh": `${200 - y - 18}px` })}
          transform={`translate(${x} ${y}) scale(${size})`}
        >
          <g className="bl-sway-lit" style={{ "--bd": `${i * -700}ms` } as CSSProperties}>
            <Glow x={0} y={4} r={34} i={i} />
            <path
              d="M-14 -20L14 -20 18 18 -18 18z"
              fill={i % 2 ? MARIGOLD_DEEP : JEWEL}
              className="bl-paper"
            />
            <path
              d="M-14 -20L14 -20 18 18 -18 18z"
              fill={LAMP}
              className="bl-paper-lit"
              style={at(i)}
            />
            <path d="M-7 -20L-9 18M7 -20L9 18" stroke={CLOTH} strokeOpacity="0.3" />
            <rect x="-18" y="16" width="36" height="4" rx="2" fill={GILT} />
            <Flame x={0} y={22} size={5} index={i} />
          </g>
        </g>
      ))}
    </>
  );
}

/** Diyas laid in rings round a lotus of petals, lit from the middle out. */
function Spiral({ flower }: { flower: GuestFlower }) {
  const cx = 180;
  const cy = 128;
  const rings = [
    { r: 0, count: 1 },
    { r: 42, count: 6 },
    { r: 84, count: 12 },
  ];
  let n = 0;
  return (
    <>
      <ellipse cx={cx} cy={cy + 6} rx="168" ry="88" fill={CLOTH} opacity="0.12" />
      {[60, 104].map((r) => (
        <ellipse
          key={r}
          cx={cx}
          cy={cy + 6}
          rx={r * 1.5}
          ry={r * 0.6}
          fill="none"
          stroke={GILT}
          strokeDasharray="2 5"
        />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <Bloom
            key={i}
            kind={flower}
            x={fine(cx + Math.cos(a) * 96)}
            y={fine(cy + 6 + Math.sin(a) * 38)}
            size={13}
            turn={i * 30}
          />
        );
      })}
      {rings.map((ring) =>
        Array.from({ length: ring.count }, (_, i) => {
          const a = (i / ring.count) * Math.PI * 2 + 0.3;
          const index = n++;
          return (
            <Diya
              key={index}
              x={fine(cx + Math.cos(a) * ring.r * 1.6)}
              y={fine(cy + Math.sin(a) * ring.r * 0.62)}
              i={index}
              size={ring.r === 0 ? 1.5 : 1}
            />
          );
        }),
      )}
    </>
  );
}

/** A brass deepstambh, its tiers of lamps lit from the foot to the top. */
function Stambh() {
  const tiers = [
    { y: 180, half: 70, count: 9 },
    { y: 146, half: 56, count: 7 },
    { y: 112, half: 42, count: 5 },
    { y: 78, half: 28, count: 3 },
  ];
  let n = 0;
  return (
    <>
      <Glow x={180} y={110} r={120} i={8} />
      <path d="M150 214L160 196H200L210 214z" fill={GILT} />
      <path d="M170 196L174 40H186L190 196z" fill={GILT} />
      <path d="M180 22C172 30 172 40 180 44 188 40 188 30 180 22z" fill={GILT} />
      {tiers.map((tier) => (
        <g key={tier.y}>
          <path
            d={`M${180 - tier.half} ${tier.y}Q180 ${tier.y + 12} ${180 + tier.half} ${tier.y}L${180 + tier.half - 4} ${tier.y + 5}Q180 ${tier.y + 16} ${180 - tier.half + 4} ${tier.y + 5}z`}
            fill={GILT}
          />
          {Array.from({ length: tier.count }, (_, i) => {
            const x = 180 - tier.half + 6 + (i / (tier.count - 1)) * (tier.half * 2 - 12);
            const index = n++;
            return (
              <g key={i}>
                <path
                  d={`M${x - 5} ${tier.y - 1}Q${x} ${tier.y + 5} ${x + 5} ${tier.y - 1}z`}
                  fill={CLAY}
                />
                <Flame x={x} y={tier.y - 2} size={6} index={Math.floor(index / 2)} />
              </g>
            );
          })}
        </g>
      ))}
      <Flame x={180} y={44} size={8} index={11} />
    </>
  );
}

/** One star kandil: an eight-pointed paper star with tassels, on its string. */
function Kandil({ x, y, size, i }: { x: number; y: number; size: number; i: number }) {
  const star = Array.from({ length: 16 }, (_, k) => {
    const r = k % 2 ? 18 : 36;
    const a = (k / 16) * Math.PI * 2 - Math.PI / 2;
    return `${fine(Math.cos(a) * r)} ${fine(Math.sin(a) * r)}`;
  }).join("L");
  return (
    <g transform={`translate(${x} 0)`}>
      <path d={`M0 0V${y - 36 * size}`} stroke={GILT} />
      <g transform={`translate(0 ${y}) scale(${size})`}>
        <g className="bl-swing" style={{ "--bd": `${i * -900}ms` } as CSSProperties}>
          <Glow x={0} y={0} r={70} i={i} />
          <path
            d={`M${star}z`}
            fill={i % 2 ? MARIGOLD_DEEP : JEWEL}
            stroke={GILT}
            strokeWidth="2"
          />
          <path d={`M${star}z`} fill={LAMP} className="bl-paper-lit" style={at(i)} />
          <circle r="10" fill={CLOTH} opacity="0.5" />
          <Flame x={0} y={6} size={6} index={i} />
          {[-24, -8, 8, 24].map((dx, k) => (
            <g key={dx} transform={`translate(${dx} ${30 - Math.abs(dx) * 0.3})`}>
              <path
                d="M0 0V26"
                stroke={k % 2 ? GILT : MARIGOLD}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cy="28" r="3" fill={GILT} />
            </g>
          ))}
        </g>
      </g>
    </g>
  );
}

/** A star-shaped akash kandil with two smaller ones, swinging on their strings. */
function Akash() {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <path
            key={i}
            d={`M${fine(180 + Math.cos(a) * 60)} ${fine(96 + Math.sin(a) * 60)}L${fine(180 + Math.cos(a) * 110)} ${fine(96 + Math.sin(a) * 110)}`}
            stroke={LAMP}
            strokeWidth="2"
            strokeLinecap="round"
            className="bl-ray"
            style={at(i % 4)}
          />
        );
      })}
      <g className="max-sm:hidden">
        <Kandil x={60} y={70} size={0.6} i={1} />
        <Kandil x={300} y={100} size={0.65} i={2} />
      </g>
      <Kandil x={180} y={92} size={1} i={0} />
    </>
  );
}

/** Candles of different heights on a brass tray, with rose petals round them. */
function Candles({ flower }: { flower: GuestFlower }) {
  const candles = [
    [84, 50],
    [120, 84],
    [154, 60],
    [190, 104],
    [226, 70],
    [260, 90],
    [292, 46],
  ] as const;
  return (
    <>
      <ellipse cx="188" cy="196" rx="150" ry="18" fill={GILT} />
      <ellipse
        cx="188"
        cy="192"
        rx="138"
        ry="12"
        fill={`color-mix(in oklab, ${GILT} 70%, ${DEEP})`}
      />
      {candles.map(([x, h], i) => (
        <g key={i}>
          <rect x={x - 12} y={190 - h} width="24" height={h} rx="3" fill={CLOTH} />
          <rect
            x={x - 12}
            y={190 - h}
            width="7"
            height={h}
            rx="3"
            fill="var(--flower-jasmine-edge)"
            opacity="0.5"
          />
          <path d={`M${x - 12} ${193 - h}q4 10 7 0q3 14 6 0q4 8 7 0q3 6 4 0`} fill={CLOTH} />
          <path d={`M${x} ${190 - h}v-6`} stroke={DEEP} strokeWidth="1.6" />
          <Flame x={x} y={185 - h} size={8} index={i} />
        </g>
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <Bloom key={i} kind={flower} x={70 + i * 34} y={200} size={12} turn={i * 40} />
      ))}
    </>
  );
}

/** A glass jar of fireflies; lit, they glow and float out round it. */
function Fireflies() {
  const flies = Array.from({ length: 16 }, (_, i) => {
    const out = [40 + scatter(i, 4) * 280, 20 + scatter(i, 5) * 150] as const;
    const inside = [164 + scatter(i, 6) * 32, 150 + scatter(i, 7) * 46] as const;
    return { out, inside };
  });
  return (
    <>
      {flies.map(({ out, inside }, i) => (
        <g key={i} className="bl-fly-out" transform={`translate(${fine(out[0])} ${fine(out[1])})`}>
          <g
            className="bl-fly"
            style={at(i, {
              "--bx": `${fine(inside[0] - out[0])}px`,
              "--by": `${fine(inside[1] - out[1])}px`,
            })}
          >
            <g className="bl-wander" style={{ "--bd": `${i * -700}ms` } as CSSProperties}>
              <circle r="14" fill="url(#guest-halo)" className="guest-halo" style={at(i)} />
              <circle r="2.6" fill={LAMP} className="bl-firefly" style={at(i)} />
            </g>
          </g>
        </g>
      ))}
      {/* The jar, drawn over the fireflies still inside */}
      <path
        d="M152 132Q150 140 146 150V200Q146 212 158 212H202Q214 212 214 200V150Q210 140 208 132z"
        fill={CLOTH}
        fillOpacity="0.16"
        stroke={CLOTH}
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <path
        d="M154 150V198"
        stroke={CLOTH}
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="150" y="120" width="60" height="14" rx="4" fill={GILT} className="bl-jar-lid" />
      <path d="M150 127H210" stroke={DEEP} strokeOpacity="0.3" />
    </>
  );
}

/** A pierced brass lantern on its chain, throwing stars of light round it. */
function Jaali() {
  const specks = Array.from({ length: 30 }, (_, i) => {
    const a = (i / 30) * Math.PI * 2 + scatter(i, 8);
    const r = 70 + scatter(i, 9) * 80;
    return [fine(Math.cos(a) * r * 1.3), fine(Math.sin(a) * r * 0.75)] as const;
  });
  return (
    <>
      <g transform="translate(180 120)">
        <g className="bl-turn">
          {specks.map(([x, y], i) => (
            <path
              key={i}
              d={`M${x} ${y - 4}L${x + 1.4} ${y - 1.4} ${x + 4} ${y} ${x + 1.4} ${y + 1.4} ${x} ${y + 4} ${x - 1.4} ${y + 1.4} ${x - 4} ${y} ${x - 1.4} ${y - 1.4}z`}
              fill={LAMP}
              className="bl-speck"
              style={at(i % 6)}
            />
          ))}
        </g>
      </g>
      <path d="M180 0V56" stroke={GILT} strokeWidth="2" strokeDasharray="5 3" />
      <g className="bl-swing">
        <Glow x={180} y={124} r={90} i={0} />
        <path d="M150 74Q180 46 210 74z" fill={GILT} />
        <circle cx="180" cy="56" r="6" fill="none" stroke={GILT} strokeWidth="3" />
        <path d="M146 74H214L222 160Q180 184 138 160z" fill={GILT} />
        {/* The piercings, dark until the lamp inside is lit */}
        {[90, 108, 126, 144].map((y, row) =>
          Array.from({ length: 5 - (row % 2) }, (_, k) => {
            const x = 156 + k * 12 + (row % 2) * 6;
            return (
              <path
                key={`${y}-${k}`}
                d={`M${x} ${y - 5}L${x + 3} ${y} ${x} ${y + 5} ${x - 3} ${y}z`}
                fill={DEEP}
                className="bl-hole"
                style={at(row)}
              />
            );
          }),
        )}
        <path d="M136 160Q180 186 224 160L216 172Q180 194 144 172z" fill={GILT} />
        <path d="M180 190V204" stroke={GILT} strokeWidth="3" />
        <circle cx="180" cy="207" r="4" fill={GILT} />
      </g>
    </>
  );
}

/** Three phuljhadi sparklers standing in a brass pot, throwing sparks once lit. */
function Sparklers() {
  const sticks = [
    [120, -24],
    [180, 0],
    [240, 22],
  ] as const;
  return (
    <>
      {sticks.map(([x, turn], s) => (
        <g key={x} transform={`translate(180 190) rotate(${turn}) translate(${x - 180} 0)`}>
          <path d="M0 0V-150" stroke={DEEP} strokeWidth="2.5" />
          <path
            d="M0 -60V-150"
            stroke={`color-mix(in oklab, ${DEEP} 60%, ${CLOTH})`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g transform="translate(0 -150)">
            <Glow x={0} y={0} r={46} i={s} />
            <circle r="5" fill={LAMP} className="guest-flame" style={at(s)} />
            {Array.from({ length: 18 }, (_, k) => {
              const a = (k / 18) * 360 + s * 11;
              const reach = 18 + scatter(k + s * 18, 10) * 22;
              return (
                <g key={k} transform={`rotate(${a})`}>
                  <path
                    d={`M6 0H${fine(reach)}M${fine(reach * 0.7)} 0l4 -4M${fine(reach * 0.7)} 0l4 4`}
                    stroke={k % 3 ? LAMP : MARIGOLD}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    className="bl-spark"
                    style={at(s, { "--bd": `${fine(-scatter(k, 11) * 900)}ms` })}
                  />
                </g>
              );
            })}
          </g>
        </g>
      ))}
      <path d="M140 186H220L212 214H148z" fill={GILT} />
      <ellipse
        cx="180"
        cy="186"
        rx="40"
        ry="6"
        fill={`color-mix(in oklab, ${GILT} 60%, ${DEEP})`}
      />
    </>
  );
}

/** A jhoomar: brass arms holding candles, hung with crystal drops that sparkle once lit. */
function Chandelier() {
  const lower = [96, 138, 180, 222, 264];
  const upper = [134, 180, 226];
  return (
    <>
      <path d="M180 0V40" stroke={GILT} strokeWidth="2.5" strokeDasharray="6 3" />
      <g className="bl-swing">
        <Glow x={180} y={110} r={130} i={6} />
        <path d="M168 40H192L198 64H162z" fill={GILT} />
        <path d="M172 64H188V150Q180 160 172 150z" fill={GILT} />
        <path d="M96 128Q180 176 264 128" stroke={GILT} strokeWidth="5" fill="none" />
        <path d="M134 94Q180 120 226 94" stroke={GILT} strokeWidth="4" fill="none" />
        {lower.map((x, i) => {
          const y = fine(128 + Math.sin(((x - 96) / 168) * Math.PI) * 24);
          return (
            <g key={`l${x}`}>
              <path d={`M${x - 9} ${y}H${x + 9}L${x + 6} ${y - 6}H${x - 6}z`} fill={GILT} />
              <rect x={x - 4} y={y - 26} width="8" height="20" rx="2" fill={CLOTH} />
              <Flame x={x} y={y - 27} size={7} index={i} />
              {/* Crystal drops */}
              <path d={`M${x} ${y + 4}V${y + 16}`} stroke={GILT} strokeWidth="0.8" />
              <path
                d={`M${x} ${y + 16}C${x - 4} ${y + 22} ${x - 4} ${y + 28} ${x} ${y + 30} ${x + 4} ${y + 28} ${x + 4} ${y + 22} ${x} ${y + 16}z`}
                fill="var(--flower-jasmine)"
                className="bl-crystal"
                style={at(i)}
              />
            </g>
          );
        })}
        {upper.map((x, i) => {
          const y = fine(94 + Math.sin(((x - 134) / 92) * Math.PI) * 13);
          return (
            <g key={`u${x}`}>
              <path d={`M${x - 8} ${y}H${x + 8}L${x + 5} ${y - 5}H${x - 5}z`} fill={GILT} />
              <rect x={x - 3.5} y={y - 22} width="7" height="17" rx="2" fill={CLOTH} />
              <Flame x={x} y={y - 23} size={6} index={i + 5} />
            </g>
          );
        })}
        {[150, 165, 195, 210].map((x, i) => (
          <path
            key={x}
            d={`M${x} 150c-3 5-3 10 0 12 3-2 3-7 0-12z`}
            fill="var(--flower-jasmine)"
            className="bl-crystal"
            style={at(i + 2)}
          />
        ))}
        <circle cx="180" cy="166" r="6" fill={GILT} />
      </g>
    </>
  );
}

const DRAWN: Partial<Record<LampBlessing, (props: { flower: GuestFlower }) => ReactNode>> = {
  river: River,
  sky: Sky,
  spiral: Spiral,
  stambh: Stambh,
  akash: Akash,
  candles: Candles,
  fireflies: Fireflies,
  jaali: Jaali,
  sparklers: Sparklers,
  chandelier: Chandelier,
};

const OLD: Partial<Record<LampBlessing, GuestLamp>> = {
  diyas: "diyas",
  lanterns: "lanterns",
  nilavilakku: "nilavilakku",
  fairy: "fairy",
};

/** The drawing of one way of giving light: dark until an ancestor has `data-lit`. */
export function LampStage({ way, flower }: { way: LampBlessing; flower: GuestFlower }) {
  const old = OLD[way];
  if (old) return <Lamps lamp={old} flower={flower} />;
  const Drawn = DRAWN[way]!;
  return (
    <svg aria-hidden viewBox="0 0 360 220" data-way={way} className="w-full max-w-xl">
      <LampDefs />
      <Drawn flower={flower} />
    </svg>
  );
}
