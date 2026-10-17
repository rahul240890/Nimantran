import type * as en from "../gallery";
import type { Translation } from "@/i18n/text";

/* ગુજરાતી: ગૅલેરીના પ્રસંગો, લગ્નના પ્રકાર, શોધ અને ડિઝાઇનની ઝલક. English: src/content/gallery.ts. Draft for a native proofreader. */

export const galleryCopy: Translation<typeof en.galleryCopy> = {
  metaTitle: "દરેક પ્રસંગ માટે આમંત્રણ ડિઝાઇન",
  metaDescription:
    "પસંદ કરો કે આપ શું ઉજવી રહ્યા છો, પછી તેના માટે જ બનેલી ડિઝાઇન: પરંપરા પ્રમાણે લગ્ન, પીઠી, સંગીત અને બીજું ઘણું, ચિત્રવાળાં પાનાં અને જવાબ સાથે.",
  eyebrow: "આમંત્રણ બનાવો",
  heading: "આપ શું ઉજવી રહ્યા છો?",
  intro:
    "પ્રસંગ પસંદ કરો, પછી તેના માટે જ બનેલી ડિઝાઇન. દૃશ્યમાં બધું એક જ ચિત્ર પર હોય છે, અને દરેક પ્રસંગ વારાફરતી ઊડીને આવે છે. વાર્તામાં દરેક પ્રસંગનું પોતાનું પૂરી સ્ક્રીનનું ચિત્રવાળું પાનું હોય છે. બંનેમાં જવાબ આપવાની સુવિધા સાથે જ છે.",
  searchLabel: "પ્રસંગો અને ડિઝાઇન શોધો",
  searchPlaceholder: "જેમ કે ગુજરાતી લગ્ન, પીઠી, જન્મદિવસ…",
  clearSearch: "શોધ સાફ કરો",
  results: (count: number) =>
    count === 0 ? "હજુ કંઈ મળ્યું નથી" : count === 1 ? "1 પરિણામ" : `${count} પરિણામ`,
  noResults: "આનાથી હજુ કંઈ મળ્યું નથી. બીજો શબ્દ અજમાવો, અથવા નીચે પ્રસંગો જુઓ.",
  resultKinds: { occasion: "પ્રસંગ", kind: "લગ્ન", design: "ડિઝાઇન" },
  moreCelebrations: "વધુ ઉજવણીઓ",
  soon: "જલદી આવી રહ્યું છે",
  designsCount: (count: number) => (count === 1 ? "1 ડિઝાઇન" : `${count} ડિઝાઇન`),
  chooseKind: "આપનાં લગ્ન પસંદ કરો",
  chooseKindIntro:
    "દરેક પ્રકારનાં પોતાનાં વિધિઓનાં નામ, આશીર્વચન, ભાષા અને ચિત્રો છે. એડિટરમાં આમાંનું કંઈ પણ બદલી શકાય છે.",
  allWeddingDesigns: "લગ્નની બધી ડિઝાઇન",
  designsHeading: "ડિઝાઇન",
  designsFor: (name: string) => `${name} માટે ડિઝાઇન`,
  kindIntro:
    "ફક્ત આ પ્રકારનાં લગ્ન માટે બનેલી ડિઝાઇન. કાર્ડ તેની પોતાની ભાષામાં લખાય છે, અને સાથે અંગ્રેજી પણ ઉમેરી શકાય છે.",
  card: "3D કાર્ડ",
  formats: {
    label: "આમંત્રણનો પ્રકાર",
    all: "બધા",
    moving: "હલતાં દૃશ્ય",
    storybook: "વાર્તાપોથી",
    scene: "દૃશ્ય",
    story: "વાર્તા",
    card: "3D કાર્ડ",
  },
  tiers: { free: "ફ્રી", premium: "પ્રીમિયમ", royal: "રૉયલ", signature: "સિગ્નેચર" },
  tierPrice: (tier, price) => `${tier} · ${price}`,
  tierLabel: (tier, price) => (price ? `${tier} ડિઝાઇન, ${price} થી પ્રકાશિત કરો` : "ફ્રી ડિઝાઇન"),
  photoNeeds: {
    none: "ફોટાની જરૂર નથી",
    one: "એક ફોટો",
    couple: "જોડીનો એક ફોટો",
    two: "બે ફોટા, બંનેનો એક-એક",
    either: "જોડીનો ફોટો કે બે અલગ",
    optional: "ફોટા મરજિયાત",
  },
  sceneBadge: "દૃશ્ય · 1 પાનું",
  trendingBadge: "ટ્રેન્ડિંગ",
  movingBadge: "હલતું ચિત્ર",
  storyBadge: (count) => `વાર્તા · ${count} પાનાં`,
  sceneNote:
    "આપના ફોટા અને નામવાળું એક ચિત્ર. દરેક પ્રસંગ વારાફરતી ઊડીને આવે છે, અને ચિત્રનો પ્રકાશ સવારથી રાત સુધી તેની સાથે બદલાય છે.",
  sample: {
    first: "અર્જુન",
    second: "સિયા",
    one: "આન્યા",
    blessing: "શ્રી ગણેશજીના આશીર્વાદ સાથે",
    faithNames: {
      sikh: { first: "અર્જન", second: "સિમરન" },
      muslim: { first: "અયાન", second: "ઝોયા" },
      christian: { first: "જોએલ", second: "ઍના" },
      jain: { first: "ઋષભ", second: "વિધિ" },
    },
    families: "તેમના પરિવારો સાથે",
    line: "આપને સહ પરિવાર સાદર આમંત્રણ પાઠવે છે",
    venues: {
      haldi: "ઘરનું આંગણું, જયપુર",
      mehendi: "હવેલીનો ચોક, જયપુર",
      sangeet: "અગાસી પરનું લૉન, જયપુર",
      baraat: "હોટેલના દરવાજેથી",
      wedding: "રામબાગ પૅલેસ, જયપુર",
      reception: "જય મહેલ, જયપુર",
      other: "ગાર્ડન લૉન્સ, જયપુર",
    },
  },
  pagesCount: (count: number) => `${count} પાનાં`,
  preview: (name: string) => `${name} ની ઝલક જુઓ`,
  designImage: (name: string, occasion: string, description: string) =>
    `${name}: ${occasion} આમંત્રણ ડિઝાઇન. ${description}`,
  kindOccasion: (name: string) => `${name} લગ્ન`,
  useDesign: "આ ડિઝાઇન વાપરો",
  packagesHeading: "આ ડિઝાઇન માટે પૅકેજ",
  packageFree: "મફત",
  comparePackages: "પૅકેજની સરખામણી કરો",
  seeSample: "મહેમાનની જેમ ખોલો",
  sampleLabel: "નમૂનાનું આમંત્રણ",
  sampleNote: "નામ, તારીખો અને સ્થળો કાલ્પનિક છે",
  showAll: (count: number) => `બધી ${count} ડિઝાઇન બતાવો`,
  sampleChoose: "આ ડિઝાઇન પસંદ કરો",
  sampleChooseShort: "પસંદ કરો",
  sampleBack: "પાછા",
  sampleWalk: "બીજી ડિઝાઇન",
  samplePrevious: "પાછલી ડિઝાઇન",
  samplePreviousShort: "પાછલી",
  sampleNext: "આગલી ડિઝાઇન",
  sampleNextShort: "આગલી",
  sampleTitle: (name) => `નમૂનાનું આમંત્રણ: ${name}`,
  sampleDescription:
    "આ ડિઝાઇન એ રીતે જુઓ જેમ આપના મહેમાનો જોશે: તે ખૂલે છે, સંગીત વગાડે છે અને જવાબ લે છે.",
  close: "ઝલક બંધ કરો",
  pagesLabel: "આ ડિઝાઇનનાં પાનાં",
  cardNote: "મહેમાનના ફોન પર ખૂલતું 3D કાર્ડ, પછી કાર્ડના પોતાના રંગોમાં પાનાં.",
  pageNames: {
    blessing: "આશીર્વાદ",
    cover: "મુખપૃષ્ઠ",
    family: "પરિવાર",
    haldi: "પીઠી",
    mehendi: "મહેંદી",
    sangeet: "સંગીત",
    baraat: "જાન",
    wedding: "લગ્ન",
    reception: "સ્વાગત સમારંભ",
    reply: "જવાબ",
  },
  previous: "પાછલું પાનું",
  next: "આગલું પાનું",
  pageOf: (index: number, total: number) => `${total} માંથી પાનું ${index}`,
  breadcrumb: "આમંત્રણ",
  kindMeta: (name: string) => ({
    title: `${name} લગ્નનાં આમંત્રણ`,
    description: `${name} પરિવારો માટે લગ્નનાં આમંત્રણ: દરેક પ્રસંગનું ચિત્રવાળું પાનું, દરેક વિધિ તેના પોતાના નામે, અને WhatsApp પર જવાબ.`,
  }),
  kindSearch: {
    gujarati: {
      title: "ગુજરાતી લગ્નની ડિજિટલ કંકોતરી",
      description:
        "ગુજરાતી લગ્નની ડિજિટલ કંકોતરી: શ્રી ગણેશ, મંડપ મુહૂર્તથી પીઠી અને રાસ સુધી દરેક પ્રસંગ પોતાના પાને, WhatsApp પર જવાબ. મફત બનાવો.",
    },
  },
  moreOccasions: "વધુ પ્રસંગો",
  wordingHeading: "આમંત્રણના શબ્દો",
  wordingIntro: "કાર્ડ અને WhatsApp માટે કૉપી કરવા જેવા સંદેશ, અમારા બ્લૉગમાંથી.",
};

export const sectionNames: Translation<typeof en.sectionNames> = {
  wedding: "લગ્નની સફર",
  family: "પરિવારની પળો",
  parties: "પાર્ટી અને કૉલેજ",
  festivals: "તહેવારો",
  business: "વેપાર",
};

export const occasionTaglines: Translation<typeof en.occasionTaglines> = {
  wedding: "દરેક પ્રસંગ, પરંપરા પ્રમાણે",
  engagement: "વીંટી અને પહેલી ઉજવણી",
  roka: "પરિવારોની હા",
  "save-the-date": "પહેલેથી જણાવી દો",
  haldi: "પીઠી અને ગલગોટા",
  mehendi: "મહેંદી અને નિરાંતની બપોર",
  sangeet: "ગીત, નૃત્ય અને ઢોલક",
  reception: "ફેરા પછી ભોજન",
  anniversary: "સાથનાં વર્ષો, ઉજવણી સાથે",
  birthday: "પહેલા જન્મદિવસથી સાઠમા સુધી",
  "baby-shower": "સીમંત અને આશીર્વાદ",
  "naming-ceremony": "નવા નામનું સ્વાગત",
  mundan: "પહેલી વાર વાળ ઉતારવા",
  housewarming: "ગૃહપ્રવેશ",
  puja: "સત્યનારાયણ, હવન, જાગરણ",
  "thread-ceremony": "જનોઈ અને ઉપનયન",
  "fresher-party": "નવી બૅચનું સ્વાગત",
  "welcome-party": "નવા ચહેરાઓ માટે",
  "farewell-party": "પ્રેમભરી વિદાય",
  "kitty-party": "દર મહિનાની મહેફિલ",
  reunion: "જૂના મિત્રો, એક સાંજ",
  retirement: "એક કારકિર્દીની ઉજવણી",
  party: "અગાસી, સંગીત અને મિત્રો",
  diwali: "દીવા અને જમણવાર",
  lohri: "તાપણું અને ભાંગડા",
  sankranti: "પતંગ અને પોંગલ",
  onam: "પૂક્કલમ અને સદ્યા",
  janmashtami: "કાનુડાનો જન્મદિવસ",
  "prayer-meet": "પ્રેમભરી સ્મૃતિમાં",
  christening: "બાપ્તિસ્મા અને ભોજન",
  annaprashan: "પહેલું અન્ન",
  holi: "રંગ અને ઘૂઘરા",
  navratri: "ગરબાની નવ રાત",
  "ganesh-chaturthi": "બાપ્પા ઘરે પધાર્યા",
  eid: "ઈદ મિલન અને દાવત",
  graduation: "ગ્રેજ્યુએટ માટે એક સાંજ",
  "gudi-padwa": "ગુડી, લીમડો અને પૂરણપોળી",
  baisakhi: "પાક, ભાંગડા અને ગિદ્ધા",
  bihu: "બિહુ ગીત, નૃત્ય અને પીઠા",
  "raksha-bandhan": "રાખડી, મીઠાઈ અને પરિવારનું ભોજન",
  "karva-chauth": "વ્રત, ચંદ્ર અને રાતનું ભોજન",
  christmas: "કૅરલ અને કેક",
  "shop-opening": "ઉદ્ઘાટન અને પૂજા",
  launch: "કંઈક નવું",
  "office-party": "આખી ટીમ સાથે",
};

export const weddingKindCopy: Translation<typeof en.weddingKindCopy> = {
  "north-indian": {
    name: "ઉત્તર ભારતીય",
    description: "તિલક, બારાત અને શુભ વિવાહ, હિન્દી અને અંગ્રેજીમાં.",
  },
  gujarati: {
    name: "ગુજરાતી",
    description: "ગણેશ સ્થાપના, મામેરું, રાસ ગરબા અને હસ્તમેળાપ, ગુજરાતીમાં.",
  },
  rajasthani: {
    name: "રાજસ્થાની અને મારવાડી",
    description: "વિનાયક સ્થાપના, માયરા, નિકાસી અને તોરણ, હિન્દીમાં.",
  },
  marathi: {
    name: "મરાઠી",
    description: "સાખરપુડા, હળદ, કેળવણ અને શુભવિવાહ, મરાઠીમાં.",
  },
  bengali: {
    name: "બંગાળી, ઓડિયા અને આસામી",
    description: "આઇબુડોભાત, ગાયે હોલુદ, શુભો બિબાહો અને બૌ ભાત, બંગાળીમાં.",
  },
  tamil: {
    name: "તમિલ અને દક્ષિણ ભારતીય",
    description: "નિચ્ચયતાર્થમ, નલંગુ અને તિરુમણમ, તમિલમાં.",
  },
  punjabi: {
    name: "પંજાબી અને શીખ",
    description: "ઢોલ અને સરસવનાં ખેતરોવાળી ફૂલકારી હવેલી.",
  },
  muslim: {
    name: "નિકાહ અને વલીમા",
    description: "સફેદ આરસ અને જાળીવાળો મુઘલ બાગ.",
  },
  modern: {
    name: "આધુનિક",
    description: "દરેક પરિવાર માટે સાદાં કાર્ડ, અંગ્રેજી કે હિન્દીમાં.",
  },
};

export const catalogCopy: Translation<typeof en.catalogCopy> = {
  searchLabel: "ડિઝાઇન શોધો",
  searchPlaceholder: "નામ, સ્થળ કે પરંપરાથી શોધો…",
  occasionLabel: "પ્રસંગ",
  allOccasions: "બધા પ્રસંગો",
  traditionLabel: "લગ્નની પરંપરા",
  allTraditions: "બધી પરંપરાઓ",
  count: (count: number) => (count === 1 ? "1 ડિઝાઇન" : `${count} ડિઝાઇન`),
  clear: "ફિલ્ટર હટાવો",
  empty: "આ બધા સાથે મેળ ખાતી કોઈ ડિઝાઇન હજુ નથી. ઓછા ફિલ્ટર અજમાવો.",
  photosLabel: "ચિત્ર કે ફોટા",
  allPhotos: "કોઈ પણ",
  photoGroups: { none: "ચિત્રવાળી", one: "જોડીનો ફોટો", two: "વર-કન્યાના ફોટા" },
  allDesigns: "બધી ડિઝાઇન",
  moreOccasions: "વધુ પ્રસંગો",
  fewerOccasions: "ઓછા પ્રસંગો",
  moreFilters: (chosen) => (chosen ? `વધુ ફિલ્ટર (${chosen})` : "વધુ ફિલ્ટર"),
  fewerFilters: "ઓછા ફિલ્ટર",
  priceLabel: "કિંમત",
  allPrices: "કોઈ પણ કિંમત",
  sortLabel: "ડિઝાઇનનો ક્રમ",
  sorts: {
    recommended: "સૂચવેલી",
    "price-low": "કિંમત: ઓછીથી વધુ",
    "price-high": "કિંમત: વધુથી ઓછી",
  },
};

/** સંગ્રહ: ડિઝાઇન તેમના દેખાવ અને ભાવ પ્રમાણે. */
export const collectionCopy: Translation<typeof en.collectionCopy> = {
  heading: "સંગ્રહમાંથી પસંદ કરો",
  intro: "દરેક ડિઝાઇન તેના દેખાવ અને ભાવ પ્રમાણે એક સંગ્રહમાં છે.",
  label: "સંગ્રહ",
  all: "બધા સંગ્રહ",
  groups: { wedding: "લગ્નના સંગ્રહ", celebration: "દરેક ઉજવણી માટે" },
  rowsHeading: "સંગ્રહ",
  name: (name: string) => `${name} સંગ્રહ`,
  names: {
    "royal-wedding": {
      name: "શાહી લગ્ન",
      intro: "મહેલ, કિલ્લા અને હવેલીઓ, ભવ્ય ઉજવણી માટે શણગારેલાં.",
    },
    nawabi: { name: "નવાબી નિકાહ", intro: "મુઘલ બાગ, અવધી કમાનો અને સૂફી રાતો." },
    divine: { name: "દિવ્ય આશીર્વાદ", intro: "મંદિર, ઘાટ અને પવિત્ર કળા, શુભ શરૂઆત માટે." },
    "folk-art": {
      name: "લોકકળા",
      intro: "મધુબની, વારલી, ગોંડ, પિછવાઈ અને બીજું ઘણું, હાથે ચીતરેલું.",
    },
    "silk-thread": {
      name: "રેશમ અને દોરો",
      intro: "પટોળા, બાંધણી, ફૂલકારી, કાંજીવરમ સિલ્ક અને કુંદન.",
    },
    garden: { name: "બાગનાં ફૂલ", intro: "ગુલમહોર, ગુલાબ, મોગરો અને ખીલેલાં પિયોની." },
    destination: {
      name: "ડેસ્ટિનેશન અને પ્રકૃતિ",
      intro: "દરિયાકિનારા, બૅકવૉટર, પહાડ અને સરોવર.",
    },
    modern: { name: "મૉડર્ન મિનિમલ", intro: "સ્વચ્છ રેખાઓ, હળવા રંગ અને શાંત જગ્યા." },
    "love-story": {
      name: "પ્રેમકહાણી",
      intro: "સેવ ધ ડેટ અને સગાઈ, રમતિયાળ રોમૅન્ટિક અંદાજમાં.",
    },
    functions: { name: "પીઠી, મહેંદી અને સંગીત", intro: "લગ્નનો દરેક પ્રસંગ, રોકાથી વિદાય સુધી." },
    storybook: { name: "વાર્તાપોથી", intro: "નવ ચિત્રવાળાં પાનાંમાં કહેલી એક વાર્તા." },
    "little-wonders": { name: "નાનાં સપનાં", intro: "બાળકોને ગમે તેવી જન્મદિવસ પાર્ટીઓ." },
    baby: { name: "બાળ આશીર્વાદ", intro: "સીમંત, નામકરણ અને અન્નપ્રાશન." },
    milestones: {
      name: "પરિવારના ખાસ પડાવ",
      intro: "લગ્નજયંતી, ખાસ જન્મદિવસ, ગૃહપ્રવેશ અને નિવૃત્તિ.",
    },
    festivals: {
      name: "તહેવારો",
      intro: "દિવાળી, ઈદ, હોળી, નવરાત્રી, ઓણમ, ક્રિસમસ અને બીજા ઘણા.",
    },
    parties: { name: "પાર્ટી નાઇટ્સ", intro: "અગાસી પાર્ટી, રીયુનિયન, કિટી પાર્ટી અને વિદાય." },
    business: { name: "વેપાર અને લૉન્ચ", intro: "દુકાનનું ઉદ્ઘાટન, મુહૂર્ત અને લૉન્ચ." },
    "cards-3d": { name: "ક્લાસિક 3D કાર્ડ", intro: "મહેમાનના હાથમાં 3D માં ખૂલતાં કાર્ડ." },
  },
};

export const shelfCopy: Translation<typeof en.shelfCopy> = {
  trending: {
    group: "ટ્રેન્ડિંગ",
    title: "હમણાં ટ્રેન્ડિંગ",
    intro: "યજમાનો અત્યારે સૌથી વધુ પસંદ કરે છે તે ડિઝાઇન.",
  },
  groups: {
    moving: "નવું: હલતાં દૃશ્ય",
    photos: "ચિત્રવાળી કે આપના ફોટા સાથે",
    format: "આમંત્રણના પ્રકાર પ્રમાણે",
    tradition: "પરંપરા પ્રમાણે લગ્ન",
    occasion: "વધુ ઉજવણીઓ",
  },
  photos: {
    none: {
      title: "ચિત્રવાળાં આમંત્રણ",
      intro: "હાથે ચીતરેલી કળા, આપનાં નામ સાથે. ફોટાની જરૂર નથી.",
    },
    one: {
      title: "જોડીના ફોટાવાળાં આમંત્રણ",
      intro: "આપ બંનેનો મનગમતો ફોટો, ચિત્રની વચ્ચે ગોઠવેલો.",
    },
    two: {
      title: "વર-કન્યાના ફોટા",
      intro: "આપ બંનેનો અલગ-અલગ ફોટો, બાજુ-બાજુમાં ફ્રેમમાં.",
    },
  },
  format: {
    moving: {
      title: "હલતાં દૃશ્ય",
      intro:
        "નાની ફિલ્મની જેમ હલતાં ચિત્રો: પાંખડીઓ ખરે છે, ફાનસ ઊડે છે, પાણી લહેરાય છે. ફોટાની જરૂર નથી.",
    },
    storybook: {
      title: "વાર્તાપોથીઓ",
      intro: "નવ ચિત્રવાળાં પાનાંમાં કહેલી એક વાર્તા, જે પોતાના જ દરવાજેથી ખૂલે છે.",
    },
    story: { title: "વાર્તાઓ", intro: "દરેક પ્રસંગનું પૂરી સ્ક્રીનનું ચિત્રવાળું પાનું." },
    scene: {
      title: "દૃશ્યો",
      intro: "એક જ ચિત્ર પર બધું, દરેક પ્રસંગ વારાફરતી ઊડીને આવે છે.",
    },
    card: { title: "3D કાર્ડ", intro: "મહેમાનના હાથમાં 3D માં ખૂલતું કાર્ડ." },
  },
  tradition: (name: string) => `${name} લગ્ન`,
  traditionsHeading: "આપની પરંપરા પસંદ કરો",
  occasionsHeading: "અથવા બીજી કોઈ ઉજવણી",
  viewAll: "બધી જુઓ",
  viewAllLabel: (title: string, count: number) => `બધી ${count} ડિઝાઇન જુઓ: ${title}`,
  back: "પાછળ",
  next: "આગળ",
};
