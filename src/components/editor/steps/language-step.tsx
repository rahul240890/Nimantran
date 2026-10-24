"use client";

import { useRouter } from "next/navigation";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useTransition } from "react";
import { setLocale } from "@/actions/locale";
import { languageName } from "@/components/invitation/card-language-toggle";
import { isUiLocale, languages as LOCALES } from "@/i18n/locales";
import { cardLanguages, traditionLanguage, type CardLanguage } from "@/lib/editor/draft";
import { CARD_LANGUAGES, isCardLanguage } from "@/lib/templates/card-languages";
import { cn } from "@/lib/cn";
import type { StepProps } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { Hint } from "@/components/ui/quiet";

/** The language's name in the site's own language ("Gujarati", "गुजराती"). */
function siteName(code: CardLanguage, locale: string): string {
  const entry = LOCALES.find((language) => language.code === code);
  if (!entry) return code;
  if (locale === "en") return entry.english;
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(code) ?? entry.english;
  } catch {
    return entry.english;
  }
}

/** One language as a pill: its own script, the chosen one gold. */
const pill = cn(
  "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm transition-[background-color,border-color,color,transform] duration-150 motion-safe:active:scale-95",
  "border-line-strong bg-surface text-ink-muted hover:border-line-control hover:text-ink",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "data-[state=checked]:border-marigold data-[state=checked]:bg-marigold/15 data-[state=checked]:font-semibold data-[state=checked]:text-accent-text",
);

/**
 * The card's language, at the top of the names: every sample, idea, function name and date
 * follows it, and so do the editor's own words (owner, 2026-10-23: a Gujarati card left
 * every label in English). The tradition's own language is marked.
 */
export function CardLanguagePicker({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { languageCopy } = useText(editorText);
  const locale = useLocale();
  const router = useRouter();
  const [, start] = useTransition();
  const [main] = cardLanguages(draft);
  const suggested = draft.tradition.id ? traditionLanguage(draft.tradition.id) : null;

  const setMain = (code: CardLanguage) => {
    update((current) => {
      const [, other] = cardLanguages(current);
      return { ...current, languages: other && other !== code ? [code, other] : [code] };
    });
    // The site turns to the card's language too, as the language menu would
    if (code !== locale && isUiLocale(code)) {
      start(async () => {
        if (await setLocale(code)) router.refresh();
      });
    }
  };

  return (
    <section aria-labelledby="card-language-heading" className="flex flex-col gap-2.5">
      <div className="flex flex-col gap-0.5">
        <h2 id="card-language-heading" className="font-label text-xs tracking-[0.2em] uppercase">
          {languageCopy.mainHeading}
        </h2>
        <Hint>{languageCopy.mainHint}</Hint>
      </div>
      <RadioPrimitive.Root
        aria-labelledby="card-language-heading"
        orientation="horizontal"
        value={main}
        onValueChange={(value) => isCardLanguage(value) && setMain(value)}
        className="flex flex-wrap gap-2"
      >
        {CARD_LANGUAGES.map((code) => (
          <RadioPrimitive.Item
            key={code}
            value={code}
            aria-label={`${languageName(code)}${code === "en" ? "" : `, ${siteName(code, locale)}`}${suggested === code ? `, ${languageCopy.traditionMatch}` : ""}`}
            className={pill}
          >
            <span lang={code}>{languageName(code)}</span>
            {suggested === code && (
              <span aria-hidden className="size-1.5 rounded-full bg-marigold" />
            )}
          </RadioPrimitive.Item>
        ))}
      </RadioPrimitive.Root>
    </section>
  );
}

/**
 * The second language guests can switch to, offered after the preview so the details stay
 * one language long. None by default.
 */
export function SecondLanguagePicker({
  draft,
  update,
  labelledBy,
}: Pick<StepProps, "draft" | "update"> & { labelledBy: string }) {
  const { languageCopy } = useText(editorText);
  const [main, second] = cardLanguages(draft);
  const setSecond = (value: string) =>
    update((current) => {
      const [first] = cardLanguages(current);
      return {
        ...current,
        languages: isCardLanguage(value) && value !== first ? [first, value] : [first],
      };
    });

  return (
    <RadioPrimitive.Root
      aria-labelledby={labelledBy}
      orientation="horizontal"
      value={second ?? "none"}
      onValueChange={setSecond}
      className="flex flex-wrap gap-2"
    >
      {(["none", ...CARD_LANGUAGES.filter((code) => code !== main)] as const).map((code) => (
        <RadioPrimitive.Item
          key={code}
          value={code}
          lang={code === "none" ? undefined : code}
          className={pill}
        >
          {code === "none" ? languageCopy.secondNone : languageName(code)}
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}
