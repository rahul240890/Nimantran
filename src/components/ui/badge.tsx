import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "gold" | "success" | "warning" | "danger" | "rose";

const tones: Record<BadgeTone, string> = {
  neutral: "border-line-strong bg-surface-2 text-ink-muted",
  gold: "border-marigold/50 bg-marigold/15 text-accent-text",
  success: "border-success/35 bg-success/10 text-success",
  warning: "border-warning/35 bg-warning/10 text-warning",
  danger: "border-danger/35 bg-danger/10 text-danger",
  rose: "border-rose/35 bg-rose/10 text-rose",
};

const dots: Record<BadgeTone, string> = {
  neutral: "bg-ink-faint",
  gold: "bg-marigold",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  rose: "bg-rose",
};

type BadgeProps = ComponentProps<"span"> & {
  tone?: BadgeTone;
  /** A small status dot before the text. Never the only signal: the text says it too. */
  dot?: boolean;
};

/** A short status label, such as "Attending" or "Draft". Not interactive. */
export function Badge({ tone = "neutral", dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 max-w-full items-center gap-1.5 rounded-full border px-2.5 text-sm font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", dots[tone])} />
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}
