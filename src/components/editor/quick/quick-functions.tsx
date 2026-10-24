"use client";

import { Plus, X } from "lucide-react";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import {
  ceremonyName,
  draftCategory,
  draftTradition,
  functionOrder,
  includedFunctions,
  mainFunction,
  type FunctionId,
} from "@/lib/editor/draft";
import { useFunctionFields } from "../steps/functions-step";
import type { StepProps } from "../steps/types";

/**
 * When and where, in a design's short form: the main function's date, time and venue
 * straight away, every other one already planned under it, and the occasion's other
 * functions as chips that add one (the wedding's haldi, mehendi, sangeet and reception).
 * Its place is one tap from another function's, as in the full editor.
 */
export function QuickFunctions({ draft, update, errors }: Omit<StepProps, "goTo">) {
  const { functionCopy, quickCopy, editor } = useText(editorText);
  const fields = useFunctionFields(draft, update);
  const main = mainFunction(draft) ?? draftCategory(draft).functions.primary;
  const included = includedFunctions(draft);
  const shown: FunctionId[] = [main, ...included.filter((id) => id !== main)];
  const { suggested } = functionOrder(draft);
  const addable = suggested.filter((id) => !shown.includes(id));
  const language = draftTradition(draft)?.language;

  const include = (id: FunctionId, on: boolean) =>
    update((current) => ({
      ...current,
      functions: { ...current.functions, [id]: { ...current.functions[id], included: on } },
    }));

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {shown.map((id) => {
          const local = ceremonyName(draft, id);
          return (
            <li
              key={id}
              data-page-target={`fn-${id}`}
              data-function={id}
              className="overflow-hidden rounded-lg border border-marigold/60 bg-surface shadow-raised"
            >
              <div className="flex min-h-12 items-center justify-between gap-3 px-4 pt-3 sm:px-5">
                <h3 className="font-display text-lg">
                  {functionCopy[id].name}
                  {local && (
                    <span lang={language} className="font-sans text-base text-accent-text">
                      {" · "}
                      {local.native}
                    </span>
                  )}
                </h3>
                {/* The main function is always on the card, so only the others come off */}
                {id !== main && (
                  <button
                    type="button"
                    onClick={() => include(id, false)}
                    aria-label={quickCopy.remove(functionCopy[id].name)}
                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <X aria-hidden className="size-5" />
                  </button>
                )}
              </div>
              {fields(id, errors)}
            </li>
          );
        })}
      </ul>
      {addable.length > 0 && (
        <div role="group" aria-label={quickCopy.addFunction} className="flex flex-col gap-2">
          <p className="text-sm text-ink-muted">
            {quickCopy.addFunction} ({editor.optional})
          </p>
          <ul className="flex flex-wrap gap-2">
            {addable.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => include(id, true)}
                  aria-label={quickCopy.addOne(functionCopy[id].name)}
                  className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink transition-[background-color,border-color,color,transform] duration-150 hover:border-marigold-edge hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 motion-reduce:transition-none"
                >
                  <Plus aria-hidden className="size-4" />
                  {functionCopy[id].name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
