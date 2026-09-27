"use client";

import { useMemo, type CSSProperties } from "react";
import type { ColourRef } from "@/lib/engine/motion";
import { patternStrokes, strokeLength, strokePath, type PatternId } from "@/lib/engine/patterns";
import { CARD_VARS } from "@/lib/templates/stock";
import type { StockRole } from "@/lib/templates/ids";

/** Seconds the whole pattern takes to draw itself. */
const DRAW = 2.6;

/** A colour reference as CSS: the card's stock variables, or a design token. */
function cssColour(ref: ColourRef, dark: boolean): string {
  if (ref.startsWith("stock:")) return `var(${CARD_VARS[ref.slice(6) as StockRole]})`;
  // Rice-paste white vanishes on a light page; draw it in the card's gold there
  if (ref === "motion-rice" && !dark) return `var(${CARD_VARS.gold})`;
  return `var(--${ref})`;
}

/**
 * The tradition's floor pattern (kolam, rangoli, alpona) behind the 2D card, drawn stroke
 * by stroke as the card opens, the way it is drawn by hand. Still mode shows it whole.
 */
export function FlatPattern({
  id,
  colours,
  open,
  still,
  dark,
}: {
  id: PatternId;
  colours: readonly [ColourRef, ColourRef];
  open: boolean;
  still: boolean;
  dark: boolean;
}) {
  const strokes = useMemo(() => {
    const all = patternStrokes(id);
    const lengths = all.map((s) => strokeLength(s.points));
    const total = lengths.reduce((sum, l) => sum + l, 0) || 1;
    const out = [];
    let before = 0;
    for (const [i, stroke] of all.entries()) {
      out.push({
        d: strokePath(stroke.points, stroke.closed),
        colour: stroke.colour,
        width: stroke.width,
        start: before / total,
        share: lengths[i]! / total,
      });
      before += lengths[i]!;
    }
    return out;
  }, [id]);
  const paint = [cssColour(colours[0], dark), cssColour(colours[1], dark)];

  return (
    <svg
      aria-hidden
      viewBox="-1.02 -1.02 2.04 2.04"
      className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(150%,48rem)] -translate-x-1/2 -translate-y-1/2"
      style={{
        opacity: open ? 0.6 : 0,
        transition: still ? "none" : `opacity ${open ? 0.8 : 0.4}s ease`,
      }}
    >
      {strokes.map((stroke, i) => (
        <path
          key={i}
          d={stroke.d}
          pathLength={1}
          fill="none"
          stroke={paint[stroke.colour]}
          strokeWidth={0.009 * stroke.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 1"
          style={
            {
              strokeDashoffset: open ? 0 : 1,
              transition:
                still || !open
                  ? "none"
                  : `stroke-dashoffset ${(DRAW * stroke.share).toFixed(3)}s linear ${(0.3 + DRAW * stroke.start).toFixed(3)}s`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
