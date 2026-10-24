import type * as en from "../trust";
import type { Translation } from "@/i18n/text";

export const trustCopy: Translation<typeof en.trustCopy> = {
  sent: (count) => `শুভ দিয়ে ${count}টি নিমন্ত্রণপত্র পাঠানো হয়েছে`,
  rating: (average, count) => `${count}টি পরিবারের থেকে ৫-এর মধ্যে ${average}`,
  stars: (count) => `৫-এর মধ্যে ${count}টি তারা`,
  reviewsHeading: "পরিবারেরা কী বলছেন",
  reviewsIntro:
    "যাঁদের নিমন্ত্রণপত্র লাইভ হয়েছে সেই আয়োজকদের থেকে। দেখানোর আগে আমরা প্রতিটি রিভিউ পড়ি।",
};
