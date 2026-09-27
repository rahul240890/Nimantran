/**
 * English text for shared UI chrome (close buttons, theme names …). Components take these
 * as props; the Hindi is in src/content/hi/ui.ts.
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
    skip: "Skip opening",
    and: "and",
    story: {
      story: "The invitation, one moment at a time",
      pause: "Pause the story",
      play: "Carry on",
      next: "Next",
      previous: "Back",
      skip: "Skip story",
      done: "See the card",
      replay: "Play the story",
    },
  },
  /** Words the story adds between the host's own (Step 12d). */
  storyWords: {
    saveTheDate: "Save the date",
    joinUs: "Will you join us?",
    withLove: "With love, we await you",
    and: "and",
  },
  error: {
    title: "Something went wrong",
    body: "We've been told about it. Try again, and if it keeps happening, come back in a little while.",
    retry: "Try again",
    home: "Go to Shubhdwar",
  },
  notFound: {
    title: "This page isn't here",
    body: "The link may be mistyped, or the page has moved.",
    home: "Go to Shubhdwar",
  },
} as const;
