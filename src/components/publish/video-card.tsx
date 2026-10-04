"use client";

import { Clapperboard, Download, Lock, RotateCcw, Share2, Sparkles, Square } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { couplePagePhotos, photoAspect, sceneCouple } from "@/lib/editor/couple-photos";
import { cardLanguages, draftCopy, templateWithRaga, type InviteDraft } from "@/lib/editor/draft";
import { withClip } from "@/lib/editor/music-clip";
import { pageType } from "@/lib/editor/type";
import { storyBeats, type StoryFunction } from "@/lib/engine/story";
import type { PublicPhoto } from "@/lib/invites/public";
import { applyPages } from "@/lib/editor/pages";
import {
  cardFunctions,
  draftBlessing,
  draftShowsScene,
  draftSuite,
  storyFamily,
} from "@/lib/publish/story";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { drawFrame, videoImages } from "@/lib/video/draw";
import type { VideoFilm } from "@/lib/video/encode";
import { drawSceneFrame, sceneVideoImages, type SceneItem } from "@/lib/video/scene-draw";
import { SCENE_FLY, sceneTimeline } from "@/lib/video/scene-timeline";
import { scenePage } from "@/lib/suites/scene";
import { SUITES } from "@/lib/suites/catalog";
import { voiceFaces } from "@/lib/suites/lettering";
import { loadFonts, loadImages, paletteReader, readFonts } from "@/lib/video/look";
import { videoTimeline } from "@/lib/video/timeline";
import { site } from "@/lib/site";
import "@/components/invitation/type/fonts.css";

type VideoCardProps = {
  draft: InviteDraft;
  functions: StoryFunction[];
  photos: PublicPhoto[];
  /** The host's own music clip, which the video plays instead of the raga. */
  clipUrl?: string | null;
  url: string;
  slug: string;
  names: string;
  /** Whether the invite's edition includes the video; else where to choose one. */
  allowed: boolean;
  upgradeHref: string;
  /** Preview mode's tests only: codecs open-source Chromium can encode. */
  testCodecs?: boolean;
};

/** A video ready to make, and the moment its poster shows. */
type Ready = { film: VideoFilm; poster: number };

type State =
  | { step: "idle" }
  | { step: "making"; done: number }
  | { step: "ready"; blob: Blob; href: string }
  | { step: "unsupported" };

const noSubscribe = () => () => {};
const TEST_CODECS = { video: "vp9", audio: "opus" } as const;

/**
 * The story as an MP4 for WhatsApp Status and Instagram Reels (Step 17c), made in the
 * host's browser: a poster of the first page, then a progress bar, then the video to
 * watch, share or download.
 */
export function VideoCard(props: VideoCardProps) {
  const { videoCopy } = useText(publishText);
  const { draft, functions, photos, url, slug, names, allowed, upgradeHref, testCodecs } = props;
  const clipUrl = props.clipUrl ?? null;
  const codecs = testCodecs ? TEST_CODECS : undefined;
  const [music, setMusic] = useState(true);
  const [state, setState] = useState<State>({ step: "idle" });
  const [silent, setSilent] = useState(false);
  const poster = useRef<HTMLCanvasElement>(null);
  const stopper = useRef<AbortController | null>(null);
  const canShareFiles = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.canShare === "function",
    () => false,
  );

  const { template, prepare, look } = useVideoFilm(draft, functions, photos, url);

  // The poster: the cover page once its words have risen in
  useEffect(() => {
    let live = true;
    void (async () => {
      const ready = await prepare().catch(() => null);
      const canvas = poster.current;
      const ctx = canvas?.getContext("2d");
      if (!live || !ready || !canvas || !ctx) return;
      ready.film.draw(ctx, ready.poster);
    })();
    return () => {
      live = false;
    };
    // The poster redraws when the pages change, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [look]);

  useEffect(() => {
    let live = true;
    void import("@/lib/video/encode").then(async ({ videoSupport }) => {
      const support = await videoSupport(codecs);
      if (!live) return;
      if (support === "no-video") setState({ step: "unsupported" });
      setSilent(support === "no-audio");
    });
    return () => {
      live = false;
    };
  }, [codecs]);

  // Let go of the finished file when leaving the page
  const href = state.step === "ready" ? state.href : null;
  useEffect(() => () => void (href && URL.revokeObjectURL(href)), [href]);

  const make = async () => {
    const controller = new AbortController();
    stopper.current = controller;
    setState({ step: "making", done: 0 });
    try {
      const [{ makeVideo }, ready] = await Promise.all([import("@/lib/video/encode"), prepare()]);
      const blob = await makeVideo(
        ready.film,
        music && !silent ? withClip(template, clipUrl).music : null,
        (done) => setState({ step: "making", done }),
        controller.signal,
        codecs,
      );
      setState({ step: "ready", blob, href: URL.createObjectURL(blob) });
    } catch (error) {
      setState({ step: "idle" });
      if (error instanceof DOMException && error.name === "AbortError") {
        toast({ title: videoCopy.stopped });
      } else {
        toast({ title: videoCopy.failed, tone: "error" });
      }
    } finally {
      stopper.current = null;
    }
  };

  const file =
    state.step === "ready"
      ? new File([state.blob], videoCopy.fileName(slug), { type: "video/mp4" })
      : null;
  const sharable = Boolean(file && canShareFiles && navigator.canShare({ files: [file] }));

  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: videoCopy.shareText(names) });
    } catch {
      // Closing the share sheet is not an error
    }
  };

  const percent = state.step === "making" ? Math.round(state.done * 100) : 0;

  return (
    <Card className="gap-4 p-5 sm:p-6" data-video-card>
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-2 font-semibold">
          <Clapperboard aria-hidden className="size-5 shrink-0 text-accent-text" />
          {videoCopy.heading}
        </h2>
        <p className="text-sm text-ink-muted">{videoCopy.body}</p>
      </div>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="relative aspect-[9/16] w-40 shrink-0 overflow-hidden rounded-lg border border-line bg-night shadow-raised">
          {state.step === "ready" ? (
            <video
              src={state.href}
              controls
              playsInline
              aria-label={videoCopy.player(names)}
              className="size-full object-cover"
            />
          ) : (
            <canvas
              ref={poster}
              width={1080}
              height={1920}
              role="img"
              aria-label={videoCopy.poster}
              className="size-full"
            />
          )}
          {!allowed && (
            <span className="absolute inset-0 grid place-items-center bg-night/45">
              <Lock aria-hidden className="size-8 text-card-ivory" />
            </span>
          )}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-4">
          {!allowed ? (
            <>
              <p className="text-sm font-semibold">{videoCopy.locked}</p>
              <Button asChild className="self-start">
                <Link href={upgradeHref}>
                  <Sparkles aria-hidden />
                  {videoCopy.upgrade}
                </Link>
              </Button>
            </>
          ) : state.step === "unsupported" ? (
            <p role="status" className="text-sm text-ink-muted">
              {videoCopy.unsupported}
            </p>
          ) : state.step === "making" ? (
            <div className="flex flex-col gap-3">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={videoCopy.making(percent)}
                className="h-2.5 overflow-hidden rounded-full bg-surface-2"
              >
                <div
                  className="h-full rounded-full bg-marigold transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p aria-live="polite" className="text-sm text-ink-muted tabular-nums">
                {videoCopy.making(percent)}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="self-start"
                leadingIcon={<Square aria-hidden />}
                onClick={() => stopper.current?.abort()}
              >
                {videoCopy.stop}
              </Button>
            </div>
          ) : state.step === "ready" ? (
            <div className="flex flex-col gap-3">
              <p role="status" className="font-semibold">
                {videoCopy.ready}
              </p>
              <div className="flex flex-wrap gap-3">
                {sharable && (
                  <Button leadingIcon={<Share2 aria-hidden />} onClick={() => void share()}>
                    {videoCopy.share}
                  </Button>
                )}
                <Button asChild variant={sharable ? "secondary" : "primary"}>
                  <a href={state.href} download={videoCopy.fileName(slug)}>
                    <Download aria-hidden />
                    {videoCopy.download}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  leadingIcon={<RotateCcw aria-hidden />}
                  onClick={() => void make()}
                >
                  {videoCopy.again}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {silent ? (
                <p className="text-sm text-ink-muted">{videoCopy.noSound}</p>
              ) : (
                <Switch label={videoCopy.music} checked={music} onCheckedChange={setMusic} />
              )}
              <Button
                className="self-start"
                leadingIcon={<Clapperboard aria-hidden />}
                onClick={() => void make()}
              >
                {videoCopy.make}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * What the video's frames are made from: the story's pages, or a Scene invite's painting
 * with its flying cards. `prepare` loads fonts and pictures; `look` changes when the
 * frames would.
 */
export function useVideoFilm(
  draft: InviteDraft,
  functions: StoryFunction[],
  photos: PublicPhoto[],
  url: string,
) {
  const { videoCopy } = useText(publishText);
  const language = cardLanguages(draft)[0];
  const template = useMemo(
    () => templateWithRaga(draft.templateId, draft.music.raga),
    [draft.templateId, draft.music.raga],
  );
  const scene = useMemo(() => {
    const copy = draftCopy(draft, language);
    const suite = draftSuite(draft);
    const written = storyBeats({
      copy,
      // A video is watched days later, so the pages leave out "In 5 days"
      functions: cardFunctions(functions, draft, language),
      replies: false,
      words: CARD_STORY_WORDS[language],
      family: storyFamily(draft, language),
      couple: couplePagePhotos(
        draft.couplePhotos,
        photos.map((photo) => photo.id),
        (id) => photos.find((photo) => photo.id === id)?.url,
        copy,
        (id) => photoAspect(photos, id),
      ),
      blessing: draftBlessing(draft),
    });
    const beats = applyPages(written, draft.pages, language);
    return {
      copy,
      suite,
      timeline: videoTimeline(beats),
      type: pageType(draft.type, [language]),
    };
  }, [draft, functions, photos, language]);

  // A Scene invite's video is the scene itself: its painting, photo and flying cards
  const oneScene = useMemo(() => {
    if (!draftShowsScene(draft)) return null;
    const copy = draftCopy(draft, language);
    const suite = draftSuite(draft);
    const scenePhotos = couplePagePhotos(
      sceneCouple(draft.couplePhotos),
      photos.map((photo) => photo.id),
      (id) => photos.find((photo) => photo.id === id)?.url,
      copy,
      (id) => photoAspect(photos, id),
    );
    const page = scenePage(suite, scenePhotos.length);
    if (!page) return null;
    // A painting without room for the line opens the slot with it, as the live scene does
    const items: SceneItem[] = [
      ...(page.line || !copy.line.trim() ? [] : [{ kind: "line" as const, text: copy.line }]),
      // Watched days later, so no "In 5 days"
      ...cardFunctions(functions, draft, language).map((fn) => ({
        kind: "function" as const,
        fn: { ...fn, countdown: undefined },
      })),
    ];
    const words = CARD_STORY_WORDS[language];
    return {
      copy,
      suite,
      page,
      items,
      photos: scenePhotos,
      timeline: sceneTimeline(items.length),
      labels: { when: words.when, where: words.where },
      type: pageType(draft.type, [language]),
    };
  }, [draft, functions, photos, language]);

  // Everything the frames need: colours, fonts, paintings and photos
  const prepare = async (): Promise<Ready> => {
    const fonts = readFonts();
    const copy = oneScene?.copy ?? scene.copy;
    const suite = oneScene?.suite ?? scene.suite;
    const type = oneScene?.type ?? scene.type;
    const words = oneScene
      ? oneScene.items.map((item) =>
          item.kind === "line"
            ? item.text
            : [item.fn.name, item.fn.date, item.fn.time, item.fn.venue].join(" "),
        )
      : scene.timeline.beats.flatMap(({ beat }) => beat.lines.map((line) => line.text));
    const sample = `${words.join(" ")} ${copy.first} ${copy.second}`;
    const families = [fonts.display, fonts.sans, fonts.label, type.names, type.words];
    await loadFonts(
      families.filter((family): family is string => Boolean(family)),
      sample,
    );
    // The theme's own lettering in the card's script, which the pages draw with too
    await Promise.all(
      voiceFaces(SUITES[suite].voice ?? "regal", language).map((font) =>
        document.fonts.load(font, sample).catch(() => []),
      ),
    );
    const palette = paletteReader(suite, template);
    const ending = {
      brand: site.name,
      open: videoCopy.ending.open,
      link: url.replace(/^https?:\/\//, ""),
    };
    if (oneScene) {
      const images = await loadImages(sceneVideoImages(oneScene));
      const film = { ...oneScene, lang: language, fonts, palette, images, ending };
      const first = oneScene.timeline.shots[0];
      return {
        film: { total: film.timeline.total, draw: (ctx, at) => drawSceneFrame(ctx, film, at) },
        // The first card has landed and the names are in
        poster: first ? first.start + SCENE_FLY + 0.6 : 2,
      };
    }
    const images = await loadImages(videoImages(scene.timeline, scene.suite));
    const story = {
      ...scene,
      textBox: draft.textBox,
      lang: language,
      fonts,
      palette,
      images,
      ending,
    };
    const cover = scene.timeline.beats[0];
    return {
      film: { total: story.timeline.total, draw: (ctx, at) => drawFrame(ctx, story, at) },
      poster: cover ? Math.min(cover.seconds - 0.2, 3.2) : 0,
    };
  };

  const look = useMemo(() => ({ scene, oneScene }), [scene, oneScene]);
  return { template, prepare, look };
}
