"use client";

import type { CSSProperties } from "react";
import { pageImage, StoryPage, type StoryLabels } from "@/components/invitation/story/story-player";
import { SuiteBackdrop } from "@/components/invitation/story/suite-backdrop";
import { useInView } from "@/components/guest/themed/use-in-view";
import { cn } from "@/lib/cn";
import type { PageType } from "@/lib/editor/type";
import type { StoryBeat } from "@/lib/engine/story";
import { usePaintingBlur } from "@/lib/paintings";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import type { CardCopy } from "@/lib/templates/content";
import type { Template } from "@/lib/templates/schema";
import { stockStyle } from "@/lib/templates/stock";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/*
 * One-scroll flow (prototype, 2026-11-11): the invitation's pages one under another, a
 * screen each, instead of the reel that swiped across them. Each page plays its own way in
 * (lines rising, names revealed, the painting's slow push-in) as the guest scrolls to it,
 * and the page snaps a screen at a time as the reel did. The guest tour scrolls through
 * them by itself after the gates, each page staying as long as it stayed in the reel.
 */

type StoryScrollProps = {
  beats: readonly StoryBeat[];
  copy: CardCopy;
  template: Template;
  suite: SuiteId;
  textBox: boolean;
  type?: PageType;
  labels: StoryLabels;
  lang: string;
};

export function StoryScroll({ beats, ...rest }: StoryScrollProps) {
  return (
    <div data-story-scroll className="contents">
      {beats.map((beat) => (
        <ScrollPage key={beat.id} beat={beat} {...rest} />
      ))}
    </div>
  );
}

/** One page of the scroll: a full screen, its words coming in when it comes into view. */
export function ScrollPage({
  beat,
  copy,
  template,
  suite: suiteId,
  textBox,
  type,
  labels,
  lang,
}: Omit<StoryScrollProps, "beats"> & { beat: StoryBeat }) {
  const suite = SUITES[suiteId];
  const themed = suite.art !== "card";
  const still = useReducedMotion();
  // The page plays in once half of it is on screen, and stays played
  const [ref, seen] = useInView<HTMLElement>("0px 0px -45% 0px");
  const image = pageImage(suiteId, beat);
  const blur = usePaintingBlur(image);
  const look = pageLook(beat.scene);
  return (
    <section
      ref={ref}
      id={beat.id}
      aria-label={beat.lines[0]?.text}
      data-tour={Math.max(4, Math.round(beat.seconds))}
      data-suite={suiteId}
      data-mood={look.mood}
      lang={lang}
      className={cn(
        "story-scroll-page relative isolate flex h-svh justify-center overflow-hidden",
        themed ? "bg-suite-near" : "bg-card-back",
      )}
      style={themed ? undefined : stockStyle(template)}
    >
      {/* On wide screens the page's own landscape, blurred, fills the sides */}
      {themed && (
        <div aria-hidden data-mood={look.mood} className="absolute inset-0 hidden md:block">
          <SuiteBackdrop
            suite={suite}
            image={image}
            placeholder={blur}
            lazy
            className="absolute inset-0 scale-110 opacity-70 blur-2xl"
          />
          <div className="absolute inset-0 bg-scrim/40" />
        </div>
      )}
      <div
        className="[container-type:size] relative h-full w-full overflow-hidden md:max-w-[min(100%,calc(100svh*768/1365))] md:shadow-overlay"
        style={{ "--story-scale": type?.scale ?? 1 } as CSSProperties}
      >
        {seen ? (
          <StoryPage
            beat={beat}
            copy={copy}
            suite={suiteId}
            textBox={textBox}
            type={type}
            still={still}
            reply={null}
            labels={labels}
            onReply={() => {}}
            inert={false}
            lang={lang}
            className="story-scroll-in"
          />
        ) : (
          // Until it comes into view: the painting's blurred copy, so the page is never blank
          themed && (
            <SuiteBackdrop
              suite={suite}
              image={blur ? undefined : image}
              placeholder={blur}
              lazy
              className="absolute inset-0 overflow-hidden"
            />
          )
        )}
      </div>
    </section>
  );
}
