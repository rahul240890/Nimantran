import type * as en from "../photo-wall";
import type { Translation } from "@/i18n/text";

/* हिन्दी: साझा फ़ोटो दीवार। English: src/content/photo-wall.ts. */

const photos = (count: number) =>
  count === 1 ? "1 फ़ोटो" : `${count.toLocaleString("hi-IN")} फ़ोटो`;

export const wallCopy: Translation<typeof en.wallCopy> = {
  heading: "फ़ोटो दीवार",
  intro: "समारोह की अपनी फ़ोटो जोड़ें। इस निमंत्रण वाले सभी लोग इन्हें देख सकते हैं।",
  soon: (date) => `फ़ोटो दीवार ${date} को खुलेगी। उस दिन आकर अपनी फ़ोटो साझा करें।`,
  closed: "फ़ोटो दीवार बंद हो गई है। अपनी फ़ोटो साझा करने के लिए धन्यवाद।",
  name: "आपका नाम",
  nameHint: "आपकी फ़ोटो के नीचे दिखेगा।",
  optional: "वैकल्पिक",
  add: "फ़ोटो जोड़ें",
  adding: (done, of) => `${of} में से फ़ोटो ${done} जुड़ रही है…`,
  added: (count) => `${photos(count)} जुड़ गईं। धन्यवाद!`,
  failed: "कुछ फ़ोटो नहीं जुड़ पाईं। इंटरनेट देखकर फिर कोशिश करें।",
  unreadable: "यह फ़ोन उनमें से एक फ़ोटो नहीं पढ़ पाया। JPEG या PNG आज़माएँ।",
  full: "फ़ोटो दीवार भर गई है।",
  share: "एक फ़ोन से जितनी फ़ोटो जुड़ सकती हैं, आप जोड़ चुके हैं।",
  tooMany: (max) => `एक बार में ${max} तक फ़ोटो चुनें।`,
  empty: "अभी कोई फ़ोटो नहीं। पहली फ़ोटो आप साझा करें।",
  loading: "फ़ोटो आ रही हैं…",
  loadFailed: "फ़ोटो नहीं आ पाईं।",
  retry: "फिर कोशिश करें",
  by: (name) => `${name} ने साझा की`,
  byGuest: "एक मेहमान ने साझा की",
  photoAlt: (name, index) =>
    name ? `${name} की साझा की हुई फ़ोटो ${index}` : `एक मेहमान की साझा की हुई फ़ोटो ${index}`,
  view: (index) => `फ़ोटो ${index} देखें`,
  remove: "हटाएँ",
  removeLabel: (index) => `अपनी फ़ोटो ${index} हटाएँ`,
  removed: "आपकी फ़ोटो हट गई।",
  removeFailed: "फ़ोटो नहीं हट पाई। फिर कोशिश करें।",
  more: "और फ़ोटो दिखाएँ",
  count: photos,
  close: "बंद करें",
  previous: "पिछली फ़ोटो",
  next: "अगली फ़ोटो",
  viewerTitle: (index, of) => `${of} में से फ़ोटो ${index}`,
};

export const albumCopy: Translation<typeof en.albumCopy> = {
  metaTitle: "फ़ोटो दीवार",
  back: "मेहमान सूची",
  eyebrow: "फ़ोटो दीवार",
  intro:
    "मेहमान पहले समारोह से निमंत्रण के लिंक पर फ़ोटो जोड़ते हैं। कोई भी फ़ोटो छिपाकर दीवार से हटाएँ, या सारी डाउनलोड करें।",
  count: (total, hidden) =>
    hidden ? `${photos(total)} · ${hidden.toLocaleString("hi-IN")} छिपी हुई` : photos(total),
  window: {
    open: (date) =>
      date ? `मेहमान ${date} तक फ़ोटो जोड़ सकते हैं।` : "मेहमान अभी फ़ोटो जोड़ सकते हैं।",
    soon: (date) => `दीवार मेहमानों के लिए ${date} को खुलेगी।`,
    closed: "दीवार पर नई फ़ोटो अब नहीं जुड़ सकतीं। आप सारी फ़ोटो देख और डाउनलोड कर सकते हैं।",
    off: "फ़ोटो दीवार प्रीमियम, रॉयल और वेडिंग बंडल के साथ मिलती है।",
    notLive: "पहले निमंत्रण प्रकाशित करें; मेहमान उसी के लिंक से फ़ोटो जोड़ते हैं।",
  },
  openWall: "दीवार खोलें",
  downloadAll: "सारी डाउनलोड करें",
  downloadPart: (part, of) => `${of} में से भाग ${part} डाउनलोड हो रहा है…`,
  downloadFailed: "फ़ोटो डाउनलोड नहीं हो पाईं। फिर कोशिश करें।",
  download: "डाउनलोड",
  downloadLabel: (index) => `फ़ोटो ${index} डाउनलोड करें`,
  hide: "छिपाएँ",
  hideLabel: (index) => `फ़ोटो ${index} मेहमानों से छिपाएँ`,
  show: "दिखाएँ",
  showLabel: (index) => `फ़ोटो ${index} मेहमानों को फिर दिखाएँ`,
  hiddenBadge: "छिपी हुई",
  hidden: "मेहमानों से छिपा दी गई।",
  shown: "दीवार पर वापस।",
  delete: "मिटाएँ",
  deleteLabel: (index) => `फ़ोटो ${index} मिटाएँ`,
  deleteTitle: "यह फ़ोटो मिटाएँ?",
  deleteBody: "यह दीवार और आपके डाउनलोड से हमेशा के लिए चली जाएगी। छिपाने पर यह आपके पास रहती है।",
  keep: "रहने दें",
  deleted: "फ़ोटो मिट गई।",
  failed: "यह सहेजा नहीं जा सका। फिर कोशिश करें।",
  emptyTitle: "अभी कोई फ़ोटो नहीं",
  emptyBody: "निमंत्रण भेजें; मेहमान पहले समारोह से अपनी फ़ोटो जोड़ेंगे।",
  card: {
    title: "फ़ोटो दीवार",
    body: (count) =>
      count
        ? `मेहमानों की ${photos(count)}।`
        : "समारोह के बाद मेहमान अपनी फ़ोटो यहाँ साझा करते हैं।",
    action: "फ़ोटो देखें",
  },
  close: "बंद करें",
  previous: "पिछली फ़ोटो",
  next: "अगली फ़ोटो",
  viewerTitle: (index, of) => `${of} में से फ़ोटो ${index}`,
  by: (name) => (name ? `${name} ने साझा की` : "एक मेहमान ने साझा की"),
  photoAlt: (name, index) =>
    name ? `${name} की साझा की हुई फ़ोटो ${index}` : `एक मेहमान की साझा की हुई फ़ोटो ${index}`,
  fileName: "photo-wall",
};
