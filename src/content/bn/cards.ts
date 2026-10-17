import type * as en from "../cards";
import type { Translation } from "@/i18n/text";

/* বাংলা: সেভ দ্য ডেট ও ধন্যবাদ কার্ড। English: src/content/cards.ts. Draft for a native proofreader. */

export const cardsCopy: Translation<typeof en.cardsCopy> = {
  metaTitle: "সেভ দ্য ডেট ও ধন্যবাদ কার্ড",
  back: "নিমন্ত্রণে ফিরে যান",
  heading: "সেভ দ্য ডেট ও ধন্যবাদ কার্ড",
  intro:
    "আপনার নিমন্ত্রণের ডিজাইনে দুটি ছবি, WhatsApp-এ পাঠানোর জন্য: নিমন্ত্রণের আগে সেভ দ্য ডেট, আর অনুষ্ঠানের পরে ধন্যবাদ।",
  open: "সেভ দ্য ডেট ও ধন্যবাদ কার্ড",
  openShort: "কার্ড",
  openBody: "আপনার নিমন্ত্রণের ডিজাইনে ছবি, অনুষ্ঠানের আগে ও পরে পাঠানোর জন্য।",
  kinds: { "save-the-date": "সেভ দ্য ডেট", "thank-you": "ধন্যবাদ" },
  kindBody: {
    "save-the-date": "আগেভাগে পাঠান, যাতে পরিবার ও বন্ধুরা দিনটি ফাঁকা রাখেন।",
    "thank-you": "অনুষ্ঠানের পরে, যাঁরা এসেছেন বা আশীর্বাদ পাঠিয়েছেন সবাইকে পাঠান।",
  },
  noteLabel: { "save-the-date": "নিচের লাইন", "thank-you": "আপনার বার্তা" },
  noteHint: "কার্ডের ভাষায়। খালি রাখলে এই লাইনটি ছাপা হবে না।",
  noteCount: (used, max) => `${max}-এর মধ্যে ${used} অক্ষর`,
  reset: "প্রস্তাবিত শব্দ ব্যবহার করুন",
  picture: (kind, names) => `${names}-এর ${kind} কার্ড`,
  preparing: "আপনার কার্ড তৈরি হচ্ছে…",
  failed: "কার্ড তৈরি করা গেল না। আবার চেষ্টা করুন, অথবা Chrome বা Safari ব্যবহার করে দেখুন।",
  retry: "আবার চেষ্টা করুন",
  download: "ছবি ডাউনলোড করুন",
  share: "WhatsApp-এ পাঠান",
  fileName: (kind) => `${kind}.png`,
  preview: "নমুনা",
  previewNote:
    "এই নমুনায় “Made with Shubh” লেখা আছে। Grand প্যাকেজের সঙ্গে সেভ দ্য ডেট ও ধন্যবাদ কার্ড চিহ্ন ছাড়াই পাওয়া যায়।",
  upgrade: "Grand নিন",
};
