import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Suite } from "@/lib/suites/catalog";

/*
 * The landscape behind a themed event page (Step 12e): a Mughal palace garden, a royal
 * procession before a desert fort, or the Kerala backwaters. Vector art in the theme's
 * colours; the page's mood (dawn, day, dusk, night) repaints the sky and the light, so
 * every function looks different within one theme. The places sit at the top and bottom,
 * the reading plate in the middle. No figures and no deities. When a painted background
 * exists for the page (Suite.images), it replaces the vector art.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r2 = (n: number) => Number(n.toFixed(2));

const STARS = (() => {
  const rand = seeded(7);
  return Array.from({ length: 34 }, () => ({
    x: r2(rand() * 100),
    y: r2(rand() * 70),
    r: r2(0.18 + rand() * 0.32),
    delay: r2(-rand() * 3),
  }));
})();

/** Sky, the sun or moon with its halo, and stars that only show at night. */
function Sky({ id, sun }: { id: string; sun: { x: number; y: number; r: number } }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--suite-sky-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--suite-sky-bottom)" }} />
        </linearGradient>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" style={{ stopColor: "var(--suite-glow)", stopOpacity: 0.75 }} />
          <stop offset="1" style={{ stopColor: "var(--suite-glow)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="100" height="180" fill={`url(#${id}-sky)`} />
      <g className="suite-stars">
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="var(--suite-glow)"
            className={i % 3 === 0 ? "story-twinkle" : undefined}
            style={
              i % 3 === 0
                ? ({ transformOrigin: `${s.x}px ${s.y}px`, "--story-delay": `${s.delay}s` } as Vars)
                : undefined
            }
          />
        ))}
      </g>
      <circle cx={sun.x} cy={sun.y} r={sun.r * 3} fill={`url(#${id}-halo)`} />
      <circle cx={sun.x} cy={sun.y} r={sun.r} fill="var(--suite-glow)" />
    </>
  );
}

/** A hanging lantern that sways from its cord. */
function Lantern({ x, top, drop, delay }: { x: number; top: number; drop: number; delay: number }) {
  const y = top + drop;
  return (
    <g
      className="story-swing"
      style={{ transformOrigin: `${x}px ${top}px`, "--story-delay": `${delay}s` } as Vars}
    >
      <path d={`M${x} ${top}V${y}`} stroke="var(--suite-gold)" strokeWidth={0.3} />
      <circle cx={x} cy={y + 3.2} r={4.5} fill="var(--suite-light)" opacity={0.28} />
      <path
        d={`M${x - 1.6} ${y + 0.8}H${x + 1.6}L${x + 2.2} ${y + 3.2}L${x + 1.6} ${y + 5.6}H${x - 1.6}L${x - 2.2} ${y + 3.2}Z`}
        fill="var(--suite-accent)"
        stroke="var(--suite-gold)"
        strokeWidth={0.3}
      />
      <ellipse
        cx={x}
        cy={y + 3.2}
        rx={0.8}
        ry={1.3}
        fill="var(--suite-light)"
        className="story-glow"
      />
      <path d={`M${x - 1} ${y}H${x + 1}L${x} ${y - 1}Z`} fill="var(--suite-gold)" />
      <path d={`M${x} ${y + 5.6}V${y + 7}`} stroke="var(--suite-gold)" strokeWidth={0.4} />
    </g>
  );
}

/** Rajwada Bagh: a palace garden seen through a cusped arch, fountains down the pool. */
function Bagh({ id }: { id: string }) {
  const opening =
    "M12 180V70C12 52 20 44 28 40Q30 34 35 33Q38 27 43 27Q46 21 50 15Q54 21 57 27Q62 27 65 33Q70 34 72 40C80 44 88 52 88 70V180Z";
  return (
    <>
      <Sky id={id} sun={{ x: 50, y: 54, r: 7 }} />
      <g transform="translate(0 22)">
        {/* The palace on the horizon: a great dome, two chhatris and two minarets */}
        <g fill="var(--suite-far)">
          <path d="M36 98C36 88 42 84 50 72C58 84 64 88 64 98Z" />
          <path d="M49.6 72V66H50.4V72Z" />
          <circle cx="50" cy="65.4" r="0.9" />
          <rect x="28" y="96" width="44" height="26" />
          <path d="M30 96C30 91 34 89 35 86C36 89 40 91 40 96Z" />
          <path d="M60 96C60 91 64 89 65 86C66 89 70 91 70 96Z" />
          <rect x="21" y="80" width="3" height="42" />
          <rect x="76" y="80" width="3" height="42" />
          <path d="M20.4 80C20.4 77 22.5 75.5 22.5 73.5C22.5 75.5 24.6 77 24.6 80Z" />
          <path d="M75.4 80C75.4 77 77.5 75.5 77.5 73.5C77.5 75.5 79.6 77 79.6 80Z" />
        </g>
        <g fill="var(--suite-near)" opacity={0.35}>
          {[33, 41.5, 50, 58.5, 67].map((x) => (
            <path
              key={x}
              d={`M${x - 2.4} 122V109C${x - 2.4} 106 ${x} 104.6 ${x} 104.6C${x} 104.6 ${x + 2.4} 106 ${x + 2.4} 109V122Z`}
            />
          ))}
        </g>
        {/* Cypress rows either side */}
        <g fill="var(--suite-mid)">
          {[4, 10, 16, 84, 90, 96].map((x, i) => (
            <ellipse key={x} cx={x} cy={112 - (i % 3) * 2} rx={2.4} ry={11 + (i % 2) * 2} />
          ))}
        </g>
      </g>
      <rect y="142" width="100" height="38" fill="var(--suite-mid)" />
      {/* The long pool, its stone edge, and the fountains along it */}
      <path d="M46 143H54L68 180H32Z" fill="var(--suite-stone)" />
      <path d="M47.2 144H52.8L65 180H35Z" fill="var(--suite-water)" />
      <path d="M50 146V178" stroke="var(--suite-glow)" strokeWidth={0.25} opacity={0.5} />
      {(
        [
          [50, 152, 2.4],
          [50, 162, 3.4],
          [50, 175, 4.6],
        ] as const
      ).map(([x, y, h], i) => (
        <g key={y} className="suite-jet" style={{ "--story-delay": `${-i * 0.6}s` } as Vars}>
          <path
            d={`M${x} ${y}C${x - h * 0.2} ${y - h} ${x - h * 0.6} ${y - h} ${x - h * 0.8} ${y - h * 0.3}M${x} ${y}C${x + h * 0.2} ${y - h} ${x + h * 0.6} ${y - h} ${x + h * 0.8} ${y - h * 0.3}M${x} ${y}V${y - h * 1.2}`}
            fill="none"
            stroke="var(--suite-glow)"
            strokeWidth={0.45}
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* Flower beds along the pool */}
      {(
        [
          [27, 151, 5],
          [73, 151, 5],
          [15, 166, 8],
          [85, 166, 8],
        ] as const
      ).map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.36} fill="var(--suite-leaf)" />
          {Array.from({ length: 7 }, (_, i) => (
            <circle
              key={i}
              cx={x - r * 0.75 + (i * r * 1.5) / 6}
              cy={y - r * 0.08 * (i % 2)}
              r={0.7}
              fill={i % 2 ? "var(--suite-accent)" : "var(--suite-light)"}
            />
          ))}
        </g>
      ))}
      {/* The arch we look through, with jaali along its pillars */}
      <path d={`M0 0H100V180H0Z${opening}`} fillRule="evenodd" fill="var(--suite-near)" />
      <path d={opening} fill="none" stroke="var(--suite-gold)" strokeWidth={0.7} />
      <path
        d="M9 180V70C9 50 18 41 26 37Q28 31 33 30Q36 24 41 24Q45 17 50 10Q55 17 59 24Q64 24 67 30Q72 31 74 37C82 41 91 50 91 70V180"
        fill="none"
        stroke="var(--suite-gold)"
        strokeWidth={0.3}
        opacity={0.7}
      />
      <g fill="var(--suite-gold)" opacity={0.4}>
        {Array.from({ length: 16 }, (_, row) =>
          [3.2, 6.2, 93.8, 96.8].map((x) => (
            <circle key={`${row}-${x}`} cx={x} cy={80 + row * 6} r={0.55} />
          )),
        )}
      </g>
      <Lantern x={30} top={39} drop={8} delay={0} />
      <Lantern x={50} top={16} drop={14} delay={-1.3} />
      <Lantern x={70} top={39} drop={8} delay={-2.1} />
    </>
  );
}

/** One elephant with howdah and caparison, walking in the procession (faces right). */
function Elephant() {
  return (
    <g>
      {/* Legs */}
      <g fill="var(--suite-near)">
        <rect x="9" y="22" width="4.2" height="11" rx="1" />
        <rect x="15" y="22" width="4.2" height="11" rx="1" />
        <rect x="25" y="22" width="4.2" height="11" rx="1" />
        <rect x="30.5" y="22" width="4.2" height="11" rx="1" />
        {/* Body, head and trunk */}
        <ellipse cx="21" cy="18" rx="14" ry="9" />
        <circle cx="35" cy="14" r="6.4" />
        <path d="M39.6 16C42.6 19 42.8 25 41 30.4L43 31.6L41.8 32.6C38.6 31 38.2 24 36.6 19Z" />
        <path
          d="M7.4 16C5.4 18 4.6 22 5 25"
          stroke="var(--suite-near)"
          strokeWidth={0.8}
          fill="none"
        />
      </g>
      {/* Ear and tusk */}
      <ellipse cx="32.4" cy="15" rx="3.2" ry="4.6" fill="var(--suite-mid)" opacity={0.6} />
      <path
        d="M39 20.4C40.6 22 42.4 22 44 20.8"
        stroke="var(--suite-plate)"
        strokeWidth={0.9}
        fill="none"
        strokeLinecap="round"
      />
      {/* The painted forehead cloth */}
      <path
        d="M34 9.4L38.4 11.4L37.4 17.6L34.6 15.6Z"
        fill="var(--suite-accent)"
        stroke="var(--suite-gold)"
        strokeWidth={0.3}
      />
      {/* The caparison over its back, with gold work */}
      <path
        d="M12 11.5H29V19.6Q25 23.6 20.5 23.6Q16 23.6 12 19.6Z"
        fill="var(--suite-accent)"
        stroke="var(--suite-gold)"
        strokeWidth={0.5}
      />
      <path
        d="M12 19.6Q16 23.6 20.5 23.6Q25 23.6 29 19.6"
        fill="none"
        stroke="var(--suite-gold)"
        strokeWidth={1}
        strokeDasharray="0.1 1.4"
        strokeLinecap="round"
      />
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 5 - row }, (_, i) => (
          <circle
            key={`${row}-${i}`}
            cx={14.5 + row * 1.5 + i * 3}
            cy={14 + row * 3}
            r={0.55}
            fill="var(--suite-gold)"
          />
        )),
      )}
      {/* The howdah and its canopy */}
      <rect x="14.4" y="6.6" width="12.2" height="4.9" rx="0.6" fill="var(--suite-gold)" />
      <path d="M14.4 9H26.6" stroke="var(--suite-near)" strokeWidth={0.3} opacity={0.5} />
      <path d="M15.4 6.6V1.4M25.6 6.6V1.4" stroke="var(--suite-gold)" strokeWidth={0.5} />
      <path
        d="M13.8 1.4C15.2 -3.2 18.4 -5.4 20.5 -6.8C22.6 -5.4 25.8 -3.2 27.2 1.4Z"
        fill="var(--suite-accent)"
        stroke="var(--suite-gold)"
        strokeWidth={0.4}
      />
      <path d="M20.5 -6.8V-8.6" stroke="var(--suite-gold)" strokeWidth={0.5} />
      <circle cx="20.5" cy="-9" r="0.6" fill="var(--suite-gold)" />
      {/* Eye and anklets */}
      <circle cx="36.8" cy="12.6" r="0.45" fill="var(--suite-plate)" />
      {[9, 15, 25, 30.5].map((x) => (
        <rect key={x} x={x} y="29.6" width="4.2" height="0.9" fill="var(--suite-gold)" />
      ))}
    </g>
  );
}

/** Shahi Savari: two caparisoned elephants before a desert fort, bunting overhead. */
function Savari({ id }: { id: string }) {
  const rand = seeded(11);
  const flags = Array.from({ length: 13 }, (_, i) => ({
    x: 2 + i * 8,
    tone: Math.floor(rand() * 3),
  }));
  const tones = ["var(--suite-accent)", "var(--suite-gold)", "var(--suite-leaf)"];
  return (
    <>
      <Sky id={id} sun={{ x: 50, y: 70, r: 10 }} />
      {/* Hills and the fort along their ridge */}
      <path
        d="M0 108C14 96 24 100 34 104C46 96 58 94 70 102C82 96 92 98 100 104V124H0Z"
        fill="var(--suite-far)"
      />
      <g fill="var(--suite-mid)">
        <rect x="18" y="98" width="64" height="18" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={18.6 + i * 4} y="96" width="2.2" height="2.4" />
        ))}
        <path d="M14 116V100A4 4 0 0 1 22 100V116Z" />
        <path d="M78 116V100A4 4 0 0 1 86 100V116Z" />
        {[34, 50, 66].map((x) => (
          <g key={x}>
            <rect x={x - 3} y="90" width="0.8" height="6" />
            <rect x={x + 2.2} y="90" width="0.8" height="6" />
            <path
              d={`M${x - 4} 90C${x - 3} 86 ${x - 1.4} 84.6 ${x} 83C${x + 1.4} 84.6 ${x + 3} 86 ${x + 4} 90Z`}
            />
          </g>
        ))}
        <path d="M50 83V77" stroke="var(--suite-mid)" strokeWidth={0.4} />
      </g>
      <path d="M50 77L55 78.6L50 80.2Z" fill="var(--suite-accent)" />
      <g fill="var(--suite-near)" opacity={0.3}>
        {[26, 42, 58, 74].map((x) => (
          <path key={x} d={`M${x - 1.6} 116V109A1.6 1.6 0 0 1 ${x + 1.6} 109V116Z`} />
        ))}
      </g>
      {/* Desert and dunes */}
      <rect y="116" width="100" height="64" fill="var(--suite-water)" />
      <path
        d="M0 132C20 124 36 130 52 128C70 124 86 130 100 126V180H0Z"
        fill="var(--suite-mid)"
        opacity={0.18}
      />
      <path
        d="M0 150C24 142 44 150 64 146C80 142 92 146 100 144V180H0Z"
        fill="var(--suite-mid)"
        opacity={0.22}
      />
      {/* The procession: two elephants facing each other */}
      <g className="suite-walk" style={{ "--story-delay": "0s" } as Vars}>
        <g transform="translate(2 136) scale(1.02)">
          <Elephant />
        </g>
      </g>
      <g className="suite-walk" style={{ "--story-delay": "-0.8s" } as Vars}>
        <g transform="translate(98 136) scale(-1.02 1.02)">
          <Elephant />
        </g>
      </g>
      {/* Marigold strings on the sand before them */}
      <path
        d="M0 176C30 170 70 170 100 176"
        stroke="var(--suite-light)"
        strokeWidth={1.6}
        strokeDasharray="0.1 2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bunting across the sky */}
      {[
        { y: 8, sag: 8 },
        { y: 18, sag: 6 },
      ].map(({ y, sag }, row) => (
        <g
          key={y}
          className="story-swing"
          style={{ transformOrigin: `50px ${y}px`, "--story-delay": `${-row * 1.4}s` } as Vars}
        >
          <path
            d={`M-2 ${y}Q50 ${y + sag * 2} 102 ${y}`}
            stroke="var(--suite-gold)"
            strokeWidth={0.3}
            fill="none"
          />
          {flags.map((f, i) => {
            const t = (f.x + 2) / 104;
            const fy = y + sag * 2 * 2 * t * (1 - t);
            return (
              <path
                key={i}
                d={`M${f.x} ${fy}L${f.x + 4} ${fy}L${f.x + 2} ${fy + 4.4}Z`}
                fill={tones[(f.tone + row) % 3]}
              />
            );
          })}
        </g>
      ))}
      {/* A jharokha's scalloped awning along the top */}
      <path
        d={`M0 0H100V3${Array.from({ length: 10 }, (_, i) => `Q${95 - i * 10} 7 ${90 - i * 10} 3`).join("")}Z`}
        fill="var(--suite-near)"
      />
      <path
        d={`M100 3${Array.from({ length: 10 }, (_, i) => `Q${95 - i * 10} 7 ${90 - i * 10} 3`).join("")}`}
        fill="none"
        stroke="var(--suite-gold)"
        strokeWidth={0.4}
      />
    </>
  );
}

/** A coconut palm leaning in from one side, its fronds swaying. */
function Palm({
  base,
  crown,
  delay,
}: {
  base: [number, number];
  crown: [number, number];
  delay: number;
}) {
  const [bx, by] = base;
  const [cx, cy] = crown;
  const lean = cx - bx;
  const fronds = [-150, -115, -80, -45, -12, 20, 55];
  return (
    <g
      className="suite-sway"
      style={{ "--suite-origin": "50% 100%", "--story-delay": `${delay}s` } as Vars}
    >
      <path
        d={`M${bx - 2.2} ${by}C${bx + lean * 0.2 - 1.6} ${by - 40} ${cx - lean * 0.2 - 0.8} ${cy + 30} ${cx - 0.8} ${cy}H${cx + 0.8}C${cx - lean * 0.2 + 0.8} ${cy + 30} ${bx + lean * 0.2 + 1.6} ${by - 40} ${bx + 2.2} ${by}Z`}
        fill="var(--suite-near)"
      />
      {fronds.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 17 - Math.abs(i - 3) * 1.2;
        const ex = cx + Math.cos(rad) * len;
        const ey = cy + Math.sin(rad) * len * 0.8 + 6;
        const mx = cx + Math.cos(rad) * len * 0.5;
        const my = cy + Math.sin(rad) * len * 0.5 - 3;
        return (
          <path
            key={angle}
            d={`M${cx} ${cy}Q${r2(mx)} ${r2(my)} ${r2(ex)} ${r2(ey)}Q${r2(mx + 1)} ${r2(my + 2.4)} ${cx} ${cy + 0.8}Z`}
            fill={i % 2 ? "var(--suite-near)" : "var(--suite-leaf)"}
          />
        );
      })}
      <circle cx={cx - 0.8} cy={cy + 1.6} r={1} fill="var(--suite-mid)" />
      <circle cx={cx + 0.9} cy={cy + 1.8} r={1} fill="var(--suite-mid)" />
    </g>
  );
}

/** Kayal: a houseboat on the backwaters between leaning palms, lamps on the water. */
function Kayal({ id }: { id: string }) {
  const rand = seeded(23);
  const ripples = Array.from({ length: 16 }, () => ({
    x: r2(rand() * 90),
    y: r2(128 + rand() * 50),
    w: r2(4 + rand() * 9),
    delay: r2(-rand() * 4),
  }));
  return (
    <>
      <Sky id={id} sun={{ x: 64, y: 98, r: 7 }} />
      {/* The far bank: a line of palms and paddy */}
      <path
        d={`M0 116${Array.from({ length: 20 }, (_, i) => `Q${i * 5 + 2.5} ${104 + (i % 3) * 2} ${i * 5 + 5} 112`).join("")}V120H0Z`}
        fill="var(--suite-far)"
      />
      {[14, 30, 78, 90].map((x, i) => (
        <g key={x} fill="var(--suite-far)">
          <path
            d={`M${x - 0.4} 114L${x - 0.2 + (i % 2)} 98H${x + 0.4 + (i % 2)}L${x + 0.6} 114Z`}
          />
          <path
            d={`M${x + (i % 2)} 98q-5 -1 -7 3q4 -3 7 -2.2q-3 -4 -8 -3q5 -2 8 1.4q1 -4 6 -5q-3 3 -5 5q4 -2 7 1q-4 -1 -8 -0.2Z`}
          />
        </g>
      ))}
      {/* The water and the sun's path on it */}
      <rect y="116" width="100" height="64" fill="var(--suite-water)" />
      <path d="M0 116H100V119H0Z" fill="var(--suite-far)" opacity={0.35} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M${64 - 5 + (i % 2)} ${121 + i * 3.4}h${10 - i}`}
          stroke="var(--suite-glow)"
          strokeWidth={0.7}
          strokeLinecap="round"
          className="suite-ripple"
          style={{ "--story-delay": `${-i * 0.5}s` } as Vars}
        />
      ))}
      {ripples.map((r, i) => (
        <path
          key={i}
          d={`M${r.x} ${r.y}h${r.w}`}
          stroke="var(--suite-sky-bottom)"
          strokeWidth={0.35}
          strokeLinecap="round"
          className="suite-ripple"
          style={{ "--story-delay": `${r.delay}s` } as Vars}
        />
      ))}
      {/* The kettuvallam, its thatched roof and hull */}
      <g className="suite-bob">
        <path
          d="M14 132Q16 139 36 139Q54 139 60 130L57 131Q50 134 36 134Q22 134 14 132Z"
          fill="var(--suite-near)"
        />
        <path d="M13 131.6L10 128L14.6 130.6Z" fill="var(--suite-near)" />
        <path d="M59 130L63 125.6L58 128.4Z" fill="var(--suite-near)" />
        <path d="M20 133V127Q35 117 52 127V133Z" fill="var(--suite-stone)" />
        <path d="M20 127Q35 117 52 127" fill="none" stroke="var(--suite-gold)" strokeWidth={0.5} />
        {[25, 30, 35, 40, 45].map((x) => (
          <path
            key={x}
            d={`M${x} ${x === 35 ? 122 : 124}V133`}
            stroke="var(--suite-accent)"
            strokeWidth={0.3}
            opacity={0.8}
          />
        ))}
        {[27.5, 42.5].map((x) => (
          <rect
            key={x}
            x={x - 1.4}
            y="128.6"
            width="2.8"
            height="2.4"
            rx="0.4"
            fill="var(--suite-light)"
            opacity={0.85}
          />
        ))}
        <path
          d="M14 139Q35 142 60 136"
          stroke="var(--suite-near)"
          strokeWidth={0.4}
          opacity={0.3}
          fill="none"
        />
      </g>
      {/* Palms leaning in from both banks */}
      <Palm base={[-2, 184]} crown={[20, 70]} delay={0} />
      <Palm base={[104, 184]} crown={[84, 84]} delay={-2.4} />
      <Palm base={[6, 186]} crown={[4, 104]} delay={-1.2} />
      {/* Floating lamps and lotus leaves near the bank */}
      {(
        [
          [30, 164],
          [46, 172],
          [62, 160],
          [74, 172],
        ] as const
      ).map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 1} rx={4.4} ry={1.2} fill="var(--suite-leaf)" opacity={0.8} />
          <path d={`M${x - 2} ${y}Q${x} ${y + 2.2} ${x + 2} ${y}Z`} fill="var(--suite-accent)" />
          <circle cx={x} cy={y - 2} r={2.4} fill="var(--suite-light)" opacity={0.25} />
          <ellipse
            cx={x}
            cy={y - 1}
            rx={0.6}
            ry={1.1}
            fill="var(--suite-light)"
            className="story-flame"
            style={{ "--story-delay": `${-i * 0.3}s` } as Vars}
          />
        </g>
      ))}
    </>
  );
}

/** The whole landscape for a page, or its painted background when there is one. */
export function SuiteBackdrop({
  suite,
  image,
  seconds,
  lazy = false,
  className,
  under,
  contain = false,
  children,
}: {
  suite: Suite;
  image?: string;
  /** How long the page stays, for the slow push-in. */
  seconds?: number;
  /** Load the painting only when it scrolls near, for pickers with many themes. */
  lazy?: boolean;
  className?: string;
  /** Drawn under the painting and moving with it: photos showing through its frames. */
  under?: ReactNode;
  /** Show the whole painting (its frames must not be cropped), a blurred copy filling round it. */
  contain?: boolean;
  children?: ReactNode;
}) {
  const raw = useId();
  const id = `suite${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  if (suite.art === "card") return null;
  return (
    <div aria-hidden className={className}>
      <div
        className="suite-drift absolute inset-0"
        style={seconds ? ({ "--suite-duration": `${seconds + 2}s` } as Vars) : undefined}
      >
        {contain && image && (
          // eslint-disable-next-line @next/next/no-img-element -- decorative fill round the painting
          <img
            src={image}
            alt=""
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 size-full scale-110 object-cover opacity-80 blur-2xl select-none"
          />
        )}
        {under}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- decorative, sized by the page
          <img
            src={image}
            alt=""
            decoding="async"
            loading={lazy ? "lazy" : undefined}
            // A mouse swipe across the page must turn it, not start dragging the picture
            draggable={false}
            className={cn(
              "pointer-events-none relative size-full select-none",
              // Its top and bottom edges melt into the blurred copy round it
              contain
                ? "[mask-image:linear-gradient(to_bottom,transparent,black_4%,black_96%,transparent)] object-contain"
                : "object-cover",
            )}
          />
        ) : (
          <svg viewBox="0 0 100 180" preserveAspectRatio="xMidYMid slice" className="size-full!">
            {suite.art === "bagh" && <Bagh id={id} />}
            {suite.art === "savari" && <Savari id={id} />}
            {suite.art === "kayal" && <Kayal id={id} />}
          </svg>
        )}
      </div>
      {children}
    </div>
  );
}
