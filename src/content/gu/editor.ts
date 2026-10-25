import type * as en from "../editor";
import type { Translation } from "@/i18n/text";
import type { LeadId, TaalId } from "@/lib/templates/ids";
import { designNames } from "./design-names";

/* ગુજરાતી: આમંત્રણ એડિટર (/create). English: src/content/editor.ts. Draft for a native proofreader. */

export const editor: Translation<typeof en.editor> = {
  metaTitle: "તમારું આમંત્રણ બનાવો",
  metaDescription: "3D ડિઝાઇન પસંદ કરો, નામ અને પ્રસંગો ઉમેરો, પછી તમારું આમંત્રણ જુઓ.",
  headerLabel: "આમંત્રણ એડિટર",
  opening: "તમારું આમંત્રણ ખૂલી રહ્યું છે…",
  progressLabel: "આમંત્રણની પ્રગતિ",
  progress: (step, total) => `${total} માંથી પગલું ${step}`,
  done: "પૂર્ણ",
  designChosen: "તમારી ડિઝાઇન",
  changeDesign: "ડિઝાઇન બદલો",
  stages: { design: "ડિઝાઇન", details: "તમારી વિગતો", preview: "ઝલક અને મોકલો" },
  sections: {
    label: "તમારી વિગતો, છ ભાગમાં",
    open: (part, summary, state) =>
      `${part}: ${summary}${state === "done" ? ", પૂર્ણ" : state === "check" ? ", એક વાર જોઈ લો" : ""}. ખોલો`,
    done: "પૂર્ણ",
    check: "એક વાર જોઈ લો",
    edit: "બદલો",
    names: (names) => (names.length ? names.join(" અને ") : "નામ ઉમેરો"),
    functions: (names) =>
      names.length === 0
        ? "તમારા પ્રસંગો પસંદ કરો"
        : names.length <= 3
          ? names.join(", ")
          : `${names.slice(0, 2).join(", ")} અને બીજા ${names.length - 2}`,
    family: (filled) => (filled ? "પરિવાર ઉમેર્યો" : "વૈકલ્પિક: માતા-પિતા, આશીર્વાદ અને નિમંત્રક"),
    photos: (photos) =>
      photos === 0 ? "હજુ કોઈ ફોટો નથી" : photos === 1 ? "1 ફોટો" : `${photos} ફોટા`,
    words: (own) => (own ? "તમારા પોતાના શબ્દો" : "તમારા અવસર માટે લખેલા"),
    music: (own, questions) =>
      `${own ? "તમારું પોતાનું સંગીત" : "ડિઝાઇનનું સંગીત"} · ${questions === 0 ? "બીજો કોઈ પ્રશ્ન નહીં" : `${questions} પ્રશ્ન`}`,
  },
  back: "પાછળ",
  next: "આગળ વધો",
  toPreview: "આમંત્રણ જુઓ",
  preview: "આમંત્રણની ઝલક",
  showPreview: "ઝલક",
  previewTitle: "તમારું આમંત્રણ",
  livePreview: "લાઇવ ઝલક, મોટી કરીને જુઓ",
  hideLivePreview: "લાઇવ ઝલક છુપાવો",
  showLivePreview: "લાઇવ ઝલક બતાવો",
  close: "બંધ કરો",
  optional: "વૈકલ્પિક",
  characters: (used, max) => `${max} માંથી ${used} અક્ષર`,
  fixErrors: (count) => (count === 1 ? "એક બાબત પર ધ્યાન આપો" : `${count} બાબતો પર ધ્યાન આપો`),
  errors: {
    required: "કૃપા કરીને આ ભરો",
    "too-long": "કાર્ડ માટે આ બહુ લાંબું છે",
    "no-functions": "ઓછામાં ઓછો એક પ્રસંગ પસંદ કરો",
  },
  save: {
    idle: "ડ્રાફ્ટ આ જ ડિવાઇસ પર સચવાય છે",
    saving: "સાચવી રહ્યા છીએ…",
    saved: "ડ્રાફ્ટ સચવાઈ ગયો",
    unavailable: "આ ડિવાઇસ પર સાચવી શકાતું નથી",
  },
};

export const syncCopy: Translation<typeof en.syncCopy> = {
  idle: "તમારા એકાઉન્ટમાં સચવાય છે",
  syncing: "સાચવી રહ્યા છીએ…",
  synced: "તમારા એકાઉન્ટમાં સચવાઈ ગયું",
  offline: "આ ડિવાઇસ પર સાચવ્યું, ફરી પ્રયત્ન ચાલુ છે",
  "needs-plan": "હજુ લાઇવ નથી: પૅકેજ જોઈએ",
  missing: "આ આમંત્રણ તમારા એકાઉન્ટમાં નથી. કદાચ તે ડિલીટ થઈ ગયું હશે.",
  switchFailed:
    "ખુલ્લું આમંત્રણ સાચવી શકાયું નહીં, તેથી તે જ ખુલ્લું રહે છે. થોડી વારમાં ફરી પ્રયત્ન કરો.",
};

export const stepCopy: Translation<typeof en.stepCopy> = {
  occasion: {
    label: "અવસર",
    eyebrow: "અવસર પસંદ કરો",
    title: "તમે શેની ઉજવણી કરી રહ્યા છો?",
    intro:
      "અવસર પ્રમાણે આમંત્રણ તૈયાર થાય છે: કયા પ્રસંગો, કેવા શબ્દો અને કઈ ડિઝાઇન. પછીથી બદલો તો પણ તમે લખેલું કંઈ જતું નથી.",
  },
  tradition: {
    label: "પરંપરા",
    eyebrow: "પરંપરા પસંદ કરો",
    title: "કાર્ડ કોની પરંપરા પ્રમાણે બને?",
    intro:
      "પરંપરાથી કાર્ડનું શુભ ચિહ્ન, સૌથી ઉપરનું મંગલાચરણ, વિધિઓનાં સ્થાનિક નામ અને પરિવારના શબ્દો નક્કી થાય છે. બધું બદલી શકાય છે, અને આ પગલું છોડી પણ શકો છો.",
  },
  design: {
    label: "ડિઝાઇન",
    eyebrow: "ડિઝાઇન પસંદ કરો",
    title: "મહેમાનો જે ડિઝાઇન ખોલશે તે પસંદ કરો",
    intro:
      "દરેક ડિઝાઇનનું પોતાનું ચિત્ર, પોતાની રીતે ખૂલવાનું અને પોતાનો રાગ છે. ગમે ત્યારે બદલો, તમે લખેલો દરેક શબ્દ સચવાયેલો રહેશે.",
  },
  couple: {
    label: "નામ",
    eyebrow: "નામ",
    title: "કોનાં લગ્ન છે?",
    intro: "કાર્ડની ભાષા પસંદ કરો, પછી નામ લખો. દરેક ડિઝાઇન પર નામ મોટા અક્ષરે આવે છે.",
  },
  family: {
    label: "પરિવાર",
    eyebrow: "પરિવાર",
    title: "મહેમાનોને કોણ આમંત્રણ આપે છે?",
    intro: "માતા-પિતા, આશીર્વાદ અને નિમંત્રક. બધું વૈકલ્પિક છે: જે ભરશો તે પરિવારના પાના પર આવશે.",
  },
  functions: {
    label: "પ્રસંગો",
    eyebrow: "પ્રસંગો",
    title: "બધું ક્યારે અને ક્યાં છે?",
    intro:
      "જે પ્રસંગોમાં મહેમાનોને બોલાવો છો તે પસંદ કરો. કાર્ડ પર મુખ્ય પ્રસંગની તારીખ અને સ્થળ આવે છે; ખોલતાં મહેમાનો દરેક પ્રસંગ જુએ છે.",
  },
  photos: {
    label: "ફોટા",
    eyebrow: "ફોટા",
    title: "તમારા ફોટા ઉમેરો",
    intro:
      "તમારી ડિઝાઇન તેની ફ્રેમમાં જે ફોટા બતાવે છે તે ઉમેરો, અને મહેમાનો જોઈ શકે એ માટે બીજા પણ.",
  },
  words: {
    label: "કાર્ડના શબ્દો",
    eyebrow: "કાર્ડના શબ્દો",
    title: "કાર્ડના શબ્દો વાંચી લો",
    intro:
      "ઉપરના મંગલાચરણથી લઈને દરેક પંક્તિ તમારા અવસર માટે પહેલેથી લખેલી છે. ઇચ્છો તો તમારા પરિવારની રીતે બદલો, અથવા જેમ છે તેમ રહેવા દો.",
  },
  music: {
    label: "સંગીત અને જવાબ",
    eyebrow: "સંગીત અને જવાબ",
    title: "સંગીત અને જવાબ",
    intro: "કાર્ડ ખૂલે ત્યારે વાગતું સંગીત, જવાબમાં શું પૂછવું, અને મહેમાનો કોને ફોન કરી શકે.",
  },
  preview: {
    label: "ઝલક",
    eyebrow: "ઝલક",
    title: "મહેમાનો આ જ જોશે",
    intro: "કાર્ડ ખોલો, સંગીત વગાડો અને એક વાર ફરી વાંચી લો.",
  },
};

export { functionCopy } from "./functions";

export const functionFields: Translation<typeof en.functionFields> = {
  group: "પ્રસંગો",
  date: "તારીખ",
  datePlaceholder: "તારીખ પસંદ કરો",
  time: "શરૂ થવાનો સમય",
  timePlaceholder: "સમય પસંદ કરો",
  venue: "સ્થળ",
  venuePlaceholder: "જેમ કે પિછોલા લેકસાઇડ ગાર્ડન્સ, ઉદયપુર",
  city: "શહેર કે સ્થળ",
  cityPlaceholder: "જેમ કે ઉદયપુર",
  cityHint: "સેવ ધ ડેટ માટે ફક્ત તારીખ અને શહેર જોઈએ. સમય અને સ્થળ આમંત્રણમાં આવશે.",
  suggested: (occasion) => `${occasion} ના પ્રસંગો`,
  more: "વધુ પ્રસંગો",
  moreHint: "મહેમાનોને બોલાવતા હો એવો બીજો કોઈ પ્રસંગ ઉમેરો.",
  showMore: (count) => `બીજા ${count} પ્રસંગો બતાવો`,
  address: "સરનામું",
  addressHint: "મહેમાનોને તે સ્થળના નામની નીચે દેખાશે.",
  pin: "Google Maps પિન",
  pinHint:
    "Google Maps માં સ્થળ ખોલો, Share દબાવો અને લિંક અહીં પેસ્ટ કરો. મહેમાનોને નકશો અને બરાબર એ જ જગ્યા સુધી એક ટૅપમાં રસ્તો મળશે.",
  pinInvalid: "આ Google Maps ની લિંક નથી. Google Maps માં Share માંથી લિંક કૉપિ કરો.",
  parking: "પાર્કિંગ",
  parkingPlaceholder: "મુખ્ય ગેટ પર વૅલે, હૉલની પાછળ મફત પાર્કિંગ",
  dressCode: "ડ્રેસ કોડ",
  dressIdeas: "ડ્રેસ કોડનાં સૂચનો",
  onCard: "કાર્ડ પર",
  endTime: "પૂરો થવાનો સમય",
  endHint: "મોડે સુધી ચાલે તેમ હોય તો ખાલી છોડો.",
  muhuratHint: "શરૂ અને પૂરા થવાનો ચોક્કસ સમય, મિનિટ સુધી, પસંદ કરો. મહેમાનોને બરાબર એવો જ દેખાશે.",
  moreDetails: "વધુ વિગતો",
  moreDetailsHint: "પૂરો થવાનો સમય, સરનામું, નકશાની પિન, પાર્કિંગ અને ડ્રેસ કોડ",
  samePlace: "બીજા પ્રસંગનું જ સ્થળ",
  sameAs: (name: string) => `${name} જેવું જ સ્થળ`,
  placeToEmpty: (count: number) => `આ જ સ્થળ બાકીના ${count} પ્રસંગોમાં ભરો`,
};

export const coupleCopy: Translation<typeof en.coupleCopy> = {
  namesHeading: "નામ",
  slotNames: {
    doorLeft: "ડાબું દ્વાર",
    doorRight: "જમણું દ્વાર",
    blessing: "આશીર્વાદ",
    families: "પરિવારો",
    first: "પહેલું નામ",
    joiner: "નામોની વચ્ચે",
    second: "બીજું નામ",
    line: "આમંત્રણની પંક્તિ",
    date: "તારીખ અને સમય",
    venue: "સ્થળ",
  },
  example: (sample) => `જેમ કે ${sample}`,
  joinerHint: "નામો વચ્ચેનો શબ્દ, જેમ કે &, સંગ કે weds.",
  doorsHint: "દ્વાર પર લખેલા બે નાના શબ્દો.",
  anyScript: "કોઈ પણ લિપિમાં લખો. ગુજરાતી, હિન્દી, તમિલ, બંગાળી અને બીજી બધી કાર્ડ પર આવી જાય છે.",
  latinOnCard: (language) =>
    `તમારું કાર્ડ ${language} માં છે, તેથી મહેમાનો આ નામ અંગ્રેજી અક્ષરોમાં જોશે. નીચે ${language} માં લખેલું નામ પસંદ કરો, અથવા ${language} કીબોર્ડથી ટાઇપ કરો.`,
  spellings: (language) => `${language} અક્ષરોમાં`,
  useSpelling: (name) => `${name} વાપરો`,
  languagesHeading: "કાર્ડની ભાષા",
  languagesHint: "બે ભાષા પસંદ કરો તો મહેમાનો આમંત્રણ પર બંને વચ્ચે બદલી શકે છે.",
  bothLanguages: (main, second) => `${main} અને ${second}`,
  secondHint: (main) => `કોઈ પંક્તિ ખાલી છોડશો તો ${main} કાર્ડના શબ્દો જ આવશે.`,
  ideas: "સૂચનો",
  ideasLabel: (field) => `${field} માટે સૂચનો`,
  useIdea: (text) => `“${text}” વાપરો`,
};

export const languageCopy: Translation<typeof en.languageCopy> = {
  mainHeading: "કાર્ડની ભાષા",
  mainHint: "નામ, શબ્દો, પ્રસંગોનાં નામ અને તારીખો બધું આ જ ભાષામાં આવશે, અને આ બધાં પગલાં પણ.",
  traditionMatch: "તમારી પરંપરાની",
  secondHeading: "બીજી ભાષા પણ ઉમેરવી છે?",
  secondHint:
    "મહેમાનો આમંત્રણ પર બંને ભાષા વચ્ચે બદલી શકશે. આ વૈકલ્પિક છે, અને સેલિબ્રેશન અને ગ્રૅન્ડ પૅકેજમાં મળે છે.",
  secondNone: "ફક્ત એક ભાષા",
};

export const namesCopy: Translation<typeof en.namesCopy> = {
  steps: {
    birthday: { label: "જન્મદિવસ", eyebrow: "જન્મદિવસ", title: "કોનો જન્મદિવસ છે?" },
    anniversary: { label: "જોડી", eyebrow: "જોડી", title: "કોની એનિવર્સરી છે?" },
    party: { label: "પાર્ટી", eyebrow: "પાર્ટી", title: "પાર્ટીનું નામ શું છે?" },
    "baby-shower": { label: "થનારી માતા", eyebrow: "સીમંત", title: "થનારી માતા કોણ છે?" },
    diwali: { label: "દિવાળી", eyebrow: "દિવાળી", title: "તમારી દિવાળી પાર્ટીનું નામ શું છે?" },
    housewarming: { label: "ઘર", eyebrow: "નવું ઘર", title: "નવા ઘરનું નામ શું છે?" },
    puja: { label: "પૂજા", eyebrow: "પૂજા", title: "તમે કઈ પૂજા રાખી રહ્યા છો?" },
    "thread-ceremony": { label: "બટુક", eyebrow: "જનોઈ સંસ્કાર", title: "કોનો જનોઈ સંસ્કાર છે?" },
    annaprashan: { label: "બાળક", eyebrow: "અન્નપ્રાશન", title: "બાળકનું નામ શું છે?" },
    christening: { label: "બાળક", eyebrow: "બાપ્તિસ્મા", title: "બાળકનું નામ શું છે?" },
    "prayer-meet": {
      label: "સ્મૃતિમાં",
      eyebrow: "પ્રાર્થના સભા",
      title: "તમે કોની સ્મૃતિમાં સભા રાખો છો?",
    },
    retirement: {
      label: "નિવૃત્ત",
      eyebrow: "નિવૃત્તિ",
      title: "કોણ નિવૃત્ત થઈ રહ્યા છે?",
    },
    "farewell-party": {
      label: "વિદાય",
      eyebrow: "વિદાય સમારંભ",
      title: "તમે કોને વિદાય આપી રહ્યા છો?",
    },
    "shop-opening": {
      label: "વ્યવસાય",
      eyebrow: "ઉદ્ઘાટન",
      title: "તમારા વ્યવસાયનું નામ શું છે?",
    },
    launch: { label: "ઇવેન્ટ", eyebrow: "લૉન્ચ", title: "તમે શું લૉન્ચ કરી રહ્યા છો?" },
    "ganesh-chaturthi": {
      label: "ગણપતિ",
      eyebrow: "ગણેશ ચતુર્થી",
      title: "તમારા ગણપતિ ઉત્સવનું નામ શું છે?",
    },
    navratri: {
      label: "ઉત્સવ",
      eyebrow: "નવરાત્રિ",
      title: "તમારા નવરાત્રિ ઉત્સવનું નામ શું છે?",
    },
    janmashtami: {
      label: "ઉત્સવ",
      eyebrow: "જન્માષ્ટમી",
      title: "તમારા જન્માષ્ટમી ઉત્સવનું નામ શું છે?",
    },
    onam: { label: "ઉત્સવ", eyebrow: "ઓણમ", title: "તમારા ઓણમ મિલનનું નામ શું છે?" },
    sankranti: {
      label: "ઉત્સવ",
      eyebrow: "ઉત્તરાયણ",
      title: "તમારી ઉત્તરાયણની ઉજવણીનું નામ શું છે?",
    },
    lohri: { label: "ઉત્સવ", eyebrow: "લોહડી", title: "તમારી લોહડીની રાતનું નામ શું છે?" },
    eid: { label: "દાવત", eyebrow: "ઈદ અને ઇફ્તાર", title: "તમારી દાવતનું નામ શું છે?" },
    "naming-ceremony": { label: "બાળક", eyebrow: "નામકરણ", title: "બાળકનું નામ શું છે?" },
    holi: { label: "ઉત્સવ", eyebrow: "હોળી", title: "તમારી હોળી પાર્ટીનું નામ શું છે?" },
    christmas: {
      label: "પાર્ટી",
      eyebrow: "ક્રિસમસ",
      title: "તમારી ક્રિસમસ પાર્ટીનું નામ શું છે?",
    },
    reunion: { label: "સ્નેહમિલન", eyebrow: "સ્નેહમિલન", title: "કઈ બૅચ કે ગ્રુપ મળી રહ્યું છે?" },
    graduation: { label: "ગ્રેજ્યુએટ", eyebrow: "ગ્રેજ્યુએશન", title: "કોનું ગ્રેજ્યુએશન છે?" },
    "gudi-padwa": {
      label: "ઉત્સવ",
      eyebrow: "ગુડી પાડવો અને ઉગાદિ",
      title: "તમારા નવા વર્ષના મિલનનું નામ શું છે?",
    },
    baisakhi: { label: "ઉત્સવ", eyebrow: "વૈશાખી", title: "તમારા વૈશાખી ઉત્સવનું નામ શું છે?" },
    bihu: { label: "ઉત્સવ", eyebrow: "બિહુ", title: "તમારા બિહુ ઉત્સવનું નામ શું છે?" },
    "raksha-bandhan": {
      label: "બહેન અને ભાઈ",
      eyebrow: "રક્ષાબંધન",
      title: "કોનું રક્ષાબંધન છે?",
    },
    "karva-chauth": { label: "જોડી", eyebrow: "કરવા ચોથ", title: "કોણ ઉજવી રહ્યું છે?" },
  },
  one: {
    birthday: { label: "જન્મદિવસવાળાનું નામ", example: "આરવ" },
    party: { label: "પાર્ટીનું નામ", example: "દિવાળીની રાત" },
    "baby-shower": { label: "તેમનું નામ", example: "પ્રિયા" },
    diwali: { label: "પાર્ટીનું નામ", example: "શાહ પરિવારની દિવાળી" },
    housewarming: { label: "ઘર કે પરિવારનું નામ", example: "શાહ નિવાસ" },
    puja: { label: "પૂજાનું નામ", example: "સત્યનારાયણની કથા" },
    "thread-ceremony": { label: "તેનું નામ", example: "આરવ" },
    annaprashan: { label: "બાળકનું નામ", example: "અનાયા" },
    christening: { label: "બાળકનું નામ", example: "એરન" },
    "prayer-meet": { label: "તેમનું નામ", example: "શ્રી આર. કે. શાહ" },
    retirement: { label: "તેમનું નામ", example: "આર. કે. શાહ" },
    "farewell-party": { label: "નામ કે બૅચ", example: "2026ની બૅચ" },
    "shop-opening": { label: "વ્યવસાયનું નામ", example: "શાહ જ્વેલર્સ" },
    launch: { label: "ઇવેન્ટનું નામ", example: "ઓરોરા લૉન્ચ" },
    "ganesh-chaturthi": { label: "ઉત્સવનું નામ", example: "શાહ પરિવારના ગણપતિ" },
    navratri: { label: "ઉત્સવનું નામ", example: "નવરાત્રિ મહોત્સવ" },
    janmashtami: { label: "ઉત્સવનું નામ", example: "કૃષ્ણ જન્મોત્સવ" },
    onam: { label: "ઉત્સવનું નામ", example: "ઓણમ સદ્યા" },
    sankranti: { label: "ઉત્સવનું નામ", example: "પતંગ ઉત્સવ" },
    lohri: { label: "ઉત્સવનું નામ", example: "લોહડીની રાત" },
    eid: { label: "દાવતનું નામ", example: "ઇફ્તાર દાવત" },
    "naming-ceremony": { label: "બાળકનું નામ", example: "અનાયા" },
    holi: { label: "ઉત્સવનું નામ", example: "હોળી મિલન" },
    christmas: { label: "પાર્ટીનું નામ", example: "ક્રિસમસ પાર્ટી" },
    reunion: { label: "બૅચ કે ગ્રુપ", example: "2006ની બૅચ" },
    graduation: { label: "ગ્રેજ્યુએટનું નામ", example: "રિયા" },
    "gudi-padwa": { label: "ઉત્સવનું નામ", example: "ગુડી પાડવાનું ભોજન" },
    baisakhi: { label: "ઉત્સવનું નામ", example: "વૈશાખી મેળો" },
    bihu: { label: "ઉત્સવનું નામ", example: "રોંગાલી બિહુ" },
  },
  oneHint: "આ મુખપૃષ્ઠ પર મોટા અક્ષરે છપાય છે. કોણ બોલાવે છે અને શા માટે, તે નીચેના શબ્દોમાં લખો.",
};

const LEAD_NAMES: Record<LeadId, string> = {
  santoor: "સંતૂર",
  sitar: "સિતાર",
  bansuri: "વાંસળી",
  shehnai: "શરણાઈ",
  veena: "વીણા",
};

const TAAL_NAMES: Record<TaalId, string> = {
  keherwa: "ઢોલક",
  dadra: "ઢોલક",
  garba: "ગરબાનો ઢોલ અને તાળીઓ",
  bhangra: "પંજાબી ઢોલ",
};

export const extrasCopy: Translation<typeof en.extrasCopy> = {
  photosHeading: "ફોટા",
  photosHint: (max) =>
    `${max} સુધી ફોટા. સાચવતાં પહેલાં ફોનમાં જ નાના કરાય છે, જેથી મહેમાનો માટે ઝડપથી ખૂલે.`,
  addPhotos: "ફોટા ઉમેરો",
  dropHere: "અથવા અહીં મૂકો",
  photo: (index) => `ફોટો ${index}`,
  removePhoto: (index) => `ફોટો ${index} કાઢો`,
  moveEarlier: (index) => `ફોટો ${index} આગળ લાવો`,
  full: (max) => `બધા ${max} થઈ ગયા. નવો ઉમેરવા એક કાઢો.`,
  processing: "ફોટા તૈયાર થઈ રહ્યા છે…",
  photoFailed: "આ ફોટો વાંચી શકાયો નહીં. JPEG કે PNG અજમાવો.",
  storageFailed: "આ બ્રાઉઝરમાં ફોટા સાચવી શકાતા નથી, જેમ કે પ્રાઇવેટ મોડમાં.",
  emptyPhotos: "હજુ કોઈ ફોટો નથી",
  emptyPhotosBody: "જોડીના ફોટા અને પ્રી-વેડિંગ શૂટ સૌથી સારા લાગે છે.",
  coupleHeading: "ફોટાનું પાનું",
  coupleHint:
    "તમારો ફોટો થીમની પોતાની ફ્રેમમાં, તમારાં નામ પછીના પાના પર. દરેક થીમની ફ્રેમનો આકાર અલગ છે.",
  coupleLayouts: {
    none: "ફોટાનું પાનું નહીં",
    one: "તમારા બંનેનો એક ફોટો",
    two: "બે ફોટા, બંનેના અલગ-અલગ",
  },
  photoHintOne: "થીમની પોતાની ફ્રેમમાં એક ફોટો, નામ પછીના પાના પર.",
  photoLayoutsOne: {
    none: "ફોટાનું પાનું નહીં",
    one: "એક ફોટો",
  },
  coupleAddFirst: "ઉપર ફોટો ઉમેરો, તે ફ્રેમમાં ગોઠવાઈ જશે.",
  designPhotosHeading: "તમારી ડિઝાઇન માટે ફોટા",
  designPhotosHint: (frames) =>
    frames === 1
      ? "વૈકલ્પિક. તમારો ફોટો ડિઝાઇનની પોતાની ફ્રેમમાં દેખાશે. ફોટા વગર પણ ડિઝાઇન પૂરી લાગે છે."
      : "વૈકલ્પિક. દરેક ફ્રેમ માટે એક ફોટો ઉમેરો, અથવા ઉપર તમારા બંનેનો એક ફોટો પસંદ કરો.",
  framePhotos: {
    together: "તમારા બંનેનો ફોટો",
    one: "તમારો ફોટો",
    of: (name) => `${name} નો ફોટો`,
    first: "પહેલો ફોટો",
    second: "બીજો ફોટો",
  },
  addFramePhoto: (frame) => `ઉમેરો: ${frame}`,
  changeFramePhoto: (frame) => `બદલો: ${frame}`,
  framePhotoAdded: "ઉમેર્યો",
  framePhotoOptional: "વૈકલ્પિક",
  changePhoto: "ફોટો બદલો",
  galleryHeading: "વધુ ફોટા",
  galleryHint: (max) => `વૈકલ્પિક. મહેમાનો આમંત્રણ પર આ ફોટા જોઈ શકશે. કુલ ${max} ફોટા સુધી.`,
  coupleFrame: (index, frames) =>
    frames === 1 ? "ફ્રેમનો ફોટો" : index === 1 ? "પહેલી ફ્રેમ" : "બીજી ફ્રેમ",
  useThisPhoto: (index) => `ફોટો ${index}`,
  fitHeading: "ફોટા ફ્રેમમાં ગોઠવો",
  fitHint: "દરેક ફોટાને ખસેડો, મોટો કરો અને સીધો કરો, જેથી તે ફ્રેમમાં સરસ લાગે.",
  adjust: "ગોઠવો",
  adjustLabel: (frame) => `ફોટો ગોઠવો: ${frame}`,
  adjusted: "ગોઠવ્યો",
  adjustTitle: "ફોટો ગોઠવો",
  adjustDescription:
    "ફોટો ખસેડવા તેને ખેંચો. ઝૂમ કરવા બે આંગળીથી પહોળું કરો, સ્ક્રોલ કરો કે સ્લાઇડર વાપરો.",
  adjustStage: "ફ્રેમમાં ફોટો. ખસેડવા માટે તીરવાળી કી અને ઝૂમ કરવા માટે પ્લસ કે માઇનસ દબાવો.",
  zoom: "ઝૂમ",
  straighten: "સીધો કરો",
  turn: "ફેરવો",
  turnLabel: "ફોટાને જમણી બાજુ પા ભાગ ફેરવો",
  resetPhoto: "પહેલાં જેવું",
  savePhoto: "સાચવો",
  cancelPhoto: "રદ કરો",
  closePhoto: "બંધ કરો",
  musicHeading: "સંગીત",
  musicHint: "કાર્ડ ખૂલે ત્યારે ત્યાં જ રચાતો રાગ, અથવા તમારું પોતાનું ગીત.",
  musicSource: { raga: "રાગ", own: "તમારું સંગીત" },
  chooseSong: "ગીત પસંદ કરો",
  songNote: "MP3 અથવા M4A. ફક્ત એ જ ગીતો જેના ઉપયોગનો તમને અધિકાર છે.",
  readingSong: "તમારું ગીત વંચાઈ રહ્યું છે…",
  songFailed: "આ ફાઇલ વાંચી શકાઈ નહીં. MP3 કે M4A ફાઇલ અજમાવો.",
  clipFailed: "આ બ્રાઉઝરમાં ક્લિપ બની શકી નહીં. Chrome કે Safari અજમાવો.",
  clipStorageFailed: "આ બ્રાઉઝરમાં સંગીત સાચવી શકાતું નથી, જેમ કે પ્રાઇવેટ મોડમાં.",
  waveformLabel: (name) => `${name} નો આકાર, રાખેલો ભાગ ઝળકતો`,
  startAt: "શરૂઆત",
  tooShort: (song, need) =>
    `આ ગીત ${song} નું છે, અને તમારું આમંત્રણ લગભગ ${need} ચાલે છે. લાંબું ગીત પસંદ કરો, જેથી સંગીત ફરી વાગ્યા વગર અંત સુધી ચાલે.`,
  chooseLonger: "બીજું ગીત પસંદ કરો",
  stopPart: "રોકો",
  makingClip: "તમારી ક્લિપ બની રહી છે…",
  cancelTrim: "રદ કરો",
  changeClip: "બદલો",
  removeClip: "કાઢો",
  listenClip: "સાંભળો",
  clipMeta: (length) => `તમારું સંગીત · ${length}`,
  shortNote: (clip, need) =>
    `તમારું આમંત્રણ હવે લગભગ ${need} ચાલે છે, જે આ ${clip} ના ભાગ કરતાં લાંબું છે, તેથી સંગીત વહેલું અટકી જશે. "બદલો" થી ભાગ ફરી પસંદ કરો.`,
  listen: (raga) => `${raga} સાંભળો`,
  stopListening: "સાંભળવાનું બંધ કરો",
  designsOwn: "ડિઝાઇનનું પોતાનું",
  playOnOpen: "મહેમાનો કાર્ડ ખોલે ત્યારે સંગીત વાગે",
  playOnOpenHint: "મહેમાનો ગમે ત્યારે રોકી શકે છે.",
  pacing: {
    heading: "દરેક પાનાનો સમય",
    hint: "સંગીત અને રીલ તમારાં પાનાં જેટલાં લાંબાં ચાલે છે. ઑટોમાં દરેક પાનાને તેના શબ્દો જેટલો સમય મળે છે.",
    auto: "ઑટો",
    seconds: (n: number) => `${n} સે.`,
    summary: (pages: number, live: number, reel: number) =>
      `${pages} પાનાં: આમંત્રણ પર લગભગ ${live} સેકન્ડ સંગીત, અને ${reel} સેકન્ડની રીલ.`,
  },
  questionsHeading: "મહેમાનોને પ્રશ્નો",
  questionsHint:
    "દરેક જવાબમાં દરેક પ્રસંગમાં કોણ આવે છે તે હોય છે, અને સાથે એક સંદેશ પણ. બીજું જે જાણવું હોય તેના પર ટિક કરો.",
  questionHints: {
    meal: "શાકાહારી, જૈન, માંસાહારી કે વીગન",
    arrival: "જે દિવસે તેઓ શહેરમાં પહોંચશે",
    stay: "તેમને રૂમ જોઈએ છે કે નહીં",
    pickup: "તેમને સ્ટેશન કે એરપોર્ટથી લેવા જવાનું છે કે નહીં",
    song: "તેમને સાંભળવું ગમે એવું કોઈ ગીત",
  },
  ragaNames: {
    yaman: "રાગ યમન",
    khamaj: "રાગ ખમાજ",
    bihag: "રાગ બિહાગ",
    desh: "રાગ દેશ",
    bhupali: "રાગ ભૂપાલી",
    madhyamavati: "રાગ મધ્યમાવતી",
    mand: "રાગ માંડ",
    bhimpalasi: "રાગ ભીમપલાસી",
    pilu: "રાગ પીલુ",
    bhairavi: "રાગ ભૈરવી",
    hamsadhwani: "રાગ હંસધ્વનિ",
    kafi: "રાગ કાફી",
  },
  ragaSound: (sound, mood) =>
    `${LEAD_NAMES[sound.lead]}${sound.taal ? ` અને ${TAAL_NAMES[sound.taal]}` : ""} · ${mood}`,
  ragaMoods: {
    yaman: "સાંજનો, પ્રેમભર્યો",
    khamaj: "હળવો અને કોમળ",
    bihag: "મોડી સાંજનો, લગ્નનો રાગ",
    desh: "ચોમાસાનો, ઉત્સવી",
    bhupali: "ઉજળો અને આનંદમય",
    madhyamavati: "શુભ, કર્ણાટકી સંગીત",
    mand: "રાજસ્થાની લોક, શાહી",
    bhimpalasi: "બપોરનો, ભક્તિભર્યો",
    pilu: "લોકરંગી અને ચંચળ",
    bhairavi: "કોમળ, વિદાયનો રાગ",
    hamsadhwani: "શુભ, ગણપતિ વંદના",
    kafi: "ઉત્સવી લોક, હોળીના રંગ",
  },
};

export const faithCopy: Translation<typeof en.faithCopy> = {
  heading: "તમારી આસ્થા પ્રમાણે શબ્દો",
  intro: "નીચે સૂચવેલા આશીર્વાદ, પંક્તિઓ અને દ્વારના શબ્દો તેના પ્રમાણે છે. બધું તમે બદલી શકો છો.",
  label: "આસ્થા",
  names: {
    hindu: "હિન્દુ",
    sikh: "શીખ",
    muslim: "મુસ્લિમ",
    christian: "ખ્રિસ્તી",
    jain: "જૈન",
    none: "ધાર્મિક પંક્તિઓ નહીં",
  },
  doorIdeas: "દ્વારના શબ્દો",
  doorIdea: (left, right) => `“${left}” અને “${right}” વાપરો`,
};

export const traditionCopy: Translation<typeof en.traditionCopy> = {
  group: "પરંપરાઓ",
  none: "કોઈ પરંપરા નહીં",
  noneHint: "ડિઝાઇનના પોતાના શબ્દો, કોઈ ચિહ્ન નહીં",
  nearYou: "તમારા વિસ્તારની",
  draftNote:
    "આ પરંપરાઓ હજુ શરૂઆતના ડ્રાફ્ટ છે. દરેક સમાજના લોકો લૉન્ચ પહેલાં શબ્દો, ચિહ્નો અને વિધિઓનાં નામ તપાસી રહ્યા છે, તેથી કંઈ બરાબર ન લાગે તો અમને જરૂર જણાવો.",
  names: {
    "north-hindu": "ઉત્તર ભારતીય હિન્દુ",
    rajasthani: "રાજસ્થાની અને મારવાડી",
    marathi: "મરાઠી",
    gujarati: "ગુજરાતી",
    bengali: "બંગાળી હિન્દુ",
    tamil: "તમિલ હિન્દુ",
    modern: "આધુનિક",
  },
  hints: {
    "north-hindu": "શ્રી ગણેશાય નમઃ, દર્શનાભિલાષી અને સ્વાગતોત્સુક",
    rajasthani: "શ્રી ગણેશાય નમઃ, પીઠી અને મહિલા સંગીત",
    marathi: "શ્રી ગણેશાય નમઃ, સાખરપુડા અને હળદ",
    gujarati: "કંકોતરીના શબ્દો, ગોળધાણા, પીઠી અને બાળકોનો ટહુકો",
    bengali: "પ્રજાપતયે નમઃ, ગાયે હલુદ અને બૌ ભાત",
    tamil: "પિલ્લૈયાર સુળિ, નિચ્ચયતાર્થમ અને વરવેર્પુ",
    modern: "કોઈ ધાર્મિક ચિહ્ન નહીં, કોઈ પણ જોડી કે આંતરધર્મીય લગ્ન માટે",
  },
  elements: "શુભ ચિહ્ન અને મંગલાચરણ",
  elementsIntro: (tradition: string) =>
    `કાર્ડનો સૌથી ઉપરનો ભાગ, તમારી ${tradition} પરંપરા પ્રમાણે. ઇચ્છો તો બદલો કે કાઢી નાખો.`,
  elementsLater: "શુભ ચિહ્ન અને મંગલાચરણ, જેમ કે શ્રી ગણેશાય નમઃ, તમે કાર્ડના શબ્દોમાં પસંદ કરશો.",
  symbol: "કાર્ડની ઉપર શુભ ચિહ્ન",
  symbolNames: {
    om: "ૐ",
    kalash: "મંગળ કળશ",
    swastik: "સ્વસ્તિક",
    diya: "દીવો",
    prajapati: "પ્રજાપતિ",
    suzhi: "પિલ્લૈયાર સુળિ",
    shri: "શ્રી",
    shankh: "શંખ",
    kamal: "કમળ",
    "ik-onkar": "ઇક ઓંકાર",
    khanda: "ખંડા",
    "chand-tara": "ચાંદ-તારો",
    "786": "786",
    bismillah: "બિસ્મિલ્લાહ",
    cross: "ક્રૉસ",
    dove: "કબૂતર",
    jain: "જૈન પ્રતીક",
  },
  noSymbol: "કોઈ ચિહ્ન નહીં",
  symbolIntro: "તમારા કાર્ડમાં સૌથી ઉપર, દરેક શબ્દની ઉપર. કોઈ એક પસંદ કરો અથવા રહેવા દો.",
  symbolNote:
    "ગણેશજી અને બીજા ચિત્રિત દેવતા આમંત્રણ ખૂલતી વખતે આશીર્વાદ આપી શકે છે: ડિઝાઇન સાથે 'આમંત્રણ કેવી રીતે ખૂલે' માં પસંદ કરો.",
  invocation: "મંગલાચરણ",
  invocationModes: { script: "પોતાની લિપિમાં", latin: "અંગ્રેજી અક્ષરોમાં", off: "ન બતાવો" },
  meanings: {
    "Shri Ganeshaya Namah": "ભગવાન ગણેશને નમન",
    "Prajapataye Namah": "લગ્નના દેવ પ્રજાપતિને નમન",
    "Sri Vinayagar Thunai": "ભગવાન વિનાયકની કૃપાથી",
  },
  wording: "પરિવારના શબ્દો",
  wordingIntro: "મહેમાનો કાર્ડની નીચે આ વાંચશે. કોઈ પણ ખાલી છોડી શકો છો.",
  wordingLabels: {
    blessingsFrom: "શુભાશિષ",
    requesters: "નિમંત્રક",
    welcome: "સ્વાગતોત્સુક",
    children: "બાળકોનો ટહુકો",
  },
};

export const designCopy: Translation<typeof en.designCopy> = designNames.cards;

export const occasionCopy: Translation<typeof en.occasionCopy> = {
  group: "અવસર",
  setsUp: "આ શું તૈયાર કરે છે",
  planned: "નક્કી પ્રસંગો",
  questions: "મહેમાનોને પૂછાશે",
  noQuestions: "બસ એટલું કે તેઓ આવે છે કે નહીં અને કેટલા લોકો",
  designs: (count) => `${count} સૂચવેલી ડિઝાઇન`,
  suggestedBadge: "સૂચવેલી",
  suggestedFor: (occasion) => `${occasion} માટે સૂચવેલી`,
  moreDesigns: "વધુ ડિઝાઇન",
};

export const previewCopy: Translation<typeof en.previewCopy> = {
  ready: "તમારું આમંત્રણ તૈયાર છે",
  live: "તમારું આમંત્રણ લાઇવ છે",
  liveBody: (link) => `મહેમાનો તેને ${link} પર ખોલે છે. અહીં કરેલા ફેરફાર ત્યાં તરત દેખાય છે.`,
  readyBody:
    "તે આ જ ડિવાઇસ પર સચવાયેલું છે. તેને તમારા એકાઉન્ટમાં રાખવા અને પ્રકાશિત કરવા સાઇન ઇન કરો, પછી લિંક WhatsApp પર મોકલો.",
  readyBodyAccount:
    "તે ફોટા સહિત તમારા એકાઉન્ટમાં સચવાયેલું છે. પહેલાં તેને મહેમાનોની નજરે જુઓ, પછી લિંક મેળવવા પ્રકાશિત કરો.",
  seeAsGuest: "મહેમાનોની નજરે જુઓ",
  watchVideo: "વીડિયો તરીકે જુઓ",
  seeAsGuestBody: "આખું આમંત્રણ, આખી સ્ક્રીન પર: ખૂલવાનું, સંગીત, દરેક પાનું અને જવાબનું ફૉર્મ.",
  familyTitle: "પહેલાં પરિવારને બતાવો",
  familyBody:
    "તપાસવા માટે તેમને WhatsApp પર એક ઝલક મોકલો. દરેક સ્ક્રીન પર ‘ઝલક’ લખેલું રહે છે અને જવાબ બંધ રહે છે, તેથી તે આમંત્રણની જગ્યાએ મોકલી શકાતી નથી. તમે મોકલો ત્યારે મહેમાનોને સ્વચ્છ આમંત્રણ મળે છે.",
  familySend: "પરિવારને WhatsApp પર મોકલો",
  familyCopy: "લિંક કૉપિ કરો",
  familyCopied: "લિંક કૉપિ થઈ ગઈ",
  familyFailed: "હમણાં લિંક બની નહીં. થોડી વારમાં ફરી પ્રયત્ન કરો.",
  familySignInBody:
    "સાઇન ઇન કરો, અમે ઝલકની લિંક બનાવી આપીશું જે તમે પરિવારને WhatsApp પર મોકલી શકો.",
  familySignIn: "મોકલવા માટે સાઇન ઇન કરો",
  familyMessage: (url) =>
    `અમારા આમંત્રણની એક ઝલક. જોઈને કહો કેવું લાગ્યું, પછી અમે તે મોકલીશું: ${url}`,
  notReady: "થોડી વિગતો બાકી છે",
  fix: (label) => `${label} પૂરું કરો`,
  occasionHeading: "અવસર",
  namesHeading: "નામ",
  functionsHeading: "પ્રસંગો",
  photosHeading: "ફોટા",
  noPhotos: "કોઈ ફોટો ઉમેર્યો નથી",
  musicHeading: "સંગીત",
  playsOnOpen: "મહેમાનો કાર્ડ ખોલે ત્યારે વાગે છે",
  dressCode: "ડ્રેસ કોડ",
  edit: "બદલો",
  editStep: (label) => `${label} બદલો`,
  startOver: "નવું આમંત્રણ શરૂ કરો",
  startOverTitle: "નવું આમંત્રણ શરૂ કરવું છે?",
  startOverBody: "આનાથી આ ડિવાઇસ પર સાચવેલાં નામ, પ્રસંગો અને ફોટા ભૂંસાઈ જશે.",
  startOverConfirm: "ભૂંસીને નવેસરથી શરૂ કરો",
  startOverKeepBody:
    "આ આમંત્રણ મારાં આમંત્રણોમાં રહેશે, તમે ગમે ત્યારે પાછા આવી શકો છો. નવું આમંત્રણ ખાલી શરૂ થશે.",
  startOverKeepConfirm: "નવું આમંત્રણ શરૂ કરો",
  cancel: "આ જ આમંત્રણ રાખો",
  cleared: "નવું આમંત્રણ શરૂ થયું",
};

export const suiteCopy: Translation<typeof en.suiteCopy> = {
  heading: "તમારા અવસર માટે ડિઝાઇન",
  moreDesigns: (count) => `બીજી ${count} ડિઝાઇન બતાવો`,
  textBox: "શબ્દો પાછળ ચોકઠું",
  textBoxHint:
    "બંધ હોય ત્યારે શબ્દો સીધા ચિત્ર પર દેખાય છે. ચાલુ કરો તો તે કાર્ડના રંગના આછા ચોકઠામાં દેખાય છે. સરખામણી માટે પાનાં ચલાવો; આ જ બટન પાનાં પર પણ છે.",
  blessingPage: "આશીર્વાદના પાનાથી શરૂ કરો",
  blessingPageHint:
    "આ થીમ ભગવાનના ચિત્ર અને તેની નીચે તમારા આશીર્વાદથી શરૂ થાય છે, તમારાં નામ પહેલાં.",
  names: designNames.names,
  descriptions: designNames.descriptions,
};

export const studioCopy: Translation<typeof en.studioCopy> = {
  pagesHint: "તમે જે પાનું ભરો છો તે લખતાં લખતાં અહીં દેખાય છે.",
  pageNames: {
    blessing: "આશીર્વાદ",
    cover: "મુખપૃષ્ઠ",
    couple: "ફોટો",
    family: "પરિવાર",
    "family-more": "પરિવાર, આગળ",
    "family-end": "પરિવાર, છેલ્લે",
    invite: "આમંત્રણ",
    reply: "જવાબ",
  },
  pageList: "આમંત્રણનાં પાનાં",
  showPage: (name) => `${name} નું પાનું બતાવો`,
  phone: (name) => `${name} નું પાનું, મહેમાનો જોશે તેમ`,
  lettering: "અક્ષરો",
  letteringIntro:
    "દરેક પાના પર શબ્દો કેવા દેખાય તે પસંદ કરો. ફક્ત એ જ ફૉન્ટ દેખાય છે જે તમારા કાર્ડની ભાષા લખી શકે.",
  namesFont: "નામ",
  wordsFont: "બાકીના શબ્દો",
  themeFont: "થીમનો પોતાનો",
  size: "કદ",
  sizes: { small: "નાનું", medium: "મધ્યમ", large: "મોટું" },
  style: "નામની શૈલી",
  bold: "ઘાટા",
  italic: "ત્રાંસા",
  capitals: "કૅપિટલ અક્ષરો",
  colour: "નામનો રંગ",
  colours: {
    theme: "થીમનો પોતાનો",
    maroon: "મરૂન",
    gold: "સોનેરી",
    saffron: "કેસરી",
    ink: "શાહી",
    ivory: "આઇવરી",
  },
  feels: {
    classic: "પરંપરાગત",
    script: "વહેતા",
    bold: "ઘાટા",
    clean: "સાદા",
    handwritten: "હાથે લખેલા",
  },
  reset: "થીમના અક્ષરો પાછા લાવો",
};

export const familyCopy: Translation<typeof en.familyCopy> = {
  sideHeading: (name) => `${name} નો પરિવાર`,
  sideFallback: { first: "પહેલો પરિવાર", second: "બીજો પરિવાર" },
  relation: "કાર્ડ પર આમ છપાશે",
  relations: { child: "સંતાન", daughter: "સુપુત્રી", son: "સુપુત્ર" },
  parents: "માતા-પિતાનાં નામ",
  parentsExample: "શ્રીમતી સુનીતાબેન તથા શ્રી રમેશભાઈ પટેલ",
  parentsHint: "જેમ છપાવવું હોય તેમ લખો, શ્રી, શ્રીમતી કે સ્વ. સાથે.",
  town: "વતન",
  townExample: "અમદાવાદ",
  more: "આશીર્વાદ અને નિમંત્રક",
  examples: {
    blessingsFrom: "શ્રીમતી કમળાબેન તથા શ્રી રામપ્રસાદ શર્મા",
    requesters: "સમસ્ત શર્મા પરિવાર",
    welcome: "રાહુલ, પ્રિયા અને અંકિત",
    children: "મારા કાકાના લગ્નમાં જરૂર આવજો!",
  },
  memory: "પુણ્ય સ્મૃતિ",
  memoryExample: "સ્વ. શ્રી મોહનલાલ પટેલ",
  memoryHint: "સ્વર્ગસ્થ સ્વજનો, જેમના આશીર્વાદ પરિવાર યાદ કરે છે.",
  contacts: "મહેમાનો કોને ફોન કરી શકે",
  contactName: "નામ",
  contactNameExample: "રમેશ પટેલ",
  phone: "ફોન",
  addContact: "નંબર ઉમેરો",
  removeContact: (n) => `નંબર ${n} કાઢો`,
};

export const pageWordsCopy: Translation<typeof en.pageWordsCopy> = {
  open: "આ પાનું બદલો",
  title: (page) => `${page} નું પાનું`,
  description:
    "કોઈ પણ પંક્તિ બદલો, તમારી પોતાની ઉમેરો, અને શબ્દો ચિત્ર પર ક્યાં દેખાય તે પસંદ કરો.",
  close: "થઈ ગયું",
  words: "શબ્દો",
  line: (n) => `પંક્તિ ${n}`,
  kind: (n) => `પંક્તિ ${n} નો પ્રકાર`,
  kinds: {
    label: "નાનું મથાળું",
    script: "આશીર્વચન",
    display: "મોટું",
    date: "તારીખ",
    venue: "સ્થળ",
    body: "લખાણ",
    small: "નાના અક્ષર",
  },
  up: (n) => `પંક્તિ ${n} ઉપર લો`,
  down: (n) => `પંક્તિ ${n} નીચે લો`,
  remove: (n) => `પંક્તિ ${n} કાઢો`,
  add: "પંક્તિ ઉમેરો",
  reset: "સૂચવેલા શબ્દો પાછા લાવો",
  own: "આ પાનું તમે જાતે લખ્યું છે. પછીથી બદલેલાં નામ, તારીખ કે સ્થળ અહીં ત્યારે જ દેખાશે જ્યારે તમે સૂચવેલા શબ્દો પાછા લાવશો.",
  inLanguage: (language) => `આ શબ્દો ${language} કાર્ડ માટે છે.`,
  overflow: "આ ચિત્ર માટે શબ્દો બહુ વધારે છે, સૌથી નાના કદમાં પણ. કોઈ પંક્તિ ટૂંકી કરો કે કાઢો.",
  placement: "ગોઠવણી",
  place: "સ્થાન",
  places: { top: "ઉપર", middle: "વચ્ચે", bottom: "નીચે" },
  align: "સંરેખણ",
  aligns: { center: "વચ્ચે", start: "ડાબી બાજુ" },
  box: "શબ્દો પાછળ ચોકઠું",
  boxes: { theme: "બીજાં પાનાં જેવું", on: "ચોકઠું", off: "ચિત્ર પર છાપેલું" },
  hide: "આ પાનું ન બતાવો",
  hideHint: "મહેમાનોને નહીં દેખાય. ગમે ત્યારે ફરી ચાલુ કરો.",
  hidden: "છુપાવેલું",
};

export const aiCopy: Translation<typeof en.aiCopy> = {
  open: "AI થી લખાવો",
  title: "AI થી શબ્દો લખાવો",
  description:
    "AI તમારાં નામ, પરિવાર અને પ્રસંગો પરથી કાર્ડની ભાષામાં પાનાં લખે છે. પછીથી કંઈ પણ બદલો.",
  close: "બંધ કરો",
  tone: "અંદાજ",
  tones: { traditional: "પરંપરાગત", warm: "આત્મીય", fun: "મજાનો" },
  scope: "પાનાં",
  scopes: { all: "બધાં પાનાં", page: (page) => `ફક્ત ${page} નું પાનું` },
  write: "લખો",
  again: "ફરી લખો",
  shorten: "AI થી ટૂંકું કરો",
  busy: "લખાઈ રહ્યું છે…",
  done: "લખાઈ ગયું. શબ્દો બદલવા કોઈ પણ પાનું ખોલો.",
  left: (n) =>
    n === 1 ? "આ આમંત્રણ પર 1 મફત ડ્રાફ્ટ બાકી છે." : `આ આમંત્રણ પર ${n} મફત ડ્રાફ્ટ બાકી છે.`,
  languages: (language) =>
    `${language} કાર્ડ માટે લખ્યું છે. બીજી ભાષા માટે ઉપર કાર્ડની ભાષા બદલો.`,
  errors: {
    "sign-in": "સાઇન ઇન કરો જેથી આમંત્રણ સચવાય, પછી AI તેના માટે લખી શકશે.",
    off: "AI થી લખાવવાનું હજુ ચાલુ થયું નથી.",
    "not-found": "સાઇન ઇન કરો જેથી આમંત્રણ સચવાય, પછી AI તેના માટે લખી શકશે.",
    "used-up": "આ આમંત્રણના 3 મફત ડ્રાફ્ટ વપરાઈ ગયા. કોઈ પણ પૅકેજમાં ગમે તેટલી વાર લખાવો.",
    failed: "હમણાં શબ્દો લખી શકાયા નહીં. ફરી પ્રયત્ન કરો.",
  },
};

export const openingCopy: Translation<typeof en.openingCopy> = {
  heading: "ખૂલતો દરવાજો (કવર સ્ક્રીન)",
  intro:
    "લિંક ખોલતાં જ મહેમાનો સૌથી પહેલાં આ જોશે: એક દ્વાર, દરવાજા, પડદો કે કવર, જે આખી સ્ક્રીન પર ખૂલીને તમારું આમંત્રણ બતાવે છે. ખૂલતું જોવા માટે કોઈ એક પર ટૅપ કરો. તમે તેને ક્યારેય પણ બદલી શકો છો, મોકલ્યા પછી પણ.",
  filterLabel: "પ્રકાર મુજબ જુઓ",
  filterAll: "બધા",
  summaryBody: "આમંત્રણ ખૂલે તે પહેલાં મહેમાનો સૌથી પહેલાં આ જુએ છે.",
  change: "દરવાજો બદલો",
  dialogTitle: "તમારો ખૂલતો દરવાજો પસંદ કરો",
  dialogBody:
    "તમારી પસંદગી તરત સચવાય છે. મહેમાનોનું પ્રીવ્યૂ, વીડિયો અને તમારી લાઇવ લિંક, બધું આનાથી જ ખૂલશે.",
  done: "થઈ ગયું",
  styles: {
    "jaali-vriksh": {
      name: "જીવનવૃક્ષની જાળી",
      description: "કોતરેલી રેતિયા પથ્થરની જાળીમાંથી ઊડીને મહેલના બાગમાં.",
    },
    pachchikari: {
      name: "પથ્થરનાં ફૂલ",
      description: "જડેલાં પથ્થરનાં ફૂલ ઉપસે છે અને આરસ નીચે સરકી જાય છે.",
    },
    "chik-baradari": {
      name: "નેતરની ચિક",
      description: "વણેલી નેતરની ચિક ઉપર વીંટાય છે અને ચાંદની મંડપ દેખાય છે.",
    },
    "baori-deep": {
      name: "દીવાની વાવ",
      description: "દીવાથી ઝળહળતી વાવમાં નીચે ઊતરો.",
    },
    "ikat-dhaaga": {
      name: "ઇકતના દોરા",
      description: "ઇકત રેશમ દોરે દોરે ખૂલી જાય છે.",
    },
    "olai-chuvadi": {
      name: "તાડપત્રનાં પાનાં",
      description: "તાડપત્રનાં પાનાં બંને બાજુ સરકી જાય છે.",
    },
    "konark-chakra": {
      name: "કોણાર્ક ચક્ર",
      description: "કોતરેલું પથ્થરનું પૈડું રેતી પર દૂર ગબડી જાય છે.",
    },
    "mandvi-dhow": {
      name: "ઊતરતો સઢ",
      description: "થીગડાંવાળો સઢ ગડીઓમાં વહાણવાડા પર ઊતરે છે.",
    },
    shekhawati: {
      name: "સોનેરી ખરોચ",
      description: "સોનેરી વરખ ખરી જાય છે અને રંગેલી હવેલી દેખાય છે.",
    },
    lehar: {
      name: "રેતી પર લહેર",
      description: "લહેર રેતી ધોઈ નાખે છે અને લગૂન દેખાય છે.",
    },
    "naksha-pangong": {
      name: "વળતો નકશો",
      description: "જૂનો નકશો વળીને પહાડી સરોવર પર ઊતરે છે.",
    },
    "toran-mala": {
      name: "ખરતાં તોરણ",
      description: "આંબાનાં પાનનાં તોરણ એક પછી એક ખરે છે.",
    },
    jhilmil: {
      name: "મિરર બૉલ",
      description: "મિરર બૉલ હૉલને ટપકે ટપકે ઝળહળાવે છે.",
    },
    "howrah-tareekh": {
      name: "કૅલેન્ડરનાં પાનાં",
      description: "કૅલેન્ડરનાં પાનાં ઊડીને એ દિવસ સુધી પહોંચે છે.",
    },
    "barf-khidki": {
      name: "ઝાકળવાળી બારી",
      description: "કાચ પરથી ઝાકળ લૂછાય છે અને ઓગળી જાય છે.",
    },
    "pondy-gali": {
      name: "સ્લાઇડિંગ પઝલ",
      description: "પઝલના ટુકડા ઊંચકાય છે અને બોગનવેલવાળી ગલી દેખાય છે.",
    },
    "irani-carrom": {
      name: "કૅરમ બોર્ડ",
      description: "કૅરમ બોર્ડ પાછળ નમે છે અને સરકી જાય છે.",
    },
    channapatna: {
      name: "રમકડાના બ્લૉક",
      description: "લાકડાના રમકડાના બ્લૉકની દીવાલ ગબડી પડે છે.",
    },
    "ped-ghar": {
      name: "રંગ પૂરવા",
      description: "પેન્સિલ ચિત્રમાં રંગ પુરાય છે.",
    },
    "jhalar-palna": {
      name: "પારણાનો ચંદરવો",
      description: "લેસનો ચંદરવો પોટલીની જેમ ઉપર ખેંચાય છે.",
    },
    "rajwada-pol": {
      name: "રાજસ્થાની મહેલનો દરવાજો",
      description:
        "ગુલાબી પથ્થરની કમાનમાં કોતરેલા સાગના દરવાજા ખૂલે છે અને દીવાવાળું આંગણું દેખાય છે.",
    },
    "gopuram-kadhavu": {
      name: "દક્ષિણ ભારતીય મંદિરના દરવાજા",
      description: "પિત્તળના ખીલા અને ઘંટડીઓવાળા દરવાજા દીવાથી ઝળહળતા મંડપમ પર ખૂલે છે.",
    },
    "noor-darwaza": {
      name: "મુઘલ આરસનો દરવાજો",
      description: "આરસની કમાનમાં ચાંદીની જાળીના દરવાજા ફુવારાવાળા ચાંદની બાગ પર ખૂલે છે.",
    },
    "phoolon-ki-deewar": {
      name: "ફૂલોની દીવાલ",
      description: "ગુલાબ અને ગલગોટાની દીવાલ ખસે છે અને ઝગમગતી લાઇટ નીચે મંડપ દેખાય છે.",
    },
    "haveli-kiwad": {
      name: "હવેલીનાં બારણાં",
      description: "આભલાંવાળાં રંગેલાં ગુજરાતી બારણાં હીંચકાવાળા આંગણા પર ખૂલે છે.",
    },
    "shahi-parda": {
      name: "શાહી પડદા",
      description: "મરૂન અને સોનેરી મખમલના પડદા બાજુએ ખસે છે અને ઝુમ્મરથી ઝળહળતો હૉલ દેખાય છે.",
    },
    "deco-gates": {
      name: "આર્ટ ડેકો દરવાજા",
      description: "કાળા અને પિત્તળના દરવાજા ખૂલે છે અને શહેર ઉપર અગાસી પાર્ટી દેખાય છે.",
    },
    "bagiya-gate": {
      name: "ગુલાબ બાગનો દરવાજો",
      description: "ગુલાબથી વીંટળાયેલા સફેદ લોખંડના દરવાજા ફાનસથી ઝળહળતા બાગ પર ખૂલે છે.",
    },
    "mela-tamboo": {
      name: "મેળાનો તંબૂ",
      description: "પટ્ટાવાળા તંબૂના પડદા ઊંચકાય છે અને ફુગ્ગા, ચકડોળ અને મોટી કેક દેખાય છે.",
    },
    "chaand-dwar": {
      name: "ચાંદની બાગનાં બારણાં",
      description: "બીજના ચાંદ અને તારાવાળાં સીપનાં બારણાં ચાંદનીમાં હોજવાળા બાગ પર ખૂલે છે.",
    },
    "ritu-dwar": {
      name: "આંગણાનાં બારણાં",
      description:
        "દરેક ઋતુ માટે એક પાન કોતરેલાં જૂનાં ટેરાકોટા-લીલાં બારણાં ખીલેલા ઝાડ પર ખૂલે છે.",
    },
    "raag-dwar": {
      name: "સંગીતખંડનાં બારણાં",
      description: "લાજવર્દી અને સોનેરી રંગેલાં બારણાં પરોઢે વીણાવાળી મહેલની અગાસી પર ખૂલે છે.",
    },
    "van-dwar": {
      name: "વનનું બારણું",
      description: "ગૂંથેલી ડાળીઓ અને પાનનાં બારણાં વાર્તાના વનમાં જતા શેવાળવાળા રસ્તા પર ખૂલે છે.",
    },
    "patang-dwar": {
      name: "અગાસીનાં બારણાં",
      description: "પતંગ ચીતરેલાં ચટક ફિરોઝી બારણાં પરોઢની અગાસીઓ પર ખૂલે છે.",
    },
    "kumhar-dwar": {
      name: "કુંભારવાડાનાં બારણાં",
      description: "ટેરાકોટાની ટાઇલ્સવાળાં ગળી રંગનાં બારણાં સેંકડો દીવાથી ઝળહળતી ગલી પર ખૂલે છે.",
    },
    "karghaa-dwar": {
      name: "વણકરના ઘરનાં બારણાં",
      description: "લાલ રેશમ અને સોનેરી જરીમાં વીંટળાયેલાં બારણાં વણકરોના આંગણા પર ખૂલે છે.",
    },
    "navrang-dwar": {
      name: "નવ રંગનાં બારણાં",
      description: "રંગીન કાચના નવ પટ્ટાવાળાં સફેદ બારણાં ગુલાબના મંડપ પર ખૂલે છે.",
    },
    "ghat-dwar": {
      name: "નદીઘાટનાં બારણાં",
      description: "લહેરો અને માછલીઓ કોતરેલાં ઘેરા ફિરોઝી બારણાં પરોઢે હિમનદીના ઝરણા પર ખૂલે છે.",
    },
    "rekha-dwar": {
      name: "એક રેખાનાં બારણાં",
      description: "એક સોનેરી રેખામાં દોરેલાં આઇવરી કાગળનાં બારણાં કમળ પરના સૂર્યોદય પર ખૂલે છે.",
    },
    "naqsha-pat": {
      name: "જડતરવાળા મહેલ દ્વાર",
      description:
        "સોનેરી રેખાના મહેલથી જડેલા હાથીદાંતી દ્વાર ખૂલે છે અને સાંજે તળાવનો મહેલ દેખાય છે.",
    },
    "kinkhab-parda": {
      name: "કિનખાબના પડદા",
      description:
        "સોનેરી વણાટવાળા વાઇન રંગના પડદા બાજુએ સરકે છે અને દીવાથી ઝળહળતો મહેલનો ખંડ દેખાય છે.",
    },
    "taad-patta-dwar": {
      name: "તાડપત્રની જાળીઓ",
      description: "વણેલી તાડપત્રની જાળીઓ ખસે છે અને સૂર્યાસ્તે કમળના લગૂન પરનો વિલા દેખાય છે.",
    },
    "pichwai-pat": {
      name: "પિછવાઈના પડદા",
      description:
        "કમળ અને ગાયોથી ચીતરેલા પિછવાઈના પડદા બાજુએ થાય છે અને ચાંદનીમાં કમળનું તળાવ દેખાય છે.",
    },
    "chandi-kiwad": {
      name: "ચાંદીનાં કમાડ",
      description: "ઉપસાવેલી ભાતનાં ચાંદીનાં કમાડ ખૂલે છે અને તળાવ પર ઝળહળતો મહેલ દેખાય છે.",
    },
    "swarg-kiwad": {
      name: "વાદળોનાં કમાડ",
      description:
        "વાદળોની કોતરણીવાળાં સફેદ આરસનાં કમાડ ખૂલે છે અને સોનેરી વાદળો પર તરતો મંડપ દેખાય છે.",
    },
    "firoza-darwaza": {
      name: "ફિરોઝી દરવાજો",
      description: "ફિરોઝી તારાથી જડેલાં અખરોટનાં કમાડ ખૂલે છે અને લાંબા જળકુંડવાળો બાગ દેખાય છે.",
    },
    "jharokha-pat": {
      name: "રંગીન કાચના ઝરૂખા",
      description: "રંગીન કાચ જડેલાં ગુલાબી પટ ખૂલે છે અને સૂર્યાસ્તે ઝરૂખાનો મહેલ દેખાય છે.",
    },
    "hina-kiwad": {
      name: "મહેંદી ચીતરેલાં કમાડ",
      description:
        "મહેંદીથી સજેલાં ક્રીમ રંગનાં કમાડ ખૂલે છે અને ગલગોટાથી ભરેલું જરદાળુ રંગનું આંગણું દેખાય છે.",
    },
    "mor-pankh": {
      name: "મોરપીંછની જાળીઓ",
      description: "મોરપીંછની જાળીઓ ખસે છે અને આરસની છત્રીવાળું કમળનું સરોવર દેખાય છે.",
    },
    "jugnu-parda": {
      name: "આગિયાનો પડદો",
      description:
        "આગિયાથી ઝળહળતો ગળી રંગનો પડદો બાજુએ થાય છે અને ચાંદનીમાં કુમુદિનીનું સરોવર દેખાય છે.",
    },
    "sheesh-kiwad": {
      name: "આભલાંનાં કમાડ",
      description: "આભલાંના કામવાળાં કમાડ ખૂલે છે અને ઝુમ્મર નીચે દરબાર હૉલ દેખાય છે.",
    },
    "sunehri-phatak": {
      name: "સોનેરી ફાટક",
      description:
        "સોનાના વરખવાળાં કમાડ ખૂલે છે અને શાંત સરોવરની પેલે પાર સોનેરી ઘુમ્મટવાળો મંડપ દેખાય છે.",
    },
    "pattu-thirai": {
      name: "રેશમી સાડીના પડદા",
      description:
        "કાંજીવરમ રેશમના પડદા બાજુએ થાય છે અને પિત્તળના દીવાથી ઝળહળતો મંદિરનો કુંડ દેખાય છે.",
    },
    "kagaz-kiwad": {
      name: "ઉપસાવેલા કાગળનાં કમાડ",
      description: "સોનેરી મહોરવાળાં ઉપસાવેલા કાગળનાં કમાડ ખૂલે છે અને આછી ગુલાબી આભા દેખાય છે.",
    },
    "peetal-kiwad": {
      name: "પિત્તળનાં કમાડ",
      description:
        "ઢોકરા કાંસામાં ઢાળેલાં કમાડ ખૂલે છે અને કાંસાના જીવનવૃક્ષની આસપાસ દીવાનું આંગણું દેખાય છે.",
    },
    "kaanch-pat": {
      name: "કાચ ચિત્રના પટ",
      description: "પોપટ અને મોર ચીતરેલા કાચના પટ ખસે છે અને રત્ન જેવા રંગનો મહેલ બાગ દેખાય છે.",
    },
    "thinnai-kadhavu": {
      name: "કોતરેલાં સાગનાં કમાડ",
      description:
        "પિત્તળની ખીલીવાળાં કોતરેલાં બર્મી સાગનાં કમાડ ખૂલે છે અને હવેલીનું તડકાભર્યું આંગણું દેખાય છે.",
    },
    "meena-pat": {
      name: "મીનાના સોનેરી પટ",
      description: "પોપટ અને ફૂલોના ઝાડની મીનાવાળા સોનેરી પટ ખસે છે અને જયપુરનો મહેલ બાગ દેખાય છે.",
    },
    "rogan-parda": {
      name: "રોગાનના પડદા",
      description: "રોગાનથી ચીતરેલા મરૂન પડદા બાજુએ થાય છે અને સોનેરી સાંજે કચ્છી આંગણું દેખાય છે.",
    },
    "makhmal-parda": {
      name: "મખમલના પડદા",
      description:
        "ગુલાબનાં ભરતવાળા કાળા મખમલી પડદા બાજુએ થાય છે અને મીણબત્તીથી ઝળહળતો ફૂલોનો ઓરડો દેખાય છે.",
    },
    "sama-dwar": {
      name: "આછા રંગનાં કમાડ",
      description:
        "આછા રંગની પટ્ટીઓવાળાં ફુદીના રંગનાં કમાડ ખૂલે છે અને લાંબા જળકુંડવાળું સમરૂપ આંગણું દેખાય છે.",
    },
    "dilli-phatak": {
      name: "હવેલીનો દરવાજો",
      description:
        "લોખંડી ખીલાવાળાં જૂનાં ફિરોઝી હવેલીનાં કમાડ ખૂલે છે અને લાઇટ અને ગલગોટાથી સજેલું આંગણું દેખાય છે.",
    },
    "nakkashi-pat": {
      name: "ચાંદી નકશીના પટ",
      description: "મોર અને પોપટ ઉપસાવેલા ચાંદીના પટ ખસે છે અને ચાંદનીમાં આરસનો બાગ દેખાય છે.",
    },
    "gagan-parda": {
      name: "ફુગ્ગાના રેશમી પડદા",
      description:
        "ચીતરેલું ફુગ્ગાનું રેશમ બાજુએ થાય છે અને તળાવના મહેલ ઉપર ફુગ્ગાથી ભરેલું સવારનું આકાશ દેખાય છે.",
    },
    "bel-khidki": {
      name: "બોગનવેલવાળી બારી",
      description: "બોગનવેલથી છવાયેલાં વાદળી બારીનાં શટર સૂર્યાસ્તની કમાન પર ખૂલે છે.",
    },
    "pankhudi-pat": {
      name: "પોયણાંની પાંખડીઓ",
      description: "પોયણાંની બે મોટી પાંખડીઓ બાજુએ ખૂલે છે અને પોયણાંનું તળાવ દેખાય છે.",
    },
    "gulaab-lifafa": {
      name: "મહોરવાળું કવર",
      description: "લાખની ગુલાબ-મહોરવાળું જળરંગી કવર ખૂલે છે અને સોનેરી ગુલાબની કમાન દેખાય છે.",
    },
    "os-parda": {
      name: "ઝાકળનો પડદો",
      description: "નાનાં ફૂલો ટાંકેલો પાતળો સફેદ પડદો બાજુએ ખસે છે અને સફેદ બાગ દેખાય છે.",
    },
    "surkh-dwar": {
      name: "ગુલાબ બાગનાં બારણાં",
      description: "લાલ ગુલાબથી છવાયેલાં બાગનાં જૂનાં બારણાં ગુલાબના રસ્તા પર ખૂલે છે.",
    },
    "itr-dibbi": {
      name: "અત્તરની પેટી",
      description:
        "અત્તરની પેટીનાં રેશમી અસ્તરવાળાં બારણાં ખૂલે છે અને આછી ગુલાબી ધૂમ્રસેર ઊઠે છે.",
    },
    "gulaab-bhaap": {
      name: "ગુલાબની વરાળ",
      description:
        "ગુલાબની સુગંધવાળી વરાળના બે ગોટા છૂટા પડે છે અને કનોજનાં ગુલાબનાં ખેતર દેખાય છે.",
    },
    "oud-darwaza": {
      name: "ખીલાવાળા દરવાજા",
      description: "પિત્તળના ખીલાવાળા ભારે કોતરેલા દરવાજા ખૂલે છે અને લોબાનનો ધુમાડો ઊઠે છે.",
    },
    "tarkashi-jaali": {
      name: "ચાંદીની જાળી",
      description: "ચાંદીની બારીક જાળીના બે પડદા ખસે છે અને ગુલાબપાશવાળો આરસનો બાગ દેખાય છે.",
    },
    "aaina-pat": {
      name: "અરીસાની પાંખો",
      description:
        "વાળી શકાય એવા અરીસાની કોતરેલી પાંખો ખૂલે છે અને જાંબલી પ્રકાશમાં શૃંગાર મેજ દેખાય છે.",
    },
    "megh-parda": {
      name: "ચોમાસાનાં વાદળ",
      description: "ચોમાસાનાં વાદળોના બે ગોટા ખસે છે અને પહાડો નીચે કમળ સરોવર દેખાય છે.",
    },
    "pehar-jaali": {
      name: "આરસની જાળી",
      description: "કોતરેલી આરસની જાળી ખસે છે અને કમળ તળાવ પર મંડપ દેખાય છે.",
    },
    "lata-phatak": {
      name: "બાગનો દરવાજો",
      description: "વેલથી છવાયેલો બાગનો દરવાજો ખૂલે છે અને પરોઢનો બાગ દેખાય છે.",
    },
    "kitaab-jild": {
      name: "વાર્તાની ચોપડીનું પૂઠું",
      description: "રિબનવાળું વાર્તાની ચોપડીનું પૂઠું ખૂલે છે અને કાગળનો પૉપ-અપ મહેલ દેખાય છે.",
    },
    "itr-almari": {
      name: "અત્તરનું કબાટ",
      description: "અત્તરના કબાટનાં કાચનાં બારણાં ખૂલે છે અને ગુલાબી ઝાકળ ઊઠે છે.",
    },
    "kosh-jild": {
      name: "પક્ષીઓનો આલ્બમ",
      description: "લાખવાળાં આલ્બમનાં પૂઠાં ખૂલે છે અને કમળ તળાવ પાસે સારસ દેખાય છે.",
    },
    "gudiya-pat": {
      name: "ઢીંગલીઘરનો આગળનો ભાગ",
      description: "રમકડાની હવેલીનો રંગેલો આગળનો ભાગ ખૂલે છે અને ઝળહળતા ઓરડા દેખાય છે.",
    },
    "yantra-pat": {
      name: "યંત્રની તકતી",
      description: "પિત્તળની યંત્રની તકતી વચ્ચેથી ખૂલે છે અને સૂર્યાસ્તે વેધશાળા દેખાય છે.",
    },
    "rang-parda": {
      name: "રંગેલાં કાપડ",
      description: "બાંધણીનાં બે લાંબાં કાપડ બાજુએ ખસે છે અને રંગરેજનું આંગણું દેખાય છે.",
    },
    "genda-ladi": {
      name: "ગલગોટાનો પડદો",
      description: "ગલગોટાની સેરનો પડદો બાજુએ ખસે છે અને ફૂલ બજાર દેખાય છે.",
    },
    "kaleen-parda": {
      name: "ગાલીચાનો પડદો",
      description: "વણેલો ગાલીચો બાજુએ ખસે છે અને પરોઢે વાદળી ગુંબજોનું શહેર દેખાય છે.",
    },
    "truck-darwaza": {
      name: "ટ્રકના દરવાજા",
      description: "મોર અને કમળ ચીતરેલા ટ્રકના દરવાજા ખૂલે છે અને સૂર્યાસ્તનો રસ્તો દેખાય છે.",
    },
    "kaanch-dhakkan": {
      name: "મખમલનું ઢાંકણ",
      description: "મખમલનું કાપડ બાજુએ ખસે છે અને કાચ નીચે એક નાનકડી દુનિયા દેખાય છે.",
    },
    "pati-pat": {
      name: "વર્ગખંડનાં બારણાં",
      description: "ચૉકનાં ફૂલોવાળાં લાકડાનાં વર્ગખંડનાં બારણાં ગામ તરફના રસ્તા પર ખૂલે છે.",
    },
    "jad-jhalar": {
      name: "વેલનો પડદો",
      description: "લટકતાં મૂળિયાં અને વેલનો પડદો બાજુએ ખસે છે અને નદી પરના પુલ દેખાય છે.",
    },
    "gol-darwaza": {
      name: "ઝૂંપડીનું બારણું",
      description: "ગુલાબી માટીનું ગોળ બારણું ખૂલે છે અને ઝૂંપડીનો બાગ દેખાય છે.",
    },
    "jhaadi-deewar": {
      name: "વાડના દરવાજા",
      description: "કાપેલી વાડની બે દીવાલો ખસે છે અને ગુલાબની કમાનવાળો રસ્તો દેખાય છે.",
    },
    "deco-dibba": {
      name: "લિફ્ટના દરવાજા",
      description: "આર્ટ ડેકો લિફ્ટના દરવાજા ખસે છે અને પુલ પરથી પસાર થતી ટ્રેન દેખાય છે.",
    },
    "samundar-parda": {
      name: "દરિયાઈ વેલનો પડદો",
      description: "પાણી નીચે દરિયાઈ વેલ ખસે છે અને પરવાળાની કમાન અને સફેદ રેતી દેખાય છે.",
    },
    "shatranj-sandook": {
      name: "શેતરંજનાં બારણાં",
      description:
        "જડતરવાળાં શેતરંજનાં બારણાં ખૂલે છે અને શેતરંજની બાજીવાળી મહેલની અગાસી દેખાય છે.",
    },
    pankhi: {
      name: "રંગેલો પંખો",
      description:
        "કમળ અને પોપટવાળો રેશમી હાથપંખો બિડાય છે અને ફાનસથી ઝળહળતી મહેલની અગાસી દેખાય છે.",
    },
    "sheesh-mahal": {
      name: "શીશમહેલ",
      description:
        "નાના અરીસાઓની દીવાલ પટ્ટીઓની જેમ ફરે છે અને મીણબત્તીથી ઝળહળતો શીશમહેલ દેખાય છે.",
    },
    "popup-mahal": {
      name: "પૉપ-અપ મહેલ",
      description: "કાપેલા કાગળનો સરોવર મહેલ પૉપ-અપ ચોપડીની જેમ ઊભો થાય છે, પછી તમે અંદર જાઓ છો.",
    },
    odhni: {
      name: "કન્યાની ઓઢણી",
      description: "લાલ બાંધણીની ઓઢણી પવનમાં લહેરાય છે, પછી ઊંચકાઈને ચાંદની આંગણું દેખાડે છે.",
    },
    "kavad-peti": {
      name: "વાર્તાની પેટી",
      description: "રંગેલી મેવાડી કાવડ બે વાર ખૂલે છે અને સોનેરી સાંજે બાગનો મંડપ દેખાય છે.",
    },
    "chhatri-utsav": {
      name: "શાહી છત્ર",
      description: "ભરતકામવાળું છત્ર માથા પર ફરે છે, પછી ગોળ ફરતું આકાશમાં ઊડી જાય છે.",
    },
    "jal-darpan": {
      name: "શાંત સરોવર",
      description: "તરતા દીવાથી લહેરો ફેલાય છે અને સરોવર દીવાથી ઝળહળતા ઘાટ પર ખૂલે છે.",
    },
    "pushp-varsha": {
      name: "પાંખડીઓનો વરસાદ",
      description: "ગુલાબની પાંખડીઓની દીવાલ વંટોળમાં વીખરાય છે અને વરમાળાનો મંચ દેખાય છે.",
    },
    "moti-seep": {
      name: "મોતીની છીપ",
      description: "મોટી છીપ ઝળહળતા મોતી પરથી ઢાંકણ ઉઠાવે છે અને દરિયાકિનારાનો મંડપ દેખાય છે.",
    },
    "badal-raag": {
      name: "ચોમાસાનાં વાદળ",
      description: "વરસાદી વાદળ ખસે છે, તડકો નીકળે છે અને મહેલ પર મેઘધનુષ્ય જાતે દોરાય છે.",
    },
    "jugnu-van": {
      name: "આગિયાનું વન",
      description:
        "આગિયા તમારાં નામની આસપાસ ભેગા થાય છે, પછી વિખેરાય છે અને વન ખસીને ઝળહળતો વડ દેખાડે છે.",
    },
    "uday-surya": {
      name: "સૂર્યોદય",
      description: "ટેકરીઓ પર સૂરજ ઊગે છે અને ટેકરીઓ નીચે ઊતરીને તમારું નવું ઘર દેખાડે છે.",
    },
    taaramandal: {
      name: "તારામંડળ",
      description:
        "તમારાં નામની આસપાસ તારા સોનેરી રેખાથી જોડાય છે, પછી તેમાંથી ઊડીને વેધશાળા સુધી.",
    },
    "thar-ki-ret": {
      name: "રણની રેતી",
      description: "પવન રેતીના ઢૂવા ઉડાડી દે છે અને ફાનસ નીચે કિલ્લાનો કૅમ્પ દેખાય છે.",
    },
    "sheher-ki-raat": {
      name: "શહેરની રોશની",
      description: "શહેરની બારીઓ એક પછી એક જાગે છે, પછી આખી ક્ષિતિજ ઝળહળી ઊઠે છે.",
    },
    "choodi-chakra": {
      name: "બંગડીઓનાં ચક્ર",
      description: "કાચની બંગડીઓનાં ચક્ર તમારાં નામની આસપાસ ફરે છે, પછી લહેરોની જેમ ફેલાય છે.",
    },
    "sanjhi-roshni": {
      name: "સાંઝી ફાનસ",
      description: "કાપેલા કાગળના સ્ટેન્સિલમાંથી દીવો ઝળહળે છે, પછી કાગળ પાનાની જેમ ફરે છે.",
    },
    "chhaya-parda": {
      name: "છાયાનો પડદો",
      description: "દીવાથી ઝળહળતા પડદા પર કઠપૂતળીની છાયા ડોલે છે, પછી પડદો વીંટાઈને મંચ દેખાડે છે.",
    },
    "athangudi-tiles": {
      name: "ચેટ્ટિનાડ ટાઇલ્સ",
      description: "ચળકતી આથંગુડી ટાઇલ્સ લહેરની જેમ ઊલટાય છે અને ચેટ્ટિનાડ આંગણું દેખાય છે.",
    },
    "gulaal-bindu": {
      name: "રંગનાં ટીપાં",
      description: "ગુલાલનાં ટીપાં કાગળ પર ફેલાઈને હોળીનું રંગીન આંગણું બને છે.",
    },
    bioscope: {
      name: "બાયોસ્કોપ",
      description: "જૂના બાયોસ્કોપના લેન્સમાં કેલિડોસ્કોપ ફરે છે, પછી લેન્સ તમારી આસપાસ ખૂલે છે.",
    },
    "kaanch-ka-gola": {
      name: "સ્નો ગ્લોબ",
      description: "ગોળામાં બરફ પડે છે; તે હલે છે અને તમે શિયાળાના ગામમાં પહોંચો છો.",
    },
    phirki: {
      name: "કાગળની ફીરકી",
      description: "વાળેલો કાગળનો ચોરસ એક પછી એક ગડી ખોલે છે અને ગામનો મેળો દેખાય છે.",
    },
    bulbule: {
      name: "સાબુના પરપોટા",
      description: "મોટો પરપોટો તમારાં નામની આસપાસ ડોલે છે, પછી ફૂટીને બાગની પાર્ટી દેખાડે છે.",
    },
    "chhuk-chhuk": {
      name: "રમકડાની ટ્રેન",
      description: "નાની વરાળવાળી ટ્રેન પસાર થાય છે, અને વરાળ હટતાં પાર્ટી સ્ટેશન દેખાય છે.",
    },
    chadar: {
      name: "પાણીની ચાદર",
      description:
        "દીવાના ગોખવાળી આરસની દીવાલ પર પાણીની ચાદર પડે છે, પછી અટકીને ઉપરથી ઓસરી જાય છે.",
    },
    parwaaz: {
      name: "ભરતકામનાં પંખી",
      description: "રેશમ પર ભરેલાં પંખી ઊડી જાય છે, અને રેશમ તેમની પાછળ ઉપર તરી જાય છે.",
    },
    bhanwar: {
      name: "અબરી વમળ",
      description: "દખ્ખણી અબરી કાગળ વમળની જેમ ફરે છે અને વચ્ચે સમાઈ જાય છે.",
    },
    "jaali-patta": {
      name: "જાળીદાર પાંદડું",
      description: "જાળી જેવા મોટા પાંદડાની નસોમાં પ્રકાશ દોડે છે, પછી તે વળીને નીચે ખરે છે.",
    },
    "lapet-khule": {
      name: "ક્વિલિંગનું ફૂલ",
      description: "કાગળની ગૂંચળીઓનું ફૂલ ફરે છે, વીંટા છૂટા પડે છે અને વળાંકો ઊછળીને દૂર જાય છે.",
    },
    taar: {
      name: "વીણાના તાર",
      description:
        "વીણાની જેમ તારથી કસેલું ચંદનનું કોતરેલું પાટિયું: તાર છેડ્યા હોય તેમ ઝગમગે છે, પછી પાટિયું પટ્ટી-પટ્ટી ખૂલે છે.",
    },
    pratibimb: {
      name: "તળાવનું પ્રતિબિંબ",
      description:
        "આમંત્રણ કમળના તળાવમાં એક પ્રતિબિંબથી ખૂલે છે; એક લહેર ફેલાય છે અને દૃશ્ય પાણીમાંથી ઉપર આવે છે.",
    },
    mohur: {
      name: "ચાંદીનો સિક્કો",
      description:
        "ભરતકામવાળો મોટો ચાંદીનો સિક્કો કિનારી પર ફરે છે, ઊથલે છે, અને તમે તેની આરપાર નીકળી જાઓ છો.",
    },
    gathbandhan: {
      name: "ગઠબંધન",
      description:
        "લહેરિયાની બે ઓઢણીઓ લહેરાતી આવે છે, વચ્ચે ગાંઠ બાંધે છે અને સાથે ઉપર ઊડી જાય છે.",
    },
    phuljhadi: {
      name: "ફૂલઝડીનું વર્તુળ",
      description:
        "ફૂલઝડી નામોની આસપાસ સોનેરી પ્રકાશનું વર્તુળ દોરે છે, અને કાળી લાખ કીકીની જેમ ખૂલે છે.",
    },
    semal: {
      name: "શીમળાનું રૂ",
      description: "શીમળાની શીંગો ફાટે છે અને સફેદ રૂ નીકળી પવનમાં ઘૂમતું ઊડી જાય છે.",
    },
    thappa: {
      name: "બ્લોક છાપ",
      description:
        "લાકડાનું કોતરેલું બીબું સુતરાઉ ચાદર પર છાપ પાડે છે; દરેક છાપ એક બારી ખોલે છે, પછી ચાદર ઊંચકાઈ જાય છે.",
    },
    gumbad: {
      name: "રંગેલો ઘુમ્મટ",
      description:
        "તમે રંગેલા ઘુમ્મટમાં ઉપર જુઓ છો; તેનું આકાશી બાકોરું કીકીની જેમ ખૂલે છે અને પાંખડીઓ વરસે છે.",
    },
    ghadi: {
      name: "ખિસ્સા ઘડિયાળ",
      description:
        "જૂની ખિસ્સા ઘડિયાળ: કાંટા ફરીને કલાક પર આવે છે, ધીમો રણકાર થાય છે, અને તમે તેના ચહેરામાં પ્રવેશો છો.",
    },
    hindolo: {
      name: "રંગેલો હીંચકો",
      description: "સંખેડાનો રંગેલો હીંચકો ઝૂલે છે, પછી તમારી તરફ ઊંચે ઝૂલીને નજર બહાર જાય છે.",
    },
    "reshmi-gaanth": {
      name: "સાટિનની ગાંઠ",
      description:
        "પોર્સેલિનનાં દ્વાર આછા ગુલાબી સાટિનની ગાંઠે બાંધેલાં; ગાંઠ છૂટે છે, રિબન સરી પડે છે અને દ્વાર ખૂલે છે.",
    },
    "moti-kaanta": {
      name: "મોતીનો બ્રોચ",
      description:
        "રેશમી પટ મોતી-સ્ફટિકના બ્રોચથી જોડેલા; બ્રોચ છૂટીને ઉપર તરે છે અને પટ ચણિયાના ઘેરની જેમ ખૂલે છે.",
    },
    guldasta: {
      name: "સૂતળીનો ગુલદસ્તો",
      description:
        "તાંબાની કોતરેલી પ્લેટો ફૂલોના ગુલદસ્તાથી બાંધેલી; સૂતળી સરકે છે, ગુલદસ્તો પડે છે અને પ્લેટો ખસી જાય છે.",
    },
    "neeli-titli": {
      name: "વાદળી પતંગિયું",
      description:
        "ધુમ્મસ જેવાં વાદળી દ્વાર મીનાકારી પતંગિયાથી બંધ; તે પાંખો ખોલી ઊડી જાય છે અને દ્વાર ખૂલે છે.",
    },
    "itr-shishi": {
      name: "અત્તરની શીશી",
      description:
        "ગુલાબી દ્વાર રેશમી દોરી અને અત્તરની શીશીથી બાંધેલાં; દોરી સરકે છે અને શીશી પાંખડીઓની ઝાપટમાં પડે છે.",
    },
    "van-mala": {
      name: "જંગલી ફૂલોની માળા",
      description:
        "દેવદારનાં કોતરેલાં દ્વાર પર પહાડી ફૂલોની માળા; ગાંઠ ઢીલી થાય છે અને માળા સરી પડે છે.",
    },
    gulband: {
      name: "રેશમી રોઝેટ",
      description:
        "ઘટ્ટ રંગના બે કૅનવાસ પરવાળા રંગની રિબન અને રોઝેટથી બાંધેલા; રોઝેટ ફરતું દૂર જાય છે અને કૅનવાસ ખસે છે.",
    },
    mudra: {
      name: "લાખની મહોર",
      description:
        "ઉપસાવવાળા કાગળના પટ ઘેરી લાલ લાખની મહોરથી બંધ; મહોર બે ભાગમાં તૂટે છે અને દરેક ભાગ પોતાના પટ સાથે જાય છે.",
    },
    "shankha-pola": {
      name: "શાંખા પોલા",
      description:
        "લીલી કોલકાતા બારીઓ શંખની અને લાલ લાખની બંગડીથી જોડેલી; બંગડીઓ છૂટી ગબડે છે અને બારીઓ ખૂલે છે.",
    },
    challa: {
      name: "રૂમાલની વીંટી",
      description:
        "છાપેલો રેશમી રૂમાલ સોનેરી વીંટીમાં ગાંઠેલો; વીંટી સરકીને દૂર જાય છે અને રેશમી પટ ખૂલે છે.",
    },
    latkan: {
      name: "જરીનાં ફૂમતાં",
      description:
        "પાતળા ચંદેરી પડદા ફૂમતાંવાળી જરીની દોરીથી બાંધેલા; દોરી ઢીલી થાય છે, ફૂમતાં પડે છે અને પડદા ખસી જાય છે.",
    },
    "shakkar-chakri": {
      name: "ખાંડનો ચંદ્રક",
      description:
        "ફૉન્ડન્ટનાં દ્વાર ખાંડના ચંદ્રકથી બંધ; ચંદ્રક ખાંડનાં મોતીમાં વિખેરાય છે અને દ્વાર ખૂલે છે.",
    },
    "raghu-maina": {
      name: "પોપટનો હૂક",
      description:
        "પૈઠણીના પટ બે પોપટવાળા સોનેરી હૂકથી જોડેલા; પોપટ છૂટા પડી ઝૂલે છે અને રેશમ ખસીને ખૂલે છે.",
    },
    "taala-chaabi": {
      name: "ચાંદીનું તાળું",
      description:
        "અખરોટના લાકડાનાં દ્વાર ગુલાબ આકારના ચાંદીના તાળાથી બંધ; તાળું ખૂલી નીચે પડે છે અને દ્વાર ખૂલે છે.",
    },
    "phool-gend": {
      name: "પાંખડીઓનો દડો",
      description:
        "મોગરા અને ગુલાબથી ગૂંથેલાં દ્વાર ગુલાબની પાંખડીઓના દડાથી બાંધેલાં; દડો પાંખડીઓમાં ફૂટે છે અને દ્વાર ખૂલે છે.",
    },
    "panna-pat": {
      name: "થેવા લોકેટ",
      description:
        "માણેકની દોરી પરનું થેવા લોકેટ પન્નાના કાચનાં દ્વાર પકડી રાખે છે; તે ખૂલીને પડે છે અને દ્વાર ખૂલે છે.",
    },
    "sikki-dwar": {
      name: "ઘાસની માછલી",
      description:
        "ઘાસના દોરડા પરની ગૂંથેલી સિક્કી માછલી દ્વાર પકડે છે; તે તરીને જાય છે અને દ્વાર ખૂલે છે.",
    },
    "hase-bagilu": {
      name: "રંગેલાં પંખી",
      description:
        "બે રંગેલાં પંખી લાલ માટીનાં દ્વારની કડી છે; તે છૂટાં પડી ઊડી જાય છે અને દ્વાર ખૂલે છે.",
    },
    "kankreet-dwar": {
      name: "પિત્તળનો ચંદ્રક",
      description:
        "પટ્ટા પરનો પિત્તળનો ચંદ્રક કોંક્રીટનાં દ્વાર પકડે છે; તે પા ફેરો ફરે છે અને દ્વાર ખસી જાય છે.",
    },
    "chhaap-kiwad": {
      name: "સેફ્ટી પિન",
      description: "છાપેલી મોટી સેફ્ટી પિન દ્વાર પકડે છે; તે ખૂલીને પડે છે અને દ્વાર ખૂલે છે.",
    },
    "purana-darwaza": {
      name: "દુકાનનો ઘંટ",
      description:
        "લાલ દોરી પરનો પિત્તળનો ઘંટ જૂનાં દ્વાર પકડે છે; તે વાગે છે, પડે છે અને દ્વાર ખૂલે છે.",
    },
    "bindi-kiwad": {
      name: "ટપકાંનાં પંખી",
      description:
        "ટપકાંથી બનેલાં બે પંખી દ્વાર પર માળા પકડે છે; તે માળા લઈ ઊડે છે અને દ્વાર ખૂલે છે.",
    },
    "masala-almari": {
      name: "મરચાંની માળા",
      description:
        "મરચાં અને તજની માળા મસાલાનું કબાટ બાંધે છે; તે ઢીલી થાય છે અને બારણાં તમારી તરફ ખૂલે છે.",
    },
    "kaagaz-pat": {
      name: "પટ્ટાવાળો દુપટ્ટો",
      description:
        "લિલીવાળો પટ્ટાવાળો મણિપુરી દુપટ્ટો કાગળનાં દ્વાર બાંધે છે; તે ઊડી જાય છે અને દ્વાર ખસી જાય છે.",
    },
    "rupa-kiwad": {
      name: "ચાંદીનો દડો",
      description:
        "સાંકળ પરનો ચાંદીનો જાળીદાર દડો દ્વાર પકડે છે; તે ફૂલની જેમ ખીલે છે અને દ્વાર ખૂલે છે.",
    },
    "ola-vathil": {
      name: "પાનની ગાંઠ",
      description: "જાસૂદવાળી તાડપાનની ગાંઠ દ્વાર બાંધે છે; તે છૂટે છે અને દ્વાર ખૂલે છે.",
    },
    "seep-kiwad": {
      name: "મોતીનું ફૂલ",
      description:
        "મોતીના ફૂલથી બાંધેલી સેરો સીસમનાં દ્વાર પકડે છે; તે સરી જાય છે અને દ્વાર ખૂલે છે.",
    },
    "aakar-pat": {
      name: "લાલ વર્તુળ",
      description:
        "કાળી રેખા પરનું લાલ વર્તુળ દ્વાર પકડે છે; તે રેખા પર ગબડી જાય છે અને દ્વાર ખસી જાય છે.",
    },
    "shwet-dwar": {
      name: "મખમલ અને લિલી",
      description:
        "લિલી પકડેલી મખમલી રિબન દ્વાર બાંધે છે; લિલી પડે છે, રિબન સરે છે અને દ્વાર ખૂલે છે.",
    },
    "moti-dwar": {
      name: "કાચનો પરપોટો",
      description:
        "મોતીથી ઘેરાયેલો કાચનો પરપોટો દ્વાર પકડે છે; તે ઝગમગી ફૂટે છે અને દ્વાર ખૂલે છે.",
    },
    "yashab-kiwad": {
      name: "યશબની બંગડી",
      description:
        "સોનાની સાંકળ પરની કોતરેલી યશબની બંગડી યશબનાં દ્વાર પકડી રાખે છે; તે સરકીને નીચે પડે છે અને દ્વાર ખૂલે છે.",
    },
    "usta-kiwad": {
      name: "સોનેરી સૂરજ",
      description:
        "વાદળી રિબન પરનો ઉપસાવેલા સોનાનો સૂરજ દ્વાર પકડી રાખે છે; રિબન છૂટે છે અને દ્વાર ખૂલે છે.",
    },
    "pixel-kiwad": {
      name: "પિક્સેલ રત્ન",
      description:
        "પિક્સેલની સાંકળ પરનું પિક્સેલ રત્ન દ્વાર પકડી રાખે છે; તે ફૂટીને પિક્સેલમાં વિખેરાય છે અને દ્વાર ખૂલે છે.",
    },
    "saaya-kiwad": {
      name: "તાર પર પંખી",
      description:
        "દ્વારની આરપાર તાર પર કાળા પડછાયા જેવાં બે પંખી બેઠાં છે; તે ઊડી જાય છે, દ્વાર ખૂલે છે અને સામે સૂર્યાસ્ત દેખાય છે.",
    },
    "jad-dwar": {
      name: "વાંસનો આગળિયો",
      description:
        "ઑર્કિડવાળો વાંસનો આગળિયો જીવંત મૂળિયાંનાં દ્વાર બંધ રાખે છે; તે સરકીને નીકળી જાય છે અને દ્વાર બંને બાજુ ખસી જાય છે.",
    },
    "natak-dwar": {
      name: "મખમલી દોરડું",
      description:
        "પિત્તળના હૂક પરનું થિયેટરનું મખમલી દોરડું મંચનાં દ્વાર પકડી રાખે છે; તે પડે છે અને દ્વાર ખૂલે છે.",
    },
    "kashi-kiwad": {
      name: "ટાઇલની સાંકળ",
      description:
        "ગ્લેઝવાળી ટાઇલ લટકતી પિત્તળની સાંકળ દ્વાર પકડી રાખે છે; તે રણકે છે, સરી પડે છે અને દ્વાર ખૂલે છે.",
    },
    "paandaan-pat": {
      name: "મોરની સૂડી",
      description:
        "ચાંદીની મોર આકારની સોપારીની સૂડી ચાંદીનાં દ્વાર પકડી રાખે છે; તે ફરીને પકડ છોડે છે અને દ્વાર બહારની તરફ ખૂલે છે.",
    },
    "marmar-dwar": {
      name: "પિત્તળનાં કડાં",
      description:
        "એકબીજામાં પરોવાયેલાં પિત્તળનાં બે કડાં આરસનાં દ્વાર પકડી રાખે છે; તે ગબડી જાય છે અને દ્વાર ખસી જાય છે.",
    },
    "goa-dwar": {
      name: "ચીતરેલી ટાઇલ",
      description:
        "દોરી પરની ગોવાની ચીતરેલી ટાઇલ વાદળી દ્વાર પકડી રાખે છે; તે ફરીને પકડ છોડે છે અને દ્વાર ખૂલે છે.",
    },
    "haveli-pat": {
      name: "પરાંદાનો ચોટલો",
      description:
        "પૉમપૉમવાળો રેશમી પરાંદાનો ચોટલો ચીતરેલાં દ્વાર બાંધી રાખે છે; તે છૂટે છે અને દ્વાર ખૂલે છે.",
    },
    "bah-dwar": {
      name: "ગમોસાની ગાંઠ",
      description: "ગમોસાની ગાંઠ વાંસનાં દ્વાર બાંધી રાખે છે; તે છૂટે છે અને દ્વાર ખૂલે છે.",
    },
    "akeek-pat": {
      name: "ક્વાર્ટ્ઝ સ્ફટિક",
      description:
        "સોનામાં વીંટેલો ક્વાર્ટ્ઝ સ્ફટિક અકીકનાં દ્વાર પકડી રાખે છે; તેમાં તિરાડ પડે છે અને દ્વાર ખસી જાય છે.",
    },
    "sagar-dwar": {
      name: "ખલાસીની ગાંઠ",
      description:
        "છીપવાળી ખલાસીની ગાંઠ દરિયે તણાઈ આવેલા લાકડાનાં દ્વાર બાંધી રાખે છે; તે છૂટે છે અને દ્વાર દરિયા તરફ બહાર ખૂલે છે.",
    },
    "khet-phatak": {
      name: "દોરીવાળો પતંગ",
      description:
        "પોતાની દોરીમાં ભરાયેલો પતંગ ખેતરનો ઝાંપો બંધ રાખે છે; તે ઊડી જાય છે અને ઝાંપાનાં બારણાં બહારની તરફ ખૂલે છે.",
    },
    "sona-parat": {
      name: "સોને જડેલો કાચ",
      description:
        "પન્ના, માણેક અને નીલમના ઝગમગતા કાચની ત્રણ સોનેરી કમાનો; તમે એક પછી એક તેમાંથી પસાર થાઓ છો.",
    },
    mauni: {
      name: "ગોળ ટોપલીઓ",
      description:
        "સોનેરી ઘાસની ત્રણ ગોળ કિનારીઓ, જાણે ટોપલીમાં ડોકિયું; તે ફરે છે અને તમે અંદર ઊતરો છો.",
    },
    chowka: {
      name: "ફરતા ચોરસ",
      description: "લાલ માટી પર ચોખાના લેપના ત્રણ ચોરસ; પસાર થતાં દરેક પા ફેરો ફરે છે.",
    },
    khidkiyaan: {
      name: "કોંક્રીટની બારીઓ",
      description:
        "કોંક્રીટની દીવાલ, રંગીન છજ્જાંની જાળી અને ગોળ બારી; તમે ત્રણેયમાંથી પસાર થાઓ છો.",
    },
    "phool-chhaap": {
      name: "છાપેલું ફૂલ",
      description:
        "ગુલાબી અને વાદળી શાહીમાં છાપેલું ફૂલ, લહેરિયું વર્તુળ અને ગોળ; શાહી ખસે છે, પછી તમે અંદર જાઓ છો.",
    },
    "gali-gali": {
      name: "રેખાંકિત ગલી",
      description: "જૂની ગલીની ત્રણ રેખાંકિત કમાનો; તમે ગલીમાં એક પછી એક તેમાંથી પસાર થાઓ છો.",
    },
    tipki: {
      name: "ટપકાંનું વૃક્ષ",
      description: "ટપકાંનું વૃક્ષ, પંખીઓ અને ફૂલોનાં વર્તુળ ઝબૂકે છે, પછી તમે ઊડીને પસાર થાઓ છો.",
    },
    "masala-dabba": {
      name: "મસાલિયું",
      description: "આખા મસાલાનાં વર્તુળ અને પિત્તળના મસાલિયાની કિનારી; તમે મસાલિયામાં ઊતરો છો.",
    },
    phumdi: {
      name: "તરતા ટાપુ",
      description:
        "કાગળની ટેકરીઓ, ઘાસનું તરતું વર્તુળ અને લિલીનું વર્તુળ; તમે તળાવ પરથી પસાર થાઓ છો.",
    },
    "rupa-jaali": {
      name: "ચાંદીનાં લોકેટ",
      description: "ચાંદીની તારકસીના ત્રણ લંબગોળ, લોકેટમાં લોકેટ; દરેક નમીને ઝગમગે છે.",
    },
    thoranam: {
      name: "પાનનાં તોરણ",
      description: "તાડપાનની કમાન, પાનનાં ફૂલો અને માછલીઓનાં વર્તુળ ઝૂલે છે, પછી બાજુએ ખસે છે.",
    },
    "seep-mehrab": {
      name: "છીપની કમાનો",
      description: "છીપ જડેલા ઘેરા લાકડાની ત્રણ મુઘલ કમાનો, મહેલના ઓરડા જેવી.",
    },
    "teen-aakar": {
      name: "ત્રણ આકાર",
      description:
        "ત્રણ કેનવાસમાં કાપેલા ચોરસ, વર્તુળ અને ત્રિકોણ ધીમે ફરે છે, પછી તમે દરેકમાંથી પસાર થાઓ છો.",
    },
    galiyara: {
      name: "પરસાળ",
      description: "શ્વેત-શ્યામ પરસાળમાં સોનેરી રેખાઓવાળી ત્રણ પથ્થરની કમાનો; તમે તેમાંથી ચાલો છો.",
    },
    chamak: {
      name: "સપ્તરંગી ચમક",
      description:
        "મોતી જેવી કમાન, સપ્તરંગી કાચ અને મોતીનાં વર્તુળ; પસાર થતાં સપ્તરંગી ચમક ફેલાય છે.",
    },
    "yashab-kamal": {
      name: "યશબનું કમળ",
      description:
        "સોના અને માણેકના મધ્યભાગની આસપાસ યશબનું વિશાળ કમળ આખી સ્ક્રીન ઢાંકે છે; મધ્યભાગ ઊંચકાય છે અને પાંખડીઓ વર્તુળે વર્તુળે ખૂલે છે.",
    },
    manoti: {
      name: "સોનેરી ઘુમ્મટ",
      description:
        "બિકાનેરના ઘુમ્મટના અંદરના ભાગ જેવું, ગોળ પાંખિયાંવાળું ઉપસેલા સોનાનું ફૂલ; વચ્ચેનો સોનેરી ગોળો ઊંચકાય છે અને પાંખિયાં બહારની તરફ ખૂલે છે.",
    },
    "chaukor-phool": {
      name: "પિક્સેલ ફૂલ",
      description:
        "પિક્સેલનું વિશાળ ફૂલ આખી સ્ક્રીન ભરી દે છે; તેનો મધ્યભાગ ઝબકીને ગાયબ થાય છે અને પાંખડીઓ ચોરસ પગલે ખૂલે છે, જાણે ગેમનું નવું લેવલ શરૂ થતું હોય.",
    },
    "naariyal-chhaya": {
      name: "તાડનો ઘટાટોપ",
      description:
        "તમે કાળાં તાડ-પાંદડાં વચ્ચેથી ઉપર સૂર્યાસ્તના આકાશ તરફ જુઓ છો; તે ઝૂલે છે, તાડની ટોચ સરી જાય છે અને પાંદડાં બાજુએ ખસે છે.",
    },
    kundal: {
      name: "ફર્નનો ઘટાટોપ",
      description:
        "વૃક્ષ જેવા ફર્નનાં વિશાળ પાંદડાં જંગલના ઘટાટોપની જેમ સ્ક્રીન ઢાંકે છે; ગૂંચળું વળેલું ફર્ન ઊકલે છે અને પાંદડાં ખૂલે છે.",
    },
    "makhmali-chakra": {
      name: "મખમલી પંખો",
      description:
        "સોનેરી ઝાલરવાળું, પાટલીવાળા કિરમજી મખમલ અને વાદળી-લીલા રેશમનું સૂર્યચક્ર; વચ્ચેનો ચંદ્રક ઊંચકાય છે અને પાટલીઓ પાછી વળે છે.",
    },
    "kashi-phool": {
      name: "ટાઇલનું ફૂલ",
      description:
        "કોબાલ્ટ વાદળી અને ફિરોઝી ગ્લેઝવાળી ટાઇલની પાંખડીઓનું મોટું ફૂલ; વચ્ચેની ટાઇલ ફરીને દૂર જાય છે અને પાંખડીઓ બહારની તરફ નમે છે.",
    },
    beeda: {
      name: "નાગરવેલનાં પાન",
      description:
        "ચાંદીના વરખમાં વીંટેલા બીડાની આસપાસ ચળકતાં નાગરવેલનાં પાનનું વર્તુળ; બીડું ઊંચકાઈ જાય છે અને પાન બહારની તરફ વળે છે.",
    },
    "farshi-phool": {
      name: "આરસનો ચંદ્રક",
      description:
        "ફરસમાં જડેલો આરસનો ચંદ્રક, પિત્તળની કિનારીવાળી સફેદ અને આછી ગુલાબી પાંખડીઓ સાથે; વચ્ચેનો પિત્તળનો ગોળો ઊંચકાય છે અને પાંખડીઓ ખસી જાય છે.",
    },
    "seep-khidki": {
      name: "છીપની બારી",
      description:
        "વાદળી ચોકઠાંમાં ઝળહળતી છીપની તકતીઓવાળી ગોળ બારી; વચ્ચેની ધરી ફરે છે અને તકતીઓ શટરની જેમ ખૂલે છે.",
    },
    phundne: {
      name: "ફૂમતાંનો ફુવારો",
      description:
        "મોટા પૉમપૉમની આસપાસ પરાંદાનાં રેશમી ફૂમતાંનો ફુવારો; પૉમપૉમ ઊછળીને દૂર જાય છે અને ફૂમતાં બહારની તરફ ઝૂલે છે.",
    },
    "japi-chakra": {
      name: "જાપીનું ચક્ર",
      description:
        "રત્નજડિત મધ્યભાગની આસપાસ વિશાળ જાપીના ગૂંથેલા ખંડ; મધ્યભાગ ઊંચકાય છે અને ખંડ ફરતાં ફરતાં પંખાની જેમ ખૂલે છે.",
    },
    "akeek-phool": {
      name: "અકીકનું ફૂલ",
      description:
        "ઝગમગતા જિયોડની આસપાસ સોનેરી કિનારીવાળી અકીકની ચીરીઓનું ફૂલ; જિયોડ ઊંચકાય છે અને ચીરીઓ બહારની તરફ સરકે છે.",
    },
    "sagar-seep": {
      name: "ઝળહળતી છીપ",
      description:
        "અંધારામાં ઝળહળતી પંખા જેવી વિશાળ છીપ; વચ્ચેનું મોતી ઊંચકાય છે અને તેની ધારીઓ મોજાની જેમ બહારની તરફ ખૂલે છે.",
    },
    "khet-chakra": {
      name: "ખેતરોનું ચક્ર",
      description:
        "વાવની આસપાસ ઉપરથી દેખાતાં ગલગોટા અને ચાનાં ખેતરોના ફાચર જેવા ટુકડા; વાવ ઊંડી ઊતરે છે અને ટુકડા બહાર સરકે છે.",
    },
    doors: {
      name: "થીમનાં બારણાં",
      description: "તમારી થીમનું પોતાનું ચિત્ર બે બારણાંની જેમ વચ્ચેથી ખૂલે છે.",
    },
    palace: {
      name: "મહેલના દરવાજા",
      description: "તોરણવાળી કમાન નીચે કોતરેલા દરવાજા હૂંફાળા પ્રકાશમાં ખૂલે છે.",
    },
    temple: {
      name: "મંદિરના દરવાજા",
      description: "સોનેરી ગોપુરમ નીચે રણકતી ઘંટડીઓ અને દીવાવાળા પિત્તળના દરવાજા.",
    },
    curtain: {
      name: "રેશમી પડદા",
      description: "ઝગમગતી લાઇટવાળા મખમલના પડદા મંચની જેમ બાજુએ ખસે છે.",
    },
    envelope: {
      name: "શાહી કવર",
      description: "ફૂલની છાપવાળી લાખની મહોર તૂટે છે અને કાર્ડ બહાર આવે છે.",
    },
    lotus: {
      name: "ખીલતું કમળ",
      description: "તમારાં નામની આસપાસ મોટું કમળ પાંખડી પછી પાંખડી ખીલે છે.",
    },
    mandap: {
      name: "લગ્નનો મંડપ",
      description: "કેળનાં પાનના થાંભલા અને મોગરાની સેર વચ્ચે પાતળા પડદા ઊંચકાય છે.",
    },
    jharokha: {
      name: "ઝરૂખાની બારી",
      description: "રેતિયા પથ્થરની બારીનાં ચાર કોતરેલાં જાળીવાળાં શટર પાછાં વળે છે.",
    },
    phool: {
      name: "ફૂલોનો પડદો",
      description: "ગલગોટા, ગુલાબ અને મોગરાની સેર વચ્ચેથી ખસે છે.",
    },
    scroll: {
      name: "શાહી ફરમાન",
      description: "રિબન સરકે છે અને ફરમાનનો કાગળ જાતે વીંટાઈ જાય છે.",
    },
    diyas: {
      name: "દીવાની હાર",
      description: "દીવા એક પછી એક પ્રગટે છે, પછી હૂંફાળા પ્રકાશમાં ઝળહળી ઊઠે છે.",
    },
    rangoli: {
      name: "રંગોળી",
      description: "રંગોળી જાતે રંગોમાં દોરાય છે, પછી ગોળ ફરીને પ્રકાશમાં વિખેરાય છે.",
    },
    peacock: {
      name: "મોરની કળા",
      description: "તમારાં નામની પાછળ મોર કળા કરે છે, પછી પીંછાં સંકેલી લે છે.",
    },
    storybook: {
      name: "વાર્તાની ચોપડી",
      description: "સોનેરી કાપડના પૂઠાવાળી ચોપડી પહેલા પાના પર ખૂલે છે.",
    },
    lanterns: {
      name: "આકાશ કંદીલ",
      description: "ઝળહળતાં કાગળનાં ફાનસ રાતમાં તરે છે, પછી ઊંચે ઊડી જાય છે.",
    },
    moonlit: {
      name: "ચાંદની રાત",
      description: "કમાનો ઉપર બીજનો ચાંદ, તારા અને ઝૂલતાં ફાનસ.",
    },
    fireworks: {
      name: "આતશબાજી",
      description: "ગુંબજોવાળી ક્ષિતિજ પર આતશબાજી ફૂટે છે.",
    },
    balloons: {
      name: "ફુગ્ગા",
      description: "ફુગ્ગાથી ભરેલું આકાશ ઉપર ઊડી જાય છે.",
    },
    gift: {
      name: "ભેટનું બૉક્સ",
      description: "રિબન છૂટે છે અને ઢાંકણ ઊંચકાય છે.",
    },
    none: {
      name: "સીધા અંદર",
      description: "કોઈ શરૂઆત નહીં: મહેમાનો સીધા દૃશ્ય પર પહોંચે છે.",
    },
  },
  groups: {
    own: "તમારી ડિઝાઇન માટે બનાવેલ",
    fresh: "નવી શરૂઆત",
    skies: "આકાશ અને પ્રકૃતિ",
    crafts: "કળા અને રંગ",
    play: "મજાની અને રમતિયાળ",
    themed: "થીમની પોતાની શરૂઆત",
    tied: "બાંધેલા દ્વાર",
    depth: "થરવાળાં દ્વાર",
    bloom: "ખીલતાં દ્વાર",
    painted: "ચિત્રિત દ્વાર",
    doors: "બારણાં અને દરવાજા",
    reveals: "પડદા અને ખૂલતી ક્ષણો",
    light: "પ્રકાશ અને ફૂલ",
    party: "પાર્ટી",
  },
  welcomeHeading: "પછી આવતું સ્વાગત",
  welcomeIntro:
    "પાનાં પહેલાં તમારાં નામ સાથે એક પળ. આપમેળે પસંદ કરશો તો મહેમાન જ્યારે પણ ખોલે ત્યારે આમંત્રણને અનુરૂપ નવું દૃશ્ય દેખાશે.",
  welcomeAuto: "આપમેળે",
  welcomeNames: {
    royal: "મહેલનું તોરણ",
    bloom: "કમળ",
    lamps: "દીવડા",
    night: "ચાંદ અને ફાનસ",
    party: "રંગીન વરસાદ",
    letter: "પત્ર",
    mandala: "મંડલ",
    peacock: "મોર",
    sunrise: "સૂર્યોદય",
    garden: "બગીચો",
    rangoli: "રંગોળી",
    ghat: "સાંજનો ઘાટ",
    fireflies: "આગિયા",
    "sky-lanterns": "આકાશી ફાનસ",
    kites: "પતંગ",
    waves: "દરિયે સૂર્યાસ્ત",
  },
  godHeading: "ઉપર ભગવાન કે શુભ ચિહ્ન",
  godIntro: "ઉપર વચ્ચે પૂરેપૂરું દેખાય છે, કોઈ શબ્દની નીચે નહીં. ભગવાન વગર ખોલવું હોય તો રહેવા દો.",
  noGod: "કોઈ નહીં",
  gods: {
    ganesha: "ગણેશજી",
    "ganesha-gold": "સોનેરી ગણેશજી",
    "lakshmi-ganesha": "લક્ષ્મી-ગણેશ",
    shrinathji: "શ્રીનાથજી",
    venkateswara: "વેંકટેશ્વર",
    jagannath: "જગન્નાથ",
    om: "ૐ",
    swastik: "સ્વસ્તિક",
    kalash: "મંગળ કળશ",
    diya: "દીવો",
    prajapati: "પ્રજાપતિ",
    suzhi: "પિલ્લૈયાર સુળિ",
    shri: "શ્રી",
    shankh: "શંખ",
    kamal: "કમળ",
    "ik-onkar": "ઇક ઓંકાર",
    khanda: "ખંડા",
    "chand-tara": "ચાંદ-તારો",
    "786": "786",
    bismillah: "બિસ્મિલ્લાહ",
    cross: "ક્રૉસ",
    dove: "કબૂતર",
    jain: "જૈન પ્રતીક",
  },
};

export const quickCopy: Translation<typeof en.quickCopy> = {
  metaTitle: (name) => `તમારું આમંત્રણ બનાવો: ${name}`,
  back: "પાછા",
  watch: "ડેમો જુઓ",
  preview: "પ્રીવ્યૂ",
  free: "અજમાવવું મફત છે. પૈસા ફક્ત મોકલતી વખતે.",
  eyebrow: "તેને તમારું બનાવો",
  title: "થોડી જ મિનિટોમાં તમારું આમંત્રણ",
  intro:
    "તમારાં નામ લખો, તે ડિઝાઇન પર દેખાવા લાગશે. શબ્દો, સંગીત અને જવાબના સવાલો આપમેળે ભરાઈ જાય છે.",
  whenHeading: "ક્યારે અને ક્યાં",
  addFunction: "બીજો પ્રસંગ ઉમેરો",
  addOne: (name) => `${name} ઉમેરો`,
  remove: (name) => `${name} કાઢો`,
  familyTitle: "પરિવારનાં નામ",
  familyIntro: "ઇચ્છો તો: માતા-પિતા, આશીર્વાદ અને મહેમાનો કોને ફોન કરે",
  photosTitle: "તમારા ફોટા",
  photosIntro: "ઇચ્છો તો: ડિઝાઇનમાં તમારા ફોટા માટે ફ્રેમ છે",
  see: "મારું આમંત્રણ જુઓ",
  nothingToPay: "હમણાં કંઈ ચૂકવવાનું નથી",
  more: "વધુ વિકલ્પો",
  moreIntro: "તમારું ગીત, શબ્દો, ખૂલવાનો દરવાજો અને સવાલો",
  make: "સમય ઓછો છે? અમે તમારા માટે બનાવી આપીશું",
  hideMake: "આ છુપાવો",
  pickEvents: "તમારા પ્રસંગો",
  moreEvents: "વધુ પ્રસંગો",
  moreDesigns: (occasion) => `વધુ ${occasion} ડિઝાઇન`,
  moreDesignsNote:
    "તમારા નામ, તારીખો અને ફોટા સાથે જ આવે છે. કોઈ ડિઝાઇન પર ટૅપ કરીને તેમાં તમારું આમંત્રણ જુઓ.",
  opening: "ડિઝાઇન ખૂલી રહી છે…",
};
