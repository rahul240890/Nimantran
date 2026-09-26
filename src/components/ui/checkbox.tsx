"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CheckedState = boolean | "indeterminate";

type CheckboxProps = {
  label: ReactNode;
  description?: ReactNode;
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  value?: string;
  className?: string;
};

/** A 22px box inside a full-row 44px hit area. Supports a mixed (indeterminate) state. */
export function Checkbox({
  label,
  description,
  invalid,
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={cn("group/check flex min-h-11 items-start gap-3 py-2.5", className)}>
      <CheckboxPrimitive.Root
        id={id}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={descriptionId}
        className={cn(
          "peer relative mt-px grid size-[22px] shrink-0 cursor-pointer place-items-center rounded-[6px] border-2 border-line-control bg-surface text-on-marigold",
          "transition-[background-color,border-color,transform,box-shadow] duration-200 ease-spring",
          "before:absolute before:-inset-[11px] before:content-['']",
          "hover:border-ink-muted active:scale-90",
          "data-[state=checked]:border-marigold data-[state=checked]:bg-marigold data-[state=checked]:shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_1px_0_var(--marigold-edge)]",
          "data-[state=indeterminate]:border-marigold data-[state=indeterminate]:bg-marigold",
          "aria-invalid:border-danger",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator forceMount className="group/indicator contents">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
            className="size-4 group-data-[state=indeterminate]/indicator:hidden group-data-[state=unchecked]/indicator:hidden"
          >
            {/* The tick draws itself in; still mode shows it whole */}
            <path
              d="M3 8.5l3.2 3L13 4.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className="transition-[stroke-dashoffset] duration-300 ease-out-expo [stroke-dasharray:1] [stroke-dashoffset:1] group-data-[state=checked]/indicator:[stroke-dashoffset:0]"
            />
          </svg>
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="hidden size-4 group-data-[state=indeterminate]/indicator:block"
          >
            <path d="M4 8h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <div className="flex min-w-0 flex-col gap-0.5">
        <label
          htmlFor={id}
          className={cn("cursor-pointer text-ink", disabled && "cursor-not-allowed text-ink-muted")}
        >
          {label}
        </label>
        {description ? (
          <p id={descriptionId} className="text-sm text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
