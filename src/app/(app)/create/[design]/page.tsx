import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { preload } from "react-dom";
import { z } from "zod";
import { designWords } from "@/components/gallery/design-words";
import { PageTransition } from "@/components/motion/page-transition";
import { QuickStart } from "@/components/editor/quick/quick-start";
import { SuggestedDesigns } from "@/components/editor/quick/suggested-designs";
import { editorText } from "@/i18n/copy/editor";
import { getLocale } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { isCategoryId } from "@/lib/categories/catalog";
import { hostStore } from "@/lib/invites/hosts";
import { inviteStore } from "@/lib/invites/store";
import { WEDDING_KINDS, designById, suiteOccasion, type WeddingKind } from "@/lib/gallery/catalog";
import { designPicture } from "@/lib/gallery/pictures";
import { samplePath } from "@/lib/sample/paths";
import { pagePath } from "@/lib/seo/paths";
import { isTraditionId } from "@/lib/traditions/catalog";
import { isFaith } from "@/lib/traditions/faith";

export async function generateMetadata({
  params,
}: PageProps<"/create/[design]">): Promise<Metadata> {
  const { design: id } = await params;
  const design = designById(id);
  const locale = await getLocale();
  return {
    title: design
      ? editorText[locale].quickCopy.metaTitle(designWords(design, locale).name)
      : undefined,
    robots: { index: false, follow: false },
  };
}

const inviteId = z.uuid();

/*
 * A design's own page (update 4), the whole editor (owner, 2026-10-24): every Use this
 * design and every design picture lands here (designHref), with the occasion, tradition and
 * faith it was chosen for (?category=wedding&tradition=gujarati&faith=muslim, as the gallery
 * knows them). ?invite=<id> opens an invite from the account here (My invites' Edit), and
 * this design is then that invite's: the other designs under it keep the invite. The page
 * itself works on the editor's draft in the browser (quick-start.tsx).
 */
export default async function DesignStartPage({
  params,
  searchParams,
}: PageProps<"/create/[design]">) {
  const { design: id } = await params;
  const design = designById(id);
  if (!design) notFound();
  const { category, tradition, faith, kind, invite } = await searchParams;
  const locale = await getLocale();
  const occasion = isCategoryId(category) ? category : suiteOccasion(design.suite);
  const weddingKind = (WEDDING_KINDS as readonly string[]).includes(String(kind))
    ? (kind as WeddingKind)
    : null;
  const account = await getAccount();

  const wanted = typeof invite === "string" && inviteId.safeParse(invite).success ? invite : null;
  if (wanted && !account) {
    const here = `/create/${design.id}?${new URLSearchParams(
      Object.entries({ category, tradition, faith, kind, invite }).flatMap(([key, value]) =>
        typeof value === "string" ? [[key, value]] : [],
      ),
    ).toString()}`;
    redirect(`/sign-in?next=${encodeURIComponent(here)}`);
  }
  // A co-host who runs only the guests goes to the guest list; the card stays the owner's
  if (wanted && account && (await hostStore()?.myAccess(account, wanted))?.access === "guests") {
    redirect(`/invites/${wanted}`);
  }
  const store = inviteStore();
  const initialInvite = wanted && account && store ? await store.get(account, wanted) : null;
  // The preview's first page, asked for with the page rather than once the editor's code has
  // run, which on a phone's connection held it back behind the editor's scripts and fonts
  const painting = designPicture(design);
  if (painting) preload(painting, { as: "image", fetchPriority: "high" });

  return (
    <PageTransition>
      <QuickStart
        designId={design.id}
        name={designWords(design, locale).name}
        choice={{
          category: occasion,
          tradition: isTraditionId(tradition) ? tradition : null,
          suite: design.suite,
          template: design.template,
          format: design.format ?? undefined,
          // Only a kind of wedding names a faith: otherwise the family's own choice stays
          faith: isFaith(faith) ? faith : undefined,
        }}
        signedIn={Boolean(account)}
        initialInvite={initialInvite}
        missing={Boolean(wanted && !initialInvite)}
        backHref={
          initialInvite
            ? `/invites/${wanted}`
            : weddingKind
              ? pagePath({ kind: "wedding-kind", id: weddingKind }, locale)
              : pagePath({ kind: "occasion", id: occasion }, locale)
        }
        sampleHref={samplePath(design.id, { occasion, kind: weddingKind })}
        more={
          <SuggestedDesigns
            current={design.id}
            occasion={occasion}
            kind={weddingKind}
            invite={initialInvite ? wanted : null}
            locale={locale}
          />
        }
      />
    </PageTransition>
  );
}
