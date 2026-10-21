/*
 * Each theme's own music (owner, 2026-10-09: themes borrowed their card's raga, so many
 * sounded the same). A painted theme names its raga and, where it wants them different
 * from the raga's own, the instrument, the drum and the tempo. A Scene theme can name its
 * own; otherwise it takes its painted kin's music, varied so that themes sharing a kin
 * don't sound alike. The host's own raga or clip in the editor still wins over all of it.
 */

import type { Template } from "@/lib/templates/schema";
import type { LeadId } from "@/lib/templates/ids";
import { RAGAS } from "@/lib/engine/music";
import { SCENE_KIN, isSceneTheme, type SceneThemeId, type SuiteId } from "./catalog";

export type ThemeMusic = Pick<Template["music"], "raga" | "tempo" | "lead" | "taal">;

const PAINTED_MUSIC: Record<Exclude<SuiteId, SceneThemeId | "classic">, ThemeMusic> = {
  // Palace weddings: the shehnai at dusk, Rajasthan's Mand on a folk lilt
  "rajwada-bagh": { raga: "bihag" },
  "shahi-savari": { raga: "mand" },
  "peshwai-wada": { raga: "bhimpalasi" },
  "noor-bagh": { raga: "yaman", lead: "sitar", tempo: 62 },
  "sufi-raat": { raga: "desh", lead: "sitar", taal: "keherwa", tempo: 70 },
  riad: { raga: "bhimpalasi", lead: "sitar", taal: "dadra", tempo: 66 },
  "deco-noir": { raga: "bihag", lead: "sitar", tempo: 58 },
  // Regional homes, on their own instruments
  kayal: { raga: "madhyamavati" },
  "phulkari-haveli": { raga: "kafi" },
  rajbari: { raga: "bhairavi" },
  "kutch-toran": { raga: "pilu" },
  tanjore: { raga: "hamsadhwani" },
  mysuru: { raga: "hamsadhwani", lead: "veena", taal: null },
  kalamkari: { raga: "bhupali", lead: "veena", taal: null, tempo: 70 },
  pattachitra: { raga: "bhimpalasi", lead: "bansuri", taal: "dadra" },
  chinar: { raga: "yaman", lead: "santoor", taal: "dadra", tempo: 66 },
  "chai-bagan": { raga: "pilu", lead: "bansuri", taal: "keherwa", tempo: 76 },
  // Krishna's flute for Nathdwara, Bismillah Khan's shehnai for Banaras
  pichwai: { raga: "bhupali", lead: "bansuri", taal: "dadra", tempo: 70 },
  kashi: { raga: "bhairavi", lead: "shehnai", tempo: 58 },
  mitti: { raga: "mand", lead: "bansuri", taal: "keherwa" },
  // Gardens, seas and hills: softer, mostly without a drum
  "ivory-arch": { raga: "yaman", lead: "santoor", tempo: 64 },
  gulaab: { raga: "khamaj" },
  taara: { raga: "yaman", tempo: 58 },
  kaagaz: { raga: "desh" },
  neel: { raga: "desh", lead: "bansuri", taal: null, tempo: 60 },
  sagar: { raga: "madhyamavati", lead: "santoor", taal: "dadra" },
  chapel: { raga: "bihag", lead: "bansuri", tempo: 56 },
  sakura: { raga: "bhupali", lead: "santoor", taal: null, tempo: 68 },
  vigna: { raga: "khamaj", lead: "santoor", taal: null, tempo: 64 },
  himani: { raga: "bhupali", lead: "bansuri", taal: null, tempo: 60 },
  van: { raga: "desh", lead: "bansuri", taal: "dadra", tempo: 68 },
  saath: { raga: "khamaj", lead: "bansuri", taal: "dadra", tempo: 66 },
  palna: { raga: "pilu", lead: "santoor", taal: "dadra", tempo: 64 },
  // Parties and festivals, with a beat
  gubbara: { raga: "bhupali", tempo: 88 },
  "jungle-party": { raga: "pilu", lead: "santoor", taal: "keherwa", tempo: 90 },
  rooftop: { raga: "kafi", lead: "santoor", taal: "keherwa", tempo: 92 },
  deepotsav: { raga: "yaman", lead: "sitar", taal: "keherwa", tempo: 76 },
  // The story themes, each on its own raga and pace
  "chaand-kalayein": { raga: "yaman", lead: "sitar", taal: null, tempo: 58 },
  "ritu-chakra": { raga: "bhupali", lead: "santoor", taal: "dadra", tempo: 66 },
  raagmala: { raga: "bihag", lead: "veena", taal: null, tempo: 60 },
  panchatantra: { raga: "pilu", lead: "bansuri", taal: "keherwa", tempo: 80 },
  "patang-udaan": { raga: "kafi", lead: "santoor", taal: "keherwa", tempo: 96 },
  "diya-ki-kahani": { raga: "yaman", lead: "sitar", taal: "keherwa", tempo: 70 },
  "resham-katha": { raga: "hamsadhwani", lead: "veena", taal: "dadra", tempo: 66 },
  navrang: { raga: "khamaj", lead: "santoor", taal: null, tempo: 70 },
  "nadi-safar": { raga: "madhyamavati", lead: "bansuri", taal: "dadra", tempo: 64 },
  "ek-rekha": { raga: "desh", lead: "santoor", taal: null, tempo: 60 },
  "mahal-yatra": { raga: "yaman", lead: "santoor", taal: "dadra", tempo: 64 },
  kinkhab: { raga: "bihag", lead: "shehnai", tempo: 58 },
  "saanjh-kinara": { raga: "madhyamavati", lead: "santoor", taal: "dadra", tempo: 68 },
  "nathdwara-raat": { raga: "bhupali", lead: "bansuri", taal: "dadra", tempo: 62 },
  "chandni-mahal": { raga: "yaman", lead: "sitar", taal: null, tempo: 56 },
  "aakash-mahal": { raga: "bihag", lead: "santoor", taal: null, tempo: 58 },
  "firoza-bagh": { raga: "bhimpalasi", lead: "sitar", taal: "dadra", tempo: 60 },
  "gulabi-nagar": { raga: "mand", lead: "santoor", taal: "keherwa", tempo: 74 },
  hina: { raga: "pilu", lead: "santoor", taal: "dadra", tempo: 72 },
  "mor-sarovar": { raga: "desh", lead: "bansuri", taal: "dadra", tempo: 64 },
  kumudini: { raga: "bhupali", lead: "bansuri", taal: null, tempo: 52 },
  darbar: { raga: "bihag", lead: "sitar", taal: "keherwa", tempo: 66 },
  "sunehri-sarovar": { raga: "kafi", lead: "bansuri", taal: null, tempo: 60 },
  pattu: { raga: "hamsadhwani", lead: "veena", taal: "dadra", tempo: 72 },
  "sona-rekha": { raga: "desh", lead: "santoor", taal: null, tempo: 54 },
  hashiya: { raga: "yaman", lead: "santoor", taal: null, tempo: 54 },
  gara: { raga: "bhimpalasi", lead: "santoor", taal: "dadra", tempo: 64 },
  abri: { raga: "bihag", lead: "sitar", taal: "dadra", tempo: 62 },
  "neel-chhaap": { raga: "hamsadhwani", lead: "bansuri", taal: "dadra", tempo: 66 },
  lapet: { raga: "khamaj", lead: "santoor", taal: "keherwa", tempo: 80 },
  chandan: { raga: "hamsadhwani", lead: "veena", taal: "dadra", tempo: 63 },
  "bundi-chitra": { raga: "mand", lead: "shehnai", taal: "dadra", tempo: 61 },
  banjara: { raga: "pilu", lead: "bansuri", taal: "keherwa", tempo: 83 },
  leheriya: { raga: "mand", lead: "santoor", taal: "keherwa", tempo: 79 },
  nirmal: { raga: "bhupali", lead: "veena", taal: null, tempo: 57 },
  shola: { raga: "bhairavi", lead: "bansuri", taal: "dadra", tempo: 59 },
  dabu: { raga: "desh", lead: "santoor", taal: "dadra", tempo: 71 },
  aasmaani: { raga: "yaman", lead: "santoor", taal: null, tempo: 51 },
  "tasveer-khana": { raga: "kafi", lead: "sitar", taal: "dadra", tempo: 67 },
  sankheda: { raga: "pilu", lead: "shehnai", taal: "garba", tempo: 92 },
  dhokra: { raga: "bhupali", lead: "sitar", taal: "dadra", tempo: 70 },
  "kaanch-chitra": { raga: "hamsadhwani", lead: "santoor", taal: "dadra", tempo: 70 },
  "chettinad-veedu": { raga: "madhyamavati", lead: "veena", taal: "dadra", tempo: 62 },
  meenakari: { raga: "mand", lead: "sitar", taal: "dadra", tempo: 64 },
  rogan: { raga: "pilu", lead: "sitar", taal: "garba", tempo: 78 },
  "shab-e-gul": { raga: "bihag", lead: "sitar", taal: null, tempo: 52 },
  sama: { raga: "khamaj", lead: "santoor", taal: "dadra", tempo: 72 },
  "purani-dilli": { raga: "kafi", lead: "shehnai", taal: "keherwa", tempo: 84 },
  "chandi-nakkashi": { raga: "yaman", lead: "veena", taal: "dadra", tempo: 60 },
  "gagan-safar": { raga: "desh", lead: "santoor", taal: "keherwa", tempo: 80 },
  "kagzi-phool": { raga: "khamaj", lead: "santoor", taal: "keherwa", tempo: 82 },
  nilofar: { raga: "madhyamavati", lead: "bansuri", taal: null, tempo: 58 },
  "sona-gulaab": { raga: "bhupali", lead: "santoor", taal: "dadra", tempo: 72 },
  shabnam: { raga: "yaman", lead: "bansuri", taal: null, tempo: 54 },
  "surkh-gulaab": { raga: "bihag", lead: "sitar", taal: "dadra", tempo: 69 },
  khushboo: { raga: "kafi", lead: "santoor", taal: null, tempo: 66 },
  "ruh-gulaab": { raga: "bhimpalasi", lead: "shehnai", taal: "dadra", tempo: 68 },
  "oud-raat": { raga: "desh", lead: "sitar", taal: null, tempo: 52 },
  gulabpash: { raga: "yaman", lead: "santoor", taal: "dadra", tempo: 57 },
  "shringaar-mez": { raga: "pilu", lead: "sitar", taal: "keherwa", tempo: 74 },
  meghdoot: { raga: "desh", lead: "bansuri", taal: "dadra", tempo: 62 },
  "aath-pehar": { raga: "bhairavi", lead: "sitar", taal: null, tempo: 56 },
  "beej-se-bagh": { raga: "bhupali", lead: "bansuri", taal: "keherwa", tempo: 76 },
  "kissa-kitaab": { raga: "pilu", lead: "santoor", taal: "keherwa", tempo: 86 },
  "itr-daan": { raga: "yaman", lead: "sitar", taal: "dadra", tempo: 62 },
  "pakshi-kosh": { raga: "hamsadhwani", lead: "bansuri", taal: null, tempo: 62 },
  "gudiya-ghar": { raga: "khamaj", lead: "santoor", taal: "keherwa", tempo: 84 },
  "jantar-mantar": { raga: "madhyamavati", lead: "sitar", taal: null, tempo: 60 },
  rangrez: { raga: "kafi", lead: "shehnai", taal: "keherwa", tempo: 88 },
  "phool-mandi": { raga: "bhimpalasi", lead: "bansuri", taal: "dadra", tempo: 70 },
  "udan-khatola": { raga: "bihag", lead: "santoor", taal: "dadra", tempo: 68 },
  "rang-raste": { raga: "kafi", lead: "shehnai", taal: "bhangra", tempo: 94 },
  "kaanch-gumbad": { raga: "yaman", lead: "santoor", taal: "dadra", tempo: 60 },
  "chalk-pati": { raga: "pilu", lead: "bansuri", taal: "keherwa", tempo: 82 },
  "jadon-ka-pul": { raga: "desh", lead: "santoor", taal: null, tempo: 58 },
  "gol-matol": { raga: "khamaj", lead: "bansuri", taal: "keherwa", tempo: 90 },
  "bhool-bhulaiya": { raga: "bihag", lead: "sitar", taal: "dadra", tempo: 64 },
  "deco-yatra": { raga: "hamsadhwani", lead: "santoor", taal: "keherwa", tempo: 78 },
  "gehra-neela": { raga: "madhyamavati", lead: "bansuri", taal: null, tempo: 54 },
  "shatranj-baazi": { raga: "mand", lead: "sitar", taal: null, tempo: 52 },
};

/** Scene themes whose occasion asks for something their kin doesn't play. */
const SCENE_MUSIC: Partial<Record<SceneThemeId, ThemeMusic>> = {
  "garba-raas": { raga: "pilu", tempo: 86 },
  "durga-pujo": { raga: "bhairavi", lead: "shehnai", taal: "keherwa", tempo: 72 },
  "lohri-bonfire": { raga: "kafi", tempo: 88 },
  "baisakhi-mela": { raga: "kafi", tempo: 90 },
  "jaago-gagar": { raga: "kafi", lead: "shehnai", tempo: 86 },
  "sangeet-dhol": { raga: "khamaj", lead: "shehnai", taal: "bhangra", tempo: 86 },
  "baraat-band": { raga: "mand", lead: "shehnai", taal: "bhangra", tempo: 90 },
  "bihu-utsav": { raga: "bhupali", lead: "shehnai", taal: "keherwa", tempo: 90 },
  "holi-rang": { raga: "kafi", lead: "santoor", taal: "keherwa", tempo: 90 },
  "ganesh-utsav": { raga: "hamsadhwani", tempo: 80 },
  "ganesh-genda": { raga: "hamsadhwani", lead: "santoor", taal: "keherwa" },
  "mata-ki-chowki": { raga: "bhairavi", lead: "shehnai", taal: "keherwa", tempo: 74 },
  satyanarayan: { raga: "bhupali", lead: "veena", taal: null, tempo: 62 },
  janmashtami: { raga: "yaman", lead: "bansuri", taal: "dadra", tempo: 70 },
  "kadamb-krishna": { raga: "bhupali", lead: "bansuri", taal: null, tempo: 64 },
  upanayana: { raga: "madhyamavati", lead: "veena", taal: null, tempo: 62 },
  "onam-pookalam": { raga: "madhyamavati", lead: "shehnai", taal: "keherwa", tempo: 78 },
  "pongal-kolam": { raga: "hamsadhwani", lead: "shehnai", taal: "keherwa", tempo: 84 },
  // A prayer meeting stays quiet and slow, whatever its kin plays
  shraddhanjali: { raga: "bhairavi", lead: "bansuri", taal: null, tempo: 52 },
  "doli-vidaai": { raga: "bhairavi", lead: "shehnai", taal: null, tempo: 56 },
  "new-year-eve": { raga: "kafi", lead: "sitar", taal: "keherwa", tempo: 96 },
  "retro-bollywood": { raga: "khamaj", lead: "santoor", taal: "keherwa", tempo: 94 },
};

/** The instrument a varied Scene theme swaps in, keeping the family of sound close. */
const PARTNER: Record<LeadId, LeadId> = {
  santoor: "sitar",
  sitar: "santoor",
  bansuri: "veena",
  veena: "bansuri",
  shehnai: "bansuri",
};

function hash(id: string): number {
  let h = 0;
  for (const char of id) h = (h * 31 + char.charCodeAt(0)) >>> 0;
  return h;
}

/** A theme's own music, or null for the plain card colours, which keep the card's. */
export function themeMusic(id: SuiteId): ThemeMusic | null {
  if (id === "classic") return null;
  if (!isSceneTheme(id)) return PAINTED_MUSIC[id];
  const own = SCENE_MUSIC[id];
  if (own) return own;
  const painted = SCENE_KIN[id];
  if (painted === "classic") return null;
  const kin = PAINTED_MUSIC[painted];
  const { lead, tempo } = RAGAS[kin.raga];
  // One in three keeps the kin's music; the others change its instrument or its pace
  switch (hash(id) % 3) {
    case 1:
      return { ...kin, lead: PARTNER[kin.lead ?? lead] };
    case 2:
      return { ...kin, tempo: Math.min(100, (kin.tempo ?? tempo) + 8) };
    default:
      return kin;
  }
}
