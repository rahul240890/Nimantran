import type { OccasionSection, WeddingKind } from "@/lib/gallery/catalog";

/*
 * English copy for the gallery (Step 12g): the occasion sections, a line per occasion and
 * wedding kind, search and the design preview. Hindi: src/content/hi/gallery.ts.
 */

export const galleryCopy = {
  metaTitle: "Invitation designs for every occasion",
  metaDescription:
    "Pick what you are celebrating, then a design made for it: weddings by tradition, haldi, sangeet and more, with painted pages and RSVP in one link.",
  eyebrow: "Create an invitation",
  heading: "What are you celebrating?",
  intro:
    "Pick the occasion, then a design made for it. A Scene puts everything on one painting, each celebration flying in by turn. A Story gives every celebration its own full-screen painted page. Replies are built into both.",
  searchLabel: "Search occasions and designs",
  searchPlaceholder: "Try Gujarati wedding, haldi, birthday…",
  clearSearch: "Clear search",
  results: (count: number) =>
    count === 0 ? "Nothing matches yet" : count === 1 ? "1 match" : `${count} matches`,
  noResults: "Nothing matches that yet. Try another word, or browse the occasions below.",
  resultKinds: { occasion: "Occasion", kind: "Wedding", design: "Design" },
  moreCelebrations: "More celebrations",
  soon: "Coming soon",
  designsCount: (count: number) => (count === 1 ? "1 design" : `${count} designs`),
  chooseKind: "Choose your wedding",
  chooseKindIntro:
    "Each kind has its own ceremony names, blessing, language and paintings. You can change any of it in the editor.",
  allWeddingDesigns: "All wedding designs",
  designsHeading: "Designs",
  designsFor: (name: string) => `Designs for ${name}`,
  kindIntro:
    "Only designs made for this kind of wedding. The card is written in its own language, and you can add English beside it.",
  card: "3D card",
  pagesCount: (count: number) => `${count} pages`,
  /** The two kinds of painted invitation (src/lib/editor/formats.ts), and the 3D cards. */
  formats: {
    label: "Kind of invitation",
    all: "All",
    moving: "Moving",
    scene: "Scene",
    story: "Story",
    card: "3D card",
  },
  /** Each design's tier (Admin, Designs) and what it costs, on its tile. */
  tiers: { free: "Free", premium: "Premium", royal: "Royal", signature: "Signature" },
  tierPrice: (tier: string, price: string) => `${tier} · ${price}`,
  tierLabel: (tier: string, price: string | null) =>
    price ? `${tier} design, publish from ${price}` : "Free design",
  /** What photos a design takes (src/lib/gallery/photos.ts), under its name. */
  photoNeeds: {
    none: "No photo needed",
    one: "One photo",
    couple: "One couple photo",
    two: "Two photos, one each",
    either: "Couple photo or two separate",
    optional: "Photos optional",
  },
  sceneBadge: "Scene · 1 page",
  movingBadge: "Moving",
  storyBadge: (count: number) => `Story · ${count} pages`,
  sceneNote:
    "One painting with your photos and names. Every celebration flies in by turn, and the painting's light follows it from morning to night.",
  /** Made-up names, words and places the previews show the designs with. */
  sample: {
    first: "Arjun",
    second: "Sia",
    /** The one name on a birthday's or a party's sample. */
    one: "Aanya",
    blessing: "With the blessings of Lord Ganesha",
    families: "Together with their families",
    line: "invite you to celebrate their wedding",
    venues: {
      haldi: "Family home, Jaipur",
      mehendi: "The courtyard, Jaipur",
      sangeet: "Rooftop lawns, Jaipur",
      baraat: "From the hotel gate",
      wedding: "Rambagh Palace, Jaipur",
      reception: "Jai Mahal, Jaipur",
      /** Any other occasion's one celebration. */
      other: "The Garden Lawns, Jaipur",
    },
  },
  preview: (name: string) => `Preview ${name}`,
  useDesign: "Use this design",
  close: "Close preview",
  pagesLabel: "Pages in this design",
  cardNote:
    "A 3D card that opens on the guest's phone, followed by pages in the card's own colours.",
  pageNames: {
    blessing: "Blessing",
    cover: "Cover",
    family: "Family",
    haldi: "Haldi",
    mehendi: "Mehendi",
    sangeet: "Sangeet",
    baraat: "Baraat",
    wedding: "Wedding",
    reception: "Reception",
    reply: "Reply",
  },
  previous: "Previous page",
  next: "Next page",
  pageOf: (index: number, total: number) => `Page ${index} of ${total}`,
  breadcrumb: "Invitations",
  kindMeta: (name: string) => ({
    title: `${name} wedding invitations`,
    description: `Wedding invitations made for ${name} families: painted pages for every function, each ceremony by its own name, and RSVP on WhatsApp.`,
  }),
  moreOccasions: "More occasions",
  wordingHeading: "Wording ideas",
  wordingIntro: "Messages to copy for your card and WhatsApp, from our blog.",
};

export const sectionNames: Record<OccasionSection, string> = {
  wedding: "Wedding journey",
  family: "Family moments",
  parties: "Parties and college",
  festivals: "Festivals",
  business: "Business",
};

export const occasionTaglines: Record<string, string> = {
  wedding: "Every function, by tradition",
  engagement: "Rings and the first celebration",
  roka: "The families say yes",
  "save-the-date": "Tell them early",
  haldi: "Turmeric and marigolds",
  mehendi: "Henna and an easy afternoon",
  sangeet: "Songs, dance and dholak",
  reception: "Dinner after the vows",
  anniversary: "Years together, celebrated",
  birthday: "First birthdays to the 60th",
  "baby-shower": "Godh bharai and blessings",
  "naming-ceremony": "Welcoming a new name",
  mundan: "The first haircut",
  housewarming: "Griha pravesh",
  puja: "Satyanarayan, havan, jagran",
  "thread-ceremony": "Janeu and upanayan",
  "fresher-party": "Welcome the new batch",
  "welcome-party": "For new faces",
  "farewell-party": "A warm goodbye",
  "kitty-party": "The monthly get-together",
  reunion: "Old friends, one evening",
  retirement: "A career celebrated",
  party: "Rooftops, music and friends",
  diwali: "Diyas and dinner",
  lohri: "Bonfire and bhangra",
  sankranti: "Kites and pongal",
  onam: "Pookalam and sadhya",
  janmashtami: "Kanha's birthday",
  "prayer-meet": "In loving memory",
  christening: "Baptism and lunch",
  annaprashan: "The first rice",
  holi: "Colours and gujiya",
  navratri: "Nine nights of garba",
  "ganesh-chaturthi": "Bappa comes home",
  eid: "Eid milan and dawat",
  graduation: "Caps off to the graduate",
  "gudi-padwa": "The gudi, neem and puran poli",
  baisakhi: "Harvest, bhangra and giddha",
  bihu: "Bihu songs, dance and pitha",
  "raksha-bandhan": "Rakhi, sweets and a family lunch",
  "karva-chauth": "The fast, the moon and dinner",
  christmas: "Carols and cake",
  "shop-opening": "Udghatan and puja",
  launch: "Something new",
  "office-party": "The whole team",
};

export const weddingKindCopy: Record<WeddingKind, { name: string; description: string }> = {
  "north-indian": {
    name: "North Indian",
    description: "Tilak, baraat and Shubh Vivah, in Hindi and English.",
  },
  gujarati: {
    name: "Gujarati",
    description: "Ganesh sthapana, mameru, raas garba and Hast Melap, in Gujarati.",
  },
  rajasthani: {
    name: "Rajasthani and Marwari",
    description: "Vinayak sthapana, mayra, nikasi and toran, in Hindi.",
  },
  marathi: {
    name: "Marathi",
    description: "Sakharpuda, halad, kelvan and Shubhvivah, in Marathi.",
  },
  bengali: {
    name: "Bengali, Odia and Assamese",
    description: "Aiburobhat, gaye holud, Shubho Bibaho and bou bhaat, in Bengali.",
  },
  tamil: {
    name: "Tamil and South Indian",
    description: "Nichayathartham, nalangu and Thirumanam, in Tamil.",
  },
  punjabi: {
    name: "Punjabi and Sikh",
    description: "A phulkari haveli with dhol and mustard fields.",
  },
  muslim: {
    name: "Nikah and Walima",
    description: "A Mughal garden of white marble and jaali.",
  },
  modern: {
    name: "Modern",
    description: "Clean cards for any family, in English or Hindi.",
  },
};

/** The Designs page: every design, with search and filters (src/lib/gallery/filters.ts). */
export const catalogCopy = {
  searchLabel: "Search designs",
  searchPlaceholder: "Search by name, place or tradition…",
  occasionLabel: "Occasion",
  allOccasions: "All occasions",
  traditionLabel: "Wedding tradition",
  allTraditions: "All traditions",
  count: (count: number) => (count === 1 ? "1 design" : `${count} designs`),
  clear: "Clear filters",
  empty: "No design matches all of these yet. Try fewer filters.",
  photosLabel: "Art or photos",
  allPhotos: "Any",
  photoGroups: { none: "Illustrated", one: "Couple photo", two: "Bride and groom photos" },
  allDesigns: "All designs",
};

/** The Designs page's rows (src/lib/gallery/shelves.ts): a few designs each, and View all. */
export const shelfCopy = {
  groups: {
    moving: "New: moving scenes",
    photos: "Illustrated or with your photos",
    format: "By kind of invitation",
    tradition: "Weddings by tradition",
    occasion: "More celebrations",
  },
  photos: {
    none: {
      title: "Illustrated invitations",
      intro: "Hand-painted art with your names. No photo needed.",
    },
    one: {
      title: "Couple photo invitations",
      intro: "Your favourite photo of the two of you, set into the painting.",
    },
    two: {
      title: "Bride and groom photos",
      intro: "A separate photo of each of you, framed side by side.",
    },
  },
  format: {
    moving: {
      title: "Moving scenes",
      intro:
        "Painted scenes that move like a short film: petals fall, lanterns rise, water ripples. No photo needed.",
    },
    story: { title: "Stories", intro: "A full-screen painted page for every function." },
    scene: {
      title: "Scenes",
      intro: "Everything on one painting, each function flying in by turn.",
    },
    card: { title: "3D cards", intro: "A card that opens in 3D in your guest's hand." },
  },
  tradition: (name: string) => `${name} weddings`,
  traditionsHeading: "Choose your tradition",
  occasionsHeading: "Or another celebration",
  viewAll: "View all",
  viewAllLabel: (title: string, count: number) => `View all ${count} designs: ${title}`,
  back: "Scroll back",
  next: "Scroll on",
};
