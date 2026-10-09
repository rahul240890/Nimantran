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
