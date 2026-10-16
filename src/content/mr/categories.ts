import type * as en from "../categories";
import type { Translation } from "@/i18n/text";

/* मराठी: प्रसंगांचे गट, प्रत्येकाची एक ओळ आणि RSVP प्रश्न. English: src/content/categories.ts. Draft for a native proofreader. */

export const categoryGroups: Translation<typeof en.categoryGroups> = {
  "wedding-journey": "लग्नाचा प्रवास",
  birthdays: "वाढदिवस",
  baby: "बाळ",
  "home-religious": "घर आणि धार्मिक",
  festivals: "सण",
  parties: "पार्टी आणि मेजवानी",
  business: "व्यवसाय",
  education: "शिक्षण आणि संस्था",
  global: "जगभरातून",
};

export const categoryTaglines: Translation<typeof en.categoryTaglines> = {
  wedding: "हळदीपासून रिसेप्शनपर्यंत प्रत्येक सोहळा, एकाच लिंकमध्ये",
  engagement: "अंगठ्या, दोन कुटुंबे आणि पहिला मोठा सोहळा",
  "save-the-date": "आधी तारीख कळवा, पूर्ण निमंत्रण नंतर",
  roka: "कुटुंबांचा होकार, जोडप्याला आशीर्वाद",
  haldi: "हळद, झेंडूची फुले आणि हसरी सकाळ",
  mehendi: "मेंदी, ढोलकी आणि निवांत दुपार",
  sangeet: "गाणी, नृत्य आणि कुटुंबाचे सादरीकरण",
  reception: "लग्नानंतर स्नेहभोजन आणि जल्लोष",
  birthday: "केक, फुगे आणि सगळी आपली माणसे",
  anniversary: "सहवासाची वर्षे, कुटुंबासोबत साजरी",
  party: "चांदण्या रात्री संगीत, जेवण आणि मित्र",
  "baby-shower": "होणाऱ्या आईसाठी आशीर्वाद, गाणी आणि गोडधोड",
  diwali: "पणत्या, फराळ आणि सर्वांसोबत लक्ष्मीपूजन",
  housewarming: "नव्या घरात पूजा आणि पहिले जेवण",
  puja: "कथा, होम किंवा जागरण, आरती आणि प्रसादासह",
  "thread-ceremony": "कुटुंबाच्या आशीर्वादाने मुंज आणि उपनयन",
  annaprashan: "बाळाचा पहिला घास, आशीर्वादासह",
  christening: "चिमुकल्यासाठी आशीर्वाद आणि भोजन",
  "prayer-meet": "प्रार्थनेसह एका आयुष्याचे स्मरण",
  retirement: "उत्तम कारकिर्दीला शुभेच्छा",
  "farewell-party": "सोबतची एक शेवटची संध्याकाळ",
  "shop-opening": "फीत, पूजा आणि पहिले स्वागत",
  launch: "एखादे उत्पादन, पुस्तक किंवा ऑफिस",
  "ganesh-chaturthi": "बाप्पाचे दर्शन, आरती आणि मोदक",
  navratri: "गरब्याच्या रात्री आणि दुर्गापूजा",
  janmashtami: "कान्हासाठी भजन आणि मध्यरात्रीची आरती",
  onam: "पूक्कलम आणि केळीच्या पानावर सद्या",
  sankranti: "पतंग, तिळगूळ आणि पोंगल",
  lohri: "शेकोटी, रेवडी आणि भांगडा",
  eid: "इफ्तारची दावत आणि ईद मिलन",
  "naming-ceremony": "बाळाचे नाव, कुटुंबाचा आशीर्वाद",
  holi: "रंग, संगीत आणि करंजी",
  christmas: "कॅरल, केक आणि ख्रिसमस ट्री",
  reunion: "जुने मित्र, एक संध्याकाळ",
  graduation: "पदवीधरासाठी एक जल्लोष",
  "gudi-padwa": "गुढी, कडुलिंब आणि पुरणपोळी",
  baisakhi: "सुगी, भांगडा आणि गिद्धा",
  bihu: "बिहू गीते, नृत्य आणि पिठा",
  "raksha-bandhan": "राखी, गोडधोड आणि कुटुंबासोबत जेवण",
  "karva-chauth": "उपवास, चंद्रोदय आणि एकत्र जेवण",
};

export const questionLabels: Translation<typeof en.questionLabels> = {
  meal: "जेवणाची आवड",
  arrival: "पोहोचण्याची तारीख",
  stay: "खोली हवी",
  pickup: "स्टेशन किंवा विमानतळावरून आणायला",
  song: "गाण्याची फर्माईश",
  message: "जोडप्यासाठी संदेश",
};

export const occasionsSection: Translation<typeof en.occasionsSection> = {
  eyebrow: "प्रसंग",
  title: "आपण काय साजरे करत आहात?",
  intro:
    "प्रसंगापासून सुरुवात करा, निमंत्रण आपोआप तयार होईल: योग्य सोहळे, शब्द आणि डिझाइन. वाढदिवस, बाळ आणि सणांची निमंत्रणे लवकरच येत आहेत.",
  listLabel: "प्रसंग",
  nearYou: "आपल्या भागात लोकप्रिय",
};
