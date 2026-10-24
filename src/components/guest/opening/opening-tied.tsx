import Image from "next/image";
import type { CSSProperties } from "react";
import "@/app/tied-gates.css";
import { tiedBeyond, tiedSpec, type TiedGate } from "@/lib/opening/catalog";

/*
 * A tied gate (the owner's paintings, templates 41 on): the template's centre picture
 * beyond, two closed doors filling the screen, and the tie on their seam. Closed, the tie
 * breathes and light glows down the seam; opened, the tie comes undone its own way (it
 * unties, lifts, flies off, cracks, drops, bursts, slips or spins away), its pieces burst out,
 * then the doors swing, slide or part onto the centre picture. The movement is in CSS
 * (tied-gates.css) and follows the stage's data-open; still mode shows the end of it.
 */

const PIECES = Array.from({ length: 12 }, (_, i) => i);

/** Where each piece flies, spread round the tie, the same on every visit. */
function flight(i: number): CSSProperties {
  const turn = (i / PIECES.length) * Math.PI * 2 + (i % 3) * 0.4;
  const reach = 26 + ((i * 37) % 22);
  return {
    "--dx": `${Math.cos(turn) * reach}cqw`,
    "--dy": `${Math.sin(turn) * reach * 1.4 + 12}cqw`,
    "--spin": `${((i * 73) % 300) - 150}deg`,
    "--i": i,
  } as CSSProperties;
}

export function TiedGateArt({ gate, sample = false }: { gate: TiedGate; sample?: boolean }) {
  const { move, undo, at, drawn, size, pieces } = tiedSpec(gate);
  const base = `/openings/tied/${gate}`;
  // A small editor tile needs small files; the guest's first screen loads at once
  const sizes = sample ? "12rem" : "(min-width: 40rem) 32rem, 100vw";
  const doorSizes = sample ? "6rem" : "(min-width: 40rem) 16rem, 50vw";
  // Already cut to size, so straight from the site's files rather than through the resizer
  const load = sample
    ? ({ loading: "lazy", unoptimized: true } as const)
    : ({ priority: true, unoptimized: true } as const);
  const tie = (side?: "left" | "right") => (
    <div
      key={side ?? "whole"}
      className={side ? `tied-tie tied-tie-${side} absolute inset-0` : "tied-tie absolute inset-0"}
    >
      <Image
        src={`${base}/tie.webp`}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
        {...load}
      />
    </div>
  );
  return (
    <div
      aria-hidden
      data-move={move}
      data-undo={undo}
      className="tied absolute inset-0 overflow-hidden"
      style={
        {
          "--tie-at": `${at}%`,
          "--tie-drawn": `${drawn}%`,
          "--tie-shift": `${at - drawn}%`,
          "--tie-size": size,
        } as CSSProperties
      }
    >
      <div className="tied-canvas absolute top-1/2 left-1/2">
        <div className="tied-beyond absolute inset-0">
          <Image
            src={tiedBeyond(gate)}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            {...load}
          />
        </div>
        <div className="tied-doors absolute inset-0 [perspective:140cqw]">
          {(["left", "right"] as const).map((side) => (
            <div key={side} className={`tied-door tied-door-${side} absolute inset-y-0 w-1/2`}>
              <Image
                src={`${base}/door-${side}.webp`}
                alt=""
                fill
                sizes={doorSizes}
                className="object-cover"
                {...load}
              />
              <span className="tied-door-shade absolute inset-0" />
            </div>
          ))}
          <span className="gate-seam absolute inset-y-0 left-1/2" />
        </div>
        {/* A seal cracks in two, each half leaving with its door */}
        {undo === "crack" ? [tie("left"), tie("right")] : tie()}
        {pieces && !sample && (
          <div className="absolute inset-0">
            {PIECES.map((i) => (
              <span
                key={i}
                className="tied-piece absolute"
                style={{ ...flight(i), backgroundImage: `url(${base}/piece-${i % 6}.webp)` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
