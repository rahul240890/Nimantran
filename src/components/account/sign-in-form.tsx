"use client";

import { ArrowLeft, ArrowRight, FlaskConical, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { sendCode, startGoogle, verifyCode } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { signInCopy } from "@/content/account";
import { firstName } from "@/lib/auth/account";
import { OTP_LENGTH, maskPhone, normalizePhone } from "@/lib/auth/phone";
import { CodeInput } from "./code-input";
import { refreshAccountHint } from "./use-account-hint";

const RESEND_SECONDS = 30;
/** Keeps the number and step through a refresh while the SMS arrives. */
const STORAGE_KEY = "nimantran-sign-in";

type ErrorKey = keyof typeof signInCopy.errors;

type Flow = { step: "phone" | "code"; input: string; phone: string };

const noop = () => () => {};
let savedCache: { raw: string | null; value: Omit<Flow, "step"> | null } | null = null;

function readSaved(): Omit<Flow, "step"> | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked
  }
  if (savedCache && savedCache.raw === raw) return savedCache.value;
  let value: Omit<Flow, "step"> | null = null;
  try {
    const parsed = JSON.parse(raw ?? "null") as Partial<Flow> | null;
    if (typeof parsed?.phone === "string" && parsed.phone) {
      value = { phone: parsed.phone, input: String(parsed.input ?? "") };
    }
  } catch {
    // Damaged: start over
  }
  savedCache = { raw, value };
  return value;
}

function GoogleGlyph() {
  // The G drawn in the text colour: brand colours are left to Google's own pages
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5">
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.4-1.66 4.1-5.27 4.1-3.17 0-5.76-2.63-5.76-5.87s2.59-5.87 5.76-5.87c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.78 3.93 14.7 3 12.18 3 7.13 3 3.04 7.08 3.04 12.3s4.09 9.3 9.14 9.3c5.28 0 8.78-3.7 8.78-8.93 0-.6-.07-1.06-.16-1.57Z"
      />
    </svg>
  );
}

export function SignInForm({
  next,
  preview,
  initialError,
}: {
  next: string;
  /** Preview mode: any number, code 123456. */
  preview: boolean;
  initialError?: ErrorKey;
}) {
  const router = useRouter();
  // A refresh while waiting for the SMS picks up at the code
  const saved = useSyncExternalStore(noop, readSaved, () => null);
  const [flow, setFlow] = useState<Flow | null>(null);
  const { step, input, phone } =
    flow ?? (saved ? { step: "code", ...saved } : { step: "phone", input: "", phone: "" });
  const update = (change: Partial<Flow>) => setFlow({ step, input, phone, ...change });
  const [code, setCode] = useState("");
  const [error, setError] = useState<ErrorKey | undefined>(initialError);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [sending, startSending] = useTransition();
  const [verifying, startVerifying] = useTransition();
  const [googling, startGoogling] = useTransition();
  const codeRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  // The resend countdown
  useEffect(() => {
    if (resendAt <= now) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [resendAt, now]);
  const wait = Math.max(0, Math.ceil((resendAt - now) / 1000));

  const send = (resend = false) =>
    startSending(async () => {
      setError(undefined);
      const result = await sendCode(resend ? phone : input);
      if (result.status === "invalid") {
        setError(result.error);
        phoneRef.current?.focus();
        return;
      }
      if (result.status === "failed") {
        setError(result.error);
        return;
      }
      update({ phone: result.phone, step: "code" });
      setCode("");
      setResendAt(Date.now() + RESEND_SECONDS * 1000);
      setNow(Date.now());
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ input, phone: result.phone }));
      } catch {
        // Storage blocked: a refresh starts over, nothing else changes
      }
      if (resend) toast({ title: signInCopy.resent, tone: "success" });
    });

  const verify = (value = code) =>
    startVerifying(async () => {
      if (value.length !== OTP_LENGTH) {
        setError("code");
        codeRef.current?.focus();
        return;
      }
      setError(undefined);
      const result = await verifyCode(phone, value, next);
      if (result.status !== "signed-in") {
        setError(result.status === "invalid" ? "code" : result.error);
        setCode("");
        codeRef.current?.focus();
        return;
      }
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing to clear
      }
      refreshAccountHint();
      toast({ title: signInCopy.success(firstName(result)), tone: "success" });
      router.replace(result.next);
      router.refresh();
    });

  const google = () =>
    startGoogling(async () => {
      setError(undefined);
      const result = await startGoogle(next);
      if (result.status === "failed") {
        setError(result.error);
        return;
      }
      window.location.assign(result.url);
    });

  const changeNumber = () => {
    update({ step: "phone" });
    setCode("");
    setError(undefined);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clear
    }
    requestAnimationFrame(() => phoneRef.current?.focus());
  };

  const message = error ? signInCopy.errors[error] : undefined;
  const phoneError = step === "phone" && (error === "required" || error === "invalid");

  return (
    <div className="flex flex-col gap-6">
      {preview && (
        <p className="flex items-start gap-2.5 rounded-md border border-marigold/45 bg-marigold/10 px-4 py-3 text-sm text-ink">
          <FlaskConical aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
          {signInCopy.previewNote}
        </p>
      )}

      {step === "phone" ? (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const parsed = normalizePhone(input);
            if ("error" in parsed) {
              setError(parsed.error);
              phoneRef.current?.focus();
              return;
            }
            send();
          }}
          className="flex animate-rise flex-col gap-5"
        >
          <Field
            label={signInCopy.phoneLabel}
            hint={signInCopy.phoneHint}
            error={phoneError ? message : undefined}
          >
            <Input
              ref={phoneRef}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={input}
              placeholder={signInCopy.phonePlaceholder}
              leading={<Phone />}
              onChange={(event) => {
                update({ input: event.target.value });
                if (phoneError) setError(undefined);
              }}
              className="text-lg tracking-wide"
            />
          </Field>
          <Button
            type="submit"
            fullWidth
            loading={sending}
            trailingIcon={<ArrowRight aria-hidden className="rtl:rotate-180" />}
          >
            {signInCopy.sendCode}
          </Button>
        </form>
      ) : (
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            verify();
          }}
          className="flex animate-rise flex-col gap-5"
        >
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl">{signInCopy.codeTitle}</h2>
            <p className="text-ink-muted" aria-live="polite">
              {signInCopy.codeSent(maskPhone(phone))}
            </p>
          </div>
          <Field label={signInCopy.codeLabel} error={message}>
            <CodeInput
              ref={codeRef}
              value={code}
              disabled={verifying}
              onChange={(value) => {
                setCode(value);
                if (error) setError(undefined);
              }}
              onComplete={(value) => verify(value)}
            />
          </Field>
          <Button type="submit" fullWidth loading={verifying}>
            {signInCopy.verify}
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={<ArrowLeft aria-hidden className="rtl:rotate-180" />}
              onClick={changeNumber}
              className="-ms-3"
            >
              {signInCopy.changeNumber}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={wait > 0}
              loading={sending}
              onClick={() => send(true)}
              className="-me-3"
            >
              {wait > 0 ? signInCopy.resendIn(wait) : signInCopy.resend}
            </Button>
          </div>
        </form>
      )}

      {/* Errors that aren't about one field, such as Google or the SMS service */}
      {step === "phone" && error && !phoneError && (
        <p
          role="alert"
          className="rounded-md border border-danger/35 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
        >
          {message}
        </p>
      )}

      {step === "phone" && (
        <>
          <div className="flex items-center gap-4 text-sm text-ink-muted" aria-hidden>
            <span className="h-px flex-1 bg-line" />
            {signInCopy.or}
            <span className="h-px flex-1 bg-line" />
          </div>
          <Button
            variant="secondary"
            fullWidth
            loading={googling}
            leadingIcon={<GoogleGlyph />}
            onClick={google}
          >
            {signInCopy.google}
          </Button>
          <p className="text-center text-sm text-ink-muted">{signInCopy.terms}</p>
        </>
      )}
    </div>
  );
}
