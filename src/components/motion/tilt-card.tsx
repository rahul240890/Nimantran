"use client";

import { useRef, type ComponentProps, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type TiltCardProps = ComponentProps<"div"> & {
  /** Largest tilt in degrees. Keep it small: this is depth, not a spin. */
  maxTilt?: number;
  /** A soft light that follows the pointer across the surface. */
  glare?: boolean;
};

/**
 * Tilts toward a mouse or pen like a card held in the hand, with light catching the surface.
 * Touch screens and still mode get the flat card: scrolling must never tilt things.
 * Pointer moves write CSS variables directly, so React never re-renders during the motion.
 */
export function TiltCard({
  maxTilt = 7,
  glare = true,
  className,
  children,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const still = useReducedMotion();

  const reset = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.style.setProperty("--glare", "0");
  };

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (still || event.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width;
      const py = (clientY - rect.top) / rect.height;
      el.style.setProperty("--tilt-x", `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      el.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--glare", "1");
    });
  };

  return (
    <div className="[perspective:1100px]">
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          reset();
        }}
        style={style}
        className={cn(
          "relative will-change-transform [transform-style:preserve-3d]",
          "[transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))]",
          "transition-transform duration-500 ease-out-expo hover:duration-150",
          className,
        )}
        {...props}
      >
        {children}
        {glare ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light transition-opacity duration-300 motion-still:hidden"
            style={{
              opacity: "var(--glare, 0)",
              background:
                "radial-gradient(circle at var(--glare-x,50%) var(--glare-y,50%), rgb(255 255 255 / 0.55), transparent 55%)",
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
