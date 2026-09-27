import type { AuthFailure } from "@/lib/auth/account";

/*
 * English copy for sign-in, the profile and My invites. Moves into next-intl in Step 12.
 */

export const accountMenu = {
  signIn: "Sign in",
  menuLabel: (name: string) => (name ? `Account: ${name}` : "Account"),
  yourAccount: "Your account",
  invites: "My invites",
  profile: "Profile",
  newInvite: "New invite",
  signOut: "Sign out",
  signedOut: "Signed out",
} as const;

export const signInCopy = {
  metaTitle: "Sign in",
  metaDescription: "Sign in to keep your invites safe and open them on any phone.",
  eyebrow: "Welcome",
  title: "Sign in to Shubh",
  intro: "Keep your invites safe and open them on any phone. No password to remember.",
  phoneLabel: "Mobile number",
  phoneHint:
    "We'll send a 6-digit code by SMS. Numbers outside India start with + and the country code.",
  phonePlaceholder: "98765 43210",
  sendCode: "Send code",
  or: "or",
  google: "Continue with Google",
  codeTitle: "Enter the code",
  codeSent: (masked: string) => `We sent a 6-digit code to ${masked}.`,
  codeLabel: "6-digit code",
  verify: "Verify and sign in",
  resend: "Send a new code",
  resendIn: (seconds: number) => `Send a new code in ${seconds}s`,
  resent: "A new code is on its way",
  changeNumber: "Change number",
  previewNote: "Preview mode: any number works, and the code is 123456.",
  terms: {
    before: "By continuing you agree to the ",
    terms: "terms",
    and: " and ",
    privacy: "privacy policy",
    after: ". We never share your number.",
  },
  success: (name: string) => (name ? `Welcome, ${name}` : "Welcome to Shubh"),
  side: {
    eyebrow: "Your invites, everywhere",
    title: "Start on your phone, finish on the laptop",
    points: [
      "Drafts follow you to every device",
      "Both families can manage one wedding",
      "Guests never need to sign in",
    ],
  },
  off: {
    title: "Accounts open very soon",
    body: "Sign-in is being switched on. Until then, the editor saves your invite on this device.",
    action: "Open the editor",
  },
  errors: {
    required: "Enter your mobile number",
    invalid: "That doesn't look like a mobile number. Check the digits.",
    code: "Enter all 6 digits",
    "bad-code": "That code is wrong or has expired. Check the SMS or send a new one.",
    "too-many": "Too many tries. Wait a minute, then try again.",
    "sms-failed": "We couldn't send the SMS. Check the number, or sign in with Google.",
    "provider-off": "This way of signing in isn't switched on yet. Try the other one.",
    unavailable: "Sign-in isn't available right now. Please try again shortly.",
    unknown: "Something went wrong. Please try again.",
    google: "Google sign-in didn't finish. Please try again.",
  } satisfies Record<AuthFailure | "required" | "invalid" | "code" | "google", string>,
} as const;

export const profileCopy = {
  metaTitle: "Profile",
  eyebrow: "Profile",
  title: "Your details",
  intro: "Your name shows to co-hosts. Guests only ever see the names on the invitation.",
  name: "Your name",
  nameHint: "As the family knows you, in any script.",
  language: "Preferred language",
  languageHint:
    "English and Hindi switch the app now; other languages follow as translations arrive. Invitations can use any language.",
  signedInWith: "Signed in with",
  methods: { phone: "Mobile number", google: "Google" },
  save: "Save changes",
  saved: "Profile saved",
  signOut: "Sign out",
  signOutHint: "You'll stay signed in on your other devices.",
  deleteAccount: {
    heading: "Delete your account",
    hint: "Deletes your account and every invite you made, with its guest list and replies. Invites you co-host stay with their owners.",
    open: "Delete account",
    title: "Delete your account?",
    body: "Every invite you made will be deleted with its photos, guest list and replies, and its link will stop working for guests. This can't be undone.",
    understand: "I understand this deletes my invites for good",
    confirm: "Delete my account",
    cancel: "Keep my account",
    close: "Close",
    done: "Your account has been deleted",
    failed:
      "Couldn't delete your account just now. Try again, or write to us from the privacy page.",
  },
  errors: {
    required: "Please enter your name",
    "too-long": "Keep it under 60 characters",
    invalid: "Choose a language",
  },
} as const;

export const invitesCopy = {
  metaTitle: "My invites",
  eyebrow: "My invites",
  greeting: (name: string) => (name ? `Namaste, ${name}` : "Namaste"),
  intro: "Every invite you're making or have sent, in one place.",
  newInvite: "New invite",
  deviceHeading: "On this device",
  deviceNote:
    "This draft isn't in your account yet. Open it and it saves to your account straight away.",
  deviceBadge: "Not in your account",
  accountHeading: (count: number) => (count === 1 ? "1 invite" : `${count} invites`),
  status: { draft: "Draft", published: "Published" },
  loadFailed: "Couldn't load the invites in your account just now. Refresh to try again.",
  remove: {
    label: (title: string) => `Delete ${title}`,
    title: "Delete this invite?",
    unnamed: "this invite",
    body: (title: string) =>
      `This deletes ${title} with its functions, guest list and replies, on every device. It can't be undone.`,
    confirm: "Delete invite",
    cancel: "Keep it",
    close: "Close",
    done: "Invite deleted",
    failed: "Couldn't delete that invite. Try again in a moment.",
  },
  continueEditing: "Continue",
  share: "Share",
  guests: "Guests",
  cohost: "Co-host",
  step: (label: string) => `Next: ${label.toLowerCase()}`,
  updated: (when: string) => `Edited ${when}`,
  untitled: "Your names go here",
  addName: {
    title: "Add your name",
    body: "Co-hosts see it when you invite them to help. It takes a moment.",
    action: "Add name",
  },
  loading: "Loading your invites…",
  empty: {
    title: "No invites yet",
    body: "Pick an occasion and a design; your first invite takes about five minutes.",
    action: "Create your first invite",
  },
} as const;
