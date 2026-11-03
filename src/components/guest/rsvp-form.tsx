"use client";

import { format, parseISO } from "date-fns";
import {
  CircleCheck,
  CircleHelp,
  CircleX,
  Lock,
  Minus,
  PartyPopper,
  Pencil,
  Plus,
  Send,
} from "lucide-react";
import Link from "next/link";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { sendReply } from "@/actions/rsvp";
import { guestReply, knownToken, storeToken } from "@/components/guest/guest-reply";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Quiet } from "@/components/ui/quiet";
import { Textarea } from "@/components/ui/textarea";
import { RSVP_QUESTIONS } from "@/lib/categories/questions";
import type { RsvpQuestionId } from "@/lib/categories/schema";
import type { FunctionId } from "@/lib/events/functions";
import type { GuestReply, ReplyStatus } from "@/lib/invites/rsvp";
import { cn } from "@/lib/cn";
import { useGuestLanguage, useGuestText } from "@/components/guest/guest-language";
import { formatCardDayMonth, type CardLanguage } from "@/lib/templates/card-languages";
import type { DayPickerLocale } from "react-day-picker";
import { bn, enIN, gu, hi, ta } from "react-day-picker/locale";

export type RsvpFunction = {
  /** The function's id for replies. */
  id: string;
  kind: FunctionId;
  name: string;
  date: string;
};

type Choice = { status: ReplyStatus | null; adults: number; children: number };

const MAX_PEOPLE = 20;

/** The arrival calendar in the guest's language; date-fns has no Marathi, so Devanagari Hindi stands in. */
const PICKER_LOCALES: Record<CardLanguage, DayPickerLocale> = { en: enIN, hi, mr: hi, gu, bn, ta };

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
  const { rsvpCopy } = useGuestText();
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col items-start gap-1">
      <span id={id} className="text-xs text-ink-muted">
        {label}
      </span>
      <span className="flex items-center rounded-full border border-line-strong bg-surface">
        <IconButton
          label={rsvpCopy.fewer(label)}
          icon={<Minus />}
          size="sm"
          variant="ghost"
          showTooltip={false}
          className="rounded-full [&_svg]:size-4"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        />
        <output aria-live="polite" className="w-6 text-center font-semibold tabular-nums">
          {value}
        </output>
        <IconButton
          label={rsvpCopy.more(label)}
          icon={<Plus />}
          size="sm"
          variant="ghost"
          showTooltip={false}
          className="rounded-full [&_svg]:size-4"
          disabled={value >= MAX_PEOPLE}
          onClick={() => onChange(Math.min(MAX_PEOPLE, value + 1))}
        />
      </span>
    </div>
  );
}

/** Each reply in its own colour once chosen, so a guest sees at a glance what they said. */
const statusChosen = {
  attending: "data-[state=checked]:border-success data-[state=checked]:bg-success/12",
  maybe: "data-[state=checked]:border-marigold data-[state=checked]:bg-marigold/18",
  declined: "data-[state=checked]:border-danger data-[state=checked]:bg-danger/10",
} as const;
const statusIconChosen = {
  attending: "group-data-[state=checked]/reply:text-success",
  maybe: "group-data-[state=checked]/reply:text-accent-text",
  declined: "group-data-[state=checked]/reply:text-danger",
} as const;

/** Coming, Maybe or Can't come for one celebration: three pills side by side. */
function ReplyChoice({
  label,
  value,
  invalid,
  onChange,
}: {
  label: string;
  value: ReplyStatus | null;
  invalid: boolean;
  onChange: (status: ReplyStatus) => void;
}) {
  const { rsvpCopy } = useGuestText();
  return (
    <RadioPrimitive.Root
      aria-label={label}
      aria-invalid={invalid || undefined}
      orientation="horizontal"
      value={value ?? ""}
      onValueChange={(status) => onChange(status as ReplyStatus)}
      className="grid grid-cols-3 gap-2"
    >
      {(["attending", "maybe", "declined"] as const).map((status) => (
        <RadioPrimitive.Item
          key={status}
          value={status}
          className={cn(
            "group/reply flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border bg-surface px-2 py-1.5 text-center text-sm leading-tight font-semibold text-ink",
            invalid ? "border-danger" : "border-line-strong",
            "transition-[background-color,border-color] duration-150 hover:border-ink-muted",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            // Tamil words run long and don't hyphenate: on the narrowest phones they set smaller
            "max-[399px]:[&:lang(ta)]:text-xs",
            statusChosen[status],
          )}
        >
          <span
            aria-hidden
            className={cn(
              "hidden shrink-0 text-ink-muted min-[480px]:inline [&_svg]:size-4",
              statusIconChosen[status],
            )}
          >
            {statusIcons[status]}
          </span>
          <span className="min-w-0">{rsvpCopy.statuses[status].short}</span>
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}

/** A yes-or-no or a short list of choices, as pills that wrap. */
function Pills({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <RadioPrimitive.Root
      aria-label={label}
      orientation="horizontal"
      value={value}
      onValueChange={onChange}
      className="flex flex-wrap gap-2"
    >
      {options.map((option) => (
        <RadioPrimitive.Item
          key={option.value}
          value={option.value}
          className={cn(
            "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink",
            "transition-[background-color,border-color] duration-150 hover:border-ink-muted",
            "data-[state=checked]:border-marigold data-[state=checked]:bg-marigold/18",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          {option.label}
        </RadioPrimitive.Item>
      ))}
    </RadioPrimitive.Root>
  );
}

/**
 * A small label over a part of the form, naming its section. Not a heading, so the guest
 * page's own headings (such as the celebrations above) stay the only ones with their words.
 */
function PartHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="font-label text-xs tracking-[0.18em] text-ink-muted uppercase">
      {children}
    </p>
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
  preview = false,
  sayPreview = false,
  sample = false,
  makeHref = null,
}: {
  slug: string;
  functions: RsvpFunction[];
  questions: RsvpQuestionId[];
  /** The host's own look before publishing: the form works, but nothing is sent. */
  preview?: boolean;
  /** Says so above the form, for a family preview link that could be passed on to guests. */
  sayPreview?: boolean;
  /** A design's public sample: the reply goes through to the thanks, and nothing is sent. */
  sample?: boolean;
  /** On a live invitation: after replying, a guest can make one like it. */
  makeHref?: string | null;
}) {
  const language = useGuestLanguage();
  const { rsvpCopy, guestCopy } = useGuestText();
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
  // Hidden from people; a bot that fills in every field fills this too
  const trap = useRef<HTMLInputElement>(null);
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
    const known = knownToken(slug);
    if (!known) return;
    let cancelled = false;
    void guestReply(slug, known).then((reply: GuestReply | null) => {
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
        const invalid = document.querySelector<HTMLElement>("#rsvp [aria-invalid='true']");
        const target = invalid?.matches("input, textarea, button")
          ? invalid
          : invalid?.querySelector<HTMLElement>("button");
        target?.focus({ preventScroll: false });
      });
      return;
    }
    if (preview) {
      setError(rsvpCopy.previewOnly);
      return;
    }
    if (sample) {
      focusNext.current = "thanks";
      setSent({ name: name.trim() });
      setReplied(true);
      return;
    }
    setBusy(true);
    const result = await sendReply(slug, token, {
      name: name.trim(),
      message,
      answers,
      website: trap.current?.value ?? "",
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
            : result.reason === "full"
              ? rsvpCopy.full
              : result.reason === "too-many"
                ? rsvpCopy.tooMany
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
            <p className="text-ink-muted">{sample ? rsvpCopy.sampleSent : rsvpCopy.thanksBody}</p>
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
        {makeHref && !preview && !sample && (
          <p data-make-like-this className="border-t border-success/30 pt-4 text-sm text-ink-muted">
            {guestCopy.makeOwnTitle}{" "}
            <Link
              href={makeHref}
              className="inline-flex min-h-11 items-center font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {guestCopy.makeOwn}
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <Quiet>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-7"
      >
        {/* Said before anything is filled in, so nobody takes a family link for the real thing;
          the host's own preview stays as guests will see it (owner, 2026-10-27) */}
        {preview && sayPreview && (
          <p
            data-preview-replies
            className="flex items-start gap-3 rounded-lg border border-marigold/50 bg-marigold/10 p-4 text-sm font-medium text-ink"
          >
            <Lock aria-hidden className="mt-0.5 size-4.5 shrink-0 text-accent-text" />
            {rsvpCopy.previewNotice}
          </p>
        )}
        <div aria-hidden className="sr-only">
          <input
            ref={trap}
            type="text"
            name="website"
            aria-label="Website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
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

        <div role="group" aria-labelledby="rsvp-celebrations" className="flex flex-col">
          <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 border-b border-line pb-1">
            <PartHeading id="rsvp-celebrations">{rsvpCopy.celebrations}</PartHeading>
            {functions.length > 1 && (
              <button
                type="button"
                onClick={acceptAll}
                className="-me-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-accent-text hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <CircleCheck aria-hidden className="size-4" />
                {rsvpCopy.acceptAll}
              </button>
            )}
          </div>
          <ol className="flex flex-col divide-y divide-line">
            {functions.map((fn) => {
              const choice = choiceOf(fn.id);
              const missing = checked && !choice.status;
              return (
                <li key={fn.id} className="flex flex-col gap-3 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="font-display text-lg leading-snug break-words">{fn.name}</h3>
                    {fn.date && (
                      <span className="text-xs text-ink-muted">
                        {formatCardDayMonth(fn.date, language)}
                      </span>
                    )}
                  </div>
                  <ReplyChoice
                    label={rsvpCopy.statusGroup(fn.name)}
                    value={choice.status}
                    invalid={missing}
                    onChange={(status) => set(fn.id, { status })}
                  />
                  {missing && (
                    <p className="text-sm font-medium text-danger">{rsvpCopy.chooseOne}</p>
                  )}
                  {choice.status && choice.status !== "declined" && (
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
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
        </div>

        {questions.length > 0 && (
          <div role="group" aria-labelledby="rsvp-details" className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
              <PartHeading id="rsvp-details">{rsvpCopy.questionsHeading}</PartHeading>
              <span className="text-xs text-ink-muted">{rsvpCopy.optional}</span>
            </div>
            {questions.map((id) => (
              <Question
                key={id}
                id={id}
                value={answers[id] ?? ""}
                onChange={(value) => setAnswers((current) => ({ ...current, [id]: value }))}
              />
            ))}
          </div>
        )}

        <Field label={rsvpCopy.message} optionalLabel={rsvpCopy.optional}>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={280}
            rows={2}
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
          loading={busy}
          leadingIcon={<Send aria-hidden className="rtl:-scale-x-100" />}
          className="min-h-12 w-full"
        >
          {replied ? rsvpCopy.update : rsvpCopy.send}
        </Button>
      </form>
    </Quiet>
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
  const { questionLabels, rsvpCopy } = useGuestText();
  const language = useGuestLanguage();
  const spec = RSVP_QUESTIONS[id];
  const label = questionLabels[id];
  if (spec.kind === "choice" || spec.kind === "yes-no") {
    const options =
      spec.kind === "choice"
        ? (spec.options ?? []).map((option) => ({
            value: option,
            label: rsvpCopy.meal[option as keyof typeof rsvpCopy.meal] ?? option,
          }))
        : [
            { value: "yes", label: rsvpCopy.yes },
            { value: "no", label: rsvpCopy.no },
          ];
    return (
      <div className="flex flex-col gap-2">
        <span aria-hidden className="text-sm font-semibold text-ink">
          {label}
        </span>
        <Pills label={label} value={value} options={options} onChange={onChange} />
      </div>
    );
  }
  if (spec.kind === "date") {
    return (
      <Field label={label}>
        <DatePicker
          locale={PICKER_LOCALES[language]}
          value={value ? parseISO(value) : undefined}
          onValueChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
          placeholder={rsvpCopy.choose}
        />
      </Field>
    );
  }
  return (
    <Field label={label}>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={spec.maxLength ?? 120}
      />
    </Field>
  );
}
