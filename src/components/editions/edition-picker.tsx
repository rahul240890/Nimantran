"use client";

import { Check, Globe, LockOpen, ShieldCheck, Sparkles, TicketPercent, Users } from "lucide-react";
import { Image } from "@/components/ui/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { beginCheckout, finishCheckout, tryCoupon } from "@/actions/checkout";
import { PackageVideo, type PackageVideoProps } from "@/components/publish/video-card";
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
  PAID_PLAN_IDS,
  formatRupees,
  inviteLimit,
  packagePrice,
  type Edition,
  type PaidPlanId,
  type PlanId,
} from "@/lib/plans/catalog";
import type { DesignTier, Pricing } from "@/lib/plans/design-tiers";
import { useLocale, useText } from "@/i18n/client";
import { pagePath } from "@/lib/seo/paths";
import { editionsText } from "@/i18n/copy/editions";
import { funnel } from "@/lib/funnel";

/*
 * The three package cards for one invite, and paying for one. Razorpay's own checkout window takes
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

/**
 * Razorpay hides its own window when it closes. Should a failed payment leave its dark
 * backdrop behind, or the page unable to scroll, this lets the host back onto the page.
 */
function releasePage() {
  window.setTimeout(() => {
    for (const node of document.querySelectorAll<HTMLElement>(".razorpay-container")) {
      node.style.display = "none";
    }
    if (document.body.style.overflow === "hidden") document.body.style.overflow = "";
  }, 300);
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The site's marigold for Razorpay's window, read from the design tokens. */
const brandColour = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--marigold").trim() || undefined;

export type EditionPickerProps = {
  inviteId: string;
  /** The package the invite has on this design, and the design tier paid for. */
  edition: Edition;
  /** The tier of the design the invite is made with. */
  design: DesignTier;
  /** That design's id: the package bought here is for it alone. */
  designId: string;
  /** The lowest package the invite fits in as it stands. */
  needed: PlanId;
  /** A package to point at, from a link. */
  focus: PlanId | null;
  active: boolean;
  /** Only the invite's owner pays; co-hosts see the packages and prices. */
  canPay?: boolean;
  /** Razorpay's test keys: real UPI apps can't pay, so say what can. */
  testMode?: boolean;
  prefill: { name: string; email: string | null; phone: string | null };
  /** What each package costs this invite now, with any festival offer running. */
  prices: Partial<Record<PaidPlanId, Price>>;
  pricing: Pick<Pricing, "designs" | "packages" | "invites">;
  /** Back to the editor to publish, when the host came from its Publish button. */
  publishHref: string | null;
  /** The invitation video to preview on the Celebration card, made right there. */
  video?: PackageVideoProps | null;
  /** Codes from the offers page this host can use here, to apply in one tap. */
  offers?: readonly OfferChoice[];
};

/** An offer the host could apply: its code, title and what it takes off. */
export type OfferChoice = { code: string; label: string; value: string; image: string };

type Pending = { plan: PaidPlanId; stage: "opening" | "checking" } | null;
type PreviewPay = { plan: PaidPlanId; orderId: string; amountPaise: number } | null;

export function EditionPicker({
  inviteId,
  edition,
  design,
  designId,
  needed,
  focus,
  active,
  canPay = true,
  testMode = false,
  prefill,
  prices: offerPrices,
  pricing,
  publishHref,
  video = null,
  offers = [],
}: EditionPickerProps) {
  const { upgradeCopy, planCopy, invitesCount, invitesNote } = useText(editionsText);
  const router = useRouter();
  const [coupon, setCoupon] = useState<{
    code: string;
    prices: Partial<Record<PaidPlanId, Price>>;
  } | null>(null);
  const prices = coupon?.prices ?? offerPrices;
  const [pending, setPending] = useState<Pending>(null);
  const [previewPay, setPreviewPay] = useState<PreviewPay>(null);
  // A free invite's Basic is the free design as it is, with the small mark
  const current: PlanId = edition.plan;
  const pointAt = (focus ?? needed) === "free" ? "basic" : (focus ?? needed);

  const confirm = async (plan: PaidPlanId, response: RazorpayResponse) => {
    setPending({ plan, stage: "checking" });
    const result = await finishCheckout({
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature,
    }).catch(() => ({ ok: false }) as const);
    setPending(null);
    if (result.ok) paid(result.planId);
    else toast({ title: upgradeCopy.failed, tone: "error" });
  };

  /** The package is the invite's now: say so and show the page as it stands. */
  const paid = (plan: PaidPlanId) => {
    funnel("Payment completed", { plan, tier: design });
    toast({
      title: upgradeCopy.paid(planCopy[plan].name),
      description: upgradeCopy.paidBody,
      tone: "success",
    });
    // A coupon's prices were for the package before this one: the page's new prices,
    // with what's now paid marked as yours, take their place
    setCoupon(null);
    router.refresh();
    // The way on (publishing, or putting the design live) shows at the top of the page
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  const buy = async (plan: PaidPlanId) => {
    if (pending) return;
    setPending({ plan, stage: "opening" });
    const started = await beginCheckout({
      inviteId,
      planId: plan,
      code: coupon?.code,
      design: designId,
    }).catch(() => ({ ok: false, reason: "failed" }) as const);
    if (!started.ok) {
      setPending(null);
      toast({
        title: started.reason === "off" ? upgradeCopy.off : upgradeCopy.loadFailed,
        tone: "error",
      });
      if (started.reason === "already") router.refresh();
      return;
    }
    funnel("Checkout started", { plan, tier: design });
    // An offer covered the whole price: the server has already given the invite the package
    if (started.provider === "free") {
      setPending(null);
      paid(plan);
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
    // A failed attempt keeps Razorpay's window open to try again; closing it after one
    // says the payment failed rather than that it was cancelled
    let declined = false;
    const options = {
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
          releasePage();
          toast(
            declined
              ? {
                  title: upgradeCopy.declined,
                  description: testMode ? upgradeCopy.testMode : undefined,
                  tone: "error",
                }
              : { title: upgradeCopy.cancelled },
          );
        },
      },
    };
    try {
      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", () => {
        declined = true;
      });
      checkout.open();
    } catch {
      setPending(null);
      releasePage();
      toast({ title: upgradeCopy.loadFailed, tone: "error" });
    }
  };

  const freeDesign = design === "free";

  return (
    <div className="flex flex-col gap-6">
      {/* On the way to publishing, the page's own banner already says so */}
      {!active && !publishHref && (
        <p
          role="status"
          className="rounded-md border border-line bg-surface-2 px-4 py-3 text-sm text-ink-muted"
        >
          {upgradeCopy.off}
        </p>
      )}
      {active && canPay && testMode && (
        <p
          role="note"
          className="rounded-md border border-line bg-surface-2 px-4 py-3 text-sm text-ink-muted"
        >
          {upgradeCopy.testMode}
        </p>
      )}
      <ul className="grid gap-4 lg:grid-cols-3">
        {PAID_PLAN_IDS.map((id) => {
          // On a free design, Basic costs nothing: the free invite with the small mark
          const freeBasic = id === "basic" && freeDesign;
          const copy = freeBasic ? { ...planCopy.free, name: planCopy.basic.name } : planCopy[id];
          const listPaise = packagePrice(id, design, pricing);
          const price = prices[id] ?? null;
          const isCurrent = id === current || (id === "basic" && current === "free");
          const isDifference = price !== null && current !== "free";
          const offer = price?.coupon && price.discountPaise > 0 ? price.coupon : null;
          const highlighted = pointAt === id && price !== null;
          const popular = id === "celebration";
          const busy = pending?.plan === id;
          const invites = invitesCount(inviteLimit(freeBasic ? "free" : id, pricing));
          return (
            <li key={id} className="flex">
              <article
                aria-labelledby={`plan-${id}`}
                className={cn(
                  "relative flex w-full flex-col gap-4 rounded-lg border bg-surface p-5 shadow-raised sm:p-6",
                  highlighted || (popular && !isCurrent && price !== null)
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
                    isCurrent || highlighted || popular ? "flex" : "hidden lg:flex",
                  )}
                >
                  {isCurrent && price === null && (
                    <Badge tone="gold">{upgradeCopy.currentBadge}</Badge>
                  )}
                  {popular && <Badge tone="gold">{upgradeCopy.popular}</Badge>}
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
                    <span className="font-display text-[1.9rem] leading-none tabular-nums">
                      {listPaise === 0 ||
                      (offer && price && !isDifference && price.amountPaise === 0)
                        ? upgradeCopy.free
                        : formatRupees(
                            offer && price && !isDifference ? price.amountPaise : listPaise,
                          )}
                    </span>
                    {offer && price && !isDifference && (
                      <s className="text-lg text-ink-muted tabular-nums">
                        <span className="sr-only">{upgradeCopy.was} </span>
                        {formatRupees(price.listPaise)}
                      </s>
                    )}
                  </p>
                  {id !== "basic" && (
                    <p className="text-sm text-ink-muted">
                      {upgradeCopy.addOn(formatRupees(pricing.packages[id]))}
                    </p>
                  )}
                  {offer && (
                    <p className="text-sm font-semibold text-success">
                      {upgradeCopy.offer(
                        offer.label || offer.code,
                        formatRupees(price!.discountPaise),
                      )}
                    </p>
                  )}
                </div>
                {/* How many guests it invites: what sets the three packages apart */}
                <p
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-3 py-2",
                    id === "basic"
                      ? "border-line bg-surface-2"
                      : "border-marigold-edge bg-marigold/10",
                  )}
                >
                  <Users aria-hidden className="size-5 shrink-0 text-accent-text" />
                  <span className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="font-display text-2xl leading-none tabular-nums">
                      {invites.value}
                    </span>
                    <span className="text-sm text-ink-muted">{invites.label}</span>
                  </span>
                </p>
                {/* The video is what Celebration and Grand add: both show it, made right here */}
                {id !== "basic" && video && <PackageVideo {...video} />}
                <ul className="flex flex-1 flex-col gap-2 text-sm">
                  {copy.highlights.map((line, index) => (
                    <li key={line} className="flex items-start gap-2">
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-accent-text"
                        strokeWidth={2.5}
                      />
                      <span className={cn(id !== "basic" && index === 1 && "font-semibold")}>
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
                {price === null ? (
                  freeBasic && isCurrent && publishHref ? (
                    <Button asChild variant="secondary" className="w-full">
                      <Link href={publishHref}>
                        <Globe aria-hidden />
                        {upgradeCopy.continueFree}
                      </Link>
                    </Button>
                  ) : (
                    <p className="flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-muted">
                      <LockOpen aria-hidden className="size-4" />
                      {isCurrent ? upgradeCopy.current : upgradeCopy.included}
                    </p>
                  )
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <Button
                      variant={highlighted || popular ? "primary" : "secondary"}
                      disabled={!active || !canPay || (pending !== null && !busy)}
                      loading={busy}
                      onClick={() => void buy(id)}
                      leadingIcon={<Sparkles aria-hidden />}
                      className="w-full"
                    >
                      {price.amountPaise === 0
                        ? upgradeCopy.getFree
                        : isDifference
                          ? upgradeCopy.payDifference(formatRupees(price.amountPaise))
                          : upgradeCopy.pay(formatRupees(price.amountPaise))}
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
      {active && canPay && current !== "grand" && (
        <CouponForm
          inviteId={inviteId}
          designId={designId}
          applied={coupon?.code ?? null}
          onApply={setCoupon}
          offers={offers}
        />
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
        <p>{invitesNote}</p>
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

/**
 * "Have a coupon?": tries the code on the server and shows the new prices. Offers from the
 * offers page that fit this invite sit above it, each applied in one tap.
 */
function CouponForm({
  inviteId,
  designId,
  applied,
  onApply,
  offers,
}: {
  inviteId: string;
  designId: string;
  applied: string | null;
  onApply: (coupon: { code: string; prices: Partial<Record<PaidPlanId, Price>> } | null) => void;
  offers: readonly OfferChoice[];
}) {
  const { upgradeCopy } = useText(editionsText);
  const locale = useLocale();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const apply = async (typed: string) => {
    if (!typed.trim() || busy) return;
    setBusy(typed);
    setError(null);
    const result = await tryCoupon({ inviteId, code: typed, design: designId }).catch(() => null);
    setBusy(null);
    if (result?.ok) {
      onApply({ code: result.code, prices: result.prices });
      toast({ title: upgradeCopy.couponApplied(result.code), tone: "success" });
    } else {
      setCode(typed);
      setError(upgradeCopy.couponProblem[result?.reason ?? "unknown"]);
    }
  };

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
    <div className="flex flex-col gap-5">
      {offers.length > 0 && (
        <section aria-labelledby="offers-for-you" className="flex flex-col gap-3">
          <h2
            id="offers-for-you"
            className="flex items-center gap-2 font-label text-xs tracking-[0.2em] text-accent-text uppercase"
          >
            <TicketPercent aria-hidden className="size-4" />
            {upgradeCopy.offersForYou}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <li
                key={offer.code}
                data-offer-choice={offer.code}
                className="group flex flex-col overflow-hidden rounded-lg border border-dashed border-marigold-edge bg-marigold/10"
              >
                <div className="offer-shine relative isolate h-24 overflow-hidden bg-night">
                  <Image
                    src={offer.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
                    className="-z-10 object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105 motion-still:transition-none motion-still:group-hover:scale-100"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/40 to-transparent"
                  />
                  <Sparkles
                    aria-hidden
                    className="absolute end-3 top-3 size-4 animate-twinkle text-card-gold"
                  />
                  <p className="absolute inset-x-0 bottom-0 p-3 font-display text-2xl leading-none text-card-ivory">
                    {offer.value}
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4 pb-3">
                  {offer.label && <p className="text-sm text-ink-muted">{offer.label}</p>}
                  <p translate="no" className="font-mono text-sm font-semibold tracking-[0.12em]">
                    {offer.code}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mx-4 mb-4 self-start"
                  loading={busy === offer.code}
                  disabled={busy !== null && busy !== offer.code}
                  onClick={() => void apply(offer.code)}
                >
                  {upgradeCopy.useOffer(offer.code)}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
      <form
        noValidate
        className="flex max-w-md flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={(event) => {
          event.preventDefault();
          void apply(code);
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
        <Button
          type="submit"
          variant="secondary"
          loading={busy !== null && busy === code}
          className="sm:mt-8"
        >
          {upgradeCopy.couponApply}
        </Button>
      </form>
      <p className="-mt-2 text-sm">
        <Link
          href={pagePath({ kind: "offers" }, locale)}
          className="inline-flex min-h-11 items-center font-semibold text-accent-text underline-offset-4 hover:underline"
        >
          {upgradeCopy.offersLink}
        </Link>
      </p>
    </div>
  );
}
