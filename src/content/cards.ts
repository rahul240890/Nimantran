import type { CardKind } from "@/lib/cards/words";

/*
 * English copy for the save-the-date and thank-you cards (Step 24): two pictures in the
 * invitation's own design. The words on the cards themselves follow the card's language
 * (src/lib/cards/words.ts).
 */

export const cardsCopy = {
  metaTitle: "Save the date and thank-you cards",
  back: "Back to the invitation",
  heading: "Save the date and thank-you cards",
  intro:
    "Two pictures in your invitation's design, to send on WhatsApp: a save the date before the invitation, and a thank-you after the celebration.",
  /** Where the cards are reached from: the editor, the dashboard and the share page. */
  open: "Save the date and thank-you cards",
  openShort: "Cards",
  openBody: "Pictures in your invitation's design, to send before and after the celebration.",
  kinds: { "save-the-date": "Save the date", "thank-you": "Thank you" } satisfies Record<
    CardKind,
    string
  >,
  kindBody: {
    "save-the-date": "Send it early, so family and friends keep the day free.",
    "thank-you": "Send it after the celebration, to everyone who came or sent their blessings.",
  } satisfies Record<CardKind, string>,
  noteLabel: {
    "save-the-date": "The line at the foot",
    "thank-you": "Your message",
  } satisfies Record<CardKind, string>,
  noteHint: "In your card's language. Leave it empty to leave the line out.",
  noteCount: (used: number, max: number) => `${used} of ${max} characters used`,
  reset: "Use the suggested words",
  picture: (kind: string, names: string) => `${kind} card for ${names}`,
  preparing: "Drawing your card…",
  failed: "Couldn't draw the card. Try again, or try Chrome or Safari.",
  retry: "Try again",
  download: "Download picture",
  share: "Share on WhatsApp",
  fileName: (kind: CardKind) => `${kind}.png`,
  preview: "Preview",
  previewNote:
    "This preview carries “Made with Shubh” across it. Save the date and thank-you cards come clean with the Grand package.",
  upgrade: "Get Grand",
};
