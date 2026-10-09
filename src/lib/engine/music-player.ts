/*
 * Plays the invitation's music with the Web Audio API: the score (music.ts) written a
 * little ahead of the clock, each strike drawn by its instrument (instruments.ts). A host's
 * own clip plays through an audio element instead, looping. Browser only.
 */

import { Score, type MusicChoice, type Strike } from "./music";
import { hall, sound, voiceBuffer } from "./instruments";
import { seededRandom } from "./particles";

export type { MusicChoice } from "./music";

const LOOKAHEAD_S = 0.6;
const TICK_MS = 150;
const VOLUME = 0.55;

export class MusicPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private timer = 0;
  /** The score being played, and the clock time its start fell on. */
  private score: Score | null = null;
  private origin = 0;
  /** How far ahead the score has been handed to the speakers. */
  private written = 0;
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
    // Another raga carries on from where the last one was written up to
    if (this.score) this.begin(this.written);
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
    if (!this.score) this.begin(now);
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), TICK_MS);
  }

  /** Fades out over `fade` seconds and goes quiet. */
  pause(fade = 0.6) {
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
    this.master.gain.linearRampToValueAtTime(0, now + fade);
    const ctx = this.ctx;
    window.setTimeout(
      () => {
        if (!this.playing) void ctx.suspend();
      },
      fade * 1000 + 100,
    );
    // Pick up with a fresh phrase next time rather than notes queued long ago
    this.score = null;
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

  /** Starts the score afresh at clock time `at`. */
  private begin(at: number) {
    this.score = new Score(this.music, this.random);
    this.origin = at;
    this.written = at;
  }

  private buffer(strike: Strike, key: number): AudioBuffer {
    const id = `${strike.voice}:${strike.pitch}:${key}`;
    let buffer = this.buffers.get(id);
    if (!buffer) {
      buffer = voiceBuffer(this.ctx!, strike.voice, strike.pitch, key);
      this.buffers.set(id, buffer);
    }
    return buffer;
  }

  private schedule() {
    const ctx = this.ctx;
    const score = this.score;
    if (!ctx || !score || !this.playing) return;
    const horizon = ctx.currentTime + LOOKAHEAD_S;
    for (const strike of score.until(horizon - this.origin)) {
      sound(ctx, this.bus!, this.buffer(strike, score.key), strike, this.origin + strike.at);
    }
    this.written = Math.max(this.written, horizon);
  }
}
