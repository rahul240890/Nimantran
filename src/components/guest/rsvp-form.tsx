"use client";

import { Lock, Minus, PartyPopper, Pencil, Plus, Send } from "lucide-react";
import Link from "next/link";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { sendReply } from "@/actions/rsvp";
import { guestReply, knownToken, storeToken } from "@/components/guest/guest-reply";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Quiet } from "@/components/ui/quiet";
import { Textarea } from "@/components/ui/textarea";
import { useGuestText } from "@/components/guest/guest-language";
import { formatPhone, normalizePhone } from "@/lib/auth/phone";
import type { FunctionId } from "@/lib/events/functions";
import type { GuestReply } from "@/lib/invites/rsvp";
import { cn } from "@/lib/cn";

export type RsvpFunction = {
  /** The function's id for replies. */
  id: string;
  kind: FunctionId;
  name: string;
  date: string;
};

type Answer = "yes" | "no";

const MAX_PEOPLE = 20;
/** The same in every language: an Indian number as it is written. */
const PHONE_PLACEHOLDER = "+91 98765 43210";

/** A small, spaced, uppercase label over each part of the form, as on the card itself. */
function Label({ children }: { children: ReactNode }) {
  return (
    <span className="font-label text-xs font-semibold tracking-[0.2em] text-accent-text uppercase">
      {children}
    </span>
  );
}

/** Rounded fields, so the form reads as part of the invitation rather than a web form. */
const ROUND_FIELD = "h-12 rounded-full px-5 text-base";

/**
 * The guest's reply, kept simple (owner, 2026-11-04): name, phone, yes or no, how many are
 * coming and a note. One answer covers every celebration the guest is invited to. No
 * sign-in: the first reply returns a private token, kept on this device (or carried in a
 * personal link as ?g=), which lets the guest change it later.
 */
export function RsvpForm({
  slug,
  functions,
  preview = false,
  sayPreview = false,
  sample = false,
  makeHref = null,
}: {
  slug: string;
  functions: RsvpFunction[];
  /** The host's own look before publishing: the form works, but nothing is sent. */
  preview?: boolean;
  /** Says so above the form, for a family preview link that could be passed on to guests. */
  sayPreview?: boolean;
  /** A design's public sample: the reply goes through to the thanks, and nothing is sent. */
  sample?: boolean;
  /** On a live invitation: after replying, a guest can make one like it. */
  makeHref?: string | null;
}) {
  const { rsvpCopy, guestCopy } = useGuestText();
  const [token, setToken] = useState<string | null>(null);
  const [invitedTo, setInvitedTo] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [people, setPeople] = useState(1);
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
  const answerId = useId();
  const peopleId = useId();

  useEffect(() => {
    const target = focusNext.current === "thanks" ? thanks.current : nameInput.current;
    if (!focusNext.current) return;
    focusNext.current = null;
    target?.focus();
  }, [sent]);

  const invited = invitedTo.length
    ? functions.filter((fn) => invitedTo.includes(fn.id))
    : functions;

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
      if (reply.answers.phone) setPhone(formatPhone(reply.answers.phone));
      if (reply.replies.length) {
        // Older replies were per celebration: yes when they are coming to any of them
        const coming = reply.replies.filter((item) => item.status !== "declined");
        setAnswer(coming.length ? "yes" : "no");
        const most = Math.max(1, ...coming.map((item) => item.adults + item.children));
        setPeople(Math.min(MAX_PEOPLE, most));
        setSent({ name: reply.name });
        setReplied(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const nameMissing = !name.trim();
  const phoneChecked = phone.trim() ? normalizePhone(phone) : null;
  const phoneBad = Boolean(phoneChecked && "error" in phoneChecked);
  const problems = (nameMissing ? 1 : 0) + (phoneBad ? 1 : 0) + (answer ? 0 : 1);

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
      phone: phoneChecked && "phone" in phoneChecked ? phoneChecked.phone : "",
      message,
      answers: {},
      website: trap.current?.value ?? "",
      replies: invited.map((fn) => ({
        functionId: fn.id,
        status: answer === "yes" ? "attending" : "declined",
        adults: answer === "yes" ? people : 1,
        children: 0,
      })),
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
      <div className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <PartyPopper aria-hidden className="mt-1 size-7 shrink-0 text-accent-text" />
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
        {answer && (
          <p className="rounded-full border border-line px-5 py-3 text-center font-semibold">
            {answer === "yes"
              ? `${rsvpCopy.statuses.attending.short} · ${rsvpCopy.people(people)}`
              : rsvpCopy.statuses.declined.short}
          </p>
        )}
        <Button
          variant="secondary"
          leadingIcon={<Pencil aria-hidden />}
          className="self-center rounded-full"
          onClick={() => {
            focusNext.current = "name";
            setSent(null);
          }}
        >
          {rsvpCopy.change}
        </Button>
        {makeHref && !preview && !sample && (
          <p
            data-make-like-this
            className="border-t border-line pt-4 text-center text-sm text-ink-muted"
          >
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
        data-rsvp-form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-6"
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
          label={<Label>{rsvpCopy.yourName}</Label>}
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
            className={ROUND_FIELD}
          />
        </Field>

        <Field
          label={<Label>{rsvpCopy.phone}</Label>}
          optionalLabel={rsvpCopy.optional}
          error={checked && phoneBad ? rsvpCopy.phoneInvalid : undefined}
        >
          <Input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            maxLength={20}
            autoComplete="tel"
            placeholder={PHONE_PLACEHOLDER}
            className={ROUND_FIELD}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <span id={answerId}>
            <Label>{rsvpCopy.willYouCome}</Label>
          </span>
          <RadioPrimitive.Root
            aria-labelledby={answerId}
            aria-invalid={(checked && !answer) || undefined}
            orientation="horizontal"
            value={answer ?? ""}
            onValueChange={(value) => setAnswer(value as Answer)}
            className="grid grid-cols-2 gap-3"
          >
            {(["yes", "no"] as const).map((value) => (
              <RadioPrimitive.Item
                key={value}
                value={value}
                className={cn(
                  "flex min-h-12 min-w-0 cursor-pointer items-center justify-center rounded-full border bg-surface px-3 py-2 text-center text-sm leading-tight font-semibold text-ink",
                  checked && !answer ? "border-danger" : "border-line-strong",
                  "transition-[background-color,border-color,color] duration-150 hover:border-ink-muted",
                  "data-[state=checked]:border-marigold data-[state=checked]:bg-marigold data-[state=checked]:text-on-marigold",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                )}
              >
                {value === "yes"
                  ? rsvpCopy.statuses.attending.label
                  : rsvpCopy.statuses.declined.label}
              </RadioPrimitive.Item>
            ))}
          </RadioPrimitive.Root>
          {checked && !answer && (
            <p className="text-sm font-medium text-danger">{rsvpCopy.chooseOne}</p>
          )}
        </div>

        {answer === "yes" && (
          <div role="group" aria-labelledby={peopleId} className="flex flex-col gap-2">
            <span id={peopleId}>
              <Label>{rsvpCopy.guests}</Label>
            </span>
            <span className="flex h-12 items-center justify-between rounded-full border border-line-control bg-surface px-1">
              <IconButton
                label={rsvpCopy.fewerGuests}
                size="sm"
                icon={<Minus />}
                variant="ghost"
                showTooltip={false}
                className="rounded-full [&_svg]:size-4"
                disabled={people <= 1}
                onClick={() => setPeople((was) => Math.max(1, was - 1))}
              />
              <output aria-live="polite" className="text-lg font-semibold tabular-nums">
                {people}
              </output>
              <IconButton
                label={rsvpCopy.moreGuests}
                size="sm"
                icon={<Plus />}
                variant="ghost"
                showTooltip={false}
                className="rounded-full [&_svg]:size-4"
                disabled={people >= MAX_PEOPLE}
                onClick={() => setPeople((was) => Math.min(MAX_PEOPLE, was + 1))}
              />
            </span>
          </div>
        )}

        <Field label={<Label>{rsvpCopy.message}</Label>} optionalLabel={rsvpCopy.optional}>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={280}
            rows={3}
            placeholder={rsvpCopy.messagePlaceholder}
            className="rounded-3xl px-5 py-3"
          />
        </Field>

        {checked && problems > 0 && (
          <p
            role="alert"
            className="rounded-2xl border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {rsvpCopy.fixErrors(problems)}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={busy}
          leadingIcon={<Send aria-hidden className="rtl:-scale-x-100" />}
          className="min-h-12 w-full rounded-full"
        >
          {replied ? rsvpCopy.update : rsvpCopy.send}
        </Button>
      </form>
    </Quiet>
  );
}
