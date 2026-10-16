import type * as en from "../legal";
import type { Translation } from "@/i18n/text";

/*
 * বাংলা: the legal pages' own words. The policies themselves stay in English, the version
 * that binds us, until a reviewed translation replaces them. English: src/content/legal.ts.
 */

export const legalCopy: Translation<typeof en.legalCopy> = {
  updated: "শেষ আপডেট",
  inEnglish:
    "এই নীতিটি ইংরেজিতে: আমাদের কাছে এটিই বাধ্যতামূলক সংস্করণ। যাচাই করা বাংলা অনুবাদ শীঘ্রই আসছে।",
  onThisPage: "এই পাতায়",
  contactHeading: "যোগাযোগ",
  contactEmail: (email) => `আমাদের ${email}-এ লিখুন। আমরা ৭ কর্মদিবসের মধ্যে উত্তর দিই।`,
  contactPending:
    "আমাদের যোগাযোগের ঠিকানা লঞ্চের আগে এখানে দেখা যাবে। ততদিন শুভ ইনভিটেশন টিমের যেকোনো বার্তার উত্তর দিন।",
  footer: {
    heading: "আইনি",
    privacy: "গোপনীয়তা",
    terms: "শর্তাবলি",
    refunds: "রিফান্ড",
    contact: "যোগাযোগ",
  },
};

export { privacy, refunds, terms } from "../legal";
