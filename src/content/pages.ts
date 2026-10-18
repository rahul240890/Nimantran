/*
 * English copy for the pricing, contact and blog pages. Hindi: src/content/hi/pages.ts.
 * Titles stay under 48 characters, as " · Shubh Invitation" is added to them.
 */

export const pricingPageCopy = {
  title: "Pricing for digital invitations",
  description:
    "Make and share an invitation free. Three packages per invitation, Basic, Celebration and Grand, priced on your design, taxes included. No subscription.",
  crumb: "Pricing",
  eyebrow: "Pricing",
  heading: "One price per invitation. No subscription.",
  intro:
    "Make your invitation and share it free. When you want no watermark, the invitation video or more invites, choose a package for that one invitation.",
  editionsHeading: "Packages",
  editionsIntro:
    "Basic is your design's own price. Celebration and Grand add a fixed amount on top. The prices below are for a Premium design.",
  onDesign: (price: string) => `with a ${price} design`,
  addOn: (price: string) => `Design + ${price}`,
  freeDesign: "₹0 with a free design",
  byDesignHeading: "Prices for every kind of design",
  byDesignIntro:
    "Each design's badge says whether it's Free, Premium, Royal or Signature. Find its row for what each package costs on it.",
  designColumn: "Design",
  free: "Free",
  bestFor: "Best for",
  popular: "Recommended for weddings",
  notesHeading: "Good to know",
  notes: [
    "Prices are in rupees and include any taxes. You get a receipt for every payment.",
    "Pay by UPI, card or netbanking, securely through Razorpay.",
    "Start free and move up later: you pay only the difference.",
    "Full refund within 7 days if no guest has opened your invitation yet.",
  ],
  refundsLink: "Read the refund policy",
  faqHeading: "Questions about pricing",
  faq: [
    {
      q: "Is it really free to make an invitation?",
      a: 'Yes. Make an invitation with any free design, with every function, share it on WhatsApp and collect replies without paying. Free invitations carry a small "Made with Shubh" in the corner.',
    },
    {
      q: "Is this a subscription?",
      a: "No. You pay once for one invitation, and nothing renews or charges again.",
    },
    {
      q: "Which package do I need for a wedding?",
      a: "Every package covers every function. For most weddings we suggest Celebration, for the invitation video and more invites; Grand adds unlimited invites and a video for every function.",
    },
    {
      q: "Do guests pay anything?",
      a: "Never. Guests open the invitation and reply free, without an app or signing in.",
    },
  ],
  create: "Start free",
} as const;

export const contactPageCopy = {
  title: "Contact Shubh Invitation",
  description:
    "Write to Shubh Invitation about your invitation, a payment or refund, or your data. Our email, business name and address.",
  crumb: "Contact",
  heading: "Contact us",
  intro:
    "Questions about your invitation, a payment or your data? Write to us and a person will reply.",
  emailHeading: "Email",
  emailNote: "We reply within 3 working days, and within 1 working day about a payment.",
  emailPending:
    "Our email address will appear here before launch. Until then, reply to any message from the Shubh Invitation team.",
  whatsappHeading: "WhatsApp",
  whatsappAction: "Chat with us on WhatsApp",
  whatsappText: "Hello Shubh Invitation, I have a question about my invitation.",
  whatsappNote:
    "Send your question with your invitation's link, if you have one. A person replies.",
  businessHeading: "Business details",
  legalName: "Business name",
  address: "Address",
  phone: "Phone",
  gstin: "GSTIN",
  helpHeading: "Before you write",
  help: [
    { text: "Payments, cancelling and refunds", id: "refunds" },
    { text: "Your data, and deleting it", id: "privacy" },
    { text: "The rules for using the site", id: "terms" },
    { text: "What each package costs", id: "pricing" },
  ],
  includeHeading: "Help us help you quickly",
  include: [
    "The link to your invitation, such as /i/aarav-weds-meera.",
    "For a payment, the payment ID from your receipt.",
    "The phone number or email you sign in with.",
  ],
} as const;

export const blogCopy = {
  title: "Invitation wording and ideas blog",
  description:
    "Invitation wording, WhatsApp messages and planning guides for weddings, haldi, mehendi, birthdays and every Indian celebration.",
  crumb: "Blog",
  eyebrow: "Blog",
  heading: "Wording and ideas for every invitation",
  intro:
    "Messages to copy, guides to planning each function, and how to send invitations your guests will love opening.",
  postsHeading: "Latest posts",
  otherLanguage: "हिंदी में लेख",
  otherLanguageLang: "hi",
  minutes: (count: number) => `${count} min read`,
  published: "Published",
  updated: "Updated",
  /** Above the post's question answered in two or three sentences. */
  inShort: "In short",
  onThisPage: "On this page",
  faqHeading: "Questions",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Couldn't copy. Select the text and copy it yourself.",
  ctaHeading: (occasion: string) => `Make your ${occasion.toLowerCase()} invitation`,
  ctaBody:
    "Choose a design, add your words and functions, and send it on WhatsApp. Guests reply in one tap. Free to start.",
  ctaCreate: "Create your invitation",
  ctaDesigns: (occasion: string) => `See ${occasion.toLowerCase()} designs`,
  /** Above a few designs for the post's occasion, each opening as a live invitation. */
  sampleDesigns: (occasion: string) => `${occasion} designs to open as a guest`,
  morePosts: "More to read",
} as const;
