import type { CategoryId } from "@/lib/categories/catalog";
import type { CardLanguage } from "./card-languages";

/*
 * The heading over the photos on the guest page (owner, 2026-11-11: "Photos" read like a
 * folder; it should speak of the people and the occasion). A wedding's photos are the
 * couple's moments together, an engagement's their story so far, an anniversary's the
 * years they have shared, a child's ceremony the little one's sweet moments, and a prayer
 * meet's photos are held in loving memory. Everything else keeps the moments to cherish.
 * In the card's language, like the rest of the themed page; the regional words are drafts
 * for a native proofreader.
 */

export type PhotoMood = "wedding" | "engagement" | "years" | "little" | "remembrance" | "moments";

export type PhotoWords = { label: string; title: string };

const MOODS: Partial<Record<CategoryId, PhotoMood>> = {
  wedding: "wedding",
  "save-the-date": "wedding",
  haldi: "wedding",
  mehendi: "wedding",
  sangeet: "wedding",
  reception: "wedding",
  engagement: "engagement",
  roka: "engagement",
  anniversary: "years",
  "karva-chauth": "years",
  "naming-ceremony": "little",
  annaprashan: "little",
  "thread-ceremony": "little",
  christening: "little",
  "prayer-meet": "remembrance",
};

/** Which words suit the occasion's photos. */
export function photoMood(occasion: CategoryId | undefined): PhotoMood {
  return (occasion && MOODS[occasion]) || "moments";
}

export const PHOTO_WORDS: Record<CardLanguage, Record<PhotoMood, PhotoWords>> = {
  en: {
    wedding: { label: "The couple", title: "Moments together" },
    engagement: { label: "Soon to be wed", title: "Our story so far" },
    years: { label: "Years together", title: "Our memories" },
    little: { label: "Our little one", title: "Sweet moments" },
    remembrance: { label: "In loving memory", title: "Cherished moments" },
    moments: { label: "Memories", title: "Moments to cherish" },
  },
  hi: {
    wedding: { label: "वर-वधू", title: "साथ के पल" },
    engagement: { label: "जल्द ही एक होंगे", title: "हमारी कहानी" },
    years: { label: "साथ के बरस", title: "हमारी यादें" },
    little: { label: "हमारे नन्हे", title: "प्यारे पल" },
    remembrance: { label: "स्नेहिल स्मृति में", title: "अनमोल पल" },
    moments: { label: "यादें", title: "यादगार पल" },
  },
  mr: {
    wedding: { label: "वधू-वर", title: "सोबतचे क्षण" },
    engagement: { label: "लवकरच एक होणार", title: "आमची कहाणी" },
    years: { label: "सहवासाची वर्षे", title: "आमच्या आठवणी" },
    little: { label: "आमचे बाळ", title: "गोड क्षण" },
    remembrance: { label: "प्रेमळ स्मृतीत", title: "अनमोल क्षण" },
    moments: { label: "आठवणी", title: "अविस्मरणीय क्षण" },
  },
  gu: {
    wedding: { label: "વર-કન્યા", title: "સાથેની પળો" },
    engagement: { label: "ટૂંક સમયમાં એક થઈશું", title: "અમારી વાર્તા" },
    years: { label: "સાથનાં વર્ષો", title: "અમારી યાદો" },
    little: { label: "અમારું બાળક", title: "મીઠી પળો" },
    remembrance: { label: "પ્રેમભરી સ્મૃતિમાં", title: "અમૂલ્ય પળો" },
    moments: { label: "યાદો", title: "યાદગાર પળો" },
  },
  bn: {
    wedding: { label: "বর-কনে", title: "একসঙ্গে কাটানো মুহূর্ত" },
    engagement: { label: "শীঘ্রই এক হব", title: "আমাদের গল্প" },
    years: { label: "একসঙ্গে পথচলা", title: "আমাদের স্মৃতি" },
    little: { label: "আমাদের ছোট্ট সোনা", title: "মিষ্টি মুহূর্ত" },
    remembrance: { label: "সস্নেহ স্মৃতিতে", title: "অমূল্য মুহূর্ত" },
    moments: { label: "স্মৃতি", title: "স্মরণীয় মুহূর্ত" },
  },
  ta: {
    wedding: { label: "மணமக்கள்", title: "இணைந்த தருணங்கள்" },
    engagement: { label: "விரைவில் இணைகிறோம்", title: "எங்கள் கதை" },
    years: { label: "இணைந்த ஆண்டுகள்", title: "எங்கள் நினைவுகள்" },
    little: { label: "எங்கள் செல்லம்", title: "இனிய தருணங்கள்" },
    remembrance: { label: "அன்பு நினைவில்", title: "பொன்னான தருணங்கள்" },
    moments: { label: "நினைவுகள்", title: "மறக்க முடியாத தருணங்கள்" },
  },
};

/** The label and heading over the occasion's photos, in the card's language. */
export function photoWords(occasion: CategoryId | undefined, lang: CardLanguage): PhotoWords {
  return PHOTO_WORDS[lang][photoMood(occasion)];
}
