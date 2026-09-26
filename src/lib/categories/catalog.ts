import type { Category } from "./schema";

/*
 * The launch categories: the wedding journey. Plain data in the shape of categorySchema,
 * so Step 8 can seed the database from this file and Step 23 can add birthdays, baby,
 * festivals and more without code changes.
 *
 * Names in Indian languages are the common words families use; they get a native
 * speaker's review with the rest of the translations in Step 12.
 */

/** Months when wedding invites go out: September to May, skipping the monsoon. */
const WEDDING_SEASON = [9, 10, 11, 12, 1, 2, 3, 4, 5];
/** Roka, engagement and save-the-dates come a few months before the season. */
const EARLY_SEASON = [6, 7, 8, 9, 10];

const NORTH = ["PB", "HR", "DL", "CH", "HP", "JK", "UP", "UT"] as const;

export const CATEGORIES = {
  wedding: {
    id: "wedding",
    group: "wedding-journey",
    names: {
      en: "Wedding",
      hi: "विवाह",
      mr: "लग्न",
      gu: "લગ્ન",
      bn: "বিয়ে",
      ta: "திருமணம்",
      te: "పెళ్లి",
      kn: "ಮದುವೆ",
      ml: "വിവാഹം",
      pa: "ਵਿਆਹ",
    },
    icon: "flame",
    priority: 90,
    season: WEDDING_SEASON,
    regions: [],
    functions: {
      planned: ["wedding"],
      suggested: ["haldi", "mehendi", "sangeet", "wedding", "reception"],
      primary: "wedding",
    },
    schedule: "full",
    rsvpQuestions: ["meal", "arrival", "stay", "pickup"],
    templates: [
      "marigold",
      "rose",
      "emerald",
      "scroll",
      "monogram",
      "kasavu",
      "rangmahal",
      "paithani",
      "bandhani",
      "alpona",
      "gopuram",
      "phulkari",
    ],
    // Each design keeps its own wedding wording
    wording: {},
  },
  engagement: {
    id: "engagement",
    group: "wedding-journey",
    names: {
      en: "Engagement",
      hi: "सगाई",
      mr: "साखरपुडा",
      gu: "સગાઈ",
      bn: "বাগদান",
      ta: "நிச்சயதார்த்தம்",
      te: "నిశ్చితార్థం",
      kn: "ನಿಶ್ಚಿತಾರ್ಥ",
      ml: "വിവാഹനിശ്ചയം",
      pa: "ਮੰਗਣੀ",
    },
    icon: "ring",
    priority: 70,
    season: EARLY_SEASON,
    regions: [],
    functions: { planned: ["engagement"], suggested: ["engagement"], primary: "engagement" },
    schedule: "full",
    rsvpQuestions: ["meal"],
    templates: ["rose", "monogram", "marigold", "emerald", "paithani", "alpona"],
    wording: {
      doorLeft: "Shubh",
      doorRight: "Sagai",
      line: "invite you to celebrate their engagement",
    },
  },
  "save-the-date": {
    id: "save-the-date",
    group: "wedding-journey",
    names: {
      en: "Save the date",
      hi: "तारीख़ याद रखें",
      mr: "तारीख लक्षात ठेवा",
      gu: "તારીખ યાદ રાખો",
      bn: "তারিখটি মনে রাখুন",
      ta: "தேதியை நினைவில் வையுங்கள்",
      te: "తేదీ గుర్తుంచుకోండి",
      kn: "ದಿನಾಂಕ ನೆನಪಿಡಿ",
      ml: "തീയതി ഓർത്തുവെക്കൂ",
      pa: "ਤਾਰੀਖ਼ ਯਾਦ ਰੱਖੋ",
    },
    icon: "calendar",
    priority: 60,
    season: EARLY_SEASON,
    regions: [],
    functions: { planned: ["wedding"], suggested: ["wedding"], primary: "wedding" },
    schedule: "date-only",
    rsvpQuestions: [],
    templates: ["monogram", "rose", "marigold"],
    wording: {
      doorLeft: "Save the",
      doorRight: "Date",
      families: "Mark your calendar",
      line: "are getting married. Formal invitation to follow.",
    },
  },
  roka: {
    id: "roka",
    group: "wedding-journey",
    names: {
      en: "Roka",
      hi: "रोका",
      mr: "रोका",
      gu: "રોકા",
      bn: "রোকা",
      ta: "ரோகா",
      te: "రోకా",
      kn: "ರೋಕಾ",
      ml: "റോക്ക",
      pa: "ਰੋਕਾ",
    },
    icon: "gem",
    priority: 55,
    season: EARLY_SEASON,
    regions: [...NORTH],
    functions: { planned: ["roka"], suggested: ["roka", "engagement"], primary: "roka" },
    schedule: "full",
    rsvpQuestions: ["meal"],
    templates: ["marigold", "rose", "emerald", "rangmahal", "phulkari"],
    wording: {
      doorLeft: "Shubh",
      doorRight: "Roka",
      line: "seek your blessings at their roka ceremony",
    },
  },
  haldi: {
    id: "haldi",
    group: "wedding-journey",
    names: {
      en: "Haldi",
      hi: "हल्दी",
      mr: "हळद",
      gu: "પીઠી",
      bn: "গায়ে হলুদ",
      ta: "மஞ்சள் நீராட்டு",
      te: "పసుపు",
      kn: "ಅರಿಶಿನ ಶಾಸ್ತ್ರ",
      ml: "ഹൽദി",
      pa: "ਹਲਦੀ",
    },
    icon: "turmeric",
    priority: 50,
    season: WEDDING_SEASON,
    regions: [],
    functions: { planned: ["haldi"], suggested: ["haldi", "mehendi"], primary: "haldi" },
    schedule: "full",
    rsvpQuestions: [],
    templates: ["marigold", "kasavu", "rose", "gopuram", "paithani"],
    wording: {
      doorLeft: "Haldi",
      doorRight: "Rasam",
      line: "invite you to shower them with turmeric and blessings",
    },
  },
  mehendi: {
    id: "mehendi",
    group: "wedding-journey",
    names: {
      en: "Mehendi",
      hi: "मेहंदी",
      mr: "मेहंदी",
      gu: "મહેંદી",
      bn: "মেহেন্দি",
      ta: "மெஹந்தி",
      te: "మెహందీ",
      kn: "ಮೆಹಂದಿ",
      ml: "മെഹന്ദി",
      pa: "ਮਹਿੰਦੀ",
    },
    icon: "henna",
    priority: 50,
    season: WEDDING_SEASON,
    regions: ["RJ", "GJ", "MP", "MH", ...NORTH],
    functions: {
      planned: ["mehendi"],
      suggested: ["mehendi", "haldi", "sangeet"],
      primary: "mehendi",
    },
    schedule: "full",
    rsvpQuestions: ["song"],
    templates: ["rose", "emerald", "marigold", "bandhani", "paithani"],
    wording: {
      doorLeft: "Mehendi",
      doorRight: "Raat",
      line: "invite you to an afternoon of henna, songs and laughter",
    },
  },
  sangeet: {
    id: "sangeet",
    group: "wedding-journey",
    names: {
      en: "Sangeet",
      hi: "संगीत",
      mr: "संगीत",
      gu: "સંગીત",
      bn: "সংগীত",
      ta: "சங்கீத்",
      te: "సంగీత్",
      kn: "ಸಂಗೀತ್",
      ml: "സംഗീത്",
      pa: "ਸੰਗੀਤ",
    },
    icon: "music",
    priority: 50,
    season: WEDDING_SEASON,
    regions: ["RJ", "GJ", "MH", ...NORTH],
    functions: { planned: ["sangeet"], suggested: ["sangeet", "mehendi"], primary: "sangeet" },
    schedule: "full",
    rsvpQuestions: ["song", "meal"],
    templates: ["emerald", "scroll", "marigold", "bandhani", "phulkari", "rangmahal"],
    wording: {
      doorLeft: "Sangeet",
      doorRight: "Sandhya",
      line: "invite you to an evening of music and dance",
    },
  },
  reception: {
    id: "reception",
    group: "wedding-journey",
    names: {
      en: "Reception",
      hi: "स्वागत समारोह",
      mr: "स्वागत समारंभ",
      gu: "સ્વાગત સમારંભ",
      bn: "বৌভাত",
      ta: "வரவேற்பு",
      te: "రిసెప్షన్",
      kn: "ಆರತಕ್ಷತೆ",
      ml: "സ്വീകരണം",
      pa: "ਰਿਸੈਪਸ਼ਨ",
    },
    icon: "celebrate",
    priority: 45,
    season: WEDDING_SEASON,
    regions: [],
    functions: { planned: ["reception"], suggested: ["reception"], primary: "reception" },
    schedule: "full",
    rsvpQuestions: ["meal"],
    templates: ["monogram", "emerald", "scroll", "rose", "rangmahal"],
    wording: {
      doorLeft: "Swagat",
      doorRight: "Samaroh",
      line: "invite you to dinner as they celebrate their marriage",
    },
  },
} satisfies Record<string, Category>;

export type CategoryId = keyof typeof CATEGORIES;

/** Every launch category in its base order, for pickers. */
export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && Object.hasOwn(CATEGORIES, value);
}

export function getCategory(id: CategoryId): Category {
  return CATEGORIES[id];
}
