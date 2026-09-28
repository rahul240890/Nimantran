import { TicketPercent } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { CouponSwitch, NewCoupon } from "@/components/admin/coupon-controls";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { planCopy } from "@/content/editions";
import { requireAdmin } from "@/lib/admin/access";
import { allCoupons } from "@/lib/payments/coupons";
import { formatRupees } from "@/lib/plans/catalog";
import type { Coupon } from "@/lib/plans/offers";

export const metadata: Metadata = { title: "Coupons" };

const day = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

function when(coupon: Coupon): string {
  if (coupon.startsAt && coupon.endsAt) {
    return `${day.format(new Date(coupon.startsAt))} to ${day.format(new Date(coupon.endsAt))}`;
  }
  if (coupon.startsAt) return `From ${day.format(new Date(coupon.startsAt))}`;
  if (coupon.endsAt) return `Until ${day.format(new Date(coupon.endsAt))}`;
  return "No end date";
}

/** Coupon codes and festival offers: make them, see how often they're used, switch them off. */
export default async function CouponsPage() {
  await requireAdmin("/admin/coupons");
  const coupons = await allCoupons();
  const now = new Date();

  return (
    <>
      <AdminHeading
        eyebrow="Payments"
        title="Coupons"
        intro="A coupon takes money off an edition when a host types its code. A festival offer applies by itself between its dates. The server checks every coupon at checkout, so a code can't be forged in the browser."
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TicketPercent aria-hidden className="size-5 text-accent-text" />
              New coupon
            </CardTitle>
            <CardDescription>
              Hosts always pay at least ₹1. Dates run from the start of the first day to the end of
              the last, India time.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <NewCoupon />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All coupons</CardTitle>
          </CardHeader>
          <CardBody>
            {coupons.length === 0 ? (
              <EmptyState
                icon={<TicketPercent aria-hidden />}
                title="No coupons yet"
                description="Make one above. It works at checkout as soon as it's saved."
              />
            ) : (
              <ul className="-my-2 divide-y divide-line">
                {coupons.map((coupon) => {
                  const ended = coupon.endsAt !== null && now >= new Date(coupon.endsAt);
                  const usedUp = coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses;
                  return (
                    <li
                      key={coupon.id}
                      className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-base font-semibold tracking-wider break-all">
                            {coupon.code}
                          </span>
                          <Badge tone="gold">
                            {coupon.percentOff !== null
                              ? `${coupon.percentOff}% off`
                              : `${formatRupees(coupon.amountOffPaise ?? 0)} off`}
                          </Badge>
                          {coupon.autoApply && <Badge tone="rose">Festival offer</Badge>}
                          {!coupon.active ? (
                            <Badge tone="neutral">Off</Badge>
                          ) : ended ? (
                            <Badge tone="warning">Ended</Badge>
                          ) : usedUp ? (
                            <Badge tone="warning">Used up</Badge>
                          ) : null}
                        </div>
                        <p className="text-sm text-ink-muted">
                          {[
                            coupon.label,
                            coupon.planIds.length
                              ? coupon.planIds.map((id) => planCopy[id].name).join(", ")
                              : "Every edition",
                            when(coupon),
                            `Used ${coupon.usedCount}${coupon.maxUses !== null ? ` of ${coupon.maxUses}` : ""}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <CouponSwitch id={coupon.id} code={coupon.code} active={coupon.active} />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
