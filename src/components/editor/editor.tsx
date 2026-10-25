"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/toast";
import { useLocale, useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { designPageHref, editingHref } from "@/lib/editor/design-page";
import { inviteDraft } from "@/lib/editor/store";
import { switchDraft } from "@/lib/invites/sync";
import type { InviteDraft } from "@/lib/editor/draft";

/**
 * The way into the editor from elsewhere (/create). An invite is written, previewed and
 * published on its design's own page (owner, 2026-10-25: the summary page after it only
 * repeated that page), so this opens the invite asked for on this device and goes there:
 * with the Publish dialog open when back from choosing a package, at How it opens to change
 * the gate. Without a design yet, it goes to the gallery.
 */
export function Editor({
  signedIn = false,
  initialInvite = null,
  fresh = false,
  missing = false,
  openPublish = false,
  openGate = false,
}: {
  /** Drafts save to the account as well as the device. */
  signedIn?: boolean;
  /** An invite opened from My invites, the share page or the video (?invite=<id>). */
  initialInvite?: InviteDraft | null;
  /** Start a new invite, keeping the open one in the account (?new=1). */
  fresh?: boolean;
  /** ?invite= named an invite this person can't open. */
  missing?: boolean;
  /** Back from choosing a package (?publish=1): the design's page opens its Publish dialog. */
  openPublish?: boolean;
  /** Change the opening gate (?gate=1): the design's page at How it opens. */
  openGate?: boolean;
}) {
  const { editor, syncCopy } = useText(editorText);
  const router = useRouter();
  const locale = useLocale();

  // Opening an invite from the account, or starting another, happens once per visit
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      if (missing) {
        // An invite that isn't theirs: My invites, with the message, rather than the designs
        toast({ title: syncCopy.missing, tone: "error" });
        router.replace("/invites");
        return;
      }
      if (initialInvite || fresh) {
        const switched = await switchDraft(initialInvite, { signedIn });
        if (!switched) toast({ title: syncCopy.switchFailed, tone: "error" });
      }
      const draft = inviteDraft.get().draft;
      if (initialInvite && draft.remoteId) {
        const page = designPageHref(draft);
        router.replace(openPublish ? `${page}&publish=1` : openGate ? `${page}#part-gate` : page);
        return;
      }
      router.replace(editingHref(draft, locale));
    })();
  }, [initialInvite, fresh, missing, openPublish, openGate, signedIn, locale, router, syncCopy]);

  return (
    <div
      role="status"
      className="flex min-h-dvh animate-fade-in flex-col items-center justify-center gap-3 px-4 text-ink-muted"
    >
      <LoaderCircle aria-hidden className="size-6 animate-spin motion-still:animate-none" />
      <span className="text-sm">{editor.opening}</span>
    </div>
  );
}
