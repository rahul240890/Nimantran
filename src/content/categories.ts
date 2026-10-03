import type { CategoryId } from "@/lib/categories/catalog";
import type { CategoryGroup, RsvpQuestionId } from "@/lib/categories/schema";

/*
 * English copy for categories: group names, one line per category and the RSVP question
 * labels. Category names in every language live with the data (src/lib/categories).
 * Moves into next-intl in Step 12.
 */

export const categoryGroups: Record<CategoryGroup, string> = {
  "wedding-journey": "Wedding journey",
  birthdays: "Birthdays",
  baby: "Baby",
  "home-religious": "Home and religious",
  festivals: "Festivals",
  parties: "Parties and dining",
  business: "Business",
  education: "Education and nonprofit",
  global: "Around the world",
};

export const categoryTaglines: Record<CategoryId, string> = {
  wedding: "Every function from haldi to reception, in one link",
  engagement: "Rings, families and the first big celebration",
  "save-the-date": "Share the date early, the full invite follows",
  roka: "The families say yes; bless the couple",
  haldi: "Turmeric, marigolds and a morning of laughter",
  mehendi: "Henna, dholki and an easy afternoon",
  sangeet: "Songs, dance and family performances",
  reception: "Dinner and celebration after the vows",
  birthday: "Cake, balloons and everyone they love",
  anniversary: "Years together, celebrated with family",
  party: "Music, food and friends on a starry night",
  "baby-shower": "Blessings, songs and sweets for the mother-to-be",
  diwali: "Diyas, sweets and Lakshmi puja with everyone",
  housewarming: "Puja and a first meal in the new home",
  puja: "Katha, havan or jagran, with aarti and prasad",
  "thread-ceremony": "Janeu and upanayan with family blessings",
  annaprashan: "The baby's first rice, with blessings",
  christening: "A blessing and lunch for the little one",
  "prayer-meet": "Remembering a life with prayers",
  retirement: "Toasts to a career well lived",
  "farewell-party": "One last evening together",
  "shop-opening": "Ribbon, puja and a first welcome",
  launch: "A product, a book or an office",
  "ganesh-chaturthi": "Bappa's darshan, aarti and modak",
  navratri: "Garba nights and Durga Puja",
  janmashtami: "Bhajans and midnight aarti for Kanha",
  onam: "Pookalam and a sadhya on a banana leaf",
  sankranti: "Kites, til and pongal",
  lohri: "Bonfire, rewari and bhangra",
  eid: "Iftar dawat and Eid milan",
};

export const questionLabels: Record<RsvpQuestionId, string> = {
  meal: "Meal preference",
  arrival: "Arrival date",
  stay: "Needs a room",
  pickup: "Pickup from station or airport",
  song: "A song request",
  message: "A note for the couple",
};

export const occasionsSection = {
  eyebrow: "Occasions",
  title: "What are you celebrating?",
  intro:
    "Start from the occasion and the invite sets itself up: the right functions, wording and designs. Birthdays, baby and festival invites arrive next.",
  listLabel: "Occasions",
  nearYou: "Popular near you",
} as const;
