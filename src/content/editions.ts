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
      "1 card language",
    ],
  },
  celebration: {
    name: "Celebration",
    bestFor: "Most weddings and big birthdays",
    highlights: [
      "Everything in Basic",
      "A video for WhatsApp Status and Instagram Reels",
      "2 card languages",
      "Your own song",
      "Guest photo wall for 30 days",
      "3 co-hosts",
    ],
  },
  grand: {
    name: "Grand",
    bestFor: "Big multi-day weddings",
    highlights: [
      "Everything in Celebration",
      "A video for every function",
      "Guest photo wall for a year",
      "As many co-hosts as you like",
      "Priority help from our team",
    ],
  },
} satisfies Record<PlanId, { name: string; bestFor: string; highlights: string[] }>;

/** The invites line on each package: guests by personal link or the open link. */
export const invitesLine = (count: number | null) =>
  count === null ? "Unlimited invites" : `${count.toLocaleString("en-IN")} invites by link`;

export const upgradeCopy = {
  metaTitle: "Choose your package",
  eyebrow: "Package",
  title: "Choose your package",
  intro: (names: string) =>
    `One payment for ${names || "this invite"}, priced on its design. Prices include GST.`,
  current: "Your package",
  currentBadge: "Current",
  needed: "Fits your invite",
  popular: "Most chosen",
  included: "Included",
  free: "Free",
  designPrice: (price: string) => `Design ${price}`,
  addOn: (price: string) => `+ ${price} on the design`,
  pay: (price: string) => `Pay ${price}`,
  payDifference: (price: string) => `Upgrade for ${price}`,
  difference: "You pay only the difference.",
  continueFree: "Continue free",
  publishNow: "Publish your invite",
  publishBody: "Your package is ready. Publish the invite to get its link.",
  opening: "Opening payment…",
  checking: "Confirming your payment…",
  paid: (plan: string) => `${plan} is on. Thank you!`,
  paidBody: "Everything in your package is unlocked.",
  cancelled: "Payment not completed. Nothing was charged.",
  failed:
    "The payment couldn't be confirmed. If money left your account, it comes back within 5 to 7 days, or write to us.",
  off: "Payments open very soon. Everything is free until then.",
  ownerOnly: {
    title: "Only the invite's owner can buy a package",
    body: "Co-hosts help run the invite, but the payment, receipt and GST invoice belong to the person who created it. Ask them to choose a package from their account.",
  },
  loadFailed: "The payment window couldn't open. Check your connection and try again.",
  receipts: "Receipts",
  receipt: (plan: string, price: string) => `${plan}, ${price}`,
  paymentId: "Payment",
  back: "Back to the invite",
  backToEditor: "Back to your invite",
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
  refunds: "Full refund within 7 days if the invite hasn't been sent to any guest.",
} as const;

const TIER_NAMES = ["Free", "Premium", "Royal"];

export const limitCopy = {
  title: "This invite needs a package",
  body: (plan: string) => `To publish it as it is, choose ${plan}.`,
  used: {
    languages: (count: number) => `${count} card languages`,
    ownSong: () => "Your own song",
    /** The design's tier, by its place in the list (1 Premium, 2 Royal). */
    design: (rank: number) => `A ${TIER_NAMES[rank] ?? "Premium"} design`,
  } satisfies Record<PlanNeed["limit"], (count: number) => string>,
  choose: "Choose a package",
  edition: (plan: string) => `Package: ${plan}`,
  invitesUsed: (used: number, limit: number) => `${used} of ${limit} invites used`,
  unlockBody: (plan: string, price: string) =>
    `${plan} covers everything this invite uses, for ${price}.`,
  unlock: (plan: string) => `Get ${plan}`,
  upgrade: "Upgrade",
} as const;
