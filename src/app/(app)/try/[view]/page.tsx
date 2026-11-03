import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { PageTransition } from "@/components/motion/page-transition";
import { TryView } from "@/components/try/try-view";
import { cardsText } from "@/i18n/copy/cards";
import { publishText } from "@/i18n/copy/publish";
import { getText } from "@/i18n/server";
import { authMode } from "@/lib/auth/mode";
import { isTryView } from "@/lib/try/views";

export async function generateMetadata({ params }: PageProps<"/try/[view]">): Promise<Metadata> {
  const { view } = await params;
  const [{ hostPreviewCopy, tryCopy }, { cardsCopy }] = await Promise.all([
    getText(publishText),
    getText(cardsText),
  ]);
  const title =
    view === "video"
      ? tryCopy.videoTitle
      : view === "cards"
        ? cardsCopy.metaTitle
        : hostPreviewCopy.metaTitle;
  return { title, robots: { index: false, follow: false } };
}

/*
 * The invitation tried before signing in (owner, 2026-11-03: "first make sure user can take
 * the experience of all, the video, the cards and the real link, without sign in"). The
 * design's page keeps the invite in the browser (lib/editor/store.ts), so these pages draw it
 * from there: its website as guests open it from the link, its video, and its save-the-date
 * and thank-you cards, every one with the Shubh Invitation mark. Publishing asks for the
 * account; nothing here is saved anywhere.
 */
export default async function TryPage({ params, searchParams }: PageProps<"/try/[view]">) {
  const { view } = await params;
  if (!isTryView(view)) notFound();
  const { frame, full } = await searchParams;

  if (view === "website")
    return <TryView view="website" frame={frame === "1"} full={full === "1"} />;
  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
          <TryView view={view} testCodecs={authMode() === "preview"} />
        </div>
      </AccountShell>
    </PageTransition>
  );
}
