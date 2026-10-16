import type * as en from "../legal";
import type { Translation } from "@/i18n/text";

/*
 * தமிழ்: the legal pages' own words. The policies themselves stay in English, the version
 * that binds us, until a reviewed translation replaces them. English: src/content/legal.ts.
 */

export const legalCopy: Translation<typeof en.legalCopy> = {
  updated: "கடைசியாகப் புதுப்பித்தது",
  inEnglish:
    "இந்தக் கொள்கை ஆங்கிலத்தில் உள்ளது: எங்களைக் கட்டுப்படுத்தும் பதிப்பு இதுவே. சரிபார்த்த தமிழ் மொழிபெயர்ப்பு விரைவில் வரும்.",
  onThisPage: "இந்தப் பக்கத்தில்",
  contactHeading: "தொடர்பு",
  contactEmail: (email) =>
    `${email} என்ற முகவரிக்கு எழுதுங்கள். 7 வேலை நாட்களுக்குள் பதில் அளிப்போம்.`,
  contactPending:
    "எங்கள் தொடர்பு முகவரி தொடக்கத்திற்கு முன் இங்கே தோன்றும். அதுவரை ஷுப் இன்விடேஷன் குழுவின் எந்தச் செய்திக்கும் பதில் அளியுங்கள்.",
  footer: {
    heading: "சட்டம்",
    privacy: "தனியுரிமை",
    terms: "விதிமுறைகள்",
    refunds: "பணத்திருப்பம்",
    contact: "தொடர்பு",
  },
};

export { privacy, refunds, terms } from "../legal";
