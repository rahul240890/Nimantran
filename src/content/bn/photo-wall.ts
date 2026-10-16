import type * as en from "../photo-wall";
import type { Translation } from "@/i18n/text";

/*
 * বাংলা: সবার ছবির দেওয়াল। English: src/content/photo-wall.ts.
 * Draft for a native proofreader.
 */

const photos = (count: number) =>
  count === 1 ? "1টি ছবি" : `${count.toLocaleString("en-IN")}টি ছবি`;

export const wallCopy: Translation<typeof en.wallCopy> = {
  heading: "ছবির দেওয়াল",
  intro: "উৎসবের আপনার ছবি যোগ করুন। এই নিমন্ত্রণ যাঁদের কাছে আছে, সবাই দেখতে পাবেন।",
  soon: (date) => `ছবির দেওয়াল খুলবে ${date}। সেদিন এসে আপনার ছবি শেয়ার করুন।`,
  closed: "ছবির দেওয়াল বন্ধ হয়ে গেছে। ছবি শেয়ার করার জন্য ধন্যবাদ।",
  name: "আপনার নাম",
  nameHint: "আপনার ছবির নিচে দেখা যাবে।",
  optional: "ঐচ্ছিক",
  add: "ছবি যোগ করুন",
  adding: (done, of) => `${of}টির মধ্যে ${done} নম্বর ছবি যোগ হচ্ছে…`,
  added: (count) => `${photos(count)} যোগ হয়েছে। ধন্যবাদ!`,
  failed: "কিছু ছবি যোগ করা গেল না। ইন্টারনেট দেখে আবার চেষ্টা করুন।",
  unreadable: "এই ফোন ওর একটি ছবি পড়তে পারেনি। JPEG বা PNG দিয়ে চেষ্টা করুন।",
  full: "ছবির দেওয়াল ভরে গেছে।",
  share: "একটি ফোন থেকে যত ছবি যোগ করা যায়, আপনি সব যোগ করে ফেলেছেন।",
  tooMany: (max) => `একবারে সর্বাধিক ${max}টি ছবি বেছে নিন।`,
  empty: "এখনও কোনো ছবি নেই। প্রথম ছবিটি আপনিই শেয়ার করুন।",
  loading: "ছবি আসছে…",
  loadFailed: "ছবিগুলো আনা গেল না।",
  retry: "আবার চেষ্টা করুন",
  by: (name) => `${name} শেয়ার করেছেন`,
  byGuest: "একজন অতিথি শেয়ার করেছেন",
  photoAlt: (name, index) =>
    name ? `${name}-এর শেয়ার করা ছবি ${index}` : `একজন অতিথির শেয়ার করা ছবি ${index}`,
  view: (index) => `ছবি ${index} দেখুন`,
  remove: "সরান",
  removeLabel: (index) => `আপনার ছবি ${index} সরান`,
  removed: "আপনার ছবি সরানো হয়েছে।",
  removeFailed: "ছবিটি সরানো গেল না। আবার চেষ্টা করুন।",
  more: "আরও ছবি দেখান",
  count: photos,
  close: "বন্ধ করুন",
  previous: "আগের ছবি",
  next: "পরের ছবি",
  viewerTitle: (index, of) => `${of}টির মধ্যে ছবি ${index}`,
};

export const albumCopy: Translation<typeof en.albumCopy> = {
  metaTitle: "ছবির দেওয়াল",
  back: "অতিথি তালিকা",
  eyebrow: "ছবির দেওয়াল",
  intro:
    "প্রথম অনুষ্ঠান থেকেই অতিথিরা নিমন্ত্রণপত্রের লিংক দিয়ে ছবি যোগ করেন। কোনো ছবি দেওয়াল থেকে সরাতে লুকিয়ে দিন, বা সব ডাউনলোড করুন।",
  count: (total, hidden) =>
    hidden ? `${photos(total)} · ${hidden.toLocaleString("en-IN")}টি লুকানো` : photos(total),
  window: {
    open: (date) =>
      date ? `অতিথিরা ${date} পর্যন্ত ছবি যোগ করতে পারবেন।` : "অতিথিরা এখন ছবি যোগ করতে পারবেন।",
    soon: (date) => `অতিথিদের জন্য দেওয়াল খুলবে ${date}।`,
    closed: "দেওয়ালে আর নতুন ছবি যোগ করা যাবে না। আপনি এখনও সব ছবি দেখতে আর ডাউনলোড করতে পারবেন।",
    off: "ছবির দেওয়াল সেলিব্রেশন আর গ্র্যান্ড প্যাকেজের সঙ্গে পাওয়া যায়।",
    notLive: "আগে নিমন্ত্রণপত্র প্রকাশ করুন; অতিথিরা তার লিংক দিয়েই ছবি যোগ করেন।",
  },
  openWall: "দেওয়াল খুলুন",
  downloadAll: "সব ডাউনলোড করুন",
  downloadPart: (part, of) => `${of}টির মধ্যে ${part} নম্বর অংশ ডাউনলোড হচ্ছে…`,
  downloadFailed: "ছবিগুলো ডাউনলোড করা গেল না। আবার চেষ্টা করুন।",
  download: "ডাউনলোড",
  downloadLabel: (index) => `ছবি ${index} ডাউনলোড করুন`,
  hide: "লুকান",
  hideLabel: (index) => `ছবি ${index} অতিথিদের কাছ থেকে লুকান`,
  show: "দেখান",
  showLabel: (index) => `ছবি ${index} আবার অতিথিদের দেখান`,
  hiddenBadge: "লুকানো",
  hidden: "অতিথিদের কাছ থেকে লুকানো হয়েছে।",
  shown: "আবার দেওয়ালে ফিরেছে।",
  delete: "মুছুন",
  deleteLabel: (index) => `ছবি ${index} মুছুন`,
  deleteTitle: "এই ছবিটি মুছবেন?",
  deleteBody:
    "এটি দেওয়াল আর আপনার ডাউনলোড থেকে চিরতরে চলে যাবে। লুকিয়ে রাখলে আপনার কাছে থেকে যায়।",
  keep: "থাক",
  deleted: "ছবি মুছে ফেলা হয়েছে।",
  failed: "এটি সেভ করা গেল না। আবার চেষ্টা করুন।",
  emptyTitle: "এখনও কোনো ছবি নেই",
  emptyBody: "নিমন্ত্রণপত্র শেয়ার করুন; প্রথম অনুষ্ঠান থেকেই অতিথিরা তাঁদের ছবি যোগ করবেন।",
  card: {
    title: "ছবির দেওয়াল",
    body: (count) =>
      count
        ? `অতিথিদের পাঠানো ${photos(count)}।`
        : "অনুষ্ঠানের পরে অতিথিরা এখানে তাঁদের ছবি শেয়ার করেন।",
    action: "ছবি দেখুন",
  },
  close: "বন্ধ করুন",
  previous: "আগের ছবি",
  next: "পরের ছবি",
  viewerTitle: (index, of) => `${of}টির মধ্যে ছবি ${index}`,
  by: (name) => (name ? `${name} শেয়ার করেছেন` : "একজন অতিথি শেয়ার করেছেন"),
  photoAlt: (name, index) =>
    name ? `${name}-এর শেয়ার করা ছবি ${index}` : `একজন অতিথির শেয়ার করা ছবি ${index}`,
  fileName: "photo-wall",
};
