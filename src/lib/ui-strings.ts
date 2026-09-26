/**
 * English text for shared UI chrome (close buttons, theme names …).
 * Components take these as props; Step 12 moves them into next-intl messages unchanged.
 */
export const uiStrings = {
  close: "Close",
  notifications: "Notifications",
  theme: { group: "Colour theme", system: "Match device", light: "Light", dark: "Dark" },
  invitation: {
    open: "Open invitation",
    close: "Close invitation",
    playMusic: "Play music",
    pauseMusic: "Pause music",
    preparing: "Preparing 3D",
    and: "and",
  },
} as const;
