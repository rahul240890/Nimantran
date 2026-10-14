import { z } from "zod";
import type { Template } from "@/lib/templates/schema";

/*
 * The host's own music: the part of a song they choose, played instead of the raga. It runs
 * at least as long as the invitation plays (song-length.ts), so it never stops early or
 * starts again; it plays once and fades out at its end. The editor cuts and re-encodes it
 * in the browser (clip-encode.ts), so every clip is an AAC file (or a WAV where the browser
 * can't write AAC) small enough to upload. It is kept on the device beside the photos and
 * uploads to the event's folder in the event-media bucket.
 */

export const CLIP_TYPES = ["audio/mp4", "audio/wav"] as const;
export type ClipType = (typeof CLIP_TYPES)[number];

export const MIN_CLIP_SECONDS = 3;
/** The longest part of a song a clip keeps: five minutes covers the longest invitation. */
export const MAX_CLIP_SECONDS = 300;
/**
 * The largest file a clip may be, under the upload limit of a server function (4.5 MB).
 * The encoder lowers the quality of a long clip until it fits (clip-encode.ts).
 */
export const MAX_CLIP_BYTES = 4 * 1024 * 1024;
/** What the file picker offers. */
export const CLIP_ACCEPT = "audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus";

export const clipSchema = z.object({
  id: z.string().min(1).max(64),
  type: z.enum(CLIP_TYPES),
  seconds: z.number().min(MIN_CLIP_SECONDS).max(MAX_CLIP_SECONDS),
  /** The picked file's name, shown back to the host. */
  name: z.string().max(80),
  /** The host confirmed they have the right to use this music. */
  rights: z.literal(true),
});
export type MusicClip = z.infer<typeof clipSchema>;

/** Where a clip's file lives in the event-media bucket. */
export function clipPath(eventId: string, clip: Pick<MusicClip, "id" | "type">): string {
  return `${eventId}/${clip.id}.${clip.type === "audio/wav" ? "wav" : "m4a"}`;
}

/** The design playing the host's clip; the design unchanged without one. */
export function withClip(template: Template, url: string | null | undefined): Template {
  return url ? { ...template, music: { ...template.music, clip: url } } : template;
}

/** A picked file's name, trimmed to fit and without its extension. */
export function clipName(fileName: string): string {
  const base = fileName.replace(/\.[a-z0-9]{1,5}$/i, "").trim();
  return (base || "Music").slice(0, 80);
}

/**
 * The part of a song a clip keeps, from where the host starts it to where they end it: at
 * least `need` seconds (the invitation's own length) where the song is that long, at most
 * MAX_CLIP_SECONDS, and never past the end of the song.
 */
export function clipWindow(
  duration: number,
  start: number,
  end: number,
  need = MIN_CLIP_SECONDS,
): { start: number; seconds: number } {
  const song = Math.max(0, duration);
  const longest = Math.min(MAX_CLIP_SECONDS, song);
  const seconds = Math.min(longest, Math.max(need, MIN_CLIP_SECONDS, end - start));
  const latest = Math.max(0, song - seconds);
  return { start: Math.min(Math.max(0, start), latest), seconds };
}

/** How loud each of `bars` slices of a recording is, from 0 to 1, for drawing its shape. */
export function waveformPeaks(samples: Float32Array, bars: number): number[] {
  if (bars <= 0 || samples.length === 0) return [];
  const size = Math.max(1, Math.floor(samples.length / bars));
  const peaks: number[] = [];
  for (let bar = 0; bar < bars; bar++) {
    let peak = 0;
    const end = Math.min(samples.length, (bar + 1) * size);
    // Every few samples is plenty for a picture, and quick on a long song
    for (let i = bar * size; i < end; i += 16) peak = Math.max(peak, Math.abs(samples[i]!));
    peaks.push(peak);
  }
  const loudest = Math.max(...peaks, 1e-6);
  return peaks.map((peak) => Math.min(1, peak / loudest));
}
