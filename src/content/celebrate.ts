import type { CelebrationFamily, PerkId, Suggestion } from "@/lib/publish/celebrate";
import type { Faith } from "@/lib/traditions/faith";

/* The celebration over the share page once an invitation goes live (owner, 2026-11-04). */

/** What a perk's line needs to know: the numbers of the package that gives it. */
export type PerkFacts = {
  /** Guests or families by link; null for no limit. */
  guests: number | null;
  /** One video, or one for every function too. */
  everyVideo: boolean;
  /** Days the photo wall stays open. */
  albumDays: number;
  /** Co-hosts; null for no limit. */
  cohosts: number | null;
  /** Pages of a guest list AI reads. */
  listPages: number;
};

export const celebrateCopy = {
  /** Screen readers: the dialog's name. */
  title: "Your invitation is live",
  close: "Close",
  wishes: {
    wedding: {
      wish: "May your new journey be filled with love, laughter and blessings.",
      note: "Your wedding invitation is ready to reach every home you love.",
    },
    engagement: {
      wish: "A promise made, a lifetime to go. Congratulations!",
      note: "Your engagement invitation is ready for family and friends.",
    },
    haldi: {
      wish: "Here's to the golden glow before the big day!",
      note: "Your haldi invitation is ready. Let the yellow begin.",
    },
    mehendi: {
      wish: "May your mehendi be as deep as your love.",
      note: "Your mehendi invitation is ready to send.",
    },
    sangeet: {
      wish: "Let the music begin. Dance the night away!",
      note: "Your sangeet invitation is ready. Time to gather everyone.",
    },
    anniversary: {
      wish: "Years of love, and many more to come.",
      note: "Your anniversary invitation is ready to send.",
    },
    birthday: {
      wish: "Here's to a day full of joy and the people you love!",
      note: "Your invitation is ready. Let the celebrations begin.",
    },
    baby: {
      wish: "A tiny miracle, a world of blessings.",
      note: "Your invitation is ready to share the happy news.",
    },
    housewarming: {
      wish: "May your new home be full of warmth and happiness.",
      note: "Your griha pravesh invitation is ready to send.",
    },
    festival: {
      wish: "Wishing you and your family a joyful celebration!",
      note: "Your invitation is ready. Bring everyone together.",
    },
    lights: {
      wish: "May every lamp bring light, joy and good fortune to your home.",
      note: "Your invitation is ready. Bring everyone together.",
    },
    puja: {
      wish: "May this occasion bring peace and blessings to your home.",
      note: "Your invitation is ready to reach family and friends.",
    },
    prayer: {
      wish: "Your invitation is ready.",
      note: "Family and friends can now find the time and place to join you.",
    },
    business: {
      wish: "Congratulations on the big day. Wishing you great success!",
      note: "Your invitation is ready to send.",
    },
  } satisfies Record<CelebrationFamily, { wish: string; note: string }>,
  blessing: {
    hindu: "Shubh Mangal",
    muslim: "Mubarak ho",
    sikh: "Waheguru mehar kare",
    christian: "God bless you all",
    jain: "Jai Jinendra",
  } satisfies Record<Exclude<Faith, "none">, string>,
  liveHeading: "Your invitation is live",
  liveBody: "Send it on WhatsApp now, or close this to see every way to share.",
  copy: "Copy link",
  copied: "Link copied",
  copyFailed: "Couldn't copy. Select the link and copy it instead.",
  whatsapp: "Share on WhatsApp",
  packageEyebrow: "Your package",
  packageName: (plan: string) => `${plan} package`,
  everything: "Everything is included",
  everythingBody: "Payments open soon, so your invitation has everything for now.",
  canNow: "You can now",
  notIncluded: "Not in your package",
  inPlan: (plan: string) => `In ${plan}`,
  perks: {
    share: { title: () => "Your own link, QR code and WhatsApp sharing", action: "Share" },
    guests: {
      title: (facts: PerkFacts) =>
        facts.guests === null
          ? "Unlimited guests, each with their own link, replies and reminders"
          : `Up to ${facts.guests.toLocaleString("en-IN")} guests or families, each with their own link, replies and reminders`,
      action: "Add guests",
    },
    noMark: { title: () => "Your invitation without the Shubh mark", action: "See it" },
    video: {
      title: (facts: PerkFacts) =>
        facts.everyVideo
          ? "WhatsApp video for Status and Reels, and one for every function"
          : "WhatsApp video for Status and Reels",
      action: "Make your video",
    },
    photoWall: {
      title: (facts: PerkFacts) =>
        facts.albumDays >= 365
          ? "Guest photo wall for a year"
          : `Guest photo wall for ${facts.albumDays} days`,
      action: "Open photo wall",
    },
    cohosts: {
      title: (facts: PerkFacts) =>
        facts.cohosts === null
          ? "As many co-hosts as you like"
          : `${facts.cohosts} co-hosts to help run it`,
      action: "Invite co-hosts",
    },
    cards: {
      title: () => "Save the date and thank-you cards in your design",
      action: "Make cards",
    },
    aiList: {
      title: (facts: PerkFacts) =>
        facts.listPages === 1
          ? "AI reads 1 page of your handwritten guest list"
          : `AI reads up to ${facts.listPages} pages of your handwritten guest list`,
      action: "Read a list",
    },
    priority: { title: () => "Priority help from our team", action: "Write to us" },
  } satisfies Record<PerkId, { title: (facts: PerkFacts) => string; action: string }>,
  suggestion: {
    eyebrow: "Make it even better",
    titles: {
      noMark: "Take the Shubh mark off",
      video: "Add your WhatsApp video",
      everyVideo: "A video for every function",
      cards: "Save the date and thank-you cards",
    } satisfies Record<Suggestion["reason"], string>,
    bodies: {
      noMark: "Basic sends your invitation clean, with no mark in the corner.",
      video:
        "Your invitation as a video for WhatsApp Status and Reels, downloaded clean. Celebration also gives you more guests, a guest photo wall and co-hosts.",
      everyVideo:
        "Grand makes a video for each function, plus save the date and thank-you cards, unlimited guests and a photo wall for a year.",
      cards:
        "Grand makes save the date and thank-you cards in your design, plus unlimited guests and a photo wall for a year.",
    } satisfies Record<Suggestion["reason"], string>,
    upgrade: (plan: string, price: string | null) =>
      price ? `Get ${plan} for ${price}` : `See ${plan}`,
    difference: "You pay only the difference.",
    watch: "Watch your video preview",
  },
  startSharing: "Start sharing",
  reopen: "What your package includes",
} as const;
