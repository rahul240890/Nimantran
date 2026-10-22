import type * as en from "../editor";
import type { Translation } from "@/i18n/text";
import type { LeadId, TaalId } from "@/lib/templates/ids";
import { designNames } from "./design-names";

/* मराठी: निमंत्रण एडिटर (/create). English: src/content/editor.ts. Draft for a native proofreader. */

export const editor: Translation<typeof en.editor> = {
  metaTitle: "आपले निमंत्रण बनवा",
  metaDescription: "3D डिझाइन निवडा, नावे आणि सोहळे जोडा, मग आपले निमंत्रण पाहा.",
  headerLabel: "निमंत्रण एडिटर",
  opening: "आपले निमंत्रण उघडत आहे…",
  progressLabel: "निमंत्रणाची प्रगती",
  progress: (step, total) => `${total} पैकी पायरी ${step}`,
  done: "पूर्ण",
  designChosen: "आपले डिझाइन",
  changeDesign: "डिझाइन बदला",
  stages: { design: "डिझाइन", details: "आपली माहिती", preview: "झलक आणि पाठवा" },
  sections: {
    label: "आपली माहिती, सहा भागांत",
    open: (part, summary, state) =>
      `${part}: ${summary}${state === "done" ? ", पूर्ण" : state === "check" ? ", एकदा पाहा" : ""}. उघडा`,
    done: "पूर्ण",
    check: "एकदा पाहा",
    edit: "बदला",
    names: (names) => (names.length ? names.join(" आणि ") : "नावे जोडा"),
    functions: (names) =>
      names.length === 0
        ? "आपले सोहळे निवडा"
        : names.length <= 3
          ? names.join(", ")
          : `${names.slice(0, 2).join(", ")} आणि आणखी ${names.length - 2}`,
    family: (filled) =>
      filled ? "कुटुंबाची माहिती जोडली" : "ऐच्छिक: आई-वडील, आशीर्वाद आणि निमंत्रक",
    photos: (photos) => (photos === 0 ? "अजून एकही फोटो नाही" : `${photos} फोटो`),
    words: (own) => (own ? "आपले स्वतःचे शब्द" : "आपल्या प्रसंगासाठी लिहिलेले"),
    music: (own, questions) =>
      `${own ? "आपले स्वतःचे संगीत" : "डिझाइनचे संगीत"} · ${questions === 0 ? "आणखी प्रश्न नाहीत" : `${questions} प्रश्न`}`,
  },
  back: "मागे",
  next: "पुढे चला",
  toPreview: "निमंत्रण पाहा",
  preview: "निमंत्रणाची झलक",
  showPreview: "झलक",
  previewTitle: "आपले निमंत्रण",
  livePreview: "लाइव्ह झलक, मोठी करून पाहा",
  hideLivePreview: "लाइव्ह झलक लपवा",
  showLivePreview: "लाइव्ह झलक दाखवा",
  close: "बंद करा",
  optional: "ऐच्छिक",
  characters: (used, max) => `${max} पैकी ${used} अक्षरे वापरली`,
  fixErrors: (count) => (count === 1 ? "एका गोष्टीकडे लक्ष द्या" : `${count} गोष्टींकडे लक्ष द्या`),
  errors: {
    required: "कृपया हे भरा",
    "too-long": "कार्डसाठी हे खूप मोठे आहे",
    "no-functions": "किमान एक सोहळा निवडा",
  },
  save: {
    idle: "ड्राफ्ट याच डिव्हाइसवर सेव्ह होतात",
    saving: "सेव्ह होत आहे…",
    saved: "ड्राफ्ट सेव्ह झाला",
    unavailable: "या डिव्हाइसवर सेव्ह करता येत नाही",
  },
};

export const syncCopy: Translation<typeof en.syncCopy> = {
  idle: "आपल्या खात्यात सेव्ह होते",
  syncing: "सेव्ह होत आहे…",
  synced: "आपल्या खात्यात सेव्ह झाले",
  offline: "या डिव्हाइसवर सेव्ह झाले, पुन्हा प्रयत्न सुरू",
  "needs-plan": "अजून लाइव्ह नाही: पॅकेज हवे",
  missing: "हे निमंत्रण आपल्या खात्यात नाही. कदाचित ते डिलीट झाले असेल.",
  switchFailed:
    "उघडलेले निमंत्रण सेव्ह करता आले नाही, म्हणून तेच उघडे आहे. थोड्या वेळाने पुन्हा प्रयत्न करा.",
};

export const stepCopy: Translation<typeof en.stepCopy> = {
  occasion: {
    label: "प्रसंग",
    eyebrow: "प्रसंग निवडा",
    title: "आपण कोणता आनंद साजरा करत आहात?",
    intro:
      "प्रसंगावरून निमंत्रण तयार होते: कोणते सोहळे, कोणते शब्द आणि कोणती डिझाइन्स. नंतर बदलला तरी आपण लिहिलेले काहीही जात नाही.",
  },
  tradition: {
    label: "परंपरा",
    eyebrow: "परंपरा निवडा",
    title: "कार्ड कोणत्या परंपरेनुसार असावे?",
    intro:
      "परंपरेवरून कार्डवरील शुभचिन्ह, सर्वात वरचे मंगलाचरण, विधींची स्थानिक नावे आणि कुटुंबाची शब्दरचना ठरते. सर्व काही बदलता येते, आणि ही पायरी वगळताही येते.",
  },
  design: {
    label: "डिझाइन",
    eyebrow: "डिझाइन निवडा",
    title: "पाहुणे उघडतील ते डिझाइन निवडा",
    intro:
      "प्रत्येक डिझाइनचे स्वतःचे चित्र, उघडण्याची स्वतःची पद्धत आणि स्वतःचा राग आहे. केव्हाही बदला, आपण लिहिलेला प्रत्येक शब्द तसाच राहील.",
  },
  couple: {
    label: "नावे",
    eyebrow: "नावे",
    title: "कोणाचे लग्न आहे?",
    intro: "कार्डची भाषा निवडा, मग नावे लिहा. प्रत्येक डिझाइनवर नावे मोठ्या अक्षरांत दिसतात.",
  },
  family: {
    label: "कुटुंब",
    eyebrow: "कुटुंब",
    title: "पाहुण्यांना कोण आमंत्रित करत आहे?",
    intro:
      "आई-वडील, आशीर्वाद आणि निमंत्रक. सर्व ऐच्छिक आहे: आपण जे भराल ते कुटुंबाच्या पानावर दिसेल.",
  },
  functions: {
    label: "सोहळे",
    eyebrow: "सोहळे",
    title: "सगळे केव्हा आणि कुठे आहे?",
    intro:
      "ज्या सोहळ्यांना पाहुण्यांना बोलावत आहात ते निवडा. कार्डवर मुख्य सोहळ्याची तारीख आणि ठिकाण दिसते; उघडल्यावर पाहुण्यांना प्रत्येक सोहळा दिसतो.",
  },
  photos: {
    label: "फोटो",
    eyebrow: "फोटो",
    title: "आपले फोटो जोडा",
    intro:
      "आपले डिझाइन त्याच्या फ्रेममध्ये दाखवते ते फोटो जोडा, आणि पाहुण्यांना पाहण्यासाठी आणखीही.",
  },
  words: {
    label: "कार्डवरील शब्द",
    eyebrow: "कार्डवरील शब्द",
    title: "कार्डवरील शब्द वाचून पाहा",
    intro:
      "वरच्या मंगलाचरणापासून प्रत्येक ओळ आपल्या प्रसंगासाठी आधीच लिहिलेली आहे. हवे तर आपल्या कुटुंबाच्या शैलीत बदला, किंवा आहे तशीच राहू द्या.",
  },
  music: {
    label: "संगीत आणि उत्तरे",
    eyebrow: "संगीत आणि उत्तरे",
    title: "संगीत आणि उत्तरे",
    intro: "कार्ड उघडताना वाजणारे संगीत, उत्तरात काय विचारायचे, आणि पाहुणे कोणाला फोन करू शकतात.",
  },
  preview: {
    label: "झलक",
    eyebrow: "झलक",
    title: "पाहुण्यांना हेच दिसेल",
    intro: "कार्ड उघडा, संगीत लावा आणि पुन्हा एकदा वाचून घ्या.",
  },
};

export const functionCopy: Translation<typeof en.functionCopy> = {
  roka: {
    name: "रोका",
    description: "दोन्ही कुटुंबे नात्याला आशीर्वाद देतात आणि भेटवस्तूंची देवाणघेवाण करतात",
    dressIdeas: ["सणासुदीचा पारंपरिक", "लाल आणि सोनेरी", "फिकट रंगांचे सूट आणि साड्या"],
  },
  engagement: {
    name: "साखरपुडा",
    description: "अंगठी घालण्याचा विधी, सगाई किंवा निश्चयतार्थम",
    dressIdeas: ["इंडो-वेस्टर्न", "फिकट रंग आणि आयव्हरी", "सणासुदीचा पारंपरिक"],
  },
  tilak: {
    name: "तिलक",
    description: "वधूपक्ष वराला तिलक लावून आशीर्वाद आणि भेटवस्तू देतो",
    dressIdeas: ["सणासुदीचा पारंपरिक", "कुर्ता आणि बंदगळा", "लाल आणि सोनेरी"],
  },
  "ganesh-puja": {
    name: "गणपती पूजन",
    description: "गणेश स्थापना किंवा पूजन, जेणेकरून शुभकार्य निर्विघ्नपणे सुरू व्हावे",
    dressIdeas: ["पारंपरिक भारतीय", "पिवळा आणि लाल", "साधे आणि सुरेख"],
  },
  "grah-shanti": {
    name: "ग्रहशांती",
    description: "लग्नापूर्वी घरी होम आणि कुटुंबासाठी आशीर्वाद",
    dressIdeas: ["पारंपरिक भारतीय", "सुती आणि रेशमी", "हलके रंग"],
  },
  mandap: {
    name: "मांडव मुहूर्त",
    description: "मांडव उभारून त्याचे पूजन; दक्षिणेत पंदक्काल",
    dressIdeas: ["पारंपरिक भारतीय", "उठावदार आणि रंगीबेरंगी", "आरामदायी पारंपरिक"],
  },
  mameru: {
    name: "मामेरू",
    description: "आजोळहून मामा भेटवस्तू घेऊन येतात; उत्तरेत भात किंवा मायरा",
    dressIdeas: ["बांधणी आणि लहरिया", "सणासुदीचा पारंपरिक", "लाल आणि गुलाबी"],
  },
  haldi: {
    name: "हळद",
    description: "हळदीचे आशीर्वाद, बहुधा लग्नाच्या आदल्या दिवशी सकाळी",
    dressIdeas: ["पिवळ्या छटा", "पांढरे आणि फिकट रंग", "डाग पडले तरी चालतील असे कपडे"],
  },
  mehendi: {
    name: "मेहंदी",
    description: "मेहंदी, संगीत आणि निवांत दुपार",
    dressIdeas: ["हिरवे आणि फुलांचे", "उठावदार आणि रंगीबेरंगी", "आरामदायी पारंपरिक"],
  },
  sangeet: {
    name: "संगीत",
    description: "गाणी, नृत्य आणि सादरीकरणांची संध्याकाळ",
    dressIdeas: ["इंडो-वेस्टर्न", "सिक्विन आणि चमचम", "रत्नांसारखे गडद रंग"],
  },
  garba: {
    name: "गरबा रात्र",
    description: "रात्री उशिरापर्यंत रास, गरबा आणि दांडिया",
    dressIdeas: ["चणिया चोली आणि केडियू", "आरशांचे भरतकाम", "उठावदार आणि रंगीबेरंगी"],
  },
  bhoj: {
    name: "कौटुंबिक स्नेहभोजन",
    description: "कुटुंब आणि मित्रांसाठी जेवण: केळवण, आइबुडो भात किंवा भोजन समारंभ",
    dressIdeas: ["सणासुदीचा पारंपरिक", "आरामदायी पारंपरिक", "स्मार्ट कॅज्युअल"],
  },
  baraat: {
    name: "वरात",
    description: "वाजत-गाजत, नाचत नवरदेवाची वरात निघते",
    dressIdeas: ["फेटे आणि पगड्या", "शेरवानी आणि कुर्ता", "सणासुदीचा पारंपरिक"],
  },
  "baraat-welcome": {
    name: "वरातीचे स्वागत",
    description: "वधूपक्ष वऱ्हाडी मंडळींचे स्वागत करतो: मिलनी किंवा जान आगमन",
    dressIdeas: ["पारंपरिक भारतीय", "रेशीम आणि जरी", "सणासुदीचा पारंपरिक"],
  },
  wedding: {
    name: "लग्न",
    description: "फेरे, वचने आणि विवाह संस्कार",
    dressIdeas: ["पारंपरिक भारतीय", "फिकट रंग, काळा किंवा पांढरा नको", "रेशीम आणि जरी"],
  },
  vidaai: {
    name: "पाठवणी",
    description: "आशीर्वादांसह वधूची पाठवणी",
    dressIdeas: ["पारंपरिक भारतीय", "हलके रंग", "रेशीम आणि जरी"],
  },
  reception: {
    name: "रिसेप्शन",
    description: "सर्वांसोबत जेवण आणि आनंदोत्सव",
    dressIdeas: ["फॉर्मल", "ब्लॅक टाय", "संध्याकाळचा सणासुदीचा पोशाख"],
  },
  birthday: {
    name: "वाढदिवसाची पार्टी",
    description: "केक, खेळ आणि वाढदिवसाचे आशीर्वाद",
    dressIdeas: ["फिकट रंग", "स्मार्ट कॅज्युअल", "जसे आहात तसे या"],
  },
  anniversary: {
    name: "वर्धापनदिनाचे स्नेहभोजन",
    description: "एकत्र घालवलेल्या वर्षांचा आनंद साजरा करणारी संध्याकाळ",
    dressIdeas: ["फॉर्मल", "सणासुदीचा पारंपरिक", "लाल आणि सोनेरी"],
  },
  party: {
    name: "पार्टी",
    description: "संगीत, जेवण आणि मित्र",
    dressIdeas: ["स्मार्ट कॅज्युअल", "कॉकटेल", "काहीतरी चमकदार"],
  },
  "baby-shower": {
    name: "डोहाळजेवण",
    description: "होणाऱ्या आईसाठी आशीर्वाद, गाणी आणि भेटवस्तू",
    dressIdeas: ["फिकट रंग", "सणासुदीचा पारंपरिक", "हिरवा आणि पिवळा"],
  },
  diwali: {
    name: "दिवाळी पार्टी",
    description: "लक्ष्मीपूजन, पणत्या, मिठाई आणि जेवण",
    dressIdeas: ["सणासुदीचा पारंपरिक", "लाल आणि सोनेरी", "काहीतरी चमकदार"],
  },
  housewarming: {
    name: "गृहप्रवेश",
    description: "नव्या घरात पूजा, होम आणि जेवण",
    dressIdeas: ["सणासुदीचा पारंपरिक", "फिकट रंग", "आरामदायी पारंपरिक"],
  },
  puja: {
    name: "पूजा",
    description: "कथा, आरती आणि प्रसाद",
    dressIdeas: ["सणासुदीचा पारंपरिक", "पांढरा आणि पिवळा", "पारंपरिक"],
  },
  "thread-ceremony": {
    name: "मुंज",
    description: "उपनयन, होम आणि कौटुंबिक जेवण",
    dressIdeas: ["पारंपरिक", "पांढरा आणि सोनेरी", "सणासुदीचा पारंपरिक"],
  },
  annaprashan: {
    name: "अन्नप्राशन",
    description: "आशीर्वादांसह बाळाचा भाताचा पहिला घास",
    dressIdeas: ["फिकट रंग", "सणासुदीचा पारंपरिक", "पिवळा आणि पांढरा"],
  },
  christening: {
    name: "बाप्तिस्मा",
    description: "चर्चमध्ये उपासना आणि कुटुंबासोबत दुपारचे जेवण",
    dressIdeas: ["पांढरे आणि फिकट रंग", "रविवारचा खास पोशाख", "स्मार्ट कॅज्युअल"],
  },
  "prayer-meet": {
    name: "श्रद्धांजली सभा",
    description: "प्रार्थना, भजन आणि आठवण",
    dressIdeas: ["पांढरे कपडे", "हलके रंग", "साधे आणि शांत"],
  },
  retirement: {
    name: "सेवानिवृत्ती समारंभ",
    description: "दीर्घ कारकिर्दीसाठी जेवण आणि शुभेच्छा",
    dressIdeas: ["स्मार्ट कॅज्युअल", "फॉर्मल", "सणासुदीचा पारंपरिक"],
  },
  "farewell-party": {
    name: "निरोप समारंभ",
    description: "संगीत, आठवणी आणि प्रेमाचा निरोप",
    dressIdeas: ["फॉर्मल", "स्मार्ट कॅज्युअल", "काहीतरी चमकदार"],
  },
  "shop-opening": {
    name: "उद्घाटन",
    description: "फीत कापणे, पूजा आणि अल्पोपहार",
    dressIdeas: ["सणासुदीचा पारंपरिक", "स्मार्ट कॅज्युअल", "फॉर्मल"],
  },
  launch: {
    name: "लाँच",
    description: "पहिली झलक, चार शब्द आणि जेवण",
    dressIdeas: ["बिझनेस फॉर्मल", "स्मार्ट कॅज्युअल", "ब्लॅक टाय"],
  },
  "ganesh-chaturthi": {
    name: "गणपती दर्शन",
    description: "आरती, दर्शन आणि प्रसाद",
    dressIdeas: ["सणासुदीचा पारंपरिक", "पिवळा आणि लाल", "पारंपरिक"],
  },
  navratri: {
    name: "नवरात्रीची रात्र",
    description: "गरबा, आरती आणि नैवेद्य",
    dressIdeas: ["चणिया चोली", "सणासुदीचा पारंपरिक", "उठावदार रंग"],
  },
  janmashtami: {
    name: "गोकुळाष्टमी",
    description: "भजन, झांकी आणि मध्यरात्रीची आरती",
    dressIdeas: ["सणासुदीचा पारंपरिक", "पिवळा आणि निळा", "बाळकृष्णाचा पोशाख"],
  },
  onam: {
    name: "ओणम सद्या",
    description: "पूक्कलम, सद्या आणि गाणी",
    dressIdeas: ["कसवू", "पांढरा आणि सोनेरी", "सणासुदीचा पारंपरिक"],
  },
  sankranti: {
    name: "मकर संक्रांत",
    description: "पतंग, तिळाचे लाडू आणि पोंगल",
    dressIdeas: ["उठावदार रंग", "सणासुदीचा पारंपरिक", "गच्चीवर आरामदायी असे"],
  },
  lohri: {
    name: "लोहडीची शेकोटी",
    description: "शेकोटी, रेवडी, भांगडा आणि जेवण",
    dressIdeas: ["फुलकारी", "उठावदार रंग", "काहीतरी उबदार"],
  },
  eid: {
    name: "इफ्तार दावत",
    description: "रोजा सोडणे, जेवण आणि ईदच्या शुभेच्छा",
    dressIdeas: ["सणासुदीचा पारंपरिक", "पांढरा आणि हिरवा", "काहीतरी शालीन"],
  },
  "naming-ceremony": {
    name: "बारसे",
    description: "नामकरण, आशीर्वाद आणि दुपारचे जेवण",
    dressIdeas: ["फिकट रंग", "सणासुदीचा पारंपरिक", "काहीतरी आरामदायी"],
  },
  holi: {
    name: "होळी",
    description: "रंग, संगीत, थंडाई आणि दुपारचे जेवण",
    dressIdeas: ["पांढरे कपडे", "रंग लागला तरी चालतील असे जुने कपडे", "आरामदायी चपला-बूट"],
  },
  christmas: {
    name: "ख्रिसमस पार्टी",
    description: "कॅरल, प्लम केक आणि रात्रीचे जेवण",
    dressIdeas: ["लाल आणि हिरवा", "काहीतरी सणासुदीचे", "काहीतरी उबदार"],
  },
  reunion: {
    name: "स्नेहमेळावा",
    description: "जुने मित्र, गप्पा आणि जेवण",
    dressIdeas: ["स्मार्ट कॅज्युअल", "आपल्या शाळेचे रंग", "काहीतरी आरामदायी"],
  },
  graduation: {
    name: "पदवीदान पार्टी",
    description: "केक, कुटुंब आणि अभिमानाचा क्षण",
    dressIdeas: ["स्मार्ट कॅज्युअल", "काहीतरी सणासुदीचे", "आपल्या कॉलेजचे रंग"],
  },
  "gudi-padwa": {
    name: "गुढीपाडवा",
    description: "गुढी, पूजा आणि सणाचे जेवण",
    dressIdeas: ["नऊवारी आणि कुर्ते", "सणासुदीचा पारंपरिक", "भगवा आणि हिरवा"],
  },
  baisakhi: {
    name: "बैसाखी",
    description: "सुगी, भांगडा, गिद्धा आणि जेवण",
    dressIdeas: ["फुलकारी", "उठावदार पगड्या आणि ओढण्या", "सणासुदीचा पारंपरिक"],
  },
  bihu: {
    name: "बिहू",
    description: "बिहू गीते, नृत्य आणि पिठा",
    dressIdeas: ["मेखला चादर", "गमोसा", "सणासुदीचा पारंपरिक"],
  },
  "raksha-bandhan": {
    name: "रक्षाबंधन",
    description: "राखी, आरती, मिठाई आणि दुपारचे जेवण",
    dressIdeas: ["सणासुदीचा पारंपरिक", "उठावदार रंग", "काहीतरी आरामदायी"],
  },
  "karva-chauth": {
    name: "करवा चौथ",
    description: "कथा, चंद्रदर्शन आणि रात्रीचे जेवण",
    dressIdeas: ["लाल आणि सोनेरी", "लग्नातला लेहेंगा किंवा साडी", "काहीतरी सणासुदीचे"],
  },
};

export const functionFields: Translation<typeof en.functionFields> = {
  group: "सोहळे",
  date: "तारीख",
  datePlaceholder: "तारीख निवडा",
  time: "सुरू होण्याची वेळ",
  timePlaceholder: "वेळ निवडा",
  venue: "ठिकाण",
  venuePlaceholder: "उदा. पिछोला लेकसाइड गार्डन्स, उदयपूर",
  city: "शहर किंवा ठिकाण",
  cityPlaceholder: "उदा. उदयपूर",
  cityHint: "सेव्ह द डेटसाठी फक्त तारीख आणि शहर पुरेसे आहे. वेळ आणि ठिकाण निमंत्रणात येतील.",
  suggested: (occasion) => `${occasion}चे सोहळे`,
  more: "आणखी सोहळे",
  moreHint: "ज्याला पाहुण्यांना बोलावत आहात असा आणखी कोणताही सोहळा जोडा.",
  showMore: (count) => `आणखी ${count} सोहळे दाखवा`,
  address: "पत्ता",
  addressHint: "पाहुण्यांना हा ठिकाणाच्या नावाखाली दिसेल.",
  pin: "Google Maps पिन",
  pinHint:
    "Google Maps मध्ये ठिकाण उघडा, Share दाबा आणि लिंक इथे पेस्ट करा. पाहुण्यांना नकाशा आणि अगदी त्याच जागेपर्यंत एका टॅपमध्ये रस्ता मिळेल.",
  pinInvalid: "ही Google Maps ची लिंक नाही. Google Maps मध्ये Share मधून लिंक कॉपी करा.",
  parking: "पार्किंग",
  parkingPlaceholder: "मुख्य गेटवर व्हॅले, हॉलच्या मागे मोफत पार्किंग",
  dressCode: "ड्रेस कोड",
  dressIdeas: "ड्रेस कोडसाठी कल्पना",
  onCard: "कार्डवर",
  endTime: "संपण्याची वेळ",
  endHint: "कार्यक्रम उशिरापर्यंत चालणार असेल तर रिकामे ठेवा.",
  muhuratHint:
    "सुरू होण्याची आणि संपण्याची अचूक वेळ, मिनिटापर्यंत, निवडा. पाहुण्यांना ती अगदी तशीच दिसेल.",
  moreDetails: "आणखी माहिती",
  moreDetailsHint: "संपण्याची वेळ, पत्ता, नकाशाची पिन, पार्किंग आणि ड्रेस कोड",
  samePlace: "दुसऱ्या सोहळ्याचीच जागा",
  sameAs: (name: string) => `${name} प्रमाणेच`,
  placeToEmpty: (count: number) => `हीच जागा उरलेल्या ${count} सोहळ्यांत भरा`,
};

export const coupleCopy: Translation<typeof en.coupleCopy> = {
  namesHeading: "नावे",
  example: (sample) => `उदा. ${sample}`,
  joinerHint: "नावांमधला शब्द, जसे &, संग किंवा weds.",
  doorsHint: "प्रवेशद्वारांवर लिहिलेले दोन छोटे शब्द.",
  anyScript: "कोणत्याही लिपीत लिहा. हिंदी, तमिळ, बांगला आणि इतर सर्व लिपी कार्डवर व्यवस्थित बसतात.",
  latinOnCard: (language) =>
    `आपले कार्ड ${language} मध्ये आहे, म्हणून पाहुण्यांना हे नाव इंग्रजी अक्षरांत दिसेल. खाली ${language} मध्ये लिहिलेले नाव निवडा, किंवा ${language} कीबोर्डने टाइप करा.`,
  spellings: (language) => `${language} अक्षरांत`,
  useSpelling: (name) => `${name} वापरा`,
  languagesHeading: "कार्डची भाषा",
  languagesHint: "दोन भाषा निवडल्यास पाहुणे निमंत्रणावर त्या बदलून पाहू शकतात.",
  bothLanguages: (main, second) => `${main} आणि ${second}`,
  secondHint: (main) => `एखादी ओळ रिकामी ठेवली तर ${main} कार्डवरचे शब्दच येतील.`,
  ideas: "कल्पना",
  ideasLabel: (field) => `${field}साठी कल्पना`,
  useIdea: (text) => `“${text}” वापरा`,
};

export const languageCopy: Translation<typeof en.languageCopy> = {
  mainHeading: "कार्डची भाषा",
  mainHint: "नावे, शब्द, सोहळ्यांची नावे आणि तारखा सर्व याच भाषेत येतील.",
  traditionMatch: "आपल्या परंपरेची",
  secondHeading: "दुसरी भाषाही जोडायची?",
  secondHint:
    "पाहुणे निमंत्रणावर दोन्ही भाषांमध्ये बदलून पाहू शकतील. हे ऐच्छिक आहे, आणि सेलिब्रेशन व ग्रँड पॅकेजमध्ये मिळते.",
  secondNone: "फक्त एक भाषा",
};

export const namesCopy: Translation<typeof en.namesCopy> = {
  steps: {
    birthday: { label: "वाढदिवस", eyebrow: "वाढदिवस", title: "कोणाचा वाढदिवस आहे?" },
    anniversary: { label: "जोडपे", eyebrow: "जोडपे", title: "कोणाच्या लग्नाचा वाढदिवस आहे?" },
    party: { label: "पार्टी", eyebrow: "पार्टी", title: "पार्टीचे नाव काय आहे?" },
    "baby-shower": { label: "होणारी आई", eyebrow: "डोहाळजेवण", title: "होणारी आई कोण आहे?" },
    diwali: { label: "दिवाळी", eyebrow: "दिवाळी", title: "आपल्या दिवाळी पार्टीचे नाव काय आहे?" },
    housewarming: { label: "घर", eyebrow: "नवे घर", title: "नव्या घराचे नाव काय आहे?" },
    puja: { label: "पूजा", eyebrow: "पूजा", title: "आपण कोणती पूजा ठेवली आहे?" },
    "thread-ceremony": { label: "बटू", eyebrow: "मुंज", title: "कोणाची मुंज आहे?" },
    annaprashan: { label: "बाळ", eyebrow: "अन्नप्राशन", title: "बाळाचे नाव काय आहे?" },
    christening: { label: "बाळ", eyebrow: "बाप्तिस्मा", title: "बाळाचे नाव काय आहे?" },
    "prayer-meet": {
      label: "स्मृतीप्रीत्यर्थ",
      eyebrow: "श्रद्धांजली सभा",
      title: "आपण कोणाच्या स्मृतीप्रीत्यर्थ सभा ठेवली आहे?",
    },
    retirement: {
      label: "सेवानिवृत्त",
      eyebrow: "सेवानिवृत्ती",
      title: "कोण सेवानिवृत्त होत आहेत?",
    },
    "farewell-party": {
      label: "निरोप",
      eyebrow: "निरोप समारंभ",
      title: "आपण कोणाला निरोप देत आहात?",
    },
    "shop-opening": {
      label: "व्यवसाय",
      eyebrow: "उद्घाटन",
      title: "आपल्या व्यवसायाचे नाव काय आहे?",
    },
    launch: { label: "इव्हेंट", eyebrow: "लाँच", title: "आपण काय लाँच करत आहात?" },
    "ganesh-chaturthi": {
      label: "गणपती",
      eyebrow: "गणेश चतुर्थी",
      title: "आपल्या गणेशोत्सवाचे नाव काय आहे?",
    },
    navratri: { label: "उत्सव", eyebrow: "नवरात्र", title: "आपल्या नवरात्रोत्सवाचे नाव काय आहे?" },
    janmashtami: {
      label: "उत्सव",
      eyebrow: "गोकुळाष्टमी",
      title: "आपल्या गोकुळाष्टमी उत्सवाचे नाव काय आहे?",
    },
    onam: { label: "उत्सव", eyebrow: "ओणम", title: "आपल्या ओणम स्नेहमेळ्याचे नाव काय आहे?" },
    sankranti: {
      label: "उत्सव",
      eyebrow: "संक्रांत",
      title: "आपल्या संक्रांत स्नेहमेळ्याचे नाव काय आहे?",
    },
    lohri: { label: "उत्सव", eyebrow: "लोहडी", title: "आपल्या लोहडीच्या रात्रीचे नाव काय आहे?" },
    eid: { label: "दावत", eyebrow: "ईद आणि इफ्तार", title: "आपल्या दावतीचे नाव काय आहे?" },
    "naming-ceremony": { label: "बाळ", eyebrow: "बारसे", title: "बाळाचे नाव काय आहे?" },
    holi: { label: "उत्सव", eyebrow: "होळी", title: "आपल्या होळी पार्टीचे नाव काय आहे?" },
    christmas: {
      label: "पार्टी",
      eyebrow: "ख्रिसमस",
      title: "आपल्या ख्रिसमस पार्टीचे नाव काय आहे?",
    },
    reunion: {
      label: "स्नेहमेळावा",
      eyebrow: "स्नेहमेळावा",
      title: "कोणती बॅच किंवा ग्रुप भेटत आहे?",
    },
    graduation: { label: "पदवीधर", eyebrow: "पदवीदान", title: "कोण पदवीधर होत आहे?" },
    "gudi-padwa": {
      label: "उत्सव",
      eyebrow: "गुढीपाडवा आणि उगादी",
      title: "आपल्या नववर्ष स्नेहमेळ्याचे नाव काय आहे?",
    },
    baisakhi: { label: "उत्सव", eyebrow: "बैसाखी", title: "आपल्या बैसाखी उत्सवाचे नाव काय आहे?" },
    bihu: { label: "उत्सव", eyebrow: "बिहू", title: "आपल्या बिहू उत्सवाचे नाव काय आहे?" },
    "raksha-bandhan": {
      label: "बहीण आणि भाऊ",
      eyebrow: "रक्षाबंधन",
      title: "कोणाचे रक्षाबंधन आहे?",
    },
    "karva-chauth": { label: "जोडपे", eyebrow: "करवा चौथ", title: "कोण साजरा करत आहे?" },
  },
  one: {
    birthday: { label: "उत्सवमूर्तीचे नाव", example: "आरव" },
    party: { label: "पार्टीचे नाव", example: "दिवाळीची रात्र" },
    "baby-shower": { label: "तिचे नाव", example: "प्रिया" },
    diwali: { label: "पार्टीचे नाव", example: "शर्मा कुटुंबाची दिवाळी" },
    housewarming: { label: "घराचे किंवा कुटुंबाचे नाव", example: "शर्मा निवास" },
    puja: { label: "पूजेचे नाव", example: "सत्यनारायण कथा" },
    "thread-ceremony": { label: "त्याचे नाव", example: "आरव" },
    annaprashan: { label: "बाळाचे नाव", example: "अनाया" },
    christening: { label: "बाळाचे नाव", example: "एरन" },
    "prayer-meet": { label: "त्यांचे नाव", example: "श्री. आर. के. शर्मा" },
    retirement: { label: "त्यांचे नाव", example: "आर. के. शर्मा" },
    "farewell-party": { label: "नाव किंवा बॅच", example: "2026 ची बॅच" },
    "shop-opening": { label: "व्यवसायाचे नाव", example: "शर्मा ज्वेलर्स" },
    launch: { label: "इव्हेंटचे नाव", example: "ऑरोरा लाँच" },
    "ganesh-chaturthi": { label: "उत्सवाचे नाव", example: "शर्मा कुटुंबाचा गणपती" },
    navratri: { label: "उत्सवाचे नाव", example: "नवरात्रोत्सव" },
    janmashtami: { label: "उत्सवाचे नाव", example: "कृष्ण जन्मोत्सव" },
    onam: { label: "उत्सवाचे नाव", example: "ओणम सद्या" },
    sankranti: { label: "उत्सवाचे नाव", example: "पतंगोत्सव" },
    lohri: { label: "उत्सवाचे नाव", example: "लोहडीची रात्र" },
    eid: { label: "दावतीचे नाव", example: "इफ्तार दावत" },
    "naming-ceremony": { label: "बाळाचे नाव", example: "अनाया" },
    holi: { label: "उत्सवाचे नाव", example: "होळी मिलन" },
    christmas: { label: "पार्टीचे नाव", example: "ख्रिसमस पार्टी" },
    reunion: { label: "बॅच किंवा ग्रुप", example: "2006 ची बॅच" },
    graduation: { label: "पदवीधराचे नाव", example: "रिया" },
    "gudi-padwa": { label: "उत्सवाचे नाव", example: "गुढीपाडवा स्नेहभोजन" },
    baisakhi: { label: "उत्सवाचे नाव", example: "बैसाखी मेळा" },
    bihu: { label: "उत्सवाचे नाव", example: "रोंगाली बिहू" },
  },
  oneHint:
    "हे मुखपृष्ठावर मोठ्या अक्षरांत छापले जाते. कोण आमंत्रित करत आहे आणि का, हे खालच्या शब्दांत लिहा.",
};

const LEAD_NAMES: Record<LeadId, string> = {
  santoor: "संतूर",
  sitar: "सतार",
  bansuri: "बासरी",
  shehnai: "सनई",
  veena: "वीणा",
};

const TAAL_NAMES: Record<TaalId, string> = {
  keherwa: "ढोलक",
  dadra: "ढोलक",
  garba: "गरबा ढोल आणि टाळ्या",
  bhangra: "पंजाबी ढोल",
};

export const extrasCopy: Translation<typeof en.extrasCopy> = {
  photosHeading: "फोटो",
  photosHint: (max) =>
    `${max} पर्यंत फोटो. सेव्ह करण्यापूर्वी ते फोनवरच लहान केले जातात, म्हणजे पाहुण्यांसाठी पटकन उघडतात.`,
  addPhotos: "फोटो जोडा",
  dropHere: "किंवा इथे टाका",
  photo: (index) => `फोटो ${index}`,
  removePhoto: (index) => `फोटो ${index} काढा`,
  moveEarlier: (index) => `फोटो ${index} आधी आणा`,
  full: (max) => `सर्व ${max} झाले. नवा जोडण्यासाठी एक काढा.`,
  processing: "फोटो तयार होत आहेत…",
  photoFailed: "हा फोटो वाचता आला नाही. JPEG किंवा PNG वापरून पाहा.",
  storageFailed: "या ब्राउझरमध्ये फोटो सेव्ह करता येत नाहीत, उदा. प्रायव्हेट मोडमध्ये.",
  emptyPhotos: "अजून एकही फोटो नाही",
  emptyPhotosBody: "जोडप्याचे फोटो आणि प्री-वेडिंग शूट सर्वात छान दिसतात.",
  coupleHeading: "फोटोचे पान",
  coupleHint:
    "आपला फोटो थीमच्या स्वतःच्या फ्रेममध्ये, आपल्या नावांनंतरच्या पानावर. प्रत्येक थीमच्या फ्रेमचा आकार वेगळा असतो.",
  coupleLayouts: {
    none: "फोटोचे पान नको",
    one: "आपल्या दोघांचा एक फोटो",
    two: "दोन फोटो, दोघांचे वेगवेगळे",
  },
  photoHintOne: "थीमच्या स्वतःच्या फ्रेममध्ये फोटो, नावानंतरच्या पानावर.",
  photoLayoutsOne: {
    none: "फोटोचे पान नको",
    one: "एक फोटो",
  },
  coupleAddFirst: "वर फोटो जोडा, तो फ्रेममध्ये बसेल.",
  designPhotosHeading: "आपल्या डिझाइनसाठी फोटो",
  designPhotosHint: (frames) =>
    frames === 1
      ? "ऐच्छिक. आपला फोटो डिझाइनच्या स्वतःच्या फ्रेममध्ये दिसेल. फोटोशिवायही डिझाइन पूर्ण दिसते."
      : "ऐच्छिक. प्रत्येक फ्रेमसाठी एक फोटो जोडा, किंवा वर आपल्या दोघांचा एक फोटो निवडा.",
  framePhotos: {
    together: "आपल्या दोघांचा फोटो",
    one: "आपला फोटो",
    of: (name) => `${name}चा फोटो`,
    first: "पहिला फोटो",
    second: "दुसरा फोटो",
  },
  addFramePhoto: (frame) => `जोडा: ${frame}`,
  changeFramePhoto: (frame) => `बदला: ${frame}`,
  framePhotoAdded: "जोडला",
  framePhotoOptional: "ऐच्छिक",
  changePhoto: "फोटो बदला",
  galleryHeading: "आणखी फोटो",
  galleryHint: (max) => `ऐच्छिक. पाहुणे हे निमंत्रणावर पाहू शकतील. एकूण ${max} फोटोंपर्यंत.`,
  coupleFrame: (index, frames) =>
    frames === 1 ? "फ्रेममधील फोटो" : index === 1 ? "पहिली फ्रेम" : "दुसरी फ्रेम",
  useThisPhoto: (index) => `फोटो ${index}`,
  fitHeading: "फोटो फ्रेममध्ये बसवा",
  fitHint: "प्रत्येक फोटो सरकवा, मोठा करा आणि सरळ करा, म्हणजे तो फ्रेममध्ये छान दिसेल.",
  adjust: "जुळवा",
  adjustLabel: (frame) => `फोटो जुळवा: ${frame}`,
  adjusted: "जुळवला",
  adjustTitle: "फोटो जुळवा",
  adjustDescription:
    "फोटो ओढून सरकवा. झूम करण्यासाठी दोन बोटांनी चिमटा घ्या, स्क्रोल करा किंवा स्लायडर वापरा.",
  adjustStage: "फ्रेममधील फोटो. सरकवण्यासाठी बाणांच्या कळा आणि झूमसाठी प्लस किंवा मायनस दाबा.",
  zoom: "झूम",
  straighten: "सरळ करा",
  turn: "फिरवा",
  turnLabel: "फोटो उजवीकडे पाव फेरी फिरवा",
  resetPhoto: "पूर्वीसारखे करा",
  savePhoto: "सेव्ह करा",
  cancelPhoto: "रद्द करा",
  closePhoto: "बंद करा",
  musicHeading: "संगीत",
  musicHint: "कार्ड उघडताना तिथल्या तिथे रचला जाणारा राग, किंवा आपले स्वतःचे गाणे.",
  musicSource: { raga: "राग", own: "आपले संगीत" },
  ragaHint: "तिथल्या तिथे रचला जातो, त्यामुळे पाहुण्यांचा डेटा खर्च होत नाही.",
  ownHint:
    "फोनमधून एखादे गाणे किंवा रेकॉर्डिंग निवडा आणि ते कुठून सुरू व्हावे आणि कुठे संपावे ते ठरवा. पाहुण्यांना पहिल्या टॅपपासून ते ऐकू येईल, एकदाच, पुन्हा न वाजता, आणि शेवटी ते हळूच थांबेल. आपल्या व्हिडिओतही ते वाजेल.",
  chooseSong: "गाणे निवडा",
  songTypes: "MP3, M4A, WAV किंवा AAC",
  readingSong: "आपले गाणे वाचले जात आहे…",
  songFailed: "ही फाइल वाचता आली नाही. MP3 किंवा M4A फाइल वापरून पाहा.",
  clipFailed: "या ब्राउझरमध्ये क्लिप बनवता आली नाही. Chrome किंवा Safari वापरून पाहा.",
  clipStorageFailed: "या ब्राउझरमध्ये संगीत सेव्ह करता येत नाही, उदा. प्रायव्हेट मोडमध्ये.",
  trimHeading: "आवडता भाग ठेवा",
  waveformLabel: (name) => `${name} चा आकार, ठेवलेला भाग उजळलेला`,
  startAt: "सुरुवात",
  endAt: "शेवट",
  keeping: (length) => `${length} ठेवत आहोत`,
  needNote: (need, pages) =>
    `आपले निमंत्रण साधारण ${need} चालते: उघडणे आणि ${pages === 1 ? "1 पान" : `${pages} पाने`}. किमान ${need} ठेवा, म्हणजे गाणे मध्येच थांबणार नाही किंवा पुन्हा वाजणार नाही.`,
  sceneNeedNote: (need) =>
    `आपले निमंत्रण साधारण ${need} चालते: उघडणे आणि दृश्य. किमान ${need} ठेवा, म्हणजे गाणे मध्येच थांबणार नाही किंवा पुन्हा वाजणार नाही.`,
  fullNote: (full) =>
    `साधारण ${full} ठेवा, म्हणजे पान खाली उत्तराच्या फॉर्मपर्यंत जाताना गाणे हळुवार वाजत राहील.`,
  fitInvitation: (length) => `निमंत्रणापुरते, ${length}`,
  fitAll: (length) => `खालच्या पानासह, ${length}`,
  tooShort: (song, need) =>
    `हे गाणे ${song} चे आहे, आणि आपले निमंत्रण साधारण ${need} चालते. मोठे गाणे निवडा, म्हणजे संगीत पुन्हा न वाजता शेवटपर्यंत चालेल.`,
  chooseLonger: "दुसरे गाणे निवडा",
  playPart: "सुरुवातीपासून ऐका",
  playEnd: "शेवट ऐका",
  stopPart: "थांबवा",
  rights: "मला हे संगीत वापरण्याचा अधिकार आहे",
  rightsHint:
    "आपले स्वतःचे रेकॉर्डिंग, परवाना घेतलेले गाणे किंवा रॉयल्टी-फ्री संगीत वापरा. Instagram किंवा YouTube वरून डाउनलोड केलेल्या क्लिप सहसा वापरता येत नाहीत, आणि मालकाने सांगितल्यास आम्ही संगीत काढून टाकतो.",
  useClip: "हे संगीत वापरा",
  makingClip: "आपली क्लिप तयार होत आहे…",
  cancelTrim: "रद्द करा",
  changeClip: "बदला",
  removeClip: "काढा",
  listenClip: "ऐका",
  clipMeta: (length) => `आपले संगीत · ${length}`,
  shortNote: (clip, need) =>
    `आपले निमंत्रण आता साधारण ${need} चालते, जे या ${clip} च्या भागापेक्षा मोठे आहे, त्यामुळे संगीत आधीच थांबेल. "बदला" वापरून भाग पुन्हा निवडा.`,
  listen: (raga) => `${raga} ऐका`,
  stopListening: "ऐकणे थांबवा",
  designsOwn: "डिझाइनचे स्वतःचे",
  playOnOpen: "पाहुण्यांनी कार्ड उघडल्यावर संगीत वाजू द्या",
  playOnOpenHint: "पाहुणे केव्हाही ते थांबवू शकतात.",
  pacing: {
    heading: "प्रत्येक पानाचा वेळ",
    hint: "संगीत आणि रील आपल्या पानांइतकीच चालतात. ऑटोमध्ये प्रत्येक पानाला त्याच्या शब्दांना लागेल तितका वेळ मिळतो.",
    auto: "ऑटो",
    seconds: (n: number) => `${n} से.`,
    summary: (pages: number, live: number, reel: number) =>
      `${pages} पाने: निमंत्रणावर साधारण ${live} सेकंद संगीत, आणि ${reel} सेकंदांची रील.`,
  },
  questionsHeading: "पाहुण्यांना प्रश्न",
  questionsHint:
    "प्रत्येक उत्तरात प्रत्येक सोहळ्याला कोण येत आहे ते कळते, आणि सोबत एखादा संदेशही. आणखी काही जाणून घ्यायचे असेल तर त्यावर खूण करा.",
  questionHints: {
    meal: "शाकाहारी, जैन, मांसाहारी किंवा व्हीगन",
    arrival: "ते शहरात कोणत्या दिवशी पोहोचतील",
    stay: "त्यांना खोली हवी आहे का",
    pickup: "त्यांना स्टेशन किंवा विमानतळावरून आणायचे आहे का",
    song: "त्यांना ऐकायला आवडेल असे एखादे गाणे",
  },
  ragaNames: {
    yaman: "राग यमन",
    khamaj: "राग खमाज",
    bihag: "राग बिहाग",
    desh: "राग देस",
    bhupali: "राग भूपाळी",
    madhyamavati: "राग मध्यमावती",
    mand: "राग मांड",
    bhimpalasi: "राग भीमपलास",
    pilu: "राग पिलू",
    bhairavi: "राग भैरवी",
    hamsadhwani: "राग हंसध्वनी",
    kafi: "राग काफी",
  },
  ragaSound: (sound, mood) =>
    `${LEAD_NAMES[sound.lead]}${sound.taal ? ` आणि ${TAAL_NAMES[sound.taal]}` : ""} · ${mood}`,
  ragaMoods: {
    yaman: "संध्याकाळचा, प्रणयरम्य",
    khamaj: "हलका आणि कोमल",
    bihag: "उशिरा संध्याकाळचा, लग्नाचा राग",
    desh: "पावसाळ्याचा, उत्सवी",
    bhupali: "प्रसन्न आणि आनंदी",
    madhyamavati: "मंगल, कर्नाटक संगीत",
    mand: "राजस्थानी लोकसंगीत, शाही",
    bhimpalasi: "दुपारचा, भक्तिमय",
    pilu: "लोकरंगी आणि खेळकर",
    bhairavi: "कोमल, निरोपाचा राग",
    hamsadhwani: "मंगल, गणपती वंदना",
    kafi: "उत्सवी लोकसंगीत, होळीचे रंग",
  },
};

export const faithCopy: Translation<typeof en.faithCopy> = {
  heading: "आपल्या धर्मानुसार शब्द",
  intro:
    "खाली सुचवलेले आशीर्वाद, ओळी आणि प्रवेशद्वारावरील शब्द यानुसार असतात. सर्व काही आपण बदलू शकता.",
  label: "धर्म",
  names: {
    hindu: "हिंदू",
    sikh: "शीख",
    muslim: "मुस्लिम",
    christian: "ख्रिश्चन",
    jain: "जैन",
    none: "धार्मिक ओळी नकोत",
  },
  doorIdeas: "प्रवेशद्वारावरील शब्द",
  doorIdea: (left, right) => `“${left}” आणि “${right}” वापरा`,
};

export const traditionCopy: Translation<typeof en.traditionCopy> = {
  group: "परंपरा",
  none: "कोणतीही परंपरा नाही",
  noneHint: "डिझाइनची स्वतःची शब्दरचना, कोणतेही चिन्ह नाही",
  nearYou: "आपल्या भागातील",
  draftNote:
    "या परंपरा अजून प्राथमिक स्वरूपात आहेत. प्रत्येक समाजातील लोक लाँचपूर्वी शब्दरचना, चिन्हे आणि विधींची नावे तपासत आहेत, म्हणून काही बरोबर वाटत नसेल तर आम्हाला नक्की कळवा.",
  names: {
    "north-hindu": "उत्तर भारतीय हिंदू",
    rajasthani: "राजस्थानी आणि मारवाडी",
    marathi: "मराठी",
    gujarati: "गुजराती",
    bengali: "बंगाली हिंदू",
    tamil: "तमिळ हिंदू",
    modern: "आधुनिक",
  },
  hints: {
    "north-hindu": "श्री गणेशाय नमः, दर्शनाभिलाषी आणि स्वागतोत्सुक",
    rajasthani: "श्री गणेशाय नमः, पीठी आणि महिला संगीत",
    marathi: "श्री गणेशाय नमः, साखरपुडा आणि हळद",
    gujarati: "कंकोत्रीची शब्दरचना, गोळ धाणा, पीठी आणि मुलांसाठी टहुको",
    bengali: "प्रजापतये नमः, गाये होलुद आणि बौ भात",
    tamil: "पिल्लैयार सुळी, निच्चयतार्थम आणि वरवेर्पु",
    modern: "कोणतेही धार्मिक चिन्ह नाही, कोणत्याही जोडप्यासाठी किंवा आंतरधर्मीय लग्नासाठी",
  },
  elements: "शुभचिन्ह आणि मंगलाचरण",
  elementsIntro: (tradition: string) =>
    `कार्डचा सर्वात वरचा भाग, आपल्या ${tradition} परंपरेनुसार. हवे तर बदला किंवा काढून टाका.`,
  elementsLater: "शुभचिन्ह आणि मंगलाचरण, जसे श्री गणेशाय नमः, आपण 'कार्डवरील शब्द' मध्ये निवडाल.",
  symbol: "कार्डवर सर्वात वरचे शुभचिन्ह",
  symbolNames: {
    om: "ॐ",
    kalash: "मंगल कलश",
    swastik: "स्वस्तिक",
    diya: "पणती",
    prajapati: "प्रजापती",
    suzhi: "पिल्लैयार सुळी",
    shri: "श्री",
    shankh: "शंख",
    kamal: "कमळ",
    "ik-onkar": "इक ओंकार",
    khanda: "खंडा",
    "chand-tara": "चंद्रकोर आणि तारा",
    "786": "786",
    bismillah: "बिस्मिल्ला",
    cross: "क्रॉस",
    dove: "कबूतर",
    jain: "जैन प्रतीक",
  },
  noSymbol: "कोणतेही चिन्ह नाही",
  symbolIntro: "आपल्या कार्डवर सर्वात वर, प्रत्येक शब्दाच्या वर. एखादे निवडा किंवा वगळा.",
  symbolNote:
    "गणपती बाप्पा आणि इतर चित्रित देवता त्याऐवजी निमंत्रण उघडताना आशीर्वाद देऊ शकतात: डिझाइनसोबत 'निमंत्रण कसे उघडेल' मध्ये निवडा.",
  invocation: "मंगलाचरण",
  invocationModes: { script: "मूळ लिपीत", latin: "इंग्रजी अक्षरांत", off: "दाखवू नका" },
  meanings: {
    "Shri Ganeshaya Namah": "श्री गणेशाला नमन",
    "Prajapataye Namah": "विवाहाचे देव प्रजापती यांना नमन",
    "Sri Vinayagar Thunai": "श्री विनायकाच्या कृपेने",
  },
  wording: "कुटुंबाची शब्दरचना",
  wordingIntro: "पाहुणे हे कार्डच्या खाली वाचतील. यापैकी कोणतेही रिकामे ठेवू शकता.",
  wordingLabels: {
    blessingsFrom: "शुभाशीर्वाद",
    requesters: "निमंत्रक",
    welcome: "स्वागतोत्सुक",
    children: "चिमुकल्यांचा आग्रह",
  },
};

export const designCopy: Translation<typeof en.designCopy> = designNames.cards;

export const occasionCopy: Translation<typeof en.occasionCopy> = {
  group: "प्रसंग",
  setsUp: "यातून काय तयार होते",
  planned: "ठरलेले सोहळे",
  questions: "पाहुण्यांना विचारले जाईल",
  noQuestions: "फक्त ते येत आहेत का आणि किती जण",
  designs: (count) => (count === 1 ? "1 सुचवलेले डिझाइन" : `${count} सुचवलेली डिझाइन्स`),
  suggestedBadge: "सुचवलेले",
  suggestedFor: (occasion) => `${occasion}साठी सुचवलेले`,
  moreDesigns: "आणखी डिझाइन्स",
};

export const previewCopy: Translation<typeof en.previewCopy> = {
  ready: "आपले निमंत्रण तयार आहे",
  live: "आपले निमंत्रण लाइव्ह आहे",
  liveBody: (link) => `पाहुणे ते ${link} वर उघडतात. इथे केलेले बदल तिथे लगेच दिसतात.`,
  readyBody:
    "हे याच डिव्हाइसवर सेव्ह झाले आहे. ते आपल्या खात्यात ठेवण्यासाठी आणि प्रकाशित करण्यासाठी साइन इन करा, मग लिंक WhatsApp वर पाठवा.",
  readyBodyAccount:
    "हे फोटोंसह आपल्या खात्यात सेव्ह झाले आहे. आधी ते पाहुण्यांच्या नजरेतून पाहा, मग लिंक मिळवण्यासाठी प्रकाशित करा.",
  seeAsGuest: "पाहुण्यांच्या नजरेतून पाहा",
  watchVideo: "व्हिडिओमध्ये पाहा",
  seeAsGuestBody:
    "संपूर्ण निमंत्रण, पूर्ण स्क्रीनवर: उघडणे, संगीत, प्रत्येक पान आणि उत्तराचा फॉर्म.",
  notReady: "काही तपशील बाकी आहेत",
  fix: (label) => `${label} पूर्ण करा`,
  occasionHeading: "प्रसंग",
  namesHeading: "नावे",
  functionsHeading: "सोहळे",
  photosHeading: "फोटो",
  noPhotos: "एकही फोटो जोडलेला नाही",
  musicHeading: "संगीत",
  playsOnOpen: "पाहुण्यांनी कार्ड उघडताच वाजते",
  dressCode: "ड्रेस कोड",
  edit: "बदला",
  editStep: (label) => `${label} बदला`,
  startOver: "नवे निमंत्रण सुरू करा",
  startOverTitle: "नवे निमंत्रण सुरू करायचे?",
  startOverBody: "यामुळे या डिव्हाइसवर सेव्ह केलेली नावे, सोहळे आणि फोटो पुसले जातील.",
  startOverConfirm: "पुसून नव्याने सुरू करा",
  startOverKeepBody:
    "हे निमंत्रण 'माझी निमंत्रणे' मध्ये राहील, आपण केव्हाही परत येऊ शकता. नवे निमंत्रण रिकामे सुरू होईल.",
  startOverKeepConfirm: "नवे निमंत्रण सुरू करा",
  cancel: "हेच निमंत्रण ठेवा",
  cleared: "नवे निमंत्रण सुरू झाले",
};

export const suiteCopy: Translation<typeof en.suiteCopy> = {
  heading: "आपल्या प्रसंगासाठी डिझाइन्स",
  intro:
    "उघडल्यानंतर पाहुण्यांना याच डिझाइनमध्ये आपली नावे, प्रत्येक सोहळा आणि उत्तराचा फॉर्म दिसतो. आपल्या परंपरेतील विधींची नावे, आशीर्वचन आणि शुभचिन्ह प्रत्येक डिझाइनमध्ये तसेच राहतात.",
  cardHeading: "कार्डचा कागद आणि रंग",
  cardIntro: "'कार्डचे रंग' ची पाने इथे निवडलेल्या कार्डचा कागद, रंग आणि राग घेतात.",
  suggested: "आपल्या परंपरेला साजेसे",
  pairs: (design) => `कार्डही ${design} मध्ये बदलेल`,
  preview: "पाने चालवून पाहा",
  textBox: "शब्दांमागे चौकट",
  textBoxHint:
    "बंद असताना शब्द थेट चित्रावर दिसतात. चालू केल्यावर ते कार्डच्या रंगाच्या हलक्या चौकटीत दिसतात. तुलना करण्यासाठी पाने चालवून पाहा; हेच बटण पानांवरही आहे.",
  formatHeading: "निमंत्रणाचा प्रकार",
  formats: {
    scene: {
      name: "दृश्य",
      description:
        "सर्व काही एकाच चित्रावर: आपले फोटो, नावे आणि प्रत्येक सोहळा एकामागून एक उडत येतात. पाहुण्यांना पटकन सर्व समजते.",
    },
    story: {
      name: "कथा",
      description: "प्रत्येक सोहळ्यासाठी पूर्ण स्क्रीनचे स्वतंत्र चित्रित पान, एकामागून एक.",
    },
  },
  blessingPage: "आशीर्वादाच्या पानाने सुरुवात करा",
  blessingPageHint:
    "ही थीम देवाच्या चित्राने आणि त्याखालील आपल्या आशीर्वादाने सुरू होते, आपल्या नावांच्या आधी.",
  names: designNames.names,
  descriptions: designNames.descriptions,
};

export const studioCopy: Translation<typeof en.studioCopy> = {
  pagesHint: "आपण जे पान भरत आहात, ते टाइप करतानाच इथे दिसते.",
  pageNames: {
    blessing: "आशीर्वाद",
    cover: "मुखपृष्ठ",
    couple: "फोटो",
    family: "कुटुंब",
    "family-more": "कुटुंब, पुढे",
    "family-end": "कुटुंब, शेवटी",
    invite: "निमंत्रण",
    reply: "उत्तर",
  },
  pageList: "निमंत्रणाची पाने",
  showPage: (name) => `${name} पान दाखवा`,
  phone: (name) => `${name} पान, पाहुण्यांना दिसेल तसे`,
  lettering: "अक्षरे",
  letteringIntro:
    "प्रत्येक पानावर शब्द कसे दिसावेत ते निवडा. फक्त आपल्या कार्डची भाषा लिहू शकणारे फॉन्टच दाखवले आहेत.",
  namesFont: "नावे",
  wordsFont: "इतर शब्द",
  themeFont: "थीमचा स्वतःचा",
  size: "आकार",
  sizes: { small: "लहान", medium: "मध्यम", large: "मोठा" },
  style: "नावांची शैली",
  bold: "ठळक",
  italic: "तिरकी",
  capitals: "कॅपिटल",
  colour: "नावांचा रंग",
  colours: {
    theme: "थीमचा स्वतःचा",
    maroon: "मरून",
    gold: "सोनेरी",
    saffron: "केशरी",
    ink: "शाई",
    ivory: "हस्तिदंती",
  },
  feels: {
    classic: "पारंपरिक",
    script: "प्रवाही",
    bold: "ठसठशीत",
    clean: "साधा",
    handwritten: "हस्ताक्षर",
  },
  reset: "थीमची अक्षरे परत आणा",
};

export const familyCopy: Translation<typeof en.familyCopy> = {
  sideHeading: (name) => `${name} यांचे कुटुंब`,
  sideFallback: { first: "पहिले कुटुंब", second: "दुसरे कुटुंब" },
  relation: "कार्डवर असे छापले जाईल",
  relations: { child: "अपत्य", daughter: "सुकन्या", son: "सुपुत्र" },
  parents: "आई-वडिलांची नावे",
  parentsExample: "सौ. सुनीता व श्री. रमेश पटेल",
  parentsHint: "जसे छापायचे तसे लिहा, श्री., सौ. किंवा कै. सह.",
  town: "मूळ गाव",
  townExample: "अहमदाबाद",
  more: "आशीर्वाद आणि निमंत्रक",
  examples: {
    blessingsFrom: "सौ. कमला व श्री. रामप्रसाद शर्मा",
    requesters: "समस्त शर्मा परिवार",
    welcome: "राहुल, प्रिया आणि अंकित",
    children: "आमच्या काकांच्या लग्नाला नक्की या!",
  },
  memory: "पुण्यस्मृती",
  memoryExample: "कै. श्री. मोहनलाल पटेल",
  memoryHint: "दिवंगत आप्तजन, ज्यांच्या आशीर्वादांचे कुटुंब स्मरण करते.",
  contacts: "पाहुण्यांनी कोणाला फोन करावा",
  contactName: "नाव",
  contactNameExample: "रमेश पटेल",
  phone: "फोन",
  addContact: "नंबर जोडा",
  removeContact: (n) => `नंबर ${n} काढा`,
};

export const pageWordsCopy: Translation<typeof en.pageWordsCopy> = {
  open: "हे पान बदला",
  title: (page) => `${page} पान`,
  description: "कोणतीही ओळ बदला, आपली स्वतःची जोडा, आणि शब्द चित्रावर कुठे दिसावेत ते निवडा.",
  close: "झाले",
  words: "शब्द",
  line: (n) => `ओळ ${n}`,
  kind: (n) => `ओळ ${n} चा प्रकार`,
  kinds: {
    label: "छोटे शीर्षक",
    script: "आशीर्वचन",
    display: "मोठे",
    date: "तारीख",
    venue: "ठिकाण",
    body: "साधा मजकूर",
    small: "लहान अक्षरे",
  },
  up: (n) => `ओळ ${n} वर न्या`,
  down: (n) => `ओळ ${n} खाली न्या`,
  remove: (n) => `ओळ ${n} काढा`,
  add: "ओळ जोडा",
  reset: "सुचवलेले शब्द परत आणा",
  own: "हे पान आपण स्वतः लिहिले आहे. नंतर बदललेली नावे, तारखा किंवा ठिकाणे इथे तेव्हाच दिसतील, जेव्हा आपण सुचवलेले शब्द परत आणाल.",
  inLanguage: (language) => `हे शब्द ${language} कार्डसाठी आहेत.`,
  overflow:
    "या चित्रासाठी शब्द खूप जास्त आहेत, सर्वात लहान आकारातही. एखादी ओळ लहान करा किंवा काढा.",
  placement: "जागा",
  place: "उंची",
  places: { top: "वर", middle: "मध्यभागी", bottom: "खाली" },
  align: "मांडणी",
  aligns: { center: "मध्यभागी", start: "डावीकडे" },
  box: "शब्दांमागे चौकट",
  boxes: { theme: "इतर पानांसारखे", on: "चौकट", off: "चित्रावर छापलेले" },
  hide: "हे पान वगळा",
  hideHint: "पाहुण्यांना दिसणार नाही. केव्हाही पुन्हा चालू करा.",
  hidden: "वगळले",
};

export const aiCopy: Translation<typeof en.aiCopy> = {
  open: "AI कडून लिहून घ्या",
  title: "AI कडून शब्द लिहून घ्या",
  description:
    "AI आपली नावे, कुटुंब आणि सोहळ्यांवरून कार्डच्या भाषेत पाने लिहितो. नंतर काहीही बदला.",
  close: "बंद करा",
  tone: "शैली",
  tones: { traditional: "पारंपरिक", warm: "आपुलकीचा", fun: "मजेशीर" },
  scope: "पाने",
  scopes: { all: "सर्व पाने", page: (page) => `फक्त ${page} पान` },
  write: "लिहा",
  again: "पुन्हा लिहा",
  shorten: "AI ने लहान करा",
  busy: "लिहिले जात आहे…",
  done: "लिहून झाले. शब्द बदलण्यासाठी कोणतेही पान उघडा.",
  left: (n) =>
    n === 1
      ? "या निमंत्रणावर 1 मोफत ड्राफ्ट बाकी आहे."
      : `या निमंत्रणावर ${n} मोफत ड्राफ्ट बाकी आहेत.`,
  languages: (language) => `${language} कार्डसाठी लिहिले. दुसऱ्या भाषेसाठी वर कार्डची भाषा बदला.`,
  errors: {
    "sign-in": "साइन इन करा म्हणजे निमंत्रण सेव्ह होईल, मग AI त्यासाठी लिहू शकेल.",
    off: "AI कडून लिहून घेण्याची सोय अजून सुरू झालेली नाही.",
    "not-found": "साइन इन करा म्हणजे निमंत्रण सेव्ह होईल, मग AI त्यासाठी लिहू शकेल.",
    "used-up":
      "या निमंत्रणाचे 3 मोफत ड्राफ्ट वापरून झाले. कोणत्याही पॅकेजमध्ये हवे तितक्या वेळा लिहून घ्या.",
    failed: "आत्ता शब्द लिहिता आले नाहीत. पुन्हा प्रयत्न करा.",
  },
};

export const openingCopy: Translation<typeof en.openingCopy> = {
  heading: "उघडणारे प्रवेशद्वार (कव्हर स्क्रीन)",
  intro:
    "लिंक उघडताच पाहुणे सर्वात आधी हेच पाहतील: एक प्रवेशद्वार, दारे, पडदा किंवा कव्हर, जे पूर्ण स्क्रीनवर उघडून तुमचे निमंत्रण दाखवते. उघडताना पाहण्यासाठी एखाद्यावर टॅप करा. तुम्ही ते कधीही बदलू शकता, पाठवल्यानंतरही.",
  filterLabel: "प्रकारानुसार पाहा",
  filterAll: "सर्व",
  summaryBody: "निमंत्रण उघडण्यापूर्वी पाहुणे सर्वात आधी हेच पाहतात.",
  change: "प्रवेशद्वार बदला",
  dialogTitle: "तुमचे उघडणारे प्रवेशद्वार निवडा",
  dialogBody:
    "तुमची निवड लगेच जतन होते. पाहुण्यांचे प्रीव्ह्यू, व्हिडिओ आणि तुमची लाइव्ह लिंक, सर्व यानेच उघडतील.",
  done: "झाले",
  styles: {
    "jaali-vriksh": {
      name: "जीवनवृक्ष जाळी",
      description: "कोरीव वालुकाश्म जाळीतून उडत महालाच्या बागेत.",
    },
    pachchikari: {
      name: "दगडी फुले",
      description: "जडावाची दगडी फुले वर येतात आणि संगमरवर खाली सरकतो.",
    },
    "chik-baradari": {
      name: "वेताचा पडदा",
      description: "विणलेला वेताचा पडदा वर गुंडाळला जातो आणि चांदण्यातील मंडप दिसतो.",
    },
    "baori-deep": {
      name: "दिव्यांची बारव",
      description: "पणत्यांनी उजळलेल्या बारवेत खाली उतरा.",
    },
    "ikat-dhaaga": {
      name: "इकतचे धागे",
      description: "इकत रेशीम धाग्याधाग्याने उलगडते.",
    },
    "olai-chuvadi": {
      name: "ताडपत्रे",
      description: "ताडपत्रांची पाने दोन्ही बाजूंना सरकतात.",
    },
    "konark-chakra": {
      name: "कोणार्क चक्र",
      description: "कोरीव दगडी चाक वाळूवरून दूर लोटत जाते.",
    },
    "mandvi-dhow": {
      name: "उतरणारे शीड",
      description: "ठिगळ लावलेले शीड घड्या होत जहाजबांधणी तळावर उतरते.",
    },
    shekhawati: {
      name: "सोनेरी खरवड",
      description: "सोनेरी वर्ख खरवडला जातो आणि रंगवलेली हवेली दिसते.",
    },
    lehar: {
      name: "वाळूवरची लाट",
      description: "लाट वाळू धुऊन नेते आणि खाजण दिसते.",
    },
    "naksha-pangong": {
      name: "घडी होणारा नकाशा",
      description: "जुना नकाशा घडी होऊन डोंगरातील सरोवरावर उतरतो.",
    },
    "toran-mala": {
      name: "उतरणारी तोरणे",
      description: "आंब्याच्या पानांच्या तोरणांच्या रांगा एकेक करून उतरतात.",
    },
    jhilmil: {
      name: "मिरर बॉल",
      description: "मिरर बॉल दालन ठिकठिकाणी उजळवतो.",
    },
    "howrah-tareekh": {
      name: "कॅलेंडरची पाने",
      description: "कॅलेंडरची पाने त्या दिवसापर्यंत उलटतात.",
    },
    "barf-khidki": {
      name: "दवाळलेली खिडकी",
      description: "काचेवरचे दव पुसले जाते आणि वितळून जाते.",
    },
    "pondy-gali": {
      name: "सरकणारे कोडे",
      description: "कोड्याचे तुकडे निघतात आणि बोगनवेलीची गल्ली दिसते.",
    },
    "irani-carrom": {
      name: "कॅरम बोर्ड",
      description: "कॅरम बोर्ड मागे कलतो आणि बाजूला सरकतो.",
    },
    channapatna: {
      name: "खेळण्यांचे ठोकळे",
      description: "लाकडी खेळण्यांच्या ठोकळ्यांची भिंत कोसळते.",
    },
    "ped-ghar": {
      name: "रंग भरणे",
      description: "पेन्सिलच्या चित्रात रंग भरतात.",
    },
    "jhalar-palna": {
      name: "पाळण्याचे छत",
      description: "लेसचे छत बटव्यासारखे वर ओढले जाते.",
    },
    "rajwada-pol": {
      name: "राजस्थानी महालाचे द्वार",
      description:
        "गुलाबी वालुकाश्माच्या कमानीतील कोरीव सागवानी दरवाजे पणत्यांनी सजलेल्या अंगणात उघडतात.",
    },
    "gopuram-kadhavu": {
      name: "दाक्षिणात्य मंदिराचे दरवाजे",
      description: "पितळी खिळे आणि घंटा असलेले दरवाजे दिव्यांनी उजळलेल्या मंडपात उघडतात.",
    },
    "noor-darwaza": {
      name: "मुघल संगमरवरी द्वार",
      description:
        "संगमरवरी कमानीतील चांदीच्या जाळीचे दरवाजे चांदण्यातील कारंज्यांच्या बागेत उघडतात.",
    },
    "phoolon-ki-deewar": {
      name: "फुलांची भिंत",
      description: "गुलाब आणि झेंडूची भिंत दुभंगते आणि लुकलुकत्या दिव्यांखालचा मंडप दिसतो.",
    },
    "haveli-kiwad": {
      name: "हवेलीचे दरवाजे",
      description: "आरशांच्या कामाचे रंगवलेले गुजराती दरवाजे झोपाळा असलेल्या अंगणात उघडतात.",
    },
    "shahi-parda": {
      name: "शाही पडदे",
      description: "मरून आणि सोनेरी मखमली पडदे बाजूला होतात आणि झुंबरांनी उजळलेले दालन दिसते.",
    },
    "deco-gates": {
      name: "आर्ट डेको गेट",
      description: "काळे आणि पितळी गेट शहरावरील गच्चीवरच्या पार्टीत उघडतात.",
    },
    "bagiya-gate": {
      name: "गुलाबबागेचे गेट",
      description: "गुलाबांनी वेढलेले पांढरे लोखंडी गेट कंदिलांनी उजळलेल्या बागेत उघडतात.",
    },
    "mela-tamboo": {
      name: "जत्रेचा तंबू",
      description: "पट्टेदार तंबूचे पडदे वर होतात आणि फुगे, चक्री पाळणा आणि मोठा केक दिसतो.",
    },
    "chaand-dwar": {
      name: "चांदण्या बागेचे दरवाजे",
      description:
        "चंद्रकोरी आणि ताऱ्यांचे शिंपल्यांनी जडवलेले दरवाजे चांदण्यातील तळ्याच्या बागेत उघडतात.",
    },
    "ritu-dwar": {
      name: "अंगणाचे दरवाजे",
      description:
        "प्रत्येक ऋतूचे एक पान कोरलेले जुने टेराकोटा-हिरवे दरवाजे बहरलेल्या झाडावर उघडतात.",
    },
    "raag-dwar": {
      name: "संगीत दालनाचे दरवाजे",
      description:
        "लाजवर्दी आणि सोनेरी रंगवलेले दरवाजे पहाटे वीणा असलेल्या महालाच्या गच्चीवर उघडतात.",
    },
    "van-dwar": {
      name: "जंगलाचे दार",
      description:
        "फांद्या आणि पानांनी विणलेले दरवाजे कथांच्या जंगलात जाणाऱ्या शेवाळलेल्या वाटेवर उघडतात.",
    },
    "patang-dwar": {
      name: "गच्चीचे दरवाजे",
      description: "पतंग रंगवलेले फिरोजी दरवाजे पहाटेच्या गच्च्यांवर उघडतात.",
    },
    "kumhar-dwar": {
      name: "कुंभारवाड्याचे दरवाजे",
      description: "टेराकोटा टाइल्सचे निळे दरवाजे शेकडो पणत्यांनी उजळलेल्या गल्लीत उघडतात.",
    },
    "karghaa-dwar": {
      name: "विणकराच्या घराचे दरवाजे",
      description: "लाल रेशीम आणि सोनेरी जरीत गुंडाळलेले दरवाजे विणकरांच्या अंगणात उघडतात.",
    },
    "navrang-dwar": {
      name: "नऊ रंगांचे दरवाजे",
      description: "रंगीत काचेच्या नऊ पट्ट्यांचे पांढरे दरवाजे गुलाबांच्या मंडपात उघडतात.",
    },
    "ghat-dwar": {
      name: "नदीघाटाचे दरवाजे",
      description: "लाटा आणि मासे कोरलेले निळसर-हिरवे दरवाजे पहाटेच्या हिमनदीच्या झऱ्यावर उघडतात.",
    },
    "rekha-dwar": {
      name: "एका रेषेतील दरवाजे",
      description:
        "एकाच सोनेरी रेषेत रेखाटलेले हस्तिदंती कागदी दरवाजे कमळांवरील सूर्योदयात उघडतात.",
    },
    "naqsha-pat": {
      name: "जडावाचे महाल दरवाजे",
      description:
        "सोनेरी रेषांच्या महालाने जडवलेले हस्तिदंती दरवाजे उघडतात आणि संध्याकाळचा तलावातील महाल दिसतो.",
    },
    "kinkhab-parda": {
      name: "किनखाबाचे पडदे",
      description:
        "सोनेरी विणीचे वाईन रंगाचे पडदे बाजूला सरकतात आणि दिव्यांनी उजळलेले महालाचे दालन दिसते.",
    },
    "taad-patta-dwar": {
      name: "ताडपत्रीच्या जाळ्या",
      description:
        "विणलेल्या ताडपत्रीच्या जाळ्या दूर सरकतात आणि सूर्यास्तात कमळांच्या खाडीवरचा व्हिला दिसतो.",
    },
    "pichwai-pat": {
      name: "पिछवाईचे पडदे",
      description:
        "कमळे आणि गाईंनी रंगवलेले पिछवाईचे पडदे बाजूला होतात आणि चांदण्यातले कमळांचे तळे दिसते.",
    },
    "chandi-kiwad": {
      name: "चांदीचे दरवाजे",
      description:
        "नक्षीदार चांदीचे दरवाजे उघडतात आणि तलावावरचा, प्रत्येक खिडकी उजळलेला महाल दिसतो.",
    },
    "swarg-kiwad": {
      name: "ढगांतील दरवाजे",
      description:
        "ढगांची नक्षी असलेले पांढऱ्या संगमरवराचे दरवाजे उघडतात आणि सोनेरी ढगांवर तरंगणारा मंडप दिसतो.",
    },
    "firoza-darwaza": {
      name: "फिरोजी दरवाजा",
      description:
        "फिरोजी ताऱ्यांनी जडवलेले अक्रोडाच्या लाकडाचे दरवाजे उघडतात आणि लांब जलकुंडाची बाग दिसते.",
    },
    "jharokha-pat": {
      name: "रंगीत काचेचे झरोखे",
      description:
        "रंगीत काच बसवलेली गुलाबी तावदाने उघडतात आणि सूर्यास्तातला झरोख्यांचा महाल दिसतो.",
    },
    "hina-kiwad": {
      name: "मेंदी रंगवलेले दरवाजे",
      description:
        "मेंदीने सजवलेले क्रीम रंगाचे दरवाजे उघडतात आणि झेंडूंनी भरलेले जर्दाळू रंगाचे अंगण दिसते.",
    },
    "mor-pankh": {
      name: "मोरपिसांच्या जाळ्या",
      description: "मोरपिसांच्या जाळ्या दूर सरकतात आणि संगमरवरी छत्रीचे कमळांचे सरोवर दिसते.",
    },
    "jugnu-parda": {
      name: "काजव्यांचा पडदा",
      description:
        "काजव्यांनी उजळलेला निळा पडदा बाजूला होतो आणि चांदण्यातले कुमुदिनीचे सरोवर दिसते.",
    },
    "sheesh-kiwad": {
      name: "आरशांच्या नक्षीचे दरवाजे",
      description: "आरशांच्या नक्षीचे दरवाजे उघडतात आणि झुंबरांखालचे दरबार दालन दिसते.",
    },
    "sunehri-phatak": {
      name: "सोनेरी फाटक",
      description:
        "सोन्याच्या वर्खाचे दरवाजे उघडतात आणि शांत सरोवरापलीकडचा सोनेरी घुमटाचा मंडप दिसतो.",
    },
    "pattu-thirai": {
      name: "रेशमी साडीचे पडदे",
      description:
        "कांजीवरम रेशमाचे पडदे बाजूला होतात आणि पितळी समयांनी उजळलेले देवळाचे तळे दिसते.",
    },
    "kagaz-kiwad": {
      name: "उठावाच्या कागदाचे दरवाजे",
      description: "सोनेरी मोहोर असलेले उठावाच्या कागदाचे दरवाजे उघडतात आणि हलकी गुलाबी छटा दिसते.",
    },
    "peetal-kiwad": {
      name: "पितळी दरवाजे",
      description:
        "ढोकरा काशात ओतलेले दरवाजे उघडतात आणि काशाच्या जीवनवृक्षाभोवती दिव्यांचे अंगण दिसते.",
    },
    "kaanch-pat": {
      name: "काचचित्राचे पडदे",
      description:
        "पोपट आणि मोर रंगवलेले काचेचे पडदे दूर सरकतात आणि रत्नासारख्या रंगांची महालबाग दिसते.",
    },
    "thinnai-kadhavu": {
      name: "नक्षीदार सागवानी दरवाजे",
      description:
        "पितळी खिळ्यांचे नक्षीदार बर्मी सागाचे दरवाजे उघडतात आणि वाड्याचे उन्हाळलेले अंगण दिसते.",
    },
    "meena-pat": {
      name: "मीनाचे सोनेरी पडदे",
      description:
        "पोपट आणि फुललेल्या झाडाच्या मीनाचे सोनेरी पडदे सरकतात आणि जयपूरची महालबाग दिसते.",
    },
    "rogan-parda": {
      name: "रोगनचे पडदे",
      description:
        "रोगनने रंगवलेले मरून पडदे बाजूला होतात आणि सोनेरी संध्याकाळचे कच्छी अंगण दिसते.",
    },
    "makhmal-parda": {
      name: "मखमली पडदे",
      description:
        "गुलाबांची भरतकाम असलेले काळे मखमली पडदे बाजूला होतात आणि मेणबत्त्यांनी उजळलेली फुलांची खोली दिसते.",
    },
    "sama-dwar": {
      name: "हलक्या रंगांचे दरवाजे",
      description:
        "हलक्या रंगांच्या चौकटींचे पुदिना रंगाचे दरवाजे उघडतात आणि लांब जलकुंडाचे समरूप अंगण दिसते.",
    },
    "dilli-phatak": {
      name: "हवेलीचे फाटक",
      description:
        "लोखंडी खिळ्यांचे जुने फिरोजी हवेलीचे दरवाजे उघडतात आणि दिव्यांच्या माळा व झेंडूंनी सजलेले अंगण दिसते.",
    },
    "nakkashi-pat": {
      name: "चांदी नक्षीचे पडदे",
      description:
        "मोर आणि पोपटांचा उठाव असलेले चांदीचे पडदे सरकतात आणि चांदण्यातील संगमरवरी बाग दिसते.",
    },
    "gagan-parda": {
      name: "फुग्याच्या रेशमी पडदे",
      description:
        "रंगवलेले फुग्याचे रेशीम बाजूला होते आणि तलावातील महालावर फुग्यांनी भरलेले सकाळचे आकाश दिसते.",
    },
    "bel-khidki": {
      name: "बोगनवेलीची तावदाने",
      description: "बोगनवेलीने वेढलेली निळी खिडकीची तावदाने उघडतात आणि सूर्यास्ताची कमान दिसते.",
    },
    "pankhudi-pat": {
      name: "कुमुदिनीच्या पाकळ्या",
      description: "कुमुदिनीच्या दोन मोठ्या पाकळ्या बाजूला उमलतात आणि कुमुदिनींचे तळे दिसते.",
    },
    "gulaab-lifafa": {
      name: "लाखेचा शिक्का असलेला लिफाफा",
      description:
        "गुलाबाच्या लाखेच्या शिक्क्याचा जलरंगी लिफाफा उघडतो आणि सोनेरी गुलाबांची कमान दिसते.",
    },
    "os-parda": {
      name: "दवाचा पडदा",
      description:
        "छोट्या फुलांनी भरतकाम केलेला पांढरा झिरझिरीत पडदा बाजूला होतो आणि पांढरी बाग दिसते.",
    },
    "surkh-dwar": {
      name: "गुलाबबागेचे दरवाजे",
      description: "लाल गुलाबांनी वेढलेले बागेचे जुने दरवाजे उघडतात आणि गुलाबांची वाट दिसते.",
    },
    "itr-dibbi": {
      name: "अत्तराची डबी",
      description: "अत्तराच्या डबीचे रेशमी अस्तराचे दरवाजे उघडतात आणि गुलाबी धुके बाहेर येते.",
    },
    "gulaab-bhaap": {
      name: "गुलाबाची वाफ",
      description: "गुलाबाच्या सुगंधी वाफेचे दोन ढग दूर होतात आणि कनौजच्या गुलाबाचे मळे दिसतात.",
    },
    "oud-darwaza": {
      name: "पितळी खिळ्यांचे दरवाजे",
      description: "पितळी खिळ्यांचे जड कोरीव दरवाजे उघडतात आणि धूपाचा धूर वळणे घेत बाहेर येतो.",
    },
    "tarkashi-jaali": {
      name: "चांदीच्या तारकशी जाळ्या",
      description:
        "चांदीच्या तारकशीच्या दोन जाळ्या सरकतात आणि गुलाबपाणी-पात्र असलेली संगमरवरी बाग दिसते.",
    },
    "aaina-pat": {
      name: "आरशाचे पंख",
      description: "घडीच्या आरशाचे कोरीव पंख उघडतात आणि लव्हेंडर प्रकाशातील शृंगार टेबल दिसते.",
    },
    "megh-parda": {
      name: "पावसाळी ढग",
      description: "पावसाळी ढगांचे दोन थर दूर सरकतात आणि डोंगरांखालचे कमळ सरोवर दिसते.",
    },
    "pehar-jaali": {
      name: "संगमरवरी जाळ्या",
      description: "कोरीव संगमरवरी जाळ्या सरकतात आणि कमळांच्या तळ्यावरचा मंडप दिसतो.",
    },
    "lata-phatak": {
      name: "बागेचे फाटक",
      description: "वेलींनी झाकलेले बागेचे फाटक पहाटेच्या बागेत उघडते.",
    },
    "kitaab-jild": {
      name: "गोष्टीच्या पुस्तकाचे कव्हर",
      description:
        "फीत बांधलेल्या गोष्टीच्या पुस्तकाचे कव्हर उघडते आणि कागदी पॉप-अप महाल उभा राहतो.",
    },
    "itr-almari": {
      name: "अत्तराचे कपाट",
      description: "अत्तराच्या कपाटाचे काचेचे दरवाजे उघडतात आणि गुलाबी धुके बाहेर येते.",
    },
    "kosh-jild": {
      name: "पक्ष्यांचा अल्बम",
      description: "लाखेच्या अल्बमची कव्हरे उघडतात आणि कमळांच्या तळ्याकाठचे सारस दिसतात.",
    },
    "gudiya-pat": {
      name: "बाहुलीघराचा दर्शनी भाग",
      description: "खेळण्यातल्या हवेलीचा रंगवलेला दर्शनी भाग उघडतो आणि उजळलेल्या खोल्या दिसतात.",
    },
    "yantra-pat": {
      name: "यंत्राची तबकडी",
      description: "पितळी ॲस्ट्रोलेबची तबकडी उघडते आणि सूर्यास्ताची वेधशाळा दिसते.",
    },
    "rang-parda": {
      name: "रंगवलेली वस्त्रे",
      description: "बांधणीची दोन लांब वस्त्रे बाजूला होतात आणि रंगाऱ्याचे अंगण दिसते.",
    },
    "genda-ladi": {
      name: "झेंडूचा पडदा",
      description: "झेंडूच्या माळांचा पडदा बाजूला होतो आणि फुलबाजार दिसतो.",
    },
    "kaleen-parda": {
      name: "गालिच्याचा पडदा",
      description: "विणलेला गालिचा बाजूला सरकतो आणि पहाटेचे निळ्या घुमटांचे शहर दिसते.",
    },
    "truck-darwaza": {
      name: "ट्रकचे दरवाजे",
      description: "मोर आणि कमळे रंगवलेले ट्रकचे दरवाजे उघडतात आणि सूर्यास्ताचा रस्ता दिसतो.",
    },
    "kaanch-dhakkan": {
      name: "मखमली आवरण",
      description: "मखमली कापड बाजूला होते आणि काचेखालचे छोटेसे जग दिसते.",
    },
    "pati-pat": {
      name: "वर्गाचे दरवाजे",
      description: "खडूची फुले काढलेले वर्गाचे लाकडी दरवाजे गावाकडे जाणाऱ्या वाटेवर उघडतात.",
    },
    "jad-jhalar": {
      name: "वेलींचा पडदा",
      description: "लोंबणारी मुळे आणि वेलींचा पडदा बाजूला होतो आणि नदीवरचे पूल दिसतात.",
    },
    "gol-darwaza": {
      name: "झोपडीचे दार",
      description: "गोल गुलाबी मातीचे दार उघडते आणि झोपडीची बाग दिसते.",
    },
    "jhaadi-deewar": {
      name: "कुंपणाचे गेट",
      description: "छाटलेल्या झुडपांच्या दोन भिंती दूर सरकतात आणि गुलाबांच्या कमानीची वाट दिसते.",
    },
    "deco-dibba": {
      name: "लिफ्टचे दरवाजे",
      description: "आर्ट डेको लिफ्टचे दरवाजे सरकतात आणि पुलावरून जाणारी आगगाडी दिसते.",
    },
    "samundar-parda": {
      name: "समुद्रवेलींचा पडदा",
      description: "पाण्याखाली समुद्रवेली दुभंगतात आणि प्रवाळाची कमान आणि पांढरी वाळू दिसते.",
    },
    "shatranj-sandook": {
      name: "बुद्धिबळ पटाचे दरवाजे",
      description: "जडावकामाचे बुद्धिबळ पटाचे दरवाजे उघडतात आणि डाव मांडलेली महालाची गच्ची दिसते.",
    },
    pankhi: {
      name: "रंगवलेला पंखा",
      description:
        "कमळे आणि पोपटांचा रेशमी हातपंखा मिटतो आणि कंदिलांनी उजळलेली महालाची गच्ची दिसते.",
    },
    "sheesh-mahal": {
      name: "शीशमहल",
      description: "छोट्या आरशांची भिंत झडपांसारखी फिरते आणि मेणबत्त्यांनी उजळलेला शीशमहल दिसतो.",
    },
    "popup-mahal": {
      name: "पॉप-अप महाल",
      description: "कापलेल्या कागदाचा जलमहाल पॉप-अप पुस्तकासारखा उभा राहतो, मग आपण आत जाता.",
    },
    odhni: {
      name: "नवरीची ओढणी",
      description: "लाल बांधणीची ओढणी वाऱ्यावर लहरते, मग उचलली जाऊन चांदण्यातील अंगण दिसते.",
    },
    "kavad-peti": {
      name: "कथा-पेटी",
      description: "रंगवलेली मेवाडी कावड दोनदा उलगडते आणि सोनेरी संध्याकाळचा बागेतील मंडप दिसतो.",
    },
    "chhatri-utsav": {
      name: "शाही छत्र",
      description: "भरतकाम केलेले छत्र डोक्यावर फिरते, मग गिरक्या घेत आकाशात जाते.",
    },
    "jal-darpan": {
      name: "स्थिर सरोवर",
      description: "तरंगत्या दिव्यापासून तरंग पसरतात आणि सरोवर दिव्यांनी उजळलेल्या घाटावर उघडते.",
    },
    "pushp-varsha": {
      name: "पाकळ्यांचा वर्षाव",
      description: "गुलाबपाकळ्यांची भिंत भोवऱ्यासारखी विखुरते आणि वरमालेचा मंच दिसतो.",
    },
    "moti-seep": {
      name: "मोत्याचा शिंपला",
      description: "मोठा शिंपला उजळणाऱ्या मोत्यावरचे झाकण उघडतो आणि किनाऱ्यावरचा मंडप दिसतो.",
    },
    "badal-raag": {
      name: "पावसाळी ढग",
      description: "पावसाचे ढग दूर होतात, ऊन डोकावते आणि महालावर इंद्रधनुष्य उमटते.",
    },
    "jugnu-van": {
      name: "काजव्यांचे जंगल",
      description:
        "काजवे आपल्या नावांभोवती जमतात, मग विखुरतात आणि जंगल दुभंगून उजळलेला वटवृक्ष दिसतो.",
    },
    "uday-surya": {
      name: "सूर्योदय",
      description: "डोंगरांवर सूर्य उगवतो आणि डोंगर खाली सरकून आपले नवे घर दिसते.",
    },
    taaramandal: {
      name: "नक्षत्र",
      description:
        "आपल्या नावांभोवती तारे सोनेरी रेषांनी जुळतात, मग त्यांच्यातून उडत वेधशाळेत पोहोचता.",
    },
    "thar-ki-ret": {
      name: "वाळवंटातील वाळू",
      description: "वारा वाळूचे ढिगारे उडवून नेतो आणि कंदिलांखालचा किल्ल्याजवळचा तळ दिसतो.",
    },
    "sheher-ki-raat": {
      name: "शहराचे दिवे",
      description: "शहराच्या खिडक्या एकेक करून उजळतात, मग सारे शहर झगमगते.",
    },
    "choodi-chakra": {
      name: "बांगड्यांची वर्तुळे",
      description: "काचेच्या बांगड्यांची वर्तुळे आपल्या नावांभोवती फिरतात, मग तरंगांसारखी पसरतात.",
    },
    "sanjhi-roshni": {
      name: "सांझी कंदील",
      description: "कापलेल्या कागदाच्या स्टेन्सिलमधून दिवा उजळतो, मग तो कागद पानासारखा उलटतो.",
    },
    "chhaya-parda": {
      name: "छायेचा पडदा",
      description:
        "दिव्याने उजळलेल्या पडद्यावर बाहुल्यांच्या सावल्या डोलतात, मग पडदा वर गुंडाळून मंच दिसतो.",
    },
    "athangudi-tiles": {
      name: "चेट्टिनाड टाइल्स",
      description: "चकचकीत आतंगुडी टाइल्स लाटेसारख्या उलटतात आणि चेट्टिनाडचे अंगण दिसते.",
    },
    "gulaal-bindu": {
      name: "रंगांचे थेंब",
      description: "गुलालाचे थेंब कागदावर फुलत जातात आणि होळीचे रंगीबेरंगी अंगण दिसते.",
    },
    bioscope: {
      name: "बायोस्कोप",
      description: "जुन्या बायोस्कोपच्या भिंगात कॅलिडोस्कोप फिरतो, मग भिंग आपल्याभोवती उघडते.",
    },
    "kaanch-ka-gola": {
      name: "स्नो ग्लोब",
      description: "गोळ्यात बर्फ पडतो; तो हलतो आणि आपण हिवाळी गावात उतरता.",
    },
    phirki: {
      name: "कागदी भिरभिरे",
      description: "घडी केलेला कागदी चौकोन एकेक घडी उघडत गावच्या जत्रेत उघडतो.",
    },
    bulbule: {
      name: "साबणाचे फुगे",
      description: "मोठा फुगा आपल्या नावांभोवती थरथरतो, मग फुटून बागेतील पार्टी दिसते.",
    },
    "chhuk-chhuk": {
      name: "झुकझुक गाडी",
      description: "छोटी वाफेची गाडी झुकझुक करत जाते आणि वाफ विरून पार्टीचे स्टेशन दिसते.",
    },
    chadar: {
      name: "पाण्याची चादर",
      description:
        "दिव्यांच्या कोनाड्यांच्या संगमरवरी भिंतीवर पाण्याची चादर पडते, मग थांबून वरून विरते.",
    },
    parwaaz: {
      name: "भरतकामाचे पक्षी",
      description: "रेशमावर भरलेले पक्षी उडून जातात, आणि रेशीम त्यांच्या मागे वर तरंगते.",
    },
    bhanwar: {
      name: "अबरी भोवरा",
      description: "दख्खनी अबरी कागद भोवऱ्यासारखा फिरतो आणि मध्यात विरून जातो.",
    },
    "jaali-patta": {
      name: "जाळीदार पान",
      description: "जाळीसारख्या मोठ्या पानाच्या शिरांतून प्रकाश धावतो, मग ते वळून खाली झुलत येते.",
    },
    "lapet-khule": {
      name: "क्विलिंगचे फूल",
      description: "कागदी गुंडाळ्यांचे फूल फिरते, कडी सुटतात आणि वळणे उड्या मारत दूर जातात.",
    },
    taar: {
      name: "वीणेच्या तारा",
      description:
        "वीणेसारख्या तारा ताणलेले चंदनाचे कोरीव फलक: तारा छेडल्यासारख्या झळाळतात, मग फलक पट्टी-पट्टीने उघडतो.",
    },
    pratibimb: {
      name: "तळ्यातील प्रतिबिंब",
      description:
        "निमंत्रण कमळांच्या तळ्यातील प्रतिबिंबाने उघडते; एक तरंग पसरतो आणि दृश्य पाण्यातून वर येते.",
    },
    mohur: {
      name: "चांदीचे नाणे",
      description:
        "भरतकाम केलेले मोठे चांदीचे नाणे कडेवर फिरते, उलटते आणि तुम्ही त्यातून पलीकडे जाता.",
    },
    gathbandhan: {
      name: "गठबंधन",
      description: "लहरियाच्या दोन ओढण्या लहरत येतात, मध्ये गाठ बांधतात आणि एकत्र वर उडून जातात.",
    },
    phuljhadi: {
      name: "फुलबाजीचे कडे",
      description:
        "फुलबाजी नावांभोवती सोनेरी प्रकाशाचे कडे रेखाटते, आणि काळी लाख बुबुळासारखी उघडते.",
    },
    semal: {
      name: "सावरीचा कापूस",
      description:
        "सावरीच्या शेंगा फुटतात आणि पांढरा कापूस बाहेर पडून वाऱ्यावर गिरक्या घेत उडून जातो.",
    },
    thappa: {
      name: "ठसा छपाई",
      description:
        "लाकडी कोरीव ठसा सुती चादरीवर छाप उमटवतो; प्रत्येक छाप एक खिडकी उघडते, मग चादर उचलली जाते.",
    },
    gumbad: {
      name: "रंगवलेला घुमट",
      description:
        "तुम्ही रंगवलेल्या घुमटात वर पाहता; त्याचे आकाशी छिद्र बुबुळासारखे उघडते आणि पाकळ्या बरसतात.",
    },
    ghadi: {
      name: "खिशातील घड्याळ",
      description:
        "जुने खिशातील घड्याळ: काटे फिरून तासावर येतात, मंद किणकिण होते आणि तुम्ही त्याच्या डायलमध्ये जाता.",
    },
    hindolo: {
      name: "रंगवलेला झोपाळा",
      description: "संखेड्याचा रंगवलेला झोपाळा झुलतो, मग तुमच्याकडे उंच झेपावून नजरेआड जातो.",
    },
    doors: {
      name: "थीमचे दरवाजे",
      description: "आपल्या थीमचेच चित्र दोन दरवाजांसारखे मधोमध दुभंगते.",
    },
    palace: {
      name: "महालाचे द्वार",
      description: "फुलांच्या माळांनी सजलेल्या कमानीखालील कोरीव दरवाजे उबदार प्रकाशात उघडतात.",
    },
    temple: {
      name: "मंदिराचे दरवाजे",
      description: "सोनेरी गोपुराखाली वाजणाऱ्या घंटा आणि दिव्यांचे पितळी दरवाजे.",
    },
    curtain: {
      name: "रेशमी पडदे",
      description: "लुकलुकत्या दिव्यांचे मखमली पडदे रंगमंचासारखे बाजूला होतात.",
    },
    envelope: {
      name: "शाही लिफाफा",
      description: "फुलाची मुद्रा उमटवलेला लाखेचा शिक्का तुटतो आणि कार्ड वर येते.",
    },
    lotus: {
      name: "फुलणारे कमळ",
      description: "आपल्या नावांभोवतीचे मोठे कमळ पाकळी-पाकळीने उमलते.",
    },
    mandap: {
      name: "लग्नमंडप",
      description: "केळीच्या पानांचे खांब आणि मोगऱ्याच्या माळांमधून झिरझिरीत पडदे वर जातात.",
    },
    jharokha: {
      name: "झरोका",
      description: "वालुकाश्माच्या खिडकीची चार कोरीव जाळीदार तावदाने मागे दुमडतात.",
    },
    phool: {
      name: "फुलांचा पडदा",
      description: "झेंडू, गुलाब आणि मोगऱ्याच्या माळा मधोमध दुभंगतात.",
    },
    scroll: {
      name: "शाही गुंडाळी",
      description: "फीत सुटते आणि फर्मानाची गुंडाळी आपोआप गुंडाळली जाते.",
    },
    diyas: {
      name: "पणत्यांच्या रांगा",
      description: "दिवे एकेक करून लागतात, मग उबदार प्रकाशात झळाळतात.",
    },
    rangoli: {
      name: "रांगोळी",
      description: "रांगोळी आपोआप रंगांत रेखाटली जाते, मग गिरकी घेत प्रकाशात विरते.",
    },
    peacock: {
      name: "मोराचा पिसारा",
      description: "आपल्या नावांमागे मोराचा पिसारा फुलतो, मग मिटतो.",
    },
    storybook: {
      name: "गोष्टीचे पुस्तक",
      description: "सोनेरी नक्षीचे कापडी कव्हर उघडून पहिले पान दिसते.",
    },
    lanterns: {
      name: "आकाशकंदील",
      description: "उजळणारे कागदी कंदील रात्री तरंगतात, मग उंच निघून जातात.",
    },
    moonlit: {
      name: "चांदणी रात्र",
      description: "कमानींवर चंद्रकोर, तारे आणि डोलणारे कंदील.",
    },
    fireworks: {
      name: "आतषबाजी",
      description: "घुमटांच्या क्षितिजावर फटाके फुटतात.",
    },
    balloons: {
      name: "फुगे",
      description: "फुग्यांनी भरलेले आकाश वर उडून जाते.",
    },
    gift: {
      name: "भेटवस्तूचा डबा",
      description: "फीत सुटते आणि झाकण उघडते.",
    },
    none: {
      name: "थेट आत",
      description: "उघडण्याचा प्रकार नाही: पाहुणे थेट दृश्यावर पोहोचतात.",
    },
  },
  groups: {
    own: "तुमच्या डिझाइनसाठी बनवलेले",
    fresh: "नव्या शैली",
    skies: "आकाश आणि निसर्ग",
    crafts: "कला आणि रंग",
    play: "मजेशीर",
    themed: "थीमची स्वतःची सुरुवात",
    painted: "चित्रित द्वारे",
    doors: "दरवाजे आणि द्वारे",
    reveals: "पडदे आणि उलगडणे",
    light: "प्रकाश आणि फुले",
    party: "पार्टी",
  },
  welcomeHeading: "त्यानंतरचे स्वागत",
  welcomeIntro:
    "पानांआधी तुमच्या नावांसोबत एक क्षण. आपोआप निवडल्यास पाहुणे दरवेळी उघडतील तेव्हा निमंत्रणाला साजेसे नवे दृश्य दिसते.",
  welcomeAuto: "आपोआप",
  welcomeNames: {
    royal: "राजवाड्याचे तोरण",
    bloom: "कमळ",
    lamps: "पणत्या",
    night: "चंद्र आणि कंदील",
    party: "रंगीत उधळण",
    letter: "पत्र",
    mandala: "मंडल",
    peacock: "मोर",
    sunrise: "सूर्योदय",
    garden: "बाग",
    rangoli: "रांगोळी",
    ghat: "संध्याकाळचा घाट",
    fireflies: "काजवे",
    "sky-lanterns": "आकाशकंदील",
    kites: "पतंग",
    waves: "समुद्रावरचा सूर्यास्त",
  },
  godHeading: "वर देव किंवा शुभचिन्ह",
  godIntro:
    "वर मध्यभागी पूर्ण दिसते, कोणत्याही शब्दाखाली नाही. देवाशिवाय उघडायचे असेल तर हे बंद ठेवा.",
  noGod: "काहीही नाही",
  gods: {
    ganesha: "गणपती बाप्पा",
    "ganesha-gold": "सोनेरी गणपती",
    "lakshmi-ganesha": "लक्ष्मी-गणपती",
    shrinathji: "श्रीनाथजी",
    venkateswara: "व्यंकटेश्वर",
    jagannath: "जगन्नाथ",
    om: "ॐ",
    swastik: "स्वस्तिक",
    kalash: "मंगल कलश",
    diya: "पणती",
    prajapati: "प्रजापती",
    suzhi: "पिल्लैयार सुळी",
    shri: "श्री",
    shankh: "शंख",
    kamal: "कमळ",
    "ik-onkar": "इक ओंकार",
    khanda: "खंडा",
    "chand-tara": "चंद्रकोर आणि तारा",
    "786": "786",
    bismillah: "बिस्मिल्ला",
    cross: "क्रॉस",
    dove: "कबूतर",
    jain: "जैन प्रतीक",
  },
};
