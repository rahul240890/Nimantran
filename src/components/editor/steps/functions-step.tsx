"use client";

import { format, parseISO } from "date-fns";
import { CircleAlert, MapPin, Shirt } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import { editor, functionCopy, functionFields } from "@/content/editor";
import {
  FUNCTION_IDS,
  FUNCTION_RULES,
  mainFunction,
  type EventFunction,
  type FunctionId,
} from "@/lib/editor/draft";
import { cn } from "@/lib/cn";
import type { StepProps } from "./types";

const message = (error: string | undefined) =>
  error ? editor.errors[error as keyof typeof editor.errors] : undefined;

function FunctionFields({
  id,
  fn,
  errors,
  set,
}: {
  id: FunctionId;
  fn: EventFunction;
  errors: StepProps["errors"];
  set: (change: Partial<EventFunction>) => void;
}) {
  const copy = functionCopy[id];
  // Weddings are planned months ahead; the calendar opens on today and runs two years out
  const { today, end } = useMemo(() => {
    const now = new Date();
    return { today: now, end: new Date(now.getFullYear() + 2, 11, 31) };
  }, []);

  return (
    <div className="grid gap-5 border-t border-line px-4 pt-5 pb-5 sm:grid-cols-2 sm:px-5">
      <Field label={functionFields.date} required error={message(errors[`${id}.date`])}>
        <DatePicker
          value={fn.date ? parseISO(fn.date) : undefined}
          onValueChange={(date) => set({ date: date ? format(date, "yyyy-MM-dd") : "" })}
          placeholder={functionFields.datePlaceholder}
          disabledDays={{ before: today }}
          startMonth={today}
          endMonth={end}
        />
      </Field>
      <Field label={functionFields.time} required error={message(errors[`${id}.time`])}>
        <TimePicker
          value={fn.time || undefined}
          onValueChange={(time) => set({ time })}
          placeholder={functionFields.timePlaceholder}
          step={15}
        />
      </Field>
      <Field
        label={functionFields.venue}
        required
        error={message(errors[`${id}.venue`])}
        className="sm:col-span-2"
      >
        <Input
          value={fn.venue}
          maxLength={FUNCTION_RULES.venue}
          placeholder={functionFields.venuePlaceholder}
          autoComplete="off"
          leading={<MapPin />}
          onChange={(event) => set({ venue: event.target.value })}
        />
      </Field>
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
    </div>
  );
}

export function FunctionsStep({ draft, update, errors }: StepProps) {
  const main = mainFunction(draft);

  const setFunction = (id: FunctionId, change: Partial<EventFunction>) =>
    update((current) => ({
      ...current,
      functions: { ...current.functions, [id]: { ...current.functions[id], ...change } },
    }));

  return (
    <div className="flex flex-col gap-4">
      {errors.functions && (
        <p role="alert" className="flex items-start gap-1.5 text-sm font-medium text-danger">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {editor.errors["no-functions"]}
        </p>
      )}
      <ul aria-label={functionFields.group} className="flex flex-col gap-4">
        {FUNCTION_IDS.map((id) => {
          const fn = draft.functions[id];
          const copy = functionCopy[id];
          return (
            <li
              key={id}
              className={cn(
                "overflow-hidden rounded-lg border bg-surface transition-[border-color,box-shadow] duration-300",
                fn.included ? "border-marigold/70 shadow-float" : "border-line shadow-raised",
                errors.functions && "border-danger",
              )}
            >
              <div className="flex items-start justify-between gap-3 px-4 py-2 sm:px-5">
                <Checkbox
                  label={<span className="font-display text-lg">{copy.name}</span>}
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
                  set={(change) => setFunction(id, change)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
