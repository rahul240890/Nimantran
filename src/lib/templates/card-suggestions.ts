import { CATEGORIES, type CategoryId } from "@/lib/categories/catalog";
import { defaultFaith, faithChoosable, type Faith } from "@/lib/traditions/faith";
import type { WordingId } from "@/lib/traditions/schema";
import type { CardLanguage } from "./card-languages";
import type { SlotId } from "./ids";
import { CARD_OCCASION_SAMPLES, CARD_SAMPLES } from "./story-words";

/*
 * Ready wording a host can tap instead of writing their own: blessings, invitation lines
 * and family lines for each kind of occasion and each faith, festival greetings, the
 * family's own blocks (blessings from, hosted by, the children's line) and a wedding's gate
 * words, in the card's own language. The occasion's own sample comes first. Drafts for a
 * native proofreader and community reviewers, like the samples (docs/TRADITIONS.md, 10).
 */

export const SUGGESTED_SLOTS = ["blessing", "families", "line", "joiner"] as const;
export type SuggestedSlot = (typeof SUGGESTED_SLOTS)[number];

type Kind = "wedding" | "sacred" | "celebration" | "remembrance" | "eid" | "christian";
type LineSlot = "blessing" | "families" | "line";
type Lines = Record<LineSlot, readonly string[]>;

/** Groups whose occasions are parties, work or school: no religious lines. */
const CELEBRATION_GROUPS: readonly string[] = ["birthdays", "parties", "business", "education"];

function kindOf(categoryId: CategoryId): Kind {
  if (categoryId === "prayer-meet") return "remembrance";
  if (categoryId === "eid") return "eid";
  if (categoryId === "christening" || categoryId === "christmas") return "christian";
  const group = CATEGORIES[categoryId].group;
  if (group === "wedding-journey") return "wedding";
  // A shop opening usually starts with a puja, so it keeps the sacred lines
  if (categoryId === "shop-opening") return "sacred";
  return CELEBRATION_GROUPS.includes(group) ? "celebration" : "sacred";
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

/** More Hindu wedding blessings, the ways each region's kankotri opens. */
const REGIONAL_WEDDING_BLESSINGS: Record<CardLanguage, readonly string[]> = {
  en: ["Om Shri Ganeshaya Namah", "Vakratunda Mahakaya", "Shubh Vivah"],
  hi: ["॥ श्री ॥", "॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥", "॥ शुभ विवाह ॥"],
  mr: ["॥ श्री ॥", "॥ श्री गणेश प्रसन्न ॥", "॥ श्री कुलस्वामिनी प्रसन्न ॥"],
  gu: ["॥ શ્રી ॥", "॥ શ્રી કુળદેવી પ્રસન્ન ॥", "॥ શુભ લગ્ન ॥"],
  bn: ["শ্রী শ্রী প্রজাপতয়ে নমঃ", "শুভ বিবাহ"],
  ta: ["உ", "ஸ்ரீ விநாயகர் துணை", "ஸ்ரீ ராமஜெயம்"],
};

/** The lines a faith other than the Hindu one gives, where the Hindu ones would be wrong. */
type FaithLines = Partial<
  Record<"wedding" | "sacred" | "remembrance", Record<CardLanguage, Partial<Lines>>>
>;

const IK_ONKAR = "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ";
const BISMILLAH = "بسم الله الرحمن الرحيم";

const FAITH_LINES: Record<Exclude<Faith, "hindu">, FaithLines> = {
  sikh: {
    wedding: {
      en: {
        blessing: ["Ik Onkar Satgur Prasad", IK_ONKAR, "With the blessings of Waheguru"],
        families: [
          "Together with their families",
          "With the Guru's grace, along with their parents",
          "With the blessings of both families",
        ],
        line: [
          "invite you to celebrate their Anand Karaj",
          "request the honour of your presence at their Anand Karaj",
          "seek your blessings as they marry in the presence of Sri Guru Granth Sahib Ji",
        ],
      },
      hi: {
        blessing: [
          IK_ONKAR,
          "इक ओंकार सतगुर प्रसाद",
          "वाहेगुरु जी की कृपा से",
          "सतनाम श्री वाहेगुरु",
        ],
        families: ["दोनों परिवारों की ओर से", "गुरु कृपा से, माता-पिता सहित", "हर्ष सहित"],
        line: [
          "आनंद कारज के शुभ अवसर पर आपको सपरिवार सादर आमंत्रित करते हैं",
          "के आनंद कारज में आपकी उपस्थिति प्रार्थनीय है",
          "श्री गुरु ग्रंथ साहिब जी की हज़ूरी में आपका आशीर्वाद चाहते हैं",
        ],
      },
      mr: {
        blessing: [IK_ONKAR, "इक ओंकार सतगुर प्रसाद", "वाहेगुरूंच्या कृपेने"],
        families: ["दोन्ही परिवारांकडून", "गुरुकृपेने, आई-वडिलांसह", "सस्नेह"],
        line: [
          "आनंद कारजच्या शुभप्रसंगी आपणास सहकुटुंब सस्नेह निमंत्रण",
          "यांच्या आनंद कारजास आपली उपस्थिती प्रार्थनीय आहे",
        ],
      },
      gu: {
        blessing: [IK_ONKAR, "ઇક ઓંકાર સતગુર પ્રસાદ", "વાહેગુરુની કૃપાથી"],
        families: ["બંને પરિવાર તરફથી", "ગુરુકૃપાથી, માતા-પિતા સાથે", "હર્ષ સાથે"],
        line: [
          "આનંદ કારજના શુભ પ્રસંગે આપને સહકુટુંબ પધારવા ભાવભર્યું આમંત્રણ",
          "ના આનંદ કારજમાં આપની હાજરી પ્રાર્થનીય છે",
        ],
      },
      bn: {
        blessing: [IK_ONKAR, "এক ওঙ্কার সতগুরু প্রসাদ", "ওয়াহেগুরুর কৃপায়"],
        families: ["দুই পরিবারের পক্ষ থেকে", "গুরুর কৃপায়, বাবা-মায়ের সঙ্গে", "সানন্দে"],
        line: [
          "আনন্দ কারজের শুভ অনুষ্ঠানে আপনাকে সপরিবারে সাদর আমন্ত্রণ জানাই",
          "এর আনন্দ কারজে আপনার উপস্থিতি প্রার্থনীয়",
        ],
      },
      ta: {
        blessing: [IK_ONKAR, "இக் ஓங்கார் சத்குர் பிரசாத்", "வாஹேகுருவின் அருளால்"],
        families: ["இரு குடும்பத்தினர் சார்பாக", "குருவின் அருளால், பெற்றோருடன்", "மகிழ்ச்சியுடன்"],
        line: [
          "ஆனந்த் காரஜ் திருமணத்திற்கு தங்களை அன்புடன் அழைக்கிறோம்",
          "ஆனந்த் காரஜ் நிகழ்வில் தங்கள் வருகையை வேண்டுகிறோம்",
        ],
      },
    },
    sacred: {
      en: { blessing: ["Ik Onkar Satgur Prasad", IK_ONKAR, "By the grace of Waheguru"] },
      hi: { blessing: [IK_ONKAR, "वाहेगुरु जी की कृपा से", "सतनाम श्री वाहेगुरु"] },
      mr: { blessing: [IK_ONKAR, "वाहेगुरूंच्या कृपेने"] },
      gu: { blessing: [IK_ONKAR, "વાહેગુરુની કૃપાથી"] },
      bn: { blessing: [IK_ONKAR, "ওয়াহেগুরুর কৃপায়"] },
      ta: { blessing: [IK_ONKAR, "வாஹேகுருவின் அருளால்"] },
    },
    remembrance: {
      en: {
        blessing: ["Satnam Waheguru", "In loving memory", "Forever in our hearts"],
        line: [
          "invite you to join us for the Antim Ardas",
          "request your presence at the Sehaj Path Bhog",
        ],
      },
      hi: {
        blessing: ["सतनाम वाहेगुरु", "स्नेहिल स्मृति में", "सदा हमारे दिलों में"],
        line: ["अंतिम अरदास में आपकी उपस्थिति प्रार्थनीय है", "सहज पाठ के भोग में पधारें"],
      },
      mr: { blessing: ["सतनाम वाहेगुरू", "प्रेमळ स्मृतीस", "सदैव आमच्या हृदयात"] },
      gu: { blessing: ["સતનામ વાહેગુરુ", "સ્નેહભરી સ્મૃતિમાં", "સદા અમારા હૃદયમાં"] },
      bn: { blessing: ["সতনাম ওয়াহেগুরু", "প্রিয় স্মৃতিতে", "চিরকাল আমাদের হৃদয়ে"] },
      ta: { blessing: ["சத்நாம் வாஹேகுரு", "அன்பு நினைவில்", "என்றும் எங்கள் நெஞ்சில்"] },
    },
  },
  muslim: {
    wedding: {
      en: {
        blessing: ["Bismillah ir-Rahman ir-Rahim", BISMILLAH, "786", "In the name of Allah"],
        families: [
          "Together with their families",
          "With the duas of their parents",
          "With the blessings of both families",
        ],
        line: [
          "request the honour of your presence at their Nikah",
          "invite you to celebrate their Nikah",
          "seek your duas as they begin their life together",
        ],
      },
      hi: {
        blessing: [BISMILLAH, "बिस्मिल्लाह हिर्रहमान निर्रहीम", "786", "अल्लाह के फ़ज़ल से"],
        families: ["दोनों ख़ानदानों की ओर से", "वालिदैन की दुआओं के साथ", "ख़ुलूस के साथ"],
        line: [
          "निकाह की मुबारक तक़रीब में आपको सपरिवार दावत देते हैं",
          "के निकाह में आपकी शिरकत हमारे लिए बाइसे-इज़्ज़त होगी",
          "नई ज़िंदगी की शुरुआत पर आपकी दुआओं के तलबगार हैं",
        ],
      },
      mr: {
        blessing: [BISMILLAH, "बिस्मिल्लाह हिर्रहमान निर्रहीम", "786", "अल्लाहच्या कृपेने"],
        families: ["दोन्ही कुटुंबांकडून", "आई-वडिलांच्या दुआंसह", "सस्नेह"],
        line: [
          "निकाहच्या शुभप्रसंगी आपणास सहकुटुंब आग्रहाचे निमंत्रण",
          "यांच्या निकाहास आपली उपस्थिती प्रार्थनीय आहे",
        ],
      },
      gu: {
        blessing: [BISMILLAH, "બિસ્મિલ્લાહ હિર્રહમાન નિર્રહીમ", "786", "અલ્લાહની રહેમતથી"],
        families: ["બંને પરિવાર તરફથી", "માતા-પિતાની દુઆઓ સાથે", "ખુલૂસ સાથે"],
        line: ["નિકાહના મુબારક પ્રસંગે આપને સહકુટુંબ દાવત", "ના નિકાહમાં આપની હાજરી પ્રાર્થનીય છે"],
      },
      bn: {
        blessing: [BISMILLAH, "বিসমিল্লাহির রাহমানির রাহিম", "৭৮৬", "আল্লাহর রহমতে"],
        families: ["দুই পরিবারের পক্ষ থেকে", "বাবা-মায়ের দোয়ায়", "সানন্দে"],
        line: [
          "শুভ নিকাহ অনুষ্ঠানে আপনাকে সপরিবারে দাওয়াত জানাই",
          "এর নিকাহ অনুষ্ঠানে আপনার উপস্থিতি কামনা করি",
        ],
      },
      ta: {
        blessing: [BISMILLAH, "பிஸ்மில்லாஹிர் ரஹ்மானிர் ரஹீம்", "786", "அல்லாஹ்வின் அருளால்"],
        families: ["இரு குடும்பத்தினர் சார்பாக", "பெற்றோர்களின் துஆவுடன்", "மகிழ்ச்சியுடன்"],
        line: [
          "நிக்காஹ் திருமணத்திற்கு தங்களை குடும்பத்துடன் அன்புடன் அழைக்கிறோம்",
          "நிக்காஹ் நிகழ்வில் தங்கள் வருகையையும் துஆவையும் வேண்டுகிறோம்",
        ],
      },
    },
    sacred: {
      en: {
        blessing: ["Bismillah ir-Rahman ir-Rahim", BISMILLAH, "786", "With Allah's blessings"],
      },
      hi: { blessing: [BISMILLAH, "बिस्मिल्लाह हिर्रहमान निर्रहीम", "786", "अल्लाह के फ़ज़ल से"] },
      mr: { blessing: [BISMILLAH, "बिस्मिल्लाह हिर्रहमान निर्रहीम", "786", "अल्लाहच्या कृपेने"] },
      gu: { blessing: [BISMILLAH, "બિસ્મિલ્લાહ હિર્રહમાન નિર્રહીમ", "786", "અલ્લાહની રહેમતથી"] },
      bn: { blessing: [BISMILLAH, "বিসমিল্লাহির রাহমানির রাহিম", "৭৮৬", "আল্লাহর রহমতে"] },
      ta: { blessing: [BISMILLAH, "பிஸ்மில்லாஹிர் ரஹ்மானிர் ரஹீம்", "786", "அல்லாஹ்வின் அருளால்"] },
    },
    remembrance: {
      en: {
        blessing: [
          "Inna lillahi wa inna ilayhi raji'un",
          "In loving memory",
          "Forever in our duas",
        ],
        line: [
          "invite you to join us for the Fatiha and dua",
          "request your presence at the prayer for the departed",
        ],
      },
      hi: {
        blessing: [
          "इन्ना लिल्लाहि व इन्ना इलैहि राजिऊन",
          "स्नेहिल स्मृति में",
          "अल्लाह मग़फ़िरत फ़रमाए",
        ],
        line: ["फ़ातिहा ख़्वानी में आपकी शिरकत की गुज़ारिश है", "दुआ की महफ़िल में तशरीफ़ लाएँ"],
      },
      mr: {
        blessing: ["इन्ना लिल्लाहि व इन्ना इलैहि राजिऊन", "प्रेमळ स्मृतीस", "सदैव आमच्या दुआंत"],
      },
      gu: {
        blessing: [
          "ઇન્ના લિલ્લાહિ વ ઇન્ના ઇલૈહિ રાજિઉન",
          "સ્નેહભરી સ્મૃતિમાં",
          "સદા અમારી દુઆઓમાં",
        ],
      },
      bn: {
        blessing: [
          "ইন্নালিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন",
          "প্রিয় স্মৃতিতে",
          "চিরকাল আমাদের দোয়ায়",
        ],
      },
      ta: {
        blessing: [
          "இன்னா லில்லாஹி வ இன்னா இலைஹி ராஜிஊன்",
          "அன்பு நினைவில்",
          "என்றும் எங்கள் துஆவில்",
        ],
      },
    },
  },
  christian: {
    wedding: {
      en: {
        blessing: [
          "Love is patient, love is kind",
          "What God has joined together",
          "By the grace of God",
          "Two are better than one",
        ],
        families: [
          "Together with their families",
          "With joy, along with their parents",
          "With thanksgiving, both families",
        ],
        line: [
          "request the honour of your presence at their Holy Matrimony",
          "invite you to celebrate their marriage in the presence of God",
          "seek your prayers and blessings as they begin their life together",
        ],
      },
      hi: {
        blessing: [
          "प्रेम धीरजवन्त है, और कृपाल है",
          "परमेश्वर की कृपा से",
          "प्रभु यीशु की आशीष से",
          "जिसे परमेश्वर ने जोड़ा है",
        ],
        families: ["दोनों परिवारों की ओर से", "धन्यवाद सहित, माता-पिता के साथ", "हर्ष सहित"],
        line: [
          "पवित्र विवाह के शुभ अवसर पर आपको सपरिवार सादर आमंत्रित करते हैं",
          "के पवित्र विवाह में आपकी उपस्थिति और प्रार्थना चाहते हैं",
        ],
      },
      mr: {
        blessing: [
          "प्रीती सहनशील आहे, प्रीती परोपकारी आहे",
          "परमेश्वराच्या कृपेने",
          "प्रभू येशूच्या आशीर्वादाने",
        ],
        families: ["दोन्ही परिवारांकडून", "कृतज्ञतेसह, आई-वडिलांसह", "सस्नेह"],
        line: [
          "पवित्र विवाहाच्या शुभप्रसंगी आपणास सहकुटुंब सस्नेह निमंत्रण",
          "यांच्या पवित्र विवाहास आपली उपस्थिती व प्रार्थना अपेक्षित आहे",
        ],
      },
      gu: {
        blessing: ["પ્રેમ સહનશીલ અને માયાળુ છે", "પરમેશ્વરની કૃપાથી", "પ્રભુ ઈસુના આશીર્વાદથી"],
        families: ["બંને પરિવાર તરફથી", "આભાર સાથે, માતા-પિતા સાથે", "સપ્રેમ"],
        line: [
          "પવિત્ર લગ્નના શુભ પ્રસંગે આપને સહકુટુંબ પધારવા ભાવભર્યું આમંત્રણ",
          "ના પવિત્ર લગ્નમાં આપની હાજરી અને પ્રાર્થનાની અપેક્ષા",
        ],
      },
      bn: {
        blessing: ["প্রেম চিরসহিষ্ণু, প্রেম মধুর", "ঈশ্বরের কৃপায়", "প্রভু যীশুর আশীর্বাদে"],
        families: ["দুই পরিবারের পক্ষ থেকে", "কৃতজ্ঞতায়, বাবা-মায়ের সঙ্গে", "সানন্দে"],
        line: [
          "পবিত্র বিবাহ অনুষ্ঠানে আপনাকে সপরিবারে সাদর আমন্ত্রণ জানাই",
          "এর পবিত্র বিবাহে আপনার উপস্থিতি ও প্রার্থনা কামনা করি",
        ],
      },
      ta: {
        blessing: [
          "அன்பு நீடிய சாந்தமும் தயவுமுள்ளது",
          "கர்த்தருடைய கிருபையால்",
          "தேவனுடைய ஆசீர்வாதத்துடன்",
        ],
        families: ["இரு குடும்பத்தினர் சார்பாக", "நன்றியுடன், பெற்றோருடன்", "மகிழ்ச்சியுடன்"],
        line: [
          "பரிசுத்த திருமணத்திற்கு தங்களை குடும்பத்துடன் அன்புடன் அழைக்கிறோம்",
          "திருமண ஆராதனையில் தங்கள் வருகையையும் ஜெபத்தையும் வேண்டுகிறோம்",
        ],
      },
    },
    sacred: {
      en: { blessing: ["God bless", "By the grace of God", "The Lord bless you and keep you"] },
      hi: {
        blessing: ["प्रभु आशीष दें", "परमेश्वर की कृपा से", "प्रभु तुम्हें आशीष दे और रक्षा करे"],
      },
      mr: { blessing: ["प्रभू आशीर्वाद देवो", "परमेश्वराच्या कृपेने"] },
      gu: { blessing: ["પ્રભુ આશીર્વાદ આપે", "પરમેશ્વરની કૃપાથી"] },
      bn: { blessing: ["ঈশ্বর মঙ্গল করুন", "প্রভুর কৃপায়"] },
      ta: { blessing: ["கடவுள் ஆசீர்வதிப்பாராக", "கர்த்தருடைய கிருபையால்"] },
    },
    remembrance: {
      en: {
        blessing: ["Rest in peace", "In loving memory", "In God's eternal care"],
        line: [
          "invite you to the memorial service",
          "request your presence and prayers at the memorial service",
        ],
      },
      hi: {
        blessing: ["प्रभु में विश्राम", "स्नेहिल स्मृति में", "परमेश्वर की गोद में"],
        line: ["स्मृति आराधना में आपकी उपस्थिति प्रार्थनीय है", "प्रार्थना सभा में पधारें"],
      },
      mr: { blessing: ["प्रभूमध्ये विसावा", "प्रेमळ स्मृतीस", "परमेश्वराच्या कुशीत"] },
      gu: { blessing: ["પ્રભુમાં વિશ્રામ", "સ્નેહભરી સ્મૃતિમાં", "પરમેશ્વરના ખોળામાં"] },
      bn: { blessing: ["প্রভুতে চিরশান্তি", "প্রিয় স্মৃতিতে", "ঈশ্বরের কোলে"] },
      ta: { blessing: ["கர்த்தருக்குள் இளைப்பாறுதல்", "அன்பு நினைவில்", "தேவனுடைய சமூகத்தில்"] },
    },
  },
  jain: {
    wedding: {
      en: {
        blessing: [
          "Namo Arihantanam",
          "Jai Jinendra",
          "Shri Mahaviraya Namah",
          "With the blessings of our elders",
        ],
      },
      hi: {
        blessing: [
          "॥ णमो अरिहंताणं ॥",
          "॥ जय जिनेन्द्र ॥",
          "॥ श्री महावीराय नमः ॥",
          "बड़ों के आशीर्वाद से",
        ],
      },
      mr: {
        blessing: [
          "॥ णमो अरिहंताणं ॥",
          "॥ जय जिनेंद्र ॥",
          "॥ श्री महावीराय नमः ॥",
          "वडीलधाऱ्यांच्या आशीर्वादाने",
        ],
      },
      gu: {
        blessing: [
          "॥ ણમો અરિહંતાણં ॥",
          "॥ જય જિનેન્દ્ર ॥",
          "॥ શ્રી મહાવીરાય નમઃ ॥",
          "વડીલોના આશીર્વાદથી",
        ],
      },
      bn: {
        blessing: [
          "॥ ণমো অরিহন্তাণং ॥",
          "জয় জিনেন্দ্র",
          "শ্রী মহাবীরায় নমঃ",
          "গুরুজনদের আশীর্বাদে",
        ],
      },
      ta: {
        blessing: [
          "ணமோ அரிஹந்தாணம்",
          "ஜெய் ஜினேந்திரா",
          "ஸ்ரீ மகாவீராய நம",
          "பெரியோர்களின் ஆசியுடன்",
        ],
      },
    },
    sacred: {
      en: { blessing: ["Namo Arihantanam", "Jai Jinendra", "With the blessings of our elders"] },
      hi: { blessing: ["॥ णमो अरिहंताणं ॥", "॥ जय जिनेन्द्र ॥", "प्रभु कृपा से"] },
      mr: { blessing: ["॥ णमो अरिहंताणं ॥", "॥ जय जिनेंद्र ॥", "ईश्वर कृपेने"] },
      gu: { blessing: ["॥ ણમો અરિહંતાણં ॥", "॥ જય જિનેન્દ્ર ॥", "પ્રભુ કૃપાથી"] },
      bn: { blessing: ["॥ ণমো অরিহন্তাণং ॥", "জয় জিনেন্দ্র", "ঈশ্বরের কৃপায়"] },
      ta: { blessing: ["ணமோ அரிஹந்தாணம்", "ஜெய் ஜினேந்திரா", "இறைவன் அருளால்"] },
    },
    remembrance: {
      en: { blessing: ["Jai Jinendra", "In loving memory", "Forever in our hearts"] },
      hi: { blessing: ["॥ जय जिनेन्द्र ॥", "स्नेहिल स्मृति में", "सदा हमारे दिलों में"] },
      mr: { blessing: ["॥ जय जिनेंद्र ॥", "प्रेमळ स्मृतीस", "सदैव आमच्या हृदयात"] },
      gu: { blessing: ["॥ જય જિનેન્દ્ર ॥", "સ્નેહભરી સ્મૃતિમાં", "સદા અમારા હૃદયમાં"] },
      bn: { blessing: ["জয় জিনেন্দ্র", "প্রিয় স্মৃতিতে", "চিরকাল আমাদের হৃদয়ে"] },
      ta: { blessing: ["ஜெய் ஜினேந்திரா", "அன்பு நினைவில்", "என்றும் எங்கள் நெஞ்சில்"] },
    },
  },
  none: {
    wedding: {
      en: {
        blessing: [
          "Two hearts, one journey",
          "With love",
          "Together, forever",
          "With the blessings of our elders",
        ],
      },
      hi: { blessing: ["दो दिल, एक सफ़र", "प्यार के साथ", "हमेशा साथ", "बड़ों के आशीर्वाद से"] },
      mr: {
        blessing: ["दोन मने, एक प्रवास", "प्रेमाने", "कायम सोबत", "वडीलधाऱ्यांच्या आशीर्वादाने"],
      },
      gu: { blessing: ["બે હૃદય, એક સફર", "પ્રેમ સાથે", "હંમેશાં સાથે", "વડીલોના આશીર્વાદથી"] },
      bn: { blessing: ["দুটি মন, একটি পথ", "ভালোবাসায়", "চিরকাল একসাথে", "গুরুজনদের আশীর্বাদে"] },
      ta: {
        blessing: ["இரு மனம், ஒரு பயணம்", "அன்புடன்", "என்றும் இணைந்து", "பெரியோர்களின் ஆசியுடன்"],
      },
    },
    sacred: {
      en: { blessing: ["With joy", "With love from our family", "With warm wishes"] },
      hi: { blessing: ["हर्ष सहित", "प्यार सहित", "हार्दिक शुभकामनाएँ"] },
      mr: { blessing: ["आनंदाने", "सप्रेम", "हार्दिक शुभेच्छा"] },
      gu: { blessing: ["આનંદ સાથે", "સપ્રેમ", "હાર્દિક શુભેચ્છા"] },
      bn: { blessing: ["সানন্দে", "সপ্রেম", "আন্তরিক শুভেচ্ছা"] },
      ta: { blessing: ["மகிழ்ச்சியுடன்", "அன்புடன்", "இனிய வாழ்த்துகள்"] },
    },
    remembrance: {
      en: { blessing: ["In loving memory", "Forever in our hearts", "Remembering with love"] },
      hi: { blessing: ["स्नेहिल स्मृति में", "सदा हमारे दिलों में", "प्यार भरी यादों के साथ"] },
      mr: { blessing: ["प्रेमळ स्मृतीस", "सदैव आमच्या हृदयात", "प्रेमळ आठवणींसह"] },
      gu: { blessing: ["સ્નેહભરી સ્મૃતિમાં", "સદા અમારા હૃદયમાં", "પ્રેમભરી યાદો સાથે"] },
      bn: { blessing: ["প্রিয় স্মৃতিতে", "চিরকাল আমাদের হৃদয়ে", "ভালোবাসার স্মৃতিতে"] },
      ta: { blessing: ["அன்பு நினைவில்", "என்றும் எங்கள் நெஞ்சில்", "அன்பான நினைவுகளுடன்"] },
    },
  },
};

/** An occasion's own greeting, ahead of the kind's lines: जय श्री कृष्ण for Janmashtami. */
const OCCASION_BLESSINGS: Partial<Record<CategoryId, Record<CardLanguage, readonly string[]>>> = {
  diwali: {
    en: ["Shubh Deepavali", "Happy Diwali", "Shri Lakshmi Ganeshaya Namah"],
    hi: ["॥ श्री लक्ष्मी गणेशाय नमः ॥", "शुभ दीपावली", "शुभ लाभ"],
    mr: ["॥ श्री लक्ष्मी गणेशाय नमः ॥", "शुभ दीपावली", "दिवाळीच्या हार्दिक शुभेच्छा"],
    gu: ["॥ શ્રી લક્ષ્મી ગણેશાય નમઃ ॥", "શુભ દીપાવલી", "સાલ મુબારક"],
    bn: ["শুভ দীপাবলি", "শ্রী শ্রী লক্ষ্মী গণেশায় নমঃ", "আলোর উৎসবের শুভেচ্ছা"],
    ta: ["இனிய தீபாவளி நல்வாழ்த்துகள்", "ஸ்ரீ லக்ஷ்மி கணேசாய நம", "சுபம்"],
  },
  "ganesh-chaturthi": {
    en: ["Ganpati Bappa Morya", "Shri Ganeshaya Namah", "Vakratunda Mahakaya"],
    hi: ["॥ श्री गणेशाय नमः ॥", "गणपति बप्पा मोरया", "॥ वक्रतुण्ड महाकाय ॥"],
    mr: ["गणपती बाप्पा मोरया", "॥ श्री गणेशाय नमः ॥", "मंगलमूर्ती मोरया"],
    gu: ["ગણપતિ બાપ્પા મોરયા", "॥ શ્રી ગણેશાય નમઃ ॥", "મંગલમૂર્તિ મોરયા"],
    bn: ["গণপতি বাপ্পা মোরিয়া", "শ্রী শ্রী গণেশায় নমঃ"],
    ta: ["பிள்ளையார் துணை", "ஓம் கணபதயே நமஹ", "விநாயகர் சதுர்த்தி வாழ்த்துகள்"],
  },
  navratri: {
    en: ["Jai Mata Di", "Shubh Navratri", "Ya Devi Sarvabhuteshu"],
    hi: ["जय माता दी", "शुभ नवरात्रि", "॥ या देवी सर्वभूतेषु ॥"],
    mr: ["उदे गं अंबे उदे", "जय माता दी", "नवरात्रीच्या हार्दिक शुभेच्छा"],
    gu: ["જય માતાજી", "જય અંબે", "શુભ નવરાત્રી"],
    bn: ["জয় মা দুর্গা", "শুভ শারদীয়া", "শুভ নবরাত্রি"],
    ta: ["ஓம் சக்தி", "நவராத்திரி வாழ்த்துகள்", "ஜெய் மாதா தி"],
  },
  janmashtami: {
    en: ["Jai Shri Krishna", "Radhe Radhe", "Hare Krishna"],
    hi: ["जय श्री कृष्ण", "राधे राधे", "॥ श्री कृष्णाय नमः ॥"],
    mr: ["जय श्रीकृष्ण", "गोविंदा आला रे", "राधे राधे"],
    gu: ["જય શ્રી કૃષ્ણ", "જય દ્વારકાધીશ", "રાધે રાધે"],
    bn: ["জয় শ্রীকৃষ্ণ", "রাধে রাধে", "হরে কৃষ্ণ"],
    ta: ["ஜெய் ஸ்ரீ கிருஷ்ணா", "ஹரே கிருஷ்ணா", "கிருஷ்ண ஜெயந்தி வாழ்த்துகள்"],
  },
  holi: {
    en: ["Happy Holi", "Bura na mano, Holi hai", "Rang barse"],
    hi: ["होली की शुभकामनाएँ", "बुरा न मानो, होली है", "रंग बरसे"],
    mr: ["होळीच्या हार्दिक शुभेच्छा", "रंगपंचमीच्या शुभेच्छा"],
    gu: ["હોળીની શુભકામના", "રંગ બરસે"],
    bn: ["শুভ দোলযাত্রা", "বসন্ত উৎসবের শুভেচ্ছা"],
    ta: ["ஹோலி வாழ்த்துகள்", "வண்ணமயமான வாழ்த்துகள்"],
  },
  "raksha-bandhan": {
    en: ["Happy Raksha Bandhan", "A bond of love"],
    hi: ["रक्षाबंधन की शुभकामनाएँ", "प्यार का बंधन"],
    mr: ["रक्षाबंधनाच्या हार्दिक शुभेच्छा", "प्रेमाचे बंधन"],
    gu: ["રક્ષાબંધનની શુભકામના", "પ્રેમનું બંધન"],
    bn: ["শুভ রাখিবন্ধন", "ভালোবাসার বন্ধন"],
    ta: ["ரக்ஷா பந்தன் வாழ்த்துகள்", "அன்பின் பந்தம்"],
  },
  "karva-chauth": {
    en: ["Happy Karva Chauth", "Akhand Saubhagyavati Bhava"],
    hi: ["करवा चौथ की शुभकामनाएँ", "अखंड सौभाग्यवती भव"],
    mr: ["करवा चौथच्या शुभेच्छा", "अखंड सौभाग्यवती भव"],
    gu: ["કરવા ચોથની શુભકામના", "અખંડ સૌભાગ્યવતી ભવ"],
    bn: ["করবা চৌথের শুভেচ্ছা", "অখণ্ড সৌভাগ্যবতী ভব"],
    ta: ["கர்வா சௌத் வாழ்த்துகள்", "தீர்க்க சுமங்கலி பவ"],
  },
  "gudi-padwa": {
    en: ["Happy Gudi Padwa", "Happy New Year"],
    hi: ["गुड़ी पड़वा की शुभकामनाएँ", "नववर्ष की शुभकामनाएँ"],
    mr: ["गुढीपाडव्याच्या हार्दिक शुभेच्छा", "नववर्षाभिनंदन"],
    gu: ["ગુડી પડવાની શુભકામના", "નૂતન વર્ષાભિનંદન"],
    bn: ["গুড়ি পড়ওয়ার শুভেচ্ছা", "নববর্ষের শুভেচ্ছা"],
    ta: ["குடி பட்வா வாழ்த்துகள்", "புத்தாண்டு வாழ்த்துகள்"],
  },
  sankranti: {
    en: ["Happy Makar Sankranti", "Til gul ghya, god god bola"],
    hi: ["मकर संक्रांति की शुभकामनाएँ", "तिल-गुड़ की मिठास"],
    mr: ["तिळगूळ घ्या, गोड गोड बोला", "मकर संक्रांतीच्या शुभेच्छा"],
    gu: ["ઉત્તરાયણની શુભકામના", "મકરસંક્રાંતિની શુભેચ્છા"],
    bn: ["শুভ পৌষ সংক্রান্তি", "মকর সংক্রান্তির শুভেচ্ছা"],
    ta: ["இனிய பொங்கல் நல்வாழ்த்துகள்", "பொங்கலோ பொங்கல்"],
  },
  onam: {
    en: ["Happy Onam", "Onashamsakal"],
    hi: ["ओणम की शुभकामनाएँ"],
    mr: ["ओणमच्या शुभेच्छा"],
    gu: ["ઓણમની શુભકામના"],
    bn: ["ওনামের শুভেচ্ছা"],
    ta: ["ஓணம் வாழ்த்துகள்"],
  },
  bihu: {
    en: ["Happy Bihu", "Rongali Bihu greetings"],
    hi: ["बिहू की शुभकामनाएँ"],
    mr: ["बिहूच्या शुभेच्छा"],
    gu: ["બિહુની શુભકામના"],
    bn: ["শুভ বিহু", "বিহুর শুভেচ্ছা"],
    ta: ["பிஹு வாழ்த்துகள்"],
  },
  lohri: {
    en: ["Happy Lohri", "Lohri di lakh lakh vadhaiyan"],
    hi: ["लोहड़ी की लख-लख बधाइयाँ", "लोहड़ी की शुभकामनाएँ"],
    mr: ["लोहडीच्या शुभेच्छा"],
    gu: ["લોહડીની શુભકામના"],
    bn: ["লোহরির শুভেচ্ছা"],
    ta: ["லோஹ்ரி வாழ்த்துகள்"],
  },
  baisakhi: {
    en: ["Happy Vaisakhi", "Ik Onkar Satgur Prasad", "Waheguru Ji Ka Khalsa"],
    hi: ["बैसाखी की लख-लख बधाइयाँ", IK_ONKAR, "वाहेगुरु जी का ख़ालसा"],
    mr: ["बैसाखीच्या शुभेच्छा", IK_ONKAR],
    gu: ["બૈસાખીની શુભકામના", IK_ONKAR],
    bn: ["বৈশাখীর শুভেচ্ছা", IK_ONKAR],
    ta: ["வைசாகி வாழ்த்துகள்", IK_ONKAR],
  },
  christmas: {
    en: ["Merry Christmas", "Peace on earth", "Joy to the world"],
    hi: ["क्रिसमस की शुभकामनाएँ", "पृथ्वी पर शांति", "प्रभु यीशु की आशीष"],
    mr: ["नाताळच्या हार्दिक शुभेच्छा", "पृथ्वीवर शांती"],
    gu: ["નાતાલની શુભકામના", "પૃથ્વી પર શાંતિ"],
    bn: ["শুভ বড়দিন", "পৃথিবীতে শান্তি"],
    ta: ["கிறிஸ்துமஸ் வாழ்த்துகள்", "பூமியிலே சமாதானம்"],
  },
  housewarming: {
    en: ["Shubh Griha Pravesh", "Shri Ganeshaya Namah"],
    hi: ["शुभ गृह प्रवेश", "॥ श्री गणेशाय नमः ॥"],
    mr: ["शुभ गृहप्रवेश", "॥ श्री गणेशाय नमः ॥"],
    gu: ["શુભ ગૃહ પ્રવેશ", "॥ શ્રી ગણેશાય નમઃ ॥"],
    bn: ["শুভ গৃহপ্রবেশ", "শ্রী শ্রী গণেশায় নমঃ"],
    ta: ["புதுமனை புகுவிழா", "பிள்ளையார் துணை"],
  },
};

/**
 * The family's own blocks under the card (docs/TRADITIONS.md, 3): whose blessings, who
 * invites, who waits to welcome, and the children's line (बाल मनुहार) that kankotris love.
 */
const WORDING_IDEAS: Record<WordingId, Record<CardLanguage, readonly string[]>> = {
  blessingsFrom: {
    en: ["Our grandparents", "All our elders", "The elders of both families"],
    hi: ["दादा-दादी एवं नाना-नानी", "समस्त बड़े-बुज़ुर्ग", "दोनों परिवारों के बुज़ुर्ग"],
    mr: ["आजी-आजोबा", "सर्व वडीलधारी मंडळी", "दोन्ही परिवारांतील ज्येष्ठ"],
    gu: ["દાદા-દાદી તથા નાના-નાની", "સર્વે વડીલો", "બંને પરિવારના વડીલો"],
    bn: ["ঠাকুরদা-ঠাকুমা ও দাদু-দিদিমা", "সকল গুরুজন", "দুই পরিবারের গুরুজন"],
    ta: ["தாத்தா பாட்டி", "அனைத்து பெரியோர்கள்", "இரு குடும்பப் பெரியோர்கள்"],
  },
  requesters: {
    en: [
      "With best compliments from all our relatives and friends",
      "The whole family",
      "All our family members",
    ],
    hi: ["समस्त परिवारजन एवं इष्ट-मित्र", "समस्त परिवार", "सभी रिश्तेदार एवं मित्रगण"],
    mr: ["समस्त परिवार व आप्तेष्ट", "समस्त कुटुंबीय", "सर्व नातेवाईक व मित्रमंडळी"],
    gu: ["સમસ્ત પરિવારજનો તથા સ્નેહીજનો", "સમસ્ત પરિવાર", "સર્વે સગાં-સ્નેહીઓ"],
    bn: ["সমস্ত আত্মীয়-স্বজন ও বন্ধুবান্ধব", "সমগ্র পরিবার", "সকল আত্মীয়স্বজন"],
    ta: ["அனைத்து உறவினர்களும் நண்பர்களும்", "குடும்பத்தினர் அனைவரும்", "உற்றார் உறவினர்கள்"],
  },
  welcome: {
    en: ["The whole family, eager to welcome you", "All of us at home", "Friends and family"],
    hi: ["आपके स्वागत को आतुर समस्त परिवार", "समस्त परिवार", "सभी मित्रगण एवं परिजन"],
    mr: ["आपल्या स्वागतासाठी उत्सुक सर्व कुटुंबीय", "समस्त परिवार", "मित्रमंडळी व आप्तेष्ट"],
    gu: ["આપના સ્વાગતમાં આતુર સમસ્ત પરિવાર", "સમસ્ત પરિવાર", "સર્વે મિત્રો તથા સ્નેહીજનો"],
    bn: ["আপনার অপেক্ষায় সমগ্র পরিবার", "সকল আত্মীয়স্বজন", "বন্ধুবান্ধব ও পরিজন"],
    ta: ["தங்கள் வருகையை எதிர்நோக்கும் குடும்பத்தினர்", "அனைவரும்", "நண்பர்களும் உறவினர்களும்"],
  },
  children: {
    en: [
      "Don't miss my uncle's wedding!",
      "My big brother is getting married. Please come!",
      "Please come and bless my didi!",
    ],
    hi: [
      "मेरे चाचू की शादी में ज़रूर-ज़रूर आना",
      "मेरे भैया की शादी में आप सब पधारना",
      "मेरी दीदी की शादी में ज़रूर आइएगा",
    ],
    mr: [
      "माझ्या काकांच्या लग्नाला नक्की या हं",
      "माझ्या दादाच्या लग्नाला सगळ्यांनी यायचं",
      "माझ्या ताईच्या लग्नाला नक्की या",
    ],
    gu: [
      "મારા કાકાના લગ્નમાં જરૂર જરૂર આવજો",
      "મારા ભાઈના લગ્નમાં સૌ પધારજો",
      "મારી બહેનના લગ્નમાં જરૂર આવજો",
    ],
    bn: [
      "আমার কাকুর বিয়েতে অবশ্যই আসবে কিন্তু",
      "দাদার বিয়েতে সবাই এসো",
      "দিদির বিয়েতে অবশ্যই এসো",
    ],
    ta: [
      "என் சித்தப்பாவின் திருமணத்திற்கு கட்டாயம் வாங்க",
      "என் அண்ணனின் கல்யாணத்துக்கு எல்லோரும் வாங்க",
      "என் அக்காவின் கல்யாணத்துக்கு கட்டாயம் வாங்க",
    ],
  },
};

/** A wedding's gate words as pairs, left door then right, the way each faith's cards write them. */
type DoorPair = readonly [string, string];
const DOOR_IDEAS: Record<Faith, Partial<Record<CardLanguage, readonly DoorPair[]>>> = {
  hindu: {
    en: [
      ["SHUBH", "VIVAH"],
      ["SHUBH", "LAGNA"],
      ["SAVE", "THE DATE"],
    ],
    hi: [
      ["शुभ", "विवाह"],
      ["शुभ", "लग्न"],
      ["मंगल", "परिणय"],
    ],
    mr: [
      ["शुभ", "विवाह"],
      ["शुभ", "मंगल"],
      ["शुभ", "लग्न"],
    ],
    gu: [
      ["શુભ", "લગ્ન"],
      ["શુભ", "વિવાહ"],
      ["મંગલ", "પ્રસંગ"],
    ],
    bn: [
      ["শুভ", "বিবাহ"],
      ["শুভ", "পরিণয়"],
    ],
    ta: [
      ["சுப", "முகூர்த்தம்"],
      ["திருமண", "அழைப்பிதழ்"],
    ],
  },
  sikh: {
    en: [
      ["ANAND", "KARAJ"],
      ["SHUBH", "VIVAH"],
    ],
    hi: [
      ["आनंद", "कारज"],
      ["शुभ", "विवाह"],
    ],
    mr: [["आनंद", "कारज"]],
    gu: [["આનંદ", "કારજ"]],
    bn: [["আনন্দ", "কারজ"]],
    ta: [["ஆனந்த்", "காரஜ்"]],
  },
  muslim: {
    en: [
      ["NIKAH", "MUBARAK"],
      ["SHAADI", "MUBARAK"],
    ],
    hi: [
      ["निकाह", "मुबारक"],
      ["शादी", "मुबारक"],
    ],
    mr: [["निकाह", "मुबारक"]],
    gu: [["નિકાહ", "મુબારક"]],
    bn: [
      ["নিকাহ", "মোবারক"],
      ["শুভ", "বিবাহ"],
    ],
    ta: [["நிக்காஹ்", "முபாரக்"]],
  },
  christian: {
    en: [
      ["HOLY", "MATRIMONY"],
      ["SAVE", "THE DATE"],
    ],
    hi: [["पवित्र", "विवाह"]],
    mr: [["पवित्र", "विवाह"]],
    gu: [["પવિત્ર", "લગ્ન"]],
    bn: [["পবিত্র", "বিবাহ"]],
    ta: [["பரிசுத்த", "திருமணம்"]],
  },
  jain: {
    en: [
      ["SHUBH", "VIVAH"],
      ["JAI", "JINENDRA"],
    ],
    hi: [
      ["शुभ", "विवाह"],
      ["जय", "जिनेन्द्र"],
    ],
    mr: [["शुभ", "विवाह"]],
    gu: [
      ["શુભ", "લગ્ન"],
      ["જય", "જિનેન્દ્ર"],
    ],
    bn: [["শুভ", "বিবাহ"]],
    ta: [["சுப", "முகூர்த்தம்"]],
  },
  none: {
    en: [
      ["SAVE", "THE DATE"],
      ["TWO", "HEARTS"],
    ],
    hi: [
      ["शुभ", "विवाह"],
      ["दो", "दिल"],
    ],
    mr: [["शुभ", "विवाह"]],
    gu: [["શુભ", "લગ્ન"]],
    bn: [["শুভ", "বিবাহ"]],
    ta: [["திருமண", "அழைப்பிதழ்"]],
  },
};

/** Kinds of occasion whose wording follows the family's faith. */
const FAITH_KINDS: readonly Kind[] = ["wedding", "sacred", "remembrance"];

/**
 * The wording offered for one of the card's lines, in its language and the family's faith:
 * the occasion's own sample first (an English card's from the occasion, others' from their
 * own samples), its own greeting, then the lines that suit its kind of occasion and the
 * faith. A Sikh, Muslim, Christian, Jain or non-religious card never gets a Hindu blessing.
 * Never repeats a line.
 */
export function cardSuggestions(
  categoryId: CategoryId,
  language: CardLanguage,
  slot: SuggestedSlot,
  faith: Faith = defaultFaith(categoryId, null),
): string[] {
  if (slot === "joiner") return [...JOINERS[language]];
  const kind = kindOf(categoryId);
  const otherFaith = faith !== "hindu" && FAITH_KINDS.includes(kind);
  const own =
    language === "en"
      ? (CATEGORIES[categoryId].wording as Partial<Record<SlotId, string>>)[slot]
      : (CARD_OCCASION_SAMPLES[categoryId]?.[language]?.[slot as SlotId] ??
        (kind === "wedding" ? CARD_SAMPLES[language][slot as SlotId] : undefined));
  // A festival's greeting is its own whatever the family; a choosable occasion's (a Hindu
  // housewarming) only on a Hindu card
  const greeting =
    slot === "blessing" && (!faithChoosable(categoryId) || faith === "hindu")
      ? (OCCASION_BLESSINGS[categoryId]?.[language] ?? [])
      : [];
  const base = SUGGESTIONS[kind][language][slot];
  const lines = otherFaith
    ? [
        // The samples bless the Hindu way: another faith keeps only their neutral lines
        slot === "blessing" ? undefined : own,
        ...(FAITH_LINES[faith as Exclude<Faith, "hindu">][kind as "wedding"]?.[language]?.[slot] ??
          []),
        ...(slot === "blessing" ? [] : base),
      ]
    : [
        own,
        ...greeting,
        ...base,
        ...(slot === "blessing" && kind === "wedding" ? REGIONAL_WEDDING_BLESSINGS[language] : []),
      ];
  return [...new Set(lines.filter((line): line is string => Boolean(line?.trim())))];
}

/** Ideas for one of the family's blocks; the children's line belongs to a wedding. */
export function wordingIdeas(
  categoryId: CategoryId,
  language: CardLanguage,
  id: WordingId,
): readonly string[] {
  if (id === "children" && kindOf(categoryId) !== "wedding") return [];
  return WORDING_IDEAS[id][language];
}

/** Gate word pairs for a wedding's doors, in the card's language and the family's faith. */
export function doorIdeas(
  categoryId: CategoryId,
  language: CardLanguage,
  faith: Faith,
): readonly DoorPair[] {
  if (kindOf(categoryId) !== "wedding") return [];
  return DOOR_IDEAS[faith][language] ?? DOOR_IDEAS.hindu[language] ?? [];
}
