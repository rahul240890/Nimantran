"use client";

import { Clock, Music, Pause, Play, TriangleAlert, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import { Hint } from "@/components/ui/quiet";
import {
  CLIP_ACCEPT,
  clipName,
  clipWindow,
  MAX_CLIP_SECONDS,
  MIN_CLIP_SECONDS,
  waveformPeaks,
  type MusicClip,
} from "@/lib/editor/music-clip";
import { songClock as clock, type SongLengths } from "@/lib/editor/song-length";
import { deletePhoto, savePhoto } from "@/lib/editor/photos";
import { cn } from "@/lib/cn";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { forgetPhotoUrl, rememberPhotoUrl } from "./use-photo-urls";

/*
 * The host's own music: pick a song, choose where it starts and ends, confirm they may use
 * it, and the trimmed part replaces the raga. The part must last at least as long as the
 * invitation plays (song-length.ts), so guests never hear it stop early or start again.
 * The song never leaves the device; only the part kept is uploaded.
 */

const BARS = 64;
/** "Hear the ending" plays this much before the end of the part. */
const ENDING_SECONDS = 10;

type Song = { buffer: AudioBuffer; name: string; peaks: number[] };

/** How long the song has to run for this invitation, as the music step works it out. */
export type SongNeeds = SongLengths & {
  /** The number of pages, or null for a One Scene. */
  pages: number | null;
};

function newClipId(): string {
  return crypto.randomUUID();
}

/** Plays part of a decoded song, for hearing a cut before keeping it. */
function usePartPlayer() {
  const ctx = useRef<AudioContext | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const [playing, setPlaying] = useState<"start" | "end" | null>(null);

  const stop = () => {
    source.current?.stop();
    source.current = null;
    setPlaying(null);
  };

  /** `fade` ends it as the kept part will end, fading away over its last seconds. */
  const play = async (
    which: "start" | "end",
    buffer: AudioBuffer,
    start: number,
    seconds: number,
    fade = false,
  ) => {
    stop();
    ctx.current ??= new AudioContext();
    await ctx.current.resume();
    const now = ctx.current.currentTime;
    const level = ctx.current.createGain();
    if (fade) {
      const out = Math.min(4, seconds / 2);
      level.gain.setValueAtTime(1, now + seconds - out);
      level.gain.linearRampToValueAtTime(0, now + seconds);
    }
    level.connect(ctx.current.destination);
    const node = ctx.current.createBufferSource();
    node.buffer = buffer;
    node.connect(level);
    node.onended = () => {
      if (source.current === node) {
        source.current = null;
        setPlaying(null);
      }
    };
    node.start(0, start, seconds);
    source.current = node;
    setPlaying(which);
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

/** How long the invitation plays, so the host knows how much of the song to keep. */
function NeedNote({ needs }: { needs: SongNeeds }) {
  const { extrasCopy } = useText(editorText);
  const need = clock(needs.need);
  return (
    <div className="flex items-start gap-2 rounded-md bg-marigold/10 px-3 py-2 text-sm text-ink">
      <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-marigold-strong" />
      <p>
        {needs.pages === null
          ? extrasCopy.sceneNeedNote(need)
          : extrasCopy.needNote(need, needs.pages)}{" "}
        {needs.full > needs.need && extrasCopy.fullNote(clock(needs.full))}
      </p>
    </div>
  );
}

/** A warning in the music's own words: the song is shorter than the invitation. */
function ShortWarning({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-ink">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
      <span>{children}</span>
    </p>
  );
}

/** The clip as kept: listen to it, change it or take it out. */
function KeptClip({
  clip,
  url,
  needs,
  onChange,
  onRemove,
}: {
  clip: MusicClip;
  url: string | null;
  needs: SongNeeds | null;
  onChange: () => void;
  onRemove: () => void;
}) {
  const { extrasCopy } = useText(editorText);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const current = audio.current;
    return () => current?.pause();
  }, [url]);

  const listen = async () => {
    const element = audio.current;
    if (!element) return;
    if (listening) {
      element.pause();
      return;
    }
    element.currentTime = 0;
    await element.play().catch(() => setListening(false));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-lg border border-line-strong bg-surface p-4 shadow-raised sm:flex-row sm:items-center">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-marigold/15 text-marigold-strong"
        >
          <Music className="size-5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate font-semibold text-ink">{clip.name}</p>
          <p className="text-sm text-ink-muted">{extrasCopy.clipMeta(clock(clip.seconds))}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!url}
            aria-pressed={listening}
            leadingIcon={listening ? <Pause aria-hidden /> : <Play aria-hidden />}
            onClick={() => void listen()}
          >
            {listening ? extrasCopy.stopPart : extrasCopy.listenClip}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onChange}>
            {extrasCopy.changeClip}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            {extrasCopy.removeClip}
          </Button>
        </div>
        {url && (
          <audio
            ref={audio}
            src={url}
            preload="none"
            onPlay={() => setListening(true)}
            onPause={() => setListening(false)}
            onEnded={() => setListening(false)}
          />
        )}
      </div>
      {/* Clips kept before the invitation grew (more functions, longer pages) */}
      {needs && Math.round(clip.seconds) < needs.need && (
        <ShortWarning>{extrasCopy.shortNote(clock(clip.seconds), clock(needs.need))}</ShortWarning>
      )}
    </div>
  );
}

/** Choosing the part of a picked song to keep: where it starts and where it ends. */
function Trimmer({
  song,
  needs,
  onUse,
  onCancel,
  onPickAnother,
}: {
  song: Song;
  needs: SongNeeds | null;
  onUse: (clip: MusicClip, blob: Blob) => void;
  onCancel: () => void;
  onPickAnother: () => void;
}) {
  const { extrasCopy } = useText(editorText);
  const id = useId();
  const duration = song.buffer.duration;
  const need = Math.min(MAX_CLIP_SECONDS, needs?.need ?? MIN_CLIP_SECONDS);
  // A song a little short of the invitation (by a second) still reaches its end
  const tooShort = needs !== null && duration + 1 < need;
  // At first, enough for the page below too where the song is long enough
  const [range, setRange] = useState(() => {
    const first = clipWindow(duration, 0, needs?.full ?? need, need);
    return { start: first.start, end: first.start + first.seconds };
  });
  const [rights, setRights] = useState(false);
  const [making, setMaking] = useState(false);
  const part = usePartPlayer();
  const cut = clipWindow(duration, range.start, range.end, tooShort ? 0 : need);
  const end = cut.start + cut.seconds;
  const shortest = Math.min(need, duration);
  const longest = Math.min(MAX_CLIP_SECONDS, duration);
  const lit = (bar: number) => {
    const at = ((bar + 0.5) / BARS) * duration;
    return at >= cut.start && at <= end;
  };
  const set = (start: number, finish: number) => {
    part.stop();
    const next = clipWindow(duration, start, finish, need);
    setRange({ start: next.start, end: next.start + next.seconds });
  };
  // Half-second steps along the song, never past what the slider can reach
  const half = (seconds: number) => Math.floor(seconds * 2) / 2;
  const fits = needs
    ? [
        { key: "need", seconds: needs.need, label: extrasCopy.fitInvitation(clock(needs.need)) },
        ...(needs.full > needs.need && needs.full <= longest
          ? [{ key: "full", seconds: needs.full, label: extrasCopy.fitAll(clock(needs.full)) }]
          : []),
      ].filter((fit) => fit.seconds <= longest)
    : [];

  const use = async () => {
    part.stop();
    setMaking(true);
    try {
      const { encodeClip } = await import("@/lib/editor/clip-encode");
      const { blob, type } = await encodeClip(song.buffer, cut.start, cut.seconds);
      onUse(
        {
          id: newClipId(),
          type,
          seconds: Math.round(cut.seconds * 10) / 10,
          name: song.name,
          rights: true,
        },
        blob,
      );
    } catch {
      toast({ title: extrasCopy.clipFailed, tone: "error" });
    } finally {
      setMaking(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line-strong bg-surface p-4 shadow-raised">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h3 className="font-label text-xs tracking-[0.18em] text-ink-muted uppercase">
          {extrasCopy.trimHeading}
        </h3>
        <p className="truncate font-semibold text-ink">{song.name}</p>
      </div>

      {tooShort ? (
        <>
          <ShortWarning>{extrasCopy.tooShort(clock(duration), clock(need))}</ShortWarning>
          <div className="flex flex-wrap gap-2">
            <Button type="button" leadingIcon={<Upload aria-hidden />} onClick={onPickAnother}>
              {extrasCopy.chooseLonger}
            </Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              {extrasCopy.cancelTrim}
            </Button>
          </div>
        </>
      ) : (
        <>
          {needs && <NeedNote needs={needs} />}

          <svg
            role="img"
            aria-label={extrasCopy.waveformLabel(song.name)}
            viewBox={`0 0 ${BARS * 4} 48`}
            preserveAspectRatio="none"
            className="h-16 w-full"
          >
            {song.peaks.map((peak, bar) => {
              const height = Math.max(2, peak * 44);
              return (
                <rect
                  key={bar}
                  x={bar * 4 + 0.5}
                  y={(48 - height) / 2}
                  width={3}
                  height={height}
                  rx={1.5}
                  className={cn(
                    "transition-colors duration-150 motion-reduce:transition-none",
                    lit(bar) ? "fill-marigold" : "fill-line-strong",
                  )}
                />
              );
            })}
          </svg>
          <p className="-mt-2 flex justify-between text-sm text-ink-muted tabular-nums">
            <span>{clock(cut.start)}</span>
            <span className="font-semibold text-ink" aria-live="polite">
              {extrasCopy.keeping(clock(cut.seconds))}
            </span>
            <span>{clock(end)}</span>
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-start`} className="flex justify-between text-sm text-ink">
                <span>{extrasCopy.startAt}</span>
                <span className="text-ink-muted tabular-nums">{clock(cut.start)}</span>
              </label>
              <input
                id={`${id}-start`}
                type="range"
                min={0}
                max={Math.max(0, half(duration - shortest))}
                step={0.5}
                value={cut.start}
                disabled={duration - shortest <= 0}
                aria-valuetext={clock(cut.start)}
                // Moving the start keeps the length, as far as the song allows
                onChange={(event) => {
                  const start = Number(event.target.value);
                  set(start, start + cut.seconds);
                }}
                className="h-11 w-full cursor-pointer accent-marigold disabled:cursor-default"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-end`} className="flex justify-between text-sm text-ink">
                <span>{extrasCopy.endAt}</span>
                <span className="text-ink-muted tabular-nums">{clock(end)}</span>
              </label>
              <input
                id={`${id}-end`}
                type="range"
                min={half(cut.start + shortest)}
                max={half(Math.min(duration, cut.start + longest))}
                step={0.5}
                value={half(end)}
                disabled={longest <= shortest}
                aria-valuetext={`${clock(end)}, ${extrasCopy.keeping(clock(cut.seconds))}`}
                onChange={(event) => set(cut.start, Number(event.target.value))}
                className="h-11 w-full cursor-pointer accent-marigold disabled:cursor-default"
              />
            </div>
          </div>

          {fits.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fits.map((fit) => {
                const chosen = Math.abs(cut.seconds - fit.seconds) < 0.5;
                return (
                  <button
                    key={fit.key}
                    type="button"
                    aria-pressed={chosen}
                    onClick={() => set(cut.start, cut.start + fit.seconds)}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-sm text-ink tabular-nums shadow-raised",
                      "aria-pressed:border-marigold aria-pressed:bg-[color-mix(in_srgb,var(--marigold)_12%,var(--surface))] aria-pressed:shadow-[0_0_0_1px_var(--marigold)]",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    )}
                  >
                    {fit.label}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-pressed={part.playing === "start"}
              leadingIcon={part.playing === "start" ? <Pause aria-hidden /> : <Play aria-hidden />}
              onClick={() =>
                part.playing === "start"
                  ? part.stop()
                  : void part.play("start", song.buffer, cut.start, cut.seconds)
              }
            >
              {part.playing === "start" ? extrasCopy.stopPart : extrasCopy.playPart}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-pressed={part.playing === "end"}
              leadingIcon={part.playing === "end" ? <Pause aria-hidden /> : <Play aria-hidden />}
              onClick={() => {
                if (part.playing === "end") return part.stop();
                const from = Math.max(cut.start, end - ENDING_SECONDS);
                void part.play("end", song.buffer, from, end - from, true);
              }}
            >
              {part.playing === "end" ? extrasCopy.stopPart : extrasCopy.playEnd}
            </Button>
          </div>

          <Checkbox
            label={extrasCopy.rights}
            description={extrasCopy.rightsHint}
            checked={rights}
            onCheckedChange={(checked) => setRights(checked === true)}
            required
          />

          <div className="flex flex-wrap gap-2">
            <Button type="button" loading={making} disabled={!rights} onClick={() => void use()}>
              {making ? extrasCopy.makingClip : extrasCopy.useClip}
            </Button>
            <Button type="button" variant="ghost" disabled={making} onClick={onCancel}>
              {extrasCopy.cancelTrim}
            </Button>
          </div>
        </>
      )}
    </div>
  );
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

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    try {
      const { decodeSong } = await import("@/lib/editor/clip-encode");
      const buffer = await decodeSong(file);
      if (buffer.duration < MIN_CLIP_SECONDS) throw new Error("Too short");
      setSong({
        buffer,
        name: clipName(file.name),
        peaks: waveformPeaks(buffer.getChannelData(0), BARS),
      });
    } catch {
      toast({ title: extrasCopy.songFailed, tone: "error" });
    } finally {
      setReading(false);
    }
  };

  const discard = (old: MusicClip | null) => {
    if (!old) return;
    forgetPhotoUrl(old.id);
    void deletePhoto(old.id).catch(() => {
      // Left behind on the device; harmless, and cleared with the next new invite
    });
  };

  const use = async (next: MusicClip, blob: Blob) => {
    try {
      await savePhoto(next.id, blob);
    } catch {
      toast({ title: extrasCopy.clipStorageFailed, tone: "error" });
      return;
    }
    rememberPhotoUrl(next.id, blob);
    discard(clip);
    setSong(null);
    onClip(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <Hint>{extrasCopy.ownHint}</Hint>
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
      {song ? (
        <Trimmer
          key={`${song.name}:${song.buffer.duration}`}
          song={song}
          needs={needs}
          onUse={(next, blob) => void use(next, blob)}
          onCancel={() => setSong(null)}
          onPickAnother={() => input.current?.click()}
        />
      ) : clip ? (
        <KeptClip
          clip={clip}
          url={url}
          needs={needs}
          onChange={() => input.current?.click()}
          onRemove={() => {
            discard(clip);
            onClip(null);
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line-strong bg-surface-2/60 px-4 py-6 text-center">
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
            {reading ? extrasCopy.readingSong : extrasCopy.songTypes}
          </p>
        </div>
      )}
      {song === null && clip && reading && (
        <p className="text-sm text-ink-muted" aria-live="polite">
          {extrasCopy.readingSong}
        </p>
      )}
    </div>
  );
}
