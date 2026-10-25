import type * as en from "../editor";
import type { Translation } from "@/i18n/text";
import type { LeadId, TaalId } from "@/lib/templates/ids";
import { designNames } from "./design-names";

/* हिन्दी: निमंत्रण एडिटर (/create)। English: src/content/editor.ts. */

export const editor: Translation<typeof en.editor> = {
  metaTitle: "अपना निमंत्रण बनाएँ",
  metaDescription: "3D डिज़ाइन चुनें, नाम और रस्में जोड़ें, फिर अपना निमंत्रण देखें।",
  headerLabel: "निमंत्रण एडिटर",
  opening: "आपका निमंत्रण खुल रहा है…",
  progressLabel: "निमंत्रण की प्रगति",
  progress: (step, total) => `${total} में से चरण ${step}`,
  done: "पूरा",
  designChosen: "आपका डिज़ाइन",
  changeDesign: "डिज़ाइन बदलें",
  stages: { design: "डिज़ाइन", details: "आपकी जानकारी", preview: "झलक और भेजें" },
  sections: {
    label: "आपकी जानकारी, छह हिस्सों में",
    open: (part, summary, state) =>
      `${part}: ${summary}${state === "done" ? ", पूरा" : state === "check" ? ", एक बार देखें" : ""}। खोलें`,
    done: "पूरा",
    check: "एक बार देखें",
    edit: "बदलें",
    names: (names) => (names.length ? names.join(" और ") : "नाम जोड़ें"),
    functions: (names) =>
      names.length === 0
        ? "अपनी रस्में चुनें"
        : names.length <= 3
          ? names.join(", ")
          : `${names.slice(0, 2).join(", ")} और ${names.length - 2} और`,
    family: (filled) => (filled ? "परिवार जोड़ा गया" : "वैकल्पिक: माता-पिता, आशीर्वाद और निमंत्रक"),
    photos: (photos) =>
      photos === 0 ? "अभी कोई तस्वीर नहीं" : `${photos} तस्वीर${photos === 1 ? "" : "ें"}`,
    words: (own) => (own ? "आपके अपने शब्द" : "आपके अवसर के लिए लिखे हुए"),
    music: (own, questions) =>
      `${own ? "आपका अपना संगीत" : "डिज़ाइन का संगीत"} · ${questions === 0 ? "कोई और सवाल नहीं" : `${questions} सवाल`}`,
  },
  back: "पीछे",
  next: "आगे बढ़ें",
  toPreview: "निमंत्रण देखें",
  preview: "निमंत्रण की झलक",
  showPreview: "झलक",
  previewTitle: "आपका निमंत्रण",
  livePreview: "लाइव झलक, बड़ा करके देखें",
  hideLivePreview: "लाइव झलक छिपाएँ",
  showLivePreview: "लाइव झलक दिखाएँ",
  close: "बंद करें",
  optional: "वैकल्पिक",
  characters: (used, max) => `${max} में से ${used} अक्षर`,
  fixErrors: (count) => (count === 1 ? "एक चीज़ पर ध्यान दें" : `${count} चीज़ों पर ध्यान दें`),
  errors: {
    required: "कृपया इसे भरें",
    "too-long": "यह कार्ड के लिए बहुत लंबा है",
    "no-functions": "कम से कम एक रस्म चुनें",
  },
  save: {
    idle: "ड्राफ़्ट इसी डिवाइस पर सहेजे जाते हैं",
    saving: "सहेज रहे हैं…",
    saved: "ड्राफ़्ट सहेजा गया",
    unavailable: "इस डिवाइस पर सहेज नहीं सकते",
  },
};

export const syncCopy: Translation<typeof en.syncCopy> = {
  idle: "आपके खाते में सहेजा जाता है",
  syncing: "सहेज रहे हैं…",
  synced: "आपके खाते में सहेजा गया",
  offline: "इस डिवाइस पर सहेजा, फिर कोशिश जारी",
  "needs-plan": "अभी लाइव नहीं: पैकेज चाहिए",
  missing: "यह निमंत्रण आपके खाते में नहीं है। शायद हटा दिया गया हो।",
  setAside:
    "दूसरे डिज़ाइन वाला आपका बदलाव अब “मेरे निमंत्रण” में अलग ड्राफ़्ट है। यह निमंत्रण वैसा ही खुलता है जैसा मेहमान देखते हैं।",
  switchFailed: "खुला हुआ निमंत्रण सहेज नहीं पाए, इसलिए वही खुला है। थोड़ी देर में फिर कोशिश करें।",
};

export const stepCopy: Translation<typeof en.stepCopy> = {
  occasion: {
    label: "अवसर",
    eyebrow: "अवसर चुनें",
    title: "आप क्या मना रहे हैं?",
    intro:
      "अवसर से निमंत्रण तैयार होता है: कौन-सी रस्में, कौन-से शब्द और कौन-से डिज़ाइन। बाद में बदलें तो भी आपका लिखा कुछ नहीं खोता।",
  },
  tradition: {
    label: "परंपरा",
    eyebrow: "परंपरा चुनें",
    title: "कार्ड किसकी परंपरा से बने?",
    intro:
      "परंपरा से कार्ड का शुभ चिह्न, सबसे ऊपर का मंगलाचरण, रस्मों के स्थानीय नाम और परिवार की शब्दावली तय होती है। सब कुछ बदला जा सकता है, और यह चरण छोड़ भी सकते हैं।",
  },
  design: {
    label: "डिज़ाइन",
    eyebrow: "डिज़ाइन चुनें",
    title: "वह डिज़ाइन चुनें जिसे मेहमान खोलेंगे",
    intro:
      "हर डिज़ाइन की अपनी पेंटिंग, अपना खुलना और अपना राग है। कभी भी बदलें, आपके लिखे सारे शब्द बने रहेंगे।",
  },
  couple: {
    label: "नाम",
    eyebrow: "नाम",
    title: "किसकी शादी है?",
    intro: "कार्ड की भाषा चुनें, फिर नाम लिखें। नाम हर डिज़ाइन पर बड़े अक्षरों में आते हैं।",
  },
  family: {
    label: "परिवार",
    eyebrow: "परिवार",
    title: "मेहमानों को कौन बुला रहा है?",
    intro:
      "माता-पिता, आशीर्वाद और निमंत्रक। सब वैकल्पिक है: जो भरेंगे वह परिवार वाले पन्ने पर आएगा।",
  },
  functions: {
    label: "रस्में",
    eyebrow: "रस्में",
    title: "सब कब और कहाँ है?",
    intro:
      "वे रस्में चुनें जिनमें मेहमानों को बुला रहे हैं। कार्ड पर मुख्य रस्म की तारीख़ और जगह आती है; खोलने पर मेहमान हर रस्म देखते हैं।",
  },
  photos: {
    label: "तस्वीरें",
    eyebrow: "तस्वीरें",
    title: "अपनी तस्वीरें जोड़ें",
    intro:
      "आपका डिज़ाइन अपने फ़्रेम में जो तस्वीरें दिखाता है वे जोड़ें, और मेहमानों के देखने के लिए और भी।",
  },
  words: {
    label: "कार्ड के शब्द",
    eyebrow: "कार्ड के शब्द",
    title: "कार्ड के शब्द पढ़ लीजिए",
    intro:
      "ऊपर के मंगलाचरण से लेकर हर पंक्ति आपके अवसर के लिए पहले से लिखी है। चाहें तो अपने परिवार के अंदाज़ में बदलें, या जैसी है वैसी रहने दें।",
  },
  music: {
    label: "संगीत और जवाब",
    eyebrow: "संगीत और जवाब",
    title: "संगीत और जवाब",
    intro:
      "कार्ड खुलते समय बजने वाला संगीत, जवाब में क्या पूछना है, और मेहमान किसे फ़ोन कर सकते हैं।",
  },
  preview: {
    label: "झलक",
    eyebrow: "झलक",
    title: "मेहमान यही देखेंगे",
    intro: "कार्ड खोलिए, संगीत चलाइए और एक बार फिर पढ़ लीजिए।",
  },
};

export { functionCopy } from "./functions";

export const functionFields: Translation<typeof en.functionFields> = {
  group: "रस्में",
  date: "तारीख़",
  datePlaceholder: "तारीख़ चुनें",
  time: "शुरू होने का समय",
  timePlaceholder: "समय चुनें",
  venue: "जगह",
  venuePlaceholder: "जैसे पिछोला लेकसाइड गार्डन्स, उदयपुर",
  city: "शहर या जगह",
  cityPlaceholder: "जैसे उदयपुर",
  cityHint: "सेव द डेट में सिर्फ़ तारीख़ और शहर चाहिए। समय और जगह निमंत्रण में आएँगे।",
  suggested: (occasion) => `${occasion} की रस्में`,
  more: "और रस्में",
  moreHint: "कोई और रस्म जोड़ें जिसमें मेहमानों को बुला रहे हैं।",
  showMore: (count) => `${count} और रस्में दिखाएँ`,
  address: "पता",
  addressHint: "मेहमानों को यह जगह के नाम के नीचे दिखेगा।",
  pin: "Google Maps पिन",
  pinHint:
    "Google Maps में जगह खोलें, Share दबाएँ और लिंक यहाँ चिपकाएँ। मेहमानों को नक़्शा और ठीक उसी जगह तक एक टैप में रास्ता मिलेगा।",
  pinInvalid: "यह Google Maps का लिंक नहीं है। Google Maps में Share से लिंक कॉपी करें।",
  parking: "पार्किंग",
  parkingPlaceholder: "मुख्य गेट पर वैले, हॉल के पीछे मुफ़्त पार्किंग",
  dressCode: "ड्रेस कोड",
  dressIdeas: "ड्रेस कोड के सुझाव",
  onCard: "कार्ड पर",
  endTime: "ख़त्म होने का समय",
  endHint: "देर तक चलना हो तो ख़ाली छोड़ दें।",
  muhuratHint: "शुरू और ख़त्म होने का सही समय, मिनट तक, चुनें। मेहमानों को ठीक वैसा ही दिखेगा।",
  moreDetails: "और जानकारी",
  moreDetailsHint: "ख़त्म होने का समय, पता, नक़्शे की पिन, पार्किंग और ड्रेस कोड",
  samePlace: "किसी और कार्यक्रम वाली जगह",
  sameAs: (name: string) => `${name} वाली जगह`,
  placeToEmpty: (count: number) => `यही जगह बाकी ${count} कार्यक्रमों में भरें`,
};

export const coupleCopy: Translation<typeof en.coupleCopy> = {
  namesHeading: "नाम",
  slotNames: {
    doorLeft: "बायाँ द्वार",
    doorRight: "दायाँ द्वार",
    blessing: "आशीर्वाद",
    families: "परिवार",
    first: "पहला नाम",
    joiner: "नामों के बीच",
    second: "दूसरा नाम",
    line: "निमंत्रण की पंक्ति",
    date: "तारीख़ और समय",
    venue: "जगह",
  },
  example: (sample) => `जैसे ${sample}`,
  joinerHint: "नामों के बीच का शब्द, जैसे &, संग या weds।",
  doorsHint: "द्वारों पर लिखे दो छोटे शब्द।",
  anyScript: "किसी भी लिपि में लिखें। हिन्दी, तमिल, बांग्ला और बाक़ी सब कार्ड पर आ जाती हैं।",
  latinOnCard: (language) =>
    `आपका कार्ड ${language} में है, इसलिए मेहमान यह नाम अंग्रेज़ी अक्षरों में देखेंगे। नीचे ${language} में लिखा नाम चुनें, या ${language} कीबोर्ड से टाइप करें।`,
  spellings: (language) => `${language} अक्षरों में`,
  useSpelling: (name) => `${name} लिखें`,
  languagesHeading: "कार्ड की भाषा",
  languagesHint: "दो भाषाएँ चुनने पर मेहमान निमंत्रण पर उनके बीच बदल सकते हैं।",
  bothLanguages: (main, second) => `${main} और ${second}`,
  secondHint: (main) => `कोई पंक्ति ख़ाली छोड़ें तो ${main} कार्ड वाले शब्द ही आएँगे।`,
  ideas: "सुझाव",
  ideasLabel: (field) => `${field} के सुझाव`,
  useIdea: (text) => `“${text}” लिखें`,
};

export const languageCopy: Translation<typeof en.languageCopy> = {
  mainHeading: "कार्ड की भाषा",
  mainHint: "नाम, शब्द, रस्मों के नाम और तारीख़ें सब इसी भाषा में आएँगे, और ये सारे कदम भी।",
  traditionMatch: "आपकी परंपरा की",
  secondHeading: "दूसरी भाषा भी जोड़ें?",
  secondHint:
    "मेहमान निमंत्रण पर दोनों भाषाओं के बीच बदल सकेंगे। यह वैकल्पिक है, और सेलिब्रेशन और ग्रैंड पैकेज में मिलती है।",
  secondNone: "सिर्फ़ एक भाषा",
};

export const namesCopy: Translation<typeof en.namesCopy> = {
  steps: {
    birthday: { label: "जन्मदिन", eyebrow: "जन्मदिन", title: "किसका जन्मदिन है?" },
    anniversary: { label: "जोड़ा", eyebrow: "जोड़ा", title: "किनकी सालगिरह है?" },
    party: { label: "पार्टी", eyebrow: "पार्टी", title: "पार्टी का नाम क्या है?" },
    "baby-shower": { label: "होने वाली माँ", eyebrow: "गोद भराई", title: "होने वाली माँ कौन हैं?" },
    diwali: { label: "दिवाली", eyebrow: "दिवाली", title: "आपकी दिवाली पार्टी का नाम क्या है?" },
    housewarming: { label: "घर", eyebrow: "नया घर", title: "नए घर का नाम क्या है?" },
    puja: { label: "पूजा", eyebrow: "पूजा", title: "आप कौन-सी पूजा रख रहे हैं?" },
    "thread-ceremony": { label: "बालक", eyebrow: "जनेऊ संस्कार", title: "किसका जनेऊ संस्कार है?" },
    annaprashan: { label: "बच्चा", eyebrow: "अन्नप्राशन", title: "बच्चे का नाम क्या है?" },
    christening: { label: "बच्चा", eyebrow: "बपतिस्मा", title: "बच्चे का नाम क्या है?" },
    "prayer-meet": {
      label: "स्मृति में",
      eyebrow: "श्रद्धांजलि सभा",
      title: "आप किसकी स्मृति में सभा रख रहे हैं?",
    },
    retirement: {
      label: "सेवानिवृत्त",
      eyebrow: "सेवानिवृत्ति",
      title: "कौन सेवानिवृत्त हो रहे हैं?",
    },
    "farewell-party": {
      label: "विदाई",
      eyebrow: "विदाई समारोह",
      title: "आप किसे विदा कर रहे हैं?",
    },
    "shop-opening": { label: "व्यवसाय", eyebrow: "उद्घाटन", title: "आपके व्यवसाय का नाम क्या है?" },
    launch: { label: "इवेंट", eyebrow: "लॉन्च", title: "आप क्या लॉन्च कर रहे हैं?" },
    "ganesh-chaturthi": {
      label: "गणपति",
      eyebrow: "गणेश चतुर्थी",
      title: "आपके गणपति उत्सव का नाम क्या है?",
    },
    navratri: { label: "उत्सव", eyebrow: "नवरात्रि", title: "आपके नवरात्रि उत्सव का नाम क्या है?" },
    janmashtami: {
      label: "उत्सव",
      eyebrow: "जन्माष्टमी",
      title: "आपके जन्माष्टमी उत्सव का नाम क्या है?",
    },
    onam: { label: "उत्सव", eyebrow: "ओणम", title: "आपके ओणम उत्सव का नाम क्या है?" },
    sankranti: {
      label: "उत्सव",
      eyebrow: "संक्रांति",
      title: "आपके संक्रांति उत्सव का नाम क्या है?",
    },
    lohri: { label: "उत्सव", eyebrow: "लोहड़ी", title: "आपकी लोहड़ी की रात का नाम क्या है?" },
    eid: { label: "दावत", eyebrow: "ईद और इफ़्तार", title: "आपकी दावत का नाम क्या है?" },
    "naming-ceremony": { label: "बच्चा", eyebrow: "नामकरण", title: "बच्चे का नाम क्या है?" },
    holi: { label: "उत्सव", eyebrow: "होली", title: "आपकी होली पार्टी का नाम क्या है?" },
    christmas: {
      label: "पार्टी",
      eyebrow: "क्रिसमस",
      title: "आपकी क्रिसमस पार्टी का नाम क्या है?",
    },
    reunion: { label: "रीयूनियन", eyebrow: "रीयूनियन", title: "कौन-सा बैच या ग्रुप मिल रहा है?" },
    graduation: { label: "ग्रेजुएट", eyebrow: "ग्रेजुएशन", title: "किसका ग्रेजुएशन है?" },
    "gudi-padwa": {
      label: "उत्सव",
      eyebrow: "गुड़ी पड़वा और उगादि",
      title: "आपके नववर्ष उत्सव का नाम क्या है?",
    },
    baisakhi: { label: "उत्सव", eyebrow: "बैसाखी", title: "आपके बैसाखी उत्सव का नाम क्या है?" },
    bihu: { label: "उत्सव", eyebrow: "बिहू", title: "आपके बिहू उत्सव का नाम क्या है?" },
    "raksha-bandhan": {
      label: "बहन और भाई",
      eyebrow: "रक्षाबंधन",
      title: "किनका रक्षाबंधन है?",
    },
    "karva-chauth": { label: "जोड़ी", eyebrow: "करवा चौथ", title: "कौन मना रहे हैं?" },
  },
  one: {
    birthday: { label: "जन्मदिन वाले का नाम", example: "आरव" },
    party: { label: "पार्टी का नाम", example: "दिवाली की रात" },
    "baby-shower": { label: "उनका नाम", example: "प्रिया" },
    diwali: { label: "पार्टी का नाम", example: "शर्मा परिवार की दिवाली" },
    housewarming: { label: "घर या परिवार का नाम", example: "शर्मा निवास" },
    puja: { label: "पूजा का नाम", example: "सत्यनारायण कथा" },
    "thread-ceremony": { label: "उसका नाम", example: "आरव" },
    annaprashan: { label: "बच्चे का नाम", example: "अनाया" },
    christening: { label: "बच्चे का नाम", example: "एरन" },
    "prayer-meet": { label: "उनका नाम", example: "श्री आर. के. शर्मा" },
    retirement: { label: "उनका नाम", example: "आर. के. शर्मा" },
    "farewell-party": { label: "नाम या बैच", example: "2026 बैच" },
    "shop-opening": { label: "व्यवसाय का नाम", example: "शर्मा ज्वेलर्स" },
    launch: { label: "इवेंट का नाम", example: "ऑरोरा लॉन्च" },
    "ganesh-chaturthi": { label: "उत्सव का नाम", example: "शर्मा परिवार के गणपति" },
    navratri: { label: "उत्सव का नाम", example: "नवरात्रि उत्सव" },
    janmashtami: { label: "उत्सव का नाम", example: "कृष्ण जन्मोत्सव" },
    onam: { label: "उत्सव का नाम", example: "ओणम सद्या" },
    sankranti: { label: "उत्सव का नाम", example: "पतंग उत्सव" },
    lohri: { label: "उत्सव का नाम", example: "लोहड़ी की रात" },
    eid: { label: "दावत का नाम", example: "इफ़्तार दावत" },
    "naming-ceremony": { label: "बच्चे का नाम", example: "अनाया" },
    holi: { label: "उत्सव का नाम", example: "होली मिलन" },
    christmas: { label: "पार्टी का नाम", example: "क्रिसमस पार्टी" },
    reunion: { label: "बैच या ग्रुप", example: "2006 का बैच" },
    graduation: { label: "ग्रेजुएट का नाम", example: "रिया" },
    "gudi-padwa": { label: "उत्सव का नाम", example: "गुड़ी पड़वा भोज" },
    baisakhi: { label: "उत्सव का नाम", example: "बैसाखी मेला" },
    bihu: { label: "उत्सव का नाम", example: "रंगाली बिहू" },
  },
  oneHint:
    "यह मुखपृष्ठ पर बड़े अक्षरों में छपता है। कौन बुला रहा है और क्यों, यह नीचे के शब्दों में लिखें।",
};

const LEAD_NAMES: Record<LeadId, string> = {
  santoor: "संतूर",
  sitar: "सितार",
  bansuri: "बांसुरी",
  shehnai: "शहनाई",
  veena: "वीणा",
};

const TAAL_NAMES: Record<TaalId, string> = {
  keherwa: "ढोलक",
  dadra: "ढोलक",
  garba: "गरबा ढोल और तालियाँ",
  bhangra: "पंजाबी ढोल",
};

export const extrasCopy: Translation<typeof en.extrasCopy> = {
  photosHeading: "तस्वीरें",
  photosHint: (max) =>
    `${max} तक तस्वीरें। सहेजने से पहले फ़ोन पर ही छोटी की जाती हैं, ताकि मेहमानों के लिए जल्दी खुलें।`,
  addPhotos: "तस्वीरें जोड़ें",
  dropHere: "या यहाँ छोड़ें",
  photo: (index) => `तस्वीर ${index}`,
  removePhoto: (index) => `तस्वीर ${index} हटाएँ`,
  moveEarlier: (index) => `तस्वीर ${index} पहले लाएँ`,
  full: (max) => `सभी ${max} हो गईं। नई जोड़ने के लिए एक हटाएँ।`,
  processing: "तस्वीरें तैयार हो रही हैं…",
  photoFailed: "यह तस्वीर नहीं पढ़ी जा सकी। JPEG या PNG आज़माएँ।",
  storageFailed: "इस ब्राउज़र में तस्वीरें सहेजी नहीं जा सकतीं, जैसे प्राइवेट मोड में।",
  emptyPhotos: "अभी कोई तस्वीर नहीं",
  emptyPhotosBody: "जोड़े की तस्वीरें और प्री-वेडिंग शूट सबसे अच्छे लगते हैं।",
  coupleHeading: "तस्वीर वाला पन्ना",
  coupleHint:
    "आपकी तस्वीर थीम के अपने फ़्रेम में, आपके नामों के बाद वाले पन्ने पर। हर थीम के फ़्रेम का आकार अलग है।",
  coupleLayouts: {
    none: "तस्वीर वाला पन्ना नहीं",
    one: "आप दोनों की एक तस्वीर",
    two: "दो तस्वीरें, दोनों की अलग-अलग",
  },
  photoHintOne: "आपकी तस्वीर थीम के अपने फ़्रेम में, नाम के बाद वाले पन्ने पर।",
  photoLayoutsOne: {
    none: "तस्वीर वाला पन्ना नहीं",
    one: "एक तस्वीर",
  },
  coupleAddFirst: "ऊपर तस्वीर जोड़ें, वह फ़्रेम में लग जाएगी।",
  designPhotosHeading: "आपके डिज़ाइन की तस्वीरें",
  designPhotosHint: (frames) =>
    frames === 1
      ? "वैकल्पिक। आपकी तस्वीर डिज़ाइन के अपने फ़्रेम में दिखेगी। तस्वीर के बिना भी डिज़ाइन पूरा दिखता है।"
      : "वैकल्पिक। हर फ़्रेम के लिए एक तस्वीर जोड़ें, या ऊपर आप दोनों की एक तस्वीर चुनें।",
  framePhotos: {
    together: "आप दोनों की तस्वीर",
    one: "आपकी तस्वीर",
    of: (name) => `${name} की तस्वीर`,
    first: "पहली तस्वीर",
    second: "दूसरी तस्वीर",
  },
  addFramePhoto: (frame) => `जोड़ें: ${frame}`,
  changeFramePhoto: (frame) => `बदलें: ${frame}`,
  framePhotoAdded: "जुड़ गई",
  framePhotoOptional: "वैकल्पिक",
  changePhoto: "तस्वीर बदलें",
  galleryHeading: "और तस्वीरें",
  galleryHint: (max) => `वैकल्पिक। मेहमान इन्हें निमंत्रण पर देख सकेंगे। कुल ${max} तस्वीरें तक।`,
  coupleFrame: (index, frames) =>
    frames === 1 ? "फ़्रेम की तस्वीर" : index === 1 ? "पहला फ़्रेम" : "दूसरा फ़्रेम",
  useThisPhoto: (index) => `तस्वीर ${index}`,
  fitHeading: "तस्वीरें फ़्रेम में बिठाएँ",
  fitHint: "हर तस्वीर को खिसकाएँ, बड़ा करें और सीधा करें, ताकि वह फ़्रेम में अच्छी लगे।",
  adjust: "ठीक करें",
  adjustLabel: (frame) => `तस्वीर ठीक करें: ${frame}`,
  adjusted: "ठीक की गई",
  adjustTitle: "तस्वीर ठीक करें",
  adjustDescription:
    "तस्वीर को खींचकर खिसकाएँ। बड़ा-छोटा करने के लिए दो उँगलियों से या स्लाइडर से ज़ूम करें।",
  adjustStage:
    "फ़्रेम में तस्वीर। खिसकाने के लिए तीर वाली कुंजियाँ और ज़ूम के लिए प्लस या माइनस दबाएँ।",
  zoom: "ज़ूम",
  straighten: "सीधा करें",
  turn: "घुमाएँ",
  turnLabel: "तस्वीर को दाईं ओर चौथाई घुमाएँ",
  resetPhoto: "पहले जैसा",
  savePhoto: "सहेजें",
  cancelPhoto: "रद्द करें",
  closePhoto: "बंद करें",
  musicHeading: "संगीत",
  musicHint: "कार्ड खुलते समय वहीं रचा गया राग, या आपका अपना गाना।",
  musicSource: { raga: "राग", own: "अपना संगीत" },
  chooseSong: "गाना चुनें",
  songNote: "MP3 या M4A। केवल वही गाने जिनके उपयोग का आपको अधिकार है।",
  readingSong: "आपका गाना पढ़ा जा रहा है…",
  songFailed: "यह फ़ाइल पढ़ी नहीं जा सकी। MP3 या M4A फ़ाइल आज़माएँ।",
  clipFailed: "इस ब्राउज़र में क्लिप नहीं बन सकी। Chrome या Safari आज़माएँ।",
  clipStorageFailed: "इस ब्राउज़र में संगीत सहेजा नहीं जा सकता, जैसे प्राइवेट मोड में।",
  waveformLabel: (name) => `${name} का आकार, रखा गया हिस्सा चमकता हुआ`,
  startAt: "शुरुआत",
  tooShort: (song, need) =>
    `यह गाना ${song} का है, और आपका निमंत्रण लगभग ${need} चलता है। लंबा गाना चुनें, ताकि संगीत बिना दोहराए अंत तक चले।`,
  chooseLonger: "दूसरा गाना चुनें",
  stopPart: "रोकें",
  makingClip: "आपकी क्लिप बन रही है…",
  cancelTrim: "रद्द करें",
  changeClip: "बदलें",
  removeClip: "हटाएँ",
  listenClip: "सुनें",
  clipMeta: (length) => `आपका संगीत · ${length}`,
  shortNote: (clip, need) =>
    `आपका निमंत्रण अब लगभग ${need} चलता है, जो इस ${clip} के हिस्से से लंबा है, इसलिए संगीत पहले ही रुक जाएगा। "बदलें" से हिस्सा फिर चुनें।`,
  listen: (raga) => `${raga} सुनें`,
  stopListening: "सुनना बंद करें",
  designsOwn: "डिज़ाइन का अपना",
  playOnOpen: "मेहमान कार्ड खोलें तो संगीत बजे",
  playOnOpenHint: "मेहमान कभी भी रोक सकते हैं।",
  pacing: {
    heading: "हर पन्ने का समय",
    hint: "संगीत और रील आपके पन्नों जितने लंबे चलते हैं। ऑटो में हर पन्ने को उसके शब्दों जितना समय मिलता है।",
    auto: "ऑटो",
    seconds: (n: number) => `${n} से.`,
    summary: (pages: number, live: number, reel: number) =>
      `${pages} पन्ने: निमंत्रण पर लगभग ${live} सेकंड संगीत, और ${reel} सेकंड की रील।`,
  },
  questionsHeading: "मेहमानों से सवाल",
  questionsHint:
    "हर जवाब में बताया जाता है कि हर रस्म में कौन आ रहा है, और एक संदेश भी। और जो जानना हो, उस पर निशान लगाएँ।",
  questionHints: {
    meal: "शाकाहारी, जैन, मांसाहारी या वीगन",
    arrival: "जिस दिन वे शहर पहुँचेंगे",
    stay: "क्या उन्हें कमरा चाहिए",
    pickup: "क्या उन्हें स्टेशन या हवाई अड्डे से लाना है",
    song: "कोई गाना जो वे सुनना चाहें",
  },
  ragaNames: {
    yaman: "राग यमन",
    khamaj: "राग खमाज",
    bihag: "राग बिहाग",
    desh: "राग देस",
    bhupali: "राग भूपाली",
    madhyamavati: "राग मध्यमावती",
    mand: "राग मांड",
    bhimpalasi: "राग भीमपलासी",
    pilu: "राग पीलू",
    bhairavi: "राग भैरवी",
    hamsadhwani: "राग हंसध्वनि",
    kafi: "राग काफ़ी",
  },
  ragaSound: (sound, mood) =>
    `${LEAD_NAMES[sound.lead]}${sound.taal ? ` और ${TAAL_NAMES[sound.taal]}` : ""} · ${mood}`,
  ragaMoods: {
    yaman: "शाम का, रूमानी",
    khamaj: "हल्का और कोमल",
    bihag: "देर शाम का, शादी का राग",
    desh: "बरसात का, उत्सवी",
    bhupali: "उजला और आनंदमय",
    madhyamavati: "शुभ, कर्नाटक संगीत",
    mand: "राजस्थानी लोक, शाही",
    bhimpalasi: "दोपहर का, भक्तिमय",
    pilu: "लोक रंग, चंचल",
    bhairavi: "कोमल, विदाई का राग",
    hamsadhwani: "शुभ, गणपति वंदना",
    kafi: "उत्सवी लोक, होली के रंग",
  },
};

export const faithCopy: Translation<typeof en.faithCopy> = {
  heading: "आपकी आस्था के अनुसार शब्द",
  intro:
    "नीचे सुझाए गए आशीर्वाद, पंक्तियाँ और द्वार के शब्द इसी के अनुसार हैं। सब कुछ आप बदल सकते हैं।",
  label: "आस्था",
  names: {
    hindu: "हिंदू",
    sikh: "सिख",
    muslim: "मुस्लिम",
    christian: "ईसाई",
    jain: "जैन",
    none: "धार्मिक पंक्तियाँ नहीं",
  },
  doorIdeas: "द्वार के शब्द",
  doorIdea: (left, right) => `“${left}” और “${right}” लिखें`,
};

export const traditionCopy: Translation<typeof en.traditionCopy> = {
  group: "परंपराएँ",
  none: "कोई परंपरा नहीं",
  noneHint: "डिज़ाइन की अपनी शब्दावली, कोई चिह्न नहीं",
  nearYou: "आपके यहाँ",
  draftNote:
    "ये परंपराएँ अभी शुरुआती रूप में हैं। हर समुदाय के लोग लॉन्च से पहले शब्द, चिह्न और रस्मों के नाम जाँच रहे हैं, इसलिए कुछ ठीक न लगे तो हमें ज़रूर बताएँ।",
  names: {
    "north-hindu": "उत्तर भारतीय हिन्दू",
    rajasthani: "राजस्थानी और मारवाड़ी",
    marathi: "मराठी",
    gujarati: "गुजराती",
    bengali: "बंगाली हिन्दू",
    tamil: "तमिल हिन्दू",
    modern: "आधुनिक",
  },
  hints: {
    "north-hindu": "श्री गणेशाय नमः, दर्शनाभिलाषी और स्वागतोत्सुक",
    rajasthani: "श्री गणेशाय नमः, पीठी और महिला संगीत",
    marathi: "श्री गणेशाय नमः, साखरपुडा और हळद",
    gujarati: "कंकोत्री की शब्दावली, गोळ धाणा, पीठी और बच्चों का टहुको",
    bengali: "प्रजापतये नमः, गाये हलुद और बौ भात",
    tamil: "पिल्लैयार सुऴि, निच्चयतार्थम और वरवेर्पु",
    modern: "कोई धार्मिक चिह्न नहीं, किसी भी जोड़े या अंतर-धार्मिक शादी के लिए",
  },
  elements: "शुभ चिह्न और मंगलाचरण",
  elementsIntro: (tradition: string) =>
    `कार्ड का सबसे ऊपरी हिस्सा, आपकी ${tradition} परंपरा से। चाहें तो बदलें या हटा दें।`,
  elementsLater: "शुभ चिह्न और मंगलाचरण, जैसे श्री गणेशाय नमः, आप कार्ड के शब्द में चुनेंगे।",
  symbol: "कार्ड के ऊपर शुभ चिह्न",
  symbolNames: {
    om: "ॐ",
    kalash: "मंगल कलश",
    swastik: "स्वस्तिक",
    diya: "दीया",
    prajapati: "प्रजापति",
    suzhi: "पिल्लैयार सुऴि",
    shri: "श्री",
    shankh: "शंख",
    kamal: "कमल",
    "ik-onkar": "इक ओंकार",
    khanda: "खंडा",
    "chand-tara": "चाँद-तारा",
    "786": "786",
    bismillah: "बिस्मिल्लाह",
    cross: "क्रॉस",
    dove: "कबूतर",
    jain: "जैन प्रतीक",
  },
  noSymbol: "कोई चिह्न नहीं",
  symbolIntro: "आपके कार्ड में सबसे ऊपर, हर शब्द के ऊपर। कोई एक चुनें या छोड़ दें।",
  symbolNote:
    "गणेश जी और दूसरे चित्रित देवता निमंत्रण खुलने पर आशीर्वाद दे सकते हैं: डिज़ाइन के साथ 'निमंत्रण कैसे खुले' में चुनें।",
  invocation: "मंगलाचरण",
  invocationModes: { script: "अपनी लिपि में", latin: "अंग्रेज़ी अक्षरों में", off: "न दिखाएँ" },
  meanings: {
    "Shri Ganeshaya Namah": "भगवान गणेश को नमन",
    "Prajapataye Namah": "विवाह के देवता प्रजापति को नमन",
    "Sri Vinayagar Thunai": "भगवान विनायक की कृपा से",
  },
  wording: "परिवार की शब्दावली",
  wordingIntro: "मेहमान इन्हें कार्ड के नीचे पढ़ेंगे। कोई भी खाली छोड़ सकते हैं।",
  wordingLabels: {
    blessingsFrom: "आशीर्वाद",
    requesters: "निमंत्रक",
    welcome: "स्वागतोत्सुक",
    children: "बच्चों की मनुहार",
  },
};

export const designCopy: Translation<typeof en.designCopy> = designNames.cards;

export const occasionCopy: Translation<typeof en.occasionCopy> = {
  group: "अवसर",
  setsUp: "यह क्या तैयार करता है",
  planned: "तय रस्में",
  questions: "मेहमानों से पूछा जाएगा",
  noQuestions: "बस यह कि वे आ रहे हैं और कितने लोग",
  designs: (count) => `${count} सुझाए गए डिज़ाइन`,
  suggestedBadge: "सुझाया गया",
  suggestedFor: (occasion) => `${occasion} के लिए सुझाया गया`,
  moreDesigns: "और डिज़ाइन",
};

export const previewCopy: Translation<typeof en.previewCopy> = {
  ready: "आपका निमंत्रण तैयार है",
  live: "आपका निमंत्रण लाइव है",
  liveBody: (link) => `मेहमान इसे ${link} पर खोलते हैं। यहाँ किए बदलाव वहाँ तुरंत दिखते हैं।`,
  readyBody:
    "यह इसी डिवाइस पर सहेजा गया है। इसे अपने खाते में रखने और प्रकाशित करने के लिए साइन इन करें, फिर लिंक WhatsApp पर भेजें।",
  readyBodyAccount:
    "यह तस्वीरों समेत आपके खाते में सहेजा गया है। पहले इसे मेहमानों की नज़र से देखें, फिर लिंक पाने के लिए प्रकाशित करें।",
  seeAsGuest: "मेहमानों की नज़र से देखें",
  watchVideo: "वीडियो में देखें",
  seeAsGuestBody: "पूरा निमंत्रण, पूरी स्क्रीन पर: खुलना, संगीत, हर पेज और जवाब का फ़ॉर्म।",
  familyTitle: "पहले परिवार को दिखाएँ",
  familyBody:
    "उन्हें जाँचने के लिए WhatsApp पर एक झलक भेजें। हर स्क्रीन पर ‘झलक’ लिखा रहता है और जवाब बंद रहते हैं, इसलिए इसे निमंत्रण की जगह नहीं भेजा जा सकता। आपके भेजने पर मेहमानों को साफ़ निमंत्रण मिलता है।",
  familySend: "परिवार को WhatsApp पर भेजें",
  familyCopy: "लिंक कॉपी करें",
  familyCopied: "लिंक कॉपी हो गया",
  familyFailed: "अभी लिंक नहीं बन सका। थोड़ी देर में फिर कोशिश करें।",
  familySignInBody:
    "साइन इन करें, हम एक झलक का लिंक बना देंगे जिसे आप परिवार को WhatsApp पर भेज सकें।",
  familySignIn: "भेजने के लिए साइन इन करें",
  familyMessage: (url) =>
    `हमारे निमंत्रण की एक झलक। देखकर बताइए कैसा लगा, फिर हम इसे भेजेंगे: ${url}`,
  notReady: "कुछ ब्योरा बाक़ी है",
  fix: (label) => `${label} पूरा करें`,
  occasionHeading: "अवसर",
  namesHeading: "नाम",
  functionsHeading: "रस्में",
  photosHeading: "तस्वीरें",
  noPhotos: "कोई तस्वीर नहीं जोड़ी",
  musicHeading: "संगीत",
  playsOnOpen: "मेहमानों के कार्ड खोलते ही बजता है",
  dressCode: "ड्रेस कोड",
  edit: "बदलें",
  editStep: (label) => `${label} बदलें`,
  startOver: "नया निमंत्रण शुरू करें",
  startOverTitle: "नया निमंत्रण शुरू करें?",
  startOverBody: "इससे इस डिवाइस पर सहेजे नाम, रस्में और तस्वीरें मिट जाएँगी।",
  startOverConfirm: "मिटाएँ और नए सिरे से शुरू करें",
  startOverKeepBody:
    "यह निमंत्रण मेरे निमंत्रण में रहेगा, आप कभी भी लौट सकते हैं। नया ख़ाली शुरू होगा।",
  startOverKeepConfirm: "नया निमंत्रण शुरू करें",
  cancel: "यही निमंत्रण रखें",
  cleared: "नया निमंत्रण शुरू हुआ",
};

export const suiteCopy: Translation<typeof en.suiteCopy> = {
  heading: "आपके अवसर के डिज़ाइन",
  moreDesigns: (count) => `${count} और डिज़ाइन दिखाएँ`,
  textBox: "शब्दों के पीछे डिब्बा",
  textBoxHint:
    "बंद रहने पर शब्द सीधे चित्र पर दिखते हैं। चालू करने पर वे कार्ड के रंग के हल्के डिब्बे में दिखते हैं। तुलना के लिए पन्ने चलाएँ; यही बटन पन्नों पर भी है।",
  blessingPage: "आशीर्वाद वाले पन्ने से शुरू करें",
  blessingPageHint:
    "यह थीम भगवान के चित्र और उसके नीचे आपके आशीर्वाद से शुरू होती है, आपके नामों से पहले।",
  names: designNames.names,
  descriptions: designNames.descriptions,
};

export const studioCopy: Translation<typeof en.studioCopy> = {
  pagesHint: "आप जो पन्ना भर रहे हैं, वह लिखते-लिखते यहाँ दिखता है।",
  pageNames: {
    gate: "द्वार",
    blessing: "आशीर्वाद",
    cover: "मुखपृष्ठ",
    couple: "फ़ोटो",
    family: "परिवार",
    "family-more": "परिवार, आगे",
    "family-end": "परिवार, अंत में",
    invite: "निमंत्रण",
    reply: "जवाब",
  },
  pageList: "निमंत्रण के पन्ने",
  showPage: (name) => `${name} का पन्ना दिखाएँ`,
  phone: (name) => `${name} का पन्ना, जैसा मेहमान देखेंगे`,
  lettering: "अक्षर",
  letteringIntro:
    "हर पन्ने पर शब्द कैसे दिखें, चुनें। सिर्फ़ वही फ़ॉन्ट दिखते हैं जो आपके कार्ड की भाषा लिख सकते हैं।",
  namesFont: "नाम",
  wordsFont: "बाक़ी शब्द",
  themeFont: "थीम का अपना",
  size: "आकार",
  sizes: { small: "छोटा", medium: "मध्यम", large: "बड़ा" },
  style: "नामों की शैली",
  bold: "मोटा",
  italic: "तिरछा",
  capitals: "बड़े अक्षर",
  colour: "नामों का रंग",
  colours: {
    theme: "थीम का अपना",
    maroon: "मरून",
    gold: "सुनहरा",
    saffron: "केसरिया",
    ink: "स्याही",
    ivory: "हाथीदाँत",
  },
  feels: {
    classic: "पारंपरिक",
    script: "बहता हुआ",
    bold: "गाढ़ा",
    clean: "सादा",
    handwritten: "हाथ से लिखा",
  },
  reset: "थीम के अक्षर वापस लाएँ",
};

export const familyCopy: Translation<typeof en.familyCopy> = {
  sideHeading: (name) => `${name} का परिवार`,
  sideFallback: { first: "पहला परिवार", second: "दूसरा परिवार" },
  relation: "कार्ड पर ऐसे छपेगा",
  relations: { child: "संतान", daughter: "सुपुत्री", son: "सुपुत्र" },
  parents: "माता-पिता के नाम",
  parentsExample: "श्रीमती सुनीता एवं श्री रमेश पटेल",
  parentsHint: "जैसे छपवाना चाहें वैसे लिखें, श्री, श्रीमती या स्व. के साथ।",
  town: "शहर या गाँव",
  townExample: "अहमदाबाद",
  more: "आशीर्वाद और निमंत्रक",
  examples: {
    blessingsFrom: "श्रीमती कमला देवी एवं श्री रामप्रसाद शर्मा",
    requesters: "समस्त शर्मा परिवार",
    welcome: "राहुल, प्रिया, अंकित",
    children: "मेरे चाचू की शादी में ज़रूर आना",
  },
  memory: "पुण्य स्मृति",
  memoryExample: "स्व. श्री मोहनलाल पटेल",
  memoryHint: "दिवंगत परिजन जिनका आशीर्वाद परिवार याद करता है।",
  contacts: "मेहमान किसे फ़ोन करें",
  contactName: "नाम",
  contactNameExample: "रमेश पटेल",
  phone: "फ़ोन",
  addContact: "नंबर जोड़ें",
  removeContact: (n) => `नंबर ${n} हटाएँ`,
};

export const pageWordsCopy: Translation<typeof en.pageWordsCopy> = {
  open: "यह पन्ना बदलें",
  title: (page) => `${page} का पन्ना`,
  description: "कोई भी पंक्ति बदलें, अपनी जोड़ें, और चुनें कि शब्द चित्र पर कहाँ दिखें।",
  close: "हो गया",
  words: "शब्द",
  line: (n) => `पंक्ति ${n}`,
  kind: (n) => `पंक्ति ${n} का प्रकार`,
  kinds: {
    label: "छोटा शीर्षक",
    script: "आशीर्वचन",
    display: "बड़ा",
    date: "तारीख़",
    venue: "स्थान",
    body: "सामान्य",
    small: "छोटे अक्षर",
  },
  up: (n) => `पंक्ति ${n} ऊपर करें`,
  down: (n) => `पंक्ति ${n} नीचे करें`,
  remove: (n) => `पंक्ति ${n} हटाएँ`,
  add: "पंक्ति जोड़ें",
  reset: "सुझाए गए शब्द वापस लाएँ",
  own: "यह पन्ना आपने खुद लिखा है। बाद में बदले गए नाम, तारीख़ या जगह यहाँ तभी दिखेंगे जब आप सुझाए गए शब्द वापस लाएँगे।",
  inLanguage: (language) => `ये शब्द ${language} कार्ड के लिए हैं।`,
  overflow:
    "इस चित्र के लिए शब्द बहुत ज़्यादा हैं, सबसे छोटे आकार में भी। कोई पंक्ति छोटी करें या हटाएँ।",
  placement: "जगह",
  place: "ऊँचाई",
  places: { top: "ऊपर", middle: "बीच में", bottom: "नीचे" },
  align: "संरेखण",
  aligns: { center: "बीच में", start: "बाईं ओर" },
  box: "शब्दों के पीछे डिब्बा",
  boxes: { theme: "बाकी पन्नों जैसा", on: "डिब्बा", off: "चित्र पर छपा" },
  hide: "यह पन्ना हटाएँ",
  hideHint: "मेहमानों को नहीं दिखेगा। कभी भी वापस चालू करें।",
  hidden: "हटाया गया",
};

export const aiCopy: Translation<typeof en.aiCopy> = {
  open: "AI से लिखवाएँ",
  title: "AI से शब्द लिखवाएँ",
  description:
    "AI आपके नाम, परिवार और रस्मों से पन्ने कार्ड की भाषा में लिखता है। बाद में कुछ भी बदलें।",
  close: "बंद करें",
  tone: "अंदाज़",
  tones: { traditional: "पारंपरिक", warm: "आत्मीय", fun: "मज़ेदार" },
  scope: "पन्ने",
  scopes: { all: "सभी पन्ने", page: (page) => `सिर्फ़ ${page} का पन्ना` },
  write: "लिखें",
  again: "फिर से लिखें",
  shorten: "AI से छोटा करें",
  busy: "लिखा जा रहा है…",
  done: "लिख दिया। शब्द बदलने के लिए कोई भी पन्ना खोलें।",
  left: (n) => `इस निमंत्रण पर ${n} मुफ़्त ड्राफ़्ट बाकी हैं।`,
  languages: (language) =>
    `${language} कार्ड के लिए लिखा गया। दूसरी भाषा के लिए ऊपर कार्ड की भाषा बदलें।`,
  errors: {
    "sign-in": "साइन इन करें ताकि निमंत्रण सेव हो, फिर AI उसके लिए लिख सकेगा।",
    off: "AI से लिखवाना अभी चालू नहीं है।",
    "not-found": "साइन इन करें ताकि निमंत्रण सेव हो, फिर AI उसके लिए लिख सकेगा।",
    "used-up":
      "इस निमंत्रण के 3 मुफ़्त ड्राफ़्ट पूरे हो गए। किसी भी पैकेज में जितनी बार चाहें लिखवाएँ।",
    failed: "अभी शब्द नहीं लिखे जा सके। फिर से कोशिश करें।",
  },
};

export const openingCopy: Translation<typeof en.openingCopy> = {
  heading: "खुलने वाला द्वार (कवर स्क्रीन)",
  intro:
    "लिंक खोलते ही मेहमान सबसे पहले यही देखेंगे: एक द्वार, दरवाज़े, परदा या कवर, जो पूरी स्क्रीन पर खुलकर आपका निमंत्रण दिखाता है। खुलते हुए देखने के लिए किसी पर टैप करें। आप इसे कभी भी बदल सकते हैं, भेजने के बाद भी।",
  filterLabel: "प्रकार से देखें",
  filterAll: "सभी",
  summaryBody: "निमंत्रण खुलने से पहले मेहमान सबसे पहले यही देखते हैं।",
  change: "द्वार बदलें",
  dialogTitle: "अपना खुलने वाला द्वार चुनें",
  dialogBody:
    "आपकी पसंद तुरंत सहेजी जाती है। मेहमानों वाला प्रीव्यू, वीडियो और आपका लाइव लिंक, सब इसी से खुलेंगे।",
  done: "हो गया",
  styles: {
    "jaali-vriksh": {
      name: "जीवन-वृक्ष जाली",
      description: "नक्काशीदार जाली से उड़कर महल-बाग़ में।",
    },
    pachchikari: {
      name: "पत्थर के फूल",
      description: "जड़े हुए फूल उठते हैं, संगमरमर नीचे सरकता है।",
    },
    "chik-baradari": {
      name: "बाँस की चिक",
      description: "चिक ऊपर लिपटती है, चाँदनी बारादरी दिखती है।",
    },
    "baori-deep": {
      name: "दीयों की बावड़ी",
      description: "दीयों से जगमगाती बावड़ी में नीचे उतरें।",
    },
    "ikat-dhaaga": {
      name: "इकत के धागे",
      description: "इकत रेशम धागा-धागा खुलता है।",
    },
    "olai-chuvadi": {
      name: "ताड़पत्र",
      description: "ताड़पत्र के पन्ने दोनों ओर सरकते हैं।",
    },
    "konark-chakra": {
      name: "कोणार्क चक्र",
      description: "पत्थर का पहिया रेत पर लुढ़क जाता है।",
    },
    "mandvi-dhow": {
      name: "गिरता पाल",
      description: "पैबंद लगा पाल तहों में गिरता है।",
    },
    shekhawati: {
      name: "सोने की खुरचन",
      description: "सोने की परत खुरचकर हवेली दिखती है।",
    },
    lehar: {
      name: "रेत पर लहर",
      description: "लहर रेत बहा ले जाती है।",
    },
    "naksha-pangong": {
      name: "मुड़ता नक्शा",
      description: "पुराना नक्शा मुड़कर झील पर उतरता है।",
    },
    "toran-mala": {
      name: "गिरते तोरण",
      description: "आम के पत्तों के तोरण एक-एक कर गिरते हैं।",
    },
    jhilmil: {
      name: "मिरर बॉल",
      description: "मिरर बॉल से हॉल रोशन होता है।",
    },
    "howrah-tareekh": {
      name: "कैलेंडर के पन्ने",
      description: "कैलेंडर के पन्ने दिन तक पलटते हैं।",
    },
    "barf-khidki": {
      name: "पाले वाली खिड़की",
      description: "शीशे से पाला पुँछकर पिघल जाता है।",
    },
    "pondy-gali": {
      name: "स्लाइडिंग पहेली",
      description: "पहेली के टुकड़े हटकर गली दिखाते हैं।",
    },
    "irani-carrom": {
      name: "कैरम बोर्ड",
      description: "कैरम बोर्ड झुककर सरक जाता है।",
    },
    channapatna: {
      name: "खिलौना ब्लॉक",
      description: "लकड़ी के ब्लॉकों की दीवार गिरती है।",
    },
    "ped-ghar": {
      name: "रंग भरना",
      description: "पेंसिल के चित्र में रंग भरते हैं।",
    },
    "jhalar-palna": {
      name: "पालने की छतरी",
      description: "लेस की छतरी पोटली की तरह ऊपर सिमटती है।",
    },
    "rajwada-pol": {
      name: "राजस्थानी महल का द्वार",
      description: "गुलाबी पत्थर के मेहराब में नक्काशीदार दरवाज़े दीयों से सजे आँगन में खुलते हैं।",
    },
    "gopuram-kadhavu": {
      name: "दक्षिण भारतीय मंदिर द्वार",
      description: "पीतल जड़े, घंटियों वाले दरवाज़े दीपों से जगमगाते मंडपम में खुलते हैं।",
    },
    "noor-darwaza": {
      name: "मुग़ल संगमरमर द्वार",
      description:
        "संगमरमर के मेहराब में चाँदी की जाली वाले दरवाज़े चाँदनी में नहाए फव्वारों वाले बाग़ में खुलते हैं।",
    },
    "phoolon-ki-deewar": {
      name: "फूलों की दीवार",
      description: "गुलाब और गेंदे की दीवार हटती है और रोशनी से सजा मंडप दिखता है।",
    },
    "haveli-kiwad": {
      name: "हवेली के किवाड़",
      description: "शीशे के काम वाले रंगीन गुजराती किवाड़ झूले वाले आँगन में खुलते हैं।",
    },
    "shahi-parda": {
      name: "शाही पर्दे",
      description: "मैरून और सुनहरे मखमली पर्दे हटते हैं और झूमरों वाला हॉल दिखता है।",
    },
    "deco-gates": {
      name: "आर्ट डेको गेट",
      description: "काले और पीतल के गेट शहर के ऊपर छत की पार्टी में खुलते हैं।",
    },
    "bagiya-gate": {
      name: "गुलाबों वाला बाग़ का गेट",
      description: "गुलाबों से लिपटे सफ़ेद लोहे के गेट लालटेनों वाले बाग़ में खुलते हैं।",
    },
    "mela-tamboo": {
      name: "मेले का तंबू",
      description: "धारीदार तंबू के पर्दे उठते हैं और गुब्बारे, झूला और बड़ा केक दिखता है।",
    },
    "chaand-dwar": {
      name: "चाँदनी बाग़ के दरवाज़े",
      description: "चाँद-तारों वाले सीप जड़े दरवाज़े चाँदनी में नहाए ताल वाले बाग़ में खुलते हैं।",
    },
    "ritu-dwar": {
      name: "आँगन के दरवाज़े",
      description:
        "हर ऋतु की पत्ती वाले पुराने टेराकोटा-हरे दरवाज़े फूलों से लदे पेड़ पर खुलते हैं।",
    },
    "raag-dwar": {
      name: "संगीत कक्ष के दरवाज़े",
      description: "लाजवर्द और सोने से रंगे दरवाज़े सुबह वीणा वाली महल की छत पर खुलते हैं।",
    },
    "van-dwar": {
      name: "जंगल का दरवाज़ा",
      description: "टहनियों और पत्तों से बुने दरवाज़े कहानियों के जंगल की राह पर खुलते हैं।",
    },
    "patang-dwar": {
      name: "छत के दरवाज़े",
      description: "पतंगों से रंगे फ़िरोज़ी दरवाज़े सुबह की छतों पर खुलते हैं।",
    },
    "kumhar-dwar": {
      name: "कुम्हारों की गली के दरवाज़े",
      description: "टेराकोटा टाइलों वाले नीले दरवाज़े सैकड़ों दीयों से जगमग गली में खुलते हैं।",
    },
    "karghaa-dwar": {
      name: "बुनकरों के घर के दरवाज़े",
      description: "लाल रेशम और सुनहरी ज़री में लिपटे दरवाज़े बुनकरों के आँगन में खुलते हैं।",
    },
    "navrang-dwar": {
      name: "नौ रंगों के दरवाज़े",
      description: "रंगीन काँच की नौ पट्टियों वाले सफ़ेद दरवाज़े गुलाबी मंडप में खुलते हैं।",
    },
    "ghat-dwar": {
      name: "घाट के दरवाज़े",
      description: "लहरों और मछलियों से तराशे फ़िरोज़ी दरवाज़े सुबह के ग्लेशियर झरने पर खुलते हैं।",
    },
    "rekha-dwar": {
      name: "एक रेखा के दरवाज़े",
      description: "एक सुनहरी रेखा से बने काग़ज़ी दरवाज़े कमलों पर उगते सूरज में खुलते हैं।",
    },
    "naqsha-pat": {
      name: "जड़ाऊ महल द्वार",
      description:
        "सुनहरी रेखाओं के महल से जड़े हाथीदाँत रंग के द्वार खुलते हैं और साँझ में झील महल दिखता है।",
    },
    "kinkhab-parda": {
      name: "किनख़ाब के पर्दे",
      description:
        "सुनहरी बुनावट वाले वाइन रंग के पर्दे सिमटते हैं और दीयों से जगमगाता महल का कक्ष दिखता है।",
    },
    "taad-patta-dwar": {
      name: "ताड़ पत्ते की जालियाँ",
      description:
        "बुनी हुई ताड़ पत्ते की जालियाँ सरकती हैं और सूर्यास्त में कमल लैगून पर बना विला दिखता है।",
    },
    "pichwai-pat": {
      name: "पिछवाई के पर्दे",
      description:
        "कमल और गायों से चित्रित पिछवाई के पर्दे सिमटते हैं और चाँदनी में कमल ताल दिखता है।",
    },
    "chandi-kiwad": {
      name: "चाँदी के किवाड़",
      description: "उभरी नक्काशी वाले चाँदी के किवाड़ खुलते हैं और झील पर जगमगाता महल दिखता है।",
    },
    "swarg-kiwad": {
      name: "बादलों के किवाड़",
      description:
        "बादलों से तराशे सफ़ेद संगमरमर के किवाड़ खुलते हैं और सुनहरे बादलों पर तैरता मंडप दिखता है।",
    },
    "firoza-darwaza": {
      name: "फ़िरोज़ी दरवाज़ा",
      description:
        "फ़िरोज़ी सितारों से जड़े अखरोट की लकड़ी के किवाड़ खुलते हैं और लंबे जलकुंड वाला बाग़ दिखता है।",
    },
    "jharokha-pat": {
      name: "रंगीन काँच के झरोखे",
      description: "रंगीन काँच जड़े गुलाबी पट खुलते हैं और सूर्यास्त में झरोखों का महल दिखता है।",
    },
    "hina-kiwad": {
      name: "मेहंदी रचे किवाड़",
      description:
        "मेहंदी से सजे क्रीम रंग के किवाड़ खुलते हैं और गेंदों से भरा खुबानी रंग का आँगन दिखता है।",
    },
    "mor-pankh": {
      name: "मोरपंख की जालियाँ",
      description: "मोरपंख की जालियाँ सरकती हैं और संगमरमर की छतरी वाली कमल झील दिखती है।",
    },
    "jugnu-parda": {
      name: "जुगनुओं का पर्दा",
      description: "जुगनुओं से जगमग नीला पर्दा सिमटता है और चाँदनी में कुमुदिनी की झील दिखती है।",
    },
    "sheesh-kiwad": {
      name: "शीशे के किवाड़",
      description: "शीशे के काम वाले किवाड़ खुलते हैं और झूमरों तले दरबार हॉल दिखता है।",
    },
    "sunehri-phatak": {
      name: "सुनहरा फाटक",
      description:
        "सोने के वर्क वाले किवाड़ खुलते हैं और शांत झील के पार सुनहरे गुंबद वाला मंडप दिखता है।",
    },
    "pattu-thirai": {
      name: "रेशमी साड़ी के पर्दे",
      description:
        "कांजीवरम रेशम के पर्दे सिमटते हैं और पीतल के दीयों से रोशन मंदिर का कुंड दिखता है।",
    },
    "kagaz-kiwad": {
      name: "उभरे काग़ज़ के किवाड़",
      description: "सुनहरी मुहर वाले उभरे काग़ज़ के किवाड़ खुलते हैं और हल्की गुलाबी आभा दिखती है।",
    },
    "peetal-kiwad": {
      name: "पीतल के किवाड़",
      description:
        "ढोकरा काँसे में ढले किवाड़ खुलते हैं और काँसे के जीवन वृक्ष के चारों ओर दीयों का आँगन दिखता है।",
    },
    "kaanch-pat": {
      name: "काँच चित्र के पट",
      description:
        "तोतों और मोर से चित्रित काँच के पट सरकते हैं और रत्न जैसे रंगों वाला महल बाग़ दिखता है।",
    },
    "thinnai-kadhavu": {
      name: "सागौन के नक्काशीदार किवाड़",
      description:
        "पीतल की कीलों वाले बर्मा सागौन के नक्काशीदार किवाड़ खुलते हैं और हवेली का धूप भरा आँगन दिखता है।",
    },
    "meena-pat": {
      name: "मीना के सुनहरे पट",
      description:
        "तोतों और फूलों के पेड़ की मीना वाले सुनहरे पट सरकते हैं और जयपुर का महल बाग़ दिखता है।",
    },
    "rogan-parda": {
      name: "रोगन के पर्दे",
      description: "रोगन से चित्रित मैरून पर्दे सिमटते हैं और सुनहरी साँझ में कच्छी आँगन दिखता है।",
    },
    "makhmal-parda": {
      name: "मख़मल के पर्दे",
      description:
        "गुलाबों की कढ़ाई वाले काले मख़मली पर्दे सिमटते हैं और मोमबत्तियों से रोशन फूलों भरा कक्ष दिखता है।",
    },
    "sama-dwar": {
      name: "हल्के रंगों के किवाड़",
      description:
        "हल्के रंगों की पट्टियों वाले पुदीना रंग के किवाड़ खुलते हैं और लंबे जलकुंड वाला सममित आँगन दिखता है।",
    },
    "dilli-phatak": {
      name: "हवेली का फाटक",
      description:
        "लोहे की कीलों वाले पुराने फ़िरोज़ी हवेली के किवाड़ खुलते हैं और बत्तियों व गेंदों से सजा आँगन दिखता है।",
    },
    "nakkashi-pat": {
      name: "चाँदी नक्काशी के पट",
      description:
        "मोर और तोतों से उभरे चाँदी के पट सरकते हैं और चाँदनी में संगमरमर का बाग़ दिखता है।",
    },
    "gagan-parda": {
      name: "गुब्बारे के रेशमी पर्दे",
      description:
        "चित्रित गुब्बारे का रेशम सिमटता है और झील महल के ऊपर गुब्बारों से भरा सुबह का आसमान दिखता है।",
    },
    "bel-khidki": {
      name: "बोगनवेलिया की खिड़की",
      description: "बोगनवेलिया से ढकी नीली खिड़कियाँ खुलती हैं और सूर्यास्त का मेहराब दिखता है।",
    },
    "pankhudi-pat": {
      name: "कुमुदिनी की पंखुड़ियाँ",
      description:
        "कुमुदिनी की दो बड़ी पंखुड़ियाँ दोनों ओर खुलती हैं और कुमुदिनियों का ताल दिखता है।",
    },
    "gulaab-lifafa": {
      name: "मोहर लगा लिफ़ाफ़ा",
      description: "मोम की गुलाब-मोहर वाला लिफ़ाफ़ा खुलता है और सुनहरे गुलाबों का मेहराब दिखता है।",
    },
    "os-parda": {
      name: "ओस का पर्दा",
      description:
        "नन्हे फूलों से कढ़ा सफ़ेद झीना पर्दा सिमटता है और सफ़ेद फूलों का बाग़ दिखता है।",
    },
    "surkh-dwar": {
      name: "गुलाबों के दरवाज़े",
      description:
        "लाल गुलाबों से ढके बाग़ के पुराने दरवाज़े खुलते हैं और गुलाबों की राह दिखती है।",
    },
    "itr-dibbi": {
      name: "इत्र की डिबिया",
      description: "इत्र की डिबिया के रेशमी दरवाज़े खुलते हैं और गुलाबी धुंध बाहर आती है।",
    },
    "gulaab-bhaap": {
      name: "गुलाब की भाप",
      description: "गुलाब की महक वाली भाप के दो बादल हटते हैं और कन्नौज के गुलाब के खेत दिखते हैं।",
    },
    "oud-darwaza": {
      name: "पीतल जड़े दरवाज़े",
      description:
        "पीतल की कीलों जड़े भारी नक्काशीदार दरवाज़े खुलते हैं और लोबान का धुआँ बाहर आता है।",
    },
    "tarkashi-jaali": {
      name: "चाँदी की जालियाँ",
      description:
        "चाँदी की तारकशी की दो जालियाँ सरकती हैं और गुलाबपाश वाला संगमरमरी बाग़ दिखता है।",
    },
    "aaina-pat": {
      name: "आईने के पट",
      description:
        "तह होने वाले आईने के नक्काशीदार पट खुलते हैं और बैंगनी रोशनी में श्रृंगार मेज़ दिखती है।",
    },
    "megh-parda": {
      name: "सावन के बादल",
      description: "सावन के बादल दोनों ओर सरकते हैं और पहाड़ों के नीचे कमल झील दिखती है।",
    },
    "pehar-jaali": {
      name: "संगमरमर की जालियाँ",
      description: "तराशी हुई संगमरमर की जालियाँ सरकती हैं और कमल ताल पर मंडप दिखता है।",
    },
    "lata-phatak": {
      name: "बगिया का फाटक",
      description: "बेलों से ढका फाटक सुबह के बाग़ में खुलता है।",
    },
    "kitaab-jild": {
      name: "किताब की जिल्द",
      description: "रिबन बँधी कहानी की किताब खुलती है और काग़ज़ का महल उठता है।",
    },
    "itr-almari": {
      name: "इत्र की अलमारी",
      description: "इत्र की अलमारी के काँच के दरवाज़े खुलते हैं और गुलाबी धुंध बाहर आती है।",
    },
    "kosh-jild": {
      name: "पक्षी एल्बम",
      description: "लाख के एल्बम के पन्ने खुलते हैं और कमल ताल के सारस दिखते हैं।",
    },
    "gudiya-pat": {
      name: "गुड़िया घर का पट",
      description: "खिलौना हवेली का रंगा हुआ पट खुलता है और जगमग कमरे दिखते हैं।",
    },
    "yantra-pat": {
      name: "यंत्र की थाली",
      description: "पीतल की यंत्र थाली खुलती है और ढलते सूरज में वेधशाला दिखती है।",
    },
    "rang-parda": {
      name: "रंगे कपड़े",
      description: "दो लंबी बांधनी चुनरियाँ सिमटती हैं और रंगरेज़ का आँगन दिखता है।",
    },
    "genda-ladi": {
      name: "गेंदे का पर्दा",
      description: "गेंदे की लड़ियों का पर्दा सिमटता है और फूल मंडी दिखती है।",
    },
    "kaleen-parda": {
      name: "क़ालीन का पर्दा",
      description: "बुना हुआ क़ालीन सरककर सुबह के नीले गुंबदों वाले शहर पर खुलता है।",
    },
    "truck-darwaza": {
      name: "ट्रक के दरवाज़े",
      description: "मोर और कमल से रंगे ट्रक के दरवाज़े शाम की सड़क पर खुलते हैं।",
    },
    "kaanch-dhakkan": {
      name: "मख़मल का पर्दा",
      description: "मख़मली कपड़ा सिमटकर काँच के नीचे बसी नन्ही दुनिया दिखाता है।",
    },
    "pati-pat": {
      name: "कक्षा के दरवाज़े",
      description: "चॉक के फूलों वाले लकड़ी के दरवाज़े गाँव की राह पर खुलते हैं।",
    },
    "jad-jhalar": {
      name: "बेलों का पर्दा",
      description: "लटकती जड़ों और बेलों का पर्दा सिमटकर नदी के पुलों पर खुलता है।",
    },
    "gol-darwaza": {
      name: "झोपड़ी का दरवाज़ा",
      description: "गुलाबी मिट्टी का गोल दरवाज़ा झोपड़ी के बग़ीचे में खुलता है।",
    },
    "jhaadi-deewar": {
      name: "झाड़ियों के फाटक",
      description: "कटी-छँटी झाड़ियों की दो दीवारें सरककर गुलाबी मेहराबों की राह खोलती हैं।",
    },
    "deco-dibba": {
      name: "लिफ़्ट के दरवाज़े",
      description: "आर्ट डेको लिफ़्ट के दरवाज़े सरककर पुल पर दौड़ती रेल दिखाते हैं।",
    },
    "samundar-parda": {
      name: "समुद्री घास का पर्दा",
      description: "पानी के नीचे समुद्री घास हटकर मूँगे की मेहराब और सफ़ेद रेत दिखाती है।",
    },
    "shatranj-sandook": {
      name: "शतरंज के दरवाज़े",
      description: "जड़ाऊ शतरंज वाले दरवाज़े महल की छत पर बिछी बाज़ी पर खुलते हैं।",
    },
    pankhi: {
      name: "चित्रित पंखा",
      description: "कमल और तोतों वाला रेशमी पंखा बंद होता है और लालटेनों वाली महल की छत दिखती है।",
    },
    "sheesh-mahal": {
      name: "शीश महल",
      description:
        "छोटे शीशों की दीवार झरोखे की पट्टियों जैसी घूमती है और दीयों से जगमग शीश महल दिखता है।",
    },
    "popup-mahal": {
      name: "पॉप-अप महल",
      description: "कागज़ का झील महल पॉप-अप किताब की तरह खड़ा होता है, फिर आप भीतर जाते हैं।",
    },
    odhni: {
      name: "दुल्हन की ओढ़नी",
      description: "लाल बांधनी ओढ़नी हवा में लहराती है, फिर उड़कर चाँदनी आँगन दिखाती है।",
    },
    "kavad-peti": {
      name: "कावड़",
      description: "मेवाड़ की रंगी कावड़ दो बार खुलती है और सुनहरी शाम का बाग़ दिखता है।",
    },
    "chhatri-utsav": {
      name: "शाही छत्र",
      description: "कढ़ाईदार छत्र ऊपर घूमता है, फिर घूमते हुए आसमान में उठ जाता है।",
    },
    "jal-darpan": {
      name: "शांत झील",
      description: "तैरते दीये से लहरें फैलती हैं और झील दीयों वाले घाट में खुलती है।",
    },
    "pushp-varsha": {
      name: "पुष्प वर्षा",
      description: "गुलाब की पंखुड़ियों की दीवार भँवर में बिखरती है और वरमाला का मंच दिखता है।",
    },
    "moti-seep": {
      name: "मोती सीप",
      description: "बड़ी सीप चमकते मोती पर अपना ढक्कन उठाती है और समुद्र तट का मंडप दिखता है।",
    },
    "badal-raag": {
      name: "सावन के बादल",
      description: "बादल छँटते हैं, धूप निकलती है और महल के ऊपर इंद्रधनुष बनता है।",
    },
    "jugnu-van": {
      name: "जुगनुओं का वन",
      description: "जुगनू आपके नामों के पास जुटते हैं, फिर जंगल खुलकर रोशन बरगद दिखाता है।",
    },
    "uday-surya": {
      name: "सूर्योदय",
      description: "पहाड़ियों के ऊपर सूरज उगता है और पहाड़ियाँ हटकर आपका नया घर दिखाती हैं।",
    },
    taaramandal: {
      name: "तारामंडल",
      description:
        "तारे आपके नामों के चारों ओर सोने की रेखाओं से जुड़ते हैं, फिर आप उनके पार जाते हैं।",
    },
    "thar-ki-ret": {
      name: "थार की रेत",
      description: "हवा टीलों को उड़ा ले जाती है और लालटेनों वाला किले का डेरा दिखता है।",
    },
    "sheher-ki-raat": {
      name: "शहर की रात",
      description: "शहर की खिड़कियाँ एक-एक कर जगती हैं, फिर पूरा शहर रोशन हो जाता है।",
    },
    "choodi-chakra": {
      name: "चूड़ियों के घेरे",
      description:
        "काँच की चूड़ियों के घेरे आपके नामों के चारों ओर घूमते हैं, फिर लहरों से फैलते हैं।",
    },
    "sanjhi-roshni": {
      name: "साँझी की रोशनी",
      description: "कागज़ की साँझी के पीछे दीया जलता है, फिर पन्ना पलटता है।",
    },
    "chhaya-parda": {
      name: "छाया का पर्दा",
      description: "दीये से रोशन पर्दे पर कठपुतलियों की छाया झूमती है, फिर पर्दा ऊपर लिपटता है।",
    },
    "athangudi-tiles": {
      name: "चेट्टीनाड टाइलें",
      description: "चमकती अथंगुडी टाइलें लहर की तरह पलटती हैं और चेट्टीनाड आँगन दिखता है।",
    },
    "gulaal-bindu": {
      name: "गुलाल की बूँदें",
      description: "गुलाल की बूँदें कागज़ पर फैलकर होली का रंगीन आँगन बन जाती हैं।",
    },
    bioscope: {
      name: "बाइस्कोप",
      description: "पुराने बाइस्कोप के लेंस में बहुरूपदर्शक घूमता है, फिर लेंस खुल जाता है।",
    },
    "kaanch-ka-gola": {
      name: "बर्फ़ का गोला",
      description:
        "काँच के गोले में बर्फ़ गिरती है; वह हिलता है और आप सर्दियों के गाँव में पहुँचते हैं।",
    },
    phirki: {
      name: "कागज़ की फिरकी",
      description: "मुड़ा हुआ कागज़ एक-एक कोना खोलकर गाँव का मेला दिखाता है।",
    },
    bulbule: {
      name: "साबुन के बुलबुले",
      description:
        "बड़ा बुलबुला आपके नामों के चारों ओर डोलता है, फिर फूटकर बाग़ की पार्टी दिखाता है।",
    },
    "chhuk-chhuk": {
      name: "खिलौना रेल",
      description: "छोटी भाप रेल छुक-छुक गुज़रती है और भाप छँटकर पार्टी वाला स्टेशन दिखता है।",
    },
    chadar: {
      name: "पानी की चादर",
      description:
        "दीयों के आलों वाली संगमरमर की दीवार पर पानी की चादर गिरती है, फिर रुककर ऊपर से छँट जाती है।",
    },
    parwaaz: {
      name: "कढ़ाई के पंछी",
      description: "रेशम पर कढ़े पंछी उड़ान भरते हैं, और रेशम उनके पीछे ऊपर उड़ जाता है।",
    },
    bhanwar: {
      name: "अबरी का भँवर",
      description: "दक्कनी अबरी काग़ज़ भँवर की तरह घूमता है और बीच में समा जाता है।",
    },
    "jaali-patta": {
      name: "जाली पत्ता",
      description: "जाली जैसे बड़े पत्ते की नसों में रोशनी दौड़ती है, फिर वह मुड़कर नीचे झरता है।",
    },
    "lapet-khule": {
      name: "क्विलिंग का फूल",
      description: "काग़ज़ की लपेटों का फूल घूमता है, छल्ले खुलते हैं और घुमाव उछलकर दूर जाते हैं।",
    },
    taar: {
      name: "वीणा के तार",
      description:
        "वीणा की तरह तारों से कसा चंदन का नक्काशीदार पटल: तार छिड़ने-से झिलमिलाते हैं, फिर पटल पट्टी-दर-पट्टी खुल जाता है।",
    },
    pratibimb: {
      name: "झील का प्रतिबिंब",
      description:
        "न्योता कमल की झील में एक परछाईं से खुलता है; एक लहर फैलती है और दृश्य पानी से ऊपर उठ आता है।",
    },
    mohur: {
      name: "चाँदी का सिक्का",
      description:
        "कढ़ाई वाला एक बड़ा चाँदी का सिक्का किनारे पर घूमता है, पलटता है, और आप उसके पार निकल जाते हैं।",
    },
    gathbandhan: {
      name: "गठबंधन",
      description:
        "लहरिया की दो चुनरियाँ लहराकर आती हैं, बीच में गाँठ बाँधती हैं और साथ-साथ ऊपर उठ जाती हैं।",
    },
    phuljhadi: {
      name: "फुलझड़ी का घेरा",
      description:
        "एक फुलझड़ी नामों के चारों ओर सुनहरी रोशनी का घेरा खींचती है, और काली लाख पुतली की तरह खुल जाती है।",
    },
    semal: {
      name: "सेमल की रुई",
      description: "सेमल की फलियाँ फटती हैं और सफ़ेद रुई निकलकर हवा में घूमती हुई उड़ जाती है।",
    },
    thappa: {
      name: "ठप्पा छपाई",
      description:
        "लकड़ी का नक्काशीदार ठप्पा सूती चादर पर छाप लगाता है; हर छाप एक खिड़की खोलती है, फिर चादर उठ जाती है।",
    },
    gumbad: {
      name: "रंगा हुआ गुंबद",
      description:
        "आप रंगे हुए गुंबद में ऊपर देखते हैं; उसका आसमानी झरोखा पुतली-सा खुलता है और पंखुड़ियाँ बरसती हैं।",
    },
    ghadi: {
      name: "जेब घड़ी",
      description:
        "एक पुरानी जेब घड़ी: सुइयाँ घूमकर घड़ी पर आती हैं, धीमी-सी झंकार होती है, और आप उसके डायल में चले जाते हैं।",
    },
    hindolo: {
      name: "रंगीन झूला",
      description: "संखेड़ा का रंगा झूला झूलता है, फिर आपकी ओर ऊँचा उठकर नज़र से ओझल हो जाता है।",
    },
    "reshmi-gaanth": {
      name: "साटन की गाँठ",
      description:
        "पोर्सिलेन के द्वार हल्के गुलाबी साटन की गाँठ से बँधे; गाँठ खुलती है, रिबन सरक जाता है और द्वार खुल जाते हैं।",
    },
    "moti-kaanta": {
      name: "मोती ब्रोच",
      description:
        "रेशमी पट मोती-क्रिस्टल के ब्रोच से जुड़े; ब्रोच खुलकर ऊपर तैर जाता है और पट लहँगे के घेर की तरह खुलते हैं।",
    },
    guldasta: {
      name: "सुतली का गुलदस्ता",
      description:
        "ताँबे की नक़्क़ाशीदार प्लेटें फूलों के गुलदस्ते से बँधी; सुतली खिसकती है, गुलदस्ता गिरता है और प्लेटें सरक जाती हैं।",
    },
    "neeli-titli": {
      name: "नीली तितली",
      description:
        "धुंध-से नीले द्वार मीनाकारी तितली से बंद; तितली पंख खोलकर उड़ जाती है और द्वार खुल जाते हैं।",
    },
    "itr-shishi": {
      name: "इत्र की शीशी",
      description:
        "गुलाबी द्वार रेशमी डोर और इत्र की शीशी से बँधे; डोर खिसकती है और शीशी पंखुड़ियों के झोंके में गिर जाती है।",
    },
    "van-mala": {
      name: "जंगली फूलों की माला",
      description:
        "देवदार के नक़्क़ाशीदार द्वार पर पहाड़ी फूलों की माला; गाँठ ढीली होती है और माला गिर जाती है।",
    },
    gulband: {
      name: "रेशमी रोज़ेट",
      description:
        "गाढ़े रंगों वाले दो कैनवस मूँगिया रिबन और रोज़ेट से बँधे; रोज़ेट घूमकर दूर जाता है और कैनवस सरक जाते हैं।",
    },
    mudra: {
      name: "लाख की मुहर",
      description:
        "उभरे काग़ज़ के पट गहरी लाल लाख की मुहर से बंद; मुहर दो टुकड़े होती है और हर टुकड़ा अपने पट के साथ जाता है।",
    },
    "shankha-pola": {
      name: "शाँखा पोला",
      description:
        "हरी कोलकाता खिड़कियाँ शंख की और लाल लाख की चूड़ी से जुड़ी; चूड़ियाँ अलग होकर लुढ़कती हैं और खिड़कियाँ खुलती हैं।",
    },
    challa: {
      name: "रूमाल का छल्ला",
      description:
        "छपा रेशमी रूमाल सुनहरे छल्ले में गँठा; छल्ला सरककर दूर जाता है और रेशमी पट खुल जाते हैं।",
    },
    latkan: {
      name: "ज़री के फुँदने",
      description:
        "झीने चंदेरी परदे फुँदनों वाली ज़री की डोरी से बँधे; डोरी ढीली होती है, फुँदने गिरते हैं और परदे खुल जाते हैं।",
    },
    "shakkar-chakri": {
      name: "शक्कर का पदक",
      description:
        "फ़ॉन्डेंट के द्वार चीनी के पदक से बंद; पदक चीनी के मोतियों में बिखर जाता है और द्वार खुल जाते हैं।",
    },
    "raghu-maina": {
      name: "तोतों का हुक",
      description:
        "पैठणी के पट दो तोतों वाले सुनहरे हुक से जुड़े; तोते अलग होकर झूलते हैं और रेशम सरककर खुलता है।",
    },
    "taala-chaabi": {
      name: "चाँदी का ताला",
      description:
        "अखरोट की लकड़ी के द्वार गुलाब जैसे चाँदी के ताले से बंद; ताला खुलकर गिरता है और द्वार खुल जाते हैं।",
    },
    "phool-gend": {
      name: "पंखुड़ियों की गेंद",
      description:
        "चमेली और गुलाब से बुने द्वार गुलाब की पंखुड़ियों की गेंद से बँधे; गेंद पंखुड़ियों में बिखरती है और द्वार खुलते हैं।",
    },
    "panna-pat": {
      name: "थेवा लॉकेट",
      description:
        "माणिक की डोरी पर थेवा लॉकेट पन्ने के काँच के द्वार थामे है; वह खुलकर गिरता है और द्वार खुल जाते हैं।",
    },
    "sikki-dwar": {
      name: "घास की मछली",
      description:
        "घास की रस्सी पर बुनी सिक्की मछली द्वार थामे है; वह तैरकर चली जाती है और द्वार खुल जाते हैं।",
    },
    "hase-bagilu": {
      name: "रंगे पक्षी",
      description:
        "दो रंगे पक्षी लाल मिट्टी के द्वारों की कुंडी हैं; वे अलग होकर उड़ जाते हैं और द्वार खुलते हैं।",
    },
    "kankreet-dwar": {
      name: "पीतल का पदक",
      description:
        "पट्टे पर पीतल का पदक कंक्रीट के द्वार थामे है; वह चौथाई घूमता है और द्वार सरक जाते हैं।",
    },
    "chhaap-kiwad": {
      name: "सेफ़्टी पिन",
      description:
        "छपी हुई बड़ी सेफ़्टी पिन द्वार थामे है; वह खुलकर गिरती है और द्वार खुल जाते हैं।",
    },
    "purana-darwaza": {
      name: "दुकान की घंटी",
      description:
        "लाल डोरी पर पीतल की घंटी पुराने द्वार थामे है; वह बजती है, गिरती है और द्वार खुलते हैं।",
    },
    "bindi-kiwad": {
      name: "बिंदियों के पक्षी",
      description:
        "बिंदियों से बने दो पक्षी द्वारों पर माला थामे हैं; वे माला लेकर उड़ते हैं और द्वार खुलते हैं।",
    },
    "masala-almari": {
      name: "मिर्चों की लड़ी",
      description:
        "मिर्च और दालचीनी की लड़ी मसाले की अलमारी बाँधे है; वह ढीली होती है और पल्ले आपकी ओर खुलते हैं।",
    },
    "kaagaz-pat": {
      name: "धारीदार दुपट्टा",
      description:
        "लिली वाला धारीदार मणिपुरी दुपट्टा काग़ज़ के द्वार बाँधे है; वह उड़ जाता है और द्वार सरक जाते हैं।",
    },
    "rupa-kiwad": {
      name: "चाँदी की गेंद",
      description:
        "चेन पर चाँदी की जालीदार गेंद द्वार थामे है; वह फूल की तरह खुलती है और द्वार खुलते हैं।",
    },
    "ola-vathil": {
      name: "पत्तों की गाँठ",
      description:
        "गुड़हल वाली ताड़-पत्तों की गाँठ द्वार बाँधे है; वह खुलती है और द्वार खुल जाते हैं।",
    },
    "seep-kiwad": {
      name: "मोती का फूल",
      description:
        "मोती के फूल से बँधी लड़ियाँ शीशम के द्वार थामे हैं; वे सरक जाती हैं और द्वार खुलते हैं।",
    },
    "aakar-pat": {
      name: "लाल गोला",
      description:
        "काली रेखा पर लाल गोला द्वार थामे है; वह रेखा पर लुढ़क जाता है और द्वार सरक जाते हैं।",
    },
    "shwet-dwar": {
      name: "मख़मल और लिली",
      description:
        "लिली थामे मख़मली रिबन द्वार बाँधे है; लिली गिरती है, रिबन सरकता है और द्वार खुलते हैं।",
    },
    "moti-dwar": {
      name: "काँच का बुलबुला",
      description:
        "मोतियों से घिरा काँच का बुलबुला द्वार थामे है; वह झिलमिलाकर फूटता है और द्वार खुलते हैं।",
    },
    "yashab-kiwad": {
      name: "यशब का कंगन",
      description:
        "सोने की चेन पर तराशा यशब का कंगन यशब के द्वार थामे है; वह छूटकर गिरता है और द्वार खुल जाते हैं।",
    },
    "usta-kiwad": {
      name: "सुनहरा सूरज",
      description:
        "नीले रिबन पर सोने में उभरा सूरज द्वार थामे है; रिबन खुलता है और द्वार खुल जाते हैं।",
    },
    "pixel-kiwad": {
      name: "पिक्सेल नगीना",
      description:
        "पिक्सेल की चेन पर पिक्सेल नगीना द्वार थामे है; वह पिक्सेलों में बिखरता है और द्वार खुल जाते हैं।",
    },
    "saaya-kiwad": {
      name: "तार पर पक्षी",
      description:
        "द्वारों पर खिंचे तार पर परछाईं-से दो पक्षी बैठे हैं; वे उड़ जाते हैं और द्वार डूबते सूरज की ओर खुल जाते हैं।",
    },
    "jad-dwar": {
      name: "बाँस की कुंडी",
      description:
        "ऑर्किड वाली बाँस की कुंडी जीवित जड़ों के द्वार थामे है; वह सरककर हटती है और द्वार दोनों ओर हट जाते हैं।",
    },
    "natak-dwar": {
      name: "मख़मली रस्सी",
      description:
        "पीतल के हुक पर थिएटर की मख़मली रस्सी मंच के द्वार थामे है; वह गिरती है और द्वार खुल जाते हैं।",
    },
    "kashi-kiwad": {
      name: "टाइल वाली साँकल",
      description:
        "चमकदार टाइल वाली पीतल की साँकल द्वार थामे है; वह खनकती है, गिर जाती है और द्वार खुल जाते हैं।",
    },
    "paandaan-pat": {
      name: "मोर वाला सरौता",
      description:
        "चाँदी का मोर वाला सरौता चाँदी के द्वार थामे है; वह घूमकर छोड़ देता है और द्वार बाहर की ओर खुलते हैं।",
    },
    "marmar-dwar": {
      name: "पीतल के छल्ले",
      description:
        "आपस में गुँथे पीतल के दो छल्ले संगमरमर के द्वार थामे हैं; वे लुढ़ककर हटते हैं और द्वार सरक जाते हैं।",
    },
    "goa-dwar": {
      name: "रंगी टाइल",
      description:
        "डोरी पर गोवा की रंगी टाइल नीले द्वार थामे है; वह घूमकर छोड़ देती है और द्वार खुल जाते हैं।",
    },
    "haveli-pat": {
      name: "परांदे की चोटी",
      description:
        "पॉम-पॉम वाली रेशमी परांदे की चोटी रंगे हुए द्वार बाँधे है; वह खुलती है और द्वार खुल जाते हैं।",
    },
    "bah-dwar": {
      name: "गमोसे की गाँठ",
      description:
        "गाँठ में बँधा गमोसा बाँस के द्वार थामे है; गाँठ खुलती है और द्वार खुल जाते हैं।",
    },
    "akeek-pat": {
      name: "स्फटिक",
      description:
        "सोने में लिपटा स्फटिक अक़ीक़ के द्वार थामे है; वह चटकता है और द्वार सरक जाते हैं।",
    },
    "sagar-dwar": {
      name: "मल्लाह की गाँठ",
      description:
        "सीपी वाली मल्लाह की गाँठ बहकर आई लकड़ी के द्वार थामे है; वह खुलती है और द्वार बाहर समुद्र की ओर खुलते हैं।",
    },
    "khet-phatak": {
      name: "अटकी पतंग",
      description:
        "अपनी डोर में अटकी पतंग खेतों का फाटक थामे है; वह उड़ जाती है और पल्ले बाहर की ओर खुलते हैं।",
    },
    "sona-parat": {
      name: "सोने जड़ा काँच",
      description:
        "पन्ने, माणिक और नीलम के दमकते काँच के तीन सुनहरे मेहराब; आप एक-एक कर उनसे गुज़रते हैं।",
    },
    mauni: {
      name: "गोल डलियाँ",
      description:
        "सुनहरी घास के तीन गोल किनारे, जैसे डलिया में झाँकना; वे घूमते हैं और आप भीतर उतरते हैं।",
    },
    chowka: {
      name: "घूमते चौकोर",
      description: "लाल मिट्टी पर चावल के लेप के तीन चौकोर; गुज़रते समय हर एक चौथाई घूमता है।",
    },
    khidkiyaan: {
      name: "कंक्रीट की खिड़कियाँ",
      description:
        "कंक्रीट की दीवार, रंगीन छज्जों की जाली और गोल खिड़की; आप तीनों से होकर निकलते हैं।",
    },
    "phool-chhaap": {
      name: "छपा फूल",
      description:
        "गुलाबी और नीली स्याही में छपे फूल, लहरिया घेरा और गोला; स्याही सरकती है, फिर आप गुज़र जाते हैं।",
    },
    "gali-gali": {
      name: "स्केच की गली",
      description: "पुरानी गली में स्केच किए तीन मेहराब; आप गली में एक-एक कर उनसे गुज़रते हैं।",
    },
    tipki: {
      name: "बिंदियों का पेड़",
      description:
        "बिंदियों का पेड़, पक्षियों और फूलों के घेरे टिमटिमाते हैं, फिर आप उड़कर गुज़रते हैं।",
    },
    "masala-dabba": {
      name: "मसाला डिब्बा",
      description:
        "साबुत मसालों के घेरे और पीतल के मसाला डिब्बे का किनारा; आप डिब्बे में उतर जाते हैं।",
    },
    phumdi: {
      name: "तैरते द्वीप",
      description:
        "काग़ज़ की पहाड़ियाँ, घास का तैरता घेरा और लिली का घेरा; आप झील के ऊपर से गुज़रते हैं।",
    },
    "rupa-jaali": {
      name: "चाँदी के लॉकेट",
      description: "चाँदी की तारकशी के तीन अंडाकार, जैसे लॉकेट में लॉकेट; हर एक झुककर चमकता है।",
    },
    thoranam: {
      name: "पत्तों के तोरण",
      description:
        "ताड़-पत्तों का मेहराब, पत्तों के फूल और मछलियों के घेरे झूलते हैं, फिर हटकर रास्ता देते हैं।",
    },
    "seep-mehrab": {
      name: "सीप के मेहराब",
      description: "सीप जड़ी गहरी लकड़ी के तीन मुग़ल मेहराब, जैसे महल का दालान जिसमें आप चलते हैं।",
    },
    "teen-aakar": {
      name: "तीन आकार",
      description:
        "तीन कैनवस में कटे चौकोर, गोला और त्रिकोण धीरे घूमते हैं, फिर आप हर एक से गुज़रते हैं।",
    },
    galiyara: {
      name: "गलियारा",
      description:
        "श्वेत-श्याम गलियारे में सुनहरी रेखाओं वाले तीन पत्थर के मेहराब; आप उनसे होकर चलते हैं।",
    },
    chamak: {
      name: "सतरंगी चमक",
      description:
        "मोती जैसा मेहराब, सतरंगी काँच और मोतियों के घेरे; गुज़रते हुए सतरंगी चमक बिखरती है।",
    },
    "yashab-kamal": {
      name: "यशब कमल",
      description:
        "सोने और माणिक के केंद्र के चारों ओर बड़ा यशब कमल पूरी स्क्रीन पर छाया है; केंद्र ऊपर उठता है और पंखुड़ियाँ घेरा-दर-घेरा खुलती हैं।",
    },
    manoti: {
      name: "सुनहरा गुंबद",
      description:
        "गोल पंखुड़ियों वाला सोने में उभरा फूल, जैसे बीकानेर के गुंबद का भीतरी भाग; बीच की सुनहरी घुंडी उठती है और पंखुड़ियाँ खुल जाती हैं।",
    },
    "chaukor-phool": {
      name: "पिक्सेल फूल",
      description:
        "बड़ा-सा पिक्सेल फूल पूरी स्क्रीन भर देता है; उसका बीच झपककर ग़ायब होता है और पंखुड़ियाँ चौकोर क़दमों में खुलती हैं, जैसे गेम का नया लेवल शुरू हो।",
    },
    "naariyal-chhaya": {
      name: "नारियल की छाँव",
      description:
        "काली नारियल-पत्तियों के बीच से सूर्यास्त के आसमान की ओर देखना; पत्तियाँ झूमती हैं, बीच का गुच्छा सरक जाता है और पत्तियाँ हट जाती हैं।",
    },
    kundal: {
      name: "फ़र्न की छतरी",
      description:
        "पेड़ जैसे फ़र्न की बड़ी पत्तियाँ जंगल की छतरी-सी स्क्रीन ढक लेती हैं; कुंडली-सा मुड़ा फ़र्न खुलता है और पत्तियाँ फैल जाती हैं।",
    },
    "makhmali-chakra": {
      name: "मख़मली पंखा",
      description:
        "सुनहरी झालर वाले, चुन्नटदार गहरे लाल मख़मल और मोरपंखी रेशम का सूरज-सा घेरा; बीच का पदक उठता है और चुन्नटें पीछे मुड़ जाती हैं।",
    },
    "kashi-phool": {
      name: "टाइल का फूल",
      description:
        "कोबाल्ट नीली और फ़िरोज़ी चमकदार टाइलों की पंखुड़ियों वाला बड़ा फूल; बीच की टाइल घूमकर हटती है और पंखुड़ियाँ बाहर की ओर झुक जाती हैं।",
    },
    beeda: {
      name: "पान के पत्ते",
      description:
        "चाँदी के वर्क में लिपटे पान के चारों ओर चमकते पान-पत्तों का घेरा; पान ऊपर उठ जाता है और पत्ते बाहर की ओर मुड़ जाते हैं।",
    },
    "farshi-phool": {
      name: "संगमरमर का नक़्श",
      description:
        "पीतल की किनारी वाली सफ़ेद और हल्की गुलाबी पंखुड़ियों का संगमरमरी फ़र्श-नक़्श; बीच की पीतल की घुंडी उठती है और पंखुड़ियाँ सरककर अलग होती हैं।",
    },
    "seep-khidki": {
      name: "सीप की खिड़की",
      description:
        "नीली चौखटों में जड़े दमकते सीप के फलकों वाली गोल खिड़की; बीच की धुरी घूमती है और फलक किवाड़ों की तरह खुल जाते हैं।",
    },
    phundne: {
      name: "फुंदनों की बौछार",
      description:
        "बड़े पॉम-पॉम के चारों ओर परांदे के रेशमी फुंदनों का फैलाव; पॉम-पॉम उछलकर दूर जाता है और फुंदने बाहर की ओर झूल जाते हैं।",
    },
    "japi-chakra": {
      name: "जापी चक्र",
      description:
        "रत्नजड़े बीच के चारों ओर बड़ी जापी के बुने हुए खंड; बीच ऊपर उठता है और खंड पंखे की तरह फैलते हुए घूमकर खुलते हैं।",
    },
    "akeek-phool": {
      name: "अक़ीक़ का फूल",
      description:
        "झिलमिलाते जियोड के चारों ओर सुनहरी किनारी वाली अक़ीक़ की फाँकों का फूल; जियोड ऊपर उठता है और फाँकें बाहर की ओर सरक जाती हैं।",
    },
    "sagar-seep": {
      name: "दमकती सीप",
      description:
        "अँधेरे में दमकती पंखे जैसी बड़ी सीप; उसके बीच का मोती उठता है और धारियाँ लहर की तरह बाहर की ओर खुलती हैं।",
    },
    "khet-chakra": {
      name: "खेतों का चक्र",
      description:
        "एक बावड़ी के चारों ओर ऊपर से दिखती गेंदे और चाय के खेतों की फाँकें; बावड़ी नीचे धँसती है और फाँकें बाहर सरक जाती हैं।",
    },
    doors: {
      name: "थीम के द्वार",
      description: "आपकी थीम की पेंटिंग बीच से दो दरवाज़ों की तरह खुलती है।",
    },
    palace: {
      name: "महल के द्वार",
      description: "तोरण वाली मेहराब के नीचे नक्काशीदार दरवाज़े सुनहरी रोशनी में खुलते हैं।",
    },
    temple: {
      name: "मंदिर के द्वार",
      description: "सुनहरे गोपुरम के नीचे घंटियों और दीयों वाले पीतल के दरवाज़े।",
    },
    curtain: {
      name: "रेशमी पर्दे",
      description: "झिलमिल रोशनियों वाले मखमली पर्दे मंच की तरह हटते हैं।",
    },
    envelope: {
      name: "शाही लिफ़ाफ़ा",
      description: "फूल की छाप वाली मोहर टूटती है और कार्ड बाहर आता है।",
    },
    lotus: {
      name: "खिलता कमल",
      description: "आपके नामों के चारों ओर बड़ा कमल पंखुड़ी-दर-पंखुड़ी खिलता है।",
    },
    mandap: {
      name: "विवाह मंडप",
      description: "केले के पत्तों वाले खंभों और मोगरे की लड़ियों के बीच झीने पर्दे ऊपर उठते हैं।",
    },
    jharokha: {
      name: "झरोखा",
      description: "बलुआ पत्थर के झरोखे की चार जाली वाली खिड़कियाँ मुड़कर खुलती हैं।",
    },
    phool: {
      name: "फूलों का पर्दा",
      description: "गेंदे, गुलाब और मोगरे की लड़ियाँ बीच से हटती हैं।",
    },
    scroll: {
      name: "शाही फ़रमान",
      description: "रिबन खुलता है और फ़रमान अपने आप लिपट जाता है।",
    },
    diyas: {
      name: "दीयों की कतार",
      description: "दीये एक-एक कर जलते हैं, फिर सुनहरी रोशनी फैल जाती है।",
    },
    rangoli: {
      name: "रंगोली",
      description: "रंगोली अपने आप रंगों में बनती है, फिर रोशनी में घूमकर खुलती है।",
    },
    peacock: {
      name: "मोर पंख",
      description: "आपके नामों के पीछे मोर के पंख फैलते हैं, फिर सिमट जाते हैं।",
    },
    storybook: {
      name: "कहानी की किताब",
      description: "सुनहरी कढ़ाई वाला कवर पहले पन्ने तक खुलता है।",
    },
    lanterns: {
      name: "आसमानी कंदील",
      description: "रात में चमकती कागज़ की कंदीलें तैरती हैं, फिर ऊपर उड़ जाती हैं।",
    },
    moonlit: {
      name: "चाँदनी रात",
      description: "मेहराबों के ऊपर अर्धचंद्र, तारे और झूलती कंदीलें।",
    },
    fireworks: {
      name: "आतिशबाज़ी",
      description: "गुंबदों के ऊपर आतिशबाज़ी होती है।",
    },
    balloons: {
      name: "गुब्बारे",
      description: "गुब्बारों से भरा आसमान ऊपर उड़ जाता है।",
    },
    gift: {
      name: "उपहार का डिब्बा",
      description: "रिबन खुलता है और ढक्कन उठ जाता है।",
    },
    none: {
      name: "सीधे अंदर",
      description: "कोई द्वार नहीं: मेहमान सीधे दृश्य पर पहुँचते हैं।",
    },
  },
  groups: {
    own: "आपके डिज़ाइन के लिए बना",
    fresh: "नई शुरुआत",
    skies: "आसमान और प्रकृति",
    crafts: "कला और रंग",
    play: "मज़ेदार",
    themed: "थीम की अपनी शुरुआत",
    tied: "बँधे द्वार",
    depth: "परतों वाले द्वार",
    bloom: "खिलते फूल",
    painted: "चित्रित द्वार",
    doors: "दरवाज़े और द्वार",
    reveals: "पर्दे और खुलते पल",
    light: "रोशनी और फूल",
    party: "पार्टी",
  },
  welcomeHeading: "उसके बाद स्वागत",
  welcomeIntro:
    "पन्नों से पहले आपके नामों के साथ एक पल। अपने-आप चुनने पर हर बार मेहमान को निमंत्रण के मुताबिक़ एक नया दृश्य दिखता है।",
  welcomeAuto: "अपने-आप",
  welcomeNames: {
    royal: "महल का तोरण",
    bloom: "कमल",
    lamps: "दीये",
    night: "चाँद और कंदील",
    party: "रंगीन बौछार",
    letter: "चिट्ठी",
    mandala: "मंडल",
    peacock: "मोर",
    sunrise: "सूर्योदय",
    garden: "बगिया",
    rangoli: "रंगोली",
    ghat: "शाम का घाट",
    fireflies: "जुगनू",
    "sky-lanterns": "आसमानी कंदील",
    kites: "पतंगें",
    waves: "समंदर पर सूर्यास्त",
  },
  godHeading: "ऊपर भगवान या शुभ चिह्न",
  godIntro:
    "ऊपर बीच में पूरा दिखता है, किसी शब्द के नीचे नहीं। बिना भगवान के खोलना हो तो इसे बंद रखें।",
  noGod: "कोई नहीं",
  gods: {
    ganesha: "गणेश जी",
    "ganesha-gold": "सुनहरे गणेश जी",
    "lakshmi-ganesha": "लक्ष्मी-गणेश",
    shrinathji: "श्रीनाथजी",
    venkateswara: "वेंकटेश्वर",
    jagannath: "जगन्नाथ",
    om: "ॐ",
    swastik: "स्वस्तिक",
    kalash: "मंगल कलश",
    diya: "दीया",
    prajapati: "प्रजापति",
    suzhi: "पिल्लैयार सुऴि",
    shri: "श्री",
    shankh: "शंख",
    kamal: "कमल",
    "ik-onkar": "इक ओंकार",
    khanda: "खंडा",
    "chand-tara": "चाँद-तारा",
    "786": "786",
    bismillah: "बिस्मिल्लाह",
    cross: "क्रॉस",
    dove: "कबूतर",
    jain: "जैन प्रतीक",
  },
};

export const quickCopy: Translation<typeof en.quickCopy> = {
  metaTitle: (name) => `अपना निमंत्रण बनाइए: ${name}`,
  back: "वापस",
  watch: "डेमो देखें",
  preview: "प्रीव्यू",
  free: "आज़माना मुफ़्त है। पैसे सिर्फ़ भेजते समय।",
  eyebrow: "इसे अपना बनाइए",
  title: "कुछ ही मिनटों में आपका निमंत्रण",
  intro:
    "अपने नाम लिखिए, वे डिज़ाइन पर दिखने लगेंगे। शब्द, संगीत और जवाब के सवाल अपने-आप भर जाते हैं।",
  whenHeading: "कब और कहाँ",
  addFunction: "और रस्म जोड़ें",
  addOne: (name) => `${name} जोड़ें`,
  remove: (name) => `${name} हटाएँ`,
  familyTitle: "परिवार के नाम",
  familyIntro: "चाहें तो: माता-पिता, आशीर्वाद और मेहमान किसे फ़ोन करें",
  photosTitle: "आपकी फ़ोटो",
  photosIntro: "चाहें तो: डिज़ाइन में आपकी फ़ोटो के लिए फ़्रेम है",
  see: "मेरा निमंत्रण देखें",
  nothingToPay: "अभी कुछ नहीं देना",
  more: "और विकल्प",
  moreIntro: "अपना गाना, शब्द, खुलने का दरवाज़ा और सवाल",
  make: "समय कम है? हम आपके लिए बना देंगे",
  hideMake: "इसे छिपाएँ",
  pickEvents: "आपके कार्यक्रम",
  moreEvents: "और कार्यक्रम",
  moreDesigns: (occasion) => `और ${occasion} डिज़ाइन`,
  moreDesignsNote:
    "आपके नाम, तारीखें और फ़ोटो साथ आते हैं। किसी डिज़ाइन पर टैप करके उसमें अपना निमंत्रण देखें।",
  opening: "डिज़ाइन खुल रहा है…",
  /** Another design picked under a live invite: a new invitation, or the live one changed. */
  pickTitle: (design) => (design ? `${design} किसके लिए?` : "यह डिज़ाइन किसके लिए?"),
  pickNew: "नया निमंत्रण",
  pickNewBody:
    "आपके नाम, तारीखें, जगहें, परिवार, फ़ोटो और शब्द साथ आते हैं। आपका लाइव निमंत्रण मेहमानों के लिए जैसा है वैसा ही रहेगा।",
  pickLive: "आपका लाइव निमंत्रण",
  pickLiveBody:
    "वही लिंक, मेहमान और जवाब, इस डिज़ाइन में। अगर आपका पैकेज इसे कवर नहीं करता, तो पैकेज चुनने तक मेहमानों को पुराना डिज़ाइन ही दिखेगा।",
  pickClose: "बंद करें",
};
