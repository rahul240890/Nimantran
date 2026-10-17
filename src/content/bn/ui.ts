import type { uiStrings as en } from "@/lib/ui-strings";
import type { Translation } from "@/i18n/text";
import { site } from "@/lib/site";

/*
 * বাংলা: সবখানে থাকা বোতাম আর থিমের নাম। English: src/lib/ui-strings.ts.
 * Draft for a native proofreader.
 */

export const uiStrings: Translation<typeof en> = {
  close: "বন্ধ করুন",
  notifications: "বিজ্ঞপ্তি",
  theme: { group: "রঙের থিম", system: "ডিভাইসের মতো", light: "হালকা", dark: "গাঢ়" },
  social: {
    heading: `${site.localNames.bn}কে ফলো করুন`,
    instagram: `Instagram-এ ${site.localNames.bn}`,
    whatsapp: `${site.localNames.bn}-এর WhatsApp চ্যানেল`,
    youtube: `YouTube-এ ${site.localNames.bn}`,
  },
  invitation: {
    open: "নিমন্ত্রণপত্র খুলুন",
    close: "নিমন্ত্রণপত্র বন্ধ করুন",
    playMusic: "গান চালান",
    pauseMusic: "গান থামান",
    preparing: "3D তৈরি হচ্ছে",
    skip: "অ্যানিমেশন বাদ দিন",
    and: "ও",
    story: {
      story: "নিমন্ত্রণপত্র, পাতায় পাতায়",
      pause: "পাতা থামান",
      play: "আবার চালান",
      next: "পরের পাতা",
      previous: "আগের পাতা",
      skip: "সরাসরি কার্ডে যান",
      done: "কার্ড দেখুন",
      replay: "নিমন্ত্রণের পাতাগুলো চালান",
      directions: "পথ দেখুন",
      calendar: "ক্যালেন্ডারে যোগ করুন",
      textBox: "লেখার পেছনে বাক্স",
      more: "বিস্তারিত দেখুন",
      calendarShort: "ক্যালেন্ডার",
    },
    tour: {
      label: "আমন্ত্রণ নিজে থেকেই এগোচ্ছে",
      pause: "এখানে থামুন",
      play: "এগিয়ে চলুন",
      again: "আমন্ত্রণ আবার দেখুন",
    },
  },
  storyWords: {
    saveTheDate: "তারিখটি মনে রাখবেন",
    joinUs: "আপনি আসবেন তো?",
    welcome: "আপনার আগমন, আমাদের সৌভাগ্য",
    withLove: "করজোড়ে, সাদরে আপনার পথ চেয়ে রইলাম",
    and: "ও",
  },
  error: {
    title: "কিছু একটা গোলমাল হয়েছে",
    body: "আমরা এ বিষয়ে খবর পেয়েছি। আবার চেষ্টা করুন, আর বারবার এমন হলে কিছুক্ষণ পরে ফিরে আসুন।",
    retry: "আবার চেষ্টা করুন",
    home: "শুভ ইনভিটেশনে যান",
  },
  notFound: {
    title: "এই পাতাটি এখানে নেই",
    body: "লিংকটি হয়তো ভুল লেখা হয়েছে, বা পাতাটি অন্য জায়গায় সরে গেছে।",
    home: "শুভ ইনভিটেশনে যান",
    designs: "নিমন্ত্রণপত্রের ডিজাইন দেখুন",
  },
};
