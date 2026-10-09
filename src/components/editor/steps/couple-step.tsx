"use client";

import { spellName } from "@/actions/transliterate";
import { languageName } from "@/components/invitation/card-language-toggle";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CharacterCount, Textarea } from "@/components/ui/textarea";
import { Languages } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { slotLabels } from "@/content/templates-review";
import {
  cardLanguages,
  COUPLE_SLOTS,
  draftPeople,
  coupleValue,
  draftCopy,
  type CardLanguage,
} from "@/lib/editor/draft";
import {
  cardSuggestions,
  SUGGESTED_SLOTS,
  type SuggestedSlot,
} from "@/lib/templates/card-suggestions";
import type { CardCopy } from "@/lib/templates/content";
import { TEMPLATES } from "@/lib/templates/catalog";
import { CARD_SAMPLES } from "@/lib/templates/story-words";
import { slotsOf } from "@/lib/templates/content";
import { SLOT_RULES, type SlotId, type Template } from "@/lib/templates/schema";
import { defaultType } from "@/lib/editor/type";
import { isLatinName, type ScriptLanguage } from "@/lib/names/transliterate";
import type { StepProps } from "./types";
import { Lettering } from "../lettering";
import { FamilySection } from "./family-section";
import { Fold } from "./fold";
import { Ideas } from "./ideas";
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

/**
 * A name typed in English letters, offered back in the card's script: tapping a spelling
 * puts it in the field. Shows nothing while typing, or when no spelling comes back.
 */
function ScriptChoices({
  value,
  language,
  onPick,
}: {
  value: string;
  language: ScriptLanguage;
  onPick: (name: string) => void;
}) {
  const { coupleCopy } = useText(editorText);
  const [found, setFound] = useState<{ name: string; spellings: string[] }>({
    name: "",
    spellings: [],
  });
  const latin = isLatinName(value);

  useEffect(() => {
    if (!latin) return;
    let live = true;
    const timer = setTimeout(() => {
      void spellName({ name: value, language }).then((spellings) => {
        if (live) setFound({ name: value, spellings });
      });
    }, 450);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [latin, value, language]);

  const spellings = latin && found.name === value ? found.spellings : [];
  return (
    <div aria-live="polite" className="empty:hidden">
      {spellings.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-muted">
            {coupleCopy.spellings(languageName(language))}
          </span>
          {spellings.map((spelling) => (
            <Button
              key={spelling}
              size="sm"
              variant="secondary"
              lang={language}
              aria-label={coupleCopy.useSpelling(spelling)}
              onClick={() => onPick(spelling)}
              className="font-display text-lg"
            >
              {spelling}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
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

export function CoupleStep({ draft, update, errors, goTo }: StepProps) {
  const { coupleCopy, namesCopy, studioCopy } = useText(editorText);
  const template = TEMPLATES[draft.templateId];
  const used = new Set(slotsOf(template));
  // A birthday or a party is led by one name: no second name and nothing to join them
  const one =
    draftPeople(draft) === "one"
      ? (namesCopy.one[draft.categoryId as keyof typeof namesCopy.one] ?? null)
      : null;
  const names = (one ? ["first" as const] : NAME_SLOTS).filter((id) => used.has(id));
  // The names and the word between them stay together; of the other lines, the ones most
  // cards change stay in view and the rest fold under "More card words"
  const wording = COUPLE_SLOTS.filter((id) => used.has(id) && !NAME_SLOTS.includes(id));
  const shown: SlotId[] = wording.filter((id) => id === "blessing" || id === "line");
  const folded: SlotId[] = wording.filter((id) => !shown.includes(id));

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

  const ideasFor = (
    id: SlotId,
    language: CardLanguage,
    value: string,
    pick: (v: string) => void,
  ) =>
    (SUGGESTED_SLOTS as readonly string[]).includes(id) ? (
      <Ideas
        field={slotLabels[id]}
        ideas={cardSuggestions(draft.categoryId, language, id as SuggestedSlot).filter(
          (idea) => idea.length <= SLOT_RULES[id].maxLength,
        )}
        value={value}
        language={language}
        onPick={pick}
      />
    ) : null;

  const field = (id: SlotId) => {
    const slot = (
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
    if (!NAME_SLOTS.includes(id) || id === "joiner") {
      const ideas = ideasFor(id, main, coupleValue(draft, template, id), (value) => set(id, value));
      return ideas ? (
        <div key={id} className="flex flex-col gap-2.5">
          {slot}
          {ideas}
        </div>
      ) : (
        slot
      );
    }
    if (main === "en") return slot;
    return (
      <div key={id} className="flex flex-col gap-2">
        {slot}
        <ScriptChoices
          value={coupleValue(draft, template, id)}
          language={main}
          onPick={(name) => set(id, name)}
        />
      </div>
    );
  };

  const translatedField = (id: SlotId) => {
    if (!second || !secondCopy) return null;
    const slot = (
      <SlotField
        key={id}
        id={id}
        template={template}
        value={draft.translation[id] ?? ""}
        onChange={(value) => setTranslation(id, value)}
        translation={{ language: second, placeholder: shownOn(secondCopy, id) }}
        label={id === "first" && one ? one.label : undefined}
      />
    );
    const ideas = NAME_SLOTS.includes(id)
      ? null
      : ideasFor(id, second, draft.translation[id] ?? "", (value) => setTranslation(id, value));
    return ideas ? (
      <div key={id} className="flex flex-col gap-2.5">
        {slot}
        {ideas}
      </div>
    ) : (
      slot
    );
  };

  const wordingGrid = (render: (id: SlotId) => ReactNode, ids: readonly SlotId[] = wording) => (
    <div className="grid gap-5 sm:grid-cols-2">
      {ids.map((id) => (
        <div
          key={id}
          data-page-target={id === "line" || id === "families" ? "family" : "cover"}
          className={id === "doorLeft" || id === "doorRight" ? undefined : "sm:col-span-2"}
        >
          {render(id)}
        </div>
      ))}
    </div>
  );

  const languages = cardLanguages(draft);
  const foldedFilled = folded.some((id) => draft.content[id] !== undefined);
  const typeChanged = JSON.stringify(draft.type) !== JSON.stringify(defaultType);

  return (
    <div className="flex flex-col gap-8">
      {/* The language was chosen a step back; it shows here with the way back to it */}
      <p className="-mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
        <Languages aria-hidden className="size-4 text-accent-text" />
        <span>
          {coupleCopy.cardIn}{" "}
          <span className="font-semibold text-ink">
            {languages.map((language, i) => (
              <span key={language} lang={language}>
                {i > 0 && " + "}
                {languageName(language)}
              </span>
            ))}
          </span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goTo("language")}
          className="-ms-2 text-accent-text"
        >
          {coupleCopy.changeLanguage}
        </Button>
      </p>
      <section
        aria-labelledby="names-heading"
        data-page-target="cover"
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <h2 id="names-heading" className="font-display text-xl">
            {coupleCopy.namesHeading}
          </h2>
          <p className="text-sm text-ink-muted">{coupleCopy.anyScript}</p>
        </div>
        <div className="flex flex-col gap-5">{names.map(field)}</div>
      </section>
      {shown.length > 0 && (
        <section
          aria-labelledby="wording-heading"
          className="flex flex-col gap-5 border-t border-line pt-6"
        >
          <h2 id="wording-heading" className="font-display text-xl">
            {coupleCopy.wordingHeading}
          </h2>
          {wordingGrid(field, shown)}
        </section>
      )}
      {folded.length > 0 && (
        <Fold
          title={coupleCopy.moreWording}
          intro={coupleCopy.moreWordingHint}
          filled={foldedFilled}
          pageTarget="cover"
        >
          {wordingGrid(field, folded)}
        </Fold>
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
      <FamilySection draft={draft} update={update} />
      <Fold
        title={studioCopy.lettering}
        intro={studioCopy.letteringIntro}
        filled={typeChanged}
        pageTarget="cover"
      >
        <Lettering draft={draft} update={update} headless />
      </Fold>
    </div>
  );
}
