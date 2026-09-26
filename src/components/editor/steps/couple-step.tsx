"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CharacterCount, Textarea } from "@/components/ui/textarea";
import { slotLabels } from "@/content/templates-review";
import { COUPLE_SLOTS, coupleValue } from "@/lib/editor/draft";
import { TEMPLATES } from "@/lib/templates/catalog";
import { slotsOf } from "@/lib/templates/content";
import { SLOT_RULES, type SlotId, type Template } from "@/lib/templates/schema";
import type { StepProps } from "./types";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy";

const NAME_SLOTS: readonly SlotId[] = ["first", "joiner", "second"];

function SlotField({
  id,
  template,
  value,
  error,
  onChange,
}: {
  id: SlotId;
  template: Template;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const { coupleCopy, editor } = useText(editorText);
  const hints: Partial<Record<SlotId, string>> = {
    joiner: coupleCopy.joinerHint,
    doorLeft: coupleCopy.doorsHint,
    doorRight: coupleCopy.doorsHint,
  };
  const rule = SLOT_RULES[id];
  const sample = template.slots.find((slot) => slot.id === id)?.sample;
  const Control = rule.kind === "long" ? Textarea : Input;
  return (
    <Field
      label={slotLabels[id]}
      required={rule.required}
      optionalLabel={editor.optional}
      hint={hints[id]}
      error={error ? editor.errors[error as keyof typeof editor.errors] : undefined}
      aside={
        rule.kind === "short" && rule.maxLength <= 14 ? undefined : (
          <CharacterCount
            value={value.length}
            max={rule.maxLength}
            label={editor.characters(value.length, rule.maxLength)}
          />
        )
      }
      className={id === "joiner" ? "sm:max-w-80" : undefined}
    >
      <Control
        value={value}
        maxLength={rule.maxLength}
        placeholder={rule.required && sample ? coupleCopy.example(sample) : undefined}
        autoComplete="off"
        spellCheck={rule.kind === "long"}
        onChange={(event) => onChange(event.target.value)}
        className={rule.kind === "name" ? "font-display text-xl" : undefined}
        data-slot={id}
      />
    </Field>
  );
}

export function CoupleStep({ draft, update, errors }: StepProps) {
  const { coupleCopy } = useText(editorText);
  const template = TEMPLATES[draft.templateId];
  const used = new Set(slotsOf(template));
  const names = NAME_SLOTS.filter((id) => used.has(id));
  const wording = COUPLE_SLOTS.filter((id) => used.has(id) && !NAME_SLOTS.includes(id));

  const set = (id: SlotId, value: string) =>
    update((current) => ({ ...current, content: { ...current.content, [id]: value } }));

  const field = (id: SlotId) => (
    <SlotField
      key={id}
      id={id}
      template={template}
      value={coupleValue(draft, template, id)}
      error={errors[id]}
      onChange={(value) => set(id, value)}
    />
  );

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="names-heading" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 id="names-heading" className="font-display text-xl">
            {coupleCopy.namesHeading}
          </h2>
          <p className="text-sm text-ink-muted">{coupleCopy.anyScript}</p>
        </div>
        <div className="flex flex-col gap-5">{names.map(field)}</div>
      </section>
      {wording.length > 0 && (
        <section
          aria-labelledby="wording-heading"
          className="flex flex-col gap-5 border-t border-line pt-6"
        >
          <h2 id="wording-heading" className="font-display text-xl">
            {coupleCopy.wordingHeading}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {wording.map((id) => (
              <div
                key={id}
                className={id === "doorLeft" || id === "doorRight" ? undefined : "sm:col-span-2"}
              >
                {field(id)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
