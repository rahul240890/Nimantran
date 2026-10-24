import { Link2Off } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { TemplateCover } from "@/components/brand/template-cover";
import { TakeHandover } from "@/components/dashboard/take-handover";
import { PageTransition } from "@/components/motion/page-transition";
import { TiltCard } from "@/components/motion/tilt-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { phoneSignIn } from "@/lib/auth/mode";
import { getAccount } from "@/lib/auth/server";
import { CATEGORIES } from "@/lib/categories/catalog";
import { newDraft } from "@/lib/editor/draft";
import { HANDOVER_TOKEN, handoverStore, type HandoverPreview } from "@/lib/invites/handover";
import { inviteNames } from "@/lib/publish/describe";
import { SUITES } from "@/lib/suites/catalog";
import { getLocale, getText } from "@/i18n/server";
import { dashboardText } from "@/i18n/copy/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const { claimCopy } = await getText(dashboardText);
  return { title: claimCopy.metaTitle, robots: { index: false, follow: false } };
}

/*
 * A hand-over link (update 5): an invitation Shubh made for a family, which becomes theirs
 * when they sign in and take it (src/lib/invites/handover.ts). A used, withdrawn or expired
 * link says so and points to My invites.
 */
export default async function ClaimPage({ params }: PageProps<"/claim/[token]">) {
  const { claimCopy } = await getText(dashboardText);
  const { token } = await params;
  const store = handoverStore();
  const [preview, account] = await Promise.all([
    store && HANDOVER_TOKEN.test(token) ? store.preview(token).catch(() => null) : null,
    getAccount(),
  ]);

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
          {!store ? (
            <p className="text-center text-ink-muted">{claimCopy.off}</p>
          ) : !preview ? (
            <EmptyState
              icon={<Link2Off aria-hidden className="size-7" />}
              title={claimCopy.usedTitle}
              description={claimCopy.usedBody}
              action={
                <Button asChild>
                  <Link href="/invites">{claimCopy.myInvites}</Link>
                </Button>
              }
            />
          ) : (
            <ClaimCard token={token} preview={preview} signedIn={Boolean(account)} />
          )}
        </div>
      </AccountShell>
    </PageTransition>
  );
}

async function ClaimCard({
  token,
  preview,
  signedIn,
}: {
  token: string;
  preview: HandoverPreview;
  signedIn: boolean;
}) {
  const { claimCopy } = await getText(dashboardText);
  const draft = { ...newDraft(preview.templateId, preview.categoryId), content: preview.content };
  const names = inviteNames(draft);
  const locale = await getLocale();
  const occasion = CATEGORIES[preview.categoryId].names[locale];
  // The invite's own painted design, as My invites shows it
  const cover = SUITES[preview.theme].images.cover ?? null;
  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <div className="mx-auto w-40 sm:w-52 md:w-full">
        <TiltCard maxTilt={10} className="rounded-md">
          {cover ? (
            <span className="relative block aspect-[9/16] overflow-hidden rounded-md bg-night shadow-float">
              <Image
                src={cover}
                alt=""
                fill
                sizes="(min-width: 768px) 15rem, 13rem"
                className="object-cover"
              />
            </span>
          ) : (
            <TemplateCover
              id={preview.templateId}
              locale={locale}
              className="rounded-md shadow-float"
            />
          )}
        </TiltCard>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
          {claimCopy.eyebrow}
        </p>
        <h1 className="font-display text-[1.75rem] leading-[1.08] break-words sm:text-[2.15rem]">
          {claimCopy.title(names)}
        </h1>
        <p className="text-ink-muted">{claimCopy.body(occasion)}</p>
        <div className="pt-2">
          {signedIn ? (
            <TakeHandover token={token} />
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild size="lg" className="self-start">
                <Link href={`/sign-in?next=${encodeURIComponent(`/claim/${token}`)}`}>
                  {claimCopy.signIn}
                </Link>
              </Button>
              <p className="text-sm text-ink-muted">
                {phoneSignIn() ? claimCopy.signInNote : claimCopy.signInNoteGoogle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
