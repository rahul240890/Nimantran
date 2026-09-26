"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { ToggleGroup } from "radix-ui";
import { useSyncExternalStore } from "react";
import { buttonClasses } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import { applyTheme, isThemeChoice, readTheme } from "@/lib/theme";

type ThemeToggleProps = {
  /** From translations. */
  labels: { group: string; system: string; light: string; dark: string };
  className?: string;
};

const icons = { system: Monitor, light: Sun, dark: Moon } as const;

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const choices = ["system", "light", "dark"] as const;

/** The saved choice lives on <html>, set before paint; the server assumes "system". */
function useThemeChoice() {
  return useSyncExternalStore(subscribe, readTheme, () => "system" as const);
}

/** System, light or dark. The choice is remembered on this device. */
export function ThemeToggle({ labels, className }: ThemeToggleProps) {
  const choice = useThemeChoice();

  return (
    <ToggleGroup.Root
      type="single"
      value={choice}
      onValueChange={(value) => {
        if (!isThemeChoice(value)) return; // ignore deselecting the active item
        applyTheme(value);
      }}
      aria-label={labels.group}
      className={cn("inline-flex rounded-full border border-line bg-surface-2 p-1", className)}
    >
      {choices.map((value) => {
        const Icon = icons[value];
        return (
          <ToggleGroup.Item
            key={value}
            value={value}
            aria-label={labels[value]}
            title={labels[value]}
            className="grid size-11 cursor-pointer place-items-center rounded-full text-ink-muted transition-[background-color,color,box-shadow] duration-200 hover:text-ink data-[state=on]:bg-surface data-[state=on]:text-accent-text data-[state=on]:shadow-raised data-[state=on]:ring-1 data-[state=on]:ring-line"
          >
            <Icon aria-hidden className="size-5" />
          </ToggleGroup.Item>
        );
      })}
    </ToggleGroup.Root>
  );
}

/** The same choice behind one 44px button, for headers with little room. */
export function ThemeMenu({ labels, className }: ThemeToggleProps) {
  const choice = useThemeChoice();
  const Icon = icons[choice];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`${labels.group}: ${labels[choice]}`}
        className={cn(
          buttonClasses({ variant: "ghost", size: "sm" }),
          "size-11 shrink-0 px-0 data-[state=open]:bg-surface-2",
          className,
        )}
      >
        <Icon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{labels.group}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={choice}
          onValueChange={(value) => {
            if (isThemeChoice(value)) applyTheme(value);
          }}
        >
          {choices.map((value) => {
            const ItemIcon = icons[value];
            return (
              <DropdownMenuRadioItem key={value} value={value}>
                <span className="inline-flex items-center gap-2.5">
                  <ItemIcon aria-hidden className="size-4.5 text-ink-muted" />
                  {labels[value]}
                </span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
