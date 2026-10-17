import type { uiStrings as en } from "@/lib/ui-strings";
import type { Translation } from "@/i18n/text";
import { site } from "@/lib/site";

/* ગુજરાતી: સહિયારાં બટન અને થીમનાં નામ. English: src/lib/ui-strings.ts. Draft for a native proofreader. */

export const uiStrings: Translation<typeof en> = {
  close: "બંધ કરો",
  notifications: "સૂચનાઓ",
  theme: { group: "રંગ થીમ", system: "ડિવાઇસ પ્રમાણે", light: "આછી", dark: "ઘેરી" },
  social: {
    heading: `${site.localNames.gu}ને ફૉલો કરો`,
    instagram: `Instagram પર ${site.localNames.gu}`,
    whatsapp: `${site.localNames.gu}ની WhatsApp ચેનલ`,
    youtube: `YouTube પર ${site.localNames.gu}`,
  },
  invitation: {
    open: "આમંત્રણ ખોલો",
    close: "આમંત્રણ બંધ કરો",
    playMusic: "સંગીત વગાડો",
    pauseMusic: "સંગીત રોકો",
    preparing: "3D તૈયાર થઈ રહ્યું છે",
    skip: "ઍનિમેશન છોડો",
    and: "અને",
    story: {
      story: "આમંત્રણ, એક પછી એક પાનું",
      pause: "પાનાં રોકો",
      play: "આગળ ચલાવો",
      next: "આગલું પાનું",
      previous: "પાછલું પાનું",
      skip: "સીધા કાર્ડ પર જાઓ",
      done: "કાર્ડ જુઓ",
      replay: "આમંત્રણનાં પાનાં ચલાવો",
      directions: "રસ્તો જુઓ",
      calendar: "કૅલેન્ડરમાં ઉમેરો",
      textBox: "શબ્દો પાછળ ચોકઠું",
      more: "વિગતો જુઓ",
      calendarShort: "કૅલેન્ડર",
    },
    tour: {
      label: "આમંત્રણ આપમેળે આગળ વધી રહ્યું છે",
      pause: "અહીં રોકો",
      play: "આગળ ચલાવો",
      again: "આમંત્રણ ફરી જુઓ",
    },
  },
  storyWords: {
    saveTheDate: "તારીખ યાદ રાખજો",
    joinUs: "આપ અમારી સાથે જોડાશો ને?",
    welcome: "આપનું આગમન, અમારું સૌભાગ્ય",
    withLove: "બે હાથ જોડી, હૈયે હરખ સાથે આપની રાહ જોઈએ છીએ",
    and: "અને",
  },
  error: {
    title: "કંઈક ગરબડ થઈ ગઈ",
    body: "અમને તેની જાણ થઈ ગઈ છે. ફરી પ્રયત્ન કરો, અને વારંવાર થાય તો થોડી વાર પછી આવજો.",
    retry: "ફરી પ્રયત્ન કરો",
    home: "શુભ ઇન્વિટેશન પર જાઓ",
  },
  notFound: {
    title: "આ પાનું અહીં નથી",
    body: "લિંક કદાચ ખોટી લખાઈ છે, અથવા પાનું બીજે ખસેડાયું છે.",
    home: "શુભ ઇન્વિટેશન પર જાઓ",
    designs: "આમંત્રણ ડિઝાઇન જુઓ",
  },
};
