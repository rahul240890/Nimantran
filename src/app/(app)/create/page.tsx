import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Editor } from "@/components/editor/editor";
import { PageTransition } from "@/components/motion/page-transition";
import { editorText } from "@/i18n/copy/editor";
import { getLocale, getText } from "@/i18n/server";
import { getAccount } from "@/lib/auth/server";
import { isCategoryId } from "@/lib/categories/catalog";
import { isInviteFormat } from "@/lib/editor/formats";
import { designById, WEDDING_KIND_ENTRIES } from "@/lib/gallery/catalog";
import { WEDDING_KINDS } from "@/lib/gallery/ids";
import { hostStore } from "@/lib/invites/hosts";
import { inviteStore } from "@/lib/invites/store";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { pagePath } from "@/lib/seo/paths";
import { isSuiteId } from "@/lib/suites/catalog";
import { isTemplateId } from "@/lib/templates/ids";
import { isTraditionId } from "@/lib/traditions/catalog";
import { isFaith } from "@/lib/traditions/faith";

export async function generateMetadata(): Promise<Metadata> {
  const { editor } = await getText(editorText);
  return {
    title: editor.metaTitle,
    description: editor.metaDescription,
    robots: { index: false, follow: false },
  };
}

const inviteId = z.uuid();

/**
 * Where an older link into the editor now goes: a design named by its theme or card to that
 * design's page, an occasion or tradition alone to its designs in the gallery.
 */
function legacyHref(
  params: Record<string, string | string[] | undefined>,
  locale: Awaited<ReturnType<typeof getLocale>>,
): string | null {
  const { template, category, tradition, suite, format, faith } = params;
  const occasion = isCategoryId(category) ? category : null;
  const pack = isTraditionId(tradition) ? tradition : null;
  if (isSuiteId(suite) || isTemplateId(template)) {
    const id = draftDesignId({
      suite: isSuiteId(suite) ? suite : "classic",
      templateId: isTemplateId(template) ? template : "marigold",
      categoryId: occasion ?? "wedding",
      tradition: { id: pack },
      format: isInviteFormat(format) ? format : "story",
    } as Parameters<typeof draftDesignId>[0]);
    if (designById(id)) {
      const query = new URLSearchParams({ category: occasion ?? "wedding" });
      if (pack) query.set("tradition", pack);
      if (isFaith(faith)) query.set("faith", faith);
      return `/create/${id}?${query.toString()}`;
    }
  }
  if (occasion === "wedding" && pack) {
    const kind = WEDDING_KINDS.find((id) => WEDDING_KIND_ENTRIES[id].tradition === pack);
    if (kind) return pagePath({ kind: "wedding-kind", id: kind }, locale);
  }
  if (occasion) return pagePath({ kind: "occasion", id: occasion }, locale);
  if (pack) return pagePath({ kind: "tradition", id: pack }, locale);
  return null;
}

/*
 * The way into the editor from elsewhere. An invite is written, previewed and published on
 * its design's own page (/create/<design>), so here: ?invite=<id> opens an invite from My
 * invites and goes to its design's page, with &publish=1 (back from choosing its package)
 * its Publish dialog open there, with &gate=1 at How it opens; &preview=1 (an older Back
 * from the video) is its page too. ?new=1 starts another, keeping the open one in the
 * account, from the gallery. Older links naming a design, occasion or tradition go to that
 * design's page or the gallery.
 */
export default async function CreatePage({ searchParams }: PageProps<"/create">) {
  const params = await searchParams;
  const { invite, new: fresh, publish, gate } = params;
  const account = await getAccount();
  const wanted = typeof invite === "string" ? invite : null;
  if (wanted && !account) {
    redirect(`/sign-in?next=${encodeURIComponent(`/create?invite=${wanted}`)}`);
  }
  const store = inviteStore();
  // A co-host who runs only the guests goes to the guest list; the card stays the owner's
  if (wanted && account && inviteId.safeParse(wanted).success) {
    const mine = await hostStore()?.myAccess(account, wanted);
    if (mine?.access === "guests") redirect(`/invites/${wanted}`);
  }
  const initialInvite =
    wanted && account && store && inviteId.safeParse(wanted).success
      ? await store.get(account, wanted)
      : null;
  if (!wanted && fresh !== "1") {
    const older = legacyHref(params, await getLocale());
    if (older) redirect(older);
  }

  return (
    <PageTransition>
      <Editor
        // A new ?invite= or ?new= while the editor is open starts it over
        key={[wanted, fresh === "1"].join("|")}
        signedIn={Boolean(account)}
        initialInvite={initialInvite}
        fresh={fresh === "1"}
        missing={Boolean(wanted && !initialInvite)}
        openPublish={Boolean(initialInvite) && publish === "1"}
        openGate={Boolean(initialInvite) && gate === "1"}
      />
    </PageTransition>
  );
}
