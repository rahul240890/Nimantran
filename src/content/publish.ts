import { chatLines, detailLines, type ShareMessage } from "@/lib/publish/message";
import { site } from "@/lib/site";

/* Publishing, sharing and the guest page (Step 9). English copy, shaped for next-intl. */

export const publishCopy = {
  publish: "Publish",
  signInToPublish: "Sign in to publish",
  share: "Share",
  finishFirst: "Finish the steps marked above to publish.",
  dialogTitle: "Publish your invitation",
  dialogBody:
    "Guests open your invitation at this address. Once you share it, it stays the same, even if you edit the invite later.",
  linkLabel: "Invitation link",
  linkHint:
    "Letters, numbers and dashes. Type in any language and it's written in English letters.",
  checking: "Checking…",
  finding: "Finding a free link for you…",
  ready: "Made from your names, and it's yours.",
  change: "Change link",
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
  guestView: "See what guests see",
  edit: "Edit invite",
  messageLabel: "Message",
  messageHint:
    "Sent with the link. Change it however you like: *stars* make words bold in WhatsApp.",
  message: ({ names, occasion, when, where }: ShareMessage) =>
    chatLines([
      "✨ *You're warmly invited* ✨",
      "",
      occasion ? `to the ${occasion.toLowerCase()} of` : "",
      `*${names}*`,
      ...detailLines(when, where),
      "",
      "Please open your invitation and let us know if you can come 🙏",
    ]),
  previewHeading: "How it looks in WhatsApp",
  previewNote:
    "WhatsApp shows your invitation's picture, title and date above the message. When you send it, wait a moment for the picture to appear in WhatsApp before pressing send.",
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
  changeGate: "Change the opening gate",
} as const;

export const guestCopy = {
  metaTitle: (names: string, occasion: string) => `${names} · ${occasion} invitation`,
  metaDescription: (when: string, where: string) =>
    [when, where].filter(Boolean).join(" · ") ||
    "You're invited. Open the invitation to see the details.",
  invited: "You're invited",
  openHint: "Tap the card to open it",
  doorway: {
    open: "Open the invitation",
    again: "Open it again",
    counting: "Counting down to the celebration",
    details: "See the details",
    skip: "Continue",
  },
  countdown: {
    days: (n: number) => `${n} days to go`,
    tomorrow: "Tomorrow",
    today: "Today",
  },
  reply: "Reply to the invitation",
  functions: "The celebrations",
  family: "With love from the family",
  cardLanguage: "Card language",
  timeRange: (start: string, end: string) => `${start} to ${end}`,
  when: "When",
  where: "Where",
  dressCode: "Dress code",
  directions: "Directions",
  parking: "Parking",
  showMap: "Map",
  hideMap: "Hide map",
  mapTitle: (place: string) => `Map of ${place}`,
  /** The event-day banner: what is on now, or later today. */
  eventDay: {
    now: "Happening now",
    later: "Later today",
    at: (name: string, time: string) => (time ? `${name} at ${time}` : name),
    details: "Details",
    dismiss: "Hide this banner",
  },
  addToCalendar: "Add to calendar",
  googleCalendar: "Google Calendar",
  appleCalendar: "Apple, Outlook and others",
  addAll: "Add all to calendar",
  photos: "Photos",
  photoAlt: (index: number) => `Photo ${index} from the family`,
  /** The photos' carousel below the card. */
  carousel: {
    label: "slideshow",
    previous: "Previous photo",
    next: "Next photo",
    pause: "Pause the photos",
    play: "Play the photos",
    position: (index: number, total: number) => `Photo ${index} of ${total}`,
  },
  previewMark: "Preview · Not sent yet",
  madeWith: `Made with ${site.shortName}`,
  createYours: "Create your own invitation",
  /** On a live invitation, for guests with a celebration of their own (owner, 2026-10-24). */
  makeOwnTitle: "Planning a celebration of your own?",
  makeOwn: "Make an invitation like this",
  makeOwnNote: "Free to try. Pay only when you send.",
  notFoundTitle: "This invitation isn't available",
  notFoundBody:
    "The link may be mistyped, or the family may have stopped sharing it. Ask them to send it again.",
  home: `Go to ${site.shortName}`,
  /** One Scene (pilot): the whole invitation on one painting. */
  scene: {
    label: "The celebrations, one by one",
    previous: "Previous celebration",
    next: "Next celebration",
    pause: "Pause the celebrations",
    play: "Play the celebrations",
    position: (n: number, total: number) => `${n} of ${total}`,
    details: "All the details",
    initials: "Your photo goes here",
  },
  /** The themed page below the painted pages (Step 12q). */
  themed: {
    invitedTo: "With joy, we invite you to celebrate",
    /** The flowers a guest gives after the welcome, one way per theme (blessings.ts). */
    flowersLabel: "Your blessing",
    flowersTitle: "Send them your flowers",
    flowers: {
      shower: { give: "Shower the flowers", given: "Your flowers are falling all around them." },
      basket: {
        give: "Toss a basket of petals",
        given: "Your petals are scattered at their feet.",
      },
      urli: {
        give: "Float a flower in the urli",
        given: "Your flower floats in the urli. Add another if you like.",
      },
      garland: { give: "Thread a garland", given: "Your garland is ready for them." },
      lotus: { give: "Open the lotus", given: "The lotus has opened with your blessing." },
      bouquet: { give: "Send a bouquet", given: "Your bouquet has bloomed for them." },
      branch: {
        give: "Make the branch blossom",
        given: "The branch has blossomed with your wishes.",
      },
      rangoli: {
        give: "Lay a flower rangoli",
        given: "Your flower rangoli is laid at their door.",
      },
      boat: { give: "Send a boat of flowers", given: "Your flowers are sailing down to them." },
      popper: {
        give: "Pop the flower popper",
        given: "Your petals have burst over the celebration.",
      },
      gift: { give: "Open a gift of flowers", given: "Your gift of flowers has opened for them." },
      butterflies: {
        give: "Send the butterflies",
        given: "The butterflies are carrying your petals to them.",
      },
      heart: {
        give: "Gather a heart of petals",
        given: "Your heart of petals is beating for them.",
      },
      chadar: {
        give: "Shake the canopy of flowers",
        given: "Petals are falling from the canopy for them.",
      },
      whirl: {
        give: "Spin a whirl of petals",
        given: "Your petals are whirling their way to them.",
      },
    },
    music: { play: "Play the music", pause: "Pause the music" },
    lampsLabel: "Light a lamp for the couple",
    /** The light a guest gives at night, one way per theme (blessings.ts). */
    lights: {
      diyas: { give: "Light the diyas", given: "Thank you. Your diyas are glowing for them." },
      lanterns: {
        give: "Light the lanterns",
        given: "Thank you. Your lanterns are glowing for them.",
      },
      nilavilakku: { give: "Light the lamp", given: "Thank you. Your lamp is lit for them." },
      fairy: { give: "Switch on the lights", given: "Thank you. The lights are on for them." },
      river: {
        give: "Float the diyas",
        given: "Thank you. Your diyas are floating down the river.",
      },
      sky: {
        give: "Let the sky lanterns go",
        given: "Thank you. Your lanterns are rising with your wishes.",
      },
      spiral: {
        give: "Light the circle of diyas",
        given: "Thank you. The circle of diyas is glowing for them.",
      },
      stambh: {
        give: "Light the deepstambh",
        given: "Thank you. The deepstambh is alight for them.",
      },
      akash: {
        give: "Light the star lantern",
        given: "Thank you. The star lantern is shining for them.",
      },
      candles: {
        give: "Light the candles",
        given: "Thank you. Your candles are burning for them.",
      },
      fireflies: {
        give: "Open the jar of fireflies",
        given: "Thank you. The fireflies are lighting up the night.",
      },
      jaali: {
        give: "Light the jaali lantern",
        given: "Thank you. The lantern is scattering stars for them.",
      },
      sparklers: {
        give: "Light the sparklers",
        given: "Thank you. The sparklers are shining for them.",
      },
      chandelier: {
        give: "Light the chandelier",
        given: "Thank you. The chandelier is lit for them.",
      },
    },
    blessingLabel: "With the blessings of our elders",
    eventsLabel: "From morning to night",
    saveDateLabel: "Mark your calendar",
    saveDate: "Save the date",
    photosLabel: "Memories",
    familyLabel: "Together with",
    replyLabel: "Your reply",
    closing: "Your presence is the greatest gift. We look forward to celebrating with you.",
  },
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
  previewOnly: "This is your preview, so nothing was sent. Guests can reply once you publish.",
  previewNotice:
    "This is a preview, so replies are off. Guests can reply once the invitation is sent.",
  full: "Replies on this invitation are full for now. Please send your reply to the family directly.",
  tooMany:
    "A lot of new replies have come from this network just now. Please try again in an hour, or send your reply to the family directly.",
  fixErrors: (count: number) =>
    count === 1 ? "One answer still needs you." : `${count} answers still need you.`,
  thanksTitle: (name: string) => `Thank you, ${name}!`,
  thanksBody: "Your reply is with the family. You can change it here any time.",
  sampleSent:
    "This is a sample, so nothing was sent. On your own invitation, every reply comes straight to you.",
  change: "Change my reply",
  people: (count: number) => (count === 1 ? "1 person" : `${count} people`),
} as const;

export const repliesCopy = {
  heading: "Replies",
  intro: "Updates as guests reply. The guest list has everyone, with reminders and co-hosts.",
  all: "Open guest list",
  none: "No replies yet. They appear here as soon as guests answer.",
  coming: (count: number) => (count === 1 ? "1 coming" : `${count} coming`),
  maybe: (count: number) => `${count} maybe`,
  declined: (count: number) => `${count} can't come`,
  latest: "Latest replies",
  more: (count: number) => `and ${count} more`,
} as const;

export const videoCopy = {
  metaTitle: "Your invitation video",
  loading: "Getting your video ready",
  back: "Back to your invite",
  heading: "Invitation video",
  body: "Your invitation as a vertical video with its raga: the opening as guests see it, the welcome with your names, then every page. Share it on WhatsApp, Instagram or anywhere else. It's made on this phone or computer, so nothing is uploaded, and it stays here when you come back.",
  poster: "The video's first moment",
  music: "With the raga",
  make: "Make video",
  making: (percent: number) => `Making your video: ${percent}%`,
  stop: "Stop",
  stopped: "Video stopped",
  ready: "Your video is ready",
  changed:
    "Your invitation has changed since this video was made. Make it again to include the changes.",
  finishing: "Finishing the video you made, so it ends on your invitation's link.",
  unfinished:
    "This video was made before your invitation was live, so it doesn't end on its link. Make it again, then download or share it.",
  player: (names: string) => `Video invitation for ${names}`,
  share: "Share video",
  download: "Download MP4",
  again: "Make it again",
  fullScreen: "Full screen",
  watchFullScreen: "Watch the video full screen",
  remove: "Delete video",
  removeTitle: "Delete this video?",
  removeBody:
    "It's removed from this phone or computer. Your invitation stays as it is, and you can make the video again any time.",
  removeConfirm: "Delete video",
  keep: "Keep it",
  removed: "Video deleted",
  /** Download needs a package with the video, on a live invite (owner, 2026-10-16). */
  downloadLocked: "Download MP4",
  lockedPackage: "Downloading comes with Celebration and Grand.",
  lockedPublish: "Download once your invitation is live: the video ends on its link.",
  failed: "Couldn't make the video. Try again, or try Chrome or Safari.",
  unsupported:
    "This browser can't make videos. Open this page in Chrome, Edge or the latest Safari.",
  noSound:
    "This browser can't add music to videos, so the video will be silent. Chrome or Edge add the raga.",
  mark: `Made with ${site.shortName}`,
  makePreview: "Make a free preview",
  preview: "Free preview",
  previewNote:
    "Watch your whole video here for free. This preview carries a “Made with Shubh” mark; the Celebration and Grand packages download and share it clean.",
  upgrade: "Get the clean video",
  draftNote:
    "Publish your invitation to download and share this video. It ends with your invitation's link, which you get when you publish.",
  publish: "Publish your invitation",
  which: "Which video",
  whole: "The whole invitation",
  ending: {
    open: "Open the invitation",
    /** Above Shubh's name in the video's sign-off. */
    madeWith: "Made with love on",
    tagline: "Invitations that come alive.",
  },
  shareText: (names: string) => `${names}: our invitation`,
  fileName: (slug: string) => `${slug}-invitation.mp4`,
  changeGate: "Change the opening gate",
} as const;

export const hostPreviewCopy = {
  metaTitle: "Your invite, as guests will see it",
  label: "Preview: this is what your guests will see",
  back: "Keep editing",
  next: "Choose a package and publish",
  share: "Share your invite",
  heading: "This is what your guests will see",
  body: "Guests tap your link in WhatsApp and the invitation fills their phone screen like a reel, with your music. Press Open the invitation on the phone to watch it the way they will.",
  phone: "Your invitation on a phone",
  fullScreen: "See it full screen",
  menu: "Preview options",
  opening: "Opening your invitation",
  changeGate: "Change the opening gate",
  marked:
    "Until it's sent, this preview says Preview across every screen and replies are off. Guests get the invitation clean.",
} as const;

/** A family preview link (/family/<token>): the invitation before it is sent. */
export const familyCopy = {
  metaTitle: (names: string) => (names ? `${names}: invitation preview` : "Invitation preview"),
  badge: "Preview · not sent to guests yet",
  metaDescription:
    "A preview for the family to check. It hasn't been sent to guests yet, and replies are off.",
} as const;
