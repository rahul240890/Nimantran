import { loadFont } from "@remotion/fonts";
import { continueRender, delayRender, staticFile } from "remotion";

/*
 * Shubh's look, taken from the site's design tokens (nimantran/src/app/globals.css) and
 * fonts, so the videos read as the same brand. Videos use these names, never raw colours.
 */
export const color = {
  paper: "#fbf6ec",
  surface2: "#f4ecdc",
  line: "#e5d8c0",
  ink: "#2a1a24",
  inkMuted: "#6b5864",
  marigold: "#f0a431",
  marigoldStrong: "#e08a14",
  marigoldEdge: "#c77410",
  onMarigold: "#2a1a24",
  goldGlint: "#fff4d6",
  accentText: "#9a4c08",
  rose: "#a8334f",
  night: "#120f24",
  nightSurface: "#1b1532",
  nightSurface2: "#241c40",
  nightLine: "#3a3056",
  nightInk: "#f6ecd8",
  nightInkMuted: "#b9aac7",
  nightAccent: "#f5b75a",
  success: "#1a6f45",
  cardIvory: "#f8efdc",
  cardGold: "#b8862f",
  cardGoldText: "#86611c",
  cardInk: "#3b2230",
  cardInkMuted: "#6b5160",
  whatsapp: "#25d366",
  whatsappChat: "#efeae2",
  whatsappBubble: "#d9fdd3",
  whatsappBar: "#075e54",
  whatsappTick: "#53bdeb",
} as const;

/** The site's three faces, with Devanagari fallbacks so Hindi sets as well as English. */
export const font = {
  display: '"Rozha One", serif',
  sans: 'Karla, "Noto Sans Devanagari", sans-serif',
  label: '"Tenor Sans", "Noto Sans Devanagari", sans-serif',
  /** The invitation's own lettering (the "regal" voice): names, and the reading face. */
  names: '"Playfair Display", "Rozha One", serif',
  words: 'Marcellus, "Tiro Devanagari Hindi", serif',
  /** Greetings in each card language: Gujarati, Bengali and Tamil faces after Rozha One. */
  scripts: '"Rozha One", Rasa, "Tiro Bangla", "Tiro Tamil", serif',
} as const;

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+20B9, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const DEVANAGARI =
  "U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF";

const FACES = [
  { family: "Rozha One", file: "rozha-one-latin-400-normal.woff2", unicodeRange: LATIN },
  { family: "Rozha One", file: "rozha-one-devanagari-400-normal.woff2", unicodeRange: DEVANAGARI },
  { family: "Karla", file: "karla-latin-wght-normal.woff2", weight: "200 800" },
  { family: "Tenor Sans", file: "tenor-sans-latin-400-normal.woff2" },
  { family: "Playfair Display", file: "playfair-display-latin-400-normal.woff2" },
  { family: "Playfair Display", file: "playfair-display-latin-700-normal.woff2", weight: "700" },
  { family: "Playfair Display", file: "playfair-display-latin-400-italic.woff2", style: "italic" },
  { family: "Marcellus", file: "marcellus-latin-400-normal.woff2" },
  {
    family: "Noto Sans Devanagari",
    file: "noto-sans-devanagari-devanagari-wght-normal.woff2",
    weight: "100 900",
  },
  { family: "Tiro Devanagari Hindi", file: "tiro-devanagari-hindi-devanagari-400-normal.woff2" },
  { family: "Rasa", file: "rasa-gujarati-600-normal.woff2", weight: "600" },
  { family: "Tiro Bangla", file: "tiro-bangla-bengali-400-normal.woff2" },
  { family: "Tiro Tamil", file: "tiro-tamil-tamil-400-normal.woff2" },
];

const waiting = delayRender("Loading fonts");
Promise.all(
  FACES.map(({ file, ...face }) => loadFont({ ...face, url: staticFile(`fonts/${file}`) })),
).then(() => continueRender(waiting));

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const SITE = "shubhinvitations.com";
export const HANDLE = "@shubh.celebration";
