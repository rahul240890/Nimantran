"use client";

import Image from "next/image";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useEffect, useId, useState } from "react";
import { SymbolMark } from "@/components/guest/opening/opening-art";
import { OpeningSample } from "@/components/guest/opening/opening";
import { OPENING_PACE } from "@/components/guest/opening/opening-pace";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import {
  draftOpeningGod,
  draftOpeningGods,
  draftOpeningStyle,
  draftOwnOpening,
  type InviteDraft,
} from "@/lib/editor/draft";
import {
  GOD_PAINTINGS,
  OPENING_GROUPS,
  offersGods,
  openingStyles,
  WELCOME_SCENES,
  type OpeningGod,
  type OpeningStyle,
  type WelcomeScene,
} from "@/lib/opening/catalog";
import type { SuiteId } from "@/lib/suites/catalog";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const NONE = "none";
const AUTO = "auto";
const ALL = "all";

/** True every other beat while the chosen style plays its opening over and over. */
export function useBeat(on: boolean): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!on) return;
    const timer = window.setInterval(() => setOpen((value) => !value), 2600 * OPENING_PACE);
    return () => {
      window.clearInterval(timer);
      setOpen(false);
    };
  }, [on]);
  return on && open;
}

/**
 * The editor's choice of the guest's first screen (Step 12x), named for hosts as the opening
 * gate or cover screen: the design's own first, then a tile per opening style by kind,
 * drawn in the chosen theme's colours, the chosen one playing its move, then the god or
 * symbol that sits above it. In the summary's dialog the dialog carries the heading.
 */
export function OpeningPicker({
  draft,
  suite,
  scene,
  update,
  titled = true,
}: {
  draft: InviteDraft;
  suite: SuiteId;
  scene: boolean;
  update: (change: (draft: InviteDraft) => InviteDraft) => void;
  /** Shows its own heading and introduction; off where a dialog already gives them. */
  titled?: boolean;
}) {
  const { openingCopy } = useText(editorText);
  const still = useReducedMotion();
  const style = draftOpeningStyle(draft, suite, scene);
  const own = draftOwnOpening(draft, suite, scene);
  const god = draftOpeningGod(draft);
  const gods = draftOpeningGods(draft);
  const beat = useBeat(!still);
  const offered = openingStyles(suite, scene);
  const [kind, setKind] = useState<string>(ALL);
  const ids = useId();
  const headingId = `${ids}-heading`;
  const setOpening = (change: Partial<InviteDraft["opening"]>) =>
    update((current) => ({ ...current, opening: { ...current.opening, ...change } }));
  // The design's own gate leads in a group of its own; the kinds after it leave it out
  const groups = [
    { id: "own", styles: [own] as readonly OpeningStyle[] },
    ...OPENING_GROUPS.map((group) => ({
      id: group.id,
      styles: group.styles.filter((id) => id !== own && offered.includes(id)),
    })),
  ].filter((group) => group.styles.length > 0);
  // The design's own stays above whichever kind is shown
  const shown = groups.filter((group) => kind === ALL || group.id === "own" || group.id === kind);

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      <div className={cn("flex flex-col gap-1.5", !titled && "sr-only")}>
        <h2 id={headingId} className="font-display text-xl leading-tight">
          {openingCopy.heading}
        </h2>
        <p className="max-w-2xl text-ink-muted">{openingCopy.intro}</p>
      </div>
      {/* So many gates: a row of kinds narrows the list to one at a time (scrolls on phones) */}
      <div
        role="group"
        aria-label={openingCopy.filterLabel}
        className="-mx-1 flex [scrollbar-width:thin] gap-2 overflow-x-auto px-1 py-1 sm:flex-wrap sm:overflow-visible"
      >
        {[ALL, ...groups.filter((group) => group.id !== "own").map((group) => group.id)].map(
          (id) => (
            <button
              key={id}
              type="button"
              aria-pressed={kind === id}
              onClick={() => setKind(id)}
              className={cn(
                "flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border border-line-strong bg-surface px-3.5 text-sm whitespace-nowrap text-ink shadow-raised",
                "aria-pressed:border-marigold aria-pressed:bg-[color-mix(in_srgb,var(--marigold)_12%,var(--surface))] aria-pressed:shadow-[0_0_0_1px_var(--marigold)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              )}
            >
              {id === ALL
                ? openingCopy.filterAll
                : openingCopy.groups[id as keyof typeof openingCopy.groups]}
            </button>
          ),
        )}
      </div>
      <RadioPrimitive.Root
        aria-labelledby={headingId}
        value={style}
        onValueChange={(value) => setOpening({ style: value as OpeningStyle })}
        className="flex flex-col gap-5"
      >
        {shown.map((group) => {
          const styles = group.styles;
          return (
            <div key={group.id} role="presentation" className="flex flex-col gap-2.5">
              <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
                {openingCopy.groups[group.id as keyof typeof openingCopy.groups]}
              </p>
              <div
                role="presentation"
                className={cn(
                  "grid grid-cols-2 gap-3",
                  // In the wide dialog, more to a row so more gates show at once
                  titled ? "sm:grid-cols-3 xl:grid-cols-4" : "sm:grid-cols-4 lg:grid-cols-6",
                )}
              >
                {styles.map((id) => {
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
              </div>
            </div>
          );
        })}
      </RadioPrimitive.Root>

      {offersGods(draft.categoryId) && gods.length > 0 && style !== "none" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 id="opening-god-heading" className="font-semibold text-ink">
              {openingCopy.godHeading}
            </h3>
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
            {[NONE, ...gods].map((id) => {
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

      {style !== "none" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 id="opening-welcome-heading" className="font-semibold text-ink">
              {openingCopy.welcomeHeading}
            </h3>
            <p className="max-w-2xl text-sm text-ink-muted">{openingCopy.welcomeIntro}</p>
          </div>
          <RadioPrimitive.Root
            aria-labelledby="opening-welcome-heading"
            value={draft.opening.welcome ?? AUTO}
            onValueChange={(value) =>
              setOpening({ welcome: value === AUTO ? null : (value as WelcomeScene) })
            }
            className="flex flex-wrap gap-2"
          >
            {[AUTO, ...WELCOME_SCENES].map((id) => (
              <RadioPrimitive.Item
                key={id}
                value={id}
                data-welcome-choice={id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-full border border-line-strong bg-surface px-3.5 text-sm text-ink shadow-raised",
                  "data-[state=checked]:border-marigold data-[state=checked]:bg-[color-mix(in_srgb,var(--marigold)_12%,var(--surface))] data-[state=checked]:shadow-[0_0_0_1px_var(--marigold)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                )}
              >
                {id === AUTO
                  ? openingCopy.welcomeAuto
                  : openingCopy.welcomeNames[id as WelcomeScene]}
              </RadioPrimitive.Item>
            ))}
          </RadioPrimitive.Root>
        </div>
      )}
    </section>
  );
}
