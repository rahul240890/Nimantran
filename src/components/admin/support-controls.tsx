"use client";

import { LifeBuoy, LogOut, PackageCheck, RefreshCw, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeInvitePackage, helpWithInvite, recheckPayment } from "@/actions/admin";
import { planCopy } from "@/content/editions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { RecheckResult } from "@/lib/payments/editions";
import { PLAN_IDS, type PlanId } from "@/lib/plans/catalog";

/** The search on Admin, Invites: names, email, phone, link or a Razorpay payment id. */
export function InviteSearch({ initial }: { initial: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initial);
  const [pending, startTransition] = useTransition();
  return (
    <form
      role="search"
      noValidate
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const q = query.trim();
        startTransition(() =>
          router.push(q ? `/admin/invites?q=${encodeURIComponent(q)}` : "/admin/invites"),
        );
      }}
    >
      <Field
        label="Find a host or invite"
        hint="Names on the card, the host's name, email or phone, the invite link, or a Razorpay payment id (pay_…)."
        className="min-w-0 flex-1"
      >
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="simmi@gmail.com, 98765 43210, pay_…"
          autoCapitalize="none"
          spellCheck={false}
        />
      </Field>
      <Button type="submit" loading={pending} leadingIcon={<Search aria-hidden />}>
        Search
      </Button>
    </form>
  );
}

/**
 * Steps in to help with an invite, or out again. Helping adds the admin as its "Shubh
 * support" co-host, so the invite's editor, video and cards open for them.
 */
export function HelpButton({ eventId, helping }: { eventId: string; helping: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant={helping ? "secondary" : "primary"}
      loading={pending}
      leadingIcon={helping ? <LogOut aria-hidden /> : <LifeBuoy aria-hidden />}
      onClick={() =>
        startTransition(async () => {
          const done = await helpWithInvite(eventId, !helping).catch(() => null);
          if (done) {
            toast({
              title: helping
                ? "You've stopped helping with this invite"
                : "You're helping with this invite. Its editor, video and cards are open to you.",
              tone: "success",
            });
            router.refresh();
          } else {
            toast({ title: "Couldn't change that. Try again.", tone: "error" });
          }
        })
      }
    >
      {helping ? "Stop helping" : "Help as support"}
    </Button>
  );
}

const EMAIL_RESULT = {
  sent: "and the host was emailed",
  "no-email": "but the host has no email address to write to",
  "not-configured": "but email isn't set up, so nothing was sent",
  failed: "but the email couldn't be sent",
} as const;

/** Sets an invite's package by hand, with a note emailed to the host when asked. */
export function PackageForm({ eventId, current }: { eventId: string; current: PlanId }) {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanId>(current === "free" ? "grand" : current);
  const [email, setEmail] = useState(true);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const sendsEmail = email && plan !== "free";
  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await changeInvitePackage({
            eventId,
            planId: plan,
            email: sendsEmail,
            note,
          }).catch(() => null);
          if (result?.ok) {
            const told = result.email ? `, ${EMAIL_RESULT[result.email]}` : "";
            toast({
              title: `${result.names || "The invite"} now has ${planCopy[plan].name}${told}.`,
              tone: result.email && result.email !== "sent" ? "info" : "success",
            });
            setNote("");
            router.refresh();
          } else {
            toast({ title: "Couldn't change the package. Try again.", tone: "error" });
          }
        });
      }}
    >
      <Field label="Package" className="sm:max-w-xs">
        <Select
          value={plan}
          onValueChange={(value) => setPlan(value as PlanId)}
          options={PLAN_IDS.map((id) => ({
            value: id,
            label: id === current ? `${planCopy[id].name} (now)` : planCopy[id].name,
          }))}
        />
      </Field>
      <Checkbox
        label="Email the host about it"
        description="Tells them their invite now has this package, with your note below."
        checked={sendsEmail}
        disabled={plan === "free"}
        onCheckedChange={(checked) => setEmail(checked === true)}
      />
      {sendsEmail && (
        <Field label="Your note" hint="Optional. For example: a gift for being a special customer.">
          <Textarea
            value={note}
            maxLength={500}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
          />
        </Field>
      )}
      <Button
        type="submit"
        className="self-start"
        loading={pending}
        disabled={plan === current}
        leadingIcon={<PackageCheck aria-hidden />}
      >
        {plan === "free" ? "Take the package away" : `Set ${planCopy[plan].name}`}
      </Button>
    </form>
  );
}

const RECHECK: Record<Exclude<RecheckResult, { ok: true }>["reason"], string> = {
  "not-found": "That order isn't there any more.",
  "not-paid": "Razorpay has no completed payment for this order.",
  unreachable: "Couldn't reach Razorpay. Try again in a minute.",
  failed: "Couldn't record the payment. Try again.",
};

/** Asks Razorpay again about an order still marked unpaid, and records it if it was paid. */
export function RecheckButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="secondary"
      size="sm"
      loading={pending}
      leadingIcon={<RefreshCw aria-hidden />}
      onClick={() =>
        startTransition(async () => {
          const result = await recheckPayment(orderId).catch(() => null);
          if (result?.ok) {
            toast({
              title: `Paid (${result.paymentId}). The invite has its package now.`,
              tone: "success",
            });
            router.refresh();
          } else {
            toast({
              title: result && !result.ok ? RECHECK[result.reason] : RECHECK.failed,
              tone: "error",
            });
          }
        })
      }
    >
      Check with Razorpay
    </Button>
  );
}
