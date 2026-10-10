/* The shared photo wall (Step 24). English copy; Hindi in src/content/hi/photo-wall.ts. */

const photos = (count: number) =>
  count === 1 ? "1 photo" : `${count.toLocaleString("en-IN")} photos`;

/** On the guest's invitation page. */
export const wallCopy = {
  heading: "Photo wall",
  intro: "Add your photos from the celebration. Everyone with this invitation can see them.",
  soon: (date: string) =>
    `The photo wall opens on ${date}. Come back on the day to share your photos.`,
  closed: "The photo wall has closed. Thank you for sharing your photos.",
  name: "Your name",
  nameHint: "Shown under your photos.",
  optional: "optional",
  add: "Add photos",
  adding: (done: number, of: number) => `Adding photo ${done} of ${of}…`,
  added: (count: number) => `${photos(count)} added. Thank you!`,
  failed: "Some photos couldn't be added. Check your connection and try again.",
  unreadable: "This phone couldn't read one of those photos. Try a JPEG or PNG.",
  full: "The photo wall is full.",
  share: "You've added as many photos as one phone can.",
  tooMany: (max: number) => `Pick up to ${max} photos at a time.`,
  empty: "No photos yet. Be the first to share one.",
  loading: "Loading photos…",
  loadFailed: "Couldn't load the photos.",
  retry: "Try again",
  by: (name: string) => `Shared by ${name}`,
  byGuest: "Shared by a guest",
  photoAlt: (name: string, index: number) =>
    name ? `Photo ${index} shared by ${name}` : `Photo ${index} shared by a guest`,
  view: (index: number) => `View photo ${index}`,
  remove: "Remove",
  removeLabel: (index: number) => `Remove your photo ${index}`,
  removed: "Your photo was removed.",
  removeFailed: "Couldn't remove the photo. Try again.",
  more: "Show more photos",
  count: photos,
  close: "Close",
  previous: "Previous photo",
  next: "Next photo",
  viewerTitle: (index: number, of: number) => `Photo ${index} of ${of}`,
} as const;

/** The host's album at /invites/<id>/photos. */
export const albumCopy = {
  metaTitle: "Photo wall",
  back: "Guest list",
  eyebrow: "Photo wall",
  intro:
    "Guests add photos through the invitation link, from the first function onwards. Hide any photo to take it off the wall, or download them all.",
  count: (total: number, hidden: number) =>
    hidden ? `${photos(total)} · ${hidden.toLocaleString("en-IN")} hidden` : photos(total),
  window: {
    open: (date: string | null) =>
      date ? `Guests can add photos until ${date}.` : "Guests can add photos now.",
    soon: (date: string) => `The wall opens to guests on ${date}.`,
    closed: "The wall is closed to new photos. You can still see and download them all.",
    off: "The photo wall comes with the Celebration and Grand packages.",
    notLive: "Publish the invitation first; guests add photos through its link.",
  },
  openWall: "Open the wall",
  downloadAll: "Download all",
  downloadPart: (part: number, of: number) => `Downloading part ${part} of ${of}…`,
  downloadFailed: "Couldn't download the photos. Try again.",
  download: "Download",
  downloadLabel: (index: number) => `Download photo ${index}`,
  hide: "Hide",
  hideLabel: (index: number) => `Hide photo ${index} from guests`,
  show: "Show",
  showLabel: (index: number) => `Show photo ${index} to guests again`,
  hiddenBadge: "Hidden",
  hidden: "Hidden from guests.",
  shown: "Back on the wall.",
  delete: "Delete",
  deleteLabel: (index: number) => `Delete photo ${index}`,
  deleteTitle: "Delete this photo?",
  deleteBody: "It goes from the wall and your downloads for good. Hiding keeps it for you.",
  keep: "Keep it",
  deleted: "Photo deleted.",
  failed: "Couldn't save that. Try again.",
  emptyTitle: "No photos yet",
  emptyBody: "Share the invitation; guests add their photos from the first function onwards.",
  card: {
    title: "Photo wall",
    body: (count: number) =>
      count
        ? `${photos(count)} from your guests.`
        : "Guests share their photos here after the event.",
    action: "See photos",
  },
  close: "Close",
  previous: "Previous photo",
  next: "Next photo",
  viewerTitle: (index: number, of: number) => `Photo ${index} of ${of}`,
  by: (name: string) => (name ? `Shared by ${name}` : "Shared by a guest"),
  photoAlt: (name: string, index: number) =>
    name ? `Photo ${index} shared by ${name}` : `Photo ${index} shared by a guest`,
  fileName: "photo-wall",
} as const;
