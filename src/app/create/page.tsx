import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Editor } from "@/components/editor/editor";
import { PageTransition } from "@/components/motion/page-transition";
import { editor } from "@/content/editor";
import { isQualityChoice } from "@/content/engine-review";
import { getAccount } from "@/lib/auth/server";
import { isCategoryId } from "@/lib/categories/catalog";
import { inviteStore } from "@/lib/invites/store";
import { isTemplateId } from "@/lib/templates/schema";

export const metadata: Metadata = {
  title: editor.metaTitle,
  description: editor.metaDescription,
  robots: { index: false, follow: false },
};

const inviteId = z.uuid();

/*
 * The invite editor. Drafts save on this device, and to the account once signed in.
 * ?invite=<id> opens an invite from My invites; ?new=1 starts another, keeping the open
 * one in the account. ?category=<id> starts a fresh invite for that occasion (roka,
 * engagement, save-the-date…); ?template=<id> starts one with that design;
 * ?quality=high|medium|low|2d forces the preview's level (handy for tests without a GPU).
 */
export default async function CreatePage({ searchParams }: PageProps<"/create">) {
  const { template, category, quality, invite, new: fresh } = await searchParams;
  const account = await getAccount();
  const wanted = typeof invite === "string" ? invite : null;
  if (wanted && !account) {
    redirect(`/sign-in?next=${encodeURIComponent(`/create?invite=${wanted}`)}`);
  }
  const store = inviteStore();
  const initialInvite =
    wanted && account && store && inviteId.safeParse(wanted).success
      ? await store.get(account, wanted)
      : null;

  const params = {
    initialTemplate: isTemplateId(template) ? template : null,
    initialCategory: isCategoryId(category) ? category : null,
    fresh: fresh === "1",
  };
  return (
    <PageTransition>
      <Editor
        // A new ?invite= or ?new= while the editor is open starts it over
        key={[wanted, params.fresh, params.initialCategory, params.initialTemplate].join("|")}
        {...params}
        quality={isQualityChoice(quality) ? quality : "auto"}
        signedIn={Boolean(account)}
        initialInvite={initialInvite}
        missing={Boolean(wanted && !initialInvite)}
      />
    </PageTransition>
  );
}
