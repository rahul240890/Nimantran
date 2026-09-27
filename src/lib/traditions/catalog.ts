import type { Category } from "@/lib/categories/schema";
import type { RankContext } from "@/lib/categories/rank";
import { TRADITION_IDS, type TraditionId, type TraditionPack } from "./schema";

/*
 * The first seven packs (TRADITIONS.md, section 4.1 to 4.6, plus Modern). All are drafts:
 * invocations, ceremony names and wording still need community reviewers and a native
 * proofreader before launch. Names and meanings in the site's languages live in
 * src/content/traditions.ts.
 */

const GANESHA_DEVANAGARI = { script: "॥ श्री गणेशाय नमः ॥", latin: "Shri Ganeshaya Namah" };

const HINDI_WORDING = {
  blessingsFrom: { title: "आशीर्वाद", example: "श्रीमती कमला देवी एवं श्री रामप्रसाद शर्मा" },
  requesters: { title: "दर्शनाभिलाषी", example: "समस्त शर्मा परिवार" },
  welcome: { title: "स्वागतोत्सुक", example: "राहुल, प्रिया, अंकित" },
  children: { title: "बाल मनुहार", example: "मेरे चाचू की शादी में ज़रूर आना" },
} as const;

export const TRADITIONS: Record<TraditionId, TraditionPack> = {
  "north-hindu": {
    id: "north-hindu",
    community: "hindu",
    regions: ["DL", "UP", "HR", "MP", "BR", "UT", "HP", "JH", "CH"],
    language: "hi",
    nativeName: "उत्तर भारतीय",
    invocation: GANESHA_DEVANAGARI,
    symbols: { default: "kalash", options: ["kalash", "om", "swastik", "diya"] },
    templates: ["rangmahal", "marigold", "emerald", "scroll"],
    ceremonies: {
      roka: { native: "रोका", latin: "Roka" },
      engagement: { native: "सगाई", latin: "Sagai" },
      haldi: { native: "हल्दी", latin: "Haldi" },
      mehendi: { native: "मेहंदी", latin: "Mehendi" },
      sangeet: { native: "संगीत", latin: "Sangeet" },
      wedding: { native: "शुभ विवाह", latin: "Shubh Vivah" },
      reception: { native: "आशीर्वाद समारोह", latin: "Ashirwad Samaroh" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "शुभ मुहूर्त", latin: "Shubh Muhurat" },
    wording: HINDI_WORDING,
    doors: ["Shubh", "Vivah"],
    status: "draft",
    reviewedBy: [],
  },
  rajasthani: {
    id: "rajasthani",
    community: "hindu",
    regions: ["RJ"],
    language: "hi",
    nativeName: "राजस्थानी",
    invocation: GANESHA_DEVANAGARI,
    symbols: { default: "kalash", options: ["kalash", "swastik", "om", "diya"] },
    templates: ["rangmahal", "scroll", "marigold"],
    ceremonies: {
      roka: { native: "रोका", latin: "Roka" },
      engagement: { native: "सगाई", latin: "Sagai" },
      haldi: { native: "पीठी", latin: "Pithi" },
      mehendi: { native: "मेहंदी", latin: "Mehendi" },
      sangeet: { native: "महिला संगीत", latin: "Mahila Sangeet" },
      wedding: { native: "शुभ विवाह", latin: "Shubh Vivah" },
      reception: { native: "प्रीतिभोज", latin: "Preetibhoj" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "शुभ मुहूर्त", latin: "Shubh Muhurat" },
    wording: HINDI_WORDING,
    doors: ["Shubh", "Vivah"],
    status: "draft",
    reviewedBy: [],
  },
  marathi: {
    id: "marathi",
    community: "hindu",
    regions: ["MH", "GA"],
    language: "mr",
    nativeName: "मराठी",
    invocation: GANESHA_DEVANAGARI,
    symbols: { default: "kalash", options: ["kalash", "swastik", "om", "diya"] },
    templates: ["paithani", "marigold", "emerald"],
    ceremonies: {
      engagement: { native: "साखरपुडा", latin: "Sakharpuda" },
      haldi: { native: "हळद", latin: "Halad" },
      mehendi: { native: "मेहंदी", latin: "Mehendi" },
      sangeet: { native: "संगीत", latin: "Sangeet" },
      wedding: { native: "शुभविवाह", latin: "Shubhvivah" },
      reception: { native: "स्वागत समारंभ", latin: "Swagat Samarambh" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "शुभमुहूर्त", latin: "Shubh Muhurta" },
    wording: {
      blessingsFrom: { title: "आशीर्वाद", example: "श्रीमती सुमन व श्री विठ्ठल देशमुख" },
      requesters: { title: "निमंत्रक", example: "समस्त देशमुख परिवार" },
      welcome: { title: "स्वागतोत्सुक", example: "अमित, स्नेहा, रोहन" },
    },
    doors: ["Shubh", "Mangal"],
    status: "draft",
    reviewedBy: [],
  },
  gujarati: {
    id: "gujarati",
    community: "hindu",
    regions: ["GJ", "DH"],
    language: "gu",
    nativeName: "ગુજરાતી",
    invocation: { script: "॥ શ્રી ગણેશાય નમઃ ॥", latin: "Shri Ganeshaya Namah" },
    symbols: { default: "swastik", options: ["swastik", "kalash", "om", "diya"] },
    templates: ["bandhani", "marigold", "rose"],
    ceremonies: {
      engagement: { native: "ગોળ ધાણા", latin: "Gol Dhana" },
      haldi: { native: "પીઠી", latin: "Pithi" },
      mehendi: { native: "મહેંદી", latin: "Mehendi" },
      sangeet: { native: "સંગીત સંધ્યા", latin: "Sangeet Sandhya" },
      wedding: { native: "શુભ લગ્ન", latin: "Shubh Lagna" },
      reception: { native: "સ્વાગત સમારંભ", latin: "Swagat Samarambh" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "શુભ મુહૂર્ત", latin: "Shubh Muhurat" },
    wording: {
      blessingsFrom: { title: "આશીર્વાદ", example: "શ્રીમતી શારદાબેન અને શ્રી રમણલાલ પટેલ" },
      requesters: { title: "નિમંત્રક", example: "સમસ્ત પટેલ પરિવાર" },
      children: { title: "ટહુકો", example: "મારા મામાના લગ્નમાં જરૂર આવજો" },
    },
    doors: ["Shubh", "Lagna"],
    status: "draft",
    reviewedBy: [],
  },
  bengali: {
    id: "bengali",
    community: "hindu",
    regions: ["WB", "TR"],
    language: "bn",
    nativeName: "বাঙালি",
    invocation: { script: "প্রজাপতয়ে নমঃ", latin: "Prajapataye Namah" },
    symbols: { default: "prajapati", options: ["prajapati", "diya", "om"] },
    templates: ["alpona", "marigold", "scroll"],
    ceremonies: {
      engagement: { native: "আশীর্বাদ", latin: "Aashirbaad" },
      haldi: { native: "গায়ে হলুদ", latin: "Gaye Holud" },
      mehendi: { native: "মেহেন্দি", latin: "Mehendi" },
      sangeet: { native: "সঙ্গীত", latin: "Sangeet" },
      wedding: { native: "শুভ বিবাহ", latin: "Shubho Bibaho" },
      reception: { native: "বৌভাত", latin: "Bou Bhaat" },
    },
    // The bride's family hosts the wedding
    hostOrder: "bride-first",
    muhurat: { native: "শুভ লগ্ন", latin: "Shubho Lagna" },
    wording: {
      requesters: { title: "বিনীত", example: "বন্দ্যোপাধ্যায় পরিবার" },
    },
    doors: ["Shubho", "Bibaho"],
    status: "draft",
    reviewedBy: [],
  },
  tamil: {
    id: "tamil",
    community: "hindu",
    regions: ["TN", "PY"],
    language: "ta",
    nativeName: "தமிழ்",
    invocation: { script: "ஸ்ரீ விநாயகர் துணை", latin: "Sri Vinayagar Thunai" },
    symbols: { default: "suzhi", options: ["suzhi", "diya", "kalash", "om"] },
    templates: ["gopuram", "kasavu", "marigold"],
    ceremonies: {
      engagement: { native: "நிச்சயதார்த்தம்", latin: "Nichayathartham" },
      mehendi: { native: "மெஹந்தி", latin: "Mehendi" },
      wedding: { native: "திருமணம்", latin: "Thirumanam" },
      reception: { native: "வரவேற்பு", latin: "Varaverpu" },
    },
    hostOrder: "both",
    muhurat: { native: "முகூர்த்தம்", latin: "Muhurtham" },
    wording: {
      requesters: {
        title: "தங்கள் நல்வரவை விரும்பும்",
        example: "ஐயர் மற்றும் ராமன் குடும்பத்தினர்",
      },
    },
    doors: ["Subha", "Muhurtham"],
    status: "draft",
    reviewedBy: [],
  },
  modern: {
    id: "modern",
    community: "modern",
    regions: [],
    language: "en",
    nativeName: "",
    invocation: null,
    symbols: { default: null, options: [] },
    templates: ["monogram", "rose", "emerald"],
    ceremonies: {},
    hostOrder: "both",
    muhurat: null,
    wording: {},
    status: "draft",
    reviewedBy: [],
  },
};

export const TRADITION_LIST = TRADITION_IDS.map((id) => TRADITIONS[id]);

export function isTraditionId(value: unknown): value is TraditionId {
  return typeof value === "string" && (TRADITION_IDS as readonly string[]).includes(value);
}

/** Sacred symbols and invocations belong on these occasions only (TRADITIONS.md, section 5). */
export function allowsTradition(category: Category): boolean {
  return category.group === "wedding-journey" || category.group === "home-religious";
}

/** Packs followed where the visitor is come first; the rest keep the catalogue's order. */
export function rankTraditions({ region }: RankContext): TraditionPack[] {
  const local = TRADITION_LIST.filter((pack) => region && pack.regions.includes(region));
  return [...local, ...TRADITION_LIST.filter((pack) => !local.includes(pack))];
}
