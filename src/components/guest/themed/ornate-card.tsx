import type { CSSProperties, ReactNode } from "react";
import { FunctionFacts } from "@/components/guest/function-facts";
import type { GuestFunction } from "@/components/guest/guest-view";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/cn";
import { functionArt } from "@/lib/events/function-art";
import type { EventBox as OrnateBox } from "@/lib/suites/event-boxes";
import type { GuestFlower } from "@/lib/suites/guest-look";
import { Bloom } from "./flowers";
import "@/app/event-cards.css";

/**
 * One celebration as an ornate card (owner, 2026-11-04): the celebration's own painting
 * at the top (a haldi urli, mehendi cones, a dholak: function-art.ts), the name, the day
 * and time, the venue and a pill to the map, all in a
 * decorated frame the theme hangs its own way (event-boxes.ts):
 *
 * - moti: a lace-cornered frame on a gilt rod, a pearl jhalar swaying below
 * - jharokha: an arched window in jaali, latkans hanging at its sides
 * - mandap: between two pillars with kalash tops, a garland of the theme's flowers above
 * - kamal: a soft card with flowers gathered in each corner
 * - shisha: Kutch mirror-work round the edge, tassels hanging below
 * - mandir: a gilt band, a kolam border and temple bells that ring as it arrives
 *
 * Everything is drawn from the theme's cloth, gilt and jewel (event-cards.css), so each
 * theme dresses its cards in its own colours. Each card makes its own entrance once it
 * scrolls into view, and stays still for guests who prefer less motion.
 */
export function OrnateCard({
  box,
  fn,
  index,
  count,
  headingId,
  flower,
  second,
  className,
}: {
  box: OrnateBox;
  fn: GuestFunction;
  index: number;
  count: number;
  headingId: string;
  flower: GuestFlower;
  second: GuestFlower;
  className?: string;
}) {
  // The moti card's rod hangs on alternate sides, hour by hour
  const flip = index % 2 === 1;
  return (
    <div
      data-box={box}
      data-flip={flip || undefined}
      className={cn("oc guest-box relative mx-auto w-full max-w-[27rem]", className)}
    >
      {CRESTS[box]}
      {box === "moti" && <span aria-hidden className="oc-rod" />}
      {box === "jharokha" && (
        <>
          <Latkan side="start" />
          <Latkan side="end" />
        </>
      )}
      {box === "mandap" && (
        <>
          <Pillar side="start" />
          <Pillar side="end" />
        </>
      )}
      <div className="oc-band relative">
        <article
          aria-labelledby={headingId}
          className="oc-card relative flex flex-col items-center px-6 pt-10 pb-9 text-center sm:px-9"
        >
          {box === "mandap" && <Garland flower={flower} second={second} />}
          {(box === "moti" || box === "kamal") && <Filigree />}
          {(box === "moti" || box === "kamal") && (
            <Posies flower={flower} second={second} top={box === "kamal"} />
          )}
          <span aria-hidden className="oc-art relative mb-3 block">
            <Image
              src={functionArt(fn.kind)}
              alt=""
              fill
              unoptimized
              sizes="10rem"
              className="object-contain"
            />
          </span>
          {count > 1 && (
            <p
              aria-hidden
              className="oc-line font-label text-[0.7rem] tracking-[0.3em] text-accent-text uppercase tabular-nums"
            >
              {index + 1} / {count}
            </p>
          )}
          <h3
            id={headingId}
            className="oc-line mt-1 flex flex-col font-display text-[2.1rem] leading-tight break-words text-ink sm:text-[2.4rem]"
          >
            {fn.name}
            {fn.localName && (
              <span lang={fn.localName.lang} className="font-sans text-lg text-accent-text">
                {fn.localName.text}
              </span>
            )}
          </h3>
          <span aria-hidden className="oc-rule my-4" />
          <div className="oc-line flex w-full flex-col items-center gap-4">
            <FunctionFacts fn={fn} centered />
          </div>
        </article>
        {box === "moti" && <Gem bottom />}
      </div>
      {HANGINGS[box]}
    </div>
  );
}

/* ---------- Above the card ---------- */

/** A gilt crest with a pearl, at the top and foot of the moti card. */
function Gem({ bottom = false }: { bottom?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 22"
      className={cn(
        "oc-gem pointer-events-none absolute left-1/2 z-[2] h-6 w-12 -translate-x-1/2",
        bottom ? "-bottom-3 rotate-180" : "-top-3",
      )}
    >
      <path
        d="M2 21Q12 20 17 12Q21 5 24 1Q27 5 31 12Q36 20 46 21Z"
        className="oc-gilt oc-gilt-edge"
      />
      <path d="M12 21Q19 17 24 8Q29 17 36 21" className="oc-deep-line" />
      <circle cx="24" cy="15" r="4.2" className="oc-pearl" />
      <circle cx="22.8" cy="13.8" r="1.3" className="oc-shine" />
    </svg>
  );
}

/** A strip of mirror-work pennants along the top of the shisha card. */
function Pennants() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 18"
      preserveAspectRatio="none"
      className="oc-pennants pointer-events-none absolute z-[1] h-4"
    >
      {Array.from({ length: 10 }, (_, i) => (
        <path
          key={i}
          d={`M${i * 20} 0h20l-10 17z`}
          className={i % 2 === 0 ? "oc-jewel" : "oc-gilt"}
        />
      ))}
    </svg>
  );
}

const CRESTS: Record<OrnateBox, ReactNode> = {
  moti: <Gem />,
  jharokha: null,
  mandap: null,
  kamal: null,
  shisha: <Pennants />,
  mandir: null,
};

/* ---------- Inside the card ---------- */

/** Lace in each top corner, curling scrolls with leaves. */
function Filigree() {
  return (
    <>
      {["start-2", "end-2 -scale-x-100"].map((place) => (
        <svg
          key={place}
          aria-hidden
          viewBox="0 0 80 80"
          className={cn("oc-filigree pointer-events-none absolute top-2 size-20 sm:size-24", place)}
        >
          <path d="M6 6C30 7 46 15 52 30C56 41 47 49 40 44C34 40 37 32 43 34" />
          <path d="M6 6C7 30 15 46 30 52C41 56 49 47 44 40C40 34 32 37 34 43" />
          <path d="M6 6C20 14 26 20 32 32" />
          <path d="M22 9C26 3 33 4 34 9C30 12 25 12 22 9Z" className="oc-leaf" />
          <path d="M9 22C3 26 4 33 9 34C12 30 12 25 9 22Z" className="oc-leaf" />
          <path d="M44 18C49 14 55 16 55 21C50 23 46 22 44 18Z" className="oc-leaf" />
          <path d="M18 44C14 49 16 55 21 55C23 50 22 46 18 44Z" className="oc-leaf" />
          <circle cx="32" cy="32" r="2.4" className="oc-dot" />
          <circle cx="60" cy="10" r="1.6" className="oc-dot" />
          <circle cx="10" cy="60" r="1.6" className="oc-dot" />
        </svg>
      ))}
    </>
  );
}

/** Flowers gathered in the lower corners (and the upper ones, round a lotus). */
function Posies({
  flower,
  second,
  top,
}: {
  flower: GuestFlower;
  second: GuestFlower;
  top: boolean;
}) {
  const places = [
    "bottom-1 start-1",
    "bottom-1 end-1 -scale-x-100",
    ...(top ? ["top-1 start-1 -scale-y-100", "top-1 end-1 -scale-100"] : []),
  ];
  return (
    <>
      {places.map((place, n) => (
        <svg
          key={place}
          aria-hidden
          viewBox="0 0 70 70"
          className={cn(
            "oc-posy pointer-events-none absolute size-[5rem] overflow-visible sm:size-[6rem]",
            place,
            n > 1 && "size-14 sm:size-16",
          )}
        >
          <path d="M6 66C14 46 22 34 40 22M18 50C24 46 30 44 38 46" className="oc-stem" />
          {[
            [40, 22, 30],
            [30, 58, -40],
            [10, 40, 200],
            [50, 46, 110],
          ].map(([x, y, r], i) => (
            <use
              key={i}
              href="#gf-leaf"
              x={-2.5}
              y={-2}
              width="5"
              height="14"
              transform={`translate(${x} ${y}) rotate(${r})`}
            />
          ))}
          {[
            [16, 54, 18, flower],
            [32, 42, 13, second],
            [8, 34, 11, second],
            [40, 60, 11, flower],
            [44, 24, 9, flower],
          ].map(([x, y, size, kind], i) => (
            <g key={i} className="oc-bloom" style={{ "--i": i } as CSSProperties}>
              <Bloom
                kind={kind as GuestFlower}
                x={x as number}
                y={y as number}
                size={size as number}
                turn={i * 47}
              />
            </g>
          ))}
          {[
            [52, 16],
            [58, 30],
            [24, 26],
          ].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r="1.8" className="oc-bud" />
          ))}
        </svg>
      ))}
    </>
  );
}

/** A garland of the theme's flowers swagged across the top of the mandap. */
function Garland({ flower, second }: { flower: GuestFlower; second: GuestFlower }) {
  const swag = (from: number, to: number, dip: number) =>
    Array.from({ length: 11 }, (_, i) => {
      const t = i / 10;
      const x = (1 - t) * (1 - t) * from + 2 * (1 - t) * t * ((from + to) / 2) + t * t * to;
      const y = 2 * (1 - t) * t * dip;
      return [x, y + 4] as const;
    });
  const points = [...swag(0, 100, 34), ...swag(100, 200, 34).slice(1)];
  return (
    <svg
      aria-hidden
      viewBox="-6 -4 212 52"
      className="oc-garland pointer-events-none absolute inset-x-1 -top-3 z-[2] h-auto w-[calc(100%-0.5rem)] overflow-visible"
    >
      {[0, 100, 200].map((x, i) => (
        <g key={x} className="oc-strand" style={{ "--i": i } as CSSProperties}>
          {[-4, 4].map((turn) => (
            <use
              key={turn}
              href="#gf-leaf"
              x={-2.5}
              y={0}
              width="5"
              height="16"
              transform={`translate(${x + turn} 6) rotate(${turn * 4})`}
            />
          ))}
        </g>
      ))}
      {points.map(([x, y], i) => (
        <Bloom
          key={i}
          kind={i % 3 === 1 ? second : flower}
          x={x}
          y={y}
          size={i % 10 === 0 ? 16 : 12.5}
          turn={i * 37}
        />
      ))}
    </svg>
  );
}

/* ---------- At the sides ---------- */

/** A latkan: a cord with beads and a tassel, hanging at the jharokha's shoulder. */
function Latkan({ side }: { side: "start" | "end" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 120"
      className={cn(
        "oc-latkan pointer-events-none absolute top-[5.5rem] z-[2] h-28 w-5",
        side === "start" ? "start-0" : "end-0",
      )}
      style={{ "--i": side === "start" ? 0 : 1 } as CSSProperties}
    >
      <path d="M10 0V58" className="oc-gilt-line" />
      <circle cx="10" cy="22" r="3.4" className="oc-jewel" />
      <circle cx="10" cy="38" r="2.6" className="oc-pearl" />
      <path d="M10 52L16 62L10 72L4 62Z" className="oc-gilt" />
      <path d="M5 74H15L18 116H2Z" className="oc-jewel" />
      <path d="M6 80V114M10 80V116M14 80V114" className="oc-tassel-line" />
      <rect x="4" y="72" width="12" height="4" rx="2" className="oc-gilt" />
    </svg>
  );
}

/** A mandap pillar with a kalash on top. */
function Pillar({ side }: { side: "start" | "end" }) {
  return (
    <span
      aria-hidden
      className={cn("oc-pillar", side === "start" ? "start-0" : "end-0")}
      style={{ "--i": side === "start" ? 0 : 1 } as CSSProperties}
    >
      <svg
        viewBox="0 0 28 40"
        className="oc-kalash absolute -top-9 left-1/2 h-10 w-7 -translate-x-1/2"
      >
        <path d="M14 0C10 4 9 8 14 12C19 8 18 4 14 0Z" className="oc-jewel" />
        <path d="M8 14H20L18 18H10Z" className="oc-gilt" />
        <path
          d="M6 22C6 18 9 17 14 17C19 17 22 18 22 22C22 30 19 34 14 34C9 34 6 30 6 22Z"
          className="oc-gilt"
        />
        <path d="M9 24H19" className="oc-deep-line" />
        <rect x="3" y="34" width="22" height="6" rx="1.5" className="oc-deep" />
      </svg>
    </span>
  );
}

/* ---------- Below the card ---------- */

/** Pearl swags and seven pearl drops, each swaying on its own. */
function PearlJhalar() {
  const xs = Array.from({ length: 7 }, (_, i) => 10 + i * (280 / 6));
  const lengths = [16, 30, 22, 42, 22, 30, 16];
  const swag = (a: number, b: number) =>
    Array.from({ length: 9 }, (_, i) => {
      const t = (i + 1) / 10;
      return [a + (b - a) * t, 3 + 2 * (1 - t) * t * 30] as const;
    });
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 92"
      className="oc-hang pointer-events-none relative z-[1] mx-auto -mt-2 block h-auto w-[92%] overflow-visible"
    >
      {xs
        .slice(1)
        .map((x, i) =>
          swag(xs[i]!, x).map(([px, py], j) => (
            <circle key={`${i}-${j}`} cx={px} cy={py} r="2.6" className="oc-pearl" />
          )),
        )}
      {xs.map((x, i) => {
        const l = lengths[i]!;
        return (
          <g key={x} className="oc-strand" style={{ "--i": i } as CSSProperties}>
            <path d={`M${x} 0V${l}`} className="oc-gilt-line" />
            <circle cx={x} cy={l * 0.45} r="3" className="oc-pearl" />
            <path
              d={`M${x - 6.5} ${l}H${x + 6.5}L${x + 4.5} ${l + 10}Q${x} ${l + 14} ${x - 4.5} ${l + 10}Z`}
              className="oc-gilt oc-gilt-edge"
            />
            <circle cx={x} cy={l + 20} r="8" className="oc-pearl" />
            <circle cx={x - 2.4} cy={l + 17.4} r="2.4" className="oc-shine" />
          </g>
        );
      })}
    </svg>
  );
}

/** A stepped plinth under the jharokha. */
function Plinth() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 18"
      preserveAspectRatio="none"
      className="oc-hang pointer-events-none relative z-[1] mx-auto -mt-1 block h-4 w-[92%]"
    >
      <path d="M0 0H300L288 9H12Z" className="oc-gilt" />
      <path d="M14 9H286L276 18H24Z" className="oc-deep" />
    </svg>
  );
}

/** Five Kutch tassels: a cord, a bead and a fan of threads. */
function Tassels() {
  const xs = [20, 85, 150, 215, 280];
  const lengths = [10, 22, 30, 22, 10];
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 80"
      className="oc-hang pointer-events-none relative z-[1] mx-auto -mt-1 block h-auto w-[90%] overflow-visible"
    >
      {xs.map((x, i) => {
        const l = lengths[i]!;
        return (
          <g key={x} className="oc-strand" style={{ "--i": i } as CSSProperties}>
            <path d={`M${x} 0V${l}`} className="oc-gilt-line" />
            <circle cx={x} cy={l + 4} r="5" className={i % 2 ? "oc-gilt" : "oc-jewel"} />
            <path
              d={`M${x - 4} ${l + 9}H${x + 4}L${x + 9} ${l + 38}H${x - 9}Z`}
              className={i % 2 ? "oc-jewel" : "oc-gilt"}
            />
            <path
              d={`M${x - 3} ${l + 14}L${x - 6} ${l + 37}M${x} ${l + 14}V${l + 38}M${x + 3} ${l + 14}L${x + 6} ${l + 37}`}
              className="oc-tassel-line"
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Temple bells on chains of different lengths; they ring as the card arrives. */
function Bells() {
  const xs = [30, 90, 150, 210, 270];
  const lengths = [12, 24, 32, 24, 12];
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 80"
      className="oc-hang pointer-events-none relative z-[1] mx-auto -mt-1 block h-auto w-[86%] overflow-visible"
    >
      {xs.map((x, i) => {
        const l = lengths[i]!;
        return (
          <g key={x} className="oc-bell" style={{ "--i": i } as CSSProperties}>
            <path d={`M${x} 0V${l}`} className="oc-chain" />
            <circle cx={x} cy={l + 2} r="2.6" className="oc-gilt" />
            <path
              d={`M${x - 11} ${l + 24}C${x - 11} ${l + 12} ${x - 7} ${l + 5} ${x} ${l + 5}C${x + 7} ${l + 5} ${x + 11} ${l + 12} ${x + 11} ${l + 24}Z`}
              className="oc-gilt oc-deep-edge"
            />
            <path d={`M${x - 12} ${l + 24}H${x + 12}`} className="oc-deep-line" />
            <circle cx={x} cy={l + 27} r="2.8" className="oc-deep" />
          </g>
        );
      })}
    </svg>
  );
}

const HANGINGS: Record<OrnateBox, ReactNode> = {
  moti: <PearlJhalar />,
  jharokha: <Plinth />,
  mandap: null,
  kamal: null,
  shisha: <Tassels />,
  mandir: <Bells />,
};
