import type { CategoryId } from "@/lib/categories/catalog";
import type { TraditionId } from "@/lib/traditions/schema";

/*
 * Words for the public pages search engines index (docs/BRAND_SEO.md, sections 5 and 6):
 * one page per occasion, tradition and design, and the design gallery. Titles stay under
 * 48 characters, as " · Shubh Invitation" is added to them; descriptions under 155.
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
    title: "Invitation designs: Scenes, Stories, 3D cards",
    description:
      "Search every design by occasion, wedding tradition and kind: painted Scenes, Stories and 3D cards. Share on WhatsApp and collect RSVPs.",
    heading: "Find your invitation design",
    intro:
      "Every design in one place. Search, or narrow by occasion, wedding tradition and kind, then tap Use this design.",
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
    birthday: {
      title: "Birthday invitation card online",
      description:
        "Create a birthday invitation with painted pages, music and one-tap RSVP. Share it on WhatsApp and know who is coming to the party.",
      heading: "Birthday invitations full of balloons and cake",
      intro:
        "Write the birthday name once, add the time and place, and send one link. Guests open painted pages and reply in a tap.",
    },
    anniversary: {
      title: "Anniversary invitation card online",
      description:
        "Create a wedding anniversary invitation with painted pages, music and one-tap RSVP, shared on WhatsApp.",
      heading: "Anniversary invitations for years together",
      intro:
        "Celebrate a silver or golden anniversary with a card the family opens and turns, with directions and replies in one place.",
    },
    party: {
      title: "Party invitation card online",
      description:
        "Create a party invitation with painted night-time pages, music and one-tap RSVP. Share it on WhatsApp and count your guests.",
      heading: "Party invitations for a night to remember",
      intro:
        "Name the party, add the time and place, and send one link. Guests see the evening's page, directions and a reply button.",
    },
    "baby-shower": {
      title: "Baby shower invitation card online",
      description:
        "Create a baby shower or godh bharai invitation with soft painted pages, music and one-tap RSVP. Share it on WhatsApp.",
      heading: "Baby shower invitations as gentle as a cradle",
      intro:
        "Write the mother-to-be's name, add the time and place, and send one link. Family open pastel pages with her photo and reply in a tap.",
    },
    diwali: {
      title: "Diwali party invitation card online",
      description:
        "Create a Diwali invitation with painted pages of diyas and rangoli, Lakshmi and Ganesha's blessing, music and one-tap RSVP.",
      heading: "Diwali invitations that glow like a row of diyas",
      intro:
        "Invite family and friends to Lakshmi puja and dinner with one link. Guests see the evening, directions and a reply button.",
    },
    housewarming: {
      title: "Griha pravesh invitation card online",
      description:
        "Create a housewarming invitation with painted pages, music and one-tap RSVP. Share it on WhatsApp with directions to the new home.",
      heading: "Housewarming invitations for a new beginning",
      intro:
        "Name the home, add the puja time and the address, and send one link. Guests get directions and reply in a tap.",
    },
    puja: {
      title: "Puja and katha invitation card online",
      description:
        "Invite family to a Satyanarayan katha, havan or mata ki chowki with painted pages, bhajans and one-tap RSVP on WhatsApp.",
      heading: "Puja invitations with the blessings first",
      intro:
        "Name the puja, add the time and place, and send one link. Family see the aarti time, directions and a reply button.",
    },
    "thread-ceremony": {
      title: "Thread ceremony invitation card online",
      description:
        "Create an upanayan or janeu invitation with painted pages and one-tap RSVP. Share it on WhatsApp.",
      heading: "Thread ceremony invitations full of blessings",
      intro:
        "Write his name, add the muhurat and place, and send one link. Family reply in a tap and get directions.",
    },
    annaprashan: {
      title: "Annaprashan invitation card online",
      description:
        "Create an annaprashan or mukhe bhaat invitation with soft painted pages and one-tap RSVP. Share it on WhatsApp.",
      heading: "Annaprashan invitations for the first rice",
      intro:
        "Write the baby's name, add the time and place, and send one link. Family see the baby's photo and reply in a tap.",
    },
    christening: {
      title: "Christening and baptism invitation card online",
      description:
        "Create a christening or baptism invitation with soft painted pages of lilies and doves, and one-tap RSVP on WhatsApp.",
      heading: "Christening invitations as gentle as white lilies",
      intro:
        "Write the baby's name, add the church and lunch times, and send one link with directions.",
    },
    "prayer-meet": {
      title: "Prayer meeting and shraddhanjali invitation",
      description:
        "Share a prayer meeting or chautha invitation with a calm painted page, the time and place, and directions, in one WhatsApp link.",
      heading: "Prayer meeting invitations, quiet and simple",
      intro:
        "Write their name, add the time and place, and send one link so family and friends can join and find the way.",
    },
    retirement: {
      title: "Retirement party invitation card online",
      description:
        "Create a retirement invitation with painted pages, music and one-tap RSVP for family and colleagues. Share it on WhatsApp.",
      heading: "Retirement invitations for the next chapter",
      intro:
        "Write their name, add the time and place, and send one link. Colleagues and family reply in a tap.",
    },
    "farewell-party": {
      title: "Farewell party invitation card online",
      description:
        "Create a farewell or graduation party invitation with painted pages, music and one-tap RSVP. Share it on WhatsApp.",
      heading: "Farewell invitations for one last evening",
      intro:
        "Name the batch or the guest of honour, add the time and place, and send one link. Everyone replies in a tap.",
    },
    "shop-opening": {
      title: "Shop opening invitation card online",
      description:
        "Create an inauguration invitation for a shop, office or restaurant with painted pages and one-tap RSVP. Share it on WhatsApp.",
      heading: "Opening invitations for a grand first day",
      intro: "Name the business, add the puja and opening time, and send one link with directions.",
    },
    launch: {
      title: "Launch event invitation card online",
      description:
        "Create a product launch or office event invitation with painted pages and one-tap RSVP. Share it on WhatsApp and count your guests.",
      heading: "Launch invitations for the big reveal",
      intro:
        "Name the event, add the time and venue, and send one link. Guests reply in a tap and get directions.",
    },
    "ganesh-chaturthi": {
      title: "Ganesh Chaturthi invitation card online",
      description:
        "Invite family for Ganpati darshan and aarti with painted pages, bhajans and one-tap RSVP. Share it on WhatsApp.",
      heading: "Ganpati invitations to welcome Bappa home",
      intro:
        "Add the darshan days and aarti times, and send one link. Guests get directions and reply in a tap.",
    },
    navratri: {
      title: "Navratri and Durga Puja invitation card",
      description:
        "Create a garba night or Durga Puja invitation with painted pages, music and one-tap RSVP. Share it on WhatsApp.",
      heading: "Navratri invitations for nine bright nights",
      intro:
        "Add the nights, the aarti time and the venue, and send one link. Guests reply in a tap.",
    },
    janmashtami: {
      title: "Janmashtami invitation card online",
      description:
        "Invite family to Krishna's birthday with painted pages of flutes and peacock feathers, bhajans and one-tap RSVP.",
      heading: "Janmashtami invitations for Kanha's birthday",
      intro:
        "Add the bhajan and aarti time, and send one link. Guests get directions and reply in a tap.",
    },
    onam: {
      title: "Onam invitation card online",
      description:
        "Invite friends to an Onam sadhya with painted pages of pookalam and kasavu, music and one-tap RSVP.",
      heading: "Onam invitations as bright as a pookalam",
      intro: "Add the sadhya time and place, and send one link. Guests reply in a tap.",
    },
    sankranti: {
      title: "Makar Sankranti and Pongal invitation card",
      description:
        "Invite friends to Uttarayan kites or a Pongal lunch with painted pages and one-tap RSVP. Share it on WhatsApp.",
      heading: "Sankranti invitations for kites and pongal",
      intro:
        "Add the time and the terrace or home address, and send one link. Guests reply in a tap.",
    },
    lohri: {
      title: "Lohri invitation card online",
      description:
        "Invite family to a Lohri bonfire with painted pages, dhol and one-tap RSVP, for a first Lohri too. Share it on WhatsApp.",
      heading: "Lohri invitations around the bonfire",
      intro: "Add the time and place, and send one link. Guests get directions and reply in a tap.",
    },
    eid: {
      title: "Eid and iftar invitation card online",
      description:
        "Create an iftar dawat or Eid milan invitation with painted pages of lanterns and crescent moons, and one-tap RSVP on WhatsApp.",
      heading: "Iftar and Eid invitations under the crescent moon",
      intro: "Add the iftar time and the address, and send one link. Guests reply in a tap.",
    },
    "naming-ceremony": {
      title: "Naming ceremony invitation card online",
      description:
        "Invite family to a naming ceremony or barsa with painted pages, the baby's name and one-tap RSVP. Share it on WhatsApp.",
      heading: "Naming ceremony invitations for the little one",
      intro: "Add the time and the address, and send one link. Guests reply in a tap.",
    },
    holi: {
      title: "Holi party invitation card online",
      description:
        "Invite friends to play Holi with painted pages full of colour and one-tap RSVP. Share it on WhatsApp.",
      heading: "Holi invitations full of colour",
      intro: "Add the time and the place, and send one link. Guests reply in a tap.",
    },
    christmas: {
      title: "Christmas party invitation card online",
      description:
        "Invite family and friends to a Christmas party with painted pages, carols and one-tap RSVP. Share it on WhatsApp.",
      heading: "Christmas invitations with carols and cake",
      intro: "Add the time and the address, and send one link. Guests reply in a tap.",
    },
    reunion: {
      title: "School and college reunion invitation online",
      description:
        "Bring the old batch together with a painted invitation, one link and one-tap RSVP. Share it on WhatsApp.",
      heading: "Reunion invitations for the old gang",
      intro: "Add the time and the place, and send one link. Friends reply in a tap.",
    },
    graduation: {
      title: "Graduation party invitation card online",
      description:
        "Celebrate a graduate with a painted invitation, one link and one-tap RSVP. Share it on WhatsApp.",
      heading: "Graduation invitations for a proud day",
      intro: "Add the time and the place, and send one link. Guests reply in a tap.",
    },
    "gudi-padwa": {
      title: "Gudi Padwa and Ugadi invitation card online",
      description:
        "Invite family for Gudi Padwa or Ugadi with painted pages of the gudi, neem and rangoli, and one-tap RSVP on WhatsApp.",
      heading: "Gudi Padwa and Ugadi invitations for the new year",
      intro: "Add the time and the address, and send one link. Guests reply in a tap.",
    },
    baisakhi: {
      title: "Baisakhi invitation card online",
      description:
        "Invite family to a Baisakhi celebration with painted pages of the harvest and bhangra, and one-tap RSVP on WhatsApp.",
      heading: "Baisakhi invitations for the harvest",
      intro: "Add the time and the place, and send one link. Guests reply in a tap.",
    },
    bihu: {
      title: "Bihu invitation card online",
      description:
        "Invite family to Rongali Bihu with painted pages of gamosa, dhol and kopou flowers, and one-tap RSVP on WhatsApp.",
      heading: "Bihu invitations for the Assamese new year",
      intro: "Add the time and the place, and send one link. Guests reply in a tap.",
    },
    "raksha-bandhan": {
      title: "Raksha Bandhan invitation card online",
      description:
        "Invite the family to Raksha Bandhan with a card that holds the sister's photo and the brother's, and one-tap RSVP on WhatsApp.",
      heading: "Raksha Bandhan invitations for sisters and brothers",
      intro: "Add both photos, the time and the place, and send one link. Guests reply in a tap.",
    },
    "karva-chauth": {
      title: "Karva Chauth invitation card online",
      description:
        "Invite the family to the Karva Chauth puja and moonrise with a card that holds both your photos, and one-tap RSVP on WhatsApp.",
      heading: "Karva Chauth invitations under the moon",
      intro: "Add both photos, the time and the place, and send one link. Guests reply in a tap.",
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
