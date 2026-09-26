"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClasses, useField } from "./field";

type TextareaProps = ComponentProps<"textarea">;

/** Grows with its content (where the browser supports it) between 3 and 12 lines. */
export function Textarea({ className, id, disabled, required, rows = 3, ...props }: TextareaProps) {
  const field = useField();

  return (
    <textarea
      id={id ?? field?.id}
      rows={rows}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      aria-invalid={props["aria-invalid"] ?? (field?.invalid || undefined)}
      aria-describedby={props["aria-describedby"] ?? field?.describedBy}
      className={cn(
        controlClasses,
        "block [field-sizing:content] max-h-[18lh] min-h-[calc(3lh+1.5rem)] resize-y px-3.5 py-3 text-base leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

type CharacterCountProps = {
  value: number;
  max: number;
  /** Screen-reader text, from translations, for example "120 of 300 characters used". */
  label: string;
};

/** Pairs with Field's `aside`. Turns amber near the limit and red at it. */
export function CharacterCount({ value, max, label }: CharacterCountProps) {
  const ratio = value / max;
  return (
    <span
      className={cn(
        "text-sm tabular-nums",
        ratio >= 1 ? "font-semibold text-danger" : ratio >= 0.9 ? "text-warning" : "text-ink-muted",
      )}
    >
      <span aria-hidden>
        {value}/{max}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
