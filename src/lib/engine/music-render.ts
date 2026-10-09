/*
 * The invitation's raga as a finished recording (Step 17c): the same score and instruments
 * as the live player, every note written out ahead of time and rendered offline, so a
 * video gets its music without playing a sound. The score is pure and unit tested;
 * renderRaga needs a browser.
 */

import { Score, type MusicChoice, type Strike } from "./music";
import { hall, sound, voiceBuffer } from "./instruments";

export type { Strike } from "./music";

/** Seconds the music takes to rise at the start and to fade at the end. */
export const FADE_IN = 1.5;
export const FADE_OUT = 2.5;

/** Every sound in `seconds` of the raga: the drone, the melody and any drum. */
export function ragaScore(music: MusicChoice, seconds: number): Strike[] {
  return new Score(music).until(seconds);
}

/** Renders `seconds` of the raga to a stereo buffer, fading in and out. */
export async function renderRaga(
  music: MusicChoice,
  seconds: number,
  sampleRate = 48_000,
): Promise<AudioBuffer> {
  const ctx = new OfflineAudioContext(2, Math.ceil(seconds * sampleRate), sampleRate);
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, 0);
  master.gain.linearRampToValueAtTime(0.55, FADE_IN);
  master.gain.setValueAtTime(0.55, Math.max(FADE_IN, seconds - FADE_OUT));
  master.gain.linearRampToValueAtTime(0, seconds);
  master.connect(ctx.destination);

  // The live player's hall and tone, so the video sounds like the invitation
  const bus = ctx.createGain();
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 5200;
  const reverb = ctx.createConvolver();
  reverb.buffer = hall(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.32;
  bus.connect(tone);
  tone.connect(master);
  tone.connect(reverb);
  reverb.connect(wet);
  wet.connect(master);

  const score = new Score(music);
  const buffers = new Map<string, AudioBuffer>();
  for (const strike of score.until(seconds)) {
    const id = `${strike.voice}:${strike.pitch}`;
    let buffer = buffers.get(id);
    if (!buffer) {
      buffer = voiceBuffer(ctx, strike.voice, strike.pitch, score.key);
      buffers.set(id, buffer);
    }
    sound(ctx, bus, buffer, strike, strike.at);
  }
  return ctx.startRendering();
}

/** The host's own clip, looped to fill `seconds` and faded like the raga. */
async function renderClip(url: string, seconds: number, sampleRate: number): Promise<AudioBuffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Clip unavailable");
  const data = await response.arrayBuffer();
  const ctx = new OfflineAudioContext(2, Math.ceil(seconds * sampleRate), sampleRate);
  const clip = await ctx.decodeAudioData(data);
  const master = ctx.createGain();
  master.gain.setValueAtTime(1, 0);
  master.gain.setValueAtTime(1, Math.max(0, seconds - FADE_OUT));
  master.gain.linearRampToValueAtTime(0, seconds);
  master.connect(ctx.destination);
  const source = ctx.createBufferSource();
  source.buffer = clip;
  source.loop = true;
  source.connect(master);
  source.start(0);
  return ctx.startRendering();
}

/** The invite's music as a recording: the host's clip when they chose one, else the raga. */
export async function renderMusic(
  music: MusicChoice,
  seconds: number,
  sampleRate = 48_000,
): Promise<AudioBuffer> {
  if (music.clip) {
    // A clip that won't load still leaves the video with music
    const clip = await renderClip(music.clip, seconds, sampleRate).catch(() => null);
    if (clip) return clip;
  }
  return renderRaga(music, seconds, sampleRate);
}
