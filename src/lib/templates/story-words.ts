import { uiStrings as hiUi } from "@/content/hi/ui";
import type { StoryWords } from "@/lib/engine/story";
import { uiStrings as enUi } from "@/lib/ui-strings";
import type { CardLanguage } from "./card-languages";
import type { SlotId } from "./ids";

/*
 * The few words the event pages add of their own ("Save the date", "Will you join us?"),
 * in the card's language rather than the site's, so a Gujarati card reads Gujarati on every
 * page. English and Hindi share the site's own strings. Drafts for a native proofreader.
 */
export const CARD_STORY_WORDS: Record<CardLanguage, StoryWords> = {
  en: enUi.storyWords,
  hi: hiUi.storyWords,
  mr: {
    saveTheDate: "तारीख लक्षात ठेवा",
    joinUs: "आपण नक्की याल ना?",
    withLove: "सप्रेम, आपली वाट पाहत आहोत",
    and: "आणि",
  },
  gu: {
    saveTheDate: "તારીખ યાદ રાખજો",
    joinUs: "આપ જરૂર પધારશો ને?",
    withLove: "સપ્રેમ, આપની રાહ જોઈએ છીએ",
    and: "અને",
  },
  bn: {
    saveTheDate: "তারিখটি মনে রাখবেন",
    joinUs: "আপনি আসবেন তো?",
    withLove: "সাদরে, আপনার অপেক্ষায়",
    and: "ও",
  },
  ta: {
    saveTheDate: "தேதியை நினைவில் கொள்ளுங்கள்",
    joinUs: "நீங்கள் வருவீர்களா?",
    withLove: "அன்புடன், உங்கள் வருகைக்காகக் காத்திருக்கிறோம்",
    and: "மற்றும்",
  },
};

/**
 * The wording a card shows before the host types their own, in the card's language: a
 * Gujarati card previews Gujarati names and lines, never the designs' English samples.
 * English cards keep each design's own samples. Drafts for a native proofreader.
 */
export const CARD_SAMPLES: Record<Exclude<CardLanguage, "en">, Partial<Record<SlotId, string>>> = {
  hi: {
    doorLeft: "शुभ",
    doorRight: "विवाह",
    families: "शर्मा परिवार एवं वर्मा परिवार",
    first: "राधा",
    joiner: "संग",
    second: "अर्जुन",
    line: "आपको सपरिवार सादर आमंत्रित करते हैं",
    venue: "होटल ग्रैंड, जयपुर",
  },
  mr: {
    doorLeft: "शुभ",
    doorRight: "विवाह",
    families: "देशपांडे व कुलकर्णी परिवार",
    first: "राधा",
    joiner: "आणि",
    second: "अर्जुन",
    line: "आपणास सहकुटुंब सस्नेह निमंत्रण",
    venue: "शुभमंगल कार्यालय, पुणे",
  },
  gu: {
    doorLeft: "શુભ",
    doorRight: "વિવાહ",
    families: "પટેલ પરિવાર અને શાહ પરિવાર",
    first: "રાધા",
    joiner: "અને",
    second: "અર્જુન",
    line: "આપને સહકુટુંબ પધારવા ભાવભર્યું આમંત્રણ",
    venue: "હોટેલ ગ્રાન્ડ, અમદાવાદ",
  },
  bn: {
    doorLeft: "শুভ",
    doorRight: "বিবাহ",
    families: "বসু ও সেন পরিবার",
    first: "রাধা",
    joiner: "ও",
    second: "অর্জুন",
    line: "আপনাকে সপরিবারে সাদর আমন্ত্রণ জানাই",
    venue: "রাজবাড়ি, কলকাতা",
  },
  ta: {
    doorLeft: "சுப",
    doorRight: "விவாஹம்",
    families: "ஐயர் மற்றும் ராமன் குடும்பத்தினர்",
    first: "ராதா",
    joiner: "&",
    second: "அர்ஜுன்",
    line: "தங்களை அன்புடன் அழைக்கிறோம்",
    venue: "மஹால், சென்னை",
  },
};

/** The date a card shows before the host sets one. */
export const SAMPLE_DATE = "2027-02-14";
