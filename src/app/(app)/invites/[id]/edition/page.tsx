import {
  ArrowLeft,
  Clapperboard,
  FileText,
  Globe,
  PartyPopper,
  ReceiptText,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { EditionPicker } from "@/components/editions/edition-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/page-transition";
import { getAdmin } from "@/lib/admin/access";
import { authMode } from "@/lib/auth/mode";
import { getAccount } from "@/lib/auth/server";
import type { PublicPhoto } from "@/lib/invites/public";
import { inviteStore } from "@/lib/invites/store";
import { editionsActive, inviteReceipts, invitePlan, ownsInvite } from "@/lib/payments/editions";
import { checkoutCoupons } from "@/lib/payments/coupons";
import { formatRupees, isPlanId, PLANS, planNeeded, planShortfalls } from "@/lib/plans/catalog";
import { designTier, draftDesignId } from "@/lib/plans/design-defaults";
import { pricesFor } from "@/lib/plans/offers";
import { getPricing } from "@/lib/plans/pricing";
import { inviteNames } from "@/lib/publish/describe";
import { inviteUrl } from "@/lib/publish/links";
import { storyFunctions } from "@/lib/publish/story";
import { requestOrigin } from "@/lib/request-origin";
import { editionsText } from "@/i18n/copy/editions";
import { getLocale, getText } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { upgradeCopy } = await getText(editionsText);
  return { title: upgradeCopy.metaTitle, robots: { index: false, follow: false } };
}

/**
 * Choosing and paying for an invite's package (Steps 15 to 17), with its receipts. The
 * editor's Publish button comes here first (?publish=1) and is sent back to publish.
 */
export default async function EditionPage({
  params,
  searchParams,
}: PageProps<"/invites/[id]/edition">) {
  const { id } = await params;
  const { plan: focus, publish } = await searchParams;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/edition`)}`);
  const store = inviteStore();
  const [draft, current, owner, admin] = await Promise.all([
    store?.get(account, id),
    invitePlan(account, id),
    ownsInvite(account, id),
    getAdmin(),
  ]);
  if (!store || !draft || !current) notFound();
  const [active, receipts, locale, { upgradeCopy, planCopy }, coupons, pricing, urls, origin] =
    await Promise.all([
      editionsActive(),
      inviteReceipts(account, id),
      getLocale(),
      getText(editionsText),
      checkoutCoupons().catch(() => []),
      getPricing(),
      store.photoUrls(account, id).catch(() => ({}) as Record<string, string>),
      requestOrigin(),
    ]);
  // The video preview on the Celebration card, made as the video page makes it: with the
  // mark until the package has the video, and ending on the site until the invite is live
  const photos: PublicPhoto[] = draft.photos.flatMap((photo) => {
    const url = urls[photo.id];
    return url ? [{ id: photo.id, url, width: photo.width, height: photo.height }] : [];
  });
  const clip = draft.music.clip;
  const video = {
    draft,
    functions: storyFunctions(draft, locale),
    photos,
    clipUrl: clip ? (urls[clip.id] ?? null) : null,
    url: draft.slug ? inviteUrl(origin, draft.slug) : origin,
    slug: draft.slug ?? `draft-${id.slice(0, 8)}`,
    names: inviteNames(draft),
    allowed: !active || PLANS[current.plan].video !== "none",
    testCodecs: authMode() === "preview",
  };
  const design = designTier(pricing, draftDesignId(draft));
  // Back to the editor to publish, once the package covers the invite. Until payments are
  // switched on every invite publishes with everything, so it's ready as it is.
  const ready = !active || planShortfalls(draft, current, design).length === 0;
  const publishHref =
    publish === "1" && !draft.slug && owner ? `/create?invite=${id}&publish=1` : null;

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-4">
            <Link
              href={publishHref ? `/create?invite=${id}` : `/invites/${id}`}
              className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
              {publishHref ? upgradeCopy.backToEditor : upgradeCopy.back}
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
          {!active && admin && (
            <div
              role="note"
              className="flex max-w-2xl flex-col gap-3 rounded-lg border border-line bg-surface-2 p-5 sm:flex-row sm:items-center"
            >
              <p className="flex-1 text-sm text-ink-muted">{upgradeCopy.adminOff}</p>
              <Button asChild variant="secondary" size="sm">
                <Link href="/admin/razorpay">{upgradeCopy.adminOffLink}</Link>
              </Button>
            </div>
          )}
          {publishHref && ready && (current.plan !== "free" || !active) && (
            <div
              role="status"
              className="flex max-w-2xl flex-col gap-4 rounded-lg border border-success/40 bg-success/5 p-5 sm:flex-row sm:items-center"
            >
              <PartyPopper aria-hidden className="size-6 shrink-0 text-success" />
              <p className="flex-1 font-semibold">
                {active ? upgradeCopy.publishBody : upgradeCopy.publishFreeBody}
              </p>
              <Button asChild>
                <Link href={publishHref}>
                  <Globe aria-hidden />
                  {upgradeCopy.publishNow}
                </Link>
              </Button>
            </div>
          )}
          {/* Watching the video first is the best reason to choose a package with it */}
          {active && !draft.slug && PLANS[current.plan].video === "none" && (
            <div className="flex max-w-2xl flex-col gap-3 rounded-lg border border-line bg-surface-2 p-5 sm:flex-row sm:items-center">
              <Clapperboard aria-hidden className="size-6 shrink-0 text-accent-text" />
              <p className="flex-1 text-sm text-ink-muted">{upgradeCopy.videoFirst}</p>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/invites/${id}/video`}>{upgradeCopy.videoFirstLink}</Link>
              </Button>
            </div>
          )}
          <EditionPicker
            inviteId={id}
            edition={current}
            design={design}
            needed={planNeeded(draft, design)}
            focus={typeof focus === "string" && isPlanId(focus) ? focus : null}
            active={active}
            canPay={owner}
            prefill={{ name: account.name, email: account.email, phone: account.phone }}
            prices={pricesFor(current, design, coupons, null, new Date(), pricing)}
            pricing={pricing}
            publishHref={ready ? publishHref : null}
            video={video}
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
