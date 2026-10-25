"use client";

import { Clapperboard, Play, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useText } from "@/i18n/client";
import { publishText } from "@/i18n/copy/publish";
import { awayVideos, seenVideo, subscribeVideos } from "@/lib/video/keep";
import { LiveFrame } from "./live-frame";

const none = () => [] as const;

/**
 * A video being made keeps going when the host moves to another page (owner, 2026-10-25),
 * and shows there, in the corner: its frames as they're drawn and how far it has got, then
 * that it's ready, with the way back to watch it. On the page it's made on, the video card
 * says all this itself.
 */
export function VideoAway() {
  const { videoCopy } = useText(publishText);
  const pathname = usePathname();
  const videos = useSyncExternalStore(subscribeVideos, awayVideos, none);
  const here = (from: string) => from.split("?")[0] === pathname;

  // Back on the page it was made on, a made video is seen there
  useEffect(() => {
    for (const { key, from, video } of videos) {
      if (video.step === "ready" && here(from)) seenVideo(key);
    }
    // `here` reads the path, which is a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, pathname]);

  const shown = videos.find(({ from }) => !here(from));
  if (!shown) return null;
  const { key, from, video } = shown;
  const percent = video.step === "making" ? Math.round(video.done * 100) : 100;
  const href = `${from}#invitation-video`;

  return (
    <div
      role="status"
      data-video-away
      className="fixed end-3 bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] z-40 flex w-[min(20rem,calc(100vw-1.5rem))] animate-toast-in items-center gap-3 rounded-lg border border-line bg-surface p-2 pe-1 shadow-float lg:end-6 lg:bottom-6"
    >
      <Link
        href={href}
        className="relative block aspect-[9/16] w-11 shrink-0 overflow-hidden rounded-md bg-night focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={video.step === "making" ? videoCopy.making(percent) : videoCopy.watch}
      >
        {video.step === "making" ? (
          <LiveFrame frame={video.frame} done={video.done} bare />
        ) : (
          <span className="grid size-full place-items-center text-marigold">
            <Play aria-hidden className="size-4 fill-current" />
          </span>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
          <Clapperboard aria-hidden className="size-4 shrink-0 text-accent-text" />
          <span className="truncate">
            {video.step === "making" ? videoCopy.making(percent) : videoCopy.ready}
          </span>
        </p>
        {video.step === "making" ? (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label={videoCopy.making(percent)}
            className="h-1.5 overflow-hidden rounded-full bg-surface-2"
          >
            <div
              className="h-full rounded-full bg-marigold transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : (
          <Link
            href={href}
            onClick={() => seenVideo(key)}
            className="inline-flex min-h-11 items-center self-start text-sm font-semibold text-accent-text underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {videoCopy.watch}
          </Link>
        )}
      </div>
      {video.step === "ready" && (
        <button
          type="button"
          aria-label={videoCopy.hideAway}
          onClick={() => seenVideo(key)}
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X aria-hidden className="size-4" />
        </button>
      )}
    </div>
  );
}
