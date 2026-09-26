/**
 * English text for shared UI chrome (close buttons, theme names …).
 * Components take these as props; Step 12 moves them into next-intl messages unchanged.
 */
export const uiStrings = {
  close: "Close",
  notifications: "Notifications",
  theme: { group: "Colour theme", system: "Match device", light: "Light", dark: "Dark" },
} as const;
