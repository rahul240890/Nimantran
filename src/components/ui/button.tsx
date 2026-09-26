"use client";

import { Slot } from "radix-ui";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/button relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md font-semibold whitespace-nowrap select-none " +
  "transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out-expo " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed " +
  "[&_svg]:size-5 [&_svg]:shrink-0";

/*
 * Primary and danger buttons sit on a thin edge and press down into it, like a raised key.
 * The edge disappears and the face moves 2px when pressed.
 */
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-marigold text-on-marigold " +
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.45),0_2px_0_var(--marigold-edge),0_6px_16px_-6px_color-mix(in_srgb,var(--marigold-edge)_70%,transparent)] " +
    "hover:bg-marigold-strong " +
    "active:translate-y-[2px] active:shadow-[inset_0_2px_4px_rgb(0_0_0/0.18),0_0_0_var(--marigold-edge)]",
  danger:
    "bg-danger text-on-danger " +
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_2px_0_color-mix(in_srgb,var(--danger)_60%,black),0_6px_16px_-8px_var(--danger)] " +
    "hover:bg-[color-mix(in_srgb,var(--danger)_88%,black)] " +
    "active:translate-y-[2px] active:shadow-[inset_0_2px_4px_rgb(0_0_0/0.25)]",
  secondary:
    "border border-line-strong bg-surface text-ink shadow-raised " +
    "hover:border-line-control hover:bg-surface-2 " +
    "active:translate-y-px active:shadow-[inset_0_2px_4px_rgb(0_0_0/0.08)]",
  ghost: "text-ink hover:bg-surface-2 active:translate-y-px active:bg-line/60",
};

/* Every size keeps a 44px minimum touch target */
const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm [&_svg]:size-4",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-7 text-lg",
};

/* Disabled buttons flatten: no edge, no press, lower contrast (exempt from contrast rules) */
const disabledLook =
  "disabled:translate-y-0 disabled:border-transparent disabled:bg-surface-2 disabled:text-ink-faint disabled:shadow-none " +
  "aria-disabled:translate-y-0";

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return cn(base, variants[variant], sizes[size], disabledLook, className);
}

/** A band of light that crosses raised buttons on hover. Hidden in still mode. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 -left-full -z-10 w-2/3 -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-out-expo group-hover/button:left-[130%] group-hover/button:opacity-100 group-disabled/button:hidden motion-still:hidden"
    />
  );
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the width, and ignores clicks while still focusable. */
  loading?: boolean;
  /** Render the child element (for example a link) with button styling. */
  asChild?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  asChild = false,
  leadingIcon,
  trailingIcon,
  fullWidth,
  className,
  children,
  onClick,
  type,
  ...props
}: ButtonProps) {
  const classes = buttonClasses({
    variant,
    size,
    className: cn(fullWidth && "w-full", className),
  });

  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const raised = variant === "primary" || variant === "danger";

  return (
    <button
      type={type ?? "button"}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...props}
    >
      {raised ? <Sheen /> : null}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {leadingIcon}
        {children}
        {trailingIcon}
      </span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      ) : null}
    </button>
  );
}
