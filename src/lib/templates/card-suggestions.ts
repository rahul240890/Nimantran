import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import type { CardLanguage } from "./card-languages";
import type { SlotId } from "./ids";
import { CARD_OCCASION_SAMPLES, CARD_SAMPLES } from "./story-words";

/*
 * Ready wording a host can tap instead of writing their own: a few blessings, invitation
 * lines and family lines for each kind of occasion, in the card's own language. The
 * occasion's own sample comes first. Drafts for a native proofreader, like the samples.
 */

export const SUGGESTED_SLOTS = ["blessing", "families", "line", "joiner"] as const;
export type SuggestedSlot = (typeof SUGGESTED_SLOTS)[number];

type Kind = "wedding" | "sacred" | "celebration" | "remembrance" | "eid" | "christian";
type Lines = Record<"blessing" | "families" | "line", readonly string[]>;

const CELEBRATIONS: readonly CategoryId[] = [
  "birthday",
  "anniversary",
  "party",
  "retirement",
  "farewell-party",
  "launch",
];

function kindOf(categoryId: CategoryId): Kind {
  if (categoryId === "prayer-meet") return "remembrance";
  if (categoryId === "eid") return "eid";
  if (categoryId === "christening") return "christian";
  if (CATEGORIES[categoryId].group === "wedding-journey") return "wedding";
  return CELEBRATIONS.includes(categoryId) ? "celebration" : "sacred";
}

const SUGGESTIONS: Record<Kind, Record<CardLanguage, Lines>> = {
  wedding: {
    en: {
      blessing: [
        "Shri Ganeshaya Namah",
        "With the blessings of our elders",
        "By the grace of God",
        "Two hearts, one journey",
      ],
      families: [
        "Together with their families",
        "With the blessings of both families",
        "With joy, along with their parents",
      ],
      line: [
        "invite you to celebrate their wedding",
        "request the honour of your presence at their wedding",
        "would love you to join them as they begin their life together",
        "seek your blessings as they tie the knot",
      ],
    },
    hi: {
      blessing: ["॥ श्री गणेशाय नमः ॥", "बड़ों के आशीर्वाद से", "प्रभु कृपा से", "दो दिल, एक सफ़र"],
      families: ["दोनों परिवारों की ओर से", "माता-पिता के आशीर्वाद से", "हर्ष सहित"],
      line: [
        "आपको सपरिवार सादर आमंत्रित करते हैं",
        "के शुभ विवाह में आपकी उपस्थिति प्रार्थनीय है",
        "नवजीवन के शुभारंभ पर आपका आशीर्वाद चाहते हैं",
      ],
    },
    mr: {
      blessing: [
        "॥ श्री गणेशाय नमः ॥",
        "वडीलधाऱ्यांच्या आशीर्वादाने",
        "ईश्वर कृपेने",
        "श्री कुलदेवता प्रसन्न",
      ],
      families: ["दोन्ही परिवारांकडून", "आई-वडिलांच्या आशीर्वादाने", "सस्नेह"],
      line: [
        "आपणास सहकुटुंब सस्नेह निमंत्रण",
        "यांच्या शुभविवाहास आपली उपस्थिती प्रार्थनीय आहे",
        "नवजीवनाच्या शुभारंभी आपले आशीर्वाद द्यावेत",
      ],
    },
    gu: {
      blessing: ["॥ શ્રી ગણેશાય નમઃ ॥", "વડીલોના આશીર્વાદથી", "પ્રભુ કૃપાથી", "કુળદેવીની કૃપાથી"],
      families: ["બંને પરિવાર તરફથી", "માતા-પિતાના આશીર્વાદથી", "હર્ષ સાથે"],
      line: [
        "આપને સહકુટુંબ પધારવા ભાવભર્યું આમંત્રણ",
        "ના શુભ લગ્નપ્રસંગે આપની હાજરી પ્રાર્થનીય છે",
        "નવજીવનના શુભારંભે આપના આશીર્વાદની અપેક્ષા",
      ],
    },
    bn: {
      blessing: [
        "প্রজাপতয়ে নমঃ",
        "গুরুজনদের আশীর্বাদে",
        "ঈশ্বরের কৃপায়",
        "শ্রী শ্রী গণেশায় নমঃ",
      ],
      families: ["দুই পরিবারের পক্ষ থেকে", "বাবা-মায়ের আশীর্বাদে", "সানন্দে"],
      line: [
        "আপনাকে সপরিবারে সাদর আমন্ত্রণ জানাই",
        "এর শুভ বিবাহে আপনার উপস্থিতি প্রার্থনীয়",
        "নবজীবনের শুভ সূচনায় আপনার আশীর্বাদ কামনা করি",
      ],
    },
    ta: {
      blessing: ["பிள்ளையார் துணை", "பெரியோர்களின் ஆசியுடன்", "இறைவன் அருளால்", "சிவமயம்"],
      families: ["இரு குடும்பத்தினர் சார்பாக", "பெற்றோர்களின் ஆசியுடன்", "மகிழ்ச்சியுடன்"],
      line: [
        "தங்களை அன்புடன் அழைக்கிறோம்",
        "திருமணத்திற்கு வருகை தந்து வாழ்த்த வேண்டுகிறோம்",
        "புதிய வாழ்வின் தொடக்கத்தில் தங்கள் ஆசியை வேண்டுகிறோம்",
      ],
    },
  },
  sacred: {
    en: {
      blessing: [
        "Shri Ganeshaya Namah",
        "With the Lord's blessings",
        "By the grace of God",
        "Shubh Labh",
      ],
      families: ["With joy, the family", "With folded hands", "With love from our family"],
      line: [
        "invite you and your family to join us",
        "request your gracious presence on this auspicious day",
        "would be honoured to have your blessings",
      ],
    },
    hi: {
      blessing: ["॥ श्री गणेशाय नमः ॥", "प्रभु कृपा से", "बड़ों के आशीर्वाद से", "शुभ लाभ"],
      families: ["परिवार की ओर से", "विनीत", "सप्रेम"],
      line: [
        "इस शुभ अवसर पर आपको सपरिवार सादर आमंत्रित करते हैं",
        "आपकी गरिमामयी उपस्थिति प्रार्थनीय है",
        "पधारकर आशीर्वाद दें",
      ],
    },
    mr: {
      blessing: ["॥ श्री गणेशाय नमः ॥", "ईश्वर कृपेने", "वडीलधाऱ्यांच्या आशीर्वादाने", "शुभ लाभ"],
      families: ["कुटुंबाकडून", "विनीत", "सस्नेह"],
      line: [
        "या मंगल प्रसंगी आपणास सहकुटुंब आग्रहाचे निमंत्रण",
        "आपली उपस्थिती प्रार्थनीय आहे",
        "अवश्य येऊन आशीर्वाद द्यावेत",
      ],
    },
    gu: {
      blessing: ["॥ શ્રી ગણેશાય નમઃ ॥", "પ્રભુ કૃપાથી", "વડીલોના આશીર્વાદથી", "શુભ લાભ"],
      families: ["પરિવાર તરફથી", "લિ. આપના સ્નેહાધીન", "સપ્રેમ"],
      line: [
        "આ શુભ પ્રસંગે આપને સહકુટુંબ પધારવા ભાવભર્યું આમંત્રણ",
        "આપની હાજરી પ્રાર્થનીય છે",
        "પધારી આશીર્વાદ આપશોજી",
      ],
    },
    bn: {
      blessing: ["শ্রী শ্রী গণেশায় নমঃ", "ঈশ্বরের কৃপায়", "গুরুজনদের আশীর্বাদে", "শুভ লাভ"],
      families: ["পরিবারের পক্ষ থেকে", "বিনীত", "সপ্রেম"],
      line: [
        "এই শুভ অনুষ্ঠানে আপনাকে সপরিবারে সাদর আমন্ত্রণ জানাই",
        "আপনার উপস্থিতি প্রার্থনীয়",
        "এসে আশীর্বাদ করবেন",
      ],
    },
    ta: {
      blessing: ["பிள்ளையார் துணை", "இறைவன் அருளால்", "பெரியோர்களின் ஆசியுடன்", "சுபம்"],
      families: ["குடும்பத்தினர் சார்பாக", "அன்புடன்", "தங்கள் அன்புள்ள"],
      line: [
        "இந்த சுப நிகழ்ச்சிக்கு தங்களை குடும்பத்துடன் அன்புடன் அழைக்கிறோம்",
        "தங்கள் வருகையை அன்புடன் எதிர்பார்க்கிறோம்",
        "வருகை தந்து ஆசி வழங்க வேண்டுகிறோம்",
      ],
    },
  },
  celebration: {
    en: {
      blessing: [
        "Let's celebrate",
        "With love and laughter",
        "Good times ahead",
        "Cheers to many more",
      ],
      families: ["With love from the family", "Hosted by family and friends", "With love"],
      line: [
        "invite you to celebrate with us",
        "would love to see you there",
        "join us for an evening of fun, food and friends",
      ],
    },
    hi: {
      blessing: [
        "ख़ुशियों का जश्न",
        "प्यार और मुस्कान के साथ",
        "आइए जश्न मनाएँ",
        "ढेरों शुभकामनाएँ",
      ],
      families: ["परिवार की ओर से", "प्यार सहित", "दोस्तों और परिवार की ओर से"],
      line: [
        "जश्न में आपको सादर आमंत्रित करते हैं",
        "आपके आने से ख़ुशी दोगुनी होगी",
        "हँसी, खाने और दोस्तों की शाम में ज़रूर आएँ",
      ],
    },
    mr: {
      blessing: ["आनंदाचा उत्सव", "प्रेम आणि हास्यासह", "चला साजरा करूया", "हार्दिक शुभेच्छा"],
      families: ["कुटुंबाकडून", "सप्रेम", "मित्र व कुटुंबाकडून"],
      line: [
        "आनंदाच्या या क्षणी आपणास आग्रहाचे निमंत्रण",
        "आपण आल्यास आनंद द्विगुणित होईल",
        "गप्पा, जेवण आणि मित्रांच्या संध्याकाळी नक्की या",
      ],
    },
    gu: {
      blessing: ["ખુશીનો ઉત્સવ", "પ્રેમ અને સ્મિત સાથે", "ચાલો ઉજવણી કરીએ", "હાર્દિક શુભેચ્છા"],
      families: ["પરિવાર તરફથી", "સપ્રેમ", "મિત્રો અને પરિવાર તરફથી"],
      line: [
        "ઉજવણીમાં પધારવા ભાવભર્યું આમંત્રણ",
        "આપ પધારશો તો આનંદ બમણો થશે",
        "વાતો, ભોજન અને મિત્રોની સાંજમાં જરૂર આવજો",
      ],
    },
    bn: {
      blessing: ["আনন্দের উৎসব", "ভালোবাসা আর হাসিতে", "চলুন উদযাপন করি", "অনেক শুভেচ্ছা"],
      families: ["পরিবারের পক্ষ থেকে", "সপ্রেম", "বন্ধু ও পরিবারের পক্ষ থেকে"],
      line: [
        "উদযাপনে আপনাকে সাদর আমন্ত্রণ জানাই",
        "আপনি এলে আনন্দ দ্বিগুণ হবে",
        "গল্প, খাওয়া আর বন্ধুদের সন্ধ্যায় অবশ্যই আসবেন",
      ],
    },
    ta: {
      blessing: ["கொண்டாட்டம்", "அன்பும் சிரிப்பும்", "வாருங்கள் கொண்டாடுவோம்", "இனிய வாழ்த்துகள்"],
      families: ["குடும்பத்தினர் சார்பாக", "அன்புடன்", "நண்பர்கள் மற்றும் குடும்பத்தினர் சார்பாக"],
      line: [
        "கொண்டாட்டத்திற்கு தங்களை அன்புடன் அழைக்கிறோம்",
        "தாங்கள் வந்தால் மகிழ்ச்சி இரட்டிப்பாகும்",
        "பேச்சு, விருந்து, நண்பர்களுடன் ஒரு மாலைக்கு வாருங்கள்",
      ],
    },
  },
  remembrance: {
    en: {
      blessing: ["Om Shanti", "In loving memory", "Forever in our hearts"],
      families: ["The grieving family", "With folded hands", "In gratitude, the family"],
      line: ["invite you to join us in prayer", "request your presence at the prayer meeting"],
    },
    hi: {
      blessing: ["ॐ शांति", "स्नेहिल स्मृति में", "सदा हमारे दिलों में"],
      families: ["शोकाकुल परिवार", "विनीत", "परिवार की ओर से"],
      line: ["श्रद्धांजलि सभा में आपकी उपस्थिति प्रार्थनीय है", "प्रार्थना सभा में पधारें"],
    },
    mr: {
      blessing: ["ॐ शांती", "प्रेमळ स्मृतीस", "सदैव आमच्या हृदयात"],
      families: ["शोकाकुल परिवार", "विनीत", "कुटुंबाकडून"],
      line: ["श्रद्धांजली सभेस आपली उपस्थिती प्रार्थनीय आहे", "प्रार्थना सभेस अवश्य यावे"],
    },
    gu: {
      blessing: ["ૐ શાંતિ", "સ્નેહભરી સ્મૃતિમાં", "સદા અમારા હૃદયમાં"],
      families: ["શોકાતુર પરિવાર", "વિનીત", "પરિવાર તરફથી"],
      line: ["પ્રાર્થનાસભામાં આપની હાજરી પ્રાર્થનીય છે", "બેસણામાં પધારશોજી"],
    },
    bn: {
      blessing: ["ওঁ শান্তি", "প্রিয় স্মৃতিতে", "চিরকাল আমাদের হৃদয়ে"],
      families: ["শোকসন্তপ্ত পরিবার", "বিনীত", "পরিবারের পক্ষ থেকে"],
      line: ["স্মরণসভায় আপনার উপস্থিতি প্রার্থনীয়", "প্রার্থনা সভায় আসবেন"],
    },
    ta: {
      blessing: ["ஓம் சாந்தி", "அன்பு நினைவில்", "என்றும் எங்கள் நெஞ்சில்"],
      families: ["துயருறும் குடும்பத்தினர்", "அன்புடன்", "குடும்பத்தினர் சார்பாக"],
      line: [
        "நினைவஞ்சலி நிகழ்ச்சியில் கலந்துகொள்ள வேண்டுகிறோம்",
        "பிரார்த்தனைக் கூட்டத்திற்கு வாருங்கள்",
      ],
    },
  },
  eid: {
    en: {
      blessing: ["Eid Mubarak", "Bismillah", "With Allah's blessings"],
      families: ["With love from the family", "Warm regards", "With love"],
      line: ["invite you to celebrate Eid with us", "request the pleasure of your company"],
    },
    hi: {
      blessing: ["ईद मुबारक", "बिस्मिल्लाह", "अल्लाह की रहमत से"],
      families: ["परिवार की ओर से", "ख़ुलूस के साथ", "प्यार सहित"],
      line: ["ईद की ख़ुशियों में आपको दावत देते हैं", "आपकी तशरीफ़ आवरी का इंतज़ार रहेगा"],
    },
    mr: {
      blessing: ["ईद मुबारक", "बिस्मिल्लाह", "अल्लाहच्या कृपेने"],
      families: ["कुटुंबाकडून", "सप्रेम", "स्नेहपूर्वक"],
      line: ["ईदच्या आनंदात आपणास आग्रहाचे निमंत्रण", "आपली वाट पाहत आहोत"],
    },
    gu: {
      blessing: ["ઈદ મુબારક", "બિસ્મિલ્લાહ", "અલ્લાહની રહેમતથી"],
      families: ["પરિવાર તરફથી", "સપ્રેમ", "સ્નેહપૂર્વક"],
      line: ["ઈદની ખુશીમાં પધારવા ભાવભર્યું આમંત્રણ", "આપની રાહ જોઈશું"],
    },
    bn: {
      blessing: ["ঈদ মোবারক", "বিসমিল্লাহ", "আল্লাহর রহমতে"],
      families: ["পরিবারের পক্ষ থেকে", "সপ্রেম", "শুভেচ্ছাসহ"],
      line: ["ঈদের আনন্দে আপনাকে দাওয়াত জানাই", "আপনার অপেক্ষায় থাকব"],
    },
    ta: {
      blessing: ["ஈத் முபாரக்", "பிஸ்மில்லாஹ்", "அல்லாஹ்வின் அருளால்"],
      families: ["குடும்பத்தினர் சார்பாக", "அன்புடன்", "வாழ்த்துகளுடன்"],
      line: [
        "ஈத் கொண்டாட்டத்திற்கு தங்களை அன்புடன் அழைக்கிறோம்",
        "தங்கள் வருகைக்காகக் காத்திருக்கிறோம்",
      ],
    },
  },
  christian: {
    en: {
      blessing: ["God bless", "By the grace of God", "With joy and thanksgiving"],
      families: ["With love from the family", "With thanksgiving", "With love"],
      line: ["invite you to celebrate with us", "request your presence and prayers"],
    },
    hi: {
      blessing: ["प्रभु आशीष दें", "प्रभु की कृपा से", "आनंद और धन्यवाद सहित"],
      families: ["परिवार की ओर से", "धन्यवाद सहित", "प्यार सहित"],
      line: [
        "इस पावन अवसर पर आपको सादर आमंत्रित करते हैं",
        "आपकी उपस्थिति और प्रार्थनाएँ चाहते हैं",
      ],
    },
    mr: {
      blessing: ["प्रभू आशीर्वाद देवो", "प्रभूच्या कृपेने", "आनंद व कृतज्ञतेसह"],
      families: ["कुटुंबाकडून", "कृतज्ञतेसह", "सप्रेम"],
      line: ["या पवित्र प्रसंगी आपणास सस्नेह निमंत्रण", "आपली उपस्थिती व प्रार्थना अपेक्षित आहे"],
    },
    gu: {
      blessing: ["પ્રભુ આશીર્વાદ આપે", "પ્રભુની કૃપાથી", "આનંદ અને આભાર સાથે"],
      families: ["પરિવાર તરફથી", "આભાર સાથે", "સપ્રેમ"],
      line: ["આ પવિત્ર પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ", "આપની હાજરી અને પ્રાર્થનાની અપેક્ષા"],
    },
    bn: {
      blessing: ["ঈশ্বর মঙ্গল করুন", "প্রভুর কৃপায়", "আনন্দ ও কৃতজ্ঞতায়"],
      families: ["পরিবারের পক্ষ থেকে", "কৃতজ্ঞতাসহ", "সপ্রেম"],
      line: [
        "এই পবিত্র অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
        "আপনার উপস্থিতি ও প্রার্থনা কামনা করি",
      ],
    },
    ta: {
      blessing: ["கடவுள் ஆசீர்வதிப்பாராக", "இறைவனின் கிருபையால்", "மகிழ்ச்சியுடனும் நன்றியுடனும்"],
      families: ["குடும்பத்தினர் சார்பாக", "நன்றியுடன்", "அன்புடன்"],
      line: [
        "இந்த புனித நிகழ்விற்கு தங்களை அன்புடன் அழைக்கிறோம்",
        "தங்கள் வருகையையும் ஜெபத்தையும் வேண்டுகிறோம்",
      ],
    },
  },
};

/** The word between two names, the ways cards in each language write it. */
const JOINERS: Record<CardLanguage, readonly string[]> = {
  en: ["&", "weds", "and"],
  hi: ["संग", "&", "और"],
  mr: ["आणि", "&", "सह"],
  gu: ["અને", "&", "સંગ"],
  bn: ["ও", "&", "এবং"],
  ta: ["&", "மற்றும்"],
};

/**
 * The wording offered for one of the card's lines, in its language: the occasion's own
 * sample first (an English card's from the occasion, others' from their own samples),
 * then the lines that suit its kind of occasion. Never repeats a line.
 */
export function cardSuggestions(
  categoryId: CategoryId,
  language: CardLanguage,
  slot: SuggestedSlot,
): string[] {
  if (slot === "joiner") return [...JOINERS[language]];
  const own =
    language === "en"
      ? (CATEGORIES[categoryId].wording as Partial<Record<SlotId, string>>)[slot]
      : (CARD_OCCASION_SAMPLES[categoryId]?.[language]?.[slot as SlotId] ??
        (kindOf(categoryId) === "wedding" ? CARD_SAMPLES[language][slot as SlotId] : undefined));
  const lines = [own, ...SUGGESTIONS[kindOf(categoryId)][language][slot]].filter(
    (line): line is string => Boolean(line?.trim()),
  );
  return [...new Set(lines)];
}
