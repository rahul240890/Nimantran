"use client";

import { DesignPicker } from "@/components/editor/design-picker";
import { Switch } from "@/components/ui/switch";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { draftShowsScene, draftSuite } from "@/lib/publish/story";
import { SUITES, hasBlessingPage } from "@/lib/suites/catalog";
import type { StepProps } from "./types";

/**
 * The design step: the designs for the invite's occasion, with filters (design-picker.tsx),
 * and the two choices that belong to the design itself. How the invitation opens is chosen
 * with the music, so picking a design is one short screen.
 */
export function DesignStep({ draft, update }: StepProps) {
  const { suiteCopy } = useText(editorText);
  const suite = draftSuite(draft);
  return (
    <div className="flex flex-col gap-8">
      <DesignPicker draft={draft} update={update} />
      {SUITES[suite].art !== "card" && !draftShowsScene(draft) && (
        <Switch
          label={suiteCopy.textBox}
          description={suiteCopy.textBoxHint}
          checked={draft.textBox}
          onCheckedChange={(textBox) => update((current) => ({ ...current, textBox }))}
        />
      )}
      {hasBlessingPage(suite) && (
        <Switch
          label={suiteCopy.blessingPage}
          description={suiteCopy.blessingPageHint}
          checked={draft.blessingPage}
          onCheckedChange={(blessingPage) => update((current) => ({ ...current, blessingPage }))}
        />
      )}
    </div>
  );
}
