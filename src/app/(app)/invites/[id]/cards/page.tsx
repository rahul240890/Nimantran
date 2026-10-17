import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { CardMaker } from "@/components/cards/card-maker";
import { PageTransition } from "@/components/motion/page-transition";
import { cardsText } from "@/i18n/copy/cards";
import { getText } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { isCardKind } from "@/lib/cards/words";
import { findPublishedInvite, type PublicPhoto } from "@/lib/invites/public";
import { inviteStore } from "@/lib/invites/store";
import { editionsActive, invitePlan } from "@/lib/payments/editions";
import { FREE_EDITION, PLANS, editionFor } from "@/lib/plans/catalog";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { inviteNames } from "@/lib/publish/describe";

export async function generateMetadata(): Promise<Metadata> {
  const { cardsCopy } = await getText(cardsText);
  return { title: cardsCopy.metaTitle, robots: { index: false, follow: false } };
}

/*
 * Save-the-date and thank-you cards (Step 24), before or after publishing: a save the
 * date goes out before the invitation is ready. Every host makes and sees both; they
 * download clean with Grand (docs/PRICING.md), and for everyone while payments are off.
 * `?card=thank-you` opens on the thank-you.
 */
export default async function InviteCardsPage({
  params,
  searchParams,
}: PageProps<"/invites/[id]/cards">) {
  const { id } = await params;
  const { card } = await searchParams;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}/cards`)}`);
  const store = inviteStore();
  const draft = await store?.get(account, id);
  if (!store || !draft) notFound();

  const [published, urls, active, edition, { cardsCopy }] = await Promise.all([
    draft.slug ? findPublishedInvite(draft.slug) : null,
    store.photoUrls(account, id).catch(() => ({}) as Record<string, string>),
    editionsActive(),
    invitePlan(account, id),
    getText(cardsText),
  ]);
  // A live invite's cards match what guests were sent
  const live = published?.draft ?? draft;
  const photos: PublicPhoto[] =
    published?.photos ??
    draft.photos.flatMap((photo) => {
      const url = urls[photo.id];
      return url ? [{ id: photo.id, url, width: photo.width, height: photo.height }] : [];
    });
  // The package as it stands on this design: one bought for another design gives nothing
  const plan = PLANS[editionFor(edition ?? FREE_EDITION, draftDesignId(live)).plan];

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href={`/invites/${id}`}
            className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
            {cardsCopy.back}
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl text-balance sm:text-4xl">{cardsCopy.heading}</h1>
            <p className="max-w-prose text-ink-muted">{cardsCopy.intro}</p>
          </div>
          <CardMaker
            inviteId={id}
            draft={live}
            photos={photos}
            names={inviteNames(live)}
            allowed={!active || plan.cards}
            upgradeHref={`/invites/${id}/edition?plan=grand`}
            initial={isCardKind(card) ? card : undefined}
          />
        </div>
      </AccountShell>
    </PageTransition>
  );
}
