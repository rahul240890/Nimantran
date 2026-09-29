import { guestCopy as hiGuest } from "@/content/hi/publish";
import { guestCopy as enGuest } from "@/content/publish";
import type { CardLanguage } from "./card-languages";
import { CARD_STORY_WORDS } from "./story-words";

/*
 * The words the themed guest page below the painted pages (Step 12q) prints of its own, in
 * the card's language rather than the site's, like CARD_STORY_WORDS for the pages above: a
 * Hindi card reads Hindi all the way down. Buttons and the reply form stay in the site's
 * language, as the pages' own reply button does. English and Hindi share the site's
 * strings; the others are drafts for a native proofreader.
 */
export type ThemedWords = {
  invitedTo: string;
  saveDateLabel: string;
  saveDate: string;
  eventsLabel: string;
  celebrations: string;
  photosLabel: string;
  photos: string;
  familyLabel: string;
  family: string;
  blessingLabel: string;
  replyLabel: string;
  joinUs: string;
  closing: string;
};

type SiteWords = {
  functions: string;
  photos: string;
  family: string;
  themed: {
    invitedTo: string;
    saveDateLabel: string;
    eventsLabel: string;
    photosLabel: string;
    familyLabel: string;
    blessingLabel: string;
    replyLabel: string;
    closing: string;
  };
};

const fromSite = (site: SiteWords, language: "en" | "hi"): ThemedWords => ({
  invitedTo: site.themed.invitedTo,
  saveDateLabel: site.themed.saveDateLabel,
  saveDate: CARD_STORY_WORDS[language].saveTheDate,
  eventsLabel: site.themed.eventsLabel,
  celebrations: site.functions,
  photosLabel: site.themed.photosLabel,
  photos: site.photos,
  familyLabel: site.themed.familyLabel,
  family: site.family,
  blessingLabel: site.themed.blessingLabel,
  replyLabel: site.themed.replyLabel,
  joinUs: CARD_STORY_WORDS[language].joinUs,
  closing: site.themed.closing,
});

export const CARD_THEMED_WORDS: Record<CardLanguage, ThemedWords> = {
  en: fromSite(enGuest, "en"),
  hi: fromSite(hiGuest, "hi"),
  mr: {
    invitedTo: "आपणास सस्नेह आमंत्रण",
    saveDateLabel: "दिनदर्शिकेत नोंद करा",
    saveDate: CARD_STORY_WORDS.mr.saveTheDate,
    eventsLabel: "सकाळपासून रात्रीपर्यंत",
    celebrations: "सोहळे",
    photosLabel: "आठवणी",
    photos: "छायाचित्रे",
    familyLabel: "सोबत",
    family: "कुटुंबाकडून प्रेमपूर्वक",
    blessingLabel: "वडीलधाऱ्यांच्या आशीर्वादाने",
    replyLabel: "आपले उत्तर",
    joinUs: CARD_STORY_WORDS.mr.joinUs,
    closing:
      "आपली उपस्थिती हीच आमच्यासाठी सर्वात मोठी भेट. आपल्यासोबत आनंद साजरा करण्याची वाट पाहत आहोत.",
  },
  gu: {
    invitedTo: "આપને સ્નેહભર્યું આમંત્રણ",
    saveDateLabel: "કેલેન્ડરમાં નોંધી લેજો",
    saveDate: CARD_STORY_WORDS.gu.saveTheDate,
    eventsLabel: "સવારથી રાત સુધી",
    celebrations: "પ્રસંગો",
    photosLabel: "યાદો",
    photos: "તસવીરો",
    familyLabel: "સાથે",
    family: "પરિવાર તરફથી પ્રેમપૂર્વક",
    blessingLabel: "વડીલોના આશીર્વાદથી",
    replyLabel: "આપનો જવાબ",
    joinUs: CARD_STORY_WORDS.gu.joinUs,
    closing: "આપની હાજરી જ અમારા માટે સૌથી મોટી ભેટ છે. આપની સાથે ઉજવણી કરવા આતુર છીએ.",
  },
  bn: {
    invitedTo: "আপনাকে সাদর আমন্ত্রণ",
    saveDateLabel: "ক্যালেন্ডারে লিখে রাখুন",
    saveDate: CARD_STORY_WORDS.bn.saveTheDate,
    eventsLabel: "সকাল থেকে রাত",
    celebrations: "অনুষ্ঠানসূচি",
    photosLabel: "স্মৃতি",
    photos: "ছবি",
    familyLabel: "সঙ্গে",
    family: "পরিবারের পক্ষ থেকে সস্নেহে",
    blessingLabel: "গুরুজনদের আশীর্বাদে",
    replyLabel: "আপনার উত্তর",
    joinUs: CARD_STORY_WORDS.bn.joinUs,
    closing:
      "আপনার উপস্থিতিই আমাদের সবচেয়ে বড় উপহার। আপনার সঙ্গে আনন্দ ভাগ করে নেওয়ার অপেক্ষায় রইলাম।",
  },
  ta: {
    invitedTo: "தங்களை அன்புடன் அழைக்கிறோம்",
    saveDateLabel: "நாட்காட்டியில் குறித்துக்கொள்ளுங்கள்",
    saveDate: CARD_STORY_WORDS.ta.saveTheDate,
    eventsLabel: "காலை முதல் இரவு வரை",
    celebrations: "விழாக்கள்",
    photosLabel: "நினைவுகள்",
    photos: "புகைப்படங்கள்",
    familyLabel: "உடன்",
    family: "குடும்பத்தினரின் அன்புடன்",
    blessingLabel: "பெரியோர்களின் ஆசியுடன்",
    replyLabel: "உங்கள் பதில்",
    joinUs: CARD_STORY_WORDS.ta.joinUs,
    closing: "தங்கள் வருகையே எங்களுக்குச் சிறந்த பரிசு. தங்களுடன் கொண்டாடக் காத்திருக்கிறோம்.",
  },
};

/** The month's name in the card's language ("November", "नवंबर", "नोव्हेंबर"). */
export function cardMonth(date: string, language: CardLanguage): string {
  const [year, month] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(`${language}-IN`, { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year!, month! - 1, 1)),
  );
}
