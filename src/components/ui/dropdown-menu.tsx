"use client";

import { Check } from "lucide-react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

/** A list of actions or choices under a button. Arrow keys move, typing jumps, Escape closes. */
export function DropdownMenuContent({
  className,
  sideOffset = 8,
  align = "end",
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={12}
        className={cn(
          "z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-52 overflow-y-auto rounded-lg border border-line bg-surface p-1.5 text-ink shadow-overlay outline-none",
          "origin-(--radix-dropdown-menu-content-transform-origin) data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

const itemClasses =
  "relative flex min-h-11 cursor-pointer items-center gap-3 rounded-sm py-2 ps-10 pe-3 text-base outline-none select-none " +
  "data-highlighted:bg-surface-2 data-disabled:cursor-not-allowed data-disabled:text-ink-muted";

export function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Item>) {
  return <MenuPrimitive.Item className={cn(itemClasses, className)} {...props} />;
}

type RadioItemProps = ComponentProps<typeof MenuPrimitive.RadioItem> & {
  /** Short text at the end of the row, such as "Soon". */
  aside?: ReactNode;
};

export function DropdownMenuRadioItem({ className, children, aside, ...props }: RadioItemProps) {
  return (
    <MenuPrimitive.RadioItem
      className={cn(itemClasses, "data-[state=checked]:font-semibold", className)}
      {...props}
    >
      <MenuPrimitive.ItemIndicator className="absolute start-3 inline-flex text-accent-text">
        <Check className="size-4.5" strokeWidth={2.5} />
      </MenuPrimitive.ItemIndicator>
      <span className="min-w-0 flex-1">{children}</span>
      {aside ? <span className="shrink-0 text-sm font-normal text-ink-muted">{aside}</span> : null}
    </MenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      className={cn(
        "px-3 pt-2 pb-1.5 font-label text-xs tracking-[0.2em] text-ink-muted uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator className={cn("my-1.5 h-px bg-line", className)} {...props} />;
}
