import { z } from "zod";
import type { Template } from "@/lib/templates/schema";

/*
 * The host's own music: a short clip they upload and trim, played instead of the raga.
 * The editor cuts and re-encodes it in the browser (clip-encode.ts), so every clip is a
 * small AAC file (or a WAV where the browser can't write AAC). It is kept on the device
 * beside the photos and uploads to the event's folder in the event-media bucket.
 */

export const CLIP_TYPES = ["audio/mp4", "audio/wav"] as const;
export type ClipType = (typeof CLIP_TYPES)[number];

/** Clip lengths the host can pick, in seconds. */
export const CLIP_LENGTHS = [15, 20, 30] as const;
export const MIN_CLIP_SECONDS = 3;
export const MAX_CLIP_SECONDS = 30;
/** The largest file a clip may be: 30 seconds of WAV fits well inside. */
export const MAX_CLIP_BYTES = 3 * 1024 * 1024;
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
 * The part of a song a clip keeps: as long as asked (or the whole song when it is
 * shorter), starting where the host chose but never running past the end.
 */
export function clipWindow(
  duration: number,
  start: number,
  length: number,
): { start: number; seconds: number } {
  const seconds = Math.min(length, MAX_CLIP_SECONDS, Math.max(0, duration));
  const latest = Math.max(0, duration - seconds);
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
