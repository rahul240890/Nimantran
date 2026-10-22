"use client";

import Image from "next/image";
import { useState } from "react";
import { usePaidOn } from "@/components/editions/use-invite-edition";
import { TierBadge } from "@/components/pricing/tier-badge";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import type { InviteDraft } from "@/lib/editor/draft";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { draftSuite } from "@/lib/publish/story";
import { SUITES } from "@/lib/suites/catalog";
import { GateDialog } from "./gate-chooser";

/**
 * Past the design stage, the chosen design sits at the top as one small strip: its cover
 * painting, its name and price (or the package paid for it), and the way back to change it,
 * or to change only its opening gate.
 */
export function DesignBar({
  draft,
  onChange,
  update,
  className,
}: {
  draft: InviteDraft;
  onChange: () => void;
  update: (change: (draft: InviteDraft) => InviteDraft) => void;
  className?: string;
}) {
  const { editor, suiteCopy, designCopy, openingCopy } = useText(editorText);
  const [gate, setGate] = useState(false);
  const designId = draftDesignId(draft);
  // Once this design is paid for, the strip says so rather than showing its price
  const paidOn = usePaidOn(draft.remoteId ?? null);
  const suite = draftSuite(draft);
  const cover = SUITES[suite].images.cover ?? null;
  const name =
    draft.suite && draft.suite !== "classic"
      ? suiteCopy.names[draft.suite]
      : designCopy[draft.templateId].name;

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <span
        aria-hidden
        className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-surface-2 shadow-raised ring-1 ring-line"
      >
        {cover && <Image src={cover} alt="" fill sizes="2.5rem" className="object-cover" />}
      </span>
      <span className="flex min-w-0 flex-col items-start gap-1">
        <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="sr-only">{editor.designChosen}: </span>
          <span className="truncate font-semibold text-ink">{name}</span>
          <TierBadge designId={designId} variant="plain" paid={paidOn(designId)} />
        </span>
        <span className="-my-1.5 -ms-2 flex flex-wrap gap-x-1">
          <Button variant="ghost" size="sm" onClick={onChange} className="text-accent-text">
            {editor.changeDesign}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setGate(true)}
            className="text-accent-text"
          >
            {openingCopy.change}
          </Button>
        </span>
      </span>
      <GateDialog draft={draft} update={update} open={gate} onOpenChange={setGate} />
    </div>
  );
}
