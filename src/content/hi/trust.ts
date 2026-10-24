import type * as en from "../trust";
import type { Translation } from "@/i18n/text";

export const trustCopy: Translation<typeof en.trustCopy> = {
  sent: (count) => `शुभ से ${count} निमंत्रण भेजे गए`,
  rating: (average, count) => `${count} परिवारों से 5 में से ${average}`,
  stars: (count) => `5 में से ${count} सितारे`,
  reviewsHeading: "परिवार क्या कहते हैं",
  reviewsIntro: "उन मेज़बानों से जिनके निमंत्रण लाइव हुए। दिखाने से पहले हम हर समीक्षा पढ़ते हैं।",
};
