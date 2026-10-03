import type * as en from "../editions";
import { PLAN_IDS } from "@/lib/plans/catalog";
import type { Translation } from "@/i18n/text";

/* Hindi copy for editions. */

export const planCopy: Translation<typeof en.planCopy> = {
  free: {
    name: "फ़्री",
    bestFor: "आज़माने और छोटे आयोजनों के लिए",
    highlights: ["1 कार्यक्रम", "3 फ़ोटो", "कार्ड की 1 भाषा", "निमंत्रण पर “Made with Shubh”"],
  },
  premium: {
    name: "प्रीमियम",
    bestFor: "जन्मदिन, पूजा, सगाई",
    highlights: [
      "3 कार्यक्रम तक",
      "20 फ़ोटो",
      "कार्ड की 2 भाषाएँ",
      "जोड़े की 1 फ़ोटो",
      "WhatsApp स्टेटस और रील्स के लिए वीडियो",
      "कोई वॉटरमार्क नहीं",
    ],
  },
  royal: {
    name: "रॉयल",
    bestFor: "बड़ी शादियाँ और रिसेप्शन",
    highlights: [
      "हर कार्यक्रम",
      "हर फ़ोटो",
      "कार्ड की 2 भाषाएँ",
      "दूल्हा-दुल्हन की अलग फ़ोटो",
      "WhatsApp स्टेटस और रील्स के लिए वीडियो",
      "कोई वॉटरमार्क नहीं",
    ],
  },
  bundle: {
    name: "वेडिंग बंडल",
    bestFor: "कई दिनों की भारतीय शादियाँ",
    highlights: [
      "रॉयल की हर सुविधा",
      "सेव-द-डेट और धन्यवाद कार्ड",
      "मेहमानों का फ़ोटो एल्बम हमेशा के लिए",
      "कोई वॉटरमार्क नहीं",
    ],
  },
};

export const upgradeCopy: Translation<typeof en.upgradeCopy> = {
  metaTitle: "अपना संस्करण चुनें",
  eyebrow: "संस्करण",
  title: "अपना संस्करण चुनें",
  intro: (names) =>
    `${names || "इस निमंत्रण"} के लिए एक ही भुगतान, हर कार्यक्रम और मेहमान के साथ। दामों में GST शामिल है।`,
  current: "आपका संस्करण",
  currentBadge: "अभी",
  needed: "आपके निमंत्रण के लिए सही",
  included: "शामिल",
  pay: (price) => `${price} भुगतान करें`,
  payDifference: (price) => `${price} में अपग्रेड करें`,
  difference: "आप केवल अंतर का भुगतान करते हैं।",
  opening: "भुगतान खुल रहा है…",
  checking: "आपका भुगतान जाँचा जा रहा है…",
  paid: (plan) => `${plan} चालू हो गया। धन्यवाद!`,
  paidBody: "वॉटरमार्क हट गया है और आपके संस्करण की हर सुविधा खुल गई है।",
  cancelled: "भुगतान पूरा नहीं हुआ। कोई पैसा नहीं कटा।",
  failed:
    "भुगतान की पुष्टि नहीं हो सकी। अगर पैसा कटा है, तो 5 से 7 दिनों में वापस आ जाएगा, या हमें लिखें।",
  off: "भुगतान जल्द शुरू होंगे। तब तक सब कुछ मुफ़्त है।",
  ownerOnly: {
    title: "इसे केवल निमंत्रण बनाने वाले ही अपग्रेड कर सकते हैं",
    body: "सह-मेज़बान निमंत्रण चलाने में मदद करते हैं, पर भुगतान, रसीद और GST इनवॉइस बनाने वाले के नाम होते हैं। उनसे अपने खाते से अपग्रेड करने को कहें।",
  },
  loadFailed: "भुगतान की विंडो नहीं खुल सकी। अपना इंटरनेट जाँचें और फिर कोशिश करें।",
  receipts: "रसीदें",
  receipt: (plan, price) => `${plan}, ${price}`,
  paymentId: "भुगतान",
  back: "निमंत्रण पर वापस",
  secure: "Razorpay से सुरक्षित भुगतान: UPI, कार्ड और नेटबैंकिंग।",
  previewCheckout: {
    title: "टेस्ट भुगतान",
    body: (price) =>
      `प्रीव्यू मोड: कोई पैसा नहीं कटता। ${price} का भुगतान करके देखें कि संस्करण कैसे खुलता है।`,
    pay: "भुगतान करें (टेस्ट)",
    cancel: "रद्द करें",
  },
  was: "पहले",
  offer: (label, off) => `${label}: ${off} की छूट`,
  couponLabel: "कूपन कोड",
  couponApply: "लगाएँ",
  couponApplied: (code) => `कूपन ${code} लग गया`,
  couponRemove: "हटाएँ",
  couponProblem: {
    unknown: "यह कोड मौजूद नहीं है। स्पेलिंग जाँचें।",
    inactive: "यह कोड बंद कर दिया गया है।",
    "not-started": "यह कोड अभी शुरू नहीं हुआ है।",
    ended: "यह कोड ख़त्म हो गया है।",
    "used-up": "यह कोड पूरा इस्तेमाल हो चुका है।",
    "wrong-plan": "यह कोड आपके चुनने लायक संस्करणों पर लागू नहीं होता।",
  },
  invoice: "इनवॉइस",
  refunded: "पैसा वापस",
  refunds: "अगर निमंत्रण किसी मेहमान को नहीं भेजा गया है, तो 7 दिनों के अंदर पूरा पैसा वापस।",
};

export const limitCopy: Translation<typeof en.limitCopy> = {
  title: "इस निमंत्रण को बड़े संस्करण की ज़रूरत है",
  body: (plan) =>
    `इसे ऐसे ही प्रकाशित करने के लिए ${plan} चुनें, या इसे फ़्री के हिसाब से छोटा करें।`,
  used: {
    functions: (count) => `${count} कार्यक्रम`,
    photos: (count) => `${count} फ़ोटो`,
    languages: (count) => `कार्ड की ${count} भाषाएँ`,
    couplePhotos: (count) => `जोड़े की ${count} फ़ोटो`,
    guests: (count) => `${count} मेहमान`,
    design: (rank) => `${planCopy[PLAN_IDS[rank] ?? "premium"].name} डिज़ाइन`,
  },
  choose: "संस्करण चुनें",
  edition: (plan) => `संस्करण: ${plan}`,
  unlockBody: (plan, price) =>
    `${plan} में इस निमंत्रण की हर चीज़ शामिल है, ${price} में। या इसे अपने संस्करण के हिसाब से छोटा करें।`,
  unlock: (plan) => `${plan} लें`,
  upgrade: "अपग्रेड करें",
};
