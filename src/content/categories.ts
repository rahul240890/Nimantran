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
