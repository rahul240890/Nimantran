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
} from "./music";
import { pluck } from "./music-player";
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
