/*
 * English copy for the account menu in the header, on every page. Kept apart from the
 * account pages' copy (account.ts) so the header doesn't ship those pages' words.
 */

export const accountMenu = {
  signIn: "Sign in",
  menuLabel: (name: string) => (name ? `Account: ${name}` : "Account"),
  yourAccount: "Your account",
  invites: "My invites",
  profile: "Profile",
  payments: "Payments",
  newInvite: "New invite",
  signOut: "Sign out",
  signedOut: "Signed out",
} as const;
