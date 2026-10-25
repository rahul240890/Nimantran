import type * as en from "../editor";
import type { Translation } from "@/i18n/text";
import type { LeadId, TaalId } from "@/lib/templates/ids";
import { designNames } from "./design-names";

/* বাংলা: নিমন্ত্রণ এডিটর (/create)। English: src/content/editor.ts. Draft for a native proofreader. */

export const editor: Translation<typeof en.editor> = {
  metaTitle: "আপনার নিমন্ত্রণপত্র তৈরি করুন",
  metaDescription: "3D ডিজাইন বেছে নিন, নাম আর অনুষ্ঠান যোগ করুন, তারপর নিমন্ত্রণপত্রটি দেখে নিন।",
  headerLabel: "নিমন্ত্রণ এডিটর",
  opening: "আপনার নিমন্ত্রণ খুলছে…",
  progressLabel: "নিমন্ত্রণের অগ্রগতি",
  progress: (step, total) => `${total}টির মধ্যে ধাপ ${step}`,
  done: "সম্পূর্ণ",
  designChosen: "আপনার ডিজাইন",
  changeDesign: "ডিজাইন বদলান",
  stages: { design: "ডিজাইন", details: "আপনার তথ্য", preview: "প্রিভিউ ও পাঠান" },
  sections: {
    label: "আপনার তথ্য, ছয়টি ভাগে",
    open: (part, summary, state) =>
      `${part}: ${summary}${state === "done" ? ", সম্পূর্ণ" : state === "check" ? ", একবার দেখে নিন" : ""}। খুলুন`,
    done: "সম্পূর্ণ",
    check: "একবার দেখে নিন",
    edit: "বদলান",
    names: (names) => (names.length ? names.join(" ও ") : "নাম যোগ করুন"),
    functions: (names) =>
      names.length === 0
        ? "আপনার অনুষ্ঠানগুলি বেছে নিন"
        : names.length <= 3
          ? names.join(", ")
          : `${names.slice(0, 2).join(", ")} এবং আরও ${names.length - 2}টি`,
    family: (filled) =>
      filled ? "পরিবারের তথ্য যোগ হয়েছে" : "ঐচ্ছিক: বাবা-মা, আশীর্বাদ আর নিমন্ত্রণকর্তা",
    photos: (photos) => (photos === 0 ? "এখনও কোনো ছবি নেই" : `${photos}টি ছবি`),
    words: (own) => (own ? "আপনার নিজের লেখা" : "আপনার অনুষ্ঠানের জন্য লেখা"),
    music: (own, questions) =>
      `${own ? "আপনার নিজের গান" : "ডিজাইনের সংগীত"} · ${questions === 0 ? "আর কোনো প্রশ্ন নেই" : `${questions}টি প্রশ্ন`}`,
  },
  back: "পিছনে",
  next: "এগিয়ে চলুন",
  toPreview: "নিমন্ত্রণপত্র দেখুন",
  preview: "নিমন্ত্রণপত্রের প্রিভিউ",
  showPreview: "প্রিভিউ",
  previewTitle: "আপনার নিমন্ত্রণপত্র",
  livePreview: "লাইভ প্রিভিউ, বড় করে দেখুন",
  hideLivePreview: "লাইভ প্রিভিউ লুকান",
  showLivePreview: "লাইভ প্রিভিউ দেখান",
  close: "বন্ধ করুন",
  optional: "ঐচ্ছিক",
  characters: (used, max) => `${max}টির মধ্যে ${used}টি অক্ষর`,
  fixErrors: (count) => (count === 1 ? "একটি বিষয়ে নজর দিন" : `${count}টি বিষয়ে নজর দিন`),
  errors: {
    required: "অনুগ্রহ করে এটি পূরণ করুন",
    "too-long": "কার্ডের জন্য এটি খুব লম্বা",
    "no-functions": "অন্তত একটি অনুষ্ঠান বেছে নিন",
  },
  save: {
    idle: "ড্রাফট এই ডিভাইসেই সেভ হয়",
    saving: "সেভ হচ্ছে…",
    saved: "ড্রাফট সেভ হয়েছে",
    unavailable: "এই ডিভাইসে সেভ করা যাচ্ছে না",
  },
};

export const syncCopy: Translation<typeof en.syncCopy> = {
  idle: "আপনার অ্যাকাউন্টে সেভ হয়",
  syncing: "সেভ হচ্ছে…",
  synced: "আপনার অ্যাকাউন্টে সেভ হয়েছে",
  offline: "এই ডিভাইসে সেভ হয়েছে, আবার চেষ্টা চলছে",
  "needs-plan": "এখনও লাইভ নয়: একটি প্যাকেজ লাগবে",
  missing: "এই নিমন্ত্রণটি আপনার অ্যাকাউন্টে নেই। হয়তো মুছে ফেলা হয়েছে।",
  setAside:
    "অন্য ডিজাইনে আপনার পরিবর্তনটি এখন “আমার নিমন্ত্রণ”-এ আলাদা খসড়া। এই নিমন্ত্রণপত্রটি অতিথিরা যেমন দেখেন তেমনই খোলে।",
  switchFailed: "খোলা নিমন্ত্রণটি সেভ করা গেল না, তাই সেটিই খোলা রইল। একটু পরে আবার চেষ্টা করুন।",
};

export const stepCopy: Translation<typeof en.stepCopy> = {
  occasion: {
    label: "উপলক্ষ",
    eyebrow: "উপলক্ষ বেছে নিন",
    title: "আপনি কী উদ্‌যাপন করছেন?",
    intro:
      "উপলক্ষ অনুযায়ী নিমন্ত্রণ সাজানো হয়: কোন কোন অনুষ্ঠান, কেমন লেখা আর কোন ডিজাইন মানাবে। পরে বদলালেও আপনার লেখা কিছুই হারাবে না।",
  },
  tradition: {
    label: "রীতি",
    eyebrow: "রীতি বেছে নিন",
    title: "কার্ড কোন রীতি মেনে হবে?",
    intro:
      "রীতি অনুযায়ী ঠিক হয় কার্ডের শুভ চিহ্ন, সবার উপরের মঙ্গলাচরণ, আচারের স্থানীয় নাম আর পরিবারের ভাষা। সবকিছুই বদলানো যায়, আর এই ধাপটি বাদও দিতে পারেন।",
  },
  design: {
    label: "ডিজাইন",
    eyebrow: "ডিজাইন বেছে নিন",
    title: "অতিথিরা যে ডিজাইনটি খুলবেন, সেটি বেছে নিন",
    intro:
      "প্রতিটি ডিজাইনের নিজস্ব ছবি, খোলার ধরন আর রাগ আছে। যখন খুশি বদলান, আপনার লেখা প্রতিটি শব্দ থেকে যাবে।",
  },
  couple: {
    label: "নাম",
    eyebrow: "নাম",
    title: "কার বিয়ে?",
    intro: "কার্ডের ভাষা বেছে নিন, তারপর নাম লিখুন। প্রতিটি ডিজাইনে নাম বড় অক্ষরে থাকে।",
  },
  family: {
    label: "পরিবার",
    eyebrow: "পরিবার",
    title: "অতিথিদের কারা নিমন্ত্রণ করছেন?",
    intro:
      "বাবা-মা, আশীর্বাদ আর নিমন্ত্রণকর্তা। সবই ঐচ্ছিক: যা পূরণ করবেন, তা পরিবারের পাতায় দেখা যাবে।",
  },
  functions: {
    label: "অনুষ্ঠান",
    eyebrow: "অনুষ্ঠান",
    title: "কবে, কোথায় কী হচ্ছে?",
    intro:
      "যে অনুষ্ঠানগুলিতে অতিথিদের ডাকছেন, সেগুলি বেছে নিন। কার্ডে মূল অনুষ্ঠানের তারিখ আর স্থান থাকে; খুললে অতিথিরা প্রতিটি অনুষ্ঠান দেখতে পান।",
  },
  photos: {
    label: "ছবি",
    eyebrow: "ছবি",
    title: "আপনার ছবি যোগ করুন",
    intro:
      "আপনার ডিজাইন তার ফ্রেমে যে ছবিগুলি দেখায় সেগুলি যোগ করুন, আর অতিথিদের দেখার জন্য আরও কিছু।",
  },
  words: {
    label: "কার্ডের লেখা",
    eyebrow: "কার্ডের লেখা",
    title: "কার্ডের লেখা পড়ে নিন",
    intro:
      "উপরের মঙ্গলাচরণ থেকে শুরু করে প্রতিটি লাইন আপনার উপলক্ষের জন্য আগে থেকেই লেখা। চাইলে নিজের পরিবারের মতো করে বদলান, নয়তো যেমন আছে তেমনই রাখুন।",
  },
  music: {
    label: "সংগীত ও উত্তর",
    eyebrow: "সংগীত ও উত্তর",
    title: "সংগীত ও উত্তর",
    intro:
      "কার্ড খোলার সময় কোন সংগীত বাজবে, উত্তরে কী জানতে চাইবেন, আর অতিথিরা কাকে ফোন করতে পারবেন।",
  },
  preview: {
    label: "প্রিভিউ",
    eyebrow: "প্রিভিউ",
    title: "অতিথিরা ঠিক এটাই দেখবেন",
    intro: "কার্ডটি খুলুন, সংগীত চালান আর আরেকবার পড়ে নিন।",
  },
};

export const functionCopy: Translation<typeof en.functionCopy> = {
  roka: {
    name: "রোকা",
    description: "দুই পরিবার সম্বন্ধে আশীর্বাদ জানায় আর উপহার বিনিময় করে",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "লাল আর সোনালি", "হালকা রঙের সালোয়ার আর শাড়ি"],
  },
  engagement: {
    name: "বাগদান",
    description: "আংটি বদল, সগাই বা নিশ্চয়তার্থম",
    dressIdeas: ["ইন্দো-ওয়েস্টার্ন", "হালকা রং আর আইভরি", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  tilak: {
    name: "তিলক",
    description: "কনের পরিবার বরকে তিলক পরিয়ে আশীর্বাদ আর উপহার দেয়",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "কুর্তা আর বন্ধগলা", "লাল আর সোনালি"],
  },
  "ganesh-puja": {
    name: "গণেশ পুজো",
    description: "গণেশ স্থাপনা বা পুজো, যাতে শুভকাজ নির্বিঘ্নে শুরু হয়",
    dressIdeas: ["ঐতিহ্যবাহী ভারতীয়", "হলুদ আর লাল", "সাদামাটা আর রুচিশীল"],
  },
  "grah-shanti": {
    name: "গৃহশান্তি",
    description: "বিয়ের আগে বাড়িতে হোম আর পরিবারের জন্য আশীর্বাদ",
    dressIdeas: ["ঐতিহ্যবাহী ভারতীয়", "সুতি আর রেশম", "হালকা রং"],
  },
  mandap: {
    name: "মণ্ডপ মুহূর্ত",
    description: "মণ্ডপ বাঁধা আর পুজো; দক্ষিণে পন্দক্কাল",
    dressIdeas: ["ঐতিহ্যবাহী ভারতীয়", "উজ্জ্বল আর রঙিন", "আরামদায়ক ঐতিহ্যবাহী"],
  },
  mameru: {
    name: "মামেরু",
    description: "মামার বাড়ি থেকে উপহার নিয়ে আসেন মামারা; উত্তরে ভাত বা মায়রা",
    dressIdeas: ["বাঁধনি আর লেহেরিয়া", "উৎসবের ঐতিহ্যবাহী পোশাক", "লাল আর গোলাপি"],
  },
  haldi: {
    name: "গায়ে হলুদ",
    description: "হলুদের আশীর্বাদ, সাধারণত বিয়ের আগের দিন সকালে",
    dressIdeas: ["হলুদের নানা শেড", "সাদা আর হালকা রং", "দাগ লাগলেও চিন্তা নেই এমন পোশাক"],
  },
  mehendi: {
    name: "মেহেন্দি",
    description: "মেহেন্দি, গান আর আরামের এক দুপুর",
    dressIdeas: ["সবুজ আর ফুলেল", "উজ্জ্বল আর রঙিন", "আরামদায়ক ঐতিহ্যবাহী"],
  },
  sangeet: {
    name: "সংগীত সন্ধ্যা",
    description: "গান, নাচ আর পরিবেশনার এক সন্ধ্যা",
    dressIdeas: ["ইন্দো-ওয়েস্টার্ন", "সিকুইন আর ঝলমলে", "গাঢ় রত্নের মতো রং"],
  },
  garba: {
    name: "গরবা রাত",
    description: "অনেক রাত পর্যন্ত রাস, গরবা আর ডান্ডিয়া",
    dressIdeas: ["চানিয়া চোলি আর কেডিয়ু", "আয়নার কাজ", "উজ্জ্বল আর রঙিন"],
  },
  bhoj: {
    name: "পারিবারিক ভোজ",
    description: "পরিবার আর বন্ধুদের জন্য ভোজ: কেলবন, আইবুড়োভাত বা ভোজন সমারম্ভ",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "আরামদায়ক ঐতিহ্যবাহী", "স্মার্ট ক্যাজুয়াল"],
  },
  baraat: {
    name: "বরযাত্রা",
    description: "গান-বাজনা আর নাচের সঙ্গে বরযাত্রীরা রওনা দেন",
    dressIdeas: ["সাফা আর পাগড়ি", "শেরওয়ানি আর কুর্তা", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  "baraat-welcome": {
    name: "বরবরণ",
    description: "কনের পরিবার বরযাত্রীদের স্বাগত জানায়: মিলনি বা জান আগমন",
    dressIdeas: ["ঐতিহ্যবাহী ভারতীয়", "রেশম আর জরি", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  wedding: {
    name: "বিয়ে",
    description: "সাত পাক, প্রতিজ্ঞা আর বিবাহের আচার",
    dressIdeas: ["ঐতিহ্যবাহী ভারতীয়", "হালকা রং, কালো বা সাদা নয়", "রেশম আর জরি"],
  },
  vidaai: {
    name: "কনে বিদায়",
    description: "আশীর্বাদ নিয়ে কনের বিদায়",
    dressIdeas: ["ঐতিহ্যবাহী ভারতীয়", "হালকা রং", "রেশম আর জরি"],
  },
  reception: {
    name: "রিসেপশন",
    description: "সবার সঙ্গে নৈশভোজ আর আনন্দ",
    dressIdeas: ["ফর্মাল", "ব্ল্যাক টাই", "উৎসবের সন্ধ্যার পোশাক"],
  },
  birthday: {
    name: "জন্মদিনের পার্টি",
    description: "কেক, খেলা আর জন্মদিনের আশীর্বাদ",
    dressIdeas: ["হালকা রং", "স্মার্ট ক্যাজুয়াল", "যেমন খুশি"],
  },
  anniversary: {
    name: "বিবাহবার্ষিকীর নৈশভোজ",
    description: "একসঙ্গে কাটানো বছরগুলি উদ্‌যাপনের এক সন্ধ্যা",
    dressIdeas: ["ফর্মাল", "উৎসবের ঐতিহ্যবাহী পোশাক", "লাল আর সোনালি"],
  },
  party: {
    name: "পার্টি",
    description: "গান, খাওয়াদাওয়া আর বন্ধুরা",
    dressIdeas: ["স্মার্ট ক্যাজুয়াল", "ককটেল", "একটু ঝলমলে কিছু"],
  },
  "baby-shower": {
    name: "সাধ",
    description: "হবু মায়ের জন্য আশীর্বাদ, গান আর উপহার",
    dressIdeas: ["হালকা রং", "উৎসবের ঐতিহ্যবাহী পোশাক", "সবুজ আর হলুদ"],
  },
  diwali: {
    name: "দীপাবলির পার্টি",
    description: "লক্ষ্মীপুজো, প্রদীপ, মিষ্টি আর নৈশভোজ",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "লাল আর সোনালি", "একটু ঝলমলে কিছু"],
  },
  housewarming: {
    name: "গৃহপ্রবেশ",
    description: "নতুন বাড়িতে পুজো, হোম আর খাওয়াদাওয়া",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "হালকা রং", "আরামদায়ক ঐতিহ্যবাহী"],
  },
  puja: {
    name: "পুজো",
    description: "কথা, আরতি আর প্রসাদ",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "সাদা আর হলুদ", "ঐতিহ্যবাহী"],
  },
  "thread-ceremony": {
    name: "উপনয়ন",
    description: "পৈতে, হোম আর পারিবারিক ভোজ",
    dressIdeas: ["ঐতিহ্যবাহী", "সাদা আর সোনালি", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  annaprashan: {
    name: "অন্নপ্রাশন",
    description: "আশীর্বাদের সঙ্গে শিশুর মুখে প্রথম ভাত",
    dressIdeas: ["হালকা রং", "উৎসবের ঐতিহ্যবাহী পোশাক", "হলুদ আর সাদা"],
  },
  christening: {
    name: "বাপ্তিস্ম",
    description: "গির্জায় প্রার্থনা আর পরিবারের সঙ্গে দুপুরের খাওয়া",
    dressIdeas: ["সাদা আর হালকা রং", "রবিবারের সেরা পোশাক", "স্মার্ট ক্যাজুয়াল"],
  },
  "prayer-meet": {
    name: "স্মরণসভা",
    description: "প্রার্থনা, ভজন আর স্মরণ",
    dressIdeas: ["সাদা", "হালকা রং", "সাদামাটা আর শান্ত"],
  },
  retirement: {
    name: "অবসরের অনুষ্ঠান",
    description: "দীর্ঘ কর্মজীবনের জন্য নৈশভোজ আর শুভেচ্ছা",
    dressIdeas: ["স্মার্ট ক্যাজুয়াল", "ফর্মাল", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  "farewell-party": {
    name: "বিদায় সংবর্ধনা",
    description: "গান, স্মৃতি আর ভালোবাসার বিদায়",
    dressIdeas: ["ফর্মাল", "স্মার্ট ক্যাজুয়াল", "একটু ঝলমলে কিছু"],
  },
  "shop-opening": {
    name: "উদ্বোধন",
    description: "ফিতে কাটা, পুজো আর জলখাবার",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "স্মার্ট ক্যাজুয়াল", "ফর্মাল"],
  },
  launch: {
    name: "লঞ্চ",
    description: "প্রথম ঝলক, দু-চার কথা আর নৈশভোজ",
    dressIdeas: ["বিজনেস ফর্মাল", "স্মার্ট ক্যাজুয়াল", "ব্ল্যাক টাই"],
  },
  "ganesh-chaturthi": {
    name: "গণপতি দর্শন",
    description: "আরতি, দর্শন আর প্রসাদ",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "হলুদ আর লাল", "ঐতিহ্যবাহী"],
  },
  navratri: {
    name: "নবরাত্রির রাত",
    description: "গরবা, আরতি আর ভোগ",
    dressIdeas: ["চানিয়া চোলি", "উৎসবের ঐতিহ্যবাহী পোশাক", "উজ্জ্বল রং"],
  },
  janmashtami: {
    name: "জন্মাষ্টমী",
    description: "ভজন, ঝাঁকি আর মাঝরাতের আরতি",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "হলুদ আর নীল", "ছোট্ট কৃষ্ণের সাজ"],
  },
  onam: {
    name: "ওণাম সাদ্যা",
    description: "পুক্কলম, সাদ্যা আর গান",
    dressIdeas: ["কসাভু", "সাদা আর সোনালি", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  sankranti: {
    name: "সংক্রান্তি",
    description: "ঘুড়ি, তিলের নাড়ু আর পোঙ্গল",
    dressIdeas: ["উজ্জ্বল রং", "উৎসবের ঐতিহ্যবাহী পোশাক", "ছাদে আরামে থাকার মতো"],
  },
  lohri: {
    name: "লোহরির আগুন",
    description: "আগুন জ্বালানো, রেওড়ি, ভাংড়া আর নৈশভোজ",
    dressIdeas: ["ফুলকারি", "উজ্জ্বল রং", "একটু গরম কিছু"],
  },
  eid: {
    name: "ইফতারের দাওয়াত",
    description: "রোজা ভাঙা, দাওয়াত আর ঈদের শুভেচ্ছা",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "সাদা আর সবুজ", "একটু রুচিশীল কিছু"],
  },
  "naming-ceremony": {
    name: "নামকরণ",
    description: "নামকরণ, আশীর্বাদ আর দুপুরের খাওয়া",
    dressIdeas: ["হালকা রং", "উৎসবের ঐতিহ্যবাহী পোশাক", "আরামদায়ক কিছু"],
  },
  holi: {
    name: "হোলি",
    description: "রং, গান, ঠান্ডাই আর দুপুরের খাওয়া",
    dressIdeas: ["সাদা পোশাক", "রং লাগলেও চলে এমন পুরোনো জামা", "আরামদায়ক জুতো"],
  },
  christmas: {
    name: "বড়দিনের পার্টি",
    description: "ক্যারল, প্লাম কেক আর নৈশভোজ",
    dressIdeas: ["লাল আর সবুজ", "উৎসবের পোশাক", "একটু গরম কিছু"],
  },
  reunion: {
    name: "পুনর্মিলনী",
    description: "পুরোনো বন্ধু, গল্প আর নৈশভোজ",
    dressIdeas: ["স্মার্ট ক্যাজুয়াল", "স্কুলের পুরোনো রং", "আরামদায়ক কিছু"],
  },
  graduation: {
    name: "গ্র্যাজুয়েশন পার্টি",
    description: "কেক, পরিবার আর গর্বের এক সন্ধ্যা",
    dressIdeas: ["স্মার্ট ক্যাজুয়াল", "উৎসবের পোশাক", "কলেজের রং"],
  },
  "gudi-padwa": {
    name: "গুড়ি পাড়ওয়া",
    description: "গুড়ি, পুজো আর উৎসবের দুপুরের ভোজ",
    dressIdeas: ["নৌবারি আর কুর্তা", "উৎসবের ঐতিহ্যবাহী পোশাক", "গেরুয়া আর সবুজ"],
  },
  baisakhi: {
    name: "বৈশাখী",
    description: "ফসল, ভাংড়া, গিদ্দা আর নৈশভোজ",
    dressIdeas: ["ফুলকারি", "উজ্জ্বল পাগড়ি আর দোপাট্টা", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  bihu: {
    name: "বিহু",
    description: "বিহু গান, নাচ আর পিঠে",
    dressIdeas: ["মেখলা চাদর", "গামোসা", "উৎসবের ঐতিহ্যবাহী পোশাক"],
  },
  "raksha-bandhan": {
    name: "রাখিবন্ধন",
    description: "রাখি, আরতি, মিষ্টি আর দুপুরের খাওয়া",
    dressIdeas: ["উৎসবের ঐতিহ্যবাহী পোশাক", "উজ্জ্বল রং", "আরামদায়ক কিছু"],
  },
  "karva-chauth": {
    name: "করবা চৌথ",
    description: "কথা, চাঁদ ওঠা আর নৈশভোজ",
    dressIdeas: ["লাল আর সোনালি", "বিয়ের লেহেঙ্গা বা শাড়ি", "উৎসবের কিছু"],
  },
};

export const functionFields: Translation<typeof en.functionFields> = {
  group: "অনুষ্ঠান",
  date: "তারিখ",
  datePlaceholder: "তারিখ বেছে নিন",
  time: "শুরুর সময়",
  timePlaceholder: "সময় বেছে নিন",
  venue: "স্থান",
  venuePlaceholder: "যেমন পিছোলা লেকসাইড গার্ডেনস, উদয়পুর",
  city: "শহর বা স্থান",
  cityPlaceholder: "যেমন উদয়পুর",
  cityHint: "সেভ দ্য ডেট-এ শুধু তারিখ আর শহর লাগে। সময় আর স্থান নিমন্ত্রণপত্রে আসবে।",
  suggested: (occasion) => `${occasion} উপলক্ষের অনুষ্ঠান`,
  more: "আরও অনুষ্ঠান",
  moreHint: "অতিথিদের ডাকছেন এমন অন্য কোনো অনুষ্ঠান যোগ করুন।",
  showMore: (count) => `আরও ${count}টি অনুষ্ঠান দেখান`,
  address: "ঠিকানা",
  addressHint: "অতিথিরা এটি স্থানের নামের নিচে দেখবেন।",
  pin: "Google Maps পিন",
  pinHint:
    "Google Maps-এ স্থানটি খুলুন, Share-এ ট্যাপ করুন আর লিংকটি এখানে পেস্ট করুন। অতিথিরা ম্যাপ আর এক ট্যাপে ঠিক সেই জায়গার পথ পাবেন।",
  pinInvalid: "এটি Google Maps-এর লিংক নয়। Google Maps-এ Share থেকে লিংকটি কপি করুন।",
  parking: "পার্কিং",
  parkingPlaceholder: "মূল গেটে ভ্যালে, হলের পিছনে ফ্রি পার্কিং",
  dressCode: "পোশাকবিধি",
  dressIdeas: "পোশাকের পরামর্শ",
  onCard: "কার্ডে",
  endTime: "শেষের সময়",
  endHint: "অনুষ্ঠান অনেক রাত পর্যন্ত চললে খালি রাখুন।",
  muhuratHint: "শুরু আর শেষের সঠিক সময়, মিনিট পর্যন্ত, বেছে নিন। অতিথিরা ঠিক তেমনই দেখবেন।",
  moreDetails: "আরও তথ্য",
  moreDetailsHint: "শেষের সময়, ঠিকানা, ম্যাপ পিন, পার্কিং আর পোশাকবিধি",
  samePlace: "অন্য অনুষ্ঠানের জায়গাই",
  sameAs: (name: string) => `${name}-এর জায়গাই`,
  placeToEmpty: (count: number) => `এই জায়গা বাকি ${count}টি অনুষ্ঠানে বসান`,
};

export const coupleCopy: Translation<typeof en.coupleCopy> = {
  namesHeading: "নাম",
  slotNames: {
    doorLeft: "বাঁ দিকের দরজা",
    doorRight: "ডান দিকের দরজা",
    blessing: "আশীর্বাদ",
    families: "পরিবার",
    first: "প্রথম নাম",
    joiner: "দুই নামের মাঝে",
    second: "দ্বিতীয় নাম",
    line: "আমন্ত্রণের লাইন",
    date: "তারিখ ও সময়",
    venue: "স্থান",
  },
  example: (sample) => `যেমন ${sample}`,
  joinerHint: "দুই নামের মাঝের শব্দ, যেমন &, ও বা weds।",
  doorsHint: "দরজায় লেখা দুটি ছোট শব্দ।",
  anyScript: "যেকোনো লিপিতে লিখুন। বাংলা, হিন্দি, তামিল সবই কার্ডে সুন্দর আসে।",
  latinOnCard: (language) =>
    `আপনার কার্ড ${language} ভাষায়, তাই অতিথিরা এই নাম ইংরেজি অক্ষরে দেখবেন। নিচে ${language} বানানটি বেছে নিন, বা ${language} কিবোর্ডে টাইপ করুন।`,
  spellings: (language) => `${language} অক্ষরে`,
  useSpelling: (name) => `${name} লিখুন`,
  languagesHeading: "কার্ডের ভাষা",
  languagesHint: "দুটি ভাষা বাছলে অতিথিরা নিমন্ত্রণপত্রে দুটির মধ্যে বদল করতে পারবেন।",
  bothLanguages: (main, second) => `${main} ও ${second}`,
  secondHint: (main) => `কোনো লাইন খালি রাখলে ${main} কার্ডের লেখাই থাকবে।`,
  ideas: "পরামর্শ",
  ideasLabel: (field) => `পরামর্শ: ${field}`,
  useIdea: (text) => `“${text}” লিখুন`,
};

export const languageCopy: Translation<typeof en.languageCopy> = {
  mainHeading: "কার্ডের ভাষা",
  mainHint: "নাম, লেখা, অনুষ্ঠানের নাম আর তারিখ সবই এই ভাষায় থাকবে, আর এই সব ধাপও।",
  traditionMatch: "আপনার রীতির",
  secondHeading: "দ্বিতীয় একটি ভাষাও যোগ করবেন?",
  secondHint:
    "অতিথিরা নিমন্ত্রণপত্রে দুটি ভাষার মধ্যে বদল করতে পারবেন। এটি ঐচ্ছিক, আর সেলিব্রেশন ও গ্র্যান্ড প্যাকেজে পাওয়া যায়।",
  secondNone: "শুধু একটি ভাষা",
};

export const namesCopy: Translation<typeof en.namesCopy> = {
  steps: {
    birthday: { label: "জন্মদিন", eyebrow: "জন্মদিন", title: "কার জন্মদিন?" },
    anniversary: { label: "দম্পতি", eyebrow: "দম্পতি", title: "কারা উদ্‌যাপন করছেন?" },
    party: { label: "পার্টি", eyebrow: "পার্টি", title: "পার্টির নাম কী?" },
    "baby-shower": { label: "হবু মা", eyebrow: "সাধ", title: "হবু মা কে?" },
    diwali: { label: "দীপাবলি", eyebrow: "দীপাবলি", title: "আপনার দীপাবলির পার্টির নাম কী?" },
    housewarming: { label: "বাড়ি", eyebrow: "নতুন বাড়ি", title: "নতুন বাড়ির নাম কী?" },
    puja: { label: "পুজো", eyebrow: "পুজো", title: "আপনি কোন পুজোর আয়োজন করছেন?" },
    "thread-ceremony": { label: "বালক", eyebrow: "উপনয়ন", title: "কার উপনয়ন?" },
    annaprashan: { label: "শিশু", eyebrow: "অন্নপ্রাশন", title: "শিশুর নাম কী?" },
    christening: { label: "শিশু", eyebrow: "বাপ্তিস্ম", title: "শিশুর নাম কী?" },
    "prayer-meet": {
      label: "স্মরণে",
      eyebrow: "স্মরণসভা",
      title: "আপনি কার স্মরণে সভার আয়োজন করছেন?",
    },
    retirement: {
      label: "অবসরপ্রাপ্ত",
      eyebrow: "অবসর",
      title: "কে অবসর নিচ্ছেন?",
    },
    "farewell-party": {
      label: "বিদায়",
      eyebrow: "বিদায় সংবর্ধনা",
      title: "আপনি কাকে বিদায় জানাচ্ছেন?",
    },
    "shop-opening": { label: "ব্যবসা", eyebrow: "উদ্বোধন", title: "আপনার ব্যবসার নাম কী?" },
    launch: { label: "ইভেন্ট", eyebrow: "লঞ্চ", title: "আপনি কী লঞ্চ করছেন?" },
    "ganesh-chaturthi": {
      label: "গণপতি",
      eyebrow: "গণেশ চতুর্থী",
      title: "আপনার গণপতি উৎসবের নাম কী?",
    },
    navratri: { label: "উৎসব", eyebrow: "নবরাত্রি", title: "আপনার নবরাত্রি উৎসবের নাম কী?" },
    janmashtami: {
      label: "উৎসব",
      eyebrow: "জন্মাষ্টমী",
      title: "আপনার জন্মাষ্টমী উৎসবের নাম কী?",
    },
    onam: { label: "উৎসব", eyebrow: "ওণাম", title: "আপনার ওণাম উৎসবের নাম কী?" },
    sankranti: {
      label: "উৎসব",
      eyebrow: "সংক্রান্তি",
      title: "আপনার সংক্রান্তি উৎসবের নাম কী?",
    },
    lohri: { label: "উৎসব", eyebrow: "লোহরি", title: "আপনার লোহরির রাতের নাম কী?" },
    eid: { label: "দাওয়াত", eyebrow: "ঈদ ও ইফতার", title: "আপনার দাওয়াতের নাম কী?" },
    "naming-ceremony": { label: "শিশু", eyebrow: "নামকরণ", title: "শিশুর নাম কী?" },
    holi: { label: "উৎসব", eyebrow: "হোলি", title: "আপনার হোলি পার্টির নাম কী?" },
    christmas: {
      label: "পার্টি",
      eyebrow: "বড়দিন",
      title: "আপনার বড়দিনের পার্টির নাম কী?",
    },
    reunion: { label: "পুনর্মিলনী", eyebrow: "পুনর্মিলনী", title: "কোন ব্যাচ বা দল মিলছে?" },
    graduation: { label: "গ্র্যাজুয়েট", eyebrow: "গ্র্যাজুয়েশন", title: "কার গ্র্যাজুয়েশন?" },
    "gudi-padwa": {
      label: "উৎসব",
      eyebrow: "গুড়ি পাড়ওয়া ও উগাদি",
      title: "আপনার নববর্ষ উৎসবের নাম কী?",
    },
    baisakhi: { label: "উৎসব", eyebrow: "বৈশাখী", title: "আপনার বৈশাখী উৎসবের নাম কী?" },
    bihu: { label: "উৎসব", eyebrow: "বিহু", title: "আপনার বিহু উৎসবের নাম কী?" },
    "raksha-bandhan": {
      label: "বোন ও ভাই",
      eyebrow: "রাখিবন্ধন",
      title: "কাদের রাখিবন্ধন?",
    },
    "karva-chauth": { label: "দম্পতি", eyebrow: "করবা চৌথ", title: "কারা উদ্‌যাপন করছেন?" },
  },
  one: {
    birthday: { label: "যার জন্মদিন, তার নাম", example: "আরভ" },
    party: { label: "পার্টির নাম", example: "দীপাবলির রাত" },
    "baby-shower": { label: "তাঁর নাম", example: "প্রিয়া" },
    diwali: { label: "পার্টির নাম", example: "শর্মা পরিবারের দীপাবলি" },
    housewarming: { label: "বাড়ি বা পরিবারের নাম", example: "শর্মা নিবাস" },
    puja: { label: "পুজোর নাম", example: "সত্যনারায়ণ কথা" },
    "thread-ceremony": { label: "তার নাম", example: "আরভ" },
    annaprashan: { label: "শিশুর নাম", example: "অনায়া" },
    christening: { label: "শিশুর নাম", example: "অ্যারন" },
    "prayer-meet": { label: "তাঁর নাম", example: "শ্রী আর. কে. শর্মা" },
    retirement: { label: "তাঁর নাম", example: "আর. কে. শর্মা" },
    "farewell-party": { label: "নাম বা ব্যাচ", example: "2026 ব্যাচ" },
    "shop-opening": { label: "ব্যবসার নাম", example: "শর্মা জুয়েলার্স" },
    launch: { label: "ইভেন্টের নাম", example: "অরোরা লঞ্চ" },
    "ganesh-chaturthi": { label: "উৎসবের নাম", example: "শর্মা পরিবারের গণপতি" },
    navratri: { label: "উৎসবের নাম", example: "নবরাত্রি উৎসব" },
    janmashtami: { label: "উৎসবের নাম", example: "কৃষ্ণ জন্মোৎসব" },
    onam: { label: "উৎসবের নাম", example: "ওণাম সাদ্যা" },
    sankranti: { label: "উৎসবের নাম", example: "ঘুড়ির দিন" },
    lohri: { label: "উৎসবের নাম", example: "লোহরির রাত" },
    eid: { label: "দাওয়াতের নাম", example: "ইফতারের দাওয়াত" },
    "naming-ceremony": { label: "শিশুর নাম", example: "অনায়া" },
    holi: { label: "উৎসবের নাম", example: "হোলি মিলন" },
    christmas: { label: "পার্টির নাম", example: "বড়দিনের পার্টি" },
    reunion: { label: "ব্যাচ বা দল", example: "2006 ব্যাচ" },
    graduation: { label: "গ্র্যাজুয়েটের নাম", example: "রিয়া" },
    "gudi-padwa": { label: "উৎসবের নাম", example: "গুড়ি পাড়ওয়ার ভোজ" },
    baisakhi: { label: "উৎসবের নাম", example: "বৈশাখী মেলা" },
    bihu: { label: "উৎসবের নাম", example: "রঙালি বিহু" },
  },
  oneHint: "এটি প্রচ্ছদে বড় অক্ষরে ছাপা হয়। কে নিমন্ত্রণ করছেন আর কেন, তা নিচের লেখায় বলুন।",
};

const LEAD_NAMES: Record<LeadId, string> = {
  santoor: "সন্তুর",
  sitar: "সেতার",
  bansuri: "বাঁশি",
  shehnai: "সানাই",
  veena: "বীণা",
};

const TAAL_NAMES: Record<TaalId, string> = {
  keherwa: "ঢোলক",
  dadra: "ঢোলক",
  garba: "গরবার ঢোল আর হাততালি",
  bhangra: "পাঞ্জাবি ঢোল",
};

export const extrasCopy: Translation<typeof en.extrasCopy> = {
  photosHeading: "ছবি",
  photosHint: (max) =>
    `${max}টি পর্যন্ত ছবি। সেভ করার আগে ফোনেই ছোট করে নেওয়া হয়, যাতে অতিথিদের কাছে তাড়াতাড়ি খোলে।`,
  addPhotos: "ছবি যোগ করুন",
  dropHere: "বা এখানে ছেড়ে দিন",
  photo: (index) => `ছবি ${index}`,
  removePhoto: (index) => `ছবি ${index} সরান`,
  moveEarlier: (index) => `ছবি ${index} আগে আনুন`,
  full: (max) => `${max}টিই হয়ে গেছে। নতুন যোগ করতে একটি সরান।`,
  processing: "ছবি তৈরি হচ্ছে…",
  photoFailed: "এই ছবিটি পড়া গেল না। JPEG বা PNG চেষ্টা করুন।",
  storageFailed: "এই ব্রাউজারে ছবি সেভ করা যায় না, যেমন প্রাইভেট মোডে।",
  emptyPhotos: "এখনও কোনো ছবি নেই",
  emptyPhotosBody: "দম্পতির ছবি আর প্রি-ওয়েডিং শুট সবচেয়ে ভালো মানায়।",
  coupleHeading: "ছবির পাতা",
  coupleHint:
    "থিমের নিজস্ব ফ্রেমে আপনার ছবি, নামের ঠিক পরের পাতায়। প্রতিটি থিমের ফ্রেমের আকার আলাদা।",
  coupleLayouts: {
    none: "ছবির পাতা নেই",
    one: "আপনাদের দুজনের একটি ছবি",
    two: "দুটি ছবি, দুজনের আলাদা",
  },
  photoHintOne: "থিমের নিজস্ব ফ্রেমে একটি ছবি, নামের ঠিক পরের পাতায়।",
  photoLayoutsOne: {
    none: "ছবির পাতা নেই",
    one: "একটি ছবি",
  },
  coupleAddFirst: "উপরে একটি ছবি যোগ করুন, সেটি ফ্রেমে বসে যাবে।",
  designPhotosHeading: "আপনার ডিজাইনের ছবি",
  designPhotosHint: (frames) =>
    frames === 1
      ? "ঐচ্ছিক। আপনার ছবি ডিজাইনের নিজস্ব ফ্রেমে দেখা যাবে। ছবি ছাড়াও ডিজাইনটি সম্পূর্ণ দেখায়।"
      : "ঐচ্ছিক। প্রতিটি ফ্রেমের জন্য একটি ছবি যোগ করুন, বা উপরে আপনাদের দুজনের একটি ছবি বেছে নিন।",
  framePhotos: {
    together: "আপনাদের দুজনের ছবি",
    one: "আপনার ছবি",
    of: (name) => `${name}-এর ছবি`,
    first: "প্রথম ছবি",
    second: "দ্বিতীয় ছবি",
  },
  addFramePhoto: (frame) => `যোগ করুন: ${frame}`,
  changeFramePhoto: (frame) => `বদলান: ${frame}`,
  framePhotoAdded: "যোগ হয়েছে",
  framePhotoOptional: "ঐচ্ছিক",
  changePhoto: "ছবি বদলান",
  galleryHeading: "আরও ছবি",
  galleryHint: (max) =>
    `ঐচ্ছিক। অতিথিরা নিমন্ত্রণপত্রে এগুলি স্ক্রোল করে দেখতে পারবেন। মোট ${max}টি ছবি পর্যন্ত।`,
  coupleFrame: (index, frames) =>
    frames === 1 ? "ফ্রেমের ছবি" : index === 1 ? "প্রথম ফ্রেম" : "দ্বিতীয় ফ্রেম",
  useThisPhoto: (index) => `ছবি ${index}`,
  fitHeading: "ছবি ফ্রেমে বসান",
  fitHint: "প্রতিটি ছবি সরিয়ে, বড় করে আর সোজা করে ফ্রেমে সুন্দর করে বসান।",
  adjust: "ঠিক করুন",
  adjustLabel: (frame) => `ছবি ঠিক করুন: ${frame}`,
  adjusted: "ঠিক করা হয়েছে",
  adjustTitle: "ছবি ঠিক করুন",
  adjustDescription:
    "ছবি টেনে সরান। জুম করতে দুই আঙুলে চিমটি কাটুন, স্ক্রোল করুন বা স্লাইডার ব্যবহার করুন।",
  adjustStage: "ফ্রেমের মধ্যে ছবি। সরাতে তীর-চিহ্নের কী আর জুম করতে প্লাস বা মাইনাস টিপুন।",
  zoom: "জুম",
  straighten: "সোজা করুন",
  turn: "ঘোরান",
  turnLabel: "ছবিটি ডানদিকে এক-চতুর্থাংশ ঘোরান",
  resetPhoto: "আগের মতো",
  savePhoto: "সেভ করুন",
  cancelPhoto: "বাতিল",
  closePhoto: "বন্ধ করুন",
  musicHeading: "সংগীত",
  musicHint: "কার্ড খোলার সময় তখনই রচিত একটি রাগ, বা আপনার নিজের গান।",
  musicSource: { raga: "রাগ", own: "নিজের গান" },
  chooseSong: "গান বেছে নিন",
  songNote: "MP3 বা M4A। শুধু সেই গান, যা ব্যবহারের অধিকার আপনার আছে।",
  readingSong: "আপনার গানটি পড়া হচ্ছে…",
  songFailed: "এই ফাইলটি পড়া গেল না। MP3 বা M4A ফাইল চেষ্টা করুন।",
  clipFailed: "এই ব্রাউজারে ক্লিপ তৈরি করা গেল না। Chrome বা Safari চেষ্টা করুন।",
  clipStorageFailed: "এই ব্রাউজারে সংগীত সেভ করা যায় না, যেমন প্রাইভেট মোডে।",
  waveformLabel: (name) => `${name}-এর রূপরেখা, রাখা অংশটুকু উজ্জ্বল`,
  startAt: "শুরু",
  tooShort: (song, need) =>
    `এই গানটি ${song} লম্বা, আর আপনার নিমন্ত্রণপত্র প্রায় ${need} চলে। একটি লম্বা গান বেছে নিন, যাতে সংগীত পুনরাবৃত্তি ছাড়াই শেষ পর্যন্ত চলে।`,
  chooseLonger: "অন্য গান বেছে নিন",
  stopPart: "থামান",
  makingClip: "আপনার ক্লিপ তৈরি হচ্ছে…",
  cancelTrim: "বাতিল",
  changeClip: "বদলান",
  removeClip: "সরান",
  listenClip: "শুনুন",
  clipMeta: (length) => `আপনার সংগীত · ${length}`,
  shortNote: (clip, need) =>
    `আপনার নিমন্ত্রণপত্র এখন প্রায় ${need} চলে, যা এই ${clip}-এর অংশের চেয়ে লম্বা, তাই সংগীত আগেই থেমে যাবে। "বদলান" দিয়ে অংশটি আবার বেছে নিন।`,
  listen: (raga) => `${raga} শুনুন`,
  stopListening: "শোনা বন্ধ করুন",
  designsOwn: "ডিজাইনের নিজস্ব",
  playOnOpen: "অতিথিরা কার্ড খুললে সংগীত বাজবে",
  playOnOpenHint: "অতিথিরা যেকোনো সময় থামাতে পারবেন।",
  pacing: {
    heading: "প্রতিটি পাতার সময়",
    hint: "সংগীত আর রিল আপনার পাতাগুলির সমান লম্বা চলে। অটো-তে প্রতিটি পাতা তার লেখার মতো সময় পায়।",
    auto: "অটো",
    seconds: (n: number) => `${n} সে.`,
    summary: (pages: number, live: number, reel: number) =>
      `${pages}টি পাতা: নিমন্ত্রণপত্রে প্রায় ${live} সেকেন্ডের সংগীত, আর ${reel} সেকেন্ডের রিল।`,
  },
  questionsHeading: "অতিথিদের জন্য প্রশ্ন",
  questionsHint:
    "প্রতিটি উত্তরে জানা যায় কোন অনুষ্ঠানে কে আসছেন, সঙ্গে একটি বার্তাও থাকতে পারে। আর যা জানতে চান, তাতে টিক দিন।",
  questionHints: {
    meal: "নিরামিষ, জৈন, আমিষ বা ভেগান",
    arrival: "কোন দিন তাঁরা শহরে পৌঁছবেন",
    stay: "তাঁদের থাকার ঘর লাগবে কি না",
    pickup: "স্টেশন বা এয়ারপোর্ট থেকে আনতে হবে কি না",
    song: "যে গানটি তাঁরা শুনতে চান",
  },
  ragaNames: {
    yaman: "রাগ ইমন",
    khamaj: "রাগ খাম্বাজ",
    bihag: "রাগ বেহাগ",
    desh: "রাগ দেশ",
    bhupali: "রাগ ভূপালি",
    madhyamavati: "রাগ মধ্যমাবতী",
    mand: "রাগ মান্ড",
    bhimpalasi: "রাগ ভীমপলশ্রী",
    pilu: "রাগ পিলু",
    bhairavi: "রাগ ভৈরবী",
    hamsadhwani: "রাগ হংসধ্বনি",
    kafi: "রাগ কাফি",
  },
  ragaSound: (sound, mood) =>
    `${LEAD_NAMES[sound.lead]}${sound.taal ? `, সঙ্গে ${TAAL_NAMES[sound.taal]}` : ""} · ${mood}`,
  ragaMoods: {
    yaman: "সন্ধ্যার, রোমান্টিক",
    khamaj: "হালকা আর কোমল",
    bihag: "রাতের প্রথম প্রহর, বিয়ের রাগ",
    desh: "বর্ষার, উৎসবমুখর",
    bhupali: "উজ্জ্বল আর আনন্দময়",
    madhyamavati: "শুভ, কর্নাটকী",
    mand: "রাজস্থানি লোকসুর, রাজকীয়",
    bhimpalasi: "দুপুরের, ভক্তিময়",
    pilu: "লোকসুরের রঙে, চঞ্চল",
    bhairavi: "কোমল, বিদায়ের রাগ",
    hamsadhwani: "শুভ, গণপতি বন্দনা",
    kafi: "উৎসবের লোকসুর, হোলির রং",
  },
};

export const faithCopy: Translation<typeof en.faithCopy> = {
  heading: "আপনার ধর্মবিশ্বাস অনুযায়ী লেখা",
  intro: "নিচে প্রস্তাবিত আশীর্বাদ, লাইন আর দরজার শব্দগুলি এটি মেনেই। সবকিছুই আপনি বদলাতে পারবেন।",
  label: "ধর্মবিশ্বাস",
  names: {
    hindu: "হিন্দু",
    sikh: "শিখ",
    muslim: "মুসলিম",
    christian: "খ্রিস্টান",
    jain: "জৈন",
    none: "ধর্মীয় লাইন নয়",
  },
  doorIdeas: "দরজার শব্দ",
  doorIdea: (left, right) => `“${left}” আর “${right}” লিখুন`,
};

export const traditionCopy: Translation<typeof en.traditionCopy> = {
  group: "রীতি",
  none: "কোনো রীতি নয়",
  noneHint: "ডিজাইনের নিজস্ব লেখা, কোনো চিহ্ন নেই",
  nearYou: "আপনার অঞ্চলের",
  draftNote:
    "এই রীতিগুলি এখনও খসড়া। প্রতিটি সম্প্রদায়ের মানুষ লঞ্চের আগে লেখা, চিহ্ন আর আচারের নাম যাচাই করছেন, তাই কিছু ঠিক না লাগলে আমাদের অবশ্যই জানান।",
  names: {
    "north-hindu": "উত্তর ভারতীয় হিন্দু",
    rajasthani: "রাজস্থানি ও মারোয়াড়ি",
    marathi: "মারাঠি",
    gujarati: "গুজরাটি",
    bengali: "বাঙালি হিন্দু",
    tamil: "তামিল হিন্দু",
    modern: "আধুনিক",
  },
  hints: {
    "north-hindu": "শ্রী গণেশায় নমঃ, দর্শনাভিলাষী আর স্বাগতোৎসুক",
    rajasthani: "শ্রী গণেশায় নমঃ, পিঠি আর মহিলা সংগীত",
    marathi: "শ্রী গণেশায় নমঃ, সাখরপুড়া আর হলদ",
    gujarati: "কঙ্কোত্রীর ভাষা, গোল ধানা, পিঠি আর ছোটদের টহুকো",
    bengali: "প্রজাপতয়ে নমঃ, গায়ে হলুদ আর বউভাত",
    tamil: "পিল্লৈয়ার সুড়ি, নিচ্চয়তার্থম আর বরবেরপু",
    modern: "কোনো ধর্মীয় চিহ্ন নেই, যেকোনো দম্পতি বা আন্তঃধর্মীয় বিয়ের জন্য",
  },
  elements: "শুভ চিহ্ন ও মঙ্গলাচরণ",
  elementsIntro: (tradition: string) =>
    `কার্ডের একেবারে উপরের অংশ, আপনার ${tradition} রীতি অনুযায়ী। চাইলে বদলান বা বাদ দিন।`,
  elementsLater: "শুভ চিহ্ন আর মঙ্গলাচরণ, যেমন শ্রী গণেশায় নমঃ, আপনি কার্ডের লেখায় বেছে নেবেন।",
  symbol: "কার্ডের উপরে শুভ চিহ্ন",
  symbolNames: {
    om: "ওঁ",
    kalash: "মঙ্গল কলস",
    swastik: "স্বস্তিক",
    diya: "প্রদীপ",
    prajapati: "প্রজাপতি",
    suzhi: "পিল্লৈয়ার সুড়ি",
    shri: "শ্রী",
    shankh: "শঙ্খ",
    kamal: "পদ্ম",
    "ik-onkar": "ইক ওঙ্কার",
    khanda: "খান্ডা",
    "chand-tara": "চাঁদ-তারা",
    "786": "786",
    bismillah: "বিসমিল্লাহ",
    cross: "ক্রস",
    dove: "পায়রা",
    jain: "জৈন প্রতীক",
  },
  noSymbol: "কোনো চিহ্ন নয়",
  symbolIntro: "আপনার কার্ডের একেবারে উপরে, সব লেখার উপরে আঁকা। একটি বেছে নিন বা বাদ দিন।",
  symbolNote:
    "গণেশ আর অন্যান্য আঁকা দেবদেবী নিমন্ত্রণ খোলার সময় আশীর্বাদ দিতে পারেন: ডিজাইনের সঙ্গে 'কীভাবে খুলবে'-তে বেছে নিন।",
  invocation: "মঙ্গলাচরণ",
  invocationModes: { script: "নিজস্ব লিপিতে", latin: "ইংরেজি অক্ষরে", off: "দেখাবেন না" },
  meanings: {
    "Shri Ganeshaya Namah": "ভগবান গণেশকে প্রণাম",
    "Prajapataye Namah": "বিবাহের দেবতা প্রজাপতিকে প্রণাম",
    "Sri Vinayagar Thunai": "ভগবান বিনায়কের কৃপায়",
  },
  wording: "পরিবারের ভাষা",
  wordingIntro: "অতিথিরা এগুলি কার্ডের নিচে পড়বেন। যেকোনোটি খালি রাখতে পারেন।",
  wordingLabels: {
    blessingsFrom: "আশীর্বাদক",
    requesters: "নিমন্ত্রণকর্তা",
    welcome: "স্বাগত জানাতে অপেক্ষায়",
    children: "ছোটদের আবদার",
  },
};

export const designCopy: Translation<typeof en.designCopy> = designNames.cards;

export const occasionCopy: Translation<typeof en.occasionCopy> = {
  group: "উপলক্ষ",
  setsUp: "এটি কী কী সাজিয়ে দেয়",
  planned: "পরিকল্পিত অনুষ্ঠান",
  questions: "অতিথিদের জিজ্ঞেস করা হবে",
  noQuestions: "শুধু তাঁরা আসছেন কি না আর কতজন",
  designs: (count) => `${count}টি প্রস্তাবিত ডিজাইন`,
  suggestedBadge: "প্রস্তাবিত",
  suggestedFor: (occasion) => `${occasion} উপলক্ষে প্রস্তাবিত`,
  moreDesigns: "আরও ডিজাইন",
};

export const previewCopy: Translation<typeof en.previewCopy> = {
  ready: "আপনার নিমন্ত্রণপত্র তৈরি",
  live: "আপনার নিমন্ত্রণপত্র লাইভ",
  liveBody: (link) =>
    `অতিথিরা এটি ${link}-এ খোলেন। এখানে যা বদলাবেন, সেখানে সঙ্গে সঙ্গে দেখা যাবে।`,
  readyBody:
    "এটি এই ডিভাইসে সেভ হয়েছে। নিজের অ্যাকাউন্টে রাখতে আর প্রকাশ করতে সাইন ইন করুন, তারপর লিংকটি WhatsApp-এ পাঠান।",
  readyBodyAccount:
    "ছবি সমেত এটি আপনার অ্যাকাউন্টে সেভ হয়েছে। আগে অতিথিদের চোখে দেখে নিন, তারপর লিংক পেতে প্রকাশ করুন।",
  seeAsGuest: "অতিথিদের চোখে দেখুন",
  watchVideo: "ভিডিও হিসেবে দেখুন",
  seeAsGuestBody: "পুরো নিমন্ত্রণপত্র, পুরো স্ক্রিনে: খোলা, সংগীত, প্রতিটি পাতা আর উত্তরের ফর্ম।",
  familyTitle: "আগে পরিবারকে দেখান",
  familyBody:
    "দেখে নেওয়ার জন্য তাঁদের WhatsApp-এ একটি ঝলক পাঠান। প্রতিটি স্ক্রিনে ‘ঝলক’ লেখা থাকে আর উত্তর বন্ধ থাকে, তাই এটি নিমন্ত্রণপত্র হিসেবে পাঠানো যায় না। আপনি পাঠালে অতিথিরা পরিষ্কার নিমন্ত্রণপত্র পান।",
  familySend: "পরিবারকে WhatsApp-এ পাঠান",
  familyCopy: "লিঙ্ক কপি করুন",
  familyCopied: "লিঙ্ক কপি হয়েছে",
  familyFailed: "এখন লিঙ্ক বানানো গেল না। একটু পরে আবার চেষ্টা করুন।",
  familySignInBody:
    "সাইন ইন করুন, আমরা একটি ঝলকের লিঙ্ক বানিয়ে দেব যা আপনি পরিবারকে WhatsApp-এ পাঠাতে পারবেন।",
  familySignIn: "পাঠাতে সাইন ইন করুন",
  familyMessage: (url) =>
    `আমাদের নিমন্ত্রণপত্রের একটি ঝলক। দেখে জানান কেমন লাগল, তারপর আমরা পাঠাব: ${url}`,
  notReady: "কয়েকটি তথ্য বাকি আছে",
  fix: (label) => `${label} সম্পূর্ণ করুন`,
  occasionHeading: "উপলক্ষ",
  namesHeading: "নাম",
  functionsHeading: "অনুষ্ঠান",
  photosHeading: "ছবি",
  noPhotos: "কোনো ছবি যোগ করা হয়নি",
  musicHeading: "সংগীত",
  playsOnOpen: "অতিথিরা কার্ড খুললেই বাজে",
  dressCode: "পোশাকবিধি",
  edit: "বদলান",
  editStep: (label) => `${label} বদলান`,
  startOver: "নতুন নিমন্ত্রণ শুরু করুন",
  startOverTitle: "নতুন নিমন্ত্রণ শুরু করবেন?",
  startOverBody: "এতে এই ডিভাইসে সেভ করা নাম, অনুষ্ঠান আর ছবি মুছে যাবে।",
  startOverConfirm: "মুছে নতুন করে শুরু করুন",
  startOverKeepBody:
    "এই নিমন্ত্রণটি আমার নিমন্ত্রণ-এ থাকবে, যখন খুশি ফিরে আসতে পারবেন। নতুনটি খালি থেকে শুরু হবে।",
  startOverKeepConfirm: "নতুন নিমন্ত্রণ শুরু করুন",
  cancel: "এই নিমন্ত্রণটিই রাখুন",
  cleared: "নতুন নিমন্ত্রণ শুরু হয়েছে",
};

export const suiteCopy: Translation<typeof en.suiteCopy> = {
  heading: "আপনার উপলক্ষের ডিজাইন",
  moreDesigns: (count) => `আরও ${count}টি ডিজাইন দেখান`,
  textBox: "লেখার পিছনে বাক্স",
  textBoxHint:
    "বন্ধ থাকলে লেখা সরাসরি ছবির উপর থাকে। চালু করলে লেখা কার্ডের রঙের একটি হালকা বাক্সে থাকে। তুলনা করতে পাতাগুলি চালান; একই সুইচ পাতাতেও আছে।",
  blessingPage: "আশীর্বাদের পাতা দিয়ে শুরু করুন",
  blessingPageHint: "এই থিম শুরু হয় দেবতার ছবি আর তার নিচে আপনার আশীর্বাদ দিয়ে, আপনার নামের আগে।",
  names: designNames.names,
  descriptions: designNames.descriptions,
};

export const studioCopy: Translation<typeof en.studioCopy> = {
  pagesHint: "আপনি যে পাতা লিখছেন, লিখতে লিখতেই তা এখানে দেখা যায়।",
  pageNames: {
    gate: "দরজা",
    blessing: "আশীর্বাদ",
    cover: "প্রচ্ছদ",
    couple: "ছবি",
    family: "পরিবার",
    "family-more": "পরিবার, আরও",
    "family-end": "পরিবার, শেষে",
    invite: "নিমন্ত্রণ",
    reply: "উত্তর",
  },
  pageList: "নিমন্ত্রণপত্রের পাতা",
  showPage: (name) => `${name} পাতা দেখান`,
  phone: (name) => `${name} পাতা, অতিথিরা যেমন দেখবেন`,
  lettering: "অক্ষর",
  letteringIntro:
    "প্রতিটি পাতায় লেখা কেমন দেখাবে, বেছে নিন। শুধু সেই ফন্টগুলিই দেখানো হয় যা আপনার কার্ডের ভাষা লিখতে পারে।",
  namesFont: "নাম",
  wordsFont: "বাকি লেখা",
  themeFont: "থিমের নিজস্ব",
  size: "আকার",
  sizes: { small: "ছোট", medium: "মাঝারি", large: "বড়" },
  style: "নামের শৈলী",
  bold: "মোটা",
  italic: "বাঁকা",
  capitals: "বড় হাতের অক্ষর",
  colour: "নামের রং",
  colours: {
    theme: "থিমের নিজস্ব",
    maroon: "মেরুন",
    gold: "সোনালি",
    saffron: "গেরুয়া",
    ink: "কালি",
    ivory: "আইভরি",
  },
  feels: {
    classic: "ক্লাসিক",
    script: "প্রবহমান",
    bold: "গাঢ়",
    clean: "সাদামাটা",
    handwritten: "হাতে লেখা",
  },
  reset: "থিমের অক্ষরে ফিরে যান",
};

export const familyCopy: Translation<typeof en.familyCopy> = {
  sideHeading: (name) => `${name}-এর পরিবার`,
  sideFallback: { first: "প্রথম পরিবার", second: "দ্বিতীয় পরিবার" },
  relation: "কার্ডে যেভাবে ছাপা হবে",
  relations: { child: "সন্তান", daughter: "কন্যা", son: "পুত্র" },
  parents: "বাবা-মায়ের নাম",
  parentsExample: "শ্রীমতী সুনীতা ও শ্রী রমেশ প্যাটেল",
  parentsHint: "যেমন ছাপাতে চান তেমন লিখুন, শ্রী, শ্রীমতী বা স্বর্গীয় সহ।",
  town: "শহর বা গ্রাম",
  townExample: "আমেদাবাদ",
  more: "আশীর্বাদ আর নিমন্ত্রণকর্তা",
  examples: {
    blessingsFrom: "শ্রীমতী কমলা দেবী ও শ্রী রামপ্রসাদ শর্মা",
    requesters: "শর্মা পরিবারের সকলে",
    welcome: "রাহুল, প্রিয়া আর অঙ্কিত",
    children: "আমার কাকুর বিয়েতে আসবে কিন্তু!",
  },
  memory: "পুণ্য স্মৃতিতে",
  memoryExample: "স্বর্গীয় শ্রী মোহনলাল প্যাটেল",
  memoryHint: "প্রয়াত আত্মীয়, যাঁদের আশীর্বাদ পরিবার স্মরণ করে।",
  contacts: "অতিথিরা কাকে ফোন করবেন",
  contactName: "নাম",
  contactNameExample: "রমেশ প্যাটেল",
  phone: "ফোন",
  addContact: "নম্বর যোগ করুন",
  removeContact: (n) => `নম্বর ${n} সরান`,
};

export const pageWordsCopy: Translation<typeof en.pageWordsCopy> = {
  open: "এই পাতা বদলান",
  title: (page) => `${page} পাতা`,
  description: "যেকোনো লাইন বদলান, নিজের লাইন যোগ করুন, আর বেছে নিন লেখা ছবির কোথায় থাকবে।",
  close: "হয়ে গেছে",
  words: "লেখা",
  line: (n) => `লাইন ${n}`,
  kind: (n) => `লাইন ${n}-এর ধরন`,
  kinds: {
    label: "ছোট শিরোনাম",
    script: "আশীর্বচন",
    display: "বড়",
    date: "তারিখ",
    venue: "স্থান",
    body: "সাধারণ লেখা",
    small: "ছোট অক্ষর",
  },
  up: (n) => `লাইন ${n} উপরে নিন`,
  down: (n) => `লাইন ${n} নিচে নিন`,
  remove: (n) => `লাইন ${n} সরান`,
  add: "লাইন যোগ করুন",
  reset: "প্রস্তাবিত লেখায় ফিরে যান",
  own: "এই পাতা আপনি নিজে লিখেছেন। পরে বদলানো নাম, তারিখ বা স্থান এখানে তখনই দেখা যাবে, যখন আপনি প্রস্তাবিত লেখায় ফিরে যাবেন।",
  inLanguage: (language) => `এই লেখা ${language} কার্ডের জন্য।`,
  overflow: "এই ছবির জন্য লেখা খুব বেশি, সবচেয়ে ছোট আকারেও। কোনো লাইন ছোট করুন বা সরিয়ে দিন।",
  placement: "অবস্থান",
  place: "উচ্চতা",
  places: { top: "উপরে", middle: "মাঝখানে", bottom: "নিচে" },
  align: "সারিবদ্ধতা",
  aligns: { center: "মাঝখানে", start: "বাঁদিকে" },
  box: "লেখার পিছনে বাক্স",
  boxes: { theme: "অন্য পাতাগুলির মতো", on: "বাক্স", off: "ছবির উপর ছাপা" },
  hide: "এই পাতা বাদ দিন",
  hideHint: "অতিথিরা দেখবেন না। যেকোনো সময় আবার চালু করুন।",
  hidden: "বাদ দেওয়া",
};

export const aiCopy: Translation<typeof en.aiCopy> = {
  open: "AI দিয়ে লেখান",
  title: "AI দিয়ে লেখা তৈরি করুন",
  description:
    "AI আপনার নাম, পরিবার আর অনুষ্ঠান থেকে কার্ডের ভাষায় পাতাগুলি লেখে। পরে যা খুশি বদলান।",
  close: "বন্ধ করুন",
  tone: "সুর",
  tones: { traditional: "ঐতিহ্যবাহী", warm: "আন্তরিক", fun: "মজাদার" },
  scope: "পাতা",
  scopes: { all: "সব পাতা", page: (page) => `শুধু ${page} পাতা` },
  write: "লিখুন",
  again: "আবার লিখুন",
  shorten: "AI দিয়ে ছোট করুন",
  busy: "লেখা হচ্ছে…",
  done: "লেখা হয়ে গেছে। লেখা বদলাতে যেকোনো পাতা খুলুন।",
  left: (n) => `এই নিমন্ত্রণে আর ${n}টি ফ্রি ড্রাফট বাকি।`,
  languages: (language) =>
    `${language} কার্ডের জন্য লেখা হয়েছে। অন্য ভাষার জন্য উপরে কার্ডের ভাষা বদলান।`,
  errors: {
    "sign-in": "সাইন ইন করুন যাতে নিমন্ত্রণটি সেভ হয়, তারপর AI তার জন্য লিখতে পারবে।",
    off: "AI দিয়ে লেখা এখনও চালু হয়নি।",
    "not-found": "সাইন ইন করুন যাতে নিমন্ত্রণটি সেভ হয়, তারপর AI তার জন্য লিখতে পারবে।",
    "used-up": "এই নিমন্ত্রণের 3টি ফ্রি ড্রাফট শেষ। যেকোনো প্যাকেজে যতবার খুশি লেখাতে পারবেন।",
    failed: "এখন লেখা তৈরি করা গেল না। আবার চেষ্টা করুন।",
  },
};

export const openingCopy: Translation<typeof en.openingCopy> = {
  heading: "খোলার দরজা (কভার স্ক্রিন)",
  intro:
    "লিংক খুললেই অতিথিরা প্রথমে এটাই দেখবেন: একটি তোরণ, দরজা, পর্দা বা কভার, যা পুরো স্ক্রিনে খুলে আপনার নিমন্ত্রণ দেখায়। খুলতে দেখতে যেকোনো একটিতে ট্যাপ করুন। পাঠানোর পরেও আপনি যেকোনো সময় এটি বদলাতে পারেন।",
  filterLabel: "ধরন অনুযায়ী দেখুন",
  filterAll: "সব",
  summaryBody: "নিমন্ত্রণ খোলার আগে অতিথিরা প্রথমে এটাই দেখেন।",
  change: "দরজা বদলান",
  dialogTitle: "আপনার খোলার দরজা বেছে নিন",
  dialogBody:
    "আপনার পছন্দ সঙ্গে সঙ্গে সেভ হয়। অতিথিদের প্রিভিউ, ভিডিও আর আপনার লাইভ লিংক, সবই এটি দিয়ে খুলবে।",
  done: "হয়ে গেছে",
  styles: {
    "jaali-vriksh": {
      name: "জীবনবৃক্ষের জালি",
      description: "খোদাই করা বেলেপাথরের জালি পেরিয়ে উড়ে প্রাসাদের বাগানে।",
    },
    pachchikari: {
      name: "পাথরের ফুল",
      description: "বসানো পাথরের ফুল উঠে আসে, মার্বেল নিচে সরে যায়।",
    },
    "chik-baradari": {
      name: "বাঁশের চিক",
      description: "বোনা বাঁশের চিক গুটিয়ে ওঠে, দেখা দেয় চাঁদের আলোয় মণ্ডপ।",
    },
    "baori-deep": {
      name: "প্রদীপের বাওলি",
      description: "প্রদীপে আলোকিত বাওলিতে নিচে নামুন।",
    },
    "ikat-dhaaga": {
      name: "ইকতের সুতো",
      description: "ইকত রেশম সুতো সুতো করে খুলে যায়।",
    },
    "olai-chuvadi": {
      name: "তালপাতার পুঁথি",
      description: "তালপাতার পাতা দুই দিকে সরে যায়।",
    },
    "konark-chakra": {
      name: "কোনারকের চাকা",
      description: "খোদাই করা পাথরের চাকা বালির উপর দিয়ে গড়িয়ে যায়।",
    },
    "mandvi-dhow": {
      name: "নেমে আসা পাল",
      description: "তালি দেওয়া পাল ভাঁজে ভাঁজে নেমে আসে জাহাজঘাটে।",
    },
    shekhawati: {
      name: "সোনালি আঁচড়",
      description: "সোনালি পাত আঁচড়ে উঠে গিয়ে দেখা দেয় আঁকা হাভেলি।",
    },
    lehar: {
      name: "বালিতে ঢেউ",
      description: "ঢেউ বালি ধুয়ে নিয়ে যায়, দেখা দেয় লেগুন।",
    },
    "naksha-pangong": {
      name: "ভাঁজ হওয়া মানচিত্র",
      description: "পুরোনো মানচিত্র ভাঁজ হয়ে পাহাড়ি হ্রদে নামে।",
    },
    "toran-mala": {
      name: "খসে পড়া তোরণ",
      description: "আমপাতার তোরণের সারি একে একে খসে পড়ে।",
    },
    jhilmil: {
      name: "মিরর বল",
      description: "মিরর বলের আলোয় একটু একটু করে হলঘর আলোকিত হয়।",
    },
    "howrah-tareekh": {
      name: "ক্যালেন্ডারের পাতা",
      description: "ক্যালেন্ডারের পাতা উল্টে সেই দিনে পৌঁছয়।",
    },
    "barf-khidki": {
      name: "কুয়াশা ঢাকা জানলা",
      description: "কাচ থেকে কুয়াশা মুছে গলে যায়।",
    },
    "pondy-gali": {
      name: "স্লাইডিং পাজল",
      description: "পাজলের টুকরো সরে দেখা দেয় বাগানবিলাসে ছাওয়া গলি।",
    },
    "irani-carrom": {
      name: "ক্যারম বোর্ড",
      description: "ক্যারম বোর্ড হেলে গিয়ে সরে যায়।",
    },
    channapatna: {
      name: "খেলনা ব্লক",
      description: "কাঠের খেলনা ব্লকের দেয়াল ভেঙে পড়ে।",
    },
    "ped-ghar": {
      name: "রং ভরা",
      description: "পেন্সিলের ছবিতে রং ভরে ওঠে।",
    },
    "jhalar-palna": {
      name: "দোলনার চাঁদোয়া",
      description: "লেসের চাঁদোয়া পুঁটুলির মতো উপরে গুটিয়ে যায়।",
    },
    "rajwada-pol": {
      name: "রাজস্থানি প্রাসাদের দরজা",
      description:
        "গোলাপি বেলেপাথরের খিলানে খোদাই করা সেগুন কাঠের দরজা খুলে যায় প্রদীপে সাজানো আঙিনায়।",
    },
    "gopuram-kadhavu": {
      name: "দক্ষিণ ভারতীয় মন্দিরের দরজা",
      description: "পিতল বসানো, ঘণ্টা ঝোলানো দরজা খুলে যায় প্রদীপে আলোকিত মণ্ডপমে।",
    },
    "noor-darwaza": {
      name: "মুঘল মার্বেলের দরজা",
      description: "মার্বেলের খিলানে রুপোর জালির দরজা খুলে যায় চাঁদের আলোয় ফোয়ারার বাগানে।",
    },
    "phoolon-ki-deewar": {
      name: "ফুলের দেয়াল",
      description: "গোলাপ আর গাঁদার দেয়াল সরে গিয়ে দেখা দেয় ঝিকিমিকি আলোয় সাজানো মণ্ডপ।",
    },
    "haveli-kiwad": {
      name: "হাভেলির দরজা",
      description: "আয়নার কাজ করা রঙিন গুজরাটি দরজা খুলে যায় দোলনা ঝোলানো আঙিনায়।",
    },
    "shahi-parda": {
      name: "রাজকীয় পর্দা",
      description: "মেরুন আর সোনালি মখমলের পর্দা সরে গিয়ে দেখা দেয় ঝাড়বাতির আলোয় হলঘর।",
    },
    "deco-gates": {
      name: "আর্ট ডেকো গেট",
      description: "কালো আর পিতলের গেট খুলে যায় শহরের উপর ছাদের পার্টিতে।",
    },
    "bagiya-gate": {
      name: "গোলাপ বাগানের গেট",
      description: "গোলাপে জড়ানো সাদা লোহার গেট খুলে যায় লণ্ঠনে আলোকিত বাগানে।",
    },
    "mela-tamboo": {
      name: "মেলার তাঁবু",
      description: "ডোরাকাটা তাঁবুর পর্দা উঠে দেখা দেয় বেলুন, নাগরদোলা আর বড় কেক।",
    },
    "chaand-dwar": {
      name: "চাঁদের আলোয় বাগানের দরজা",
      description: "চাঁদ-তারার নকশায় ঝিনুক বসানো দরজা খুলে যায় চাঁদের আলোয় পুকুর-বাগানে।",
    },
    "ritu-dwar": {
      name: "আঙিনার দরজা",
      description:
        "প্রতিটি ঋতুর একটি পাতা খোদাই করা পুরোনো টেরাকোটা-সবুজ দরজা খুলে যায় ফুলে ভরা গাছের দিকে।",
    },
    "raag-dwar": {
      name: "সংগীতকক্ষের দরজা",
      description: "লাজবর্দ আর সোনায় রাঙানো দরজা খুলে যায় ভোরে বীণা রাখা প্রাসাদের ছাদে।",
    },
    "van-dwar": {
      name: "বনের দরজা",
      description: "ডাল আর পাতায় বোনা দরজা খুলে যায় শ্যাওলা ঢাকা পথে, গল্পের বনের দিকে।",
    },
    "patang-dwar": {
      name: "ছাদের দরজা",
      description: "ঘুড়ি আঁকা উজ্জ্বল ফিরোজা দরজা খুলে যায় ভোরের ছাদে।",
    },
    "kumhar-dwar": {
      name: "কুমোরপাড়ার দরজা",
      description: "টেরাকোটা টালি বসানো নীল দরজা খুলে যায় শত শত প্রদীপে আলোকিত গলিতে।",
    },
    "karghaa-dwar": {
      name: "তাঁতিবাড়ির দরজা",
      description: "লাল রেশম আর সোনালি জরিতে জড়ানো দরজা খুলে যায় তাঁতিদের আঙিনায়।",
    },
    "navrang-dwar": {
      name: "নয় রঙের দরজা",
      description: "রঙিন কাচের নয়টি পট্টি বসানো সাদা দরজা খুলে যায় গোলাপি মণ্ডপে।",
    },
    "ghat-dwar": {
      name: "নদীঘাটের দরজা",
      description: "ঢেউ আর মাছ খোদাই করা গাঢ় ফিরোজা দরজা খুলে যায় ভোরের হিমবাহ-ঝরনায়।",
    },
    "rekha-dwar": {
      name: "এক রেখার দরজা",
      description: "একটি সোনালি রেখায় আঁকা আইভরি কাগজের দরজা খুলে যায় পদ্মের উপর সূর্যোদয়ে।",
    },
    "naqsha-pat": {
      name: "কারুকাজ করা মহলের দরজা",
      description:
        "সোনালি রেখার প্রাসাদ খোদাই করা হাতির দাঁত রঙের দরজা খুলে যায় সন্ধ্যার হ্রদ-প্রাসাদে।",
    },
    "kinkhab-parda": {
      name: "কিংখাবের পর্দা",
      description:
        "সোনালি বুননের ওয়াইন রঙা পর্দা সরে যায়, দেখা যায় মোমবাতির আলোয় প্রাসাদের দরবার।",
    },
    "taad-patta-dwar": {
      name: "তালপাতার আড়াল",
      description: "বোনা তালপাতার আড়াল সরে যায়, সূর্যাস্তে পদ্ম-লেগুনের ওপর এক ভিলা।",
    },
    "pichwai-pat": {
      name: "পিছওয়াইয়ের পর্দা",
      description: "পদ্ম আর গাভী আঁকা পিছওয়াইয়ের পর্দা সরে যায়, জ্যোৎস্নায় পদ্মপুকুর।",
    },
    "chandi-kiwad": {
      name: "রুপোর দরজা",
      description: "নকশা তোলা রুপোর দরজা খুলে যায় হ্রদের ধারে আলো-ঝলমল প্রাসাদে।",
    },
    "swarg-kiwad": {
      name: "মেঘের দরজা",
      description: "মেঘ খোদাই করা সাদা মার্বেলের দরজা খুলে যায় সোনালি মেঘে ভাসমান এক মণ্ডপে।",
    },
    "firoza-darwaza": {
      name: "ফিরোজা দরওয়াজা",
      description: "ফিরোজা তারা বসানো আখরোট কাঠের দরজা খুলে যায় লম্বা জলাধারের বাগানে।",
    },
    "jharokha-pat": {
      name: "রঙিন কাচের ঝরোখা",
      description: "রঙিন কাচ বসানো গোলাপি কপাট খুলে যায় সূর্যাস্তে জানালা-ভরা প্রাসাদে।",
    },
    "hina-kiwad": {
      name: "মেহেন্দি আঁকা দরজা",
      description: "মেহেন্দি আঁকা ক্রিম রঙের দরজা খুলে যায় গাঁদায় ভরা খুবানি রঙের উঠোনে।",
    },
    "mor-pankh": {
      name: "ময়ূরপালকের আড়াল",
      description: "ময়ূরপালকের আড়াল সরে যায়, দেখা যায় মার্বেলের ছত্রীসহ পদ্মের সরোবর।",
    },
    "jugnu-parda": {
      name: "জোনাকির পর্দা",
      description: "জোনাকিতে আলোকিত নীল পর্দা সরে যায়, জ্যোৎস্নায় কুমুদের হ্রদ।",
    },
    "sheesh-kiwad": {
      name: "আয়নার কারুকাজের দরজা",
      description: "আয়নার কারুকাজের দরজা খুলে যায় ঝাড়বাতির নিচে দরবার কক্ষে।",
    },
    "sunehri-phatak": {
      name: "সোনার পাতের দরজা",
      description: "সোনার পাতের দরজা খুলে যায়, স্থির হ্রদের ওপারে সোনালি গম্বুজের মণ্ডপ।",
    },
    "pattu-thirai": {
      name: "রেশম শাড়ির পর্দা",
      description: "কাঞ্জিভরম রেশমের পর্দা সরে যায়, পিতলের প্রদীপে আলোকিত মন্দিরের পুকুর।",
    },
    "kagaz-kiwad": {
      name: "এমবস করা কাগজের দরজা",
      description: "সোনালি সিলমোহরের এমবস করা কাগজের দরজা খুলে যায় নরম গোলাপি আভায়।",
    },
    "peetal-kiwad": {
      name: "পিতলের দরজা",
      description: "ডোকরা ব্রোঞ্জে ঢালা দরজা খুলে যায় ব্রোঞ্জের জীবনবৃক্ষ ঘেরা প্রদীপের উঠোনে।",
    },
    "kaanch-pat": {
      name: "কাচচিত্রের আড়াল",
      description: "টিয়া আর ময়ূর আঁকা কাচের আড়াল সরে যায়, রত্নরঙা প্রাসাদ-বাগানে।",
    },
    "thinnai-kadhavu": {
      name: "খোদাই করা সেগুনের দরজা",
      description:
        "পিতলের পেরেক বসানো খোদাই করা বর্মি সেগুনের দরজা খুলে যায় প্রাসাদের রোদেলা উঠোনে।",
    },
    "meena-pat": {
      name: "মীনার সোনালি আড়াল",
      description: "টিয়া আর ফুলগাছের মীনা করা সোনালি আড়াল সরে যায় জয়পুরের প্রাসাদ-বাগানে।",
    },
    "rogan-parda": {
      name: "রোগানের পর্দা",
      description: "রোগানে আঁকা মেরুন পর্দা সরে যায়, সোনালি বিকেলে কচ্ছি উঠোন।",
    },
    "makhmal-parda": {
      name: "মখমলের পর্দা",
      description: "গোলাপ সূচিকর্মের কালো মখমলের পর্দা সরে যায়, মোমের আলোয় ফুলে ভরা ঘর।",
    },
    "sama-dwar": {
      name: "প্যাস্টেল রঙের দরজা",
      description: "প্যাস্টেল প্যানেলের পুদিনা রঙা দরজা খুলে যায় লম্বা জলাধারসহ প্রতিসম উঠোনে।",
    },
    "dilli-phatak": {
      name: "হাভেলির ফটক",
      description:
        "লোহার কাঁটা বসানো পুরনো ফিরোজা হাভেলির দরজা খুলে যায় আলো আর গাঁদায় সাজানো উঠোনে।",
    },
    "nakkashi-pat": {
      name: "রুপোর নকশার আড়াল",
      description: "ময়ূর আর টিয়া তোলা রুপোর আড়াল সরে যায় জ্যোৎস্নায় মার্বেলের বাগানে।",
    },
    "gagan-parda": {
      name: "বেলুন-রেশমের পর্দা",
      description: "আঁকা বেলুন-রেশম সরে যায়, হ্রদ-প্রাসাদের ওপর বেলুনে ভরা ভোরের আকাশ।",
    },
    "bel-khidki": {
      name: "বাগানবিলাসের জানলা",
      description: "বাগানবিলাসে ঢাকা নীল জানলার পাল্লা খুলে দেখা দেয় সূর্যাস্তের খিলান।",
    },
    "pankhudi-pat": {
      name: "শাপলার পাপড়ি",
      description: "শাপলার দুটি বড় পাপড়ি দুই দিকে খুলে দেখা দেয় শাপলার পুকুর।",
    },
    "gulaab-lifafa": {
      name: "সিলমোহর করা খাম",
      description: "মোমের গোলাপ-সিলমোহর দেওয়া জলরঙের খাম খুলে দেখা দেয় সোনালি গোলাপের খিলান।",
    },
    "os-parda": {
      name: "শিশিরের পর্দা",
      description: "ছোট ছোট ফুল সেলাই করা সাদা পাতলা পর্দা সরে গিয়ে দেখা দেয় সাদা ফুলের বাগান।",
    },
    "surkh-dwar": {
      name: "গোলাপ বাগানের দরজা",
      description: "লাল গোলাপে ঢাকা বাগানের পুরোনো দরজা খুলে দেখা দেয় গোলাপের পথ।",
    },
    "itr-dibbi": {
      name: "আতরের কৌটো",
      description: "আতরের কৌটোর রেশমে মোড়া দরজা খুলে যায়, আর গোলাপি কুয়াশা বেরিয়ে আসে।",
    },
    "gulaab-bhaap": {
      name: "গোলাপের ভাপ",
      description: "গোলাপের গন্ধ মাখা ভাপের দুটি মেঘ সরে গিয়ে দেখা দেয় কনৌজের গোলাপখেত।",
    },
    "oud-darwaza": {
      name: "পিতল বসানো দরজা",
      description:
        "পিতলের পেরেক বসানো ভারী খোদাই করা দরজা খুলে যায়, পাক খেয়ে বেরোয় ধূপের ধোঁয়া।",
    },
    "tarkashi-jaali": {
      name: "রুপোর তারকাজের জালি",
      description: "রুপোর তারকাজের দুটি জালি সরে গিয়ে দেখা দেয় গোলাপপাশ সমেত মার্বেলের বাগান।",
    },
    "aaina-pat": {
      name: "আয়নার পাল্লা",
      description:
        "ভাঁজ করা আয়নার খোদাই করা পাল্লা খুলে দেখা দেয় হালকা বেগুনি আলোয় সাজের টেবিল।",
    },
    "megh-parda": {
      name: "বর্ষার মেঘ",
      description: "বর্ষার মেঘ দুই দিকে সরে গিয়ে দেখা দেয় পাহাড়ের নিচে পদ্মের হ্রদ।",
    },
    "pehar-jaali": {
      name: "মার্বেলের জালি",
      description: "খোদাই করা মার্বেলের জালি সরে গিয়ে দেখা দেয় পদ্মপুকুরের উপর মণ্ডপ।",
    },
    "lata-phatak": {
      name: "বাগানের ফটক",
      description: "লতায় ঢাকা বাগানের ফটক খুলে যায় ভোরের বাগানে।",
    },
    "kitaab-jild": {
      name: "গল্পের বইয়ের মলাট",
      description: "ফিতে বাঁধা গল্পের বইয়ের মলাট খুলে উঠে আসে কাগজের পপ-আপ প্রাসাদ।",
    },
    "itr-almari": {
      name: "আতরের আলমারি",
      description: "আতরের আলমারির কাচের দরজা খুলে যায়, আর গোলাপি কুয়াশা বেরিয়ে আসে।",
    },
    "kosh-jild": {
      name: "পাখির অ্যালবাম",
      description: "গালার অ্যালবামের মলাট খুলে দেখা দেয় পদ্মপুকুরের ধারে সারস।",
    },
    "gudiya-pat": {
      name: "পুতুলঘরের পাল্লা",
      description: "খেলনা হাভেলির রং করা সামনের পাল্লা খুলে দেখা দেয় আলো জ্বলা ঘর।",
    },
    "yantra-pat": {
      name: "যন্ত্রের থালা",
      description: "পিতলের যন্ত্র-থালা খুলে দেখা দেয় সূর্যাস্তে মানমন্দির।",
    },
    "rang-parda": {
      name: "রঙিন কাপড়",
      description: "দুটি লম্বা বাঁধনি ওড়না সরে গিয়ে দেখা দেয় রংরেজের আঙিনা।",
    },
    "genda-ladi": {
      name: "গাঁদার পর্দা",
      description: "গাঁদার মালার পর্দা সরে গিয়ে দেখা দেয় ফুলের বাজার।",
    },
    "kaleen-parda": {
      name: "গালিচার পর্দা",
      description: "বোনা গালিচা সরে গিয়ে খুলে যায় ভোরের নীল গম্বুজের শহরে।",
    },
    "truck-darwaza": {
      name: "ট্রাকের দরজা",
      description: "ময়ূর আর পদ্ম আঁকা ট্রাকের দরজা খুলে যায় সূর্যাস্তের রাস্তায়।",
    },
    "kaanch-dhakkan": {
      name: "মখমলের ঢাকনা",
      description: "মখমলের কাপড় সরে গিয়ে দেখা দেয় কাচের নিচে ছোট্ট এক পৃথিবী।",
    },
    "pati-pat": {
      name: "ক্লাসঘরের দরজা",
      description: "চকের ফুল আঁকা কাঠের ক্লাসঘরের দরজা খুলে যায় গ্রামের পথে।",
    },
    "jad-jhalar": {
      name: "লতার পর্দা",
      description: "ঝুলন্ত শিকড় আর লতার পর্দা সরে গিয়ে খুলে যায় নদীর সাঁকোর দিকে।",
    },
    "gol-darwaza": {
      name: "কুঁড়েঘরের দরজা",
      description: "গোলাপি মাটির গোল দরজা খুলে যায় কুঁড়েঘরের বাগানে।",
    },
    "jhaadi-deewar": {
      name: "ঝোপের ফটক",
      description: "ছাঁটা ঝোপের দুটি দেয়াল সরে গিয়ে খুলে দেয় গোলাপি খিলানের পথ।",
    },
    "deco-dibba": {
      name: "লিফটের দরজা",
      description: "আর্ট ডেকো লিফটের দরজা সরে গিয়ে দেখা দেয় সেতুর উপর দিয়ে ছুটে চলা রেল।",
    },
    "samundar-parda": {
      name: "সামুদ্রিক ঘাসের পর্দা",
      description: "জলের নিচে সামুদ্রিক ঘাস সরে গিয়ে দেখা দেয় প্রবালের খিলান আর সাদা বালি।",
    },
    "shatranj-sandook": {
      name: "দাবার বোর্ডের দরজা",
      description: "পাথর বসানো দাবার বোর্ডের দরজা খুলে যায় দাবার আসর বসা প্রাসাদের ছাদে।",
    },
    pankhi: {
      name: "আঁকা পাখা",
      description:
        "পদ্ম আর টিয়া আঁকা রেশমের হাতপাখা বন্ধ হয়ে দেখা দেয় লণ্ঠনে আলোকিত প্রাসাদের ছাদ।",
    },
    "sheesh-mahal": {
      name: "শিশমহল",
      description: "ছোট ছোট আয়নার দেয়াল খড়খড়ির মতো ঘুরে দেখা দেয় প্রদীপে আলোকিত শিশমহল।",
    },
    "popup-mahal": {
      name: "পপ-আপ প্রাসাদ",
      description:
        "কাগজ কেটে বানানো হ্রদের প্রাসাদ পপ-আপ বইয়ের মতো দাঁড়িয়ে ওঠে, তারপর আপনি ভিতরে যান।",
    },
    odhni: {
      name: "কনের ওড়না",
      description:
        "লাল বাঁধনি ওড়না হাওয়ায় ঢেউ খেলে, তারপর উড়ে গিয়ে দেখা দেয় চাঁদের আলোয় আঙিনা।",
    },
    "kavad-peti": {
      name: "গল্পের বাক্স",
      description: "মেওয়াড়ের রং করা কাওয়াড় দুবার খুলে দেখা দেয় সোনালি বিকেলের বাগান-মণ্ডপ।",
    },
    "chhatri-utsav": {
      name: "রাজছত্র",
      description: "সূচিকর্মের ছাতা মাথার উপর ঘোরে, তারপর পাক খেয়ে আকাশে উঠে যায়।",
    },
    "jal-darpan": {
      name: "স্থির হ্রদ",
      description: "ভাসমান প্রদীপ থেকে ঢেউ ছড়ায় আর হ্রদ খুলে যায় প্রদীপে আলোকিত ঘাটে।",
    },
    "pushp-varsha": {
      name: "পুষ্পবৃষ্টি",
      description: "গোলাপের পাপড়ির দেয়াল ঘূর্ণিতে ছড়িয়ে গিয়ে দেখা দেয় মালাবদলের মঞ্চ।",
    },
    "moti-seep": {
      name: "মুক্তোর ঝিনুক",
      description: "বড় ঝিনুক উজ্জ্বল মুক্তোর উপর থেকে ঢাকনা তোলে, দেখা দেয় সমুদ্রতীরের মণ্ডপ।",
    },
    "badal-raag": {
      name: "বর্ষার মেঘ",
      description: "মেঘ কেটে রোদ ওঠে আর প্রাসাদের উপর নিজে থেকেই আঁকা হয় রামধনু।",
    },
    "jugnu-van": {
      name: "জোনাকির বন",
      description:
        "জোনাকিরা আপনার নামের চারপাশে জড়ো হয়, তারপর বন সরে গিয়ে দেখা দেয় আলো জ্বলা বটগাছ।",
    },
    "uday-surya": {
      name: "সূর্যোদয়",
      description: "পাহাড়ের উপর সূর্য ওঠে আর পাহাড় সরে গিয়ে দেখা দেয় আপনার নতুন বাড়ি।",
    },
    taaramandal: {
      name: "নক্ষত্রমণ্ডল",
      description:
        "তারারা সোনালি রেখায় আপনার নাম ঘিরে জোড়া লাগে, তারপর তাদের পেরিয়ে আপনি উড়ে যান মানমন্দিরে।",
    },
    "thar-ki-ret": {
      name: "থরের বালি",
      description: "হাওয়া বালিয়াড়ি উড়িয়ে নিয়ে যায়, দেখা দেয় লণ্ঠনে সাজানো দুর্গের শিবির।",
    },
    "sheher-ki-raat": {
      name: "শহরের আলো",
      description: "শহরের জানলাগুলি একে একে জেগে ওঠে, তারপর গোটা শহর আলোয় ভরে যায়।",
    },
    "choodi-chakra": {
      name: "চুড়ির বলয়",
      description: "কাচের চুড়ির বলয় আপনার নামের চারপাশে ঘোরে, তারপর ঢেউয়ের মতো ছড়িয়ে পড়ে।",
    },
    "sanjhi-roshni": {
      name: "সাঁঝির আলো",
      description: "কাগজ কাটা সাঁঝির ভিতর দিয়ে প্রদীপ জ্বলে, তারপর পাতার মতো উল্টে যায়।",
    },
    "chhaya-parda": {
      name: "ছায়ার পর্দা",
      description: "প্রদীপে আলোকিত পর্দায় পুতুলের ছায়া দোলে, তারপর পর্দা গুটিয়ে মঞ্চ দেখা দেয়।",
    },
    "athangudi-tiles": {
      name: "চেট্টিনাড টালি",
      description: "চকচকে আথাঙ্গুড়ি টালি ঢেউয়ের মতো উল্টে দেখা দেয় চেট্টিনাড আঙিনা।",
    },
    "gulaal-bindu": {
      name: "আবিরের ফোঁটা",
      description: "আবিরের ফোঁটা কাগজে ছড়িয়ে হয়ে ওঠে হোলির রঙিন আঙিনা।",
    },
    bioscope: {
      name: "বায়োস্কোপ",
      description:
        "পুরোনো বায়োস্কোপের লেন্সে ক্যালাইডোস্কোপ ঘোরে, তারপর লেন্স আপনাকে ঘিরে খুলে যায়।",
    },
    "kaanch-ka-gola": {
      name: "স্নো গ্লোব",
      description: "কাচের গোলকে তুষার পড়ে; সেটি নড়ে ওঠে আর আপনি পৌঁছে যান শীতের গ্রামে।",
    },
    phirki: {
      name: "কাগজের ফিরকি",
      description: "ভাঁজ করা কাগজ একটি একটি কোণ খুলে দেখায় গ্রামের মেলা।",
    },
    bulbule: {
      name: "সাবানের বুদবুদ",
      description: "বড় একটি বুদবুদ আপনার নামের চারপাশে দোলে, তারপর ফেটে দেখা দেয় বাগানের পার্টি।",
    },
    "chhuk-chhuk": {
      name: "খেলনা রেল",
      description: "ছোট্ট বাষ্পের রেল ঝিকঝিক করে চলে যায়, ধোঁয়া কেটে দেখা দেয় পার্টির স্টেশন।",
    },
    chadar: {
      name: "জলের চাদর",
      description:
        "প্রদীপের কুলুঙ্গি ভরা মার্বেলের দেওয়ালে জলের চাদর নামে, তারপর থেমে ওপর থেকে মিলিয়ে যায়।",
    },
    parwaaz: {
      name: "সূচিকর্মের পাখি",
      description: "রেশমে সেলাই করা পাখিরা উড়ে যায়, আর রেশম তাদের পিছু পিছু ভেসে ওঠে।",
    },
    bhanwar: {
      name: "মার্বেল ঘূর্ণি",
      description: "দাক্ষিণাত্যের মার্বেল কাগজ ঘূর্ণির মতো পাক খেয়ে মাঝখানে মিলিয়ে যায়।",
    },
    "jaali-patta": {
      name: "জালি পাতা",
      description: "জালির মতো বড় পাতার শিরায় আলো ছুটে যায়, তারপর সেটি ঘুরে ঝরে পড়ে।",
    },
    "lapet-khule": {
      name: "কুইলিংয়ের ফুল",
      description: "কাগজের পাকানো ফুল ঘোরে, আংটিগুলো খুলে যায় আর পাকগুলো লাফিয়ে দূরে যায়।",
    },
    taar: {
      name: "বীণার তার",
      description:
        "বীণার মতো তার বাঁধা চন্দন কাঠের খোদাই করা প্যানেল: তারগুলো ছোঁয়া পেয়ে যেন ঝিকমিক করে, তারপর প্যানেল ফালি ফালি খুলে যায়।",
    },
    pratibimb: {
      name: "দিঘির প্রতিবিম্ব",
      description:
        "নিমন্ত্রণ খোলে পদ্মদিঘির জলের ছায়ায়; একটা ঢেউ ছড়ায়, আর দৃশ্যটা জল থেকে ওপরে উঠে আসে।",
    },
    mohur: {
      name: "রুপোর মুদ্রা",
      description:
        "সূচিকর্ম করা বড় একটা রুপোর মুদ্রা কিনারায় ঘোরে, উল্টে যায়, আর আপনি তার ভেতর দিয়ে পেরিয়ে যান।",
    },
    gathbandhan: {
      name: "গাঁটছড়া",
      description: "দুটো লহরিয়া ওড়না উড়ে আসে, মাঝখানে গিঁট বাঁধে আর একসঙ্গে ওপরে উঠে যায়।",
    },
    phuljhadi: {
      name: "ফুলঝুরির বৃত্ত",
      description:
        "একটা ফুলঝুরি নামের চারপাশে সোনালি আলোর বৃত্ত আঁকে, আর কালো গালা চোখের মণির মতো খুলে যায়।",
    },
    semal: {
      name: "শিমুল তুলো",
      description: "শিমুলের ফল ফেটে সাদা তুলো বেরিয়ে হাওয়ায় পাক খেতে খেতে উড়ে যায়।",
    },
    thappa: {
      name: "ব্লক ছাপা",
      description:
        "খোদাই করা কাঠের ব্লক সুতির চাদরে ছাপ দেয়; প্রতিটা ছাপ একটা জানালা খোলে, তারপর চাদর উঠে যায়।",
    },
    gumbad: {
      name: "আঁকা গম্বুজ",
      description:
        "আপনি আঁকা গম্বুজের দিকে তাকান; তার আকাশ-ফোকর চোখের মণির মতো বড় হয় আর পাপড়ি ঝরে পড়ে।",
    },
    ghadi: {
      name: "পকেট ঘড়ি",
      description:
        "একটা পুরোনো পকেট ঘড়ি: কাঁটা ঘুরে ঘণ্টায় আসে, মৃদু টুং শব্দ, আর আপনি তার মুখের ভেতরে ঢুকে যান।",
    },
    hindolo: {
      name: "আঁকা দোলনা",
      description: "সংখেড়ার আঁকা দোলনা দোলে, তারপর আপনার দিকে উঁচুতে উঠে চোখের আড়ালে চলে যায়।",
    },
    "reshmi-gaanth": {
      name: "সাটিনের ফাঁস",
      description:
        "পোর্সেলিনের দরজা হালকা গোলাপি সাটিনের ফাঁসে বাঁধা; ফাঁস খুলে যায়, ফিতে খসে পড়ে আর দরজা খোলে।",
    },
    "moti-kaanta": {
      name: "মুক্তোর ব্রোচ",
      description:
        "রেশমি পাল্লা মুক্তো-স্ফটিকের ব্রোচে আটকানো; ব্রোচ খুলে ওপরে ভেসে যায় আর পাল্লা ঘাঘরার মতো সরে যায়।",
    },
    guldasta: {
      name: "সুতলির তোড়া",
      description:
        "খোদাই করা তামার পাত ফুলের তোড়ায় বাঁধা; সুতলি পিছলে যায়, তোড়া পড়ে যায় আর পাত সরে যায়।",
    },
    "neeli-titli": {
      name: "নীল প্রজাপতি",
      description:
        "কুয়াশা-নীল দরজা মিনে করা প্রজাপতিতে আটকানো; সে ডানা মেলে উড়ে যায় আর দরজা খোলে।",
    },
    "itr-shishi": {
      name: "আতরের শিশি",
      description:
        "গোলাপি দরজা রেশমি দড়ি আর আতরের শিশিতে বাঁধা; দড়ি পিছলে যায়, শিশি পাপড়ির ঝাপটায় পড়ে যায়।",
    },
    "van-mala": {
      name: "বনফুলের মালা",
      description: "দেওদারের খোদাই দরজায় পাহাড়ি ফুলের মালা; গিঁট আলগা হয় আর মালা খসে পড়ে।",
    },
    gulband: {
      name: "রেশমি রোজেট",
      description:
        "পুরু রঙের দুটি ক্যানভাস প্রবাল রঙের ফিতে আর রোজেটে বাঁধা; রোজেট ঘুরে দূরে যায় আর ক্যানভাস সরে যায়।",
    },
    mudra: {
      name: "গালার সিল",
      description:
        "এমবস করা কাগজের পাল্লা গাঢ় লাল গালার সিলে আটকানো; সিল দু-টুকরো হয়, প্রতিটি টুকরো নিজের পাল্লার সঙ্গে যায়।",
    },
    "shankha-pola": {
      name: "শাঁখা পলা",
      description:
        "সবুজ কলকাতার খড়খড়ি শাঁখা আর লাল পলায় জোড়া; শাঁখা-পলা খুলে গড়িয়ে যায় আর খড়খড়ি খোলে।",
    },
    challa: {
      name: "রুমালের আংটি",
      description:
        "ছাপা রেশমি রুমাল সোনালি আংটিতে গিঁট দেওয়া; আংটি পিছলে দূরে যায় আর রেশমি পাল্লা সরে যায়।",
    },
    latkan: {
      name: "জরির ঝালর",
      description:
        "মিহি চান্দেরি পর্দা ঝালর দেওয়া জরির দড়িতে বাঁধা; দড়ি আলগা হয়, ঝালর পড়ে যায় আর পর্দা সরে যায়।",
    },
    "shakkar-chakri": {
      name: "চিনির পদক",
      description:
        "ফন্ড্যান্টের দরজা চিনির পদকে আটকানো; পদক চিনির মুক্তোয় ছড়িয়ে পড়ে আর দরজা খোলে।",
    },
    "raghu-maina": {
      name: "টিয়ার আংটা",
      description:
        "পৈঠানির পাল্লা দুটি টিয়ার সোনালি আংটায় জোড়া; টিয়া খুলে দু-দিকে দোলে আর রেশম সরে খোলে।",
    },
    "taala-chaabi": {
      name: "রুপোর তালা",
      description:
        "আখরোট কাঠের দরজা গোলাপ-আকারের রুপোর তালায় বন্ধ; তালা খুলে নিচে পড়ে আর দরজা খোলে।",
    },
    "phool-gend": {
      name: "পাপড়ির বল",
      description:
        "জুঁই আর গোলাপে বোনা দরজা গোলাপ পাপড়ির বলে বাঁধা; বল পাপড়িতে ফেটে পড়ে আর দরজা খোলে।",
    },
    "panna-pat": {
      name: "থেওয়া লকেট",
      description:
        "চুনির সুতোয় থেওয়া লকেট পান্না-কাচের দরজা ধরে রাখে; সেটি খুলে পড়ে যায় আর দরজা খোলে।",
    },
    "sikki-dwar": {
      name: "ঘাসের মাছ",
      description: "ঘাসের দড়িতে বোনা সিক্কি মাছ দরজা ধরে রাখে; সে সাঁতরে চলে যায় আর দরজা খোলে।",
    },
    "hase-bagilu": {
      name: "আঁকা পাখি",
      description: "দুটি আঁকা পাখি লাল মাটির দরজার খিল; তারা সরে গিয়ে উড়ে যায় আর দরজা খোলে।",
    },
    "kankreet-dwar": {
      name: "পিতলের পদক",
      description:
        "ফিতেয় পিতলের পদক কংক্রিটের দরজা ধরে রাখে; সেটি সিকি পাক ঘোরে আর দরজা সরে যায়।",
    },
    "chhaap-kiwad": {
      name: "সেফটিপিন",
      description: "ছাপা বিশাল সেফটিপিন দরজা ধরে রাখে; সেটি খুলে পড়ে যায় আর দরজা খোলে।",
    },
    "purana-darwaza": {
      name: "দোকানের ঘণ্টা",
      description:
        "লাল সুতোয় পিতলের ঘণ্টা পুরনো দরজা ধরে রাখে; সেটি বাজে, পড়ে যায় আর দরজা খোলে।",
    },
    "bindi-kiwad": {
      name: "বিন্দুর পাখি",
      description:
        "বিন্দুতে গড়া দুটি পাখি দরজায় মালা ধরে আছে; তারা মালা নিয়ে উড়ে যায় আর দরজা খোলে।",
    },
    "masala-almari": {
      name: "লঙ্কার মালা",
      description:
        "লঙ্কা আর দারচিনির মালা মশলার আলমারি বেঁধে রাখে; সেটি আলগা হয় আর পাল্লা আপনার দিকে খোলে।",
    },
    "kaagaz-pat": {
      name: "ডোরাকাটা ওড়না",
      description:
        "লিলি দেওয়া ডোরাকাটা মণিপুরি ওড়না কাগজের দরজা বাঁধে; সেটি ভেসে যায় আর দরজা সরে যায়।",
    },
    "rupa-kiwad": {
      name: "রুপোর বল",
      description: "শিকলে রুপোর জালি বল দরজা ধরে রাখে; সেটি ফুলের মতো ফোটে আর দরজা খোলে।",
    },
    "ola-vathil": {
      name: "পাতার গিঁট",
      description: "জবা দেওয়া তালপাতার গিঁট দরজা বাঁধে; সেটি খুলে যায় আর দরজা খোলে।",
    },
    "seep-kiwad": {
      name: "মুক্তোর ফুল",
      description: "মুক্তোর ফুলে বাঁধা মালা শিশুকাঠের দরজা ধরে রাখে; সেগুলি সরে যায় আর দরজা খোলে।",
    },
    "aakar-pat": {
      name: "লাল বৃত্ত",
      description:
        "কালো রেখায় লাল বৃত্ত দরজা ধরে রাখে; সেটি রেখা ধরে গড়িয়ে যায় আর দরজা সরে যায়।",
    },
    "shwet-dwar": {
      name: "মখমল আর লিলি",
      description: "লিলি ধরা মখমলের ফিতে দরজা বাঁধে; লিলি পড়ে যায়, ফিতে সরে যায় আর দরজা খোলে।",
    },
    "moti-dwar": {
      name: "কাচের বুদবুদ",
      description: "মুক্তোয় ঘেরা কাচের বুদবুদ দরজা ধরে রাখে; সেটি ঝিলিক দিয়ে ফাটে আর দরজা খোলে।",
    },
    "yashab-kiwad": {
      name: "জেডের বালা",
      description:
        "সোনার শিকলে খোদাই করা জেডের বালা জেডের দরজা ধরে রাখে; সেটি পিছলে খুলে পড়ে যায় আর দরজা খোলে।",
    },
    "usta-kiwad": {
      name: "সোনার সূর্য",
      description:
        "নীল ফিতেয় বাঁধা উঁচু সোনার কাজের সূর্য দরজা ধরে রাখে; ফিতে খুলে যায় আর দরজা খোলে।",
    },
    "pixel-kiwad": {
      name: "পিক্সেল রত্ন",
      description:
        "পিক্সেলের শিকলে পিক্সেলের রত্ন দরজা ধরে রাখে; সেটি পিক্সেলে ফেটে ছড়িয়ে পড়ে আর দরজা খোলে।",
    },
    "saaya-kiwad": {
      name: "তারে বসা পাখি",
      description:
        "দরজার আড়াআড়ি তারে বসে আছে দুটি ছায়া-পাখি; তারা উড়ে যায় আর দরজা সূর্যাস্তের দিকে খুলে যায়।",
    },
    "jad-dwar": {
      name: "বাঁশের খিল",
      description:
        "অর্কিড দেওয়া বাঁশের খিল জীবন্ত শিকড়ের দরজা ধরে রাখে; সেটি সরে খুলে যায় আর দরজা দু-দিকে সরে যায়।",
    },
    "natak-dwar": {
      name: "মখমলের দড়ি",
      description:
        "পিতলের হুকে থিয়েটারের মখমলের দড়ি মঞ্চের দরজা ধরে রাখে; সেটি খসে পড়ে আর দরজা খোলে।",
    },
    "kashi-kiwad": {
      name: "টালির শিকল",
      description:
        "গ্লেজ করা টালি ঝোলানো পিতলের শিকল দরজা ধরে রাখে; সেটি বেজে ওঠে, খসে পড়ে আর দরজা খোলে।",
    },
    "paandaan-pat": {
      name: "ময়ূর জাঁতি",
      description:
        "ময়ূরের আকারের রুপোর সুপুরি-জাঁতি রুপোর দরজা ধরে রাখে; সেটি ঘুরে আলগা হয় আর দরজা বাইরের দিকে খোলে।",
    },
    "marmar-dwar": {
      name: "পিতলের বলয়",
      description:
        "পরস্পর জড়ানো দুটি পিতলের বলয় মার্বেলের দরজা ধরে রাখে; সেগুলি গড়িয়ে যায় আর দরজা সরে যায়।",
    },
    "goa-dwar": {
      name: "আঁকা টালি",
      description:
        "দড়িতে বাঁধা গোয়ার আঁকা টালি নীল দরজা ধরে রাখে; সেটি ঘুরে আলগা হয় আর দরজা খোলে।",
    },
    "haveli-pat": {
      name: "পরান্দার বিনুনি",
      description:
        "পমপম দেওয়া রেশমি পরান্দার বিনুনি আঁকা দরজা বেঁধে রাখে; সেটি খুলে যায় আর দরজা খোলে।",
    },
    "bah-dwar": {
      name: "গামোসার গিঁট",
      description: "গিঁট দিয়ে বাঁধা গামোসা বাঁশের দরজা ধরে রাখে; গিঁট খুলে যায় আর দরজা খোলে।",
    },
    "akeek-pat": {
      name: "কোয়ার্টজ স্ফটিক",
      description:
        "সোনায় মোড়া কোয়ার্টজ স্ফটিক আকিকের দরজা ধরে রাখে; সেটি ফেটে যায় আর দরজা সরে যায়।",
    },
    "sagar-dwar": {
      name: "নাবিকের গিঁট",
      description:
        "ঝিনুক বাঁধা নাবিকের গিঁট সমুদ্রে ভেসে আসা কাঠের দরজা ধরে রাখে; গিঁট খুলে যায় আর দরজা বাইরে সমুদ্রের দিকে খোলে।",
    },
    "khet-phatak": {
      name: "সুতোয় বাঁধা ঘুড়ি",
      description:
        "সুতোয় আটকে থাকা একটি ঘুড়ি খেতে যাওয়ার ফটক ধরে রাখে; সেটি উড়ে যায় আর পাল্লা বাইরের দিকে খোলে।",
    },
    "sona-parat": {
      name: "সোনায় মোড়া কাচ",
      description:
        "পান্না, চুনি আর নীলার ঝলমলে কাচের তিনটি সোনালি খিলান; একে একে আপনি পেরিয়ে যান।",
    },
    mauni: {
      name: "গোল ঝুড়ি",
      description:
        "সোনালি ঘাসের তিনটি গোল কিনারা, যেন ঝুড়িতে উঁকি; সেগুলি ঘোরে আর আপনি ভেতরে নামেন।",
    },
    chowka: {
      name: "ঘুরন্ত চৌকো",
      description: "লাল মাটিতে চালের লেইয়ের তিনটি চৌকো; পেরোনোর সময় প্রতিটি সিকি পাক ঘোরে।",
    },
    khidkiyaan: {
      name: "কংক্রিটের জানালা",
      description: "কংক্রিটের দেয়াল, রঙিন সানশেডের জালি আর গোল জানালা; আপনি তিনটিই পেরিয়ে যান।",
    },
    "phool-chhaap": {
      name: "ছাপা ফুল",
      description:
        "গোলাপি আর নীল কালিতে ছাপা ফুল, ঢেউখেলানো বৃত্ত আর গোল; কালি সরে যায়, তারপর আপনি ঢুকে পড়েন।",
    },
    "gali-gali": {
      name: "আঁকা গলি",
      description: "পুরনো গলিতে আঁকা তিনটি খিলান; আপনি গলি ধরে একে একে পেরিয়ে যান।",
    },
    tipki: {
      name: "বিন্দুর গাছ",
      description: "বিন্দুর গাছ, পাখি আর ফুলের বলয় ঝিকমিক করে, তারপর আপনি উড়ে পেরিয়ে যান।",
    },
    "masala-dabba": {
      name: "মশলার কৌটো",
      description: "গোটা মশলার বলয় আর পিতলের মশলার কৌটোর কিনারা; আপনি কৌটোয় নেমে যান।",
    },
    phumdi: {
      name: "ভাসমান দ্বীপ",
      description:
        "কাগজের পাহাড়, ঘাসের ভাসমান বলয় আর লিলির বলয়; আপনি হ্রদের ওপর দিয়ে পেরিয়ে যান।",
    },
    "rupa-jaali": {
      name: "রুপোর লকেট",
      description: "রুপোর তারকশির তিনটি ডিম্বাকার, লকেটের ভেতর লকেট; প্রতিটি হেলে ঝিকমিক করে।",
    },
    thoranam: {
      name: "পাতার তোরণ",
      description: "তালপাতার খিলান, পাতার ফুল আর মাছের বলয় দোলে, তারপর সরে যায়।",
    },
    "seep-mehrab": {
      name: "ঝিনুকের খিলান",
      description: "ঝিনুক বসানো গাঢ় কাঠের তিনটি মোগল খিলান, প্রাসাদের দালানের মতো।",
    },
    "teen-aakar": {
      name: "তিন আকার",
      description:
        "তিনটি ক্যানভাসে কাটা চৌকো, বৃত্ত আর ত্রিভুজ ধীরে ঘোরে, তারপর আপনি প্রতিটি পেরিয়ে যান।",
    },
    galiyara: {
      name: "অলিন্দ",
      description: "সাদা-কালো অলিন্দে সোনালি রেখার তিনটি পাথরের খিলান; আপনি সেগুলি পেরিয়ে হাঁটেন।",
    },
    chamak: {
      name: "রামধনু ঝিলিক",
      description: "মুক্তোর মতো খিলান, রামধনু কাচ আর মুক্তোর বলয়; পেরোনোর সময় রামধনু ঝিলিক দেয়।",
    },
    "yashab-kamal": {
      name: "জেডের পদ্ম",
      description:
        "সোনা আর চুনির কেন্দ্র ঘিরে বিশাল এক জেডের পদ্ম পুরো স্ক্রিন ঢেকে রাখে; কেন্দ্রটি উঠে যায় আর পাপড়ি বলয়ে বলয়ে মেলে যায়।",
    },
    manoti: {
      name: "সোনালি গম্বুজ",
      description:
        "গোল গোল পাপড়ির উঁচু সোনার কাজের ফুল, যেন বিকানেরের গম্বুজের ভেতরটা; মাঝের সোনার গুটি উঠে যায় আর পাপড়িগুলি মেলে যায়।",
    },
    "chaukor-phool": {
      name: "পিক্সেল ফুল",
      description:
        "বিশাল এক পিক্সেল ফুল পুরো স্ক্রিন ভরে থাকে; তার কেন্দ্র মিটমিট করে মিলিয়ে যায় আর পাপড়ি চৌকো চৌকো ধাপে খোলে, যেন গেমের নতুন লেভেল শুরু হচ্ছে।",
    },
    "naariyal-chhaya": {
      name: "নারকেল পাতার ছাউনি",
      description:
        "নিচ থেকে কালো নারকেল পাতার ফাঁকে সূর্যাস্তের আকাশের দিকে তাকানো; পাতা দোলে, গাছের মাথা সরে যায় আর পাতাগুলি ফাঁক হয়ে যায়।",
    },
    kundal: {
      name: "ফার্নের ছাউনি",
      description:
        "বিশাল ফার্ন গাছের পাতা বনের ছাউনির মতো স্ক্রিন ঢেকে রাখে; গুটোনো ফার্নের ডগা খুলে যায় আর পাতাগুলি মেলে যায়।",
    },
    "makhmali-chakra": {
      name: "মখমলের পাখা",
      description:
        "সোনালি ঝালর দেওয়া, কুঁচি করা টকটকে লাল মখমল আর গাঢ় ফিরোজা রেশম সূর্যরশ্মির মতো ছড়ানো; মাঝের পদক উঠে যায় আর কুঁচিগুলি পিছনে ভাঁজ হয়ে যায়।",
    },
    "kashi-phool": {
      name: "টালির ফুল",
      description:
        "কোবাল্ট নীল আর ফিরোজা রঙের গ্লেজ করা টালির পাপড়িতে গড়া বিশাল এক ফুল; মাঝের টালি ঘুরে সরে যায় আর পাপড়ি বাইরের দিকে হেলে পড়ে।",
    },
    beeda: {
      name: "পানপাতা",
      description:
        "রুপোর তবকে মোড়া একটি পান ঘিরে চকচকে পানপাতার বলয়; পানটি উঠে যায় আর পাতাগুলি বাইরের দিকে ভাঁজ হয়ে খোলে।",
    },
    "farshi-phool": {
      name: "মার্বেলের নকশা",
      description:
        "মার্বেলের মেঝেতে সাদা আর হালকা গোলাপি পাপড়ির গোল নকশা, কিনারায় পিতল; মাঝের পিতলের গুটি উঠে যায় আর পাপড়িগুলি সরে যায়।",
    },
    "seep-khidki": {
      name: "ঝিনুকের জানালা",
      description:
        "নীল ফ্রেমে আলো-জ্বলা ঝিনুকের শার্সির একটি গোল জানালা; মাঝের চাকতি ঘোরে আর শার্সিগুলি খড়খড়ির মতো খুলে যায়।",
    },
    phundne: {
      name: "ঝালরের ছটা",
      description:
        "বড় একটি পমপম ঘিরে রেশমি পরান্দার ঝালরের ছটা; পমপম লাফিয়ে দূরে চলে যায় আর ঝালরগুলি বাইরের দিকে দুলে ওঠে।",
    },
    "japi-chakra": {
      name: "জাপির চাকা",
      description:
        "রত্নখচিত কেন্দ্র ঘিরে বিশাল এক জাপির বোনা খণ্ডগুলি; কেন্দ্র উঠে যায় আর খণ্ডগুলি ঘুরতে ঘুরতে পাখার মতো মেলে যায়।",
    },
    "akeek-phool": {
      name: "আকিকের ফুল",
      description:
        "ঝিকমিকে জিওড ঘিরে সোনালি কিনারার আকিকের ফালিতে গড়া ফুল; জিওড উঠে যায় আর ফালিগুলি বাইরের দিকে সরে যায়।",
    },
    "sagar-seep": {
      name: "আলো-জ্বলা ঝিনুক",
      description:
        "অন্ধকারে জ্বলজ্বলে বিশাল এক খাঁজকাটা ঝিনুক; তার বুকের মুক্তো উঠে যায় আর খাঁজগুলি ঢেউয়ের মতো বাইরের দিকে খোলে।",
    },
    "khet-chakra": {
      name: "খেতের চাকা",
      description:
        "উপর থেকে দেখা, একটি বাওলি ঘিরে গাঁদাখেত আর চা বাগানের ফালি; বাওলি নিচে নেমে যায় আর ফালিগুলি বাইরের দিকে সরে যায়।",
    },
    doors: {
      name: "থিমের দরজা",
      description: "আপনার থিমের নিজস্ব ছবি মাঝখান থেকে দুটি দরজার মতো খুলে যায়।",
    },
    palace: {
      name: "প্রাসাদের দরজা",
      description: "মালায় সাজানো খিলানের নিচে খোদাই করা দরজা উষ্ণ আলোয় খুলে যায়।",
    },
    temple: {
      name: "মন্দিরের দরজা",
      description: "সোনালি গোপুরমের নিচে ঘণ্টা আর প্রদীপে সাজানো পিতলের দরজা।",
    },
    curtain: {
      name: "রেশমি পর্দা",
      description: "ঝিকিমিকি আলো সমেত মখমলের পর্দা মঞ্চের মতো সরে যায়।",
    },
    envelope: {
      name: "রাজকীয় খাম",
      description: "ফুলের ছাপ দেওয়া মোমের সিলমোহর ভাঙে আর কার্ড বেরিয়ে আসে।",
    },
    lotus: {
      name: "ফুটন্ত পদ্ম",
      description: "আপনার নামের চারপাশে বড় একটি পদ্ম পাপড়ি পাপড়ি করে ফোটে।",
    },
    mandap: {
      name: "বিয়ের মণ্ডপ",
      description: "কলাপাতার স্তম্ভ আর বেলফুলের মালার মাঝে পাতলা পর্দা উপরে ওঠে।",
    },
    jharokha: {
      name: "ঝরোখা",
      description: "বেলেপাথরের ঝরোখার চারটি খোদাই করা জালির পাল্লা ভাঁজ হয়ে খুলে যায়।",
    },
    phool: {
      name: "ফুলের পর্দা",
      description: "গাঁদা, গোলাপ আর বেলফুলের মালা মাঝখান থেকে সরে যায়।",
    },
    scroll: {
      name: "রাজকীয় ফরমান",
      description: "ফিতে খুলে যায় আর ফরমান নিজে থেকেই গুটিয়ে যায়।",
    },
    diyas: {
      name: "প্রদীপের সারি",
      description: "প্রদীপ একে একে জ্বলে ওঠে, তারপর ছড়িয়ে পড়ে উষ্ণ আলো।",
    },
    rangoli: {
      name: "রঙ্গোলি",
      description: "রঙ্গোলি নিজে থেকেই রঙে আঁকা হয়, তারপর ঘুরে আলোয় খুলে যায়।",
    },
    peacock: {
      name: "ময়ূরপাখা",
      description: "আপনার নামের পিছনে ময়ূরের পালক মেলে ধরে, তারপর গুটিয়ে যায়।",
    },
    storybook: {
      name: "গল্পের বই",
      description: "সোনালি কাজ করা কাপড়ের মলাট খুলে প্রথম পাতায় পৌঁছয়।",
    },
    lanterns: {
      name: "আকাশপ্রদীপ",
      description: "রাতে উজ্জ্বল কাগজের লণ্ঠন ভাসে, তারপর উপরে উড়ে যায়।",
    },
    moonlit: {
      name: "চাঁদনি রাত",
      description: "খিলানের উপর বাঁকা চাঁদ, তারা আর দোলা লণ্ঠন।",
    },
    fireworks: {
      name: "আতশবাজি",
      description: "গম্বুজের সারির উপর আতশবাজি ফাটে।",
    },
    balloons: {
      name: "বেলুন",
      description: "বেলুনে ভরা আকাশ উপরে উড়ে যায়।",
    },
    gift: {
      name: "উপহারের বাক্স",
      description: "ফিতে খুলে যায় আর ঢাকনা উঠে যায়।",
    },
    none: {
      name: "সরাসরি ভিতরে",
      description: "কোনো দরজা নেই: অতিথিরা সরাসরি দৃশ্যে পৌঁছন।",
    },
  },
  groups: {
    own: "আপনার ডিজাইনের জন্য তৈরি",
    fresh: "নতুন শুরু",
    skies: "আকাশ আর প্রকৃতি",
    crafts: "শিল্প আর রং",
    play: "মজাদার",
    themed: "থিমের নিজস্ব শুরু",
    tied: "বাঁধা দরজা",
    depth: "স্তরে স্তরে দরজা",
    bloom: "ফুটে ওঠা দরজা",
    painted: "আঁকা দরজা",
    doors: "দরজা আর ফটক",
    reveals: "পর্দা আর উন্মোচন",
    light: "আলো আর ফুল",
    party: "পার্টি",
  },
  welcomeHeading: "তার পরের অভ্যর্থনা",
  welcomeIntro:
    "পাতাগুলোর আগে আপনাদের নাম নিয়ে একটি মুহূর্ত। স্বয়ংক্রিয় রাখলে অতিথি যতবার খুলবেন, নিমন্ত্রণের সঙ্গে মানানসই নতুন দৃশ্য দেখবেন।",
  welcomeAuto: "স্বয়ংক্রিয়",
  welcomeNames: {
    royal: "রাজপ্রাসাদের তোরণ",
    bloom: "পদ্ম",
    lamps: "প্রদীপ",
    night: "চাঁদ আর লণ্ঠন",
    party: "রঙিন কাগজের বৃষ্টি",
    letter: "চিঠি",
    mandala: "মণ্ডল",
    peacock: "ময়ূর",
    sunrise: "সূর্যোদয়",
    garden: "বাগান",
    rangoli: "আলপনা",
    ghat: "সন্ধ্যার ঘাট",
    fireflies: "জোনাকি",
    "sky-lanterns": "আকাশপ্রদীপ",
    kites: "ঘুড়ি",
    waves: "সমুদ্রে সূর্যাস্ত",
  },
  godHeading: "উপরে দেবতা বা শুভ চিহ্ন",
  godIntro:
    "উপরে মাঝখানে পুরোটা দেখা যায়, কোনো লেখার নিচে নয়। দেবতা ছাড়া খুলতে চাইলে এটি বন্ধ রাখুন।",
  noGod: "কোনোটি নয়",
  gods: {
    ganesha: "গণেশ",
    "ganesha-gold": "সোনালি গণেশ",
    "lakshmi-ganesha": "লক্ষ্মী-গণেশ",
    shrinathji: "শ্রীনাথজি",
    venkateswara: "বেঙ্কটেশ্বর",
    jagannath: "জগন্নাথ",
    om: "ওঁ",
    swastik: "স্বস্তিক",
    kalash: "মঙ্গল কলস",
    diya: "প্রদীপ",
    prajapati: "প্রজাপতি",
    suzhi: "পিল্লৈয়ার সুড়ি",
    shri: "শ্রী",
    shankh: "শঙ্খ",
    kamal: "পদ্ম",
    "ik-onkar": "ইক ওঙ্কার",
    khanda: "খান্ডা",
    "chand-tara": "চাঁদ-তারা",
    "786": "786",
    bismillah: "বিসমিল্লাহ",
    cross: "ক্রস",
    dove: "পায়রা",
    jain: "জৈন প্রতীক",
  },
};

export const quickCopy: Translation<typeof en.quickCopy> = {
  metaTitle: (name) => `আপনার নিমন্ত্রণপত্র বানান: ${name}`,
  back: "ফিরে যান",
  watch: "ডেমো দেখুন",
  preview: "প্রিভিউ",
  free: "চেষ্টা করা বিনামূল্যে। টাকা শুধু পাঠানোর সময়।",
  eyebrow: "নিজের মতো করে নিন",
  title: "কয়েক মিনিটেই আপনার নিমন্ত্রণপত্র",
  intro:
    "আপনাদের নাম লিখুন, সেগুলো ডিজাইনে দেখা যাবে। কথা, সুর আর উত্তরের প্রশ্ন নিজে থেকেই ভরে যায়।",
  whenHeading: "কবে আর কোথায়",
  addFunction: "আরেকটি অনুষ্ঠান যোগ করুন",
  addOne: (name) => `${name} যোগ করুন`,
  remove: (name) => `${name} সরান`,
  familyTitle: "পরিবারের নাম",
  familyIntro: "চাইলে: বাবা-মা, আশীর্বাদ আর অতিথিরা কাকে ফোন করবেন",
  photosTitle: "আপনার ছবি",
  photosIntro: "চাইলে: ডিজাইনে আপনার ছবির জন্য ফ্রেম আছে",
  see: "আমার নিমন্ত্রণপত্র দেখুন",
  nothingToPay: "এখন কিছু দিতে হবে না",
  more: "আরও বিকল্প",
  moreIntro: "নিজের গান, কথা, খোলার দরজা আর প্রশ্ন",
  make: "সময় কম? আমরা আপনার হয়ে বানিয়ে দেব",
  hideMake: "এটি লুকান",
  pickEvents: "আপনার অনুষ্ঠান",
  moreEvents: "আরও অনুষ্ঠান",
  moreDesigns: (occasion) => `আরও ${occasion} ডিজাইন`,
  moreDesignsNote:
    "আপনার নাম, তারিখ আর ছবি সঙ্গেই থাকে। কোনো ডিজাইনে ট্যাপ করে তাতে আপনার নিমন্ত্রণপত্র দেখুন।",
  opening: "ডিজাইন খুলছে…",
  /** Another design picked under a live invite: a new invitation, or the live one changed. */
  pickTitle: (design) => (design ? `${design} কীসের জন্য?` : "এই ডিজাইন কীসের জন্য?"),
  pickNew: "নতুন নিমন্ত্রণপত্র",
  pickNewBody:
    "আপনার নাম, তারিখ, জায়গা, পরিবার, ছবি আর লেখা সঙ্গেই আসে। আপনার লাইভ নিমন্ত্রণপত্রটি অতিথিদের কাছে যেমন আছে তেমনই থাকবে।",
  pickLive: "আপনার লাইভ নিমন্ত্রণপত্র",
  pickLiveBody:
    "একই লিংক, অতিথি আর উত্তর, এই ডিজাইনে। আপনার প্যাকেজে এটি না থাকলে, প্যাকেজ বেছে নেওয়া পর্যন্ত অতিথিরা আগের ডিজাইনই দেখবেন।",
  pickClose: "বন্ধ করুন",
};
