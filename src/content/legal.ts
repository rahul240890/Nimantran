/*
 * The privacy policy and terms, in plain words. Hindi: src/content/hi/legal.ts.
 * Written for India's Digital Personal Data Protection Act, 2023; a lawyer should read
 * both before launch (docs/LAUNCH.md). Change `updated` whenever the words change.
 */

/** A paragraph, or a list of short points. */
export type Block = string | { list: readonly string[] };
export type LegalSection = { id: string; heading: string; body: readonly Block[] };
export type LegalDoc = {
  title: string;
  description: string;
  intro: string;
  sections: readonly LegalSection[];
};

export const legalCopy = {
  updated: "Last updated",
  onThisPage: "On this page",
  contactHeading: "Contact",
  contactEmail: (email: string) => `Write to us at ${email}. We reply within 7 working days.`,
  contactPending:
    "Our contact address will appear here before launch. Until then, reply to any message from the Shubh Invitation team.",
  footer: {
    heading: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    refunds: "Refunds",
    contact: "Contact",
  },
} as const;

export const privacy: LegalDoc = {
  title: "Privacy policy",
  description:
    "What Shubh Invitation collects when you make or open an invitation, why, who else handles it, and how to see, correct or delete it.",
  intro:
    "Shubh Invitation helps families make invitations, send them on WhatsApp and collect replies. To do that we keep some details about hosts, the people they invite, and the replies guests send. This page says exactly what, and what you can do about it.",
  sections: [
    {
      id: "what-we-collect",
      heading: "What we collect",
      body: [
        "From hosts, the people who make invitations:",
        {
          list: [
            "Your phone number, or your name, email address and picture from Google, depending on how you sign in.",
            "The name and language you choose on your profile.",
            "What you put on your invitations: names, family names, dates, times, venues, addresses, dress codes, wording, music and photos.",
            "Your guest list: the names, phone numbers, email addresses, groups and notes you add.",
            "Co-hosts you invite, by phone number or email address.",
          ],
        },
        "From guests, the people who open an invitation:",
        {
          list: [
            "The reply you send: your name, whether you are coming, how many adults and children, your message, and answers to the host's questions such as meal choice or arrival date.",
            "When your personal invitation link was first opened, so the host knows it reached you.",
          ],
        },
        "From everyone who visits:",
        {
          list: [
            "Your email address and occasion if you join the waitlist.",
            "Anonymous visit counts, such as which pages are viewed and from which kind of device. These never include the address of an invitation, so they cannot tell whose invitation you opened.",
            "Technical details when something breaks, such as the page, browser and error message, so we can fix it.",
          ],
        },
      ],
    },
    {
      id: "why",
      heading: "Why we use it",
      body: [
        {
          list: [
            "To sign you in and keep your invitations in your account.",
            "To show an invitation to the guests the host shares it with, and to pass their replies to the host and co-hosts.",
            "To keep the service working, safe and fast, and to fix what breaks.",
            "To tell waitlist members when Shubh Invitation opens to them.",
          ],
        },
        "We do not sell personal data, show advertising, or use invitations or guest lists to train software.",
      ],
    },
    {
      id: "hosts-and-guests",
      heading: "Hosts decide about their guest lists",
      body: [
        "A host who adds guests is responsible for having their permission to do so, the same way they would when writing names on paper cards. The host and their co-hosts can see, change and delete guest details and replies at any time.",
        "Guests can ask the host to change or remove their details, or write to us and we will do it.",
      ],
    },
    {
      id: "who-else",
      heading: "Who else handles it",
      body: [
        "We use a few companies to run Shubh Invitation. They handle data only to provide their service to us:",
        {
          list: [
            "Supabase stores accounts, invitations, guest lists, replies and photos, in its Mumbai data centre in India.",
            "Vercel serves the website from data centres around the world and counts anonymous visits.",
            "Google signs you in if you choose Google.",
            "Google's typing service spells a name typed in English letters in your card's script, when you make a card in an Indian language. Only that name is sent, from our server, and nothing that identifies you.",
            "Anthropic writes suggested wording when you ask for it. Only the words on the invitation's pages, with the names on them, and the occasion are sent; never your account, phone number or guest list.",
            "A text message provider sends sign-in codes to your phone.",
          ],
        },
        "Invitations are shared by hosts themselves on WhatsApp or elsewhere; we do not send messages to guests on the host's behalf. Anyone with an invitation link can open that invitation, so share it only with the people you invite.",
        "We share data with authorities only when Indian law requires it.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and storage on your device",
      body: [
        "We use a small number of cookies and your browser's storage only to keep you signed in, remember your language and colour theme, and keep an unfinished invitation safe until you save it. We use no advertising or tracking cookies.",
      ],
    },
    {
      id: "how-long",
      heading: "How long we keep it",
      body: [
        "Invitations, guest lists and replies stay until the host deletes them or their account. Waitlist entries stay until you ask us to remove them or Shubh Invitation opens to you. Technical error details are kept for at most 30 days.",
      ],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: [
        "Under India's Digital Personal Data Protection Act, 2023, you can:",
        {
          list: [
            "Ask what personal data we hold about you and who we shared it with.",
            "Have it corrected or completed.",
            "Have it deleted, and withdraw any permission you gave.",
            "Name someone to act for you if you cannot.",
            "Complain to us, and if you are not satisfied, to the Data Protection Board of India.",
          ],
        },
        "Hosts can change their profile and invitations, and delete their whole account, from their profile page. For anything else, write to us at the address below.",
      ],
    },
    {
      id: "safety",
      heading: "Keeping it safe",
      body: [
        "Everything travels encrypted. Each invitation's guest list and replies are open only to its host and co-hosts, and every guest's personal link is a long random code. If we learn of a breach that affects you, we will tell you and the Data Protection Board as the law requires.",
      ],
    },
    {
      id: "children",
      heading: "Children",
      body: [
        "You must be 18 or older to make an account. Children may be named on invitations and may reply to one they receive, under the care of the family that invited them.",
      ],
    },
    {
      id: "changes",
      heading: "Changes",
      body: [
        "If we change this policy, we will update the date at the top, and tell hosts before a change that affects how we use their data.",
      ],
    },
  ],
};

export const refunds: LegalDoc = {
  title: "Refund and cancellation policy",
  description:
    "How paid packages are delivered, when you can cancel, and how to get a full refund within 7 days if your invitation hasn't been sent.",
  intro:
    "Paid packages on Shubh Invitation are digital: they unlock features on one invitation the moment your payment is confirmed. This page says when you can get your money back, and how.",
  sections: [
    {
      id: "what-you-buy",
      heading: "What you buy",
      body: [
        "A package (Basic, Celebration or Grand) unlocks more for one invitation: a paid design without the watermark, more invites, a second card language and the video for WhatsApp Status and Reels. Our pricing page lists what each includes.",
        "Each package is a one-time payment for one invitation. There is no subscription, and nothing is charged again.",
      ],
    },
    {
      id: "delivery",
      heading: "Delivery",
      body: [
        "Nothing is shipped. The package is delivered online, on the invitation you paid for, usually within a minute of the payment being confirmed, and you get a receipt or GST invoice on screen.",
        "If the package hasn't unlocked within an hour of paying, write to us with the payment ID and we will put it right or refund you in full.",
      ],
    },
    {
      id: "full-refund",
      heading: "Full refund within 7 days",
      body: [
        "Ask within 7 days of paying, and we refund the full amount if the invitation hasn't been sent to any guest yet: no guest has opened its link.",
        "Whatever the date, we also refund in full when:",
        {
          list: [
            "you were charged twice for the same package;",
            "you paid but the package never unlocked;",
            "a fault on our side stopped the invitation from working and we couldn't fix it in time for your event.",
          ],
        },
        "Once guests have opened the invitation, or after 7 days, the package has been used and isn't refunded.",
      ],
    },
    {
      id: "cancelling",
      heading: "Cancelling",
      body: [
        "To cancel a paid package, ask for a refund as above. When it is refunded, the invitation goes back to the package it had before, usually free, and keeps working within that package's limits.",
        "You can stop sharing or delete a free invitation, or your whole account, at any time from the site. Deleting does not refund a package by itself; ask us first if a refund applies.",
      ],
    },
    {
      id: "upgrades",
      heading: "Upgrades, coupons and offers",
      body: [
        "When you move up to a bigger package you pay only the difference, and a refund of an upgrade returns that difference.",
        "A refund returns what you actually paid, after any coupon or festival offer. Coupons can't be exchanged for cash.",
      ],
    },
    {
      id: "how-to-ask",
      heading: "How to ask for a refund",
      body: [
        "Write to us at the address below with the invitation's link and the payment ID from your receipt. We answer within 3 working days.",
        "Once approved, the money goes back to the UPI account, card or bank account you paid from, through Razorpay. Banks usually take 5 to 7 working days to show it.",
      ],
    },
    {
      id: "shagun",
      heading: "Money between guests and families",
      body: [
        "Shubh Invitation never collects or holds shagun or gifts sent between guests and families, so we can't refund them. Ask the person you paid.",
      ],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of use",
  description:
    "The rules for making, sharing and replying to invitations on Shubh Invitation, in plain words.",
  intro:
    "These terms apply when you use Shubh Invitation to make an invitation, open one, or reply to one. By using Shubh Invitation you agree to them.",
  sections: [
    {
      id: "the-service",
      heading: "What Shubh Invitation is",
      body: [
        "Shubh Invitation lets you make digital invitations, share them by link, and collect replies from guests. Guests do not need an account to open an invitation or reply. Shubh Invitation is in early access: features may change, and some may come and go while we improve them.",
      ],
    },
    {
      id: "accounts",
      heading: "Your account",
      body: [
        "You must be 18 or older and give a phone number or Google account that is yours. Keep sign-in codes to yourself; you are responsible for what is done from your account. Co-hosts you add can see and change the invitation and its guest list.",
      ],
    },
    {
      id: "your-content",
      heading: "What you put on invitations",
      body: [
        "Your wording, photos and guest lists stay yours. You give us permission to store them and show them to the people you share the invitation with, only to run the service.",
        "You agree to add only content you have the right to use, and guests who would expect to hear from you. Do not use Shubh Invitation to:",
        {
          list: [
            "Pretend to be someone else, or make an invitation for an event that is not real.",
            "Send spam, collect other people's details, or mislead guests into paying money.",
            "Post anything unlawful, hateful, obscene, or that disrespects any faith or community.",
          ],
        },
        "Music you upload must be your own recording, licensed to you, or free to use. If a music owner tells us a clip uses their work without permission, we remove it from the invitation and the invitation plays one of our ragas instead.",
        "We may remove an invitation or close an account that breaks these rules, and will tell the host why unless the law stops us.",
      ],
    },
    {
      id: "designs",
      heading: "Our designs, music and art",
      body: [
        "The designs, ornaments, sacred symbols, animations and music on Shubh Invitation belong to us or the people who licensed them to us. You may share invitations made with them; you may not copy them for other uses. Sacred symbols are drawn with care for their meaning, and are offered only for the occasions they belong to.",
      ],
    },
    {
      id: "money",
      heading: "Money",
      body: [
        "Making and sharing an invitation is free. Paid packages (Basic, Celebration and Grand) unlock more for one invitation, such as paid designs, more invites, the video and no watermark. Our pricing page lists what each includes.",
        "Prices are in Indian rupees and include GST. You pay once per invitation, through Razorpay, by UPI, card or netbanking; there is no subscription and nothing renews by itself. We never see or store your card details.",
        "The package unlocks as soon as the payment is confirmed. Refunds follow our refund and cancellation policy: a full refund within 7 days if the invitation hasn't been sent to any guest.",
        "We may change prices for future purchases, never for a package you have already bought. Shubh Invitation never holds money sent between guests and families.",
      ],
    },
    {
      id: "availability",
      heading: "No guarantees",
      body: [
        "We work hard to keep Shubh Invitation running and your invitations safe, but we provide it as it is and cannot promise it will never be interrupted. Please check important details, such as dates, times and venues, before you share an invitation. To the extent the law allows, we are not responsible for losses caused by an invitation being unavailable or wrong, and our total responsibility to you is limited to what you paid us in the last 12 months.",
      ],
    },
    {
      id: "ending",
      heading: "Stopping",
      body: [
        "You can stop using Shubh Invitation at any time and delete your account from your profile page. Deleting an account deletes its invitations, guest lists and replies, and their links stop working.",
      ],
    },
    {
      id: "law",
      heading: "Law and disputes",
      body: [
        "These terms are governed by the laws of India. Please write to us first so we can try to sort out any problem; if we cannot, the courts of India will decide.",
      ],
    },
    {
      id: "changes",
      heading: "Changes",
      body: [
        "If we change these terms, we will update the date at the top and tell hosts before important changes take effect. Continuing to use Shubh Invitation after that means you accept the new terms.",
      ],
    },
  ],
};
