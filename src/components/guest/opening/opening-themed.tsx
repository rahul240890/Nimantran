import Image from "next/image";
import type { CSSProperties } from "react";
import { THEMED_OPENINGS, type ThemedMove, type ThemedOpening } from "@/lib/opening/catalog";

/*
 * A themed opening (the owner's paintings, 2026-10-11): the theme's own opening painting
 * over the place it opens onto, which is the theme's scene. Each painting goes its own way
 * (opening/catalog.ts THEMED_OPENINGS): it is cut here into strips, bands, tiles or blocks
 * that fall, slide or swing away, or it is wiped, rolled, folded or washed off. The
 * movement is in CSS (globals.css, "Themed openings") and follows the stage's data-open.
 */

/** A part of the painting: its box in percent of the painting, and its place in the order. */
type Part = { x: number; y: number; w: number; h: number; i: number; col: number; row: number };

function grid(cols: number, rows: number): Part[] {
  return Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: (col / cols) * 100,
      y: (row / rows) * 100,
      w: 100 / cols,
      h: 100 / rows,
      i,
      col,
      row,
    };
  });
}

const WHOLE: Part[] = [{ x: 0, y: 0, w: 100, h: 100, i: 0, col: 0, row: 0 }];

/** How each move cuts the painting. */
function parts(move: ThemedMove): Part[] {
  switch (move) {
    case "threads":
      return grid(16, 1);
    case "deal":
      // Nine bands of equal height: the two boards and the seven leaves between them
      return grid(1, 9);
    case "rows":
      return grid(1, 6);
    case "puzzle":
      return grid(3, 5);
    case "tumble":
      return grid(6, 10);
    case "fold":
      return grid(2, 1);
    case "flip":
      // The same page five times over, each flipping up after the one before
      return Array.from({ length: 5 }, (_, i) => ({ ...WHOLE[0]!, i }));
    default:
      return WHOLE;
  }
}

/** Soft scattering, the same on every visit, so tiles and blocks don't all move alike. */
const jitter = (i: number) => ((i * 37) % 11) / 10 - 0.5;

export function ThemedOpeningArt({
  opening,
  sample = false,
}: {
  opening: ThemedOpening;
  sample?: boolean;
}) {
  const move = THEMED_OPENINGS[opening];
  const cover = `/openings/themed/${opening}.webp`;
  const sizes = sample ? "12rem" : "(min-width: 40rem) 32rem, 100vw";
  // Already cut to size, so straight from the site's files rather than through the resizer
  const load = sample
    ? ({ loading: "lazy", unoptimized: true } as const)
    : ({ priority: true, unoptimized: true } as const);
  const all = parts(move);
  const cols = Math.max(...all.map((part) => part.col)) + 1;
  const rows = Math.max(...all.map((part) => part.row)) + 1;
  return (
    <div aria-hidden data-move={move} className="themed absolute inset-0 overflow-hidden">
      <div className="themed-canvas absolute top-1/2 left-1/2">
        <div className="themed-beyond absolute inset-0">
          <Image
            src={`/suites/${opening}/scene.webp`}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            {...load}
          />
        </div>
        <div
          className="themed-cover absolute inset-0"
          style={{ "--cover": `url(${cover})` } as CSSProperties}
        >
          {move === "wheel" && <span className="themed-part themed-ground absolute inset-0" />}
          {all.map((part) => (
            <span
              key={part.i}
              className="themed-part absolute inset-0"
              style={
                {
                  clipPath:
                    all.length > 1 && move !== "flip"
                      ? `inset(${part.y}% ${100 - part.x - part.w}% ${100 - part.y - part.h}% ${part.x}%)`
                      : undefined,
                  transformOrigin:
                    move === "rows"
                      ? `${part.row % 2 ? 100 : 0}% ${part.y}%`
                      : `${part.x + part.w / 2}% ${part.y + part.h / 2}%`,
                  "--i": part.i,
                  "--col": part.col,
                  "--row": part.row,
                  // Its distance from the middle column, and from the bottom row
                  "--mid": Math.abs(part.col - (cols - 1) / 2),
                  "--up": rows - 1 - part.row,
                  "--side": part.row % 2 || part.col % 2 ? 1 : -1,
                  "--j": jitter(part.i),
                } as CSSProperties
              }
            />
          ))}
        </div>
        {move === "roll" && <span className="themed-roll absolute inset-x-0" />}
        {move === "wave" && <span className="themed-wave absolute inset-x-0" />}
      </div>
    </div>
  );
}
