"use client";

import { TemplateCover } from "@/components/brand/template-cover";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { stepCopy } from "@/content/editor";
import { TEMPLATES } from "@/lib/templates/catalog";
import { TEMPLATE_IDS, isTemplateId } from "@/lib/templates/schema";
import type { StepProps } from "./types";

export function DesignStep({ draft, update }: StepProps) {
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
      {TEMPLATE_IDS.map((id) => {
        const template = TEMPLATES[id];
        return (
          <RadioItem
            key={id}
            value={id}
            label={template.name}
            description={template.description}
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
