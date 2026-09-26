"use client";

import { CircleAlert } from "lucide-react";
import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldContextValue = {
  id: string;
  labelId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

/** Wiring a control needs from its Field: id, aria-describedby, aria-invalid and required. */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

type FieldProps = {
  label: ReactNode;
  /** Short help shown under the control until there is an error. */
  hint?: ReactNode;
  /** When set, the control is marked invalid and this message is announced. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Visible text for optional fields, from translations. */
  optionalLabel?: string;
  /** Extra content on the label row, such as a character count. */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
};

/** Label, control, hint and error in one accessible unit. */
export function Field({
  label,
  hint,
  error,
  required = false,
  disabled = false,
  optionalLabel,
  aside,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider
      value={{
        id,
        labelId: `${id}-label`,
        describedBy,
        invalid: Boolean(error),
        required,
        disabled,
      }}
    >
      <div className={cn("flex min-w-0 flex-col gap-2", className)}>
        <div className="flex items-baseline justify-between gap-3">
          <label
            id={`${id}-label`}
            htmlFor={id}
            className={cn("font-semibold text-ink", disabled && "text-ink-muted")}
          >
            {label}
            {required ? (
              <span aria-hidden className="ms-0.5 text-danger">
                *
              </span>
            ) : optionalLabel ? (
              <span className="ms-2 text-sm font-normal text-ink-muted">{optionalLabel}</span>
            ) : null}
          </label>
          {aside}
        </div>
        {children}
        {error ? (
          <p id={errorId} className="flex items-start gap-1.5 text-sm font-medium text-danger">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-ink-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

/**
 * Shared look for text-like controls: a clear 3:1 border, a warm glow on focus,
 * a red border when invalid, and a flat fill when disabled.
 */
export const controlClasses =
  "w-full min-w-0 rounded-md border border-line-control bg-surface text-ink shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] " +
  "transition-[border-color,box-shadow,background-color] duration-150 " +
  "placeholder:text-ink-muted " +
  "hover:border-ink-muted " +
  "focus-visible:border-ring focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--marigold)_28%,transparent)] focus-visible:outline-none " +
  "aria-invalid:border-danger aria-invalid:focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--danger)_22%,transparent)] " +
  "disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-2 disabled:text-ink-muted disabled:shadow-none " +
  /* :read-only also matches buttons, so limit it to real text fields */
  "[&:is(input,textarea):read-only]:bg-surface-2";
