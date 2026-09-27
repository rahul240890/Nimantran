import type { CategoryId } from "@/lib/categories/catalog";
import type { TraditionId } from "@/lib/traditions/schema";

/*
 * Words for the public pages search engines index (docs/BRAND_SEO.md, sections 5 and 6):
 * one page per occasion, tradition and design, and the design gallery. Titles stay under
 * 48 characters, as " · Shubhdwar" is added to them; descriptions under 155.
 */

type PageWords = {
  /** The <title>, without the site name. */
  title: string;
  description: string;
  heading: string;
  intro: string;
};

export const seoCopy = {
  home: "Home",
  invitations: "Invitations",
  traditions: "Traditions",
  designs: "Designs",
  breadcrumbs: "Breadcrumbs",
  create: "Create your invitation",
  seeDesigns: "See the designs",
  freeNote: "Free to start. Guests need no app.",
  features: [
    {
      title: "Opens in 3D",
      text: "Guests open the gates, turn the card and hear its raga, on any phone.",
    },
    {
      title: "Sent on WhatsApp",
      text: "One link for everyone, with a preview in the design's colours.",
    },
    {
      title: "RSVP in one tap",
      text: "Guests reply to each function without signing in; you see every reply.",
    },
  ],
  designsHeading: "Designs to start from",
  designsIntro: "Every design opens in 3D, plays its own raga and takes your words in any script.",
  functionsHeading: "Functions on one invitation",
  functionsIntro:
    "Add each function with its date, venue and dress code. Guests reply to each one.",
  ceremoniesHeading: "Ceremonies, in their own names",
  ceremoniesIntro: "The invitation lists each ceremony by its local name, beside the English one.",
  wordingHeading: "Traditional wording",
  wordingIntro: "Labelled lines the family fills in, shown to guests under the card.",
  symbolHeading: "Sacred symbol and invocation",
  draftNote:
    "Families from each community are reviewing this wording before launch. Everything stays editable.",
  moreOccasions: "Invitations for every function",
  moreTraditions: "Other traditions",
  suitsHeading: "Made for",
  raga: "Music",
  useDesign: "Use this design",
  allDesigns: "All designs",
  footerInvitations: "Invitations",
  footerMore: "Designs and traditions",
  gallery: {
    title: "3D wedding invitation designs",
    description:
      "Twelve 3D invitation designs, from Rajasthani jharokhas to Tamil temple gold, each with its own raga. Share on WhatsApp and collect RSVPs.",
    heading: "Invitation designs that open like a gate",
    intro:
      "Six classic designs and six from India's regions, each drawn from geometry and set to its own raga. Pick one and make it yours.",
  } satisfies PageWords,
  design: {
    title: (name: string) => `${name} · 3D invitation design`,
    description: (about: string) =>
      `${about} A 3D invitation with raga music, WhatsApp sharing and RSVP.`,
    eyebrow: "Invitation design",
  },
  occasions: {
    wedding: {
      title: "Wedding invitation maker with RSVP",
      description:
        "Make a 3D wedding invitation online, share it on WhatsApp and collect RSVPs for every function. Free to start, and guests need no app.",
      heading: "Wedding invitations that open like a gate",
      intro:
        "Write your names once, add the haldi, mehendi, sangeet and reception, and send one link. Guests open a 3D card with music, see each function with directions, and reply in a tap.",
    },
    engagement: {
      title: "Engagement invitation card online",
      description:
        "Create an engagement or sagai invitation in minutes: a 3D card with music, shared on WhatsApp, with one-tap RSVP for your guests.",
      heading: "Engagement invitations for the ring ceremony",
      intro:
        "Announce the sagai with a card guests open and turn. Add the venue and time, share one link, and see who is coming.",
    },
    "save-the-date": {
      title: "Save the date for Indian weddings",
      description:
        "Send a 3D save the date on WhatsApp with just your names, the date and the city. The full invitation follows from the same link.",
      heading: "Save the date, before the cards",
      intro:
        "Tell family and friends early. A save the date needs only the date and the city; the full invitation with every function follows later.",
    },
    roka: {
      title: "Roka ceremony invitation card",
      description:
        "Invite family to the roka with a 3D card, shared on WhatsApp in one link. Guests reply in one tap, and you see who is coming.",
      heading: "Roka invitations for the first blessing",
      intro:
        "The roka brings both families together. Send a warm invitation with its date and place, and gather the replies in one list.",
    },
    haldi: {
      title: "Haldi ceremony invitation card",
      description:
        "Create a haldi invitation with a sunny 3D card, a dress code in yellow and one-tap RSVP. Share it on WhatsApp with one link.",
      heading: "Haldi invitations as bright as the day",
      intro:
        "Set the morning, the place and the dress code, and let guests reply from WhatsApp. Add the other functions to the same invitation.",
    },
    mehendi: {
      title: "Mehendi invitation card online",
      description:
        "Make a mehendi invitation with a 3D card and music, share it on WhatsApp, and collect RSVPs in one tap. Free to start.",
      heading: "Mehendi invitations with colour and music",
      intro:
        "An afternoon of henna and songs deserves a card guests enjoy opening. Add the time, venue and dress code, and see who is coming.",
    },
    sangeet: {
      title: "Sangeet night invitation card",
      description:
        "Invite guests to the sangeet with a 3D card that plays its raga. Share on WhatsApp, ask for song requests, and collect RSVPs.",
      heading: "Sangeet invitations that start the music",
      intro:
        "The card plays as it opens. Guests can send a song request with their reply, so the playlist builds itself.",
    },
    reception: {
      title: "Wedding reception invitation card",
      description:
        "Create a reception invitation with a 3D card, venue directions and one-tap RSVP. Share it on WhatsApp and know your head count.",
      heading: "Reception invitations for the grand evening",
      intro:
        "Send the evening's details with directions and an add-to-calendar button, and count adults and children from the replies.",
    },
  } satisfies Record<CategoryId, PageWords>,
  traditionPages: {
    "north-hindu": {
      title: "North Indian Hindu wedding card",
      description:
        "Wedding invitations with Shri Ganeshaya Namah, the mangal kalash and Hindi wording like Darshanabhilashi. 3D card, WhatsApp and RSVP.",
      heading: "North Indian wedding cards, with Shri Ganesh first",
      intro:
        "The card opens with the kalash and ॥ श्री गणेशाय नमः ॥, lists the Sagai, Haldi and Shubh Vivah by name, and carries the family's blessings and Swagatotsuk lines.",
    },
    rajasthani: {
      title: "Rajasthani and Marwari wedding card",
      description:
        "A Rajasthani wedding invitation with jharokha arches, Raag Mand, Pithi and Mahila Sangeet by name. Shared on WhatsApp with RSVP.",
      heading: "Rajasthani wedding cards with royal colour",
      intro:
        "Rang Mahal's jharokhas and meenakari open to Raag Mand. The invitation names the Pithi, Mahila Sangeet and Preetibhoj, the way Marwari families do.",
    },
    marathi: {
      title: "Marathi lagna patrika online",
      description:
        "Make a Marathi lagna patrika with Shri Ganeshaya Namah, Sakharpuda and Halad by name, and an exact shubh muhurta. 3D, on WhatsApp.",
      heading: "Marathi lagna patrika, with the exact muhurta",
      intro:
        "Paithani peacocks and Raag Bhimpalasi, the kalash above the names, and the shubhmuhurta set to the minute. Guests reply to the Sakharpuda, Halad and Lagna separately.",
    },
    gujarati: {
      title: "Gujarati kankotri online",
      description:
        "Create a Gujarati kankotri with the swastik, Shri Ganeshaya Namah in Gujarati script, Gol Dhana and Pithi, and a tahuko for the children.",
      heading: "Gujarati kankotri, sent on WhatsApp",
      intro:
        "Bandhani dots and mirror-work open to Raag Pilu. The card carries the swastik and ॥ શ્રી ગણેશાય નમઃ ॥, in Gujarati and English side by side if you like.",
    },
    bengali: {
      title: "Bengali biye card online",
      description:
        "A Bengali wedding invitation with Prajapati, Prajapataye Namah, Gaye Holud and Bou Bhaat by name, and the shubho lagna time.",
      heading: "Bengali biye cards with Prajapati's blessing",
      intro:
        "Alpona Lal's laal paar border opens to Raag Bhairavi, with the Prajapati butterfly above প্রজাপতয়ে নমঃ and each ceremony named in Bengali.",
    },
    tamil: {
      title: "Tamil kalyana pathirikai online",
      description:
        "Make a Tamil wedding invitation with the Pillaiyar suzhi, Sri Vinayagar Thunai, Nichayathartham and the muhurtham, shared on WhatsApp.",
      heading: "Tamil kalyana pathirikai, with the muhurtham",
      intro:
        "Gopuram Pon's temple towers open to Raag Hamsadhwani. The card begins with உ and ஸ்ரீ விநாயகர் துணை, and shows the muhurtham window exactly.",
    },
    modern: {
      title: "Modern wedding invitation, no symbols",
      description:
        "A modern wedding invitation without religious symbols, for any couple or an interfaith wedding. 3D card, WhatsApp sharing and RSVP.",
      heading: "Modern invitations, just the two of you",
      intro:
        "No symbols and no invocation: a clean card with your names, your words and your music, for any couple and every family.",
    },
  } satisfies Record<TraditionId, PageWords>,
} as const;
