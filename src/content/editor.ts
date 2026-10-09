import type { EditorStep, FunctionId } from "@/lib/editor/draft";
import { TEMPLATES } from "@/lib/templates/catalog";
import { TEMPLATE_IDS, type LeadId, type TaalId, type TemplateId } from "@/lib/templates/ids";

/*
 * English copy for the invite editor (/create). Moves into next-intl in Step 12.
 * Slot names come from slotLabels in templates-review.ts.
 */

export const editor = {
  metaTitle: "Create your invitation",
  metaDescription:
    "Choose a 3D design, add your names and functions, then preview your invitation.",
  headerLabel: "Invite editor",
  progressLabel: "Invite progress",
  progress: (step: number, total: number) => `Step ${step} of ${total}`,
  done: "done",
  designChosen: "Your design",
  changeDesign: "Change design",
  /** The three stages the progress shows: pick, fill in, see it. */
  stages: { design: "Design", details: "Your details", preview: "Preview & share" },
  /** The details page: its sections, each folded to one line with what's filled in. */
  sections: {
    label: "Your details, in three parts",
    open: (part: string, summary: string, state: "done" | "todo" | "check") =>
      `${part}: ${summary}${state === "done" ? ", done" : state === "check" ? ", needs a look" : ""}. Open`,
    done: "Done",
    check: "Needs a look",
    edit: "Edit",
    names: (names: string[]) => (names.length ? names.join(" & ") : "Add the names"),
    functions: (names: string[]) =>
      names.length === 0
        ? "Choose your functions"
        : names.length <= 3
          ? names.join(", ")
          : `${names.slice(0, 2).join(", ")} and ${names.length - 2} more`,
    extras: (photos: number, music: boolean) =>
      `${photos === 0 ? "No photos yet" : photos === 1 ? "1 photo" : `${photos} photos`} · ${music ? "music on" : "no music"}`,
  },
  back: "Back",
  next: "Continue",
  toPreview: "Preview invitation",
  preview: "Invitation preview",
  showPreview: "Preview",
  previewTitle: "Your invitation",
  livePreview: "Live preview, open it large",
  hideLivePreview: "Hide the live preview",
  showLivePreview: "Show the live preview",
  close: "Close",
  optional: "Optional",
  characters: (used: number, max: number) => `${used} of ${max} characters used`,
  fixErrors: (count: number) =>
    count === 1 ? "One thing needs your attention" : `${count} things need your attention`,
  errors: {
    required: "Please fill this in",
    "too-long": "This is too long for the card",
    "no-functions": "Choose at least one function",
    "photo-needed": "Add this photo. Your design shows it in its frame.",
  },
  save: {
    idle: "Drafts save on this device",
    saving: "Saving…",
    saved: "Draft saved",
    unavailable: "Can't save on this device",
  },
} as const;

/** The header's save status once signed in, and moving between invites. */
export const syncCopy = {
  idle: "Saves to your account",
  syncing: "Saving…",
  synced: "Saved to your account",
  offline: "Saved on this device, retrying",
  missing: "That invite isn't in your account. It may have been deleted.",
  switchFailed: "Couldn't save the invite that's open, so it stays open. Try again in a moment.",
} as const;

export const stepCopy: Record<
  EditorStep,
  { label: string; eyebrow: string; title: string; intro: string }
> = {
  occasion: {
    label: "Occasion",
    eyebrow: "Choose an occasion",
    title: "What are you celebrating?",
    intro:
      "The occasion sets up your invite: the functions it plans, its wording and the designs that suit it. Switch later and nothing you've typed is lost.",
  },
  tradition: {
    label: "Tradition",
    eyebrow: "Choose a tradition",
    title: "Whose tradition should the card follow?",
    intro:
      "A tradition sets the sacred symbol, the invocation, local ceremony names and the family wording. Everything stays editable, and you can skip this step.",
  },
  design: {
    label: "Design",
    eyebrow: "Choose a design",
    title: "Pick the card your guests will open",
    intro:
      "Every design opens in 3D with its own ornaments, petals and raga. You can switch at any time without losing your words.",
  },
  language: {
    label: "Language",
    eyebrow: "Card language",
    title: "Which language is your card in?",
    intro:
      "Everything on the card follows it: the names, the wording, the function names and the dates. The ideas we offer for each line come in this language too.",
  },
  couple: {
    label: "Couple",
    eyebrow: "The couple",
    title: "Who is the couple?",
    intro:
      "Names appear large on the card. The other lines start with wording for your occasion; change them to sound like your family.",
  },
  functions: {
    label: "Functions",
    eyebrow: "Functions",
    title: "When and where is everything?",
    intro:
      "Choose the functions you're inviting guests to. The card shows the main function's date and venue; guests see every function when they open it.",
  },
  extras: {
    label: "Photos & music",
    eyebrow: "Photos and music",
    title: "Make it yours",
    intro:
      "Add the photos your design shows, choose the raga that plays as the card opens, and pick what the RSVP asks.",
  },
  preview: {
    label: "Preview",
    eyebrow: "Preview",
    title: "Here's what your guests will see",
    intro: "Open the card, play the music and read it through once more.",
  },
};

export const functionCopy: Record<
  FunctionId,
  { name: string; description: string; dressIdeas: string[] }
> = {
  roka: {
    name: "Roka",
    description: "The families bless the match and exchange gifts",
    dressIdeas: ["Festive ethnic", "Reds and golds", "Pastel suits and sarees"],
  },
  engagement: {
    name: "Engagement",
    description: "The ring ceremony, sagai or nischayathartham",
    dressIdeas: ["Indo-western", "Pastels and ivory", "Festive ethnic"],
  },
  tilak: {
    name: "Tilak",
    description: "The bride's family blesses the groom with a tilak and gifts",
    dressIdeas: ["Festive ethnic", "Kurta and bandhgala", "Reds and golds"],
  },
  "ganesh-puja": {
    name: "Ganesh puja",
    description: "Ganesh sthapana or pujan, so the celebrations begin without obstacles",
    dressIdeas: ["Traditional Indian", "Yellows and reds", "Simple and elegant"],
  },
  "grah-shanti": {
    name: "Griha shanti",
    description: "A havan at home to bless the family before the wedding",
    dressIdeas: ["Traditional Indian", "Cotton and silk", "Soft pastels"],
  },
  mandap: {
    name: "Mandap muhurat",
    description: "The mandap is raised and blessed; panthakal in the south",
    dressIdeas: ["Traditional Indian", "Bright and colourful", "Comfortable ethnic"],
  },
  mameru: {
    name: "Mameru",
    description: "The maternal uncle's family brings gifts; mayra or bhaat in the north",
    dressIdeas: ["Bandhani and leheriya", "Festive ethnic", "Reds and pinks"],
  },
  haldi: {
    name: "Haldi",
    description: "Turmeric blessings, usually the morning before",
    dressIdeas: ["Shades of yellow", "Whites and pastels", "Clothes you don't mind staining"],
  },
  mehendi: {
    name: "Mehendi",
    description: "Henna, music and an easy afternoon",
    dressIdeas: ["Greens and florals", "Bright and colourful", "Comfortable ethnic"],
  },
  sangeet: {
    name: "Sangeet",
    description: "An evening of songs, dance and performances",
    dressIdeas: ["Indo-western", "Sequins and sparkle", "Jewel tones"],
  },
  garba: {
    name: "Garba night",
    description: "Raas, garba and dandiya till late",
    dressIdeas: ["Chaniya choli and kediyu", "Mirror work", "Bright and colourful"],
  },
  bhoj: {
    name: "Family feast",
    description: "A meal for family and friends: kelvan, aiburobhat or bhojan samarambh",
    dressIdeas: ["Festive ethnic", "Comfortable ethnic", "Smart casual"],
  },
  baraat: {
    name: "Baraat",
    description: "The groom's procession sets out with music and dancing",
    dressIdeas: ["Safas and turbans", "Sherwani and kurta", "Festive ethnic"],
  },
  "baraat-welcome": {
    name: "Baraat welcome",
    description: "The bride's family welcomes the groom's party: milni or jaan aagman",
    dressIdeas: ["Traditional Indian", "Silk and zari", "Festive ethnic"],
  },
  wedding: {
    name: "Wedding",
    description: "The pheras, vows and ceremony",
    dressIdeas: ["Traditional Indian", "Pastels, no black or white", "Silk and zari"],
  },
  vidaai: {
    name: "Vidaai",
    description: "The bride's farewell as she leaves with blessings",
    dressIdeas: ["Traditional Indian", "Soft pastels", "Silk and zari"],
  },
  reception: {
    name: "Reception",
    description: "Dinner and celebration with everyone",
    dressIdeas: ["Formal", "Black tie", "Festive evening wear"],
  },
  birthday: {
    name: "Birthday party",
    description: "Cake, games and blessings for the birthday",
    dressIdeas: ["Pastels", "Smart casual", "Come as you are"],
  },
  anniversary: {
    name: "Anniversary dinner",
    description: "An evening to celebrate the years together",
    dressIdeas: ["Formal", "Festive ethnic", "Reds and golds"],
  },
  party: {
    name: "Party",
    description: "Music, food and friends",
    dressIdeas: ["Smart casual", "Cocktail", "Something that sparkles"],
  },
  "baby-shower": {
    name: "Baby shower",
    description: "Blessings, songs and gifts for the mother-to-be",
    dressIdeas: ["Pastels", "Festive ethnic", "Greens and yellows"],
  },
  diwali: {
    name: "Diwali party",
    description: "Lakshmi puja, diyas, sweets and dinner",
    dressIdeas: ["Festive ethnic", "Reds and golds", "Something that sparkles"],
  },
  housewarming: {
    name: "Griha pravesh",
    description: "Puja, havan and a meal in the new home",
    dressIdeas: ["Festive ethnic", "Pastels", "Comfortable traditional"],
  },
  puja: {
    name: "Puja",
    description: "Katha, aarti and prasad",
    dressIdeas: ["Festive ethnic", "Whites and yellows", "Traditional"],
  },
  "thread-ceremony": {
    name: "Thread ceremony",
    description: "Upanayan, havan and a family meal",
    dressIdeas: ["Traditional", "Whites and golds", "Festive ethnic"],
  },
  annaprashan: {
    name: "First rice ceremony",
    description: "The baby's first taste of rice, with blessings",
    dressIdeas: ["Pastels", "Festive ethnic", "Yellows and whites"],
  },
  christening: {
    name: "Christening",
    description: "Church service and lunch with family",
    dressIdeas: ["Whites and pastels", "Sunday best", "Smart casual"],
  },
  "prayer-meet": {
    name: "Prayer meeting",
    description: "Prayers, bhajans and a moment of remembrance",
    dressIdeas: ["Whites", "Light colours", "Simple and quiet"],
  },
  retirement: {
    name: "Retirement party",
    description: "Dinner and toasts for a career well lived",
    dressIdeas: ["Smart casual", "Formal", "Festive ethnic"],
  },
  "farewell-party": {
    name: "Farewell party",
    description: "Music, memories and a warm goodbye",
    dressIdeas: ["Formal", "Smart casual", "Something that sparkles"],
  },
  "shop-opening": {
    name: "Opening",
    description: "Ribbon cutting, puja and refreshments",
    dressIdeas: ["Festive ethnic", "Smart casual", "Formal"],
  },
  launch: {
    name: "Launch",
    description: "A first look, a few words and dinner",
    dressIdeas: ["Business formal", "Smart casual", "Black tie"],
  },
  "ganesh-chaturthi": {
    name: "Ganpati darshan",
    description: "Aarti, darshan and prasad",
    dressIdeas: ["Festive ethnic", "Yellows and reds", "Traditional"],
  },
  navratri: {
    name: "Navratri night",
    description: "Garba, aarti and bhog",
    dressIdeas: ["Chaniya choli", "Festive ethnic", "Bright colours"],
  },
  janmashtami: {
    name: "Janmashtami",
    description: "Bhajans, jhanki and midnight aarti",
    dressIdeas: ["Festive ethnic", "Yellows and blues", "Little Krishna outfits"],
  },
  onam: {
    name: "Onam sadhya",
    description: "Pookalam, sadhya and songs",
    dressIdeas: ["Kasavu", "Whites and golds", "Festive ethnic"],
  },
  sankranti: {
    name: "Sankranti",
    description: "Kites, til laddoos and pongal",
    dressIdeas: ["Bright colours", "Festive ethnic", "Comfortable for the terrace"],
  },
  lohri: {
    name: "Lohri bonfire",
    description: "Bonfire, rewari, bhangra and dinner",
    dressIdeas: ["Phulkari", "Bright colours", "Something warm"],
  },
  eid: {
    name: "Iftar dawat",
    description: "Breaking the fast, dinner and Eid wishes",
    dressIdeas: ["Festive ethnic", "Whites and greens", "Something elegant"],
  },
  "naming-ceremony": {
    name: "Naming ceremony",
    description: "Naming, blessings and lunch",
    dressIdeas: ["Pastels", "Festive ethnic", "Something comfortable"],
  },
  holi: {
    name: "Holi",
    description: "Colours, music, thandai and lunch",
    dressIdeas: ["Whites", "Old clothes you can colour", "Comfortable shoes"],
  },
  christmas: {
    name: "Christmas party",
    description: "Carols, plum cake and dinner",
    dressIdeas: ["Reds and greens", "Something festive", "Something warm"],
  },
  reunion: {
    name: "Reunion",
    description: "Old friends, stories and dinner",
    dressIdeas: ["Smart casual", "Your old school colours", "Something comfortable"],
  },
  graduation: {
    name: "Graduation party",
    description: "Cake, family and a proud toast",
    dressIdeas: ["Smart casual", "Something festive", "Your college colours"],
  },
  "gudi-padwa": {
    name: "Gudi Padwa",
    description: "The gudi, prayers and a festive lunch",
    dressIdeas: ["Nauvari and kurtas", "Festive ethnic", "Saffron and green"],
  },
  baisakhi: {
    name: "Baisakhi",
    description: "The harvest, bhangra, giddha and dinner",
    dressIdeas: ["Phulkari", "Bright turbans and duppattas", "Festive ethnic"],
  },
  bihu: {
    name: "Bihu",
    description: "Bihu songs, dance and pitha",
    dressIdeas: ["Mekhela chador", "Gamosa", "Festive ethnic"],
  },
  "raksha-bandhan": {
    name: "Raksha Bandhan",
    description: "Rakhi, aarti, sweets and lunch",
    dressIdeas: ["Festive ethnic", "Bright colours", "Something comfortable"],
  },
  "karva-chauth": {
    name: "Karva Chauth",
    description: "The katha, the moonrise and dinner",
    dressIdeas: ["Reds and golds", "Bridal lehenga or saree", "Something festive"],
  },
};

export const functionFields = {
  group: "Functions",
  date: "Date",
  datePlaceholder: "Pick a date",
  time: "Starts at",
  timePlaceholder: "Pick a time",
  venue: "Venue",
  venuePlaceholder: "e.g. Pichola Lakeside Gardens, Udaipur",
  city: "City or venue",
  cityPlaceholder: "e.g. Udaipur",
  cityHint:
    "A save-the-date needs only the date and the city. Times and venues follow in the invite.",
  suggested: (occasion: string) => `${occasion} functions`,
  more: "More functions",
  moreHint: "Add any other function you're inviting guests to.",
  showMore: (count: number) => `Show ${count} more functions`,
  address: "Address",
  addressHint: "Guests see it under the venue's name.",
  pin: "Google Maps pin",
  pinHint:
    "In Google Maps, open the venue, tap Share and paste the link here. Guests get a map and one-tap directions to the exact spot.",
  pinInvalid: "That isn't a Google Maps link. Copy it from Share in Google Maps.",
  parking: "Parking",
  parkingPlaceholder: "Valet at the main gate, free parking behind the hall",
  dressCode: "Dress code",
  dressIdeas: "Dress code ideas",
  onCard: "On the card",
  endTime: "Ends at",
  endHint: "Leave it empty if the evening runs open.",
  muhuratHint:
    "choose the exact start and end, to the minute. Guests see them just as you set them.",
  moreDetails: "More details",
  moreDetailsHint: "End time, address, map pin, parking and dress code",
} as const;

export const coupleCopy = {
  namesHeading: "Names",
  wordingHeading: "Wording",
  example: (sample: string) => `e.g. ${sample}`,
  joinerHint: "The word between the names, like &, weds or संग.",
  doorsHint: "Two short words painted on the gates.",
  anyScript: "Type in any script. Hindi, Tamil, Bengali and more all fit the card.",
  latinOnCard: (language: string) =>
    `Your card is in ${language}, so guests will see this name in English letters. Pick a ${language} spelling below, or type it with a ${language} keyboard.`,
  spellings: (language: string) => `In ${language} letters`,
  useSpelling: (name: string) => `Use ${name}`,
  languagesHeading: "Card language",
  languagesHint: "With two languages, guests switch between them on the invitation.",
  bothLanguages: (main: string, second: string) => `${main} and ${second}`,
  secondHeading: (language: string) => `The card in ${language}`,
  secondHint: (main: string) => `Leave a line empty to repeat the ${main} card's words.`,
  ideas: "Ideas",
  ideasLabel: (field: string) => `Ideas for ${field}`,
  useIdea: (text: string) => `Use “${text}”`,
  moreWording: "More card words",
  moreWordingHint: "Gate words and the family line. Each starts with wording for your occasion.",
  cardIn: "Card language:",
  changeLanguage: "Change language",
} as const;

/** The language step: the card's language, asked before anything is written. */
export const languageCopy = {
  mainHeading: "Card language",
  traditionMatch: "Your tradition's",
  secondHeading: "Add a second language?",
  secondHint:
    "Guests switch between the two on the invitation. A second language comes with the Premium and Royal editions.",
  secondNone: "Only one language",
  secondLabel: "Second language",
} as const;

/**
 * The names step for occasions beyond weddings (Step 12p): its own title, and for a card
 * led by one name (a birthday, a party), what that name is.
 */
export const namesCopy = {
  steps: {
    birthday: { label: "Birthday", eyebrow: "The birthday", title: "Whose birthday is it?" },
    anniversary: { label: "Couple", eyebrow: "The couple", title: "Who is celebrating?" },
    party: { label: "Party", eyebrow: "The party", title: "What's the party called?" },
    "baby-shower": {
      label: "Mother-to-be",
      eyebrow: "The baby shower",
      title: "Who is the mother-to-be?",
    },
    diwali: { label: "Diwali", eyebrow: "Diwali", title: "What's your Diwali party called?" },
    housewarming: { label: "Home", eyebrow: "The new home", title: "What's the new home called?" },
    puja: { label: "Puja", eyebrow: "The puja", title: "Which puja are you holding?" },
    "thread-ceremony": {
      label: "Boy",
      eyebrow: "The thread ceremony",
      title: "Whose thread ceremony is it?",
    },
    annaprashan: { label: "Baby", eyebrow: "The annaprashan", title: "What's the baby's name?" },
    christening: { label: "Baby", eyebrow: "The christening", title: "What's the baby's name?" },
    "prayer-meet": {
      label: "In memory",
      eyebrow: "The prayer meeting",
      title: "Who are you remembering?",
    },
    retirement: { label: "Retiree", eyebrow: "The retirement", title: "Who is retiring?" },
    "farewell-party": {
      label: "Farewell",
      eyebrow: "The farewell",
      title: "Who are you saying goodbye to?",
    },
    "shop-opening": {
      label: "Business",
      eyebrow: "The opening",
      title: "What's the business called?",
    },
    launch: { label: "Event", eyebrow: "The launch", title: "What are you launching?" },
    "ganesh-chaturthi": {
      label: "Ganpati",
      eyebrow: "Ganesh Chaturthi",
      title: "What do you call your Ganpati celebration?",
    },
    navratri: {
      label: "Celebration",
      eyebrow: "Navratri",
      title: "What's your Navratri celebration called?",
    },
    janmashtami: {
      label: "Celebration",
      eyebrow: "Janmashtami",
      title: "What's your Janmashtami celebration called?",
    },
    onam: { label: "Celebration", eyebrow: "Onam", title: "What's your Onam gathering called?" },
    sankranti: {
      label: "Celebration",
      eyebrow: "Sankranti",
      title: "What's your Sankranti gathering called?",
    },
    lohri: { label: "Celebration", eyebrow: "Lohri", title: "What's your Lohri night called?" },
    eid: { label: "Dawat", eyebrow: "Eid and iftar", title: "What's your dawat called?" },
    "naming-ceremony": {
      label: "Baby",
      eyebrow: "The naming ceremony",
      title: "What's the baby's name?",
    },
    holi: { label: "Celebration", eyebrow: "Holi", title: "What's your Holi party called?" },
    christmas: {
      label: "Party",
      eyebrow: "Christmas",
      title: "What's your Christmas party called?",
    },
    reunion: {
      label: "Reunion",
      eyebrow: "The reunion",
      title: "Which batch or group is meeting?",
    },
    graduation: { label: "Graduate", eyebrow: "The graduation", title: "Who is graduating?" },
    "gudi-padwa": {
      label: "Celebration",
      eyebrow: "Gudi Padwa and Ugadi",
      title: "What's your new year gathering called?",
    },
    baisakhi: {
      label: "Celebration",
      eyebrow: "Baisakhi",
      title: "What's your Baisakhi celebration called?",
    },
    bihu: { label: "Celebration", eyebrow: "Bihu", title: "What's your Bihu celebration called?" },
    "raksha-bandhan": {
      label: "Sister and brother",
      eyebrow: "Raksha Bandhan",
      title: "Whose Raksha Bandhan is it?",
    },
    "karva-chauth": { label: "Couple", eyebrow: "Karva Chauth", title: "Who is celebrating?" },
  },
  one: {
    birthday: { label: "Birthday name", example: "Aarav" },
    party: { label: "Party name", example: "Diwali Night" },
    "baby-shower": { label: "Her name", example: "Priya" },
    diwali: { label: "Party name", example: "Sharma Family Diwali" },
    housewarming: { label: "Home or family name", example: "Sharma Niwas" },
    puja: { label: "Puja name", example: "Satyanarayan Katha" },
    "thread-ceremony": { label: "His name", example: "Aarav" },
    annaprashan: { label: "Baby's name", example: "Anaya" },
    christening: { label: "Baby's name", example: "Aaron" },
    "prayer-meet": { label: "Their name", example: "Shri R. K. Sharma" },
    retirement: { label: "Their name", example: "R. K. Sharma" },
    "farewell-party": { label: "Name or batch", example: "Batch of 2026" },
    "shop-opening": { label: "Business name", example: "Sharma Jewellers" },
    launch: { label: "Event name", example: "The Aurora Launch" },
    "ganesh-chaturthi": { label: "Celebration name", example: "Sharma Family Ganpati" },
    navratri: { label: "Celebration name", example: "Navratri Utsav" },
    janmashtami: { label: "Celebration name", example: "Krishna Janmotsav" },
    onam: { label: "Celebration name", example: "Onam Sadhya" },
    sankranti: { label: "Celebration name", example: "Kite Day" },
    lohri: { label: "Celebration name", example: "Lohri Night" },
    eid: { label: "Dawat name", example: "Iftar Dawat" },
    "naming-ceremony": { label: "Baby's name", example: "Anaya" },
    holi: { label: "Celebration name", example: "Holi Milan" },
    christmas: { label: "Party name", example: "Christmas Party" },
    reunion: { label: "Batch or group", example: "Batch of 2006" },
    graduation: { label: "Graduate's name", example: "Riya" },
    "gudi-padwa": { label: "Celebration name", example: "Gudi Padwa Lunch" },
    baisakhi: { label: "Celebration name", example: "Baisakhi Mela" },
    bihu: { label: "Celebration name", example: "Rongali Bihu" },
  },
  oneHint: "It's printed large on the cover. Say who invites and why in the wording below.",
} as const;

const LEAD_NAMES: Record<LeadId, string> = {
  santoor: "Santoor",
  sitar: "Sitar",
  bansuri: "Bansuri",
  shehnai: "Shehnai",
  veena: "Veena",
};

const TAAL_NAMES: Record<TaalId, string> = {
  keherwa: "dholak",
  dadra: "dholak",
  garba: "garba dhol and claps",
  bhangra: "Punjabi dhol",
};

export const extrasCopy = {
  photosHeading: "Photos",
  photosHint: (max: number) =>
    `Up to ${max} photos. They're shrunk on your phone before saving, so they load fast for guests.`,
  addPhotos: "Add photos",
  dropHere: "or drop them here",
  photo: (index: number) => `Photo ${index}`,
  removePhoto: (index: number) => `Remove photo ${index}`,
  moveEarlier: (index: number) => `Move photo ${index} earlier`,
  full: (max: number) => `That's all ${max}. Remove one to add another.`,
  processing: "Preparing photos…",
  photoFailed: "That photo couldn't be read. Try a JPEG or PNG.",
  storageFailed: "Photos can't be saved in this browser, for example in private mode.",
  emptyPhotos: "No photos yet",
  emptyPhotosBody: "Couple portraits and pre-wedding shots work best.",
  coupleHeading: "Photo page",
  coupleHint:
    "Your photo inside the theme's own frame, on the page after your names. Every theme has its own frame shape.",
  coupleLayouts: {
    none: "No photo page",
    one: "One photo of you both",
    two: "Two photos, one each",
  },
  /** A birthday or party has one guest of honour. */
  photoHintOne: "A photo inside the theme's own frame, on the page after the name.",
  photoLayoutsOne: {
    none: "No photo page",
    one: "One photo",
  },
  coupleAddFirst: "Add a photo above and it fills the frame.",
  designPhotosHeading: "Photos for your design",
  designPhotosHint: (frames: number) =>
    frames === 1
      ? "Your design has a photo frame. Add the photo that goes in it."
      : "Your design has two photo frames. Add a photo for each.",
  framePhotos: {
    together: "Photo of you both",
    one: "Your photo",
    of: (name: string) => `${name}'s photo`,
    first: "First photo",
    second: "Second photo",
  },
  addFramePhoto: (frame: string) => `Add: ${frame}`,
  changeFramePhoto: (frame: string) => `Change: ${frame}`,
  framePhotoAdded: "Added",
  framePhotoNeeded: "Needed",
  changePhoto: "Change photo",
  galleryHeading: "More photos",
  galleryHint: (max: number) =>
    `Optional. Guests can scroll through these on the invitation. Up to ${max} photos in all.`,
  coupleFrame: (index: number, frames: number) =>
    frames === 1 ? "Photo in the frame" : index === 1 ? "First frame" : "Second frame",
  useThisPhoto: (index: number) => `Photo ${index}`,
  fitHeading: "Fit your photos",
  fitHint: "Move, zoom and straighten each photo so it sits well in its frame.",
  adjust: "Adjust",
  adjustLabel: (frame: string) => `Adjust the photo: ${frame}`,
  adjusted: "Adjusted",
  adjustTitle: "Adjust photo",
  adjustDescription: "Drag the photo to move it. Pinch, scroll or use the slider to zoom.",
  adjustStage: "The photo in its frame. Use the arrow keys to move it, and plus or minus to zoom.",
  zoom: "Zoom",
  straighten: "Straighten",
  turn: "Turn",
  turnLabel: "Turn the photo a quarter to the right",
  resetPhoto: "Reset",
  savePhoto: "Save",
  cancelPhoto: "Cancel",
  closePhoto: "Close",
  musicHeading: "Music",
  musicHint: "A raga composed live as the card opens, or a short clip of your own music.",
  musicSource: { raga: "A raga", own: "Your own music" },
  ragaHint: "Composed live, so it costs your guests no data.",
  ownHint:
    "Pick a song or a recording from your phone and keep the part you love, up to 30 seconds. Guests hear it when the card opens, and it plays in your video too.",
  chooseSong: "Choose a song",
  songTypes: "MP3, M4A, WAV or AAC",
  readingSong: "Reading your song…",
  songFailed: "That file couldn't be read. Try an MP3 or M4A file.",
  clipFailed: "The clip couldn't be made in this browser. Try Chrome or Safari.",
  clipStorageFailed: "Music can't be saved in this browser, for example in private mode.",
  trimHeading: "Keep the part you love",
  waveformLabel: (name: string) => `The shape of ${name}, with the part you keep lit`,
  startAt: "Starts at",
  clipLength: "Length",
  seconds: (n: number) => `${n} seconds`,
  secondsShort: (n: number) => `${n}s`,
  playPart: "Play this part",
  stopPart: "Stop",
  rights: "I have the right to use this music",
  rightsHint:
    "Use your own recording, a song you've licensed, or royalty-free music. Clips downloaded from Instagram or YouTube usually aren't allowed, and we remove music when its owner asks.",
  useClip: "Use this music",
  makingClip: "Making your clip…",
  cancelTrim: "Cancel",
  changeClip: "Change",
  removeClip: "Remove",
  listenClip: "Listen",
  clipMeta: (n: number) => `Your music · ${n} seconds`,
  listen: (raga: string) => `Listen to ${raga}`,
  stopListening: "Stop listening",
  designsOwn: "Design's own",
  playOnOpen: "Play music when guests open the card",
  playOnOpenHint: "Guests can pause it at any time.",
  pacing: {
    heading: "Time on each page",
    hint: "The music and the reel run as long as your pages. Auto gives each page the time its words need.",
    auto: "Auto",
    seconds: (n: number) => `${n}s`,
    summary: (pages: number, live: number, reel: number) =>
      `${pages} pages: about ${live} seconds of music on the invitation, and a ${reel} second reel.`,
  },
  questionsHeading: "Questions for guests",
  questionsHint:
    "Every reply says who's coming to each function and can include a note. Tick anything else you'd like to know.",
  questionHints: {
    meal: "Vegetarian, Jain, non-vegetarian or vegan",
    arrival: "The day they reach the city",
    stay: "Whether they need a room",
    pickup: "Whether they need picking up from the station or airport",
    song: "A song they'd love to hear",
  },
  ragaNames: {
    yaman: "Raag Yaman",
    khamaj: "Raag Khamaj",
    bihag: "Raag Bihag",
    desh: "Raag Desh",
    bhupali: "Raag Bhupali",
    madhyamavati: "Raag Madhyamavati",
    mand: "Raag Mand",
    bhimpalasi: "Raag Bhimpalasi",
    pilu: "Raag Pilu",
    bhairavi: "Raag Bhairavi",
    hamsadhwani: "Raag Hamsadhwani",
    kafi: "Raag Kafi",
  },
  /** What a raga is played on, then its mood: "Shehnai with dholak · Rajasthani folk". */
  ragaSound: (sound: { lead: LeadId; taal: TaalId | null }, mood: string) =>
    `${LEAD_NAMES[sound.lead]}${sound.taal ? ` with ${TAAL_NAMES[sound.taal]}` : ""} · ${mood}`,
  ragaMoods: {
    yaman: "Evening, romantic",
    khamaj: "Light and tender",
    bihag: "Late evening, a wedding raga",
    desh: "Monsoon, festive",
    bhupali: "Bright and joyful",
    madhyamavati: "Auspicious, Carnatic",
    mand: "Rajasthani folk, royal",
    bhimpalasi: "Warm afternoon, devotional",
    pilu: "Folk-bright and playful",
    bhairavi: "Tender, for farewells",
    hamsadhwani: "Auspicious, for Ganapati",
    kafi: "Festive folk, Holi colours",
  },
} as const;

export const traditionCopy = {
  group: "Traditions",
  none: "No tradition",
  noneHint: "The design's own wording, no symbol",
  nearYou: "Near you",
  draftNote:
    "These traditions are early drafts. People from each community are checking the wording, symbols and ceremony names before launch, so please tell us if something is not right.",
  names: {
    "north-hindu": "North Indian Hindu",
    rajasthani: "Rajasthani and Marwari",
    marathi: "Marathi",
    gujarati: "Gujarati",
    bengali: "Bengali Hindu",
    tamil: "Tamil Hindu",
    modern: "Modern",
  },
  hints: {
    "north-hindu": "Shri Ganeshaya Namah, Darshanabhilashi and Swagatotsuk",
    rajasthani: "Shri Ganeshaya Namah, Pithi and Mahila Sangeet",
    marathi: "Shri Ganeshaya Namah, Sakharpuda and Halad",
    gujarati: "Kankotri wording, Gol Dhana, Pithi and a tahuko for the children",
    bengali: "Prajapataye Namah, Gaye Holud and Bou Bhaat",
    tamil: "The Pillaiyar suzhi, Nichayathartham and Varaverpu",
    modern: "No religious symbols, for any couple or an interfaith wedding",
  },
  elements: "Religious elements",
  symbol: "Symbol at the top of the card",
  symbolNames: {
    om: "Om",
    kalash: "Mangal kalash",
    swastik: "Swastik",
    diya: "Diya",
    prajapati: "Prajapati",
    suzhi: "Pillaiyar suzhi",
  },
  noSymbol: "No symbol",
  symbolNote: "Deity artwork is being drawn by Indian artists and arrives later.",
  invocation: "Invocation",
  invocationModes: { script: "In its script", latin: "In English letters", off: "Leave it off" },
  meanings: {
    "Shri Ganeshaya Namah": "Salutations to Lord Ganesha",
    "Prajapataye Namah": "Salutations to Prajapati, lord of marriage",
    "Sri Vinayagar Thunai": "With the grace of Lord Vinayagar",
  } as Record<string, string>,
  wording: "Family wording",
  wordingIntro: "Guests read these under the card. Leave any of them empty.",
  wordingLabels: {
    blessingsFrom: "Blessings from",
    requesters: "Hosted by",
    welcome: "Waiting to welcome you",
    children: "The children's line",
  },
  ceremonies: "Ceremony names",
  ceremoniesIntro: "Functions take their local names on the guest page.",
};

/** Each design's name and one line about it, as the design step shows them. */
export const designCopy: Record<TemplateId, { name: string; description: string }> =
  Object.fromEntries(
    TEMPLATE_IDS.map((id) => [
      id,
      { name: TEMPLATES[id].name, description: TEMPLATES[id].description },
    ]),
  ) as Record<TemplateId, { name: string; description: string }>;

export const occasionCopy = {
  group: "Occasions",
  setsUp: "What this sets up",
  planned: "Functions planned",
  questions: "Guests are asked",
  noQuestions: "Just whether they're coming and how many",
  designs: (count: number) => (count === 1 ? "1 suggested design" : `${count} suggested designs`),
  suggestedBadge: "Suggested",
  suggestedFor: (occasion: string) => `Suggested for ${occasion.toLowerCase()}`,
  moreDesigns: "More designs",
} as const;

export const previewCopy = {
  ready: "Your invitation is ready",
  live: "Your invitation is live",
  liveBody: (link: string) =>
    `Guests open it at ${link}. Changes you make here show there straight away.`,
  readyBody:
    "It's saved on this device. Sign in to keep it in your account and publish it, then share the link on WhatsApp.",
  readyBodyAccount:
    "It's saved to your account, photos included. Publish it to get your link, then share it on WhatsApp.",
  notReady: "A few details are missing",
  fix: (label: string) => `Finish ${label.toLowerCase()}`,
  occasionHeading: "Occasion",
  functionsHeading: "Functions",
  photosHeading: "Photos",
  noPhotos: "No photos added",
  musicHeading: "Music",
  playsOnOpen: "plays as guests open the card",
  dressCode: "Dress code",
  edit: "Edit",
  editStep: (label: string) => `Edit ${label.toLowerCase()}`,
  startOver: "Start a new invite",
  startOverTitle: "Start a new invite?",
  startOverBody: "This clears the names, functions and photos saved on this device.",
  startOverConfirm: "Clear and start again",
  startOverKeepBody:
    "This invite stays in My invites, so you can come back to it. The new one starts empty.",
  startOverKeepConfirm: "Start a new invite",
  cancel: "Keep this invite",
  cleared: "Started a new invite",
} as const;

/** The event pages' themes (Step 12e): a name, the place it paints, and its fit. */
export const suiteCopy = {
  heading: "Event pages",
  intro:
    "After the invitation opens, each function gets its own full-screen page in this theme. Your tradition's ceremony names, blessing and symbol stay the same in every theme.",
  suggested: "Suits your tradition",
  pairs: (design: string) => `Also switches the card to ${design}`,
  preview: "Play the pages",
  textBox: "Box behind the words",
  textBoxHint:
    "Off, the words sit straight on the painting. On, they sit in a soft card-coloured box. Play the pages to compare; the same switch is on the pages too.",
  formatHeading: "Kind of invitation",
  formats: {
    scene: {
      name: "Scene",
      description:
        "Everything on one painting: your photos, names and every celebration flying in by turn. Quick for guests to take in.",
    },
    story: {
      name: "Story",
      description: "A full-screen painted page for every celebration, one after another.",
    },
  },
  blessingPage: "Open with the blessing page",
  blessingPageHint:
    "This theme opens with a painting of the god and your blessing beneath it, before your names.",
  names: {
    "rajwada-bagh": "Rajwada Bagh",
    "shahi-savari": "Shahi Savari",
    kayal: "Kayal",
    "noor-bagh": "Noor Bagh",
    "phulkari-haveli": "Phulkari Haveli",
    rajbari: "Rajbari",
    "peshwai-wada": "Peshwai Wada",
    "kutch-toran": "Kutch Toran",
    gubbara: "Gubbara",
    saath: "Saath",
    rooftop: "Rooftop",
    "ivory-arch": "Ivory Arch",
    gulaab: "Gulaab",
    "deco-noir": "Deco Noir",
    taara: "Taara",
    kaagaz: "Kaagaz",
    mitti: "Mitti",
    neel: "Neel",
    pichwai: "Pichwai",
    tanjore: "Tanjore",
    kashi: "Kashi",
    sagar: "Sagar",
    mysuru: "Mysuru",
    kalamkari: "Kalamkari",
    pattachitra: "Pattachitra",
    chinar: "Chinar",
    "chai-bagan": "Chai Bagan",
    "sufi-raat": "Sufi Raat",
    chapel: "Chapel",
    sakura: "Sakura",
    vigna: "Vigna",
    himani: "Himani",
    van: "Van",
    riad: "Riad",
    palna: "Palna",
    deepotsav: "Deepotsav",
    "jungle-party": "Jungle Party",
    "udaipur-lake": "Udaipur Lake",
    "space-voyage": "Space Voyage",
    "rainbow-unicorn": "Rainbow Unicorn",
    "dino-jungle": "Dino Jungle",
    "ocean-pearl": "Ocean Pearl",
    "boho-onederland": "Boho Onederland",
    "fairytale-castle": "Fairytale Castle",
    "little-racer": "Little Racer",
    "gold-gala": "Gold Gala",
    "amrit-utsav": "Amrit Utsav",
    "silver-jubilee": "Silver Jubilee",
    "golden-jubilee": "Golden Jubilee",
    "oh-baby": "Oh Baby",
    "new-year-eve": "New Year's Eve",
    "kitty-tea": "Kitty Tea",
    "pool-party": "Pool Party",
    "baraat-band": "Baraat Band",
    "roka-shagun": "Roka Shagun",
    "chooda-ceremony": "Chooda Ceremony",
    "rishikesh-ganga": "Rishikesh Ganga",
    "jaisalmer-dunes": "Jaisalmer Dunes",
    "fort-night": "Fort Night",
    "sheesh-mahal": "Sheesh Mahal",
    "white-rann": "White Rann",
    annaprashan: "Annaprashan",
    "christening-lilies": "Christening Lilies",
    "new-home-modern": "New Home",
    satyanarayan: "Satyanarayan Katha",
    "mata-ki-chowki": "Mata ki Chowki",
    upanayana: "Upanayana",
    shraddhanjali: "Shraddhanjali",
    "retirement-garden": "Retirement Garden",
    "farewell-night": "Farewell Night",
    "grand-opening": "Grand Opening",
    "launch-stage": "Launch Stage",
    "ganesh-utsav": "Ganesh Utsav",
    "durga-pujo": "Durga Pujo",
    janmashtami: "Janmashtami",
    "onam-pookalam": "Onam Pookalam",
    "pongal-kolam": "Pongal Kolam",
    "uttarayan-kites": "Uttarayan Kites",
    "lohri-bonfire": "Lohri Bonfire",
    "iftar-dawat": "Iftar Dawat",
    "kadamb-krishna": "Kadamb Krishna",
    "ganesh-genda": "Ganesh Genda",
    "siya-ram-mala": "Siya Ram Mala",
    "kailash-kamal": "Kailash Kamal",
    "kamal-sarovar": "Kamal Sarovar",
    gulmohar: "Gulmohar",
    "vat-vriksha": "Vat Vriksha",
    "mogra-raat": "Mogra Raat",
    "tulip-kashmir": "Tulip Kashmir",
    "wisteria-tunnel": "Wisteria Tunnel",
    "prem-vriksh": "Prem Vriksh",
    amaltas: "Amaltas",
    "palash-van": "Palash Van",
    "parijat-angan": "Parijat Angan",
    "aam-bagiya": "Aam Bagiya",
    "vazhai-mandap": "Vazhai Mandap",
    "mor-bagh": "Mor Bagh",
    "orchid-meghalaya": "Orchid Meghalaya",
    "rhododendron-himalaya": "Rhododendron Himalaya",
    "sunflower-haldi": "Sunflower Haldi",
    "lavender-field": "Lavender Field",
    "hydrangea-blue": "Hydrangea Blue",
    "peony-blush": "Peony Blush",
    "magnolia-moon": "Magnolia Moon",
    "phool-chandelier": "Phool Chandelier",
    "mor-kamal": "Mor Kamal",
    "rajwada-haathi": "Rajwada Haathi",
    "madhubani-machhli": "Madhubani Machhli",
    "pichwai-gaay": "Pichwai Gaay",
    "kerala-mural": "Kerala Mural",
    "kalyana-vazhai": "Kalyana Vazhai",
    "alpana-topor": "Alpana Topor",
    "kutch-rang": "Kutch Rang",
    "mughal-bagh": "Mughal Bagh",
    "phulkari-lavan": "Phulkari Lavan",
    "safed-gulaab": "Safed Gulaab",
    "line-art-gold": "Gold Line",
    "samudra-sanjh": "Samudra Sanjh",
    "kaagaz-chaand": "Kaagaz Chaand",
    "doli-vidaai": "Doli Vidaai",
    "haldi-genda": "Haldi Genda",
    "mehendi-jhoola": "Mehendi Jhoola",
    "sangeet-dhol": "Sangeet Dhol",
    "pehla-janamdin": "Pehla Janamdin",
    "godh-bharai": "Godh Bharai",
    "griha-kalash": "Griha Kalash",
    "sona-saath": "Sona Saath",
    "bagh-reception": "Bagh Reception",
    "naamkaran-chanda": "Naamkaran Chanda",
    "swagat-laxmi": "Swagat Laxmi",
    "holi-rang": "Holi Rang",
    "christmas-tara": "Christmas Tara",
    "reunion-yaarana": "Reunion Yaarana",
    "graduation-topi": "Graduation Topi",
    "gudi-padwa": "Gudi Padwa",
    "baisakhi-mela": "Baisakhi Mela",
    "bihu-utsav": "Bihu Utsav",
    "gond-vriksh": "Gond Vriksh",
    "warli-vivah": "Warli Vivah",
    "kalighat-pat": "Kalighat Pat",
    "cheriyal-talambralu": "Cheriyal Talambralu",
    "axomiya-biya": "Axomiya Biya",
    "antarpat-mangal": "Antarpat Mangal",
    "kangra-megh": "Kangra Megh",
    "hyderabadi-nikah": "Hyderabadi Nikah",
    "goa-azulejo": "Goa Azulejo",
    "pressed-phool": "Pressed Phool",
    "tuscan-vineyard": "Tuscan Vineyard",
    "boho-pampas": "Boho Pampas",
    "winter-pine": "Winter Pine",
    "kantha-silai": "Kantha Silai",
    "tholu-bommalata": "Tholu Bommalata",
    "chikankari-awadh": "Chikankari Awadh",
    "bidri-raat": "Bidri Raat",
    "stained-glass": "Stained Glass",
    "chinoiserie-bagh": "Chinoiserie Bagh",
    "nouveau-arch": "Nouveau Arch",
    "safar-shaadi": "Safar Shaadi",
    "chibi-jodi": "Chibi Jodi",
    "jaago-gagar": "Jaago Gagar",
    "tilak-thaal": "Tilak Thaal",
    "nalangu-vilayattu": "Nalangu",
    "sagai-anguthi": "Gulaab Anguthi",
    "chandni-cocktail": "Chandni Cocktail",
    "kathputli-sangeet": "Kathputli Sangeet",
    sehrabandi: "Sehrabandi",
    "laxmi-aagman": "Laxmi Aagman",
    shashtipurti: "Shashtipurti",
    "circus-tent": "Circus Tent",
    "toy-train": "Toy Train",
    "pet-party": "Pet Party",
    "mixtape-party": "Mixtape Party",
    "pehli-salgirah": "Pehli Salgirah",
    "eid-milan": "Eid Milan",
    "garba-raas": "Garba Raas",
    valaikappu: "Valaikappu",
    "shubh-labh": "Shubh Labh",
    "retirement-naav": "Retirement Naav",
    "phad-gatha": "Phad Gatha",
    "mandana-lal": "Mandana Lal",
    "gota-patti": "Gota Patti",
    "pithora-ghoda": "Pithora Ghoda",
    "sohrai-khovar": "Sohrai Khovar",
    "aipan-kumaon": "Aipan Kumaon",
    "pipli-chhata": "Pipli Chhata",
    "bishnupur-terracotta": "Bishnupur Terracotta",
    "ganjifa-patte": "Ganjifa Patte",
    "kanjivaram-pattu": "Kanjivaram Pattu",
    "kasavu-sona": "Kasavu Sona",
    "urli-pookal": "Urli Pookal",
    "kar-e-kashmir": "Kar-e-Kashmir",
    "zardozi-mehfil": "Zardozi Mehfil",
    "patola-bandh": "Patola Bandh",
    "kundan-jhumka": "Kundan Jhumka",
    "moti-bharat": "Moti Bharat",
    "polaroid-lights": "Polaroid Lights",
    "dak-tikat": "Dak Tikat",
    "kadhai-hoop": "Kadhai Hoop",
    "locket-jodi": "Locket Jodi",
    "syahi-bamboo": "Syahi Bamboo",
    "lace-ivory": "Lace Ivory",
    "origami-saaras": "Origami Saaras",
    "nimbu-amalfi": "Nimbu Amalfi",
    "rail-yatra": "Rail Yatra",
    "rakhi-dor": "Rakhi Dor",
    "karva-chandni": "Karva Chandni",
    "judwa-taare": "Judwa Taare",
    "naya-mehmaan": "Naya Mehmaan",
    "mameru-bandhani": "Mameru Bandhani",
    "sindhi-ajrak": "Sindhi Ajrak",
    "hampi-ruins": "Hampi Ruins",
    "coorg-estate": "Coorg Estate",
    "bali-garden": "Bali Garden",
    "santorini-white": "Santorini White",
    "glass-house": "Glass House",
    "minimal-white": "Minimal White",
    "fairy-forest": "Fairy Forest",
    "love-letter": "Love Letter",
    "parsi-chalk": "Parsi Chalk",
    "jazz-lounge": "Jazz Lounge",
    "bride-squad": "Bride Squad",
    "teej-jhoola": "Teej Jhoola",
    "cricket-stadium": "Cricket Stadium",
    "neon-arcade": "Neon Arcade",
    "retro-bollywood": "Retro Bollywood",
    "pink-haveli": "Gulabi Haveli",
    "char-bagh": "Char Bagh",
    "kashi-ghat": "Kashi Ghat",
    "temple-pond": "Temple Pond",
    "kovil-corridor": "Kovil",
    "arati-mandap": "Pelli Pandiri",
    "zamindar-bari": "Zamindar Bari",
    "kutch-bhunga": "Bhunga",
    "punjab-haveli": "Sarson Haveli",
    "pune-wada": "Wada Angan",
    "chinar-dal": "Dal Lake",
    classic: "Card colours",
  },
  descriptions: {
    "rajwada-bagh": "A palace garden seen through a Mughal arch, fountains and lanterns.",
    "shahi-savari": "A royal elephant procession before a desert fort, bunting overhead.",
    kayal: "A houseboat on the Kerala backwaters, palms and floating lamps.",
    "noor-bagh": "A Mughal garden of white marble, jaali screens and a long water channel.",
    "phulkari-haveli":
      "A Punjab haveli dressed in phulkari, with dhol, marigolds and mustard fields.",
    rajbari: "An old Bengal mansion in red and white, with banana plants and shola flowers.",
    "peshwai-wada": "A Peshwa-era wooden wada in paithani colours, with rangoli and mango leaves.",
    "kutch-toran": "A Kutch bhunga courtyard in mirror work and bandhani, the white Rann beyond.",
    gubbara: "A pastel garden arch of balloons and bunting, with the cake table beneath.",
    saath: "Red roses and candlelight over a lake at sunset, for years together.",
    rooftop: "A city rooftop at night with fairy lights, floor cushions and fireworks.",
    "ivory-arch": "Modern and calm: ivory arches, pampas grass and soft sunlight by the sea.",
    gulaab: "Loose watercolour roses and peonies on white paper.",
    "deco-noir": "Black and gold art deco, like a grand 1920s hotel ballroom.",
    taara: "A midnight sky of gold moons, stars and soft clouds.",
    kaagaz: "Layers of pastel cut paper, with lotuses, jaali and real depth.",
    mitti: "A boho desert wedding: terracotta arches, pampas grass and the dunes.",
    neel: "Jaipur blue pottery: cobalt and turquoise tiles on white marble.",
    pichwai: "A Nathdwara Pichwai of lotus ponds and cows, opening with Shrinathji.",
    tanjore: "A Thanjavur painting in gold leaf and gems, opening with Ganesha.",
    kashi: "The ghats of Banaras at dawn, opening with Ganesha, lamps on the Ganga.",
    sagar: "A beach wedding: white drapes, palms and a pastel sunset over the sea.",
    mysuru: "Mysuru Palace lit for Dasara in Mysore gold painting, opening with Ganesha.",
    kalamkari:
      "Hand-painted Kalamkari cloth of lotuses and peacocks, opening with Lord Venkateswara.",
    pattachitra: "A bright Odisha Pattachitra scroll, opening with Lord Jagannath.",
    chinar: "Kashmir in autumn: Dal Lake, shikaras, chinar leaves and carved walnut wood.",
    "chai-bagan": "Assam's tea gardens in gamosa red and white, with Bihu drums by the river.",
    "sufi-raat": "A moonlit Sufi courtyard of lanterns, roses and still water.",
    chapel: "A white garden chapel with lilies, opening with a stained glass window.",
    sakura: "Cherry blossoms over a wooden bridge, a still pond and paper lanterns.",
    vigna: "A Tuscan vineyard at golden hour, with olive trees and a stone villa.",
    himani: "Snowy mountains, a pine forest and warm winter lights.",
    van: "An enchanted forest of moss, ferns, fairy lights and fireflies.",
    riad: "A Moroccan riad of tiled fountains, arches and brass lanterns.",
    palna: "A flower swing cradle among soft pastel clouds.",
    deepotsav: "A Diwali night of diyas, rangoli and fireworks, opening with Lakshmi and Ganesha.",
    "jungle-party": "A storybook jungle of friendly animals, balloons and big leaves.",
    "udaipur-lake": "Lake Pichola at dusk, with a white marble jharokha for each celebration.",
    "space-voyage": "A porthole among the planets, with a starship plaque for each celebration.",
    "rainbow-unicorn": "Candy clouds and a rainbow, with a unicorn keeping watch.",
    "dino-jungle": "A volcano jungle with a friendly dinosaur and a wooden sign.",
    "ocean-pearl": "Under the sea in shells and pearls, with sunlight from above.",
    "boho-onederland": "Soft neutrals, pampas grass and a rattan mirror for a first birthday.",
    "fairytale-castle": "A pink sunset castle with a carriage and a gilded scroll.",
    "little-racer": "A race track with checkered flags, trophies and two little cars.",
    "gold-gala": "Black and gold art deco, with candles and white roses.",
    "amrit-utsav": "Brass lamps and marigolds for a 60th, 75th or 100th birthday.",
    "silver-jubilee": "Silver, white roses and a lake at dusk for 25 years together.",
    "golden-jubilee": "A gold frame, a gramophone and sunset light for 50 years together.",
    "oh-baby": "Hot air balloons in a pastel sky, with teddies below.",
    "new-year-eve": "Fireworks over the city, with champagne and gold balloons.",
    "kitty-tea": "Peonies, macarons and fine china for a ladies' afternoon.",
    "pool-party": "A blue pool, hibiscus and a float ring on a summer day.",
    "baraat-band": "A palace street at dusk, with the band, the brass and a white mare waiting.",
    "roka-shagun": "A red wall, shagun trays and gold for the first promise.",
    "chooda-ceremony": "Red and ivory bangles, kaleere and marigolds in a haveli courtyard.",
    "rishikesh-ganga": "Marigold garlands over the Ganga, with diyas floating at dusk.",
    "jaisalmer-dunes": "Golden sand, a carved jharokha and lanterns under a desert sky.",
    "fort-night": "A lit fort across a dark lake, with marigolds and lamps.",
    "sheesh-mahal": "A hall of mirrors glowing gold, with a red carpet and lamps.",
    "white-rann": "The salt desert of Kutch under a soft sky, with lanterns and jasmine.",
    annaprashan: "A banana-leaf wreath, a silver bowl of kheer and soft morning light.",
    "christening-lilies": "White lilies, olive leaves and a fountain by the sea.",
    "new-home-modern": "A sunlit balcony with plants, lanterns and a swing.",
    satyanarayan: "Brass kalash, banana leaves and marigolds for the katha.",
    "mata-ki-chowki": "Red velvet, marigold garlands and rows of diyas for the jagran.",
    upanayana: "Carved stone, jasmine and morning calm for the sacred thread.",
    shraddhanjali: "White tuberoses and soft light for a prayer meeting.",
    "retirement-garden": "A garden terrace at sunset, looking over the hills.",
    "farewell-night": "Fairy lights over a college courtyard under the stars.",
    "grand-opening": "A red ribbon, marigold pillars and brass urns for the first day.",
    "launch-stage": "A dark stage, a glowing screen and rows of seats.",
    "ganesh-utsav": "Marigolds, roses and banana leaves to welcome Bappa.",
    "durga-pujo": "Red and white shola work, dhak and diyas for the pujo.",
    janmashtami: "Peacock feathers, a flute and a midnight sky for Kanha.",
    "onam-pookalam": "A pookalam, a flower garland and the backwaters in the sun.",
    "pongal-kolam": "Clay pots of pongal, sugarcane and a kolam at the door.",
    "uttarayan-kites": "Bright kites over the rooftops on a clear January sky.",
    "lohri-bonfire": "A village courtyard at night, phulkari and the bonfire glow.",
    "iftar-dawat": "A jali arch, lanterns and dates at sunset for the iftar.",
    "kadamb-krishna":
      "Radha and Krishna above a Vrindavan grove, with kadamba blossoms and peacocks by the Yamuna.",
    "ganesh-genda": "Ganesha above a courtyard of marigold strands, mango leaves and brass bells.",
    "siya-ram-mala":
      "Sita and Ram above a royal garden, with jaimala frames of red roses and jasmine.",
    "kailash-kamal": "Shiva and Parvati above a Himalayan meadow of Brahma Kamal at dawn.",
    "kamal-sarovar": "A pink lotus pond at sunrise, with lotus frames over still water.",
    gulmohar: "An avenue of flame-red gulmohar in bloom under a blue summer sky.",
    "vat-vriksha": "A great banyan at golden hour, its frames hung like swings from its branches.",
    "mogra-raat": "A moonlit garden of white jasmine, with fireflies and a deep blue sky.",
    "tulip-kashmir": "A Kashmir tulip garden in spring below the snowy mountains.",
    "wisteria-tunnel": "A garden tunnel of hanging lilac wisteria, soft and dreamy.",
    "prem-vriksh": "A tree of love in pink blossom, with lovebirds and fairy lights.",
    amaltas: "Golden chains of amaltas blossom falling like rain in the summer sun.",
    "palash-van": "A palash forest in spring, flame-orange flowers under a saffron sky.",
    "parijat-angan":
      "An old courtyard at dawn under a parijat tree, its flowers falling like a carpet.",
    "aam-bagiya": "A mango orchard in early summer, with golden mangoes, blossom and a swing.",
    "vazhai-mandap": "A South Indian garden of banana leaves, coconut flowers and jasmine.",
    "mor-bagh": "A royal garden after the rain, with dancing peacocks and feather frames.",
    "orchid-meghalaya": "A misty rainforest with a waterfall and wild orchids in the hills.",
    "rhododendron-himalaya": "A Himalayan hillside of red and pink rhododendron in spring mist.",
    "sunflower-haldi": "A bright sunflower field and a bowl of turmeric for the haldi.",
    "lavender-field": "Rolling lavender rows at sunset, with daisies and butterflies.",
    "hydrangea-blue": "Blue hydrangeas and white roses by a lake in fresh morning light.",
    "peony-blush": "A dreamy garden of blush peonies and garden roses in pastel light.",
    "magnolia-moon": "White magnolia glowing under a full moon by a quiet lake.",
    "phool-chandelier": "A candlelit hall under cascading orchids, roses and crystal strands.",
    "mor-kamal":
      "A painted couple with a peacock and lotus in soft blush watercolour. No photos needed.",
    "rajwada-haathi":
      "A Rajasthani miniature: the couple under a gold umbrella between two elephants. No photos needed.",
    "madhubani-machhli":
      "Madhubani art from Mithila: the sun, bamboo, fish and the couple with a garland. No photos needed.",
    "pichwai-gaay":
      "A Pichwai night: the couple with white cows by a lotus pond under the moon. No photos needed.",
    "kerala-mural":
      "A Kerala mural: the thali, a decorated elephant and a brass lamp. No photos needed.",
    "kalyana-vazhai":
      "A South Indian temple wedding by the sacred fire, between banana plants. No photos needed.",
    "alpana-topor":
      "A Bengali wedding with shola crowns, paan leaves and a white alpana. No photos needed.",
    "kutch-rang":
      "A Gujarati couple dancing with dandiya, mirror work, a dhol and a camel. No photos needed.",
    "mughal-bagh":
      "A nikah in a Mughal garden at night, with lanterns, cypresses and a fountain. No photos needed.",
    "phulkari-lavan": "An Anand Karaj between phulkari borders, with marigolds. No photos needed.",
    "safed-gulaab": "A garden wedding with white roses, doves and a flower arch. No photos needed.",
    "line-art-gold":
      "A modern couple drawn in one gold line, with eucalyptus leaves. No photos needed.",
    "samudra-sanjh": "A beach wedding at sunset between the palms. No photos needed.",
    "kaagaz-chaand":
      "Layered paper art: the couple on the hills under a gold moon. No photos needed.",
    "doli-vidaai":
      "A folk-art doli procession through the village, with the groom on a white horse. No photos needed.",
    "haldi-genda": "A sunny haldi with marigold strings and a bowl of turmeric. No photos needed.",
    "mehendi-jhoola": "The bride on a flower swing with henna hands and parrots. No photos needed.",
    "sangeet-dhol":
      "A sangeet night with fairy lights, a dhol and the couple dancing. No photos needed.",
    "pehla-janamdin":
      "A first birthday in the clouds with balloons, a cake and animal friends. No photos needed.",
    "godh-bharai":
      "A gentle baby shower with a cradle, swans and a garland of roses. No photos needed.",
    "griha-kalash":
      "A griha pravesh: the couple at the new door with a kalash, toran and rangoli. No photos needed.",
    "sona-saath":
      "An anniversary couple on a swing under the neem tree at sunset. No photos needed.",
    "bagh-reception":
      "A garden reception with gazebos, swans, hanging flowers and lamps. No photos needed.",
    "naamkaran-chanda":
      "Parents bend over a marigold cradle under a crescent moon and paper cranes. No photos needed.",
    "swagat-laxmi":
      "Grandparents shower petals as the new baby comes home, under bells and roses. No photos needed.",
    "holi-rang":
      "Friends throw gulal to a dhol beat beside a flame tree, with gujiya and bowls of colour. No photos needed.",
    "christmas-tara":
      "A family sings carols by the tree, with plum cake, gifts and paper stars. No photos needed.",
    "reunion-yaarana":
      "Old classmates crowd the school steps with a photo, a cricket bat and tiffin boxes. No photos needed.",
    "graduation-topi":
      "Proud parents hug the graduate under flying caps, balloons and sunflowers. No photos needed.",
    "gudi-padwa":
      "A Marathi family by the raised gudi, with puran poli and a flower rangoli. No photos needed.",
    "baisakhi-mela":
      "Bhangra and giddha in golden wheat, with kites, a dhol and a village fair. No photos needed.",
    "bihu-utsav":
      "Bihu dancers in mekhela chador with dhol and pepa, kopou flowers and pitha. No photos needed.",
    "gond-vriksh":
      "A Gond tree of life full of birds, with the couple and a deer and peacock beneath it. No photos needed.",
    "warli-vivah":
      "White Warli figures dance round the couple's cart on red earth. No photos needed.",
    "kalighat-pat":
      "A Bengali bride and groom in bold Kalighat brushwork, between two rui fish. No photos needed.",
    "cheriyal-talambralu":
      "A Telugu couple showering each other with rice, painted as a Cheriyal scroll. No photos needed.",
    "axomiya-biya":
      "An Assamese couple in muga silk under a gamosa border, with a xorai and tea hills. No photos needed.",
    "antarpat-mangal":
      "A Marathi wedding at the antarpat, between two brass samai lamps. No photos needed.",
    "kangra-megh":
      "A Pahari miniature: the couple under one umbrella in the first monsoon rain. No photos needed.",
    "hyderabadi-nikah":
      "A Deccan nikah under jasmine strings and brass lanterns. No photos needed.",
    "goa-azulejo": "A seaside wedding painted on blue-and-white Goan tiles. No photos needed.",
    "pressed-phool":
      "Pressed wildflowers and ferns on handmade cotton paper, simple and modern. No photos needed.",
    "tuscan-vineyard":
      "The couple walking between vineyards at golden hour, under hanging grapes. No photos needed.",
    "boho-pampas":
      "A relaxed boho couple among pampas grass, macramé and candles. No photos needed.",
    "winter-pine": "A winter wedding among snowy pines and warm lanterns. No photos needed.",
    "kantha-silai":
      "A wedding told in Kantha running stitches on soft white cotton. No photos needed.",
    "tholu-bommalata":
      "An Andhra shadow-puppet wedding glowing on a lamp-lit screen. No photos needed.",
    "chikankari-awadh":
      "Lucknow chikankari, white on white, with the couple between embroidered cypresses. No photos needed.",
    "bidri-raat":
      "Bidri silver inlay on black: the couple under a silver canopy. No photos needed.",
    "stained-glass": "A sunlit stained glass window of roses, lilies and doves. No photos needed.",
    "chinoiserie-bagh":
      "Hand-painted chinoiserie: peonies, birds and the couple on a garden bridge. No photos needed.",
    "nouveau-arch": "An art nouveau arch of lilies and irises around the couple. No photos needed.",
    "safar-shaadi":
      "A travel scrapbook for a destination wedding: stamps, a compass and suitcases. No photos needed.",
    "chibi-jodi":
      "A cute cartoon bride and groom with a baby elephant and a little horse. No photos needed.",
    "jaago-gagar":
      "A Punjabi jaago night: a brass gagar of lamps, phulkari and a dhol. No photos needed.",
    "tilak-thaal": "The tilak ceremony: the bride's family welcome the groom. No photos needed.",
    "nalangu-vilayattu":
      "Tamil nalangu games: the couple rolling a coconut as the family cheer. No photos needed.",
    "sagai-anguthi":
      "A ring ceremony in a rose garden, in soft blush watercolour. No photos needed.",
    "chandni-cocktail": "A pre-wedding party on a terrace under fairy lights. No photos needed.",
    "kathputli-sangeet": "A Rajasthani sangeet with dancing kathputli puppets. No photos needed.",
    sehrabandi: "The family tie the groom's sehra before the baraat. No photos needed.",
    "laxmi-aagman": "The bride's welcome home as she tips the kalash of rice. No photos needed.",
    shashtipurti: "A 60th birthday blessing, the family showering petals. No photos needed.",
    "circus-tent":
      "A circus birthday with a little ringmaster, an elephant and a seal. No photos needed.",
    "toy-train":
      "A wooden toy train carrying balloons, cake and gifts over green hills. No photos needed.",
    "pet-party":
      "A birthday party for a dog, with friends, a cake and paw-print balloons. No photos needed.",
    "mixtape-party":
      "A retro cassette party with polaroids, a boombox and roller skates. No photos needed.",
    "pehli-salgirah":
      "A first anniversary on a lantern-lit houseboat under the moon. No photos needed.",
    "eid-milan": "A family Eid get-together under lanterns and a crescent moon. No photos needed.",
    "garba-raas":
      "A Navratri garba night with dandiya, mirror work and garbo lamps. No photos needed.",
    valaikappu: "A Tamil bangle ceremony for the mother-to-be. No photos needed.",
    "shubh-labh":
      "A shop opening: cutting the ribbon at a door hung with marigolds. No photos needed.",
    "retirement-naav":
      "A retirement as a new journey: setting off by boat at sunrise. No photos needed.",
    "phad-gatha":
      "A Rajasthani Phad scroll with camels, a peacock and a horse-and-elephant procession. Two photo frames, one for each of you.",
    "mandana-lal":
      "White Mandana peacocks and lotuses on red earth, with plain sand plaster for your words. Two photo frames, one for each of you.",
    "gota-patti":
      "Gold gota patti leaves and sequins on rani pink silk, with tassels along the hem. Two photo frames, one for each of you.",
    "pithora-ghoda":
      "Bright dotted Pithora horses, birds, a sun and a moon on a whitewashed wall. Two photo frames, one for each of you.",
    "sohrai-khovar":
      "A Jharkhand mud wall painted with a peacock, a bull and a cow under a flowering tree. Two photo frames, one for each of you.",
    "aipan-kumaon":
      "Kumaoni Aipan in white rice paste on red ochre, with lotuses and hill pines. Two photo frames, one for each of you.",
    "pipli-chhata":
      "Odisha's Pipli appliqué: parasols, parrots and elephants with little mirrors. Two photo frames, one for each of you.",
    "bishnupur-terracotta":
      "Carved Bengal terracotta, a Bankura horse and a frieze of boats and elephants. Two photo frames, one for each of you.",
    "ganjifa-patte":
      "Round Mysuru Ganjifa cards in red, gold and green, with sandalwood boxes. Two photo frames, one for each of you.",
    "kanjivaram-pattu":
      "A maroon Kanjivaram silk with a gold zari border of temple towers and peacocks. Two photo frames, one for each of you.",
    "kasavu-sona":
      "An ivory Kerala kasavu with a gold border, a brass lamp and jasmine strings. Two photo frames, one for each of you.",
    "urli-pookal":
      "Polished brass frames, marigold strings and an urli of floating flowers and lamps. Two photo frames, one for each of you.",
    "kar-e-kashmir":
      "Kashmiri papier-mâché painted with chinar leaves, roses, irises and bulbuls. Two photo frames, one for each of you.",
    "zardozi-mehfil":
      "Raised gold zardozi and pearls on deep wine velvet, for a nikah or reception. Two photo frames, one for each of you.",
    "patola-bandh":
      "Patan Patola silk with woven elephants and parrots in red, green and saffron. Two photo frames, one for each of you.",
    "kundan-jhumka":
      "Kundan pendants, a pearl necklace, jhumkas and bangles on blush silk. Two photo frames, one for each of you.",
    "moti-bharat":
      "Gujarati beadwork: a beaded toran, parrots and elephants in bright glass beads. Two photo frames, one for each of you.",
    "polaroid-lights":
      "Two instant photos pegged to warm fairy lights, with dried flowers and an envelope. Two photo frames, one for each of you.",
    "dak-tikat":
      "Two vintage postage stamps, a wax seal, airmail stripes and a bundle of letters. Two photo frames, one for each of you.",
    "kadhai-hoop":
      "Two wooden embroidery hoops ringed with tiny stitched flowers, and spools of thread. Two photo frames, one for each of you.",
    "locket-jodi":
      "Two antique gold lockets on a chain over dusty-rose velvet, with pearls and roses. Two photo frames, one for each of you.",
    "syahi-bamboo":
      "A calm ink wash of plum blossom, bamboo and two small birds on rice paper. Two photo frames, one for each of you.",
    "lace-ivory":
      "Ivory lace arches, satin bows and lily of the valley, for a church or garden wedding. Two photo frames, one for each of you.",
    "origami-saaras":
      "Paper cranes and folded flowers in soft pastels around two pleated paper frames. Two photo frames, one for each of you.",
    "nimbu-amalfi":
      "Sunny lemons and hand-painted blue and yellow tiles, for a bright summer wedding. Two photo frames, one for each of you.",
    "rail-yatra":
      "A vintage green train carriage with two windows, suitcases and marigolds on the platform. Two photo frames, one for each of you.",
    "rakhi-dor":
      "A rakhi joins the sister's frame and the brother's, over a thali of roli, rice and sweets.",
    "karva-chandni":
      "Two brass sieves under the full moon, with a decorated karva, a diya and red bangles. Two photo frames, one for each of you.",
    "judwa-taare":
      "A pink star and a blue star for twins, with bunting, balloons and a two-tier cake.",
    "naya-mehmaan":
      "Two felt clouds for the parents-to-be, hanging from a baby mobile over a cradle.",
    "mameru-bandhani": "Bandhani silks, brass and gifts for the mameru.",
    "sindhi-ajrak": "Indigo and madder ajrak, roses and tassels for a Sindhi wedding.",
    "hampi-ruins": "Stone steps, brass lamps and jasmine among the old temples.",
    "coorg-estate": "Mist over a coffee estate, with berries and white blossoms.",
    "bali-garden": "A lotus pond, frangipani and floating candles in the tropics.",
    "santorini-white": "White walls, blue sea and bougainvillea at sunset.",
    "glass-house": "A sunlit conservatory with eucalyptus, roses and candles.",
    "minimal-white": "White flowers, a marble ledge and quiet candlelight.",
    "fairy-forest": "Fireflies, a misty lake and old trees wrapped in lights.",
    "love-letter": "A sealed envelope, roses and an old pen, to save the date.",
    "parsi-chalk": "Sage walls, lace and roses, with chalk patterns on the floor.",
    "jazz-lounge": "Emerald velvet, brass and coupes for a night of music.",
    "bride-squad": "Blush peonies, macarons and a pink bow for the bride's friends.",
    "teej-jhoola": "A flower swing in the monsoon, with a peacock and green bangles.",
    "cricket-stadium": "A green pitch, stumps, a bat and a gold trophy.",
    "neon-arcade": "Neon lights, game pads and popcorn for a night of games.",
    "retro-bollywood": "Marquee lights, a red curtain and film reels for a filmi night.",
    "pink-haveli": "Jaipur's pink sandstone walls, with a mirror-work tablet for each celebration.",
    "char-bagh": "A Mughal garden of long pools and fountains, with an inlaid marble plaque.",
    "kashi-ghat": "The Ganga's ghats at sunrise, with a brass thali ringed in petals.",
    "temple-pond": "A Kerala temple pond with lotuses, and a palm leaf edged in kasavu gold.",
    "kovil-corridor":
      "A Tamil temple's golden stone corridor, with a brass plate edged in kolam dots.",
    "arati-mandap": "A Telugu banana-leaf mandap, with a turmeric cloth under a mango-leaf toran.",
    "zamindar-bari": "A red Bengal courtyard, with a white shola-pith plaque.",
    "kutch-bhunga": "A white Kutch bhunga, with a lippan panel of mud and mirrors.",
    "punjab-haveli": "A Punjab haveli over golden mustard fields, with a phulkari cloth.",
    "pune-wada":
      "A Maharashtrian wada courtyard, with a Paithani silk panel and its peacock border.",
    "chinar-dal": "Autumn on Dal Lake, with a carved walnut panel among the chinar leaves.",
    classic: "Pages in your card's own paper and colours, with a scene for each function.",
  },
} as const;

/** The editor's live page and lettering (Step 12n). */
export const studioCopy = {
  pagesHint: "The page you're editing comes up here as you type.",
  pageNames: {
    blessing: "Blessing",
    cover: "Cover",
    couple: "Photo",
    family: "Family",
    "family-more": "Family, more",
    invite: "Invitation",
    reply: "Reply",
  },
  pageList: "Pages of the invitation",
  showPage: (name: string) => `Show the ${name} page`,
  phone: (name: string) => `The ${name} page, as guests see it`,
  lettering: "Lettering",
  letteringIntro:
    "Choose how the words look on every page. Only fonts that can write your card's language are listed.",
  namesFont: "Names",
  wordsFont: "Other words",
  themeFont: "The theme's own",
  size: "Size",
  sizes: { small: "Small", medium: "Medium", large: "Large" },
  style: "Style of the names",
  bold: "Bold",
  italic: "Italic",
  capitals: "Capitals",
  colour: "Colour of the names",
  colours: {
    theme: "The theme's own",
    maroon: "Maroon",
    gold: "Gold",
    saffron: "Saffron",
    ink: "Ink",
    ivory: "Ivory",
  },
  feels: {
    classic: "Classic",
    script: "Flowing",
    bold: "Bold",
    clean: "Clean",
    handwritten: "Handwritten",
  },
  reset: "Back to the theme's lettering",
} as const;

/** The family section of the names step (Step 12s): parents, blessings and whom to call. */
export const familyCopy = {
  heading: "Family",
  intro:
    "Parents, blessings and whom guests can call. All optional: what you fill in appears on the family page.",
  open: "Add family details",
  sideHeading: (name: string) => `${name}'s family`,
  sideFallback: { first: "First family", second: "Second family" },
  relation: "Printed as",
  relations: { child: "Child of", daughter: "Daughter of", son: "Son of" },
  parents: "Parents' names",
  parentsExample: "Smt. Sunita & Shri Ramesh Patel",
  parentsHint: "Write them as you want them printed, with Shri, Smt. or Late.",
  town: "Home town",
  townExample: "Ahmedabad",
  more: "Blessings and hosts",
  examples: {
    blessingsFrom: "Smt. Kamla & Shri Ramprasad Sharma",
    requesters: "The Sharma family",
    welcome: "Rahul, Priya and Ankit",
    children: "Don't miss our chachu's wedding!",
  },
  memory: "In loving memory",
  memoryExample: "Late Shri Mohanlal Patel",
  memoryHint: "Late relatives whose blessings the family remembers.",
  contacts: "Whom guests can call",
  contactName: "Name",
  contactNameExample: "Ramesh Patel",
  phone: "Phone",
  addContact: "Add a number",
  removeContact: (n: number) => `Remove number ${n}`,
} as const;

/** Editing one page's words and where they sit (Step 12s part 3). */
export const pageWordsCopy = {
  open: "Edit this page",
  title: (page: string) => `The ${page} page`,
  description: "Change any line, add your own, and choose where the words sit on the painting.",
  close: "Done",
  words: "Words",
  line: (n: number) => `Line ${n}`,
  kind: (n: number) => `Kind of line ${n}`,
  kinds: {
    label: "Small heading",
    script: "Blessing",
    display: "Large",
    date: "Date",
    venue: "Venue",
    body: "Text",
    small: "Small text",
  },
  up: (n: number) => `Move line ${n} up`,
  down: (n: number) => `Move line ${n} down`,
  remove: (n: number) => `Remove line ${n}`,
  add: "Add a line",
  reset: "Back to the suggested words",
  own: "You've written this page yourself. Names, dates and places you change later won't show here until you go back to the suggested words.",
  inLanguage: (language: string) => `These words are for the ${language} card.`,
  overflow:
    "Too many words for this painting, even at the smallest size. Shorten a line or remove one.",
  placement: "Placement",
  place: "Position",
  places: { top: "Top", middle: "Middle", bottom: "Bottom" },
  align: "Alignment",
  aligns: { center: "Centred", start: "Left" },
  box: "Box behind the words",
  boxes: { theme: "Like the other pages", on: "Box", off: "Printed on the painting" },
  hide: "Leave this page out",
  hideHint: "Guests won't see it. Turn it back on any time.",
  hidden: "Left out",
} as const;

/** Writing the pages with AI (Step 12s part 4). */
export const aiCopy = {
  open: "Write with AI",
  title: "Write the words with AI",
  description:
    "AI writes the pages in the card's language from your names, family and functions. Change anything afterwards.",
  close: "Close",
  tone: "Tone",
  tones: { traditional: "Traditional", warm: "Warm", fun: "Fun" },
  scope: "Pages",
  scopes: { all: "Every page", page: (page: string) => `Only the ${page} page` },
  write: "Write",
  again: "Write again",
  shorten: "Shorten with AI",
  busy: "Writing…",
  done: "Written. Open any page to change its words.",
  left: (n: number) =>
    n === 1 ? "1 free draft left on this invite." : `${n} free drafts left on this invite.`,
  languages: (language: string) =>
    `Written for the ${language} card. Switch the card's language above to write the other.`,
  errors: {
    "sign-in": "Sign in so your invite is saved, then AI can write for it.",
    off: "AI wording isn't switched on yet.",
    "not-found": "Sign in so your invite is saved, then AI can write for it.",
    "used-up":
      "This invite has used its 3 free drafts. Premium, Royal and the Wedding bundle can write as often as you like.",
    failed: "The words couldn't be written just now. Try again.",
  },
} as const;

/** The guest's first screen (Step 12x): how the invitation opens, and the god above it. */
export const openingCopy = {
  heading: "How it opens",
  intro:
    "The first thing guests see, full screen, with your names and a countdown. Tap a style to watch it open.",
  styles: {
    doors: {
      name: "Theme doors",
      description: "Your theme's own painting parts down the middle like two doors.",
    },
    palace: {
      name: "Palace gates",
      description: "Carved doors under a garlanded arch swing open into warm light.",
    },
    temple: {
      name: "Temple doors",
      description: "Brass doors with ringing bells and lamps, under a golden gopuram.",
    },
    curtain: {
      name: "Silk curtains",
      description: "Velvet curtains with fairy lights gather aside like a stage.",
    },
    envelope: {
      name: "Royal envelope",
      description: "A wax seal with your initials breaks and the card rises out.",
    },
    lotus: {
      name: "Lotus bloom",
      description: "A great lotus around your names opens petal by petal.",
    },
    mandap: {
      name: "Wedding mandap",
      description: "Sheer drapes rise between banana-leaf pillars and jasmine strings.",
    },
    jharokha: {
      name: "Jharokha window",
      description: "Four carved jaali shutters of a sandstone window fold back.",
    },
    phool: {
      name: "Flower curtain",
      description: "Strings of marigold, rose and jasmine part from the middle.",
    },
    scroll: {
      name: "Royal scroll",
      description: "The ribbon slips and a farmaan scroll rolls itself up.",
    },
    diyas: {
      name: "Rows of diyas",
      description: "Lamps light one by one, then flare into warm light.",
    },
    rangoli: {
      name: "Rangoli",
      description: "A rangoli draws itself in colour, then spins out into light.",
    },
    peacock: {
      name: "Peacock fan",
      description: "A peacock's feathers fan out behind your names, then fold away.",
    },
    storybook: {
      name: "Storybook",
      description: "A gilt clothbound cover swings open to the first page.",
    },
    lanterns: {
      name: "Sky lanterns",
      description: "Glowing paper lanterns drift in the night, then rise away.",
    },
    moonlit: {
      name: "Moonlit night",
      description: "A crescent moon, stars and swaying lanterns over the arches.",
    },
    fireworks: {
      name: "Fireworks",
      description: "Fireworks burst over a skyline of domes.",
    },
    balloons: {
      name: "Balloons",
      description: "A sky full of balloons floats up and away.",
    },
    gift: {
      name: "Gift box",
      description: "The bow unties and the lid lifts off.",
    },
    none: {
      name: "Straight in",
      description: "No opening: guests land on the Scene itself.",
    },
  },
  groups: {
    doors: "Doors and gates",
    reveals: "Curtains and reveals",
    light: "Light and blossom",
    party: "Party",
  },
  godHeading: "God or symbol above",
  godIntro:
    "Shown whole at the top centre, never under any words. Leave it off for an opening without a god.",
  noGod: "None",
  gods: {
    ganesha: "Ganesha",
    "ganesha-gold": "Ganesha in gold",
    "lakshmi-ganesha": "Lakshmi and Ganesha",
    shrinathji: "Shrinathji",
    venkateswara: "Venkateswara",
    jagannath: "Jagannath",
    om: "Om",
    swastik: "Swastik",
    kalash: "Mangal kalash",
  },
} as const;
