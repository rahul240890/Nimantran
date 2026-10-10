"use client";

import { format, parseISO } from "date-fns";
import { Car, ChevronDown, CircleAlert, MapPin, MapPinned, Shirt } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import {
  ceremonyName,
  draftTradition,
  FUNCTION_RULES,
  draftCategory,
  functionOrder,
  mainFunction,
  muhuratName,
  needsTime,
  type EventFunction,
  type FunctionId,
} from "@/lib/editor/draft";
import { functionGuide, GUIDE_RULES, mapsPin, type FunctionGuide } from "@/lib/editor/guide";
import { cn } from "@/lib/cn";
import type { StepProps } from "./types";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";

/** Where an empty time list opens: mid-morning, so the rest of the day is a short scroll. */
const DAY_STARTS = "10:00";

function FunctionFields({
  id,
  fn,
  errors,
  withTime,
  muhurat,
  set,
  guide,
  setGuide,
}: {
  id: FunctionId;
  fn: EventFunction;
  errors: StepProps["errors"];
  /** False for a save-the-date: a date and a city are enough. */
  withTime: boolean;
  /** The tradition's name for the wedding's auspicious time, when it has one. */
  muhurat: { name: string; lang: string } | null;
  set: (change: Partial<EventFunction>) => void;
  /** The map pin and parking guests see on the day. */
  guide: FunctionGuide;
  setGuide: (change: Partial<FunctionGuide>) => void;
}) {
  const { editor } = useText(editorText);
  const message = (error: string | undefined) =>
    error ? editor.errors[error as keyof typeof editor.errors] : undefined;
  const { functionCopy, functionFields } = useText(editorText);
  const copy = functionCopy[id];
  // Weddings are planned months ahead; the calendar opens on today and runs two years out
  const { today, end } = useMemo(() => {
    const now = new Date();
    return { today: now, end: new Date(now.getFullYear() + 2, 11, 31) };
  }, []);

  // The rarer details fold away until asked for, or once one of them is filled in
  const filled = Boolean(
    fn.endTime || fn.address || fn.dressCode || guide.pin.trim() || guide.parking.trim(),
  );
  const [open, setOpen] = useState(filled);
  const moreId = useId();
  const endTime = (
    <Field
      label={functionFields.endTime}
      optionalLabel={editor.optional}
      hint={muhurat ? undefined : functionFields.endHint}
    >
      <TimePicker
        value={fn.endTime || undefined}
        onValueChange={(endTime) => set({ endTime })}
        placeholder={functionFields.timePlaceholder}
        // Opens at the start time, not at midnight
        openAt={fn.time || DAY_STARTS}
        step={muhurat ? 1 : 15}
      />
    </Field>
  );

  return (
    <div className="grid gap-5 border-t border-line px-4 pt-5 pb-5 sm:grid-cols-2 sm:px-5">
      <Field
        label={functionFields.date}
        required
        error={message(errors[`${id}.date`])}
        className={withTime ? "sm:col-span-2" : undefined}
      >
        <DatePicker
          value={fn.date ? parseISO(fn.date) : undefined}
          onValueChange={(date) => set({ date: date ? format(date, "yyyy-MM-dd") : "" })}
          placeholder={functionFields.datePlaceholder}
          disabledDays={{ before: today }}
          startMonth={today}
          endMonth={end}
        />
      </Field>
      {withTime && (
        <Field label={functionFields.time} required error={message(errors[`${id}.time`])}>
          <TimePicker
            value={fn.time || undefined}
            onValueChange={(time) => set({ time })}
            placeholder={functionFields.timePlaceholder}
            // Opens at a likely hour, so nobody scrolls past midnight to find the evening
            openAt={DAY_STARTS}
            // A muhurat is set to the minute, never rounded
            step={muhurat ? 1 : 15}
          />
        </Field>
      )}
      {withTime && muhurat && endTime}
      {withTime && muhurat && (
        <p className="-mt-2 text-sm text-ink-muted sm:col-span-2">
          <span lang={muhurat.lang} className="font-semibold text-accent-text">
            {muhurat.name}
          </span>
          {": "}
          {functionFields.muhuratHint}
        </p>
      )}
      <Field
        label={withTime ? functionFields.venue : functionFields.city}
        required
        hint={withTime ? undefined : functionFields.cityHint}
        error={message(errors[`${id}.venue`])}
        className="sm:col-span-2"
      >
        <Input
          value={fn.venue}
          maxLength={FUNCTION_RULES.venue}
          placeholder={withTime ? functionFields.venuePlaceholder : functionFields.cityPlaceholder}
          autoComplete="off"
          leading={<MapPin />}
          onChange={(event) => set({ venue: event.target.value })}
        />
      </Field>
      {withTime && (
        <div className="sm:col-span-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={open}
            aria-controls={moreId}
            trailingIcon={
              <ChevronDown
                aria-hidden
                className={cn(
                  "transition-transform motion-reduce:transition-none",
                  open && "rotate-180",
                )}
              />
            }
            onClick={() => setOpen(!open)}
            className="-ms-2 text-accent-text"
          >
            {functionFields.moreDetails}
          </Button>
          {!open && <p className="text-sm text-ink-muted">{functionFields.moreDetailsHint}</p>}
        </div>
      )}
      {withTime && open && (
        <div id={moreId} className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
          {!muhurat && endTime}
          {
            <Field
              label={functionFields.address}
              optionalLabel={editor.optional}
              hint={functionFields.addressHint}
              className="sm:col-span-2"
            >
              <Input
                value={fn.address}
                maxLength={FUNCTION_RULES.address}
                autoComplete="street-address"
                onChange={(event) => set({ address: event.target.value })}
              />
            </Field>
          }
          {
            <Field
              label={functionFields.pin}
              optionalLabel={editor.optional}
              hint={functionFields.pinHint}
              error={
                guide.pin.trim() && !mapsPin(guide.pin) ? functionFields.pinInvalid : undefined
              }
              className="sm:col-span-2"
            >
              <Input
                type="url"
                inputMode="url"
                value={guide.pin}
                maxLength={GUIDE_RULES.pin}
                placeholder="https://maps.app.goo.gl/…"
                autoComplete="off"
                spellCheck={false}
                leading={<MapPinned />}
                onChange={(event) => setGuide({ pin: event.target.value })}
              />
            </Field>
          }
          {
            <Field
              label={functionFields.parking}
              optionalLabel={editor.optional}
              className="sm:col-span-2"
            >
              <Input
                value={guide.parking}
                maxLength={GUIDE_RULES.parking}
                placeholder={functionFields.parkingPlaceholder}
                autoComplete="off"
                leading={<Car />}
                onChange={(event) => setGuide({ parking: event.target.value })}
              />
            </Field>
          }
          {
            <div className="flex flex-col gap-3 sm:col-span-2">
              <Field label={functionFields.dressCode} optionalLabel={editor.optional}>
                <Input
                  value={fn.dressCode}
                  maxLength={FUNCTION_RULES.dressCode}
                  autoComplete="off"
                  leading={<Shirt />}
                  onChange={(event) => set({ dressCode: event.target.value })}
                />
              </Field>
              <div role="group" aria-label={functionFields.dressIdeas}>
                <ul className="flex flex-wrap gap-2">
                  {copy.dressIdeas.map((idea) => {
                    const chosen = fn.dressCode === idea;
                    return (
                      <li key={idea}>
                        <button
                          type="button"
                          aria-pressed={chosen}
                          onClick={() => set({ dressCode: chosen ? "" : idea })}
                          className={cn(
                            "min-h-11 cursor-pointer rounded-full border px-4 text-sm transition-[background-color,border-color,color,transform] duration-150 active:scale-95",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                            chosen
                              ? "border-marigold bg-marigold/15 font-semibold text-accent-text"
                              : "border-line-strong bg-surface text-ink-muted hover:border-line-control hover:text-ink",
                          )}
                        >
                          {idea}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          }
        </div>
      )}
    </div>
  );
}

export function FunctionsStep({ draft, update, errors }: StepProps) {
  const { editor, functionCopy, functionFields } = useText(editorText);
  const main = mainFunction(draft);
  const category = draftCategory(draft);
  const locale = useLocale();
  const { suggested, more } = functionOrder(draft);
  const withTime = needsTime(draft);
  // The rarer functions stay folded on a short list until the host asks, unless one is planned
  const [moreOpen, setMoreOpen] = useState(false);
  const showMore = moreOpen || more.some((id) => draft.functions[id].included);

  const setFunction = (id: FunctionId, change: Partial<EventFunction>) =>
    update((current) => ({
      ...current,
      functions: { ...current.functions, [id]: { ...current.functions[id], ...change } },
    }));

  const setGuide = (id: FunctionId, change: Partial<FunctionGuide>) =>
    update((current) => ({
      ...current,
      guide: { ...current.guide, [id]: { ...functionGuide(current.guide, id), ...change } },
    }));

  const item = (id: FunctionId) => {
    const fn = draft.functions[id];
    const copy = functionCopy[id];
    const local = ceremonyName(draft, id);
    const muhurat = muhuratName(draft, id);
    return (
      <li
        key={id}
        data-page-target={`fn-${id}`}
        className={cn(
          "overflow-hidden rounded-lg border bg-surface transition-[border-color,box-shadow] duration-300",
          fn.included ? "border-marigold/70 shadow-float" : "border-line shadow-raised",
          errors.functions && "border-danger",
        )}
      >
        <div className="flex items-start justify-between gap-3 px-4 py-2 sm:px-5">
          <Checkbox
            label={
              <span className="font-display text-lg">
                {copy.name}
                {local && (
                  <span
                    lang={draftTradition(draft)?.language}
                    className="font-sans text-base font-normal text-accent-text"
                  >
                    {" · "}
                    {local.native}
                  </span>
                )}
              </span>
            }
            description={copy.description}
            checked={fn.included}
            invalid={Boolean(errors.functions)}
            onCheckedChange={(checked) => setFunction(id, { included: checked === true })}
            className="flex-1"
          />
          {fn.included && main === id && (
            <Badge tone="gold" className="mt-3 shrink-0">
              {functionFields.onCard}
            </Badge>
          )}
        </div>
        {fn.included && (
          <FunctionFields
            id={id}
            fn={fn}
            errors={errors}
            withTime={withTime}
            muhurat={
              muhurat ? { name: muhurat.native, lang: draftTradition(draft)!.language } : null
            }
            set={(change) => setFunction(id, change)}
            guide={functionGuide(draft.guide, id)}
            setGuide={(change) => setGuide(id, change)}
          />
        )}
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {errors.functions && (
        <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {editor.errors["no-functions"]}
        </p>
      )}
      <section aria-labelledby="functions-suggested" className="flex flex-col gap-3">
        <h2
          id="functions-suggested"
          className="font-label text-xs tracking-[0.24em] text-ink-muted uppercase"
        >
          {functionFields.suggested(category.names[locale])}
        </h2>
        <ul aria-label={functionFields.group} className="flex flex-col gap-4">
          {suggested.map(item)}
        </ul>
      </section>
      {more.length > 0 && (
        <section aria-labelledby="functions-more" className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h2
              id="functions-more"
              className="font-label text-xs tracking-[0.24em] text-ink-muted uppercase"
            >
              {functionFields.more}
            </h2>
            <p className="text-sm text-ink-muted">{functionFields.moreHint}</p>
          </div>
          {showMore ? (
            <ul aria-label={functionFields.more} className="flex flex-col gap-4">
              {more.map(item)}
            </ul>
          ) : (
            <Button
              type="button"
              variant="secondary"
              aria-expanded={false}
              trailingIcon={<ChevronDown aria-hidden />}
              onClick={() => setMoreOpen(true)}
              className="self-start"
            >
              {functionFields.showMore(more.length)}
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
