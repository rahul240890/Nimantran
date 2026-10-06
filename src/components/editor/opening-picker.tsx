"use client";

import Image from "next/image";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useEffect, useState } from "react";
import { SymbolMark } from "@/components/guest/opening/opening-art";
import { OpeningSample } from "@/components/guest/opening/opening";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import { draftCopy, type InviteDraft } from "@/lib/editor/draft";
import {
  GOD_PAINTINGS,
  OPENING_GODS,
  offersGods,
  openingGod,
  openingStyle,
  openingStyles,
  type OpeningGod,
  type OpeningStyle,
} from "@/lib/opening/catalog";
import type { SuiteId } from "@/lib/suites/catalog";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const NONE = "none";

/** True every other beat while the chosen style plays its opening over and over. */
function useBeat(on: boolean): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = window.setInterval(() => setOpen((value) => !value), 2600);
    return () => {
      window.clearInterval(timer);
      setOpen(false);
    };
  }, [on]);
  return on && open;
}

/**
 * The editor's choice of the guest's first screen (Step 12x): a tile per opening style,
 * drawn in the chosen theme's colours, the chosen one playing its move, then the god or
 * symbol that sits above it.
 */
export function OpeningPicker({
  draft,
  suite,
  scene,
  update,
}: {
  draft: InviteDraft;
  suite: SuiteId;
  scene: boolean;
  update: (change: (draft: InviteDraft) => InviteDraft) => void;
}) {
  const { openingCopy } = useText(editorText);
  const still = useReducedMotion();
  const style = openingStyle(draft.opening, suite, scene);
  const god = openingGod(draft.opening, draft.categoryId);
  const beat = useBeat(!still);
  const copy = draftCopy(draft, draft.languages[0]);
  const seal = `${Array.from(copy.first.trim())[0] ?? ""}${Array.from(copy.second.trim())[0] ?? ""}`;
  const setOpening = (change: Partial<InviteDraft["opening"]>) =>
    update((current) => ({ ...current, opening: { ...current.opening, ...change } }));

  return (
    <section aria-labelledby="opening-heading" className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h3 id="opening-heading" className="font-display text-xl leading-tight">
          {openingCopy.heading}
        </h3>
        <p className="max-w-2xl text-ink-muted">{openingCopy.intro}</p>
      </div>
      <RadioPrimitive.Root
        aria-labelledby="opening-heading"
        value={style}
        onValueChange={(value) => setOpening({ style: value as OpeningStyle })}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
      >
        {openingStyles(suite, scene).map((id) => {
          const words = openingCopy.styles[id];
          return (
            <RadioPrimitive.Item
              key={id}
              value={id}
              aria-describedby={`opening-${id}-d`}
              className={cn(
                "group/opening flex cursor-pointer flex-col gap-2 rounded-lg border border-line-strong bg-surface p-2 text-start shadow-raised",
                "transition-[transform,box-shadow,border-color] duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-float motion-still:hover:translate-y-0",
                "data-[state=checked]:border-marigold data-[state=checked]:shadow-[0_0_0_1px_var(--marigold),var(--elev-float)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {id === "none" ? (
                <span
                  aria-hidden
                  className="grid aspect-[9/16] w-full place-items-center rounded-lg border border-dashed border-line-strong bg-surface-2 font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
                >
                  {words.name}
                </span>
              ) : (
                <OpeningSample
                  suite={suite}
                  style={id}
                  god={god}
                  open={id === style && beat}
                  seal={seal}
                />
              )}
              <span className="flex flex-col gap-0.5 px-1 pb-1">
                <span className="flex items-center justify-between gap-2 font-semibold text-ink">
                  {words.name}
                  <span
                    aria-hidden
                    className="grid size-[18px] shrink-0 place-items-center rounded-full border-2 border-line-control group-data-[state=checked]/opening:border-marigold"
                  >
                    <span className="size-2 scale-0 rounded-full bg-marigold transition-transform group-data-[state=checked]/opening:scale-100" />
                  </span>
                </span>
                <span id={`opening-${id}-d`} className="text-sm text-ink-muted">
                  {words.description}
                </span>
              </span>
            </RadioPrimitive.Item>
          );
        })}
      </RadioPrimitive.Root>

      {offersGods(draft.categoryId) && style !== "none" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h4 id="opening-god-heading" className="font-semibold text-ink">
              {openingCopy.godHeading}
            </h4>
            <p className="max-w-2xl text-sm text-ink-muted">{openingCopy.godIntro}</p>
          </div>
          <RadioPrimitive.Root
            aria-labelledby="opening-god-heading"
            value={god ?? NONE}
            onValueChange={(value) =>
              setOpening({ god: value === NONE ? null : (value as OpeningGod) })
            }
            className="flex flex-wrap gap-2"
          >
            {[NONE, ...OPENING_GODS].map((id) => {
              const painting = id === NONE ? undefined : GOD_PAINTINGS[id as OpeningGod];
              return (
                <RadioPrimitive.Item
                  key={id}
                  value={id}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface py-1 ps-1 pe-3.5 text-sm text-ink shadow-raised",
                    "data-[state=checked]:border-marigold data-[state=checked]:bg-[color-mix(in_srgb,var(--marigold)_12%,var(--surface))] data-[state=checked]:shadow-[0_0_0_1px_var(--marigold)]",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    id === NONE && "ps-3.5",
                  )}
                >
                  {painting ? (
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-full border border-line bg-card-back">
                      <Image
                        src={painting.src}
                        alt=""
                        fill
                        sizes="2.25rem"
                        className="object-contain"
                      />
                    </span>
                  ) : id !== NONE ? (
                    <span className="[container-type:size] grid size-9 shrink-0 place-items-center rounded-full border border-line bg-card-ivory">
                      <SymbolMark god={id as OpeningGod} />
                    </span>
                  ) : null}
                  {id === NONE ? openingCopy.noGod : openingCopy.gods[id as OpeningGod]}
                </RadioPrimitive.Item>
              );
            })}
          </RadioPrimitive.Root>
        </div>
      )}
    </section>
  );
}
