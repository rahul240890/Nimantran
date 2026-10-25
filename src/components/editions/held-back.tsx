"use client";

import { CopyPlus, Lock, Sparkles, Undo2 } from "lucide-react";
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
import { splitOffDraft, syncDraft, syncStore } from "@/lib/invites/sync";
import { draftDesignId } from "@/lib/plans/design-defaults";

/**
 * In the editor, while the account refuses to save a live invite because its package
 * doesn't cover the change (most often another design than the one paid for): guests keep
 * the live copy, and the host buys a package for the change, goes back, or makes the change
 * an invitation of its own (owner, 2026-10-25).
 */
export function HeldBackNotice({
  draft,
  onRestored,
  onSplit,
}: {
  draft: InviteDraft;
  /** After going back to the paid design: a design's own page turns to it. */
  onRestored?: () => void;
  /** After the change became a new invitation: a design's own page drops the live one. */
  onSplit?: () => void;
}) {
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
    onRestored?.();
  };

  // The live invite stays as guests have it; this one saves as a new invite, unpublished
  const split = () => {
    splitOffDraft();
    void syncDraft();
    toast({ title: heldCopy.newInviteDone, tone: "success" });
    onSplit?.();
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
      <p className="text-sm text-ink-muted">{heldCopy.guestView}</p>
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
        <Button
          variant="secondary"
          size="sm"
          leadingIcon={<CopyPlus aria-hidden />}
          onClick={split}
          data-split-invite
        >
          {heldCopy.newInvite}
        </Button>
      </div>
    </Card>
  );
}
