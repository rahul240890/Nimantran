/*
 * How the couple's photos and names arrive, theme by theme. Every theme has its own pair:
 * a Polaroid card's photo develops out of white, a locket's photos flip open, a lotus
 * frame's photo blooms, a garland frame swings down into place; an ink painting writes
 * the names in a stroke, a lamp-lit theme flickers them on like diyas. Themes with a
 * fitting idea are picked by hand below; the rest step through the styles in catalogue
 * order, so no two neighbours share a pair. The movement is in reveals.css; reduced
 * motion shows everything in place at once.
 */

import { SUITE_IDS, type SuiteId } from "./catalog";

export const PHOTO_REVEALS = [
  // A circle opens from the faces outwards
  "iris",
  // Out of white and sepia into colour, as an instant photo develops
  "develop",
  // Parted from the middle like a curtain
  "curtain",
  // Grows from small with a turn, as a flower opens
  "bloom",
  // Lowered from above, swinging a little on its string before it settles
  "swing",
  // A wash of colour runs down from the top, as watercolour soaks into paper
  "wash",
  // Slats of a blind turn open
  "blinds",
  // Rises up out of the ground, the top first
  "rise",
  // Out of the dark into a warm glow, as a lamp is lit before it
  "glow",
  // Turned over like a card, each from its own side
  "flip",
  // A diagonal sweep from the outer corner
  "sweep",
  // A camera finding its focus
  "focus",
] as const;
export type PhotoReveal = (typeof PHOTO_REVEALS)[number];

export const NAME_REVEALS = [
  // Each letter rises out of a soft blur after the one before
  "rise",
  // Written on in one stroke, left to right
  "ink",
  // Each letter blooms out of a gold glow
  "glow",
  // Letters fall into place and bounce
  "drop",
  // Letters appear one by one, as if typed
  "type",
  // Letters grow in a wave
  "wave",
  // Letters flip down like a station board
  "unfold",
  // Letters flicker on like diyas catching
  "flicker",
  // The whole name comes out of soft focus
  "focus",
  // One name comes down, the other up, and they meet at the joiner
  "meet",
  // Drawn out from the middle to both ends
  "trace",
] as const;
export type NameReveal = (typeof NAME_REVEALS)[number];

/** Name styles that move letter by letter; the others move each name as a whole. */
export const BY_LETTER: ReadonlySet<NameReveal> = new Set([
  "rise",
  "glow",
  "drop",
  "type",
  "wave",
  "unfold",
  "flicker",
]);

export type Reveal = { photo: PhotoReveal; names: NameReveal };

/** Themes with an idea of their own; either half missing falls back to the catalogue order. */
const CHOSEN: Partial<Record<SuiteId, Partial<Reveal>>> = {
  // Palaces and havelis
  "rajwada-bagh": { photo: "curtain", names: "glow" },
  "shahi-savari": { photo: "swing", names: "meet" },
  kayal: { photo: "wash", names: "wave" },
  "noor-bagh": { photo: "iris", names: "trace" },
  "phulkari-haveli": { photo: "blinds", names: "drop" },
  "deco-noir": { photo: "glow", names: "unfold" },
  taara: { photo: "glow", names: "flicker" },
  kaagaz: { photo: "flip", names: "ink" },
  sagar: { photo: "rise", names: "wave" },
  "sufi-raat": { photo: "glow", names: "flicker" },
  deepotsav: { photo: "glow", names: "flicker" },
  gubbara: { photo: "bloom", names: "drop" },
  // The flower and tree frames
  "kamal-sarovar": { photo: "bloom" },
  "siya-ram-mala": { photo: "swing" },
  "vat-vriksha": { photo: "swing" },
  "prem-vriksh": { photo: "swing" },
  "mogra-raat": { photo: "glow" },
  "orchid-meghalaya": { photo: "wash" },
  "wisteria-tunnel": { photo: "curtain" },
  "magnolia-moon": { photo: "glow" },
  // The two-photo cards
  "phad-gatha": { photo: "curtain", names: "ink" },
  "mandana-lal": { photo: "iris", names: "trace" },
  "gota-patti": { photo: "glow", names: "glow" },
  "pithora-ghoda": { photo: "wash", names: "drop" },
  "sohrai-khovar": { photo: "wash", names: "rise" },
  "aipan-kumaon": { photo: "iris", names: "trace" },
  "pipli-chhata": { photo: "bloom", names: "wave" },
  "bishnupur-terracotta": { photo: "rise", names: "focus" },
  "ganjifa-patte": { photo: "flip", names: "unfold" },
  "kanjivaram-pattu": { photo: "blinds", names: "glow" },
  "kasavu-sona": { photo: "curtain", names: "meet" },
  "urli-pookal": { photo: "rise", names: "wave" },
  "kar-e-kashmir": { photo: "wash", names: "ink" },
  "zardozi-mehfil": { photo: "glow", names: "glow" },
  "patola-bandh": { photo: "blinds", names: "unfold" },
  "kundan-jhumka": { photo: "swing", names: "drop" },
  "moti-bharat": { photo: "iris", names: "flicker" },
  "polaroid-lights": { photo: "develop", names: "type" },
  "dak-tikat": { photo: "sweep", names: "type" },
  "kadhai-hoop": { photo: "iris", names: "ink" },
  "locket-jodi": { photo: "flip", names: "meet" },
  "syahi-bamboo": { photo: "wash", names: "ink" },
  "lace-ivory": { photo: "curtain", names: "trace" },
  "origami-saaras": { photo: "flip", names: "unfold" },
  "nimbu-amalfi": { photo: "focus", names: "wave" },
  "rail-yatra": { photo: "sweep", names: "type" },
  "rakhi-dor": { photo: "swing", names: "meet" },
  "karva-chandni": { photo: "iris", names: "glow" },
  "judwa-taare": { photo: "glow", names: "flicker" },
  "naya-mehmaan": { photo: "bloom", names: "drop" },
};

/**
 * A theme's photo and name reveals. Picked themes keep their own; the rest take the next
 * style in turn by their place in the catalogue, the names on a different step from the
 * photos so the pairs keep changing.
 */
export function revealFor(suite: SuiteId): Reveal {
  const at = Math.max(0, (SUITE_IDS as readonly SuiteId[]).indexOf(suite));
  const chosen = CHOSEN[suite];
  return {
    photo: chosen?.photo ?? PHOTO_REVEALS[at % PHOTO_REVEALS.length]!,
    names: chosen?.names ?? NAME_REVEALS[(at * 4 + 1) % NAME_REVEALS.length]!,
  };
}
