import type * as en from "../trust";
import type { Translation } from "@/i18n/text";

export const trustCopy: Translation<typeof en.trustCopy> = {
  sent: (count) => `சுப் மூலம் ${count} அழைப்பிதழ்கள் அனுப்பப்பட்டன`,
  rating: (average, count) => `${count} குடும்பங்களிடமிருந்து 5-க்கு ${average}`,
  stars: (count) => `5-க்கு ${count} நட்சத்திரங்கள்`,
  reviewsHeading: "குடும்பங்கள் சொல்வது",
  reviewsIntro:
    "அழைப்பிதழ்கள் நேரலைக்கு வந்த விருந்தோம்பிகளிடமிருந்து. காட்டும் முன் ஒவ்வொரு மதிப்புரையையும் படிக்கிறோம்.",
};
