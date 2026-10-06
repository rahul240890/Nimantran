"use client";

import { Check, ChevronDown } from "lucide-react";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import { includedFunctions, type EditorStep, type InviteDraft } from "@/lib/editor/draft";
import { stepErrors } from "@/lib/editor/draft-checks";

/**
 * The details page (the middle of three stages): the names, the functions, and the photos
 * and music, as three parts of one page. One part is open at a time; the others fold to a
 * single line that says what's in them, so the host always sees how far along they are and
 * can open any part without stepping through the rest.
 */
export const DETAIL_STEPS = ["couple", "functions", "extras"] as const;
export type DetailStep = (typeof DETAIL_STEPS)[number];

export const isDetailStep = (step: EditorStep): step is DetailStep =>
  (DETAIL_STEPS as readonly EditorStep[]).includes(step);

type SectionState = "done" | "todo" | "check";

/** A finished part shows a tick; one passed over with something missing asks for a look. */
function sectionState(draft: InviteDraft, part: DetailStep, current: DetailStep): SectionState {
  const passed = DETAIL_STEPS.indexOf(part) < DETAIL_STEPS.indexOf(current);
  if (!passed) return "todo";
  return Object.keys(stepErrors(draft, part)).length === 0 ? "done" : "check";
}

function useSummary(draft: InviteDraft) {
  const { editor, functionCopy } = useText(editorText);
  return (part: DetailStep) => {
    if (part === "couple") {
      const names = [draft.content.first, draft.content.second]
        .map((name) => name?.trim())
        .filter((name): name is string => Boolean(name));
      return editor.sections.names(names);
    }
    if (part === "functions") {
      return editor.sections.functions(includedFunctions(draft).map((id) => functionCopy[id].name));
    }
    const music = draft.music.clip !== null || draft.music.playOnOpen;
    return editor.sections.extras(draft.photos.length, music);
  };
}

/** One folded part: its number (or a tick), its name and what's filled in. */
export function SectionRow({
  draft,
  part,
  current,
  label,
  onOpen,
}: {
  draft: InviteDraft;
  part: DetailStep;
  current: DetailStep;
  label: string;
  onOpen: () => void;
}) {
  const { editor } = useText(editorText);
  const summary = useSummary(draft)(part);
  const state = sectionState(draft, part, current);
  const number = DETAIL_STEPS.indexOf(part) + 1;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={editor.sections.open(label, summary, state)}
      className={cn(
        "group flex min-h-16 w-full cursor-pointer items-center gap-3.5 rounded-lg border border-line bg-surface px-4 py-3 text-start shadow-raised transition-[border-color,transform] duration-200",
        "hover:border-line-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:active:scale-[0.99]",
      )}
    >
      <SectionMark number={number} state={state} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold text-ink">{label}</span>
        <span className="truncate text-sm text-ink-muted">{summary}</span>
      </span>
      {state === "check" ? (
        <span className="shrink-0 rounded-full bg-warning/12 px-2.5 py-1 text-xs font-semibold text-warning">
          {editor.sections.check}
        </span>
      ) : (
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-accent-text">
          <span className="max-[359px]:sr-only">{editor.sections.edit}</span>
          <ChevronDown aria-hidden className="size-4" />
        </span>
      )}
    </button>
  );
}

/** The part's number in a ring, or a gold tick once it's done. */
export function SectionMark({
  number,
  state = "todo",
  active = false,
}: {
  number: number;
  state?: SectionState;
  active?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full font-label text-sm",
        state === "done"
          ? "bg-marigold text-on-marigold"
          : active
            ? "bg-ink text-paper"
            : "border border-line-strong text-ink-muted",
      )}
    >
      {state === "done" ? <Check className="size-4" strokeWidth={2.75} /> : number}
    </span>
  );
}
