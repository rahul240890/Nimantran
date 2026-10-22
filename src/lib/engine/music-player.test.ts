import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MusicPlayer, type MusicChoice } from "./music-player";

/** Just enough of Web Audio to count the sounds made and the notes started. */
class FakeContext {
  static made: FakeContext[] = [];
  currentTime = 0;
  sampleRate = 8000;
  state: AudioContextState = "suspended";
  destination = {};
  buffersMade = 0;
  notesStarted = 0;
  constructor() {
    FakeContext.made.push(this);
  }
  private node() {
    const param = () => ({
      value: 0,
      cancelScheduledValues() {},
      setValueAtTime() {},
      linearRampToValueAtTime() {},
    });
    const node = {
      gain: param(),
      pan: param(),
      frequency: param(),
      type: "",
      buffer: null as unknown,
      connect: () => node,
      start: () => {
        this.notesStarted += 1;
      },
      stop() {},
    };
    return node;
  }
  createGain = () => this.node();
  createBiquadFilter = () => this.node();
  createConvolver = () => this.node();
  createStereoPanner = () => this.node();
  createBufferSource = () => this.node();
  createBuffer = (_channels: number, length: number) => {
    this.buffersMade += 1;
    const data = new Float32Array(length);
    return { length, sampleRate: this.sampleRate, getChannelData: () => data };
  };
  async resume() {
    this.state = "running";
  }
  async suspend() {
    this.state = "suspended";
  }
  async close() {
    this.state = "closed";
  }
}

const RAGA = { raga: "yaman", tempo: 1 } as unknown as MusicChoice;

describe("MusicPlayer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeContext.made = [];
    vi.stubGlobal("AudioContext", FakeContext);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("writes the raga's first notes at once without a lead", async () => {
    const player = new MusicPlayer(RAGA);
    await player.play();
    const ctx = FakeContext.made[0]!;
    expect(ctx.state).toBe("running");
    expect(ctx.buffersMade).toBeGreaterThan(0);
    player.dispose();
  });

  it("wakes the sound at the tap but makes no notes until the lead is over", async () => {
    const player = new MusicPlayer(RAGA);
    await player.play(1);
    const ctx = FakeContext.made[0]!;
    expect(ctx.state).toBe("running");
    expect(player.isPlaying).toBe(true);
    expect(ctx.buffersMade).toBe(0);
    expect(ctx.notesStarted).toBe(0);

    vi.advanceTimersByTime(999);
    expect(ctx.buffersMade).toBe(0);
    vi.advanceTimersByTime(1);
    expect(ctx.buffersMade).toBeGreaterThan(0);
    player.dispose();
  });

  it("makes nothing when paused before the lead is over", async () => {
    const player = new MusicPlayer(RAGA);
    await player.play(1);
    const ctx = FakeContext.made[0]!;
    player.pause();
    vi.advanceTimersByTime(5000);
    expect(ctx.buffersMade).toBe(0);
    expect(ctx.notesStarted).toBe(0);
    player.dispose();
  });
});
