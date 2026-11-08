import type { ScriptLanguage } from "./transliterate";

/*
 * A family line typed in English letters ("Smt. Sunita & Shri Ramesh Patel", "Late Shri
 * Mohanlal Patel", "The Sharma family") written in a card's own script, so a Gujarati card's
 * family page reads wholly in Gujarati (owner, 2026-11-08: English "&", "Shri" and names
 * between the Gujarati headings). The titles and joining words come from each language's
 * own way of writing them (the sample families, lib/sample/families.ts); the names are
 * spelled by the same input tools as the couple's names (./transliterate.ts).
 */

/** Titles and joining words as each language writes them; "" drops the word ("The"). */
const TERMS: Record<ScriptLanguage, Record<string, string>> = {
  hi: {
    smt: "श्रीमती",
    shrimati: "श्रीमती",
    mrs: "श्रीमती",
    shri: "श्री",
    sri: "श्री",
    shree: "श्री",
    mr: "श्री",
    kumari: "सुश्री",
    ms: "सुश्री",
    miss: "सुश्री",
    dr: "डॉ.",
    late: "स्व.",
    lt: "स्व.",
    swargiya: "स्व.",
    sardar: "सरदार",
    sardarni: "सरदारनी",
    begum: "बेगम",
    janab: "जनाब",
    marhoom: "मरहूम",
    "&": "एवं",
    and: "और",
    family: "परिवार",
    families: "परिवार",
    the: "",
  },
  mr: {
    smt: "सौ.",
    shrimati: "सौ.",
    mrs: "सौ.",
    sau: "सौ.",
    shri: "श्री.",
    sri: "श्री.",
    shree: "श्री.",
    mr: "श्री.",
    kumari: "कु.",
    ms: "कु.",
    miss: "कु.",
    dr: "डॉ.",
    late: "कै.",
    lt: "कै.",
    sardar: "सरदार",
    sardarni: "सरदारनी",
    begum: "बेगम",
    janab: "जनाब",
    marhoom: "मरहूम",
    "&": "व",
    and: "आणि",
    family: "परिवार",
    families: "परिवार",
    the: "",
  },
  gu: {
    smt: "શ્રીમતી",
    shrimati: "શ્રીમતી",
    mrs: "શ્રીમતી",
    shri: "શ્રી",
    sri: "શ્રી",
    shree: "શ્રી",
    mr: "શ્રી",
    kumari: "કુ.",
    ms: "કુ.",
    miss: "કુ.",
    dr: "ડૉ.",
    late: "સ્વ.",
    lt: "સ્વ.",
    swargiya: "સ્વ.",
    sardar: "સરદાર",
    sardarni: "સરદારની",
    begum: "બેગમ",
    janab: "જનાબ",
    marhoom: "મરહૂમ",
    "&": "તથા",
    and: "અને",
    family: "પરિવાર",
    families: "પરિવાર",
    the: "",
  },
  bn: {
    smt: "শ্রীমতী",
    shrimati: "শ্রীমতী",
    mrs: "শ্রীমতী",
    shri: "শ্রী",
    sri: "শ্রী",
    shree: "শ্রী",
    mr: "শ্রী",
    kumari: "কুমারী",
    ms: "কুমারী",
    miss: "কুমারী",
    dr: "ডাঃ",
    late: "স্বর্গীয়",
    lt: "স্বর্গীয়",
    swargiya: "স্বর্গীয়",
    sardar: "সর্দার",
    begum: "বেগম",
    janab: "জনাব",
    marhoom: "মরহুম",
    "&": "ও",
    and: "ও",
    family: "পরিবার",
    families: "পরিবার",
    the: "",
  },
  ta: {
    smt: "திருமதி",
    shrimati: "திருமதி",
    mrs: "திருமதி",
    shri: "திரு",
    sri: "திரு",
    shree: "திரு",
    mr: "திரு",
    thiru: "திரு",
    thirumathi: "திருமதி",
    kumari: "செல்வி",
    ms: "செல்வி",
    miss: "செல்வி",
    dr: "டாக்டர்",
    late: "அமரர்",
    lt: "அமரர்",
    sardar: "சர்தார்",
    begum: "பேகம்",
    janab: "ஜனாப்",
    marhoom: "மர்ஹூம்",
    "&": "&",
    and: "மற்றும்",
    family: "குடும்பத்தினர்",
    families: "குடும்பத்தினர்",
    the: "",
  },
};

/** One piece of a family line: kept as it is, or a name to spell in the card's script. */
export type FamilyPiece = { text: string; spell: boolean };

/** At most this many names are spelled in one line, so a request stays small. */
export const FAMILY_WORDS_MAX = 16;

/** True when a family line has English letters the card's script could write. */
export function hasLatin(value: string): boolean {
  return /[A-Za-z]/.test(value);
}

/**
 * A family line in pieces: its titles and joining words already in `language`, the names
 * left to spell, and everything else (commas, spaces, words already in the script) as typed.
 */
export function familyPieces(value: string, language: ScriptLanguage): FamilyPiece[] {
  const terms = TERMS[language];
  const tokens = value.trim().match(/[A-Za-z][A-Za-z.'’-]*|&|[^A-Za-z&]+/g) ?? [];
  return tokens.map((token) => {
    if (token === "&") return { text: terms["&"]!, spell: false };
    if (!/[A-Za-z]/.test(token)) return { text: token, spell: false };
    const term = terms[token.toLowerCase().replace(/\.+$/, "")];
    if (term !== undefined) return { text: term, spell: false };
    return { text: token.replace(/\.+$/, ""), spell: true };
  });
}

/** The pieces back into one line, with a dropped word's space taken out too. */
export function joinPieces(texts: readonly string[]): string {
  return texts
    .join("")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

/**
 * Whole-line choices from each name's spellings (`spell` gives a name's choices, best
 * first): every name's best spelling first, then the next best for each that has one.
 * Nothing when a name has no spelling, so a line is never offered half in English.
 */
export function familyChoices(
  pieces: readonly FamilyPiece[],
  spell: (word: string) => readonly string[],
  count = 3,
): string[] {
  const choices = pieces.map((piece) => (piece.spell ? spell(piece.text) : [piece.text]));
  if (choices.some((options) => options.length === 0)) return [];
  const lines: string[] = [];
  for (let rank = 0; rank < count; rank++) {
    const line = joinPieces(choices.map((options) => options[Math.min(rank, options.length - 1)]!));
    if (line && !lines.includes(line) && !hasLatin(line)) lines.push(line);
  }
  return lines;
}
