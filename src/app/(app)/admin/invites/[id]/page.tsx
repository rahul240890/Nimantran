import {
  ArrowLeft,
  Clapperboard,
  ExternalLink,
  LayoutTemplate,
  LifeBuoy,
  Mail,
  Music,
  PackageCheck,
  PenLine,
  Phone,
  ReceiptText,
  Share2,
  UserRound,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { z } from "zod";
import { AdminHeading } from "@/components/admin/admin-shell";
import { RefundButton } from "@/components/admin/refund-button";
import { HelpButton, PackageForm, RecheckButton } from "@/components/admin/support-controls";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { planCopy } from "@/content/editions";
import { requireAdmin } from "@/lib/admin/access";
import {
  SUPPORT_SIDE,
  hostDetails,
  invitesOf,
  supportHosts,
  supportInvite,
} from "@/lib/admin/support";
import { getCategory, isCategoryId } from "@/lib/categories/catalog";
import { designPageHref } from "@/lib/editor/design-page";
import { adminReadInvite } from "@/lib/invites/store";
import { adminInvitePlan, adminOrdersFor, type OrderStatus } from "@/lib/payments/editions";
import { formatRupees } from "@/lib/plans/catalog";

export const metadata: Metadata = { title: "Invite" };

const ORDER_STATUS: Record<OrderStatus, { tone: BadgeTone; label: string }> = {
  created: { tone: "neutral", label: "Not paid" },
  paid: { tone: "success", label: "Paid" },
  failed: { tone: "danger", label: "Failed" },
  refunded: { tone: "warning", label: "Refunded" },
};

const INVITE_STATUS: Record<string, { tone: BadgeTone; label: string }> = {
  draft: { tone: "neutral", label: "Draft" },
  published: { tone: "success", label: "Published" },
  archived: { tone: "warning", label: "Archived" },
};

const when = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

const linkClasses =
  "inline-flex min-h-11 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-semibold transition-colors hover:border-marigold hover:text-accent-text";

/**
 * Support for one invite: who the host is, what package it has, every payment for it and
 * by its host, their other invites, and stepping in to edit it as "Shubh support".
 */
export default async function AdminInvitePage({ params }: PageProps<"/admin/invites/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const admin = await requireAdmin(`/admin/invites/${id}`);
  const invite = await supportInvite(id);
  if (!invite) notFound();

  const [draft, edition, host, hosts, theirs] = await Promise.all([
    adminReadInvite(id),
    adminInvitePlan(id),
    hostDetails(invite.ownerId),
    supportHosts(id),
    invitesOf(invite.ownerId),
  ]);
  const orders = await adminOrdersFor(
    theirs.map((item) => item.id).concat(theirs.some((item) => item.id === id) ? [] : [id]),
    invite.ownerId,
  );
  const ownInvite = invite.ownerId === admin.account.id;
  const helping =
    ownInvite || hosts.some((item) => item.userId === admin.account.id && item.access === "edit");
  const status = INVITE_STATUS[invite.status] ?? INVITE_STATUS.draft!;
  const category = isCategoryId(invite.categoryId)
    ? getCategory(invite.categoryId).names.en
    : invite.categoryId;
  const editHref = draft ? designPageHref({ ...draft, remoteId: id }) : `/invites/${id}`;
  const live = invite.status === "published" && Boolean(invite.slug);
  const others = theirs.filter((item) => item.id !== id);
  const unpaid = orders.filter((order) => order.status === "created" || order.status === "failed");

  return (
    <>
      <Link
        href="/admin/invites"
        className="-ms-2 mb-4 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        All invites
      </Link>
      <AdminHeading
        eyebrow={`${category} · created ${when.format(new Date(invite.createdAt))}`}
        title={invite.names || "Untitled invite"}
        intro={
          <span className="flex flex-wrap items-center gap-1.5">
            <Badge tone={status.tone} dot>
              {status.label}
            </Badge>
            <Badge tone={edition.plan === "free" ? "neutral" : "gold"}>
              {planCopy[edition.plan].name}
            </Badge>
            {live && (
              <a
                href={`/i/${invite.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-sm break-all text-accent-text underline-offset-4 hover:underline"
              >
                /i/{invite.slug}
                <ExternalLink aria-hidden className="size-3.5" />
              </a>
            )}
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound aria-hidden className="size-5 text-accent-text" />
              Host
            </CardTitle>
          </CardHeader>
          <CardBody>
            <dl className="flex flex-col gap-3 text-sm">
              <Detail label="Name">{host?.name || invite.ownerName}</Detail>
              <Detail label="Email">
                {host?.email ? (
                  <a
                    href={`mailto:${host.email}`}
                    className="inline-flex items-center gap-1.5 break-all text-accent-text underline-offset-4 hover:underline"
                  >
                    <Mail aria-hidden className="size-4 shrink-0" />
                    {host.email}
                  </a>
                ) : (
                  "None (signed in by phone)"
                )}
              </Detail>
              <Detail label="Phone">
                {host?.phone ? (
                  <a
                    href={`https://wa.me/${host.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-accent-text underline-offset-4 hover:underline"
                  >
                    <Phone aria-hidden className="size-4 shrink-0" />
                    {host.phone}
                  </a>
                ) : (
                  "None (signed in by email)"
                )}
              </Detail>
              {host?.joinedAt && (
                <Detail label="Joined">{when.format(new Date(host.joinedAt))}</Detail>
              )}
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy aria-hidden className="size-5 text-accent-text" />
              Edit for them
            </CardTitle>
            <CardDescription>
              {ownInvite
                ? "This is your own invite."
                : helping
                  ? `You're on this invite as "${SUPPORT_SIDE}". It's also in your own My invites. Change the song, words or photos, make the video or cards, then stop helping when you're done.`
                  : `Join this invite as a co-host named "${SUPPORT_SIDE}" to open its editor, video and cards as the host sees them. The host sees you on their list of hosts until you stop.`}
            </CardDescription>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {helping && (
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link href={editHref} className={linkClasses}>
                    <PenLine aria-hidden className="size-4" />
                    Open the editor
                  </Link>
                </li>
                <li>
                  <Link href={`${editHref}#part-music`} className={linkClasses}>
                    <Music aria-hidden className="size-4" />
                    Change the song
                  </Link>
                </li>
                <li>
                  <Link
                    href={live ? `/invites/${id}/share` : `/invites/${id}/video`}
                    className={linkClasses}
                  >
                    <Clapperboard aria-hidden className="size-4" />
                    {live ? "Share page and video" : "Make the video"}
                  </Link>
                </li>
                <li>
                  <Link href={`/invites/${id}/cards`} className={linkClasses}>
                    <LayoutTemplate aria-hidden className="size-4" />
                    Cards
                  </Link>
                </li>
                <li>
                  <Link href={`/invites/${id}`} className={linkClasses}>
                    <Share2 aria-hidden className="size-4" />
                    Guests
                  </Link>
                </li>
              </ul>
            )}
            {!ownInvite && <HelpButton eventId={id} helping={helping} />}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck aria-hidden className="size-5 text-accent-text" />
              Package
            </CardTitle>
            <CardDescription>
              Now {planCopy[edition.plan].name}. Set any package by hand, for any design, for a
              special customer or a payment that didn&apos;t reach the invite. Free takes it away.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <PackageForm eventId={id} current={edition.plan} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users aria-hidden className="size-5 text-accent-text" />
              Hosts
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="-my-2 divide-y divide-line text-sm">
              {hosts.map((item) => (
                <li
                  key={item.userId}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <span className="font-semibold">
                    {item.name || "No name yet"}
                    {item.userId === admin.account.id && " (you)"}
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    {item.side && <Badge>{item.side}</Badge>}
                    <Badge tone={item.role === "owner" ? "gold" : "neutral"}>
                      {item.role === "owner"
                        ? "Owner"
                        : item.access === "edit"
                          ? "Co-host, edits"
                          : "Co-host, guests only"}
                    </Badge>
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ReceiptText aria-hidden className="size-5 text-accent-text" />
            Payments by this host
          </CardTitle>
          <CardDescription>
            {unpaid.length > 0
              ? "An order still marked Not paid or Failed after the host paid means the payment never reached the site. Check it with Razorpay: if it was paid, it's recorded and the invite gets its package."
              : "Every order for this host's invites, newest first."}
          </CardDescription>
        </CardHeader>
        <CardBody>
          {orders.length === 0 ? (
            <EmptyState
              icon={<ReceiptText aria-hidden />}
              title="No orders"
              description="This host hasn't started a payment."
            />
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {orders.map((order) => {
                const badge = ORDER_STATUS[order.status];
                return (
                  <li
                    key={order.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-col gap-1 text-sm">
                      <span className="font-semibold">
                        {planCopy[order.planId].name} · {formatRupees(order.amountPaise)}
                        {order.couponCode && ` · ${order.couponCode}`}
                      </span>
                      <span className="text-ink-muted">
                        {[
                          order.names || "Untitled invite",
                          order.eventId === id ? "this invite" : null,
                          when.format(new Date(order.paidAt ?? order.createdAt)),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                      <span className="font-mono text-xs break-all text-ink-muted">
                        {order.providerPaymentId ?? order.providerOrderId}
                      </span>
                    </div>
                    <span className="flex shrink-0 flex-wrap items-center gap-2">
                      <Badge tone={badge.tone} dot>
                        {badge.label}
                      </Badge>
                      {(order.status === "created" || order.status === "failed") && (
                        <RecheckButton orderId={order.id} />
                      )}
                      {order.status === "paid" && order.amountPaise > 0 && (
                        <RefundButton
                          orderId={order.id}
                          amount={formatRupees(order.amountPaise)}
                          names={order.names}
                        />
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>

      {others.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Their other invites</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="-my-2 divide-y divide-line">
              {others.map((item) => {
                const itemStatus = INVITE_STATUS[item.status] ?? INVITE_STATUS.draft!;
                return (
                  <li
                    key={item.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <Link
                      href={`/admin/invites/${item.id}`}
                      className="inline-flex min-h-11 items-center self-start font-semibold break-words underline-offset-4 hover:underline"
                    >
                      {item.names || "Untitled invite"}
                      <span className="ms-2 text-sm font-normal text-ink-muted">
                        {isCategoryId(item.categoryId)
                          ? getCategory(item.categoryId).names.en
                          : item.categoryId}
                      </span>
                    </Link>
                    <span className="flex shrink-0 flex-wrap gap-1.5">
                      <Badge tone={itemStatus.tone} dot>
                        {itemStatus.label}
                      </Badge>
                      <Badge tone={item.plan === "free" ? "neutral" : "gold"}>
                        {planCopy[item.plan].name}
                      </Badge>
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      )}
    </>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase sm:w-20 sm:shrink-0 sm:pt-0.5">
        {label}
      </dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
