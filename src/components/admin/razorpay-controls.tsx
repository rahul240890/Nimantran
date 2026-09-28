"use client";

import { Check, Copy, PlugZap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { switchCheckout, testRazorpay } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import type { ConnectionCheck } from "@/lib/payments/razorpay";

/** Turns checkout on or off for every host. Saved as soon as it flips. */
export function CheckoutSwitch({ on, canTurnOn }: { on: boolean; canTurnOn: boolean }) {
  const router = useRouter();
  const [checked, setChecked] = useState(on);
  const [pending, startTransition] = useTransition();
  return (
    <Switch
      label="Checkout for hosts"
      description={
        checked
          ? "On: Free invites carry the watermark and hosts can buy editions."
          : canTurnOn
            ? "Off: every invite is free, with no watermark and no limits."
            : "Add the Razorpay keys below to turn this on."
      }
      checked={checked}
      disabled={pending || (!checked && !canTurnOn)}
      onCheckedChange={(next) => {
        setChecked(next);
        startTransition(async () => {
          const result = await switchCheckout(next).catch(() => null);
          if (result?.ok) {
            toast({ title: next ? "Checkout is on" : "Checkout is off", tone: "success" });
            router.refresh();
          } else {
            setChecked(!next);
            toast({
              title:
                result && !result.ok && result.reason === "no-keys"
                  ? "Add the Razorpay keys first"
                  : "Couldn't save. Try again.",
              tone: "error",
            });
          }
        });
      }}
    />
  );
}

const CHECK_MESSAGES: Record<Exclude<ConnectionCheck, { ok: true }>["reason"], string> = {
  missing: "The key id or key secret isn't set in Vercel yet.",
  rejected: "Razorpay refused these keys. Check the key id and secret are a pair.",
  unreachable: "Couldn't reach Razorpay. Try again in a minute.",
};

/** Asks Razorpay whether the keys work, without charging anything. */
export function TestConnection({ disabled }: { disabled: boolean }) {
  const [result, setResult] = useState<ConnectionCheck | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="secondary"
        size="sm"
        className="self-start"
        disabled={disabled}
        loading={pending}
        leadingIcon={<PlugZap aria-hidden />}
        onClick={() =>
          startTransition(async () => {
            setResult(
              (await testRazorpay().catch(() => null)) ?? { ok: false, reason: "unreachable" },
            );
          })
        }
      >
        Test connection
      </Button>
      <p role="status" className="min-h-5 text-sm font-medium">
        {result &&
          (result.ok ? (
            <span className="text-success">
              Connected to Razorpay in {result.mode === "live" ? "Live" : "Test"} mode.
            </span>
          ) : (
            <span className="text-danger">{CHECK_MESSAGES[result.reason]}</span>
          ))}
      </p>
    </div>
  );
}

/** A value to paste somewhere else, with a copy button. */
export function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <div className="flex min-w-0 items-stretch gap-2">
        <code className="flex min-h-11 min-w-0 flex-1 items-center rounded-md border border-line bg-surface-2 px-3 py-2 font-mono text-sm break-all">
          {value}
        </code>
        <Button
          variant="secondary"
          size="sm"
          aria-label={`Copy ${label.toLowerCase()}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              toast({ title: "Couldn't copy. Select the text instead.", tone: "error" });
            }
          }}
        >
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          <span className="max-sm:sr-only">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
    </div>
  );
}
