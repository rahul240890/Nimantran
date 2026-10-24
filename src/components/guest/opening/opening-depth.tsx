"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import "@/app/depth-openings.css";
import { depthBeyond, depthSpec, type DepthOpening } from "@/lib/opening/catalog";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * A depth opening (templates 56 to 70): the template's centre picture beyond, and three
 * painted frames standing one behind another like a paper theatre, each with its opening
 * cut clear. While closed, the frames drift a little against each other, on their own and
 * with the pointer or the phone's tilt, so the depth shows; opened, the guest flies through
 * them, front first, onto the centre picture. The movement is in CSS (depth-openings.css)
 * and follows the stage's data-open; still mode shows the end of it.
 */

const FRAMES = ["back", "middle", "front"] as const;

/**
 * Writes where the pointer is, or how the phone leans, as --dx and --dy from -1 to 1 on the
 * opening, without re-rendering. Touch screens move only with the tilt: a finger scrolling
 * must never shift the frames. Phones that ask leave to read the tilt are left still.
 */
function useParallax(ref: React.RefObject<HTMLDivElement | null>, on: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !on) return;
    let frame = 0;
    const set = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--dx", Math.max(-1, Math.min(1, x)).toFixed(3));
        el.style.setProperty("--dy", Math.max(-1, Math.min(1, y)).toFixed(3));
      });
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
      );
    };
    const onTilt = (event: DeviceOrientationEvent) => {
      if (event.gamma == null || event.beta == null) return;
      // Held upright a phone leans back about 45 degrees; 20 degrees either way is the most
      set(event.gamma / 20, (event.beta - 45) / 20);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [ref, on]);
}

export function DepthOpeningArt({
  opening,
  sample = false,
}: {
  opening: DepthOpening;
  sample?: boolean;
}) {
  const { wait, pass } = depthSpec(opening);
  const base = `/openings/depth/${opening}`;
  const root = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  // The editor's small tiles keep still; the guest's opening follows the hand
  useParallax(root, !sample && !still);
  const sizes = sample ? "12rem" : "(min-width: 40rem) 32rem, 100vw";
  // Already cut to size, so straight from the site's files rather than through the resizer
  const load = sample
    ? ({ loading: "lazy", unoptimized: true } as const)
    : ({ priority: true, unoptimized: true } as const);
  return (
    <div
      ref={root}
      aria-hidden
      data-wait={wait}
      data-pass={pass}
      className="depth absolute inset-0 overflow-hidden"
    >
      <div className="depth-canvas absolute top-1/2 left-1/2">
        <div className="depth-beyond absolute inset-0">
          <Image
            src={depthBeyond(opening)}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            {...load}
          />
        </div>
        {FRAMES.map((frame, i) => (
          <div
            key={frame}
            className={`depth-frame depth-${frame} absolute inset-0`}
            style={{ "--i": FRAMES.length - 1 - i } as CSSProperties}
          >
            <div className="depth-sway absolute inset-0">
              <Image
                src={`${base}/${frame}.webp`}
                alt=""
                fill
                sizes={sizes}
                className="object-cover"
                {...load}
              />
              <span className="depth-gleam absolute inset-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
