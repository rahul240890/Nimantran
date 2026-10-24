"use client";

import { Image } from "@/components/ui/image";
import { Hint } from "@/components/ui/quiet";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { Check, DoorOpen } from "lucide-react";
import { startTransition, useEffect, useId, useState } from "react";
import { preload } from "react-dom";
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
  ownOpenings,
  offersGods,
  openingStyles,
  WELCOME_SCENES,
  type OpeningGod,
  type OpeningStyle,
  type WelcomeScene,
} from "@/lib/opening/catalog";
import { GATE_SHEET, gatePoster } from "@/lib/opening/posters";
import type { SuiteId } from "@/lib/suites/catalog";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const NONE = "none";
const AUTO = "auto";
const ALL = "all";

/**
 * A gate's tile: a painted gate's small picture made ahead (lib/opening/posters.ts), with its
 * blurred tile from the shared sheet until the picture is in, so every gate shows at once;
 * a gate drawn on the page draws itself, still.
 */
function GatePicture({ style, suite }: { style: OpeningStyle; suite: SuiteId }) {
  const poster = gatePoster(style);
  if (style === "none") {
    return (
      <span
        aria-hidden
        className="grid aspect-[9/16] w-full place-items-center rounded-lg border border-dashed border-line-strong bg-surface-2"
      >
        <DoorOpen className="size-6 text-ink-faint" />
      </span>
    );
  }
  if (!poster) return <OpeningSample suite={suite} style={style} god={null} open={false} />;
  return (
    <span
      className="relative block aspect-[9/16] w-full overflow-hidden rounded-lg bg-night"
      style={poster.blur}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- made ahead, never through the resizer */}
      <img
        src={poster.src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
    </span>
  );
}

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
 * The chosen gate, playing its opening over and over: the only gate drawn live, so the list
 * beside it stays light, and only it redraws on each beat.
 */
function GatePreview({
  suite,
  style,
  god,
}: {
  suite: SuiteId;
  style: OpeningStyle;
  god: OpeningGod | null;
}) {
  const { openingCopy } = useText(editorText);
  const beat = useBeat(!useReducedMotion());
  const words = openingCopy.styles[style];
  return (
    <div
      data-gate-preview
      className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-3 lg:sticky lg:top-0 lg:flex-col lg:items-stretch"
    >
      <div className="w-20 shrink-0 sm:w-24 lg:w-full">
        {style === "none" ? (
          <span
            aria-hidden
            className="grid aspect-[9/16] w-full place-items-center rounded-lg border border-dashed border-line-strong bg-surface font-label text-xs tracking-[0.2em] text-ink-muted uppercase"
          >
            {words.name}
          </span>
        ) : (
          <OpeningSample suite={suite} style={style} god={god} open={beat} />
        )}
      </div>
      <div aria-live="polite" className="flex min-w-0 flex-col gap-1">
        <p className="font-display text-lg leading-tight break-words">{words.name}</p>
        <p className="line-clamp-3 text-sm text-ink-muted sm:line-clamp-none">
          {words.description}
        </p>
      </div>
    </div>
  );
}

/**
 * The editor's choice of the guest's first screen (Step 12x), named for hosts as the opening
 * gate or cover screen: the design's own first, then a tile per opening style by kind, then
 * the god or symbol that sits above it. Only the chosen gate plays its opening, in the
 * preview beside the list (owner, 2026-10-24: drawing all 200-odd gates live made the picker
 * slow to open); every other tile is its small picture, and a tap on it chooses it. In the
 * summary's dialog the dialog carries the heading.
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
  const style = draftOpeningStyle(draft, suite, scene);
  const own = draftOwnOpening(draft, suite, scene);
  const god = draftOpeningGod(draft);
  const gods = draftOpeningGods(draft);
  const offered = openingStyles(suite, scene);
  const [kind, setKind] = useState<string>(ALL);
  // The sheet first, so every painted gate's tile has its gate the moment it is drawn
  preload(GATE_SHEET, { as: "image", fetchPriority: "high" });
  const ids = useId();
  const headingId = `${ids}-heading`;
  const setOpening = (change: Partial<InviteDraft["opening"]>) =>
    update((current) => ({ ...current, opening: { ...current.opening, ...change } }));
  // The design's own gate leads in a group of its own, with any second made with it; the
  // kinds after it leave them out
  const mine = ownOpenings(own, suite).filter((id) => id === own || offered.includes(id));
  const groups = [
    { id: "own", styles: mine },
    ...OPENING_GROUPS.map((group) => ({
      id: group.id,
      styles: group.styles.filter((id) => !mine.includes(id) && offered.includes(id)),
    })),
  ].filter((group) => group.styles.length > 0);
  // The design's own stays above whichever kind is shown
  const shown = groups.filter((group) => kind === ALL || group.id === "own" || group.id === kind);

  // The first kinds come with the dialog and the rest a moment after, so it opens at once
  const [later, setLater] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => startTransition(() => setLater(true)), 60);
    return () => window.clearTimeout(timer);
  }, []);
  const drawn = later ? shown : shown.slice(0, 3);
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      <div className={cn("flex flex-col gap-1.5", !titled && "sr-only")}>
        <h2 id={headingId} className="font-display text-xl leading-tight">
          {openingCopy.heading}
        </h2>
        <Hint className="max-w-2xl text-base">{openingCopy.intro}</Hint>
      </div>
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        <GatePreview suite={suite} style={style} god={god} />

        <div className="flex min-w-0 flex-col gap-5">
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
            {drawn.map((group) => (
              <div
                key={group.id}
                role="presentation"
                // Kinds out of sight aren't laid out or painted until scrolled to
                className="flex flex-col gap-2.5 [contain-intrinsic-size:auto_24rem] [content-visibility:auto]"
              >
                <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
                  {openingCopy.groups[group.id as keyof typeof openingCopy.groups]}
                </p>
                <div
                  role="presentation"
                  className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 xl:grid-cols-5"
                >
                  {group.styles.map((id) => (
                    // A tap chooses it: the picture is the choice, with no dot to aim for
                    <RadioPrimitive.Item
                      key={id}
                      value={id}
                      aria-label={openingCopy.styles[id].name}
                      aria-describedby={`opening-${id}-d`}
                      className={cn(
                        "group/opening relative flex cursor-pointer flex-col gap-1.5 rounded-xl p-1 text-start",
                        "transition-transform duration-200 ease-out-expo hover:-translate-y-0.5 motion-still:transition-none motion-still:hover:translate-y-0",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      )}
                    >
                      <span className="relative block rounded-lg ring-1 ring-line transition-shadow group-data-[state=checked]/opening:shadow-[0_0_0_3px_var(--marigold)] group-data-[state=checked]/opening:ring-marigold">
                        <GatePicture style={id} suite={suite} />
                        <span
                          aria-hidden
                          className="absolute end-1.5 top-1.5 grid size-6 scale-0 place-items-center rounded-full bg-marigold text-on-marigold shadow-raised transition-transform group-data-[state=checked]/opening:scale-100 motion-still:transition-none"
                        >
                          <Check className="size-4" />
                        </span>
                      </span>
                      <span className="line-clamp-2 px-0.5 text-xs leading-snug font-semibold text-ink sm:text-sm">
                        {openingCopy.styles[id].name}
                      </span>
                      <span id={`opening-${id}-d`} className="sr-only">
                        {openingCopy.styles[id].description}
                      </span>
                    </RadioPrimitive.Item>
                  ))}
                </div>
              </div>
            ))}
          </RadioPrimitive.Root>
        </div>
      </div>

      {offersGods(draft.categoryId) && gods.length > 0 && style !== "none" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 id="opening-god-heading" className="font-semibold text-ink">
              {openingCopy.godHeading}
            </h3>
            <Hint className="max-w-2xl">{openingCopy.godIntro}</Hint>
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
            <Hint className="max-w-2xl">{openingCopy.welcomeIntro}</Hint>
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
