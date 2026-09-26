import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type StepperStep = { id: string; label: string };

type StepperProps = {
  steps: StepperStep[];
  /** Index of the step in progress. Earlier steps show as done. */
  current: number;
  /** Names the list for screen readers, from translations, for example "Invite progress". */
  label: string;
  /** "Step 2 of 5", from translations. Shown on phones where the labels do not fit. */
  progressText: string;
  /** Screen-reader suffix for finished steps, from translations, for example "done". */
  doneLabel: string;
  className?: string;
};

/**
 * Where the host is in a multi-step flow.
 * Desktop shows every step; phones show the current step with a gold progress bar.
 */
export function Stepper({
  steps,
  current,
  label,
  progressText,
  doneLabel,
  className,
}: StepperProps) {
  const active = steps[current];
  const percent = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100;

  return (
    <nav aria-label={label} className={cn("w-full", className)}>
      {/* Phones */}
      <div className="flex flex-col gap-2.5 md:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-semibold text-ink">{active?.label}</span>
          <span className="shrink-0 font-label text-xs tracking-[0.14em] text-ink-muted uppercase">
            {progressText}
          </span>
        </div>
        <div
          aria-hidden
          className="h-1.5 overflow-hidden rounded-full bg-surface-2 ring-1 ring-line"
        >
          <div
            className="h-full rounded-full bg-marigold transition-[width] duration-500 ease-out-expo"
            style={{ width: `${Math.max(percent, 6)}%` }}
          />
        </div>
      </div>

      {/* Tablets and up */}
      <ol className="hidden items-start md:flex">
        {steps.map((step, index) => {
          const done = index < current;
          const isCurrent = index === current;
          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center gap-2.5 text-center"
            >
              <div className="flex w-full items-center">
                <span
                  aria-hidden
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    index === 0
                      ? "invisible"
                      : done || isCurrent
                        ? "bg-marigold"
                        : "bg-line-strong",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "mx-2 grid size-9 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold transition-[background-color,border-color,box-shadow] duration-300",
                    done &&
                      "border-marigold bg-marigold text-on-marigold shadow-[0_2px_0_var(--marigold-edge)]",
                    isCurrent &&
                      "border-marigold bg-surface text-accent-text shadow-[0_0_0_5px_color-mix(in_srgb,var(--marigold)_20%,transparent)]",
                    !done && !isCurrent && "border-line-control bg-surface text-ink-muted",
                  )}
                >
                  {done ? <Check className="size-4.5" strokeWidth={3} /> : index + 1}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    index === steps.length - 1
                      ? "invisible"
                      : done
                        ? "bg-marigold"
                        : "bg-line-strong",
                  )}
                />
              </div>
              <span
                className={cn(
                  "px-1 text-sm",
                  isCurrent ? "font-semibold text-ink" : done ? "text-ink" : "text-ink-muted",
                )}
              >
                {step.label}
                {done ? <span className="sr-only">, {doneLabel}</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
