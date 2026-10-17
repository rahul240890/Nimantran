import type * as en from "../cards";
import type { Translation } from "@/i18n/text";

/* मराठी: सेव्ह द डेट आणि धन्यवाद कार्ड. English: src/content/cards.ts. Draft for a native proofreader. */

export const cardsCopy: Translation<typeof en.cardsCopy> = {
  metaTitle: "सेव्ह द डेट आणि धन्यवाद कार्ड",
  back: "निमंत्रणाकडे परत",
  heading: "सेव्ह द डेट आणि धन्यवाद कार्ड",
  intro:
    "तुमच्या निमंत्रणाच्या डिझाइनमधली दोन चित्रे, WhatsApp वर पाठवण्यासाठी: निमंत्रणाआधी सेव्ह द डेट, आणि समारंभानंतर धन्यवाद.",
  open: "सेव्ह द डेट आणि धन्यवाद कार्ड",
  openShort: "कार्ड",
  openBody: "तुमच्या निमंत्रणाच्या डिझाइनमधली चित्रे, समारंभाआधी आणि नंतर पाठवण्यासाठी.",
  kinds: { "save-the-date": "सेव्ह द डेट", "thank-you": "धन्यवाद" },
  kindBody: {
    "save-the-date": "लवकर पाठवा, म्हणजे कुटुंब आणि मित्र तो दिवस मोकळा ठेवतील.",
    "thank-you": "समारंभानंतर, आलेल्या आणि आशीर्वाद पाठवणाऱ्या सर्वांना पाठवा.",
  },
  noteLabel: { "save-the-date": "तळाची ओळ", "thank-you": "तुमचा संदेश" },
  noteHint: "कार्डच्या भाषेत. रिकामी ठेवल्यास ही ओळ छापली जाणार नाही.",
  noteCount: (used, max) => `${max} पैकी ${used} अक्षरे`,
  reset: "सुचवलेले शब्द वापरा",
  picture: (kind, names) => `${names} यांचे ${kind} कार्ड`,
  preparing: "तुमचे कार्ड तयार होत आहे…",
  failed: "कार्ड तयार झाले नाही. पुन्हा प्रयत्न करा, किंवा Chrome किंवा Safari वापरून पाहा.",
  retry: "पुन्हा प्रयत्न करा",
  download: "चित्र डाउनलोड करा",
  share: "WhatsApp वर पाठवा",
  fileName: (kind) => `${kind}.png`,
  preview: "झलक",
  previewNote:
    "या झलकेवर “Made with Shubh” लिहिलेले आहे. Grand पॅकेजसोबत सेव्ह द डेट आणि धन्यवाद कार्ड खुणेशिवाय मिळतात.",
  upgrade: "Grand घ्या",
};
