import { Fragment, useId, type CSSProperties, type ReactNode } from "react";
import "@/app/gate-words.css";
import type { GateScatter, GateWordLook } from "@/lib/opening/gate-words";
import type { CardLanguage } from "@/lib/templates/card-languages";

/*
 * Inside the gate as its doors open (owner, 2026-11-07): the occasion in a few words, in the
 * card's language, coming in one of seven ways, with flowers (or confetti, for a party)
 * round them. Only transforms and opacity move, a couple of dozen small pieces at most, so a
 * phone keeps up. The moves are in gate-words.css; like every opening move they start as the
 * stage opens and play at OPENING_PACE (opening-pace.ts). Not drawn in still mode.
 */

const FLOWER_COLOURS = [
  "var(--marigold)",
  "var(--rose)",
  "var(--petal-blush)",
  "var(--petal-jasmine)",
  "var(--marigold-strong)",
  "var(--open-petal-fall)",
];
const CONFETTI_COLOURS = [
  "var(--motion-kite-pink)",
  "var(--motion-kite-blue)",
  "var(--motion-kite-yellow)",
  "var(--motion-kite-green)",
  "var(--open-gilt-bright)",
  "var(--petal-blush)",
];
const QUIET_COLOURS = ["var(--petal-jasmine)", "var(--card-ivory)"];

/** How each look scatters its pieces: falling from the top, bursting from the words, or both. */
const PIECES: Record<GateWordLook, { fall: number; burst: number }> = {
  "petal-rain": { fall: 20, burst: 0 },
  toran: { fall: 10, burst: 0 },
  "phool-burst": { fall: 6, burst: 14 },
  rangoli: { fall: 12, burst: 0 },
  "gold-script": { fall: 14, burst: 0 },
  lotus: { fall: 10, burst: 6 },
  jharna: { fall: 22, burst: 0 },
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
/** A steady spread from 0 to 1 for piece i, the same on every visit and server render. */
const spread = (i: number, step: number) => (i * step) % 1;

type Piece = "bloom" | "marigold" | "petal" | "confetti" | "dot";

function pieceOf(i: number, scatter: GateScatter): Piece {
  if (scatter === "quiet") return "petal";
  if (scatter === "confetti") return i % 3 === 2 ? "dot" : "confetti";
  return (["marigold", "petal", "bloom", "petal"] as const)[i % 4]!;
}

function colourOf(i: number, scatter: GateScatter): string {
  const set =
    scatter === "confetti"
      ? CONFETTI_COLOURS
      : scatter === "quiet"
        ? QUIET_COLOURS
        : FLOWER_COLOURS;
  return set[(i * 5) % set.length]!;
}

function PieceShape({ kind, ids }: { kind: Piece; ids: { bloom: string; marigold: string } }) {
  if (kind === "bloom" || kind === "marigold") {
    return (
      <svg viewBox="-10 -10 20 20" className="block size-full">
        <use href={`#${kind === "bloom" ? ids.bloom : ids.marigold}`} />
      </svg>
    );
  }
  return <span className={`gw-${kind} block size-full`} />;
}

/** The two flowers every piece draws from, once. */
function FlowerDefs({ ids }: { ids: { bloom: string; marigold: string } }) {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <symbol id={ids.bloom} viewBox="-10 -10 20 20">
          <g fill="currentColor">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-4.6" rx="3.5" ry="5" transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r="2.3" style={{ fill: "var(--marigold-strong)" }} />
        </symbol>
        <symbol id={ids.marigold} viewBox="-10 -10 20 20">
          <g style={{ fill: "var(--marigold-strong)" }}>
            {range(14).map((i) => (
              <ellipse key={i} cx="0" cy="-5.4" rx="2" ry="4" transform={`rotate(${i * 25.7})`} />
            ))}
          </g>
          <g fill="currentColor">
            {range(10).map((i) => (
              <ellipse
                key={i}
                cx="0"
                cy="-3"
                rx="1.8"
                ry="3.2"
                transform={`rotate(${i * 36 + 18})`}
              />
            ))}
          </g>
        </symbol>
      </defs>
    </svg>
  );
}

/** Marigold strings dropping from the top, as on a toran over a doorway. */
function Toran() {
  return (
    <div className="gw-toran absolute inset-x-0 top-0">
      {range(9).map((i) => (
        <span
          key={i}
          className={`gw-strand absolute top-0 ${i % 2 ? "gw-strand-jasmine" : ""}`}
          style={
            {
              left: `${4 + i * 11.5}%`,
              height: `${16 + ((i * 7) % 4) * 5 + (i === 4 ? 6 : 0)}cqh`,
              "--d": `${Math.abs(4 - i) * 70}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** A rangoli ring drawing itself round the words, then turning slowly. */
function Rangoli() {
  const petals = range(16);
  return (
    <svg viewBox="-50 -50 100 100" className="gw-rangoli absolute">
      <circle className="gw-line" r="46" pathLength={1} />
      <circle className="gw-line gw-line-2" r="40" pathLength={1} />
      <g className="gw-rangoli-petals">
        {petals.map((i) => (
          <path
            key={i}
            d="M0 -48 C 3 -44 3 -41 0 -38 C -3 -41 -3 -44 0 -48 Z"
            transform={`rotate(${i * 22.5})`}
            style={{ fill: i % 2 ? "var(--rose)" : "var(--marigold)" }}
          />
        ))}
      </g>
      <circle className="gw-line gw-line-3" r="33" pathLength={1} />
    </svg>
  );
}

/** A lotus opening under the words, petal by petal. */
function Lotus() {
  const petals = [-64, -40, -18, 0, 18, 40, 64];
  return (
    <svg viewBox="-50 -42 100 46" className="gw-lotus">
      {petals.map((a, i) => (
        <g key={a} transform={`rotate(${a})`}>
          <path
            className="gw-lotus-petal"
            d="M0 0 C 9 -12 8 -28 0 -38 C -8 -28 -9 -12 0 0 Z"
            style={
              {
                "--d": `${Math.abs(3 - i) * 90}ms`,
                fill: Math.abs(a) > 30 ? "var(--rose)" : "var(--petal-blush)",
              } as CSSProperties
            }
          />
        </g>
      ))}
      <ellipse className="gw-lotus-base" cx="0" cy="1" rx="30" ry="3" />
    </svg>
  );
}

export function GateWords({
  words,
  lang,
  look,
  scatter,
  at,
  face,
  ink = false,
}: {
  words: string;
  lang: CardLanguage;
  look: GateWordLook;
  scatter: GateScatter;
  /** When the doors have opened enough to show the words, in CSS ms (before the pace). */
  at: number;
  /** The theme's lettering for names, as on the welcome. */
  face: CSSProperties;
  /** Over a light picture (a tied gate's pale centre) the words are ink on a soft paper glow. */
  ink?: boolean;
}): ReactNode {
  const id = useId().replace(/:/g, "");
  const ids = { bloom: `gw-bloom-${id}`, marigold: `gw-marigold-${id}` };
  const { fall, burst } = PIECES[look];
  const quiet = scatter === "quiet";
  const falls = quiet ? 8 : fall;
  const bursts = quiet ? 0 : burst;
  const parts = look === "gold-script" ? [words] : words.split(" ");

  return (
    <div
      aria-hidden
      data-look={look}
      data-scatter={scatter}
      data-ink={ink || undefined}
      className="gate-words pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{ "--gw-at": `${at}ms` } as CSSProperties}
    >
      <FlowerDefs ids={ids} />
      <span className="gw-veil absolute inset-0" />
      {look === "toran" && <Toran />}
      {look === "rangoli" && <Rangoli />}

      <div className="gw-centre absolute flex flex-col items-center text-center">
        <span className="gw-rule gw-rule-top" />
        <p
          lang={lang}
          data-long={words.length > 15 || undefined}
          className="gw-phrase"
          style={face}
        >
          {parts.map((part, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className="gw-word inline-block" style={{ "--w": i } as CSSProperties}>
                {part}
              </span>
            </Fragment>
          ))}
        </p>
        <span className="gw-rule" />
        {look === "lotus" && <Lotus />}
      </div>

      {range(falls).map((i) => {
        const kind = pieceOf(i, scatter);
        return (
          <span
            key={`f${i}`}
            className="gw-fall absolute"
            style={
              {
                left: `${spread(i, 0.618) * 96 + 2}%`,
                "--d": `${Math.round(spread(i, 0.382) * (look === "jharna" ? 1100 : 1500))}ms`,
                "--dur": `${1700 + Math.round(spread(i, 0.27) * 900) + (quiet ? 900 : 0)}ms`,
                "--drift": `${Math.round((spread(i, 0.73) - 0.5) * 24)}cqw`,
                "--size": `${(kind === "petal" ? 3.6 : kind === "dot" ? 2 : kind === "confetti" ? 3.4 : 5.4) + spread(i, 0.41) * 2.4}cqw`,
                "--sway": `${3 + (i % 3) * 2}cqw`,
                color: colourOf(i, scatter),
              } as CSSProperties
            }
          >
            <span className={`gw-sway block ${kind === "confetti" ? "gw-flip" : ""}`}>
              <PieceShape kind={kind} ids={ids} />
            </span>
          </span>
        );
      })}

      {range(bursts).map((i) => {
        const angle = (i / bursts) * Math.PI * 2 + 0.3;
        const kind = pieceOf(i + 1, scatter);
        return (
          <span
            key={`b${i}`}
            className="gw-burst absolute"
            style={
              {
                "--dx": `${Math.round(Math.cos(angle) * (26 + (i % 3) * 8))}cqw`,
                "--dy": `${Math.round(Math.sin(angle) * (16 + (i % 2) * 8) - 14)}cqh`,
                "--spin": `${(i % 2 ? 1 : -1) * (220 + i * 30)}deg`,
                "--d": `${(i % 4) * 60 + 250}ms`,
                "--size": `${5 + (i % 3) * 1.2}cqw`,
                color: colourOf(i + 2, scatter),
              } as CSSProperties
            }
          >
            <PieceShape kind={kind} ids={ids} />
          </span>
        );
      })}
    </div>
  );
}
