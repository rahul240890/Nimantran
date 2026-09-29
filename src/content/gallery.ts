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
    "Pick the occasion, then a design made for it. Every design opens into full-screen painted pages, one for each event, with replies built in.",
  searchLabel: "Search occasions and designs",
  searchPlaceholder: "Try Gujarati wedding, haldi, birthday…",
  clearSearch: "Clear search",
  results: (count: number) =>
    count === 0 ? "Nothing matches yet" : count === 1 ? "1 match" : `${count} matches`,
  noResults: "Nothing matches that yet. Try another word, or browse the occasions below.",
  resultKinds: { occasion: "Occasion", kind: "Wedding", design: "Design" },
  soon: "Coming soon",
  soonNote: "Designs for this occasion are being painted. Weddings are ready today.",
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
  holi: "Colours and gujiya",
  navratri: "Nine nights of garba",
  "ganesh-chaturthi": "Bappa comes home",
  eid: "Eid milan and dawat",
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
