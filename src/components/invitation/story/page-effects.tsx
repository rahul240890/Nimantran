import type { CSSProperties } from "react";
import type { PageArt } from "@/lib/suites/catalog";

/*
 * A light layer of movement over a painted page (Step 12g): petals on the haldi and
 * mehendi, twinkling lights on the sangeet and reception, fireworks over the baraat,
 * drifting lamp glows on the closing water. Plain CSS on a handful of spans, so it costs
 * no downloads on WhatsApp's browser. The player leaves it out in still mode.
 */

type Effect = "petals" | "twinkle" | "fireworks" | "lamps" | "dust";

const EFFECTS: Record<PageArt, Effect> = {
  // Petals fall before the god, as at a darshan
  blessing: "petals",
  cover: "petals",
  family: "dust",
  haldi: "petals",
  mehendi: "petals",
  sangeet: "twinkle",
  baraat: "fireworks",
  wedding: "petals",
  reception: "twinkle",
  reply: "lamps",
};

// Fixed scatter (x %, delay s, size) so the server and browser draw the same page
const SCATTER = [
  [8, 0, 1],
  [22, 2.6, 0.8],
  [35, 1.1, 1.2],
  [48, 3.4, 0.9],
  [61, 0.6, 1.1],
  [74, 2.1, 0.8],
  [86, 4.2, 1],
  [15, 5.1, 1.1],
  [55, 5.8, 0.9],
  [92, 1.7, 0.8],
] as const;

type Vars = CSSProperties & Record<`--${string}`, string>;

export function PageEffects({ art }: { art: PageArt }) {
  const effect = EFFECTS[art];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {effect === "petals" &&
        SCATTER.slice(0, 8).map(([x, delay, size], i) => (
          <span
            key={i}
            className="fx-petal"
            style={
              {
                left: `${x}%`,
                "--fx-delay": `${delay}s`,
                "--fx-size": `${size}`,
                "--fx-drift": `${i % 2 ? -1 : 1}`,
              } as Vars
            }
          />
        ))}
      {effect === "dust" &&
        SCATTER.map(([x, delay, size], i) => (
          <span
            key={i}
            className="fx-dust"
            style={{ left: `${x}%`, "--fx-delay": `${delay}s`, "--fx-size": `${size}` } as Vars}
          />
        ))}
      {effect === "twinkle" &&
        [...SCATTER, ...SCATTER].map(([x, delay, size], i) => (
          <span
            key={i}
            className="fx-twinkle"
            style={
              {
                left: `${(x + i * 7) % 96}%`,
                top: `${4 + ((i * 11) % 34)}%`,
                "--fx-delay": `${(delay * 0.7).toFixed(2)}s`,
                "--fx-size": `${size}`,
              } as Vars
            }
          />
        ))}
      {effect === "fireworks" &&
        [
          [24, 14, 0],
          [72, 9, 1.6],
          [50, 22, 3.1],
        ].map(([x, y, delay], burst) => (
          <span key={burst} className="absolute" style={{ left: `${x}%`, top: `${y}%` } as Vars}>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="fx-spark"
                style={{ "--fx-angle": `${i * 36}deg`, "--fx-delay": `${delay}s` } as Vars}
              />
            ))}
          </span>
        ))}
      {effect === "lamps" &&
        SCATTER.slice(0, 7).map(([x, delay, size], i) => (
          <span
            key={i}
            className="fx-lamp"
            style={
              {
                left: `${x}%`,
                top: `${72 + ((i * 7) % 20)}%`,
                "--fx-delay": `${delay}s`,
                "--fx-size": `${size}`,
              } as Vars
            }
          />
        ))}
    </div>
  );
}
