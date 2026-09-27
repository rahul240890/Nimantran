import type * as en from "../gallery";
import type { Translation } from "@/i18n/text";

/* हिन्दी: गैलरी के अवसर, शादी के प्रकार, खोज और डिज़ाइन की झलक। English: src/content/gallery.ts. */

export const galleryCopy: Translation<typeof en.galleryCopy> = {
  metaTitle: "हर अवसर के लिए निमंत्रण डिज़ाइन",
  metaDescription:
    "चुनिए आप क्या मना रहे हैं, फिर उसी के लिए बना डिज़ाइन: परंपरा के हिसाब से शादी, हल्दी, संगीत और भी बहुत कुछ, चित्रित पन्नों और जवाब के साथ।",
  eyebrow: "निमंत्रण बनाएँ",
  heading: "आप क्या मना रहे हैं?",
  intro:
    "अवसर चुनिए, फिर उसी के लिए बना डिज़ाइन। हर डिज़ाइन पूरी स्क्रीन के चित्रित पन्नों में खुलता है, हर रस्म का अपना पन्ना, और जवाब देने की सुविधा साथ में।",
  searchLabel: "अवसर और डिज़ाइन खोजें",
  searchPlaceholder: "जैसे गुजराती शादी, हल्दी, जन्मदिन…",
  clearSearch: "खोज साफ़ करें",
  results: (count: number) =>
    count === 0 ? "अभी कुछ नहीं मिला" : count === 1 ? "1 नतीजा" : `${count} नतीजे`,
  noResults: "इससे अभी कुछ नहीं मिला। कोई और शब्द आज़माइए, या नीचे अवसर देखिए।",
  resultKinds: { occasion: "अवसर", kind: "शादी", design: "डिज़ाइन" },
  soon: "जल्द आ रहा है",
  soonNote: "इस अवसर के डिज़ाइन बन रहे हैं। शादी के डिज़ाइन आज ही तैयार हैं।",
  designsCount: (count: number) => (count === 1 ? "1 डिज़ाइन" : `${count} डिज़ाइन`),
  chooseKind: "अपनी शादी चुनिए",
  chooseKindIntro:
    "हर प्रकार के अपने रस्मों के नाम, आशीर्वचन, भाषा और चित्र हैं। एडिटर में इनमें से कुछ भी बदल सकते हैं।",
  allWeddingDesigns: "शादी के सभी डिज़ाइन",
  designsHeading: "डिज़ाइन",
  designsFor: (name: string) => `${name} के डिज़ाइन`,
  kindIntro:
    "सिर्फ़ इसी तरह की शादी के लिए बने डिज़ाइन। कार्ड अपनी भाषा में लिखा जाता है, और साथ में अंग्रेज़ी भी जोड़ सकते हैं।",
  card: "3D कार्ड",
  pagesCount: (count: number) => `${count} पन्ने`,
  preview: (name: string) => `${name} की झलक देखें`,
  useDesign: "यह डिज़ाइन चुनें",
  close: "झलक बंद करें",
  pagesLabel: "इस डिज़ाइन के पन्ने",
  cardNote: "मेहमान के फ़ोन पर खुलने वाला 3D कार्ड, फिर कार्ड के अपने रंगों में पन्ने।",
  pageNames: {
    cover: "मुखपृष्ठ",
    family: "परिवार",
    haldi: "हल्दी",
    mehendi: "मेहँदी",
    sangeet: "संगीत",
    baraat: "बारात",
    wedding: "विवाह",
    reception: "स्वागत समारोह",
    reply: "जवाब",
  },
  previous: "पिछला पन्ना",
  next: "अगला पन्ना",
  pageOf: (index: number, total: number) => `${total} में से पन्ना ${index}`,
  breadcrumb: "निमंत्रण",
  kindMeta: (name: string) => ({
    title: `${name} शादी के निमंत्रण`,
    description: `${name} परिवारों के लिए शादी के निमंत्रण: हर रस्म का चित्रित पन्ना, रस्मों के अपने नाम, और WhatsApp पर जवाब।`,
  }),
  moreOccasions: "और अवसर",
};

export const sectionNames: Translation<typeof en.sectionNames> = {
  wedding: "शादी का सफ़र",
  family: "परिवार के पल",
  parties: "पार्टी और कॉलेज",
  festivals: "त्योहार",
  business: "व्यापार",
};

export const occasionTaglines: Translation<typeof en.occasionTaglines> = {
  wedding: "हर रस्म, परंपरा के हिसाब से",
  engagement: "अँगूठियाँ और पहला जश्न",
  roka: "परिवारों की हाँ",
  "save-the-date": "पहले से बता दीजिए",
  haldi: "हल्दी और गेंदे के फूल",
  mehendi: "मेहँदी और सुकून भरी दोपहर",
  sangeet: "गीत, नृत्य और ढोलक",
  reception: "फेरों के बाद भोज",
  anniversary: "साथ के साल, जश्न के साथ",
  birthday: "पहले जन्मदिन से साठवें तक",
  "baby-shower": "गोद भराई और आशीर्वाद",
  "naming-ceremony": "नए नाम का स्वागत",
  mundan: "पहली बार बाल उतारना",
  housewarming: "गृह प्रवेश",
  puja: "सत्यनारायण, हवन, जागरण",
  "thread-ceremony": "जनेऊ और उपनयन",
  "fresher-party": "नए बैच का स्वागत",
  "welcome-party": "नए चेहरों के लिए",
  "farewell-party": "प्यार भरी विदाई",
  "kitty-party": "हर महीने की महफ़िल",
  reunion: "पुराने दोस्त, एक शाम",
  retirement: "एक लंबे सफ़र का जश्न",
  party: "छत, संगीत और दोस्त",
  diwali: "दीये और दावत",
  holi: "रंग और गुझिया",
  navratri: "नौ रातें, गरबा",
  "ganesh-chaturthi": "बप्पा घर आए",
  eid: "ईद मिलन और दावत",
  christmas: "कैरल और केक",
  "shop-opening": "उद्घाटन और पूजा",
  launch: "कुछ नया",
  "office-party": "पूरी टीम के साथ",
};

export const weddingKindCopy: Translation<typeof en.weddingKindCopy> = {
  "north-indian": {
    name: "उत्तर भारतीय",
    description: "तिलक, बारात और शुभ विवाह, हिन्दी और अंग्रेज़ी में।",
  },
  gujarati: {
    name: "गुजराती",
    description: "गणेश स्थापना, मामेरू, रास गरबा और हस्तमेलाप, गुजराती में।",
  },
  rajasthani: {
    name: "राजस्थानी और मारवाड़ी",
    description: "विनायक स्थापना, मायरा, निकासी और तोरण, हिन्दी में।",
  },
  marathi: {
    name: "मराठी",
    description: "साखरपुडा, हळद, केळवण और शुभविवाह, मराठी में।",
  },
  bengali: {
    name: "बंगाली",
    description: "आइबुड़ोभात, गाये होलुद, शुभो बिबाहो और बौ भात, बांग्ला में।",
  },
  tamil: {
    name: "तमिल और दक्षिण भारतीय",
    description: "निच्चयतार्थम, नलंगु और तिरुमणम, तमिल में।",
  },
  punjabi: {
    name: "पंजाबी और सिख",
    description: "ढोल और सरसों के खेतों वाली फुलकारी हवेली।",
  },
  muslim: {
    name: "निकाह और वलीमा",
    description: "सफ़ेद संगमरमर और जाली वाला मुग़ल बाग़।",
  },
  modern: {
    name: "आधुनिक",
    description: "हर परिवार के लिए सादे कार्ड, अंग्रेज़ी या हिन्दी में।",
  },
};
