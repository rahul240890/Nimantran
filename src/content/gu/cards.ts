import type * as en from "../cards";
import type { Translation } from "@/i18n/text";

/* ગુજરાતી: સેવ ધ ડેટ અને આભાર કાર્ડ. English: src/content/cards.ts. Draft for a native proofreader. */

export const cardsCopy: Translation<typeof en.cardsCopy> = {
  metaTitle: "સેવ ધ ડેટ અને આભાર કાર્ડ",
  back: "આમંત્રણ પર પાછા",
  heading: "સેવ ધ ડેટ અને આભાર કાર્ડ",
  intro:
    "તમારા આમંત્રણની ડિઝાઇનમાં બે ચિત્રો, WhatsApp પર મોકલવા માટે: આમંત્રણ પહેલાં સેવ ધ ડેટ, અને પ્રસંગ પછી આભાર.",
  open: "સેવ ધ ડેટ અને આભાર કાર્ડ",
  openShort: "કાર્ડ",
  openBody: "તમારા આમંત્રણની ડિઝાઇનમાં ચિત્રો, પ્રસંગ પહેલાં અને પછી મોકલવા માટે.",
  kinds: { "save-the-date": "સેવ ધ ડેટ", "thank-you": "આભાર" },
  kindBody: {
    "save-the-date": "વહેલું મોકલો, જેથી પરિવાર અને મિત્રો એ દિવસ ખાલી રાખે.",
    "thank-you": "પ્રસંગ પછી, આવેલા અને આશીર્વાદ મોકલનારા સૌને મોકલો.",
  },
  noteLabel: { "save-the-date": "નીચેની લીટી", "thank-you": "તમારો સંદેશ" },
  noteHint: "કાર્ડની ભાષામાં. ખાલી રાખશો તો આ લીટી છપાશે નહીં.",
  noteCount: (used, max) => `${max} માંથી ${used} અક્ષર`,
  reset: "સૂચવેલા શબ્દો વાપરો",
  picture: (kind, names) => `${names}નું ${kind} કાર્ડ`,
  preparing: "તમારું કાર્ડ બની રહ્યું છે…",
  failed: "કાર્ડ બની શક્યું નહીં. ફરી પ્રયાસ કરો, અથવા Chrome કે Safari અજમાવો.",
  retry: "ફરી પ્રયાસ કરો",
  download: "ચિત્ર ડાઉનલોડ કરો",
  share: "WhatsApp પર મોકલો",
  fileName: (kind) => `${kind}.png`,
  preview: "ઝલક",
  previewNote:
    "આ ઝલક પર “Made with Shubh” લખેલું છે. Grand પેકેજ સાથે સેવ ધ ડેટ અને આભાર કાર્ડ નિશાન વગર મળે છે.",
  upgrade: "Grand લો",
};
