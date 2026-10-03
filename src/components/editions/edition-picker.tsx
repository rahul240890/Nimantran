"use client";

import { Check, LockOpen, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { beginCheckout, finishCheckout, tryCoupon } from "@/actions/checkout";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Price } from "@/lib/plans/offers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import {
  PLANS,
  PLAN_IDS,
  formatRupees,
  planRank,
  type PaidPlanId,
  type PlanId,
} from "@/lib/plans/catalog";
import { useText } from "@/i18n/client";
import { editionsText } from "@/i18n/copy/editions";

/*
 * The plan cards for one invite, and paying for one. Razorpay's own checkout window takes
 * the payment (UPI, cards, netbanking); the server then checks it before anything unlocks.
 */

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckout = { open(): void; on(event: string, handler: () => void): void };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayCheckout;
  }
}

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.head.append(script);
  });
}

/** The site's marigold for Razorpay's window, read from the design tokens. */
const brandColour = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--marigold").trim() || undefined;

export type EditionPickerProps = {
  inviteId: string;
  current: PlanId;
  /** The lowest edition the invite fits in as it stands. */
  needed: PlanId;
  /** A plan to point at, from the publish dialog's link. */
  focus: PlanId | null;
  active: boolean;
  /** Only the invite's owner pays; co-hosts see the editions and prices. */
  canPay?: boolean;
  prefill: { name: string; email: string | null; phone: string | null };
  /** Each edition's price now, with any festival offer running. */
  prices: Partial<Record<PaidPlanId, Price>>;
};

type Pending = { plan: PaidPlanId; stage: "opening" | "checking" } | null;
type PreviewPay = { plan: PaidPlanId; orderId: string; amountPaise: number } | null;

export function EditionPicker({
  inviteId,
  current,
  needed,
  focus,
  active,
  canPay = true,
  prefill,
  prices: offerPrices,
}: EditionPickerProps) {
  const { upgradeCopy, planCopy } = useText(editionsText);
  const router = useRouter();
  const [coupon, setCoupon] = useState<{
    code: string;
    prices: Partial<Record<PaidPlanId, Price>>;
  } | null>(null);
  const prices = coupon?.prices ?? offerPrices;
  const [pending, setPending] = useState<Pending>(null);
  const [previewPay, setPreviewPay] = useState<PreviewPay>(null);

  const confirm = async (plan: PaidPlanId, response: RazorpayResponse) => {
    setPending({ plan, stage: "checking" });
    const result = await finishCheckout({
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature,
    }).catch(() => ({ ok: false }) as const);
    setPending(null);
    if (result.ok) {
      toast({
        title: upgradeCopy.paid(planCopy[result.planId].name),
        description: upgradeCopy.paidBody,
        tone: "success",
      });
      router.refresh();
    } else {
      toast({ title: upgradeCopy.failed, tone: "error" });
    }
  };

  const buy = async (plan: PaidPlanId) => {
    if (pending) return;
    setPending({ plan, stage: "opening" });
    const started = await beginCheckout({ inviteId, planId: plan, code: coupon?.code }).catch(
      () => ({ ok: false, reason: "failed" }) as const,
    );
    if (!started.ok) {
      setPending(null);
      toast({
        title: started.reason === "off" ? upgradeCopy.off : upgradeCopy.loadFailed,
        tone: "error",
      });
      if (started.reason === "already") router.refresh();
      return;
    }
    if (started.provider === "preview") {
      setPending(null);
      setPreviewPay({ plan, orderId: started.orderId, amountPaise: started.amountPaise });
      return;
    }
    if (!(await loadCheckout()) || !window.Razorpay) {
      setPending(null);
      toast({ title: upgradeCopy.loadFailed, tone: "error" });
      return;
    }
    const checkout = new window.Razorpay({
      key: started.keyId,
      order_id: started.orderId,
      amount: started.amountPaise,
      currency: "INR",
      name: site.name,
      description: planCopy[plan].name,
      prefill: {
        name: prefill.name || undefined,
        email: prefill.email ?? undefined,
        contact: prefill.phone ?? undefined,
      },
      notes: { invite: inviteId },
      theme: { color: brandColour() },
      handler: (response: RazorpayResponse) => void confirm(plan, response),
      modal: {
        ondismiss: () => {
          setPending(null);
          toast({ title: upgradeCopy.cancelled });
        },
      },
    });
    checkout.open();
  };

  return (
    <div className="flex flex-col gap-6">
      {!active && (
        <p
          role="status"
          className="rounded-md border border-line bg-surface-2 px-4 py-3 text-sm text-ink-muted"
        >
          {upgradeCopy.off}
        </p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PLAN_IDS.map((id) => {
          const plan = PLANS[id];
          const copy = planCopy[id];
          const isCurrent = id === current;
          const below = planRank(id) < planRank(current);
          const price = id === "free" ? null : (prices[id] ?? null);
          const isDifference = price !== null && current !== "free";
          const offer = price?.coupon && price.discountPaise > 0 ? price.coupon : null;
          const highlighted = (focus ?? needed) === id && planRank(id) > planRank(current);
          const busy = pending?.plan === id;
          return (
            <li key={id} className="flex">
              <article
                aria-labelledby={`plan-${id}`}
                className={cn(
                  "relative flex w-full flex-col gap-4 rounded-lg border bg-surface p-5 shadow-raised sm:p-6",
                  highlighted
                    ? "border-marigold-edge ring-2 ring-marigold/45"
                    : isCurrent
                      ? "border-line-strong"
                      : "border-line",
                )}
              >
                {/* Keeps the cards' names level side by side; a stacked card with no badge skips it */}
                <div
                  className={cn(
                    "min-h-7 flex-wrap items-center gap-2",
                    isCurrent || highlighted ? "flex" : "hidden sm:flex",
                  )}
                >
                  {isCurrent && <Badge tone="gold">{upgradeCopy.currentBadge}</Badge>}
                  {highlighted && (
                    <Badge tone="success" dot>
                      {upgradeCopy.needed}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 id={`plan-${id}`} className="font-display text-2xl leading-tight">
                    {copy.name}
                  </h2>
                  <p className="text-sm text-ink-muted">{copy.bestFor}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="font-display text-[2.2rem] leading-none tabular-nums">
                      {formatRupees(
                        offer && price && !isDifference ? price.amountPaise : plan.pricePaise,
                      )}
                    </span>
                    {offer && price && !isDifference && (
                      <s className="text-lg text-ink-muted tabular-nums">
                        <span className="sr-only">{upgradeCopy.was} </span>
                        {formatRupees(price.listPaise)}
                      </s>
                    )}
                  </p>
                  {offer && (
                    <p className="text-sm font-semibold text-success">
                      {upgradeCopy.offer(
                        offer.label || offer.code,
                        formatRupees(price!.discountPaise),
                      )}
                    </p>
                  )}
                </div>
                <ul className="flex flex-1 flex-col gap-2 text-sm">
                  {copy.highlights.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-accent-text"
                        strokeWidth={2.5}
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                {id === "free" || isCurrent || below ? (
                  <p className="flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-muted">
                    <LockOpen aria-hidden className="size-4" />
                    {isCurrent ? upgradeCopy.current : upgradeCopy.included}
                  </p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <Button
                      variant={highlighted ? "primary" : "secondary"}
                      disabled={!active || !canPay || (pending !== null && !busy)}
                      loading={busy}
                      onClick={() => void buy(id)}
                      leadingIcon={<Sparkles aria-hidden />}
                      className="w-full"
                    >
                      {isDifference
                        ? upgradeCopy.payDifference(formatRupees(price!.amountPaise))
                        : upgradeCopy.pay(formatRupees(price!.amountPaise))}
                    </Button>
                    {isDifference && (
                      <p className="text-center text-xs text-ink-muted">{upgradeCopy.difference}</p>
                    )}
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ul>
      {active && canPay && current !== "bundle" && (
        <CouponForm inviteId={inviteId} applied={coupon?.code ?? null} onApply={setCoupon} />
      )}
      <p role="status" aria-live="polite" className="sr-only">
        {pending?.stage === "opening"
          ? upgradeCopy.opening
          : pending?.stage === "checking"
            ? upgradeCopy.checking
            : ""}
      </p>
      <div className="flex flex-col gap-1 text-sm text-ink-muted">
        <p className="flex items-center gap-2">
          <ShieldCheck aria-hidden className="size-4 shrink-0 text-success" />
          {upgradeCopy.secure}
        </p>
        <p>{upgradeCopy.refunds}</p>
      </div>

      <Dialog open={previewPay !== null} onOpenChange={(open) => !open && setPreviewPay(null)}>
        {previewPay && (
          <DialogContent
            title={upgradeCopy.previewCheckout.title}
            description={upgradeCopy.previewCheckout.body(formatRupees(previewPay.amountPaise))}
            closeLabel={upgradeCopy.previewCheckout.cancel}
            footer={
              <>
                <Button variant="secondary" onClick={() => setPreviewPay(null)}>
                  {upgradeCopy.previewCheckout.cancel}
                </Button>
                <Button
                  onClick={() => {
                    const { plan, orderId } = previewPay;
                    setPreviewPay(null);
                    void confirm(plan, {
                      razorpay_order_id: orderId,
                      razorpay_payment_id: `pay_preview_${Date.now().toString(36)}`,
                      razorpay_signature: "preview",
                    });
                  }}
                >
                  {upgradeCopy.previewCheckout.pay}
                </Button>
              </>
            }
          />
        )}
      </Dialog>
    </div>
  );
}

/** "Have a coupon?": tries the code on the server and shows the new prices. */
function CouponForm({
  inviteId,
  applied,
  onApply,
}: {
  inviteId: string;
  applied: string | null;
  onApply: (coupon: { code: string; prices: Partial<Record<PaidPlanId, Price>> } | null) => void;
}) {
  const { upgradeCopy } = useText(editionsText);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (applied) {
    return (
      <p className="flex flex-wrap items-center gap-3 text-sm" role="status">
        <Badge tone="success" dot>
          {upgradeCopy.couponApplied(applied)}
        </Badge>
        <Button variant="ghost" size="sm" onClick={() => onApply(null)}>
          {upgradeCopy.couponRemove}
        </Button>
      </p>
    );
  }

  return (
    <form
      noValidate
      className="flex max-w-md flex-col gap-3 sm:flex-row sm:items-start"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!code.trim() || busy) return;
        setBusy(true);
        setError(null);
        const result = await tryCoupon({ inviteId, code }).catch(() => null);
        setBusy(false);
        if (result?.ok) {
          onApply({ code: result.code, prices: result.prices });
          toast({ title: upgradeCopy.couponApplied(result.code), tone: "success" });
        } else {
          setError(upgradeCopy.couponProblem[result?.reason ?? "unknown"]);
        }
      }}
    >
      <Field label={upgradeCopy.couponLabel} error={error ?? undefined} className="flex-1">
        <Input
          value={code}
          onChange={(event) => {
            setError(null);
            setCode(event.target.value.toUpperCase());
          }}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={30}
        />
      </Field>
      <Button type="submit" variant="secondary" loading={busy} className="sm:mt-8">
        {upgradeCopy.couponApply}
      </Button>
    </form>
  );
}
