/*
 * The invitation's raga as a finished recording (Step 17c): the same tanpura and santoor
 * as the live player, every note written out ahead of time and rendered offline, so a
 * video gets its music without playing a sound. The score is pure and unit tested;
 * renderRaga needs a browser.
 */

import { composePhrase, frequency, PHRASE_BEATS, RAGAS, TANPURA } from "./music";
import { hall, pluck, type MusicChoice } from "./music-player";
import { seededRandom } from "./particles";

export type Strike = {
  pitch: number;
  voice: "santoor" | "tanpura";
  /** Seconds from the start. */
  at: number;
  gain: number;
  pan: number;
};

/** Seconds the music takes to rise at the start and to fade at the end. */
export const FADE_IN = 1.5;
export const FADE_OUT = 2.5;

/** Every string struck in `seconds` of the raga, in time order within each voice. */
export function ragaScore(music: MusicChoice, seconds: number): Strike[] {
  const raga = RAGAS[music.raga];
  const beat = 60 / (music.tempo ?? raga.tempo);
  const random = seededRandom(3);
  const strikes: Strike[] = [];

  for (let i = 0, at = 0.05; at < seconds; i++, at += beat * 1.5) {
    strikes.push({
      pitch: TANPURA[i % TANPURA.length]!,
      voice: "tanpura",
      at,
      gain: 0.34,
      pan: i % 2 ? 0.25 : -0.25,
    });
  }

  let pitch = 0;
  for (let start = 1.2; start < seconds;) {
    const notes = composePhrase(raga, random, pitch);
    for (const note of notes) {
      const at = start + note.beat * beat;
      // Higher notes sit a little to the right, as on a santoor's bridge
      const pan = Math.max(-0.5, Math.min(0.5, (note.pitch - 5) / 24));
      const count = note.tremolo ? 6 : 1;
      for (let i = 0; i < count; i++) {
        const when = at + i * beat * 0.125;
        if (when >= seconds) continue;
        const gain = note.tremolo ? note.velocity * (0.55 + 0.1 * (i % 2)) : note.velocity;
        strikes.push({ pitch: note.pitch, voice: "santoor", at: when, gain, pan });
      }
    }
    pitch = notes.at(-1)?.pitch ?? 0;
    // Every few phrases, leave a bar of drone alone
    const breath = random() < 0.25 ? PHRASE_BEATS : 0;
    start += (PHRASE_BEATS + breath) * beat;
  }
  return strikes;
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

  const buffers = new Map<string, AudioBuffer>();
  for (const strike of ragaScore(music, seconds)) {
    const key = `${strike.voice}:${strike.pitch}`;
    let buffer = buffers.get(key);
    if (!buffer) {
      buffer = pluck(ctx, frequency(strike.pitch), strike.voice, strike.pitch * 7 + 101);
      buffers.set(key, buffer);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const level = ctx.createGain();
    level.gain.value = strike.gain;
    const panner = ctx.createStereoPanner();
    panner.pan.value = strike.pan;
    source.connect(level).connect(panner).connect(bus);
    source.start(strike.at);
  }
  return ctx.startRendering();
}
