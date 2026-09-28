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
    functions: ["tilak", "ganesh-puja", "baraat", "baraat-welcome", "vidaai"],
    ceremonies: {
      roka: { native: "रोका", latin: "Roka" },
      engagement: { native: "सगाई", latin: "Sagai" },
      tilak: { native: "तिलक", latin: "Tilak" },
      "ganesh-puja": { native: "गणेश पूजन", latin: "Ganesh Pujan" },
      "grah-shanti": { native: "ग्रह शांति", latin: "Grah Shanti" },
      mameru: { native: "भात", latin: "Bhaat" },
      haldi: { native: "हल्दी", latin: "Haldi" },
      mehendi: { native: "मेहंदी", latin: "Mehendi" },
      sangeet: { native: "संगीत", latin: "Sangeet" },
      bhoj: { native: "प्रीतिभोज", latin: "Preetibhoj" },
      baraat: { native: "बारात प्रस्थान", latin: "Baraat Prasthan" },
      "baraat-welcome": { native: "बारात स्वागत", latin: "Baraat Swagat" },
      wedding: { native: "शुभ विवाह", latin: "Shubh Vivah" },
      vidaai: { native: "विदाई", latin: "Vidaai" },
      reception: { native: "आशीर्वाद समारोह", latin: "Ashirwad Samaroh" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "शुभ मुहूर्त", latin: "Shubh Muhurat" },
    wording: HINDI_WORDING,
    doors: { native: ["शुभ", "विवाह"], latin: ["Shubh", "Vivah"] },
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
    functions: ["tilak", "ganesh-puja", "mameru", "baraat", "baraat-welcome", "vidaai"],
    ceremonies: {
      roka: { native: "रोका", latin: "Roka" },
      engagement: { native: "सगाई", latin: "Sagai" },
      tilak: { native: "तिलक", latin: "Tilak" },
      "ganesh-puja": { native: "विनायक स्थापना", latin: "Vinayak Sthapana" },
      "grah-shanti": { native: "ग्रह शांति", latin: "Grah Shanti" },
      mameru: { native: "मायरा", latin: "Mayra" },
      haldi: { native: "पीठी", latin: "Pithi" },
      mehendi: { native: "मेहंदी", latin: "Mehendi" },
      sangeet: { native: "महिला संगीत", latin: "Mahila Sangeet" },
      bhoj: { native: "भोज", latin: "Bhoj" },
      baraat: { native: "निकासी", latin: "Nikasi" },
      "baraat-welcome": { native: "तोरण", latin: "Toran" },
      wedding: { native: "शुभ विवाह", latin: "Shubh Vivah" },
      vidaai: { native: "विदाई", latin: "Vidaai" },
      reception: { native: "प्रीतिभोज", latin: "Preetibhoj" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "शुभ मुहूर्त", latin: "Shubh Muhurat" },
    wording: HINDI_WORDING,
    doors: { native: ["शुभ", "विवाह"], latin: ["Shubh", "Vivah"] },
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
    functions: ["ganesh-puja", "grah-shanti", "bhoj", "baraat-welcome", "vidaai"],
    ceremonies: {
      engagement: { native: "साखरपुडा", latin: "Sakharpuda" },
      "ganesh-puja": { native: "गणपती पूजन", latin: "Ganpati Pujan" },
      "grah-shanti": { native: "ग्रहमख", latin: "Grahamakh" },
      mandap: { native: "मांडव", latin: "Mandav" },
      haldi: { native: "हळद", latin: "Halad" },
      mehendi: { native: "मेहंदी", latin: "Mehendi" },
      sangeet: { native: "संगीत", latin: "Sangeet" },
      bhoj: { native: "केळवण", latin: "Kelvan" },
      "baraat-welcome": { native: "सीमांत पूजन", latin: "Seemant Pujan" },
      wedding: { native: "शुभविवाह", latin: "Shubhvivah" },
      vidaai: { native: "पाठवणी", latin: "Pathavani" },
      reception: { native: "स्वागत समारंभ", latin: "Swagat Samarambh" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "शुभमुहूर्त", latin: "Shubh Muhurta" },
    wording: {
      blessingsFrom: { title: "आशीर्वाद", example: "श्रीमती सुमन व श्री विठ्ठल देशमुख" },
      requesters: { title: "निमंत्रक", example: "समस्त देशमुख परिवार" },
      welcome: { title: "स्वागतोत्सुक", example: "अमित, स्नेहा, रोहन" },
    },
    doors: { native: ["शुभ", "मंगल"], latin: ["Shubh", "Mangal"] },
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
    // The kankotri's programme: Jaan Prasthan on the groom's card, Jaan Aagman on the bride's
    functions: [
      "ganesh-puja",
      "grah-shanti",
      "mandap",
      "mameru",
      "garba",
      "bhoj",
      "baraat",
      "baraat-welcome",
      "vidaai",
    ],
    ceremonies: {
      engagement: { native: "ગોળ ધાણા", latin: "Gol Dhana" },
      "ganesh-puja": { native: "ગણેશ સ્થાપના", latin: "Ganesh Sthapana" },
      "grah-shanti": { native: "ગ્રહશાંતિ", latin: "Grah Shanti" },
      mandap: { native: "મંડપ મુહૂર્ત", latin: "Mandap Muhurat" },
      mameru: { native: "મામેરું", latin: "Mameru" },
      haldi: { native: "પીઠી", latin: "Pithi" },
      mehendi: { native: "મહેંદી", latin: "Mehendi" },
      sangeet: { native: "સંગીત સંધ્યા", latin: "Sangeet Sandhya" },
      garba: { native: "રાસ ગરબા", latin: "Raas Garba" },
      bhoj: { native: "ભોજન સમારંભ", latin: "Bhojan Samarambh" },
      baraat: { native: "જાન પ્રસ્થાન", latin: "Jaan Prasthan" },
      "baraat-welcome": { native: "જાન આગમન", latin: "Jaan Aagman" },
      wedding: { native: "હસ્તમેળાપ", latin: "Hast Melap" },
      vidaai: { native: "કન્યા વિદાય", latin: "Kanya Viday" },
      reception: { native: "સ્વાગત સમારંભ", latin: "Swagat Samarambh" },
    },
    hostOrder: "groom-first",
    muhurat: { native: "શુભ મુહૂર્ત", latin: "Shubh Muhurat" },
    wording: {
      blessingsFrom: { title: "આશીર્વાદ", example: "શ્રીમતી શારદાબેન અને શ્રી રમણલાલ પટેલ" },
      requesters: { title: "નિમંત્રક", example: "સમસ્ત પટેલ પરિવાર" },
      children: { title: "ટહુકો", example: "મારા મામાના લગ્નમાં જરૂર આવજો" },
    },
    doors: { native: ["શુભ", "લગ્ન"], latin: ["Shubh", "Lagna"] },
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
    functions: ["engagement", "bhoj", "baraat", "baraat-welcome", "vidaai"],
    ceremonies: {
      engagement: { native: "আশীর্বাদ", latin: "Aashirbaad" },
      haldi: { native: "গায়ে হলুদ", latin: "Gaye Holud" },
      mehendi: { native: "মেহেন্দি", latin: "Mehendi" },
      sangeet: { native: "সঙ্গীত", latin: "Sangeet" },
      bhoj: { native: "আইবুড়ো ভাত", latin: "Aiburobhat" },
      baraat: { native: "বরযাত্রী", latin: "Bor Jatri" },
      "baraat-welcome": { native: "বরবরণ", latin: "Bor Boron" },
      wedding: { native: "শুভ বিবাহ", latin: "Shubho Bibaho" },
      vidaai: { native: "বিদায়", latin: "Bidaay" },
      reception: { native: "বৌভাত", latin: "Bou Bhaat" },
    },
    // The bride's family hosts the wedding
    hostOrder: "bride-first",
    muhurat: { native: "শুভ লগ্ন", latin: "Shubho Lagna" },
    wording: {
      requesters: { title: "বিনীত", example: "বন্দ্যোপাধ্যায় পরিবার" },
    },
    doors: { native: ["শুভ", "বিবাহ"], latin: ["Shubho", "Bibaho"] },
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
    functions: ["engagement", "mandap", "baraat-welcome"],
    ceremonies: {
      engagement: { native: "நிச்சயதார்த்தம்", latin: "Nichayathartham" },
      mandap: { native: "பந்தக்கால் முகூர்த்தம்", latin: "Panthakal Muhurtham" },
      // Nalangu: turmeric, sandal and games for the couple, the nearest to a haldi
      haldi: { native: "நலங்கு", latin: "Nalangu" },
      mehendi: { native: "மெஹந்தி", latin: "Mehendi" },
      "baraat-welcome": { native: "மாப்பிள்ளை அழைப்பு", latin: "Mappillai Azhaippu" },
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
    doors: { native: ["சுப", "முகூர்த்தம்"], latin: ["Subha", "Muhurtham"] },
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
    functions: [],
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
