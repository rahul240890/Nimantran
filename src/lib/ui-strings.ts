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
      story: "The invitation, one page at a time",
      pause: "Pause the pages",
      play: "Carry on",
      next: "Next page",
      previous: "Previous page",
      skip: "Skip to the card",
      done: "See the card",
      replay: "Play the invitation pages",
      directions: "Directions",
      calendar: "Add to calendar",
      textBox: "Box behind the words",
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
