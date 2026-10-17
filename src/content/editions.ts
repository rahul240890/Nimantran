import type { PlanId, PlanNeed } from "@/lib/plans/catalog";

/*
 * English copy for packages: the package cards, buying one for an invite, and the
 * watermark (Steps 15 to 17). Prices come from the admin (src/lib/plans/design-tiers.ts).
 */

export const planCopy = {
  free: {
    name: "Free",
    bestFor: "Free designs, small gatherings",
    highlights: [
      "Every function, with replies and the guest list",
      "Your own link and QR code",
      "1 card language",
      "A small “Made with Shubh” in the corner",
    ],
  },
  basic: {
    name: "Basic",
    bestFor: "Your design, ready to send",
    highlights: [
      "No watermark",
      "Every function, with replies and the guest list",
      "Your own link and QR code",
      "Edit any time until the event",
      "Your own song",
      "1 card language",
    ],
  },
  celebration: {
    name: "Celebration",
    bestFor: "Most weddings and big birthdays",
    highlights: [
      "Everything in Basic",
      "WhatsApp video of your invitation, for Status and Reels",
      "2 card languages",
      "Guest photo wall for 30 days",
      "3 co-hosts",
    ],
  },
  grand: {
    name: "Grand",
    bestFor: "Big multi-day weddings",
    highlights: [
      "Everything in Celebration",
      "WhatsApp video of your invitation, and one for every function",
      "Save the date and thank-you cards in your design",
      "Guest photo wall for a year",
      "As many co-hosts as you like",
      "Priority help from our team",
    ],
  },
} satisfies Record<PlanId, { name: string; bestFor: string; highlights: string[] }>;

/** The invites line on each package: guests by personal link or the open link. */
export const invitesLine = (count: number | null) =>
  count === null ? "Unlimited guests" : `Up to ${count.toLocaleString("en-IN")} guests or families`;

/** The invites count on each package card, large: the number, then what it counts. */
export const invitesCount = (count: number | null) =>
  count === null
    ? { value: "Unlimited", label: "guests" }
    : { value: count.toLocaleString("en-IN"), label: "guests or families" };

/** What the guest count counts, wherever packages are compared. */
export const invitesNote: string =
  "Each guest or family on your list counts once and gets their own link. Guests who reply through your shared link count too.";

export const upgradeCopy = {
  metaTitle: "Choose your package",
  eyebrow: "Package",
  title: "Choose your package",
  intro: (names: string) =>
    `One payment for ${names || "this invite"}, priced on its design. Prices include any taxes.`,
  current: "Your package",
  currentBadge: "Current",
  needed: "Fits your invite",
  popular: "Recommended",
  included: "Included",
  free: "Free",
  designPrice: (price: string) => `Design ${price}`,
  addOn: (price: string) => `+ ${price} on the design`,
  pay: (price: string) => `Pay ${price}`,
  payDifference: (price: string) => `Upgrade for ${price}`,
  difference: "You pay only the difference.",
  continueFree: "Continue free",
  publishNow: "Publish your invite",
  /** A live invite's new design, now paid for, waits in the editor to go live. */
  liveDesignReady: (design: string) =>
    `Your package now covers ${design}. Open the editor to put it live for your guests.`,
  liveDesignLink: "Put it live",
  publishBody: "Your package is ready. Publish the invite to get its link.",
  publishFreeBody:
    "Payments open very soon, so your invite publishes free with everything for now.",
  adminOff:
    "Only you see this: checkout is switched off, so hosts can't pay yet. Add the Razorpay keys and turn checkout on.",
  adminOffLink: "Open Admin, Razorpay",
  opening: "Opening payment…",
  checking: "Confirming your payment…",
  paid: (plan: string) => `${plan} is on. Thank you!`,
  paidBody: "Everything in your package is unlocked.",
  /** In the editor, on a design already paid for, instead of its price. */
  paidBadge: (plan: string) => `Paid · ${plan}`,
  cancelled: "Payment not completed. Nothing was charged.",
  declined:
    "The payment didn't go through. Nothing was charged. Try again, or choose another way to pay.",
  testMode:
    "Test payments are on, so no real money moves. UPI apps like Google Pay don't work in test mode: choose UPI ID and enter success@razorpay, or pay by card with 4111 1111 1111 1111, any future expiry and any CVV.",
  failed:
    "The payment couldn't be confirmed. If money left your account, it comes back within 5 to 7 days, or write to us.",
  off: "Payments open very soon. Everything is free until then.",
  ownerOnly: {
    title: "Only the invite's owner can buy a package",
    body: "Co-hosts help run the invite, but the payment, receipt and invoice belong to the person who created it. Ask them to choose a package from their account.",
  },
  loadFailed: "The payment window couldn't open. Check your connection and try again.",
  receipts: "Receipts",
  receipt: (plan: string, price: string) => `${plan}, ${price}`,
  paymentId: "Payment",
  back: "Back to the invite",
  backToEditor: "Back to your invite",
  videoFirst: "Make your invitation video for free and watch it before you choose.",
  videoFirstLink: "Watch your video",
  video: {
    title: "WhatsApp video included",
    body: "Make a free preview of your invitation video right here, then watch it full screen.",
    make: "Make video preview",
    ready: "Your preview is ready",
    fullScreen: "Watch the video full screen",
    fullScreenShort: "Full screen",
  },
  secure: "Paid securely through Razorpay: UPI, cards and netbanking.",
  previewCheckout: {
    title: "Test payment",
    body: (price: string) =>
      `Preview mode: no money moves. Pay ${price} to see the package unlock as a host would.`,
    pay: "Pay (test)",
    cancel: "Cancel",
  },
  was: "was",
  offer: (label: string, off: string) => `${label}: ${off} off`,
  couponLabel: "Coupon code",
  couponApply: "Apply",
  couponApplied: (code: string) => `Coupon ${code} applied`,
  couponRemove: "Remove",
  couponProblem: {
    unknown: "That code doesn't exist. Check the spelling.",
    inactive: "That code has been switched off.",
    "not-started": "That code hasn't started yet.",
    ended: "That code has ended.",
    "used-up": "That code has been used up.",
    "wrong-plan": "That code doesn't apply to the packages you can choose.",
  },
  invoice: "Invoice",
  refunded: "Refunded",
  refunds: "Full refund within 7 days if no guest has opened your invitation yet.",
} as const;

const TIER_NAMES = ["Free", "Premium", "Royal", "Signature"];

export const limitCopy = {
  title: "This invite needs a package",
  body: (plan: string) => `To publish it as it is, choose ${plan}.`,
  used: {
    languages: (count: number) => `${count} card languages`,
    /** The design's tier, by its place in the list (1 Premium, 2 Royal, 3 Signature). */
    design: (rank: number) => `A ${TIER_NAMES[rank] ?? "Premium"} design`,
  } satisfies Record<PlanNeed["limit"], (count: number) => string>,
  choose: "Choose a package",
  edition: (plan: string) => `Package: ${plan}`,
  invitesUsed: (used: number, limit: number) => `${used} of ${limit} invites used`,
  unlockBody: (plan: string, price: string) =>
    `${plan} covers everything this invite uses, for ${price}.`,
  unlock: (plan: string) => `Get ${plan}`,
  upgrade: "Upgrade",
  /** One package is for one design (owner, 2026-10-16). */
  oneDesign: "Each package is for one design. Another design needs its own package.",
  paidFor: (design: string) => `Your package is for ${design}.`,
} as const;

/** In the editor when a live invite's change isn't saved: its package doesn't cover it. */
export const heldCopy = {
  title: "Your changes aren't live yet",
  body: "Your invitation is live, and this change needs a package it doesn't have. Guests keep seeing it as it was until you choose one.",
  design: (paid: string) =>
    `Your package is for ${paid}. Each package is for one design, so this one needs its own.`,
  choose: "Choose a package",
  back: (paid: string) => `Go back to ${paid}`,
  backPlain: "Go back to the design you paid for",
  backFailed: "Couldn't load your live invitation. Check your connection and try again.",
} as const;
