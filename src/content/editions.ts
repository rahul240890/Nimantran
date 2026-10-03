import type { PlanId, PlanLimits } from "@/lib/plans/catalog";

/*
 * English copy for editions: the plan cards, buying one for an invite, and the watermark
 * (Steps 15 to 17). Prices come from src/lib/plans/catalog.ts.
 */

export const planCopy = {
  free: {
    name: "Free",
    bestFor: "Trying it, small gatherings",
    highlights: ["1 function", "3 photos", "1 card language", "“Made with Shubh” on the invite"],
  },
  premium: {
    name: "Premium",
    bestFor: "Birthdays, pujas, engagements",
    highlights: [
      "Up to 3 functions",
      "20 photos",
      "2 card languages",
      "1 couple photo",
      "Video for WhatsApp Status and Reels",
      "Guest photo wall for 30 days",
      "No watermark",
    ],
  },
  royal: {
    name: "Royal",
    bestFor: "Big weddings and receptions",
    highlights: [
      "Every function",
      "Every photo",
      "2 card languages",
      "Couple photos, one each",
      "Video for WhatsApp Status and Reels",
      "Guest photo wall for a year",
      "No watermark",
    ],
  },
  bundle: {
    name: "Wedding bundle",
    bestFor: "Multi-day Indian weddings",
    highlights: [
      "Everything in Royal",
      "Guest photo wall that never closes",
      "Save-the-date and thank-you cards (coming soon)",
      "No watermark",
    ],
  },
} satisfies Record<PlanId, { name: string; bestFor: string; highlights: string[] }>;

export const upgradeCopy = {
  metaTitle: "Choose your edition",
  eyebrow: "Edition",
  title: "Choose your edition",
  intro: (names: string) =>
    `One payment for ${names || "this invite"}, with every function and guest on it. Prices include GST.`,
  current: "Your edition",
  currentBadge: "Current",
  needed: "Fits your invite",
  included: "Included",
  pay: (price: string) => `Pay ${price}`,
  payDifference: (price: string) => `Upgrade for ${price}`,
  difference: "You pay only the difference.",
  opening: "Opening payment…",
  checking: "Confirming your payment…",
  paid: (plan: string) => `${plan} is on. Thank you!`,
  paidBody: "The watermark is gone and everything in your edition is unlocked.",
  cancelled: "Payment not completed. Nothing was charged.",
  failed:
    "The payment couldn't be confirmed. If money left your account, it comes back within 5 to 7 days, or write to us.",
  off: "Payments open very soon. Everything is free until then.",
  ownerOnly: {
    title: "Only the invite's owner can upgrade it",
    body: "Co-hosts help run the invite, but the payment, receipt and GST invoice belong to the person who created it. Ask them to upgrade from their account.",
  },
  loadFailed: "The payment window couldn't open. Check your connection and try again.",
  receipts: "Receipts",
  receipt: (plan: string, price: string) => `${plan}, ${price}`,
  paymentId: "Payment",
  back: "Back to the invite",
  secure: "Paid securely through Razorpay: UPI, cards and netbanking.",
  previewCheckout: {
    title: "Test payment",
    body: (price: string) =>
      `Preview mode: no money moves. Pay ${price} to see the edition unlock as a host would.`,
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
    "wrong-plan": "That code doesn't apply to the editions you can choose.",
  },
  invoice: "Invoice",
  refunded: "Refunded",
  refunds: "Full refund within 7 days if the invite hasn't been sent to any guest.",
} as const;

export const limitCopy = {
  title: "This invite needs a bigger edition",
  body: (plan: string) => `To publish it as it is, choose ${plan}, or trim it to fit Free.`,
  used: {
    functions: (count: number) => `${count} functions`,
    photos: (count: number) => `${count} photos`,
    languages: (count: number) => `${count} card languages`,
    couplePhotos: (count: number) => `${count} couple photos`,
    guests: (count: number) => `${count} guests`,
  } satisfies Record<keyof PlanLimits, (count: number) => string>,
  choose: "Choose edition",
  edition: (plan: string) => `Edition: ${plan}`,
  unlockBody: (plan: string, price: string) =>
    `${plan} covers everything this invite uses, for ${price}. Or trim it to fit your edition.`,
  unlock: (plan: string) => `Get ${plan}`,
  upgrade: "Upgrade",
} as const;
