import type * as en from "../dashboard";
import type { Translation } from "@/i18n/text";

/* हिन्दी: मेज़बान डैशबोर्ड और सह-मेज़बान। English: src/content/dashboard.ts. */

const n = (count: number) => count.toLocaleString("hi-IN");

export const dashboardCopy: Translation<typeof en.dashboardCopy> = {
  metaTitle: "मेहमान",
  back: "मेरे निमंत्रण",
  eyebrow: "मेहमान सूची",
  draftBadge: "ड्राफ़्ट",
  liveBadge: "लाइव",
  cohostBadge: "सह-मेज़बान",
  share: "भेजें",
  edit: "निमंत्रण बदलें",
  open: "निमंत्रण खोलें",
  notLive: {
    title: "यह निमंत्रण अभी लाइव नहीं है",
    body: "मेहमान सूची आप अभी बना सकते हैं। निजी लिंक और याद-दिहानी प्रकाशित करने के बाद चलेंगी।",
    action: "पूरा करें और प्रकाशित करें",
  },

  stats: {
    label: "एक नज़र में",
    guests: "मेहमान",
    guestsNote: (people) =>
      people === 1 ? "1 व्यक्ति के लिए निमंत्रण" : `${n(people)} लोगों के लिए निमंत्रण`,
    opened: "खोला",
    openedNote: (count, of) => `${of} में से ${count}`,
    replied: "जवाब दिया",
    waiting: "इंतज़ार",
    waitingNote: "अभी जवाब नहीं दिया",
    percent: (value, of) => (of ? `${Math.round((value / of) * 100)}%` : "0%"),
  },

  functionsHeading: "हर उत्सव में कितने लोग",
  coming: (count) => `${n(count)} आ रहे हैं`,
  children: (count) => (count ? ` · ${n(count)} बच्चे` : ""),
  maybe: (count) => `${count} शायद`,
  declined: (count) => `${count} नहीं आ पाएँगे`,
  waitingFor: (count) => `${count} का जवाब बाक़ी`,

  list: {
    heading: "मेहमान",
    search: "मेहमान खोजें",
    searchPlaceholder: "नाम, समूह या नंबर",
    clearSearch: "खोज साफ़ करें",
    filterLabel: "दिखाएँ",
    filters: {
      all: "सभी",
      coming: "आ रहे हैं",
      maybe: "शायद",
      declined: "नहीं आ पाएँगे",
      waiting: "इंतज़ार",
      "not-opened": "नहीं खोला",
    },
    functionLabel: "उत्सव",
    allFunctions: "सभी उत्सव",
    showing: (shown, total) =>
      shown === total ? `${n(total)} मेहमान` : `${total} में से ${shown} मेहमान`,
    add: "मेहमान जोड़ें",
    export: "CSV डाउनलोड करें",
    remind: "याद दिलाएँ",
    empty: {
      title: "आपकी मेहमान सूची यहाँ से शुरू होती है",
      body: "जिन्हें बुला रहे हैं उन्हें जोड़िए, हर एक को उसका निजी लिंक भेजिए और देखिए किसने खोला। आपके साझा लिंक से जवाब देने वाले मेहमान भी यहाँ आ जाते हैं।",
    },
    noMatch: {
      title: "कोई मेहमान नहीं मिला",
      body: "कोई और नाम आज़माएँ, या सभी को दिखाएँ।",
      action: "सभी को दिखाएँ",
    },
  },

  guest: {
    party: (count) => (count === 1 ? "1 व्यक्ति" : `${n(count)} लोग`),
    selfAdded: "साझा लिंक से जवाब दिया",
    opened: "खोला",
    notOpened: "नहीं खोला",
    reminded: (when) => `${when} याद दिलाया`,
    notInvited: "आमंत्रित नहीं",
    waiting: "इंतज़ार",
    status: {
      attending: "आ रहे हैं",
      maybe: "शायद",
      declined: "नहीं आ पाएँगे",
    },
    people: (count) => ` · ${count}`,
    actions: (name) => `${name} के विकल्प`,
    send: "भेजें",
    sendTo: (name) => `${name} को WhatsApp पर निमंत्रण भेजें`,
    remindTo: (name) => `${name} को WhatsApp पर याद दिलाएँ`,
    sendInvite: "निमंत्रण भेजें",
    sendReminder: "याद दिलाएँ",
    copyLink: "निजी लिंक कॉपी करें",
    edit: "मेहमान बदलें",
    remove: "मेहमान हटाएँ",
    linkCopied: "निजी लिंक कॉपी हो गया",
    copyFailed: "कॉपी नहीं हुआ। फिर कोशिश करें।",
  },

  form: {
    addTitle: "मेहमान जोड़ें",
    editTitle: "मेहमान बदलें",
    oneTab: "एक मेहमान",
    pasteTab: "सूची चिपकाएँ",
    name: "नाम",
    namePlaceholder: "शर्मा अंकल, मीरा अय्यर…",
    nameRequired: "नाम लिखें",
    phone: "WhatsApp नंबर",
    phoneHint: "ताकि उनका निजी लिंक सीधे उन्हें भेज सकें।",
    phoneInvalid: "यह फ़ोन नंबर नहीं लगता",
    group: "समूह",
    groupPlaceholder: "दुल्हन का परिवार, दफ़्तर के दोस्त…",
    groupHint: "छाँटने और बैठने की व्यवस्था में मदद करता है।",
    partySize: "निमंत्रण कितनों के लिए",
    partyHint: "उन्हें मिलाकर कितने लोग।",
    fewer: "लोग कम करें",
    more: "लोग बढ़ाएँ",
    functions: "किनमें आमंत्रित",
    functionsHint: "सब पर निशान रहने दें तो हर उत्सव में आमंत्रित।",
    functionsRequired: "कम से कम एक उत्सव चुनें",
    optional: "वैकल्पिक",
    paste: "आपकी सूची",
    pasteHint:
      "हर पंक्ति में एक मेहमान, नंबर हो तो साथ में। चार लोगों के परिवार के लिए (4) लिखें। एक बार में 300 तक।",
    pastePlaceholder: "शर्मा अंकल, 98765 43210 (4)\nमीरा अय्यर +91 98765 00000\nदादी",
    pasteGroup: "इस सूची में सबका समूह",
    pasteSummary: (ok, bad) =>
      bad
        ? `${n(ok)} मेहमान तैयार। ${n(bad)} पंक्ति ठीक करनी है।`
        : `${n(ok)} मेहमान जोड़ने को तैयार।`,
    pasteLine: (line) => `पंक्ति ${line}`,
    pasteNoName: "नाम नहीं",
    pastePhone: "नंबर समझ नहीं आया",
    pasteEmpty: "कम से कम एक नाम चिपकाएँ या लिखें",
    cancel: "रद्द करें",
    close: "बंद करें",
    save: "मेहमान सहेजें",
    addOne: "मेहमान जोड़ें",
    addMany: (count) => (count ? `${n(count)} मेहमान जोड़ें` : "मेहमान जोड़ें"),
    added: (count) => (count === 1 ? "मेहमान जुड़ गया" : `${count} मेहमान जुड़ गए`),
    saved: "मेहमान सहेजा गया",
    failed: "सहेज नहीं पाए। इंटरनेट जाँचें और फिर कोशिश करें।",
  },

  removeGuest: {
    title: "यह मेहमान हटाएँ?",
    body: (name) =>
      `${name} आपकी सूची से हट जाएँगे, उनके भेजे जवाब समेत। उनका निजी लिंक काम करना बंद कर देगा।`,
    confirm: "मेहमान हटाएँ",
    cancel: "रहने दें",
    done: "मेहमान हटा दिया गया",
    failed: "मेहमान नहीं हट पाया। फिर कोशिश करें।",
  },

  messages: {
    invite: (name, names, occasion, when) =>
      [
        `आदरणीय ${name},`,
        occasion
          ? `${names} के ${occasion} में आप सप्रेम आमंत्रित हैं।`
          : `${names} की ओर से आपको सप्रेम आमंत्रण।`,
        when,
        "यह आपका निजी निमंत्रण है। कृपया खोलिए और बताइए कि आप आ पाएँगे:",
      ]
        .filter(Boolean)
        .join("\n"),
    reminder: (name, names, occasion, when) =>
      [
        `आदरणीय ${name},`,
        `${names} के ${occasion || "उत्सव"}${when ? ` (${when})` : ""} की एक विनम्र याद।`,
        "हमें जानकर ख़ुशी होगी कि आप आ पाएँगे। जवाब देने में बस एक पल लगेगा:",
      ].join("\n"),
  },

  reminders: {
    heading: "याद-दिहानी",
    body: (count) =>
      count
        ? `${n(count)} मेहमानों ने अभी जवाब नहीं दिया। हर एक को अपने नंबर से WhatsApp पर विनम्रता से याद दिलाइए।`
        : "आपकी सूची में सबने जवाब दे दिया है। किसी को याद दिलाने की ज़रूरत नहीं।",
    open: "याद दिलाएँ",
    title: "जिन्होंने जवाब नहीं दिया, उन्हें याद दिलाएँ",
    description:
      "हर बटन उसी मेहमान के लिए संदेश तैयार करके WhatsApp खोलता है। जिनका नंबर नहीं है, उनका संदेश आप ख़ुद भेज सकते हैं।",
    message: "संदेश",
    messageHint: "हर मेहमान के लिए उनका नाम और निजी लिंक जुड़ जाता है।",
    send: "भेजें",
    sent: "भेजा",
    copy: "कॉपी करें",
    noPhone: "नंबर नहीं",
    lastReminded: (when) => `पिछली बार ${when} याद दिलाया`,
    done: "हो गया",
    close: "बंद करें",
    automatic:
      "SMS और ईमेल से अपने-आप याद-दिहानी, भारत में टेक्स्ट मैसेज की व्यवस्था होने पर आएगी।",
  },

  schedule: {
    heading: "तय समय पर भेजें",
    body: (count) =>
      count
        ? `${n(count)} भेजना तय है। समय आने पर आपका कैलेंडर याद दिलाएगा, और हर संदेश यहाँ तैयार मिलेगा।`
        : "निमंत्रण या याद-दिहानी भेजने का दिन और समय चुनिए। आपका कैलेंडर याद दिलाएगा, और हर संदेश यहाँ तैयार मिलेगा।",
    notLive: "कब भेजना है, यह तय करने के लिए पहले निमंत्रण प्रकाशित करें।",
    add: "समय तय करें",
    limit: "एक साथ इतने ही रुक सकते हैं। पहले कोई एक भेजें या रद्द करें।",
    planTitle: "भेजने का समय तय करें",
    planDescription:
      "इस समय आपका फ़ोन याद दिलाएगा, और हर मेहमान का निजी लिंक वाला WhatsApp संदेश आपके नंबर से भेजने के लिए तैयार होगा।",
    what: "क्या भेजना है",
    purposes: {
      invite: "निमंत्रण",
      reminder: "याद-दिहानी",
    },
    purposeHints: {
      invite: "आपकी सूची के सभी मेहमान",
      reminder: "सिर्फ़ वे मेहमान जिन्होंने अभी जवाब नहीं दिया",
    },
    forLabel: "किसके लिए",
    everything: "सभी समारोह",
    date: "तारीख़",
    datePlaceholder: "दिन चुनें",
    time: "समय",
    timeHint: "भारतीय समय",
    save: "तय करें",
    cancel: "रद्द करें",
    past: "यह समय निकल चुका है। बाद का समय चुनें।",
    missing: "दिन और समय चुनें।",
    failed: "समय तय नहीं हो सका। फिर से कोशिश करें।",
    savedTitle: "समय तय हो गया",
    savedBody: (when) =>
      `${when} के लिए तय। इसे अपने कैलेंडर में जोड़ें, ताकि समय आने पर फ़ोन याद दिलाए।`,
    google: "Google कैलेंडर में जोड़ें",
    apple: "Apple या Outlook कैलेंडर",
    done: "हो गया",
    label: (purpose, fn) =>
      `${purpose === "invite" ? "निमंत्रण" : "याद-दिहानी"}${fn ? ` · ${fn}` : ""}`,
    audience: (count) => `${n(count)} मेहमान`,
    due: "भेजने का समय",
    sendNow: "अभी भेजें",
    actions: (label) => `${label} के और विकल्प`,
    cancelSend: "यह भेजना रद्द करें",
    cancelled: "भेजना रद्द हुआ",
    sendTitle: (label) => `भेजें: ${label}`,
    sendDescription:
      "हर बटन उसी मेहमान के लिए संदेश तैयार करके WhatsApp खोलता है। पूरी सूची भेज दें, तो इसे भेजा हुआ मार्क करें।",
    nobody: "अभी किसी को भेजने की ज़रूरत नहीं।",
    markSent: "भेजा हुआ मार्क करें",
    notYet: "अभी नहीं",
    marked: "भेजा हुआ मार्क हुआ",
    calendarTitle: (purpose, names) =>
      purpose === "invite" ? `${names} के निमंत्रण भेजें` : `मेहमानों को याद दिलाएँ: ${names}`,
    calendarBody: "अपनी मेहमान सूची खोलें। हर WhatsApp संदेश भेजने के लिए तैयार है:",
  },

  hosts: {
    heading: "सह-मेज़बान",
    body: "दोनों परिवार मिलकर यह निमंत्रण सँभाल सकते हैं: बदलना, मेहमान जोड़ना और हर जवाब देखना।",
    you: "आप",
    owner: "निमंत्रण बनाया",
    cohost: "सह-मेज़बान",
    unnamed: "नाम अभी नहीं जोड़ा",
    invite: "सह-मेज़बान बुलाएँ",
    inviteTitle: "सह-मेज़बान बुलाएँ",
    inviteBody:
      "हम एक निजी लिंक बनाएँगे। जो इसे खोलकर साइन इन करेगा, वह यह निमंत्रण सँभालने में मदद कर सकेगा। हर लिंक एक बार चलता है।",
    label: "यह किसके लिए है?",
    labelPlaceholder: "मीरा का परिवार, अर्जुन के भाई…",
    labelHint: "उनके नाम के साथ दिखेगा।",
    create: "लिंक बनाएँ",
    creating: "लिंक बन रहा है…",
    createFailed: "लिंक नहीं बना। फिर कोशिश करें।",
    pending: "जुड़ने का इंतज़ार",
    pendingFor: (label) => (label ? `${label} के लिए लिंक` : "सह-मेज़बान का लिंक"),
    whatsapp: "WhatsApp पर भेजें",
    copy: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    withdraw: "वापस लें",
    withdrawLabel: (label) => (label ? `${label} का लिंक वापस लें` : "यह लिंक वापस लें"),
    withdrawn: "लिंक वापस लिया गया",
    message: (names, url) =>
      `कृपया शुभ इन्विटेशन पर ${names} का निमंत्रण सँभालने में मेरी मदद करें। मेहमान सूची और जवाब देखने के लिए यह लिंक खोलकर साइन इन करें:\n${url}`,
    remove: (name) => `${name} को हटाएँ`,
    removeTitle: "इस सह-मेज़बान को हटाएँ?",
    removeBody: (name) =>
      `${name} अब यह निमंत्रण, इसकी मेहमान सूची या जवाब नहीं देख पाएँगे। आप उन्हें बाद में फिर बुला सकते हैं।`,
    removeConfirm: "सह-मेज़बान हटाएँ",
    removed: "सह-मेज़बान हटा दिया गया",
    leave: "यह निमंत्रण छोड़ें",
    leaveTitle: "यह निमंत्रण छोड़ें?",
    leaveBody:
      "आप अब यह निमंत्रण, इसकी मेहमान सूची या जवाब नहीं देख पाएँगे। परिवार आपको फिर बुला सकता है।",
    leaveConfirm: "निमंत्रण छोड़ें",
    left: "आपने निमंत्रण छोड़ दिया",
    keep: "रद्द करें",
    failed: "अभी नहीं हो पाया। फिर कोशिश करें।",
    onlyOwner: "सह-मेज़बान सिर्फ़ निमंत्रण बनाने वाले जोड़ सकते हैं।",
  },

  csv: {
    name: "नाम",
    phone: "फ़ोन",
    group: "समूह",
    partySize: "आमंत्रित",
    opened: "खोला",
    link: "निजी लिंक",
    message: "संदेश",
    yes: "हाँ",
    no: "नहीं",
    people: (name) => `${name}: लोग`,
    status: {
      attending: "आ रहे हैं",
      maybe: "शायद",
      declined: "नहीं आ पाएँगे",
      waiting: "इंतज़ार",
      "not-invited": "आमंत्रित नहीं",
    },
  },
};

export const joinCopy: Translation<typeof en.joinCopy> = {
  metaTitle: "सह-मेज़बान बनें",
  eyebrow: "सह-मेज़बान का न्योता",
  title: (names) => `${names} का निमंत्रण सँभालने में मदद करें`,
  body: (who, occasion) =>
    `${who || "परिवार"} ने आपसे ${occasion} के निमंत्रण में मदद माँगी है। सह-मेज़बान के रूप में आप निमंत्रण बदल सकते हैं, मेहमान जोड़ सकते हैं, याद दिला सकते हैं और हर जवाब देख सकते हैं।`,
  forLabel: (label) => `इस रूप में जुड़ेंगे: ${label}`,
  accept: "स्वीकार करें और मेहमान सूची खोलें",
  signIn: "स्वीकार करने के लिए साइन इन करें",
  signInNote: "अपने मोबाइल नंबर या Google से। बस एक पल लगेगा।",
  accepting: "जुड़ रहे हैं…",
  failed: "अभी स्वीकार नहीं हो पाया। फिर कोशिश करें।",
  usedTitle: "यह लिंक पहले ही इस्तेमाल हो चुका है",
  usedBody:
    "सह-मेज़बान के लिंक एक बार चलते हैं। अगर आप जुड़ चुके हैं, तो निमंत्रण मेरे निमंत्रण में है। नहीं तो परिवार से नया लिंक माँगें।",
  myInvites: "मेरे निमंत्रण पर जाएँ",
  off: "खाते जल्द खुलेंगे।",
};
