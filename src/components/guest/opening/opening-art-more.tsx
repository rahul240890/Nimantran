import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/*
 * Thirteen more openings (Step 12y), drawn like the first six: container units of the
 * stage, the theme's --open-* colours, and every move keyed to the stage's data-open, so
 * still mode shows the end of each move at once. The CSS lives with the rest under
 * "Openings" in globals.css.
 */

const range = (count: number) => Array.from({ length: count }, (_, i) => i);
const vars = (values: Record<string, string | number>) => values as CSSProperties;

/** A tiny repeatable pseudo-random number in [0, 1) for scattering things the same way. */
const scatter = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Night sky with stars that twinkle. */
function Stars({ count = 40 }: { count?: number }) {
  return (
    <div aria-hidden className="absolute inset-0">
      {range(count).map((i) => (
        <span
          key={i}
          className="opening-star absolute rounded-full"
          style={vars({
            left: `${scatter(i) * 100}%`,
            top: `${scatter(i, 2) * 62}%`,
            width: `${0.5 + scatter(i, 3) * 0.9}cqw`,
            "--i": i,
          })}
        />
      ))}
    </div>
  );
}

/** A wedding mandap: banana-leaf pillars, a gilt canopy and sheer drapes that rise. */
export function Mandap() {
  return (
    <>
      <div className="opening-night absolute inset-0" />
      <div className="opening-beyond absolute inset-x-[12cqw] top-[16%] bottom-0 opacity-90" />
      {/* Jasmine strings hanging from the canopy */}
      <div className="absolute inset-x-[14cqw] top-[15%] flex justify-between">
        {range(9).map((i) => (
          <span
            key={i}
            className="opening-jasmine w-[1.6cqw]"
            style={vars({ height: `${30 + (i % 3) * 8}cqw`, "--i": i })}
          />
        ))}
      </div>
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={cn(
            "opening-drape absolute top-[13%] bottom-[6%] w-[58%]",
            side === "left" ? "opening-drape-left left-[6cqw]" : "opening-drape-right right-[6cqw]",
          )}
        />
      ))}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={cn(
            "opening-banana absolute top-[12%] bottom-0 w-[9cqw]",
            side === "left" ? "left-[3cqw]" : "right-[3cqw]",
          )}
        />
      ))}
      <svg
        aria-hidden
        viewBox="0 0 100 24"
        className="opening-canopy absolute inset-x-0 top-[2%] w-full"
      >
        <path
          d="M2 22 Q50 -8 98 22 Z"
          fill="var(--open-gilt)"
          stroke="var(--open-gilt-dark)"
          strokeWidth="0.8"
        />
        <path d="M10 22 Q50 2 90 22" fill="none" stroke="var(--open-jewel)" strokeWidth="1.6" />
        {range(11).map((i) => (
          <circle key={i} cx={6 + i * 8.8} cy={22.6} r={1.6} fill="var(--marigold)" />
        ))}
        <path d="M47 4 L50 -1 L53 4 Z" fill="var(--open-gilt-bright)" />
      </svg>
      {/* Brass kalash stacked at each pillar's foot */}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={cn(
            "absolute bottom-[1%] flex w-[13cqw] flex-col items-center",
            side === "left" ? "left-[1cqw]" : "right-[1cqw]",
          )}
        >
          {[0.6, 0.8, 1].map((size) => (
            <span
              key={size}
              className="opening-pot -mt-[1cqw] rounded-full"
              style={{ width: `${size * 11}cqw`, height: `${size * 8}cqw` }}
            />
          ))}
        </div>
      ))}
    </>
  );
}

/** A Rajasthani jharokha: a cusped window whose four jaali shutters fold back. */
export function Jharokha() {
  return (
    <>
      <div className="opening-sandstone absolute inset-0" />
      <div className="opening-jharokha-frame absolute inset-x-[8cqw] top-[20%] bottom-[4%]" />
      <div className="opening-jharokha-hole absolute inset-x-[13cqw] top-[24%] bottom-[8%] overflow-hidden [perspective:1200px]">
        <div className="opening-beyond absolute inset-0" />
        {range(4).map((i) => (
          <div
            key={i}
            className={cn(
              "opening-shutter absolute inset-y-0 w-1/4",
              i < 2 ? "opening-shutter-left" : "opening-shutter-right",
            )}
            style={vars({ left: `${i * 25}%`, "--i": i < 2 ? 1 - i : i - 2 })}
          />
        ))}
      </div>
      {/* Chhatri brackets and a little dome above */}
      <svg aria-hidden viewBox="0 0 100 30" className="absolute inset-x-[4cqw] top-[6%] w-[92cqw]">
        <path
          d="M8 28 H92 L86 22 H14 Z"
          fill="var(--open-gilt-dark)"
          stroke="var(--open-gilt)"
          strokeWidth="0.6"
        />
        <path
          d="M30 22 Q50 -6 70 22 Z"
          fill="var(--open-stone-light)"
          stroke="var(--open-gilt-dark)"
          strokeWidth="0.8"
        />
        <path d="M48.5 4 L50 -1 L51.5 4 Z" fill="var(--open-gilt)" />
        {range(9).map((i) => (
          <path
            key={i}
            d={`M${16 + i * 8.5} 28 q2.5 4 5 0`}
            fill="none"
            stroke="var(--open-gilt)"
            strokeWidth="0.8"
          />
        ))}
      </svg>
    </>
  );
}

/** A curtain of flower strings, marigold, rose and jasmine, parting from the middle. */
export function FlowerCurtain() {
  const count = 15;
  return (
    <>
      <div className="opening-beyond absolute inset-0" />
      <div className="opening-pelmet absolute inset-x-0 top-0 z-10 h-[4%]" />
      {range(count).map((i) => {
        const offset = i - (count - 1) / 2;
        return (
          <span
            key={i}
            className={cn(
              "opening-string absolute top-[3%] bottom-0 w-[5.4cqw]",
              i % 3 === 0
                ? "opening-string-marigold"
                : i % 3 === 1
                  ? "opening-string-rose"
                  : "opening-string-jasmine",
            )}
            style={vars({
              left: `${(i / count) * 100 + 0.6}%`,
              "--push": `${Math.sign(offset) * (40 + Math.abs(offset) * 6)}cqw`,
              "--i": Math.abs(offset),
            })}
          />
        );
      })}
    </>
  );
}

/** A royal farmaan scroll that rolls itself up and away. */
export function Scroll() {
  return (
    <>
      <div className="opening-velvet absolute inset-0" />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      <div className="opening-scroll-paper absolute inset-x-[10cqw] top-[7%] bottom-[5%]" />
      <span className="opening-scroll-rod opening-scroll-top absolute inset-x-[6cqw] top-[5%] h-[4cqw]" />
      <span className="opening-scroll-rod opening-scroll-bottom absolute inset-x-[6cqw] bottom-[3.5%] h-[4cqw]" />
      <span className="opening-ribbon absolute top-[5%] bottom-[3.5%] left-1/2 w-[3cqw] -translate-x-1/2" />
    </>
  );
}

/** Rows of diyas lit one by one, flaring into light as it opens. */
export function Diyas() {
  // Two columns either side of the names and a row beneath them
  const lamps = [
    ...range(5).map((i) => ({ x: 9, y: 22 + i * 9, size: 11 })),
    ...range(5).map((i) => ({ x: 91, y: 22 + i * 9, size: 11 })),
    ...range(5).map((i) => ({ x: 22 + i * 14, y: 60, size: 10 })),
  ];
  return (
    <>
      <div className="opening-night absolute inset-0" />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      <svg
        aria-hidden
        viewBox="-50 -50 100 100"
        className="opening-turn-slow absolute top-[40%] left-1/2 w-[110cqw] -translate-1/2 opacity-40"
      >
        {range(24).map((i) => (
          <circle
            key={i}
            cx={Math.cos((i / 24) * Math.PI * 2) * 44}
            cy={Math.sin((i / 24) * Math.PI * 2) * 44}
            r="1.2"
            fill="var(--open-gilt)"
          />
        ))}
        <circle
          r="38"
          fill="none"
          stroke="var(--open-gilt)"
          strokeWidth="0.3"
          strokeDasharray="1 2"
        />
      </svg>
      {lamps.map((lamp, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 40 40"
          className="opening-lamp absolute -translate-x-1/2"
          style={vars({
            left: `${lamp.x}%`,
            top: `${lamp.y}%`,
            width: `${lamp.size}cqw`,
            "--i": i,
          })}
        >
          <ellipse
            cx="20"
            cy="15"
            rx="10"
            ry="13"
            fill="var(--open-light)"
            className="opening-lamp-glow"
          />
          <path
            className="opening-flame"
            d="M20 4 C15 13 16 20 20 22 C24 20 25 13 20 4Z"
            fill="var(--marigold)"
          />
          <path d="M4 23 H36 C34 32 28 36 20 36 C12 36 6 32 4 23Z" fill="var(--open-gilt-dark)" />
          <path d="M8 23 H32 C30 29 26 32 20 32 C14 32 10 29 8 23Z" fill="var(--open-jewel)" />
        </svg>
      ))}
    </>
  );
}

/** A rangoli that draws itself in colours, then spins outward into light. */
export function Rangoli() {
  const ring = (count: number, radius: number, length: number, colour: string, turn = 0) =>
    range(count).map((i) => (
      <path
        key={`${radius}-${i}`}
        d={`M0 ${-radius} C${-length * 0.45} ${-radius - length * 0.4} ${-length * 0.2} ${-radius - length} 0 ${-radius - length} C${length * 0.2} ${-radius - length} ${length * 0.45} ${-radius - length * 0.4} 0 ${-radius}Z`}
        transform={`rotate(${(360 / count) * i + turn})`}
        fill={colour}
        stroke="var(--open-plate)"
        strokeWidth="0.6"
        pathLength={1}
        className="opening-draw"
        style={vars({ "--i": i % 8 })}
      />
    ));
  return (
    <>
      <div className="opening-rangoli absolute inset-0" />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      <svg
        aria-hidden
        viewBox="-100 -100 200 200"
        className="opening-rangoli-art absolute top-[46%] left-1/2 w-[128cqw] max-w-none -translate-1/2"
      >
        <circle
          r="96"
          fill="none"
          stroke="var(--open-gilt)"
          strokeWidth="1"
          strokeDasharray="0.5 4"
          strokeLinecap="round"
        />
        {ring(24, 72, 22, "var(--marigold)")}
        {ring(16, 54, 20, "var(--open-jewel)", 11.25)}
        {ring(12, 38, 18, "var(--open-leaf)")}
        {ring(8, 22, 16, "var(--open-petal-fall)", 22.5)}
        <circle r="20" fill="var(--open-plate)" opacity="0.9" />
        {range(36).map((i) => (
          <circle
            key={i}
            cx={Math.cos((i / 36) * Math.PI * 2) * 86}
            cy={Math.sin((i / 36) * Math.PI * 2) * 86}
            r="2"
            fill={i % 2 ? "var(--open-plate)" : "var(--marigold)"}
          />
        ))}
      </svg>
    </>
  );
}

/** A peacock's fan of feathers behind the names, folding down to either side. */
export function Peacock() {
  const count = 23;
  return (
    <>
      <div className="opening-peacock-ground absolute inset-0" />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      <div className="absolute top-[52%] left-1/2 h-0 w-0">
        {range(count).map((i) => {
          const angle = -170 + (340 / (count - 1)) * i;
          return (
            <svg
              key={i}
              aria-hidden
              viewBox="-10 -100 20 100"
              className="opening-feather absolute bottom-0 left-0 h-[46cqh] max-h-[92cqw] -translate-x-1/2"
              style={vars({ "--a": `${angle}deg`, "--i": Math.abs(i - (count - 1) / 2) })}
            >
              <path d="M0 0 V-80" stroke="var(--open-gilt)" strokeWidth="0.6" />
              <path
                d="M0 -30 C-7 -50 -8 -78 0 -98 C8 -78 7 -50 0 -30Z"
                fill="var(--open-feather)"
                opacity="0.85"
              />
              <ellipse cx="0" cy="-84" rx="6.4" ry="9" fill="var(--open-gilt)" />
              <ellipse cx="0" cy="-83" rx="4.6" ry="6.6" fill="var(--open-leaf)" />
              <ellipse cx="0" cy="-82" rx="3" ry="4.4" fill="var(--open-feather-eye)" />
              <ellipse cx="0" cy="-81.5" rx="1.5" ry="2.2" fill="var(--open-deep)" />
            </svg>
          );
        })}
      </div>
    </>
  );
}

/** A clothbound storybook whose cover swings open to the first page. */
export function Storybook() {
  return (
    <div className="absolute inset-0 [perspective:1800px]">
      <div className="opening-book-page absolute inset-[3cqw] rounded-[2cqw]" />
      <div className="opening-book-cover absolute inset-[3cqw] origin-left rounded-[2cqw] [transform-style:preserve-3d]">
        <div className="opening-book-front absolute inset-0 rounded-[2cqw] [backface-visibility:hidden]">
          <span className="opening-book-spine absolute inset-y-0 left-0 w-[7cqw]" />
          <span className="opening-book-border absolute inset-[5cqw] left-[11cqw] rounded-[1.4cqw]" />
          {(
            [
              "top-[6.5cqw] left-[12.5cqw]",
              "top-[6.5cqw] right-[6.5cqw] rotate-90",
              "bottom-[6.5cqw] right-[6.5cqw] rotate-180",
              "bottom-[6.5cqw] left-[12.5cqw] -rotate-90",
            ] as const
          ).map((place) => (
            <svg
              key={place}
              aria-hidden
              viewBox="0 0 20 20"
              className={cn("absolute w-[9cqw]", place)}
            >
              <path d="M1 1 H14 Q8 4 6 8 Q4 12 1 14 Z" fill="var(--open-gilt)" />
              <circle cx="5" cy="5" r="1.6" fill="var(--open-gilt-bright)" />
            </svg>
          ))}
        </div>
        <div className="opening-book-inside absolute inset-0 [transform:rotateY(180deg)] rounded-[2cqw] [backface-visibility:hidden]" />
      </div>
    </div>
  );
}

/** Paper sky lanterns drifting on a night sky, then rising away. */
export function SkyLanterns() {
  return (
    <>
      <div className="opening-night absolute inset-0" />
      <Stars />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      {range(16).map((i) => (
        <span
          key={i}
          className="opening-sky-lantern absolute"
          style={vars({
            left: `${4 + scatter(i, 5) * 86}%`,
            top: `${8 + scatter(i, 6) * 80}%`,
            width: `${6 + scatter(i, 7) * 7}cqw`,
            "--i": i,
          })}
        />
      ))}
    </>
  );
}

/** Fireworks over a skyline of domes, bursting bigger as it opens. */
export function Fireworks() {
  const bursts = [
    { x: 24, y: 18, size: 44, colour: "var(--marigold)" },
    { x: 74, y: 26, size: 52, colour: "var(--open-petal-fall)" },
    { x: 50, y: 10, size: 36, colour: "var(--open-light)" },
    { x: 18, y: 52, size: 30, colour: "var(--open-leaf)" },
    { x: 80, y: 58, size: 34, colour: "var(--marigold)" },
  ];
  return (
    <>
      <div className="opening-night absolute inset-0" />
      <Stars count={24} />
      {bursts.map((burst, b) => (
        <svg
          key={b}
          aria-hidden
          viewBox="-50 -50 100 100"
          className="opening-burst absolute -translate-1/2"
          style={vars({
            left: `${burst.x}%`,
            top: `${burst.y}%`,
            width: `${burst.size}cqw`,
            "--i": b,
          })}
        >
          {range(18).map((i) => {
            const angle = (i / 18) * Math.PI * 2;
            return (
              <g key={i}>
                <line
                  x1={Math.cos(angle) * 10}
                  y1={Math.sin(angle) * 10}
                  x2={Math.cos(angle) * 40}
                  y2={Math.sin(angle) * 40}
                  stroke={burst.colour}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle
                  cx={Math.cos(angle) * 45}
                  cy={Math.sin(angle) * 45}
                  r="2"
                  fill={burst.colour}
                />
              </g>
            );
          })}
        </svg>
      ))}
      <svg
        aria-hidden
        viewBox="0 0 100 30"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[22%] w-full"
      >
        <path
          d="M0 30 V18 H8 V12 Q12 4 16 12 V18 H24 V10 H28 V6 H30 V10 H34 V18 H40 V14 Q50 -2 60 14 V18 H66 V10 H70 V6 H72 V10 H76 V18 H84 V12 Q88 4 92 12 V18 H100 V30 Z"
          fill="var(--open-deep)"
        />
        {range(14).map((i) => (
          <rect
            key={i}
            x={3 + i * 7}
            y={21 + (i % 2) * 3}
            width="1.6"
            height="2.2"
            fill="var(--open-light)"
            className="opening-window"
            style={vars({ "--i": i })}
          />
        ))}
      </svg>
    </>
  );
}

/** A sky full of balloons that float up and away. */
export function Balloons() {
  const colours = [
    "var(--marigold)",
    "var(--open-petal-fall)",
    "var(--open-jewel)",
    "var(--open-leaf)",
    "var(--open-light)",
    "var(--open-gilt)",
  ];
  return (
    <>
      <div className="opening-party-sky absolute inset-0" />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      {range(22).map((i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 20 44"
          className="opening-balloon absolute"
          style={vars({
            left: `${-4 + scatter(i, 9) * 92}%`,
            top: `${-2 + scatter(i, 10) * 90}%`,
            width: `${13 + scatter(i, 11) * 9}cqw`,
            "--i": i,
            "--rise": `${110 + scatter(i, 12) * 60}cqh`,
          })}
        >
          <path
            d="M10 26 Q7 32 11 37 Q14 41 10 44"
            fill="none"
            stroke="var(--open-plate)"
            strokeWidth="0.5"
          />
          <ellipse cx="10" cy="13" rx="9" ry="12" fill={colours[i % colours.length]} />
          <path d="M8.6 25 H11.4 L10 26.8 Z" fill={colours[i % colours.length]} />
          <ellipse cx="6.6" cy="8" rx="2" ry="3.4" fill="var(--open-plate)" opacity="0.45" />
        </svg>
      ))}
    </>
  );
}

/** A gift box whose bow unties and lid lifts off. */
export function GiftBox() {
  return (
    <>
      <div className="opening-party-sky absolute inset-0" />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      <div className="opening-gift-box absolute inset-x-[7cqw] top-[26%] bottom-[3%]">
        <span className="opening-gift-band absolute inset-y-0 left-1/2 w-[12cqw] -translate-x-1/2" />
        <span className="opening-gift-band absolute inset-x-0 top-[34%] h-[12cqw]" />
      </div>
      <div className="opening-gift-lid absolute inset-x-[4cqw] top-[18%] h-[10%]">
        <span className="opening-gift-band absolute inset-y-0 left-1/2 w-[12cqw] -translate-x-1/2" />
        <svg
          aria-hidden
          viewBox="0 0 60 30"
          className="opening-bow absolute bottom-[78%] left-1/2 w-[42cqw] -translate-x-1/2"
        >
          <path d="M30 22 C16 2 2 6 4 16 C6 26 22 24 30 22Z" fill="var(--open-ribbon)" />
          <path d="M30 22 C44 2 58 6 56 16 C54 26 38 24 30 22Z" fill="var(--open-ribbon)" />
          <path d="M30 22 L22 30 H26 Z M30 22 L38 30 H34 Z" fill="var(--open-ribbon)" />
          <circle cx="30" cy="21" r="4.4" fill="var(--open-ribbon-dark)" />
        </svg>
      </div>
    </>
  );
}

/** A moonlit night of hanging lanterns and arches, for a Nikah or an Eid evening. */
export function Moonlit() {
  return (
    <>
      <div className="opening-night absolute inset-0" />
      <Stars count={50} />
      <div className="opening-beyond opening-glow-in absolute inset-0" />
      <span className="opening-moon absolute top-[7%] right-[12cqw] size-[22cqw] rounded-full" />
      {/* Hanging fanoos lanterns on chains */}
      {[
        { x: 10, drop: 30, size: 11 },
        { x: 28, drop: 18, size: 8 },
        { x: 72, drop: 22, size: 9 },
        { x: 90, drop: 34, size: 12 },
      ].map((lamp, i) => (
        <div
          key={i}
          className="opening-fanoos absolute top-0 flex -translate-x-1/2 flex-col items-center"
          style={vars({ left: `${lamp.x}%`, "--i": i })}
        >
          <span className="w-[0.4cqw] bg-(--open-gilt)" style={{ height: `${lamp.drop}cqw` }} />
          <svg aria-hidden viewBox="0 0 20 34" style={{ width: `${lamp.size}cqw` }}>
            <path d="M10 0 L13 5 H7 Z" fill="var(--open-gilt)" />
            <path d="M5 5 H15 L18 14 L15 26 H5 L2 14 Z" fill="var(--open-gilt-dark)" />
            <path
              d="M6.5 7 H13.5 L16 14 L13.5 24 H6.5 L4 14 Z"
              fill="var(--open-light)"
              className="opening-lamp-glow"
            />
            <path d="M10 7 V24 M4 14 H16" stroke="var(--open-gilt-dark)" strokeWidth="0.6" />
            <path d="M7 26 H13 L10 32 Z" fill="var(--open-gilt)" />
          </svg>
        </div>
      ))}
      {/* A row of pointed arches along the ground */}
      <svg
        aria-hidden
        viewBox="0 0 100 40"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[30%] w-full"
      >
        <path
          d="M0 40 V8 H100 V40 Z M6 40 V22 Q6 12 15 8 Q24 12 24 22 V40 Z M30 40 V20 Q30 8 41 4 Q52 8 52 20 V40 Z M58 40 V20 Q58 8 69 4 Q80 8 80 20 V40 Z M86 40 V22 Q86 12 95 8 Q104 12 104 22 V40 Z"
          fill="var(--open-deep)"
          fillRule="evenodd"
        />
      </svg>
    </>
  );
}
