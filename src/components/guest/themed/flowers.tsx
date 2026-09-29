"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { GuestFlower } from "@/lib/suites/guest-look";

/*
 * The flowers of the themed guest page, drawn once as SVG symbols and reused: marigold,
 * rose, jasmine and lotus heads, their loose petals, and mango leaves. Colours are the
 * `--flower-*` and `--guest-*` tokens in globals.css.
 */

const MARIGOLD = "var(--flower-marigold)";
const MARIGOLD_DEEP = "var(--flower-marigold-deep)";
const ROSE = "var(--flower-rose)";
const ROSE_DEEP = "var(--flower-rose-deep)";
const JASMINE = "var(--flower-jasmine)";
const JASMINE_EDGE = "var(--flower-jasmine-edge)";
const LOTUS = "var(--flower-lotus)";
const LOTUS_DEEP = "var(--flower-lotus-deep)";
const LEAF = "var(--flower-leaf)";
const LEAF_DEEP = "var(--flower-leaf-deep)";
const GILT = "var(--guest-gilt)";

const around = (count: number, radius: number, turn = 0) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + turn;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius] as const;
  });

/** The symbols every flower on the page points at. Rendered once per page. */
export function FlowerDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <symbol id="gf-marigold" viewBox="-10 -10 20 20">
          {around(14, 6.4).map(([x, y], i) => (
            <circle key={`o${i}`} cx={x} cy={y} r="3.3" fill={MARIGOLD_DEEP} />
          ))}
          {around(11, 4, 0.3).map(([x, y], i) => (
            <circle key={`m${i}`} cx={x} cy={y} r="3" fill={MARIGOLD} />
          ))}
          <circle r="3.4" fill={MARIGOLD} />
          {around(6, 1.6, 0.5).map(([x, y], i) => (
            <circle key={`c${i}`} cx={x} cy={y} r="0.9" fill={MARIGOLD_DEEP} />
          ))}
        </symbol>
        <symbol id="gf-rose" viewBox="-10 -10 20 20">
          {around(5, 4.6, -Math.PI / 2).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4.6" fill={ROSE} />
          ))}
          <circle r="4.4" fill={ROSE_DEEP} />
          <path
            d="M-2.6 0.6c0-2.2 2.8-3.2 4-1.4 1 1.6-0.6 3.2-2 2.4-1-0.6-0.4-1.8 0.4-1.6"
            fill="none"
            stroke={ROSE}
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </symbol>
        <symbol id="gf-jasmine" viewBox="-10 -10 20 20">
          {[0, 72, 144, 216, 288].map((turn) => (
            <ellipse
              key={turn}
              cx="0"
              cy="-4.8"
              rx="2.9"
              ry="4.9"
              transform={`rotate(${turn})`}
              fill={JASMINE}
              stroke={JASMINE_EDGE}
              strokeWidth="0.6"
            />
          ))}
          <circle r="1.9" fill={MARIGOLD} />
        </symbol>
        <symbol id="gf-lotus" viewBox="-10 -10 20 20">
          <path d="M0 6C-7 5-9.5 0-9 -2c3 0 6 3 9 8z" fill={LOTUS_DEEP} />
          <path d="M0 6C7 5 9.5 0 9 -2c-3 0-6 3-9 8z" fill={LOTUS_DEEP} />
          <path d="M0 6C-5.5 3-6 -3.5-4.2 -6.5 -1.8 -3 -0.6 1 0 6z" fill={LOTUS} />
          <path d="M0 6C5.5 3 6 -3.5 4.2 -6.5 1.8 -3 0.6 1 0 6z" fill={LOTUS} />
          <path d="M0 6C-2.8 2-2.6 -5 0 -9.2 2.6 -5 2.8 2 0 6z" fill={LOTUS} />
          <path d="M0 5.5C-1 2-1 -3 0 -7" stroke={LOTUS_DEEP} strokeWidth="0.5" fill="none" />
        </symbol>
        <symbol id="gf-leaf" viewBox="-4 -1 8 22">
          <path d="M0 0C3.6 4 3.6 13 0 21-3.6 13-3.6 4 0 0z" fill={LEAF} />
          <path d="M0 1.5V19" stroke={LEAF_DEEP} strokeWidth="0.6" />
        </symbol>
        <symbol id="gf-bell" viewBox="-5 -2 10 14">
          <path d="M0-2v2" stroke={GILT} strokeWidth="0.8" />
          <path d="M-3.6 8C-3.6 3-2.4 0 0 0s3.6 3 3.6 8z" fill={GILT} />
          <circle cy="9.4" r="1.3" fill={GILT} />
        </symbol>
        {/* Loose petals for the showers */}
        <symbol id="gp-marigold" viewBox="-5 -5 10 10">
          <path
            d="M-3.6 1.6C-4 -2.4 -1 -4.4 0 -3 1 -4.4 4 -2.4 3.6 1.6 2 4 -2 4 -3.6 1.6z"
            fill={MARIGOLD}
          />
        </symbol>
        <symbol id="gp-rose" viewBox="-5 -5 10 10">
          <path d="M0 4C-5 1-4.4-4.4 0-3.6 4.4-4.4 5 1 0 4z" fill={ROSE} />
        </symbol>
        <symbol id="gp-jasmine" viewBox="-5 -5 10 10">
          <ellipse rx="2.4" ry="4.4" fill={JASMINE} stroke={JASMINE_EDGE} strokeWidth="0.5" />
        </symbol>
        <symbol id="gp-lotus" viewBox="-5 -5 10 10">
          <path d="M0 4.6C-3.4 1.6-2.6-3 0-4.6 2.6-3 3.4 1.6 0 4.6z" fill={LOTUS} />
        </symbol>
      </defs>
    </svg>
  );
}

/** One flower head, `size` units across, centred on x, y. */
export function Bloom({
  kind,
  x,
  y,
  size,
  turn = 0,
}: {
  kind: GuestFlower;
  x: number;
  y: number;
  size: number;
  turn?: number;
}) {
  return (
    <use
      href={`#gf-${kind}`}
      x={-size / 2}
      y={-size / 2}
      width={size}
      height={size}
      transform={`translate(${x} ${y}) rotate(${turn})`}
    />
  );
}

/** A point on the quadratic curve from a through control c to b. */
const quad = (a: number, c: number, b: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

/*
 * A toran: a gold cord hung with mango leaves, flowers in swags between, and a strand of
 * flowers with a bell at every join. Drawn 1200 wide; on a phone it is cropped to the
 * middle two swags rather than squeezed.
 */
export function Garland({
  flower,
  second,
  swags = 6,
  className,
}: {
  flower: GuestFlower;
  second: GuestFlower;
  swags?: number;
  className?: string;
}) {
  const width = 1200;
  const span = width / swags;
  const pick = (i: number) => (i % 3 === 1 ? second : flower);
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} 150`}
      preserveAspectRatio="xMidYMin slice"
      className={className}
    >
      {/* Mango leaves along the cord */}
      {Array.from({ length: Math.round(width / 34) + 1 }, (_, i) => (
        <use
          key={`l${i}`}
          href="#gf-leaf"
          x={i * 34 - 6}
          y={4}
          width="12"
          height="36"
          transform={`rotate(${i % 2 ? 8 : -8} ${i * 34} 6)`}
        />
      ))}
      <path d={`M0 7H${width}`} stroke={GILT} strokeWidth="4" />
      {Array.from({ length: swags }, (_, s) => {
        const x0 = s * span;
        const x1 = x0 + span;
        const heads = Math.round(span / 22);
        return (
          <g key={`s${s}`}>
            <path
              d={`M${x0} 10Q${x0 + span / 2} 132 ${x1} 10`}
              stroke={GILT}
              strokeWidth="1.5"
              fill="none"
            />
            {Array.from({ length: heads }, (_, i) => {
              const t = (i + 1) / (heads + 1);
              return (
                <Bloom
                  key={i}
                  kind={pick(i)}
                  x={quad(x0, x0 + span / 2, x1, t)}
                  y={quad(10, 132, 10, t)}
                  size={i === Math.floor(heads / 2) ? 32 : 26}
                  turn={i * 37}
                />
              );
            })}
          </g>
        );
      })}
      {/* The strands at the joins, each swaying on its own */}
      {Array.from({ length: swags + 1 }, (_, s) => (
        <g
          key={`d${s}`}
          className="guest-strand"
          style={{ "--i": s } as CSSProperties}
          transform={`translate(${s * span} 10)`}
        >
          <path d="M0 0V112" stroke={GILT} strokeWidth="1.2" />
          {[16, 38, 60, 82].map((y, i) => (
            <Bloom key={y} kind={i % 2 ? second : flower} x={0} y={y} size={22} turn={i * 50} />
          ))}
          <use href="#gf-bell" x="-7" y="98" width="14" height="20" />
        </g>
      ))}
    </svg>
  );
}

/** A ring of flowers round a circle (a garden frame) or up and over an arch (a palace). */
export function FlowerFrame({
  shape,
  flower,
  second,
}: {
  shape: "arch" | "ring";
  flower: GuestFlower;
  second: GuestFlower;
}) {
  // Points along the frame's edge in a 100 by 125 box
  const points: (readonly [number, number])[] = [];
  if (shape === "ring") {
    // An oval, like a lotus pond seen from the bank
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      points.push([50 + Math.cos(a) * 49, 62.5 + Math.sin(a) * 61]);
    }
  } else {
    // Up the right side, over the round top, down the left
    for (let y = 122; y > 50; y -= 9) points.push([98, y]);
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * Math.PI;
      points.push([50 + Math.cos(a) * 48, 50 - Math.sin(a) * 48]);
    }
    for (let y = 59; y <= 122; y += 9) points.push([2, y]);
  }
  return (
    <svg
      aria-hidden
      viewBox="-8 -8 116 141"
      className="pointer-events-none absolute -inset-[8%] h-[116%] w-[116%] overflow-visible"
    >
      {points.map(([x, y], i) => (
        <g key={i}>
          <use
            href="#gf-leaf"
            x={-2.5}
            y={-2}
            width="5"
            height="13"
            transform={`translate(${x} ${y}) rotate(${(i * 71) % 360})`}
          />
          <Bloom
            kind={i % 3 === 2 ? second : flower}
            x={x}
            y={y}
            size={i % 4 === 0 ? 11 : 9}
            turn={i * 41}
          />
        </g>
      ))}
    </svg>
  );
}

/* A few numbers that look scattered but stay the same on every render */
const scatter = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/** Petals drifting down behind a section, all the time; still petals when motion is off. */
export function PetalDrift({
  flowers,
  count = 12,
}: {
  flowers: readonly GuestFlower[];
  count?: number;
}) {
  return (
    <div aria-hidden className="guest-drift pointer-events-none absolute inset-0 -z-10">
      {Array.from({ length: count }, (_, i) => (
        <svg
          key={i}
          viewBox="-5 -5 10 10"
          className="guest-petal"
          style={
            {
              left: `${scatter(i, 1) * 96}%`,
              top: `${scatter(i, 2) * 90}%`,
              "--size": `${0.8 + scatter(i, 3) * 0.8}rem`,
              "--delay": `${-scatter(i, 4) * 14}s`,
              "--time": `${10 + scatter(i, 5) * 8}s`,
              "--sway": `${(scatter(i, 6) - 0.5) * 6}rem`,
              "--spin": `${scatter(i, 7) > 0.5 ? 1 : -1}`,
            } as CSSProperties
          }
        >
          <use href={`#gp-${flowers[i % flowers.length]}`} />
        </svg>
      ))}
    </div>
  );
}

/**
 * A shower of petals over the whole screen when the guest showers the couple with flowers.
 * Hidden when motion is off; the words that answer the tap say it instead.
 */
export function PetalShower({
  flowers,
  burst,
}: {
  flowers: readonly GuestFlower[];
  burst: number;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!burst) return;
    const start = requestAnimationFrame(() => setShown(burst));
    const end = setTimeout(() => setShown(0), 6000);
    return () => {
      cancelAnimationFrame(start);
      clearTimeout(end);
    };
  }, [burst]);
  if (!shown) return null;
  return (
    <div
      key={shown}
      aria-hidden
      className="guest-shower pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {Array.from({ length: 44 }, (_, i) => (
        <svg
          key={i}
          viewBox="-5 -5 10 10"
          className="guest-shower-petal"
          style={
            {
              left: `${scatter(i, 11) * 100}%`,
              "--size": `${1 + scatter(i, 12) * 1.1}rem`,
              "--delay": `${scatter(i, 13) * 1.4}s`,
              "--time": `${2.8 + scatter(i, 14) * 2}s`,
              "--sway": `${(scatter(i, 15) - 0.5) * 10}rem`,
              "--spin": `${scatter(i, 16) > 0.5 ? 1 : -1}`,
            } as CSSProperties
          }
        >
          <use href={`#gp-${flowers[i % flowers.length]}`} />
        </svg>
      ))}
    </div>
  );
}
