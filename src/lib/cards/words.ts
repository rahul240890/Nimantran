import type { FunctionId } from "@/lib/events/functions";
import type { StoryBeat, StoryLine, StoryWords } from "@/lib/engine/story";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { CardCopy } from "@/lib/templates/content";

/*
 * Save-the-date and thank-you cards (Step 24): one still picture each, in the invitation's
 * own design, to send on WhatsApp before the invitation and after the celebration. The
 * words are the card's language, like the event pages' own (story-words.ts); the note
 * under them is the host's to change. Drafts for a native proofreader.
 */

export const CARD_KINDS = ["save-the-date", "thank-you"] as const;
export type CardKind = (typeof CARD_KINDS)[number];

export function isCardKind(value: unknown): value is CardKind {
  return (CARD_KINDS as readonly unknown[]).includes(value);
}

export type CardNoteWords = {
  /** The thank-you card's heading. */
  thankYou: string;
  /** The save-the-date card's note, until the host writes their own. */
  toFollow: string;
  /** The thank-you card's note, until the host writes their own. */
  thanks: string;
};

export const CARD_NOTE_WORDS: Record<CardLanguage, CardNoteWords> = {
  en: {
    thankYou: "Thank you",
    toFollow: "Invitation to follow",
    thanks: "For your blessings, your love, and for celebrating with us.",
  },
  hi: {
    thankYou: "हार्दिक धन्यवाद",
    toFollow: "निमंत्रण शीघ्र भेजा जाएगा",
    thanks: "आपके आशीर्वाद, आपके स्नेह और हमारे साथ उत्सव मनाने के लिए।",
  },
  mr: {
    thankYou: "मनःपूर्वक धन्यवाद",
    toFollow: "निमंत्रण लवकरच पाठवू",
    thanks: "आपल्या आशीर्वादासाठी, प्रेमासाठी आणि आमच्या आनंदात सहभागी झाल्याबद्दल.",
  },
  gu: {
    thankYou: "હાર્દિક આભાર",
    toFollow: "આમંત્રણ ટૂંક સમયમાં મોકલીશું",
    thanks: "આપના આશીર્વાદ, આપના પ્રેમ અને અમારી ખુશીમાં સામેલ થવા બદલ.",
  },
  bn: {
    thankYou: "আন্তরিক ধন্যবাদ",
    toFollow: "নিমন্ত্রণপত্র শীঘ্রই আসছে",
    thanks: "আপনাদের আশীর্বাদ, ভালোবাসা আর আমাদের আনন্দে সামিল হওয়ার জন্য।",
  },
  ta: {
    thankYou: "மனமார்ந்த நன்றி",
    toFollow: "அழைப்பிதழ் விரைவில் வரும்",
    thanks: "உங்கள் ஆசீர்வாதங்களுக்கும் அன்புக்கும் எங்கள் கொண்டாட்டத்தில் கலந்துகொண்டதற்கும்.",
  },
};

/** The note a card shows until the host writes their own. */
export const defaultNote = (kind: CardKind, words: CardNoteWords) =>
  kind === "save-the-date" ? words.toFollow : words.thanks;

/** Longest note the host can write; the page shrinks the words to fit it. */
export const NOTE_MAX = 140;

const line = (text: string, style: StoryLine["style"]): StoryLine[] =>
  text.trim() ? [{ text: text.trim(), style }] : [];

/** "Aarav & Meera", joined with the card's own "and" when the card joins them with "weds". */
export function signedNames(copy: CardCopy, story: StoryWords): string {
  const joiner = !copy.joiner || copy.joiner === "&" ? "&" : story.and;
  return [copy.first, copy.second]
    .map((name) => name.trim())
    .filter(Boolean)
    .join(` ${joiner} `);
}

/**
 * The card as one of the story's pages, for painted and card-stock designs. The save the
 * date is the cover, with the names in their own lettering; the thank-you is the closing
 * page in its evening light, where the guest was welcomed.
 */
export function cardBeat(
  kind: CardKind,
  copy: CardCopy,
  story: StoryWords,
  words: CardNoteWords,
  note: string,
): StoryBeat {
  if (kind === "save-the-date") {
    const joiner = !copy.second.trim() ? "" : copy.joiner || "&";
    const lines = [
      ...line(story.saveTheDate, "label"),
      ...line(copy.first, "display"),
      ...line(joiner, "joiner"),
      ...line(copy.second, "display"),
      ...line(copy.date, "date"),
      ...line(copy.venue, "venue"),
      ...line(note, "small"),
    ];
    return { id: kind, scene: "cover", lines, symbol: Boolean(copy.symbol), seconds: 60 };
  }
  const lines = [
    ...line(words.thankYou, "display"),
    ...line(note, "body"),
    ...line(signedNames(copy, story), "script"),
  ];
  return { id: kind, scene: "reply", lines, symbol: false, seconds: 60 };
}

/**
 * The card as a Scene design's flying card: the save the date set like a celebration's
 * card (the day, the note, the place), the thank-you like its opening card.
 */
export function cardSceneItem(
  kind: CardKind,
  copy: CardCopy,
  story: StoryWords,
  words: CardNoteWords,
  note: string,
  main: FunctionId,
) {
  if (kind === "save-the-date") {
    return {
      kind: "function" as const,
      fn: {
        kind: main,
        name: story.saveTheDate,
        localName: null,
        date: copy.date,
        time: note.trim(),
        muhurat: null,
        venue: copy.venue,
      },
    };
  }
  return { kind: "line" as const, blessing: words.thankYou, text: note.trim() };
}
