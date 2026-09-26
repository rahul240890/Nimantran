import type * as en from "../editor";
import type { Translation } from "@/i18n/text";

/* हिन्दी: निमंत्रण एडिटर (/create)। English: src/content/editor.ts. */

export const editor: Translation<typeof en.editor> = {
  metaTitle: "अपना निमंत्रण बनाएँ",
  metaDescription: "3D डिज़ाइन चुनें, नाम और रस्में जोड़ें, फिर अपना निमंत्रण देखें।",
  headerLabel: "निमंत्रण एडिटर",
  progressLabel: "निमंत्रण की प्रगति",
  progress: (step, total) => `${total} में से चरण ${step}`,
  done: "पूरा",
  back: "पीछे",
  next: "आगे बढ़ें",
  toPreview: "निमंत्रण देखें",
  preview: "निमंत्रण की झलक",
  showPreview: "झलक",
  previewTitle: "आपका निमंत्रण",
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
  missing: "यह निमंत्रण आपके खाते में नहीं है। शायद हटा दिया गया हो।",
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
  design: {
    label: "डिज़ाइन",
    eyebrow: "डिज़ाइन चुनें",
    title: "वह कार्ड चुनें जिसे मेहमान खोलेंगे",
    intro:
      "हर डिज़ाइन 3D में खुलता है, अपने बेल-बूटों, पंखुड़ियों और राग के साथ। कभी भी बदलें, आपके शब्द नहीं खोएँगे।",
  },
  couple: {
    label: "जोड़ा",
    eyebrow: "जोड़ा",
    title: "जोड़ा कौन है?",
    intro:
      "नाम कार्ड पर बड़े अक्षरों में आते हैं। बाक़ी पंक्तियाँ आपके अवसर के शब्दों से शुरू होती हैं; इन्हें अपने परिवार के अंदाज़ में बदल लीजिए।",
  },
  functions: {
    label: "रस्में",
    eyebrow: "रस्में",
    title: "सब कब और कहाँ है?",
    intro:
      "वे रस्में चुनें जिनमें मेहमानों को बुला रहे हैं। कार्ड पर मुख्य रस्म की तारीख़ और जगह आती है; खोलने पर मेहमान हर रस्म देखते हैं।",
  },
  extras: {
    label: "तस्वीरें और संगीत",
    eyebrow: "तस्वीरें और संगीत",
    title: "इसे अपना बनाइए",
    intro:
      "मेहमानों के लिए कुछ तस्वीरें जोड़ें, कार्ड खुलते समय बजने वाला राग चुनें, और तय करें कि जवाब में क्या पूछना है।",
  },
  preview: {
    label: "झलक",
    eyebrow: "झलक",
    title: "मेहमान यही देखेंगे",
    intro: "कार्ड खोलिए, संगीत चलाइए और एक बार फिर पढ़ लीजिए।",
  },
};

export const functionCopy: Translation<typeof en.functionCopy> = {
  roka: {
    name: "रोका",
    description: "परिवार रिश्ते को आशीर्वाद देते हैं और उपहार बदलते हैं",
    dressIdeas: ["उत्सवी पारंपरिक", "लाल और सुनहरा", "हल्के रंग के सूट और साड़ियाँ"],
  },
  engagement: {
    name: "सगाई",
    description: "अँगूठी की रस्म, सगाई या निश्चयतार्थम",
    dressIdeas: ["इंडो-वेस्टर्न", "हल्के रंग और आइवरी", "उत्सवी पारंपरिक"],
  },
  haldi: {
    name: "हल्दी",
    description: "हल्दी का आशीर्वाद, अक्सर शादी से पहले की सुबह",
    dressIdeas: ["पीले रंग", "सफ़ेद और हल्के रंग", "ऐसे कपड़े जिन पर दाग़ की फ़िक्र न हो"],
  },
  mehendi: {
    name: "मेहँदी",
    description: "मेहँदी, संगीत और सुकून भरी दोपहर",
    dressIdeas: ["हरे और फूलदार", "चटक और रंगीन", "आरामदेह पारंपरिक"],
  },
  sangeet: {
    name: "संगीत",
    description: "गीत, नृत्य और प्रस्तुतियों की शाम",
    dressIdeas: ["इंडो-वेस्टर्न", "सितारे और चमक", "गहरे रत्न जैसे रंग"],
  },
  wedding: {
    name: "विवाह",
    description: "फेरे, वचन और विवाह संस्कार",
    dressIdeas: ["पारंपरिक भारतीय", "हल्के रंग, काला या सफ़ेद नहीं", "रेशम और ज़री"],
  },
  reception: {
    name: "रिसेप्शन",
    description: "सबके साथ भोज और जश्न",
    dressIdeas: ["औपचारिक", "ब्लैक टाई", "उत्सवी शाम के कपड़े"],
  },
};

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
  address: "पता या नक़्शे का लिंक",
  addressHint: "निमंत्रण पर मेहमानों को रास्ता दिखाने वाला बटन मिलेगा।",
  dressCode: "ड्रेस कोड",
  dressIdeas: "ड्रेस कोड के सुझाव",
  onCard: "कार्ड पर",
};

export const coupleCopy: Translation<typeof en.coupleCopy> = {
  namesHeading: "नाम",
  wordingHeading: "शब्द",
  example: (sample) => `जैसे ${sample}`,
  joinerHint: "नामों के बीच का शब्द, जैसे &, संग या weds।",
  doorsHint: "द्वारों पर लिखे दो छोटे शब्द।",
  anyScript: "किसी भी लिपि में लिखें। हिन्दी, तमिल, बांग्ला और बाक़ी सब कार्ड पर आ जाती हैं।",
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
  musicHeading: "संगीत",
  musicHint: "कार्ड खुलते समय वहीं रचा जाता है, इसलिए मेहमानों का डेटा ख़र्च नहीं होता।",
  designsOwn: "डिज़ाइन का अपना",
  playOnOpen: "मेहमान कार्ड खोलें तो संगीत बजे",
  playOnOpenHint: "मेहमान कभी भी रोक सकते हैं।",
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

export const designCopy: Translation<typeof en.designCopy> = {
  marigold: {
    name: "गेंदा द्वार",
    description: "गेंदे के मंडल पर खुलते सुनहरे द्वार, आकाश दीप और राग यमन।",
  },
  rose: {
    name: "गुलाब बाग़",
    description: "हल्के गुलाबी कार्ड पर चढ़ती बेलें, द्वार पर गुलाब की माला और राग खमाज।",
  },
  emerald: {
    name: "पन्ना महल",
    description: "गहरे पन्ने पर जाली वाले मेहराब के महल-द्वार, चमेली, कंदील और राग बिहाग।",
  },
  scroll: {
    name: "शाही स्क्रॉल",
    description: "नक्काशीदार डंडों पर चर्मपत्र, सिंदूरी मुहर और राग देस।",
  },
  monogram: {
    name: "सादा मोनोग्राम",
    description: "शांत पत्थर-सफ़ेद कार्ड, बड़े अक्षरों में आपके नाम के पहले अक्षर और राग भूपाली।",
  },
  kasavu: {
    name: "केरल कसवु",
    description: "सुनहरी कसवु किनारी, पीतल के निलविलक्कु दीप, चमेली और राग मध्यमावती।",
  },
  rangmahal: {
    name: "रंग महल",
    description: "मरून महल के झरोखे, फ़िरोज़ी मीनाकारी फूल, कंदील और राग मांड।",
  },
  paithani: {
    name: "पैठणी मोर",
    description:
      "पैठणी की मंदिर किनारी और मोरपंख के पंखे, रानी और हरे रंग में, राग भीमपलासी के साथ।",
  },
  bandhani: {
    name: "बांधनी उत्सव",
    description: "गहरे फ़िरोज़ी पर बांधनी की बूँदें और शीशे का काम, रानी गुलाबी और राग पीलू।",
  },
  alpona: {
    name: "अल्पना लाल",
    description: "सफ़ेद पर लाल पाड़ की साड़ी और अल्पना का कमल, राग भैरवी के साथ।",
  },
  gopuram: {
    name: "गोपुरम पोन",
    description: "सुनहरे मंदिर गोपुरम, कोलम और पीतल के दीप, क्रीम रंग पर, राग हंसध्वनि के साथ।",
  },
  phulkari: {
    name: "फुलकारी रंग",
    description: "लाल खद्दर पर सुनहरी फुलकारी कढ़ाई, शाही नीले द्वार और राग काफ़ी।",
  },
};

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
    "यह तस्वीरों समेत आपके खाते में सहेजा गया है। लिंक पाने के लिए प्रकाशित करें, फिर WhatsApp पर भेजें।",
  notReady: "कुछ ब्योरा बाक़ी है",
  fix: (label) => `${label} पूरा करें`,
  occasionHeading: "अवसर",
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
