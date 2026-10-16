/** Where a design's live sample opens: the invitation as a guest gets it, made-up names. */
export const samplePath = (designId: string) => `/sample/${designId}`;

/** The home page's live invitation: one of the demos below, a different one each visit. */
export const DEMO_PATH = "/sample";

/** The cookie that remembers the last demo shown, so the next one is another. */
export const DEMO_COOKIE = "shubh-demo";

/**
 * The designs "Open a live invitation" chooses from: stories with a painted page for every
 * celebration, across the country's weddings, and a 3D card.
 */
export const LIVE_DEMOS = [
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
  "card-bandhani",
] as const;

/** A demo to open, never the one just seen (`after`) nor the last one shown (`last`). */
export function pickDemo(
  after: string | null,
  last: string | null,
  random: () => number = Math.random,
): (typeof LIVE_DEMOS)[number] {
  const fresh = LIVE_DEMOS.filter((id) => id !== after && id !== last);
  const pool = fresh.length > 0 ? fresh : LIVE_DEMOS;
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))]!;
}

/** The address a demo opens at: its sample, with the way to another. */
export const demoPath = (designId: string) => `${samplePath(designId)}?demo=1`;

/** Another demo after this one. */
export const anotherDemoPath = (designId: string) =>
  `${DEMO_PATH}?after=${encodeURIComponent(designId)}`;
