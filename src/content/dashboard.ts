import { site } from "@/lib/site";

/* The host dashboard and co-hosts (Step 11). English copy; Hindi in src/content/hi/dashboard.ts. */

const plural = (count: number, one: string, many: string) =>
  count === 1 ? `1 ${one}` : `${count.toLocaleString("en-IN")} ${many}`;

export const dashboardCopy = {
  metaTitle: "Guests",
  back: "My invites",
  eyebrow: "Guest list",
  draftBadge: "Draft",
  liveBadge: "Live",
  cohostBadge: "Co-host",
  share: "Share",
  edit: "Edit invite",
  open: "Open invitation",
  guestsOnly: {
    title: "You're looking after the guests",
    body: "The family asked you to run the guest list and replies. Only they, or a co-host who edits, can change the card itself.",
  },
  notLive: {
    title: "This invite isn't live yet",
    body: "You can build your guest list now. Personal links and reminders work once it's published.",
    action: "Finish and publish",
  },

  stats: {
    label: "At a glance",
    guests: "Guests",
    guestsNote: (people: number) => `Invitations for ${plural(people, "person", "people")}`,
    opened: "Opened",
    openedNote: (count: number, of: number) => `${count} of ${of}`,
    replied: "Replied",
    waiting: "Waiting",
    waitingNote: "Haven't replied yet",
    percent: (value: number, of: number) => (of ? `${Math.round((value / of) * 100)}%` : "0%"),
  },

  functionsHeading: "Head count by celebration",
  coming: (count: number) => plural(count, "coming", "coming"),
  children: (count: number) => (count ? ` · ${plural(count, "child", "children")}` : ""),
  maybe: (count: number) => `${count} maybe`,
  declined: (count: number) => `${count} can't come`,
  waitingFor: (count: number) => `${count} to reply`,

  list: {
    heading: "Guests",
    search: "Search guests",
    searchPlaceholder: "Name, group or number",
    clearSearch: "Clear search",
    filterLabel: "Show",
    filters: {
      all: "Everyone",
      coming: "Coming",
      maybe: "Maybe",
      declined: "Can't come",
      waiting: "Waiting",
      "not-opened": "Not opened",
    },
    functionLabel: "Celebration",
    allFunctions: "All celebrations",
    showing: (shown: number, total: number) =>
      shown === total ? plural(total, "guest", "guests") : `${shown} of ${total} guests`,
    add: "Add guests",
    export: "Download CSV",
    remind: "Remind",
    empty: {
      title: "Your guest list starts here",
      body: "Add the people you're inviting to send each one a personal link and see who has opened it. Guests who reply from your shared link appear here too.",
    },
    noMatch: {
      title: "No guests match",
      body: "Try another name, or show everyone.",
      action: "Show everyone",
    },
  },

  guest: {
    party: (count: number) => plural(count, "person", "people"),
    selfAdded: "Replied from the shared link",
    opened: "Opened",
    notOpened: "Not opened",
    reminded: (when: string) => `Reminded ${when}`,
    notInvited: "Not invited",
    waiting: "Waiting",
    status: {
      attending: "Coming",
      maybe: "Maybe",
      declined: "Can't come",
    },
    people: (count: number) => ` · ${count}`,
    actions: (name: string) => `Actions for ${name}`,
    send: "Send",
    sendTo: (name: string) => `Send invitation to ${name} on WhatsApp`,
    remindTo: (name: string) => `Remind ${name} on WhatsApp`,
    sendInvite: "Send invitation",
    sendReminder: "Send reminder",
    copyLink: "Copy personal link",
    edit: "Edit guest",
    remove: "Remove guest",
    linkCopied: "Personal link copied",
    copyFailed: "Couldn't copy. Try again.",
  },

  form: {
    addTitle: "Add guests",
    editTitle: "Edit guest",
    oneTab: "One guest",
    pasteTab: "Paste a list",
    name: "Name",
    namePlaceholder: "Sharma uncle, Meera Iyer…",
    nameRequired: "Enter a name",
    phone: "WhatsApp number",
    phoneHint: "To send their personal link straight to them.",
    phoneInvalid: "That doesn't look like a phone number",
    group: "Group",
    groupPlaceholder: "Bride's family, office friends…",
    groupHint: "Helps you filter and plan seating.",
    partySize: "Invitation is for",
    partyHint: "How many people, including them.",
    fewer: "Fewer people",
    more: "More people",
    functions: "Invited to",
    functionsHint: "Leave all ticked to invite them to everything.",
    functionsRequired: "Choose at least one celebration",
    optional: "Optional",
    paste: "Your list",
    pasteHint:
      "One guest per line, with a number if you have it. Add (4) for a family of four. Up to 300 at a time.",
    pastePlaceholder: "Sharma uncle, 98765 43210 (4)\nMeera Iyer +91 98765 00000\nDadi",
    pasteGroup: "Group for everyone on this list",
    pasteSummary: (ok: number, bad: number) =>
      bad
        ? `${plural(ok, "guest", "guests")} ready. ${plural(bad, "line needs", "lines need")} fixing.`
        : `${plural(ok, "guest", "guests")} ready to add.`,
    pasteLine: (line: number) => `Line ${line}`,
    pasteNoName: "No name",
    pastePhone: "Number not recognised",
    pasteEmpty: "Paste or type at least one name",
    cancel: "Cancel",
    close: "Close",
    save: "Save guest",
    addOne: "Add guest",
    addMany: (count: number) => (count ? `Add ${plural(count, "guest", "guests")}` : "Add guests"),
    added: (count: number) => (count === 1 ? "Guest added" : `${count} guests added`),
    saved: "Guest saved",
    failed: "Couldn't save. Check your connection and try again.",
  },

  removeGuest: {
    title: "Remove this guest?",
    body: (name: string) =>
      `${name} comes off your list, with any reply they sent. Their personal link stops working.`,
    confirm: "Remove guest",
    cancel: "Keep",
    done: "Guest removed",
    failed: "Couldn't remove that guest. Try again.",
  },

  messages: {
    invite: (name: string, names: string, occasion: string, when: string) =>
      [
        `Dear ${name},`,
        `You're warmly invited to ${occasion ? `the ${occasion.toLowerCase()} of ` : ""}${names}.`,
        when,
        "This is your personal invitation. Please open it and let us know if you can come:",
      ]
        .filter(Boolean)
        .join("\n"),
    reminder: (name: string, names: string, occasion: string, when: string) =>
      [
        `Dear ${name},`,
        `A gentle reminder about ${occasion ? `the ${occasion.toLowerCase()} of ` : ""}${names}${when ? ` on ${when}` : ""}.`,
        "We'd love to know if you can join us. It takes a moment to reply here:",
      ].join("\n"),
  },

  reminders: {
    heading: "Reminders",
    body: (count: number) =>
      count
        ? `${plural(count, "guest hasn't", "guests haven't")} replied yet. Send each a gentle nudge on WhatsApp, from your own number.`
        : "Everyone on your list has replied. Nothing to chase.",
    open: "Send reminders",
    title: "Remind guests who haven't replied",
    description:
      "Each button opens WhatsApp with the message ready, addressed to that guest. Guests without a number get the message for you to send yourself.",
    message: "Message",
    messageHint: "Their name and personal link are added for each guest.",
    send: "Send",
    sent: "Sent",
    copy: "Copy",
    noPhone: "No number",
    lastReminded: (when: string) => `Last reminded ${when}`,
    done: "Done",
    close: "Close",
    automatic:
      "Automatic reminders by SMS and email arrive once text messaging is set up for India.",
  },

  hosts: {
    heading: "Co-hosts",
    body: "Family can run this invite with you. Choose what each person can do.",
    you: "You",
    owner: "Created the invite",
    cohost: "Co-host",
    unnamed: "Name not added yet",
    invite: "Invite a co-host",
    inviteTitle: "Invite a co-host",
    inviteBody:
      "We'll make a private link. Whoever opens it and signs in can help run this invite. Each link works once.",
    label: "Who is it for?",
    labelPlaceholder: "Meera's family, Arjun's brother…",
    labelHint: "Shown beside their name.",
    accessLabel: "What can they do?",
    access: {
      edit: {
        name: "Invite and guests",
        hint: "Change the card, functions and photos, publish, and run the guest list.",
        short: "Edits the invite",
      },
      guests: {
        name: "Guests and replies",
        hint: "Add guests, send reminders and see every reply. The card stays as you made it.",
        short: "Guests and replies",
      },
    },
    changeAccess: (name: string) => `What ${name} can do`,
    accessChanged: "Updated",
    phone: "Their WhatsApp number",
    phoneHint: "The link opens in a chat with them. Leave it empty to choose the chat yourself.",
    phoneInvalid: "That doesn't look like a phone number",
    seats: (used: number, limit: number) => `${used} of ${limit} co-host${limit === 1 ? "" : "s"}`,
    fullTitle: (limit: number) => `This edition includes ${limit} co-host${limit === 1 ? "" : "s"}`,
    fullBody: "Upgrade the invite for more, or withdraw a link you no longer need.",
    upgrade: "See editions",
    create: "Make link",
    creating: "Making link…",
    createFailed: "Couldn't make a link. Try again.",
    pending: "Waiting to join",
    pendingFor: (label: string) => (label ? `Link for ${label}` : "Co-host link"),
    whatsapp: "Send on WhatsApp",
    sentTo: (phone: string) => `For ${phone}`,
    copy: "Copy link",
    copied: "Link copied",
    withdraw: "Withdraw",
    withdrawLabel: (label: string) => `Withdraw ${label ? `the link for ${label}` : "this link"}`,
    withdrawn: "Link withdrawn",
    message: (names: string, url: string) =>
      `Please help me run the invitation for ${names} on ${site.name}. Open this link and sign in to see the guest list and replies:\n${url}`,
    remove: (name: string) => `Remove ${name}`,
    removeTitle: "Remove this co-host?",
    removeBody: (name: string) =>
      `${name} will no longer see this invite, its guest list or replies. You can invite them again later.`,
    removeConfirm: "Remove co-host",
    removed: "Co-host removed",
    leave: "Leave this invite",
    leaveTitle: "Leave this invite?",
    leaveBody:
      "You'll no longer see this invite, its guest list or replies. The family can invite you again.",
    leaveConfirm: "Leave invite",
    left: "You've left the invite",
    keep: "Cancel",
    failed: "Couldn't do that just now. Try again.",
    onlyOwner: "Only the person who created the invite can add co-hosts.",
  },

  csv: {
    name: "Name",
    phone: "Phone",
    group: "Group",
    partySize: "Invited",
    opened: "Opened",
    link: "Personal link",
    message: "Note",
    yes: "Yes",
    no: "No",
    people: (name: string) => `${name}: people`,
    status: {
      attending: "Coming",
      maybe: "Maybe",
      declined: "Can't come",
      waiting: "Waiting",
      "not-invited": "Not invited",
    },
  },
} as const;

export const joinCopy = {
  metaTitle: "Join as co-host",
  eyebrow: "Co-host invitation",
  title: (names: string) => `Help run ${names}'s invitation`,
  body: (who: string, occasion: string, access: "edit" | "guests") =>
    `${who || "The family"} asked you to help with the ${occasion.toLowerCase()} invitation. ${
      access === "edit"
        ? "As a co-host you can edit the invite, add guests, send reminders and see every reply."
        : "As a co-host you can add guests, send reminders and see every reply. The card stays as they made it."
    }`,
  forLabel: (label: string) => `Added as: ${label}`,
  accept: "Accept and open guest list",
  signIn: "Sign in to accept",
  signInNote: "Use your mobile number or Google. It takes a moment.",
  accepting: "Joining…",
  failed: "Couldn't accept just now. Try again.",
  full: "This invite already has all the co-hosts its edition includes. Ask the family to upgrade it or remove someone, then open this link again.",
  usedTitle: "This link has already been used",
  usedBody:
    "Co-host links work once. If you've already joined, the invite is in My invites. Otherwise ask the family for a new link.",
  myInvites: "Go to My invites",
  off: "Accounts open soon.",
} as const;
