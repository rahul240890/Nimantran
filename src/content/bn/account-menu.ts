import type * as en from "../account-menu";
import type { Translation } from "@/i18n/text";

/* English: src/content/account-menu.ts. */

export const accountMenu: Translation<typeof en.accountMenu> = {
  signIn: "সাইন ইন",
  menuLabel: (name) => (name ? `অ্যাকাউন্ট: ${name}` : "অ্যাকাউন্ট"),
  yourAccount: "আপনার অ্যাকাউন্ট",
  invites: "আমার নিমন্ত্রণ",
  profile: "প্রোফাইল",
  payments: "পেমেন্ট",
  newInvite: "নতুন নিমন্ত্রণ",
  signOut: "সাইন আউট",
  signedOut: "সাইন আউট হয়েছে",
};
