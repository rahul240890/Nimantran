"use client";

import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cardLanguages, draftFaith, type InviteDraft } from "@/lib/editor/draft";
import { cardSuggestions } from "@/lib/templates/card-suggestions";
import { FAITHS, faithChoosable, type Faith } from "@/lib/traditions/faith";
import type { StepProps } from "./types";

/** Lines whose suggestions change with the faith; one still as suggested follows it. */
const FOLLOWING = ["blessing", "families", "line"] as const;

/**
 * The family's faith, at the top of the card words: the blessings, lines and gate words
 * offered follow it, and a line still as it was suggested changes with it. Anything the
 * family wrote themselves stays (docs/TRADITIONS.md, 8).
 */
export function FaithPicker({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { faithCopy } = useText(editorText);
  if (!faithChoosable(draft.categoryId)) return null;
  const faith = draftFaith(draft);

  const choose = (next: Faith) =>
    update((current) => {
      const [language] = cardLanguages(current);
      const before = draftFaith(current);
      const content = { ...current.content };
      for (const slot of FOLLOWING) {
        const written = content[slot]?.trim();
        const suggested = cardSuggestions(current.categoryId, language, slot, before);
        if (written === undefined || written === "" || suggested.includes(written)) {
          delete content[slot];
        }
      }
      const tradition: InviteDraft["tradition"] = {
        ...current.tradition,
        faith: next,
        // The packs are Hindu: another faith leaves its pack, and its invocation, aside
        id: next === "hindu" || next === "none" ? current.tradition.id : null,
      };
      return { ...current, content, tradition };
    });

  return (
    <section
      aria-labelledby="faith-heading"
      data-page-target="cover"
      data-faith={faith}
      className="flex flex-col gap-4 border-b border-line pb-8"
    >
      <div className="flex flex-col gap-1">
        <h2 id="faith-heading" className="font-display text-xl">
          {faithCopy.heading}
        </h2>
        <p className="text-sm text-ink-muted">{faithCopy.intro}</p>
      </div>
      <RadioGroup
        label={faithCopy.label}
        value={faith}
        onValueChange={(value) => choose(value as Faith)}
        className="grid-cols-2 sm:grid-cols-3"
      >
        {FAITHS.map((id) => (
          <RadioItem key={id} value={id} label={faithCopy.names[id]} />
        ))}
      </RadioGroup>
    </section>
  );
}
