import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";
import type { Faith } from "@/lib/traditions/faith";
import { PAINTED_GATES, TIED_GATES, isPaintedGate, isTiedGate, type OpeningStyle } from "./catalog";

/*
 * What the guest sees inside a painted or tied gate as its doors open (owner, 2026-11-07):
 * the occasion in a few beautiful words, in the card's language ("शुभ विवाह", "Happy
 * Birthday"), with flowers falling or bursting round them. It took the place of the
 * evening lights, aarti and rose-water drops the owner did not like. Each gate has one of
 * seven looks, so neighbouring designs differ (gate-words.tsx draws them).
 */

/** How the words come in, and what flowers come with them. */
export const GATE_WORD_LOOKS = [
  "petal-rain",
  "toran",
  "phool-burst",
  "rangoli",
  "gold-script",
  "lotus",
  "jharna",
] as const;
export type GateWordLook = (typeof GATE_WORD_LOOKS)[number];

/** What falls round the words: flowers, confetti for a party, a few white petals in mourning. */
export type GateScatter = "flowers" | "confetti" | "quiet";

type Words = Partial<Record<CardLanguage, string>>;

/** A wedding's words follow the family's faith. */
const WEDDING: Record<"shubh" | "sikh" | "muslim" | "christian", Words> = {
  shubh: {
    en: "Shubh Vivah",
    hi: "शुभ विवाह",
    mr: "शुभ विवाह",
    gu: "શુભ લગ્ન",
    bn: "শুভ বিবাহ",
    ta: "சுப முகூர்த்தம்",
  },
  sikh: {
    en: "Anand Karaj",
    hi: "आनंद कारज",
    mr: "आनंद कारज",
    gu: "આનંદ કારજ",
    bn: "আনন্দ কারজ",
    ta: "ஆனந்த் காரஜ்",
  },
  muslim: {
    en: "Shaadi Mubarak",
    hi: "शादी मुबारक",
    mr: "शादी मुबारक",
    gu: "શાદી મુબારક",
    bn: "শাদী মোবারক",
    ta: "ஷாதி முபாரக்",
  },
  christian: {
    en: "Holy Matrimony",
    hi: "पवित्र विवाह",
    mr: "पवित्र विवाह",
    gu: "પવિત્ર લગ્ન",
    bn: "পবিত্র বিবাহ",
    ta: "புனித திருமணம்",
  },
};

/** The words for each occasion; one missing in a language falls back to the occasion's name. */
const OCCASION_WORDS: Partial<Record<CategoryId, Words>> = {
  engagement: {
    en: "Shubh Sagai",
    hi: "शुभ सगाई",
    mr: "शुभ साखरपुडा",
    gu: "શુભ સગાઈ",
    bn: "শুভ বাগদান",
    ta: "நிச்சயதார்த்தம்",
  },
  roka: { en: "Shubh Roka", hi: "शुभ रोका", mr: "शुभ रोका", gu: "શુભ રોકા", bn: "শুভ রোকা" },
  haldi: {
    en: "Haldi Ceremony",
    hi: "हल्दी की रस्म",
    mr: "हळदी समारंभ",
    gu: "પીઠી વિધિ",
    bn: "গায়ে হলুদ",
    ta: "மஞ்சள் நீராட்டு",
  },
  mehendi: {
    en: "Mehendi Night",
    hi: "मेहंदी की रस्म",
    mr: "मेहंदी सोहळा",
    gu: "મહેંદી રસમ",
    bn: "মেহেন্দি সন্ধ্যা",
    ta: "மெஹந்தி விழா",
  },
  sangeet: {
    en: "Sangeet Sandhya",
    hi: "संगीत संध्या",
    mr: "संगीत संध्या",
    gu: "સંગીત સંધ્યા",
    bn: "সঙ্গীত সন্ধ্যা",
    ta: "சங்கீத் இரவு",
  },
  reception: {
    en: "Wedding Reception",
    hi: "स्वागत समारोह",
    mr: "स्वागत समारंभ",
    gu: "સ્વાગત સમારોહ",
    bn: "প্রীতিভোজ",
    ta: "திருமண வரவேற்பு",
  },
  birthday: {
    en: "Happy Birthday",
    hi: "जन्मदिन मुबारक",
    mr: "वाढदिवसाच्या शुभेच्छा",
    gu: "જન્મદિવસ મુબારક",
    bn: "শুভ জন্মদিন",
    ta: "பிறந்தநாள் வாழ்த்துகள்",
  },
  anniversary: {
    en: "Happy Anniversary",
    hi: "सालगिरह मुबारक",
    mr: "लग्नाचा वाढदिवस",
    gu: "શુભ લગ્નતિથિ",
    bn: "শুভ বিবাহবার্ষিকী",
    ta: "திருமண நாள் வாழ்த்துகள்",
  },
  party: {
    en: "Let's Celebrate",
    hi: "चलो जश्न मनाएँ",
    mr: "चला साजरा करूया",
    gu: "ચાલો ઉજવીએ",
    bn: "চলো উদযাপন করি",
    ta: "கொண்டாடுவோம்",
  },
  "baby-shower": {
    en: "Godh Bharai",
    hi: "गोद भराई",
    mr: "डोहाळे जेवण",
    gu: "શ્રીમંત સંસ્કાર",
    bn: "সাধ ভক্ষণ",
    ta: "வளைகாப்பு",
  },
  diwali: {
    en: "Shubh Deepavali",
    hi: "शुभ दीपावली",
    mr: "शुभ दीपावली",
    gu: "શુભ દીપાવલી",
    bn: "শুভ দীপাবলি",
    ta: "தீபாவளி வாழ்த்துகள்",
  },
  housewarming: {
    en: "Griha Pravesh",
    hi: "गृह प्रवेश",
    mr: "गृहप्रवेश",
    gu: "શુભ વાસ્તુ",
    bn: "গৃহপ্রবেশ",
    ta: "கிரகப்பிரவேசம்",
  },
  puja: { en: "Shubh Puja", hi: "शुभ पूजन", mr: "शुभ पूजन", gu: "શુભ પૂજન", bn: "শুভ পূজা" },
  "thread-ceremony": {
    en: "Upanayan Sanskar",
    hi: "उपनयन संस्कार",
    mr: "व्रतबंध",
    gu: "જનોઈ સંસ્કાર",
    bn: "উপনয়ন",
    ta: "உபநயனம்",
  },
  "ganesh-chaturthi": {
    en: "Ganpati Bappa Morya",
    hi: "गणपति बप्पा मोरया",
    mr: "गणपती बाप्पा मोरया",
    gu: "ગણપતિ બાપ્પા મોરયા",
    bn: "গণেশ চতুর্থী",
    ta: "விநாயகர் சதுர்த்தி",
  },
  navratri: {
    en: "Shubh Navratri",
    hi: "शुभ नवरात्रि",
    mr: "शुभ नवरात्री",
    gu: "શુભ નવરાત્રી",
    bn: "শুভ শারদীয়া",
    ta: "நவராத்திரி வாழ்த்துகள்",
  },
  eid: {
    en: "Eid Mubarak",
    hi: "ईद मुबारक",
    mr: "ईद मुबारक",
    gu: "ઈદ મુબારક",
    bn: "ঈদ মোবারক",
    ta: "ஈத் முபாரக்",
  },
  "naming-ceremony": {
    en: "Naamkaran",
    hi: "नामकरण संस्कार",
    mr: "बारसे",
    gu: "નામકરણ વિધિ",
    bn: "নামকরণ",
    ta: "பெயர் சூட்டு விழா",
  },
  retirement: { en: "Happy Retirement" },
  janmashtami: {
    en: "Jai Shri Krishna",
    hi: "जय श्री कृष्ण",
    mr: "जय श्री कृष्ण",
    gu: "જય શ્રી કૃષ્ણ",
    bn: "জয় শ্রীকৃষ্ণ",
    ta: "கிருஷ்ண ஜெயந்தி",
  },
  sankranti: { en: "Happy Sankranti", ta: "பொங்கல் வாழ்த்துகள்" },
  "shop-opening": {
    en: "Shubh Uddhatan",
    hi: "शुभ उद्घाटन",
    mr: "शुभ उद्घाटन",
    gu: "શુભ ઉદ્ઘાટન",
    bn: "শুভ উদ্বোধন",
    ta: "திறப்பு விழா",
  },
  onam: { en: "Happy Onam", ta: "ஓணம் வாழ்த்துகள்" },
  lohri: { en: "Happy Lohri", hi: "लोहड़ी मुबारक" },
  holi: { en: "Happy Holi", hi: "होली मुबारक", gu: "હોળી મુબારક", bn: "শুভ দোলযাত্রা" },
  christmas: { en: "Merry Christmas" },
  reunion: { en: "Together Again" },
  graduation: { en: "Congratulations" },
  "gudi-padwa": { en: "Happy Gudi Padwa", mr: "गुढीपाडव्याच्या शुभेच्छा" },
  baisakhi: { en: "Happy Baisakhi", hi: "बैसाखी मुबारक" },
  "raksha-bandhan": { en: "Happy Raksha Bandhan" },
  "farewell-party": { en: "Farewell and Best Wishes" },
  "prayer-meet": {
    en: "In Loving Memory",
    hi: "श्रद्धांजलि",
    mr: "श्रद्धांजली",
    gu: "શ્રદ્ધાંજલિ",
    bn: "শ্রদ্ধাঞ্জলি",
    ta: "அஞ்சலி",
  },
};

/** The occasion in a few words, in the card's language. */
export function gateWords(category: CategoryId, faith: Faith, lang: CardLanguage): string {
  const own =
    category === "wedding"
      ? WEDDING[faith === "sikh" || faith === "muslim" || faith === "christian" ? faith : "shubh"]
      : OCCASION_WORDS[category];
  const names = CATEGORIES[category].names as Partial<Record<CardLanguage, string>>;
  return own?.[lang] ?? names[lang] ?? names.en ?? CATEGORIES.wedding.names.en;
}

/** Occasions that fall in confetti rather than flowers. */
const CONFETTI: readonly CategoryId[] = [
  "birthday",
  "party",
  "reunion",
  "graduation",
  "launch",
  "farewell-party",
  "retirement",
  "christmas",
];

export function gateScatter(category: CategoryId): GateScatter {
  if (category === "prayer-meet") return "quiet";
  return CONFETTI.includes(category) ? "confetti" : "flowers";
}

/** Every gate, painted then tied, in the order the catalog lists them. */
const GATES: readonly string[] = [...Object.keys(PAINTED_GATES), ...Object.keys(TIED_GATES)];

/**
 * The look a gate's words come in: the gates take the seven looks in turn, so designs next
 * to each other in the catalog differ. A prayer meeting is always the quiet petal rain.
 * Null for an opening that is not a gate: its words stay out of it.
 */
export function gateWordLook(style: OpeningStyle, scatter: GateScatter): GateWordLook | null {
  if (!isPaintedGate(style) && !isTiedGate(style)) return null;
  if (scatter === "quiet") return "petal-rain";
  return GATE_WORD_LOOKS[GATES.indexOf(style) % GATE_WORD_LOOKS.length]!;
}
