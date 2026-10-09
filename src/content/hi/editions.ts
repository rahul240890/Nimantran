import type * as en from "../editions";
import type { Translation } from "@/i18n/text";

/* Hindi copy for packages. */

export const planCopy: Translation<typeof en.planCopy> = {
  free: {
    name: "फ़्री",
    bestFor: "फ़्री डिज़ाइन, छोटे आयोजन",
    highlights: [
      "हर कार्यक्रम, जवाब और मेहमानों की सूची के साथ",
      "आपका अपना लिंक और QR कोड",
      "कार्ड की 1 भाषा",
      "कोने में छोटा-सा “Made with Shubh”",
    ],
  },
  basic: {
    name: "बेसिक",
    bestFor: "आपका डिज़ाइन, भेजने के लिए तैयार",
    highlights: [
      "कोई वॉटरमार्क नहीं",
      "हर कार्यक्रम, जवाब और मेहमानों की सूची के साथ",
      "आपका अपना लिंक और QR कोड",
      "कार्यक्रम तक कभी भी बदलाव करें",
      "कार्ड की 1 भाषा",
    ],
  },
  celebration: {
    name: "सेलिब्रेशन",
    bestFor: "ज़्यादातर शादियाँ और बड़े जन्मदिन",
    highlights: [
      "बेसिक की हर सुविधा",
      "WhatsApp स्टेटस और इंस्टाग्राम रील्स के लिए वीडियो",
      "कार्ड की 2 भाषाएँ",
      "आपका अपना गाना",
      "मेहमानों की फ़ोटो वॉल 30 दिन",
      "3 सह-मेज़बान",
    ],
  },
  grand: {
    name: "ग्रैंड",
    bestFor: "कई दिनों की बड़ी शादियाँ",
    highlights: [
      "सेलिब्रेशन की हर सुविधा",
      "हर कार्यक्रम का अपना वीडियो",
      "मेहमानों की फ़ोटो वॉल 1 साल",
      "जितने चाहें उतने सह-मेज़बान",
      "हमारी टीम से पहले मदद",
    ],
  },
};

export const invitesLine: typeof en.invitesLine = (count) =>
  count === null ? "असीमित इनवाइट" : `लिंक से ${count.toLocaleString("en-IN")} इनवाइट`;

export const upgradeCopy: Translation<typeof en.upgradeCopy> = {
  metaTitle: "अपना पैकेज चुनें",
  eyebrow: "पैकेज",
  title: "अपना पैकेज चुनें",
  intro: (names) =>
    `${names || "इस निमंत्रण"} के लिए एक ही भुगतान, उसके डिज़ाइन के हिसाब से। दामों में GST शामिल है।`,
  current: "आपका पैकेज",
  currentBadge: "अभी",
  needed: "आपके निमंत्रण के लिए सही",
  popular: "सबसे ज़्यादा चुना गया",
  included: "शामिल",
  free: "फ़्री",
  designPrice: (price) => `डिज़ाइन ${price}`,
  addOn: (price) => `डिज़ाइन पर + ${price}`,
  pay: (price) => `${price} भुगतान करें`,
  payDifference: (price) => `${price} में अपग्रेड करें`,
  difference: "आप केवल अंतर का भुगतान करते हैं।",
  continueFree: "फ़्री में आगे बढ़ें",
  publishNow: "निमंत्रण प्रकाशित करें",
  publishBody: "आपका पैकेज तैयार है। लिंक पाने के लिए निमंत्रण प्रकाशित करें।",
  opening: "भुगतान खुल रहा है…",
  checking: "आपका भुगतान जाँचा जा रहा है…",
  paid: (plan) => `${plan} चालू हो गया। धन्यवाद!`,
  paidBody: "आपके पैकेज की हर सुविधा खुल गई है।",
  cancelled: "भुगतान पूरा नहीं हुआ। कोई पैसा नहीं कटा।",
  failed:
    "भुगतान की पुष्टि नहीं हो सकी। अगर पैसा कटा है, तो 5 से 7 दिनों में वापस आ जाएगा, या हमें लिखें।",
  off: "भुगतान जल्द शुरू होंगे। तब तक सब कुछ मुफ़्त है।",
  ownerOnly: {
    title: "पैकेज केवल निमंत्रण बनाने वाले ही ले सकते हैं",
    body: "सह-मेज़बान निमंत्रण चलाने में मदद करते हैं, पर भुगतान, रसीद और GST इनवॉइस बनाने वाले के नाम होते हैं। उनसे अपने खाते से पैकेज चुनने को कहें।",
  },
  loadFailed: "भुगतान की विंडो नहीं खुल सकी। अपना इंटरनेट जाँचें और फिर कोशिश करें।",
  receipts: "रसीदें",
  receipt: (plan, price) => `${plan}, ${price}`,
  paymentId: "भुगतान",
  back: "निमंत्रण पर वापस",
  backToEditor: "अपने निमंत्रण पर वापस",
  secure: "Razorpay से सुरक्षित भुगतान: UPI, कार्ड और नेटबैंकिंग।",
  previewCheckout: {
    title: "टेस्ट भुगतान",
    body: (price) =>
      `प्रीव्यू मोड: कोई पैसा नहीं कटता। ${price} का भुगतान करके देखें कि पैकेज कैसे खुलता है।`,
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
    "wrong-plan": "यह कोड आपके चुनने लायक पैकेजों पर लागू नहीं होता।",
  },
  invoice: "इनवॉइस",
  refunded: "पैसा वापस",
  refunds: "अगर निमंत्रण किसी मेहमान को नहीं भेजा गया है, तो 7 दिनों के अंदर पूरा पैसा वापस।",
};

const TIER_NAMES = ["फ़्री", "प्रीमियम", "रॉयल"];

export const limitCopy: Translation<typeof en.limitCopy> = {
  title: "इस निमंत्रण को एक पैकेज चाहिए",
  body: (plan) => `इसे ऐसे ही प्रकाशित करने के लिए ${plan} चुनें।`,
  used: {
    languages: (count) => `कार्ड की ${count} भाषाएँ`,
    ownSong: () => "आपका अपना गाना",
    design: (rank) => `${TIER_NAMES[rank] ?? "प्रीमियम"} डिज़ाइन`,
  },
  choose: "पैकेज चुनें",
  edition: (plan) => `पैकेज: ${plan}`,
  invitesUsed: (used, limit) => `${limit} में से ${used} इनवाइट लगे`,
  unlockBody: (plan, price) => `${plan} में इस निमंत्रण की हर चीज़ शामिल है, ${price} में।`,
  unlock: (plan) => `${plan} लें`,
  upgrade: "अपग्रेड करें",
};
