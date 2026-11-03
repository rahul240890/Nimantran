"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import { FLUTE_URL } from "@/lib/editor/music-clip";
import type { MusicPlayer } from "@/lib/engine/music-player";

/**
 * The site's flute song, every design's default music (owner, 2026-11-03): its name, a
 * play button to hear it, and a line saying it plays unless the host picks other music.
 */
export function FluteTrack() {
  const { extrasCopy } = useText(editorText);
  const player = useRef<MusicPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => player.current?.dispose(), []);

  const toggle = async () => {
    if (playing) {
      player.current?.pause();
      setPlaying(false);
      return;
    }
    try {
      if (!player.current) {
        const { MusicPlayer } = await import("@/lib/engine/music-player");
        player.current = new MusicPlayer({ raga: "yaman", clip: FLUTE_URL, loop: true });
      }
      await player.current.play();
      setPlaying(true);
    } catch {
      // The phone wouldn't play it yet: the button stays as it was
      setPlaying(false);
    }
  };

  return (
    <div className="flex min-h-14 items-center gap-3 rounded-lg border border-line-strong bg-surface px-1.5 py-1.5">
      <button
        type="button"
        aria-pressed={playing}
        aria-label={playing ? extrasCopy.stopListening : extrasCopy.listen(extrasCopy.fluteName)}
        onClick={() => void toggle()}
        className={cn(
          "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-150 motion-reduce:transition-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          playing ? "bg-marigold text-on-marigold" : "text-accent-text hover:bg-marigold/15",
        )}
      >
        {playing ? (
          <Pause aria-hidden className="size-4" />
        ) : (
          <Play aria-hidden className="size-4 translate-x-px" />
        )}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pe-2">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-ink">{extrasCopy.fluteName}</span>
          <Badge tone="gold">{extrasCopy.fluteBadge}</Badge>
        </span>
        <span className="text-sm text-ink-muted">{extrasCopy.fluteNote}</span>
      </div>
    </div>
  );
}
