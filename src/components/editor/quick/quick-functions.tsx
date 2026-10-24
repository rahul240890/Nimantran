"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
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

const chip =
  "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 motion-reduce:transition-none disabled:cursor-default disabled:active:scale-100";

/**
 * When and where, in two moves (owner, 2026-10-24: first all the events, then their dates
 * and places, so many events go in quickly). The occasion's events are chips to tick, the
 * main one ticked already and the rarer ones behind More events; then each ticked event has
 * its date, time and venue, in the order they happen. Its place is one tap from another
 * event's, as in the full editor.
 */
export function QuickFunctions({ draft, update, errors }: Omit<StepProps, "goTo">) {
  const { functionCopy, quickCopy } = useText(editorText);
  const fields = useFunctionFields(draft, update);
  const main = mainFunction(draft) ?? draftCategory(draft).functions.primary;
  const included = includedFunctions(draft);
  const { suggested, more } = functionOrder(draft);
  const offered = suggested.includes(main) ? suggested : [main, ...suggested];
  // The rarer events show once asked for, or once one of them is ticked
  const [showMore, setShowMore] = useState(() => more.some((id) => included.includes(id)));
  const chips = showMore ? [...offered, ...more] : offered;
  const language = draftTradition(draft)?.language;

  const include = (id: FunctionId, on: boolean) =>
    update((current) => ({
      ...current,
      functions: { ...current.functions, [id]: { ...current.functions[id], included: on } },
    }));

  // An occasion with one event only has nothing to pick: its date and place come straight away
  const choosing = offered.length > 1 || more.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {choosing && (
        <div role="group" aria-label={quickCopy.pickEvents} className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-ink">{quickCopy.pickEvents}</p>
          <ul className="flex flex-wrap gap-2">
            {chips.map((id) => {
              const on = included.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    // The main event is always on the card
                    disabled={id === main}
                    onClick={() => include(id, !on)}
                    className={cn(
                      chip,
                      on
                        ? "border-marigold bg-marigold/15 text-ink"
                        : "border-line-strong bg-surface text-ink hover:border-marigold-edge hover:text-accent-text",
                    )}
                  >
                    {on ? (
                      <Check aria-hidden className="size-4 text-accent-text" />
                    ) : (
                      <Plus aria-hidden className="size-4" />
                    )}
                    {functionCopy[id].name}
                  </button>
                </li>
              );
            })}
            {!showMore && more.length > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => setShowMore(true)}
                  className={cn(
                    chip,
                    "border-transparent text-accent-text underline-offset-4 hover:underline",
                  )}
                >
                  {quickCopy.moreEvents}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
      <ul className="flex flex-col gap-4">
        {included.map((id) => {
          const local = ceremonyName(draft, id);
          return (
            <li
              key={id}
              data-page-target={`fn-${id}`}
              data-function={id}
              className="overflow-hidden rounded-lg border border-marigold/60 bg-surface shadow-raised"
            >
              <h3 className="flex min-h-11 items-center px-4 pt-3 font-display text-lg sm:px-5">
                <span>
                  {functionCopy[id].name}
                  {local && (
                    <span lang={language} className="font-sans text-base text-accent-text">
                      {" · "}
                      {local.native}
                    </span>
                  )}
                </span>
              </h3>
              {fields(id, errors)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
