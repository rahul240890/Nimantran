import { Link2Off } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AccountShell } from "@/components/account/account-shell";
import { TemplateCover } from "@/components/brand/template-cover";
import { AcceptCohost } from "@/components/dashboard/accept-cohost";
import { PageTransition } from "@/components/motion/page-transition";
import { TiltCard } from "@/components/motion/tilt-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getAccount } from "@/lib/auth/server";
import { CATEGORIES, isCategoryId } from "@/lib/categories/catalog";
import { newDraft } from "@/lib/editor/draft";
import { hostStore, type JoinPreview } from "@/lib/invites/hosts";
import { inviteNames } from "@/lib/publish/describe";
import { getLocale, getText } from "@/i18n/server";
import { dashboardText } from "@/i18n/copy/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const { joinCopy } = await getText(dashboardText);
  return {
    title: joinCopy.metaTitle,
    robots: { index: false, follow: false },
  };
}

const TOKEN = /^[0-9a-f]{16,64}$/;

export default async function JoinPage({ params }: PageProps<"/join/[token]">) {
  const { joinCopy } = await getText(dashboardText);
  const { token } = await params;
  const store = hostStore();
  const [preview, account] = await Promise.all([
    store && TOKEN.test(token) ? store.joinPreview(token) : null,
    getAccount(),
  ]);

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
          {!store ? (
            <p className="text-center text-ink-muted">{joinCopy.off}</p>
          ) : !preview ? (
            <EmptyState
              icon={<Link2Off aria-hidden className="size-7" />}
              title={joinCopy.usedTitle}
              description={joinCopy.usedBody}
              action={
                <Button asChild>
                  <Link href="/invites">{joinCopy.myInvites}</Link>
                </Button>
              }
            />
          ) : (
            <JoinCard token={token} preview={preview} signedIn={Boolean(account)} />
          )}
        </div>
      </AccountShell>
    </PageTransition>
  );
}

async function JoinCard({
  token,
  preview,
  signedIn,
}: {
  token: string;
  preview: JoinPreview;
  signedIn: boolean;
}) {
  const { joinCopy } = await getText(dashboardText);
  const categoryId = isCategoryId(preview.categoryId) ? preview.categoryId : "wedding";
  const draft = { ...newDraft(preview.templateId, categoryId), content: preview.content };
  const names = inviteNames(draft);
  const occasion = CATEGORIES[categoryId].names[await getLocale()];
  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <div className="mx-auto w-40 sm:w-52 md:w-full">
        <TiltCard maxTilt={10} className="rounded-md">
          <TemplateCover id={preview.templateId} className="rounded-md shadow-float" />
        </TiltCard>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
          {joinCopy.eyebrow}
        </p>
        <h1 className="font-display text-[2rem] leading-[1.08] break-words sm:text-[2.6rem]">
          {joinCopy.title(names)}
        </h1>
        <p className="text-ink-muted">
          {joinCopy.body(preview.invitedBy, occasion, preview.access)}
        </p>
        {preview.label && (
          <p className="text-sm font-semibold">{joinCopy.forLabel(preview.label)}</p>
        )}
        <div className="pt-2">
          {signedIn ? (
            <AcceptCohost token={token} />
          ) : (
            <div className="flex flex-col gap-2">
              <Button asChild size="lg" className="self-start">
                <Link href={`/sign-in?next=${encodeURIComponent(`/join/${token}`)}`}>
                  {joinCopy.signIn}
                </Link>
              </Button>
              <p className="text-sm text-ink-muted">{joinCopy.signInNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
