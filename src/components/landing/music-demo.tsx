"use client";

import { ChevronDown, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { landingText } from "@/i18n/copy/landing";
import { useText } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { RAGAS } from "@/lib/engine/music";
import type { MusicPlayer } from "@/lib/engine/music-player";
import { TEMPLATE_LIST } from "@/lib/templates/catalog";

const tracks = TEMPLATE_LIST.map((template) => ({
  id: template.id,
  design: template.name,
  raga: RAGAS[template.music.raga].name,
  music: template.music,
}));

const BARS = [0.55, 0.95, 0.7, 1, 0.6];

/**
 * A slim strip under the header that plays a design's raga, so visitors hear an invitation
 * before they open one. Sound starts only on a tap; the level bars stand still in still mode.
 */
export function MusicDemo() {
  const { musicDemo } = useText(landingText);
  const [trackId, setTrackId] = useState(tracks[0]!.id);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const player = useRef<MusicPlayer | null>(null);
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0]!;

  const play = useCallback(async (music: (typeof tracks)[number]["music"]) => {
    try {
      if (!player.current) {
        const { MusicPlayer } = await import("@/lib/engine/music-player");
        player.current = new MusicPlayer(music);
      } else {
        player.current.setTrack(music);
      }
      await player.current.play();
      setPlaying(true);
      setFailed(false);
    } catch {
      setPlaying(false);
      setFailed(true);
    }
  }, []);

  const pause = useCallback(() => {
    player.current?.pause();
    setPlaying(false);
  }, []);

  // Quiet in a background tab, and gone with the page
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pause]);
  useEffect(() => () => player.current?.dispose(), []);

  const choose = (id: string) => {
    const next = tracks.find((item) => item.id === id);
    if (!next) return;
    setTrackId(next.id);
    if (playing) player.current?.setTrack(next.music);
  };

  return (
    <section aria-labelledby="music-demo-title" className="border-b border-line bg-surface-2/60">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => (playing ? pause() : void play(track.music))}
          aria-pressed={playing}
          aria-label={playing ? musicDemo.pause : musicDemo.play(track.design)}
          className={cn(
            buttonClasses({ size: "sm" }),
            "size-11 shrink-0 rounded-full px-0 [&_svg]:size-4.5",
          )}
        >
          {playing ? <Pause aria-hidden /> : <Play aria-hidden className="ms-0.5" />}
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span aria-hidden className="hidden h-5 items-end gap-[3px] min-[400px]:flex">
            {BARS.map((height, i) => (
              <span
                key={i}
                style={{ height: `${height * 100}%`, animationDelay: `${i * -0.23}s` }}
                className={cn(
                  "w-[3px] origin-bottom rounded-full bg-marigold transition-transform duration-300",
                  playing ? "animate-sound-bar motion-still:animate-none" : "scale-y-[0.3]",
                )}
              />
            ))}
          </span>
          <p className="min-w-0 text-sm leading-snug">
            <span
              id="music-demo-title"
              className="block font-label text-[0.7rem] tracking-[0.22em] text-accent-text uppercase"
            >
              {musicDemo.label}
            </span>
            <span className="block truncate text-ink" aria-live="polite">
              {failed ? musicDemo.failed : `${track.design} · ${musicDemo.raga(track.raga)}`}
            </span>
            <span className="sr-only">{musicDemo.body}</span>
          </p>
          <p aria-hidden className="ms-auto hidden max-w-sm text-sm text-ink-muted xl:block">
            {musicDemo.body}
          </p>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            aria-label={musicDemo.chooseLabel}
            className={cn(
              buttonClasses({ variant: "ghost", size: "sm" }),
              "shrink-0 px-3 data-[state=open]:bg-surface-2",
            )}
          >
            <span className="max-sm:sr-only">{musicDemo.choose}</span>
            <ChevronDown aria-hidden className="text-ink-muted" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuLabel>{musicDemo.chooseLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={trackId} onValueChange={choose}>
              {tracks.map((item) => (
                <DropdownMenuRadioItem
                  key={item.id}
                  value={item.id}
                  aside={musicDemo.raga(item.raga)}
                >
                  {item.design}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
