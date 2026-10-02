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
      seen: "Opened, no reply",
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
    openedWhen: (when: string) => `Opened ${when}`,
    visits: (count: number) => (count > 1 ? ` · ${count} visits` : ""),
    firstOpened: (when: string) => `First opened ${when}`,
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
    importTab: "Import",
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

  importer: {
    intro:
      "Bring guests in from your phone's contacts, an Excel or CSV sheet, or a contacts file. Each one gets their own personal link.",
    contacts: "Choose from contacts",
    contactsHint: "Opens your phone's contacts. Nothing is shared until you add guests.",
    contactsFailed: "Couldn't open your contacts. Try a file instead.",
    file: "Choose a file",
    fileHint: "Excel (.xlsx), CSV or contacts (.vcf), up to 2,000 guests.",
    noContactsHint:
      "On an iPhone, open Contacts, select people, tap Share and save the contacts file. Then choose it here.",
    reading: "Reading your file…",
    unreadable: "We couldn't read that file. Save it as Excel (.xlsx) or CSV and try again.",
    oldExcel: "That's an older Excel file. In Excel choose Save As, then Excel Workbook (.xlsx).",
    empty: "No guests found in that file.",
    from: (source: string) => `From ${source}`,
    contactsSource: "your contacts",
    another: "Choose another",
    nameColumn: "Name column",
    phoneColumn: "Number column",
    noColumn: "None",
    firstAndLast: (first: string, last: string) => `${first} + ${last}`,
    column: (label: string) => `Column ${label}`,
    selectAll: "Select all",
    summary: (picked: number, total: number) => `${picked} of ${total} selected`,
    duplicate: "Already on your list",
    noName: "No name",
    badPhone: "Number not recognised",
    noPhone: "No number",
    party: (count: number) => (count > 1 ? `${count} people` : ""),
    add: (count: number) => (count ? `Add ${plural(count, "guest", "guests")}` : "Add guests"),
    adding: (done: number, total: number) => `Adding ${done} of ${total}…`,
    added: (count: number) =>
      `${plural(count, "guest", "guests")} added, each with a personal link`,
    partial: (done: number, total: number) =>
      `${done} of ${total} guests added. Check your connection and add the rest again.`,
    nothingPicked: "Tick at least one guest to add",
  },

  opens: {
    heading: "Who's opened it",
    body: "Everyone you send a personal link to shows up here when they open it.",
    none: "Nobody has opened their personal link yet. Send links from the guest list.",
    noGuests: "Add guests to send each one a personal link and see when they open it.",
    replied: "Replied",
    noReply: "No reply yet",
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

  schedule: {
    heading: "Scheduled sending",
    body: (count: number) =>
      count
        ? `${plural(count, "send is", "sends are")} planned. When the time comes your calendar reminds you, and every message is ready here.`
        : "Pick a day and time to send your invitations or a reminder. Your calendar reminds you, and every message is ready here.",
    notLive: "Publish your invite to plan when it goes out.",
    add: "Schedule a send",
    limit: "That's as many as can wait at once. Send or cancel one first.",
    planTitle: "Schedule a send",
    planDescription:
      "At this time your phone reminds you, and each guest's WhatsApp message with their personal link is ready to send from your number.",
    what: "What to send",
    purposes: {
      invite: "Invitations",
      reminder: "Reminder",
    },
    purposeHints: {
      invite: "Everyone on your guest list",
      reminder: "Only guests who haven't replied yet",
    },
    forLabel: "For",
    everything: "All celebrations",
    date: "Date",
    datePlaceholder: "Pick a day",
    time: "Time",
    timeHint: "India Standard Time",
    save: "Schedule",
    cancel: "Cancel",
    past: "That time has already passed. Pick a later one.",
    missing: "Pick a day and a time.",
    failed: "Couldn't schedule that. Please try again.",
    savedTitle: "Scheduled",
    savedBody: (when: string) =>
      `Planned for ${when}. Add it to your calendar so your phone reminds you when it's time.`,
    google: "Add to Google Calendar",
    apple: "Apple or Outlook calendar",
    done: "Done",
    label: (purpose: "invite" | "reminder", fn: string | null) =>
      `${purpose === "invite" ? "Invitations" : "Reminder"}${fn ? ` · ${fn}` : ""}`,
    audience: (count: number) => plural(count, "guest", "guests"),
    due: "Due now",
    sendNow: "Send now",
    actions: (label: string) => `More for ${label}`,
    cancelSend: "Cancel this send",
    cancelled: "Send cancelled",
    sendTitle: (label: string) => `Send: ${label}`,
    sendDescription:
      "Each button opens WhatsApp with the message ready, addressed to that guest. Mark it sent when you've gone through the list.",
    nobody: "Nobody to send to right now.",
    markSent: "Mark as sent",
    notYet: "Not yet",
    marked: "Marked as sent",
    calendarTitle: (purpose: "invite" | "reminder", names: string) =>
      purpose === "invite" ? `Send invitations: ${names}` : `Send reminders: ${names}`,
    calendarBody: "Open your guest list. Every WhatsApp message is ready to send:",
  },

  hosts: {
    heading: "Co-hosts",
    body: "Both families can run this invite together: edit it, add guests and see every reply.",
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
    create: "Make link",
    creating: "Making link…",
    createFailed: "Couldn't make a link. Try again.",
    pending: "Waiting to join",
    pendingFor: (label: string) => (label ? `Link for ${label}` : "Co-host link"),
    whatsapp: "Send on WhatsApp",
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
  body: (who: string, occasion: string) =>
    `${who || "The family"} asked you to help with the ${occasion.toLowerCase()} invitation. As a co-host you can edit the invite, add guests, send reminders and see every reply.`,
  forLabel: (label: string) => `Added as: ${label}`,
  accept: "Accept and open guest list",
  signIn: "Sign in to accept",
  signInNote: "Use your mobile number or Google. It takes a moment.",
  accepting: "Joining…",
  failed: "Couldn't accept just now. Try again.",
  usedTitle: "This link has already been used",
  usedBody:
    "Co-host links work once. If you've already joined, the invite is in My invites. Otherwise ask the family for a new link.",
  myInvites: "Go to My invites",
  off: "Accounts open soon.",
} as const;
