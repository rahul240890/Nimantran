"use client";

import Image from "next/image";
import { TierBadge } from "@/components/pricing/tier-badge";
import { Button } from "@/components/ui/button";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import type { InviteDraft } from "@/lib/editor/draft";
import { draftDesignId } from "@/lib/plans/design-defaults";
import { draftSuite } from "@/lib/publish/story";
import { SUITES } from "@/lib/suites/catalog";

/**
 * Past the design stage, the chosen design sits at the top as one small strip: its cover
 * painting, its name and price, and the way back to change it.
 */
export function DesignBar({
  draft,
  onChange,
  className,
}: {
  draft: InviteDraft;
  onChange: () => void;
  className?: string;
}) {
  const { editor, suiteCopy, designCopy } = useText(editorText);
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
          <TierBadge designId={draftDesignId(draft)} variant="plain" />
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onChange}
          className="-my-1.5 -ms-2 text-accent-text"
        >
          {editor.changeDesign}
        </Button>
      </span>
    </div>
  );
}
