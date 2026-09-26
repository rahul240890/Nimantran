"use client";

import { RadioGroup as RadioPrimitive } from "radix-ui";
import { createContext, useContext, useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "list" | "card";
const VariantContext = createContext<Variant>("list");

type RadioGroupProps = {
  /** Names the group for screen readers; render a visible heading with the same text nearby. */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** "card" shows each choice as a raised tile, good for 2–4 big choices like RSVP. */
  variant?: Variant;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  invalid?: boolean;
  className?: string;
  children: ReactNode;
};

export function RadioGroup({
  label,
  variant = "list",
  orientation = "vertical",
  invalid,
  className,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <VariantContext.Provider value={variant}>
      <RadioPrimitive.Root
        aria-label={label}
        aria-invalid={invalid || undefined}
        orientation={orientation}
        className={cn(
          variant === "card"
            ? "grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]"
            : cn("flex", orientation === "vertical" ? "flex-col" : "flex-wrap gap-x-6"),
          className,
        )}
        {...props}
      >
        {children}
      </RadioPrimitive.Root>
    </VariantContext.Provider>
  );
}

type RadioItemProps = {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  /** Card variant only: an icon above the label. */
  icon?: ReactNode;
  /** Card variant only: a short tag beside the icon, such as a Badge. */
  badge?: ReactNode;
  disabled?: boolean;
};

function Dot() {
  return (
    <span
      aria-hidden
      className="grid size-[22px] shrink-0 place-items-center rounded-full border-2 border-line-control bg-surface transition-colors duration-200 group-hover/radio:border-ink-muted group-aria-invalid/group:border-danger group-data-[state=checked]/radio:border-marigold"
    >
      <span className="size-2.5 scale-0 rounded-full bg-marigold shadow-[0_1px_0_var(--marigold-edge)] transition-transform duration-300 ease-spring group-data-[state=checked]/radio:scale-100" />
    </span>
  );
}

export function RadioItem({ value, label, description, icon, badge, disabled }: RadioItemProps) {
  const variant = useContext(VariantContext);
  const id = useId();

  if (variant === "card") {
    return (
      <RadioPrimitive.Item
        value={value}
        disabled={disabled}
        aria-describedby={description ? `${id}-d` : undefined}
        className={cn(
          "group/radio relative flex min-h-11 cursor-pointer flex-col items-start gap-2 rounded-lg border border-line-strong bg-surface p-4 text-start shadow-raised",
          "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out-expo",
          "hover:-translate-y-0.5 hover:border-line-control hover:shadow-float motion-still:hover:translate-y-0",
          "active:translate-y-0 active:shadow-raised",
          "data-[state=checked]:border-marigold data-[state=checked]:bg-[color-mix(in_srgb,var(--marigold)_10%,var(--surface))] data-[state=checked]:shadow-[0_0_0_1px_var(--marigold),var(--elev-float)]",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
        )}
      >
        <span className="flex w-full items-center justify-between gap-3">
          {icon ? (
            <span
              aria-hidden
              className="text-ink-muted group-data-[state=checked]/radio:text-accent-text [&_svg]:size-6"
            >
              {icon}
            </span>
          ) : (
            <span />
          )}
          <span className="flex min-w-0 items-center gap-2">
            {badge}
            <Dot />
          </span>
        </span>
        <span className="font-semibold text-ink">{label}</span>
        {description ? (
          <span id={`${id}-d`} className="text-sm text-ink-muted">
            {description}
          </span>
        ) : null}
      </RadioPrimitive.Item>
    );
  }

  return (
    <div className="flex min-h-11 items-start gap-3 py-2.5">
      <RadioPrimitive.Item
        id={id}
        value={value}
        disabled={disabled}
        aria-describedby={description ? `${id}-d` : undefined}
        className="group/radio relative mt-px cursor-pointer rounded-full before:absolute before:-inset-[11px] before:content-[''] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Dot />
      </RadioPrimitive.Item>
      <div className="flex min-w-0 flex-col gap-0.5">
        <label
          htmlFor={id}
          className={cn("cursor-pointer text-ink", disabled && "cursor-not-allowed text-ink-muted")}
        >
          {label}
        </label>
        {description ? (
          <p id={`${id}-d`} className="text-sm text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
