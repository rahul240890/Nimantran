"use client";

import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { sendTestEmails } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const PROBLEMS = {
  invalid: "Check the email address.",
  "not-configured": "Sending is off: RESEND_API_KEY isn't set in Vercel.",
  failed: "Couldn't send. Try again.",
} as const;

/** Sends both new-account emails to an address, to see them in a real inbox. */
export function TestEmailForm({ initial }: { initial: string }) {
  const [to, setTo] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <form
      noValidate
      className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        startTransition(async () => {
          const result = await sendTestEmails(to).catch(() => null);
          if (result === "sent") {
            toast({ title: `Sent both emails to ${to.trim()}`, tone: "success" });
          } else {
            const problem = PROBLEMS[result ?? "failed"] ?? PROBLEMS.failed;
            if (result === "invalid") setError(problem);
            else toast({ title: problem, tone: "error" });
          }
        });
      }}
    >
      <Field label="Send to" error={error ?? undefined} className="flex-1">
        <Input
          type="email"
          autoComplete="email"
          value={to}
          onChange={(event) => {
            setError(null);
            setTo(event.target.value);
          }}
          placeholder="you@example.com"
        />
      </Field>
      <Button
        type="submit"
        loading={pending}
        disabled={!to.trim()}
        className="sm:mt-8"
        leadingIcon={<Send aria-hidden />}
      >
        Send test emails
      </Button>
    </form>
  );
}
