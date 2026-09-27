import type { uiStrings as en } from "@/lib/ui-strings";
import type { Translation } from "@/i18n/text";

/* हिन्दी: साझा बटन और थीम के नाम। English: src/lib/ui-strings.ts. */

export const uiStrings: Translation<typeof en> = {
  close: "बंद करें",
  notifications: "सूचनाएँ",
  theme: { group: "रंग थीम", system: "डिवाइस जैसा", light: "हल्की", dark: "गहरी" },
  invitation: {
    open: "निमंत्रण खोलें",
    close: "निमंत्रण बंद करें",
    playMusic: "संगीत चलाएँ",
    pauseMusic: "संगीत रोकें",
    preparing: "3D तैयार हो रहा है",
    skip: "एनिमेशन छोड़ें",
    and: "और",
  },
  error: {
    title: "कुछ गड़बड़ हो गई",
    body: "हमें इसकी सूचना मिल गई है। फिर से कोशिश करें, और बार-बार हो तो थोड़ी देर बाद आएँ।",
    retry: "फिर से कोशिश करें",
    home: "शुभद्वार पर जाएँ",
  },
  notFound: {
    title: "यह पेज यहाँ नहीं है",
    body: "लिंक शायद ग़लत लिखा है, या पेज कहीं और चला गया है।",
    home: "शुभद्वार पर जाएँ",
  },
};
