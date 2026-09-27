import type * as en from "../categories";
import type { Translation } from "@/i18n/text";

/* हिन्दी: अवसरों के समूह, एक पंक्ति का परिचय और RSVP सवाल। English: src/content/categories.ts. */

export const categoryGroups: Translation<typeof en.categoryGroups> = {
  "wedding-journey": "शादी का सफ़र",
  birthdays: "जन्मदिन",
  baby: "शिशु",
  "home-religious": "घर और धार्मिक",
  festivals: "त्योहार",
  parties: "पार्टी और दावत",
  business: "व्यापार",
  education: "शिक्षा और संस्थाएँ",
  global: "दुनिया भर से",
};

export const categoryTaglines: Translation<typeof en.categoryTaglines> = {
  wedding: "हल्दी से रिसेप्शन तक हर रस्म, एक लिंक में",
  engagement: "अँगूठियाँ, परिवार और पहला बड़ा जश्न",
  "save-the-date": "तारीख़ पहले बताइए, पूरा निमंत्रण बाद में",
  roka: "परिवारों की हाँ, जोड़े को आशीर्वाद",
  haldi: "हल्दी, गेंदे के फूल और हँसी भरी सुबह",
  mehendi: "मेहँदी, ढोलक और सुकून भरी दोपहर",
  sangeet: "गीत, नृत्य और परिवार की प्रस्तुतियाँ",
  reception: "फेरों के बाद भोज और जश्न",
  birthday: "केक, गुब्बारे और सारे अपने",
  anniversary: "साथ के बरस, परिवार के साथ जश्न",
  party: "तारों भरी रात में संगीत, खाना और दोस्त",
};

export const questionLabels: Translation<typeof en.questionLabels> = {
  meal: "खाने की पसंद",
  arrival: "पहुँचने की तारीख़",
  stay: "कमरा चाहिए",
  pickup: "स्टेशन या हवाई अड्डे से लेना",
  song: "गाने की फ़रमाइश",
  message: "जोड़े के लिए संदेश",
};

export const occasionsSection: Translation<typeof en.occasionsSection> = {
  eyebrow: "अवसर",
  title: "आप क्या मना रहे हैं?",
  intro:
    "अवसर से शुरू कीजिए, निमंत्रण ख़ुद तैयार हो जाएगा: सही रस्में, शब्द और डिज़ाइन। जन्मदिन, शिशु और त्योहारों के निमंत्रण आगे आ रहे हैं।",
  listLabel: "अवसर",
  nearYou: "आपके आसपास लोकप्रिय",
};
