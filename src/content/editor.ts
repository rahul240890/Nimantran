import type { EditorStep, FunctionId } from "@/lib/editor/draft";
import { TEMPLATES } from "@/lib/templates/catalog";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/templates/ids";

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
  back: "Back",
  next: "Continue",
  toPreview: "Preview invitation",
  preview: "Invitation preview",
  showPreview: "Preview",
  previewTitle: "Your invitation",
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
      "Add a few photos for your guests, choose the raga that plays as the card opens, and pick what the RSVP asks.",
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
  address: "Address or map link",
  addressHint: "Guests get a directions button on the invitation.",
  dressCode: "Dress code",
  dressIdeas: "Dress code ideas",
  onCard: "On the card",
  endTime: "Ends at",
  endHint: "Leave it empty if the evening runs open.",
  muhuratHint:
    "choose the exact start and end, to the minute. Guests see them just as you set them.",
} as const;

export const coupleCopy = {
  namesHeading: "Names",
  wordingHeading: "Wording",
  example: (sample: string) => `e.g. ${sample}`,
  joinerHint: "The word between the names, like &, weds or संग.",
  doorsHint: "Two short words painted on the gates.",
  anyScript: "Type in any script. Hindi, Tamil, Bengali and more all fit the card.",
  languagesHeading: "Card language",
  languagesHint: "With two languages, guests switch between them on the invitation.",
  bothLanguages: (main: string, second: string) => `${main} and ${second}`,
  secondHeading: (language: string) => `The card in ${language}`,
  secondHint: (main: string) => `Leave a line empty to repeat the ${main} card's words.`,
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
  },
  one: {
    birthday: { label: "Birthday name", example: "Aarav" },
    party: { label: "Party name", example: "Diwali Night" },
  },
  oneHint: "It's printed large on the cover. Say who invites and why in the wording below.",
} as const;

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
  coupleFrame: (index: number, frames: number) =>
    frames === 1 ? "Photo in the frame" : index === 1 ? "First frame" : "Second frame",
  useThisPhoto: (index: number) => `Photo ${index}`,
  musicHeading: "Music",
  musicHint: "Composed live as the card opens, so it costs your guests no data.",
  listen: (raga: string) => `Listen to ${raga}`,
  stopListening: "Stop listening",
  designsOwn: "Design's own",
  playOnOpen: "Play music when guests open the card",
  playOnOpenHint: "Guests can pause it at any time.",
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
    "After the doors open, each function gets its own full-screen page in this theme. Your tradition's ceremony names, blessing and symbol stay the same in every theme.",
  suggested: "Suits your tradition",
  pairs: (design: string) => `Also switches the card to ${design}`,
  preview: "Play the pages",
  textBox: "Box behind the words",
  textBoxHint:
    "Off, the words sit straight on the painting. On, they sit in a soft card-coloured box. Play the pages to compare; the same switch is on the pages too.",
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
    "jungle-party": "Jungle Party",
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
    "jungle-party": "A storybook jungle of friendly animals, balloons and big leaves.",
    classic: "Pages in your card's own paper and colours, with a scene for each function.",
  },
} as const;

/** The editor's live page and lettering (Step 12n). */
export const studioCopy = {
  views: "Show",
  pages: "Pages",
  card: "Card",
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
