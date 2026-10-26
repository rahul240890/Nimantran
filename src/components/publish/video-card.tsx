"use client";

import {
  Clapperboard,
  Download,
  Globe,
  Lock,
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
import {
  cardLanguages,
  draftCopy,
  draftOpeningGod,
  draftOpeningStyle,
  draftTemplate,
  type InviteDraft,
} from "@/lib/editor/draft";
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
  fingerprint,
  keptVideo,
  loadKept,
  makeKept,
  removeKept,
  stopKept,
  subscribeVideos,
} from "@/lib/video/keep";
import { drawPrelude, preludeImages } from "@/lib/video/prelude-draw";
import { PRELUDE_IDLE, preludeTimeline } from "@/lib/video/prelude-timeline";
import { videoTimeline } from "@/lib/video/timeline";
import { loadWatermarkLook, withWatermark } from "@/lib/video/watermark";
import { filmedWelcome, welcomeScene } from "@/lib/opening/catalog";
import { instagramHandle, site } from "@/lib/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { LiveFrame } from "./live-frame";
import "@/components/invitation/type/fonts.css";

type VideoCardProps = {
  /** The invitation, which keeps the same video before and after it is live. */
  inviteId: string;
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
  // Downloaded and shared only clean and with the real link; otherwise watched here
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
  const {
    poster,
    silent,
    music,
    setMusic,
    key,
    state,
    stale,
    unfinished,
    finishing,
    percent,
    make,
  } = useInviteVideo({
    inviteId: props.inviteId,
    draft,
    functions,
    photos,
    url,
    slug,
    clipUrl: props.clipUrl ?? null,
    marked,
    choice: perFunction ? only : ALL,
    finish: clean,
    testCodecs,
  });
  // The clean video, ending on the invitation's link, downloads and shares; one made before
  // the invite was live or with the mark is watched here until it is made again
  const downloadable = clean && !unfinished;
  const shownMarked = state.step === "ready" ? state.marked : marked;
  const canShareFiles = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.canShare === "function",
    () => false,
  );
  const file = useMemo(
    () =>
      state.step === "ready" && downloadable
        ? new File([state.blob], videoCopy.fileName(slug), { type: "video/mp4" })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.step === "ready" ? state.blob : null, downloadable, slug, videoCopy],
  );
  const sharable = Boolean(file && canShareFiles && navigator.canShare({ files: [file] }));
  const player = useRef<FullScreenVideo>(null);
  // Downloading needs a package with the video, and a live invite: the video ends on its link
  const lockedHref = marked ? props.upgradeHref : props.publishHref;
  const lockedReason = useId();

  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: videoCopy.shareText(names) });
    } catch {
      // Closing the share sheet is not an error
    }
  };

  return (
    <Card
      id="invitation-video"
      className="scroll-mt-24 gap-4 p-5 sm:p-6"
      data-video-card
      data-video-key={key}
    >
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
              ref={player}
              src={state.href}
              controls
              // A preview is watched here; the clean one downloads from the button
              controlsList={downloadable ? undefined : "nodownload"}
              disablePictureInPicture={!downloadable}
              playsInline
              aria-label={videoCopy.player(names)}
              // Full screen on a wide screen: the whole upright video, centred like a reel
              className="size-full object-cover [&:fullscreen]:bg-night [&:fullscreen]:object-contain"
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
          {/* Being made: the frames as they're drawn, so the video is seen coming */}
          {state.step === "making" && <LiveFrame frame={state.frame} done={state.done} />}
          {shownMarked && (
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
              {finishing && <p className="text-sm text-ink-muted">{videoCopy.finishing}</p>}
              <p className="text-sm text-ink-muted">{videoCopy.keepsGoing}</p>
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
              {clean && unfinished && (
                <p className="text-sm text-ink-muted">{videoCopy.unfinished}</p>
              )}
              {!clean && (
                <p className="text-sm text-ink-muted">
                  {marked ? videoCopy.previewNote : videoCopy.draftNote}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {sharable && (
                  <Button leadingIcon={<Share2 aria-hidden />} onClick={() => void share()}>
                    {videoCopy.share}
                  </Button>
                )}
                {downloadable ? (
                  <Button asChild variant={sharable ? "secondary" : "primary"}>
                    <a href={state.href} download={videoCopy.fileName(slug)}>
                      <Download aria-hidden />
                      {videoCopy.download}
                    </a>
                  </Button>
                ) : (
                  !clean &&
                  lockedHref && (
                    // Download shows from the start, locked, and leads to what unlocks it
                    <Button asChild>
                      <Link href={lockedHref} aria-describedby={lockedReason}>
                        <Lock aria-hidden />
                        {videoCopy.downloadLocked}
                      </Link>
                    </Button>
                  )
                )}
                <Button
                  variant="secondary"
                  leadingIcon={<Maximize aria-hidden />}
                  onClick={() => void playFullScreen(player.current)}
                >
                  {videoCopy.fullScreen}
                </Button>
                <Button
                  variant={clean && unfinished ? "primary" : stale ? "secondary" : "ghost"}
                  leadingIcon={<RotateCcw aria-hidden />}
                  onClick={() => void make()}
                >
                  {videoCopy.again}
                </Button>
                <RemoveVideo videoKey={key} />
              </div>
              {!clean && lockedHref && (
                <p id={lockedReason} className="text-xs text-ink-muted">
                  {marked ? videoCopy.lockedPackage : videoCopy.lockedPublish}
                </p>
              )}
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
  /** The invitation the video is kept under, before and after it is live. */
  inviteId: string;
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
  /**
   * Whether a video made before the invite was live, or with the preview's mark, is finished
   * by itself: made again with the invitation's link and without the mark, the host's music
   * choice kept. Only where the clean video downloads.
   */
  finish?: boolean;
  testCodecs?: boolean;
};

/** The parts of an invitation that change as it is edited or published, not its video. */
function filmed(draft: InviteDraft) {
  return { ...draft, step: null, updatedAt: 0, remoteId: null, slug: null };
}

/**
 * Making one invitation video: its poster, whether this browser can make it, the music
 * choice, and the video kept for this invitation and choice. Shared by the video card and
 * the package card's preview, so a video made in one shows in the other.
 */
function useInviteVideo({
  inviteId,
  draft,
  functions,
  photos,
  url,
  slug,
  clipUrl,
  marked,
  choice = ALL,
  finish = false,
  testCodecs,
}: InviteVideoOptions) {
  const { videoCopy } = useText(publishText);
  const codecs = testCodecs ? TEST_CODECS : undefined;
  const [music, setMusic] = useState(true);
  const [support, setSupport] = useState<Support>("checking");
  const silent = support === "silent";
  const poster = useRef<HTMLCanvasElement>(null);
  // The video for this invitation, its theme and choice, kept while making and saved once
  // made: each theme the host tries keeps its own video, and a new one starts unmade. The
  // same one shows on the package card, the video page and, once live, the share page
  const tail = `${videoDesign(draft)}:${choice}`;
  const key = `${inviteId}:${tail}`;
  const kept = useSyncExternalStore(
    subscribeVideos,
    () => keptVideo(key),
    () => null,
  );
  useEffect(() => {
    // Where videos were kept before: by the invite's link, or its draft name before it had one
    const draftSlug = `draft-${inviteId.slice(0, 8)}`;
    const live = slug !== draftSlug;
    void loadKept(key, [
      ...(live
        ? [
            { key: `${slug}:${tail}`, url, marked: false },
            { key: `${slug}:${tail}:preview`, url, marked: true },
          ]
        : []),
      { key: `${draftSlug}:${tail}`, url: live ? null : url, marked: false },
      { key: `${draftSlug}:${tail}:preview`, url: live ? null : url, marked: true },
    ]);
  }, [key, inviteId, slug, tail, url]);

  const { template, prepare, look } = useVideoFilm(draft, functions, photos, url);
  // What this video's pages are made from: when they change, a kept video is out of date.
  // Photos and music by their ids, as their addresses change from visit to visit
  const pages = useMemo(
    () => fingerprint({ draft: filmed(draft), functions, music: music && !silent }),
    [draft, functions, music, silent],
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

  const make = async (raga = music) => {
    const playing = raga && !silent;
    const withMusic = playing ? withClip(template, clipUrl).music : null;
    const made = {
      look: fingerprint({ draft: filmed(draft), functions, music: playing }),
      url,
      marked,
      music: playing,
    };
    try {
      await makeKept(
        key,
        made,
        async (onProgress, signal) => {
          const [{ makeVideo }, ready] = await Promise.all([
            import("@/lib/video/encode"),
            prepare(),
          ]);
          const film = marked
            ? withWatermark(ready.film, videoCopy.mark, await loadWatermarkLook())
            : ready.film;
          return makeVideo(film, withMusic, onProgress, signal, codecs);
        },
        // Where the other pages send the host to watch it, once made
        `${window.location.pathname}${window.location.search}`,
      );
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
  // Made before the invite was live (it ends on the site) or with the preview's mark
  const unfinished = state.step === "ready" && (state.url !== url || state.marked !== marked);
  const stale = state.step === "ready" && state.look !== null && state.look !== pages;
  const percent = state.step === "making" ? Math.round(state.done * 100) : 0;

  // Where the clean video downloads, one made before is finished by itself, once per visit
  const [finishing, setFinishing] = useState<string | null>(null);
  const finished = useRef<string | null>(null);
  useEffect(() => {
    if (!finish || support === "checking" || support === "unsupported") return;
    if (kept?.step !== "ready" || (kept.url === url && kept.marked === marked)) return;
    if (finished.current === key) return;
    finished.current = key;
    setMusic(kept.music);
    setFinishing(key);
    void make(kept.music).finally(() => setFinishing(null));
    // `make` is new each render; this runs when a kept video is found unfinished
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish, support, kept, key, url, marked]);

  return {
    poster,
    support,
    silent,
    music,
    setMusic,
    key,
    state,
    stale,
    unfinished,
    finishing: finishing === key,
    percent,
    make,
  };
}

/** What the package card's video preview is made from. */
export type PackageVideoProps = {
  /** The invitation, which keeps the same video before and after it is live. */
  inviteId: string;
  draft: InviteDraft;
  functions: StoryFunction[];
  photos: PublicPhoto[];
  clipUrl: string | null;
  url: string;
  slug: string;
  names: string;
  /** Whether the invite's package already has the video: then the preview carries no mark. */
  allowed: boolean;
  /** Whether the invite is live: only then does the clean video download, ending on its link. */
  published?: boolean;
  testCodecs?: boolean;
};

type FullScreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/** Plays a video full screen from the start, sound and controls on. */
async function playFullScreen(video: FullScreenVideo | null) {
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
}

/** Deletes a made video from this device, after asking: the invitation itself stays. */
function RemoveVideo({ videoKey, size }: { videoKey: string; size?: "sm" }) {
  const { videoCopy } = useText(publishText);
  const [open, setOpen] = useState(false);
  const remove = async () => {
    await removeKept(videoKey);
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
        closeLabel={videoCopy.keep}
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
  const clean = props.allowed && Boolean(props.published);
  const { poster, state, percent, make, key, unfinished, finishing } = useInviteVideo({
    inviteId: props.inviteId,
    draft: props.draft,
    functions: props.functions,
    photos: props.photos,
    url: props.url,
    slug: props.slug,
    clipUrl: props.clipUrl,
    marked,
    finish: clean,
    testCodecs: props.testCodecs,
  });
  // Bought and live: the finished video downloads and shares from here too
  const downloadable = clean && !unfinished;
  const canShareFiles = useSyncExternalStore(
    noSubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.canShare === "function",
    () => false,
  );
  const file = useMemo(
    () =>
      state.step === "ready" && downloadable
        ? new File([state.blob], videoCopy.fileName(props.slug), { type: "video/mp4" })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.step === "ready" ? state.blob : null, downloadable, props.slug, videoCopy],
  );
  const sharable = Boolean(file && canShareFiles && navigator.canShare({ files: [file] }));
  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({ files: [file], text: videoCopy.shareText(props.names) });
    } catch {
      // Closing the share sheet is not an error
    }
  };

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

  const fullScreen = () => playFullScreen(player.current);

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
              disablePictureInPicture
              aria-label={videoCopy.player(props.names)}
              // Full screen on a wide screen: the whole upright video, centred like a reel
              className="size-full object-cover [&:fullscreen]:bg-night [&:fullscreen]:object-contain"
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
              {finishing && <p className="text-xs text-ink-muted">{videoCopy.finishing}</p>}
            </div>
          ) : state.step === "ready" ? (
            <>
              <p role="status" className="text-xs font-semibold">
                {upgradeCopy.video.ready}
              </p>
              {!clean && (
                <p className="flex items-start gap-1.5 text-xs text-ink-muted">
                  <Lock aria-hidden className="mt-px size-3.5 shrink-0" />
                  {props.allowed ? videoCopy.lockedPublish : videoCopy.lockedPackage}
                </p>
              )}
              {clean && unfinished && (
                <p className="text-xs text-ink-muted">{videoCopy.unfinished}</p>
              )}
            </>
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
              {sharable && (
                <Button
                  size="sm"
                  variant="secondary"
                  leadingIcon={<Share2 aria-hidden />}
                  onClick={() => void share()}
                >
                  {videoCopy.share}
                </Button>
              )}
              {downloadable && (
                <Button asChild size="sm" variant="secondary">
                  <a href={state.href} download={videoCopy.fileName(props.slug)}>
                    <Download aria-hidden />
                    {videoCopy.download}
                  </a>
                </Button>
              )}
              <Button
                size="sm"
                variant={clean && unfinished ? "secondary" : "ghost"}
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
    </section>
  );
}

/**
 * Why a video isn't to download yet, and the way to the clean one: a package for a preview
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
    const style = draftOpeningStyle(draft, suite, isScene);
    const timeline = preludeTimeline(style);
    if (!timeline) return null;
    return {
      style,
      god: draftOpeningGod(draft),
      // The film is the same every time: the host's welcome, else the opening's own
      kind: filmedWelcome(welcomeScene(draft.opening, style)),
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
      videoCopy.ending.open,
      videoCopy.ending.madeWith,
      videoCopy.ending.tagline,
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
      open: videoCopy.ending.open,
      link: url.replace(/^https?:\/\//, ""),
      brand: site.name,
      madeWith: videoCopy.ending.madeWith,
      tagline: videoCopy.ending.tagline,
      site: new URL(site.url).host.replace(/^www\./, ""),
      handle: instagramHandle(),
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
