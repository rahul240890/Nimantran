import type * as en from "../gallery";
import type { Translation } from "@/i18n/text";

/* मराठी: गॅलरीतील प्रसंग, लग्नाचे प्रकार, शोध आणि डिझाइनची झलक. English: src/content/gallery.ts. Draft for a native proofreader. */

export const galleryCopy: Translation<typeof en.galleryCopy> = {
  metaTitle: "प्रत्येक प्रसंगासाठी निमंत्रण डिझाइन",
  metaDescription:
    "आपण काय साजरे करत आहात ते निवडा, मग त्यासाठीच बनवलेले डिझाइन: परंपरेनुसार लग्न, हळद, संगीत आणि बरेच काही, चित्रित पाने आणि RSVP एकाच लिंकमध्ये.",
  eyebrow: "निमंत्रण बनवा",
  heading: "आपण काय साजरे करत आहात?",
  intro:
    "प्रसंग निवडा, मग त्यासाठीच बनवलेले डिझाइन. ‘दृश्य’ प्रकारात सर्व काही एकाच चित्रावर असते, प्रत्येक सोहळा आळीपाळीने उडत येतो. ‘गोष्ट’ प्रकारात प्रत्येक सोहळ्याचे स्वतःचे पूर्ण स्क्रीनचे चित्रित पान असते. दोन्हींमध्ये उत्तर देण्याची सोय आहेच.",
  searchLabel: "प्रसंग आणि डिझाइन शोधा",
  searchPlaceholder: "उदा. गुजराती लग्न, हळद, वाढदिवस…",
  clearSearch: "शोध पुसा",
  results: (count: number) =>
    count === 0 ? "अजून काहीही जुळले नाही" : count === 1 ? "1 निकाल" : `${count} निकाल`,
  noResults: "याच्याशी अजून काहीही जुळत नाही. दुसरा शब्द वापरून पाहा, किंवा खालील प्रसंग पाहा.",
  resultKinds: { occasion: "प्रसंग", kind: "लग्न", design: "डिझाइन" },
  moreCelebrations: "आणखी सोहळे",
  soon: "लवकरच येत आहे",
  designsCount: (count: number) => (count === 1 ? "1 डिझाइन" : `${count} डिझाइन`),
  chooseKind: "आपले लग्न निवडा",
  chooseKindIntro:
    "प्रत्येक प्रकाराची स्वतःची विधींची नावे, आशीर्वचन, भाषा आणि चित्रे आहेत. एडिटरमध्ये यांपैकी काहीही बदलता येते.",
  allWeddingDesigns: "लग्नाची सर्व डिझाइन",
  designsHeading: "डिझाइन",
  designsFor: (name: string) => `${name} साठी डिझाइन`,
  kindIntro:
    "फक्त याच प्रकारच्या लग्नासाठी बनवलेली डिझाइन. कार्ड त्याच्या स्वतःच्या भाषेत लिहिलेले असते, आणि शेजारी इंग्रजीही जोडता येते.",
  card: "3D कार्ड",
  formats: {
    label: "निमंत्रणाचा प्रकार",
    all: "सर्व",
    moving: "हलती दृश्ये",
    storybook: "चित्रकथा",
    scene: "दृश्य",
    story: "गोष्ट",
    card: "3D कार्ड",
  },
  tiers: { free: "फ्री", premium: "प्रीमियम", royal: "रॉयल", signature: "सिग्नेचर" },
  tierPrice: (tier, price) => `${tier} · ${price}`,
  tierLabel: (tier, price) =>
    price ? `${tier} डिझाइन, ${price} पासून प्रकाशित करा` : "मोफत डिझाइन",
  photoNeeds: {
    none: "फोटोची गरज नाही",
    one: "एक फोटो",
    couple: "जोडप्याचा एक फोटो",
    two: "दोन फोटो, प्रत्येकी एक",
    either: "जोडप्याचा फोटो किंवा दोन वेगळे",
    optional: "फोटो ऐच्छिक",
  },
  sceneBadge: "दृश्य · 1 पान",
  trendingBadge: "ट्रेंडिंग",
  movingBadge: "चलचित्र",
  storyBadge: (count) => `गोष्ट · ${count} पाने`,
  sceneNote:
    "आपले फोटो आणि नावे असलेले एक चित्र. प्रत्येक सोहळा आळीपाळीने उडत येतो, आणि चित्रातील प्रकाश सकाळपासून रात्रीपर्यंत त्यासोबत बदलतो.",
  sample: {
    first: "अर्जुन",
    second: "सिया",
    one: "आन्या",
    blessing: "श्री गणेशाच्या आशीर्वादाने",
    faithNames: {
      sikh: { first: "अर्जन", second: "सिमरन" },
      muslim: { first: "अयान", second: "झोया" },
      christian: { first: "जोएल", second: "अ‍ॅना" },
      jain: { first: "ऋषभ", second: "विधी" },
    },
    families: "आपल्या कुटुंबीयांसह",
    line: "आपल्या शुभविवाहासाठी आपणास सस्नेह आमंत्रित करत आहेत",
    venues: {
      haldi: "कुटुंबाचे घर, जयपूर",
      mehendi: "वाड्याचे अंगण, जयपूर",
      sangeet: "गच्चीवरील लॉन, जयपूर",
      baraat: "हॉटेलच्या प्रवेशद्वारापासून",
      wedding: "रामबाग पॅलेस, जयपूर",
      reception: "जय महाल, जयपूर",
      other: "गार्डन लॉन्स, जयपूर",
    },
  },
  pagesCount: (count: number) => `${count} पाने`,
  preview: (name: string) => `${name} ची झलक पाहा`,
  useDesign: "हे डिझाइन वापरा",
  packagesHeading: "या डिझाइनसाठी पॅकेज",
  packageFree: "मोफत",
  comparePackages: "पॅकेजची तुलना करा",
  seeSample: "पाहुण्यासारखे उघडा",
  sampleLabel: "नमुना निमंत्रण",
  sampleNote: "नावे, तारखा आणि ठिकाणे काल्पनिक आहेत",
  showAll: (count: number) => `सर्व ${count} डिझाइन दाखवा`,
  sampleChoose: "हे डिझाइन निवडा",
  sampleWalk: "इतर डिझाइन",
  samplePrevious: "मागील डिझाइन",
  samplePreviousShort: "मागील",
  sampleNext: "पुढील डिझाइन",
  sampleNextShort: "पुढील",
  sampleTitle: (name) => `नमुना निमंत्रण: ${name}`,
  sampleDescription:
    "हे डिझाइन आपल्या पाहुण्यांना दिसेल तसे पाहा: ते उघडते, संगीत वाजवते आणि उत्तरे घेते.",
  close: "झलक बंद करा",
  pagesLabel: "या डिझाइनमधील पाने",
  cardNote: "पाहुण्याच्या फोनवर उघडणारे 3D कार्ड, आणि त्यानंतर कार्डच्याच रंगांतील पाने.",
  pageNames: {
    blessing: "आशीर्वाद",
    cover: "मुखपृष्ठ",
    family: "कुटुंब",
    haldi: "हळद",
    mehendi: "मेहंदी",
    sangeet: "संगीत",
    baraat: "वरात",
    wedding: "विवाह",
    reception: "स्वागत समारंभ",
    reply: "उत्तर",
  },
  previous: "मागील पान",
  next: "पुढील पान",
  pageOf: (index: number, total: number) => `${total} पैकी पान ${index}`,
  breadcrumb: "निमंत्रणे",
  kindMeta: (name: string) => ({
    title: `${name} लग्नाची निमंत्रणे`,
    description: `${name} कुटुंबांसाठी लग्नाची निमंत्रणे: प्रत्येक सोहळ्यासाठी चित्रित पान, प्रत्येक विधी त्याच्या स्वतःच्या नावाने, आणि WhatsApp वर RSVP.`,
  }),
  moreOccasions: "आणखी प्रसंग",
  wordingHeading: "निमंत्रणाचे शब्द",
  wordingIntro: "कार्ड आणि WhatsApp साठी कॉपी करण्याजोगे संदेश, आमच्या ब्लॉगवरून.",
};

export const sectionNames: Translation<typeof en.sectionNames> = {
  wedding: "लग्नाचा प्रवास",
  family: "कुटुंबाचे क्षण",
  parties: "पार्टी आणि कॉलेज",
  festivals: "सण",
  business: "व्यवसाय",
};

export const occasionTaglines: Translation<typeof en.occasionTaglines> = {
  wedding: "प्रत्येक सोहळा, परंपरेनुसार",
  engagement: "अंगठ्या आणि पहिला सोहळा",
  roka: "कुटुंबांचा होकार",
  "save-the-date": "आधीच कळवा",
  haldi: "हळद आणि झेंडूची फुले",
  mehendi: "मेंदी आणि निवांत दुपार",
  sangeet: "गाणी, नृत्य आणि ढोलकी",
  reception: "लग्नानंतरचे स्नेहभोजन",
  anniversary: "सहवासाची वर्षे, साजरी",
  birthday: "पहिल्या वाढदिवसापासून साठीपर्यंत",
  "baby-shower": "डोहाळे जेवण आणि आशीर्वाद",
  "naming-ceremony": "नव्या नावाचे स्वागत",
  mundan: "पहिल्यांदा जावळ काढणे",
  housewarming: "गृहप्रवेश",
  puja: "सत्यनारायण, होम, जागरण",
  "thread-ceremony": "मुंज आणि उपनयन",
  "fresher-party": "नव्या बॅचचे स्वागत",
  "welcome-party": "नव्या चेहऱ्यांसाठी",
  "farewell-party": "प्रेमळ निरोप",
  "kitty-party": "दर महिन्याचा मेळावा",
  reunion: "जुने मित्र, एक संध्याकाळ",
  retirement: "कारकिर्दीचा सन्मान",
  party: "गच्ची, संगीत आणि मित्र",
  diwali: "पणत्या आणि मेजवानी",
  lohri: "शेकोटी आणि भांगडा",
  sankranti: "पतंग आणि पोंगल",
  onam: "पूक्कलम आणि सद्या",
  janmashtami: "कान्हाचा जन्मदिवस",
  "prayer-meet": "प्रेमळ स्मृतीत",
  christening: "बाप्तिस्मा आणि भोजन",
  annaprashan: "पहिला घास",
  holi: "रंग आणि करंजी",
  navratri: "गरब्याच्या नऊ रात्री",
  "ganesh-chaturthi": "बाप्पा घरी आले",
  eid: "ईद मिलन आणि दावत",
  graduation: "पदवीधरासाठी एक जल्लोष",
  "gudi-padwa": "गुढी, कडुलिंब आणि पुरणपोळी",
  baisakhi: "सुगी, भांगडा आणि गिद्धा",
  bihu: "बिहू गीते, नृत्य आणि पिठा",
  "raksha-bandhan": "राखी, गोडधोड आणि कुटुंबासोबत जेवण",
  "karva-chauth": "उपवास, चंद्र आणि रात्रीचे जेवण",
  christmas: "कॅरल आणि केक",
  "shop-opening": "उद्घाटन आणि पूजा",
  launch: "काहीतरी नवे",
  "office-party": "संपूर्ण टीमसोबत",
};

export const weddingKindCopy: Translation<typeof en.weddingKindCopy> = {
  "north-indian": {
    name: "उत्तर भारतीय",
    description: "तिलक, बारात आणि शुभ विवाह, हिंदी आणि इंग्रजीत.",
  },
  gujarati: {
    name: "गुजराती",
    description: "गणेश स्थापना, मामेरू, रास गरबा आणि हस्तमेळाप, गुजरातीत.",
  },
  rajasthani: {
    name: "राजस्थानी आणि मारवाडी",
    description: "विनायक स्थापना, मायरा, निकासी आणि तोरण, हिंदीत.",
  },
  marathi: {
    name: "मराठी",
    description: "साखरपुडा, हळद, केळवण आणि शुभविवाह, मराठीत.",
  },
  bengali: {
    name: "बंगाली, ओडिया आणि आसामी",
    description: "आइबुडोभात, गाये होलुद, शुभो बिबाहो आणि बौ भात, बंगालीत.",
  },
  tamil: {
    name: "तमिळ आणि दक्षिण भारतीय",
    description: "निच्चयतार्थम, नलंगु आणि तिरुमणम, तमिळमध्ये.",
  },
  punjabi: {
    name: "पंजाबी आणि शीख",
    description: "ढोल आणि मोहरीच्या शेतांसह फुलकारी हवेली.",
  },
  muslim: {
    name: "निकाह आणि वलीमा",
    description: "पांढऱ्या संगमरवराची आणि जाळीची मुघल बाग.",
  },
  modern: {
    name: "आधुनिक",
    description: "कोणत्याही कुटुंबासाठी साधी कार्डे, इंग्रजी किंवा हिंदीत.",
  },
};

export const catalogCopy: Translation<typeof en.catalogCopy> = {
  searchLabel: "डिझाइन शोधा",
  searchPlaceholder: "नाव, ठिकाण किंवा परंपरेने शोधा…",
  occasionLabel: "प्रसंग",
  allOccasions: "सर्व प्रसंग",
  traditionLabel: "लग्नाची परंपरा",
  allTraditions: "सर्व परंपरा",
  count: (count: number) => (count === 1 ? "1 डिझाइन" : `${count} डिझाइन`),
  clear: "फिल्टर काढा",
  empty: "या सगळ्यांशी जुळणारे डिझाइन अजून नाही. कमी फिल्टर वापरून पाहा.",
  photosLabel: "चित्र की फोटो",
  allPhotos: "कोणतेही",
  photoGroups: { none: "चित्रांचे", one: "जोडप्याचा फोटो", two: "वधू-वराचे फोटो" },
  allDesigns: "सर्व डिझाइन",
  moreOccasions: "आणखी प्रसंग",
  fewerOccasions: "कमी प्रसंग",
  moreFilters: (chosen) => (chosen ? `आणखी फिल्टर (${chosen})` : "आणखी फिल्टर"),
  fewerFilters: "कमी फिल्टर",
  priceLabel: "किंमत",
  allPrices: "कोणतीही किंमत",
  sortLabel: "डिझाइनचा क्रम",
  sorts: {
    recommended: "सुचवलेले",
    "price-low": "किंमत: कमी ते जास्त",
    "price-high": "किंमत: जास्त ते कमी",
  },
};

/** संग्रह: डिझाइन त्यांच्या रूप आणि भावानुसार. */
export const collectionCopy: Translation<typeof en.collectionCopy> = {
  heading: "संग्रहानुसार निवडा",
  intro: "प्रत्येक डिझाइन त्याच्या रूप आणि भावानुसार एका संग्रहात आहे.",
  label: "संग्रह",
  all: "सर्व संग्रह",
  groups: { wedding: "लग्नाचे संग्रह", celebration: "प्रत्येक सोहळ्यासाठी" },
  rowsHeading: "संग्रह",
  name: (name: string) => `${name} संग्रह`,
  names: {
    "royal-wedding": {
      name: "राजेशाही लग्न",
      intro: "महाल, किल्ले आणि हवेल्या, भव्य सोहळ्यासाठी सजलेले.",
    },
    nawabi: { name: "नवाबी निकाह", intro: "मुघल बागा, अवधी कमानी आणि सूफी रात्री." },
    divine: { name: "दिव्य आशीर्वाद", intro: "मंदिरे, घाट आणि पवित्र कला, शुभ आरंभासाठी." },
    "folk-art": {
      name: "लोककला",
      intro: "मधुबनी, वारली, गोंड, पिछवाई आणि आणखी, हाताने रंगवलेली.",
    },
    "silk-thread": {
      name: "रेशीम आणि धागा",
      intro: "पटोला, बांधणी, फुलकारी, कांजीवरम रेशीम आणि कुंदन.",
    },
    garden: { name: "बहरलेली बाग", intro: "गुलमोहर, गुलाब, मोगरा आणि पिओनी फुलांचा बहर." },
    destination: {
      name: "डेस्टिनेशन आणि निसर्ग",
      intro: "समुद्रकिनारे, बॅकवॉटर, डोंगर आणि तलाव.",
    },
    modern: { name: "मॉडर्न मिनिमल", intro: "स्वच्छ रेषा, सौम्य रंग आणि शांत मोकळी जागा." },
    "love-story": {
      name: "प्रेमकथा",
      intro: "सेव्ह द डेट आणि साखरपुडा, खेळकर, रोमँटिक ढंगात.",
    },
    functions: {
      name: "हळद, मेहंदी आणि संगीत",
      intro: "लग्नाचा प्रत्येक सोहळा, रोक्यापासून पाठवणीपर्यंत.",
    },
    storybook: { name: "चित्रकथा", intro: "नऊ चित्रित पानांमधून सांगितलेली एक गोष्ट." },
    "little-wonders": { name: "चिमुकली जादू", intro: "मुलांना आवडतील अशा वाढदिवस पार्टी." },
    baby: { name: "बाळाचे आशीर्वाद", intro: "डोहाळे जेवण, बारसे आणि उष्टावण." },
    milestones: {
      name: "कुटुंबाचे टप्पे",
      intro: "लग्नाचे वाढदिवस, खास वाढदिवस, गृहप्रवेश आणि सेवानिवृत्ती.",
    },
    festivals: { name: "सण", intro: "दिवाळी, ईद, होळी, नवरात्री, ओणम, ख्रिसमस आणि आणखी." },
    parties: {
      name: "पार्टी नाइट्स",
      intro: "गच्चीवरील पार्टी, स्नेहमेळावे, किटी पार्टी आणि निरोप समारंभ.",
    },
    business: { name: "व्यवसाय आणि लॉन्च", intro: "दुकानांची उद्घाटने, मुहूर्त आणि लॉन्च." },
    "cards-3d": { name: "क्लासिक 3D कार्डे", intro: "पाहुण्याच्या हातात 3D मध्ये उघडणारी कार्डे." },
  },
};

export const shelfCopy: Translation<typeof en.shelfCopy> = {
  trending: {
    group: "ट्रेंडिंग",
    title: "सध्या ट्रेंडिंग",
    intro: "यजमान सध्या सर्वाधिक निवडत असलेली डिझाइन.",
  },
  groups: {
    moving: "नवे: हलती दृश्ये",
    photos: "चित्रांचे किंवा आपल्या फोटोसह",
    format: "निमंत्रणाच्या प्रकारानुसार",
    tradition: "परंपरेनुसार लग्न",
    occasion: "आणखी सोहळे",
  },
  photos: {
    none: {
      title: "चित्रांची निमंत्रणे",
      intro: "आपल्या नावांसह हाताने रंगवलेली चित्रकला. फोटोची गरज नाही.",
    },
    one: {
      title: "जोडप्याच्या फोटोची निमंत्रणे",
      intro: "आपल्या दोघांचा आवडता फोटो, चित्रात बसवलेला.",
    },
    two: {
      title: "वधू-वराचे फोटो",
      intro: "आपल्या प्रत्येकाचा वेगळा फोटो, शेजारी शेजारी फ्रेममध्ये.",
    },
  },
  format: {
    moving: {
      title: "हलती दृश्ये",
      intro:
        "छोट्या चित्रपटासारखी हलणारी चित्रे: पाकळ्या पडतात, कंदील वर जातात, पाण्यावर तरंग उठतात. फोटोची गरज नाही.",
    },
    storybook: {
      title: "चित्रकथा",
      intro: "नऊ चित्रित पानांमधून सांगितलेली एक गोष्ट, जी स्वतःच्या दरवाजातून उघडते.",
    },
    story: { title: "गोष्टी", intro: "प्रत्येक सोहळ्यासाठी पूर्ण स्क्रीनचे चित्रित पान." },
    scene: {
      title: "दृश्ये",
      intro: "सर्व काही एकाच चित्रावर, प्रत्येक सोहळा आळीपाळीने येतो.",
    },
    card: { title: "3D कार्डे", intro: "पाहुण्याच्या हातात 3D मध्ये उघडणारे कार्ड." },
  },
  tradition: (name: string) => `${name} लग्न`,
  traditionsHeading: "आपली परंपरा निवडा",
  occasionsHeading: "किंवा दुसरा सोहळा",
  viewAll: "सर्व पाहा",
  viewAllLabel: (title: string, count: number) => `सर्व ${count} डिझाइन पाहा: ${title}`,
  back: "मागे",
  next: "पुढे",
};
