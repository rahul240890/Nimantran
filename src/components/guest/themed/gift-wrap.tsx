"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A photo wrapped like a gift (owner, 2026-10-27, after a reel where guests unwrap the
 * couple's photos): the theme's cloth tied with a ribbon and a bow. A tap or Enter unties
 * it, the two halves of the paper part to the sides, and `onOpen` is called once they have
 * gone (at once when motion is off).
 */
export function GiftWrap({
  label,
  hint,
  onOpen,
  tabIndex,
  className,
}: {
  /** The button's name, such as "Unwrap photo 3". */
  label: string;
  /** The small words on the tag, such as "Tap to unwrap". */
  hint: string;
  onOpen: () => void;
  tabIndex?: number;
  className?: string;
}) {
  const [opening, setOpening] = useState(false);
  const still = useReducedMotion();
  return (
    <button
      type="button"
      aria-label={label}
      tabIndex={tabIndex}
      data-opening={opening || undefined}
      onClick={() => {
        // In still mode nothing parts: the photo is there at once
        if (still) onOpen();
        else setOpening(true);
      }}
      onAnimationEnd={(event) => {
        if (event.animationName === "guest-wrap-part-end") onOpen();
      }}
      className={cn(
        "guest-wrap absolute inset-0 z-10 block cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <span aria-hidden className="guest-wrap-half" data-half="start" />
      <span aria-hidden className="guest-wrap-half" data-half="end" />
      <span aria-hidden className="guest-wrap-ribbon" />
      <svg aria-hidden viewBox="0 0 64 40" className="guest-wrap-bow">
        <path d="M32 20C24 6 8 2 6 10s10 14 26 10Z" />
        <path d="M32 20C40 6 56 2 58 10s-10 14-26 10Z" />
        <path d="M30 21l-9 17 6-2 4 4 1-19ZM34 21l9 17-6-2-4 4-1-19Z" />
        <circle cx="32" cy="20" r="4.5" />
      </svg>
      <span aria-hidden className="guest-wrap-hint font-label">
        {hint}
      </span>
    </button>
  );
}
