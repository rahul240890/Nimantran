import { ExternalLink, TicketPercent } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading } from "@/components/admin/admin-shell";
import { AUDIENCE_NAMES } from "@/components/admin/audience-names";
import {
  CouponForm,
  CouponSwitch,
  EditCoupon,
  type DesignOption,
} from "@/components/admin/coupon-controls";
import { designWords } from "@/components/gallery/design-words";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { planCopy } from "@/content/editions";
import { requireAdmin } from "@/lib/admin/access";
import { designCatalog } from "@/lib/gallery/filters";
import { allCoupons } from "@/lib/payments/coupons";
import { formatRupees } from "@/lib/plans/catalog";
import type { Coupon } from "@/lib/plans/offers";

export const metadata: Metadata = { title: "Offers" };

const day = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

function when(coupon: Coupon): string {
  if (coupon.startsAt && coupon.endsAt) {
    return `${day.format(new Date(coupon.startsAt))} to ${day.format(new Date(coupon.endsAt))}`;
  }
  if (coupon.startsAt) return `From ${day.format(new Date(coupon.startsAt))}`;
  if (coupon.endsAt) return `Valid till ${day.format(new Date(coupon.endsAt))}`;
  return "No end date";
}

const KINDS = {
  moving: "Moving",
  storybook: "Storybook",
  scene: "Scene",
  story: "Story",
  card: "3D card",
};

/**
 * Offers and coupon codes: make and change them, choose who and what they're for and
 * whether the offers page and home page show them, see how often they're used.
 */
export default async function CouponsPage() {
  await requireAdmin("/admin/coupons");
  const coupons = await allCoupons();
  const now = new Date();
  const designs: DesignOption[] = designCatalog().map((entry) => ({
    id: entry.design.id,
    name: designWords(entry.design, "en").name,
    kind: KINDS[entry.format],
  }));
  const designName = new Map(designs.map((design) => [design.id, design.name]));

  return (
    <>
      <AdminHeading
        eyebrow="Payments"
        title="Offers"
        intro="An offer takes money off a package when a host types its code, or by itself between its dates as a festival offer. Keep it to a first booking, some packages or some designs, and show it on the offers page and the home page. The server checks every offer at checkout, so a code can't be forged in the browser."
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TicketPercent aria-hidden className="size-5 text-accent-text" />
              New offer
            </CardTitle>
            <CardDescription>
              An offer can make a package free, with no payment. Dates run from the start of the
              first day to the end of the last, India time.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <CouponForm designs={designs} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All offers</CardTitle>
            <CardDescription>
              <Link
                href="/offers"
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-text underline-offset-4 hover:underline"
              >
                See the offers page
                <ExternalLink aria-hidden className="size-4" />
              </Link>
            </CardDescription>
          </CardHeader>
          <CardBody>
            {coupons.length === 0 ? (
              <EmptyState
                icon={<TicketPercent aria-hidden />}
                title="No offers yet"
                description="Make one above. It works at checkout as soon as it's saved."
              />
            ) : (
              <ul className="-my-2 divide-y divide-line">
                {coupons.map((coupon) => {
                  const ended = coupon.endsAt !== null && now >= new Date(coupon.endsAt);
                  const usedUp = coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses;
                  const forDesigns = [
                    ...coupon.designTiers.map(
                      (tier) => `${tier[0]!.toUpperCase()}${tier.slice(1)} designs`,
                    ),
                    ...coupon.designIds.map((id) => designName.get(id) ?? id),
                  ];
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
                          {coupon.featured ? (
                            <Badge tone="success">Home page</Badge>
                          ) : coupon.showOnSite ? (
                            <Badge tone="success">Offers page</Badge>
                          ) : null}
                          {!coupon.active ? (
                            <Badge tone="neutral">Off</Badge>
                          ) : ended ? (
                            <Badge tone="warning">Ended</Badge>
                          ) : usedUp ? (
                            <Badge tone="warning">Used up</Badge>
                          ) : null}
                        </div>
                        {coupon.label && <p className="font-semibold">{coupon.label}</p>}
                        <p className="text-sm text-ink-muted">
                          {[
                            AUDIENCE_NAMES[coupon.audience],
                            coupon.planIds.length
                              ? coupon.planIds.map((id) => planCopy[id].name).join(", ")
                              : "Every package",
                            forDesigns.length ? forDesigns.join(", ") : "Every design",
                            when(coupon),
                            `Used ${coupon.usedCount}${coupon.maxUses !== null ? ` of ${coupon.maxUses}` : ""}`,
                            coupon.perUserLimit !== null ? `${coupon.perUserLimit} per host` : "",
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <EditCoupon coupon={coupon} designs={designs} />
                        <CouponSwitch id={coupon.id} code={coupon.code} active={coupon.active} />
                      </div>
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
