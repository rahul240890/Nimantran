import { ArrowLeft, FileText, ReceiptText, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { EditionPicker } from "@/components/editions/edition-picker";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/motion/page-transition";
import { getAccount } from "@/lib/auth/server";
import { inviteStore } from "@/lib/invites/store";
import { editionsActive, inviteReceipts, invitePlan, ownsInvite } from "@/lib/payments/editions";
import { checkoutCoupons } from "@/lib/payments/coupons";
import { formatRupees, isPlanId, planNeeded } from "@/lib/plans/catalog";
import { designTier, draftDesignId } from "@/lib/plans/design-defaults";
import { tierPlan } from "@/lib/plans/design-tiers";
import { pricesFor } from "@/lib/plans/offers";
import { getPricing } from "@/lib/plans/pricing";
import { inviteNames } from "@/lib/publish/describe";
import { editionsText } from "@/i18n/copy/editions";
import { getLocale, getText } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { upgradeCopy } = await getText(editionsText);
  return { title: upgradeCopy.metaTitle, robots: { index: false, follow: false } };
}

/** Choosing and paying for an invite's edition (Steps 15 to 17), with its receipts. */
export default async function EditionPage({
  params,
  searchParams,
}: PageProps<"/invites/[id]/edition">) {
  const { id } = await params;
  const { plan: focus } = await searchParams;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/edition`)}`);
  const [draft, current, owner] = await Promise.all([
    inviteStore()?.get(account, id),
    invitePlan(account, id),
    ownsInvite(account, id),
  ]);
  if (!draft || !current) notFound();
  const [active, receipts, locale, { upgradeCopy, planCopy }, coupons, pricing] = await Promise.all(
    [
      editionsActive(),
      inviteReceipts(account, id),
      getLocale(),
      getText(editionsText),
      checkoutCoupons().catch(() => []),
      getPricing(),
    ],
  );
  const design = tierPlan(designTier(pricing, draftDesignId(draft)));

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-4">
            <Link
              href={`/invites/${id}`}
              className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
              {upgradeCopy.back}
            </Link>
            <div className="flex max-w-2xl flex-col gap-2">
              <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                {upgradeCopy.eyebrow}
              </p>
              <h1 className="font-display text-[2rem] leading-[1.08] sm:text-[2.6rem]">
                {upgradeCopy.title}
              </h1>
              <p className="text-ink-muted">{upgradeCopy.intro(inviteNames(draft))}</p>
            </div>
          </div>

          {!owner && (
            <div
              role="note"
              className="flex max-w-2xl items-start gap-3 rounded-lg border border-marigold/45 bg-marigold/10 p-5"
            >
              <Users aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold">{upgradeCopy.ownerOnly.title}</p>
                <p className="text-sm text-ink-muted">{upgradeCopy.ownerOnly.body}</p>
              </div>
            </div>
          )}
          <EditionPicker
            inviteId={id}
            current={current}
            needed={planNeeded(draft, design)}
            focus={typeof focus === "string" && isPlanId(focus) ? focus : null}
            active={active}
            canPay={owner}
            prefill={{ name: account.name, email: account.email, phone: account.phone }}
            prices={pricesFor(current, coupons, null, new Date(), pricing.prices)}
          />

          {receipts.length > 0 && (
            <section aria-labelledby="receipts" className="flex flex-col gap-3">
              <h2 id="receipts" className="font-display text-2xl">
                {upgradeCopy.receipts}
              </h2>
              <ul className="flex flex-col divide-y divide-line rounded-lg border border-line bg-surface">
                {receipts.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <ReceiptText aria-hidden className="size-4 text-accent-text" />
                      {upgradeCopy.receipt(
                        planCopy[order.planId].name,
                        formatRupees(order.amountPaise),
                      )}
                    </span>
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
                      {new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
                        dateStyle: "medium",
                        timeZone: "Asia/Kolkata",
                      }).format(new Date(order.paidAt ?? order.createdAt))}
                      {order.providerPaymentId
                        ? ` · ${upgradeCopy.paymentId} ${order.providerPaymentId}`
                        : ""}
                      {order.status === "refunded" ? (
                        <Badge tone="warning">{upgradeCopy.refunded}</Badge>
                      ) : (
                        <Link
                          href={`/invoice/${order.id}`}
                          className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-text underline-offset-4 hover:underline"
                        >
                          <FileText aria-hidden className="size-4" />
                          {upgradeCopy.invoice}
                        </Link>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </AccountShell>
    </PageTransition>
  );
}
