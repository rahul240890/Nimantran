"use client";

import { TemplateCover } from "@/components/brand/template-cover";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { draftCategory, draftTradition } from "@/lib/editor/draft";
import { TEMPLATE_IDS, isTemplateId, type TemplateId } from "@/lib/templates/ids";
import type { StepProps } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

export function DesignStep({ draft, update }: StepProps) {
  const { designCopy, occasionCopy, stepCopy } = useText(editorText);
  const locale = useLocale();
  const category = draftCategory(draft);
  // The tradition's designs lead, then the occasion's
  const tradition = draftTradition(draft);
  const suggested: readonly TemplateId[] = [
    ...new Set([...(tradition?.templates ?? []), ...category.templates]),
  ];
  // The occasion's designs first, best first; every design stays available
  const order = [...suggested, ...TEMPLATE_IDS.filter((id) => !suggested.includes(id))];
  const allSuggested = order.length === suggested.length;

  return (
    <RadioGroup
      label={stepCopy.design.eyebrow}
      variant="card"
      value={draft.templateId}
      onValueChange={(value) => {
        if (isTemplateId(value)) update((current) => ({ ...current, templateId: value }));
      }}
      className="grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
    >
      {order.map((id) => {
        const isSuggested = !allSuggested && suggested.includes(id);
        return (
          <RadioItem
            key={id}
            value={id}
            label={
              <>
                {designCopy[id].name}
                {isSuggested && (
                  <span className="sr-only">
                    , {occasionCopy.suggestedFor(category.names[locale])}
                  </span>
                )}
              </>
            }
            description={designCopy[id].description}
            badge={
              isSuggested ? (
                <Badge aria-hidden tone="gold" className="h-6 px-2 text-xs">
                  {occasionCopy.suggestedBadge}
                </Badge>
              ) : undefined
            }
            icon={
              <span className="block w-16 sm:w-20">
                <TemplateCover id={id} className="rounded-sm shadow-raised" />
              </span>
            }
          />
        );
      })}
    </RadioGroup>
  );
}
