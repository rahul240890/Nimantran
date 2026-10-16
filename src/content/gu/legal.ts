import type * as en from "../legal";
import type { Translation } from "@/i18n/text";

/*
 * ગુજરાતી: the legal pages' own words. The policies themselves stay in English, the version
 * that binds us, until a reviewed translation replaces them. English: src/content/legal.ts.
 */

export const legalCopy: Translation<typeof en.legalCopy> = {
  updated: "છેલ્લે અપડેટ",
  inEnglish:
    "આ નીતિ અંગ્રેજીમાં છે: અમને બંધનકર્તા આ જ આવૃત્તિ છે. ચકાસેલો ગુજરાતી અનુવાદ ટૂંક સમયમાં આવશે.",
  onThisPage: "આ પાના પર",
  contactHeading: "સંપર્ક",
  contactEmail: (email) => `અમને ${email} પર લખો. અમે 7 કામકાજના દિવસોમાં જવાબ આપીએ છીએ.`,
  contactPending:
    "અમારું સંપર્ક સરનામું લૉન્ચ પહેલાં અહીં દેખાશે. ત્યાં સુધી શુભ ઇન્વિટેશન ટીમના કોઈપણ સંદેશનો જવાબ આપો.",
  footer: {
    heading: "કાનૂની",
    privacy: "ગોપનીયતા",
    terms: "શરતો",
    refunds: "રિફંડ",
    contact: "સંપર્ક",
  },
};

export { privacy, refunds, terms } from "../legal";
