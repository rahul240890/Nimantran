import type { TemplateContent } from "@/lib/templates/content";

/*
 * Wording for the review pages. "Design's own" keeps each template's sample; the others
 * put long names in other scripts on every design, so reviewers can see text fitting.
 * Review-only content.
 */
export const sampleCopies: Record<
  "template" | "hindi" | "tamil",
  { label: string; content: TemplateContent }
> = {
  template: { label: "Design's own (English)", content: {} },
  hindi: {
    label: "Hindi",
    content: {
      doorLeft: "शुभ",
      doorRight: "विवाह",
      blessing: "॥ श्री गणेशाय नमः ॥",
      families: "अपने परिवारों के आशीर्वाद से",
      first: "आरव",
      joiner: "संग",
      second: "मीरा",
      line: "आपको अपने विवाह समारोह में सादर आमंत्रित करते हैं",
      date: "शनिवार, 12 दिसंबर 2026",
      venue: "पिछोला लेकसाइड गार्डन्स, उदयपुर",
    },
  },
  tamil: {
    label: "Tamil (long names)",
    content: {
      doorLeft: "திருமண",
      doorRight: "அழைப்பு",
      blessing: "",
      families: "இரு குடும்பத்தினரின் ஆசியுடன்",
      first: "அருணாசலம்",
      joiner: "&",
      second: "மீனாட்சிசுந்தரி",
      line: "தங்கள் திருமண விழாவிற்கு உங்களை அன்புடன் அழைக்கிறார்கள்",
      date: "சனிக்கிழமை, 12 டிசம்பர் 2026",
      venue: "ஸ்ரீ மீனாட்சி திருமண மண்டபம், மதுரை",
    },
  },
};

export type SampleCopyId = keyof typeof sampleCopies;

export const qualityLabels = {
  auto: "Automatic",
  high: "High",
  medium: "Medium",
  low: "Low",
  "2d": "2D card",
} as const;

export type QualityChoice = keyof typeof qualityLabels;

export function isQualityChoice(value: unknown): value is QualityChoice {
  return typeof value === "string" && Object.hasOwn(qualityLabels, value);
}

export const reasonLabels = {
  chosen: "Chosen on this page",
  "no-webgl": "This browser can't draw 3D",
  "software-gpu": "3D would run without a graphics chip",
  "save-data": "Data saver is on",
  "slow-network": "The network is very slow",
  "low-memory": "Little memory or few processor cores",
  "weak-gpu": "An older graphics chip",
  phone: "A phone, so it starts at medium",
  capable: "A capable device",
  "slow-frames": "Frames ran slow, so it stepped down",
  "graphics-lost": "The graphics chip reset",
  "load-failed": "The 3D code didn't load",
} as const;

export const stateLabels = {
  poster: "Checking the device",
  loading: "Loading 3D behind the 2D card",
  ready: "3D is showing",
  fallback: "Showing the 2D card",
} as const;
