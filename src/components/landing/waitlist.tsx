"use client";

import { CircleAlert, CircleCheck, Mail, Phone, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { joinWaitlist } from "@/actions/waitlist";
import { Mandala } from "@/components/brand/mandala";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { landingText } from "@/i18n/copy";
import { useLocale, useText } from "@/i18n/client";
import { waitlistDraft } from "@/lib/waitlist/draft";
import { validateWaitlist, type WaitlistErrors, type WaitlistField } from "@/lib/waitlist/schema";

const fieldOrder: WaitlistField[] = ["name", "email", "phone", "occasion"];

type Status =
  { kind: "idle" } | { kind: "sending" } | { kind: "failed" } | { kind: "joined"; name: string };

function WaitlistForm({ onJoined }: { onJoined: (name: string) => void }) {
  const { waitlist } = useText(landingText);
  const f = waitlist.form;
  const locale = useLocale();
  const draft = useSyncExternalStore(
    waitlistDraft.subscribe,
    waitlistDraft.get,
    waitlistDraft.getServer,
  );
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  const update = (field: WaitlistField, value: string) => {
    const next = { ...draft, [field]: value };
    waitlistDraft.set(next);
    // Once someone has tried to submit, errors clear as soon as a field is fixed
    if (submitted || errors[field]) {
      const result = validateWaitlist(next, waitlist.errors);
      setErrors((current) => ({
        ...current,
        [field]: result.ok ? undefined : result.errors[field],
      }));
    }
  };

  const checkOnBlur = (field: WaitlistField) => {
    if (draft[field].trim() === "") return; // don't scold an empty field someone tabbed past
    const result = validateWaitlist(draft, waitlist.errors);
    setErrors((current) => ({ ...current, [field]: result.ok ? undefined : result.errors[field] }));
  };

  const focusFirstError = (found: WaitlistErrors) => {
    const first = fieldOrder.find((field) => found[field]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
    // The occasion wrapper holds the select's button; everything else is the input itself
    (el?.matches("input") ? el : el?.querySelector<HTMLElement>("button"))?.focus();
  };

  const submit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (status.kind === "sending") return;
    setSubmitted(true);
    const result = validateWaitlist(draft, waitlist.errors);
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    const honeypot = new FormData(formRef.current ?? undefined).get("website");
    try {
      const response = await joinWaitlist(
        draft,
        typeof honeypot === "string" ? honeypot : "",
        locale,
      );
      if (response.status === "joined") {
        waitlistDraft.clear();
        onJoined(response.name.split(/\s+/)[0] ?? response.name);
        return;
      }
      if (response.status === "invalid") {
        setErrors(response.errors);
        setStatus({ kind: "idle" });
        focusFirstError(response.errors);
        return;
      }
      setStatus({ kind: "failed" });
    } catch {
      setStatus({ kind: "failed" });
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="flex flex-col gap-5">
      {status.kind === "failed" ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-danger/40 bg-danger/10 p-4 sm:flex-row sm:items-center"
        >
          <p className="flex flex-1 items-start gap-2 font-medium text-danger">
            <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
            {waitlist.errors.failed}
          </p>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<RotateCcw aria-hidden />}
            onClick={() => void submit()}
          >
            {waitlist.errors.retry}
          </Button>
        </div>
      ) : null}

      <p role="status" className="sr-only">
        {submitted && errorCount > 0 ? waitlist.errors.summary : ""}
      </p>

      <Field label={f.name} required error={errors.name}>
        <Input
          data-field="name"
          name="name"
          autoComplete="name"
          value={draft.name}
          onChange={(event) => update("name", event.target.value)}
          onBlur={() => checkOnBlur("name")}
          maxLength={120}
        />
      </Field>

      <Field label={f.email} required hint={f.emailHint} error={errors.email}>
        <Input
          data-field="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          leading={<Mail />}
          value={draft.email}
          onChange={(event) => update("email", event.target.value)}
          onBlur={() => checkOnBlur("email")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f.phone} optionalLabel={f.optional} hint={f.phoneHint} error={errors.phone}>
          <Input
            data-field="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            leading={<Phone />}
            value={draft.phone}
            onChange={(event) => update("phone", event.target.value)}
            onBlur={() => checkOnBlur("phone")}
          />
        </Field>

        <Field label={f.occasion} required error={errors.occasion}>
          <div data-field="occasion">
            <Select
              name="occasion"
              placeholder={f.occasionPlaceholder}
              options={f.occasions.map((option) => ({ ...option }))}
              value={draft.occasion || undefined}
              onValueChange={(value) => update("occasion", value)}
            />
          </div>
        </Field>
      </div>

      {/* Hidden from people; bots that fill every field are quietly ignored */}
      <div aria-hidden className="absolute -start-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <Button type="submit" size="lg" fullWidth loading={status.kind === "sending"}>
        {status.kind === "sending" ? f.sending : f.submit}
      </Button>
      <p className="text-center text-sm text-ink-muted">{f.privacy}</p>
    </form>
  );
}

function Joined({ name, onAgain }: { name: string; onAgain: () => void }) {
  const { waitlist } = useText(landingText);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div role="status" className="flex animate-pop-in flex-col items-center gap-5 py-6 text-center">
      <div className="relative grid size-28 place-items-center">
        <Mandala className="absolute inset-0 size-full text-marigold/60 motion-safe:animate-[spin_40s_linear_infinite] motion-still:animate-none" />
        <span className="relative grid size-16 place-items-center rounded-full bg-surface text-success shadow-float ring-1 ring-line">
          <CircleCheck aria-hidden className="size-8" />
        </span>
      </div>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-3xl leading-tight outline-none"
      >
        {waitlist.success.title(name)}
      </h3>
      <p className="max-w-sm text-ink-muted">{waitlist.success.body}</p>
      <Button variant="ghost" onClick={onAgain}>
        {waitlist.success.again}
      </Button>
    </div>
  );
}

export function Waitlist() {
  const { waitlist } = useText(landingText);
  const [joined, setJoined] = useState<string | null>(null);

  return (
    <section
      id="waitlist"
      tabIndex={-1}
      aria-labelledby="waitlist-title"
      className="relative isolate scroll-mt-16 overflow-x-clip outline-none"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 40%, color-mix(in srgb, var(--marigold) 16%, transparent), transparent), radial-gradient(50% 50% at 90% 80%, color-mix(in srgb, var(--rose) 10%, transparent), transparent)",
        }}
      />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="flex reveal-on-scroll flex-col gap-5">
          <p className="flex items-center gap-3 font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            <span aria-hidden className="h-px w-6 bg-marigold" />
            {waitlist.eyebrow}
          </p>
          <h2
            id="waitlist-title"
            className="font-display text-[2.1rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]"
          >
            {waitlist.title}
          </h2>
          <p className="max-w-lg text-lg text-ink-muted">{waitlist.intro}</p>
          <ul className="mt-2 flex flex-col gap-3">
            {waitlist.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <Sparkles aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        <Card className="p-5 shadow-float sm:p-8">
          <span
            aria-hidden
            className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-marigold to-transparent"
          />
          {joined ? (
            <Joined name={joined} onAgain={() => setJoined(null)} />
          ) : (
            <WaitlistForm onJoined={setJoined} />
          )}
        </Card>
      </div>
    </section>
  );
}
