"use client";

import { format, parseISO } from "date-fns";
import {
  CircleCheck,
  CircleHelp,
  CircleX,
  Minus,
  PartyPopper,
  Pencil,
  Plus,
  Send,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { loadReply, sendReply } from "@/actions/rsvp";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RSVP_QUESTIONS } from "@/lib/categories/questions";
import type { RsvpQuestionId } from "@/lib/categories/schema";
import type { FunctionId } from "@/lib/events/functions";
import type { GuestReply, ReplyStatus } from "@/lib/invites/rsvp";
import { cn } from "@/lib/cn";
import { useLocale, useText } from "@/i18n/client";
import { dateLocale } from "@/i18n/dates";
import { categoriesText } from "@/i18n/copy/categories";
import { publishText } from "@/i18n/copy/publish";

export type RsvpFunction = {
  /** The function's id for replies. */
  id: string;
  kind: FunctionId;
  name: string;
  date: string;
};

type Choice = { status: ReplyStatus | null; adults: number; children: number };

const STORAGE_PREFIX = "shubhdwar-rsvp:";
const MAX_PEOPLE = 20;

function storedToken(slug: string): string | null {
  try {
    return localStorage.getItem(STORAGE_PREFIX + slug);
  } catch {
    return null;
  }
}

function storeToken(slug: string, token: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + slug, token);
  } catch {
    // Storage blocked: the reply is saved; changing it later needs the same page open
  }
}

const statusIcons = {
  attending: <CircleCheck />,
  maybe: <CircleHelp />,
  declined: <CircleX />,
} as const;

function Counter({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  const { rsvpCopy } = useText(publishText);
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="flex items-center justify-between gap-3">
      <span id={id} className="font-semibold">
        {label}
      </span>
      <span className="flex items-center gap-2">
        <IconButton
          label={rsvpCopy.fewer(label)}
          icon={<Minus />}
          size="sm"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        />
        <output aria-live="polite" className="w-8 text-center text-lg font-semibold tabular-nums">
          {value}
        </output>
        <IconButton
          label={rsvpCopy.more(label)}
          icon={<Plus />}
          size="sm"
          disabled={value >= MAX_PEOPLE}
          onClick={() => onChange(Math.min(MAX_PEOPLE, value + 1))}
        />
      </span>
    </div>
  );
}

/**
 * The guest's reply: who is coming to each function, the host's questions and a note. No
 * sign-in: the first reply returns a private token, kept on this device (or carried in a
 * personal link as ?g=), which lets the guest change it later.
 */
export function RsvpForm({
  slug,
  functions: allFunctions,
  questions,
}: {
  slug: string;
  functions: RsvpFunction[];
  questions: RsvpQuestionId[];
}) {
  const locale = useLocale();
  const { rsvpCopy } = useText(publishText);
  const [token, setToken] = useState<string | null>(null);
  const [invitedTo, setInvitedTo] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<{ name: string } | null>(null);
  // A personal link brings a token before the guest has replied; the button says Send until then
  const [replied, setReplied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const thanks = useRef<HTMLHeadingElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  // Where focus goes once the form or the thanks has rendered, after a send or "change"
  const focusNext = useRef<"thanks" | "name" | null>(null);

  useEffect(() => {
    const target = focusNext.current === "thanks" ? thanks.current : nameInput.current;
    if (!focusNext.current) return;
    focusNext.current = null;
    target?.focus();
  }, [sent]);

  const functions = invitedTo.length
    ? allFunctions.filter((fn) => invitedTo.includes(fn.id))
    : allFunctions;
  const choiceOf = (id: string): Choice => choices[id] ?? { status: null, adults: 1, children: 0 };

  // A personal link (?g=) or an earlier reply on this device fills the form back in
  useEffect(() => {
    const fromLink = new URLSearchParams(window.location.search).get("g");
    const known = fromLink ?? storedToken(slug);
    if (!known) return;
    let cancelled = false;
    void loadReply(slug, known).then((reply: GuestReply | null) => {
      if (cancelled || !reply) return;
      setToken(known);
      setInvitedTo(reply.functionIds);
      setName(reply.name);
      setMessage(reply.message);
      setAnswers(reply.answers);
      setChoices(
        Object.fromEntries(
          reply.replies.map((item) => [
            item.functionId,
            {
              status: item.status,
              adults: item.status === "declined" ? 1 : item.adults,
              children: item.children,
            },
          ]),
        ),
      );
      if (reply.replies.length) {
        setSent({ name: reply.name });
        setReplied(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const nameMissing = !name.trim();
  const unanswered = functions.filter((fn) => !choiceOf(fn.id).status);
  const problems = (nameMissing ? 1 : 0) + unanswered.length;

  const set = (id: string, change: Partial<Choice>) =>
    setChoices((current) => ({ ...current, [id]: { ...choiceOf(id), ...change } }));

  const acceptAll = () =>
    setChoices((current) =>
      Object.fromEntries(
        functions.map((fn) => [
          fn.id,
          { ...(current[fn.id] ?? { adults: 1, children: 0 }), status: "attending" as const },
        ]),
      ),
    );

  const submit = async () => {
    setChecked(true);
    setError(null);
    if (problems > 0) {
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>("#rsvp [aria-invalid='true']")
          ?.focus({ preventScroll: false });
      });
      return;
    }
    setBusy(true);
    const result = await sendReply(slug, token, {
      name: name.trim(),
      message,
      answers,
      replies: functions.map((fn) => {
        const choice = choiceOf(fn.id);
        return {
          functionId: fn.id,
          status: choice.status!,
          adults: choice.adults,
          children: choice.children,
        };
      }),
    }).catch(() => ({ ok: false, reason: "failed" }) as const);
    setBusy(false);
    if (!result.ok) {
      setError(
        result.reason === "missing"
          ? rsvpCopy.missing
          : result.reason === "not-invited"
            ? rsvpCopy.notInvited
            : rsvpCopy.failed,
      );
      return;
    }
    setToken(result.token);
    storeToken(slug, result.token);
    focusNext.current = "thanks";
    setSent({ name: name.trim() });
    setReplied(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-5 rounded-xl border border-success/40 bg-success/5 p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <PartyPopper aria-hidden className="mt-1 size-7 shrink-0 text-success" />
          <div className="flex min-w-0 flex-col gap-1">
            <h3
              ref={thanks}
              tabIndex={-1}
              className="font-display text-2xl leading-tight break-words outline-none"
            >
              {rsvpCopy.thanksTitle(sent.name.split(" ")[0] ?? sent.name)}
            </h3>
            <p className="text-ink-muted">{rsvpCopy.thanksBody}</p>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {functions.map((fn) => {
            const choice = choiceOf(fn.id);
            if (!choice.status) return null;
            return (
              <li
                key={fn.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md border border-line bg-surface px-4 py-3"
              >
                <span className="font-semibold">{fn.name}</span>
                <span className="flex items-center gap-2 text-sm text-ink-muted">
                  <span aria-hidden className="text-accent-text [&_svg]:size-4.5">
                    {statusIcons[choice.status]}
                  </span>
                  {rsvpCopy.statuses[choice.status].short}
                  {choice.status !== "declined" &&
                    ` · ${rsvpCopy.people(choice.adults + choice.children)}`}
                </span>
              </li>
            );
          })}
        </ul>
        <Button
          variant="secondary"
          leadingIcon={<Pencil aria-hidden />}
          className="self-start"
          onClick={() => {
            focusNext.current = "name";
            setSent(null);
          }}
        >
          {rsvpCopy.change}
        </Button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
      className="flex flex-col gap-6"
    >
      <Field
        label={rsvpCopy.yourName}
        required
        error={checked && nameMissing ? rsvpCopy.nameRequired : undefined}
      >
        <Input
          ref={nameInput}
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          autoComplete="name"
          placeholder={rsvpCopy.namePlaceholder}
        />
      </Field>

      {functions.length > 1 && (
        <Button
          variant="secondary"
          leadingIcon={<CircleCheck aria-hidden />}
          className="self-start"
          onClick={acceptAll}
        >
          {rsvpCopy.acceptAll}
        </Button>
      )}

      <ol className="flex flex-col gap-4">
        {functions.map((fn) => {
          const choice = choiceOf(fn.id);
          const missing = checked && !choice.status;
          const headingId = `rsvp-${fn.kind}`;
          return (
            <li
              key={fn.id}
              className={cn(
                "flex flex-col gap-3 rounded-lg border bg-surface p-4 shadow-raised sm:p-5",
                missing ? "border-danger" : "border-line",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 id={headingId} className="font-display text-xl leading-tight">
                  {fn.name}
                </h3>
                {fn.date && (
                  <span className="text-sm text-ink-muted">
                    {format(parseISO(fn.date), "EEE, d MMM", { locale: dateLocale[locale] })}
                  </span>
                )}
              </div>
              <RadioGroup
                label={rsvpCopy.statusGroup(fn.name)}
                variant="segment"
                orientation="horizontal"
                value={choice.status ?? ""}
                invalid={missing}
                onValueChange={(status) => set(fn.id, { status: status as ReplyStatus })}
              >
                {(["attending", "maybe", "declined"] as const).map((status) => (
                  <RadioItem
                    key={status}
                    value={status}
                    icon={statusIcons[status]}
                    label={rsvpCopy.statuses[status].short}
                  />
                ))}
              </RadioGroup>
              {missing && <p className="text-sm font-medium text-danger">{rsvpCopy.chooseOne}</p>}
              {choice.status && choice.status !== "declined" && (
                <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2 sm:gap-6">
                  <Counter
                    label={rsvpCopy.adults}
                    value={choice.adults}
                    min={choice.children > 0 ? 0 : 1}
                    onChange={(adults) => set(fn.id, { adults })}
                  />
                  <Counter
                    label={rsvpCopy.children}
                    value={choice.children}
                    min={0}
                    onChange={(children) =>
                      set(fn.id, {
                        children,
                        adults: children === 0 ? Math.max(1, choice.adults) : choice.adults,
                      })
                    }
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {questions.length > 0 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 font-display text-xl">{rsvpCopy.questionsHeading}</legend>
          {questions.map((id) => (
            <Question
              key={id}
              id={id}
              value={answers[id] ?? ""}
              onChange={(value) => setAnswers((current) => ({ ...current, [id]: value }))}
            />
          ))}
        </fieldset>
      )}

      <Field label={rsvpCopy.message} optionalLabel={rsvpCopy.optional}>
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={280}
          rows={3}
          placeholder={rsvpCopy.messagePlaceholder}
        />
      </Field>

      {checked && problems > 0 && (
        <p
          role="alert"
          className="rounded-md border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
        >
          {rsvpCopy.fixErrors(problems)}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        loading={busy}
        leadingIcon={<Send aria-hidden className="rtl:-scale-x-100" />}
        className="self-stretch sm:self-start"
      >
        {replied ? rsvpCopy.update : rsvpCopy.send}
      </Button>
    </form>
  );
}

function Question({
  id,
  value,
  onChange,
}: {
  id: RsvpQuestionId;
  value: string;
  onChange: (value: string) => void;
}) {
  const { questionLabels } = useText(categoriesText);
  const { rsvpCopy } = useText(publishText);
  const spec = RSVP_QUESTIONS[id];
  const label = questionLabels[id];
  if (spec.kind === "choice") {
    return (
      <Field label={label} optionalLabel={rsvpCopy.optional}>
        <Select
          value={value || undefined}
          onValueChange={onChange}
          placeholder={rsvpCopy.choose}
          options={(spec.options ?? []).map((option) => ({
            value: option,
            label: rsvpCopy.meal[option as keyof typeof rsvpCopy.meal] ?? option,
          }))}
        />
      </Field>
    );
  }
  if (spec.kind === "yes-no") {
    return (
      <div className="flex flex-col gap-1">
        <span aria-hidden className="font-semibold">
          {label}
        </span>
        <RadioGroup label={label} orientation="horizontal" value={value} onValueChange={onChange}>
          <RadioItem value="yes" label={rsvpCopy.yes} />
          <RadioItem value="no" label={rsvpCopy.no} />
        </RadioGroup>
      </div>
    );
  }
  if (spec.kind === "date") {
    return (
      <Field label={label} optionalLabel={rsvpCopy.optional}>
        <DatePicker
          value={value ? parseISO(value) : undefined}
          onValueChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
          placeholder={rsvpCopy.choose}
        />
      </Field>
    );
  }
  return (
    <Field label={label} optionalLabel={rsvpCopy.optional}>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={spec.maxLength ?? 120}
      />
    </Field>
  );
}
