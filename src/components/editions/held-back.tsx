"use client";

import { Lock, Sparkles, Undo2 } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { loadInvite } from "@/actions/invites";
import { designWords } from "@/components/gallery/design-words";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useLocale, useText } from "@/i18n/client";
import { editionsText } from "@/i18n/copy/editions";
import type { InviteDraft } from "@/lib/editor/draft";
import { inviteDraft } from "@/lib/editor/store";
import { designById } from "@/lib/gallery/catalog";
import { syncDraft, syncStore } from "@/lib/invites/sync";
import { draftDesignId } from "@/lib/plans/design-defaults";

/**
 * In the editor, while the account refuses to save a live invite because its package
 * doesn't cover the change (most often another design than the one paid for): guests keep
 * the live copy, and the host either buys a package for the change or goes back.
 */
export function HeldBackNotice({ draft }: { draft: InviteDraft }) {
  const { heldCopy, limitCopy } = useText(editionsText);
  const locale = useLocale();
  const sync = useSyncExternalStore(syncStore.subscribe, syncStore.get, syncStore.getServer);
  const [restoring, setRestoring] = useState(false);
  const held = sync === "needs-plan" ? syncStore.heldBack() : null;
  if (!held || !draft.remoteId) return null;

  const inviteId = draft.remoteId;
  const designId = draftDesignId(draft);
  const paid = held.paidDesign ? designById(held.paidDesign) : null;
  const paidName = paid ? designWords(paid, locale).name : null;
  const otherDesign = held.paidDesign !== null && held.paidDesign !== designId;

  // The live copy's design comes back; every other edit stays, and saves once it fits
  const restore = async () => {
    setRestoring(true);
    const live = await loadInvite(inviteId).catch(() => null);
    setRestoring(false);
    if (!live) {
      toast({ title: heldCopy.backFailed, tone: "error" });
      return;
    }
    inviteDraft.update((current) => ({
      ...current,
      categoryId: live.categoryId,
      tradition: live.tradition,
      suite: live.suite,
      format: live.format,
      templateId: live.templateId,
      languages: live.languages,
    }));
    void syncDraft();
  };

  return (
    <Card
      elevation="flat"
      role="status"
      className="mb-5 gap-3 border-marigold/50 bg-marigold/10 p-5"
      data-held-back
    >
      <p className="flex items-center gap-2 font-semibold">
        <Lock aria-hidden className="size-5 shrink-0 text-accent-text" />
        {heldCopy.title}
      </p>
      <p className="text-sm text-ink-muted">
        {otherDesign && paidName ? heldCopy.design(paidName) : heldCopy.body}
      </p>
      <p className="text-sm text-ink-muted">
        {held.shortfalls.map((need) => limitCopy.used[need.limit](need.used)).join(" · ")}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button asChild size="sm">
          <Link
            href={`/invites/${inviteId}/edition?plan=${held.plan === "free" ? "basic" : held.plan}&design=${designId}`}
          >
            <Sparkles aria-hidden />
            {heldCopy.choose}
          </Link>
        </Button>
        {otherDesign && (
          <Button
            variant="secondary"
            size="sm"
            loading={restoring}
            leadingIcon={<Undo2 aria-hidden />}
            onClick={() => void restore()}
          >
            {paidName ? heldCopy.back(paidName) : heldCopy.backPlain}
          </Button>
        )}
      </div>
    </Card>
  );
}
