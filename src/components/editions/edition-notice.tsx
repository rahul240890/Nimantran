"use client";

import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { inviteEdition, type InviteEdition } from "@/actions/checkout";
import { useDesignTier } from "@/components/pricing/pricing-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useText } from "@/i18n/client";
import { editionsText } from "@/i18n/copy/editions";
import type { InviteDraft } from "@/lib/editor/draft";
import { PAID_PLAN_IDS, editionAfter, formatRupees, planShortfalls } from "@/lib/plans/catalog";
import { draftDesignId } from "@/lib/plans/design-defaults";

/**
 * In the editor's last step: what this invite uses beyond its package, while payments are
 * on, with the package that covers it and its price today. Nothing shows otherwise.
 */
export function EditionNotice({ draft, inviteId }: { draft: InviteDraft; inviteId: string }) {
  const { limitCopy, planCopy } = useText(editionsText);
  const [edition, setEdition] = useState<InviteEdition>(null);
  // A paid design asks for a package at its price (Admin, Designs)
  const design = useDesignTier(draftDesignId(draft)).tier;

  useEffect(() => {
    let live = true;
    inviteEdition(inviteId)
      .then((result) => live && setEdition(result))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [inviteId]);

  if (!edition) return null;
  const shortfalls = planShortfalls(draft, edition.edition, design);
  if (shortfalls.length === 0) return null;
  const needed = PAID_PLAN_IDS.find(
    (id) =>
      edition.prices[id] &&
      planShortfalls(draft, editionAfter(edition.edition, id, design), design).length === 0,
  );
  const price = needed ? edition.prices[needed] : undefined;

  return (
    <Card
      elevation="flat"
      role="status"
      className="gap-3 border-marigold/50 bg-marigold/10 p-5"
      data-edition-notice
    >
      <p className="flex items-center gap-2 font-semibold">
        <Lock aria-hidden className="size-5 shrink-0 text-accent-text" />
        {limitCopy.title}
      </p>
      <p className="text-sm text-ink-muted">
        {shortfalls.map((need) => limitCopy.used[need.limit](need.used)).join(" · ")}
      </p>
      {needed && price && (
        <>
          <p className="text-sm text-ink-muted">
            {limitCopy.unlockBody(planCopy[needed].name, formatRupees(price.amountPaise))}
          </p>
          <Button asChild size="sm" className="self-start">
            <Link href={`/invites/${inviteId}/edition?plan=${needed}`}>
              <Sparkles aria-hidden />
              {limitCopy.unlock(planCopy[needed].name)}
            </Link>
          </Button>
        </>
      )}
    </Card>
  );
}
