import { createContext, use, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { StorySceneId } from "@/lib/engine/story";

/*
 * The painted scene behind each beat of the story (Step 12d, docs/MOTION.md section 3):
 * turmeric splashing for haldi, henna drawing itself for mehendi, stage lights for the
 * sangeet, the sacred fire and meeting garlands for the wedding. Vector art drawn from
 * geometry in the card's own colours, kept to the top and bottom bands so the words in
 * the middle always read. Every movement is CSS, so Still mode shows a finished picture.
 * No figures and no deities: sacred art stays with the card's own symbol, which only glows.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** A small seeded generator, so particles sit in the same places on server and client. */
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

type Faller = {
  x: number;
  delay: number;
  duration: number;
  size: number;
  spin: number;
  tone: number;
};

function fallers(count: number, seed: number): Faller[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => ({
    x: r2(4 + rand() * 92),
    delay: r2(-rand() * 9),
    duration: r2(6 + rand() * 5),
    size: r2(0.7 + rand() * 0.7),
    spin: Math.round(rand() * 360),
    tone: rand(),
  }));
}

/** Petals, rice or confetti drifting down across the whole panel. */
function Falling({
  count,
  seed,
  colours,
  shape,
}: {
  count: number;
  seed: number;
  colours: readonly string[];
  shape: "petal" | "rice" | "confetti";
}) {
  const d =
    shape === "petal"
      ? "M0 -1.6C1.1 -0.9 1.1 0.9 0 1.6C-1.1 0.9 -1.1 -0.9 0 -1.6Z"
      : shape === "rice"
        ? "M0 -0.9C0.45 -0.5 0.45 0.5 0 0.9C-0.45 0.5 -0.45 -0.5 0 -0.9Z"
        : "M-1 -0.5H1V0.5H-1Z";
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 140"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      {fallers(count, seed).map((f, i) => (
        <g key={i} transform={`translate(${f.x} 0)`}>
          <path
            d={d}
            className="story-fall"
            fill={colours[Math.floor(f.tone * colours.length)] ?? colours[0]}
            style={
              {
                "--story-delay": `${f.delay}s`,
                "--story-duration": `${f.duration}s`,
                "--story-spin": `${f.spin}deg`,
                "--story-size": f.size,
              } as Vars
            }
          />
        </g>
      ))}
    </svg>
  );
}

/** On a themed page the landscape owns the ground, so only the top bands are drawn. */
const Themed = createContext(false);

/** A band of art pinned to the top or bottom of the panel at full width. */
function Band({ edge, children }: { edge: "top" | "bottom"; children: ReactNode }) {
  const themed = use(Themed);
  if (themed && edge === "bottom") return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 44"
      preserveAspectRatio={edge === "top" ? "xMidYMin meet" : "xMidYMax meet"}
      className={cn(
        "absolute inset-x-0 w-full",
        // The top band starts under the story's controls
        edge === "top" ? "top-[4.5rem] h-[26%]" : "bottom-0 h-[30%]",
      )}
    >
      {children}
    </svg>
  );
}

/** A path that draws itself, like a line of henna or a gold rule. */
function Draw({
  d,
  colour,
  width,
  delay = 0,
  duration = 2.4,
}: {
  d: string;
  colour: string;
  width: number;
  delay?: number;
  duration?: number;
}) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={colour}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="story-draw"
      style={{ "--story-delay": `${delay}s`, "--story-duration": `${duration}s` } as Vars}
    />
  );
}

/** A marigold head: rings of petals round a darker heart. */
function Marigold({ x, y, r, delay = 0 }: { x: number; y: number; r: number; delay?: number }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <g
      transform={`translate(${x} ${y})`}
      className="story-bloom"
      style={{ "--story-delay": `${delay}s` } as Vars}
    >
      <g className="story-bloom-inner">
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx={0}
            cy={-r * 0.62}
            rx={r * 0.3}
            ry={r * 0.46}
            transform={`rotate(${deg})`}
            fill="var(--marigold)"
          />
        ))}
        {petals.map((deg) => (
          <ellipse
            key={`i${deg}`}
            cx={0}
            cy={-r * 0.36}
            rx={r * 0.22}
            ry={r * 0.3}
            transform={`rotate(${deg + 15})`}
            fill="var(--marigold-strong)"
          />
        ))}
        <circle r={r * 0.2} fill="var(--motion-clay)" />
      </g>
    </g>
  );
}

/** A string of marigolds hanging in a curve, swinging gently from its ends. */
function Garland({
  from,
  to,
  sag,
  count,
  delay = 0,
}: {
  from: [number, number];
  to: [number, number];
  sag: number;
  count: number;
  delay?: number;
}) {
  const points = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    const x = from[0] + (to[0] - from[0]) * t;
    const y = from[1] + (to[1] - from[1]) * t + Math.sin(Math.PI * t) * sag;
    return [r2(x), r2(y)] as const;
  });
  return (
    <g
      className="story-swing"
      style={
        {
          "--story-delay": `${delay}s`,
          transformOrigin: `${(from[0] + to[0]) / 2}px ${from[1]}px`,
        } as Vars
      }
    >
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r={1.9}
            fill={i % 2 ? "var(--marigold-strong)" : "var(--marigold)"}
          />
          <circle cx={x} cy={y} r={0.7} fill="var(--motion-clay)" />
        </g>
      ))}
    </g>
  );
}

/** A clay diya with a flame that flickers. */
function Diya({
  x,
  y,
  scale = 1,
  delay = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  delay?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse
        cx={0}
        cy={-5.2}
        rx={4.6}
        ry={6.4}
        fill="var(--motion-flame)"
        opacity={0.28}
        className="story-glow"
        style={{ "--story-delay": `${delay}s` } as Vars}
      />
      <path
        d="M0 -8.4C1.6 -6 1.9 -4.4 0 -2.6C-1.9 -4.4 -1.6 -6 0 -8.4Z"
        fill="var(--motion-flame)"
        className="story-flame"
        style={{ "--story-delay": `${delay}s` } as Vars}
      />
      <path
        d="M-5 -2.4H5C4.4 1.6 2.4 2.8 0 2.8C-2.4 2.8 -4.4 1.6 -5 -2.4Z"
        fill="var(--motion-clay)"
      />
      <path d="M-5 -2.4H5" stroke="var(--card-gold)" strokeWidth={0.6} />
    </g>
  );
}

/** Four-point stars that twinkle in turn. */
function Sparkles({
  count,
  seed,
  area,
}: {
  count: number;
  seed: number;
  area: [number, number, number, number];
}) {
  const rand = seeded(seed);
  const [x0, y0, w, h] = area;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = r2(x0 + rand() * w);
        const y = r2(y0 + rand() * h);
        const s = r2(0.8 + rand() * 1.2);
        return (
          <path
            key={i}
            d={`M${x} ${y - 2 * s}Q${x} ${y} ${x + 2 * s} ${y}Q${x} ${y} ${x} ${y + 2 * s}Q${x} ${y} ${x - 2 * s} ${y}Q${x} ${y} ${x} ${y - 2 * s}Z`}
            fill="var(--card-gold)"
            className="story-twinkle"
            style={
              { "--story-delay": `${r2(rand() * 2.4)}s`, transformOrigin: `${x}px ${y}px` } as Vars
            }
          />
        );
      })}
    </>
  );
}

/** Two interlocking rings drawing themselves, for the roka and engagement. */
function Rings() {
  return (
    <Band edge="bottom">
      <Draw d="M44 30a7 7 0 1 0 0.01 0Z" colour="var(--card-gold)" width={1.1} delay={0.3} />
      <Draw d="M56 30a7 7 0 1 0 0.01 0Z" colour="var(--card-accent)" width={1.1} delay={0.8} />
      <path d="M50 21.6l1.6 -2.2h-3.2Z" fill="var(--card-accent)" className="story-rise-in" />
      <Sparkles count={9} seed={7} area={[24, 10, 52, 30]} />
    </Band>
  );
}

/** A henna vine climbing from each corner, with a paisley (buta) at its root. */
const HENNA_VINE =
  "M6 44C8 34 4 28 10 22C15 17 22 19 22 13C22 8 17 6 14 9C12 11 14 14 16 13" +
  "M10 22C14 24 18 28 17 33C16 37 12 38 11 35" +
  "M22 13C26 10 31 12 34 8C36 5 34 2 31 3";
const BUTA = "M9 40C3 38 2 31 7 28C12 25 17 30 14 35C12 38 10 38 9 40Z";

function Henna() {
  const colour = "var(--motion-clay)";
  return (
    <>
      <Band edge="top">
        <g transform="translate(100 0) scale(-0.75 0.75) translate(0 44) scale(1 -1)">
          <Draw d={HENNA_VINE} colour={colour} width={0.8} delay={0.6} duration={2.8} />
          <Draw d={BUTA} colour={colour} width={0.8} delay={0.4} />
        </g>
      </Band>
      <Band edge="bottom">
        <Draw d={HENNA_VINE} colour={colour} width={0.8} duration={2.8} />
        <Draw d={BUTA} colour={colour} width={0.8} />
        <Draw
          d="M30 40C38 34 46 38 50 32C54 38 62 34 70 40M50 32C48 28 50 25 52 26"
          colour={colour}
          width={0.7}
          delay={1}
        />
        {[34, 42, 58, 66].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={42}
            r={0.8}
            fill={colour}
            className="story-rise-in"
            style={{ "--story-delay": `${1.6 + i * 0.15}s` } as Vars}
          />
        ))}
      </Band>
    </>
  );
}

/** Turmeric splashing up from a brass bowl, with marigolds in the corners. */
function Haldi() {
  const rand = seeded(11);
  const drops = Array.from({ length: 16 }, (_, i) => {
    const angle = (-160 + (i / 15) * 140) * (Math.PI / 180);
    const reach = 14 + rand() * 12;
    return {
      dx: r2(Math.cos(angle) * reach),
      dy: r2(Math.sin(angle) * reach),
      r: r2(0.8 + rand() * 1.2),
      delay: r2(0.2 + rand() * 0.5),
    };
  });
  return (
    <>
      <div
        aria-hidden
        className="story-wash absolute inset-0"
        style={{ "--story-wash": "var(--motion-turmeric)" } as Vars}
      />
      <Band edge="top">
        <Marigold x={10} y={10} r={8} />
        <Marigold x={90} y={10} r={8} delay={0.2} />
        <Marigold x={24} y={4} r={5} delay={0.4} />
        <Marigold x={76} y={4} r={5} delay={0.5} />
      </Band>
      <Band edge="bottom">
        {drops.map((drop, i) => (
          <circle
            key={i}
            cx={50}
            cy={36}
            r={drop.r}
            fill={i % 3 ? "var(--motion-turmeric)" : "var(--marigold-strong)"}
            className="story-splash"
            style={
              {
                "--story-dx": `${drop.dx}px`,
                "--story-dy": `${drop.dy}px`,
                "--story-delay": `${drop.delay}s`,
              } as Vars
            }
          />
        ))}
        <path d="M38 36H62C60 42 55 44 50 44C45 44 40 42 38 36Z" fill="var(--card-gold)" />
        <ellipse cx={50} cy={36} rx={12} ry={1.6} fill="var(--motion-turmeric)" />
        <Marigold x={12} y={36} r={7} delay={0.3} />
        <Marigold x={88} y={36} r={7} delay={0.4} />
      </Band>
    </>
  );
}

/** Stage lights sweeping from the top corners, a string of bulbs, and notes rising. */
function Sangeet() {
  const notes = ["M0 0V-6.5L4 -8V-1.5", "M0 0V-7"];
  return (
    <>
      <Band edge="top">
        <defs>
          <linearGradient id="story-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--motion-flame)" stopOpacity={0.8} />
            <stop offset="1" stopColor="var(--motion-flame)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path
          d="M4 0L2 44H28Z"
          fill="url(#story-beam)"
          className="story-sweep"
          style={{ transformOrigin: "4px 0px" } as Vars}
        />
        <path
          d="M96 0L72 44H98Z"
          fill="url(#story-beam)"
          className="story-sweep"
          style={{ transformOrigin: "96px 0px", "--story-delay": "-1.8s" } as Vars}
        />
        <path d="M0 6Q50 18 100 6" fill="none" stroke="var(--card-gold)" strokeWidth={0.4} />
        {Array.from({ length: 11 }, (_, i) => {
          const t = (i + 0.5) / 11;
          const x = r2(t * 100);
          const y = r2(6 + Math.sin(Math.PI * t) * 6 + 1.6);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.1}
              fill="var(--motion-flame)"
              className="story-twinkle"
              style={
                { "--story-delay": `${r2(i * 0.18)}s`, transformOrigin: `${x}px ${y}px` } as Vars
              }
            />
          );
        })}
      </Band>
      <Band edge="bottom">
        {[10, 22, 78, 90].map((x, i) => (
          <g key={x} transform={`translate(${x} 40)`}>
            <g className="story-note" style={{ "--story-delay": `${r2(i * 0.7)}s` } as Vars}>
              <path
                d={notes[i % 2]}
                fill="none"
                stroke="var(--card-accent)"
                strokeWidth={0.8}
                strokeLinecap="round"
              />
              <ellipse cx={-1.4} cy={0} rx={1.7} ry={1.2} fill="var(--card-accent)" />
            </g>
          </g>
        ))}
        {/* The dholak */}
        <g transform="translate(50 33)">
          <rect x={-9} y={-4.5} width={18} height={9} rx={4.5} fill="var(--card-accent)" />
          <path
            d="M-6 -4.2L-2 4.2M-2 -4.2L2 4.2M2 -4.2L6 4.2"
            stroke="var(--card-gold)"
            strokeWidth={0.5}
          />
          <ellipse cx={-9} cy={0} rx={1.4} ry={4.5} fill="var(--card-gold)" />
          <ellipse cx={9} cy={0} rx={1.4} ry={4.5} fill="var(--card-gold)" />
          <circle
            r={7}
            fill="none"
            stroke="var(--card-gold)"
            strokeWidth={0.4}
            className="story-beat-ring"
          />
        </g>
      </Band>
    </>
  );
}

/** The sacred fire at the foot, the jaimala garlands meeting above, akshat falling. */
function Wedding() {
  return (
    <>
      <Band edge="top">
        <Garland from={[-4, 0]} to={[48, 4]} sag={14} count={12} />
        <Garland from={[52, 4]} to={[104, 0]} sag={14} count={12} delay={0.3} />
      </Band>
      <Band edge="bottom">
        <ellipse
          cx={50}
          cy={34}
          rx={20}
          ry={11}
          fill="var(--motion-flame)"
          opacity={0.22}
          className="story-glow"
        />
        {/* The havan kund: a stepped square of brick */}
        <path d="M34 44V38H66V44ZM37 38V34H63V38Z" fill="var(--motion-clay)" />
        <path d="M34 38H66M37 34H63" stroke="var(--card-gold)" strokeWidth={0.5} />
        {[
          [50, 1],
          [45, 0.72],
          [55, 0.78],
        ].map(([x, s], i) => (
          <path
            key={i}
            d={`M${x} ${34 - 12 * s!}C${x! + 4 * s!} ${34 - 6 * s!} ${x! + 4 * s!} 34 ${x} 34C${x! - 4 * s!} 34 ${x! - 4 * s!} ${34 - 6 * s!} ${x} ${34 - 12 * s!}Z`}
            fill={i ? "var(--motion-flame)" : "var(--marigold-strong)"}
            className="story-flame"
            style={{ "--story-delay": `${i * 0.3}s`, transformOrigin: `${x}px 34px` } as Vars}
          />
        ))}
        <Sparkles count={6} seed={5} area={[40, 12, 20, 12]} />
      </Band>
    </>
  );
}

/** Chandelier sparkle and champagne-gold confetti for the reception. */
function Reception() {
  return (
    <>
      <Band edge="top">
        <path
          d="M50 0V8M38 8H62Q58 16 50 16Q42 16 38 8Z"
          fill="none"
          stroke="var(--card-gold)"
          strokeWidth={0.6}
        />
        {[38, 44, 50, 56, 62].map((x, i) => (
          <path
            key={x}
            d={`M${x} ${8 + (i % 2) * 3}l1 3 -1 3 -1 -3Z`}
            fill="var(--card-gold)"
            className="story-twinkle"
            style={
              {
                "--story-delay": `${i * 0.25}s`,
                transformOrigin: `${x}px ${11 + (i % 2) * 3}px`,
              } as Vars
            }
          />
        ))}
        <Sparkles count={14} seed={3} area={[6, 4, 88, 34]} />
      </Band>
      <Band edge="bottom">
        <Sparkles count={10} seed={9} area={[6, 12, 88, 28]} />
      </Band>
    </>
  );
}

/** A toran of marigolds and mango leaves across the top, for the date. */
function Toran() {
  return (
    <Band edge="top">
      <Garland from={[-2, 2]} to={[102, 2]} sag={10} count={22} />
      {Array.from({ length: 7 }, (_, i) => {
        const x = 8 + i * 14;
        return (
          <path
            key={i}
            d={`M${x} 3C${x + 2.6} 8 ${x + 2} 14 ${x} 17C${x - 2} 14 ${x - 2.6} 8 ${x} 3Z`}
            fill={i % 2 ? "var(--motion-leaf)" : "var(--motion-leaf-light)"}
            className="story-swing"
            style={{ transformOrigin: `${x}px 3px`, "--story-delay": `${i * 0.12}s` } as Vars}
          />
        );
      })}
    </Band>
  );
}

/** A gold arch drawing itself round the couple's names. */
function Arch() {
  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 100 140"
        preserveAspectRatio="none"
        className="absolute inset-x-[6%] top-[13%] bottom-[3%] h-[84%] w-[88%]"
      >
        <Draw
          d="M8 138V44C8 20 28 6 50 2C72 6 92 20 92 44V138"
          colour="var(--card-gold)"
          width={0.5}
          duration={3}
        />
      </svg>
      <Band edge="bottom">
        <Sparkles count={8} seed={13} area={[10, 16, 80, 22]} />
      </Band>
    </>
  );
}

/** Five diyas lighting in turn along the foot, for the last beat. */
function Diyas() {
  return (
    <Band edge="bottom">
      {[18, 34, 50, 66, 82].map((x, i) => (
        <g
          key={x}
          className="story-rise-in"
          style={{ "--story-delay": `${0.2 + i * 0.25}s` } as Vars}
        >
          <Diya x={x} y={38} scale={1.2} delay={i * 0.3} />
        </g>
      ))}
    </Band>
  );
}

/** Lanterns swaying on a string over the baraat as it sets out. */
function Lanterns() {
  return (
    <Band edge="top">
      <path d="M0 3Q50 11 100 3" fill="none" stroke="var(--card-gold)" strokeWidth={0.4} />
      {[10, 26, 42, 58, 74, 90].map((x, i) => {
        const top = r2(3 + Math.sin(Math.PI * (x / 100)) * 4);
        return (
          <g
            key={x}
            className="story-swing"
            style={{ transformOrigin: `${x}px ${top}px`, "--story-delay": `${-i * 0.5}s` } as Vars}
          >
            <path d={`M${x} ${top}V${top + 5}`} stroke="var(--card-gold)" strokeWidth={0.4} />
            <rect
              x={x - 3}
              y={top + 5}
              width={6}
              height={9}
              rx={2.6}
              fill="var(--card-accent)"
              stroke="var(--card-gold)"
              strokeWidth={0.4}
            />
            <ellipse
              cx={x}
              cy={top + 9.5}
              rx={1.2}
              ry={2}
              fill="var(--motion-flame)"
              className="story-glow"
              style={{ "--story-delay": `${r2(i * 0.3)}s` } as Vars}
            />
            <path
              d={`M${x - 3.4} ${top + 14.4}H${x + 3.4}`}
              stroke="var(--card-gold)"
              strokeWidth={0.6}
            />
          </g>
        );
      })}
    </Band>
  );
}

/** Pairs of dandiya sticks clicking round a circle, for the garba. */
function Dandiya() {
  return (
    <Band edge="bottom">
      <Draw
        d="M12 36C12 30 88 30 88 36C88 42 12 42 12 36Z"
        colour="var(--card-gold)"
        width={0.4}
        duration={2.6}
      />
      {[14, 32, 50, 68, 86].map((x, i) => (
        <g
          key={x}
          className="story-swing"
          style={{ transformOrigin: `${x}px 30px`, "--story-delay": `${-i * 0.4}s` } as Vars}
        >
          {[-1, 1].map((side) => (
            <g key={side}>
              <path
                d={`M${x - side * 5} 22L${x + side * 3} 34`}
                stroke="var(--card-accent)"
                strokeWidth={1}
                strokeLinecap="round"
              />
              <circle cx={x - side * 5} cy={22} r={0.9} fill="var(--card-gold)" />
            </g>
          ))}
        </g>
      ))}
      <Sparkles count={8} seed={21} area={[8, 6, 84, 14]} />
    </Band>
  );
}

const PETALS = ["var(--marigold)", "var(--marigold-strong)", "var(--motion-turmeric)"];
const RICE = ["var(--card-gold)", "var(--motion-turmeric)"];
const CONFETTI = ["var(--card-gold)", "var(--card-accent)", "var(--marigold)"];

/** The scene for a beat. The glow behind the words keeps them readable over everything. */
export function StoryScene({ scene, themed = false }: { scene: StorySceneId; themed?: boolean }) {
  let art: ReactNode = null;
  switch (scene) {
    case "cover":
      art = (
        <>
          {!themed && <Arch />}
          <div
            aria-hidden
            className="story-halo absolute inset-x-0 top-[18%] mx-auto aspect-square w-[70%]"
          />
          <Falling count={14} seed={1} colours={PETALS} shape="petal" />
        </>
      );
      break;
    case "family":
      art = <Toran />;
      break;
    case "roka":
    case "engagement":
      art = <Rings />;
      break;
    // Pujas: the lamps are lit and petals fall before the family's own symbol
    case "tilak":
    case "ganesh-puja":
    case "grah-shanti":
      art = (
        <>
          <div
            aria-hidden
            className="story-halo absolute inset-x-0 top-[18%] mx-auto aspect-square w-[70%]"
          />
          <Diyas />
          <Falling count={12} seed={10} colours={PETALS} shape="petal" />
        </>
      );
      break;
    // A toran goes up over the door: the mandap, the gifts and the welcome
    case "mandap":
    case "mameru":
    case "baraat-welcome":
      art = (
        <>
          <Toran />
          <Falling count={16} seed={12} colours={PETALS} shape="petal" />
        </>
      );
      break;
    case "garba":
      art = (
        <>
          <Dandiya />
          <Falling count={12} seed={14} colours={CONFETTI} shape="confetti" />
        </>
      );
      break;
    case "baraat":
      art = (
        <>
          <Lanterns />
          <Falling count={16} seed={16} colours={CONFETTI} shape="confetti" />
        </>
      );
      break;
    case "vidaai":
      art = (
        <>
          <Diyas />
          <Falling count={18} seed={18} colours={RICE} shape="rice" />
        </>
      );
      break;
    case "haldi":
      art = (
        <>
          <Haldi />
          <Falling count={12} seed={2} colours={PETALS} shape="petal" />
        </>
      );
      break;
    case "mehendi":
      art = <Henna />;
      break;
    case "sangeet":
      art = <Sangeet />;
      break;
    case "wedding":
      art = (
        <>
          <Wedding />
          <Falling count={22} seed={4} colours={RICE} shape="rice" />
        </>
      );
      break;
    case "bhoj":
    case "reception":
    case "anniversary":
      art = (
        <>
          <Reception />
          <Falling count={18} seed={6} colours={CONFETTI} shape="confetti" />
        </>
      );
      break;
    // A party: lanterns strung up and confetti in the air
    case "birthday":
    case "party":
      art = (
        <>
          <Lanterns />
          <Falling count={22} seed={20} colours={CONFETTI} shape="confetti" />
        </>
      );
      break;
    // A baby shower: a garland of flowers and petals drifting down
    case "baby-shower":
      art = (
        <>
          <Toran />
          <Falling count={14} seed={22} colours={PETALS} shape="petal" />
        </>
      );
      break;
    // Diwali: a row of lit diyas under a sky of sparks
    case "diwali":
      art = (
        <>
          <Diyas />
          <Band edge="top">
            <Sparkles count={10} seed={24} area={[8, 4, 84, 30]} />
          </Band>
        </>
      );
      break;
    case "reply":
      art = (
        <>
          <Diyas />
          <Falling count={10} seed={8} colours={PETALS} shape="petal" />
        </>
      );
      break;
  }
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Themed value={themed}>{art}</Themed>
      {/* A pool of the card's paper behind the words (themed pages have a reading plate) */}
      {!themed && <div className="story-pool absolute inset-x-[4%] top-[26%] bottom-[22%]" />}
    </div>
  );
}
