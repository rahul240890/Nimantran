"use client";

import {
  CalendarPlus,
  CircleCheck,
  CircleX,
  Lock,
  MessageCircle,
  PartyPopper,
  Pencil,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sendReply } from "@/actions/rsvp";
import { guestReply, knownToken, storeToken } from "@/components/guest/guest-reply";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import type { FunctionId } from "@/lib/events/functions";
import type { GuestReply } from "@/lib/invites/rsvp";
import { useGuestText } from "@/components/guest/guest-language";

export type RsvpFunction = {
  /** The function's id for replies. */
  id: string;
  kind: FunctionId;
  name: string;
  date: string;
};

/** Coming or not: one answer for every celebration the guest is invited to. */
type Answer = "attending" | "declined";

/** An earlier reply, given per celebration, read as one answer: coming to any is coming. */
function answerOf(reply: GuestReply): Answer | null {
  if (reply.replies.length === 0) return null;
  return reply.replies.some((item) => item.status !== "declined") ? "attending" : "declined";
}

/**
 * The guest's reply (owner, 2026-10-26): just their name and whether they are coming, one
 * answer for every celebration they are invited to, with no counts, questions or notes. No
 * sign-in: the first reply returns a private token, kept on this device (or carried in a
 * personal link as ?g=), which lets the guest change it later.
 */
export function RsvpForm({
  slug,
  functions: allFunctions,
  preview = false,
  sayPreview = false,
  sample = false,
  makeHref = null,
  calendarUrl = null,
  onComing,
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
  /** Every celebration in one calendar file, offered once the guest says they are coming. */
  calendarUrl?: string | null;
  /** Called when the guest says they are coming, for the page to celebrate with them. */
  onComing?: () => void;
}) {
  const { rsvpCopy, guestCopy } = useGuestText();
  const [token, setToken] = useState<string | null>(null);
  const [invitedTo, setInvitedTo] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [sent, setSent] = useState<{ name: string; answer: Answer } | null>(null);
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
      const earlier = answerOf(reply);
      setAnswer(earlier);
      if (earlier) {
        setSent({ name: reply.name, answer: earlier });
        setReplied(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const nameMissing = !name.trim();
  // The thanks, after a reply went through; a yes gets the page's petals too
  const thank = () => {
    focusNext.current = "thanks";
    setSent({ name: name.trim(), answer: answer! });
    setReplied(true);
    if (answer === "attending") onComing?.();
  };
  const problems = (nameMissing ? 1 : 0) + (answer ? 0 : 1);

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
    if (preview) {
      setError(rsvpCopy.previewOnly);
      return;
    }
    if (sample) {
      thank();
      return;
    }
    setBusy(true);
    const result = await sendReply(slug, token, {
      name: name.trim(),
      message: "",
      answers: {},
      website: trap.current?.value ?? "",
      // One answer for each celebration they are invited to, for one person
      replies: functions.map((fn) => ({
        functionId: fn.id,
        status: answer!,
        adults: 1,
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
    thank();
  };

  if (sent) {
    // The invitation's own public address to pass on in WhatsApp, never the guest's private
    // ?g= link or a family member's own page; a sample passes on the sample
    const shareUrl =
      typeof window === "undefined"
        ? null
        : `https://wa.me/?text=${encodeURIComponent(
            `${rsvpCopy.shareMessage} ${window.location.origin}${sample ? window.location.pathname : `/i/${slug}`}`,
          )}`;
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
            <p className="text-ink-muted">
              {sent.answer === "attending" ? rsvpCopy.thanksComing : rsvpCopy.thanksMissed}
            </p>
            <p className="text-sm text-ink-muted">
              {sample ? rsvpCopy.sampleSent : rsvpCopy.thanksBody}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {sent.answer === "attending" && calendarUrl && (
            <Button asChild variant="secondary">
              <a href={calendarUrl} download>
                <CalendarPlus aria-hidden />
                {guestCopy.addAll}
              </a>
            </Button>
          )}
          {shareUrl && (
            <Button asChild variant="secondary">
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden />
                {rsvpCopy.share}
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            leadingIcon={<Pencil aria-hidden />}
            onClick={() => {
              focusNext.current = "name";
              setSent(null);
            }}
          >
            {rsvpCopy.change}
          </Button>
        </div>
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
    <form
      noValidate
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

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-semibold">{rsvpCopy.answerGroup}</legend>
        <RadioGroup
          label={rsvpCopy.answerGroup}
          variant="card"
          value={answer ?? ""}
          invalid={checked && !answer}
          onValueChange={(value) => setAnswer(value as Answer)}
        >
          <RadioItem value="attending" icon={<CircleCheck />} label={rsvpCopy.answers.attending} />
          <RadioItem value="declined" icon={<CircleX />} label={rsvpCopy.answers.declined} />
        </RadioGroup>
        {checked && !answer && (
          <p className="text-sm font-medium text-danger">{rsvpCopy.chooseOne}</p>
        )}
      </fieldset>

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
