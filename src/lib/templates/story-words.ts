import { uiStrings as hiUi } from "@/content/hi/ui";
import type { StoryWords } from "@/lib/engine/story";
import { uiStrings as enUi } from "@/lib/ui-strings";
import type { CardLanguage } from "./card-languages";

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
