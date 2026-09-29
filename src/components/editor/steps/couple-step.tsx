"use client";

import { languageName } from "@/components/invitation/card-language-toggle";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { CharacterCount, Textarea } from "@/components/ui/textarea";
import type { ReactNode } from "react";
import { slotLabels } from "@/content/templates-review";
import {
  cardLanguages,
  COUPLE_SLOTS,
  draftPeople,
  coupleValue,
  draftCopy,
  languageOptions,
  type CardLanguage,
} from "@/lib/editor/draft";
import type { CardCopy } from "@/lib/templates/content";
import { TEMPLATES } from "@/lib/templates/catalog";
import { CARD_SAMPLES } from "@/lib/templates/story-words";
import { slotsOf } from "@/lib/templates/content";
import { SLOT_RULES, type SlotId, type Template } from "@/lib/templates/schema";
import type { StepProps } from "./types";
import { Lettering } from "../lettering";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

const NAME_SLOTS: readonly SlotId[] = ["first", "joiner", "second"];

/** What a slot shows on a card, for the second language's placeholders. */
function shownOn(copy: CardCopy, id: SlotId): string {
  if (id === "doorLeft") return copy.doors[0];
  if (id === "doorRight") return copy.doors[1];
  if (id === "date" || id === "venue") return "";
  return copy[id];
}

function SlotField({
  id,
  template,
  value,
  error,
  onChange,
  translation,
  label,
  example,
  hint,
}: {
  id: SlotId;
  template: Template;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  /** The occasion's own name for the slot (a birthday name), with its example and hint. */
  label?: string;
  example?: string;
  hint?: string;
  /** A field for the second language: optional, showing what repeats when left empty. */
  translation?: { language: CardLanguage; placeholder: string };
}) {
  const { coupleCopy, editor } = useText(editorText);
  const hints: Partial<Record<SlotId, string>> = {
    joiner: coupleCopy.joinerHint,
    doorLeft: coupleCopy.doorsHint,
    doorRight: coupleCopy.doorsHint,
  };
  const rule = SLOT_RULES[id];
  const sample = example ?? template.slots.find((slot) => slot.id === id)?.sample;
  const Control = rule.kind === "long" ? Textarea : Input;
  return (
    <Field
      label={label ?? slotLabels[id]}
      required={rule.required && !translation}
      optionalLabel={editor.optional}
      hint={translation ? undefined : (hint ?? hints[id])}
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
        placeholder={
          translation
            ? translation.placeholder || undefined
            : rule.required && sample
              ? coupleCopy.example(sample)
              : undefined
        }
        lang={translation?.language}
        autoComplete="off"
        spellCheck={rule.kind === "long"}
        onChange={(event) => onChange(event.target.value)}
        className={rule.kind === "name" ? "font-display text-xl" : undefined}
        data-slot={translation ? undefined : id}
        data-translation={translation ? id : undefined}
      />
    </Field>
  );
}

function LanguageChoice({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { coupleCopy } = useText(editorText);
  const [own, other] = languageOptions(draft);
  const choices: CardLanguage[][] = [[own], [other], [own, other]];
  const label = (choice: CardLanguage[]) =>
    choice.length === 2
      ? coupleCopy.bothLanguages(languageName(choice[0]!), languageName(choice[1]!))
      : languageName(choice[0]!);
  return (
    <section aria-labelledby="languages-heading" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 id="languages-heading" className="font-display text-xl">
          {coupleCopy.languagesHeading}
        </h2>
        <p className="text-sm text-ink-muted">{coupleCopy.languagesHint}</p>
      </div>
      <RadioGroup
        label={coupleCopy.languagesHeading}
        orientation="horizontal"
        value={cardLanguages(draft).join("+")}
        onValueChange={(value) =>
          update((current) => ({
            ...current,
            languages: choices.find((choice) => choice.join("+") === value) ?? ["en"],
          }))
        }
      >
        {choices.map((choice) => (
          <RadioItem key={choice.join("+")} value={choice.join("+")} label={label(choice)} />
        ))}
      </RadioGroup>
    </section>
  );
}

export function CoupleStep({ draft, update, errors }: StepProps) {
  const { coupleCopy, namesCopy } = useText(editorText);
  const template = TEMPLATES[draft.templateId];
  const used = new Set(slotsOf(template));
  // A birthday or a party is led by one name: no second name and nothing to join them
  const one =
    draftPeople(draft) === "one"
      ? (namesCopy.one[draft.categoryId as keyof typeof namesCopy.one] ?? null)
      : null;
  const names = (one ? ["first" as const] : NAME_SLOTS).filter((id) => used.has(id));
  const wording = COUPLE_SLOTS.filter((id) => used.has(id) && !NAME_SLOTS.includes(id));

  const set = (id: SlotId, value: string) =>
    update((current) => ({ ...current, content: { ...current.content, [id]: value } }));

  const [main, second] = cardLanguages(draft);
  const secondCopy = second ? draftCopy(draft, second) : null;
  const setTranslation = (id: SlotId, value: string) =>
    update((current) => ({
      ...current,
      translation: { ...current.translation, [id]: value },
    }));

  // A card in an Indian language suggests names in its own script, and says so when a name
  // is typed in English letters only, since guests will read it exactly as typed
  const ownSamples = main === "en" ? null : CARD_SAMPLES[main];
  const scriptNote = (id: SlotId): string | undefined => {
    if (main === "en" || !NAME_SLOTS.includes(id)) return undefined;
    const value = coupleValue(draft, template, id);
    return /[A-Za-z]/.test(value) && !/[^ -~]/.test(value)
      ? coupleCopy.latinOnCard(languageName(main))
      : undefined;
  };

  const field = (id: SlotId) => (
    <SlotField
      key={id}
      id={id}
      template={template}
      value={coupleValue(draft, template, id)}
      error={errors[id]}
      onChange={(value) => set(id, value)}
      {...(id === "first" && one
        ? { label: one.label, example: one.example, hint: namesCopy.oneHint }
        : {})}
      {...(ownSamples?.[id] ? { example: ownSamples[id] } : {})}
      {...(scriptNote(id) ? { hint: scriptNote(id) } : {})}
    />
  );

  const translatedField = (id: SlotId) =>
    second && secondCopy ? (
      <SlotField
        key={id}
        id={id}
        template={template}
        value={draft.translation[id] ?? ""}
        onChange={(value) => setTranslation(id, value)}
        translation={{ language: second, placeholder: shownOn(secondCopy, id) }}
        label={id === "first" && one ? one.label : undefined}
      />
    ) : null;

  const wordingGrid = (render: (id: SlotId) => ReactNode) => (
    <div className="grid gap-5 sm:grid-cols-2">
      {wording.map((id) => (
        <div
          key={id}
          data-page-target={id === "blessing" ? "cover" : "family"}
          className={id === "doorLeft" || id === "doorRight" ? undefined : "sm:col-span-2"}
        >
          {render(id)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <LanguageChoice draft={draft} update={update} />
      <section
        aria-labelledby="names-heading"
        data-page-target="cover"
        className="flex flex-col gap-5 border-t border-line pt-6"
      >
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
          {wordingGrid(field)}
        </section>
      )}
      {second && (
        <section
          aria-labelledby="second-heading"
          className="flex flex-col gap-5 rounded-xl border border-line bg-surface-2/60 p-4 sm:p-6"
        >
          <div className="flex flex-col gap-1">
            <h2 id="second-heading" className="font-display text-xl">
              {coupleCopy.secondHeading(languageName(second))}
            </h2>
            <p className="text-sm text-ink-muted">{coupleCopy.secondHint(languageName(main))}</p>
          </div>
          <div className="flex flex-col gap-5">{names.map(translatedField)}</div>
          {wording.length > 0 && wordingGrid(translatedField)}
        </section>
      )}
      <Lettering draft={draft} update={update} />
    </div>
  );
}
