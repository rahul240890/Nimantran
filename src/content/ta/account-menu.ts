import type * as en from "../account-menu";
import type { Translation } from "@/i18n/text";

/* English: src/content/account-menu.ts. */

export const accountMenu: Translation<typeof en.accountMenu> = {
  signIn: "உள்நுழைக",
  menuLabel: (name) => (name ? `கணக்கு: ${name}` : "கணக்கு"),
  yourAccount: "உங்கள் கணக்கு",
  invites: "என் அழைப்பிதழ்கள்",
  profile: "சுயவிவரம்",
  payments: "கட்டணங்கள்",
  newInvite: "புதிய அழைப்பிதழ்",
  signOut: "வெளியேறு",
  signedOut: "வெளியேறிவிட்டீர்கள்",
};
