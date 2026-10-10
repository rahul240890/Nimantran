/*
 * The invitation's music, composed live: a tanpura drone under a melody that wanders
 * through a raga, played on the raga's own instrument and in its own key, with a dholak or
 * dhol under the festive ones. Nothing is downloaded, so music costs no data on slow
 * networks. This file holds the composition (pure and unit tested); instruments.ts makes
 * the sounds, music-player.ts plays them live and music-render.ts records them for videos.
 */

import type { LeadId, RagaId, TaalId } from "@/lib/templates/ids";
import type { Template } from "@/lib/templates/schema";
import { seededRandom } from "./particles";

/** Which raga to play, and how, where the design differs from the raga's own. */
export type MusicChoice = Template["music"];

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
  /** The instrument that plays the melody. */
  lead: LeadId;
  /** Semitones above D for Sa, so ragas don't all sit in one key. */
  key: number;
  /** The drum pattern under the melody, or none for a quiet raga. */
  taal: TaalId | null;
};

export const RAGAS: Record<RagaId, Raga> = {
  // Evening, romantic: every note natural except the sharp Ma
  yaman: {
    name: "Yaman",
    up: [0, 2, 4, 6, 7, 9, 11],
    down: [0, 2, 4, 6, 7, 9, 11],
    rest: [4, 11, 0, 7],
    tempo: 68,
    lead: "bansuri",
    key: 2,
    taal: null,
  },
  // Light and romantic, a thumri favourite: plain Ni going up, soft Ni coming down
  khamaj: {
    name: "Khamaj",
    up: [0, 4, 5, 7, 9, 11],
    down: [0, 2, 4, 5, 7, 9, 10],
    rest: [4, 9, 0, 7],
    tempo: 70,
    lead: "sitar",
    key: 0,
    taal: "keherwa",
  },
  // Late evening, a wedding raga: no Re or Dha going up, both coming down
  bihag: {
    name: "Bihag",
    up: [0, 4, 5, 7, 11],
    down: [0, 2, 4, 5, 7, 9, 11],
    rest: [4, 11, 0, 7],
    tempo: 62,
    lead: "shehnai",
    key: -1,
    taal: null,
  },
  // Auspicious, sung to close a Carnatic concert: Sa Ri Ma Pa and a soft Ni
  madhyamavati: {
    name: "Madhyamavati",
    up: [0, 2, 5, 7, 10],
    down: [0, 2, 5, 7, 10],
    rest: [2, 7, 0, 5],
    tempo: 72,
    lead: "veena",
    key: 2,
    taal: null,
  },
  // Bright and joyful: five notes, no Ma or Ni (Mohanam in the south)
  bhupali: {
    name: "Bhupali",
    up: [0, 2, 4, 7, 9],
    down: [0, 2, 4, 7, 9],
    rest: [4, 9, 0, 7],
    tempo: 76,
    lead: "santoor",
    key: 1,
    taal: "keherwa",
  },
  // Monsoon longing: plain Ni going up, soft Ni and Ga coming down
  desh: {
    name: "Desh",
    up: [0, 2, 5, 7, 11],
    down: [0, 2, 4, 5, 7, 9, 10],
    rest: [2, 7, 0, 5],
    tempo: 64,
    lead: "santoor",
    key: 3,
    taal: "dadra",
  },
  // Rajasthan's folk raga, the tune of "Kesariya Balam": all natural notes, sung in leaps
  mand: {
    name: "Mand",
    up: [0, 4, 5, 7, 9, 11],
    down: [0, 2, 4, 5, 7, 9, 11],
    rest: [4, 7, 0, 9],
    tempo: 74,
    lead: "shehnai",
    key: 0,
    taal: "dadra",
  },
  // Afternoon, warm and devotional: soft Ga and Ni, no Re or Dha going up
  bhimpalasi: {
    name: "Bhimpalasi",
    up: [0, 3, 5, 7, 10],
    down: [0, 2, 3, 5, 7, 9, 10],
    rest: [3, 7, 0, 5],
    tempo: 64,
    lead: "sitar",
    key: -2,
    taal: null,
  },
  // Light and folk-bright, beloved in Gujarat: soft Ga, both Ni
  pilu: {
    name: "Pilu",
    up: [0, 3, 5, 7, 11],
    down: [0, 2, 3, 5, 7, 9, 10],
    rest: [3, 7, 0, 5],
    tempo: 78,
    lead: "santoor",
    key: 2,
    taal: "garba",
  },
  // Tender and devotional, the raga of farewells: every note soft but Sa, Ma and Pa
  bhairavi: {
    name: "Bhairavi",
    up: [0, 1, 3, 5, 7, 8, 10],
    down: [0, 1, 3, 5, 7, 8, 10],
    rest: [3, 7, 0, 5],
    tempo: 60,
    lead: "bansuri",
    key: -1,
    taal: null,
  },
  // Carnatic and auspicious, sung to Ganapati first: Sa Ri Ga Pa Ni
  hamsadhwani: {
    name: "Hamsadhwani",
    up: [0, 2, 4, 7, 11],
    down: [0, 2, 4, 7, 11],
    rest: [4, 11, 0, 7],
    tempo: 76,
    lead: "shehnai",
    key: 3,
    taal: "keherwa",
  },
  // Folk and festive, the colour of Holi and Punjabi songs: soft Ga and Ni
  kafi: {
    name: "Kafi",
    up: [0, 2, 3, 5, 7, 9, 10],
    down: [0, 2, 3, 5, 7, 9, 10],
    rest: [3, 7, 0, 5],
    tempo: 80,
    lead: "sitar",
    key: 2,
    taal: "bhangra",
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

/** A pitch's frequency, `key` semitones above D for Sa. */
export function frequency(pitch: number, key = 0): number {
  return SA * 2 ** ((pitch + key) / 12);
}

/** The tanpura's four strings in one cycle: Pa, Sa, Sa, and the low Sa. */
export const TANPURA = [-5, 0, 0, -12] as const;

/** The strikes on a drum: the bass side, the treble side (soft), hand claps, the dhol's stick. */
export type DrumId = "bass" | "treble" | "ghost" | "clap" | "tak";
export type VoiceId = LeadId | "tanpura" | DrumId;

/**
 * Each taal as half-beat steps; a step's letters are what sounds on it (B bass, T treble,
 * t soft treble, C clap, K the dhol's stick) and "." is a rest.
 */
export const TAALS: Record<TaalId, string[]> = {
  // Dha Ge Na Ti Na Ka Dhi Na: the dholak's eight beats, under most light songs
  keherwa: "BT . B t T . t . T . t t BT . T .".split(" "),
  // Dha Dhi Na, Dha Ti Na: six beats with a lilt, for folk songs
  dadra: "BT . BT . T . B . t . T t".split(" "),
  // Three, three and two, with the dancers' claps
  garba: "BC . . TC . . BT . BC . . TC . . T t".split(" "),
  // The Punjabi dhol's chaal, the big side and the stick
  bhangra: "B . K K . K B . B . K K . K B K".split(" "),
};

const DRUM_LETTERS: Record<string, DrumId> = {
  B: "bass",
  T: "treble",
  t: "ghost",
  C: "clap",
  K: "tak",
};

/** How loud each drum strike is, before the drum's own level. */
const DRUM_GAIN: Record<DrumId, number> = {
  bass: 0.62,
  treble: 0.5,
  ghost: 0.26,
  clap: 0.42,
  tak: 0.5,
};

/** Winds sound an octave above the plucked strings, where a bansuri and a shehnai sing. */
export const LEAD_OCTAVE: Record<LeadId, number> = {
  santoor: 0,
  sitar: 0,
  veena: 0,
  bansuri: 12,
  shehnai: 12,
};

/** Held notes for the winds; struck strings for the rest. */
export function isWind(lead: LeadId): boolean {
  return lead === "bansuri" || lead === "shehnai";
}

/** A sound in the score: what plays, when (seconds from its start), how loud and where. */
export type Strike = {
  voice: VoiceId;
  /** Semitones from middle Sa, key aside. */
  pitch: number;
  at: number;
  gain: number;
  pan: number;
  /** How long a wind holds its note, in seconds; strings and drums ring out. */
  length?: number;
};

/** The raga with the design's own instrument, drum and tempo laid over it. */
export function arrangement(music: Pick<MusicChoice, "raga" | "tempo" | "lead" | "taal">) {
  const raga = RAGAS[music.raga];
  return {
    raga,
    lead: music.lead ?? raga.lead,
    taal: music.taal === undefined ? raga.taal : music.taal,
    key: raga.key,
    beat: 60 / (music.tempo ?? raga.tempo),
  };
}

/** When the melody comes in, after the drone has sounded. */
const MELODY_START = 1.2;

/**
 * The music written out as it goes: ask for everything up to a time and it composes as far
 * as that. The live player asks a little ahead of the clock; a video asks for all of it.
 */
export class Score {
  private readonly plan: ReturnType<typeof arrangement>;
  private drone = { at: 0.05, index: 0 };
  private melody = { at: MELODY_START, pitch: 0 };
  private drums = { at: 0, step: 0 };
  private pending: Strike[] = [];
  private readonly feel = seededRandom(5);

  constructor(
    music: Pick<MusicChoice, "raga" | "tempo" | "lead" | "taal">,
    private readonly random: () => number = seededRandom(3),
  ) {
    this.plan = arrangement(music);
    // The drum comes in after the first phrase, once the raga has been heard alone
    this.drums.at = MELODY_START + PHRASE_BEATS * this.plan.beat;
  }

  get key() {
    return this.plan.key;
  }

  /** Every strike that starts before `seconds` and hasn't been handed out yet. */
  until(seconds: number): Strike[] {
    const { raga, beat, taal } = this.plan;
    const out: Strike[] = [];

    while (this.drone.at < seconds) {
      const { index } = this.drone;
      out.push({
        voice: "tanpura",
        pitch: TANPURA[index % TANPURA.length]!,
        at: this.drone.at,
        gain: 0.34,
        pan: index % 2 ? 0.25 : -0.25,
      });
      this.drone = { at: this.drone.at + beat * 1.5, index: index + 1 };
    }

    while (this.melody.at < seconds) {
      const notes = composePhrase(raga, this.random, this.melody.pitch);
      for (const note of notes) this.pending.push(...this.play(note, this.melody.at));
      // Every few phrases, leave a bar of drone alone
      const breath = this.random() < 0.25 ? PHRASE_BEATS : 0;
      this.melody = {
        at: this.melody.at + (PHRASE_BEATS + breath) * beat,
        pitch: notes.at(-1)?.pitch ?? 0,
      };
    }

    if (taal) {
      const steps = TAALS[taal];
      while (this.drums.at < seconds) {
        const step = steps[this.drums.step % steps.length]!;
        for (const letter of step) {
          const drum = DRUM_LETTERS[letter];
          if (!drum) continue;
          this.pending.push({
            voice: drum,
            // The treble side is tuned to Sa, as a dholak is
            pitch: 12,
            // A hand never strikes twice the same
            at: this.drums.at + (this.feel() - 0.5) * 0.012,
            gain: DRUM_GAIN[drum] * (0.85 + this.feel() * 0.3),
            pan: drum === "bass" ? -0.1 : drum === "clap" ? 0.2 : 0.1,
          });
        }
        this.drums = { at: this.drums.at + beat / 2, step: this.drums.step + 1 };
      }
    }

    const ready = this.pending.filter((strike) => strike.at < seconds);
    this.pending = this.pending.filter((strike) => strike.at >= seconds);
    return out.concat(ready).map((strike) => ({ ...strike, at: Math.max(0, strike.at) }));
  }

  /** One note of the melody on the lead instrument. */
  private play(note: Note, start: number): Strike[] {
    const { raga, beat, lead } = this.plan;
    const at = start + note.beat * beat;
    const pitch = note.pitch + LEAD_OCTAVE[lead];
    // Higher notes sit a little to the right, as on a santoor's bridge
    const pan = Math.max(-0.5, Math.min(0.5, (note.pitch - 5) / 24));

    if (isWind(lead)) {
      const length = Math.min(2.8, note.length * beat * 0.96);
      if (!note.tremolo) return [{ voice: lead, pitch, at, gain: note.velocity, pan, length }];
      // A wind's flourish is a kan: a touch of the note above before it settles
      const grace = moveInRaga(raga, note.pitch, 1) + LEAD_OCTAVE[lead];
      const touch = Math.min(0.07, length / 3);
      return [
        { voice: lead, pitch: grace, at, gain: note.velocity * 0.7, pan, length: touch },
        { voice: lead, pitch, at: at + touch, gain: note.velocity, pan, length: length - touch },
      ];
    }

    if (!note.tremolo) return [{ voice: lead, pitch, at, gain: note.velocity, pan }];
    // The santoor's quick run of strikes; a sitar or veena's slower jhala
    const strikes = lead === "santoor" ? 6 : 4;
    const gap = lead === "santoor" ? 0.125 : 0.25;
    return Array.from({ length: strikes }, (_, i) => ({
      voice: lead,
      pitch,
      at: at + i * beat * gap,
      gain: note.velocity * (0.55 + 0.1 * (i % 2)),
      pan,
    }));
  }
}
