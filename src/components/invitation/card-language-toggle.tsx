"use client";

import { RadioGroup as RadioPrimitive } from "radix-ui";
import { languages } from "@/i18n/locales";
import type { CardLanguage } from "@/lib/templates/card-languages";
import { cn } from "@/lib/cn";

type CardLanguageToggleProps = {
  /** Names the choice for screen readers, such as "Card language". */
  label: string;
  languages: readonly CardLanguage[];
  value: CardLanguage;
  onValueChange: (language: CardLanguage) => void;
  className?: string;
};

export function languageName(code: CardLanguage): string {
  return languages.find((language) => language.code === code)?.native ?? code;
}

/** Switches a two-language card between its languages, each named in its own script. */
export function CardLanguageToggle({
  label,
  languages: options,
  value,
  onValueChange,
  className,
}: CardLanguageToggleProps) {
  return (
    <RadioPrimitive.Root
      aria-label={label}
      orientation="horizontal"
      value={value}
      onValueChange={(next) => {
        const language = options.find((option) => option === next);
        if (language) onValueChange(language);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface-2/90 p-1 shadow-raised backdrop-blur-sm",
        className,
      )}
    >
      {options.map((code) => (
        <RadioPrimitive.Item
          key={code}
          value={code}
          lang={code}
          className={cn(
            "min-h-11 min-w-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-ink-muted transition-[background-color,color,box-shadow] duration-200",
            "hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
            "data-[state=checked]:bg-surface data-[state=checked]:text-ink data-[state=checked]:shadow-raised data-[state=checked]:ring-1 data-[state=checked]:ring-line",
          )}
        >
          {languageName(code)}
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}
