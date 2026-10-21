import type * as en from "../account-menu";
import type { Translation } from "@/i18n/text";

/* English: src/content/account-menu.ts. */

export const accountMenu: Translation<typeof en.accountMenu> = {
  signIn: "साइन इन",
  menuLabel: (name) => (name ? `खाता: ${name}` : "खाता"),
  yourAccount: "आपका खाता",
  invites: "मेरे निमंत्रण",
  profile: "प्रोफ़ाइल",
  payments: "भुगतान",
  newInvite: "नया निमंत्रण",
  signOut: "साइन आउट",
  signedOut: "साइन आउट हो गए",
};
