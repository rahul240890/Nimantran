import type { EditorStep, FunctionId } from "@/lib/editor/draft";

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
    intro: "Add a few photos for your guests, and choose the raga that plays as the card opens.",
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
  wedding: {
    name: "Wedding",
    description: "The pheras, vows and ceremony",
    dressIdeas: ["Traditional Indian", "Pastels, no black or white", "Silk and zari"],
  },
  reception: {
    name: "Reception",
    description: "Dinner and celebration with everyone",
    dressIdeas: ["Formal", "Black tie", "Festive evening wear"],
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
  addressHint: "Guests get a map button in Step 10.",
  dressCode: "Dress code",
  dressIdeas: "Dress code ideas",
  onCard: "On the card",
} as const;

export const coupleCopy = {
  namesHeading: "Names",
  wordingHeading: "Wording",
  example: (sample: string) => `e.g. ${sample}`,
  joinerHint: "The word between the names, like &, weds or संग.",
  doorsHint: "Two short words painted on the gates.",
  anyScript: "Type in any script. Hindi, Tamil, Bengali and more all fit the card.",
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
  musicHeading: "Music",
  musicHint: "Composed live as the card opens, so it costs your guests no data.",
  designsOwn: "Design's own",
  playOnOpen: "Play music when guests open the card",
  playOnOpenHint: "Guests can pause it at any time.",
  ragaMoods: {
    yaman: "Evening, romantic",
    khamaj: "Light and tender",
    bihag: "Late evening, a wedding raga",
    desh: "Monsoon, festive",
    bhupali: "Bright and joyful",
    madhyamavati: "Auspicious, Carnatic",
  },
} as const;

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
  readyBody:
    "It's saved on this device. Sign in to keep it in your account. Publishing arrives next, then you can share it on WhatsApp.",
  readyBodyAccount:
    "It's saved to your account, so it's on every device you sign in on. Publishing arrives next, then you can share it on WhatsApp.",
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
