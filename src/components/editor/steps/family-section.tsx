"use client";

import { Plus, Trash2 } from "lucide-react";
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
 * The family section of the details (Step 12s): each side's parents and home town,
 * blessings and hosts, and a line in memory. Everything in it is optional; what's filled in
 * appears on the family page of every design.
 */
export function FamilySection({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { editor, familyCopy, traditionCopy } = useText(editorText);
  const [language] = cardLanguages(draft);
  const copy = draftCopy(draft, language);
  const pack = draftTradition(draft);
  const one = draftPeople(draft) === "one";
  const { family } = draft;
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

  return (
    <div data-page-target="family" className="flex flex-col gap-8">
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
    </div>
  );
}

/**
 * Whom guests can call, in the music and replies section: shown on the family page of every
 * design under "For any help, call", and on the guest page.
 */
export function ContactsSection({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { familyCopy } = useText(editorText);
  const [language] = cardLanguages(draft);
  const { family } = draft;
  const setFamily = (change: (current: DraftFamily) => DraftFamily) =>
    update((current) => ({ ...current, family: change(current.family) }));
  const contacts = family.contacts;
  const setContact = (index: number, change: Partial<DraftFamily["contacts"][number]>) =>
    setFamily((current) => ({
      ...current,
      contacts: current.contacts.map((c, i) => (i === index ? { ...c, ...change } : c)),
    }));

  return (
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
  );
}
