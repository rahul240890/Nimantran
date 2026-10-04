/*
 * Cuts the host's song down to the chosen seconds and writes it as a small file, all in
 * the browser: decoded with Web Audio, faded in and out so it never starts or stops on a
 * click, then encoded as AAC in an MP4 (about half a megabyte for 30 seconds). Browsers
 * that can't write AAC get a mono WAV instead, which every phone plays. Browser only.
 */

import {
  AudioBufferSource,
  BufferTarget,
  Mp4OutputFormat,
  Output,
  QUALITY_MEDIUM,
  WavOutputFormat,
  canEncodeAudio,
} from "mediabunny";
import { MAX_CLIP_BYTES, type ClipType } from "./music-clip";

const FADE_IN = 0.4;
const FADE_OUT = 1.5;
const AAC_RATE = 44_100;
const WAV_RATE = 22_050;

/** Reads a picked audio file. Throws when the browser can't decode it. */
export async function decodeSong(file: Blob): Promise<AudioBuffer> {
  const AudioContextClass =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new Error("Web Audio is not available");
  const ctx = new AudioContextClass();
  try {
    return await ctx.decodeAudioData(await file.arrayBuffer());
  } finally {
    void ctx.close();
  }
}

/** `seconds` of the song from `start`, resampled and faded at both ends. */
async function cut(
  song: AudioBuffer,
  start: number,
  seconds: number,
  channels: number,
  rate: number,
): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(channels, Math.ceil(seconds * rate), rate);
  const level = ctx.createGain();
  level.gain.setValueAtTime(0, 0);
  level.gain.linearRampToValueAtTime(1, Math.min(FADE_IN, seconds / 4));
  level.gain.setValueAtTime(1, Math.max(FADE_IN, seconds - FADE_OUT));
  level.gain.linearRampToValueAtTime(0, seconds);
  level.connect(ctx.destination);
  const source = ctx.createBufferSource();
  source.buffer = song;
  source.connect(level);
  source.start(0, start, seconds);
  return ctx.startRendering();
}

async function write(buffer: AudioBuffer, type: ClipType): Promise<Blob> {
  const output = new Output({
    format:
      type === "audio/mp4"
        ? new Mp4OutputFormat({ fastStart: "in-memory" })
        : new WavOutputFormat(),
    target: new BufferTarget(),
  });
  const audio = new AudioBufferSource(
    type === "audio/mp4" ? { codec: "aac", quality: QUALITY_MEDIUM } : { codec: "pcm-s16" },
  );
  output.addAudioTrack(audio);
  await output.start();
  await audio.add(buffer);
  await output.finalize();
  const data = output.target.buffer;
  if (!data) throw new Error("Empty clip");
  return new Blob([data], { type });
}

/** The trimmed clip as a file ready to keep and upload. */
export async function encodeClip(
  song: AudioBuffer,
  start: number,
  seconds: number,
): Promise<{ blob: Blob; type: ClipType }> {
  const aac =
    typeof AudioEncoder !== "undefined" &&
    (await canEncodeAudio("aac", { numberOfChannels: 2, sampleRate: AAC_RATE }).catch(() => false));
  const type: ClipType = aac ? "audio/mp4" : "audio/wav";
  const buffer = aac
    ? await cut(song, start, seconds, Math.min(2, song.numberOfChannels), AAC_RATE)
    : await cut(song, start, seconds, 1, WAV_RATE);
  const blob = await write(buffer, type);
  if (blob.size > MAX_CLIP_BYTES) throw new Error("Clip too large");
  return { blob, type };
}
