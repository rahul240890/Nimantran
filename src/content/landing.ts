import type { TemplateId } from "@/lib/templates/schema";

/**
 * English copy for the app shell and the landing page.
 * Kept in one place, shaped like a message file, so Step 12 can move it into next-intl unchanged.
 */

export const languages = [
  { code: "en", native: "English", english: "English" },
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "ml", native: "മലയാളം", english: "Malayalam" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

/** Languages the site can show today. The rest arrive with translations in Step 12. */
export const availableLanguages: readonly LanguageCode[] = ["en"];

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
    current: "Language: English",
    soon: "Soon",
    note: "More languages arrive before launch.",
  },
  themeHeading: "Theme",
  footer: {
    tagline: "3D invitations your guests open, turn and keep.",
    explore: "Explore",
    languages: "Languages at launch",
    madeIn: "Made in India",
    rights: "All rights reserved.",
  },
} as const;

export const hero = {
  eyebrow: "Shubh aarambh · early access",
  title: "Invitations your guests open, turn and keep.",
  body: "Create a 3D invitation in minutes, share it on WhatsApp, and collect RSVPs in one tap. Made for Indian weddings first.",
  primary: "Start your invite",
  secondary: "See how it works",
  cardLabel: { closed: "Open the sample invitation", open: "Close the sample invitation" },
  hint: { scroll: "Scroll to open", tap: "Tap to open", close: "Tap to close" },
  proof: ["No app to install", "RSVP in one tap", "A raga in every design"],
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
    "Six designs to start, each with its own ornaments, card stock and raga. Colourful regional designs follow with tradition packs.",
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
      a: "Yes. Nimantran checks each phone and shows a lighter version when needed, so every guest can open the invite and reply.",
    },
    {
      q: "Can I make the invite in Hindi, Tamil or another language?",
      a: "Yes. Ten Indian languages are planned for launch, and you can show two side by side so every elder can read it.",
    },
    {
      q: "Can the card follow our family's traditions?",
      a: "That is coming next. Choose your region and community and the card sets the right deity or symbol, invocation, ceremony names and wording order, all still editable. Packs are checked by people from each community before they go live.",
    },
    {
      q: "Can I change details after sending it?",
      a: "Yes. Edit the venue, time or any function and the same link shows the update. Guests never get a stale card.",
    },
    {
      q: "How do RSVPs work?",
      a: "Each guest picks attending or not, adds how many are coming and a meal choice, and can leave you a message. You see it all in one list.",
    },
    {
      q: "When can I start?",
      a: "Today. Make your invite in the editor and sign in to keep it on every phone. Sharing with guests opens soon; join the waitlist and we will tell you the moment it does.",
    },
  ],
} as const;

export const waitlist = {
  eyebrow: "Early access",
  title: "Be first to send one",
  intro:
    "We are opening Nimantran to couples in small groups. Leave your details and we will write when your spot opens.",
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
