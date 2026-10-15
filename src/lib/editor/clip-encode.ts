/*
 * Cuts the host's song down to the part they chose and writes it as a file small enough to
 * upload, all in the browser: decoded with Web Audio, faded in and out so it never starts
 * or stops on a click, then encoded as AAC in an MP4 (about a megabyte a minute). A long
 * part gets a lower bitrate so it still fits. Browsers that can't write AAC get a mono WAV
 * instead, which every phone plays, at a lower sample rate the longer it is. Browser only.
 */

import {
  AudioBufferSource,
  BufferTarget,
  Mp4OutputFormat,
  Output,
  Quality,
  WavOutputFormat,
  canEncodeAudio,
} from "mediabunny";
import { MAX_CLIP_BYTES, type ClipType } from "./music-clip";

const FADE_IN = 0.4;
/** The song comes to rest at the end of the part, never cut off mid-phrase. */
const FADE_OUT = 4;
const AAC_RATE = 44_100;
/** AAC bitrates to try, best first; the first whose file fits is used. */
const AAC_BITRATES = [128_000, 96_000, 64_000] as const;
/** WAV sample rates to try, best first, for a mono 16-bit file; past the last, 8-bit. */
const WAV_RATES = [22_050, 16_000, 11_025, 8_000] as const;
/** Room left in the file for its headers and the encoder running a little over. */
const BUDGET = MAX_CLIP_BYTES * 0.9;

/** The best AAC bitrate whose `seconds` fit the upload. */
export function aacBitrate(seconds: number): number {
  return AAC_BITRATES.find((rate) => (rate / 8) * seconds <= BUDGET) ?? AAC_BITRATES.at(-1)!;
}

/** The best WAV sample rate and sample size whose `seconds` fit the upload. */
export function wavFormat(seconds: number): { rate: number; codec: "pcm-s16" | "pcm-u8" } {
  const rate = WAV_RATES.find((r) => r * 2 * seconds <= BUDGET);
  if (rate) return { rate, codec: "pcm-s16" };
  const narrow = WAV_RATES.find((r) => r * seconds <= BUDGET) ?? WAV_RATES.at(-1)!;
  return { rate: narrow, codec: "pcm-u8" };
}

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
  const fadeOut = Math.min(FADE_OUT, seconds / 4);
  level.gain.setValueAtTime(0, 0);
  level.gain.linearRampToValueAtTime(1, Math.min(FADE_IN, seconds / 4));
  level.gain.setValueAtTime(1, Math.max(FADE_IN, seconds - fadeOut));
  level.gain.linearRampToValueAtTime(0, seconds);
  level.connect(ctx.destination);
  const source = ctx.createBufferSource();
  source.buffer = song;
  source.connect(level);
  source.start(0, start, seconds);
  return ctx.startRendering();
}

async function write(
  buffer: AudioBuffer,
  type: ClipType,
  codec: { codec: "aac"; bitrate: number } | { codec: "pcm-s16" | "pcm-u8" },
): Promise<Blob> {
  const output = new Output({
    format:
      type === "audio/mp4"
        ? new Mp4OutputFormat({ fastStart: "in-memory" })
        : new WavOutputFormat(),
    target: new BufferTarget(),
  });
  const audio = new AudioBufferSource(
    codec.codec === "aac"
      ? { codec: "aac", quality: new Quality(codec.bitrate) }
      : { codec: codec.codec },
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
  const bitrate = aacBitrate(seconds);
  const aac =
    typeof AudioEncoder !== "undefined" &&
    (await canEncodeAudio("aac", {
      numberOfChannels: 2,
      sampleRate: AAC_RATE,
      quality: new Quality(bitrate),
    }).catch(() => false));
  const type: ClipType = aac ? "audio/mp4" : "audio/wav";
  const wav = wavFormat(seconds);
  const buffer = aac
    ? await cut(song, start, seconds, Math.min(2, song.numberOfChannels), AAC_RATE)
    : await cut(song, start, seconds, 1, wav.rate);
  const blob = await write(buffer, type, aac ? { codec: "aac", bitrate } : { codec: wav.codec });
  if (blob.size > MAX_CLIP_BYTES) throw new Error("Clip too large");
  return { blob, type };
}
