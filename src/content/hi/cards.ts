import type * as en from "../cards";
import type { Translation } from "@/i18n/text";

/* हिन्दी: सेव द डेट और धन्यवाद कार्ड। English: src/content/cards.ts. */

export const cardsCopy: Translation<typeof en.cardsCopy> = {
  metaTitle: "सेव द डेट और धन्यवाद कार्ड",
  back: "निमंत्रण पर वापस",
  heading: "सेव द डेट और धन्यवाद कार्ड",
  intro:
    "आपके निमंत्रण के डिज़ाइन में दो तस्वीरें, WhatsApp पर भेजने के लिए: निमंत्रण से पहले सेव द डेट, और उत्सव के बाद धन्यवाद।",
  open: "सेव द डेट और धन्यवाद कार्ड",
  openShort: "कार्ड",
  openBody: "आपके निमंत्रण के डिज़ाइन में तस्वीरें, उत्सव से पहले और बाद में भेजने के लिए।",
  kinds: { "save-the-date": "सेव द डेट", "thank-you": "धन्यवाद" },
  kindBody: {
    "save-the-date": "इसे जल्दी भेजें, ताकि परिवार और दोस्त वह दिन खाली रखें।",
    "thank-you": "उत्सव के बाद, आए हुए और आशीर्वाद भेजने वाले सभी को भेजें।",
  },
  noteLabel: { "save-the-date": "नीचे की पंक्ति", "thank-you": "आपका संदेश" },
  noteHint: "कार्ड की भाषा में। खाली छोड़ें तो यह पंक्ति नहीं छपेगी।",
  noteCount: (used, max) => `${max} में से ${used} अक्षर`,
  reset: "सुझाए गए शब्द लगाएँ",
  picture: (kind, names) => `${names} का ${kind} कार्ड`,
  preparing: "आपका कार्ड बन रहा है…",
  failed: "कार्ड नहीं बन सका। फिर कोशिश करें, या Chrome या Safari आज़माएँ।",
  retry: "फिर कोशिश करें",
  download: "तस्वीर डाउनलोड करें",
  share: "WhatsApp पर भेजें",
  fileName: (kind) => `${kind}.png`,
  preview: "झलक",
  previewNote:
    "इस झलक पर “Made with Shubh” लिखा है। Grand पैकेज के साथ सेव द डेट और धन्यवाद कार्ड बिना निशान के मिलते हैं।",
  upgrade: "Grand लें",
};
