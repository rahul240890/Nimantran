import type * as en from "../trust";
import type { Translation } from "@/i18n/text";

export const trustCopy: Translation<typeof en.trustCopy> = {
  sent: (count) => `શુભ વડે ${count} આમંત્રણો મોકલાયાં`,
  rating: (average, count) => `${count} પરિવારો તરફથી 5 માંથી ${average}`,
  stars: (count) => `5 માંથી ${count} તારા`,
  reviewsHeading: "પરિવારો શું કહે છે",
  reviewsIntro:
    "જેમનાં આમંત્રણો લાઇવ થયાં એવા યજમાનો તરફથી. બતાવતાં પહેલાં અમે દરેક સમીક્ષા વાંચીએ છીએ.",
};
