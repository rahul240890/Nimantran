import type * as en from "../legal";
import type { Translation } from "@/i18n/text";

/*
 * मराठी: the legal pages' own words. The policies themselves stay in English, the version
 * that binds us, until a reviewed translation replaces them. English: src/content/legal.ts.
 */

export const legalCopy: Translation<typeof en.legalCopy> = {
  updated: "शेवटचे अपडेट",
  inEnglish:
    "हे धोरण इंग्रजीत आहे: आमच्यावर बंधनकारक असलेली हीच आवृत्ती आहे. तपासलेले मराठी भाषांतर लवकरच येईल.",
  onThisPage: "या पानावर",
  contactHeading: "संपर्क",
  contactEmail: (email) => `आम्हाला ${email} वर लिहा. आम्ही 7 कामकाजाच्या दिवसांत उत्तर देतो.`,
  contactPending:
    "आमचा संपर्क पत्ता लॉन्चपूर्वी इथे दिसेल. तोपर्यंत शुभ इन्व्हिटेशन टीमच्या कोणत्याही संदेशाला उत्तर द्या.",
  footer: {
    heading: "कायदेशीर",
    privacy: "गोपनीयता",
    terms: "अटी",
    refunds: "परतावा",
    contact: "संपर्क",
  },
};

export { privacy, refunds, terms } from "../legal";
