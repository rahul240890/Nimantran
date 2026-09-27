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

type Samples = Record<Exclude<CardLanguage, "en">, Partial<Record<SlotId, string>>>;

/**
 * Occasions beyond weddings (Step 12p) change the sample's gates, family line and invitation,
 * and a birthday or a party its one name, so a Gujarati birthday card reads as a birthday.
 */
export const CARD_OCCASION_SAMPLES: Partial<Record<"birthday" | "anniversary" | "party", Samples>> =
  {
    birthday: {
      hi: {
        doorLeft: "जन्मदिन",
        doorRight: "मुबारक",
        families: "शर्मा परिवार",
        first: "आरव",
        line: "जन्मदिन की ख़ुशियों में आपको सादर आमंत्रित करते हैं",
      },
      mr: {
        doorLeft: "वाढदिवस",
        doorRight: "शुभेच्छा",
        families: "देशपांडे परिवार",
        first: "आरव",
        line: "वाढदिवसाच्या आनंदात सहभागी होण्यासाठी आपणास आग्रहाचे निमंत्रण",
      },
      gu: {
        doorLeft: "જન્મદિવસ",
        doorRight: "મુબારક",
        families: "પટેલ પરિવાર",
        first: "આરવ",
        line: "જન્મદિવસની ઉજવણીમાં પધારવા ભાવભર્યું આમંત્રણ",
      },
      bn: {
        doorLeft: "শুভ",
        doorRight: "জন্মদিন",
        families: "বসু পরিবার",
        first: "আরভ",
        line: "জন্মদিনের আনন্দে আপনাকে সাদর আমন্ত্রণ জানাই",
      },
      ta: {
        doorLeft: "பிறந்தநாள்",
        doorRight: "வாழ்த்துகள்",
        families: "ஐயர் குடும்பத்தினர்",
        first: "ஆரவ்",
        line: "பிறந்தநாள் கொண்டாட்டத்திற்கு தங்களை அன்புடன் அழைக்கிறோம்",
      },
    },
    anniversary: {
      hi: {
        doorLeft: "शुभ",
        doorRight: "सालगिरह",
        families: "बच्चों और परिवार के साथ",
        line: "शादी की सालगिरह पर आपको सादर आमंत्रित करते हैं",
      },
      mr: {
        doorLeft: "लग्नाचा",
        doorRight: "वाढदिवस",
        families: "मुले व परिवारासह",
        line: "लग्नाच्या वाढदिवसानिमित्त आपणास सस्नेह निमंत्रण",
      },
      gu: {
        doorLeft: "શુભ",
        doorRight: "લગ્નજયંતી",
        families: "બાળકો અને પરિવાર સાથે",
        line: "લગ્નજયંતીની ઉજવણીમાં પધારવા ભાવભર્યું આમંત્રણ",
      },
      bn: {
        doorLeft: "শুভ",
        doorRight: "বিবাহবার্ষিকী",
        families: "সন্তান ও পরিবারের সঙ্গে",
        line: "বিবাহবার্ষিকীর উৎসবে আপনাকে সাদর আমন্ত্রণ জানাই",
      },
      ta: {
        doorLeft: "திருமண",
        doorRight: "நாள்",
        families: "குழந்தைகள் மற்றும் குடும்பத்துடன்",
        line: "திருமண நாள் கொண்டாட்டத்திற்கு தங்களை அன்புடன் அழைக்கிறோம்",
      },
    },
    party: {
      hi: {
        doorLeft: "आप",
        doorRight: "आमंत्रित हैं",
        families: "प्रिया और रोहन",
        first: "दिवाली की रात",
        line: "संगीत, खाने और दोस्तों की शाम में आपका स्वागत है",
      },
      mr: {
        doorLeft: "आपले",
        doorRight: "स्वागत",
        families: "प्रिया आणि रोहन",
        first: "दिवाळी रात्र",
        line: "संगीत, जेवण आणि मित्रांच्या संध्याकाळी आपणास निमंत्रण",
      },
      gu: {
        doorLeft: "આપનું",
        doorRight: "સ્વાગત",
        families: "પ્રિયા અને રોહન",
        first: "દિવાળીની રાત",
        line: "સંગીત, ભોજન અને મિત્રોની સાંજમાં આપનું સ્વાગત છે",
      },
      bn: {
        doorLeft: "আপনাকে",
        doorRight: "স্বাগতম",
        families: "প্রিয়া ও রোহন",
        first: "দীপাবলির রাত",
        line: "গান, খাবার আর বন্ধুদের সন্ধ্যায় আপনাকে আমন্ত্রণ",
      },
      ta: {
        doorLeft: "அன்புடன்",
        doorRight: "வரவேற்கிறோம்",
        families: "பிரியா மற்றும் ரோஹன்",
        first: "தீபாவளி இரவு",
        line: "இசை, உணவு, நண்பர்களுடன் ஒரு மாலைக்கு அழைக்கிறோம்",
      },
    },
  };

/** The date a card shows before the host sets one. */
export const SAMPLE_DATE = "2027-02-14";

export type CountdownWords = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  today: string;
  tomorrow: string;
  inDays: (n: number) => string;
};

/**
 * The countdown on the guest's first screen and the "In 5 days" on each event page, in
 * the card's language like every other word on it. Drafts for a native proofreader.
 */
export const CARD_COUNTDOWN_WORDS: Record<CardLanguage, CountdownWords> = {
  en: {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    today: "Today",
    tomorrow: "Tomorrow",
    inDays: (n) => `In ${n} days`,
  },
  hi: {
    days: "दिन",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
    today: "आज",
    tomorrow: "कल",
    inDays: (n) => `${n} दिन बाद`,
  },
  mr: {
    days: "दिवस",
    hours: "तास",
    minutes: "मिनिटे",
    seconds: "सेकंद",
    today: "आज",
    tomorrow: "उद्या",
    inDays: (n) => `${n} दिवसांनी`,
  },
  gu: {
    days: "દિવસ",
    hours: "કલાક",
    minutes: "મિનિટ",
    seconds: "સેકન્ડ",
    today: "આજે",
    tomorrow: "આવતીકાલે",
    inDays: (n) => `${n} દિવસ બાકી`,
  },
  bn: {
    days: "দিন",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    today: "আজ",
    tomorrow: "আগামীকাল",
    inDays: (n) => `আর ${n} দিন`,
  },
  ta: {
    days: "நாள்",
    hours: "மணி",
    minutes: "நிமிடம்",
    seconds: "விநாடி",
    today: "இன்று",
    tomorrow: "நாளை",
    inDays: (n) => `இன்னும் ${n} நாட்கள்`,
  },
};

/** "In 5 days", "Tomorrow" or "Today" for a date, or "" once it has passed. */
export function daysAway(days: number, words: CountdownWords): string {
  if (days < 0) return "";
  if (days === 0) return words.today;
  if (days === 1) return words.tomorrow;
  return words.inDays(days);
}
