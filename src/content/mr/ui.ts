import type { uiStrings as en } from "@/lib/ui-strings";
import type { Translation } from "@/i18n/text";
import { site } from "@/lib/site";

/* मराठी: सामायिक बटणे आणि थीमची नावे. English: src/lib/ui-strings.ts. Draft for a native proofreader. */

export const uiStrings: Translation<typeof en> = {
  close: "बंद करा",
  notifications: "सूचना",
  theme: { group: "रंगसंगती", system: "डिव्हाइसप्रमाणे", light: "फिकट", dark: "गडद" },
  social: {
    heading: `${site.localNames.mr}ला फॉलो करा`,
    instagram: `Instagram वर ${site.localNames.mr}`,
    whatsapp: `${site.localNames.mr}चे WhatsApp चॅनल`,
    youtube: `YouTube वर ${site.localNames.mr}`,
  },
  invitation: {
    open: "निमंत्रण उघडा",
    close: "निमंत्रण बंद करा",
    playMusic: "संगीत लावा",
    pauseMusic: "संगीत थांबवा",
    preparing: "3D तयार होत आहे",
    skip: "अ‍ॅनिमेशन वगळा",
    and: "आणि",
    story: {
      story: "निमंत्रण, एकेक पान",
      pause: "पाने थांबवा",
      play: "पुढे चालू ठेवा",
      next: "पुढील पान",
      previous: "मागील पान",
      skip: "थेट कार्डवर जा",
      done: "कार्ड पाहा",
      replay: "निमंत्रणाची पाने चालवा",
      directions: "रस्ता पाहा",
      calendar: "कॅलेंडरमध्ये जोडा",
      textBox: "शब्दांमागे चौकट",
      more: "तपशील पाहा",
      calendarShort: "कॅलेंडर",
    },
    tour: {
      label: "निमंत्रण आपोआप पुढे जात आहे",
      pause: "इथेच थांबा",
      play: "पुढे चला",
      again: "निमंत्रण पुन्हा पाहा",
    },
  },
  storyWords: {
    saveTheDate: "तारीख लक्षात ठेवा",
    joinUs: "आपण आमच्यासोबत याल ना?",
    welcome: "आपले आगमन, आमचे भाग्य",
    withLove: "हात जोडून, डोळ्यांत प्राण आणून आपली वाट पाहत आहोत",
    and: "आणि",
  },
  error: {
    title: "काहीतरी बिघडले",
    body: "आम्हाला याची माहिती मिळाली आहे. पुन्हा प्रयत्न करा, आणि पुन्हा पुन्हा असे होत असेल तर थोड्या वेळाने या.",
    retry: "पुन्हा प्रयत्न करा",
    home: "शुभ इन्व्हिटेशनवर जा",
  },
  notFound: {
    title: "हे पान इथे नाही",
    body: "लिंक कदाचित चुकीची टाइप झाली आहे, किंवा पान दुसरीकडे हलवले आहे.",
    home: "शुभ इन्व्हिटेशनवर जा",
    designs: "निमंत्रण डिझाइन पाहा",
  },
};
