/*
 * Where a design's public sample opens, and the two ways a visitor walks from one sample
 * to the next: the home page's tour of hand-picked demos, and the designs around the one
 * they opened from a listing (its occasion, wedding tradition or collection).
 */

/** What a listing narrowed the designs to, in the Designs page's own words (filters.ts). */
export type SampleContext = {
  occasion?: string | null;
  kind?: string | null;
  collection?: string | null;
  format?: string | null;
  photos?: string | null;
};

/**
 * A design's sample: the invitation as a guest gets it, made-up names. With the listing it
 * was opened from, Previous and Next walk that listing's designs.
 */
export function samplePath(designId: string, context: SampleContext = {}): string {
  const params = new URLSearchParams();
  if (context.collection) params.set("collection", context.collection);
  if (context.occasion && !context.kind) params.set("occasion", context.occasion);
  if (context.kind) params.set("tradition", context.kind);
  if (context.format) params.set("format", context.format);
  if (context.photos) params.set("photos", context.photos);
  const query = params.toString();
  return `/sample/${designId}${query ? `?${query}` : ""}`;
}

/** The home page's live invitation: a tour of the demos below, in a new order each visit. */
export const DEMO_PATH = "/sample";

/** The cookie that remembers the demo the last tour began with, so the next begins elsewhere. */
export const DEMO_COOKIE = "shubh-demo";

/**
 * The designs "Open a live invitation" tours (owner, 2026-10-16: more than 50, all paid):
 * Stories with a painted page for every celebration, across the country's weddings and the
 * family's other days, and Scenes that put it all on one painting.
 */
export const LIVE_DEMOS = [
  // Weddings, region by region
  "rajwada-bagh",
  "kutch-toran",
  "pichwai",
  "phulkari-haveli",
  "noor-bagh",
  "tanjore",
  "kayal",
  "rajbari",
  "pattachitra",
  "peshwai-wada",
  "kalamkari",
  "mysuru",
  "chinar",
  "chapel",
  "shahi-savari",
  "chaand-kalayein",
  "raagmala",
  "kashi",
  "sagar",
  "meghdoot",
  "itr-daan",
  "chai-bagan",
  "sufi-raat",
  "resham-katha",
  "navrang",
  "nadi-safar",
  "aath-pehar",
  "pakshi-kosh",
  "gudiya-ghar",
  "sakura",
  "rangrez",
  "phool-mandi",
  "himani",
  "riad",
  "ivory-arch",
  "gulaab",
  "deco-noir",
  "sona-gulaab",
  "kaanch-gumbad",
  "nilofar",
  // The family's other days
  "palna",
  "jungle-party",
  "gubbara",
  "saath",
  "deepotsav",
  "rooftop",
  // Scenes
  "udaipur-lake-scene",
  "kerala-mural-scene",
  "alpana-topor-scene",
  "kutch-rang-scene",
  "mughal-bagh-scene",
  "punjab-haveli-scene",
  "kashi-ghat-scene",
  "temple-pond-scene",
  "pune-wada-scene",
  "zamindar-bari-scene",
  "chinar-dal-scene",
  "mehendi-jhoola-scene",
  "sangeet-dhol-scene",
  "pehla-janamdin-scene",
] as const;

/** A tour's order is named by a short seed in its address, so Previous goes back the same way. */
const SEED = /^[a-z0-9]{1,12}$/;

export const isTourSeed = (value: unknown): value is string =>
  typeof value === "string" && SEED.test(value);

/** A new tour's seed. */
export const newTourSeed = (random: () => number = Math.random): string =>
  Math.floor(random() * 2 ** 32).toString(36);

/** A small, steady random-number source from a seed (mulberry32). */
function seeded(seed: string): () => number {
  let state = 0;
  for (const char of seed) state = (Math.imul(state, 31) + char.charCodeAt(0)) | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Every demo, in the order this tour shows them. */
export function tourOrder(seed: string): string[] {
  const random = seeded(seed);
  const order: string[] = [...LIVE_DEMOS];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order;
}

/** Where a tour begins: its first demo, or its second when the first is the last one seen. */
export function tourStart(seed: string, last: string | null): string {
  const [first, second] = tourOrder(seed);
  return first === last ? second! : first!;
}

/** A demo, as one stop on a tour. */
export const tourPath = (designId: string, seed: string) => `/sample/${designId}?tour=${seed}`;
