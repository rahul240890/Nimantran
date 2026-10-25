import type * as en from "../gallery";
import type { Translation } from "@/i18n/text";

/*
 * বাংলা: গ্যালারির উপলক্ষ, বিয়ের ধরন, খোঁজ আর ডিজাইনের প্রিভিউ। English: src/content/gallery.ts.
 * Draft for a native proofreader.
 */

export const galleryCopy: Translation<typeof en.galleryCopy> = {
  metaTitle: "প্রতিটি উপলক্ষের জন্য নিমন্ত্রণপত্রের ডিজাইন",
  metaDescription:
    "আপনি কী উদযাপন করছেন বেছে নিন, তারপর তার জন্যই তৈরি একটি ডিজাইন: রীতি মেনে বিয়ে, গায়ে হলুদ, সংগীত আর আরও অনেক কিছু, আঁকা পাতা আর RSVP একটি লিংকেই।",
  eyebrow: "নিমন্ত্রণপত্র তৈরি করুন",
  heading: "আপনি কী উদযাপন করছেন?",
  intro:
    "উপলক্ষ বেছে নিন, তারপর তার জন্যই তৈরি একটি ডিজাইন। দৃশ্যে সবকিছু থাকে একটিই চিত্রে, প্রতিটি অনুষ্ঠান একে একে উড়ে আসে। গল্পে প্রতিটি অনুষ্ঠানের নিজস্ব পুরো স্ক্রিনের আঁকা পাতা থাকে। দুটোতেই উত্তর দেওয়ার ব্যবস্থা আছে।",
  searchLabel: "উপলক্ষ ও ডিজাইন খুঁজুন",
  searchPlaceholder: "যেমন গুজরাটি বিয়ে, গায়ে হলুদ, জন্মদিন…",
  clearSearch: "খোঁজ মুছুন",
  results: (count: number) =>
    count === 0 ? "এখনও কিছু মেলেনি" : count === 1 ? "1টি ফলাফল" : `${count}টি ফলাফল`,
  noResults:
    "এর সঙ্গে এখনও কিছু মেলেনি। অন্য কোনো শব্দ দিয়ে দেখুন, বা নিচের উপলক্ষগুলো ঘুরে দেখুন।",
  resultKinds: { occasion: "উপলক্ষ", kind: "বিয়ে", design: "ডিজাইন" },
  moreCelebrations: "আরও উৎসব",
  soon: "শীঘ্রই আসছে",
  designsCount: (count: number) => (count === 1 ? "1টি ডিজাইন" : `${count}টি ডিজাইন`),
  chooseKind: "আপনার বিয়ে বেছে নিন",
  chooseKindIntro:
    "প্রতিটি ধরনের নিজস্ব অনুষ্ঠানের নাম, আশীর্বচন, ভাষা আর চিত্র আছে। এডিটরে এর যেকোনোটি বদলাতে পারবেন।",
  allWeddingDesigns: "বিয়ের সব ডিজাইন",
  designsHeading: "ডিজাইন",
  designsFor: (name: string) => `${name} ডিজাইন`,
  kindIntro:
    "শুধু এই ধরনের বিয়ের জন্য তৈরি ডিজাইন। কার্ডটি তার নিজের ভাষায় লেখা থাকে, আর পাশে ইংরেজিও যোগ করতে পারেন।",
  card: "3D কার্ড",
  formats: {
    label: "নিমন্ত্রণের ধরন",
    all: "সব",
    moving: "চলমান",
    storybook: "গল্পের বই",
    scene: "দৃশ্য",
    story: "গল্প",
    card: "3D কার্ড",
  },
  tiers: { free: "ফ্রি", premium: "প্রিমিয়াম", royal: "রয়্যাল", signature: "সিগনেচার" },
  tierPrice: (tier, price) => `${tier} · ${price}`,
  tierLabel: (tier, price) => (price ? `${tier} ডিজাইন, ${price} থেকে প্রকাশ করুন` : "ফ্রি ডিজাইন"),
  photoNeeds: {
    none: "ছবি লাগবে না",
    one: "একটি ছবি",
    couple: "দুজনের একটি ছবি",
    two: "দুটি ছবি, প্রত্যেকের একটি",
    either: "দুজনের ছবি বা আলাদা দুটি",
    optional: "ছবি ঐচ্ছিক",
  },
  sceneBadge: "দৃশ্য · 1 পাতা",
  trendingBadge: "ট্রেন্ডিং",
  movingBadge: "চলমান",
  storyBadge: (count) => `গল্প · ${count} পাতা`,
  sceneNote:
    "আপনার ছবি আর নাম দিয়ে সাজানো একটি চিত্র। প্রতিটি অনুষ্ঠান একে একে উড়ে আসে, আর চিত্রের আলো সকাল থেকে রাত পর্যন্ত তার সঙ্গে বদলায়।",
  sample: {
    first: "অর্জুন",
    second: "সিয়া",
    one: "আন্যা",
    blessing: "শ্রী গণেশের আশীর্বাদে",
    faithNames: {
      sikh: { first: "অর্জন", second: "সিমরন" },
      muslim: { first: "আয়ান", second: "জোয়া" },
      christian: { first: "জোয়েল", second: "অ্যানা" },
      jain: { first: "ঋষভ", second: "বিধি" },
    },
    families: "দুই পরিবারের পক্ষ থেকে",
    line: "তাঁদের শুভ বিবাহে আপনাকে সাদর আমন্ত্রণ জানান",
    venues: {
      haldi: "পারিবারিক বাড়ি, জয়পুর",
      mehendi: "বাড়ির উঠোন, জয়পুর",
      sangeet: "ছাদের লন, জয়পুর",
      baraat: "হোটেলের গেট থেকে",
      wedding: "রামবাগ প্যালেস, জয়পুর",
      reception: "জয় মহল, জয়পুর",
      other: "গার্ডেন লনস, জয়পুর",
    },
  },
  pagesCount: (count: number) => `${count} পাতা`,
  designImage: (name: string, occasion: string, description: string) =>
    `${name}: ${occasion} নিমন্ত্রণপত্রের ডিজাইন। ${description}`,
  kindOccasion: (name: string) => `${name} বিয়ের`,
  useDesign: "এই ডিজাইনটি বেছে নিন",
  packagesHeading: "এই ডিজাইনের প্যাকেজ",
  packageFree: "বিনামূল্যে",
  comparePackages: "প্যাকেজগুলো তুলনা করুন",
  packageExtras: {
    heading: "প্যাকেজের দামেই অন্তর্ভুক্ত",
    video: "স্ট্যাটাস আর রিলসের জন্য WhatsApp ভিডিও",
    cards: "সেভ দ্য ডেট ও ধন্যবাদ কার্ড",
  },
  packageSet: { wedding: "বিয়ের সেট", other: "পুরো সেট" },
  seeSample: "অতিথি হয়ে লাইভ দেখুন",
  liveDemo: "লাইভ ডেমো",
  liveDemoLabel: (name) => `লাইভ ডেমো: ${name}`,
  sampleLabel: "নমুনা নিমন্ত্রণপত্র",
  sampleNote: "নাম, তারিখ আর জায়গা সবই কাল্পনিক",
  showAll: (count: number) => `সব ${count}টি ডিজাইন দেখান`,
  sampleChoose: "এই ডিজাইনটি বেছে নিন",
  sampleChooseShort: "বেছে নিন",
  sampleBack: "ফিরে যান",
  sampleWalk: "অন্য ডিজাইন",
  samplePrevious: "আগের ডিজাইন",
  samplePreviousShort: "আগের",
  sampleNext: "পরের ডিজাইন",
  sampleNextShort: "পরের",
  sampleTitle: (name) => `নমুনা নিমন্ত্রণপত্র: ${name}`,
  sampleDescription:
    "আপনার অতিথিরা যেভাবে দেখবেন, সেভাবেই ডিজাইনটি দেখুন: এটি খোলে, গান বাজায় আর উত্তর নেয়।",
  close: "প্রিভিউ বন্ধ করুন",
  pagesLabel: "এই ডিজাইনের পাতাগুলো",
  cardNote: "অতিথির ফোনে খুলে যাওয়া একটি 3D কার্ড, তারপর কার্ডের নিজের রঙে সাজানো পাতা।",
  pageNames: {
    blessing: "আশীর্বাদ",
    cover: "প্রচ্ছদ",
    family: "পরিবার",
    haldi: "গায়ে হলুদ",
    mehendi: "মেহেন্দি",
    sangeet: "সংগীত",
    baraat: "বরযাত্রা",
    wedding: "বিবাহ",
    reception: "বৌভাত",
    reply: "উত্তর",
  },
  previous: "আগের পাতা",
  next: "পরের পাতা",
  pageOf: (index: number, total: number) => `${total}টি পাতার মধ্যে ${index} নম্বর`,
  playPages: "পাতাগুলো নিজে থেকে চালান",
  pausePages: "পাতাগুলো থামান",
  breadcrumb: "নিমন্ত্রণপত্র",
  kindMeta: (name: string) => ({
    title: `${name} বিয়ের নিমন্ত্রণপত্র`,
    description: `${name} পরিবারের জন্য বিয়ের নিমন্ত্রণপত্র: প্রতিটি অনুষ্ঠানের আঁকা পাতা, প্রতিটি রীতি তার নিজের নামে, আর WhatsApp-এ RSVP।`,
  }),
  kindSearch: {
    bengali: {
      title: "বাংলা বিয়ের কার্ড অনলাইন",
      description:
        "বাংলা বিয়ের ডিজিটাল কার্ড: শুভ বিবাহ, আইবুড়োভাত, গায়ে হলুদ আর বউভাত ছবির পাতায়, WhatsApp-এ উত্তর। বিনামূল্যে বানান।",
    },
  },
  moreOccasions: "আরও উপলক্ষ",
  wordingHeading: "নিমন্ত্রণের লেখা",
  wordingIntro: "কার্ড আর WhatsApp-এর জন্য কপি করার মতো বার্তা, আমাদের ব্লগ থেকে।",
};

export const sectionNames: Translation<typeof en.sectionNames> = {
  wedding: "বিয়ের পর্ব",
  family: "পরিবারের মুহূর্ত",
  parties: "পার্টি ও কলেজ",
  festivals: "উৎসব",
  business: "ব্যবসা",
};

export const occasionTaglines: Translation<typeof en.occasionTaglines> = {
  wedding: "প্রতিটি অনুষ্ঠান, রীতি মেনে",
  engagement: "আংটি আর প্রথম উদযাপন",
  roka: "দুই পরিবারের সম্মতি",
  "save-the-date": "আগেভাগে জানিয়ে দিন",
  haldi: "হলুদ আর গাঁদা ফুল",
  mehendi: "মেহেন্দি আর নিশ্চিন্ত দুপুর",
  sangeet: "গান, নাচ আর ঢোলক",
  reception: "বিয়ের পরে প্রীতিভোজ",
  anniversary: "একসঙ্গে কাটানো বছরের উদযাপন",
  birthday: "প্রথম জন্মদিন থেকে ষাটতম",
  "baby-shower": "সাধ আর আশীর্বাদ",
  "naming-ceremony": "নতুন নামকে স্বাগত",
  mundan: "প্রথম চুল কাটা",
  housewarming: "গৃহপ্রবেশ",
  puja: "সত্যনারায়ণ, হোম, জাগরণ",
  "thread-ceremony": "পৈতে আর উপনয়ন",
  "fresher-party": "নতুন ব্যাচকে স্বাগত",
  "welcome-party": "নতুন মুখদের জন্য",
  "farewell-party": "আন্তরিক বিদায়",
  "kitty-party": "প্রতি মাসের আড্ডা",
  reunion: "পুরনো বন্ধু, একটি সন্ধ্যা",
  retirement: "একটি কর্মজীবনের উদযাপন",
  party: "ছাদ, গান আর বন্ধুরা",
  diwali: "প্রদীপ আর নৈশভোজ",
  lohri: "আগুনের কুণ্ড আর ভাংড়া",
  sankranti: "ঘুড়ি আর পোঙ্গল",
  onam: "পুক্কলম আর সাদ্যা",
  janmashtami: "গোপালের জন্মদিন",
  "prayer-meet": "সশ্রদ্ধ স্মরণে",
  christening: "ব্যাপটিজম আর মধ্যাহ্নভোজ",
  annaprashan: "প্রথম মুখে ভাত",
  holi: "রং আর গুজিয়া",
  navratri: "গরবার নয় রাত",
  "ganesh-chaturthi": "বাপ্পা এলেন ঘরে",
  eid: "ঈদ মিলন আর দাওয়াত",
  graduation: "নতুন স্নাতকের সম্মানে",
  "gudi-padwa": "গুড়ি, নিম আর পুরন পোলি",
  baisakhi: "ফসল, ভাংড়া আর গিদ্ধা",
  bihu: "বিহু গান, নাচ আর পিঠা",
  "raksha-bandhan": "রাখী, মিষ্টি আর পারিবারিক ভোজ",
  "karva-chauth": "উপোস, চাঁদ আর রাতের খাবার",
  christmas: "ক্যারল আর কেক",
  "shop-opening": "উদ্বোধন আর পুজো",
  launch: "নতুন কিছু",
  "office-party": "পুরো টিম একসঙ্গে",
};

export const weddingKindCopy: Translation<typeof en.weddingKindCopy> = {
  "north-indian": {
    name: "উত্তর ভারতীয়",
    description: "তিলক, বারাত আর শুভ বিবাহ, হিন্দি ও ইংরেজিতে।",
  },
  gujarati: {
    name: "গুজরাটি",
    description: "গণেশ স্থাপনা, মামেরু, রাস গরবা আর হস্তমেলাপ, গুজরাটিতে।",
  },
  rajasthani: {
    name: "রাজস্থানি ও মারোয়াড়ি",
    description: "বিনায়ক স্থাপনা, মায়রা, নিকাসি আর তোরণ, হিন্দিতে।",
  },
  marathi: {
    name: "মারাঠি",
    description: "সাখরপুডা, হলদ, কেলবন আর শুভবিবাহ, মারাঠিতে।",
  },
  bengali: {
    name: "বাঙালি, ওড়িয়া ও অসমিয়া",
    description: "আইবুড়োভাত, গায়ে হলুদ, শুভ বিবাহ আর বৌভাত, বাংলায়।",
  },
  tamil: {
    name: "তামিল ও দক্ষিণ ভারতীয়",
    description: "নিচ্চয়তার্থম, নলঙ্গু আর তিরুমণম, তামিলে।",
  },
  punjabi: {
    name: "পাঞ্জাবি ও শিখ",
    description: "ঢোল আর সরষে খেতের মাঝে ফুলকারি হাভেলি।",
  },
  muslim: {
    name: "নিকাহ ও ওয়ালিমা",
    description: "সাদা মার্বেল আর জালির কাজে মুঘল বাগান।",
  },
  modern: {
    name: "আধুনিক",
    description: "যেকোনো পরিবারের জন্য ছিমছাম কার্ড, ইংরেজি বা হিন্দিতে।",
  },
};

export const catalogCopy: Translation<typeof en.catalogCopy> = {
  searchLabel: "ডিজাইন খুঁজুন",
  searchPlaceholder: "নাম, জায়গা বা রীতি দিয়ে খুঁজুন…",
  occasionLabel: "উপলক্ষ",
  allOccasions: "সব উপলক্ষ",
  traditionLabel: "বিয়ের রীতি",
  allTraditions: "সব রীতি",
  count: (count: number) => `${count}টি ডিজাইন`,
  clear: "ফিল্টার মুছুন",
  empty: "এই সবগুলোর সঙ্গে মেলে এমন ডিজাইন এখনও নেই। কম ফিল্টার দিয়ে দেখুন।",
  photosLabel: "আঁকা বা ছবি",
  allPhotos: "যেকোনো",
  photoGroups: { none: "আঁকা", one: "দুজনের ছবি", two: "বর-কনের ছবি" },
  allDesigns: "সব ডিজাইন",
  moreOccasions: "আরও উপলক্ষ",
  fewerOccasions: "কম উপলক্ষ",
  moreFilters: (chosen) => (chosen ? `আরও ফিল্টার (${chosen})` : "আরও ফিল্টার"),
  fewerFilters: "কম ফিল্টার",
  priceLabel: "দাম",
  allPrices: "যেকোনো দাম",
  sortLabel: "ডিজাইন সাজান",
  sorts: {
    recommended: "প্রস্তাবিত",
    "price-low": "দাম: কম থেকে বেশি",
    "price-high": "দাম: বেশি থেকে কম",
  },
};

/** সংগ্রহ: ডিজাইনগুলো তাদের রূপ আর অনুভূতি অনুযায়ী। */
export const collectionCopy: Translation<typeof en.collectionCopy> = {
  heading: "সংগ্রহ থেকে বেছে নিন",
  intro: "প্রতিটি ডিজাইন একটি সংগ্রহে আছে, তার রূপ আর অনুভূতি অনুযায়ী।",
  label: "সংগ্রহ",
  all: "সব সংগ্রহ",
  groups: { wedding: "বিয়ের সংগ্রহ", celebration: "সব উৎসবের জন্য" },
  rowsHeading: "সংগ্রহ",
  name: (name: string) => `${name} সংগ্রহ`,
  names: {
    "royal-wedding": {
      name: "রাজকীয় বিয়ে",
      intro: "প্রাসাদ, দুর্গ আর হাভেলি, জমকালো উৎসবের আলোয় সাজানো।",
    },
    nawabi: { name: "নবাবি নিকাহ", intro: "মুঘল বাগান, অওধি খিলান আর সুফি রাত।" },
    divine: { name: "দৈব আশীর্বাদ", intro: "মন্দির, ঘাট আর পবিত্র শিল্প, শুভ সূচনার জন্য।" },
    "folk-art": {
      name: "লোকশিল্প",
      intro: "মধুবনী, ওয়ারলি, গোন্ড, পিছওয়াই আর আরও অনেক, হাতে আঁকা।",
    },
    "silk-thread": {
      name: "রেশম আর সুতো",
      intro: "পাটোলা, বাঁধনি, ফুলকারি, কাঞ্জিভরম সিল্ক আর কুন্দন।",
    },
    garden: { name: "বাগানের ফুল", intro: "কৃষ্ণচূড়া, গোলাপ, জুঁই আর পিওনির বাহার।" },
    destination: { name: "ডেস্টিনেশন ও প্রকৃতি", intro: "সমুদ্রতট, ব্যাকওয়াটার, পাহাড় আর হ্রদ।" },
    modern: { name: "মডার্ন মিনিমাল", intro: "ছিমছাম রেখা, নরম রং আর শান্ত পরিসর।" },
    "love-story": {
      name: "প্রেমের গল্প",
      intro: "সেভ দ্য ডেট আর বাগদান, খুনসুটি আর রোমান্সের ছোঁয়ায়।",
    },
    functions: {
      name: "গায়ে হলুদ, মেহেন্দি ও সংগীত",
      intro: "বিয়ের প্রতিটি অনুষ্ঠান, রোকা থেকে বিদায় পর্যন্ত।",
    },
    storybook: { name: "গল্পের বই", intro: "নয়টি আঁকা পাতায় বলা একটি গল্প।" },
    "little-wonders": { name: "ছোট্ট খুশি", intro: "এমন জন্মদিনের পার্টি, যা ছোটদের ভালো লাগবেই।" },
    baby: { name: "শিশুর আশীর্বাদ", intro: "সাধ, নামকরণ আর অন্নপ্রাশন।" },
    milestones: {
      name: "পরিবারের মাইলফলক",
      intro: "বিবাহবার্ষিকী, বিশেষ জন্মদিন, গৃহপ্রবেশ আর অবসর।",
    },
    festivals: { name: "উৎসব", intro: "দীপাবলি, ঈদ, হোলি, নবরাত্রি, ওণাম, বড়দিন আর আরও অনেক।" },
    parties: {
      name: "পার্টি নাইট",
      intro: "ছাদের পার্টি, পুনর্মিলনী, কিটি পার্টি আর বিদায় সংবর্ধনা।",
    },
    business: { name: "ব্যবসা ও লঞ্চ", intro: "দোকানের উদ্বোধন, মহরত আর লঞ্চ।" },
    "cards-3d": { name: "ক্লাসিক 3D কার্ড", intro: "যে কার্ড অতিথির হাতে 3D-তে খোলে।" },
  },
};

export const shelfCopy: Translation<typeof en.shelfCopy> = {
  trending: {
    group: "ট্রেন্ডিং",
    title: "এখন ট্রেন্ডিং",
    intro: "আয়োজকরা এখন সবচেয়ে বেশি যে ডিজাইনগুলো বেছে নিচ্ছেন।",
  },
  groups: {
    moving: "নতুন: চলমান দৃশ্য",
    photos: "আঁকা বা আপনার ছবি দিয়ে",
    format: "নিমন্ত্রণের ধরন অনুযায়ী",
    tradition: "রীতি অনুযায়ী বিয়ে",
    occasion: "আরও উৎসব",
  },
  photos: {
    none: {
      title: "আঁকা নিমন্ত্রণপত্র",
      intro: "হাতে আঁকা শিল্প, আপনার নাম দিয়ে। ছবি লাগবে না।",
    },
    one: {
      title: "দুজনের ছবিসহ নিমন্ত্রণপত্র",
      intro: "আপনাদের দুজনের প্রিয় ছবিটি, চিত্রের মাঝে বসানো।",
    },
    two: {
      title: "বর ও কনের ছবি",
      intro: "দুজনের আলাদা আলাদা ছবি, পাশাপাশি ফ্রেমে।",
    },
  },
  format: {
    moving: {
      title: "চলমান দৃশ্য",
      intro:
        "শর্ট ফিল্মের মতো জীবন্ত আঁকা দৃশ্য: পাপড়ি ঝরে, ফানুস ওড়ে, জলে ঢেউ খেলে। ছবি লাগবে না।",
    },
    storybook: {
      title: "গল্পের বই",
      intro: "নয়টি আঁকা পাতায় বলা একটি গল্প, যা খোলে তার নিজস্ব দরজা দিয়ে।",
    },
    story: { title: "গল্প", intro: "প্রতিটি অনুষ্ঠানের জন্য পুরো স্ক্রিনের একটি আঁকা পাতা।" },
    scene: {
      title: "দৃশ্য",
      intro: "একটিই চিত্রে সবকিছু, প্রতিটি অনুষ্ঠান একে একে উড়ে আসে।",
    },
    card: { title: "3D কার্ড", intro: "যে কার্ড অতিথির হাতে 3D-তে খোলে।" },
  },
  tradition: (name: string) => `${name} বিয়ে`,
  traditionsHeading: "আপনার রীতি বেছে নিন",
  occasionsHeading: "অথবা অন্য কোনো উৎসব",
  viewAll: "সব দেখুন",
  viewAllLabel: (title: string, count: number) => `সব ${count}টি ডিজাইন দেখুন: ${title}`,
  back: "পিছনে",
  next: "সামনে",
};
