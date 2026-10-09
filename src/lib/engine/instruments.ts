/*
 * The instruments, each drawn as numbers into an audio buffer so the whole band fits in a
 * few kilobytes of code. Strings are plucked with the Karplus-Strong method (a burst of
 * noise fed back through a short delay); the winds are read from a one-cycle wave shaped
 * like the instrument's tone, with breath and vibrato; drums are a falling tone and a burst
 * of noise rung through a resonance. Used by both the live player and the video recorder.
 */

import { frequency, type DrumId, type VoiceId } from "./music";
import { seededRandom } from "./particles";

type Strings = "santoor" | "sitar" | "veena" | "tanpura";
type Wind = "bansuri" | "shehnai";

/** How loud each voice sits in the mix, since a held wind carries more than a plucked string. */
export const VOICE_LEVEL: Record<VoiceId, number> = {
  santoor: 1,
  sitar: 0.9,
  veena: 1,
  bansuri: 0.42,
  shehnai: 0.6,
  tanpura: 1,
  bass: 0.85,
  treble: 0.5,
  ghost: 0.5,
  clap: 0.45,
  tak: 0.5,
};

/** Seconds a held wind note can last; its buffer is this long. */
export const WIND_SECONDS = 3.2;
/** How a wind note lets go when its time is up. */
export const WIND_RELEASE = 0.09;

const STRINGS: Record<
  Strings,
  { seconds: number; detune: number[]; decay: number; soft: number; buzz: number }
> = {
  // Two strings a hair apart, struck bright with a hammer
  santoor: { seconds: 2.2, detune: [1, 1.0026], decay: 0.9965, soft: 0, buzz: 0 },
  // One plucked string over a curved bridge, ringing long with a nasal buzz
  sitar: { seconds: 3, detune: [1, 1.0011], decay: 0.9982, soft: 0.15, buzz: 2.6 },
  // Plucked with a fingertip, round and deep, a gentle buzz
  veena: { seconds: 3, detune: [1, 1.0015], decay: 0.9986, soft: 0.45, buzz: 1.6 },
  // The tanpura's single string, plucked softly, singing on its jawari
  tanpura: { seconds: 4.2, detune: [1], decay: 0.9992, soft: 0.6, buzz: 2.2 },
};

function createBuffer(ctx: BaseAudioContext, seconds: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  return { buffer, out: buffer.getChannelData(0), length, rate: ctx.sampleRate };
}

/** Short fade-in removes the click; a fade-out avoids a cut at the buffer's end. */
function fadeEdges(out: Float32Array, rate: number, attack: number, release: number) {
  const a = Math.floor(rate * attack);
  const r = Math.floor(rate * release);
  for (let i = 0; i < a; i++) out[i] = out[i]! * (i / a);
  for (let i = 0; i < r; i++) out[out.length - 1 - i] = out[out.length - 1 - i]! * (i / r);
}

/** One plucked or struck string, rendered into a buffer (exported for tests). */
export function pluck(
  ctx: BaseAudioContext,
  hz: number,
  voice: Strings,
  seed: number,
): AudioBuffer {
  const spec = STRINGS[voice];
  const { buffer, out, length, rate } = createBuffer(ctx, spec.seconds);
  const random = seededRandom(seed);

  for (const detune of spec.detune) {
    const period = Math.max(2, Math.round(rate / (hz * detune)));
    const line = new Float32Array(period);
    let previous = 0;
    for (let i = 0; i < period; i++) {
      // A hammer is bright; a fingertip rounds the burst off
      const noise = random() * 2 - 1;
      previous = previous * spec.soft + noise * (1 - spec.soft);
      line[i] = previous;
    }
    let index = 0;
    let last = 0;
    for (let i = 0; i < length; i++) {
      const current = line[index]!;
      line[index] = spec.decay * 0.5 * (current + last);
      last = current;
      index = (index + 1) % period;
      out[i] = out[i]! + current / spec.detune.length;
    }
  }

  if (voice === "sitar") {
    // The sympathetic strings answer an octave up, quietly, after the pluck
    const period = Math.max(2, Math.round(rate / (hz * 2)));
    const line = Float32Array.from({ length: period }, () => (random() * 2 - 1) * 0.5);
    let index = 0;
    let last = 0;
    for (let i = 0; i < length; i++) {
      const current = line[index]!;
      line[index] = 0.9994 * 0.5 * (current + last);
      last = current;
      index = (index + 1) % period;
      const swell = Math.min(1, i / (rate * 0.25));
      out[i] = out[i]! + current * 0.22 * swell;
    }
  }
  if (spec.buzz > 0) {
    // Jawari: the curved bridge adds a soft, singing buzz
    const level = Math.tanh(spec.buzz);
    for (let i = 0; i < length; i++) out[i] = (Math.tanh(out[i]! * spec.buzz) / level) * 0.6;
  }
  fadeEdges(out, rate, 0.004, 0.4);
  return buffer;
}

/** The loudness of each harmonic in one cycle of a wind's tone. */
function windHarmonics(voice: Wind, hz: number): number[] {
  if (voice === "bansuri") return [1, 0.2, 0.07, 0.025];
  // The shehnai's double reed: many harmonics, strongest where its nasal ring lies
  const ring = (f: number) =>
    0.22 + Math.exp(-(((f - 1300) / 480) ** 2)) + 0.55 * Math.exp(-(((f - 2900) / 650) ** 2));
  const count = Math.max(3, Math.min(16, Math.floor(6000 / hz)));
  return Array.from({ length: count }, (_, i) => ring(hz * (i + 1)) / (i + 1) ** 0.55);
}

const TABLE = 2048;

/**
 * One held wind note, as long as a note can be (the player cuts it to the note's length):
 * a breathy start, a slide up into the note on the shehnai, and vibrato once it settles.
 */
export function blow(ctx: BaseAudioContext, hz: number, voice: Wind, seed: number): AudioBuffer {
  const { buffer, out, length, rate } = createBuffer(ctx, WIND_SECONDS);
  const random = seededRandom(seed);
  const harmonics = windHarmonics(voice, hz);
  const table = new Float32Array(TABLE + 1);
  let peak = 0;
  for (let i = 0; i < TABLE; i++) {
    let value = 0;
    harmonics.forEach((level, h) => {
      value += level * Math.sin((2 * Math.PI * (h + 1) * i) / TABLE + h * 0.7);
    });
    table[i] = value;
    peak = Math.max(peak, Math.abs(value));
  }
  for (let i = 0; i < TABLE; i++) table[i] = table[i]! / peak;
  table[TABLE] = table[0]!;

  const shehnai = voice === "shehnai";
  const vibratoRate = shehnai ? 5.8 : 5;
  const vibratoDepth = shehnai ? 0.007 : 0.004;
  const attack = shehnai ? 0.04 : 0.08;
  let phase = random() * TABLE;
  let breath = 0;
  for (let i = 0; i < length; i++) {
    const t = i / rate;
    // The shehnai slides up into its note from a little below
    const slide = shehnai ? 1 - 0.03 * Math.exp(-t / 0.03) : 1;
    const settle = Math.min(1, Math.max(0, (t - 0.22) / 0.35));
    const vibrato = 1 + vibratoDepth * settle * Math.sin(2 * Math.PI * vibratoRate * t);
    phase = (phase + (TABLE * hz * slide * vibrato) / rate) % TABLE;
    const whole = Math.floor(phase);
    const tone = table[whole]! + (table[whole + 1]! - table[whole]!) * (phase - whole);
    // Breath: soft noise, louder as the note starts
    breath = breath * 0.82 + (random() * 2 - 1) * 0.18;
    const air = breath * (shehnai ? 0.04 : 0.09) * (1 + 3 * Math.exp(-t / 0.06));
    const swell = Math.min(1, t / attack) * (1 - 0.12 * Math.min(1, t / WIND_SECONDS));
    const tremor = shehnai ? 1 + 0.06 * settle * Math.sin(2 * Math.PI * vibratoRate * t) : 1;
    out[i] = (tone * swell * tremor + air) * 0.8;
  }
  fadeEdges(out, rate, 0.003, 0.3);
  return buffer;
}

/** A two-pole resonance: rings a burst of noise at one pitch, as a drum's skin does. */
function resonate(input: Float32Array, rate: number, hz: number, ring: number) {
  const w = (2 * Math.PI * hz) / rate;
  const a1 = 2 * ring * Math.cos(w);
  const a2 = -ring * ring;
  let y1 = 0;
  let y2 = 0;
  const out = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const y = input[i]! + a1 * y1 + a2 * y2;
    out[i] = y;
    y2 = y1;
    y1 = y;
  }
  return out;
}

function normalise(out: Float32Array, to = 0.9) {
  let peak = 0;
  for (const value of out) peak = Math.max(peak, Math.abs(value));
  if (peak > 0) for (let i = 0; i < out.length; i++) out[i] = (out[i]! / peak) * to;
}

/** One drum stroke. `hz` tunes the treble side to the raga's Sa. */
export function drum(ctx: BaseAudioContext, voice: DrumId, hz: number, seed: number): AudioBuffer {
  const seconds = voice === "bass" ? 0.6 : voice === "clap" ? 0.25 : 0.4;
  const { buffer, out, length, rate } = createBuffer(ctx, seconds);
  const random = seededRandom(seed);

  if (voice === "bass") {
    // The big side: a deep tone that drops as the skin settles, with a soft thud
    let phase = 0;
    for (let i = 0; i < length; i++) {
      const t = i / rate;
      phase += (2 * Math.PI * (62 + 58 * Math.exp(-t * 22))) / rate;
      const thud = (random() * 2 - 1) * Math.exp(-t * 180) * 0.3;
      out[i] = Math.sin(phase) * Math.exp(-t * 6.5) + thud;
    }
  } else if (voice === "treble" || voice === "ghost") {
    // The treble side rings at its tuned pitch with the overtones a dholak's skin has
    const partials = [
      [1, 1, 16],
      [2, 0.5, 24],
      [3, 0.32, 30],
      [4.1, 0.14, 38],
    ] as const;
    for (let i = 0; i < length; i++) {
      const t = i / rate;
      let value = 0;
      for (const [ratio, level, fall] of partials) {
        value += level * Math.sin(2 * Math.PI * hz * ratio * t) * Math.exp(-t * fall);
      }
      out[i] = value + (random() * 2 - 1) * Math.exp(-t * 260) * 0.5;
    }
  } else {
    // Claps and the dhol's stick: bursts of noise rung through the hand or the skin
    const burst = new Float32Array(length);
    const onsets = voice === "clap" ? [0, 0.009, 0.019] : [0];
    for (let i = 0; i < length; i++) {
      const t = i / rate;
      let env = 0;
      for (const onset of onsets) if (t >= onset) env += Math.exp(-(t - onset) * 70);
      burst[i] = (random() * 2 - 1) * env;
    }
    const rung =
      voice === "clap" ? resonate(burst, rate, 1450, 0.94) : resonate(burst, rate, 820, 0.985);
    for (let i = 0; i < length; i++) out[i] = rung[i]! * Math.exp(-(i / rate) * 22);
  }
  normalise(out);
  fadeEdges(out, rate, 0.001, Math.min(0.1, seconds / 4));
  return buffer;
}

/** Any voice's sound for one pitch in one key. */
export function voiceBuffer(
  ctx: BaseAudioContext,
  voice: VoiceId,
  pitch: number,
  key: number,
): AudioBuffer {
  const hz = frequency(pitch, key);
  const seed = pitch * 7 + 101;
  switch (voice) {
    case "bansuri":
    case "shehnai":
      return blow(ctx, hz, voice, seed);
    case "bass":
    case "treble":
    case "ghost":
    case "clap":
    case "tak":
      return drum(ctx, voice, hz, seed);
    default:
      return pluck(ctx, hz, voice, seed);
  }
}

/** A soft hall: decaying noise, split into two slightly different ears. */
export function hall(ctx: BaseAudioContext): AudioBuffer {
  const seconds = 2.6;
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    const random = seededRandom(31 + channel);
    for (let i = 0; i < length; i++) {
      data[i] = (random() * 2 - 1) * (1 - i / length) ** 3.2;
    }
  }
  return buffer;
}

/**
 * Plays one strike into `destination` at `when`: a wind holds for its length and lets go,
 * everything else rings out. Shared by the live player and the video recorder.
 */
export function sound(
  ctx: BaseAudioContext,
  destination: AudioNode,
  buffer: AudioBuffer,
  strike: { voice: VoiceId; gain: number; pan: number; length?: number },
  when: number,
) {
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const level = ctx.createGain();
  const gain = strike.gain * VOICE_LEVEL[strike.voice];
  const end = strike.length === undefined ? null : when + Math.max(0.03, strike.length);
  if (end === null) {
    level.gain.value = gain;
  } else {
    level.gain.setValueAtTime(gain, when);
    level.gain.setValueAtTime(gain, end);
    level.gain.linearRampToValueAtTime(0, end + WIND_RELEASE);
  }
  if (ctx.createStereoPanner) {
    const panner = ctx.createStereoPanner();
    panner.pan.value = strike.pan;
    source.connect(level).connect(panner).connect(destination);
  } else {
    // Older Safari has no stereo panner: play it centred
    source.connect(level).connect(destination);
  }
  source.start(when);
  if (end !== null) source.stop(end + WIND_RELEASE + 0.02);
}
