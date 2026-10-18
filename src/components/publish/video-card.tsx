"use client";

import {
  Clapperboard,
  Download,
  Globe,
  Maximize,
  RotateCcw,
  Share2,
  Sparkles,
  Square,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { useText } from "@/i18n/client";
import { editionsText } from "@/i18n/copy/editions";
import { publishText } from "@/i18n/copy/publish";
import { couplePagePhotos, photoAspect, sceneCouple } from "@/lib/editor/couple-photos";
import { cardLanguages, draftCopy, draftTemplate, type InviteDraft } from "@/lib/editor/draft";
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
  videoDesign,
} from "@/lib/publish/story";
import { draftCouple } from "@/lib/publish/frames";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { drawFrame, videoImages } from "@/lib/video/draw";
import type { VideoFilm } from "@/lib/video/encode";
import { drawSceneFrame, sceneVideoImages, type SceneItem } from "@/lib/video/scene-draw";
import { SCENE_FLY, sceneTimeline } from "@/lib/video/scene-timeline";
import { scenePage, withBlessing } from "@/lib/suites/scene";
import { SUITES } from "@/lib/suites/catalog";
import { voiceFaces } from "@/lib/suites/lettering";
import { loadFonts, loadImages, openingPalette, paletteReader, readFonts } from "@/lib/video/look";
import { withPrelude } from "@/lib/video/film";
import {
  deleteKept,
  fingerprint,
  keptVideo,
  loadKept,
  makeKept,
  stopKept,
  subscribeVideos,
} from "@/lib/video/keep";
import { drawPrelude, preludeImages } from "@/lib/video/prelude-draw";
import { PRELUDE_IDLE, preludeTimeline } from "@/lib/video/prelude-timeline";
import { videoTimeline } from "@/lib/video/timeline";
import { readWatermarkLook, withWatermark } from "@/lib/video/watermark";
import { openingGod, openingStyle, welcomeKind } from "@/lib/opening/catalog";
import { site } from "@/lib/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";
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
  /**
   * Whether the invite's package includes the video. Without it the host still makes and
   * watches the whole video, with the mark across it, and `upgradeHref` gets the clean one.
   */
  allowed: boolean;
  /**
   * Whether the invite is live. Before publishing the video is only watched here, since its
   * last card carries the link; `publishHref` publishes it.
   */
  published?: boolean;
  publishHref?: string;
  /** Whether the package also makes a video for each function on its own (Grand). */
  perFunction?: boolean;
  upgradeHref: string;
  /** Preview mode's tests only: codecs open-source Chromium can encode. */
  testCodecs?: boolean;
};

/** A video ready to make, and the moment its poster shows. */
type Ready = { film: VideoFilm; poster: number };

/** What this browser can do, checked once on the page. */
type Support = "checking" | "ok" | "silent" | "unsupported";

const noSubscribe = () => () => {};
const ALL = "all";
const TEST_CODECS = { video: "vp9", audio: "opus" } as const;

/**
 * The invitation video (Step 17c), an MP4 to share anywhere, made in the host's browser:
 * the opening as guests see it, the welcome, then the pages. A poster of the closed opening,
 * then a progress bar, then the video to watch, share or download. It keeps going when the
 * host moves to another screen, and stays saved in this browser for when they come back.
 */
export function VideoCard(props: VideoCardProps) {
  const { videoCopy } = useText(publishText);
  const { draft, photos, url, slug, names, allowed, testCodecs } = props;
  const published = props.published ?? true;
  // Clean and ending on the real link; a paid video not yet live still downloads, and says why
  const clean = allowed && published;
  const marked = !allowed;
  // Grand makes a video of one function too: its own date, time and place
  const [only, setOnly] = useState<string>(ALL);
  const perFunction = Boolean(props.perFunction) && props.functions.length > 1;
  const functions = useMemo(
    () =>
      perFunction && only !== ALL
        ? props.functions.filter((fn) => fn.kind === only)
        : props.functions,
    [perFunction, only, props.functions],
  );
  const { poster, silent, music, setMusic, key, state, stale, percent, make, fileName } =
    useInviteVideo({
      draft,
      functions,
      photos,
      url,
      slug,
      clipUrl: props.clipUrl ?? null,
      marked,
      choice: perFunction ? only : ALL,
      testCodecs,
    });
  const canShareFiles = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.canShare === "function",
    () => false,
  );
  // Only a paid video downloads and shares (owner, 2026-10-15); the free preview is watched here
  const file = useMemo(
    () =>
      state.step === "ready" && allowed
        ? new File([state.blob], fileName, { type: "video/mp4" })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.step === "ready" ? state.blob : null, allowed, fileName],
  );
  const sharable = Boolean(file && canShareFiles && navigator.canShare({ files: [file] }));

  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: videoCopy.shareText(names) });
    } catch {
      // Closing the share sheet is not an error
    }
  };

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
              // The free preview is watched here; a paid one downloads from the button
              controlsList={allowed ? undefined : "nodownload"}
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
          {marked && (
            <span className="pointer-events-none absolute start-2 top-2 rounded-full bg-night/65 px-2.5 py-1 font-label text-[0.65rem] tracking-[0.18em] text-card-ivory uppercase">
              {videoCopy.preview}
            </span>
          )}
        </div>

        <div className="flex w-full min-w-0 flex-col gap-4">
          {/* Each choice keeps its own video, so the choice stays while one is ready */}
          {allowed && perFunction && state.step !== "making" && state.step !== "unsupported" && (
            <Field label={videoCopy.which} className="max-w-xs">
              <Select
                value={only}
                onValueChange={setOnly}
                options={[
                  { value: ALL, label: videoCopy.whole },
                  ...props.functions.map((fn) => ({ value: fn.kind, label: fn.name })),
                ]}
              />
            </Field>
          )}
          {state.step === "unsupported" ? (
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
                onClick={() => stopKept(key)}
              >
                {videoCopy.stop}
              </Button>
            </div>
          ) : state.step === "ready" ? (
            <div className="flex flex-col gap-3">
              <p role="status" className="font-semibold">
                {videoCopy.ready}
              </p>
              {stale && <p className="text-sm text-ink-muted">{videoCopy.changed}</p>}
              {!clean && <Unlock {...props} marked={marked} />}
              <div className="flex flex-wrap gap-3">
                {sharable && (
                  <Button leadingIcon={<Share2 aria-hidden />} onClick={() => void share()}>
                    {videoCopy.share}
                  </Button>
                )}
                {allowed && (
                  <Button asChild variant={sharable ? "secondary" : "primary"}>
                    <a href={state.href} download={fileName}>
                      <Download aria-hidden />
                      {videoCopy.download}
                    </a>
                  </Button>
                )}
                <Button
                  variant={stale ? "primary" : "secondary"}
                  leadingIcon={<RotateCcw aria-hidden />}
                  onClick={() => void make()}
                >
                  {videoCopy.again}
                </Button>
                <RemoveVideo videoKey={key} />
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
                {marked ? videoCopy.makePreview : videoCopy.make}
              </Button>
              {!clean && <Unlock {...props} marked={marked} />}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

type InviteVideoOptions = {
  draft: InviteDraft;
  functions: StoryFunction[];
  photos: PublicPhoto[];
  url: string;
  slug: string;
  clipUrl: string | null;
  /** A preview with the mark across it, for a package without the video. */
  marked: boolean;
  /** The whole invitation, or one function's kind. */
  choice?: string;
  testCodecs?: boolean;
};

/**
 * Making one invitation video: its poster, whether this browser can make it, the music
 * choice, and the video kept for this invitation and choice. Shared by the video card and
 * the package card's preview, so a video made in one shows in the other.
 */
function useInviteVideo({
  draft,
  functions,
  photos,
  url,
  slug,
  clipUrl,
  marked,
  choice = ALL,
  testCodecs,
}: InviteVideoOptions) {
  const { videoCopy } = useText(publishText);
  const codecs = testCodecs ? TEST_CODECS : undefined;
  const [music, setMusic] = useState(true);
  const [support, setSupport] = useState<Support>("checking");
  const silent = support === "silent";
  const poster = useRef<HTMLCanvasElement>(null);
  // The video for this invitation, its theme and choice, kept while making and saved once
  // made: each theme the host tries keeps its own video, and a new one starts unmade
  const key = `${slug}:${videoDesign(draft)}:${choice}${marked ? ":preview" : ""}`;
  const kept = useSyncExternalStore(
    subscribeVideos,
    () => keptVideo(key),
    () => null,
  );
  useEffect(() => void loadKept(key), [key]);

  const { template, prepare, look } = useVideoFilm(draft, functions, photos, url);
  // What this video is made from: when it changes, a kept video is out of date
  const made = useMemo(
    () => fingerprint({ draft, functions, photos, url, clipUrl, music: music && !silent }),
    [draft, functions, photos, url, clipUrl, music, silent],
  );

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
      const can = await videoSupport(codecs);
      if (!live) return;
      setSupport(can === "no-video" ? "unsupported" : can === "no-audio" ? "silent" : "ok");
    });
    return () => {
      live = false;
    };
  }, [codecs]);

  const make = async () => {
    const withMusic = music && !silent ? withClip(template, clipUrl).music : null;
    try {
      await makeKept(key, made, async (onProgress, signal) => {
        const [{ makeVideo }, ready] = await Promise.all([import("@/lib/video/encode"), prepare()]);
        const film = marked
          ? withWatermark(ready.film, videoCopy.mark, readWatermarkLook())
          : ready.film;
        return makeVideo(film, withMusic, onProgress, signal, codecs);
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        toast({ title: videoCopy.stopped });
      } else {
        toast({ title: videoCopy.failed, tone: "error" });
      }
    }
  };

  const state =
    support === "unsupported"
      ? { step: "unsupported" as const }
      : (kept ?? { step: "idle" as const });
  const stale = state.step === "ready" && state.look !== made;
  const percent = state.step === "making" ? Math.round(state.done * 100) : 0;
  const fileName = videoCopy.fileName(slug);
  return { poster, support, silent, music, setMusic, key, state, stale, percent, make, fileName };
}

/** What the package card's video preview is made from. */
export type PackageVideoProps = {
  draft: InviteDraft;
  functions: StoryFunction[];
  photos: PublicPhoto[];
  clipUrl: string | null;
  url: string;
  slug: string;
  names: string;
  /** Whether the invite's package already has the video: then the preview carries no mark. */
  allowed: boolean;
  /** The page with every video choice: the video page, or the share page once live. */
  optionsHref: string;
  testCodecs?: boolean;
};

type FullScreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * The invitation video inside the Celebration package (owner, 2026-10-14): the host makes
 * the free preview right on the package card and watches it full screen, sound and all. It
 * is the same video the video page keeps, so one made there shows here too.
 */
export function PackageVideo(props: PackageVideoProps) {
  const { upgradeCopy } = useText(editionsText);
  const { videoCopy } = useText(publishText);
  const still = useReducedMotion();
  const player = useRef<FullScreenVideo>(null);
  const marked = !props.allowed;
  const heading = useId();
  const { poster, state, percent, make, key, fileName } = useInviteVideo({
    draft: props.draft,
    functions: props.functions,
    photos: props.photos,
    url: props.url,
    slug: props.slug,
    clipUrl: props.clipUrl,
    marked,
    testCodecs: props.testCodecs,
  });

  // Full screen plays from the start with sound and controls; the card's tile goes back to
  // playing quietly when it closes
  useEffect(() => {
    const video = player.current;
    const quiet = () => {
      if (!video) return;
      video.controls = false;
      video.muted = true;
    };
    const left = () => {
      if (!document.fullscreenElement) quiet();
    };
    document.addEventListener("fullscreenchange", left);
    video?.addEventListener("webkitendfullscreen", quiet);
    return () => {
      document.removeEventListener("fullscreenchange", left);
      video?.removeEventListener("webkitendfullscreen", quiet);
    };
  }, [state.step]);

  const fullScreen = async () => {
    const video = player.current;
    if (!video) return;
    video.controls = true;
    video.muted = false;
    video.currentTime = 0;
    try {
      if (video.requestFullscreen) await video.requestFullscreen();
      else video.webkitEnterFullscreen?.();
      await video.play();
    } catch {
      // iPhone Safari before 16.4, or full screen refused: the tile plays with its controls
      video.webkitEnterFullscreen?.();
    }
  };

  return (
    <section
      aria-labelledby={heading}
      className="flex flex-col gap-3 rounded-md border border-marigold-edge bg-marigold/10 p-3"
    >
      <div className="flex gap-3">
        <div className="relative aspect-[9/16] w-24 shrink-0 overflow-hidden rounded-md border border-line bg-night">
          {state.step === "ready" ? (
            <video
              ref={player}
              src={state.href}
              muted
              loop
              autoPlay={!still}
              playsInline
              controlsList="nodownload"
              aria-label={videoCopy.player(props.names)}
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
          {state.step === "ready" && (
            <button
              type="button"
              onClick={() => void fullScreen()}
              aria-label={upgradeCopy.video.fullScreen}
              title={upgradeCopy.video.fullScreen}
              className="absolute end-1 bottom-1 grid size-11 cursor-pointer place-items-center rounded-full bg-night/70 text-card-ivory transition-colors hover:bg-night/85 focus-visible:ring-2 focus-visible:ring-marigold focus-visible:outline-none"
            >
              <Maximize aria-hidden className="size-5" />
            </button>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h3 id={heading} className="flex items-start gap-1.5 text-sm font-semibold">
            <Clapperboard aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
            {upgradeCopy.video.title}
          </h3>
          <p className="text-xs text-ink-muted">{upgradeCopy.video.body}</p>
          {state.step === "unsupported" ? (
            <p role="status" className="text-xs text-ink-muted">
              {videoCopy.unsupported}
            </p>
          ) : state.step === "making" ? (
            <div className="flex flex-col gap-1.5">
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={videoCopy.making(percent)}
                className="h-2 overflow-hidden rounded-full bg-surface-2"
              >
                <div
                  className="h-full rounded-full bg-marigold transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p aria-live="polite" className="text-xs text-ink-muted tabular-nums">
                {videoCopy.making(percent)}
              </p>
            </div>
          ) : state.step === "ready" ? (
            <p role="status" className="text-xs font-semibold">
              {upgradeCopy.video.ready}
            </p>
          ) : null}
        </div>
      </div>
      {state.step === "unsupported" ? null : (
        <div className="flex flex-wrap gap-2">
          {state.step === "making" ? (
            <Button
              variant="ghost"
              size="sm"
              leadingIcon={<Square aria-hidden />}
              onClick={() => stopKept(key)}
            >
              {videoCopy.stop}
            </Button>
          ) : state.step === "ready" ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                leadingIcon={<Maximize aria-hidden />}
                onClick={() => void fullScreen()}
              >
                {upgradeCopy.video.fullScreenShort}
              </Button>
              {props.allowed && (
                <Button asChild size="sm" variant="secondary">
                  <a href={state.href} download={fileName}>
                    <Download aria-hidden />
                    {videoCopy.download}
                  </a>
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                leadingIcon={<RotateCcw aria-hidden />}
                onClick={() => void make()}
              >
                {videoCopy.again}
              </Button>
              <RemoveVideo videoKey={key} size="sm" />
            </>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              leadingIcon={<Clapperboard aria-hidden />}
              onClick={() => void make()}
            >
              {upgradeCopy.video.make}
            </Button>
          )}
        </div>
      )}
      <Link
        href={props.optionsHref}
        className="inline-flex min-h-11 items-center gap-1.5 self-start rounded-md text-sm font-semibold text-accent-text underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Clapperboard aria-hidden className="size-4" />
        {videoCopy.allOptions}
      </Link>
    </section>
  );
}

/**
 * Deletes a made video from this browser, after asking. The invitation itself stays; the
 * video can be made again at any time.
 */
function RemoveVideo({ videoKey, size }: { videoKey: string; size?: "sm" }) {
  const { videoCopy } = useText(publishText);
  const [open, setOpen] = useState(false);
  const remove = async () => {
    await deleteKept(videoKey);
    setOpen(false);
    toast({ title: videoCopy.removed, tone: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={size} leadingIcon={<Trash2 aria-hidden />}>
          {videoCopy.remove}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={videoCopy.removeTitle}
        description={videoCopy.removeBody}
        closeLabel={videoCopy.close}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">{videoCopy.keep}</Button>
            </DialogClose>
            <Button variant="danger" onClick={() => void remove()}>
              {videoCopy.removeConfirm}
            </Button>
          </>
        }
      />
    </Dialog>
  );
}

/**
 * Why a video isn't clean yet, and the way to the clean one: a package for a preview
 * with the mark, or publishing for an invite not yet live.
 */
function Unlock({
  marked,
  upgradeHref,
  publishHref,
}: Pick<VideoCardProps, "upgradeHref" | "publishHref"> & { marked: boolean }) {
  const { videoCopy } = useText(publishText);
  const href = marked ? upgradeHref : publishHref;
  return (
    <div className="flex flex-col gap-3 rounded-md border border-marigold/45 bg-marigold/10 p-4">
      <p className="text-sm text-ink-muted">
        {marked ? videoCopy.previewNote : videoCopy.draftNote}
      </p>
      {href && (
        <Button asChild variant="secondary" size="sm" className="self-start">
          <Link href={href}>
            {marked ? <Sparkles aria-hidden /> : <Globe aria-hidden />}
            {marked ? videoCopy.upgrade : videoCopy.publish}
          </Link>
        </Button>
      )}
    </div>
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
  const template = draftTemplate(draft);
  // The guest's opening plays first, as on the link: closed with the names, opening, the welcome
  const opening = useMemo(() => {
    const suite = draftSuite(draft);
    const scenePhotos = couplePagePhotos(
      sceneCouple(draftCouple(draft)),
      photos.map((photo) => photo.id),
      (id) => photos.find((photo) => photo.id === id)?.url,
      draftCopy(draft, language),
      (id) => photoAspect(photos, id),
    );
    const isScene = draftShowsScene(draft) && Boolean(scenePage(suite, scenePhotos.length));
    const style = openingStyle(draft.opening, suite, isScene, draft.categoryId);
    const timeline = preludeTimeline(style);
    if (!timeline) return null;
    return {
      style,
      god: openingGod(draft.opening, draft.categoryId),
      kind: welcomeKind(style),
      timeline,
    };
  }, [draft, photos, language]);
  const lead = opening?.timeline.pages ?? 0;
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
        draftCouple(draft),
        photos.map((photo) => photo.id),
        (id) => photos.find((photo) => photo.id === id)?.url,
        copy,
        (id) => photoAspect(photos, id),
      ),
      blessing: draftBlessing(draft),
    });
    const beats = applyPages(written, draft.pages, language, draft.pageSeconds);
    return {
      copy,
      suite,
      timeline: videoTimeline(beats, { fixed: draft.pageSeconds !== null, lead }),
      type: pageType(draft.type, [language]),
    };
  }, [draft, functions, photos, language, lead]);

  // A Scene invite's video is the scene itself: its painting, photo and flying cards
  const oneScene = useMemo(() => {
    if (!draftShowsScene(draft)) return null;
    const copy = draftCopy(draft, language);
    const suite = draftSuite(draft);
    const scenePhotos = couplePagePhotos(
      sceneCouple(draftCouple(draft)),
      photos.map((photo) => photo.id),
      (id) => photos.find((photo) => photo.id === id)?.url,
      copy,
      (id) => photoAspect(photos, id),
    );
    const painting = scenePage(suite, scenePhotos.length);
    if (!painting) return null;
    // The blessing has its own line over the names, or opens the slot, as the live scene does
    const blessing = copy.blessing.trim();
    const blessed = blessing ? withBlessing(painting) : null;
    const page = blessed ?? painting;
    const slotBlessing = blessing && !blessed ? blessing : "";
    // A painting without room for the line opens the slot with it, as the live scene does
    const slotLine = page.line ? "" : copy.line.trim();
    const items: SceneItem[] = [
      ...(slotLine || slotBlessing
        ? [{ kind: "line" as const, text: slotLine, blessing: slotBlessing }]
        : []),
      // Watched days later, so no "In 5 days"
      ...cardFunctions(functions, draft, language).map((fn) => ({
        kind: "function" as const,
        fn: { ...fn, countdown: undefined },
      })),
    ];
    return {
      copy,
      suite,
      page,
      items,
      photos: scenePhotos,
      timeline: sceneTimeline(items.length, lead),
      type: pageType(draft.type, [language]),
    };
  }, [draft, functions, photos, language, lead]);

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
    const sample = [
      ...words,
      copy.first,
      copy.second,
      copy.joiner,
      copy.blessing,
      copy.line,
      copy.date,
      copy.venue,
    ].join(" ");
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
    // The opening's paintings load with the pages', and its colours are read from the theme
    const prelude = opening
      ? loadImages(preludeImages(opening.style, suite, opening.god)).then((images) => ({
          ...opening,
          suite,
          copy,
          lang: language,
          type,
          fonts,
          colours: openingPalette(suite, template, opening.style),
          images,
        }))
      : null;
    // The video opens closed, the names on the opening, then plays on into the pages
    const open = async (pages: Ready): Promise<Ready> => {
      const film = await prelude;
      if (!film) return pages;
      return {
        film: withPrelude(
          { total: film.timeline.total, draw: (ctx, at) => drawPrelude(ctx, film, at) },
          film.timeline.pages,
          pages.film,
        ),
        poster: PRELUDE_IDLE - 0.4,
      };
    };
    if (oneScene) {
      const images = await loadImages(sceneVideoImages(oneScene));
      const film = { ...oneScene, lang: language, fonts, palette, images, ending };
      const first = oneScene.timeline.shots[0];
      return open({
        film: { total: film.timeline.total, draw: (ctx, at) => drawSceneFrame(ctx, film, at) },
        // The first card has landed and the names are in
        poster: first ? first.start + SCENE_FLY + 0.6 : 2,
      });
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
    return open({
      film: { total: story.timeline.total, draw: (ctx, at) => drawFrame(ctx, story, at) },
      poster: cover ? Math.min(cover.seconds - 0.2, 3.2) : 0,
    });
  };

  const look = useMemo(() => ({ scene, oneScene, opening }), [scene, oneScene, opening]);
  return { template, prepare, look };
}
