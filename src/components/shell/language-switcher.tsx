"use client";

import { ChevronDown, Languages } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { availableLanguages, languages, shell } from "@/content/landing";
import { cn } from "@/lib/cn";

type LanguageSwitcherProps = {
  /** compact: icon and code, for the header. full: a wide row, for the phone menu. */
  variant?: "compact" | "full";
  className?: string;
};

/**
 * Lists every launch language in its own script. Only English works until translations
 * arrive in Step 12; the others show as coming soon rather than being hidden.
 */
export function LanguageSwitcher({ variant = "compact", className }: LanguageSwitcherProps) {
  const current = "en";
  const currentLanguage = languages.find((language) => language.code === current)!;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={shell.language.current}
        className={cn(
          buttonClasses({ variant: variant === "full" ? "secondary" : "ghost", size: "sm" }),
          variant === "full" ? "w-full justify-between" : "px-3",
          "data-[state=open]:bg-surface-2",
          className,
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Languages aria-hidden />
          {variant === "full" ? currentLanguage.native : current.toUpperCase()}
        </span>
        <ChevronDown aria-hidden className="text-ink-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>{shell.language.label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current}>
          {languages.map((language) => {
            const ready = availableLanguages.includes(language.code);
            return (
              <DropdownMenuRadioItem
                key={language.code}
                value={language.code}
                disabled={!ready}
                aside={ready ? undefined : shell.language.soon}
              >
                <span lang={language.code}>{language.native}</span>
                {language.code !== "en" ? (
                  <span className="ms-2 text-sm font-normal text-ink-muted">
                    {language.english}
                  </span>
                ) : null}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <p className="px-3 pt-1 pb-2 text-sm text-ink-muted">{shell.language.note}</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
