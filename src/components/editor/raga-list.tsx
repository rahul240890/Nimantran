"use client";

import { Check, Pause, Play } from "lucide-react";
import { RadioGroup as RadioPrimitive } from "radix-ui";
import { useEffect, useId, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import type { MusicChoice, MusicPlayer } from "@/lib/engine/music-player";
import { arrangement } from "@/lib/engine/music";
import { RAGA_IDS, type RagaId } from "@/lib/templates/ids";

/**
 * The ragas as one clean list (owner, 2026-10-24: a play button and the name, little
 * else): each row plays on its own button and is chosen by tapping its name. One plays at
 * a time; the design's own raga is marked and played the way the design plays it.
 */
export function RagaList({
  label,
  value,
  design,
  onChoose,
}: {
  /** Names the list for screen readers. */
  label: string;
  value: RagaId;
  /** The design's own music: its raga, played its own way. */
  design: MusicChoice & { raga: RagaId };
  onChoose: (raga: RagaId) => void;
}) {
  const { extrasCopy } = useText(editorText);
  const id = useId();
  const own = design.raga;
  const track = (raga: RagaId): MusicChoice => (raga === own ? design : { raga });

  // The player loads with the first tap on a play button
  const player = useRef<MusicPlayer | null>(null);
  const [playing, setPlaying] = useState<RagaId | null>(null);
  useEffect(() => () => player.current?.dispose(), []);

  const toggle = async (raga: RagaId) => {
    if (playing === raga) {
      player.current?.pause();
      setPlaying(null);
      return;
    }
    try {
      if (!player.current) {
        const { MusicPlayer } = await import("@/lib/engine/music-player");
        player.current = new MusicPlayer(track(raga));
      } else {
        player.current.setTrack(track(raga));
      }
      await player.current.play();
      setPlaying(raga);
    } catch {
      // No Web Audio here: nothing plays, and the button stays as it was
      setPlaying(null);
    }
  };

  return (
    <RadioPrimitive.Root
      aria-label={label}
      value={value}
      onValueChange={(next) => onChoose(next as RagaId)}
      className="grid overflow-hidden rounded-lg border border-line-strong bg-surface sm:grid-cols-2"
    >
      {RAGA_IDS.map((raga) => {
        const name = extrasCopy.ragaNames[raga];
        const on = playing === raga;
        return (
          <div
            key={raga}
            className="flex min-h-12 items-center gap-1 border-b border-line px-1.5 last:border-b-0 sm:odd:border-e sm:[&:nth-last-child(-n+2):nth-child(odd)]:border-b-0"
          >
            <button
              type="button"
              aria-pressed={on}
              aria-label={on ? extrasCopy.stopListening : extrasCopy.listen(name)}
              onClick={() => void toggle(raga)}
              className={cn(
                "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                on
                  ? "bg-marigold text-on-marigold"
                  : "text-accent-text hover:bg-marigold/15 motion-reduce:transition-none",
              )}
            >
              {on ? (
                <Pause aria-hidden className="size-4" />
              ) : (
                <Play aria-hidden className="size-4 translate-x-px" />
              )}
            </button>
            <RadioPrimitive.Item
              value={raga}
              aria-describedby={`${id}-${raga}`}
              className={cn(
                "group/raga flex min-h-11 min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 rounded-md px-2 text-start text-sm text-ink",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                "data-[state=checked]:font-semibold",
              )}
            >
              <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="truncate">{name}</span>
                {raga === own && <Badge tone="gold">{extrasCopy.designsOwn}</Badge>}
              </span>
              <span
                aria-hidden
                className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-line-control text-transparent transition-colors duration-150 group-data-[state=checked]/raga:border-marigold group-data-[state=checked]/raga:bg-marigold group-data-[state=checked]/raga:text-on-marigold motion-reduce:transition-none"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </RadioPrimitive.Item>
            {/* Its sound, for screen readers only: the list itself stays to the names */}
            <span id={`${id}-${raga}`} hidden>
              {extrasCopy.ragaSound(arrangement(track(raga)), extrasCopy.ragaMoods[raga])}
            </span>
          </div>
        );
      })}
    </RadioPrimitive.Root>
  );
}
