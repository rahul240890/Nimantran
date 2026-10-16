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
  { id: "designs", label: "Designs" },
  { id: "collections", label: "Collections" },
  { id: "weddings", label: "Weddings" },
  { id: "occasions", label: "Occasions" },
  { id: "how-it-works", label: "How it works" },
  { id: "pricing", label: "Pricing" },
] as const;

/** The header's menus for Designs, Weddings and Occasions (src/components/shell/site-menu.ts). */
export const menuCopy = {
  photos: "Illustrated or with photos",
  kinds: "By kind of invitation",
  popular: "Popular",
  regions: "By region",
  communities: "By community and faith",
  looks: "By look",
  lookNames: {
    garden: "Gardens and flowers",
    palace: "Royal palaces",
    temple: "Temples and blessings",
    lotus: "Lotus",
    peacock: "Peacocks",
    sea: "Sea and backwaters",
    night: "Night and lamps",
    balloon: "Balloons and parties",
    modern: "Modern and simple",
  },
  functions: "Wedding functions",
  allDesigns: (count: number) => `See all ${count} designs`,
  allWeddings: "All wedding designs",
  allOccasions: "All occasions",
  designsFeature: {
    title: "Illustrated or with your photos",
    text: "Painted art alone, your couple photo, or a photo of each of you: every design says which, and its price.",
  },
  weddingsFeature: {
    title: "Wedding invitations",
    text: "Every function on one painted invite, written in your tradition, with RSVP.",
  },
  occasionsFeature: {
    title: "Every celebration",
    text: "Birthdays, griha pravesh, baby showers, pujas and more, each with its own designs.",
  },
};

export const shell = {
  skipToContent: "Skip to main content",
  primaryNav: "Main",
  openMenu: "Open menu",
  menuTitle: "Menu",
  createInvite: "Start your invite",
  faq: "FAQ",
  createInviteShort: "Create invite",
  language: {
    label: "Language",
    current: (name: string) => `Language: ${name}`,
    soon: "Soon",
    note: "Marathi, Gujarati, Bengali, Tamil and more follow once native speakers have checked them.",
  },
  themeHeading: "Theme",
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
  primary: "Browse all designs",
  /** Opens a whole invitation as a guest gets it, with made-up names (/sample). */
  sample: "Open a live invitation",
  popular: "Popular",
  popularSearches: ["Gujarati wedding", "Haldi", "Birthday", "Nikah", "Diwali"],
  cardLabel: { closed: "Open the sample invitation", open: "Close the sample invitation" },
  hint: { scroll: "Scroll to open", tap: "Tap to open", close: "Tap to close" },
  proof: ["No app to install", "RSVP in one tap", "In your family's own language"],
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

/** The home page's painted deck, occasion strip and rows of designs. */
export const homeGallery = {
  deckLabel: "Painted invitation themes",
  showTheme: (name: string) => `Show ${name}`,
  previousTheme: "Previous theme",
  nextTheme: "Next theme",
  coverDate: "12 December 2026",
  occasionsTitle: "What are you celebrating?",
  searchLabel: "Search occasions and designs",
  searchPlaceholder: "Try Gujarati wedding, haldi, birthday…",
  search: "Search",
  allOccasions: "Every occasion",
  designsEyebrow: "Designs",
  designsTitle: "Find your invitation",
  designsIntro: "Start with your tradition, or with how many photos you want on the invite.",
  kindsEyebrow: "Three ways to invite",
  kindsTitle: "Pick how it opens",
  kindsIntro: "Every design comes as one of these. Tap one to see them all.",
  moreEyebrow: "More celebrations",
  moreTitle: "Birthdays, anniversaries and more",
  moreIntro: "Painted designs for the family's other big days.",
  allDesigns: "See all designs",
};

export const howItWorks = {
  eyebrow: "How it works",
  title: "Ready in three steps",
  intro: "No design skills needed. Most families finish their invite over one cup of chai.",
  stepLabel: (step: number) => `Step ${step}`,
  steps: [
    {
      title: "Pick a design",
      body: "Search or browse by occasion and tradition, then tap Use this design.",
    },
    {
      title: "Add your details",
      body: "Names, dates and venues, with your invite updating beside the form as you type.",
    },
    {
      title: "Share and track",
      body: "Send one link on WhatsApp. Guests reply in a tap and you see who is coming as it happens.",
    },
  ],
} as const;

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

export const pricing = {
  eyebrow: "Pricing",
  /** Premium's price as Admin, Designs sets it. */
  title: (price: string) => `Free to start, paid designs from ${price}`,
  intro: "Make your invite and share it for free. Choose a package when you want more.",
  free: {
    name: "Free",
    price: "₹0",
    per: "to start",
    points: [
      "Free designs, and try every other one",
      "Share on WhatsApp with one link",
      "One-tap RSVP for your guests",
    ],
  },
  premium: {
    name: "Packages",
    price: (price: string) => `from ${price}`,
    per: "per invitation",
    badge: "Best for weddings",
    points: [
      "Basic: your design, with no watermark",
      "Celebration: the invitation video, and more invites",
      "Grand: unlimited invites, and a video for every function",
    ],
  },
  note: "One payment per invitation, all taxes included. Never a subscription. Every package covers every function.",
  cta: "Start your invite",
  compare: "Compare the packages",
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
      a: "Yes. The site speaks English and Hindi today, and your card can be written in any Indian language, even two side by side so every elder can read it.",
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
