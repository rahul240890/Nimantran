/*
 * English copy for the pricing, contact and blog pages. Hindi: src/content/hi/pages.ts.
 * Titles stay under 48 characters, as " · Shubh Invitation" is added to them.
 */

export const pricingPageCopy = {
  title: "Pricing for digital invitations",
  description:
    "Make and share an invitation free. Premium from ₹499 per invitation, Royal ₹1,999 and the Wedding bundle ₹2,999, GST included. No subscription.",
  crumb: "Pricing",
  eyebrow: "Pricing",
  heading: "One price per invitation. No subscription.",
  intro:
    "Make your invitation and share it free. When you want more functions, more photos or the video, upgrade that one invitation.",
  editionsHeading: "Editions",
  editionsIntro: "Every edition has every design, WhatsApp sharing and one-tap RSVP for guests.",
  free: "to start",
  perInvite: "per invitation",
  bestFor: "Best for",
  popular: "Most chosen",
  notesHeading: "Good to know",
  notes: [
    "Prices are in rupees and include GST. You get a GST invoice.",
    "Pay by UPI, card or netbanking, securely through Razorpay.",
    "Start on Free and upgrade later: you pay only the difference.",
    "Full refund within 7 days if your invitation hasn't been sent to any guest.",
  ],
  refundsLink: "Read the refund policy",
  faqHeading: "Questions about pricing",
  faq: [
    {
      q: "Is it really free to make an invitation?",
      a: 'Yes. You can make an invitation with one function, share it on WhatsApp and collect replies without paying. Free invitations carry a small "Made with Shubh" mark.',
    },
    {
      q: "Is this a subscription?",
      a: "No. You pay once for one invitation, and nothing renews or charges again.",
    },
    {
      q: "Which edition do I need for a wedding?",
      a: "Premium covers up to three functions. For a wedding with haldi, mehendi, sangeet, the wedding and a reception, choose Royal or the Wedding bundle.",
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
    { text: "What each edition costs", id: "pricing" },
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
  morePosts: "More to read",
} as const;
