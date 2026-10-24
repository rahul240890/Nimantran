"use client";

import { Image } from "@/components/ui/image";
import type { CSSProperties } from "react";
import "@/app/bloom-openings.css";
import { bloomBeyond, bloomRings, bloomSpec, type BloomOpening } from "@/lib/opening/catalog";

/*
 * A bloom opening (templates 71 to 85): the template's centre picture beyond, and one great
 * flower over it made from three painted pieces: the outer piece copied round in two rings,
 * the inner piece in a smaller ring inside them, and the heart in the middle. While closed
 * the flower moves in its template's own small way; opened, the heart goes first and the
 * rings open outward one after another, inner first, onto the centre picture. The movement
 * is in CSS (bloom-openings.css) and follows the stage's data-open; still mode only fades.
 */

export function BloomOpeningArt({
  opening,
  sample = false,
}: {
  opening: BloomOpening;
  sample?: boolean;
}) {
  const { wait, heart, open, airy } = bloomSpec(opening);
  const base = `/openings/bloom/${opening}`;
  const sizes = sample ? "12rem" : "(min-width: 40rem) 32rem, 100vw";
  // Already cut to size, so straight from the site's files rather than through the resizer;
  // each picture loads once however many times the ring repeats it
  const load = (first: boolean) =>
    sample
      ? ({ loading: "lazy", unoptimized: true } as const)
      : first
        ? ({ priority: true, unoptimized: true } as const)
        : ({ loading: "eager", unoptimized: true } as const);
  return (
    <div
      aria-hidden
      data-wait={wait}
      data-heart={heart}
      data-open-as={open}
      data-airy={airy || undefined}
      className="bloom absolute inset-0 overflow-hidden"
    >
      <div className="bloom-canvas absolute top-1/2 left-1/2">
        <div className="bloom-beyond absolute inset-0">
          <Image
            src={bloomBeyond(opening)}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            {...load(true)}
          />
        </div>
      </div>
      <div className="bloom-flower absolute inset-0">
        {bloomRings(opening).map((ring, r) => (
          <div
            key={r}
            className="bloom-ring absolute inset-0"
            style={{ "--order": ring.order } as CSSProperties}
          >
            {Array.from({ length: ring.count }, (_, i) => (
              <div
                key={i}
                className="bloom-piece"
                style={
                  {
                    "--a": `${((i + ring.offset) * 360) / ring.count}deg`,
                    "--len": ring.length,
                    "--k": i,
                  } as CSSProperties
                }
              >
                <div className="bloom-move">
                  <div className="bloom-sway">
                    <Image
                      src={`${base}/${ring.part}.webp`}
                      alt=""
                      fill
                      sizes={sizes}
                      className="object-contain"
                      {...load(r !== 1 && i === 0)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="bloom-heart">
          <Image
            src={`${base}/heart.webp`}
            alt=""
            fill
            sizes={sample ? "6rem" : "16rem"}
            className="object-contain"
            {...load(true)}
          />
        </div>
      </div>
      <span className="bloom-light absolute inset-0" />
    </div>
  );
}
