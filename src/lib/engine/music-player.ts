/*
 * Plays the invitation's music with the Web Audio API. Strings are plucked with the
 * Karplus-Strong method (a burst of noise fed back through a short delay), so a whole
 * santoor and tanpura fit in a few kilobytes of code. A host's own clip plays through an
 * audio element instead, looping. Browser only.
 */

import { composePhrase, frequency, PHRASE_BEATS, RAGAS, TANPURA, type Note } from "./music";
import { seededRandom } from "./particles";
import type { Template } from "@/lib/templates/schema";

/** Which raga to play, and at what tempo if not the raga's own. */
export type MusicChoice = Template["music"];

type Voice = "santoor" | "tanpura";

const LOOKAHEAD_S = 0.6;
const TICK_MS = 150;
const VOLUME = 0.55;

/** One plucked or struck string, rendered into a buffer (exported for tests). */
export function pluck(ctx: BaseAudioContext, hz: number, voice: Voice, seed: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const seconds = voice === "tanpura" ? 4.2 : 2.2;
  const length = Math.floor(rate * seconds);
  const buffer = ctx.createBuffer(1, length, rate);
  const out = buffer.getChannelData(0);
  const random = seededRandom(seed);

  // A santoor note rings on two strings a hair apart; the tanpura's single string buzzes
  const strings = voice === "santoor" ? [1, 1.0026] : [1];
  const decay = voice === "tanpura" ? 0.9992 : 0.9965;
  for (const detune of strings) {
    const period = Math.max(2, Math.round(rate / (hz * detune)));
    const line = new Float32Array(period);
    let previous = 0;
    for (let i = 0; i < period; i++) {
      // The santoor's hammer is bright; the tanpura is plucked softly with a fingertip
      const noise = random() * 2 - 1;
      previous = voice === "tanpura" ? previous * 0.6 + noise * 0.4 : noise;
      line[i] = previous;
    }
    let index = 0;
    let last = 0;
    for (let i = 0; i < length; i++) {
      const current = line[index]!;
      const next = decay * 0.5 * (current + last);
      last = current;
      line[index] = next;
      index = (index + 1) % period;
      out[i] = out[i]! + current / strings.length;
    }
  }

  if (voice === "tanpura") {
    // Jawari: the curved bridge adds a soft, singing buzz
    for (let i = 0; i < length; i++) out[i] = Math.tanh(out[i]! * 2.2) * 0.6;
  }
  // Short fade-in removes the click; long fade-out avoids a cut at the buffer's end
  const attack = Math.floor(rate * 0.004);
  const release = Math.floor(rate * 0.4);
  for (let i = 0; i < attack; i++) out[i] = out[i]! * (i / attack);
  for (let i = 0; i < release; i++) out[length - 1 - i] = out[length - 1 - i]! * (i / release);
  return buffer;
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

export class MusicPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private timer = 0;
  private nextPhrase = 0;
  private nextDrone = 0;
  private droneIndex = 0;
  private pitch = 0;
  private random = seededRandom(3);
  private playing = false;
  private music: MusicChoice;
  /** The host's own clip, while one is the track. */
  private clip: HTMLAudioElement | null = null;

  constructor(music: MusicChoice) {
    this.music = music;
  }

  get isPlaying() {
    return this.playing;
  }

  setTrack(music: MusicChoice) {
    const switching = (music.clip ?? null) !== (this.music.clip ?? null);
    const resume = switching && this.playing;
    if (resume) this.pause();
    if (switching) this.dropClip();
    this.music = music;
    this.pitch = 0;
    // Swapping between the raga and a clip carries on playing the new one
    if (resume) void this.play().catch(() => undefined);
  }

  /** Starts or resumes the music. Must be called from a tap or key press. */
  async play() {
    if (this.playing) return;
    if (this.music.clip) {
      if (!this.clip) {
        const clip = new Audio();
        clip.loop = true;
        clip.preload = "auto";
        clip.src = this.music.clip;
        this.clip = clip;
      }
      await this.clip.play();
      this.playing = true;
      return;
    }
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio is not available");

    if (!this.ctx) {
      const ctx = new AudioContextClass({ latencyHint: "playback" });
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // Dry sound plus a soft hall, gently rolled off at the top
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

      this.ctx = ctx;
      this.master = master;
      this.bus = bus;
    }

    const ctx = this.ctx;
    await ctx.resume();
    this.playing = true;
    const now = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(VOLUME, now + 2.5);
    this.nextPhrase = Math.max(this.nextPhrase, now + 1.2);
    this.nextDrone = Math.max(this.nextDrone, now + 0.05);
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), TICK_MS);
  }

  /** Fades out and goes quiet. */
  pause() {
    if (!this.playing) return;
    if (this.clip) {
      this.playing = false;
      this.clip.pause();
      return;
    }
    if (!this.ctx || !this.master) return;
    this.playing = false;
    window.clearInterval(this.timer);
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 0.6);
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (!this.playing) void ctx.suspend();
    }, 700);
    // Pick up with a fresh phrase next time rather than notes queued long ago
    this.nextPhrase = 0;
    this.nextDrone = 0;
  }

  dispose() {
    window.clearInterval(this.timer);
    this.playing = false;
    this.dropClip();
    void this.ctx?.close();
    this.ctx = null;
    this.buffers.clear();
  }

  private dropClip() {
    if (!this.clip) return;
    this.clip.pause();
    this.clip.removeAttribute("src");
    this.clip.load();
    this.clip = null;
  }

  private buffer(pitch: number, voice: Voice): AudioBuffer {
    const key = `${voice}:${pitch}`;
    let buffer = this.buffers.get(key);
    if (!buffer) {
      buffer = pluck(this.ctx!, frequency(pitch), voice, pitch * 7 + 101);
      this.buffers.set(key, buffer);
    }
    return buffer;
  }

  private strike(pitch: number, voice: Voice, at: number, gain: number, pan = 0) {
    const ctx = this.ctx!;
    const source = ctx.createBufferSource();
    source.buffer = this.buffer(pitch, voice);
    const level = ctx.createGain();
    level.gain.value = gain;
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      source.connect(level).connect(panner).connect(this.bus!);
    } else {
      // Older Safari has no stereo panner: play it centred
      source.connect(level).connect(this.bus!);
    }
    source.start(at);
  }

  private playNote(note: Note, start: number, beat: number) {
    const at = start + note.beat * beat;
    // Higher notes sit a little to the right, as on a santoor's bridge
    const pan = Math.max(-0.5, Math.min(0.5, (note.pitch - 5) / 24));
    if (note.tremolo) {
      const strikes = 6;
      for (let i = 0; i < strikes; i++) {
        this.strike(
          note.pitch,
          "santoor",
          at + i * beat * 0.125,
          note.velocity * (0.55 + 0.1 * (i % 2)),
          pan,
        );
      }
    } else {
      this.strike(note.pitch, "santoor", at, note.velocity, pan);
    }
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    const horizon = ctx.currentTime + LOOKAHEAD_S;
    const raga = RAGAS[this.music.raga];
    const beat = 60 / (this.music.tempo ?? raga.tempo);

    while (this.nextDrone < horizon) {
      const pitch = TANPURA[this.droneIndex % TANPURA.length]!;
      this.strike(pitch, "tanpura", this.nextDrone, 0.34, this.droneIndex % 2 ? 0.25 : -0.25);
      this.droneIndex += 1;
      this.nextDrone += beat * 1.5;
    }

    while (this.nextPhrase < horizon) {
      const notes = composePhrase(raga, this.random, this.pitch);
      for (const note of notes) this.playNote(note, this.nextPhrase, beat);
      this.pitch = notes.at(-1)?.pitch ?? 0;
      // Every few phrases, leave a bar of drone alone
      const breath = this.random() < 0.25 ? PHRASE_BEATS : 0;
      this.nextPhrase += (PHRASE_BEATS + breath) * beat;
    }
  }
}
