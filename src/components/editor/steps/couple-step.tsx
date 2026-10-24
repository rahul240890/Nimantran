"use client";

import { spellName } from "@/actions/transliterate";
import { languageName } from "@/components/invitation/card-language-toggle";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CharacterCount, Textarea } from "@/components/ui/textarea";
import { Hint, useQuiet } from "@/components/ui/quiet";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import {
  cardLanguages,
  COUPLE_SLOTS,
  NAME_SLOTS,
  draftPeople,
  coupleValue,
  draftFaith,
  type CardLanguage,
} from "@/lib/editor/draft";
import {
  cardSuggestions,
  doorIdeas,
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
import { CardLanguagePicker } from "./language-step";
import { Fold } from "./fold";
import { FaithPicker } from "./faith-picker";
import { Ideas } from "./ideas";
import { SacredElements } from "./sacred-elements";
import { cn } from "@/lib/cn";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

/** What a slot shows on a card, for the second language's placeholders. */
export function shownOn(copy: CardCopy, id: SlotId): string {
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

export function SlotField({
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
  const quiet = useQuiet();
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
      label={label ?? coupleCopy.slotNames[id]}
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
        className={
          rule.kind === "name" ? cn("font-display", quiet ? "text-lg" : "text-xl") : undefined
        }
        data-slot={translation ? undefined : id}
        data-translation={translation ? id : undefined}
      />
    </Field>
  );
}

/** The names in a card's language, for the second language's fields too. */
export function useNames(draft: StepProps["draft"]) {
  const { namesCopy } = useText(editorText);
  const template = TEMPLATES[draft.templateId];
  const used = new Set(slotsOf(template));
  // A birthday or a party is led by one name: no second name and nothing to join them
  const one =
    draftPeople(draft) === "one"
      ? (namesCopy.one[draft.categoryId as keyof typeof namesCopy.one] ?? null)
      : null;
  const names = (one ? ["first" as const] : NAME_SLOTS).filter((id) => used.has(id));
  // Every other line the design shows: the blessing and invitation line first
  const wording = COUPLE_SLOTS.filter((id) => used.has(id) && !NAME_SLOTS.includes(id)).sort(
    (a, b) => Number(b === "blessing" || b === "line") - Number(a === "blessing" || a === "line"),
  );
  return { template, one, names, wording };
}

/** Ready wording for a line in the given language, under its field (named in the site's). */
export function lineIdeas(
  draft: StepProps["draft"],
  id: SlotId,
  language: CardLanguage,
  value: string,
  pick: (v: string) => void,
  field: string,
) {
  return (SUGGESTED_SLOTS as readonly string[]).includes(id) ? (
    <Ideas
      field={field}
      ideas={cardSuggestions(
        draft.categoryId,
        language,
        id as SuggestedSlot,
        draftFaith(draft),
      ).filter((idea) => idea.length <= SLOT_RULES[id].maxLength)}
      value={value}
      language={language}
      onPick={pick}
    />
  ) : null;
}

/** The names section: the card's language, then the names in large letters. */
export function CoupleStep({ draft, update, errors }: StepProps) {
  const { coupleCopy, namesCopy } = useText(editorText);
  // On a design's page the names sit in a fold titled with them, so the heading isn't shown
  const quiet = useQuiet();
  const { template, one, names } = useNames(draft);
  const set = (id: SlotId, value: string) =>
    update((current) => ({ ...current, content: { ...current.content, [id]: value } }));
  const [main] = cardLanguages(draft);

  // A card in an Indian language suggests names in its own script, and says so when a name
  // is typed in English letters only, since guests will read it exactly as typed
  const ownSamples = main === "en" ? null : CARD_SAMPLES[main];
  const scriptNote = (id: SlotId): string | undefined => {
    if (main === "en" || id === "joiner") return undefined;
    const value = coupleValue(draft, template, id);
    return /[A-Za-z]/.test(value) && !/[^ -~]/.test(value)
      ? coupleCopy.latinOnCard(languageName(main))
      : undefined;
  };

  const field = (id: SlotId) => {
    const value = coupleValue(draft, template, id);
    const slot = (
      <SlotField
        id={id}
        template={template}
        value={value}
        error={errors[id]}
        onChange={(next) => set(id, next)}
        {...(id === "first" && one
          ? { label: one.label, example: one.example, hint: namesCopy.oneHint }
          : {})}
        {...(ownSamples?.[id] ? { example: ownSamples[id] } : {})}
        {...(scriptNote(id) ? { hint: scriptNote(id) } : {})}
      />
    );
    if (id === "joiner") {
      return (
        <div key={id} className="flex flex-col gap-2.5">
          {slot}
          {lineIdeas(draft, id, main, value, (next) => set(id, next), coupleCopy.slotNames[id])}
        </div>
      );
    }
    return (
      <div key={id} className="flex flex-col gap-2">
        {slot}
        {main !== "en" && (
          <ScriptChoices value={value} language={main} onPick={(name) => set(id, name)} />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <CardLanguagePicker draft={draft} update={update} />
      <section
        aria-labelledby="names-heading"
        data-page-target="cover"
        className="flex flex-col gap-5 border-t border-line pt-6"
      >
        <div className="flex flex-col gap-1">
          <h2 id="names-heading" className={cn("font-display text-xl", quiet && "sr-only")}>
            {coupleCopy.namesHeading}
          </h2>
          <Hint>{coupleCopy.anyScript}</Hint>
        </div>
        <div className="flex flex-col gap-5">{names.map(field)}</div>
      </section>
    </div>
  );
}

/**
 * The card words section: the tradition's symbol and invocation at the top of the card,
 * every line the design shows besides the names, each starting with wording for the
 * occasion, then how the letters look.
 */
export function WordsStep({ draft, update, errors }: StepProps) {
  const { coupleCopy, studioCopy } = useText(editorText);
  const { template, wording } = useNames(draft);
  const set = (id: SlotId, value: string) =>
    update((current) => ({ ...current, content: { ...current.content, [id]: value } }));
  const [main] = cardLanguages(draft);
  const ownSamples = main === "en" ? null : CARD_SAMPLES[main];
  const typeChanged = JSON.stringify(draft.type) !== JSON.stringify(defaultType);

  const setDoors = (left: string, right: string) =>
    update((current) => ({
      ...current,
      content: { ...current.content, doorLeft: left, doorRight: right },
    }));

  return (
    <div className="flex flex-col gap-8">
      <FaithPicker draft={draft} update={update} />
      <SacredElements draft={draft} update={update} />
      {wording.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {wording.map((id) => {
            const value = coupleValue(draft, template, id);
            return (
              <div
                key={id}
                data-page-target={id === "line" || id === "families" ? "family" : "cover"}
                className={cn(
                  "flex flex-col gap-2.5",
                  id !== "doorLeft" && id !== "doorRight" && "sm:col-span-2",
                )}
              >
                <SlotField
                  id={id}
                  template={template}
                  value={value}
                  error={errors[id]}
                  onChange={(next) => set(id, next)}
                  {...(ownSamples?.[id] ? { example: ownSamples[id] } : {})}
                />
                {lineIdeas(
                  draft,
                  id,
                  main,
                  value,
                  (next) => set(id, next),
                  coupleCopy.slotNames[id],
                )}
                {id === "doorLeft" && (
                  <DoorIdeas
                    draft={draft}
                    language={main}
                    left={value}
                    right={coupleValue(draft, template, "doorRight")}
                    onPick={setDoors}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
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

/** A wedding's gate words as pairs: tapping one fills both doors. */
function DoorIdeas({
  draft,
  language,
  left,
  right,
  onPick,
}: {
  draft: StepProps["draft"];
  language: CardLanguage;
  left: string;
  right: string;
  onPick: (left: string, right: string) => void;
}) {
  const { faithCopy } = useText(editorText);
  const pairs = doorIdeas(draft.categoryId, language, draftFaith(draft)).filter(
    ([a, b]) =>
      a.length <= SLOT_RULES.doorLeft.maxLength && b.length <= SLOT_RULES.doorRight.maxLength,
  );
  if (pairs.length === 0) return null;
  return (
    <div role="group" aria-label={faithCopy.doorIdeas} className="flex flex-col gap-2">
      <span
        aria-hidden
        className="flex items-center gap-1.5 font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
      >
        <Sparkles className="size-3.5 text-accent-text" />
        {faithCopy.doorIdeas}
      </span>
      <ul className="flex flex-wrap gap-2">
        {pairs.map(([a, b]) => {
          const chosen = left.trim() === a && right.trim() === b;
          return (
            <li key={`${a}|${b}`}>
              <button
                type="button"
                lang={language}
                aria-pressed={chosen}
                aria-label={faithCopy.doorIdea(a, b)}
                onClick={() => onPick(a, b)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm leading-snug transition-[background-color,border-color,color,transform] duration-150 motion-safe:active:scale-95",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  chosen
                    ? "border-marigold bg-marigold/15 font-semibold text-accent-text"
                    : "border-line-strong bg-surface text-ink-muted hover:border-line-control hover:text-ink",
                )}
              >
                {a} · {b}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
