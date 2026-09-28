import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { BrandMark } from "@/components/brand/brand-mark";
import { PrintButton } from "@/components/editions/print-button";
import { planCopy } from "@/content/editions";
import { getAdmin } from "@/lib/admin/access";
import { getAccount } from "@/lib/auth/server";
import { getBusiness } from "@/lib/payments/business";
import { orderWithInvite } from "@/lib/payments/editions";
import { gstSplit } from "@/lib/payments/invoice";
import { formatRupees } from "@/lib/plans/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Invoice", robots: { index: false, follow: false } };

const dated = new Intl.DateTimeFormat("en-IN", { dateStyle: "long", timeZone: "Asia/Kolkata" });

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex justify-between gap-6 py-1.5 ${strong ? "mt-1 border-t border-line pt-2.5 font-semibold text-ink" : ""}`}
    >
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

/**
 * An order's invoice, to print or save as PDF. A tax invoice once the business's GSTIN is
 * set on Admin, Business details; a receipt until then. Only the buyer and admins see it.
 */
export default async function InvoicePage({ params }: PageProps<"/invoice/[orderId]">) {
  const { orderId } = await params;
  if (!z.uuid().safeParse(orderId).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invoice/${orderId}`)}`);
  const order = await orderWithInvite(orderId);
  if (!order || (order.status !== "paid" && order.status !== "refunded")) notFound();
  if (order.userId !== account.id && !(await getAdmin())) notFound();

  const business = await getBusiness();
  const taxInvoice = Boolean(business.gstin);
  const gst = gstSplit(order.amountPaise);
  const paidAt = new Date(order.paidAt ?? order.createdAt);
  const buyer = account.id === order.userId ? account : null;
  const plan = planCopy[order.planId].name;

  return (
    <div className="min-h-dvh bg-paper px-4 py-8 sm:px-6 sm:py-12 print:bg-transparent print:p-0">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href={order.eventId ? `/invites/${order.eventId}/edition` : "/invites"}
            className="-ms-2 inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
            Back
          </Link>
          <PrintButton />
        </div>

        <main
          id="main"
          className="flex flex-col gap-8 rounded-lg border border-line bg-surface p-6 text-sm text-ink-muted shadow-raised sm:p-10 print:border-0 print:shadow-none"
        >
          <header className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <BrandMark className="size-11 text-accent-text" />
              <div className="flex flex-col">
                <span className="font-display text-xl text-ink">{site.name}</span>
                <span>{business.legalName || site.name}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 sm:text-end">
              <h1 className="font-display text-2xl text-ink">
                {taxInvoice ? "Tax invoice" : "Receipt"}
              </h1>
              <p>
                No.{" "}
                <span className="font-semibold text-ink">
                  {order.invoiceNo ?? order.id.slice(0, 8)}
                </span>
              </p>
              <p>Date {dated.format(paidAt)}</p>
            </div>
          </header>

          <div className="grid gap-6 sm:grid-cols-2">
            <section aria-labelledby="from" className="flex flex-col gap-1">
              <h2 id="from" className="font-label text-[0.7rem] tracking-[0.2em] uppercase">
                From
              </h2>
              <p className="font-semibold text-ink">{business.legalName || site.name}</p>
              {business.address && <p className="whitespace-pre-line">{business.address}</p>}
              {business.gstin && <p>GSTIN {business.gstin}</p>}
              {business.email && <p>{business.email}</p>}
            </section>
            <section aria-labelledby="to" className="flex flex-col gap-1">
              <h2 id="to" className="font-label text-[0.7rem] tracking-[0.2em] uppercase">
                Billed to
              </h2>
              <p className="font-semibold text-ink">{buyer?.name || "Customer"}</p>
              {buyer?.email && <p>{buyer.email}</p>}
              {buyer?.phone && <p>{buyer.phone}</p>}
            </section>
          </div>

          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-line">
                <th
                  scope="col"
                  className="py-2 text-start font-label text-[0.7rem] font-normal tracking-[0.2em] uppercase"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="py-2 text-end font-label text-[0.7rem] font-normal tracking-[0.2em] uppercase"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line align-top">
                <td className="py-3 pe-4">
                  <span className="font-semibold text-ink">{plan} edition</span>
                  <span className="block">
                    Digital invitation{order.names ? ` for ${order.names}` : ""}
                    {order.fromPlanId !== "free"
                      ? `, upgrade from ${planCopy[order.fromPlanId].name}`
                      : ""}
                  </span>
                </td>
                <td className="py-3 text-end text-ink tabular-nums">
                  {formatRupees(order.listPricePaise)}
                </td>
              </tr>
            </tbody>
          </table>

          <dl className="ms-auto flex w-full max-w-xs flex-col">
            {order.discountPaise > 0 && (
              <Row
                label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
                value={`− ${formatRupees(order.discountPaise)}`}
              />
            )}
            <Row label="Taxable value" value={formatRupees(gst.taxablePaise)} />
            <Row label="CGST 9%" value={formatRupees(gst.cgstPaise)} />
            <Row label="SGST 9%" value={formatRupees(gst.sgstPaise)} />
            <Row label="Total paid" value={formatRupees(order.amountPaise)} strong />
          </dl>

          <footer className="flex flex-col gap-1 border-t border-line pt-5">
            <p>
              Paid online through Razorpay
              {order.providerPaymentId ? `, payment ${order.providerPaymentId}` : ""}. Prices
              include GST.
            </p>
            {order.status === "refunded" && (
              <p className="font-semibold text-warning">
                Refunded in full
                {order.refundedAt ? ` on ${dated.format(new Date(order.refundedAt))}` : ""}.
              </p>
            )}
            {!taxInvoice && <p>A tax invoice is issued once GST registration is complete.</p>}
          </footer>
        </main>
      </div>
    </div>
  );
}
