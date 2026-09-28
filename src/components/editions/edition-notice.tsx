"use client";

import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { inviteEdition, type InviteEdition } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useText } from "@/i18n/client";
import { editionsText } from "@/i18n/copy/editions";
import type { InviteDraft } from "@/lib/editor/draft";
import { PLAN_IDS, formatRupees, planShortfalls, type PaidPlanId } from "@/lib/plans/catalog";

/**
 * In the editor's last step: what this invite uses beyond its edition, while payments are
 * on, with the edition that covers it and its price today. Nothing shows otherwise.
 */
export function EditionNotice({ draft, inviteId }: { draft: InviteDraft; inviteId: string }) {
  const { limitCopy, planCopy } = useText(editionsText);
  const [edition, setEdition] = useState<InviteEdition>(null);

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
  const shortfalls = planShortfalls(draft, edition.plan);
  if (shortfalls.length === 0) return null;
  const needed = PLAN_IDS.slice(PLAN_IDS.indexOf(edition.plan)).find(
    (id): id is PaidPlanId => id !== "free" && planShortfalls(draft, id).length === 0,
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
