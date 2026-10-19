import voice from "../voice.json";
import type { Lang } from "../designs";
import type { FormatId } from "./formats";

/*
 * The six ads. Each is a run of beats; a beat holds one picture while one or more voice
 * lines play, so the cut always lands where the voice moves on. The last line is the
 * closing card. Captions repeat the voice (most people watch muted), with *words* marked
 * in marigold; a caption can differ from the voice where the voice spells a thing out.
 */

export type ClipFile = "open" | "rsvp" | "joys" | "designs";
export type Clip = { file: ClipFile; at: number };

export type Visual =
  | {
      kind: "photo";
      src: string;
      pos?: string;
      zoom?: [number, number];
      chips?: Record<Lang, string[]>;
    }
  | { kind: "screen"; clips: Clip[] }
  | { kind: "phone"; clips: Clip[]; bg?: string }
  | { kind: "duo"; src: string; pos?: string; clip: Clip }
  | { kind: "price" }
  | { kind: "chat" }
  | { kind: "languages" }
  | { kind: "guests" }
  | { kind: "designs" }
  | { kind: "end"; bg: string };

export type Beat = {
  lines: number;
  visual: Visual;
  /** Captions sit low by default; "top" when the picture needs the lower half. */
  captionAt?: "top" | "low";
};

export type AdId = "maa" | "gate" | "sangeet" | "price" | "pov" | "explainer";

type Ad = {
  music: string;
  beats: Beat[];
  /** Caption text where it differs from the voice, by language and line. */
  captions?: Partial<Record<Lang, Record<number, string>>>;
  formats: FormatId[];
};

const OPEN_TAP: Clip = { file: "open", at: 1.2 };
const HALDI: Clip = { file: "open", at: 31.6 };
const MEHENDI: Clip = { file: "open", at: 39.4 };
const SANGEET: Clip = { file: "open", at: 45.2 };
const END_BG = "suites/rajwada-bagh/cover.webp";

export const ADS: Record<AdId, Ad> = {
  // Realistic: a mother, the gate, the grandmother's reply
  maa: {
    music: "music/yaman.wav",
    formats: ["reel", "feed"],
    beats: [
      {
        lines: 1,
        visual: { kind: "photo", src: "ads/mother.jpg", pos: "50% 30%", zoom: [1.02, 1.1] },
      },
      {
        lines: 1,
        visual: {
          kind: "photo",
          src: "ads/mother.jpg",
          pos: "62% 58%",
          zoom: [1.35, 1.45],
          chips: {
            en: ["300 cards", "₹25,000+", "Weeks of visits"],
            hi: ["300 कार्ड", "₹25,000+", "हफ़्तों की भागदौड़"],
          },
        },
      },
      { lines: 1, visual: { kind: "chat" } },
      { lines: 1, visual: { kind: "screen", clips: [OPEN_TAP] } },
      {
        lines: 1,
        visual: {
          kind: "duo",
          src: "ads/grandmother.jpg",
          pos: "40% 40%",
          clip: { file: "rsvp", at: 4 },
        },
      },
      { lines: 1, visual: { kind: "end", bg: "ads/mother.jpg" } },
    ],
    captions: {
      en: {
        0: "Mom wanted to invite *every single relative.* Personally.",
        2: "So she sent *one link* on WhatsApp.",
        4: "Even Grandma replied *in one tap.*",
        5: "Make your wedding invitation on *Shubh.* Start free.",
      },
      hi: {
        0: "मम्मी *हर रिश्तेदार* को खुद बुलाना चाहती थीं।",
        1: "300 कार्ड छपवाना? हफ़्तों घर-घर जाना?",
        2: "तो उन्होंने व्हाट्सऐप पर बस *एक लिंक* भेजा।",
        4: "दादी ने भी *एक टैप में* जवाब दे दिया।",
        5: "अपना शादी का निमंत्रण *शुभ* पर बनाइए। मुफ़्त में शुरू करें।",
      },
    },
  },
  // Unique: the real invitation, full screen, first second to last
  gate: {
    music: "music/bihag.wav",
    formats: ["reel", "square", "wide"],
    beats: [
      { lines: 1, visual: { kind: "screen", clips: [{ file: "open", at: 0 }] } },
      { lines: 1, visual: { kind: "screen", clips: [OPEN_TAP] } },
      { lines: 1, visual: { kind: "screen", clips: [HALDI, MEHENDI, SANGEET] } },
      { lines: 1, visual: { kind: "screen", clips: [{ file: "rsvp", at: 4 }] } },
      { lines: 1, visual: { kind: "end", bg: END_BG } },
    ],
    captions: {
      en: {
        0: "This is *not* a wedding card.",
        1: "It's a *palace gate,* and your guests open it.",
        2: "Every function gets its *own painted page,* with music.",
        3: "Guests reply *in one tap.* No app needed.",
        4: "*Shubh Invitation.* Make yours free.",
      },
      hi: {
        0: "ये कोई साधारण निमंत्रण *नहीं* है।",
        1: "ये एक *महल का दरवाज़ा* है, जिसे मेहमान खोलते हैं।",
        2: "हर रस्म का *अपना सुंदर पेज,* संगीत के साथ।",
        3: "मेहमान *एक टैप में* जवाब देते हैं। कोई ऐप नहीं।",
        4: "*शुभ इन्विटेशन।* मुफ़्त में बनाइए।",
      },
    },
  },
  // Realistic: friends at a sangeet, every function, replies
  sangeet: {
    music: "music/hamsadhwani.wav",
    formats: ["reel", "feed"],
    beats: [
      {
        lines: 1,
        visual: { kind: "photo", src: "ads/friends.jpg", pos: "50% 40%", zoom: [1.0, 1.08] },
      },
      { lines: 1, visual: { kind: "screen", clips: [OPEN_TAP] } },
      { lines: 1, visual: { kind: "screen", clips: [HALDI, MEHENDI, SANGEET] } },
      { lines: 1, visual: { kind: "phone", clips: [{ file: "rsvp", at: 4 }] } },
      { lines: 1, visual: { kind: "end", bg: "ads/friends.jpg" } },
    ],
    captions: {
      en: {
        0: "When the invitation looks *this good,*",
        1: "everyone in the group *actually opens it.*",
        2: "*Haldi, mehendi, sangeet.* Each one gets its own page.",
        3: "And every guest replies *for each function,* in one tap.",
        4: "*Shubh Invitation.* Make yours today.",
      },
      hi: {
        0: "जब निमंत्रण *इतना सुंदर* हो,",
        1: "तो ग्रुप में *हर कोई* उसे खोलता है।",
        2: "*हल्दी, मेहंदी, संगीत।* हर रस्म का अपना पेज।",
        3: "और हर मेहमान, *हर रस्म के लिए,* एक टैप में जवाब देता है।",
        4: "*शुभ इन्विटेशन।* आज ही बनाइए।",
      },
    },
  },
  // Direct response: what printed cards cost against one link
  price: {
    music: "music/pilu.wav",
    formats: ["reel", "feed", "square"],
    beats: [
      { lines: 3, visual: { kind: "price" }, captionAt: "top" },
      { lines: 1, visual: { kind: "screen", clips: [OPEN_TAP] } },
      { lines: 1, visual: { kind: "end", bg: "ads/mehendi.jpg" } },
    ],
    captions: {
      en: {
        0: "300 printed wedding cards can cost *₹25,000 or more.*",
        1: "Plus *weeks* of delivering them.",
        2: "On Shubh, start *free.* Paid designs from *₹499,* paid once.",
        3: "*One link.* Every guest. The same day.",
        4: "Make yours *now.*",
      },
      hi: {
        0: "300 छपे हुए निमंत्रण पत्र, *₹25,000 या उससे भी ज़्यादा।*",
        1: "ऊपर से *हफ़्तों* तक बाँटने की भागदौड़।",
        2: "शुभ पर शुरुआत *मुफ़्त।* पेड डिज़ाइन सिर्फ़ *₹499* से, बस एक बार।",
        3: "*एक लिंक।* हर मेहमान। उसी दिन।",
        4: "अभी *बनाइए।*",
      },
    },
  },
  // Trend format: POV, the bride
  pov: {
    music: "music/hamsadhwani.wav",
    formats: ["reel", "feed"],
    beats: [
      {
        lines: 1,
        visual: { kind: "photo", src: "ads/bride-glow.jpg", pos: "50% 30%", zoom: [1.12, 1.02] },
      },
      {
        lines: 1,
        visual: { kind: "photo", src: "ads/bride-phone.jpg", pos: "50% 62%", zoom: [1.0, 1.1] },
      },
      { lines: 1, visual: { kind: "screen", clips: [OPEN_TAP, { file: "joys", at: 1.4 }] } },
      { lines: 1, visual: { kind: "end", bg: "ads/bride-glow.jpg" } },
    ],
    captions: {
      en: {
        0: "*POV:* you're the bride.",
        1: "And all your invitations went out *in one evening.*",
        2: "*One link.* A gate that opens. Every function inside.",
        3: "*Shubh Invitation.* Try it free.",
      },
      hi: {
        0: "*POV:* आप दुल्हन हैं।",
        1: "और आपके सारे निमंत्रण *एक ही शाम में* चले गए।",
        2: "*एक लिंक।* खुलता हुआ दरवाज़ा। हर रस्म अंदर।",
        3: "*शुभ इन्विटेशन।* मुफ़्त में आज़माइए।",
      },
    },
  },
  // YouTube: how it works, start to finish
  explainer: {
    music: "music/yaman.wav",
    formats: ["wide", "reel"],
    beats: [
      {
        lines: 1,
        visual: { kind: "photo", src: "ads/friends.jpg", pos: "50% 40%", zoom: [1.0, 1.08] },
      },
      { lines: 1, visual: { kind: "designs" } },
      { lines: 1, visual: { kind: "languages" } },
      { lines: 1, visual: { kind: "chat" } },
      { lines: 1, visual: { kind: "phone", clips: [OPEN_TAP, HALDI, { file: "rsvp", at: 3.2 }] } },
      { lines: 1, visual: { kind: "guests" } },
      { lines: 1, visual: { kind: "end", bg: END_BG } },
    ],
    captions: {
      en: {
        0: "Planning a wedding? The *easiest way* to invite everyone.",
        1: "Pick a *hand-painted design,* from Rajasthani palaces to Tanjore gold.",
        2: "Add names, functions and venues, in *Hindi, English or your language.*",
        3: "Then send *one link* on WhatsApp.",
        4: "Guests open a gate, see every function, and *reply in one tap.*",
        5: "And you see *every reply* in one guest list.",
        6: "*Shubh Invitation.* Start free at shubhinvitations.com",
      },
      hi: {
        0: "शादी की तैयारी? सबको बुलाने का *सबसे आसान तरीका।*",
        1: "*हाथ से पेंट किए डिज़ाइन,* राजस्थानी महल से तंजौर के सोने तक।",
        2: "नाम, रस्में और जगह, *हिंदी, अंग्रेज़ी या अपनी भाषा में।*",
        3: "फिर व्हाट्सऐप पर बस *एक लिंक* भेजिए।",
        4: "मेहमान दरवाज़ा खोलते हैं, हर रस्म देखते हैं, और *एक टैप में* जवाब देते हैं।",
        5: "और *हर जवाब* एक ही गेस्ट लिस्ट में।",
        6: "*शुभ इन्विटेशन।* मुफ़्त में शुरू करें: shubhinvitations.com",
      },
    },
  },
};

export const AD_IDS = Object.keys(ADS) as AdId[];

type Line = { file: string; text: string; seconds: number };
export const FPS = 30;
const GAP = 0.32;
const LEAD = 0.2;
const HOLD = 1.2;

export type Timed = {
  file: string;
  caption: string;
  from: number;
  frames: number;
  voiceFrames: number;
};
export type TimedBeat = Beat & { from: number; frames: number; lineAt: Timed[] };

/** Lays the beats out on the voice: every line gets its spoken length plus a breath. */
export function timeline(id: AdId, lang: Lang) {
  const ad = ADS[id];
  const lines = (voice as unknown as Record<string, Record<Lang, Line[]>>)[id]![lang]!;
  let frame = Math.round(LEAD * FPS);
  let index = 0;
  const beats: TimedBeat[] = ad.beats.map((beat, b) => {
    const from = b === 0 ? 0 : frame;
    const lineAt: Timed[] = [];
    for (let i = 0; i < beat.lines; i++, index++) {
      const line = lines[index]!;
      const last = index === lines.length - 1;
      const voiceFrames = Math.ceil(line.seconds * FPS);
      const frames = voiceFrames + Math.round((last ? HOLD : GAP) * FPS);
      lineAt.push({
        file: line.file,
        caption: ad.captions?.[lang]?.[index] ?? line.text,
        from: frame,
        frames,
        voiceFrames,
      });
      frame += frames;
    }
    return { ...beat, from, frames: frame - from, lineAt };
  });
  return { beats, total: frame };
}
