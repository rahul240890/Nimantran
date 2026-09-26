/*
 * The invitation's music, composed live: a tanpura drone under a santoor-like melody that
 * wanders through a raga. Nothing is downloaded, so music costs no data on slow networks.
 * This file holds the composition (pure and unit tested); music-player.ts makes the sound.
 */

import type { MusicTrackId } from "./themes";

export type Raga = {
  name: string;
  /** Semitones above Sa used going up. */
  up: number[];
  /** Semitones above Sa used coming down. */
  down: number[];
  /** Notes phrases like to come to rest on. */
  rest: number[];
  /** Beats per minute. */
  tempo: number;
};

export const RAGAS: Record<MusicTrackId, Raga> = {
  // Evening, romantic: every note natural except the sharp Ma
  yaman: {
    name: "Yaman",
    up: [0, 2, 4, 6, 7, 9, 11],
    down: [0, 2, 4, 6, 7, 9, 11],
    rest: [4, 11, 0, 7],
    tempo: 68,
  },
  // Bright and joyful: five notes, no Ma or Ni (Mohanam in the south)
  bhupali: {
    name: "Bhupali",
    up: [0, 2, 4, 7, 9],
    down: [0, 2, 4, 7, 9],
    rest: [4, 9, 0, 7],
    tempo: 76,
  },
  // Monsoon longing: plain Ni going up, soft Ni and Ga coming down
  desh: {
    name: "Desh",
    up: [0, 2, 5, 7, 11],
    down: [0, 2, 4, 5, 7, 9, 10],
    rest: [2, 7, 0, 5],
    tempo: 64,
  },
};

export type Note = {
  /** Start, in beats from the phrase's start. */
  beat: number;
  /** Semitones from middle Sa; negative is the lower octave. */
  pitch: number;
  /** Length in beats. */
  length: number;
  /** A quick run of repeated strikes, the santoor's signature. */
  tremolo: boolean;
  /** Loudness, 0 to 1. */
  velocity: number;
};

export const PHRASE_BEATS = 8;
/** The melody stays between the lower Pa and the upper Ga. */
export const LOWEST = -5;
export const HIGHEST = 16;

/** Every pitch of the raga in range, in order, for one direction. */
function ladder(scale: number[]): number[] {
  const pitches: number[] = [];
  for (let octave = -12; octave <= 12; octave += 12) {
    for (const note of scale) {
      const pitch = note + octave;
      if (pitch >= LOWEST && pitch <= HIGHEST) pitches.push(pitch);
    }
  }
  return pitches.sort((a, b) => a - b);
}

/** Moves `steps` notes up or down the raga from `from`, using its up or down notes. */
export function moveInRaga(raga: Raga, from: number, steps: number): number {
  const notes = ladder(steps > 0 ? raga.up : raga.down);
  let index = notes.findIndex((pitch) => (steps > 0 ? pitch > from : pitch >= from));
  if (index === -1) index = notes.length;
  if (steps > 0) index += steps - 1;
  else index += steps;
  return notes[Math.max(0, Math.min(notes.length - 1, index))]!;
}

const RHYTHMS = [
  [1, 1, 0.5, 0.5, 1, 2, 2],
  [0.5, 0.5, 1, 1, 1, 2, 2],
  [1.5, 0.5, 1, 1, 2, 2],
  [1, 0.5, 0.5, 2, 1, 1, 2],
];

/**
 * One eight-beat phrase: a stepwise walk that leans back toward the middle of the range,
 * comes to rest on one of the raga's resting notes, and leaves the last beats to breathe.
 */
export function composePhrase(raga: Raga, random: () => number, from = 0): Note[] {
  const rhythm = RHYTHMS[Math.floor(random() * RHYTHMS.length)]!;
  const notes: Note[] = [];
  let beat = 0;
  let pitch = from;

  rhythm.forEach((length, index) => {
    const last = index === rhythm.length - 1;
    if (last) {
      // Resolve to the resting note nearest where the melody is
      pitch = raga.rest.reduce((best, note) => {
        const candidates = [note - 12, note, note + 12].filter((p) => p >= LOWEST && p <= HIGHEST);
        const closest = candidates.reduce((a, b) =>
          Math.abs(b - pitch) < Math.abs(a - pitch) ? b : a,
        );
        return Math.abs(closest - pitch) < Math.abs(best - pitch) ? closest : best;
      }, raga.rest[0]!);
    } else if (index > 0) {
      const pull = pitch > 9 ? 0.35 : pitch < 0 ? 0.65 : 0.5;
      const direction = random() < pull ? 1 : -1;
      const size = random() < 0.78 ? 1 : 2;
      pitch = moveInRaga(raga, pitch, direction * size);
    }
    notes.push({
      beat,
      pitch,
      length,
      tremolo: length >= 2 && random() < 0.4,
      velocity: 0.55 + random() * 0.35 - (last ? 0.1 : 0),
    });
    beat += length;
  });

  return notes.filter((note) => note.beat < PHRASE_BEATS);
}

/** Middle Sa, in hertz (D3, a comfortable shehnai and santoor key). */
export const SA = 146.83;

export function frequency(pitch: number): number {
  return SA * 2 ** (pitch / 12);
}

/** The tanpura's four strings in one cycle: Pa, Sa, Sa, and the low Sa. */
export const TANPURA = [-5, 0, 0, -12] as const;
