"use client";

import { Music, Pause, Play, Upload } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/toast";
import {
  CLIP_ACCEPT,
  CLIP_LENGTHS,
  clipName,
  clipWindow,
  MIN_CLIP_SECONDS,
  waveformPeaks,
  type MusicClip,
} from "@/lib/editor/music-clip";
import { deletePhoto, savePhoto } from "@/lib/editor/photos";
import { cn } from "@/lib/cn";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { forgetPhotoUrl, rememberPhotoUrl } from "./use-photo-urls";

/*
 * The host's own music: pick a song, keep up to 30 seconds of it, confirm they may use
 * it, and the trimmed clip replaces the raga. The song never leaves the device; only the
 * short clip is kept and uploaded.
 */

const BARS = 64;

type Song = { buffer: AudioBuffer; name: string; peaks: number[] };

function clock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

function newClipId(): string {
  return crypto.randomUUID();
}

/** Plays part of a decoded song, for hearing a cut before keeping it. */
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
    const node = ctx.current.createBufferSource();
    node.buffer = buffer;
    node.connect(ctx.current.destination);
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

/** The clip as kept: listen to it, change it or take it out. */
function KeptClip({
  clip,
  url,
  onChange,
  onRemove,
}: {
  clip: MusicClip;
  url: string | null;
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
    <div className="flex flex-col gap-3 rounded-lg border border-line-strong bg-surface p-4 shadow-raised sm:flex-row sm:items-center">
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-full bg-marigold/15 text-marigold-strong"
      >
        <Music className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate font-semibold text-ink">{clip.name}</p>
        <p className="text-sm text-ink-muted">{extrasCopy.clipMeta(Math.round(clip.seconds))}</p>
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
  );
}

/** Choosing the part of a picked song to keep. */
function Trimmer({
  song,
  onUse,
  onCancel,
}: {
  song: Song;
  onUse: (clip: MusicClip, blob: Blob) => void;
  onCancel: () => void;
}) {
  const { extrasCopy } = useText(editorText);
  const id = useId();
  const duration = song.buffer.duration;
  const lengths = CLIP_LENGTHS.filter((length, index) => index === 0 || length <= duration + 1);
  const [length, setLength] = useState<number>(lengths.includes(20) ? 20 : lengths[0]!);
  const [start, setStart] = useState(0);
  const [rights, setRights] = useState(false);
  const [making, setMaking] = useState(false);
  const part = usePartPlayer();
  const cut = clipWindow(duration, start, length);
  const latest = Math.max(0, duration - cut.seconds);
  const lit = (bar: number) => {
    const at = ((bar + 0.5) / BARS) * duration;
    return at >= cut.start && at <= cut.start + cut.seconds;
  };

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

      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-start`} className="flex justify-between text-sm text-ink">
          <span>{extrasCopy.startAt}</span>
          <span className="text-ink-muted tabular-nums">
            {clock(cut.start)} – {clock(cut.start + cut.seconds)}
          </span>
        </label>
        <input
          id={`${id}-start`}
          type="range"
          min={0}
          max={Math.max(0, Math.floor(latest * 2) / 2)}
          step={0.5}
          value={cut.start}
          disabled={latest <= 0}
          aria-valuetext={`${clock(cut.start)} – ${clock(cut.start + cut.seconds)}`}
          onChange={(event) => {
            setStart(Number(event.target.value));
            part.stop();
          }}
          className="h-11 w-full cursor-pointer accent-marigold disabled:cursor-default"
        />
      </div>

      {lengths.length > 1 && (
        <div className="flex flex-col gap-1">
          <span id={`${id}-length`} className="text-sm text-ink">
            {extrasCopy.clipLength}
          </span>
          <RadioGroup
            label={extrasCopy.clipLength}
            variant="segment"
            value={String(length)}
            onValueChange={(next) => {
              setLength(Number(next));
              part.stop();
            }}
          >
            {lengths.map((option) => (
              <RadioItem
                key={option}
                value={String(option)}
                label={
                  <span aria-label={extrasCopy.seconds(option)}>
                    {extrasCopy.secondsShort(option)}
                  </span>
                }
              />
            ))}
          </RadioGroup>
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="self-start"
        aria-pressed={part.playing}
        leadingIcon={part.playing ? <Pause aria-hidden /> : <Play aria-hidden />}
        onClick={() =>
          part.playing ? part.stop() : void part.play(song.buffer, cut.start, cut.seconds)
        }
      >
        {part.playing ? extrasCopy.stopPart : extrasCopy.playPart}
      </Button>

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
    </div>
  );
}

export function OwnMusic({
  clip,
  url,
  onClip,
}: {
  clip: MusicClip | null;
  url: string | null;
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
      <p className="text-sm text-ink-muted">{extrasCopy.ownHint}</p>
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
          song={song}
          onUse={(next, blob) => void use(next, blob)}
          onCancel={() => setSong(null)}
        />
      ) : clip ? (
        <KeptClip
          clip={clip}
          url={url}
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
