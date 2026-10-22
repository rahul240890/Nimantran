"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A filter chip's look, pressed or not; shared by the Designs page and the editor's designs. */
export const chipClass = (pressed: boolean) =>
  cn(
    "inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    pressed
      ? "border-transparent bg-ink text-paper"
      : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink",
  );

/** A row of choices, one pressed at a time, that scrolls sideways on a phone. */
export function ChipRow<T extends string>({
  label,
  allLabel,
  value,
  options,
  onChange,
  after,
}: {
  label: string;
  allLabel: string;
  value: T | null;
  options: readonly { id: T; label: string }[];
  onChange: (value: T | null) => void;
  /** A last control in the row, such as More occasions. */
  after?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">{label}</p>
      <div
        role="group"
        aria-label={label}
        className="relative -mx-4 scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <button
          type="button"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
          className={chipClass(value === null)}
        >
          {allLabel}
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(value === option.id ? null : option.id)}
            className={chipClass(value === option.id)}
          >
            {option.label}
          </button>
        ))}
        {after}
      </div>
    </div>
  );
}
