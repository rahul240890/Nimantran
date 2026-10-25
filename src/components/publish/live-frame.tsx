"use client";

import { Clapperboard } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The invitation video while it's being made: the frame just drawn, copied from the canvas
 * the video is made on each time the progress moves (owner, 2026-10-25: the host should
 * feel the video coming), with a recording light and the progress along its foot. With
 * reduced motion it stays on the poster underneath and only the bar moves.
 */
export function LiveFrame({
  frame,
  done,
  bare = false,
  className,
}: {
  /** The canvas the video is drawn on; its latest frame is shown. */
  frame?: HTMLCanvasElement;
  /** From 0 to 1. */
  done: number;
  /** Nothing under it (the corner card, not the poster): until a frame shows, an icon. */
  bare?: boolean;
  className?: string;
}) {
  const own = useRef<HTMLCanvasElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const canvas = own.current;
    const ctx = canvas?.getContext("2d");
    if (still || !canvas || !ctx || !frame || frame.width === 0) return;
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }, [frame, done, still]);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {!still && frame ? (
        <canvas ref={own} width={270} height={480} className="size-full" />
      ) : (
        bare && (
          <span className="grid size-full place-items-center text-marigold">
            <Clapperboard className="size-4" />
          </span>
        )
      )}
      <span className="absolute end-2 top-2 grid size-4 place-items-center rounded-full bg-night/65">
        <span className="size-2 rounded-full bg-danger motion-safe:animate-pulse" />
      </span>
      <span className="absolute inset-x-0 bottom-0 h-1 bg-night/40">
        <span
          className="block h-full bg-marigold transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${Math.round(done * 100)}%` }}
        />
      </span>
    </div>
  );
}
