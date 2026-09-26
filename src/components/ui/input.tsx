"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { controlClasses, useField } from "./field";

type InputProps = ComponentProps<"input"> & {
  /** An icon or short text inside the start of the field. Decorative only. */
  leading?: ReactNode;
  /** An icon, unit or small button inside the end of the field. */
  trailing?: ReactNode;
};

export function Input({
  leading,
  trailing,
  className,
  id,
  disabled,
  required,
  ...props
}: InputProps) {
  const field = useField();

  const input = (
    <input
      id={id ?? field?.id}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      aria-invalid={props["aria-invalid"] ?? (field?.invalid || undefined)}
      aria-describedby={props["aria-describedby"] ?? field?.describedBy}
      className={cn(
        controlClasses,
        "h-12 px-3.5 text-base",
        leading != null && "ps-11",
        trailing != null && "pe-12",
        className,
      )}
      {...props}
    />
  );

  if (leading == null && trailing == null) return input;

  return (
    <div className="relative min-w-0">
      {input}
      {leading != null ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 flex w-11 items-center justify-center text-ink-muted [&_svg]:size-5"
        >
          {leading}
        </span>
      ) : null}
      {trailing != null ? (
        <span className="absolute inset-y-0 end-0 flex min-w-12 items-center justify-center pe-1 text-ink-muted [&_svg]:size-5">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
