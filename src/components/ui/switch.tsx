"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SwitchProps = {
  label: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
};

/** An on/off setting that applies immediately. Label on the start, switch on the end. */
export function Switch({ label, description, className, disabled, ...props }: SwitchProps) {
  const id = useId();
  return (
    <div className={cn("flex min-h-11 items-center justify-between gap-4 py-1.5", className)}>
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
      <SwitchPrimitive.Root
        id={id}
        disabled={disabled}
        aria-describedby={description ? `${id}-d` : undefined}
        className={cn(
          "group relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full border border-line-control bg-surface-2 p-[3px]",
          "shadow-[inset_0_2px_4px_rgb(0_0_0/0.1)] transition-colors duration-200",
          "before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-['']",
          "data-[state=checked]:border-marigold-edge data-[state=checked]:bg-marigold",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block size-6 rounded-full bg-surface shadow-[0_2px_4px_rgb(0_0_0/0.25)] ring-1 ring-line-control data-[state=checked]:ring-marigold-edge dark:bg-ink",
            "transition-[translate,width] duration-300 ease-spring",
            "data-[state=checked]:translate-x-5 rtl:data-[state=checked]:-translate-x-5",
            "group-active:w-7 group-active:data-[state=checked]:translate-x-4 rtl:group-active:data-[state=checked]:-translate-x-4",
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}
