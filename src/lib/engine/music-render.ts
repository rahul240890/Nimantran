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

/**
 * The song a video was to play couldn't be fetched or read. A video then fails instead of
 * quietly playing the raga in its place (owner, 2026-11-08: a client's video came out
 * without the song chosen for it), so the host knows to try again.
 */
export class SongUnavailable extends Error {
  constructor(cause?: unknown) {
    super("The song couldn't be loaded", { cause });
    this.name = "SongUnavailable";
  }
}

/** The song's file, fetched afresh: tried twice, as a phone's connection can drop once. */
async function fetchSong(url: string): Promise<ArrayBuffer> {
  let failure: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) return await response.arrayBuffer();
      failure = new Error(`Song answered ${response.status}`);
    } catch (error) {
      failure = error;
    }
  }
  throw failure;
}

/** The host's own clip, looped to fill `seconds` and faded like the raga. */
async function renderClip(url: string, seconds: number, sampleRate: number): Promise<AudioBuffer> {
  const data = await fetchSong(url);
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

/**
 * The invite's music as a recording: the song when there is one (the host's own, or the
 * flute), else the raga. A song that won't load rejects with SongUnavailable.
 */
export async function renderMusic(
  music: MusicChoice,
  seconds: number,
  sampleRate = 48_000,
): Promise<AudioBuffer> {
  if (music.clip) {
    try {
      return await renderClip(music.clip, seconds, sampleRate);
    } catch (error) {
      console.warn("The video's song couldn't be loaded", error);
      throw new SongUnavailable(error);
    }
  }
  return renderRaga(music, seconds, sampleRate);
}
