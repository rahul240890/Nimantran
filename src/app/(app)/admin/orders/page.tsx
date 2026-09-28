import { FileText, Gift, ReceiptText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading } from "@/components/admin/admin-shell";
import { GiveEdition } from "@/components/admin/give-edition";
import { RefundButton } from "@/components/admin/refund-button";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { planCopy } from "@/content/editions";
import { requireAdmin } from "@/lib/admin/access";
import { adminOrders, type OrderStatus } from "@/lib/payments/editions";
import { formatRupees } from "@/lib/plans/catalog";

export const metadata: Metadata = { title: "Orders" };

const STATUS: Record<OrderStatus, { tone: BadgeTone; label: string }> = {
  created: { tone: "neutral", label: "Not paid" },
  paid: { tone: "success", label: "Paid" },
  failed: { tone: "danger", label: "Failed" },
  refunded: { tone: "warning", label: "Refunded" },
};

const when = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

/** Every edition bought, newest first, and giving one by hand. */
export default async function OrdersPage() {
  await requireAdmin("/admin/orders");
  const orders = await adminOrders();
  const paid = orders.filter((order) => order.status === "paid");
  const revenue = paid.reduce((sum, order) => sum + order.amountPaise, 0);
  const refunded = orders.filter((order) => order.status === "refunded");

  return (
    <>
      <AdminHeading
        eyebrow="Payments"
        title="Orders"
        intro="Each order is one edition for one invite. An order is marked paid only after the server has checked Razorpay's signature."
      />

      <div className="flex flex-col gap-6">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-2xl">
          <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface px-4 py-4 shadow-raised">
            <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
              Paid
            </dt>
            <dd className="font-display text-3xl leading-none tabular-nums">{paid.length}</dd>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface px-4 py-4 shadow-raised">
            <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
              Taken
            </dt>
            <dd className="font-display text-3xl leading-none tabular-nums">
              {formatRupees(revenue)}
            </dd>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface px-4 py-4 shadow-raised">
            <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
              Refunded
            </dt>
            <dd className="font-display text-3xl leading-none tabular-nums">{refunded.length}</dd>
          </div>
        </dl>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText aria-hidden className="size-5 text-accent-text" />
              Latest orders
            </CardTitle>
          </CardHeader>
          <CardBody>
            {orders.length === 0 ? (
              <EmptyState
                icon={<ReceiptText aria-hidden />}
                title="No orders yet"
                description="They appear here as soon as a host opens the payment window."
              />
            ) : (
              <div
                role="region"
                aria-label="Latest orders"
                tabIndex={0}
                className="-mx-5 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:-mx-6"
              >
                <table className="w-full min-w-[52rem] text-start text-sm">
                  <thead>
                    <tr className="border-b border-line text-ink-muted">
                      {["When", "Invite", "Edition", "Amount", "Status", "Payment", ""].map(
                        (head) => (
                          <th
                            key={head}
                            scope="col"
                            className="px-3 py-2.5 text-start font-label text-[0.7rem] font-normal tracking-[0.18em] uppercase first:ps-5 last:pe-5 sm:first:ps-6 sm:last:pe-6"
                          >
                            {head || <span className="sr-only">Actions</span>}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {orders.map((order) => (
                      <tr key={order.id} className="align-top">
                        <td className="px-3 py-3 ps-5 whitespace-nowrap text-ink-muted sm:ps-6">
                          {when.format(new Date(order.paidAt ?? order.createdAt))}
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-semibold">{order.names || "Untitled invite"}</span>
                          {order.slug && (
                            <a
                              href={`/i/${order.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-accent-text underline-offset-4 hover:underline"
                            >
                              /i/{order.slug}
                            </a>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {planCopy[order.planId].name}
                          {order.fromPlanId !== "free" && (
                            <span className="block text-ink-muted">
                              from {planCopy[order.fromPlanId].name}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap tabular-nums">
                          {formatRupees(order.amountPaise)}
                          {order.discountPaise > 0 && (
                            <span className="block text-ink-muted">
                              <s>{formatRupees(order.listPricePaise)}</s>
                              {order.couponCode && (
                                <span className="ms-1.5 font-mono text-xs">{order.couponCode}</span>
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className="flex flex-wrap gap-1.5">
                            <Badge tone={STATUS[order.status].tone} dot>
                              {STATUS[order.status].label}
                            </Badge>
                            {order.mode !== "live" && (
                              <Badge tone="neutral">
                                {order.mode === "test" ? "Test" : "Preview"}
                              </Badge>
                            )}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-ink-muted">
                          {order.providerPaymentId ?? order.providerOrderId}
                          {order.invoiceNo && (
                            <Link
                              href={`/invoice/${order.id}`}
                              className="mt-1 flex min-h-11 items-center gap-1 font-sans text-sm text-accent-text underline-offset-4 hover:underline"
                            >
                              <FileText aria-hidden className="size-4 shrink-0" />
                              {order.invoiceNo}
                            </Link>
                          )}
                        </td>
                        <td className="px-3 py-3 pe-5 text-end sm:pe-6">
                          {order.status === "paid" && (
                            <RefundButton
                              orderId={order.id}
                              amount={formatRupees(order.amountPaise)}
                              names={order.names}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift aria-hidden className="size-5 text-accent-text" />
              Give an edition
            </CardTitle>
            <CardDescription>
              For pilot families, support or a gift. Paste the invite&apos;s link or just the part
              after /i/. It never lowers an edition the invite already has.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <GiveEdition />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
