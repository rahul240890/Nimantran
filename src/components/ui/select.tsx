"use client";

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { controlClasses, useField } from "./field";

export type SelectOption = {
  value: string;
  label: ReactNode;
  /** Plain text for typeahead when the label is not a string. */
  textValue?: string;
  disabled?: boolean;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  /** Shown inside the start of the trigger, like an icon. */
  leading?: ReactNode;
  className?: string;
  /** Extra classes for the list, for example a max height. */
  contentClassName?: string;
  /** Needed when there is no surrounding Field. */
  "aria-label"?: string;
  /**
   * With nothing chosen yet, the option the list opens at, so a long list (times of
   * day) doesn't start at its very top.
   */
  openAt?: string;
};

/** A styled, accessible single choice list with typeahead and full keyboard use. */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  required,
  name,
  id,
  leading,
  className,
  contentClassName,
  "aria-label": ariaLabel,
  openAt,
}: SelectProps) {
  const field = useField();
  const [open, setOpen] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const empty = !(value ?? defaultValue);

  useEffect(() => {
    if (!open || !openAt || !empty) return;
    // The list mounts and settles over a few frames (Radix scrolls it to the top as it
    // positions), so keep placing it until it has settled
    let frames = 0;
    let frame = requestAnimationFrame(function place() {
      const list = viewport.current;
      const item = list?.querySelector<HTMLElement>(`[data-value="${CSS.escape(openAt)}"]`);
      if (list && item) list.scrollTop = item.offsetTop;
      if (++frames < 8) frame = requestAnimationFrame(place);
    });
    return () => cancelAnimationFrame(frame);
  }, [open, openAt, empty]);

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onOpenChange={setOpen}
      disabled={disabled ?? field?.disabled}
      required={required ?? field?.required}
      name={name}
    >
      <SelectPrimitive.Trigger
        id={id ?? field?.id}
        aria-label={ariaLabel}
        aria-invalid={field?.invalid || undefined}
        aria-describedby={field?.describedBy}
        className={cn(
          controlClasses,
          "group flex h-12 cursor-pointer items-center gap-2.5 px-3.5 text-start text-base",
          "data-placeholder:text-ink-muted data-[state=open]:border-ring",
          className,
        )}
      >
        {leading ? (
          <span aria-hidden className="text-ink-muted [&_svg]:size-5">
            {leading}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-5 shrink-0 text-ink-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          collisionPadding={12}
          className={cn(
            "relative z-50 max-h-[min(var(--radix-select-content-available-height),22rem)] w-(--radix-select-trigger-width) min-w-44 overflow-hidden rounded-lg border border-line bg-surface text-ink shadow-overlay",
            "data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
            contentClassName,
          )}
        >
          <SelectPrimitive.ScrollUpButton className="flex h-8 items-center justify-center text-ink-muted">
            <ChevronUp className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport ref={viewport} className="p-1.5">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                data-value={option.value}
                textValue={option.textValue}
                disabled={option.disabled}
                className={cn(
                  "relative flex min-h-11 cursor-pointer items-center rounded-sm py-2 ps-10 pe-3 text-base outline-none select-none",
                  "data-highlighted:bg-surface-2 data-[state=checked]:font-semibold",
                  "data-disabled:cursor-not-allowed data-disabled:text-ink-faint",
                )}
              >
                <SelectPrimitive.ItemIndicator className="absolute start-3 inline-flex text-accent-text">
                  <Check className="size-4.5" strokeWidth={2.5} />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex h-8 items-center justify-center text-ink-muted">
            <ChevronDown className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
