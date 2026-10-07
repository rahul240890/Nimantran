"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CardLanguageToggle } from "@/components/invitation/card-language-toggle";
import { useLocale, useText } from "@/i18n/client";
import { storyBeats } from "@/lib/engine/story";
import {
  cardFunctions,
  draftBlessing,
  draftShowsScene,
  draftSuite,
  storyFamily,
  storyFunctions,
} from "@/lib/publish/story";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { editorText } from "@/i18n/copy/editor";
import {
  cardLanguages,
  draftCopy,
  templateWithRaga,
  type CardLanguage,
  type InviteDraft,
} from "@/lib/editor/draft";
import type { CardCopy } from "@/lib/templates/content";
import { cn } from "@/lib/cn";
import { applyPages, type DraftPages } from "@/lib/editor/pages";
import { pageType, type PageType } from "@/lib/editor/type";
import { OneScene } from "@/components/invitation/scene/one-scene";
import { scenePage } from "@/lib/suites/scene";
import { PagePreview } from "./page-preview";
import { AiWording } from "./ai-wording";
import { PageWords } from "./page-words";
import type { FunctionId } from "@/lib/events/functions";
import type { StepProps } from "./steps/types";
import { useCouplePhotos } from "./use-couple-photos";
import { useClipUrl } from "./use-photo-urls";
import { withClip } from "@/lib/editor/music-clip";

type PreviewStageProps = {
  draft: InviteDraft;
  /** The page being edited, shown in the phone ("cover", "fn-sangeet"). */
  page: string;
  onPage: (page: string) => void;
  /** Lets the host edit the shown page's words and placement (Step 12s); left out, view only. */
  update?: StepProps["update"];
  /** Only the phone showing the page being edited: the floating live preview on phones. */
  mini?: boolean;
  className?: string;
};

/**
 * The live invitation beside the form, as the design itself: the Scene's one painting or
 * the Story's pages, never a stand-in card. Typing is never held up by it: the words reach
 * it as a deferred value, and it only repaints when they actually change.
 */
export function PreviewStage({
  draft,
  page,
  onPage,
  update,
  mini = false,
  className,
}: PreviewStageProps) {
  const { coupleCopy, studioCopy, functionCopy } = useText(editorText);
  const pageName = (id: string) =>
    id.startsWith("fn-")
      ? functionCopy[id.slice(3) as FunctionId].name
      : (studioCopy.pageNames[id as keyof typeof studioCopy.pageNames] ?? id);
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
  // One Scene (pilot): the whole invitation on one painting instead of the pages
  const scenePhotos = useCouplePhotos(draft, deferredCopy, true);
  const scene = draftShowsScene(draft) ? scenePage(suite, scenePhotos.length) : null;
  const sceneView = scene && (
    <div className={cn("flex min-h-0 flex-col items-center", mini ? className : "flex-1")}>
      <div className="relative isolate aspect-[9/19] h-full max-h-full min-h-0 max-w-full overflow-hidden rounded-[2.2rem] border-[6px] border-night bg-night shadow-overlay">
        <OneScene
          suite={suite}
          page={scene}
          copy={deferredCopy}
          lang={language}
          functions={JSON.parse(functionsKey) as ReturnType<typeof storyFunctions>}
          photos={scenePhotos}
          reply={null}
          type={type}
          framed
          miniature
          still={mini}
          focus={page.startsWith("fn-") ? page.slice(3) : null}
        />
      </div>
    </div>
  );
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
  // The pages guests will see, with the ones left out taken away
  const beats = useMemo(
    () => applyPages(written, JSON.parse(pagesKey) as DraftPages, language),
    [written, pagesKey, language],
  );

  const { templateId } = draft;
  const { raga } = draft.music;
  const clipUrl = useClipUrl(draft);
  const template = useMemo(
    () => withClip(templateWithRaga(templateId, raga), clipUrl),
    [templateId, raga, clipUrl],
  );

  if (mini && sceneView) return sceneView;
  if (mini) {
    return (
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
        list={false}
        className={className}
      />
    );
  }

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
      {languages.length > 1 && (
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 pb-3">
          <CardLanguageToggle
            label={coupleCopy.languagesHeading}
            languages={languages}
            value={language}
            onValueChange={setChosen}
          />
        </div>
      )}
      {sceneView ?? (
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
            <div className="flex shrink-0 flex-wrap justify-center gap-2">
              <PageWords
                draft={draft}
                update={update}
                written={
                  written.find((b) => b.id === listed[shownIndex]!.id) ?? written[shownIndex]!
                }
                shown={listed[shownIndex]!}
                language={language}
                copy={deferredCopy}
                template={template}
                suite={suite}
                textBox={textBox}
                type={type}
              />
              <AiWording
                draft={draft}
                update={update}
                beats={beats}
                page={listed[shownIndex]!}
                pageName={pageName(listed[shownIndex]!.id)}
                language={language}
              />
            </div>
          )}
        </PagePreview>
      )}
    </div>
  );
}
