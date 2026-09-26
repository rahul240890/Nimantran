import { site } from "@/lib/site";

/* Publishing, sharing and the guest page (Step 9). English copy, shaped for next-intl. */

export const publishCopy = {
  publish: "Publish",
  signInToPublish: "Sign in to publish",
  share: "Share",
  finishFirst: "Finish the steps marked above to publish.",
  dialogTitle: "Choose your link",
  dialogBody:
    "Guests open your invitation at this address. Once you share it, it stays the same, even if you edit the invite later.",
  linkLabel: "Invitation link",
  linkHint: "Letters, numbers and dashes.",
  checking: "Checking…",
  available: "This link is free.",
  taken: "Someone already has this link.",
  tryOne: "Try one of these:",
  invalid: "Use at least one letter or number.",
  saving: "Saving your invite first…",
  confirm: "Publish invitation",
  cancel: "Not yet",
  close: "Close",
  failed: "Couldn't publish. Check your connection and try again.",
  notReady: "Some steps still need finishing before this can go out.",
  published: "Your invitation is live",
} as const;

export const shareCopy = {
  metaTitle: "Share your invitation",
  eyebrow: "Live invitation",
  title: "Your invitation is ready to send",
  intro: "Send it on WhatsApp, copy the link, or print the QR code on anything paper.",
  linkLabel: "Your link",
  copy: "Copy link",
  copied: "Link copied",
  copyFailed: "Couldn't copy. Select the link and copy it instead.",
  whatsapp: "Share on WhatsApp",
  moreWays: "More ways to share",
  open: "Open invitation",
  edit: "Edit invite",
  messageLabel: "Message",
  messageHint: "Sent with the link. Change it however you like.",
  message: (names: string, occasion: string, when: string) =>
    [
      `You're warmly invited to ${occasion ? `the ${occasion.toLowerCase()} of ` : ""}${names}.`,
      when,
      "Open your invitation and let us know if you can come:",
    ]
      .filter(Boolean)
      .join("\n"),
  previewHeading: "How it looks in WhatsApp",
  previewNote: "WhatsApp shows this picture, title and line under your message.",
  qrHeading: "QR code",
  qrBody:
    "Guests scan it with their phone camera. Print it on a card, a banner or the welcome board.",
  qrAlt: (url: string) => `QR code for ${url}`,
  downloadQr: "Download QR code",
  stopHeading: "Stop sharing",
  stopBody:
    "Guests with the link will see that the invitation isn't available. You can publish it again at the same link.",
  stop: "Stop sharing",
  stopConfirmTitle: "Stop sharing this invitation?",
  stopConfirm: "Stop sharing",
  keepSharing: "Keep sharing",
  close: "Close",
  stopped: "The invitation is no longer shared",
  stopFailed: "Couldn't stop sharing. Try again.",
  back: "My invites",
} as const;

export const guestCopy = {
  metaTitle: (names: string, occasion: string) => `${names} · ${occasion} invitation`,
  metaDescription: (when: string, where: string) =>
    [when, where].filter(Boolean).join(" · ") ||
    "You're invited. Open the invitation to see the details.",
  invited: "You're invited",
  openHint: "Tap the card to open it",
  functions: "The celebrations",
  when: "When",
  where: "Where",
  dressCode: "Dress code",
  directions: "Directions",
  addToCalendar: "Add to calendar",
  googleCalendar: "Google Calendar",
  appleCalendar: "Apple, Outlook and others",
  addAll: "Add all to calendar",
  photos: "Photos",
  photoAlt: (index: number) => `Photo ${index} from the family`,
  madeWith: `Made with ${site.name}`,
  createYours: "Create your own invitation",
  notFoundTitle: "This invitation isn't available",
  notFoundBody:
    "The link may be mistyped, or the family may have stopped sharing it. Ask them to send it again.",
  home: `Go to ${site.name}`,
} as const;
