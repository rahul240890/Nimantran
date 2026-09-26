import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Mandala } from "@/components/brand/mandala";

type EmptyStateProps = {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** One clear next step, usually a Button. */
  action?: ReactNode;
  /** "error" tints the medallion red; use it when something failed and can be retried. */
  tone?: "neutral" | "error";
  /** "polite" announces the message when it appears, for errors after an action. */
  live?: boolean;
  className?: string;
};

/** Shown instead of a blank area: when there is nothing yet, no results, or a load failed. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = "neutral",
  live,
  className,
}: EmptyStateProps) {
  return (
    <div
      role={live ? "status" : undefined}
      className={cn(
        "flex flex-col items-center gap-4 rounded-lg border border-dashed border-line-strong px-5 py-10 text-center sm:px-8 sm:py-14",
        className,
      )}
    >
      <div className="relative grid size-24 place-items-center">
        <Mandala
          className={cn(
            "absolute inset-0 size-full opacity-60",
            tone === "error" ? "text-danger/40" : "text-marigold/60",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "relative grid size-14 place-items-center rounded-full bg-surface shadow-float ring-1 ring-line [&_svg]:size-6",
            tone === "error" ? "text-danger" : "text-accent-text",
          )}
        >
          {icon}
        </span>
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="font-display text-xl leading-tight">{title}</h3>
        {description ? <p className="text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="mt-1 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
