"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { buttonClasses, type ButtonVariant } from "./button";
import { Spinner } from "./spinner";
import { Tooltip } from "./tooltip";

type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  /** Names the action for screen readers and shows as a tooltip. Required: icons alone are not labels. */
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  /** Turn off the tooltip when a visible label sits next to the button. */
  showTooltip?: boolean;
};

const squares = { sm: "size-11 px-0", md: "size-12 px-0", lg: "size-14 px-0" } as const;

export function IconButton({
  label,
  icon,
  variant = "secondary",
  size = "md",
  loading = false,
  showTooltip = true,
  className,
  type,
  onClick,
  ...props
}: IconButtonProps) {
  const button = (
    <button
      type={type ?? "button"}
      aria-label={label}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(event) => {
        if (loading) return event.preventDefault();
        onClick?.(event);
      }}
      className={buttonClasses({
        variant,
        size,
        className: cn(squares[size], size === "lg" && "[&_svg]:size-6", className),
      })}
      {...props}
    >
      {loading ? <Spinner /> : icon}
    </button>
  );

  return showTooltip ? <Tooltip content={label}>{button}</Tooltip> : button;
}
