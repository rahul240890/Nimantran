import type { BlogPost } from "./types";

export const weddingInvitationVideo: BlogPost = {
  slug: "wedding-invitation-video",
  locale: "en",
  title: "Wedding invitation video for WhatsApp Status",
  description:
    "How to make a wedding invitation video for WhatsApp Status and Instagram Reels: length, size, music, what to show, and how to pair it with an RSVP link.",
  heading: "How to make a wedding invitation video for WhatsApp Status and Reels",
  intro:
    "Video invitations have become part of the Indian wedding: a short vertical film of the card, the couple's names and each function, set to music, posted on WhatsApp Status and Instagram. Studios charge ₹2,000 to ₹6,000 for one. Here is what makes a good one, and how to make yours from your invitation in a few minutes.",
  published: "2026-10-03",
  updated: "2026-10-03",
  occasion: "wedding",
  keywords: [
    "wedding invitation video",
    "video invitation for wedding",
    "wedding invitation video for whatsapp status",
    "e invite video",
    "wedding invitation reel",
  ],
  body: [
    { h2: "What makes a good invitation video", id: "good-video" },
    {
      list: [
        "**Vertical, 9:16.** 1080 × 1920 pixels fills a phone screen on Status and Reels.",
        "**30 to 45 seconds.** WhatsApp Status plays up to 60 seconds, and guests rarely watch longer.",
        "**One idea per screen.** The blessing, the names, the date, then each function, each held long enough to read.",
        "**Music that fits.** A raga or a soft instrumental suits a wedding better than a loud film song, and avoids copyright trouble on Instagram.",
        "**Readable words.** Big names, short lines and enough contrast against the background.",
      ],
    },

    { h2: "What to show, in order", id: "order" },
    {
      ordered: true,
      list: [
        "A blessing or sacred symbol, if your family uses one.",
        "The couple's names, the biggest words in the video.",
        "The wedding date and city.",
        "Each function: its name, date and place.",
        'An ending: "Join us" or "Save the date", and the families\' names.',
      ],
    },

    { h2: "Make the video from your invitation", id: "make" },
    "On Shubh the video is made from the invitation you have already written, so the names, dates and design always match.",
    {
      ordered: true,
      list: [
        "Make your invitation and publish it.",
        "On the share page, find **Video for WhatsApp Status and Reels** and tap **Make video**.",
        "The video is made on your own phone or computer, page by page with the design's raga, in about a minute. Nothing is uploaded.",
        "Tap **Share video** to post it to WhatsApp Status or Instagram, or save it to your phone.",
      ],
    },
    {
      tip: "The video comes with the Celebration and Grand packages; Grand makes one for every function. See the [pricing page](/pricing) for what each package includes.",
    },

    { h2: "Video and link together", id: "video-and-link" },
    "A video is made for watching, not replying: guests can't tap a venue or say who is coming. The best approach uses both:",
    {
      list: [
        "Post the **video** on your Status and Instagram so everyone hears the news.",
        "Send each guest the **invitation link** on WhatsApp, with the map, functions and an RSVP button.",
      ],
    },
    "See how to [send your invitation on WhatsApp](/blog/digital-wedding-invitation-whatsapp), and find words for the caption in [30 wedding invitation messages](/blog/wedding-invitation-wording).",
  ],
  faq: [
    {
      q: "How long should a wedding invitation video be?",
      a: "30 to 45 seconds. That is long enough to show the names, date and each function, and short enough that guests watch it to the end.",
    },
    {
      q: "What size is a video for WhatsApp Status?",
      a: "Vertical 9:16, 1080 × 1920 pixels. The same size works for Instagram Reels and Stories.",
    },
    {
      q: "Can guests RSVP from a video invitation?",
      a: "No. Pair the video with an invitation link: guests open the link to see the venue map and reply for each function.",
    },
  ],
};
