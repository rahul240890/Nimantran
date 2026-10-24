import type * as en from "../trust";
import type { Translation } from "@/i18n/text";

export const trustCopy: Translation<typeof en.trustCopy> = {
  sent: (count) => `शुभ वरून ${count} निमंत्रणे पाठवली`,
  rating: (average, count) => `${count} कुटुंबांकडून 5 पैकी ${average}`,
  stars: (count) => `5 पैकी ${count} तारे`,
  reviewsHeading: "कुटुंबे काय म्हणतात",
  reviewsIntro:
    "ज्यांची निमंत्रणे लाइव झाली त्या यजमानांकडून. दाखवण्यापूर्वी आम्ही प्रत्येक अभिप्राय वाचतो.",
};
