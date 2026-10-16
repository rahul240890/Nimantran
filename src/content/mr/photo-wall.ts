import type * as en from "../photo-wall";
import type { Translation } from "@/i18n/text";

/* मराठी: सामायिक फोटो भिंत. English: src/content/photo-wall.ts. Draft for a native proofreader. */

const photos = (count: number) =>
  count === 1 ? "1 फोटो" : `${count.toLocaleString("en-IN")} फोटो`;

export const wallCopy: Translation<typeof en.wallCopy> = {
  heading: "फोटो भिंत",
  intro: "सोहळ्याचे आपले फोटो जोडा. हे निमंत्रण असलेले सर्वजण ते पाहू शकतात.",
  soon: (date) => `फोटो भिंत ${date} रोजी उघडेल. त्या दिवशी येऊन आपले फोटो शेअर करा.`,
  closed: "फोटो भिंत बंद झाली आहे. फोटो शेअर केल्याबद्दल धन्यवाद.",
  name: "आपले नाव",
  nameHint: "आपल्या फोटोंखाली दिसेल.",
  optional: "ऐच्छिक",
  add: "फोटो जोडा",
  adding: (done, of) => `${of} पैकी ${done} फोटो जोडत आहोत…`,
  added: (count) => `${photos(count)} जोडले. धन्यवाद!`,
  failed: "काही फोटो जोडता आले नाहीत. इंटरनेट तपासा आणि पुन्हा प्रयत्न करा.",
  unreadable: "या फोनला त्यापैकी एक फोटो वाचता आला नाही. JPEG किंवा PNG वापरून पाहा.",
  full: "फोटो भिंत भरली आहे.",
  share: "एका फोनवरून जितके फोटो जोडता येतात तितके आपण जोडले आहेत.",
  tooMany: (max) => `एका वेळी जास्तीत जास्त ${max} फोटो निवडा.`,
  empty: "अजून एकही फोटो नाही. पहिला फोटो आपणच शेअर करा.",
  loading: "फोटो येत आहेत…",
  loadFailed: "फोटो आणता आले नाहीत.",
  retry: "पुन्हा प्रयत्न करा",
  by: (name) => `${name} यांनी शेअर केला`,
  byGuest: "एका पाहुण्याने शेअर केला",
  photoAlt: (name, index) =>
    name ? `${name} यांनी शेअर केलेला फोटो ${index}` : `एका पाहुण्याने शेअर केलेला फोटो ${index}`,
  view: (index) => `फोटो ${index} पाहा`,
  remove: "काढा",
  removeLabel: (index) => `आपला फोटो ${index} काढा`,
  removed: "आपला फोटो काढला.",
  removeFailed: "फोटो काढता आला नाही. पुन्हा प्रयत्न करा.",
  more: "आणखी फोटो दाखवा",
  count: photos,
  close: "बंद करा",
  previous: "मागील फोटो",
  next: "पुढील फोटो",
  viewerTitle: (index, of) => `${of} पैकी फोटो ${index}`,
};

export const albumCopy: Translation<typeof en.albumCopy> = {
  metaTitle: "फोटो भिंत",
  back: "पाहुण्यांची यादी",
  eyebrow: "फोटो भिंत",
  intro:
    "पहिल्या सोहळ्यापासून पाहुणे निमंत्रणाच्या लिंकवरून फोटो जोडतात. कोणताही फोटो लपवून भिंतीवरून काढा, किंवा सगळे डाउनलोड करा.",
  count: (total, hidden) =>
    hidden ? `${photos(total)} · ${hidden.toLocaleString("en-IN")} लपवलेले` : photos(total),
  window: {
    open: (date) =>
      date ? `पाहुणे ${date} पर्यंत फोटो जोडू शकतात.` : "पाहुणे आता फोटो जोडू शकतात.",
    soon: (date) => `भिंत पाहुण्यांसाठी ${date} रोजी उघडेल.`,
    closed: "भिंतीवर आता नवे फोटो जोडता येत नाहीत. आपण सगळे फोटो पाहू आणि डाउनलोड करू शकता.",
    off: "फोटो भिंत सेलिब्रेशन आणि ग्रँड पॅकेजसोबत मिळते.",
    notLive: "आधी निमंत्रण प्रकाशित करा; पाहुणे त्याच्याच लिंकवरून फोटो जोडतात.",
  },
  openWall: "भिंत उघडा",
  downloadAll: "सगळे डाउनलोड करा",
  downloadPart: (part, of) => `${of} पैकी भाग ${part} डाउनलोड होत आहे…`,
  downloadFailed: "फोटो डाउनलोड करता आले नाहीत. पुन्हा प्रयत्न करा.",
  download: "डाउनलोड",
  downloadLabel: (index) => `फोटो ${index} डाउनलोड करा`,
  hide: "लपवा",
  hideLabel: (index) => `फोटो ${index} पाहुण्यांपासून लपवा`,
  show: "दाखवा",
  showLabel: (index) => `फोटो ${index} पाहुण्यांना पुन्हा दाखवा`,
  hiddenBadge: "लपवलेला",
  hidden: "पाहुण्यांपासून लपवला.",
  shown: "पुन्हा भिंतीवर.",
  delete: "हटवा",
  deleteLabel: (index) => `फोटो ${index} हटवा`,
  deleteTitle: "हा फोटो हटवायचा?",
  deleteBody: "तो भिंतीवरून आणि आपल्या डाउनलोडमधून कायमचा जाईल. लपवल्यास तो आपल्याकडे राहतो.",
  keep: "राहू द्या",
  deleted: "फोटो हटवला.",
  failed: "हे सेव्ह करता आले नाही. पुन्हा प्रयत्न करा.",
  emptyTitle: "अजून एकही फोटो नाही",
  emptyBody: "निमंत्रण पाठवा; पहिल्या सोहळ्यापासून पाहुणे आपले फोटो जोडतील.",
  card: {
    title: "फोटो भिंत",
    body: (count) =>
      count ? `पाहुण्यांचे ${photos(count)}.` : "सोहळ्यानंतर पाहुणे आपले फोटो इथे शेअर करतात.",
    action: "फोटो पाहा",
  },
  close: "बंद करा",
  previous: "मागील फोटो",
  next: "पुढील फोटो",
  viewerTitle: (index, of) => `${of} पैकी फोटो ${index}`,
  by: (name) => (name ? `${name} यांनी शेअर केला` : "एका पाहुण्याने शेअर केला"),
  photoAlt: (name, index) =>
    name ? `${name} यांनी शेअर केलेला फोटो ${index}` : `एका पाहुण्याने शेअर केलेला फोटो ${index}`,
  fileName: "photo-wall",
};
