import type * as en from "../categories";
import type { Translation } from "@/i18n/text";

/*
 * বাংলা: উপলক্ষের দল, এক লাইনের পরিচয় আর RSVP প্রশ্ন। English: src/content/categories.ts.
 * Draft for a native proofreader.
 */

export const categoryGroups: Translation<typeof en.categoryGroups> = {
  "wedding-journey": "বিয়ের পর্ব",
  birthdays: "জন্মদিন",
  baby: "শিশু",
  "home-religious": "বাড়ি ও পুজোপার্বণ",
  festivals: "উৎসব",
  parties: "পার্টি ও খাওয়াদাওয়া",
  business: "ব্যবসা",
  education: "শিক্ষা ও অলাভজনক",
  global: "সারা বিশ্ব থেকে",
};

export const categoryTaglines: Translation<typeof en.categoryTaglines> = {
  wedding: "গায়ে হলুদ থেকে বৌভাত পর্যন্ত সব অনুষ্ঠান, একটি লিংকে",
  engagement: "আংটি, দুই পরিবার আর প্রথম বড় উদযাপন",
  "save-the-date": "আগেভাগে তারিখ জানান, পুরো নিমন্ত্রণ আসবে পরে",
  roka: "দুই পরিবারের সম্মতি, যুগলের জন্য আশীর্বাদ",
  haldi: "হলুদ, গাঁদা ফুল আর হাসিখুশি একটি সকাল",
  mehendi: "মেহেন্দি, ঢোলক আর নিশ্চিন্ত দুপুর",
  sangeet: "গান, নাচ আর পরিবারের পরিবেশনা",
  reception: "বিয়ের পরে প্রীতিভোজ আর উদযাপন",
  birthday: "কেক, বেলুন আর সব প্রিয়জন",
  anniversary: "একসঙ্গে কাটানো বছর, পরিবারের সঙ্গে উদযাপন",
  party: "তারাভরা রাতে গান, খাবার আর বন্ধুরা",
  "baby-shower": "হবু মায়ের জন্য আশীর্বাদ, গান আর মিষ্টি",
  diwali: "প্রদীপ, মিষ্টি আর সবাই মিলে লক্ষ্মীপূজা",
  housewarming: "নতুন বাড়িতে পুজো আর প্রথম খাওয়াদাওয়া",
  puja: "কথা, হোম বা জাগরণ, আরতি আর প্রসাদ সহ",
  "thread-ceremony": "পরিবারের আশীর্বাদে পৈতে ও উপনয়ন",
  annaprashan: "শিশুর প্রথম ভাত, আশীর্বাদ সহ",
  christening: "ছোট্টটির জন্য আশীর্বাদ আর মধ্যাহ্নভোজ",
  "prayer-meet": "প্রার্থনায় একটি জীবনের স্মরণ",
  retirement: "সার্থক এক কর্মজীবনের সম্মানে",
  "farewell-party": "একসঙ্গে শেষ একটি সন্ধ্যা",
  "shop-opening": "ফিতে কাটা, পুজো আর প্রথম অভ্যর্থনা",
  launch: "কোনো প্রোডাক্ট, বই বা অফিস",
  "ganesh-chaturthi": "বাপ্পার দর্শন, আরতি আর মোদক",
  navratri: "গরবার রাত আর দুর্গাপূজা",
  janmashtami: "গোপালের জন্য ভজন আর মাঝরাতের আরতি",
  onam: "পুক্কলম আর কলাপাতায় সাদ্যা",
  sankranti: "ঘুড়ি, তিল আর পোঙ্গল",
  lohri: "আগুনের কুণ্ড, রেওড়ি আর ভাংড়া",
  eid: "ইফতারের দাওয়াত আর ঈদ মিলন",
  "naming-ceremony": "শিশুর নামকরণ, পরিবারের আশীর্বাদ",
  holi: "রং, গান আর গুজিয়া",
  christmas: "ক্যারল, কেক আর ক্রিসমাস ট্রি",
  reunion: "পুরনো বন্ধু, একটি সন্ধ্যা",
  graduation: "নতুন স্নাতকের সম্মানে",
  "gudi-padwa": "গুড়ি, নিম আর পুরন পোলি",
  baisakhi: "ফসল, ভাংড়া আর গিদ্ধা",
  bihu: "বিহু গান, নাচ আর পিঠা",
  "raksha-bandhan": "রাখী, মিষ্টি আর পারিবারিক ভোজ",
  "karva-chauth": "উপোস, চাঁদ ওঠা আর একসঙ্গে রাতের খাবার",
};

export const questionLabels: Translation<typeof en.questionLabels> = {
  meal: "খাবারের পছন্দ",
  arrival: "পৌঁছনোর তারিখ",
  stay: "থাকার ঘর লাগবে",
  pickup: "স্টেশন বা বিমানবন্দর থেকে আনা",
  song: "গানের অনুরোধ",
  message: "নবদম্পতির জন্য বার্তা",
};

export const occasionsSection: Translation<typeof en.occasionsSection> = {
  eyebrow: "উপলক্ষ",
  title: "আপনি কী উদযাপন করছেন?",
  intro:
    "উপলক্ষ দিয়ে শুরু করুন, নিমন্ত্রণপত্র নিজেই সেজে উঠবে: ঠিকঠাক অনুষ্ঠান, লেখা আর ডিজাইন। জন্মদিন, শিশু আর উৎসবের নিমন্ত্রণ আসছে এর পরে।",
  listLabel: "উপলক্ষ",
  nearYou: "আপনার আশেপাশে জনপ্রিয়",
};
