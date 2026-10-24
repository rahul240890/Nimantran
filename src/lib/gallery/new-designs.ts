import type { SuiteId } from "@/lib/suites/catalog";

/*
 * The painted Story themes added most recently, newest first, for "new designs" in emails.
 * Add a theme here when it goes live (themes 1 to 70 of October 2026 so far).
 */
export const NEW_SUITES: readonly SuiteId[] = [
  "thewa",
  "sikki",
  "hase-chittara",
  "chandigarh",
  "do-rang",
  "rekhachitra",
  "bhil-chitra",
  "masala",
  "loktak",
  "tarakasi",
  "kuruthola",
  "sadaf",
  "aakar",
  "shwet-shyam",
  "dhanak",
  "chini-mitti",
  "libaas",
  "vanaspati",
  "kurinji",
  "kannauj",
  "phoolon-ki-ghati",
  "tulika",
  "ubhaar",
  "rajanigandha",
  "rumaal",
  "chanderi",
  "mishri",
  "paithani",
  "jamawar",
  "phool-bangla",
  "aasmaani",
  "abri",
  "banjara",
  "bundi-chitra",
  "chandan",
  "dabu",
  "gara",
  "hashiya",
  "lapet",
  "leheriya",
  "neel-chhaap",
  "nirmal",
  "sankheda",
  "shola",
  "tasveer-khana",
  "chandi-nakkashi",
  "chettinad-veedu",
  "dhokra",
  "gagan-safar",
  "kaanch-chitra",
  "meenakari",
  "purani-dilli",
  "rogan",
  "sama",
  "shab-e-gul",
  "aakash-mahal",
  "chandni-mahal",
  "darbar",
  "firoza-bagh",
  "gulabi-nagar",
  "hina",
  "kinkhab",
  "kumudini",
  "mahal-yatra",
  "mor-sarovar",
  "nathdwara-raat",
  "pattu",
  "saanjh-kinara",
  "sona-rekha",
  "sunehri-sarovar",
];

/** A few of them in an order of their own for each person, the same every time for one seed. */
export function pickNewSuites(seed: string, count: number): SuiteId[] {
  // FNV-1a, then a small LCG to shuffle: steady for a seed, different across people
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
  const next = () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32;
  const list = [...NEW_SUITES];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [list[i], list[j]] = [list[j]!, list[i]!];
  }
  return list.slice(0, count);
}
