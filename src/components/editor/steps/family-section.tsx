"use client";

import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cardLanguages, draftCopy, draftPeople, draftTradition } from "@/lib/editor/draft";
import {
  CONTACT_NAME_MAX,
  FAMILY_MAX,
  MAX_CONTACTS,
  PHONE_MAX,
  RELATIONS,
  TOWN_MAX,
  type DraftFamily,
  type FamilySide,
  type Relation,
} from "@/lib/editor/family";
import { WORDING_IDS, WORDING_MAX, type WordingId } from "@/lib/traditions/schema";
import type { StepProps } from "./types";

/**
 * The family behind the names (Step 12s): each side's parents and home town, blessings and
 * hosts, a line in memory, and whom guests can call. Folded away until the host opens it,
 * so the names step stays short; everything in it is optional.
 */
export function FamilySection({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { editor, familyCopy, traditionCopy } = useText(editorText);
  const [language] = cardLanguages(draft);
  const copy = draftCopy(draft, language);
  const pack = draftTradition(draft);
  const one = draftPeople(draft) === "one";
  const { family } = draft;
  const filled =
    Boolean(family.first.parents || family.second.parents || family.memory) ||
    family.contacts.length > 0 ||
    WORDING_IDS.some((id) => draft.tradition.wording[id]?.trim());
  // Opens already filled in, so a returning host sees their words; then it's theirs to fold
  const [startOpen] = useState(filled);

  const setFamily = (change: (current: DraftFamily) => DraftFamily) =>
    update((current) => ({ ...current, family: change(current.family) }));
  const setSide = (key: "first" | "second", change: Partial<FamilySide>) =>
    setFamily((current) => ({ ...current, [key]: { ...current[key], ...change } }));
  const setWording = (id: WordingId, value: string) =>
    update((current) => ({
      ...current,
      tradition: {
        ...current.tradition,
        wording: { ...current.tradition.wording, [id]: value },
      },
    }));

  const side = (key: "first" | "second", name: string) => {
    const heading = name.trim()
      ? familyCopy.sideHeading(name.trim())
      : familyCopy.sideFallback[key];
    const headingId = `family-${key}-heading`;
    return (
      <fieldset key={key} className="flex min-w-0 flex-col gap-4" aria-labelledby={headingId}>
        <legend id={headingId} lang={language} className="font-display text-lg">
          {heading}
        </legend>
        <RadioGroup
          label={`${heading}: ${familyCopy.relation}`}
          orientation="horizontal"
          value={family[key].relation}
          onValueChange={(value) => setSide(key, { relation: value as Relation })}
        >
          {RELATIONS.map((relation) => (
            <RadioItem key={relation} value={relation} label={familyCopy.relations[relation]} />
          ))}
        </RadioGroup>
        <Field
          label={familyCopy.parents}
          hint={familyCopy.parentsHint}
          optionalLabel={editor.optional}
        >
          <Input
            value={family[key].parents}
            maxLength={FAMILY_MAX}
            placeholder={familyCopy.parentsExample}
            lang={language}
            autoComplete="off"
            onChange={(event) => setSide(key, { parents: event.target.value })}
          />
        </Field>
        <Field label={familyCopy.town} optionalLabel={editor.optional}>
          <Input
            value={family[key].town}
            maxLength={TOWN_MAX}
            placeholder={familyCopy.townExample}
            lang={language}
            autoComplete="off"
            onChange={(event) => setSide(key, { town: event.target.value })}
          />
        </Field>
      </fieldset>
    );
  };

  const contacts = family.contacts;
  const setContact = (index: number, change: Partial<DraftFamily["contacts"][number]>) =>
    setFamily((current) => ({
      ...current,
      contacts: current.contacts.map((c, i) => (i === index ? { ...c, ...change } : c)),
    }));

  return (
    <details
      open={startOpen || undefined}
      data-page-target="family"
      className="group border-t border-line pt-6"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
        <span className="flex flex-col gap-1">
          <span className="font-display text-xl">{familyCopy.heading}</span>
          <span className="text-sm text-ink-muted">{familyCopy.intro}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-text">
          <span className="sr-only sm:not-sr-only">{familyCopy.open}</span>
          <ChevronDown
            aria-hidden
            className="size-5 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </span>
      </summary>

      <div className="mt-6 flex flex-col gap-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {side("first", copy.first)}
          {!one && side("second", copy.second)}
        </div>

        <fieldset className="flex min-w-0 flex-col gap-4" aria-labelledby="family-more-heading">
          <legend id="family-more-heading" className="font-display text-lg">
            {familyCopy.more}
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            {WORDING_IDS.map((id) => {
              const own = pack?.wording[id];
              return (
                <Field
                  key={id}
                  label={
                    <>
                      {traditionCopy.wordingLabels[id]}
                      {own && (
                        <span lang={pack.language} className="font-normal text-accent-text">
                          {" · "}
                          {own.title}
                        </span>
                      )}
                    </>
                  }
                  optionalLabel={editor.optional}
                >
                  <Input
                    value={draft.tradition.wording[id] ?? ""}
                    maxLength={WORDING_MAX}
                    placeholder={own?.example ?? familyCopy.examples[id]}
                    lang={language}
                    autoComplete="off"
                    data-wording={id}
                    onChange={(event) => setWording(id, event.target.value)}
                  />
                </Field>
              );
            })}
            <Field
              label={familyCopy.memory}
              hint={familyCopy.memoryHint}
              optionalLabel={editor.optional}
            >
              <Input
                value={family.memory}
                maxLength={FAMILY_MAX}
                placeholder={familyCopy.memoryExample}
                lang={language}
                autoComplete="off"
                onChange={(event) =>
                  setFamily((current) => ({ ...current, memory: event.target.value }))
                }
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="flex min-w-0 flex-col gap-4" aria-labelledby="family-contacts-heading">
          <legend id="family-contacts-heading" className="font-display text-lg">
            {familyCopy.contacts}
          </legend>
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-end gap-3">
              <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
                <Field label={familyCopy.contactName}>
                  <Input
                    value={contact.name}
                    maxLength={CONTACT_NAME_MAX}
                    placeholder={familyCopy.contactNameExample}
                    lang={language}
                    autoComplete="off"
                    onChange={(event) => setContact(index, { name: event.target.value })}
                  />
                </Field>
                <Field label={familyCopy.phone}>
                  <Input
                    type="tel"
                    inputMode="tel"
                    value={contact.phone}
                    maxLength={PHONE_MAX}
                    placeholder="98765 43210"
                    autoComplete="off"
                    onChange={(event) => setContact(index, { phone: event.target.value })}
                  />
                </Field>
              </div>
              <IconButton
                label={familyCopy.removeContact(index + 1)}
                icon={<Trash2 />}
                variant="ghost"
                onClick={() =>
                  setFamily((current) => ({
                    ...current,
                    contacts: current.contacts.filter((_, i) => i !== index),
                  }))
                }
              />
            </div>
          ))}
          {contacts.length < MAX_CONTACTS && (
            <Button
              variant="secondary"
              className="self-start"
              onClick={() =>
                setFamily((current) => ({
                  ...current,
                  contacts: [...current.contacts, { name: "", phone: "" }],
                }))
              }
            >
              <Plus aria-hidden />
              {familyCopy.addContact}
            </Button>
          )}
        </fieldset>
      </div>
    </details>
  );
}
