import type { CategoryId } from "@/lib/categories/catalog";
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
    when: "शुभ तिथी",
    where: "शुभ स्थळ",
    joinUs: "आपण नक्की याल ना?",
    withLove: "सप्रेम, आपली वाट पाहत आहोत",
    and: "आणि",
  },
  gu: {
    saveTheDate: "તારીખ યાદ રાખજો",
    when: "શુભ તિથિ",
    where: "શુભ સ્થળ",
    joinUs: "આપ જરૂર પધારશો ને?",
    withLove: "સપ્રેમ, આપની રાહ જોઈએ છીએ",
    and: "અને",
  },
  bn: {
    saveTheDate: "তারিখটি মনে রাখবেন",
    when: "শুভ দিন",
    where: "অনুষ্ঠানস্থল",
    joinUs: "আপনি আসবেন তো?",
    withLove: "সাদরে, আপনার অপেক্ষায়",
    and: "ও",
  },
  ta: {
    saveTheDate: "தேதியை நினைவில் கொள்ளுங்கள்",
    when: "நாள் & நேரம்",
    where: "இடம்",
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
export const CARD_OCCASION_SAMPLES: Partial<Record<CategoryId, Samples>> = {
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
  "baby-shower": {
    hi: {
      doorLeft: "गोद",
      doorRight: "भराई",
      families: "दोनों परिवारों की ओर से",
      first: "प्रिया",
      line: "गोद भराई की रस्म में आशीर्वाद देने के लिए आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "डोहाळे",
      doorRight: "जेवण",
      families: "दोन्ही परिवारांकडून",
      first: "प्रिया",
      line: "डोहाळे जेवणाच्या सोहळ्यात आशीर्वाद देण्यासाठी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "સીમંત",
      families: "બંને પરિવાર તરફથી",
      first: "પ્રિયા",
      line: "સીમંત પ્રસંગે આશીર્વાદ આપવા પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "সাধ",
      families: "দুই পরিবারের পক্ষ থেকে",
      first: "প্রিয়া",
      line: "সাধের অনুষ্ঠানে আশীর্বাদ জানাতে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "வளை",
      doorRight: "காப்பு",
      families: "இரு குடும்பத்தினர் சார்பாக",
      first: "பிரியா",
      line: "வளைகாப்பு விழாவிற்கு ஆசீர்வதிக்க தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  diwali: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "दीपावली",
      families: "शर्मा परिवार",
      first: "दिवाली मिलन",
      line: "दीयों, मिठाइयों और लक्ष्मी पूजा की शाम में आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "दीपावली",
      families: "देशपांडे परिवार",
      first: "दिवाळी पहाट",
      line: "दिवे, फराळ आणि लक्ष्मीपूजनाच्या संध्याकाळी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "દીપાવલી",
      families: "પટેલ પરિવાર",
      first: "દિવાળી મિલન",
      line: "દીવા, મીઠાઈ અને લક્ષ્મી પૂજનની સાંજે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "দীপাবলি",
      families: "বসু পরিবার",
      first: "দীপাবলি মিলন",
      line: "প্রদীপ, মিষ্টি আর লক্ষ্মীপুজোর সন্ধ্যায় আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "தீபாவளி",
      families: "ஐயர் குடும்பத்தினர்",
      first: "தீபாவளி விருந்து",
      line: "தீபங்கள், இனிப்புகள் மற்றும் லட்சுமி பூஜை மாலைக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  housewarming: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "गृह प्रवेश",
      families: "शर्मा परिवार",
      first: "शर्मा निवास",
      line: "नए घर की पूजा और भोजन में पधारकर आशीर्वाद दें",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "गृहप्रवेश",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "ગૃહપ્રવેશ",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "গৃহপ্রবেশ",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "கிரகப்பிரவேசம்",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  puja: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "पूजन",
      families: "शर्मा परिवार",
      first: "सत्यनारायण कथा",
      line: "कथा, आरती और प्रसाद के लिए आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "पूजा आणि कथा",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "પૂજા અને કથા",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "পুজো ও কথা",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "பூஜை",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  "thread-ceremony": {
    hi: {
      doorLeft: "शुभ",
      doorRight: "उपनयन",
      families: "शर्मा परिवार",
      first: "आरव",
      line: "आरव के जनेऊ संस्कार पर आशीर्वाद देने हेतु आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "मुंज",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "જનોઈ",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "উপনয়ন",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "உபநயனம்",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  annaprashan: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "अन्नप्राशन",
      families: "शर्मा परिवार",
      first: "अनाया",
      line: "हमारी नन्ही अनाया के अन्नप्राशन पर आशीर्वाद देने पधारें",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "उष्टावण",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "અન્નપ્રાશન",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "অন্নপ্রাশন",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "அன்னப்பிராசனம்",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  christening: {
    hi: {
      doorLeft: "पवित्र",
      doorRight: "बपतिस्मा",
      families: "डिसूज़ा परिवार",
      first: "एरन",
      line: "हमारे नन्हे के बपतिस्मा और उसके बाद भोजन पर आपको सादर आमंत्रित करते हैं",
      blessing: "ईश्वर का आशीर्वाद",
    },
    mr: {
      doorLeft: "पवित्र",
      doorRight: "बाप्तिस्मा",
      families: "डिसूझा परिवार",
      first: "एरन",
      line: "आमच्या बाळाच्या बाप्तिस्मा सोहळ्यास आपणास आग्रहाचे निमंत्रण",
      blessing: "देवाचा आशीर्वाद",
    },
    gu: {
      doorLeft: "પવિત્ર",
      doorRight: "બાપ્તિસ્મા",
      families: "ડિસોઝા પરિવાર",
      first: "એરન",
      line: "અમારા બાળકના બાપ્તિસ્મા પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
      blessing: "ઈશ્વરના આશીર્વાદ",
    },
    bn: {
      doorLeft: "পবিত্র",
      doorRight: "ব্যাপটিজম",
      families: "ডিসুজা পরিবার",
      first: "অ্যারন",
      line: "আমাদের ছোট্ট সোনার ব্যাপটিজম অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
      blessing: "ঈশ্বরের আশীর্বাদ",
    },
    ta: {
      doorLeft: "புனித",
      doorRight: "ஞானஸ்நானம்",
      families: "டிசோசா குடும்பத்தினர்",
      first: "ஆரன்",
      line: "எங்கள் குழந்தையின் ஞானஸ்நான விழாவிற்கு தங்களை அன்புடன் அழைக்கிறோம்",
      blessing: "இறைவனின் ஆசீர்வாதம்",
    },
  },
  "prayer-meet": {
    hi: {
      doorLeft: "विनम्र",
      doorRight: "श्रद्धांजलि",
      families: "शर्मा परिवार",
      first: "श्री आर. के. शर्मा",
      line: "उनकी स्मृति में आयोजित श्रद्धांजलि सभा में आपकी उपस्थिति प्रार्थनीय है",
      blessing: "ॐ शांति",
    },
    mr: {
      doorLeft: "भावपूर्ण",
      doorRight: "श्रद्धांजली",
      families: "देशपांडे परिवार",
      first: "श्री आर. के. देशपांडे",
      line: "त्यांच्या स्मृतिप्रीत्यर्थ आयोजित प्रार्थना सभेस आपली उपस्थिती प्रार्थनीय",
      blessing: "ॐ शांती",
    },
    gu: {
      doorLeft: "ભાવભીની",
      doorRight: "શ્રદ્ધાંજલિ",
      families: "પટેલ પરિવાર",
      first: "શ્રી આર. કે. પટેલ",
      line: "તેમની સ્મૃતિમાં યોજાયેલી પ્રાર્થના સભામાં આપની ઉપસ્થિતિ પ્રાર્થનીય છે",
      blessing: "ૐ શાંતિ",
    },
    bn: {
      doorLeft: "শ্রদ্ধা",
      doorRight: "স্মরণ",
      families: "বসু পরিবার",
      first: "শ্রী আর. কে. বসু",
      line: "তাঁর স্মরণে আয়োজিত প্রার্থনা সভায় আপনার উপস্থিতি প্রার্থনীয়",
      blessing: "ওঁ শান্তি",
    },
    ta: {
      doorLeft: "கண்ணீர்",
      doorRight: "அஞ்சலி",
      families: "ஐயர் குடும்பத்தினர்",
      first: "திரு. ஆர். கே. ஐயர்",
      line: "அவரது நினைவாக நடைபெறும் பிரார்த்தனைக் கூட்டத்தில் தங்கள் வருகையை வேண்டுகிறோம்",
      blessing: "ஓம் சாந்தி",
    },
  },
  retirement: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "सेवानिवृत्ति",
      families: "शर्मा परिवार",
      first: "आर. के. शर्मा",
      line: "उनके सेवानिवृत्ति समारोह में आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "सेवानिवृत्ती",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "નિવૃત્તિ",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "অবসর",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "பணி ஓய்வு",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  "farewell-party": {
    hi: {
      doorLeft: "विदाई",
      doorRight: "समारोह",
      families: "जूनियर्स की ओर से",
      first: "2026 बैच",
      line: "नई शुरुआत से पहले साथ की आख़िरी शाम में आपको आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "निरोप समारंभ",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "વિદાય સમારંભ",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "বিদায় সংবর্ধনা",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "பிரியாவிடை விழா",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  "shop-opening": {
    hi: {
      doorLeft: "शुभ",
      doorRight: "उद्घाटन",
      families: "शर्मा परिवार एवं टीम",
      first: "शर्मा ज्वेलर्स",
      line: "हमारी नई दुकान के उद्घाटन और पूजन में आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "उद्घाटन",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "ઉદ્ઘાટન",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "উদ্বোধন",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "திறப்பு விழா",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  launch: {
    hi: {
      doorLeft: "आप",
      doorRight: "आमंत्रित हैं",
      families: "टीम की ओर से",
      first: "ऑरोरा लॉन्च",
      line: "पहली झलक और भोज की शाम में आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "लॉन्च सोहळा",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "લૉન્ચ ઇવેન્ટ",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "উদ্বোধনী অনুষ্ঠান",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "அறிமுக விழா",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  "ganesh-chaturthi": {
    hi: {
      doorLeft: "गणपति",
      doorRight: "बप्पा मोरया",
      families: "शर्मा परिवार",
      first: "शर्मा परिवार के गणपति",
      line: "बप्पा के दर्शन, आरती और प्रसाद के लिए आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "गणेशोत्सव",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "ગણેશ ચતુર્થી",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "গণেশ চতুর্থী",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "விநாயகர் சதுர்த்தி",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  navratri: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "नवरात्रि",
      families: "शर्मा परिवार",
      first: "नवरात्रि उत्सव",
      line: "गरबा, आरती और भोग की रातों में आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "नवरात्री",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "નવરાત્રી",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "দুর্গাপূজা",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "நவராத்திரி",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  janmashtami: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "जन्माष्टमी",
      families: "शर्मा परिवार",
      first: "कृष्ण जन्मोत्सव",
      line: "भजन, झाँकी और आधी रात की आरती में आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "गोकुळाष्टमी",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "જન્માષ્ટમી",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "জন্মাষ্টমী",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "கிருஷ்ண ஜெயந்தி",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  onam: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "ओणम",
      families: "मेनन परिवार",
      first: "ओणम सद्या",
      line: "ओणम सद्या और पूक्कलम में हमारे साथ शामिल होने के लिए आपको आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "ओणम",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "ઓણમ",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "ওণাম",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "ஓணம்",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  sankranti: {
    hi: {
      doorLeft: "शुभ",
      doorRight: "संक्रांति",
      families: "पटेल परिवार",
      first: "पतंग उत्सव",
      line: "पतंग, तिल के लड्डू और पोंगल के दिन में आपको आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "मकर संक्रांत",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "ઉત્તરાયણ",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "পৌষ সংক্রান্তি",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "பொங்கல்",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  lohri: {
    hi: {
      doorLeft: "लोहड़ी",
      doorRight: "दी बधाइयाँ",
      families: "संधू परिवार",
      first: "लोहड़ी की रात",
      line: "अलाव, रेवड़ी, भांगड़ा और भोज के लिए आपको सादर आमंत्रित करते हैं",
    },
    mr: {
      doorLeft: "शुभ",
      doorRight: "निमंत्रण",
      families: "देशपांडे परिवार",
      first: "लोहडी",
      line: "या मंगल प्रसंगी आपणास आग्रहाचे निमंत्रण",
    },
    gu: {
      doorLeft: "શુભ",
      doorRight: "આમંત્રણ",
      families: "પટેલ પરિવાર",
      first: "લોહડી",
      line: "આ શુભ પ્રસંગે પધારવા ભાવભર્યું આમંત્રણ",
    },
    bn: {
      doorLeft: "শুভ",
      doorRight: "নিমন্ত্রণ",
      families: "বসু পরিবার",
      first: "লোহরি",
      line: "এই শুভ অনুষ্ঠানে আপনাকে সাদর আমন্ত্রণ জানাই",
    },
    ta: {
      doorLeft: "இனிய",
      doorRight: "அழைப்பு",
      families: "ஐயர் குடும்பத்தினர்",
      first: "லோஹ்ரி",
      line: "இந்த சுப நிகழ்ச்சிக்கு தங்களை அன்புடன் அழைக்கிறோம்",
    },
  },
  eid: {
    hi: {
      doorLeft: "ईद",
      doorRight: "मुबारक",
      families: "ख़ान परिवार",
      first: "इफ़्तार दावत",
      line: "इफ़्तार की दावत में हमारे साथ रोज़ा खोलने के लिए आपको आमंत्रित करते हैं",
      blessing: "ईद मुबारक",
    },
    mr: {
      doorLeft: "ईद",
      doorRight: "मुबारक",
      families: "खान परिवार",
      first: "इफ्तार दावत",
      line: "इफ्तारच्या दावतीला आपणास आग्रहाचे निमंत्रण",
      blessing: "ईद मुबारक",
    },
    gu: {
      doorLeft: "ઈદ",
      doorRight: "મુબારક",
      families: "ખાન પરિવાર",
      first: "ઇફ્તાર દાવત",
      line: "ઇફ્તારની દાવતમાં પધારવા ભાવભર્યું આમંત્રણ",
      blessing: "ઈદ મુબારક",
    },
    bn: {
      doorLeft: "ঈদ",
      doorRight: "মোবারক",
      families: "খান পরিবার",
      first: "ইফতার দাওয়াত",
      line: "ইফতারের দাওয়াতে আপনাকে সাদর আমন্ত্রণ জানাই",
      blessing: "ঈদ মোবারক",
    },
    ta: {
      doorLeft: "ஈத்",
      doorRight: "முபாரக்",
      families: "கான் குடும்பத்தினர்",
      first: "இஃப்தார் விருந்து",
      line: "இஃப்தார் விருந்திற்கு தங்களை அன்புடன் அழைக்கிறோம்",
      blessing: "ஈத் முபாரக்",
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

/**
 * The line that greets a guest by name on the first screen when they come by their own
 * link, in the card's language. Drafts for a native proofreader.
 */
export const CARD_GREETING_WORDS: Record<CardLanguage, { dear: string; invited: string }> = {
  en: { dear: "Dear", invited: "You are warmly invited" },
  hi: { dear: "प्रिय", invited: "आपको सादर आमंत्रित करते हैं" },
  mr: { dear: "प्रिय", invited: "आपणास सस्नेह आमंत्रण" },
  gu: { dear: "પ્રિય", invited: "આપને સ્નેહભર્યું આમંત્રણ" },
  bn: { dear: "প্রিয়", invited: "আপনাকে সাদর আমন্ত্রণ" },
  ta: { dear: "அன்புள்ள", invited: "உங்களை அன்புடன் அழைக்கிறோம்" },
};
