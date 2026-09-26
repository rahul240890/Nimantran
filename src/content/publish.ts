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
  reply: "Reply to the invitation",
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

export const rsvpCopy = {
  heading: "Will you join us?",
  intro: "Reply for each celebration. You can change your answer any time from this page.",
  yourName: "Your name",
  namePlaceholder: "As the family knows you",
  nameRequired: "Please enter your name",
  acceptAll: "Coming to everything",
  statuses: {
    attending: { label: "Joyfully accept", short: "Coming" },
    maybe: { label: "Not sure yet", short: "Maybe" },
    declined: { label: "Regretfully decline", short: "Can't come" },
  },
  statusGroup: (name: string) => `Your reply for the ${name}`,
  chooseOne: "Choose a reply",
  adults: "Adults",
  children: "Children",
  fewer: (what: string) => `Fewer ${what.toLowerCase()}`,
  more: (what: string) => `More ${what.toLowerCase()}`,
  questionsHeading: "A few details for the family",
  optional: "Optional",
  yes: "Yes",
  no: "No",
  choose: "Choose",
  meal: { veg: "Vegetarian", jain: "Jain", "non-veg": "Non-vegetarian", vegan: "Vegan" },
  message: "A note for the family",
  messagePlaceholder: "Blessings, wishes, or anything they should know",
  send: "Send reply",
  update: "Update reply",
  sending: "Sending…",
  failed: "Couldn't send your reply. Check your connection and try again.",
  missing: "This invitation isn't taking replies any more.",
  notInvited: "This link isn't for one of those celebrations. Ask the family to check it.",
  fixErrors: (count: number) =>
    count === 1 ? "One answer still needs you." : `${count} answers still need you.`,
  thanksTitle: (name: string) => `Thank you, ${name}!`,
  thanksBody: "Your reply is with the family. You can change it here any time.",
  change: "Change my reply",
  people: (count: number) => (count === 1 ? "1 person" : `${count} people`),
} as const;

export const repliesCopy = {
  heading: "Replies",
  intro:
    "Updates as guests reply. The full guest list and reminders arrive with the host dashboard.",
  none: "No replies yet. They appear here as soon as guests answer.",
  coming: (count: number) => (count === 1 ? "1 coming" : `${count} coming`),
  maybe: (count: number) => `${count} maybe`,
  declined: (count: number) => `${count} can't come`,
  latest: "Latest replies",
  more: (count: number) => `and ${count} more`,
} as const;
