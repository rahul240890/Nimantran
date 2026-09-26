import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** A placeholder block that softly pulses. Hidden from screen readers; wrap a region in LoadingRegion. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-skeleton rounded-md bg-[color-mix(in_srgb,var(--line)_70%,var(--surface-2))] motion-still:animate-none",
        className,
      )}
      {...props}
    />
  );
}

type SkeletonTextProps = { lines?: number; className?: string };

/** Lines of text, the last one shorter, like a real paragraph. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

type LoadingRegionProps = ComponentProps<"div"> & {
  loading: boolean;
  /** Announced while loading, from translations, for example "Loading guests". */
  label: string;
};

/** Marks a region busy and tells screen readers what is loading. */
export function LoadingRegion({ loading, label, children, ...props }: LoadingRegionProps) {
  return (
    <div aria-busy={loading || undefined} {...props}>
      {loading ? (
        <span role="status" className="sr-only">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}
