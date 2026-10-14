/*
 * Plays the invitation's music with the Web Audio API: the score (music.ts) written a
 * little ahead of the clock, each strike drawn by its instrument (instruments.ts). A host's
 * own clip plays through an audio element instead, once through: it lasts as long as the
 * invitation and fades out at its end (clip-encode.ts), and it never starts again by
 * itself. Browser only.
 */

import { Score, type MusicChoice, type Strike } from "./music";
import { hall, sound, voiceBuffer } from "./instruments";
import { seededRandom } from "./particles";

export type { MusicChoice } from "./music";

const LOOKAHEAD_S = 0.6;
const TICK_MS = 150;
const VOLUME = 0.55;
/** How long the raga takes to swell to its full volume. */
const FADE_IN_S = 2.5;
/** The host's song is heard at once: it already starts softly (clip-encode.ts). */
const CLIP_FADE_IN_S = 0.8;

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
  /** Counts the clip's volume moves, so only the latest one carries on. */
  private ramps = 0;
  /** Counts the clip's fades, so a fade from before the latest play doesn't stop it. */
  private fades = 0;
  /** A play under way, so a second tap while it starts doesn't start it twice. */
  private starting: Promise<void> | null = null;
  /** How loud, from 0 to 1 of full: softer once the pages are over. */
  private level = 1;
  /** Told when the music stops by itself (the song has reached its end). */
  onEnded: (() => void) | null = null;

  constructor(music: MusicChoice) {
    this.music = music;
  }

  get isPlaying() {
    return this.playing;
  }

  /**
   * Fetches the host's song ahead, so the guest's tap starts it at once rather than after
   * it downloads.
   */
  preload() {
    if (this.music.clip) this.clipElement();
  }

  /**
   * The song from its beginning: at once while it plays (swelling in again), or at the next
   * play. The raga needs nothing: each play begins a fresh phrase.
   */
  rewind() {
    const clip = this.clip;
    if (!clip) return;
    if (this.playing) clip.volume = 0;
    clip.currentTime = 0;
    if (this.playing) this.rampClip(clip, 0, this.level, CLIP_FADE_IN_S);
  }

  /** Turns the music to `level` of its full volume over `fade` seconds, playing on. */
  setLevel(level: number, fade = 1.5) {
    this.level = Math.min(1, Math.max(0, level));
    if (!this.playing) return;
    if (this.clip) {
      this.rampClip(this.clip, this.clip.volume, this.level, fade);
      return;
    }
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(VOLUME * this.level, now + fade);
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
    if (this.starting) return this.starting;
    this.starting = this.start().finally(() => {
      this.starting = null;
    });
    return this.starting;
  }

  private clipElement(): HTMLAudioElement {
    if (!this.clip) {
      const clip = new Audio();
      clip.preload = "auto";
      clip.src = this.music.clip!;
      clip.addEventListener("ended", () => {
        if (this.clip !== clip) return;
        this.playing = false;
        // Heard to its end: the next play starts it again from the beginning
        clip.currentTime = 0;
        this.onEnded?.();
      });
      this.clip = clip;
    }
    return this.clip;
  }

  /** Moves the clip's volume (where the phone lets a page set it) from one level to another. */
  private rampClip(clip: HTMLAudioElement, from: number, to: number, fade: number) {
    const start = performance.now();
    const token = ++this.ramps;
    const step = () => {
      if (!this.playing || this.clip !== clip || this.ramps !== token) return;
      const share = fade <= 0 ? 1 : Math.min(1, (performance.now() - start) / (fade * 1000));
      clip.volume = from + (to - from) * share;
      if (share < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  private async start() {
    if (this.music.clip) {
      const clip = this.clipElement();
      this.fades++;
      clip.volume = 0;
      // Called straight from the tap, before any wait, so the phone lets it play
      await clip.play();
      this.playing = true;
      this.rampClip(clip, 0, this.level, CLIP_FADE_IN_S);
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
    this.master!.gain.linearRampToValueAtTime(VOLUME * this.level, now + FADE_IN_S);
    if (!this.score) this.begin(now);
    this.schedule();
    this.timer = window.setInterval(() => this.schedule(), TICK_MS);
  }

  /** Fades out over `fade` seconds and goes quiet. */
  pause(fade = 0.6) {
    if (!this.playing) return;
    if (this.clip) {
      this.playing = false;
      const clip = this.clip;
      const token = ++this.fades;
      const from = clip.volume;
      const start = performance.now();
      const stop = () => {
        if (this.fades === token && !this.playing) clip.pause();
      };
      const step = () => {
        if (this.fades !== token || this.playing) return;
        const share = fade <= 0 ? 1 : Math.min(1, (performance.now() - start) / (fade * 1000));
        clip.volume = from * (1 - share);
        if (share < 1) requestAnimationFrame(step);
        else stop();
      };
      if (fade <= 0) stop();
      else {
        requestAnimationFrame(step);
        // A hidden tab draws no frames: the song still stops once the fade's time is up
        window.setTimeout(stop, fade * 1000 + 50);
      }
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
