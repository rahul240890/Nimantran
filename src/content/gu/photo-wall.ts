import type * as en from "../photo-wall";
import type { Translation } from "@/i18n/text";

/* ગુજરાતી: સહિયારી ફોટો દીવાલ. English: src/content/photo-wall.ts. Draft for a native proofreader. */

const photos = (count: number) =>
  count === 1 ? "1 ફોટો" : `${count.toLocaleString("en-IN")} ફોટા`;

export const wallCopy: Translation<typeof en.wallCopy> = {
  heading: "ફોટો દીવાલ",
  intro: "ઉજવણીના આપના ફોટા ઉમેરો. આ આમંત્રણ ધરાવતા સૌ તે જોઈ શકે છે.",
  soon: (date) => `ફોટો દીવાલ ${date} ના રોજ ખૂલશે. તે દિવસે આવીને આપના ફોટા શેર કરજો.`,
  closed: "ફોટો દીવાલ બંધ થઈ ગઈ છે. ફોટા શેર કરવા બદલ આભાર.",
  name: "આપનું નામ",
  nameHint: "આપના ફોટા નીચે દેખાશે.",
  optional: "વૈકલ્પિક",
  add: "ફોટા ઉમેરો",
  adding: (done, of) => `${of} માંથી ${done} ફોટો ઉમેરી રહ્યા છીએ…`,
  added: (count) => `${photos(count)} ઉમેર્યા. આભાર!`,
  failed: "કેટલાક ફોટા ઉમેરી શકાયા નહીં. ઇન્ટરનેટ તપાસો અને ફરી પ્રયત્ન કરો.",
  unreadable: "આ ફોન તેમાંનો એક ફોટો વાંચી શક્યો નહીં. JPEG કે PNG અજમાવી જુઓ.",
  full: "ફોટો દીવાલ ભરાઈ ગઈ છે.",
  share: "એક ફોનથી ઉમેરી શકાય તેટલા ફોટા આપે ઉમેરી દીધા છે.",
  tooMany: (max) => `એક વખતે વધુમાં વધુ ${max} ફોટા પસંદ કરો.`,
  empty: "હજુ એક પણ ફોટો નથી. પહેલો ફોટો આપ જ શેર કરો.",
  loading: "ફોટા આવી રહ્યા છે…",
  loadFailed: "ફોટા લાવી શકાયા નહીં.",
  retry: "ફરી પ્રયત્ન કરો",
  by: (name) => `${name} એ શેર કર્યો`,
  byGuest: "એક મહેમાને શેર કર્યો",
  photoAlt: (name, index) =>
    name ? `${name} એ શેર કરેલો ફોટો ${index}` : `એક મહેમાને શેર કરેલો ફોટો ${index}`,
  view: (index) => `ફોટો ${index} જુઓ`,
  remove: "કાઢો",
  removeLabel: (index) => `આપનો ફોટો ${index} કાઢો`,
  removed: "આપનો ફોટો કાઢી નાખ્યો.",
  removeFailed: "ફોટો કાઢી શકાયો નહીં. ફરી પ્રયત્ન કરો.",
  more: "વધુ ફોટા બતાવો",
  count: photos,
  close: "બંધ કરો",
  previous: "પાછલો ફોટો",
  next: "આગલો ફોટો",
  viewerTitle: (index, of) => `${of} માંથી ફોટો ${index}`,
};

export const albumCopy: Translation<typeof en.albumCopy> = {
  metaTitle: "ફોટો દીવાલ",
  back: "મહેમાનોની યાદી",
  eyebrow: "ફોટો દીવાલ",
  intro:
    "મહેમાનો પહેલા પ્રસંગથી જ આમંત્રણની લિંક પરથી ફોટા ઉમેરે છે. કોઈ પણ ફોટો છુપાવીને દીવાલ પરથી હટાવો, અથવા બધા ડાઉનલોડ કરો.",
  count: (total, hidden) =>
    hidden ? `${photos(total)} · ${hidden.toLocaleString("en-IN")} છુપાવેલા` : photos(total),
  window: {
    open: (date) =>
      date ? `મહેમાનો ${date} સુધી ફોટા ઉમેરી શકે છે.` : "મહેમાનો હમણાં ફોટા ઉમેરી શકે છે.",
    soon: (date) => `દીવાલ મહેમાનો માટે ${date} ના રોજ ખૂલશે.`,
    closed: "દીવાલ પર હવે નવા ફોટા ઉમેરી શકાતા નથી. આપ બધા ફોટા જોઈ અને ડાઉનલોડ કરી શકો છો.",
    off: "ફોટો દીવાલ સેલિબ્રેશન અને ગ્રૅન્ડ પૅકેજ સાથે મળે છે.",
    notLive: "પહેલાં આમંત્રણ પ્રકાશિત કરો; મહેમાનો તેની લિંક પરથી જ ફોટા ઉમેરે છે.",
  },
  openWall: "દીવાલ ખોલો",
  downloadAll: "બધા ડાઉનલોડ કરો",
  downloadPart: (part, of) => `${of} માંથી ભાગ ${part} ડાઉનલોડ થઈ રહ્યો છે…`,
  downloadFailed: "ફોટા ડાઉનલોડ થઈ શક્યા નહીં. ફરી પ્રયત્ન કરો.",
  download: "ડાઉનલોડ",
  downloadLabel: (index) => `ફોટો ${index} ડાઉનલોડ કરો`,
  hide: "છુપાવો",
  hideLabel: (index) => `ફોટો ${index} મહેમાનોથી છુપાવો`,
  show: "બતાવો",
  showLabel: (index) => `ફોટો ${index} મહેમાનોને ફરી બતાવો`,
  hiddenBadge: "છુપાવેલો",
  hidden: "મહેમાનોથી છુપાવી દીધો.",
  shown: "ફરી દીવાલ પર.",
  delete: "ડિલીટ કરો",
  deleteLabel: (index) => `ફોટો ${index} ડિલીટ કરો`,
  deleteTitle: "આ ફોટો ડિલીટ કરવો છે?",
  deleteBody:
    "તે દીવાલ પરથી અને આપના ડાઉનલોડમાંથી કાયમ માટે જતો રહેશે. છુપાવવાથી તે આપની પાસે રહે છે.",
  keep: "રહેવા દો",
  deleted: "ફોટો ડિલીટ થઈ ગયો.",
  failed: "આ સાચવી શકાયું નહીં. ફરી પ્રયત્ન કરો.",
  emptyTitle: "હજુ એક પણ ફોટો નથી",
  emptyBody: "આમંત્રણ મોકલો; મહેમાનો પહેલા પ્રસંગથી જ પોતાના ફોટા ઉમેરશે.",
  card: {
    title: "ફોટો દીવાલ",
    body: (count) =>
      count ? `મહેમાનો તરફથી ${photos(count)}.` : "પ્રસંગ પછી મહેમાનો તેમના ફોટા અહીં શેર કરે છે.",
    action: "ફોટા જુઓ",
  },
  close: "બંધ કરો",
  previous: "પાછલો ફોટો",
  next: "આગલો ફોટો",
  viewerTitle: (index, of) => `${of} માંથી ફોટો ${index}`,
  by: (name) => (name ? `${name} એ શેર કર્યો` : "એક મહેમાને શેર કર્યો"),
  photoAlt: (name, index) =>
    name ? `${name} એ શેર કરેલો ફોટો ${index}` : `એક મહેમાને શેર કરેલો ફોટો ${index}`,
  fileName: "photo-wall",
};
