"use client";

import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { initials, tintIndex } from "@/lib/initials";

const sizes = {
  sm: "size-8 text-xs",
  md: "size-11 text-base",
  lg: "size-16 text-xl",
  xl: "size-24 text-3xl",
} as const;

/* Tints drawn from the brand tokens; text stays ink so contrast holds in both themes */
const tints = [
  "bg-marigold/25",
  "bg-rose/20",
  "bg-success/20",
  "bg-line-strong/60",
  "bg-accent-text/15",
] as const;

type AvatarProps = {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  /** A gold ring, for the hosts or the couple. */
  ring?: boolean;
  className?: string;
};

/** A photo, falling back to initials on a tint chosen from the name. */
export function Avatar({ name, src, size = "md", ring, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-surface align-middle",
        ring ? "ring-2 ring-marigold ring-offset-2 ring-offset-paper" : "ring-1 ring-line",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />
      ) : null}
      <AvatarPrimitive.Fallback
        delayMs={src ? 400 : 0}
        className={cn(
          "grid size-full place-items-center font-display leading-none text-ink",
          tints[tintIndex(name, tints.length)],
        )}
      >
        <span aria-hidden>{initials(name)}</span>
        <span className="sr-only">{name}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

type AvatarGroupProps = {
  children: ReactNode;
  /** How many more people are not shown, and how to say it, from translations. */
  more?: { count: number; label: string };
  className?: string;
};

/** Overlapping avatars with an optional "+12" counter. */
export function AvatarGroup({ children, more, className }: AvatarGroupProps) {
  return (
    <div
      className={cn(
        "flex items-center -space-x-3 rtl:space-x-reverse [&>*]:ring-2 [&>*]:ring-surface",
        className,
      )}
    >
      {children}
      {more && more.count > 0 ? (
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-sm font-semibold text-ink-muted">
          <span aria-hidden>+{more.count}</span>
          <span className="sr-only">{more.label}</span>
        </span>
      ) : null}
    </div>
  );
}
