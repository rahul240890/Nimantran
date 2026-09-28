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
import { couplePagePhotos } from "@/lib/editor/couple-photos";
import { cardLanguages, draftCopy, templateWithRaga, type InviteDraft } from "@/lib/editor/draft";
import { pageType } from "@/lib/editor/type";
import { storyBeats, type StoryFunction } from "@/lib/engine/story";
import type { PublicPhoto } from "@/lib/invites/public";
import { cardFunctions, draftBlessing, draftSuite, storyFamily } from "@/lib/publish/story";
import { CARD_STORY_WORDS } from "@/lib/templates/story-words";
import { drawFrame, videoImages, type VideoScene } from "@/lib/video/draw";
import { loadFonts, loadImages, paletteReader, readFonts } from "@/lib/video/look";
import { videoTimeline } from "@/lib/video/timeline";
import { site } from "@/lib/site";
import "@/components/invitation/type/fonts.css";

type VideoCardProps = {
  draft: InviteDraft;
  functions: StoryFunction[];
  photos: PublicPhoto[];
  url: string;
  slug: string;
  names: string;
  /** Whether the invite's edition includes the video; else where to choose one. */
  allowed: boolean;
  upgradeHref: string;
  /** Preview mode's tests only: codecs open-source Chromium can encode. */
  testCodecs?: boolean;
};

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

  const language = cardLanguages(draft)[0];
  const template = useMemo(
    () => templateWithRaga(draft.templateId, draft.music.raga),
    [draft.templateId, draft.music.raga],
  );
  const scene = useMemo(() => {
    const copy = draftCopy(draft, language);
    const suite = draftSuite(draft);
    const beats = storyBeats({
      copy,
      // A video is watched days later, so the pages leave out "In 5 days"
      functions: cardFunctions(functions, draft, language),
      replies: false,
      words: CARD_STORY_WORDS[language],
      family: storyFamily(draft),
      couple: couplePagePhotos(
        draft.couplePhotos,
        photos.map((photo) => photo.id),
        (id) => photos.find((photo) => photo.id === id)?.url,
        copy,
      ),
      blessing: draftBlessing(draft),
    });
    return {
      copy,
      suite,
      timeline: videoTimeline(beats),
      type: pageType(draft.type, [language]),
    };
  }, [draft, functions, photos, language]);

  // Everything the frames need: colours, fonts, paintings and photos
  const prepare = async (): Promise<VideoScene> => {
    const fonts = readFonts();
    const words = scene.timeline.beats.flatMap(({ beat }) => beat.lines.map((line) => line.text));
    const families = [fonts.display, fonts.sans, fonts.label, scene.type.names, scene.type.words];
    await loadFonts(
      families.filter((family): family is string => Boolean(family)),
      `${words.join(" ")} ${scene.copy.first} ${scene.copy.second}`,
    );
    const images = await loadImages(videoImages(scene.timeline, scene.suite));
    return {
      ...scene,
      textBox: draft.textBox,
      lang: language,
      fonts,
      palette: paletteReader(scene.suite, template),
      images,
      ending: {
        brand: site.name,
        open: videoCopy.ending.open,
        link: url.replace(/^https?:\/\//, ""),
      },
    };
  };

  // The poster: the cover page once its words have risen in
  useEffect(() => {
    let live = true;
    void (async () => {
      const ready = await prepare().catch(() => null);
      const canvas = poster.current;
      const ctx = canvas?.getContext("2d");
      if (!live || !ready || !canvas || !ctx) return;
      const cover = ready.timeline.beats[0];
      drawFrame(ctx, ready, cover ? Math.min(cover.seconds - 0.2, 3.2) : 0);
    })();
    return () => {
      live = false;
    };
    // The poster redraws when the pages change, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

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
        ready,
        music && !silent ? template.music : null,
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
