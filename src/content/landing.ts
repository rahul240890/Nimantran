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
  { id: "how-it-works", label: "How it works" },
  { id: "occasions", label: "Occasions" },
  { id: "templates", label: "Designs" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const;

export const shell = {
  skipToContent: "Skip to main content",
  primaryNav: "Main",
  openMenu: "Open menu",
  menuTitle: "Menu",
  joinWaitlist: "Join the waitlist",
  createInvite: "Start your invite",
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
  eyebrow: "Shubh aarambh · early access",
  title: "Invitations your guests open, turn and keep.",
  body: "Pick a painted theme made for your family's tradition, add your names and functions, share it on WhatsApp and collect replies in one tap.",
  primary: "Start your invite",
  secondary: "See how it works",
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

/** The home page's painted deck, occasions and themes (Step 12g). */
export const homeGallery = {
  deckLabel: "Painted invitation themes",
  showTheme: (name: string) => `Show ${name}`,
  coverDate: "12 December 2026",
  occasionsEyebrow: "Start here",
  occasionsTitle: "What are you celebrating?",
  occasionsIntro:
    "Pick the occasion, then a design made for it. Weddings open by tradition: Gujarati, Bengali, Marathi, Tamil and more.",
  searchLabel: "Search occasions and designs",
  searchPlaceholder: "Try Gujarati wedding, haldi, sangeet…",
  search: "Search",
  moreHeading: "Beyond weddings",
  soonHeading: "Coming next",
  allOccasions: "See every occasion",
  themesEyebrow: "Painted themes",
  themesTitle: "A painted page for every function",
  themesIntro:
    "Each theme is a set of paintings, one for the cover, the family, haldi, mehendi, sangeet, baraat, the wedding, the reception and the reply. Tap one to see every page.",
  allDesigns: "See all wedding designs",
};

export const musicDemo = {
  label: "Hear an invitation",
  body: "Every design plays its own raga, composed live on your guest's phone. Nothing to download.",
  play: (design: string) => `Play the music for ${design}`,
  pause: "Pause the music",
  choose: "Design",
  chooseLabel: "Choose whose music to hear",
  raga: (name: string) => `Raga ${name}`,
  failed: "This browser can't play the music.",
} as const;

export const howItWorks = {
  eyebrow: "How it works",
  title: "From idea to RSVPs in three steps",
  intro: "No design skills needed. Most couples finish their invite over one cup of chai.",
  steps: [
    {
      title: "Pick a design",
      body: "Start from a gate-fold, a royal scroll or a clean monogram. Every design opens in 3D.",
    },
    {
      title: "Add your details",
      body: "Names, functions, dates, venues and dress codes, with a live preview beside the form.",
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
  title: "Free to start, premium from ₹499",
  intro: "Make your invite and share it for free. Upgrade one event when you want more.",
  free: {
    name: "Free",
    price: "₹0",
    per: "to start",
    points: [
      "Every design, opened in 3D",
      "Share on WhatsApp with one link",
      "One-tap RSVP for your guests",
    ],
  },
  premium: {
    name: "Premium",
    price: "from ₹499",
    per: "per event",
    badge: "Best for weddings",
    points: [
      "Your own music and photos",
      "Unlimited guests and functions",
      "Guest list export and reminders",
    ],
  },
  note: "Final prices are confirmed before launch. Waitlist members hear first.",
  cta: "Join the waitlist",
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
      a: "Yes. Pick your tradition, such as Marathi, Gujarati, Bengali or Tamil, and the card sets the sacred symbol, the invocation, local ceremony names and family wording like Darshanabhilashi, all still editable. People from each community are checking every tradition before launch.",
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

export const waitlist = {
  eyebrow: "Early access",
  title: "Be first to send one",
  intro:
    "We are opening Shubh to couples in small groups. Leave your details and we will write when your spot opens.",
  perks: [
    "An early spot before public launch",
    "Premium free for your first event",
    "A say in the designs we make next",
  ],
  form: {
    name: "Your name",
    email: "Email",
    emailHint: "We only use it to tell you when your spot opens.",
    phone: "WhatsApp number",
    phoneHint: "Include the country code if you are outside India.",
    optional: "Optional",
    occasion: "What are you celebrating?",
    occasionPlaceholder: "Choose one",
    occasions: [
      { value: "wedding", label: "A wedding" },
      { value: "engagement", label: "An engagement" },
      { value: "family", label: "Another family celebration" },
      { value: "business", label: "I plan events for others" },
    ],
    submit: "Join the waitlist",
    sending: "Joining…",
    privacy: "No spam. One email when your spot opens, and you can ask us to delete your details.",
  },
  errors: {
    name: "Enter your name.",
    nameLong: "Keep your name under 80 characters.",
    email: "Enter an email like name@example.com.",
    phone: "Enter a phone number with 10 to 15 digits.",
    occasion: "Choose what you are celebrating.",
    summary: "Check the highlighted fields.",
    failed: "We couldn't add you just now. Your details are still here, so please try again.",
    retry: "Try again",
  },
  success: {
    title: (name: string) => `You're on the list, ${name}`,
    body: "We will email you as soon as your spot opens. Until then, happy planning.",
    again: "Add someone else",
  },
} as const;
