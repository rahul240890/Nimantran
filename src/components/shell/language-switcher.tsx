"use client";

import { ChevronDown, Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/actions/locale";
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
import { useLocale, useText } from "@/i18n/client";
import { landingText } from "@/i18n/copy";
import { isUiLocale, languages } from "@/i18n/locales";
import { switchLocalePath } from "@/lib/seo/paths";
import { cn } from "@/lib/cn";

type LanguageSwitcherProps = {
  /** compact: icon and code, for the header. full: a wide row, for the phone menu. */
  variant?: "compact" | "full";
  className?: string;
};

/**
 * Every launch language in its own script. English and Hindi switch the site; the rest
 * show as coming soon, with their scripts, so visitors know they're on the way.
 */
export function LanguageSwitcher({ variant = "compact", className }: LanguageSwitcherProps) {
  const current = useLocale();
  const { shell } = useText(landingText);
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();
  const currentLanguage = languages.find((language) => language.code === current)!;

  const choose = (code: string) => {
    if (!isUiLocale(code) || code === current) return;
    start(async () => {
      await setLocale(code);
      // Public pages carry their language in the address; everywhere else re-renders in place
      const path = switchLocalePath(pathname, code);
      if (path) router.push(`${path}${window.location.hash}`);
      else router.refresh();
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={shell.language.current(currentLanguage.native)}
        aria-busy={pending || undefined}
        className={cn(
          buttonClasses({ variant: variant === "full" ? "secondary" : "ghost", size: "sm" }),
          variant === "full" ? "w-full justify-between" : "px-3",
          "data-[state=open]:bg-surface-2",
          className,
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Languages aria-hidden />
          {variant === "full" ? (
            <span lang={current}>{currentLanguage.native}</span>
          ) : (
            <span lang={current}>{current === "hi" ? "हि" : current.toUpperCase()}</span>
          )}
        </span>
        <ChevronDown aria-hidden className="text-ink-muted" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>{shell.language.label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current} onValueChange={choose}>
          {languages.map((language) => {
            const ready = isUiLocale(language.code);
            return (
              <DropdownMenuRadioItem
                key={language.code}
                value={language.code}
                disabled={!ready}
                aside={ready ? undefined : shell.language.soon}
              >
                <span lang={language.code}>{language.native}</span>
                {language.code !== current ? (
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
