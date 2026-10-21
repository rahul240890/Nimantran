import type * as en from "../account-menu";
import type { Translation } from "@/i18n/text";

/* English: src/content/account-menu.ts. */

export const accountMenu: Translation<typeof en.accountMenu> = {
  signIn: "સાઇન ઇન",
  menuLabel: (name) => (name ? `એકાઉન્ટ: ${name}` : "એકાઉન્ટ"),
  yourAccount: "તમારું એકાઉન્ટ",
  invites: "મારાં આમંત્રણ",
  profile: "પ્રોફાઇલ",
  payments: "ચુકવણી",
  newInvite: "નવું આમંત્રણ",
  signOut: "સાઇન આઉટ",
  signedOut: "સાઇન આઉટ થઈ ગયા",
};
