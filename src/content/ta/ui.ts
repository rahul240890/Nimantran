import type { uiStrings as en } from "@/lib/ui-strings";
import type { Translation } from "@/i18n/text";
import { site } from "@/lib/site";

/* தமிழ்: பொதுவான பொத்தான்கள் மற்றும் தீம் பெயர்கள். English: src/lib/ui-strings.ts. Draft for a native proofreader. */

export const uiStrings: Translation<typeof en> = {
  close: "மூடவும்",
  notifications: "அறிவிப்புகள்",
  theme: { group: "வண்ணத் தீம்", system: "சாதனத்தைப் போல", light: "வெளிர்", dark: "இருண்ட" },
  social: {
    heading: `${site.localNames.ta}-ஐப் பின்தொடருங்கள்`,
    instagram: `Instagram-இல் ${site.localNames.ta}`,
    whatsapp: `${site.localNames.ta}-இன் WhatsApp சேனல்`,
    youtube: `YouTube-இல் ${site.localNames.ta}`,
  },
  invitation: {
    open: "அழைப்பிதழைத் திறக்கவும்",
    close: "அழைப்பிதழை மூடவும்",
    playMusic: "இசையை இயக்கவும்",
    pauseMusic: "இசையை நிறுத்தவும்",
    preparing: "3D தயாராகிறது",
    skip: "அனிமேஷனைத் தவிர்க்கவும்",
    and: "மற்றும்",
    story: {
      story: "அழைப்பிதழ், ஒவ்வொரு பக்கமாக",
      pause: "பக்கங்களை நிறுத்தவும்",
      play: "தொடரவும்",
      next: "அடுத்த பக்கம்",
      previous: "முந்தைய பக்கம்",
      skip: "நேரடியாக அட்டைக்குச் செல்லவும்",
      done: "அட்டையைப் பார்க்கவும்",
      replay: "அழைப்பிதழ் பக்கங்களை இயக்கவும்",
      directions: "வழி பார்க்கவும்",
      calendar: "நாள்காட்டியில் சேர்க்கவும்",
      textBox: "எழுத்துகளுக்குப் பின் பெட்டி",
      more: "விவரங்களைப் பார்க்கவும்",
      calendarShort: "நாள்காட்டி",
      loading: "பக்கம் திறக்கிறது",
    },
    tour: {
      label: "அழைப்பிதழ் தானாக நகர்கிறது",
      pause: "இங்கே நிறுத்தவும்",
      play: "தொடர்ந்து இயக்கவும்",
      again: "அழைப்பிதழை மீண்டும் பாருங்கள்",
    },
  },
  storyWords: {
    saveTheDate: "தேதியைக் குறித்துக்கொள்ளுங்கள்",
    joinUs: "எங்களுடன் கலந்துகொள்வீர்களா?",
    welcome: "உங்கள் வருகை, எங்கள் பாக்கியம்",
    withLove: "கரம் கூப்பி, இதயம் நிறைந்த அன்புடன் உங்கள் வருகைக்குக் காத்திருக்கிறோம்",
    and: "மற்றும்",
  },
  error: {
    title: "ஏதோ தவறு நடந்துவிட்டது",
    body: "இது பற்றி எங்களுக்குத் தெரிவிக்கப்பட்டுள்ளது. மீண்டும் முயலவும்; தொடர்ந்து நடந்தால் சிறிது நேரம் கழித்து வாருங்கள்.",
    retry: "மீண்டும் முயலவும்",
    home: "ஷுப் இன்விடேஷன் செல்லவும்",
  },
  notFound: {
    title: "இந்தப் பக்கம் இங்கே இல்லை",
    body: "இணைப்பு தவறாக டைப் செய்யப்பட்டிருக்கலாம், அல்லது பக்கம் வேறு இடத்திற்கு மாறியிருக்கலாம்.",
    home: "ஷுப் இன்விடேஷன் செல்லவும்",
    designs: "அழைப்பிதழ் டிசைன்களைப் பார்க்கவும்",
  },
};
