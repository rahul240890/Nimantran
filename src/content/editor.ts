import type { EditorStep, FunctionId } from "@/lib/editor/draft";
import type { LeadId, TaalId } from "@/lib/templates/ids";
import { designNames } from "./design-names";

/*
 * English copy for the invite editor (/create). Moves into next-intl in Step 12.
 * Slot names are coupleCopy.slotNames.
 */

export const editor = {
  metaTitle: "Create your invitation",
  metaDescription:
    "Choose a 3D design, add your names and functions, then preview your invitation.",
  headerLabel: "Invite editor",
  opening: "Opening your invite…",
  progressLabel: "Invite progress",
  progress: (step: number, total: number) => `Step ${step} of ${total}`,
  done: "done",
  designChosen: "Your design",
  changeDesign: "Change design",
  /** The three stages the progress shows: pick, fill in, see it. */
  stages: { design: "Design", details: "Your details", preview: "Preview & share" },
  /** The details page: its sections, each folded to one line with what's filled in. */
  sections: {
    label: "Your details, in six parts",
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
    family: (filled: boolean) =>
      filled ? "Family added" : "Optional: parents, blessings and who invites",
    photos: (photos: number) =>
      photos === 0 ? "No photos yet" : photos === 1 ? "1 photo" : `${photos} photos`,
    words: (own: boolean) => (own ? "Your own words" : "Written for your occasion"),
    music: (own: boolean, questions: number) =>
      `${own ? "Your own music" : "The design's music"} · ${questions === 0 ? "no extra questions" : questions === 1 ? "1 question" : `${questions} questions`}`,
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
  "needs-plan": "Not live yet: needs a package",
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
      "A tradition sets the sacred symbol, the blessing at the top, local ceremony names and the family wording. Everything stays editable, and you can skip this step.",
  },
  design: {
    label: "Design",
    eyebrow: "Choose a design",
    title: "Pick the design your guests will open",
    intro:
      "Each design has its own painting, opening and raga. Switch at any time: every word you've typed stays.",
  },
  couple: {
    label: "Names",
    eyebrow: "Names",
    title: "Who's getting married?",
    intro: "Choose the card's language, then type the names. They appear large on every design.",
  },
  family: {
    label: "Family",
    eyebrow: "Family",
    title: "Who's inviting your guests?",
    intro:
      "Parents, blessings and who invites. All optional: what you fill in appears on the family page.",
  },
  functions: {
    label: "Functions",
    eyebrow: "Functions",
    title: "When and where is everything?",
    intro:
      "Choose the functions you're inviting guests to. The card shows the main function's date and venue; guests see every function when they open it.",
  },
  photos: {
    label: "Photos",
    eyebrow: "Photos",
    title: "Add your photos",
    intro: "Add the photos your design shows in its frames, and more for guests to scroll through.",
  },
  words: {
    label: "Card words",
    eyebrow: "Card words",
    title: "Read the card's words",
    intro:
      "Every line is already written for your occasion, from the blessing at the top down. Change any of them to sound like your family, or leave them as they are.",
  },
  music: {
    label: "Music & replies",
    eyebrow: "Music and replies",
    title: "Music and replies",
    intro:
      "Choose the music that plays as the card opens, what the reply asks, and whom guests can call.",
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
  /** Copying a place typed for one event into another, so it is typed once. */
  samePlace: "Same place as another event",
  sameAs: (name: string) => `Same as ${name}`,
  placeToEmpty: (count: number) =>
    count === 1 ? "Use this place for the other event" : `Use this place for ${count} other events`,
} as const;

export const coupleCopy = {
  namesHeading: "Names",
  /** Each line of the card, as its field is labelled. */
  slotNames: {
    doorLeft: "Left door",
    doorRight: "Right door",
    blessing: "Blessing",
    families: "Families",
    first: "First name",
    joiner: "Between the names",
    second: "Second name",
    line: "Invitation line",
    date: "Date and time",
    venue: "Venue",
  },
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
  secondHint: (main: string) => `Leave a line empty to repeat the ${main} card's words.`,
  ideas: "Ideas",
  ideasLabel: (field: string) => `Ideas for ${field}`,
  useIdea: (text: string) => `Use “${text}”`,
} as const;

/** The language step: the card's language, asked before anything is written. */
export const languageCopy = {
  mainHeading: "Card language",
  mainHint: "The names, wording, function names and dates all follow it, and so do these steps.",
  traditionMatch: "your tradition's",
  secondHeading: "Add a second language?",
  secondHint:
    "Guests switch between the two on the invitation. Optional, and it comes with the Celebration and Grand packages.",
  secondNone: "Only one language",
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
      ? "Optional. Your photo shows in the design's own frame. Without one, the design still looks complete."
      : "Optional. Add a photo for each frame, or choose one photo of you both above.",
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
  framePhotoOptional: "Optional",
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
  musicHint: "A raga composed live as the card opens, or your own song.",
  musicSource: { raga: "A raga", own: "Your own music" },
  ragaHint: "Composed live, so it costs your guests no data.",
  ownHint:
    "Pick a song or a recording from your phone and choose where it starts and ends. Guests hear it from their first tap, once through with no repeats, and it fades out at the end. It plays in your video too.",
  chooseSong: "Choose a song",
  songTypes: "MP3, M4A, WAV or AAC",
  readingSong: "Reading your song…",
  songFailed: "That file couldn't be read. Try an MP3 or M4A file.",
  clipFailed: "The clip couldn't be made in this browser. Try Chrome or Safari.",
  clipStorageFailed: "Music can't be saved in this browser, for example in private mode.",
  trimHeading: "Keep the part you love",
  waveformLabel: (name: string) => `The shape of ${name}, with the part you keep lit`,
  startAt: "Starts at",
  endAt: "Ends at",
  keeping: (length: string) => `Keeping ${length}`,
  needNote: (need: string, pages: number) =>
    `Your invitation plays for about ${need}: the opening and ${pages === 1 ? "1 page" : `${pages} pages`}. Keep at least ${need} so the song never stops early or repeats.`,
  sceneNeedNote: (need: string) =>
    `Your invitation plays for about ${need}: the opening and the scene. Keep at least ${need} so the song never stops early or repeats.`,
  fullNote: (full: string) =>
    `Keep about ${full} and the song also plays on softly while the page moves down to the reply form.`,
  fitInvitation: (length: string) => `The invitation, ${length}`,
  fitAll: (length: string) => `With the page below, ${length}`,
  tooShort: (song: string, need: string) =>
    `This song is ${song} long, and your invitation plays for about ${need}. Choose a longer song, so the music lasts to the end without repeating.`,
  chooseLonger: "Choose another song",
  playPart: "Play from the start",
  playEnd: "Hear the ending",
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
  clipMeta: (length: string) => `Your music · ${length}`,
  shortNote: (clip: string, need: string) =>
    `Your invitation now plays for about ${need}, longer than this ${clip} part, so the music would stop early. Choose the part again with Change.`,
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

/** The family's faith, which the religious wording offered follows (lib/traditions/faith.ts). */
export const faithCopy = {
  heading: "Wording for your faith",
  intro:
    "The blessings, lines and gate words suggested below follow it. Everything stays yours to edit.",
  label: "Faith",
  names: {
    hindu: "Hindu",
    sikh: "Sikh",
    muslim: "Muslim",
    christian: "Christian",
    jain: "Jain",
    none: "No religious lines",
  },
  doorIdeas: "Gate words",
  doorIdea: (left: string, right: string) => `Use “${left}” and “${right}”`,
};

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
  elements: "Symbol and blessing",
  elementsIntro: (tradition: string) =>
    `The top of the card, set by your ${tradition} tradition. Change either or leave it off.`,
  elementsLater:
    "You'll choose the symbol and the blessing, such as Shri Ganeshaya Namah, in Card words.",
  symbol: "Symbol at the top of the card",
  symbolNames: {
    om: "Om",
    kalash: "Mangal kalash",
    swastik: "Swastik",
    diya: "Diya",
    prajapati: "Prajapati",
    suzhi: "Pillaiyar suzhi",
    shri: "Shri",
    shankh: "Shankh",
    kamal: "Kamal (lotus)",
    "ik-onkar": "Ik Onkar",
    khanda: "Khanda",
    "chand-tara": "Crescent and star",
    "786": "786",
    bismillah: "Bismillah",
    cross: "Cross",
    dove: "Dove",
    jain: "Jain symbol",
  },
  noSymbol: "No symbol",
  symbolIntro: "Drawn at the top of your card, above every word. Pick one or leave it off.",
  symbolNote:
    "Ganesha and the other painted gods can bless the opening instead: choose one under How it opens, with the design.",
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
};

/** Each design's name and one line about it, as the design step shows them. */
export const designCopy = designNames.cards;

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
    "It's saved to your account, photos included. See it as your guests will, then publish it to get your link.",
  seeAsGuest: "See it as your guests will",
  watchVideo: "Watch it as a video",
  seeAsGuestBody:
    "The whole invitation, full screen: the opening, the music, every page and the reply form.",
  /** Before paying, a preview the family can see (lib/invites/family-link.ts). */
  familyTitle: "Show your family first",
  familyBody:
    "Send them a preview on WhatsApp. They see the invitation as guests will, marked as a preview, and nothing goes to guests until you send it.",
  familySend: "Send to family on WhatsApp",
  familyCopy: "Copy link",
  familyCopied: "Link copied",
  familyFailed: "Couldn't make the link just now. Try again in a moment.",
  familySignInBody:
    "Sign in and we'll make a preview link you can send to your family on WhatsApp.",
  familySignIn: "Sign in to share",
  familyMessage: (url: string) =>
    `Here's a preview of our invitation. Have a look and tell us what you think before we send it: ${url}`,
  notReady: "A few details are missing",
  fix: (label: string) => `Finish ${label.toLowerCase()}`,
  occasionHeading: "Occasion",
  namesHeading: "Names",
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
  heading: "Designs for your occasion",
  moreDesigns: (count: number) => `Show ${count} more designs`,
  textBox: "Box behind the words",
  textBoxHint:
    "Off, the words sit straight on the painting. On, they sit in a soft card-coloured box. Play the pages to compare; the same switch is on the pages too.",
  blessingPage: "Open with the blessing page",
  blessingPageHint:
    "This theme opens with a painting of the god and your blessing beneath it, before your names.",
  names: designNames.names,
  descriptions: designNames.descriptions,
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
    "family-end": "Family, last",
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
      "This invite has used its 3 free drafts. Any package can write as often as you like.",
    failed: "The words couldn't be written just now. Try again.",
  },
} as const;

/** The guest's first screen (Step 12x): how the invitation opens, and the god above it. */
export const openingCopy = {
  heading: "Opening gate (cover screen)",
  intro:
    "The first screen guests see when they tap your link: a gate, doors, a curtain or a cover that opens onto your invitation, full screen. Tap one to watch it open. You can change it any time, even after sharing.",
  filterLabel: "Show by kind",
  filterAll: "All",
  summaryBody: "What guests see first, before your invitation opens.",
  change: "Change opening gate",
  dialogTitle: "Choose your opening gate",
  dialogBody:
    "Your choice saves straight away. The guest preview, the video and your live link all open with it.",
  done: "Done",
  styles: {
    "jaali-vriksh": {
      name: "Tree-of-life jaali",
      description: "Fly through a carved sandstone jaali into a palace garden.",
    },
    pachchikari: {
      name: "Stone flowers",
      description: "Inlaid stone flowers lift out and the marble sinks away.",
    },
    "chik-baradari": {
      name: "Cane blind",
      description: "A woven cane blind rolls up onto a moonlit pavilion.",
    },
    "baori-deep": {
      name: "Stepwell of lamps",
      description: "Dive down a stepwell lit with diyas.",
    },
    "ikat-dhaaga": {
      name: "Ikat threads",
      description: "Ikat silk comes undone thread by thread.",
    },
    "olai-chuvadi": {
      name: "Palm-leaf pages",
      description: "Palm-leaf pages are dealt away to either side.",
    },
    "konark-chakra": {
      name: "Konark wheel",
      description: "A carved stone wheel rolls away across the sand.",
    },
    "mandvi-dhow": {
      name: "Dropping sail",
      description: "A patched sail drops in folds onto the shipyard.",
    },
    shekhawati: {
      name: "Gold scratch",
      description: "Gold foil scratches away onto a painted haveli.",
    },
    lehar: {
      name: "Wave on the sand",
      description: "A wave washes the sand away onto a lagoon.",
    },
    "naksha-pangong": {
      name: "Folding map",
      description: "An old map folds away onto a mountain lake.",
    },
    "toran-mala": {
      name: "Falling torans",
      description: "Rows of mango-leaf torans fall away one by one.",
    },
    jhilmil: {
      name: "Mirror ball",
      description: "A mirror ball lights up the hall, spot by spot.",
    },
    "howrah-tareekh": {
      name: "Calendar pages",
      description: "Calendar pages flip away to the day.",
    },
    "barf-khidki": {
      name: "Frosted window",
      description: "The frost wipes off the glass and melts away.",
    },
    "pondy-gali": {
      name: "Sliding puzzle",
      description: "Puzzle tiles lift out to show a bougainvillea lane.",
    },
    "irani-carrom": {
      name: "Carrom board",
      description: "The carrom board tips back and slides away.",
    },
    channapatna: {
      name: "Toy blocks",
      description: "A wall of wooden toy blocks tumbles down.",
    },
    "ped-ghar": {
      name: "Colouring in",
      description: "A pencil drawing fills with colour.",
    },
    "jhalar-palna": {
      name: "Cradle canopy",
      description: "A lace canopy is drawn up like a pouch.",
    },
    "rajwada-pol": {
      name: "Rajasthani palace gate",
      description:
        "Carved teak doors in a pink sandstone arch swing open onto a courtyard of diyas.",
    },
    "gopuram-kadhavu": {
      name: "South Indian temple doors",
      description: "Brass-studded doors with bells open onto a lamp-lit mandapam.",
    },
    "noor-darwaza": {
      name: "Mughal marble gate",
      description: "Silver jaali doors in a marble arch open onto a moonlit garden of fountains.",
    },
    "phoolon-ki-deewar": {
      name: "Flower wall",
      description: "A wall of roses and marigolds slides apart onto a mandap under fairy lights.",
    },
    "haveli-kiwad": {
      name: "Haveli doors",
      description: "Painted Gujarati doors with mirror work open onto a courtyard with a swing.",
    },
    "shahi-parda": {
      name: "Royal curtains",
      description: "Maroon and gold velvet curtains gather aside onto a chandelier-lit hall.",
    },
    "deco-gates": {
      name: "Art Deco gates",
      description: "Black and brass gates swing open onto a rooftop party over the city.",
    },
    "bagiya-gate": {
      name: "Rose garden gate",
      description: "White iron gates wrapped in roses open onto a lantern-lit garden.",
    },
    "mela-tamboo": {
      name: "Fair tent",
      description: "Striped tent flaps lift onto balloons, a carousel and a big cake.",
    },
    "chaand-dwar": {
      name: "Moonlit garden doors",
      description: "Mother-of-pearl doors of crescents and stars open onto a moonlit pool garden.",
    },
    "ritu-dwar": {
      name: "Courtyard doors",
      description:
        "Old terracotta and green doors, carved with a leaf for each season, open onto a blossoming tree.",
    },
    "raag-dwar": {
      name: "Music-room doors",
      description: "Lapis and gold painted doors open onto a palace terrace with a veena at dawn.",
    },
    "van-dwar": {
      name: "Forest door",
      description:
        "Doors of woven branches and leaves open onto a mossy path into the fable forest.",
    },
    "patang-dwar": {
      name: "Rooftop doors",
      description: "Bright turquoise doors painted with kites open onto the dawn rooftops.",
    },
    "kumhar-dwar": {
      name: "Potters' lane doors",
      description: "Indigo doors with terracotta tiles open onto a lane lit by hundreds of diyas.",
    },
    "karghaa-dwar": {
      name: "Weavers' house doors",
      description: "Doors wrapped in red silk and gold zari open onto a weavers' courtyard.",
    },
    "navrang-dwar": {
      name: "Doors of nine colours",
      description: "White doors set with nine bands of coloured glass open onto a rose pavilion.",
    },
    "ghat-dwar": {
      name: "Riverside ghat doors",
      description: "Teal doors carved with waves and fish open onto a glacier spring at dawn.",
    },
    "rekha-dwar": {
      name: "Doors drawn in one line",
      description: "Ivory paper doors drawn in one gold line open onto a sunrise over lotuses.",
    },
    "naqsha-pat": {
      name: "Inlaid palace doors",
      description:
        "Ivory doors inlaid with a gold-line palace swing open onto a lake palace at dusk.",
    },
    "kinkhab-parda": {
      name: "Brocade curtains",
      description:
        "Wine brocade curtains woven with gold gather aside onto a candlelit palace hall.",
    },
    "taad-patta-dwar": {
      name: "Palm-leaf screens",
      description:
        "Woven palm-leaf screens slide apart onto a villa over a lotus lagoon at sunset.",
    },
    "pichwai-pat": {
      name: "Pichwai curtains",
      description:
        "Painted Pichwai cloths of lotuses and cows gather aside onto a moonlit lotus pond.",
    },
    "chandi-kiwad": {
      name: "Silver doors",
      description:
        "Embossed silver doors swing open onto a palace on a lake, every window glowing.",
    },
    "swarg-kiwad": {
      name: "Doors in the clouds",
      description:
        "White marble doors carved with clouds swing open onto a pavilion floating on golden clouds.",
    },
    "firoza-darwaza": {
      name: "Tiled iwan gate",
      description:
        "Walnut doors inlaid with turquoise stars swing open onto a reflecting-pool garden.",
    },
    "jharokha-pat": {
      name: "Stained-glass shutters",
      description:
        "Pink shutters set with stained glass swing open onto a palace of windows at sunset.",
    },
    "hina-kiwad": {
      name: "Henna-painted doors",
      description:
        "Cream doors drawn over with henna swing open onto an apricot courtyard of marigolds.",
    },
    "mor-pankh": {
      name: "Peacock-feather screens",
      description:
        "Screens of peacock feathers slide apart onto a lotus lake with a marble chhatri.",
    },
    "jugnu-parda": {
      name: "Firefly curtain",
      description:
        "An indigo curtain lit with fireflies gathers aside onto a moonlit lake of water lilies.",
    },
    "sheesh-kiwad": {
      name: "Mirror-work doors",
      description: "Doors of sheesh mirror-work swing open onto a durbar hall under chandeliers.",
    },
    "sunehri-phatak": {
      name: "Gold-leaf doors",
      description: "Gold-leaf doors swing open onto a golden-domed pavilion across a still lake.",
    },
    "pattu-thirai": {
      name: "Silk sari curtains",
      description:
        "Kanjeevaram silk curtains gather aside onto a temple tank lit with brass lamps.",
    },
    "kagaz-kiwad": {
      name: "Embossed paper doors",
      description: "Embossed ivory paper doors with a gold seal open onto a soft blush wash.",
    },
    "peetal-kiwad": {
      name: "Bronze doors",
      description:
        "Doors cast in Dhokra bronze swing open onto a courtyard of lamps round a bronze tree of life.",
    },
    "kaanch-pat": {
      name: "Painted glass screens",
      description:
        "Glass panels painted with parrots and a peacock slide apart onto a jewel-bright palace garden.",
    },
    "thinnai-kadhavu": {
      name: "Carved teak doors",
      description:
        "Carved Burma-teak doors with brass studs swing open onto the mansion's sunlit courtyard.",
    },
    "meena-pat": {
      name: "Enamelled gold screens",
      description:
        "Gold panels enamelled with parrots and a flowering tree slide apart onto a Jaipur palace garden.",
    },
    "rogan-parda": {
      name: "Rogan curtains",
      description:
        "Maroon curtains painted in rogan gather aside onto a Kutchi courtyard at golden hour.",
    },
    "makhmal-parda": {
      name: "Velvet curtains",
      description:
        "Black velvet curtains embroidered with roses gather aside onto a candlelit room of flowers.",
    },
    "sama-dwar": {
      name: "Pastel doors",
      description:
        "Mint doors with pastel panels swing open onto a symmetrical courtyard and a long reflecting pool.",
    },
    "dilli-phatak": {
      name: "Haveli doors",
      description:
        "Old turquoise haveli doors with iron spikes swing open onto a courtyard strung with lights and marigolds.",
    },
    "nakkashi-pat": {
      name: "Silver repoussé screens",
      description:
        "Silver panels raised with peacocks and parrots slide apart onto a moonlit marble garden.",
    },
    "gagan-parda": {
      name: "Balloon-silk curtains",
      description:
        "Painted balloon silk gathers aside onto a sunrise sky full of hot-air balloons over a lake palace.",
    },
    "bel-khidki": {
      name: "Bougainvillea shutters",
      description:
        "Blue window shutters grown over with bougainvillea swing open onto a sunset arch.",
    },
    "pankhudi-pat": {
      name: "Water-lily petals",
      description: "Two great water-lily petals unfold aside onto a lily pond.",
    },
    "gulaab-lifafa": {
      name: "Wax-sealed envelope",
      description:
        "A watercolour envelope with a wax rose seal lifts open onto an arch of golden roses.",
    },
    "os-parda": {
      name: "Dew curtain",
      description: "A sheer white voile sewn with tiny flowers gathers aside onto a white garden.",
    },
    "surkh-dwar": {
      name: "Rose garden doors",
      description: "Old garden doors grown over with red roses swing open onto a rose walk.",
    },
    "itr-dibbi": {
      name: "Perfume box",
      description: "The silk-lined doors of a perfume box swing open, and a blush haze rolls out.",
    },
    "gulaab-bhaap": {
      name: "Rose steam",
      description: "Two banks of rose-scented steam drift apart onto the rose fields of Kannauj.",
    },
    "oud-darwaza": {
      name: "Studded doors",
      description: "Heavy carved doors with brass studs swing open as incense smoke curls out.",
    },
    "tarkashi-jaali": {
      name: "Silver filigree screens",
      description:
        "Two silver filigree screens slide apart onto a marble garden and its rosewater sprinkler.",
    },
    "aaina-pat": {
      name: "Mirror wings",
      description:
        "The carved wings of a folding mirror swing open onto a dressing table in lilac light.",
    },
    "megh-parda": {
      name: "Monsoon clouds",
      description: "Two banks of monsoon cloud slide apart onto a lotus lake below the mountains.",
    },
    "pehar-jaali": {
      name: "Marble screens",
      description: "Carved marble jaali screens slide apart onto a pavilion on a lotus pool.",
    },
    "lata-phatak": {
      name: "Garden gate",
      description: "A vine-covered garden gate swings open onto a garden at dawn.",
    },
    "kitaab-jild": {
      name: "Storybook cover",
      description: "A storybook's ribboned cover opens onto a paper pop-up palace.",
    },
    "itr-almari": {
      name: "Attar cabinet",
      description: "The glass doors of an attar cabinet open, and rose mist rolls out.",
    },
    "kosh-jild": {
      name: "Bird album",
      description: "Lacquered album covers open onto sarus cranes by a lotus pond.",
    },
    "gudiya-pat": {
      name: "Dollhouse front",
      description: "The painted front of a toy haveli swings open onto its lit rooms.",
    },
    "yantra-pat": {
      name: "Astrolabe plate",
      description: "A brass astrolabe plate splits open onto the observatory at sunset.",
    },
    "rang-parda": {
      name: "Dyed cloths",
      description: "Two long bandhani cloths gather aside onto a dyer's courtyard.",
    },
    "genda-ladi": {
      name: "Marigold curtain",
      description: "A curtain of marigold strings gathers aside onto the flower market.",
    },
    "kaleen-parda": {
      name: "Carpet curtain",
      description: "A woven carpet slides aside onto a city of blue domes at dawn.",
    },
    "truck-darwaza": {
      name: "Truck doors",
      description:
        "Painted truck doors with peacocks and lotuses swing open onto the road at sunset.",
    },
    "kaanch-dhakkan": {
      name: "Velvet cover",
      description: "A velvet cloth gathers aside to show a little world under glass.",
    },
    "pati-pat": {
      name: "Classroom doors",
      description: "Wooden classroom doors with chalk flowers open onto a path to the village.",
    },
    "jad-jhalar": {
      name: "Vine curtain",
      description: "A curtain of hanging roots and vines gathers aside onto the river bridges.",
    },
    "gol-darwaza": {
      name: "Cottage door",
      description: "A round pink clay door swings open onto a cottage garden.",
    },
    "jhaadi-deewar": {
      name: "Hedge gates",
      description: "Two clipped hedge walls slide apart onto a rose arch path.",
    },
    "deco-dibba": {
      name: "Lift doors",
      description: "Art deco lift doors slide apart onto a train crossing a viaduct.",
    },
    "samundar-parda": {
      name: "Kelp curtain",
      description: "Kelp parts under the water to show a coral arch and white sand.",
    },
    "shatranj-sandook": {
      name: "Chessboard doors",
      description: "Inlaid chessboard doors swing open onto a palace terrace with a chess game.",
    },
    pankhi: {
      name: "Painted fan",
      description:
        "A silk hand fan of lotuses and parrots folds shut onto a lantern-lit palace terrace.",
    },
    "sheesh-mahal": {
      name: "Mirror palace",
      description: "A wall of tiny mirrors turns like louvres onto a candle-lit sheesh mahal.",
    },
    "popup-mahal": {
      name: "Pop-up palace",
      description: "A cut-paper lake palace stands up like a pop-up book, then you step inside.",
    },
    odhni: {
      name: "Bridal veil",
      description:
        "A red bandhani odhni ripples in the breeze, then lifts away onto a moonlit courtyard.",
    },
    "kavad-peti": {
      name: "Story box",
      description: "A painted Mewar kavad unfolds twice, onto a garden pavilion at golden hour.",
    },
    "chhatri-utsav": {
      name: "Royal parasol",
      description: "An embroidered parasol turns overhead, then spins up into the sky.",
    },
    "jal-darpan": {
      name: "Still lake",
      description: "Ripples spread from a floating diya and the lake opens onto a lamp-lit ghat.",
    },
    "pushp-varsha": {
      name: "Petal shower",
      description: "A wall of rose petals comes apart in a whirl onto the varmala stage.",
    },
    "moti-seep": {
      name: "Pearl shell",
      description: "A great shell lifts its lid on a glowing pearl, onto a beach pavilion.",
    },
    "badal-raag": {
      name: "Monsoon clouds",
      description: "Rain clouds part, sun breaks through and a rainbow draws itself over a palace.",
    },
    "jugnu-van": {
      name: "Firefly forest",
      description:
        "Fireflies gather round your names, then burst as the forest parts onto a lit banyan.",
    },
    "uday-surya": {
      name: "Sunrise",
      description: "The sun rises over the hills and they sink away onto your new home.",
    },
    taaramandal: {
      name: "Constellation",
      description:
        "Stars join in gold round your names, then you fly through them to the observatory.",
    },
    "thar-ki-ret": {
      name: "Desert sands",
      description: "A wind sweeps the dunes away onto a fort camp under lanterns.",
    },
    "sheher-ki-raat": {
      name: "City lights",
      description: "The city's windows wake one by one, then the whole skyline lights up.",
    },
    "choodi-chakra": {
      name: "Bangle rings",
      description: "Rings of glass bangles turn round your names, then spread like ripples.",
    },
    "sanjhi-roshni": {
      name: "Sanjhi lantern",
      description: "A lamp glows through a cut-paper stencil, then the sheet turns like a page.",
    },
    "chhaya-parda": {
      name: "Shadow screen",
      description: "Puppet shadows sway on a lamp-lit screen, then it rolls up onto the stage.",
    },
    "athangudi-tiles": {
      name: "Chettinad tiles",
      description: "Glossy Athangudi tiles turn over in a wave onto a Chettinad courtyard.",
    },
    "gulaal-bindu": {
      name: "Colour drops",
      description: "Drops of gulaal bloom across the paper into a bright Holi courtyard.",
    },
    bioscope: {
      name: "Bioscope",
      description: "A kaleidoscope turns in an old bioscope's lens, then the lens opens round you.",
    },
    "kaanch-ka-gola": {
      name: "Snow globe",
      description: "Snow falls in a globe; it shakes and you fall into the winter village.",
    },
    phirki: {
      name: "Paper pinwheel",
      description: "A folded paper square opens flap by flap onto a village fair.",
    },
    bulbule: {
      name: "Soap bubbles",
      description: "A big bubble wobbles round your names, then pops onto a garden party.",
    },
    "chhuk-chhuk": {
      name: "Toy train",
      description: "A little steam train puffs past, and the steam clears onto a party station.",
    },
    chadar: {
      name: "Water veil",
      description:
        "A sheet of water falls over a marble wall of lamp niches, then stops and thins away from the top.",
    },
    parwaaz: {
      name: "Embroidered birds",
      description:
        "Silk embroidered with resting birds: the birds lift off and fly, and the silk floats up after them.",
    },
    bhanwar: {
      name: "Marbled whirlpool",
      description:
        "A sheet of Deccani marbled paper swirls like a whirlpool and drains away into the middle.",
    },
    "jaali-patta": {
      name: "Skeleton leaf",
      description:
        "Light runs up the veins of a great lace-like leaf, then it turns and flutters down.",
    },
    "lapet-khule": {
      name: "Quilled rosette",
      description:
        "A rosette of rolled paper coils spins, the rings spring loose and the curls bounce away.",
    },
    taar: {
      name: "Veena strings",
      description:
        "A carved sandalwood panel strung like a veena: the strings shimmer as if plucked, then the panel parts strip by strip.",
    },
    pratibimb: {
      name: "Lake reflection",
      description:
        "The invitation opens on a reflection in a lotus lake; a ripple runs out and the view lifts out of the water.",
    },
    mohur: {
      name: "Silver coin",
      description:
        "A great embroidered silver coin spins on its edge, flips, and you pass right through it.",
    },
    gathbandhan: {
      name: "Tied dupattas",
      description:
        "Two leheriya dupattas sweep in, tie a knot in the middle and rise away together like a banner.",
    },
    phuljhadi: {
      name: "Sparkler ring",
      description:
        "A sparkler draws a ring of golden light round the names, and the black lacquer opens like an iris.",
    },
    semal: {
      name: "Silk-cotton floss",
      description:
        "The pods of a silk-cotton tree split and white floss bursts out, swirling away on the breeze.",
    },
    thappa: {
      name: "Block print",
      description:
        "A carved wooden block stamps prints across a cotton sheet; each print opens a window, then the sheet lifts away.",
    },
    gumbad: {
      name: "Painted dome",
      description:
        "You look up into a painted dome; its sky opening widens like an iris and petals pour down.",
    },
    ghadi: {
      name: "Pocket watch",
      description:
        "An antique pocket watch: its hands sweep round to the hour, a soft chime, and you pass into its face.",
    },
    hindolo: {
      name: "Painted swing",
      description:
        "A painted Sankheda swing sways, then sweeps high toward you and up out of sight.",
    },
    "reshmi-gaanth": {
      name: "Satin bow",
      description:
        "Porcelain doors tied with a blush satin bow; it slips loose, the ribbon falls away and the doors swing open.",
    },
    "moti-kaanta": {
      name: "Pearl brooch",
      description:
        "Silk panels pinned with a pearl-and-crystal brooch; it unpins and floats up, and the panels part like a train.",
    },
    guldasta: {
      name: "Posy on twine",
      description:
        "Engraved copper plates tied with a posy of frangipani; the twine slips, the posy drops and the plates slide apart.",
    },
    "neeli-titli": {
      name: "Blue butterfly",
      description:
        "Mist-blue cottage doors held by an enamel butterfly; it opens its wings and flies off, and the doors swing open.",
    },
    "itr-shishi": {
      name: "Attar bottle",
      description:
        "Rose-pink doors tied with a silk cord and a cut-glass attar bottle; the cord slips and the bottle drops in a puff of petals.",
    },
    "van-mala": {
      name: "Wild-flower garland",
      description:
        "Carved deodar doors with a garland of mountain flowers knotted across; the knot loosens and the garland falls.",
    },
    gulband: {
      name: "Silk rosette",
      description:
        "Two thick-painted canvases wrapped with a coral ribbon and rosette; the rosette spins away and the canvases slide apart.",
    },
    mudra: {
      name: "Wax seal",
      description:
        "Embossed paper panels sealed with an oxblood wax seal; it cracks in two and each half leaves with its panel.",
    },
    "shankha-pola": {
      name: "Shankha and pola",
      description:
        "Green Kolkata shutters linked by a shell bangle and a red lac bangle; they unlink and roll apart, and the shutters open.",
    },
    challa: {
      name: "Scarf ring",
      description:
        "A printed silk scarf knotted through a gold ring; the ring slides away and the silk panels draw apart.",
    },
    latkan: {
      name: "Zari tassels",
      description:
        "Sheer Chanderi curtains held by a tasselled zari tie-back; it loosens, the tassels drop and the curtains drift apart.",
    },
    "shakkar-chakri": {
      name: "Sugar medallion",
      description:
        "Fondant doors sealed with a sugar medallion; it bursts into sugar pearls and the doors swing open.",
    },
    "raghu-maina": {
      name: "Parrot clasp",
      description:
        "Paithani silk panels held by a gold clasp of two parrots; they unhook and swing apart, and the silk slides open.",
    },
    "taala-chaabi": {
      name: "Silver lock",
      description:
        "Carved walnut doors held by a silver rose lock; it springs open and drops, and the doors swing open.",
    },
    "phool-gend": {
      name: "Ball of petals",
      description:
        "Doors woven of jasmine and roses, held by a ball of rose petals; it bursts into petals and the doors swing open.",
    },
    "panna-pat": {
      name: "Thewa locket",
      description:
        "A Thewa locket on a ruby cord holds two emerald-glass doors; it clicks open and drops, and the doors swing open.",
    },
    "sikki-dwar": {
      name: "Grass fish",
      description:
        "A woven sikki fish on a grass rope holds the doors; it swims away, the rope slips off and the doors swing open.",
    },
    "hase-bagilu": {
      name: "Painted birds",
      description:
        "Two painted birds latch red-earth doors; they slide apart and fly off, and the doors swing open.",
    },
    "kankreet-dwar": {
      name: "Brass medallion",
      description:
        "A brass medallion on a strap holds concrete doors; it turns a quarter turn with a click and the doors slide apart.",
    },
    "chhaap-kiwad": {
      name: "Safety pin",
      description:
        "A giant printed safety pin holds the doors; it springs open and drops, and the doors swing open.",
    },
    "purana-darwaza": {
      name: "Shop bell",
      description:
        "A brass shop bell on a red cord holds old wooden doors; it rings, falls away and the doors swing open.",
    },
    "bindi-kiwad": {
      name: "Dotted birds",
      description:
        "Two dotted birds carry a garland across the doors; they fly off with it and the doors swing open.",
    },
    "masala-almari": {
      name: "String of chillies",
      description:
        "A string of chillies and cinnamon ties a spice cupboard; it slips loose and the doors swing out toward you.",
    },
    "kaagaz-pat": {
      name: "Striped sash",
      description:
        "A striped Manipuri sash with a lily ties paper-cut doors; it floats away and the doors slide apart.",
    },
    "rupa-kiwad": {
      name: "Silver ball",
      description:
        "A silver filigree ball on a chain holds the doors; it opens like a flower and the doors swing open.",
    },
    "ola-vathil": {
      name: "Palm-leaf knot",
      description:
        "A plaited palm-leaf knot with a hibiscus ties the doors; it springs loose and the doors swing open.",
    },
    "seep-kiwad": {
      name: "Pearl rosette",
      description:
        "Strings of pearls gathered by a pearl rosette hold rosewood doors; they slip away and the doors swing open.",
    },
    "aakar-pat": {
      name: "Red circle",
      description:
        "A red circle on a black line holds the doors; it rolls away along the line and the doors slide apart.",
    },
    "shwet-dwar": {
      name: "Velvet and lily",
      description:
        "A velvet ribbon holding a lily ties the doors; the lily drops, the ribbon slides away and the doors swing open.",
    },
    "moti-dwar": {
      name: "Glass bubble",
      description:
        "A pearl-ringed glass bubble holds pearly doors; it bursts in a shimmer and the doors swing open.",
    },
    "yashab-kiwad": {
      name: "Jade bangle",
      description:
        "A carved jade bangle on a gold chain holds the jade doors; it slips free and drops, and the doors swing open.",
    },
    "usta-kiwad": {
      name: "Gold sunburst",
      description:
        "A raised-gold sunburst on a blue ribbon holds the doors; the ribbon unties and the doors swing open.",
    },
    "pixel-kiwad": {
      name: "Pixel gem",
      description:
        "A pixel gem on a pixel chain holds the doors; it bursts into pixels and the doors swing open.",
    },
    "saaya-kiwad": {
      name: "Birds on a wire",
      description:
        "Two silhouette birds sit on a wire across the doors; they fly off and the doors swing open onto the sunset.",
    },
    "jad-dwar": {
      name: "Bamboo latch",
      description:
        "A bamboo latch with an orchid holds the doors of living roots; it slides free and the doors part to each side.",
    },
    "natak-dwar": {
      name: "Velvet rope",
      description:
        "A theatre's velvet rope on a brass hook holds the stage doors; it drops and the doors swing open.",
    },
    "kashi-kiwad": {
      name: "Tile chain",
      description:
        "A brass door chain with a glazed tile holds the doors; it rings, falls away and the doors swing open.",
    },
    "paandaan-pat": {
      name: "Peacock cutter",
      description:
        "A silver peacock betel-nut cutter holds the silver doors; it turns and lets go, and the doors open outward.",
    },
    "marmar-dwar": {
      name: "Brass rings",
      description:
        "Two interlocking brass rings hold the marble doors; they roll away and the doors slide apart.",
    },
    "goa-dwar": {
      name: "Painted tile",
      description:
        "A painted Goan tile on a cord holds the blue doors; it turns and lets go, and the doors swing open.",
    },
    "haveli-pat": {
      name: "Paranda braid",
      description:
        "A silk paranda braid with pompoms ties the painted doors; it unties and the doors swing open.",
    },
    "bah-dwar": {
      name: "Gamosa knot",
      description:
        "A gamosa tied in a knot holds the bamboo doors; it unties and the doors swing open.",
    },
    "akeek-pat": {
      name: "Quartz crystal",
      description:
        "A quartz crystal wrapped in gold holds the agate doors; it cracks and the doors slide apart.",
    },
    "sagar-dwar": {
      name: "Sailor's knot",
      description:
        "A sailor's knot with a shell holds the driftwood doors; it unties and the doors open outward to the sea.",
    },
    "khet-phatak": {
      name: "Kite on a string",
      description:
        "A kite caught on its string holds the gate to the fields; it flies off and the doors open outward.",
    },
    "sona-parat": {
      name: "Gold-laced glass",
      description:
        "Three arches of glowing emerald, ruby and sapphire glass laced with gold; you glide through them one by one.",
    },
    mauni: {
      name: "Coiled baskets",
      description:
        "Three coiled rims of golden grass, like looking into a basket; they spin and you dive through.",
    },
    chowka: {
      name: "Turning diamonds",
      description:
        "Three diamonds of white rice-paste pattern on red earth; each turns a quarter turn as you pass through.",
    },
    khidkiyaan: {
      name: "Concrete windows",
      description:
        "A concrete wall, a grid of coloured sunshades and a round window; you walk through all three.",
    },
    "phool-chhaap": {
      name: "Printed flower",
      description:
        "A flower, a scallop and a circle printed in pink and blue; the inks slip, then you zoom through.",
    },
    "gali-gali": {
      name: "Sketched lane",
      description: "Three sketched archways down an old lane; you walk down the lane through each.",
    },
    tipki: {
      name: "Dotted tree",
      description:
        "A dotted tree, a ring of birds and a ring of flowers twinkle, then you fly through them.",
    },
    "masala-dabba": {
      name: "Spice tin",
      description:
        "Rings of whole spices and the rim of a brass spice tin; you dive down into the tin.",
    },
    phumdi: {
      name: "Floating islands",
      description:
        "Paper-cut hills, a floating ring of grass and a ring of lilies; you glide over the lake through them.",
    },
    "rupa-jaali": {
      name: "Silver lockets",
      description:
        "Three silver filigree ovals, like a locket inside a locket; each tilts and glints as you pass.",
    },
    thoranam: {
      name: "Leaf arches",
      description:
        "An arch of plaited leaves, a ring of leaf flowers and a ring of leaf fish sway, then swing away as you pass.",
    },
    "seep-mehrab": {
      name: "Pearl arches",
      description:
        "Three Mughal arches of dark wood inlaid with pearl, like a palace hall you walk down.",
    },
    "teen-aakar": {
      name: "Three shapes",
      description:
        "A square, a circle and a triangle cut through three canvases turn slowly, then you pass through each.",
    },
    galiyara: {
      name: "Colonnade",
      description:
        "Three stone arches down a black-and-white colonnade, traced in gold; you walk through them.",
    },
    chamak: {
      name: "Rainbow shimmer",
      description:
        "A pearly arch, a ring of rainbow glass and a ring of pearls catch a rainbow shimmer as you glide through.",
    },
    "yashab-kamal": {
      name: "Jade lotus",
      description:
        "A great jade lotus covers the screen round a gold-and-ruby heart; the heart lifts and the petals open out, ring by ring.",
    },
    manoti: {
      name: "Gold-relief dome",
      description:
        "A gold-relief flower of rounded lobes, like the inside of a Bikaner dome; the gold boss lifts and the lobes open out.",
    },
    "chaukor-phool": {
      name: "Pixel flower",
      description:
        "A giant pixel flower fills the screen; its heart blinks away and the petals open in blocky steps, like a game level starting.",
    },
    "naariyal-chhaya": {
      name: "Palm canopy",
      description:
        "Looking up through black palm fronds at a sunset sky; they sway, the crown slips away and the fronds part.",
    },
    kundal: {
      name: "Fern canopy",
      description:
        "Giant tree-fern fronds cover the screen like a forest canopy; the curled fern uncurls and the fronds open.",
    },
    "makhmali-chakra": {
      name: "Velvet fan",
      description:
        "A sunburst of pleated crimson velvet and teal silk with gold fringe; the medallion rises and the pleats fold back.",
    },
    "kashi-phool": {
      name: "Tile flower",
      description:
        "A great flower of glazed tile petals in cobalt and turquoise; the centre tile turns away and the petals tip outward.",
    },
    beeda: {
      name: "Betel leaves",
      description:
        "A ring of glossy betel leaves round a silver-wrapped paan; the paan lifts away and the leaves fold outward.",
    },
    "farshi-phool": {
      name: "Marble medallion",
      description:
        "A marble floor medallion of white and blush petals edged in brass; the brass boss rises and the petals slide apart.",
    },
    "seep-khidki": {
      name: "Shell window",
      description:
        "A round window of glowing oyster-shell panes in blue frames; the hub turns and the panes swing open like shutters.",
    },
    phundne: {
      name: "Tassel burst",
      description:
        "A burst of silk paranda tassels round a big pompom; the pompom bounces away and the tassels swing outward.",
    },
    "japi-chakra": {
      name: "Japi wheel",
      description:
        "A giant japi's woven segments round a jewelled centre; the centre lifts and the segments fan out, spinning open.",
    },
    "akeek-phool": {
      name: "Agate flower",
      description:
        "A flower of agate slices edged in gold round a sparkling geode; the geode lifts and the slices slide outward.",
    },
    "sagar-seep": {
      name: "Glowing shell",
      description:
        "A giant scallop shell glowing in the dark; the pearl at its heart lifts and the ribs open outward like a wave.",
    },
    "khet-chakra": {
      name: "Wheel of fields",
      description:
        "Wedges of marigold and tea fields seen from above round a stepwell; the stepwell sinks and the wedges slide out.",
    },
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
      description: "A wax seal pressed with a flower breaks and the card rises out.",
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
    own: "Made for your design",
    fresh: "Fresh openings",
    skies: "Skies and nature",
    crafts: "Crafts and colour",
    play: "Fun and playful",
    themed: "Its own opening",
    tied: "Tied gates",
    depth: "Depth openings",
    bloom: "Bloom openings",
    painted: "Painted gates",
    doors: "Doors and gates",
    reveals: "Curtains and reveals",
    light: "Light and blossom",
    party: "Party",
  },
  welcomeHeading: "The welcome after it",
  welcomeIntro:
    "A moment with your names before the pages. Automatic brings a different scene that suits the opening each time a guest opens it.",
  welcomeAuto: "Automatic",
  welcomeNames: {
    royal: "Palace toran",
    bloom: "Lotus",
    lamps: "Diyas",
    night: "Moon and lanterns",
    party: "Confetti",
    letter: "Letter",
    mandala: "Mandala",
    peacock: "Peacock",
    sunrise: "Sunrise",
    garden: "Garden",
    rangoli: "Rangoli",
    ghat: "Ghat at dusk",
    fireflies: "Fireflies",
    "sky-lanterns": "Sky lanterns",
    kites: "Kites",
    waves: "Seaside sunset",
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
    diya: "Diya",
    prajapati: "Prajapati",
    suzhi: "Pillaiyar suzhi",
    shri: "Shri",
    shankh: "Shankh",
    kamal: "Kamal (lotus)",
    "ik-onkar": "Ik Onkar",
    khanda: "Khanda",
    "chand-tara": "Crescent and star",
    "786": "786",
    bismillah: "Bismillah",
    cross: "Cross",
    dove: "Dove",
    jain: "Jain symbol",
  },
} as const;

/**
 * A design's own page (/create/<design>, update 4): the design on top with the names
 * appearing as they're typed, and one short form below.
 */
export const quickCopy = {
  metaTitle: (name: string) => `Make your invitation: ${name}`,
  back: "Back",
  watch: "Watch it open",
  free: "Free to try. Pay only when you send.",
  eyebrow: "Make it yours",
  title: "Your invitation in a few minutes",
  intro:
    "Type your names and they appear on the design. The wording, music and reply questions fill themselves in.",
  whenHeading: "When and where",
  addFunction: "Add another function",
  addOne: (name: string) => `Add ${name}`,
  remove: (name: string) => `Remove ${name}`,
  familyTitle: "Family names",
  familyIntro: "Optional: parents, blessings and whom guests can call",
  photosTitle: "Your photos",
  photosIntro: "Optional: the design has a frame for your photo",
  see: "See my invitation",
  nothingToPay: "Nothing to pay yet",
  more: "More options",
  moreIntro: "Your own song, wording, opening gate and questions",
  make: "Short on time? We'll make it for you",
  /** Hides the make-it-for-you line that shows after a minute on a design's page. */
  hideMake: "Hide this",
  opening: "Opening the design…",
} as const;
