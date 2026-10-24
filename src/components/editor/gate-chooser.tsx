"use client";

import { DoorOpen } from "lucide-react";
import { OpeningSample } from "@/components/guest/opening/opening";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Hint } from "@/components/ui/quiet";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { draftOpeningGod, draftOpeningStyle, type InviteDraft } from "@/lib/editor/draft";
import { draftShowsScene, draftSuite } from "@/lib/publish/story";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { OpeningPicker, useBeat } from "./opening-picker";

type Update = (change: (draft: InviteDraft) => InviteDraft) => void;

/**
 * The opening gate picker in a dialog, for changing it past the design step: from the
 * design strip over the details and from the summary. Each tap saves straight away, so the
 * guest preview, the video and a live link open with the new gate.
 */
export function GateDialog({
  draft,
  update,
  open,
  onOpenChange,
}: {
  draft: InviteDraft;
  update: Update;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { editor, openingCopy } = useText(editorText);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={openingCopy.dialogTitle}
        description={openingCopy.dialogBody}
        closeLabel={editor.close}
        className="max-w-5xl"
        footer={
          <DialogClose asChild>
            <Button>{openingCopy.done}</Button>
          </DialogClose>
        }
      >
        <OpeningPicker
          draft={draft}
          suite={draftSuite(draft)}
          scene={draftShowsScene(draft)}
          update={update}
          titled={false}
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * The summary's look at the opening gate: the chosen one playing its move in the theme's
 * colours, its name and what it does, and the way to change it.
 */
export function GateSummary({
  draft,
  update,
  open,
  onOpenChange,
}: {
  draft: InviteDraft;
  update: Update;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { openingCopy } = useText(editorText);
  const suite = draftSuite(draft);
  const style = draftOpeningStyle(draft, suite, draftShowsScene(draft));
  const beat = useBeat(!useReducedMotion());
  const words = openingCopy.styles[style];

  return (
    <section
      aria-labelledby="summary-gate"
      data-testid="gate-summary"
      className="flex flex-col gap-3 border-t border-line pt-5"
    >
      <h2 id="summary-gate" className="font-display text-xl">
        {openingCopy.heading}
      </h2>
      <div className="flex items-start gap-4">
        <span className="block w-20 shrink-0 sm:w-24">
          {style === "none" ? (
            <span
              aria-hidden
              className="grid aspect-[9/16] w-full place-items-center rounded-lg border border-dashed border-line-strong bg-surface-2"
            >
              <DoorOpen className="size-6 text-ink-faint" />
            </span>
          ) : (
            <OpeningSample suite={suite} style={style} god={draftOpeningGod(draft)} open={beat} />
          )}
        </span>
        <div className="flex min-w-0 flex-col items-start gap-1.5">
          <p className="font-display text-lg leading-tight break-words">{words.name}</p>
          <p className="text-sm text-ink-muted">{words.description}</p>
          <Hint>{openingCopy.summaryBody}</Hint>
          <Button
            variant="secondary"
            size="sm"
            leadingIcon={<DoorOpen aria-hidden />}
            onClick={() => onOpenChange(true)}
            className="mt-1.5 h-auto min-h-11 max-w-full py-2 text-balance whitespace-normal"
          >
            {openingCopy.change}
          </Button>
        </div>
      </div>
      <GateDialog draft={draft} update={update} open={open} onOpenChange={onOpenChange} />
    </section>
  );
}
