"use client";

import { Languages } from "lucide-react";
import { languageName } from "@/components/invitation/card-language-toggle";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cardLanguages, draftCopy, NAME_SLOTS } from "@/lib/editor/draft";
import type { SlotId } from "@/lib/templates/schema";
import { lineIdeas, shownOn, SlotField, useNames } from "./couple-step";
import { SecondLanguagePicker } from "./language-step";
import type { StepProps } from "./types";

/**
 * A second language guests can switch to, offered after the preview: pick the language,
 * then the card's lines in it, each left empty to repeat the first language's words. Kept
 * out of the details so they stay one language long.
 */
export function SecondLanguageSection({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { coupleCopy, languageCopy } = useText(editorText);
  const { template, one, names, wording } = useNames(draft);
  const [main, second] = cardLanguages(draft);
  const secondCopy = second ? draftCopy(draft, second) : null;
  const setTranslation = (id: SlotId, value: string) =>
    update((current) => ({
      ...current,
      translation: { ...current.translation, [id]: value },
    }));

  const field = (id: SlotId) => {
    if (!second || !secondCopy) return null;
    const value = draft.translation[id] ?? "";
    return (
      <div
        key={id}
        className={
          id === "doorLeft" || id === "doorRight"
            ? "flex flex-col gap-2.5"
            : "flex flex-col gap-2.5 sm:col-span-2"
        }
      >
        <SlotField
          id={id}
          template={template}
          value={value}
          onChange={(next) => setTranslation(id, next)}
          translation={{ language: second, placeholder: shownOn(secondCopy, id) }}
          label={id === "first" && one ? one.label : undefined}
        />
        {!NAME_SLOTS.includes(id) &&
          lineIdeas(
            draft,
            id,
            second,
            value,
            (next) => setTranslation(id, next),
            coupleCopy.slotNames[id],
          )}
      </div>
    );
  };

  return (
    <section
      aria-labelledby="second-language-heading"
      className="flex flex-col gap-4 rounded-xl border border-line bg-surface-2/60 p-4 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <Languages aria-hidden className="mt-1 size-5 shrink-0 text-accent-text" />
        <div className="flex flex-col gap-1">
          <h2 id="second-language-heading" className="font-display text-xl">
            {languageCopy.secondHeading}
          </h2>
          <p className="text-sm text-ink-muted">{languageCopy.secondHint}</p>
        </div>
      </div>
      <SecondLanguagePicker draft={draft} update={update} labelledBy="second-language-heading" />
      {second && (
        <div className="flex flex-col gap-5 border-t border-line pt-5">
          <p className="text-sm text-ink-muted">{coupleCopy.secondHint(languageName(main))}</p>
          <div className="grid gap-5 sm:grid-cols-2">{[...names, ...wording].map(field)}</div>
        </div>
      )}
    </section>
  );
}
