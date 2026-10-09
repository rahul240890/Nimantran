import { describe, expect, it } from "vitest";
import {
  composePhrase,
  frequency,
  HIGHEST,
  LOWEST,
  moveInRaga,
  PHRASE_BEATS,
  RAGAS,
  SA,
  Score,
} from "./music";
import { pluck, voiceBuffer } from "./instruments";
import { seededRandom } from "./particles";

const inScale = (scale: number[], pitch: number) => scale.includes(((pitch % 12) + 12) % 12);

describe("moveInRaga", () => {
  it("walks the raga's own notes", () => {
    expect(moveInRaga(RAGAS.bhupali, 0, 1)).toBe(2);
    expect(moveInRaga(RAGAS.bhupali, 4, 1)).toBe(7); // skips Ma
    expect(moveInRaga(RAGAS.bhupali, 0, -1)).toBe(-3); // lower Dha
    expect(moveInRaga(RAGAS.yaman, 4, 1)).toBe(6); // sharp Ma
  });

  it("uses different notes going up and coming down in Desh", () => {
    expect(moveInRaga(RAGAS.desh, 7, 1)).toBe(11); // plain Ni going up
    expect(moveInRaga(RAGAS.desh, 12, -1)).toBe(10); // soft Ni coming down
  });

  it("stays in range at the edges", () => {
    expect(moveInRaga(RAGAS.yaman, HIGHEST, 2)).toBeLessThanOrEqual(HIGHEST);
    expect(moveInRaga(RAGAS.yaman, LOWEST, -2)).toBeGreaterThanOrEqual(LOWEST);
  });
});

describe("composePhrase", () => {
  it.each(Object.entries(RAGAS))(
    "keeps %s phrases in the raga, in range, and in time",
    (_, raga) => {
      const random = seededRandom(9);
      let from = 0;
      for (let phrase = 0; phrase < 60; phrase++) {
        const notes = composePhrase(raga, random, from);
        expect(notes.length).toBeGreaterThan(3);
        for (const note of notes) {
          expect(inScale([...raga.up, ...raga.down], note.pitch)).toBe(true);
          expect(note.pitch).toBeGreaterThanOrEqual(LOWEST);
          expect(note.pitch).toBeLessThanOrEqual(HIGHEST);
          expect(note.beat).toBeLessThan(PHRASE_BEATS);
          expect(note.velocity).toBeGreaterThan(0);
          expect(note.velocity).toBeLessThanOrEqual(1);
        }
        const last = notes.at(-1)!;
        // Each phrase comes to rest on one of the raga's resting notes
        expect(raga.rest.map((n) => ((n % 12) + 12) % 12)).toContain(((last.pitch % 12) + 12) % 12);
        from = last.pitch;
      }
    },
  );
});

describe("frequency", () => {
  it("doubles every octave from Sa", () => {
    expect(frequency(0)).toBeCloseTo(SA);
    expect(frequency(12)).toBeCloseTo(SA * 2);
    expect(frequency(7)).toBeCloseTo(SA * 1.4983, 2); // Pa, a perfect fifth
  });
});

describe("pluck", () => {
  // A stand-in for an AudioContext: only buffers are needed
  const context = {
    sampleRate: 22050,
    createBuffer: (_channels: number, length: number, sampleRate: number) => {
      const data = new Float32Array(length);
      return { length, sampleRate, getChannelData: () => data };
    },
  } as unknown as BaseAudioContext;

  it.each(["santoor", "tanpura"] as const)(
    "makes a %s note that rings and dies away cleanly",
    (voice) => {
      const buffer = pluck(context, frequency(0), voice, 1);
      const data = buffer.getChannelData(0);
      const peak = (from: number, to: number) => {
        let max = 0;
        for (let i = from; i < to; i++) max = Math.max(max, Math.abs(data[i]!));
        return max;
      };
      expect(data.every(Number.isFinite)).toBe(true);
      expect(peak(0, data.length)).toBeLessThanOrEqual(1);
      const early = peak(0, 2000);
      const late = peak(data.length - 3000, data.length);
      expect(early).toBeGreaterThan(0.05);
      expect(late).toBeLessThan(early / 4);
      expect(Math.abs(data[data.length - 1]!)).toBeLessThan(0.001);
    },
  );
});

describe("score", () => {
  it("plays each raga on its own instrument, in its own key", () => {
    const leads = new Set(Object.values(RAGAS).map((raga) => raga.lead));
    expect(leads.size).toBeGreaterThanOrEqual(5);
    const sounds = new Set(
      Object.values(RAGAS).map((raga) => `${raga.lead}:${raga.key}:${raga.taal}`),
    );
    expect(sounds.size).toBe(Object.keys(RAGAS).length);
  });

  it("brings the drum in after the first phrase and keeps it in time", () => {
    const strikes = new Score({ raga: "kafi" }).until(30);
    const drums = strikes.filter((s) =>
      ["bass", "treble", "ghost", "clap", "tak"].includes(s.voice),
    );
    expect(drums.length).toBeGreaterThan(20);
    const beat = 60 / RAGAS.kafi.tempo;
    expect(Math.min(...drums.map((s) => s.at))).toBeGreaterThan(1.2 + PHRASE_BEATS * beat - 0.02);
    expect(Math.max(...strikes.map((s) => s.at))).toBeLessThan(30);
  });

  it("leaves a quiet raga without a drum, and holds a wind's notes", () => {
    const strikes = new Score({ raga: "yaman" }).until(20);
    expect(strikes.some((s) => s.voice === "bass")).toBe(false);
    const flute = strikes.filter((s) => s.voice === "bansuri");
    expect(flute.length).toBeGreaterThan(10);
    expect(flute.every((s) => s.length! > 0)).toBe(true);
  });

  it("lets a design swap the instrument and the drum", () => {
    const strikes = new Score({ raga: "yaman", lead: "sitar", taal: "garba" }).until(20);
    expect(strikes.some((s) => s.voice === "sitar")).toBe(true);
    expect(strikes.some((s) => s.voice === "clap")).toBe(true);
    expect(strikes.some((s) => s.voice === "bansuri")).toBe(false);
  });

  it("writes the same music asked for all at once or a little at a time", () => {
    const whole = new Score({ raga: "pilu" }).until(20);
    const live = new Score({ raga: "pilu" });
    const parts = [];
    for (let t = 0.6; t <= 20; t += 0.6) parts.push(...live.until(t));
    parts.push(...live.until(20));
    const order = (list: typeof whole) => list.map((s) => `${s.voice}@${s.at.toFixed(4)}`).sort();
    expect(order(parts)).toEqual(order(whole));
  });
});

describe("instruments", () => {
  const context = {
    sampleRate: 22050,
    createBuffer: (_channels: number, length: number, sampleRate: number) => {
      const data = new Float32Array(length);
      return { length, sampleRate, getChannelData: () => data };
    },
  } as unknown as BaseAudioContext;

  it.each([
    "santoor",
    "sitar",
    "veena",
    "bansuri",
    "shehnai",
    "bass",
    "treble",
    "clap",
    "tak",
  ] as const)("draws a clean %s", (voice) => {
    const data = voiceBuffer(context, voice, 12, 2).getChannelData(0);
    expect(data.every(Number.isFinite)).toBe(true);
    let peak = 0;
    for (const value of data) peak = Math.max(peak, Math.abs(value));
    expect(peak).toBeGreaterThan(0.05);
    expect(peak).toBeLessThanOrEqual(1.2);
    expect(Math.abs(data[data.length - 1]!)).toBeLessThan(0.001);
  });
});
