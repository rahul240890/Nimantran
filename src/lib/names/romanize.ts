/*
 * Names in an Indian script, written in English letters (owner, 2026-10-24: a couple who
 * typed their names in Hindi got no link of their own when publishing, and had to make one
 * up). Only for the invitation's link, so it aims at the spelling families use for names
 * ("राहुल" → "rahul", "লক্ষ্মী" → "lakshmi", "செந்தில்" → "senthil"), not at scholarly
 * transliteration. The Brahmic scripts share one layout within their Unicode blocks, so one
 * table serves Devanagari, Bengali, Gurmukhi, Gujarati, Odia, Tamil, Telugu, Kannada and
 * Malayalam, with each script's own few differences. Anything else passes through as it is.
 */

type Script =
  | "devanagari"
  | "bengali"
  | "gurmukhi"
  | "gujarati"
  | "odia"
  | "tamil"
  | "telugu"
  | "kannada"
  | "malayalam";

/** Each script's block, from its first code point. */
const BLOCKS: readonly [number, Script][] = [
  [0x0900, "devanagari"],
  [0x0980, "bengali"],
  [0x0a00, "gurmukhi"],
  [0x0a80, "gujarati"],
  [0x0b00, "odia"],
  [0x0b80, "tamil"],
  [0x0c00, "telugu"],
  [0x0c80, "kannada"],
  [0x0d00, "malayalam"],
];

/** Scripts whose last consonant in a name is said without its "a": राम is "ram". */
const SILENT_FINAL_A: ReadonlySet<Script> = new Set([
  "devanagari",
  "bengali",
  "gurmukhi",
  "gujarati",
  "odia",
]);

/** Vowels written on their own, by their place in the block. */
const VOWELS: Record<number, string> = {
  0x04: "a",
  0x05: "a",
  0x06: "aa",
  0x07: "i",
  0x08: "i",
  0x09: "u",
  0x0a: "u",
  0x0b: "ri",
  0x0c: "li",
  0x0d: "e",
  0x0e: "e",
  0x0f: "e",
  0x10: "ai",
  0x11: "o",
  0x12: "o",
  0x13: "o",
  0x14: "au",
  0x60: "ri",
  0x61: "li",
};

/** Vowel signs on a consonant. The long i and u read "ee" and "oo" inside a name. */
const SIGNS: Record<number, string> = {
  0x3e: "a",
  0x3f: "i",
  0x40: "ee",
  0x41: "u",
  0x42: "oo",
  0x43: "ri",
  0x44: "ri",
  0x45: "e",
  0x46: "e",
  0x47: "e",
  0x48: "ai",
  0x49: "o",
  0x4a: "o",
  0x4b: "o",
  0x4c: "au",
  0x62: "li",
  0x63: "li",
};

const CONSONANTS: Record<number, string> = {
  0x15: "k",
  0x16: "kh",
  0x17: "g",
  0x18: "gh",
  0x19: "n",
  0x1a: "ch",
  0x1b: "chh",
  0x1c: "j",
  0x1d: "jh",
  0x1e: "n",
  0x1f: "t",
  0x20: "th",
  0x21: "d",
  0x22: "dh",
  0x23: "n",
  0x24: "t",
  0x25: "th",
  0x26: "d",
  0x27: "dh",
  0x28: "n",
  0x29: "n",
  0x2a: "p",
  0x2b: "ph",
  0x2c: "b",
  0x2d: "bh",
  0x2e: "m",
  0x2f: "y",
  0x30: "r",
  0x31: "r",
  0x32: "l",
  0x33: "l",
  0x34: "zh",
  0x35: "v",
  0x36: "sh",
  0x37: "sh",
  0x38: "s",
  0x39: "h",
  // With a dot below, as Urdu and Persian names are written
  0x58: "q",
  0x59: "kh",
  0x5a: "g",
  0x5b: "z",
  0x5c: "r",
  0x5d: "rh",
  0x5e: "f",
  0x5f: "y",
};

/** What a dot below (nukta) makes of a consonant. */
const NUKTA: Record<number, string> = {
  0x15: "q",
  0x1c: "z",
  0x21: "r",
  0x22: "rh",
  0x2b: "f",
  0x2f: "y",
};

/** Each script's own readings, where it differs from the rest. */
const OWN: Partial<Record<Script, Record<number, string>>> = {
  // Bengali য is said "j"; য় is the y
  bengali: { 0x2f: "j" },
  // Tamil names write த as "th" (Senthil, Muthu)
  tamil: { 0x24: "th" },
};

const VIRAMA = 0x4d;
const NUKTA_SIGN = 0x3c;
const LABIALS = new Set(["p", "ph", "b", "bh", "m"]);
/** Consonants a cluster can end on and still keep its "a" at a name's end. */
const SOFT_ENDINGS = new Set(["r", "y", "l", "v", "n", "m"]);

function scriptOf(code: number): [Script, number] | null {
  for (const [start, script] of BLOCKS) {
    if (code >= start && code < start + 0x80) return [script, code - start];
  }
  return null;
}

/** One sound of a word: a consonant with the vowel it carries, or a vowel of its own. */
type Unit = {
  consonant: string;
  vowel: string;
  /** The vowel is the consonant's own "a", nothing written. */
  inherent: boolean;
  /** Joined to the consonant before it (a conjunct, as in कृष्ण). */
  joined: boolean;
  /** Ends on a nasal or breath mark, which closes the syllable (अंजलि is "anjali"). */
  closed?: boolean;
};

/** The units of one word in one script, read in order. */
function readWord(codes: number[], script: Script): Unit[] {
  const units: Unit[] = [];
  const own = OWN[script] ?? {};
  let joinNext = false;
  let doubleNext = false;
  for (let i = 0; i < codes.length; i++) {
    const at = codes[i]!;
    const last = units[units.length - 1];
    const consonant = own[at] ?? CONSONANTS[at];
    if (consonant !== undefined && !(at in VOWELS)) {
      let sound = consonant;
      // Tamil ச begins a name as "s" (Saravanan, Selvi) and is "ch" inside it
      if (script === "tamil" && at === 0x1a) sound = units.length === 0 ? "s" : "ch";
      // ज्ञ is said "gy" (Gyan)
      if (at === 0x1e && last?.consonant === "j" && joinNext) {
        last.consonant = "gy";
        last.vowel = "a";
        last.inherent = true;
        joinNext = false;
        continue;
      }
      if (doubleNext) sound = sound[0] + sound;
      units.push({ consonant: sound, vowel: "a", inherent: true, joined: joinNext });
      joinNext = false;
      doubleNext = false;
    } else if (at === NUKTA_SIGN) {
      const before = codes[i - 1];
      if (last && before !== undefined && NUKTA[before]) last.consonant = NUKTA[before]!;
    } else if (at === VIRAMA) {
      if (last) {
        last.vowel = "";
        last.inherent = false;
        joinNext = true;
      }
    } else if (SIGNS[at] !== undefined && last && last.inherent) {
      last.vowel = SIGNS[at]!;
      last.inherent = false;
    } else if (VOWELS[at] !== undefined) {
      units.push({ consonant: "", vowel: VOWELS[at]!, inherent: false, joined: false });
    } else if (at === 0x01 || at === 0x02 || (script === "gurmukhi" && at === 0x70)) {
      // The nasal mark: "m" before p, b and m (Sambhav), else "n" (Chandan)
      const next = codes[i + 1];
      const nextSound = next === undefined ? undefined : (own[next] ?? CONSONANTS[next]);
      const nasal = nextSound && LABIALS.has(nextSound) ? "m" : "n";
      if (last) {
        last.vowel += nasal;
        last.inherent = false;
        last.closed = true;
      } else units.push({ consonant: "", vowel: nasal, inherent: false, joined: false });
    } else if (at === 0x03) {
      if (last) {
        last.vowel += "h";
        last.inherent = false;
        last.closed = true;
      }
    } else if (script === "gurmukhi" && at === 0x71) {
      // Addak doubles the consonant after it
      doubleNext = true;
    } else if (script === "bengali" && at === 0x4e) {
      // Bengali ৎ, a t with no vowel of its own
      units.push({ consonant: "t", vowel: "", inherent: false, joined: false });
    } else if (script === "malayalam" && at >= 0x7a && at <= 0x7f) {
      // Malayalam's final consonants (chillu)
      const chillu = ["n", "n", "r", "l", "l", "k"][at - 0x7a]!;
      units.push({ consonant: chillu, vowel: "", inherent: false, joined: false });
    } else if (at >= 0x66 && at <= 0x6f) {
      units.push({ consonant: "", vowel: String(at - 0x66), inherent: false, joined: false });
    }
  }
  return units;
}

/** Whether a consonant's own "a" may go silent: it begins no cluster and stands between
 * a sounded syllable and one that follows with a vowel (हरजीत is "harjeet"). */
function silent(units: Unit[], i: number): boolean {
  const unit = units[i]!;
  const before = units[i - 1];
  if (!unit.inherent || unit.joined || unit.consonant === "") return false;
  if (!before || before.vowel === "" || before.closed) return false;
  // The next syllable, past any consonants joined into a cluster with it
  let next = i + 1;
  while (units[next] && units[next]!.vowel === "" && units[next + 1]?.joined) next++;
  return !!units[next] && units[next]!.vowel !== "" && units[next]!.consonant !== "";
}

/** One word in English letters, with the way names end in its script. */
function spellWord(units: Unit[], script: Script): string {
  const last = units[units.length - 1];
  if (last) {
    // A name ends on "i" and "u", not "ee" and "oo" (Lakshmi, Raju)
    if (last.vowel === "ee") last.vowel = "i";
    if (last.vowel === "oo") last.vowel = "u";
  }
  if (last && SILENT_FINAL_A.has(script)) {
    const sounded = units.filter((unit) => unit.vowel !== "").length;
    // After a cluster it stays only where the cluster ends softly: मिश्र, कृष्ण, आदित्य
    const kept = last.joined && SOFT_ENDINGS.has(last.consonant);
    if (last.inherent && !kept && last.consonant !== "" && sounded > 1) last.vowel = "";
    // Then inside the word, from the end, as Hindi drops it: कमला is "kamla"
    for (let i = units.length - 2; i > 0; i--) {
      if (silent(units, i)) units[i]!.vowel = "";
    }
  }
  const word = units.map((unit) => unit.consonant + unit.vowel).join("");
  // Tamil writes a doubled த as "th" once (Muthu, Karthik)
  return script === "tamil" ? word.replaceAll("thth", "th") : word;
}

/** Writes any Indian-script words in `text` in English letters; the rest stays as it is. */
export function romanize(text: string): string {
  let out = "";
  let word: number[] = [];
  let wordScript: Script | null = null;
  const flush = () => {
    if (wordScript && word.length) out += spellWord(readWord(word, wordScript), wordScript);
    word = [];
    wordScript = null;
  };
  for (const char of text) {
    const code = char.codePointAt(0)!;
    const found = scriptOf(code);
    // The danda ends a sentence in every one of these scripts
    if (found && found[1] !== 0x64 && found[1] !== 0x65) {
      const [script, offset] = found;
      if (wordScript && wordScript !== script) flush();
      wordScript = script;
      word.push(offset);
    } else {
      flush();
      // Zero-width joiners only shape the letters; they say nothing
      if (char !== "‌" && char !== "‍") out += found ? " " : char;
    }
  }
  flush();
  return out;
}
