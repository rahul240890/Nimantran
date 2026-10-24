import type { TemplateId } from "@/lib/templates/schema";

/*
 * English copy for the app shell and the landing page. Hindi: src/content/hi/landing.ts.
 */

export const homeMeta = {
  title: "Shubh Invitation · 3D invitations your guests open, turn and keep",
  description:
    "Create a 3D invitation in minutes, share it on WhatsApp, and collect RSVPs in one tap. Made for Indian weddings and every celebration after.",
  tagline: "3D invitations your guests open, turn and keep",
} as const;

export const nav = [
  { id: "designs", label: "All designs" },
  { id: "sample", label: "Live invitation" },
  { id: "pricing", label: "Pricing" },
  { id: "help", label: "Help on WhatsApp" },
] as const;

/** The header's tabs and their short lists (src/components/shell/site-menu.ts). */
export const menuCopy = {
  tabs: {
    weddings: "Wedding",
    engagement: "Engagement",
    birthday: "Birthday",
    occasions: "More occasions",
    traditions: "Traditions",
  },
  weddingAll: "Wedding invitations",
  video: { title: "Invitation video", note: "For WhatsApp Status and Reels" },
  cards: { title: "Save the date and thank-you cards", note: "To send before and after the day" },
  set: { title: "Complete Wedding Set", note: "Invitation, videos and cards together" },
  functions: "Wedding functions",
  allOccasions: (count: number) => `All ${count} occasions`,
  sample: "See a live invitation",
  help: "Need help? WhatsApp us",
};

export const shell = {
  skipToContent: "Skip to main content",
  primaryNav: "Main",
  openMenu: "Open menu",
  menuTitle: "Menu",
  createInvite: "Start free",
  faq: "FAQ",
  createInviteShort: "Start free",
  language: {
    label: "Language",
    current: (name: string) => `Language: ${name}`,
    soon: "Soon",
    note: "Marathi, Gujarati, Bengali and Tamil are new and being checked by native speakers. Telugu, Kannada, Malayalam and Punjabi follow.",
  },
  themeHeading: "Theme",
  /** What the Help on WhatsApp link writes for the visitor, ready to send. */
  helpMessage: "Hello Shubh Invitation, I'd like help making my invitation.",
  /** What We'll make it for you writes, ready to send with the family's details. */
  makeMessage: "Hello Shubh Invitation, please make our invitation for us. Our details:",
  /** The same, from a design's own page: the design named. */
  makeMessageFor: (design: string) =>
    `Hello Shubh Invitation, please make our invitation for us in the design ${design}. Our details:`,
  footer: {
    tagline: "3D invitations your guests open, turn and keep.",
    explore: "Explore",
    languages: "Languages",
    meaning: "Invitations that come alive.",
    madeIn: "Made in India",
    rights: "All rights reserved.",
  },
} as const;

export const hero = {
  eyebrow: "Create · Invite · Celebrate",
  title: "Invitations that come alive.",
  body: "Find a painted design for your occasion, add your names and dates, and share it on WhatsApp. Guests reply in one tap.",
  /** Opens a whole invitation as a guest gets it, with made-up names (/sample). */
  sample: "Open a live invitation",
  proof: ["Create free", "No app for guests", "Pay once, no subscription"],
  card: {
    doors: ["SHUBH", "VIVAH"],
    blessing: "",
    families: "TOGETHER WITH THEIR FAMILIES",
    first: "Aarav",
    joiner: "&",
    second: "Meera",
    line: "invite you to celebrate their wedding",
    date: "SATURDAY, 12 DECEMBER 2026",
    venue: "Pichola Lakeside Gardens, Udaipur",
  },
} as const;

/**
 * The first screen's phone, which plays an invitation from its design to a guest's reply,
 * and the steps beside it. The words in the phone are pictures of the app (hidden from
 * screen readers); the steps say the same in full.
 */
export const homeFlow = {
  heading: "How it works",
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  pause: "Pause",
  play: "Play",
  steps: [
    { title: "Choose a design", body: "Painted for every occasion and tradition." },
    { title: "Add your details", body: "Names, dates and venues, in your own language." },
    { title: "See it come alive", body: "Its doors open, music plays, its pages unfold." },
    {
      title: "Add your guests",
      body: "From your contacts, an Excel sheet or a photo of your list.",
    },
    { title: "Send on WhatsApp", body: "A message for each guest, and a video for your Status." },
    { title: "Guests reply in a tap", body: "See who is coming, and how many, as it happens." },
  ],
  phone: {
    designs: "Wedding designs",
    use: "Use this design",
    bride: "Bride",
    groom: "Groom",
    date: "Wedding date",
    brideName: "Meera",
    groomName: "Aarav",
    joiner: "&",
    dateValue: "Sat, 12 Dec",
    cardLanguage: "Card language",
    languages: ["English", "हिंदी"],
    open: "Open the invitation",
    addGuests: "Add guests",
    sources: ["Contacts", "Excel", "Photo of list"],
    guests: ["Sharma family", "Mehta ji", "Priya and Rohan"],
    chat: "Sharma family",
    message: "Namaste Sharma ji 🙏 Please join us for Meera and Aarav's wedding.",
    linkTitle: "Meera & Aarav · Wedding",
    video: "Video for Status",
    replies: "Who's coming",
    coming: "Coming",
    wish: "Congratulations! We'll be there 🎉",
    people: (count: number) => `${count} guests`,
    tally: (count: number) => `${count} coming`,
  },
};

/** The occasions under the first screen: four large tiles, then a row of smaller ones. */
export const homePicks = {
  title: "What are you celebrating?",
  more: "More occasions",
  all: "All occasions",
};

/** The rows of designs: trending, then one row per main occasion. */
export const homeRows = {
  eyebrow: "Designs",
  title: "Pick a design you love",
  intro: "Swipe a row, tap a painting to see every page, or open it live as your guests will.",
  allDesigns: "See all designs",
};

/**
 * Why Shubh (owner, 2026-10-24): what a family gets, in plain words, under the phone that shows
 * how it works. Each point is something the site does today; the first two lead.
 */
export const homeWhy = {
  eyebrow: "Why Shubh",
  title: "Everything your invitation needs",
  intro: "Easy to make, easy to send, and easy for every guest to open.",
  /** Opens a whole invitation as a guest gets it (/sample). */
  demo: "Open a live invitation",
  free: "Free to start",
  points: {
    preview: {
      title: "See it before you pay",
      body: "Every change shows at once on a phone, exactly as your guests will see it. Open any design as a live invitation first.",
    },
    payLater: {
      title: "Make it free, pay later",
      body: "Make the whole invitation free, video included, and pay only when you send it. Keep editing after it's live; the link never changes.",
    },
    oneLink: {
      title: "One link for everything",
      body: "Every function on one page, each with its map and add-to-calendar, a countdown, and replies in one tap.",
    },
    social: {
      title: "Ready for WhatsApp and Instagram",
      body: "Send it on WhatsApp with each guest's own link, and a full-HD video of your invitation for Status, Reels and Stories.",
    },
    guests: {
      title: "Add guests in minutes",
      body: "From your phone contacts or an Excel file, or take a photo of a handwritten list and AI reads it.",
    },
    language: {
      title: "In your language",
      body: "English, Hindi, Marathi, Gujarati, Bengali or Tamil, or two languages on one card. Type names in any script.",
    },
    replies: {
      title: "Know who's coming",
      body: "See who opened it and who is coming, with head counts for each function, a list to download, and co-hosts to help.",
    },
    opening: {
      title: "Opens like a real card",
      body: "Painted gates, ribbons, doors and a blooming flower open it, more than 200 ways, with its own music or your song.",
    },
    cards: {
      title: "Save the date and thank you cards",
      body: "Made in the same design as your invitation, ready to send before and after the day.",
    },
    photos: {
      title: "Your photos, beautifully framed",
      body: "Photos sit in the design's own frames, both of you when you add one each, and guests share theirs after the day.",
    },
    family: {
      title: "Show your family first",
      body: "Send a preview to family before guests see it. Your link is made from your names, even typed in Hindi.",
    },
  },
};

/** Two ways on for a family short of time: the whole wedding at once, or one made for them. */
export const homeHelp = {
  set: {
    eyebrow: "Complete Wedding Set",
    title: "One package for the whole wedding",
    body: "Your invitation, a video for every function, and save-the-date and thank-you cards, made in the same design.",
    cta: "See what's included",
  },
  make: {
    eyebrow: "Short on time?",
    title: "We'll make it for you",
    body: "Send your names, dates and venues on WhatsApp, and we'll set up your invitation for you to check.",
    cta: "Send details on WhatsApp",
  },
};

export type { TemplateId };

export const templates = {
  eyebrow: "Designs",
  title: "Designs that feel like card stock",
  intro:
    "Twelve designs, each with its own ornaments, card stock and raga, including six bright regional designs from Rajasthan to Tamil Nadu.",
  listLabel: "Invitation designs",
  previous: "Previous designs",
  next: "Next designs",
  tryEditor: "Try the editor",
  items: [
    { id: "marigold", name: "Marigold Gate", kind: "Raga Yaman", tone: "gold" },
    { id: "rose", name: "Rose Garden", kind: "Raga Khamaj", tone: "rose" },
    { id: "emerald", name: "Emerald Palace", kind: "Raga Bihag", tone: "success" },
    { id: "scroll", name: "Royal Scroll", kind: "Raga Desh", tone: "gold" },
    { id: "monogram", name: "Minimal Monogram", kind: "Raga Bhupali", tone: "neutral" },
    { id: "kasavu", name: "Kerala Kasavu", kind: "Raga Madhyamavati", tone: "gold" },
    { id: "rangmahal", name: "Rang Mahal", kind: "Raga Mand", tone: "gold" },
    { id: "paithani", name: "Paithani Mor", kind: "Raga Bhimpalasi", tone: "rose" },
    { id: "bandhani", name: "Bandhani Utsav", kind: "Raga Pilu", tone: "success" },
    { id: "alpona", name: "Alpona Lal", kind: "Raga Bhairavi", tone: "rose" },
    { id: "gopuram", name: "Gopuram Pon", kind: "Raga Hamsadhwani", tone: "gold" },
    { id: "phulkari", name: "Phulkari Rang", kind: "Raga Kafi", tone: "gold" },
  ] satisfies { id: TemplateId; name: string; kind: string; tone: string }[],
  sample: { first: "Aarav", second: "Meera", date: "12 · XII · 2026", place: "Udaipur" },
} as const;

export const faq = {
  eyebrow: "FAQ",
  title: "Questions couples ask",
  items: [
    {
      q: "Do my guests need to install an app?",
      a: "No. Guests tap the link in WhatsApp and the invitation opens in their browser, on any phone.",
    },
    {
      q: "Will it work on older or slower phones?",
      a: "Yes. Shubh checks each phone and shows a lighter version when needed, so every guest can open the invite and reply.",
    },
    {
      q: "Can I make the invite in Hindi, Tamil or another language?",
      a: "Yes. The site speaks English, Hindi, Marathi, Gujarati, Bengali and Tamil, and your card can be written in any Indian language, even two side by side so every elder can read it.",
    },
    {
      q: "Can the card follow our family's traditions?",
      a: "Yes. Pick your tradition, such as Marathi, Gujarati, Bengali or Tamil, and the card sets the sacred symbol, the invocation, local ceremony names and family wording like Darshanabhilashi, all still editable.",
    },
    {
      q: "Can I change details after sending it?",
      a: "Yes. Edit the venue, time or any function and the same link shows the update. Guests never get a stale card.",
    },
    {
      q: "How do RSVPs work?",
      a: "Each guest picks attending or not for every function, adds how many are coming and a meal choice, and can leave you a message. You see it all in one guest list, and can send reminders to anyone who hasn't replied.",
    },
    {
      q: "When can I start?",
      a: "Today. Make your invite in the editor, sign in, publish it and share the link on WhatsApp.",
    },
  ],
} as const;

/** The home page's last word, before the footer: one more way in. */
export const closing = {
  eyebrow: "Start today",
  title: "Your invitation, ready before the chai cools",
  body: "Pick a painted design, add your names and dates, and send one link on WhatsApp. Free to start, and you pay only when you choose a package.",
  primary: "Start your invite",
  secondary: "Browse all designs",
  proof: ["No app for guests", "Every function in one link", "Change details any time"],
} as const;
