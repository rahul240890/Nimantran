import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import { SUITES, type SuiteId } from "@/lib/suites/catalog";
import type { CardLanguage } from "@/lib/templates/card-languages";

/* Made-up families for the review sheets, one per card language, nothing saved. */

/** The tradition each card language's sample family follows. */
const TRADITION: Record<CardLanguage, string | null> = {
  en: null,
  hi: "north-hindu",
  mr: "marathi",
  gu: "gujarati",
  bn: "bengali",
  ta: "tamil",
};

type Sample = {
  first: string;
  second: string;
  parents: [string, string];
  towns: [string, string];
  memory: string;
  blessingsFrom: string;
  requesters: string;
  venues: [home: string, lawns: string, palace: string];
};

/* Made-up families of a typical length, written as hosts write them in each script */
const SAMPLES: Record<CardLanguage, Sample> = {
  en: {
    first: "Arjun",
    second: "Meenakshi",
    parents: ["Smt. Sunita & Shri Ramesh Sharma", "Smt. Kavita & Shri Anil Mehta"],
    towns: ["Jaipur", "Udaipur"],
    memory: "Late Shri Mohan Lal Sharma",
    blessingsFrom: "Smt. Kamla Devi & Shri Mohan Lal Sharma",
    requesters: "The Sharma and Mehta families",
    venues: [
      "Sharma Niwas, Sardarpura",
      "Rooftop lawns, Umaid Bhawan",
      "Umaid Bhawan Palace, Jodhpur",
    ],
  },
  hi: {
    first: "अर्जुन",
    second: "मीनाक्षी",
    parents: ["श्रीमती सुनीता एवं श्री रमेश शर्मा", "श्रीमती कविता एवं श्री अनिल मेहता"],
    towns: ["जयपुर", "उदयपुर"],
    memory: "स्व. श्री मोहन लाल शर्मा",
    blessingsFrom: "श्रीमती कमला देवी एवं श्री मोहन लाल शर्मा",
    requesters: "शर्मा एवं मेहता परिवार",
    venues: ["शर्मा निवास, सरदारपुरा", "उम्मेद भवन का छत बाग़", "उम्मेद भवन पैलेस, जोधपुर"],
  },
  mr: {
    first: "अर्जुन",
    second: "मीनाक्षी",
    parents: ["सौ. सुनीता व श्री. रमेश देशपांडे", "सौ. कविता व श्री. अनिल कुलकर्णी"],
    towns: ["पुणे", "नाशिक"],
    memory: "कै. श्री. मोहन देशपांडे",
    blessingsFrom: "सौ. कमला व श्री. मोहन देशपांडे",
    requesters: "देशपांडे व कुलकर्णी परिवार",
    venues: ["देशपांडे वाडा, सदाशिव पेठ", "शुभमंगल लॉन्स, बाणेर", "शुभमंगल कार्यालय, पुणे"],
  },
  gu: {
    first: "અર્જુન",
    second: "મીનાક્ષી",
    parents: ["શ્રીમતી સુનીતાબેન અને શ્રી રમેશભાઈ પટેલ", "શ્રીમતી કવિતાબેન અને શ્રી અનિલભાઈ શાહ"],
    towns: ["અમદાવાદ", "વડોદરા"],
    memory: "સ્વ. શ્રી મોહનભાઈ પટેલ",
    blessingsFrom: "શ્રીમતી કમળાબેન અને શ્રી મોહનભાઈ પટેલ",
    requesters: "પટેલ પરિવાર અને શાહ પરિવાર",
    venues: ["પટેલ નિવાસ, નવરંગપુરા", "કર્ણાવતી ક્લબ લૉન્સ", "હોટેલ ગ્રાન્ડ, અમદાવાદ"],
  },
  bn: {
    first: "অর্জুন",
    second: "মীনাক্ষী",
    parents: ["শ্রীমতী সুনীতা ও শ্রী রমেশ বসু", "শ্রীমতী কবিতা ও শ্রী অনিল সেন"],
    towns: ["কলকাতা", "শান্তিনিকেতন"],
    memory: "স্বর্গীয় শ্রী মোহন বসু",
    blessingsFrom: "শ্রীমতী কমলা ও শ্রী মোহন বসু",
    requesters: "বসু ও সেন পরিবার",
    venues: ["বসু বাড়ি, বালিগঞ্জ", "গঙ্গার ধারে বাগান", "রাজবাড়ি, কলকাতা"],
  },
  ta: {
    first: "அர்ஜுன்",
    second: "மீனாட்சி",
    parents: ["திருமதி சுனிதா & திரு ரமேஷ் ஐயர்", "திருமதி கவிதா & திரு அனில் ராமன்"],
    towns: ["சென்னை", "மதுரை"],
    memory: "அமரர் திரு மோகன் ஐயர்",
    blessingsFrom: "திருமதி கமலா & திரு மோகன் ஐயர்",
    requesters: "ஐயர் மற்றும் ராமன் குடும்பத்தினர்",
    venues: ["ஐயர் இல்லம், மயிலாப்பூர்", "கடற்கரை தோட்டம், ஈசிஆர்", "ஸ்ரீ கல்யாண மண்டபம், சென்னை"],
  },
};

/** A sample invite on `suite` with a family of a typical length written in `language`. */
export function sampleDraft(suite: SuiteId, language: CardLanguage): InviteDraft {
  const theme = SUITES[suite];
  const category = theme.occasions?.[0] ?? "wedding";
  const draft = newDraft(theme.template ?? "marigold", category);
  const sample = SAMPLES[language];
  const wedding = category === "wedding";
  const at = (date: string, time: string, venue: string) => ({
    included: true,
    date,
    time,
    endTime: "",
    venue,
    address: "",
    dressCode: "",
  });
  const [home, lawns, palace] = sample.venues;
  const functions = wedding
    ? {
        ...draft.functions,
        haldi: at("2026-11-18", "10:00", home),
        mehendi: at("2026-11-18", "16:00", home),
        sangeet: at("2026-11-19", "19:30", lawns),
        baraat: at("2026-11-20", "17:00", palace),
        wedding: at("2026-11-20", "18:30", palace),
        reception: at("2026-11-21", "19:30", lawns),
      }
    : Object.fromEntries(
        Object.entries(draft.functions).map(([id, fn]) => [
          id,
          fn.included ? at("2026-11-20", "18:30", palace) : fn,
        ]),
      );
  return {
    ...draft,
    suite,
    languages: [language],
    tradition: {
      ...draft.tradition,
      id: wedding ? (TRADITION[language] as InviteDraft["tradition"]["id"]) : null,
      wording: wedding
        ? { blessingsFrom: sample.blessingsFrom, requesters: sample.requesters }
        : {},
    },
    content: { first: sample.first, ...(wedding ? { second: sample.second } : {}) },
    functions: functions as InviteDraft["functions"],
    family: wedding
      ? {
          first: { relation: "son", parents: sample.parents[0], town: sample.towns[0] },
          second: { relation: "daughter", parents: sample.parents[1], town: sample.towns[1] },
          memory: sample.memory,
          contacts: [],
        }
      : draft.family,
  };
}
