import type * as en from "../account-menu";
import type { Translation } from "@/i18n/text";

/* English: src/content/account-menu.ts. */

export const accountMenu: Translation<typeof en.accountMenu> = {
  signIn: "साइन इन",
  menuLabel: (name) => (name ? `खाते: ${name}` : "खाते"),
  yourAccount: "तुमचे खाते",
  invites: "माझी निमंत्रणे",
  profile: "प्रोफाइल",
  payments: "पेमेंट",
  newInvite: "नवीन निमंत्रण",
  signOut: "साइन आउट",
  signedOut: "साइन आउट झाले",
};
