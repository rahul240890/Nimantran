"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { StoryPage } from "@/components/invitation/story/story-player";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { uiText } from "@/i18n/copy/ui";
import { cn } from "@/lib/cn";
import type { PageType } from "@/lib/editor/type";
import type { StoryBeat } from "@/lib/engine/story";
import type { FunctionId } from "@/lib/events/functions";
import { SUITES, pageLook, type SuiteId } from "@/lib/suites/catalog";
import type { Template } from "@/lib/templates/schema";
import { stockStyle } from "@/lib/templates/stock";
import type { CardCopy } from "@/lib/templates/content";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const noop = () => {};

/**
 * The editor's live page (Step 12n): the page the host is filling in, in a phone the size
 * guests will hold, with every page of the invitation listed under it. Editing the Sangeet
 * brings up the Sangeet's painting; typing the names brings up the cover.
 */
export function PagePreview({
  beats,
  copy,
  template,
  suite,
  textBox,
  type,
  lang,
  page,
  onPage,
  hidden,
  list: showList = true,
  onOverflow,
  children,
  className,
}: {
  beats: readonly StoryBeat[];
  copy: CardCopy;
  /** The card design, whose paper and inks colour pages without a painted theme. */
  template: Template;
  suite: SuiteId;
  textBox: boolean;
  type: PageType;
  lang: string;
  /** The page to show, by its id ("cover", "fn-sangeet"); an unknown one shows the cover. */
  page: string;
  onPage: (page: string) => void;
  /** Pages the host left out: still listed here, marked, so they can be brought back. */
  hidden?: ReadonlySet<string>;
  /** Off shows the phone alone, as the page editor does. */
  list?: boolean;
  onOverflow?: (overflow: boolean) => void;
  /** Shown under the phone, above the list of pages. */
  children?: ReactNode;
  className?: string;
}) {
  const { studioCopy, functionCopy, pageWordsCopy } = useText(editorText);
  const { uiStrings } = useText(uiText);
  const still = useReducedMotion();
  const beat = beats.find((b) => b.id === page) ?? beats[0]!;

  const name = (b: StoryBeat) =>
    b.id.startsWith("fn-")
      ? functionCopy[b.id.slice(3) as FunctionId].name
      : studioCopy.pageNames[b.id as keyof typeof studioCopy.pageNames];

  // Keep the shown page's button in view in the row, without moving the page itself
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const row = list.current;
    const active = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({
      left: active.offsetLeft - (row.clientWidth - active.offsetWidth) / 2,
      behavior: still ? "auto" : "smooth",
    });
  }, [beat.id, still]);

  return (
    <div className={cn("flex min-h-0 flex-col items-center gap-3", className)}>
      {/* The phone: a guest's screen, sized to the space the preview has */}
      <div
        role="img"
        aria-label={studioCopy.phone(name(beat))}
        className="relative isolate aspect-[9/19] h-full max-h-full min-h-0 max-w-full overflow-hidden rounded-[2.2rem] border-[6px] border-night bg-night shadow-overlay"
      >
        <div
          aria-hidden
          lang={lang}
          data-suite={suite}
          data-mood={pageLook(beat.scene).mood}
          className="[container-type:size] absolute inset-0"
          // A true small copy of the guest's phone: the words keep their share of the page
          style={
            {
              ...(SUITES[suite].art === "card" ? stockStyle(template) : {}),
              "--type-floor": 0,
            } as CSSProperties
          }
        >
          <StoryPage
            key={`${suite}-${beat.id}`}
            beat={beat}
            copy={copy}
            suite={suite}
            textBox={textBox}
            type={type}
            still={still}
            reply={null}
            labels={uiStrings.invitation.story}
            onReply={noop}
            onOverflow={onOverflow}
            inert
            lang={lang}
          />
        </div>
        <span
          aria-hidden
          className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-night"
        />
      </div>

      {children}
      {showList && (
        <ul
          ref={list}
          aria-label={studioCopy.pageList}
          className="flex max-w-full shrink-0 [scrollbar-width:none] gap-1.5 overflow-x-auto px-1 py-1 [&::-webkit-scrollbar]:hidden"
        >
          {beats.map((b) => (
            <li key={b.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={b.id === beat.id}
                aria-label={studioCopy.showPage(name(b))}
                onClick={() => onPage(b.id)}
                className={cn(
                  "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  b.id === beat.id
                    ? "border-marigold bg-[color-mix(in_srgb,var(--marigold)_14%,var(--surface))] font-semibold text-ink"
                    : "border-line bg-surface text-ink-muted hover:border-line-control hover:text-ink",
                )}
              >
                <span className={cn(hidden?.has(b.id) && "line-through decoration-ink-faint")}>
                  {name(b)}
                </span>
                {hidden?.has(b.id) && <span className="sr-only">, {pageWordsCopy.hidden}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
