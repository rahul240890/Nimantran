import type { FamilyLine } from "@/lib/engine/story";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { TraditionPack, WordingId } from "@/lib/traditions/schema";

/*
 * The family behind the names (Step 12s part 2): each side's parents and home town, a line
 * in memory of late relatives, and whom guests can call. The blessings, hosts, welcome and
 * children's lines stay with the tradition's wording (draft.tradition.wording), so drafts
 * saved before this step keep them; now every card can carry them, pack or not. Kept free
 * of the validator (the schema is in ./draft-checks.ts) so the guest's page stays light.
 */

export const RELATIONS = ["child", "daughter", "son"] as const;
export type Relation = (typeof RELATIONS)[number];

export const FAMILY_MAX = 120;
export const TOWN_MAX = 40;
export const CONTACT_NAME_MAX = 40;
export const PHONE_MAX = 20;
export const MAX_CONTACTS = 2;

export type FamilySide = {
  /** How the name on the card is related to the parents: "son of", "daughter of". */
  relation: Relation;
  /** The parents as the family writes them, honorifics and all: "Smt. Sunita & Shri Ramesh Patel". */
  parents: string;
  town: string;
};
export type FamilyContact = { name: string; phone: string };
export type DraftFamily = {
  /** The family of the first name on the card, then of the second. */
  first: FamilySide;
  second: FamilySide;
  /** Late relatives whose blessings the family remembers; left empty, nothing shows. */
  memory: string;
  contacts: FamilyContact[];
};

export const noSide: FamilySide = { relation: "child", parents: "", town: "" };
export const noFamily: DraftFamily = { first: noSide, second: noSide, memory: "", contacts: [] };

type FamilyWords = {
  /** The line under a name: "Son of Smt. Sunita & Shri Ramesh Patel". */
  relation: Record<Relation, (parents: string) => string>;
  /** Headings for the tradition's wording blocks when the card has no pack of its own. */
  titles: Record<WordingId, string>;
  memory: string;
  contacts: string;
};

/*
 * Written for the first tradition packs; like the packs, they wait for a native speaker's
 * proofread (TRADITIONS.md, section 7). Tamil puts the relation after the parents.
 */
export const FAMILY_WORDS: Record<CardLanguage, FamilyWords> = {
  en: {
    relation: {
      child: (p) => `Child of ${p}`,
      daughter: (p) => `Daughter of ${p}`,
      son: (p) => `Son of ${p}`,
    },
    titles: {
      blessingsFrom: "With the blessings of",
      requesters: "Hosted by",
      welcome: "Waiting to welcome you",
      children: "From the little ones",
    },
    memory: "In loving memory of",
    contacts: "For any help, call",
  },
  hi: {
    relation: {
      child: (p) => `संतान: ${p}`,
      daughter: (p) => `सुपुत्री ${p}`,
      son: (p) => `सुपुत्र ${p}`,
    },
    titles: {
      blessingsFrom: "आशीर्वाद",
      requesters: "निमंत्रक",
      welcome: "स्वागतोत्सुक",
      children: "बाल मनुहार",
    },
    memory: "पुण्य स्मृति",
    contacts: "संपर्क सूत्र",
  },
  mr: {
    relation: {
      child: (p) => `अपत्य: ${p}`,
      daughter: (p) => `कन्या ${p}`,
      son: (p) => `सुपुत्र ${p}`,
    },
    titles: {
      blessingsFrom: "आशीर्वाद",
      requesters: "निमंत्रक",
      welcome: "स्वागतोत्सुक",
      children: "बालगोपाळांचा आग्रह",
    },
    memory: "पुण्यस्मरण",
    contacts: "संपर्क",
  },
  gu: {
    relation: {
      child: (p) => `સંતાન: ${p}`,
      daughter: (p) => `સુપુત્રી ${p}`,
      son: (p) => `સુપુત્ર ${p}`,
    },
    titles: {
      blessingsFrom: "આશીર્વાદ",
      requesters: "નિમંત્રક",
      welcome: "સ્વાગતોત્સુક",
      children: "ટહુકો",
    },
    memory: "પુણ્ય સ્મૃતિ",
    contacts: "સંપર્ક",
  },
  bn: {
    relation: {
      child: (p) => `${p}-এর সন্তান`,
      daughter: (p) => `${p}-এর কন্যা`,
      son: (p) => `${p}-এর পুত্র`,
    },
    titles: {
      blessingsFrom: "আশীর্বাদে",
      requesters: "বিনীত",
      welcome: "সাদর আমন্ত্রণে",
      children: "ছোটদের আবদার",
    },
    memory: "স্মৃতিতে",
    contacts: "যোগাযোগ",
  },
  ta: {
    relation: {
      child: (p) => `${p} அவர்களின் அன்புப் பிள்ளை`,
      daughter: (p) => `${p} அவர்களின் அன்பு மகள்`,
      son: (p) => `${p} அவர்களின் அன்பு மகன்`,
    },
    titles: {
      blessingsFrom: "ஆசீர்வாதத்துடன்",
      requesters: "தங்கள் நல்வரவை விரும்பும்",
      welcome: "வரவேற்பவர்கள்",
      children: "குழந்தைகளின் அழைப்பு",
    },
    memory: "அன்பு நினைவில்",
    contacts: "தொடர்புக்கு",
  },
};

/** The order the family page reads in: blessings first, then each side, then the hosts. */
const BEFORE_SIDES: readonly WordingId[] = ["blessingsFrom"];
const AFTER_SIDES: readonly WordingId[] = ["requesters", "welcome", "children"];

export type FamilyInput = {
  family: DraftFamily;
  /** The tradition's wording blocks as the family wrote them. */
  wording: Partial<Record<WordingId, string>>;
  /** The names on the card in this language, first then second. */
  names: readonly [string, string];
  /** The card's pack: its own headings win on a card in its language. */
  pack: TraditionPack | null;
  language: CardLanguage;
};

/**
 * The family page's labelled blocks in one of the card's languages: the headings and the
 * "son of" words follow the page's language, what the family typed stays as they typed it.
 */
export function familyBlocks({
  family,
  wording,
  names,
  pack,
  language,
}: FamilyInput): (FamilyLine & { id: string })[] {
  const words = FAMILY_WORDS[language];
  const ownPack = pack?.language === language ? pack : null;
  const block = (id: WordingId) => {
    const text = wording[id]?.trim();
    if (!text) return [];
    return [{ id, title: ownPack?.wording[id]?.title ?? words.titles[id], text, lang: language }];
  };
  const side = (key: "first" | "second", name: string) => {
    const { relation, parents, town } = family[key];
    const who = parents.trim();
    if (!who) return [];
    const place = town.trim();
    const text = words.relation[relation](place ? `${who}, ${place}` : who);
    // A card led by one name (a birthday) still names the parents, under that name
    return name.trim() ? [{ id: key, title: name.trim(), text, lang: language }] : [];
  };
  const memory = family.memory.trim();
  const contacts = family.contacts
    .map((c) => [c.name.trim(), c.phone.trim()].filter(Boolean).join(" · "))
    .filter(Boolean);
  return [
    ...BEFORE_SIDES.flatMap(block),
    ...side("first", names[0]),
    ...side("second", names[1]),
    ...(memory ? [{ id: "memory", title: words.memory, text: memory, lang: language }] : []),
    ...AFTER_SIDES.flatMap(block),
    ...(contacts.length > 0
      ? [{ id: "contacts", title: words.contacts, text: contacts.join(", "), lang: language }]
      : []),
  ];
}
