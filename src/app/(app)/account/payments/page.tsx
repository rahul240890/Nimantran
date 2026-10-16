import { CalendarClock, Download, FileText, ReceiptText, Sheet, SquarePen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { AccountTabs } from "@/components/account/account-tabs";
import { PageTransition } from "@/components/motion/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { accountText } from "@/i18n/copy/account";
import { editionsText } from "@/i18n/copy/editions";
import { getLocale, getText } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { upgradedFrom } from "@/lib/payments/editions";
import { paymentHistory, type Payment } from "@/lib/payments/history";
import { formatRupees } from "@/lib/plans/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const { paymentsCopy } = await getText(accountText);
  return { title: paymentsCopy.metaTitle, robots: { index: false, follow: false } };
}

const actionClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-sm font-semibold text-accent-text underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Everything the signed-in person has paid for, on every invite: when, what (package,
 * design and invite), how much, and its receipt to view, print or save as a PDF.
 */
export default async function PaymentsPage() {
  const account = await getAccount();
  // The proxy sends signed-out visitors to sign in; this covers a session that just ended
  if (!account) redirect("/sign-in?next=%2Faccount%2Fpayments");
  const locale = await getLocale();
  const [{ paymentsCopy: copy }, { planCopy }, payments] = await Promise.all([
    getText(accountText, locale),
    getText(editionsText, locale),
    paymentHistory(account, locale),
  ]);
  const when = new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const day = new Intl.DateTimeFormat(locale === "hi" ? "hi-IN" : "en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  });
  const paid = payments.filter((payment) => payment.status === "paid");
  const totalPaise = paid.reduce((sum, payment) => sum + payment.amountPaise, 0);
  const refundedPaise = payments
    .filter((payment) => payment.status === "refunded")
    .reduce((sum, payment) => sum + payment.amountPaise, 0);

  function PaymentCard({ payment }: { payment: Payment }) {
    const at = payment.paidAt ?? payment.createdAt;
    const receipt = `/invoice/${payment.id}?from=payments`;
    const { item } = payment;
    const upgrade = upgradedFrom(payment);
    return (
      <article
        aria-labelledby={`payment-${payment.id}`}
        className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-raised sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 id={`payment-${payment.id}`} className="font-display text-xl leading-tight">
              {copy.item(planCopy[payment.planId].name)}
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <CalendarClock aria-hidden className="size-4 shrink-0" />
              <time dateTime={at}>{when.format(new Date(at))}</time>
            </p>
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <p className="font-display text-2xl leading-none tabular-nums">
              {formatRupees(payment.amountPaise)}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:justify-end">
              {payment.mode !== "live" && <Badge>{copy.test}</Badge>}
              {payment.status === "refunded" ? (
                <Badge tone="warning" dot>
                  {copy.refunded}
                </Badge>
              ) : (
                <Badge tone="success" dot>
                  {copy.paid}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-1 text-sm text-ink-muted">
          <li className="font-semibold text-ink">
            {item.occasion
              ? copy.forInvite(item.occasion, item.names)
              : item.names || copy.deletedInvite}
          </li>
          <li>
            {item.design ? `${copy.design(item.design)} · ` : ""}
            {copy.tier[payment.designTier]}
          </li>
          {upgrade && <li>{copy.upgrade(planCopy[upgrade].name)}</li>}
          {payment.discountPaise > 0 && (
            <li>{copy.coupon(payment.couponCode ?? "", formatRupees(payment.discountPaise))}</li>
          )}
          {payment.status === "refunded" && payment.refundedAt && (
            <li className="font-semibold text-warning">
              {copy.refundedOn(day.format(new Date(payment.refundedAt)))}
            </li>
          )}
        </ul>

        <div className="flex flex-col gap-2 border-t border-line pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="min-w-0 text-xs [overflow-wrap:anywhere] text-ink-muted">
            {copy.receiptNo(payment.invoiceNo ?? payment.id.slice(0, 8))}
            {payment.providerPaymentId ? ` · ${copy.paymentId(payment.providerPaymentId)}` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-x-4">
            <Link href={receipt} className={actionClass}>
              <FileText aria-hidden className="size-4" />
              {copy.view}
            </Link>
            <Link href={`${receipt}&download=1`} className={actionClass}>
              <Download aria-hidden className="size-4" />
              {copy.download}
            </Link>
            {payment.eventId && item.occasion && (
              <Link href={`/invites/${payment.eventId}/edition`} className={actionClass}>
                <SquarePen aria-hidden className="size-4" />
                {copy.openInvite}
              </Link>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
          <AccountTabs current="payments" />
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-[2rem] leading-[1.08] sm:text-[2.6rem]">
              {copy.title}
            </h1>
            <p className="text-ink-muted">{copy.intro}</p>
          </div>

          {payments.length === 0 ? (
            <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-line-strong bg-surface p-6 sm:p-8">
              <ReceiptText aria-hidden className="size-8 text-accent-text" />
              <div className="flex flex-col gap-1">
                <h2 className="font-display text-2xl">{copy.empty.title}</h2>
                <p className="text-ink-muted">{copy.empty.body}</p>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/invites">{copy.empty.action}</Link>
              </Button>
            </div>
          ) : (
            <>
              <section
                aria-label={copy.totalPaid}
                className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-line bg-surface-2 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
                    {copy.totalPaid}
                  </p>
                  <p className="font-display text-3xl leading-none tabular-nums">
                    {formatRupees(totalPaise)}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {copy.count(payments.length)}
                    {refundedPaise > 0
                      ? ` · ${copy.refundedTotal(formatRupees(refundedPaise))}`
                      : ""}
                  </p>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <a href="/account/payments/export" download>
                    <Sheet aria-hidden />
                    {copy.exportAll}
                  </a>
                </Button>
              </section>

              <section aria-labelledby="payments-list" className="flex flex-col gap-3">
                <h2 id="payments-list" className="sr-only">
                  {copy.listLabel}
                </h2>
                <ul className="flex flex-col gap-3">
                  {payments.map((payment) => (
                    <li key={payment.id}>
                      <PaymentCard payment={payment} />
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          <p className="text-sm text-ink-muted">
            {copy.help.question}{" "}
            <Link
              href="/contact"
              className="font-semibold text-accent-text underline-offset-4 hover:underline"
            >
              {copy.help.contact}
            </Link>
            {" · "}
            <Link
              href="/refunds"
              className="font-semibold text-accent-text underline-offset-4 hover:underline"
            >
              {copy.help.refunds}
            </Link>
          </p>
        </div>
      </AccountShell>
    </PageTransition>
  );
}
