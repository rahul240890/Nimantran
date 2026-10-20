import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { freshBeyond, type FreshOpening } from "@/lib/opening/catalog";
import "@/app/fresh-openings.css";

/*
 * The fresh openings (the owner's paintings, shubhdwar/fresh-opening-prompts.md): each one
 * a place beyond, the thing that opens, edge pieces and loose pieces, cut into
 * public/openings/fresh/<id>/. None of them is a pair of doors: a fan folds shut, mirror
 * panels turn like louvres, a pop-up palace stands up, clouds part, a snow globe pulls the
 * guest in. Every layer sits on one canvas the shape of the paintings (768 x 1365), so the
 * numbers below are in % of a painting. The movement is in CSS (globals.css, "Fresh
 * openings") and follows the stage's data-open, like the painted gates.
 */

type Ctx = { id: FreshOpening; sample: boolean };
type Box = readonly [left: number, top: number, width: number, height: number];

const range = (count: number) => Array.from({ length: count }, (_, i) => i);
const vars = (style: Record<string, string | number>) => style as CSSProperties;

/** Which painting fills the wide screen round the frame: the place revealed. */
export const freshBackdrop = freshBeyond;

function imageProps({ id, sample }: Ctx, name: string, size: "full" | "small" = "full") {
  const sizes =
    size === "small"
      ? sample
        ? "3rem"
        : "(min-width: 40rem) 8rem, 22vw"
      : sample
        ? "12rem"
        : "(min-width: 40rem) 32rem, 100vw";
  return {
    src: name === "beyond" ? freshBeyond(id) : `/openings/fresh/${id}/${name}.webp`,
    fill: true,
    sizes,
    // The guest's first screen loads its big layers at once; an editor tile waits its turn
    ...(sample || size === "small" ? { loading: "lazy" as const } : { priority: true }),
  };
}

/** One whole layer, edge to edge of the canvas. */
function Paint({
  ctx,
  name,
  className,
  style,
}: {
  ctx: Ctx;
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("absolute inset-0", className)} style={style}>
      <Image alt="" {...imageProps(ctx, name)} className="object-cover" />
    </div>
  );
}

/** A window onto part of a layer that can then move on its own (a strip, a panel, a ring). */
function Cut({
  ctx,
  name,
  box,
  className,
  style,
  children,
}: {
  ctx: Ctx;
  name: string;
  box: Box;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const [x, y, w, h] = box;
  return (
    <div
      className={cn("absolute overflow-hidden", className)}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, ...style }}
    >
      <div
        className="absolute"
        style={{
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
          width: `${(100 / w) * 100}%`,
          height: `${(100 / h) * 100}%`,
        }}
      >
        <Image alt="" {...imageProps(ctx, name)} className="object-cover" />
      </div>
      {children}
    </div>
  );
}

/** The edge pieces, as two halves that part to the sides on opening. */
function FrontSplit({ ctx, name = "front" }: { ctx: Ctx; name?: string }) {
  return (
    <>
      <Paint ctx={ctx} name={name} className="fo-front-half" style={vars({ "--side": -1 })} />
      <Paint
        ctx={ctx}
        name={name}
        className="fo-front-half fo-right"
        style={vars({ "--side": 1 })}
      />
    </>
  );
}

/** A painting split down the middle with soft overlapping edges, so the halves slide apart. */
function SoftSplit({ ctx, name, className }: { ctx: Ctx; name: string; className: string }) {
  return (
    <>
      <Cut ctx={ctx} name={name} box={[0, 0, 58, 100]} className={cn(className, "fo-soft-l")} />
      <Cut ctx={ctx} name={name} box={[42, 0, 58, 100]} className={cn(className, "fo-soft-r")} />
    </>
  );
}

/**
 * Loose pieces (petals, birds, lanterns, sparks): fall and rise and bob drift while the
 * guest waits; burst ones fly out from the middle when it opens; after ones cross once open.
 */
type Float = {
  piece: number;
  x: number;
  y: number;
  /** Width, in % of the canvas. */
  size: number;
  mode: "fall" | "rise" | "bob" | "cross" | "burst" | "after";
  delay?: number;
  duration?: number;
};

function Floats({ ctx, items, name = "piece" }: { ctx: Ctx; items: Float[]; name?: string }) {
  if (ctx.sample) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((item, i) => (
        <span
          key={i}
          className={`fo-float fo-${item.mode} absolute aspect-square`}
          style={vars({
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.size}%`,
            "--d": `${item.delay ?? 0}ms`,
            "--t": `${item.duration ?? 9000}ms`,
            "--bx": `${(item.x - 50) * 1.6}cqw`,
            "--by": `${(item.y - 45) * 1.2}cqh`,
            "--spin": `${((i * 137) % 360) - 180}deg`,
          })}
        >
          <Image
            alt=""
            {...imageProps(ctx, `${name}-${item.piece}`, "small")}
            className="object-contain"
          />
        </span>
      ))}
    </div>
  );
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** A spray of burst pieces from round the middle, in a stable scatter. */
function burst(pieces: readonly number[], count: number, size = 7, delay = 150): Float[] {
  return range(count).map((i) => {
    const angle = (i / count) * Math.PI * 2 + i * 0.7;
    const reach = 10 + ((i * 37) % 22);
    return {
      piece: pieces[i % pieces.length] ?? 0,
      // Rounded so the server's and the browser's sums match when the page hydrates
      x: round2(50 + Math.cos(angle) * reach - size / 2),
      y: round2(45 + Math.sin(angle) * reach * 0.6),
      size: size * (0.75 + ((i * 53) % 50) / 100),
      mode: "burst",
      delay: delay + ((i * 71) % 400),
    };
  });
}

/** Pieces falling slowly across the width while the guest waits. */
function fall(pieces: readonly number[], count: number, size = 5, duration = 11000): Float[] {
  return range(count).map((i) => ({
    piece: pieces[i % pieces.length] ?? 0,
    x: 6 + ((i * 41) % 88),
    y: -10,
    size: size * (0.8 + ((i * 29) % 40) / 100),
    mode: "fall",
    delay: -((i * duration) / count),
    duration: duration + ((i * 900) % 3000),
  }));
}

/** Dots placed in a ring round the name plate (fireflies, stars, snow). */
function ring(count: number, rx: number, ry: number, cy = 44) {
  return range(count).map((i) => {
    const a = (i / count) * Math.PI * 2 + (i % 3) * 0.21;
    const wobble = 1 + ((i * 17) % 20) / 100 - 0.1;
    return { x: round2(50 + Math.cos(a) * rx * wobble), y: round2(cy + Math.sin(a) * ry * wobble) };
  });
}

/** Small glowing dots: fireflies, windows, grains of sand, snow. */
function Dots({
  className,
  points,
}: {
  className: string;
  points: readonly { x: number; y: number }[];
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {points.map((p, i) => (
        <span
          key={i}
          className={cn("absolute rounded-full", className)}
          style={vars({
            left: `${p.x}%`,
            top: `${p.y}%`,
            "--i": i,
            "--tx": `${50 - p.x}cqw`,
            "--ty": `${44 - p.y}cqh`,
          })}
        />
      ))}
    </div>
  );
}

/** The bangle rings, five bands round the middle (radii in % of the outer ring). */
const RING_BANDS = [28.7, 43, 57.2, 71.5, 85.7, 100] as const;
/** The rings' bounding square: centre (50%, 43.5%), outer radius 470 of 768 px. */
const RING_BOX: Box = [-11.2, 9.05, 122.4, 68.86];
/** The snow globe's glass, the bioscope's lens: circles in the painting. */
const GLOBE_GLASS: Box = [1.43, 12.09, 97.14, 54.65];
const SCOPE_LENS: Box = [23, 21.3, 53.6, 30.3];
/** The pinwheel paper's four flaps, cut along its painted creases (they cross at 52%, 46%). */
const FLAPS = {
  top: "polygon(0% 0%, 100% 0%, 52% 46%)",
  right: "polygon(100% 0%, 100% 86%, 52% 46%)",
  bottom: "polygon(0% 87%, 52% 46%, 100% 86%, 100% 100%, 0% 100%)",
  left: "polygon(0% 0%, 52% 46%, 0% 87%)",
} as const;
/**
 * The quilled rosette's rings round its middle (50%, 39.2%): its white heart, the pink
 * flower, the ring of leaves and beads and the outer scallops, in % of the outer radius
 * (430 of 768 px), and the rosette's bounding square.
 */
const ROSETTE_BANDS = [21, 57, 78, 100] as const;
const ROSETTE_BOX: Box = [-6, 7.7, 112, 63];
/** The tiles laid five across, nine down, each a square. */
const TILE_ROWS = 9;
const TILE_COLS = 5;

function Art({ ctx }: { ctx: Ctx }): ReactNode {
  const beyond = <Paint ctx={ctx} name="beyond" className="fo-beyond" />;
  switch (ctx.id) {
    case "pankhi":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="fan" className="fo-fan" />
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats
            ctx={ctx}
            items={[...fall([0, 1, 5], 5, 4.5, 13000), ...burst([0, 1, 2, 3, 5], 18)]}
          />
        </>
      );
    case "sheesh-mahal":
      return (
        <>
          {beyond}
          <div className="absolute inset-0 [perspective:160cqw]">
            {range(8).map((i) => (
              <Cut
                key={i}
                ctx={ctx}
                name="mirror-wall"
                box={[i * 12.5, 0, 12.5, 100]}
                className="fo-strip"
                style={vars({ "--i": Math.abs(i - 3.5) })}
              />
            ))}
          </div>
          <span className="fo-glint absolute inset-0" />
          <FrontSplit ctx={ctx} />
          <Floats ctx={ctx} items={burst([0, 1, 2, 3, 4, 5], 20, 5.5, 350)} />
        </>
      );
    case "popup-mahal":
      return (
        <>
          <Paint ctx={ctx} name="sky" className="fo-pop-sky" />
          <div className="absolute inset-0 [perspective:120cqw]">
            <Paint ctx={ctx} name="far-layer" className="fo-pop-far" />
            <Paint ctx={ctx} name="near-layer" className="fo-pop-near" />
          </div>
          <Floats
            ctx={ctx}
            items={[
              { piece: 1, x: -12, y: 16, size: 9, mode: "cross", duration: 16000 },
              { piece: 1, x: -12, y: 27, size: 6, mode: "cross", duration: 21000, delay: -9000 },
              { piece: 3, x: 14, y: 70, size: 6, mode: "rise", duration: 12000 },
              { piece: 3, x: 80, y: 74, size: 5, mode: "rise", duration: 14000, delay: -6000 },
              { piece: 0, x: 18, y: 8, size: 4, mode: "bob" },
              { piece: 0, x: 72, y: 13, size: 3, mode: "bob", delay: -2000 },
              ...burst([2, 4, 0], 12, 6, 500),
            ]}
          />
        </>
      );
    case "odhni":
      return (
        <>
          {beyond}
          <div className="fo-veil absolute inset-0">
            <Paint ctx={ctx} name="veil" />
            <span className="fo-veil-shade absolute inset-0" />
            <Paint ctx={ctx} name="front" />
          </div>
          <Floats ctx={ctx} items={burst([0, 1, 2, 4, 3], 18, 5, 300)} />
        </>
      );
    case "kavad-peti":
      return (
        <>
          {beyond}
          <div className="absolute inset-0 [perspective:140cqw]">
            {range(4).map((i) => (
              <Cut
                key={i}
                ctx={ctx}
                name="inner-panels"
                box={[i * 25, 0, 25, 100]}
                className="fo-panel fo-kavad-inner"
                style={vars({ "--side": i < 2 ? -1 : 1, "--o": i === 0 || i === 3 ? 1 : 0 })}
              >
                <span className="fo-panel-shade absolute inset-0" />
              </Cut>
            ))}
          </div>
          <div className="absolute inset-0 [perspective:140cqw]">
            {[-1, 1].map((side) => (
              <Cut
                key={side}
                ctx={ctx}
                name="outer-panels"
                box={[side < 0 ? 0 : 50, 0, 50, 100]}
                className="fo-panel fo-kavad-outer"
                style={vars({ "--side": side })}
              >
                <span className="fo-panel-shade absolute inset-0" />
              </Cut>
            ))}
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats
            ctx={ctx}
            items={[
              { piece: 4, x: 30, y: 40, size: 10, mode: "after", delay: 1300, duration: 3200 },
              { piece: 4, x: 55, y: 52, size: 8, mode: "after", delay: 1600, duration: 3600 },
              ...burst([0, 1, 3, 5], 14, 6, 1200),
            ]}
          />
        </>
      );
    case "chhatri-utsav":
      return (
        <>
          {beyond}
          <div className="fo-chhatri absolute inset-0">
            <Paint ctx={ctx} name="parasol" className="fo-chhatri-spin" />
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats
            ctx={ctx}
            items={[
              ...burst([0, 1, 2, 0, 1], 22, 6.5, 500),
              { piece: 5, x: -12, y: 20, size: 9, mode: "after", delay: 900, duration: 4000 },
              { piece: 5, x: -12, y: 30, size: 7, mode: "after", delay: 1300, duration: 4600 },
            ]}
          />
        </>
      );
    case "jal-darpan":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="lake" className="fo-lake" />
          <div className="fo-ripples absolute" style={{ left: "50%", top: "65%" }}>
            {range(4).map((i) => (
              <span key={i} className="fo-ripple" style={vars({ "--i": i })} />
            ))}
            {range(6).map((i) => (
              <span key={`b${i}`} className="fo-ripple fo-ripple-big" style={vars({ "--i": i })} />
            ))}
          </div>
          <FrontSplit ctx={ctx} />
          <Floats
            ctx={ctx}
            items={[
              { piece: 0, x: 40, y: 61, size: 10, mode: "bob", duration: 7000 },
              ...burst([1, 2, 3, 4], 12, 6, 900),
            ]}
          />
        </>
      );
    case "pushp-varsha":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="petal-wall" className="fo-wall" />
          <FrontSplit ctx={ctx} />
          <Floats
            ctx={ctx}
            items={[...fall([0, 1, 2], 6, 4.5, 12000), ...burst([0, 1, 2, 3, 4, 5], 30, 7, 100)]}
          />
        </>
      );
    case "moti-seep":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="shell-base" className="fo-shell-base" />
          <span className="fo-pearl absolute" style={{ left: "50%", top: "56%" }} />
          <div className="absolute inset-0 [perspective:110cqw]">
            <Paint ctx={ctx} name="shell-top" className="fo-shell-top" />
          </div>
          <span className="fo-flood absolute inset-0" />
          <Floats ctx={ctx} items={burst([0, 3, 1, 2, 4], 14, 5, 700)} />
        </>
      );
    case "badal-raag":
      return (
        <>
          {beyond}
          <span className="fo-rays absolute" />
          <svg
            aria-hidden
            viewBox="0 0 100 60"
            className="fo-rainbow absolute"
            preserveAspectRatio="xMidYMid meet"
          >
            {range(6).map((i) => (
              <path
                key={i}
                d={`M ${4 + i * 1.6} 58 A ${46 - i * 1.6} ${46 - i * 1.6} 0 0 1 ${96 - i * 1.6} 58`}
                pathLength={1}
                style={vars({ "--i": i })}
              />
            ))}
          </svg>
          <SoftSplit ctx={ctx} name="back-clouds" className="fo-cloud-back" />
          <FrontSplit ctx={ctx} name="front-clouds" />
          <span className="fo-rain absolute inset-0" />
          <span className="fo-lightning absolute inset-0" />
          <Floats
            ctx={ctx}
            items={[
              { piece: 2, x: -14, y: 22, size: 12, mode: "after", delay: 1100, duration: 4200 },
              { piece: 2, x: -14, y: 30, size: 9, mode: "after", delay: 1500, duration: 4800 },
              ...burst([0, 1, 3, 5], 10, 6.5, 900),
            ]}
          />
        </>
      );
    case "jugnu-van":
      return (
        <>
          {beyond}
          <SoftSplit ctx={ctx} name="forest" className="fo-forest" />
          <FrontSplit ctx={ctx} />
          <Dots className="fo-firefly" points={ring(18, 40, 25)} />
          <span className="fo-firefly-burst absolute" />
          <Floats
            ctx={ctx}
            items={[
              { piece: 0, x: 12, y: 30, size: 6, mode: "bob", duration: 6000 },
              { piece: 1, x: 78, y: 56, size: 5, mode: "bob", duration: 7000, delay: -3000 },
              { piece: 2, x: -10, y: 18, size: 6, mode: "cross", duration: 19000 },
              ...fall([3], 2, 5, 15000),
            ]}
          />
        </>
      );
    case "uday-surya":
      return (
        <>
          {beyond}
          <div className="fo-dawn-far absolute inset-0">
            <Paint ctx={ctx} name="far-hills" />
            <span className="fo-sun absolute" />
          </div>
          <Paint ctx={ctx} name="near-hills" className="fo-dawn-near" />
          <span className="fo-dawn-light absolute inset-0" />
          <Floats
            ctx={ctx}
            items={[
              { piece: 0, x: -12, y: 24, size: 11, mode: "after", delay: 900, duration: 4200 },
              { piece: 1, x: -12, y: 32, size: 8, mode: "after", delay: 1300, duration: 4800 },
              ...burst([2, 3, 5], 10, 6, 1000),
            ]}
          />
        </>
      );
    case "taaramandal":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="sky" className="fo-warp" />
          <Constellation />
          <div className="absolute inset-0">
            {range(20).map((i) => (
              <span
                key={i}
                className="fo-streak absolute"
                style={vars({ "--a": `${i * 18}deg`, "--i": i })}
              />
            ))}
          </div>
          <Paint ctx={ctx} name="front" className="fo-front-sink" />
          <Floats
            ctx={ctx}
            items={[
              { piece: 2, x: -10, y: 8, size: 10, mode: "cross", duration: 9000, delay: -2000 },
              { piece: 1, x: 12, y: 9, size: 3, mode: "bob" },
              { piece: 4, x: 84, y: 20, size: 3.5, mode: "bob", delay: -3000 },
              { piece: 0, x: 22, y: 62, size: 3, mode: "bob", delay: -1500 },
            ]}
          />
        </>
      );
    case "thar-ki-ret":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="dunes" className="fo-dunes" />
          <Dots
            className="fo-grain"
            points={range(16).map((i) => ({ x: (i * 23) % 96, y: 30 + ((i * 37) % 40) }))}
          />
          <Paint ctx={ctx} name="front" className="fo-front-blow" />
          <Floats
            ctx={ctx}
            items={range(12).map((i) => ({
              piece: i % 6,
              x: 4 + ((i * 13) % 40),
              y: 20 + ((i * 29) % 55),
              size: 6,
              mode: "burst" as const,
              delay: 200 + i * 60,
            }))}
          />
        </>
      );
    case "sheher-ki-raat":
      return (
        <>
          {beyond}
          <div className="fo-city absolute inset-0">
            <Paint ctx={ctx} name="city-dark" />
            <Paint ctx={ctx} name="city-lit" className="fo-city-lit" />
            <Dots
              className="fo-window"
              points={range(26).map((i) => ({
                x: i % 2 ? 4 + ((i * 7) % 24) : 72 + ((i * 11) % 24),
                y: 22 + ((i * 19) % 46),
              }))}
            />
          </div>
          <Floats
            ctx={ctx}
            items={[
              { piece: 5, x: 16, y: 72, size: 6, mode: "rise", duration: 14000 },
              { piece: 5, x: 76, y: 78, size: 5, mode: "rise", duration: 17000, delay: -7000 },
              { piece: 1, x: 14, y: 10, size: 3, mode: "bob" },
              { piece: 4, x: 80, y: 14, size: 3.5, mode: "bob", delay: -2500 },
              ...burst([0, 3, 1, 2], 14, 5, 700),
            ]}
          />
        </>
      );
    case "choodi-chakra":
      return (
        <>
          {beyond}
          <div className="absolute inset-0">
            {range(5).map((i) => (
              <Cut
                key={i}
                ctx={ctx}
                name="bangle-rings"
                box={RING_BOX}
                className={cn("fo-band", i % 2 && "fo-reverse", i > 2 && "fo-rocking")}
                style={vars({
                  "--i": i,
                  "--r0": `${RING_BANDS[i]}%`,
                  "--r1": `${RING_BANDS[i + 1]}%`,
                })}
              />
            ))}
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats ctx={ctx} items={burst([0, 1, 2, 3, 4, 5], 16, 7, 400)} />
        </>
      );
    case "sanjhi-roshni":
      return (
        <>
          {beyond}
          <div className="absolute inset-0 [perspective:150cqw]">
            <div className="fo-page absolute inset-0">
              <Paint ctx={ctx} name="stencil" />
              <span className="fo-lamp absolute inset-0" />
              <span className="fo-page-shade absolute inset-0" />
            </div>
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats
            ctx={ctx}
            items={[...fall([0, 2], 4, 5, 14000), ...burst([0, 1, 2, 4, 5], 14, 6.5, 900)]}
          />
        </>
      );
    case "chhaya-parda":
      return (
        <>
          {beyond}
          <div className="fo-screen absolute inset-0">
            <Paint ctx={ctx} name="screen" className="fo-screen-glow" />
            {[
              { piece: 0, x: 4, y: 58, size: 38 },
              { piece: 1, x: 60, y: 6, size: 30 },
              { piece: 4, x: 58, y: 54, size: 34 },
            ].map((s, i) =>
              ctx.sample ? null : (
                <span
                  key={i}
                  className="fo-shadow absolute aspect-square"
                  style={vars({ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}%`, "--i": i })}
                >
                  <Image
                    alt=""
                    {...imageProps(ctx, `piece-${s.piece}`, "small")}
                    className="object-contain"
                  />
                </span>
              ),
            )}
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats ctx={ctx} items={burst([0, 1, 2, 3, 4, 5], 12, 9, 900)} />
        </>
      );
    case "athangudi-tiles":
      return (
        <>
          {beyond}
          <div className="absolute inset-0 [perspective:200cqw]">
            {range(TILE_ROWS * TILE_COLS).map((n) => {
              const r = Math.floor(n / TILE_COLS);
              const c = n % TILE_COLS;
              return (
                <span
                  key={n}
                  className="fo-tile absolute"
                  style={vars({
                    left: `${c * 20}%`,
                    top: `${r * 11.25}%`,
                    width: "20%",
                    height: "11.25%",
                    "--d": Math.hypot(c - 2, (r - 4) * 0.9).toFixed(2),
                  })}
                >
                  <span className="absolute inset-[3%]">
                    <Image
                      alt=""
                      {...imageProps(ctx, `tile-${(Math.abs(c - 2) + r) % 5}`, "small")}
                      className="object-fill"
                    />
                  </span>
                </span>
              );
            })}
          </div>
          <span className="fo-glint absolute inset-0" />
          <FrontSplit ctx={ctx} />
          <Floats ctx={ctx} items={burst([0, 1, 2, 5], 12, 6, 900)} />
        </>
      );
    case "gulaal-bindu":
      return (
        <>
          {beyond}
          <div className="fo-paper absolute inset-0">
            <Paint ctx={ctx} name="paper" />
            {[
              [6, 6, 24, 1],
              [72, 10, 22, 1],
              [8, 70, 22, 1],
              [70, 74, 26, 1],
              [30, 20, 30, 0],
              [52, 40, 34, 0],
              [14, 40, 30, 0],
              [60, 60, 30, 0],
              [34, 62, 32, 0],
              [40, 2, 28, 0],
              [76, 36, 26, 0],
              [2, 86, 28, 0],
            ].map(([x, y, size, idle], i) => (
              <span
                key={i}
                className={cn("fo-bloom absolute aspect-square", idle && "fo-bloom-idle")}
                style={vars({ left: `${x}%`, top: `${y}%`, width: `${size}%`, "--i": i })}
              >
                <Image
                  alt=""
                  {...imageProps(ctx, `bloom-${i % 6}`, "small")}
                  className="object-contain"
                />
              </span>
            ))}
          </div>
          <Floats ctx={ctx} items={burst([0, 1, 2, 3, 4, 5], 14, 6.5, 500)} />
        </>
      );
    case "bioscope":
      return (
        <>
          {beyond}
          <div className="fo-scope absolute inset-0">
            <div
              className="fo-kaleido absolute overflow-hidden rounded-full"
              style={{
                left: `${SCOPE_LENS[0]}%`,
                top: `${SCOPE_LENS[1]}%`,
                width: `${SCOPE_LENS[2]}%`,
                height: `${SCOPE_LENS[3]}%`,
              }}
            >
              <span className="fo-kaleido-glass absolute inset-0" />
              {[0, 1].map((band) => (
                <div
                  key={band}
                  className={cn("fo-kaleido-band absolute inset-0", band && "fo-reverse")}
                  style={vars({ "--turn": band ? -1 : 1 })}
                >
                  {range(6).map((i) => {
                    const a = (i / 6) * Math.PI * 2 + band * 0.5;
                    const reach = band ? 18 : 33;
                    return (
                      <span
                        key={i}
                        className="absolute aspect-square"
                        style={{
                          left: `${50 + Math.cos(a) * reach - 9}%`,
                          top: `${50 + Math.sin(a) * reach - 9}%`,
                          width: "18%",
                          rotate: `${(a * 180) / Math.PI + 90}deg`,
                        }}
                      >
                        <Image
                          alt=""
                          {...imageProps(ctx, `piece-${(i + band * 3) % 6}`, "small")}
                          className="object-contain"
                        />
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <Paint ctx={ctx} name="bioscope" />
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats ctx={ctx} items={burst([0, 1, 2, 3, 4, 5], 14, 6, 700)} />
        </>
      );
    case "kaanch-ka-gola":
      return (
        <>
          {beyond}
          <div className="fo-globe absolute inset-0">
            <div className="fo-globe-shake absolute inset-0">
              <Paint ctx={ctx} name="globe" />
              <div
                className="absolute overflow-hidden rounded-full"
                style={{
                  left: `${GLOBE_GLASS[0]}%`,
                  top: `${GLOBE_GLASS[1]}%`,
                  width: `${GLOBE_GLASS[2]}%`,
                  height: `${GLOBE_GLASS[3]}%`,
                }}
              >
                {!ctx.sample && (
                  <Dots
                    className="fo-flake"
                    points={range(22).map((i) => ({ x: (i * 37) % 100, y: (i * 53) % 100 }))}
                  />
                )}
              </div>
            </div>
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats ctx={ctx} items={fall([0, 1, 3], 6, 4, 14000)} />
        </>
      );
    case "phirki":
      return (
        <>
          {beyond}
          <div className="absolute inset-0 [perspective:160cqw]">
            {(Object.keys(FLAPS) as (keyof typeof FLAPS)[]).map((side, i) => (
              <Paint
                key={side}
                ctx={ctx}
                name="paper"
                className={`fo-flap fo-flap-${side}`}
                style={vars({ clipPath: FLAPS[side], "--i": i })}
              />
            ))}
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats
            ctx={ctx}
            items={[
              { piece: 0, x: 8, y: 9, size: 9, mode: "bob", duration: 5000 },
              { piece: 0, x: 82, y: 12, size: 7, mode: "bob", duration: 6000, delay: -2000 },
              ...burst([1, 2, 3, 4, 5], 22, 6, 600),
            ]}
          />
        </>
      );
    case "bulbule":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="garden" className="fo-garden" />
          <span className="fo-bubble fo-bubble-big absolute" />
          {!ctx.sample &&
            range(7).map((i) => (
              <span
                key={i}
                className="fo-bubble fo-bubble-rise absolute aspect-square"
                style={vars({
                  left: `${6 + ((i * 29) % 82)}%`,
                  width: `${11 + ((i * 7) % 8)}%`,
                  "--i": i,
                })}
              >
                <span className="absolute inset-[22%]">
                  <Image
                    alt=""
                    {...imageProps(ctx, `piece-${i % 6}`, "small")}
                    className="object-contain"
                  />
                </span>
              </span>
            ))}
          <FrontSplit ctx={ctx} />
          <Floats ctx={ctx} items={burst([0, 1, 2, 3, 4, 5], 12, 7, 300)} />
        </>
      );
    case "chadar":
      return (
        <>
          {beyond}
          <div className="fo-chadar absolute inset-0">
            <Paint ctx={ctx} name="veil" className="fo-chadar-lamps" />
            <span className="fo-chadar-shimmer absolute inset-0" />
          </div>
          <FrontSplit ctx={ctx} />
          <Floats
            ctx={ctx}
            items={[...fall([1, 2, 4], 4, 4.5, 13000), ...burst([0, 0, 1, 2, 3, 4, 5], 20, 6, 500)]}
          />
        </>
      );
    case "parwaaz":
      return (
        <>
          {beyond}
          <div className="absolute inset-0 [perspective:150cqw]">
            <Paint ctx={ctx} name="silk" className="fo-veil fo-silk" />
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          {/* The birds rest on the silk while the guest waits, then take off before it */}
          {!ctx.sample &&
            [
              { piece: 0, x: 8, y: 40, size: 30, dx: -60, dy: -70 },
              { piece: 1, x: 58, y: 22, size: 28, dx: 70, dy: -60 },
              { piece: 2, x: 62, y: 60, size: 18, dx: 60, dy: -40 },
              { piece: 3, x: 14, y: 66, size: 32, dx: -50, dy: -90 },
            ].map((bird, i) => (
              <span
                key={i}
                className="fo-bird absolute aspect-square"
                style={vars({
                  left: `${bird.x}%`,
                  top: `${bird.y}%`,
                  width: `${bird.size}%`,
                  "--i": i,
                  "--fx": `${bird.dx}cqw`,
                  "--fy": `${bird.dy}cqh`,
                })}
              >
                <Image
                  alt=""
                  {...imageProps(ctx, `piece-${bird.piece}`, "small")}
                  className="object-contain"
                />
              </span>
            ))}
          <Floats ctx={ctx} items={[...fall([5], 3, 5, 14000), ...burst([4, 5, 2], 12, 6, 700)]} />
        </>
      );
    case "bhanwar":
      return (
        <>
          {beyond}
          <div className="fo-whirl absolute inset-0">
            <Paint ctx={ctx} name="marble" className="fo-whirl-spin" />
          </div>
          <FrontSplit ctx={ctx} />
          <Floats
            ctx={ctx}
            items={[
              { piece: 4, x: 14, y: 70, size: 9, mode: "bob", duration: 6000 },
              { piece: 0, x: 78, y: 14, size: 4, mode: "bob", delay: -2500 },
              ...burst([0, 1, 2, 3, 5], 16, 6, 900),
            ]}
          />
        </>
      );
    case "jaali-patta":
      return (
        <>
          {beyond}
          <div className="fo-leaf absolute inset-0">
            <div className="fo-leaf-sway absolute inset-0">
              <Paint ctx={ctx} name="leaf" />
              {/* Light runs up the veins, only where the leaf is */}
              <span
                className="fo-veins absolute inset-0"
                style={{
                  maskImage: "url(/openings/fresh/jaali-patta/leaf.webp)",
                  maskSize: "cover",
                  maskPosition: "center",
                }}
              />
            </div>
          </div>
          <FrontSplit ctx={ctx} />
          <Floats
            ctx={ctx}
            items={[...fall([0, 1, 2], 5, 5, 14000), ...burst([0, 1, 3, 4, 5], 14, 6, 900)]}
          />
        </>
      );
    case "lapet-khule":
      return (
        <>
          {beyond}
          <Paint ctx={ctx} name="rosette" className="fo-rosette-ground" />
          <div className="absolute inset-0">
            {range(4).map((i) => (
              <Cut
                key={i}
                ctx={ctx}
                name="rosette"
                box={ROSETTE_BOX}
                className={cn("fo-coil", i % 2 && "fo-reverse")}
                style={vars({
                  "--i": i,
                  "--r0": `${i ? ROSETTE_BANDS[i - 1] : 0}%`,
                  "--r1": `${ROSETTE_BANDS[i]}%`,
                })}
              />
            ))}
          </div>
          <Paint ctx={ctx} name="front" className="fo-front" />
          <Floats
            ctx={ctx}
            items={[...fall([0, 3, 5], 4, 4.5, 13000), ...burst([0, 1, 2, 3, 4, 5], 22, 6.5, 400)]}
          />
        </>
      );
    case "chhuk-chhuk":
      return (
        <>
          {beyond}
          <div className="fo-hills absolute inset-0">
            <Paint ctx={ctx} name="hills" />
            <div className="fo-train absolute inset-0">
              <div className="fo-train-loop absolute inset-0">
                <Paint ctx={ctx} name="train" />
                {!ctx.sample &&
                  range(3).map((i) => (
                    <span
                      key={i}
                      className="fo-puff absolute aspect-square"
                      style={vars({ left: "6%", top: "38%", width: "7%", "--i": i })}
                    >
                      <Image
                        alt=""
                        {...imageProps(ctx, "piece-1", "small")}
                        className="object-contain"
                      />
                    </span>
                  ))}
              </div>
            </div>
            {!ctx.sample &&
              range(10).map((i) => (
                <span
                  key={i}
                  className="fo-steam absolute aspect-square"
                  style={vars({
                    left: `${((i * 31) % 90) - 10}%`,
                    top: `${10 + ((i * 43) % 70)}%`,
                    width: "34%",
                    "--i": i,
                  })}
                >
                  <Image
                    alt=""
                    {...imageProps(ctx, "piece-0", "small")}
                    className="object-contain"
                  />
                </span>
              ))}
          </div>
          <Floats
            ctx={ctx}
            items={[
              { piece: 5, x: -10, y: 16, size: 6, mode: "cross", duration: 15000 },
              ...burst([2, 3, 4], 10, 7, 1400),
            ]}
          />
        </>
      );
  }
}

/** The stars of the taaramandal opening, joined in gold round the name. */
function Constellation() {
  const points = ring(12, 42, 30, 44).map((p) => ({
    x: p.x.toFixed(1),
    y: (p.y * 1.778).toFixed(1),
  }));
  const at = (i: number) => points[i] ?? { x: "50", y: "78" };
  const line = (...stops: { x: string | number; y: string | number }[]) =>
    stops.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  // A ring round the name, with a point up to the god and one down to the countdown
  const d = [
    `${line(...points)} Z`,
    line(at(9), { x: 50, y: 22 }, at(8)),
    line(at(3), { x: 50, y: 126 }, at(2)),
  ].join(" ");
  const stars = [...points, { x: "50", y: "22" }, { x: "50", y: "126" }];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 177.7"
      className="fo-constellation absolute inset-0 size-full"
    >
      <path d={d} pathLength={1} />
      {stars.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i % 3 ? 0.55 : 0.85} style={vars({ "--i": i })} />
      ))}
    </svg>
  );
}

export function FreshOpeningArt({ id, sample = false }: { id: FreshOpening; sample?: boolean }) {
  return (
    <div aria-hidden data-fresh={id} className="fo absolute inset-0 overflow-hidden">
      <div className="fo-canvas absolute top-1/2 left-1/2">
        <Art ctx={{ id, sample }} />
      </div>
    </div>
  );
}
