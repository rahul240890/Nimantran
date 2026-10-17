import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import "@/app/welcome-scenes.css";

/*
 * Ten more welcomes for the moment between the opening and the pages (welcome-scenes.css):
 * a mandala, a peacock's fan, a sunrise, a garden, a rangoli, diyas on the ghat, fireflies,
 * sky lanterns, kites and the sea. Each keeps the middle calm for the names and is drawn
 * in code from the theme's own colours (--open-* in globals.css), never from anyone's art.
 */

const range = (count: number) => Array.from({ length: count }, (_, i) => i);

/** Spread a few things evenly but not in rows: the same places on server and client. */
const spread = (i: number, a: number, b: number, span: number, from: number) =>
  ((i * a + b) % span) + from;

const vars = (values: Record<string, string | number>) => values as CSSProperties;

/** A petal from (0, 0) toward -y, `length` long. */
const petal = (length: number, width: number) =>
  `M0 0C${-width} ${-length * 0.35} ${-width * 0.7} ${-length * 0.85} 0 ${-length}` +
  `C${width * 0.7} ${-length * 0.85} ${width} ${-length * 0.35} 0 0Z`;

/** Gold dust twinkling about the screen. */
function Dust({ count = 12, className }: { count?: number; className?: string }) {
  return range(count).map((i) => (
    <span
      key={i}
      className={cn("welcome-scene-dust absolute rounded-full", className)}
      style={vars({
        left: `${spread(i, 37, 9, 90, 5)}%`,
        top: `${spread(i, 53, 7, 86, 6)}%`,
        "--i": i,
      })}
    />
  ));
}

/** A mandala draws itself round the names, its rings turning slowly against each other. */
export function Mandala() {
  return (
    <>
      <svg
        aria-hidden
        viewBox="-100 -100 200 200"
        className="welcome-mandala absolute top-[46%] left-1/2 w-[min(150cqw,96cqh)]"
      >
        <g className="welcome-mandala-outer">
          {range(24).map((i) => (
            <path
              key={i}
              d={petal(36, 9)}
              transform={`rotate(${i * 15}) translate(0 -60)`}
              pathLength={1}
              className="welcome-mandala-line"
              style={vars({ "--i": i })}
            />
          ))}
          <circle r="97" pathLength={1} className="welcome-mandala-line" />
        </g>
        <g className="welcome-mandala-mid">
          {range(16).map((i) => (
            <path
              key={i}
              d={petal(26, 9)}
              transform={`rotate(${i * 22.5 + 11}) translate(0 -42)`}
              className="welcome-mandala-petal"
              style={vars({ "--i": i })}
            />
          ))}
          <circle r="44" pathLength={1} className="welcome-mandala-line" />
        </g>
        <g className="welcome-mandala-inner">
          {range(12).map((i) => (
            <circle
              key={i}
              r="2.2"
              transform={`rotate(${i * 30}) translate(0 -36)`}
              className="welcome-mandala-dot"
              style={vars({ "--i": i })}
            />
          ))}
        </g>
      </svg>
      <Dust />
    </>
  );
}

/** A peacock's tail fans open behind the names, its eyes shimmering. */
export function Peacock() {
  const feathers = range(17);
  return (
    <>
      <svg
        aria-hidden
        viewBox="-100 -100 200 200"
        className="welcome-peacock absolute bottom-[-14cqh] left-1/2 w-[min(140cqw,84cqh)]"
      >
        {feathers.map((i) => {
          const angle = -88 + (176 / (feathers.length - 1)) * i;
          const length = 84 + ((i * 7) % 3) * 4;
          return (
            <g
              key={i}
              className="welcome-feather"
              style={vars({ "--a": `${angle.toFixed(1)}deg`, "--i": Math.abs(i - 8) })}
            >
              <path d={`M0 96 L0 ${96 - length}`} className="welcome-feather-stem" />
              <path
                d={`M0 ${96 - length * 0.35}C-9 ${96 - length * 0.6} -7 ${96 - length} 0 ${
                  92 - length
                }C7 ${96 - length} 9 ${96 - length * 0.6} 0 ${96 - length * 0.35}Z`}
                className="welcome-feather-vane"
              />
              <ellipse cx="0" cy={100 - length} rx="8" ry="10" className="welcome-feather-ring" />
              <ellipse cx="0" cy={100 - length} rx="5.2" ry="6.8" className="welcome-feather-eye" />
              <ellipse
                cx="0"
                cy={101 - length}
                rx="2.6"
                ry="3.6"
                className="welcome-feather-pupil"
              />
            </g>
          );
        })}
      </svg>
      <Dust count={10} className="welcome-scene-dust-bright" />
    </>
  );
}

/** The sun rises behind far hills, its rays turning, as a flock crosses the dawn. */
export function Sunrise() {
  return (
    <>
      <span className="welcome-sun-rays absolute top-[64cqh] left-1/2 aspect-square w-[200cqh]" />
      <span className="welcome-sun absolute top-[64cqh] left-1/2 aspect-square w-[36cqw] max-w-56 rounded-full" />
      <svg
        aria-hidden
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[38cqh] w-full"
      >
        <path
          d="M0 58 C50 30 90 40 140 52 C190 64 230 26 290 36 C340 44 370 52 400 46 V120 H0Z"
          className="welcome-hill welcome-hill-far"
        />
        <path
          d="M0 82 C60 60 120 70 170 80 C230 92 280 62 340 70 C370 74 390 80 400 78 V120 H0Z"
          className="welcome-hill welcome-hill-near"
        />
        <path
          d="M0 104 C80 92 150 100 210 104 C280 110 340 96 400 100 V120 H0Z"
          className="welcome-hill welcome-hill-front"
        />
      </svg>
      {range(7).map((i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 20 8"
          className="welcome-bird absolute w-[5cqw] max-w-8"
          style={vars({
            top: `${14 + ((i * 7) % 5) * 3 + (i % 2) * 2}cqh`,
            "--i": i,
            "--rise": `${(i % 3) * -2}cqh`,
          })}
        >
          <path d="M0 6 Q5 0 10 5 Q15 0 20 6" className="welcome-bird-wing" />
        </svg>
      ))}
    </>
  );
}

/** Where the leaves sit along the two vines, in % of the screen, and which way they point. */
const LEAVES = [
  [6, 86, -50],
  [10, 66, 40],
  [12, 50, -40],
  [20, 40, 50],
  [24, 26, -30],
  [28, 10, 40],
  [94, 86, 50],
  [90, 68, -40],
  [86, 52, 40],
  [80, 42, -50],
  [76, 28, 30],
  [72, 12, -40],
] as const;

/** Vines climb from the corners into leaf and flower, and butterflies drift across. */
export function Garden() {
  const vines = [
    { d: "M-2 102 C10 80 4 60 18 44 C28 32 22 18 30 4", side: "start" },
    { d: "M102 102 C90 82 96 64 82 48 C72 36 78 22 70 6", side: "end" },
  ] as const;
  const blooms = [
    [12, 74],
    [7, 56],
    [22, 36],
    [27, 15],
    [88, 76],
    [93, 58],
    [78, 40],
    [73, 18],
  ] as const;
  return (
    <>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {vines.map((vine) => (
          <path
            key={vine.side}
            d={vine.d}
            pathLength={1}
            className="welcome-vine"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {LEAVES.map(([x, y, turn], i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="-6 -16 12 16"
          className="absolute w-[4.5cqw] max-w-7 -translate-x-1/2 -translate-y-full"
          style={vars({ left: `${x}%`, top: `${y}%`, rotate: `${turn}deg` })}
        >
          <path d={petal(15, 9)} className="welcome-leaf" style={vars({ "--i": i })} />
        </svg>
      ))}
      {blooms.map(([x, y], i) => (
        <span
          key={i}
          className="welcome-bloom absolute"
          style={vars({ left: `${x}%`, top: `${y}%`, "--i": i })}
        >
          <svg aria-hidden viewBox="-20 -20 40 40" className="w-[12cqw] max-w-20">
            {range(6).map((p) => (
              <path
                key={p}
                d={petal(15, 7)}
                transform={`rotate(${p * 60})`}
                className={i % 2 === 0 ? "welcome-bloom-petal" : "welcome-bloom-petal-alt"}
              />
            ))}
            <circle r="4.5" className="welcome-bloom-heart" />
          </svg>
        </span>
      ))}
      {range(3).map((i) => (
        <span
          key={i}
          className="welcome-butterfly absolute"
          style={vars({ top: `${[24, 62, 42][i]}cqh`, "--i": i })}
        >
          <svg aria-hidden viewBox="-12 -10 24 20" className="w-[9cqw] max-w-14">
            <g className="welcome-wing welcome-wing-left">
              <path d="M0 0 C-4 -9 -12 -9 -11 -2 C-10 3 -4 3 0 0Z" />
              <path d="M0 1 C-3 6 -8 8 -8 4 C-8 2 -3 1 0 1Z" />
            </g>
            <g className="welcome-wing welcome-wing-right">
              <path d="M0 0 C4 -9 12 -9 11 -2 C10 3 4 3 0 0Z" />
              <path d="M0 1 C3 6 8 8 8 4 C8 2 3 1 0 1Z" />
            </g>
            <path d="M0 -4 V5" className="welcome-butterfly-body" />
          </svg>
        </span>
      ))}
    </>
  );
}

const RANGOLI_COLOURS = [
  "var(--marigold)",
  "var(--open-petal-fall)",
  "var(--open-jewel)",
  "var(--open-leaf)",
];

/** A rangoli draws itself round the names, its petals filling in colour by colour. */
export function Rangoli() {
  const star = range(16)
    .map((i) => {
      const r = i % 2 === 0 ? 96 : 74;
      const a = ((i * 22.5 - 90) * Math.PI) / 180;
      return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
    })
    .join("L");
  return (
    <svg
      aria-hidden
      viewBox="-100 -100 200 200"
      className="welcome-rangoli absolute top-[46%] left-1/2 w-[min(160cqw,100cqh)]"
    >
      <path d={`M${star}Z`} pathLength={1} className="welcome-rangoli-line" />
      {range(16).map((i) => (
        <path
          key={i}
          d={petal(18, 8)}
          transform={`rotate(${i * 22.5}) translate(0 -54)`}
          fill={RANGOLI_COLOURS[i % RANGOLI_COLOURS.length]}
          className="welcome-rangoli-petal"
          style={vars({ "--i": i })}
        />
      ))}
      <circle r="56" pathLength={1} className="welcome-rangoli-line" />
      {range(32).map((i) => (
        <circle
          key={i}
          r="1.8"
          transform={`rotate(${i * 11.25}) translate(0 -84)`}
          className="welcome-rangoli-dot"
          style={vars({ "--i": i })}
        />
      ))}
    </svg>
  );
}

/** Dusk on the ghat: steps and spires against the sky, diyas floating on the river. */
export function Ghat() {
  return (
    <>
      <Dust count={10} className="welcome-scene-dust-bright top-0" />
      <svg
        aria-hidden
        viewBox="0 0 400 140"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-[30cqh] h-[22cqh] w-full"
      >
        <path
          d="M0 140 V96 H40 V80 H54 L62 58 L70 80 H96 V100 H150 V70 H160 L170 40 L180 70 H190 V104 H250 V88 H262 L270 66 L278 88 H300 V100 H346 V76 H356 L364 52 L372 76 H382 V98 H400 V140Z"
          className="welcome-ghat-skyline"
        />
        {range(5).map((i) => (
          <rect
            key={i}
            x="0"
            y={112 + i * 6}
            width="400"
            height="6"
            className="welcome-ghat-step"
          />
        ))}
      </svg>
      <div className="welcome-river absolute inset-x-0 bottom-0 h-[30cqh]">
        {range(6).map((i) => (
          <span
            key={i}
            className="welcome-ripple absolute h-px rounded-full"
            style={vars({
              top: `${18 + i * 13}%`,
              left: `${spread(i, 29, 6, 50, 4)}%`,
              width: `${30 + ((i * 11) % 30)}%`,
              "--i": i,
            })}
          />
        ))}
        {range(7).map((i) => (
          <span
            key={i}
            className="welcome-float-diya absolute"
            style={vars({
              top: `${12 + ((i * 23) % 60)}%`,
              "--i": i,
              "--size": `${6 + (i % 3) * 1.6}cqw`,
            })}
          >
            <svg aria-hidden viewBox="0 0 40 30" className="w-(--size)">
              <path d="M20 2 C24 8 24 12 20 15 C16 12 16 8 20 2Z" className="welcome-float-flame" />
              <path d="M2 17 C10 27 30 27 38 17 C30 20 10 20 2 17Z" className="welcome-leaf-boat" />
              <path d="M8 18 H32 C30 23 10 23 8 18Z" className="welcome-float-cup" />
            </svg>
          </span>
        ))}
      </div>
    </>
  );
}

/** Fireflies wander over a meadow at night, blinking, as the grass sways. */
export function Fireflies() {
  return (
    <>
      <span className="welcome-moonglow absolute top-[-10cqh] right-[-14cqw] aspect-square w-[70cqw] rounded-full" />
      {range(28).map((i) => (
        <span
          key={i}
          className="welcome-firefly absolute rounded-full"
          style={vars({
            left: `${spread(i, 37, 3, 92, 4)}%`,
            top: `${spread(i, 47, 11, 72, 18)}%`,
            "--i": i,
            "--x": `${((i * 13) % 17) - 8}cqw`,
            "--y": `${((i * 19) % 15) - 9}cqh`,
          })}
        />
      ))}
      <svg
        aria-hidden
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[20cqh] w-full"
      >
        {range(46).map((i) => {
          const x = i * 8.9 + ((i * 7) % 5);
          const h = 30 + ((i * 17) % 40);
          const lean = ((i * 5) % 9) - 4;
          return (
            <path
              key={i}
              d={`M${x} 80 Q${x + lean} ${80 - h * 0.6} ${x + lean * 2} ${80 - h}`}
              className="welcome-blade"
              style={vars({ "--i": i % 7 })}
            />
          );
        })}
      </svg>
    </>
  );
}

/** Paper lanterns rise into the night from every side, glowing warm. */
export function SkyLanterns() {
  return (
    <>
      {range(18).map((i) => (
        <span
          key={i}
          className="welcome-star absolute rounded-full"
          style={vars({
            left: `${spread(i, 41, 3, 94, 3)}%`,
            top: `${spread(i, 23, 11, 60, 2)}%`,
            "--i": i,
          })}
        />
      ))}
      {range(11).map((i) => (
        <span
          key={i}
          className="welcome-sky-lantern absolute bottom-0"
          style={vars({
            left: `${spread(i, 43, 4, 88, 4)}%`,
            "--i": i,
            "--size": `${7 + (i % 4) * 2.2}cqw`,
            "--drift": `${((i * 7) % 9) - 4}cqw`,
          })}
        >
          <svg aria-hidden viewBox="0 0 24 32" className="w-(--size)">
            <path d="M4 2 H20 L23 24 C23 28 1 28 1 24Z" className="welcome-lantern-paper" />
            <path d="M8 6 H16 L18 23 C18 25 6 25 6 23Z" className="welcome-lantern-glow" />
            <path d="M9 28 H15 L13 31 H11Z" className="welcome-lantern-flame" />
          </svg>
        </span>
      ))}
    </>
  );
}

const KITE_COLOURS = [
  ["var(--marigold)", "var(--open-jewel)"],
  ["var(--open-petal-fall)", "var(--open-leaf)"],
  ["var(--open-jewel)", "var(--open-gilt-bright)"],
  ["var(--open-leaf)", "var(--marigold)"],
  ["var(--open-ribbon)", "var(--open-light)"],
] as const;

/** Kites bob high over the rooftops on their strings, among slow clouds. */
export function Kites() {
  const kites = [
    [14, 16],
    [76, 10],
    [32, 30],
    [86, 34],
    [58, 22],
  ] as const;
  return (
    <>
      {range(4).map((i) => (
        <span
          key={i}
          className="welcome-cloud absolute rounded-full"
          style={vars({
            top: `${8 + i * 17}cqh`,
            "--i": i,
            "--w": `${34 + (i % 2) * 16}cqw`,
          })}
        />
      ))}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {kites.map(([x, y], i) => (
          <path
            key={i}
            d={`M${x} ${y + 6} Q${x + (i % 2 ? -14 : 14)} ${(y + 100) / 2} ${50 + (i - 2) * 6} 104`}
            pathLength={1}
            className="welcome-kite-string"
            vectorEffect="non-scaling-stroke"
            style={vars({ "--i": i })}
          />
        ))}
      </svg>
      {kites.map(([x, y], i) => {
        const [one, two] = KITE_COLOURS[i % KITE_COLOURS.length]!;
        return (
          <span
            key={i}
            className="welcome-kite absolute"
            style={vars({ left: `${x}%`, top: `${y}%`, "--i": i })}
          >
            <svg aria-hidden viewBox="-12 -14 24 40" className="w-[12cqw] max-w-20">
              <path d="M0 -13 L11 0 L0 13 L-11 0Z" fill={one} />
              <path d="M0 -13 L0 13 L-11 0Z" fill={two} />
              <path d="M0 -13 V13 M-11 0 H11" className="welcome-kite-spar" />
              <path d="M0 13 Q4 18 0 22 Q-4 26 0 30" className="welcome-kite-tail" />
            </svg>
          </span>
        );
      })}
    </>
  );
}

/** The sun sets over the sea, waves roll in, and gulls glide along the shore. */
export function Waves() {
  return (
    <>
      <span className="welcome-sunset absolute top-[62cqh] left-1/2 aspect-square w-[44cqw] max-w-64 rounded-full" />
      <div className="absolute inset-x-0 bottom-0 h-[38cqh] overflow-hidden">
        {range(3).map((i) => (
          <svg
            key={i}
            aria-hidden
            viewBox="0 0 800 100"
            preserveAspectRatio="none"
            className={cn("welcome-wave absolute left-0 h-full w-[200%]", `welcome-wave-${i}`)}
            style={vars({ "--i": i, top: `${i * 22}%` })}
          >
            <path d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30 V100 H0Z" />
          </svg>
        ))}
        {range(10).map((i) => (
          <span
            key={i}
            className="welcome-glint absolute h-[0.25rem] rounded-full"
            style={vars({
              left: `${spread(i, 31, 7, 80, 10)}%`,
              top: `${8 + ((i * 13) % 30)}%`,
              width: `${3 + (i % 3) * 2}cqw`,
              "--i": i,
            })}
          />
        ))}
      </div>
      {range(4).map((i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 20 8"
          className="welcome-gull absolute w-[5.5cqw] max-w-9"
          style={vars({ top: `${16 + i * 6}cqh`, "--i": i })}
        >
          <path d="M0 6 Q5 0 10 5 Q15 0 20 6" className="welcome-bird-wing" />
        </svg>
      ))}
    </>
  );
}
