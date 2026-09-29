"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import { Invitation, type InvitationStory } from "@/components/invitation/invitation";
import type { QualityChoice } from "@/content/engine-review";
import { useLocale, useText } from "@/i18n/client";
import { storyBeats } from "@/lib/engine/story";
import {
  cardFunctions,
  draftBlessing,
  draftSuite,
  storyFamily,
  storyFunctions,
} from "@/lib/publish/story";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { editorText } from "@/i18n/copy/editor";
import {
  cardLanguages,
  draftCopy,
  draftTradition,
  templateWithRaga,
  type CardLanguage,
  type InviteDraft,
} from "@/lib/editor/draft";
import type { CardCopy } from "@/lib/templates/content";
import { cn } from "@/lib/cn";
import { applyPages, type DraftPages } from "@/lib/editor/pages";
import { pageType, type PageType } from "@/lib/editor/type";
import { Mail, Smartphone } from "lucide-react";
import { PagePreview } from "./page-preview";
import { PageWords } from "./page-words";
import type { StepProps } from "./steps/types";
import { useCouplePhotos } from "./use-couple-photos";

type PreviewStageProps = {
  draft: InviteDraft;
  quality: QualityChoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Switches the box behind the words from the pages, so the host can compare live. */
  onTextBox?: (on: boolean) => void;
  /** The page being edited, shown in the phone ("cover", "fn-sangeet"). */
  page: string;
  onPage: (page: string) => void;
  /** Lets the host edit the shown page's words and placement (Step 12s); left out, view only. */
  update?: StepProps["update"];
  className?: string;
};

type View = "pages" | "card";

/**
 * The live invitation beside the form. Typing is never held up by the card: the words
 * reach it as a deferred value, and it only repaints when they actually change.
 */
export function PreviewStage({
  draft,
  quality,
  open,
  onOpenChange,
  onTextBox,
  page,
  onPage,
  update,
  className,
}: PreviewStageProps) {
  const { coupleCopy, studioCopy } = useText(editorText);
  const [view, setView] = useState<View>("pages");
  const languages = cardLanguages(draft);
  const [chosen, setChosen] = useState<CardLanguage | null>(null);
  const language = chosen && languages.includes(chosen) ? chosen : languages[0];
  const key = JSON.stringify(draftCopy(draft, language));
  const copy = useMemo(() => JSON.parse(key) as CardCopy, [key]);
  const deferredCopy = useDeferredValue(copy);

  // The pages guests will see, without the reply button (there is no form here); here they
  // play only when asked, so they never cover the form while the host is typing
  const locale = useLocale();
  const functionsKey = JSON.stringify(
    cardFunctions(storyFunctions(draft, locale), draft, language),
  );
  const familyKey = JSON.stringify(storyFamily(draft, language));
  const suite = draftSuite(draft);
  const { textBox } = draft;
  const typeKey = JSON.stringify(pageType(draft.type, [language]));
  const type = useMemo(() => JSON.parse(typeKey) as PageType, [typeKey]);
  const couple = useCouplePhotos(draft, deferredCopy);
  const blessing = draftBlessing(draft);
  // The pages as the invite writes them, then with the host's own words and placement
  const written = useMemo(() => {
    const functions = JSON.parse(functionsKey) as ReturnType<typeof storyFunctions>;
    const family = JSON.parse(familyKey) as ReturnType<typeof storyFamily>;
    return storyBeats({
      copy: deferredCopy,
      functions,
      replies: true,
      words: CARD_STORY_WORDS[language],
      family,
      couple,
      blessing,
    });
  }, [functionsKey, familyKey, deferredCopy, language, couple, blessing]);
  const pagesKey = JSON.stringify(draft.pages);
  // The editor lists every page, the ones left out too, so they can be brought back
  const listed = useMemo(() => {
    const pages = JSON.parse(pagesKey) as DraftPages;
    const layout = Object.fromEntries(
      Object.entries(pages.layout).map(([id, page]) => [id, { ...page, hidden: false }]),
    );
    return applyPages(written, { ...pages, layout }, language);
  }, [written, pagesKey, language]);
  const hidden = useMemo(
    () =>
      new Set(
        Object.entries((JSON.parse(pagesKey) as DraftPages).layout)
          .filter(([, page]) => page.hidden)
          .map(([id]) => id),
      ),
    [pagesKey],
  );
  const shownIndex = Math.max(
    0,
    listed.findIndex((b) => b.id === page),
  );
  const story = useMemo<InvitationStory>(() => {
    const pages = JSON.parse(pagesKey) as DraftPages;
    return {
      beats: applyPages(written, pages, language),
      suite,
      textBox,
      type,
      onTextBox,
    };
  }, [written, pagesKey, language, suite, textBox, type, onTextBox]);

  const { templateId } = draft;
  const { raga } = draft.music;
  const template = useMemo(() => templateWithRaga(templateId, raga), [templateId, raga]);

  return (
    <div
      className={cn(
        "relative isolate flex min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-surface-2 px-3 pt-3 pb-4 shadow-raised sm:px-5 sm:pb-5",
        className,
      )}
    >
      {/* Warm light behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-square w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 30%, transparent), color-mix(in srgb, var(--rose) 8%, transparent) 60%, transparent)",
        }}
      />
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 pb-3">
        <div
          role="group"
          aria-label={studioCopy.views}
          className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 p-1"
        >
          {(
            [
              ["pages", Smartphone, studioCopy.pages],
              ["card", Mail, studioCopy.card],
            ] as const
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 font-semibold whitespace-nowrap transition-colors duration-200 [&_svg]:size-4.5",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                view === id
                  ? "bg-surface text-ink shadow-raised ring-1 ring-line"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              <Icon aria-hidden />
              {label}
            </button>
          ))}
        </div>
        {languages.length > 1 && (
          <CardLanguageToggle
            label={coupleCopy.languagesHeading}
            languages={languages}
            value={language}
            onValueChange={setChosen}
          />
        )}
      </div>
      {view === "pages" ? (
        <PagePreview
          beats={listed}
          copy={deferredCopy}
          template={template}
          suite={suite}
          textBox={textBox}
          type={type}
          lang={language}
          page={page}
          onPage={onPage}
          hidden={hidden}
          className="min-h-0 flex-1"
        >
          {update && listed[shownIndex] && written[shownIndex] && (
            <PageWords
              draft={draft}
              update={update}
              written={written.find((b) => b.id === listed[shownIndex]!.id) ?? written[shownIndex]!}
              shown={listed[shownIndex]!}
              language={language}
              copy={deferredCopy}
              template={template}
              suite={suite}
              textBox={textBox}
              type={type}
            />
          )}
        </PagePreview>
      ) : (
        <Invitation
          copy={deferredCopy}
          lang={language}
          template={template}
          quality={quality}
          open={open}
          onOpenChange={onOpenChange}
          musicOnOpen={draft.music.playOnOpen}
          tradition={draftTradition(draft)?.id ?? null}
          story={story}
          autoStory={false}
        />
      )}
    </div>
  );
}
