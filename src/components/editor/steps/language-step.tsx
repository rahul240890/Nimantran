"use client";

import { Check } from "lucide-react";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { languageName } from "@/components/invitation/card-language-toggle";
import { Badge } from "@/components/ui/badge";
import { languages as LOCALES } from "@/i18n/locales";
import {
  cardLanguages,
  draftCopy,
  draftPeople,
  traditionLanguage,
  type CardLanguage,
} from "@/lib/editor/draft";
import { CARD_LANGUAGES, isCardLanguage } from "@/lib/templates/card-languages";
import { cn } from "@/lib/cn";
import type { StepProps } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

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

const tile = cn(
  "group relative flex min-h-11 cursor-pointer flex-col items-start gap-1 rounded-lg border-2 bg-surface p-4 text-start shadow-raised",
  "transition-[border-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
  "border-line hover:border-line-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  "data-[state=checked]:border-marigold data-[state=checked]:shadow-float",
);

/**
 * The card's language, asked before a word is written (the step after the design): every
 * sample, suggestion, function name and date then follows it. A second language is an
 * option for guests to switch to.
 */
export function LanguageStep({ draft, update }: StepProps) {
  const { languageCopy } = useText(editorText);
  const locale = useLocale();
  const [main, second] = cardLanguages(draft);
  const suggested = draft.tradition.id ? traditionLanguage(draft.tradition.id) : null;
  const one = draftPeople(draft) === "one";

  // How the names read in each language: the host's own once typed, else that language's sample
  const sample = (code: CardLanguage) => {
    const copy = draftCopy({ ...draft, languages: [code] }, code);
    return one || !copy.second ? copy.first : `${copy.first} ${copy.joiner} ${copy.second}`;
  };

  const setMain = (code: CardLanguage) =>
    update((current) => {
      const [, other] = cardLanguages(current);
      return { ...current, languages: other && other !== code ? [code, other] : [code] };
    });
  const setSecond = (value: string) =>
    update((current) => {
      const [first] = cardLanguages(current);
      return {
        ...current,
        languages: isCardLanguage(value) && value !== first ? [first, value] : [first],
      };
    });

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="card-language-heading" className="flex flex-col gap-3">
        <h2 id="card-language-heading" className="sr-only">
          {languageCopy.mainHeading}
        </h2>
        <RadioPrimitive.Root
          aria-labelledby="card-language-heading"
          value={main}
          onValueChange={(value) => isCardLanguage(value) && setMain(value)}
          className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-3"
        >
          {CARD_LANGUAGES.map((code) => (
            <RadioPrimitive.Item key={code} value={code} className={tile}>
              <span className="flex w-full items-start justify-between gap-2">
                <span lang={code} className="font-display text-2xl leading-tight text-ink">
                  {languageName(code)}
                </span>
                <span
                  aria-hidden
                  className="grid size-6 shrink-0 place-items-center rounded-full border border-line-strong text-transparent transition-colors duration-200 group-data-[state=checked]:border-marigold group-data-[state=checked]:bg-marigold group-data-[state=checked]:text-on-marigold"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-2 font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
                {siteName(code, locale)}
                {suggested === code && <Badge tone="gold">{languageCopy.traditionMatch}</Badge>}
              </span>
              <span
                lang={code}
                className="mt-1 line-clamp-2 w-full border-t border-line pt-2 font-display text-lg text-accent-text"
              >
                {sample(code)}
              </span>
            </RadioPrimitive.Item>
          ))}
        </RadioPrimitive.Root>
      </section>

      <section
        aria-labelledby="second-language-heading"
        className="flex flex-col gap-3 border-t border-line pt-6"
      >
        <div className="flex flex-col gap-1">
          <h2 id="second-language-heading" className="font-display text-xl">
            {languageCopy.secondHeading}
          </h2>
          <p className="text-sm text-ink-muted">{languageCopy.secondHint}</p>
        </div>
        <RadioPrimitive.Root
          aria-labelledby="second-language-heading"
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
              className={cn(
                "min-h-11 cursor-pointer rounded-full border px-4 text-sm transition-[background-color,border-color,color,transform] duration-150 motion-safe:active:scale-95",
                "border-line-strong bg-surface text-ink-muted hover:border-line-control hover:text-ink",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                "data-[state=checked]:border-marigold data-[state=checked]:bg-marigold/15 data-[state=checked]:font-semibold data-[state=checked]:text-accent-text",
              )}
            >
              {code === "none" ? languageCopy.secondNone : languageName(code)}
            </RadioPrimitive.Item>
          ))}
        </RadioPrimitive.Root>
      </section>
    </div>
  );
}
