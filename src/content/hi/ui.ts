import type { uiStrings as en } from "@/lib/ui-strings";
import type { Translation } from "@/i18n/text";
import { site } from "@/lib/site";

/* हिन्दी: साझा बटन और थीम के नाम। English: src/lib/ui-strings.ts. */

export const uiStrings: Translation<typeof en> = {
  close: "बंद करें",
  notifications: "सूचनाएँ",
  theme: { group: "रंग थीम", system: "डिवाइस जैसा", light: "हल्की", dark: "गहरी" },
  social: {
    heading: `${site.localNames.hi} को फ़ॉलो करें`,
    instagram: `Instagram पर ${site.localNames.hi}`,
    whatsapp: `${site.localNames.hi} का WhatsApp चैनल`,
    youtube: `YouTube पर ${site.localNames.hi}`,
  },
  invitation: {
    open: "निमंत्रण खोलें",
    close: "निमंत्रण बंद करें",
    playMusic: "संगीत चलाएँ",
    pauseMusic: "संगीत रोकें",
    preparing: "3D तैयार हो रहा है",
    skip: "एनिमेशन छोड़ें",
    and: "और",
    story: {
      story: "निमंत्रण, एक-एक पन्ना करके",
      pause: "पन्ने रोकें",
      play: "आगे चलाएँ",
      next: "अगला पन्ना",
      previous: "पिछला पन्ना",
      skip: "सीधे कार्ड पर जाएँ",
      done: "कार्ड देखें",
      replay: "निमंत्रण के पन्ने चलाएँ",
      directions: "रास्ता देखें",
      calendar: "कैलेंडर में जोड़ें",
      textBox: "शब्दों के पीछे डिब्बा",
      more: "विवरण देखें",
      calendarShort: "कैलेंडर",
    },
    tour: {
      label: "निमंत्रण अपने आप आगे बढ़ रहा है",
      pause: "यहीं रुकें",
      play: "आगे चलें",
      again: "निमंत्रण फिर से देखें",
    },
  },
  storyWords: {
    saveTheDate: "तारीख़ याद रखें",
    joinUs: "क्या आप हमारे साथ होंगे?",
    welcome: "आपका आगमन, हमारा सौभाग्य",
    withLove: "हाथ जोड़कर, पलकें बिछाए आपकी राह देख रहे हैं",
    and: "और",
  },
  error: {
    title: "कुछ गड़बड़ हो गई",
    body: "हमें इसकी सूचना मिल गई है। फिर से कोशिश करें, और बार-बार हो तो थोड़ी देर बाद आएँ।",
    retry: "फिर से कोशिश करें",
    home: "शुभ इन्विटेशन पर जाएँ",
  },
  notFound: {
    title: "यह पेज यहाँ नहीं है",
    body: "लिंक शायद ग़लत लिखा है, या पेज कहीं और चला गया है।",
    home: "शुभ इन्विटेशन पर जाएँ",
    designs: "निमंत्रण डिज़ाइन देखें",
  },
};
