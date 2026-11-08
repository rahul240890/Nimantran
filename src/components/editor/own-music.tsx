"use client";

import { LoaderCircle, Music, Pause, Play, TriangleAlert, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  CLIP_ACCEPT,
  clipName,
  MAX_CLIP_SECONDS,
  MIN_CLIP_SECONDS,
  waveformPeaks,
  type MusicClip,
} from "@/lib/editor/music-clip";
import { songClock as clock, type SongLengths } from "@/lib/editor/song-length";
import { deletePhoto, loadPhoto, savePhoto } from "@/lib/editor/photos";
import { cn } from "@/lib/cn";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { forgetPhotoUrl, rememberPhotoUrl } from "./use-photo-urls";

/*
 * The host's own music (owner, 2026-10-24: simple, and nothing to forget to press). Pick a
 * song and it is the invitation's music straight away: the part kept is as long as the
 * invitation plays (song-length.ts), from the start of the song. Moving where it starts,
 * on the slider, in seconds, or by tapping the song's shape, saves again a moment later.
 * The whole song stays on this device (never uploaded; only the part kept is), so the
 * start can move again at any time, after publishing too, without choosing the song again
 * (owner, 2026-11-08).
 */

const BARS = 56;
/** A new start is saved this long after the slider stops moving. */
const SAVE_AFTER_MS = 600;

type Song = {
  buffer: AudioBuffer;
  name: string;
  peaks: number[];
  /** Where the whole song is kept on this device; null where it couldn't be. */
  source: string | null;
};

/** Seconds as a host reads them: whole, or to the half second. */
function secondsText(seconds: number): string {
  const half = Math.round(seconds * 2) / 2;
  return Number.isInteger(half) ? String(half) : half.toFixed(1);
}

/** How long the song has to run for this invitation, as the music step works it out. */
export type SongNeeds = SongLengths & {
  /** The number of pages, or null for a One Scene. */
  pages: number | null;
};

/** Plays part of a decoded song, fading out as the kept part will. */
function usePartPlayer() {
  const ctx = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    source.current?.stop();
    source.current = null;
    setPlaying(false);
  };

  const play = async (buffer: AudioBuffer, start: number, seconds: number) => {
    stop();
    ctx.current ??= new AudioContext();
    await ctx.current.resume();
    const now = ctx.current.currentTime;
    const level = ctx.current.createGain();
    const out = Math.min(4, seconds / 2);
    level.gain.setValueAtTime(1, now + seconds - out);
    level.gain.linearRampToValueAtTime(0, now + seconds);
    level.connect(ctx.current.destination);
    const node = ctx.current.createBufferSource();
    node.buffer = buffer;
    node.connect(level);
    node.onended = () => {
      if (source.current === node) {
        source.current = null;
        setPlaying(false);
      }
    };
    node.start(0, start, seconds);
    source.current = node;
    setPlaying(true);
  };

  useEffect(
    () => () => {
      source.current?.stop();
      void ctx.current?.close();
    },
    [],
  );
  return { playing, play, stop };
}

/** Plays the kept part from its saved file. */
function useClipPlayer(url: string | null) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!url) return;
    const element = new Audio(url);
    element.preload = "none";
    element.onplay = () => setPlaying(true);
    element.onpause = () => setPlaying(false);
    element.onended = () => setPlaying(false);
    audio.current = element;
    return () => {
      element.pause();
      audio.current = null;
    };
  }, [url]);
  const toggle = async () => {
    const element = audio.current;
    if (!element) return;
    if (playing) return element.pause();
    element.currentTime = 0;
    await element.play().catch(() => setPlaying(false));
  };
  return { playing, toggle };
}

function Warning({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-ink">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
      <span>{children}</span>
    </p>
  );
}

/** The song's card: its name and play button, then its actions. */
function SongCard({
  name,
  meta,
  playing,
  onPlay,
  playDisabled = false,
  children,
  actions,
}: {
  name: string;
  meta: ReactNode;
  playing: boolean;
  onPlay: () => void;
  playDisabled?: boolean;
  children?: ReactNode;
  actions: ReactNode;
}) {
  const { extrasCopy } = useText(editorText);
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line-strong bg-surface p-3 shadow-raised">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-pressed={playing}
          aria-label={playing ? extrasCopy.stopPart : extrasCopy.listenClip}
          disabled={playDisabled}
          onClick={onPlay}
          className={cn(
            "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-150 motion-reduce:transition-none",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-50",
            playing ? "bg-marigold text-on-marigold" : "bg-marigold/15 text-accent-text",
          )}
        >
          {playing ? (
            <Pause aria-hidden className="size-5" />
          ) : (
            <Play aria-hidden className="size-5 translate-x-px" />
          )}
        </button>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="flex min-w-0 items-center gap-1.5 font-semibold text-ink">
            <Music aria-hidden className="size-4 shrink-0 text-accent-text" />
            <span className="truncate">{name}</span>
          </p>
          <p className="text-sm text-ink-muted tabular-nums" aria-live="polite">
            {meta}
          </p>
        </div>
      </div>
      {children}
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

/**
 * A song picked here, while its sound is on this device: where it starts, saved as it
 * changes. The part kept is as long as the invitation plays.
 */
function SongStart({
  song,
  needs,
  saving,
  initialStart = 0,
  onStart,
  actions,
}: {
  song: Song;
  needs: SongNeeds | null;
  saving: boolean;
  /** Where the part kept starts now, in seconds. */
  initialStart?: number;
  /** A new start, in seconds; the caller saves it. */
  onStart: (start: number, seconds: number) => void;
  actions: ReactNode;
}) {
  const { extrasCopy } = useText(editorText);
  const id = useId();
  const duration = song.buffer.duration;
  const length = keptLength(duration, needs);
  const latest = Math.max(0, Math.floor((duration - length) * 2) / 2);
  const [start, setStart] = useState(() =>
    Math.min(latest, Math.max(0, Math.round(initialStart * 2) / 2)),
  );
  // The seconds box keeps what the host types until it reads as a start
  const [typed, setTyped] = useState<string | null>(null);
  const part = usePartPlayer();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const move = (next: number) => {
    const at = Math.min(latest, Math.max(0, Math.round(next * 2) / 2));
    setStart(at);
    setTyped(null);
    if (part.playing) void part.play(song.buffer, at, length);
    clearTimeout(timer.current ?? undefined);
    timer.current = setTimeout(() => onStart(at, length), SAVE_AFTER_MS);
  };
  const lit = (bar: number) => {
    const at = ((bar + 0.5) / BARS) * duration;
    return at >= start && at <= start + length;
  };

  return (
    <SongCard
      name={song.name}
      meta={
        saving ? (
          <span className="inline-flex items-center gap-1.5">
            <LoaderCircle aria-hidden className="size-3.5 animate-spin motion-still:animate-none" />
            {extrasCopy.makingClip}
          </span>
        ) : (
          extrasCopy.clipMeta(clock(length))
        )
      }
      playing={part.playing}
      onPlay={() => (part.playing ? part.stop() : void part.play(song.buffer, start, length))}
      actions={actions}
    >
      {/* The song's shape, the part kept lit; a tap starts the part there */}
      <svg
        role="img"
        aria-label={extrasCopy.waveformLabel(song.name)}
        viewBox={`0 0 ${BARS * 4} 40`}
        preserveAspectRatio="none"
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          move(((event.clientX - box.left) / box.width) * duration - length / 2);
        }}
        className="h-12 w-full cursor-pointer"
      >
        {song.peaks.map((peak, bar) => {
          const height = Math.max(2, peak * 36);
          return (
            <rect
              key={bar}
              x={bar * 4 + 0.5}
              y={(40 - height) / 2}
              width={3}
              height={height}
              rx={1.5}
              className={lit(bar) ? "fill-marigold" : "fill-line-strong"}
            />
          );
        })}
      </svg>
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <label htmlFor={`${id}-seconds`} className="text-sm text-ink">
            {extrasCopy.startSeconds}
          </label>
          <span className="flex items-center gap-1.5">
            <input
              id={`${id}-seconds`}
              type="number"
              inputMode="decimal"
              min={0}
              max={latest}
              step={0.5}
              value={typed ?? secondsText(start)}
              disabled={latest <= 0}
              aria-describedby={`${id}-part`}
              onChange={(event) => {
                const text = event.target.value;
                const next = Number(text);
                if (text.trim() !== "" && Number.isFinite(next) && next >= 0 && next <= latest) {
                  move(next);
                } else {
                  setTyped(text);
                }
              }}
              onBlur={() => {
                if (typed === null) return;
                const next = Number(typed);
                if (typed.trim() !== "" && Number.isFinite(next)) move(next);
                else setTyped(null);
              }}
              className={cn(
                "h-11 w-24 rounded-md border border-line-strong bg-paper px-3 text-right text-ink tabular-nums",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50",
              )}
            />
            <span aria-hidden className="text-sm text-ink-muted">
              {extrasCopy.secondsShort}
            </span>
          </span>
        </div>
        <p id={`${id}-part`} className="text-sm text-ink-muted tabular-nums">
          {extrasCopy.partSeconds(secondsText(start), secondsText(start + length))}
        </p>
        <label htmlFor={`${id}-start`} className="sr-only">
          {extrasCopy.startAt}
        </label>
        <input
          id={`${id}-start`}
          type="range"
          min={0}
          max={latest}
          step={0.5}
          value={start}
          disabled={latest <= 0}
          aria-valuetext={extrasCopy.startsAtSeconds(secondsText(start))}
          onChange={(event) => move(Number(event.target.value))}
          className="h-11 w-full cursor-pointer accent-marigold disabled:cursor-default"
        />
      </div>
    </SongCard>
  );
}

/** As long as the invitation plays (with the page below where the song allows), at most. */
function keptLength(duration: number, needs: SongNeeds | null): number {
  const need = Math.min(MAX_CLIP_SECONDS, needs?.need ?? MIN_CLIP_SECONDS);
  const wanted = Math.min(MAX_CLIP_SECONDS, Math.max(need, needs?.full ?? need));
  return Math.min(duration, wanted);
}

export function OwnMusic({
  clip,
  url,
  needs = null,
  onClip,
}: {
  clip: MusicClip | null;
  url: string | null;
  /** How long the song has to run for this invitation; null where nothing is known. */
  needs?: SongNeeds | null;
  /** The new clip (already kept on this device), or null to take it out. */
  onClip: (clip: MusicClip | null) => void;
}) {
  const { extrasCopy } = useText(editorText);
  const input = useRef<HTMLInputElement>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  // The whole song is being read back from this device, to move its start again
  const [opening, setOpening] = useState(false);
  const kept = useClipPlayer(url);
  // Each save counts, so a slower one finishing after a newer start never wins
  const saves = useRef(0);
  const current = useRef(clip);
  // The clip's whole song, read back from this device once per song
  const opened = useRef<string | null>(null);
  useEffect(() => {
    current.current = clip;
  }, [clip]);

  /** Forgets an old clip's file, and its whole song unless the new clip keeps it. */
  const discard = (old: MusicClip | null, keepSource: string | null = null) => {
    if (!old) return;
    forgetPhotoUrl(old.id);
    const ids = old.source && old.source !== keepSource ? [old.id, old.source] : [old.id];
    for (const id of ids) {
      void deletePhoto(id).catch(() => {
        // Left behind on the device; harmless, and cleared with the next new invite
      });
    }
  };

  /** Cuts the part from `start` and makes it the invitation's music. */
  const save = async (picked: Song, start: number, seconds: number) => {
    const turn = ++saves.current;
    setSaving(true);
    try {
      const { encodeClip } = await import("@/lib/editor/clip-encode");
      const { blob, type } = await encodeClip(picked.buffer, start, seconds);
      if (turn !== saves.current) return;
      const next: MusicClip = {
        id: crypto.randomUUID(),
        type,
        seconds: Math.round(seconds * 10) / 10,
        name: picked.name,
        // Uploading is the host's word they may use it, as the note under the button says
        rights: true,
        start: Math.round(start * 10) / 10,
        ...(picked.source ? { source: picked.source } : {}),
      };
      try {
        await savePhoto(next.id, blob);
      } catch {
        toast({ title: extrasCopy.clipStorageFailed, tone: "error" });
        return;
      }
      if (turn !== saves.current) {
        void deletePhoto(next.id).catch(() => undefined);
        return;
      }
      rememberPhotoUrl(next.id, blob);
      discard(current.current, picked.source);
      onClip(next);
    } catch {
      toast({ title: extrasCopy.clipFailed, tone: "error" });
    } finally {
      if (turn === saves.current) setSaving(false);
    }
  };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    try {
      const { decodeSong } = await import("@/lib/editor/clip-encode");
      const buffer = await decodeSong(file);
      if (buffer.duration < MIN_CLIP_SECONDS) throw new Error("Too short");
      const short = tooShort(buffer.duration, needs);
      // A song long enough is kept whole on this device, so its start can move later
      let source: string | null = null;
      if (!short) {
        source = crypto.randomUUID();
        await savePhoto(source, file).catch(() => {
          source = null;
        });
      }
      const picked: Song = {
        buffer,
        name: clipName(file.name),
        peaks: waveformPeaks(buffer.getChannelData(0), BARS),
        source,
      };
      opened.current = source;
      setSong(picked);
      // Long enough: it is the music at once, from its start
      if (!short) void save(picked, 0, keptLength(buffer.duration, needs));
    } catch {
      toast({ title: extrasCopy.songFailed, tone: "error" });
    } finally {
      setReading(false);
    }
  };

  const sourceId = clip?.source ?? null;
  useEffect(() => {
    if (song || !sourceId || opened.current === sourceId) return;
    opened.current = sourceId;
    let cancelled = false;
    setOpening(true);
    void (async () => {
      try {
        const blob = await loadPhoto(sourceId);
        if (!blob || cancelled) return;
        const { decodeSong } = await import("@/lib/editor/clip-encode");
        const buffer = await decodeSong(blob);
        if (cancelled || current.current?.source !== sourceId) return;
        const picked: Song = {
          buffer,
          name: current.current.name,
          peaks: waveformPeaks(buffer.getChannelData(0), BARS),
          source: sourceId,
        };
        setSong(picked);
        // Kept before the invitation grew: cut again from the same start, long enough now
        const length = keptLength(buffer.duration, needs);
        if (
          Math.round(current.current.seconds) < Math.round(length) &&
          !tooShort(buffer.duration, needs)
        ) {
          void save(picked, current.current.start ?? 0, length);
        }
      } catch {
        // Not readable here: the clip still plays, and Change picks the song again
      } finally {
        if (!cancelled) setOpening(false);
      }
    })();
    return () => {
      cancelled = true;
      setOpening(false);
      if (opened.current === sourceId) opened.current = null;
    };
    // Reads once per song; the clip's other changes are the host's own moves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song, sourceId]);

  const remove = () => {
    saves.current++;
    setSaving(false);
    setSong(null);
    opened.current = null;
    discard(clip);
    onClip(null);
  };

  const change = (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      leadingIcon={<Upload aria-hidden />}
      loading={reading}
      onClick={() => input.current?.click()}
    >
      {extrasCopy.changeClip}
    </Button>
  );
  const removeButton = (
    <Button type="button" variant="ghost" size="sm" onClick={remove}>
      {extrasCopy.removeClip}
    </Button>
  );

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={input}
        type="file"
        accept={CLIP_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          void pick(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {song && tooShort(song.buffer.duration, needs) ? (
        <div className="flex flex-col gap-3">
          <Warning>
            {extrasCopy.tooShort(clock(song.buffer.duration), clock(needs?.need ?? 0))}
          </Warning>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              leadingIcon={<Upload aria-hidden />}
              loading={reading}
              onClick={() => input.current?.click()}
            >
              {extrasCopy.chooseLonger}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setSong(null)}>
              {extrasCopy.cancelTrim}
            </Button>
          </div>
        </div>
      ) : song ? (
        <SongStart
          key={song.source ?? `${song.name}:${song.buffer.duration}`}
          song={song}
          needs={needs}
          saving={saving}
          initialStart={song.source && song.source === clip?.source ? (clip.start ?? 0) : 0}
          onStart={(start, seconds) => void save(song, start, seconds)}
          actions={
            <>
              {change}
              {removeButton}
            </>
          }
        />
      ) : clip ? (
        <>
          <SongCard
            name={clip.name}
            meta={
              opening ? (
                <span className="inline-flex items-center gap-1.5">
                  <LoaderCircle
                    aria-hidden
                    className="size-3.5 animate-spin motion-still:animate-none"
                  />
                  {extrasCopy.readingSong}
                </span>
              ) : (
                extrasCopy.clipMeta(clock(clip.seconds))
              )
            }
            playing={kept.playing}
            playDisabled={!url}
            onPlay={() => void kept.toggle()}
            actions={
              <>
                {change}
                {removeButton}
              </>
            }
          >
            {!opening && (
              <p className="text-sm text-ink-muted">
                {clip.start !== undefined && (
                  <span className="block text-ink tabular-nums">
                    {extrasCopy.startsAtSeconds(secondsText(clip.start))}
                  </span>
                )}
                {extrasCopy.songElsewhere}
              </p>
            )}
          </SongCard>
          {/* Kept before the invitation grew (more functions, longer pages) */}
          {needs && Math.round(clip.seconds) < needs.need && (
            <Warning>{extrasCopy.shortNote(clock(clip.seconds), clock(needs.need))}</Warning>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line-strong bg-surface-2/60 px-4 py-5 text-center">
          <Button
            type="button"
            variant="secondary"
            leadingIcon={<Upload aria-hidden />}
            loading={reading}
            onClick={() => input.current?.click()}
          >
            {extrasCopy.chooseSong}
          </Button>
          <p className="text-sm text-ink-muted" aria-live="polite">
            {reading ? extrasCopy.readingSong : extrasCopy.songNote}
          </p>
        </div>
      )}
    </div>
  );
}

/** A song a little short of the invitation (by a second) still reaches its end. */
function tooShort(duration: number, needs: SongNeeds | null): boolean {
  const need = Math.min(MAX_CLIP_SECONDS, needs?.need ?? MIN_CLIP_SECONDS);
  return needs !== null && duration + 1 < need;
}
