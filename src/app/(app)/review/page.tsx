import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { ReviewForm } from "@/components/reviews/review-form";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getAccount } from "@/lib/auth/server";
import { inviteStore } from "@/lib/invites/store";
import { reviewStore } from "@/lib/reviews/store";
import { getText } from "@/i18n/server";
import { dashboardText } from "@/i18n/copy/dashboard";
import { MessageSquareHeart } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const { reviewCopy } = await getText(dashboardText);
  return { title: reviewCopy.metaTitle, robots: { index: false, follow: false } };
}

/*
 * A host's review (lib/reviews/store.ts): open once one of their invitations is live, shown
 * on the site after an admin reads it. Admins send hosts here from Admin, Reviews.
 */
export default async function ReviewPage() {
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent("/review")}`);
  const { reviewCopy } = await getText(dashboardText);
  const [invites, mine] = await Promise.all([
    inviteStore()?.list(account) ?? null,
    reviewStore()
      ?.mine(account)
      .catch(() => null) ?? null,
  ]);
  const live = (invites ?? []).some(
    (invite) => invite.role === "owner" && invite.status === "published",
  );

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
          {live ? (
            <>
              <div className="flex flex-col gap-2">
                <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                  {reviewCopy.eyebrow}
                </p>
                <h1 className="font-display text-[1.75rem] leading-tight sm:text-[2.15rem]">
                  {reviewCopy.title}
                </h1>
                <p className="text-ink-muted">{reviewCopy.intro}</p>
              </div>
              <ReviewForm
                initial={
                  mine
                    ? {
                        rating: mine.rating,
                        body: mine.body,
                        name: mine.name,
                        place: mine.place,
                        status: mine.status,
                      }
                    : { rating: 0, body: "", name: account.name, place: "", status: null }
                }
              />
            </>
          ) : (
            <EmptyState
              icon={<MessageSquareHeart aria-hidden className="size-7" />}
              title={reviewCopy.notLive}
              action={
                <Button asChild>
                  <Link href="/invites">{reviewCopy.myInvites}</Link>
                </Button>
              }
            />
          )}
        </div>
      </AccountShell>
    </PageTransition>
  );
}
