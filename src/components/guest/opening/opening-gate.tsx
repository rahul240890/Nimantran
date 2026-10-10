import Image from "next/image";
import type { CSSProperties } from "react";
import { PAINTED_GATES, type PaintedGate } from "@/lib/opening/catalog";

/*
 * A painted gate (the owner's paintings, in three layers): the place beyond, the two doors
 * hung in the arch's hole, and the arch in front. Closed, the beyond shows only dimly round
 * the arch and light glows through the seam. Opened, the doors move (swing, slide, gather or
 * lift), the beyond lights up and the arch grows past the edges, as if the guest walks in.
 * The movement is in CSS (globals.css, "Painted gates") and follows the stage's data-open.
 */

const MOTES = Array.from({ length: 10 }, (_, i) => i);

export function PaintedGateArt({ gate, sample = false }: { gate: PaintedGate; sample?: boolean }) {
  const { move, hole } = PAINTED_GATES[gate];
  const base = `/openings/gates/${gate}`;
  // A small editor tile needs small files; the guest's first screen loads at once
  const sizes = sample ? "12rem" : "(min-width: 40rem) 32rem, 100vw";
  const doorSizes = sample ? "6rem" : "(min-width: 40rem) 12rem, 40vw";
  const load = sample ? ({ loading: "lazy" } as const) : ({ priority: true } as const);
  return (
    <div aria-hidden data-move={move} className="gate absolute inset-0 overflow-hidden">
      <div className="gate-canvas absolute top-1/2 left-1/2">
        <div className="gate-around absolute inset-0">
          <Image
            src={`${base}/beyond.webp`}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            {...load}
          />
        </div>
        <div
          className="gate-hole absolute inset-0 [perspective:140cqw]"
          style={{ "--gate-hole": `url(${base}/hole.webp)` } as CSSProperties}
        >
          <div className="gate-inside absolute inset-0">
            <Image
              src={`${base}/beyond.webp`}
              alt=""
              fill
              sizes={sizes}
              className="object-cover"
              {...load}
            />
          </div>
          <div
            className="gate-doors absolute"
            style={{
              left: `${hole.left}%`,
              top: `${hole.top}%`,
              width: `${hole.width}%`,
              height: `${hole.height}%`,
            }}
          >
            {(["left", "right"] as const).map((side) => (
              <div key={side} className={`gate-door gate-door-${side} absolute inset-y-0 w-1/2`}>
                <Image
                  src={`${base}/door-${side}.webp`}
                  alt=""
                  fill
                  sizes={doorSizes}
                  className={
                    side === "left" ? "object-cover object-right" : "object-cover object-left"
                  }
                  {...load}
                />
                <span className="gate-door-shade absolute inset-0" />
              </div>
            ))}
            <span className="gate-seam absolute inset-y-0 left-1/2" />
          </div>
        </div>
        <div className="gate-arch absolute inset-0">
          <Image
            src={`${base}/arch.webp`}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            {...load}
          />
        </div>
      </div>
      {!sample && (
        <div className="absolute inset-0">
          {MOTES.map((i) => (
            <span
              key={i}
              className="gate-mote absolute rounded-full"
              style={
                {
                  left: `${38 + ((i * 29) % 26)}%`,
                  top: `${30 + ((i * 41) % 50)}%`,
                  "--i": i,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
