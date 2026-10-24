import type { CategoryId } from "@/lib/categories/catalog";
import { tintIndex } from "@/lib/initials";
import type { StoryId, SuiteId, ThemedId } from "@/lib/suites/catalog";
import { isStoryId, STORY_IDS, SUITES, THEMED_IDS } from "@/lib/suites/catalog";
import type { TemplateId } from "@/lib/templates/ids";
import { FAITH_SYMBOLS, type Faith } from "@/lib/traditions/faith";
import { SYMBOL_IDS, type SymbolId } from "@/lib/traditions/schema";
import { DESIGN_OPENINGS } from "./design-openings";

/*
 * The guest's first screen (Step 12x): a full-height opening the host picks, shown before
 * the pages, the One Scene or the colour card. Each style is drawn in code from the
 * theme's own colours, except "doors", which splits the theme's cover painting, the
 * painted gates, which are paintings of their own in three layers, and the fresh openings,
 * paintings in four or five layers that each open with a movement of their own.
 */

/**
 * The painted gates: the place beyond, the two doors and the arch in front, each a painting.
 * The hole is where the doors hang inside the arch, in % of the painting (941 x 1672). The
 * move is how they open: doors swing in, flowers slide apart, curtains gather, flaps lift.
 */
export const PAINTED_GATES = {
  "rajwada-pol": { move: "swing", hole: { left: 19.7, top: 12.1, width: 60.6, height: 87.9 } },
  "gopuram-kadhavu": {
    move: "swing",
    hole: { left: 15.4, top: 4.9, width: 69, height: 95.1 },
  },
  "noor-darwaza": { move: "swing", hole: { left: 17.9, top: 17.1, width: 64.2, height: 82.9 } },
  "phoolon-ki-deewar": {
    move: "slide",
    hole: { left: 16.8, top: 1.8, width: 66.4, height: 98.2 },
  },
  "haveli-kiwad": { move: "swing", hole: { left: 21.1, top: 19.3, width: 57.5, height: 80.7 } },
  "shahi-parda": { move: "gather", hole: { left: 13.4, top: 2.8, width: 73.1, height: 97.2 } },
  "deco-gates": { move: "swing", hole: { left: 19.8, top: 0.8, width: 60.4, height: 99.2 } },
  "bagiya-gate": { move: "swing", hole: { left: 22.8, top: 6.3, width: 54.6, height: 93.7 } },
  "mela-tamboo": { move: "lift", hole: { left: 9.8, top: 6.2, width: 80.3, height: 93.8 } },
  "chaand-dwar": {
    move: "swing",
    hole: { left: 13.5, top: 11.6, width: 73.0, height: 88.4 },
  },
  "ritu-dwar": {
    move: "swing",
    hole: { left: 11.6, top: 14.8, width: 77.0, height: 85.2 },
  },
  "raag-dwar": {
    move: "swing",
    hole: { left: 8.8, top: 13.9, width: 82.4, height: 86.1 },
  },
  "van-dwar": {
    move: "swing",
    hole: { left: 8.7, top: 12.1, width: 82.6, height: 87.9 },
  },
  "patang-dwar": {
    move: "swing",
    hole: { left: 14.6, top: 22.3, width: 70.9, height: 77.7 },
  },
  "kumhar-dwar": {
    move: "swing",
    hole: { left: 20.1, top: 17.0, width: 59.8, height: 83.0 },
  },
  "karghaa-dwar": {
    move: "swing",
    hole: { left: 14.5, top: 15.8, width: 71.1, height: 84.2 },
  },
  "navrang-dwar": {
    move: "swing",
    hole: { left: 17.7, top: 18.4, width: 64.5, height: 81.6 },
  },
  "ghat-dwar": {
    move: "swing",
    hole: { left: 13.3, top: 22.5, width: 73.3, height: 77.5 },
  },
  "rekha-dwar": {
    move: "swing",
    hole: { left: 9.1, top: 11.6, width: 81.7, height: 88.4 },
  },
  "naqsha-pat": {
    move: "swing",
    hole: { left: 15.9, top: 10.8, width: 68.2, height: 80.8 },
  },
  "kinkhab-parda": {
    move: "gather",
    hole: { left: 18.0, top: 15.4, width: 64.1, height: 81.7 },
  },
  "taad-patta-dwar": {
    move: "slide",
    hole: { left: 23.1, top: 17.9, width: 53.7, height: 65.6 },
  },
  "pichwai-pat": {
    move: "gather",
    hole: { left: 21.6, top: 28.4, width: 57.0, height: 65.0 },
  },
  "chandi-kiwad": {
    move: "swing",
    hole: { left: 19.6, top: 20.5, width: 60.9, height: 70.6 },
  },
  "swarg-kiwad": {
    move: "swing",
    hole: { left: 24.3, top: 13.2, width: 51.3, height: 83.8 },
  },
  "firoza-darwaza": {
    move: "swing",
    hole: { left: 24.1, top: 19.6, width: 51.8, height: 71.4 },
  },
  "jharokha-pat": {
    move: "swing",
    hole: { left: 21.8, top: 33.9, width: 56.4, height: 60.9 },
  },
  "hina-kiwad": {
    move: "swing",
    hole: { left: 15.2, top: 13.4, width: 69.6, height: 81.1 },
  },
  "mor-pankh": {
    move: "slide",
    hole: { left: 21.7, top: 21.7, width: 56.6, height: 73.2 },
  },
  "jugnu-parda": {
    move: "gather",
    hole: { left: 23.1, top: 19.6, width: 53.9, height: 61.4 },
  },
  "sheesh-kiwad": {
    move: "swing",
    hole: { left: 20.4, top: 8.9, width: 59.2, height: 84.3 },
  },
  "sunehri-phatak": {
    move: "swing",
    hole: { left: 13.1, top: 6.9, width: 73.8, height: 83.6 },
  },
  "pattu-thirai": {
    move: "gather",
    hole: { left: 22.0, top: 12.4, width: 56.0, height: 77.5 },
  },
  "kagaz-kiwad": {
    move: "swing",
    hole: { left: 14.0, top: 9.5, width: 72.1, height: 90.5 },
  },
  "peetal-kiwad": {
    move: "swing",
    hole: { left: 18.9, top: 16.2, width: 62.3, height: 83.8 },
  },
  "kaanch-pat": {
    move: "slide",
    hole: { left: 16.9, top: 14.2, width: 66.2, height: 85.8 },
  },
  "thinnai-kadhavu": {
    move: "swing",
    hole: { left: 22.4, top: 14.4, width: 55.2, height: 85.6 },
  },
  "meena-pat": {
    move: "slide",
    hole: { left: 18.3, top: 17.0, width: 63.4, height: 83.0 },
  },
  "rogan-parda": {
    move: "gather",
    hole: { left: 19.6, top: 17.3, width: 60.9, height: 82.7 },
  },
  "makhmal-parda": {
    move: "gather",
    hole: { left: 21.3, top: 12.4, width: 57.3, height: 87.6 },
  },
  "sama-dwar": {
    move: "swing",
    hole: { left: 20.7, top: 18.5, width: 58.6, height: 81.5 },
  },
  "dilli-phatak": {
    move: "swing",
    hole: { left: 19.6, top: 35.9, width: 60.6, height: 64.1 },
  },
  "nakkashi-pat": {
    move: "slide",
    hole: { left: 15.4, top: 17.8, width: 69.1, height: 82.2 },
  },
  "gagan-parda": {
    move: "gather",
    hole: { left: 17.2, top: 17.8, width: 65.6, height: 82.2 },
  },
  "bel-khidki": {
    move: "swing",
    hole: { left: 18.5, top: 15.9, width: 62.4, height: 84.1 },
  },
  "pankhudi-pat": {
    move: "slide",
    hole: { left: 15.8, top: 14.3, width: 67.8, height: 85.7 },
  },
  "gulaab-lifafa": {
    move: "lift",
    hole: { left: 15.6, top: 11.6, width: 69.1, height: 88.4 },
  },
  "os-parda": {
    move: "gather",
    hole: { left: 16.9, top: 13.2, width: 66.1, height: 86.8 },
  },
  "surkh-dwar": {
    move: "swing",
    hole: { left: 18.5, top: 14.5, width: 63.0, height: 85.5 },
  },
  "itr-dibbi": {
    move: "swing",
    hole: { left: 21.2, top: 5.8, width: 57.7, height: 94.2 },
  },
  "gulaab-bhaap": {
    move: "slide",
    hole: { left: 13.1, top: 4.9, width: 73.9, height: 95.1 },
  },
  "oud-darwaza": {
    move: "swing",
    hole: { left: 17.3, top: 8.0, width: 65.5, height: 92.0 },
  },
  "tarkashi-jaali": {
    move: "slide",
    hole: { left: 15.0, top: 8.3, width: 70.0, height: 91.7 },
  },
  "aaina-pat": {
    move: "swing",
    hole: { left: 18.1, top: 7.3, width: 63.9, height: 92.7 },
  },
  "megh-parda": {
    move: "slide",
    hole: { left: 12.6, top: 13.3, width: 74.7, height: 86.7 },
  },
  "pehar-jaali": {
    move: "slide",
    hole: { left: 10.8, top: 9.4, width: 78.3, height: 90.6 },
  },
  "lata-phatak": {
    move: "swing",
    hole: { left: 13.5, top: 10.2, width: 73.0, height: 89.8 },
  },
  "kitaab-jild": {
    move: "swing",
    hole: { left: 8.4, top: 10.0, width: 83.2, height: 90.0 },
  },
  "itr-almari": {
    move: "swing",
    hole: { left: 13.0, top: 7.5, width: 74.1, height: 92.5 },
  },
  "kosh-jild": {
    move: "swing",
    hole: { left: 8.9, top: 8.4, width: 82.1, height: 91.6 },
  },
  "gudiya-pat": {
    move: "swing",
    hole: { left: 15.4, top: 16.6, width: 69.2, height: 83.4 },
  },
  "yantra-pat": {
    move: "swing",
    hole: { left: 14.5, top: 12.3, width: 71.1, height: 87.7 },
  },
  "rang-parda": {
    move: "gather",
    hole: { left: 10.2, top: 7.8, width: 79.6, height: 92.2 },
  },
  "genda-ladi": {
    move: "gather",
    hole: { left: 8.6, top: 6.6, width: 82.8, height: 93.4 },
  },
  "kaleen-parda": {
    move: "slide",
    hole: { left: 9.2, top: 13.8, width: 81.5, height: 86.2 },
  },
  "truck-darwaza": {
    move: "swing",
    hole: { left: 14.2, top: 20.2, width: 71.4, height: 79.8 },
  },
  "kaanch-dhakkan": {
    move: "gather",
    hole: { left: 15.5, top: 8.4, width: 69.0, height: 91.6 },
  },
  "pati-pat": {
    move: "swing",
    hole: { left: 16.6, top: 10.8, width: 66.8, height: 89.2 },
  },
  "jad-jhalar": {
    move: "gather",
    hole: { left: 9.2, top: 12.6, width: 81.6, height: 87.4 },
  },
  "gol-darwaza": {
    move: "swing",
    hole: { left: 19.9, top: 16.7, width: 60.4, height: 83.3 },
  },
  "jhaadi-deewar": {
    move: "slide",
    hole: { left: 13.8, top: 14.8, width: 71.4, height: 85.2 },
  },
  "deco-dibba": {
    move: "slide",
    hole: { left: 19.0, top: 14.5, width: 62.0, height: 85.5 },
  },
  "samundar-parda": {
    move: "slide",
    hole: { left: 15.0, top: 14.2, width: 70.0, height: 85.8 },
  },
  "shatranj-sandook": {
    move: "swing",
    hole: { left: 15.6, top: 10.6, width: 68.8, height: 89.4 },
  },
} as const satisfies Record<
  string,
  {
    move: "swing" | "slide" | "gather" | "lift";
    hole: { left: number; top: number; width: number; height: number };
  }
>;
export type PaintedGate = keyof typeof PAINTED_GATES;
const GATE_IDS = Object.keys(PAINTED_GATES) as PaintedGate[];

export function isPaintedGate(style: string): style is PaintedGate {
  return style in PAINTED_GATES;
}

/**
 * How a tied gate's doors open: swing in, swing out toward the guest like cupboard doors,
 * slide apart, or part like curtains.
 */
export type TiedMove = "swing" | "out" | "slide" | "part";
/**
 * How its tie comes undone: a bow unties and slips off both sides, a brooch or medallion
 * lifts toward the guest, a butterfly or bird flies off, a seal cracks in two, a lock or
 * locket drops, a ball of petals or a bubble bursts, a garland or sash slips away, a
 * rosette spins off, a medallion turns a quarter turn and lets go, a bell rings and falls,
 * a circle rolls away along its line.
 */
export type TiedUndo =
  | "untie"
  | "lift"
  | "fly"
  | "crack"
  | "drop"
  | "burst"
  | "slip"
  | "spin"
  | "turn"
  | "ring"
  | "roll";

/**
 * The tied gates (owner's paintings, templates 41 on: docs/TEMPLATE_PROMPTS_41_TO_55.md and
 * docs/TEMPLATE_GATES_56_TO_85.md): two closed doors filling the screen, held shut by a tie
 * the guest taps to undo, and the doors open onto the template's centre picture. In
 * public/openings/tied/<gate>/: door-left and door-right (one painting cut at its seam by
 * scripts/import-template.mjs), the tie (the whole screen, clear round the tie) and, when
 * it has them, piece-0 to piece-5, which burst out as it comes undone. at: the middle of
 * the tie, % down the screen.
 */
export type TiedSpec = {
  move: TiedMove;
  undo: TiedUndo;
  /**
   * Where the tie sits: its middle, % down the screen. The import puts it there in the tie's
   * own picture (scripts/import-template.mjs --tie-at), at a size that keeps it between the
   * god at the top and the names at the foot (--tie-size).
   */
  at: number;
  pieces: boolean;
  welcome: WelcomeKind;
};
/*
 * Templates 41 to 55 (docs/TEMPLATE_PROMPTS_41_TO_55.md). Each tie was placed by the import
 * with its middle at 40% down and no taller than 36% of the screen, so it keeps below the
 * top 22% (the god's) and clear of the names; a ribbon or cord still runs to both edges.
 */
export const TIED_GATES = {
  // Chini Mitti: a blush satin bow on porcelain doors
  "reshmi-gaanth": {
    move: "swing",
    undo: "untie",
    at: 40,
    pieces: true,
    welcome: "bloom",
  },
  // Libaas: a pearl-and-crystal brooch pinning two silk panels
  "moti-kaanta": {
    move: "part",
    undo: "lift",
    at: 40,
    pieces: true,
    welcome: "royal",
  },
  // Vanaspati: a posy of frangipani on linen twine across copper plates
  guldasta: {
    move: "slide",
    undo: "drop",
    at: 40,
    pieces: true,
    welcome: "letter",
  },
  // Kurinji: an enamel blue butterfly holding two cottage doors
  "neeli-titli": {
    move: "swing",
    undo: "fly",
    at: 40,
    pieces: true,
    welcome: "bloom",
  },
  // Kannauj: a cut-glass attar bottle on a silk cord
  "itr-shishi": {
    move: "swing",
    undo: "drop",
    at: 40,
    pieces: true,
    welcome: "royal",
  },
  // Phoolon ki Ghati: a garland of wild mountain flowers knotted across deodar doors
  "van-mala": {
    move: "swing",
    undo: "slip",
    at: 40,
    pieces: true,
    welcome: "bloom",
  },
  // Tulika: a coral rosette on a ribbon round two canvases
  gulband: {
    move: "slide",
    undo: "spin",
    at: 40,
    pieces: true,
    welcome: "party",
  },
  // Ubhaar: an oxblood wax seal pressed with a jasmine flower
  mudra: {
    move: "slide",
    undo: "crack",
    at: 40,
    pieces: true,
    welcome: "letter",
  },
  // Rajanigandha: a shell bangle and a red lac bangle linked on a tuberose string
  "shankha-pola": {
    move: "swing",
    undo: "crack",
    at: 40,
    pieces: true,
    welcome: "lamps",
  },
  // Rumaal: a silk scarf knotted through a gold ring
  challa: {
    move: "part",
    undo: "slip",
    at: 40,
    pieces: true,
    welcome: "party",
  },
  // Chanderi: a tasselled zari tie-back holding sheer curtains
  latkan: {
    move: "part",
    undo: "drop",
    at: 40,
    pieces: true,
    welcome: "royal",
  },
  // Mishri: a sugar medallion with a sugar rose on fondant doors
  "shakkar-chakri": {
    move: "swing",
    undo: "burst",
    at: 40,
    pieces: true,
    welcome: "party",
  },
  // Paithani: a gold clasp of two parrots beak to beak
  "raghu-maina": {
    move: "slide",
    undo: "crack",
    at: 40,
    pieces: true,
    welcome: "royal",
  },
  // Jamawar: an antique silver rose lock on carved walnut doors
  "taala-chaabi": {
    move: "swing",
    undo: "drop",
    at: 40,
    pieces: true,
    welcome: "night",
  },
  // Phool Bangla: a ball of rose petals on a jasmine string
  "phool-gend": {
    move: "swing",
    undo: "burst",
    at: 40,
    pieces: true,
    welcome: "bloom",
  },
  // Templates 56 to 70 (docs/TEMPLATE_GATES_56_TO_85.md): two pictures each, with no pieces
  // Thewa: a Thewa locket on a ruby cord
  "panna-pat": {
    move: "swing",
    undo: "drop",
    at: 40,
    pieces: false,
    welcome: "royal",
  },
  // Sikki: a woven sikki fish on a grass rope
  "sikki-dwar": {
    move: "swing",
    undo: "fly",
    at: 40,
    pieces: false,
    welcome: "bloom",
  },
  // Hase Chittara: two painted birds beak to beak as a latch
  "hase-bagilu": {
    move: "swing",
    undo: "crack",
    at: 40,
    pieces: false,
    welcome: "letter",
  },
  // Chandigarh: a brass medallion on a leather strap
  "kankreet-dwar": {
    move: "slide",
    undo: "turn",
    at: 40,
    pieces: false,
    welcome: "letter",
  },
  // Do Rang: a giant printed safety pin with a flower charm
  "chhaap-kiwad": {
    move: "swing",
    undo: "drop",
    at: 40,
    pieces: false,
    welcome: "party",
  },
  // Rekhachitra: a brass shop bell on a red cord
  "purana-darwaza": {
    move: "swing",
    undo: "ring",
    at: 40,
    pieces: false,
    welcome: "letter",
  },
  // Bhil Chitra: two dotted birds carrying a garland
  "bindi-kiwad": {
    move: "swing",
    undo: "fly",
    at: 40,
    pieces: false,
    welcome: "bloom",
  },
  // Masala: a string of chillies, star anise and cinnamon
  "masala-almari": {
    move: "out",
    undo: "slip",
    at: 40,
    pieces: false,
    welcome: "royal",
  },
  // Loktak: a striped Manipuri sash with a lily
  "kaagaz-pat": {
    move: "slide",
    undo: "fly",
    at: 40,
    pieces: false,
    welcome: "bloom",
  },
  // Tarakasi: a silver filigree ball on a chain
  "rupa-kiwad": {
    move: "swing",
    undo: "burst",
    at: 40,
    pieces: false,
    welcome: "night",
  },
  // Kuruthola: a plaited palm-leaf knot with a hibiscus
  "ola-vathil": {
    move: "swing",
    undo: "untie",
    at: 40,
    pieces: false,
    welcome: "lamps",
  },
  // Sadaf: strings of pearls gathered by a pearl rosette
  "seep-kiwad": {
    move: "swing",
    undo: "slip",
    at: 40,
    pieces: false,
    welcome: "royal",
  },
  // Aakar: a red circle on a black line
  "aakar-pat": {
    move: "slide",
    undo: "roll",
    at: 40,
    pieces: false,
    welcome: "party",
  },
  // Shwet Shyam: a velvet ribbon holding a lily
  "shwet-dwar": {
    move: "swing",
    undo: "drop",
    at: 40,
    pieces: false,
    welcome: "night",
  },
  // Dhanak: a pearl-ringed glass bubble
  "moti-dwar": {
    move: "swing",
    undo: "burst",
    at: 40,
    pieces: false,
    welcome: "party",
  },
  // Yashab: a jade bangle on a gold chain
  "yashab-kiwad": {
    move: "swing",
    undo: "drop",
    at: 40,
    pieces: false,
    welcome: "royal",
  },
  // Usta Kala: a gold sunburst on a blue ribbon
  "usta-kiwad": {
    move: "swing",
    undo: "untie",
    at: 40,
    pieces: false,
    welcome: "royal",
  },
  // Chaukhane: a pixel gem on a pixel chain
  "pixel-kiwad": {
    move: "swing",
    undo: "burst",
    at: 40,
    pieces: false,
    welcome: "party",
  },
  // Saaya: two silhouette birds on a wire
  "saaya-kiwad": {
    move: "swing",
    undo: "fly",
    at: 40,
    pieces: false,
    welcome: "night",
  },
  // Jingkieng: a bamboo latch with an orchid
  "jad-dwar": {
    move: "part",
    undo: "slip",
    at: 40,
    pieces: false,
    welcome: "bloom",
  },
  // Rangmanch: a theatre's velvet rope on a brass hook
  "natak-dwar": {
    move: "swing",
    undo: "drop",
    at: 40,
    pieces: false,
    welcome: "royal",
  },
  // Kashikari: a brass door chain with a tile
  "kashi-kiwad": {
    move: "swing",
    undo: "ring",
    at: 40,
    pieces: false,
    welcome: "letter",
  },
  // Paan: a peacock betel-nut cutter
  "paandaan-pat": {
    move: "out",
    undo: "turn",
    at: 40,
    pieces: false,
    welcome: "party",
  },
  // Sangemarmar: two interlocking brass rings
  "marmar-dwar": {
    move: "slide",
    undo: "roll",
    at: 40,
    pieces: false,
    welcome: "letter",
  },
  // Susegad: a painted tile on a cord
  "goa-dwar": {
    move: "swing",
    undo: "turn",
    at: 40,
    pieces: false,
    welcome: "lamps",
  },
  // Paranda: a paranda braid with pompoms
  "haveli-pat": {
    move: "swing",
    undo: "untie",
    at: 40,
    pieces: false,
    welcome: "party",
  },
  // Japi: a gamosa tied in a knot
  "bah-dwar": {
    move: "swing",
    undo: "untie",
    at: 40,
    pieces: false,
    welcome: "bloom",
  },
  // Akeek: a quartz crystal wrapped in gold
  "akeek-pat": {
    move: "slide",
    undo: "crack",
    at: 40,
    pieces: false,
    welcome: "night",
  },
  // Samudra Jyoti: a sailor's knot with a shell
  "sagar-dwar": {
    move: "out",
    undo: "untie",
    at: 40,
    pieces: false,
    welcome: "night",
  },
  // Nazaara: a kite caught on its string
  "khet-phatak": {
    move: "out",
    undo: "fly",
    at: 40,
    pieces: false,
    welcome: "bloom",
  },
} as const satisfies Record<string, TiedSpec>;
export type TiedGate = keyof typeof TIED_GATES;
const TIED_IDS = Object.keys(TIED_GATES) as TiedGate[];

export function isTiedGate(style: string): style is TiedGate {
  return style in TIED_GATES;
}

export function tiedSpec(id: TiedGate): TiedSpec {
  return (TIED_GATES as Record<string, TiedSpec>)[id]!;
}

/** A tied gate's place beyond: the centre picture of the template it opens. */
export function tiedBeyond(id: TiedGate): string {
  const template = STORY_IDS.find((story) => STORY_GATE[story] === id);
  return template ? `/suites/${template}/centre.webp` : `/openings/tied/${id}/beyond.webp`;
}

/**
 * How a depth opening's frames wait: they always drift a little against each other with the
 * pointer and on their own, and besides: a gleam slides across them (glint), the rings turn
 * very slowly in opposite directions (spin), the inks slip out of line and back (slip), the
 * frames flicker like lamps or fairy lights (twinkle), or sway like paper reeds (sway).
 */
export type DepthWait = "drift" | "glint" | "spin" | "slip" | "twinkle" | "sway";
/**
 * How the guest passes each frame on opening, front first: it grows past the edges (glide),
 * spinning (spin), turning a quarter turn (turn), as if walked through down a hall (walk),
 * with a small bounce (bounce), tilting to catch the light (tilt), or swinging away like a
 * hanging decoration (swing).
 */
export type DepthPass = "glide" | "spin" | "turn" | "walk" | "bounce" | "tilt" | "swing";
export type DepthSpec = { wait: DepthWait; pass: DepthPass; welcome: WelcomeKind };

/*
 * The depth openings (templates 56 to 70, docs/TEMPLATE_PROMPTS_56_TO_70.md): no doors and
 * nothing to undo, but three painted frames standing one behind another like a paper
 * theatre, and the guest flies through them onto the template's centre picture. In
 * public/openings/depth/<id>/: front, middle and back, each with its opening cut clear by
 * scripts/import-template.mjs. Each is its template's second choice, after its tied gate.
 */
export const DEPTH_OPENINGS = {
  // Thewa: three cusped arches of glowing glass laced with gold
  "sona-parat": { wait: "glint", pass: "glide", welcome: "royal" },
  // Sikki: three coiled rims of golden grass, like looking into a basket
  mauni: { wait: "spin", pass: "spin", welcome: "bloom" },
  // Hase Chittara: three diamonds of rice-paste pattern on red earth
  chowka: { wait: "glint", pass: "turn", welcome: "letter" },
  // Chandigarh: a concrete wall, a grid of sunshades and a round window
  khidkiyaan: { wait: "glint", pass: "walk", welcome: "letter" },
  // Do Rang: a flower, a scallop and a circle printed in two inks
  "phool-chhaap": { wait: "slip", pass: "bounce", welcome: "party" },
  // Rekhachitra: three sketched archways down an old lane
  "gali-gali": { wait: "drift", pass: "walk", welcome: "letter" },
  // Bhil Chitra: a dotted tree, a ring of birds and a ring of flowers
  tipki: { wait: "twinkle", pass: "glide", welcome: "bloom" },
  // Masala: rings of spice, a brass tin's rim and a ring of saffron
  "masala-dabba": { wait: "drift", pass: "glide", welcome: "royal" },
  // Loktak: paper-cut hills, a floating ring of grass and a ring of lilies
  phumdi: { wait: "sway", pass: "glide", welcome: "bloom" },
  // Tarakasi: three silver filigree ovals on midnight velvet
  "rupa-jaali": { wait: "glint", pass: "tilt", welcome: "night" },
  // Kuruthola: an arch of plaited leaves, a ring of leaf flowers, a ring of leaf fish
  thoranam: { wait: "sway", pass: "swing", welcome: "lamps" },
  // Sadaf: three Mughal arches of dark wood inlaid with pearl
  "seep-mehrab": { wait: "glint", pass: "walk", welcome: "royal" },
  // Aakar: a square, a circle and a triangle cut through three canvases
  "teen-aakar": { wait: "spin", pass: "turn", welcome: "party" },
  // Shwet Shyam: three stone arches down a black-and-white colonnade
  galiyara: { wait: "twinkle", pass: "walk", welcome: "night" },
  // Dhanak: a pearly arch, a ring of rainbow glass and a ring of pearls
  chamak: { wait: "glint", pass: "glide", welcome: "party" },
} as const satisfies Record<string, DepthSpec>;
export type DepthOpening = keyof typeof DEPTH_OPENINGS;
const DEPTH_IDS = Object.keys(DEPTH_OPENINGS) as DepthOpening[];

export function isDepthOpening(style: string): style is DepthOpening {
  return style in DEPTH_OPENINGS;
}

export function depthSpec(id: DepthOpening): DepthSpec {
  return (DEPTH_OPENINGS as Record<string, DepthSpec>)[id]!;
}

/** A depth opening's place beyond: the centre picture of the template it was painted with. */
export function depthBeyond(id: DepthOpening): string {
  const template = STORY_IDS.find((story) => STORY_SECOND[story] === id);
  return template ? `/suites/${template}/centre.webp` : `/openings/depth/${id}/beyond.webp`;
}

/**
 * How a bloom opening's flower waits: a lamp's glow moving behind it (glow), a gleam sliding
 * across it (gleam), breathing in steps (pulse), its pieces swaying each on its own (sway),
 * footlights flickering on it (flicker), the whole flower turning very slowly (turn), a
 * glowing ring washing out from the middle (wave), or a cloud's shadow drifting over (shade).
 */
export type BloomWait = "glow" | "gleam" | "pulse" | "sway" | "flicker" | "turn" | "wave" | "shade";
/**
 * How the heart goes, first: lifting toward the guest (lift), rising out of sight (rise),
 * sinking away (sink), blinking out (blink), turning away (turn) or bouncing off (bounce).
 */
export type BloomHeart = "lift" | "rise" | "sink" | "blink" | "turn" | "bounce";
/**
 * How the rings open after it, inner first: outward, growing toward the guest (out), the
 * same in blocky steps (steps), sliding straight out (slide), folding back on their bases
 * (fold), swinging round on them (swing), or fanning out while the ring spins (spin).
 */
export type BloomOpen = "out" | "steps" | "slide" | "fold" | "swing" | "spin";
export type BloomSpec = {
  wait: BloomWait;
  heart: BloomHeart;
  open: BloomOpen;
  welcome: WelcomeKind;
  /**
   * Fewer, wider-spaced pieces over the centre picture left bright, for a flower that is
   * looked through rather than at (Saaya's black palm fronds against the sunset).
   */
  airy?: true;
};

/*
 * The bloom openings (templates 71 to 85, docs/TEMPLATE_PROMPTS_71_TO_85.md): one great
 * flower over the template's centre picture, made of an outer piece and an inner piece
 * copied round in rings and a heart in the middle (opening-bloom.tsx). In
 * public/openings/bloom/<id>/: outer, inner and heart, cut and boxed by
 * scripts/import-template.mjs. Each is its template's second choice, after its tied gate.
 */
export const BLOOM_OPENINGS = {
  // Yashab: a carved jade lotus round a gold-and-ruby heart
  "yashab-kamal": { wait: "glow", heart: "lift", open: "out", welcome: "royal" },
  // Usta Kala: a gold-relief flower of rounded lobes, like a Bikaner dome
  manoti: { wait: "gleam", heart: "lift", open: "out", welcome: "royal" },
  // Chaukhane: a pixel flower, opening like a game level starting
  "chaukor-phool": { wait: "pulse", heart: "blink", open: "steps", welcome: "party" },
  // Saaya: black palm fronds against a sunset sky
  "naariyal-chhaya": {
    wait: "sway",
    heart: "rise",
    open: "slide",
    welcome: "night",
    airy: true,
  },
  // Jingkieng: a canopy of tree-fern fronds round a curled fern
  kundal: { wait: "sway", heart: "turn", open: "out", welcome: "bloom" },
  // Rangmanch: pleated crimson velvet and teal silk round a gilded medallion
  "makhmali-chakra": { wait: "flicker", heart: "rise", open: "fold", welcome: "royal" },
  // Kashikari: glazed tile petals in cobalt and turquoise round a tile rosette
  "kashi-phool": { wait: "gleam", heart: "turn", open: "fold", welcome: "letter" },
  // Paan: glossy betel leaves round a silver-wrapped paan
  beeda: { wait: "gleam", heart: "lift", open: "fold", welcome: "party" },
  // Sangemarmar: a marble floor medallion round a brass boss
  "farshi-phool": { wait: "gleam", heart: "lift", open: "slide", welcome: "letter" },
  // Susegad: oyster-shell window panes round a carved hub
  "seep-khidki": { wait: "glow", heart: "turn", open: "swing", welcome: "lamps" },
  // Paranda: silk tassels round a pompom
  phundne: { wait: "sway", heart: "bounce", open: "swing", welcome: "party" },
  // Japi: a japi's woven segments round a jewelled centre
  "japi-chakra": { wait: "turn", heart: "lift", open: "spin", welcome: "bloom" },
  // Akeek: agate slices edged in gold round a geode
  "akeek-phool": { wait: "gleam", heart: "lift", open: "slide", welcome: "night" },
  // Samudra Jyoti: a scallop shell glowing in the dark round a pearl
  "sagar-seep": { wait: "wave", heart: "lift", open: "out", welcome: "night" },
  // Nazaara: wedges of fields from above round a stepwell
  "khet-chakra": { wait: "shade", heart: "sink", open: "out", welcome: "bloom" },
} as const satisfies Record<string, BloomSpec>;
export type BloomOpening = keyof typeof BLOOM_OPENINGS;
const BLOOM_IDS = Object.keys(BLOOM_OPENINGS) as BloomOpening[];

export function isBloomOpening(style: string): style is BloomOpening {
  return style in BLOOM_OPENINGS;
}

export function bloomSpec(id: BloomOpening): BloomSpec {
  return (BLOOM_OPENINGS as Record<string, BloomSpec>)[id]!;
}

/**
 * A bloom opening's rings, back to front: how many pieces, how long each is against the reach to the
 * farthest corner, where the first sits (as a share of the gap between two), and when it
 * opens (0 first). The second outer ring sits between the first one's pieces, so no gap
 * shows the centre picture before the flower opens.
 */
export const BLOOM_RINGS = [
  { part: "outer", count: 14, length: 1.4, offset: 0, order: 2 },
  { part: "outer", count: 14, length: 1.05, offset: 0.5, order: 1 },
  { part: "inner", count: 10, length: 0.6, offset: 0.25, order: 0 },
] as const;
/** An airy flower's rings: one of the outer piece and one of the inner, the sky between them. */
export const BLOOM_RINGS_AIRY = [
  { part: "outer", count: 9, length: 1.3, offset: 0, order: 1 },
  { part: "inner", count: 7, length: 0.7, offset: 0.5, order: 0 },
] as const;

/** The rings a bloom opening's flower is made of. */
export function bloomRings(id: BloomOpening) {
  return bloomSpec(id).airy ? BLOOM_RINGS_AIRY : BLOOM_RINGS;
}

/** The flower's middle, % across and down the screen: a little above the screen's own. */
export const BLOOM_MIDDLE = { x: 50, y: 42 } as const;

/** A bloom opening's place beyond: the centre picture of the template it was painted with. */
export function bloomBeyond(id: BloomOpening): string {
  const template = STORY_IDS.find((story) => STORY_SECOND[story] === id);
  return template ? `/suites/${template}/centre.webp` : `/openings/bloom/${id}/beyond.webp`;
}

/**
 * The fresh openings (owner's paintings, 2026-10-11): not gates but a fan that folds shut,
 * mirror panels that turn, a pop-up palace, clouds that part, a snow globe to fall into.
 * Each is a place beyond, the thing that opens, edge pieces and loose pieces
 * (shubhdwar/fresh-opening-prompts.md); how each moves is in opening-fresh.tsx.
 */
export const FRESH_OPENINGS = [
  "pankhi",
  "sheesh-mahal",
  "popup-mahal",
  "odhni",
  "kavad-peti",
  "chhatri-utsav",
  "jal-darpan",
  "pushp-varsha",
  "moti-seep",
  "badal-raag",
  "jugnu-van",
  "uday-surya",
  "taaramandal",
  "thar-ki-ret",
  "sheher-ki-raat",
  "choodi-chakra",
  "sanjhi-roshni",
  "chhaya-parda",
  "athangudi-tiles",
  "gulaal-bindu",
  "bioscope",
  "kaanch-ka-gola",
  "phirki",
  "bulbule",
  "chhuk-chhuk",
  // Templates 26 on (shubhdwar/new-15-template-prompts.md): each its template's own, opening
  // onto the template's centre picture
  "chadar",
  "parwaaz",
  "bhanwar",
  "jaali-patta",
  "lapet-khule",
  "taar",
  "pratibimb",
  "mohur",
  "gathbandhan",
  "phuljhadi",
  "semal",
  "thappa",
  "gumbad",
  "ghadi",
  "hindolo",
] as const;
export type FreshOpening = (typeof FRESH_OPENINGS)[number];

export function isFreshOpening(style: string): style is FreshOpening {
  return (FRESH_OPENINGS as readonly string[]).includes(style);
}

/**
 * The place a fresh opening reveals: its own painting, or, for an opening painted with a
 * template that has a centre picture, that picture, so the welcome after it is the same one.
 */
export function freshBeyond(id: FreshOpening): string {
  const template = STORY_IDS.find((story) => STORY_GATE[story] === id && SUITES[story].centre);
  if (template) return `/suites/${template}/centre.webp`;
  return `/openings/fresh/${id}/${id === "popup-mahal" ? "sky" : "beyond"}.webp`;
}

/**
 * The themed openings (catalog.ts THEMED_IDS): each theme's own opening, one painting that
 * moves its own way and opens onto the theme's scene. The move is how the painting goes:
 * zoom (fly through it), threads (falls away in strips), deal (bands slide off to either
 * side), rows (bands swing down one by one), roll (rolls up from the bottom), drop (falls in
 * folds), sink, wheel (the wheel rolls away), fold (folds in half and flies off), wave (a
 * wave washes it off), scratch (wiped away in rubs), frost (wiped clear, then melts), flip
 * (pages flip up), puzzle (its tiles lift out), tumble (blocks fall), colour (the colour
 * sweeps in), gather (drawn up to the top), slide (tips back and slides down), spots (lit
 * up spot by spot).
 */
export const THEMED_OPENINGS = {
  "jaali-vriksh": "zoom",
  pachchikari: "sink",
  "chik-baradari": "roll",
  "baori-deep": "zoom",
  "ikat-dhaaga": "threads",
  "olai-chuvadi": "deal",
  "konark-chakra": "wheel",
  "mandvi-dhow": "drop",
  shekhawati: "scratch",
  lehar: "wave",
  "naksha-pangong": "fold",
  "toran-mala": "rows",
  jhilmil: "spots",
  "howrah-tareekh": "flip",
  "barf-khidki": "frost",
  "pondy-gali": "puzzle",
  "irani-carrom": "slide",
  channapatna: "tumble",
  "ped-ghar": "colour",
  "jhalar-palna": "gather",
} as const satisfies Record<ThemedId, string>;
export type ThemedOpening = keyof typeof THEMED_OPENINGS;
export type ThemedMove = (typeof THEMED_OPENINGS)[ThemedOpening];

export function isThemedOpening(style: string): style is ThemedOpening {
  return style in THEMED_OPENINGS;
}

export const OPENING_STYLES = [
  ...(Object.keys(PAINTED_GATES) as [PaintedGate, ...PaintedGate[]]),
  ...TIED_IDS,
  ...DEPTH_IDS,
  ...BLOOM_IDS,
  ...FRESH_OPENINGS,
  ...THEMED_IDS,
  "doors",
  "palace",
  "temple",
  "curtain",
  "envelope",
  "lotus",
  "mandap",
  "jharokha",
  "phool",
  "scroll",
  "diyas",
  "rangoli",
  "peacock",
  "storybook",
  "lanterns",
  "moonlit",
  "fireworks",
  "balloons",
  "gift",
  "none",
] as const;

/** How the editor groups the styles, so many choices stay easy to scan. */
export const OPENING_GROUPS: readonly { id: string; styles: readonly OpeningStyle[] }[] = [
  { id: "themed", styles: THEMED_IDS },
  { id: "tied", styles: TIED_IDS },
  { id: "depth", styles: DEPTH_IDS },
  { id: "bloom", styles: BLOOM_IDS },
  {
    id: "fresh",
    styles: [
      "pankhi",
      "sheesh-mahal",
      "popup-mahal",
      "odhni",
      "kavad-peti",
      "chhatri-utsav",
      "jal-darpan",
      "pushp-varsha",
      "moti-seep",
    ],
  },
  {
    id: "skies",
    styles: [
      "badal-raag",
      "jugnu-van",
      "uday-surya",
      "taaramandal",
      "thar-ki-ret",
      "sheher-ki-raat",
    ],
  },
  {
    id: "crafts",
    styles: [
      "choodi-chakra",
      "sanjhi-roshni",
      "chhaya-parda",
      "athangudi-tiles",
      "gulaal-bindu",
      "bioscope",
      "chadar",
      "parwaaz",
      "bhanwar",
      "jaali-patta",
      "lapet-khule",
      "taar",
      "pratibimb",
      "mohur",
      "gathbandhan",
      "phuljhadi",
      "semal",
      "thappa",
      "gumbad",
      "ghadi",
      "hindolo",
    ],
  },
  { id: "play", styles: ["kaanch-ka-gola", "phirki", "bulbule", "chhuk-chhuk"] },
  { id: "painted", styles: GATE_IDS },
  { id: "doors", styles: ["doors", "palace", "temple", "jharokha", "mandap", "storybook"] },
  { id: "reveals", styles: ["curtain", "phool", "envelope", "scroll", "gift"] },
  { id: "light", styles: ["lotus", "diyas", "rangoli", "peacock", "lanterns", "moonlit"] },
  { id: "party", styles: ["fireworks", "balloons", "none"] },
];

/** Each occasion's own opening, when the host hasn't picked one and there is no cover. */
const OCCASION_OPENING: Partial<Record<CategoryId, OpeningStyle>> = {
  birthday: "mela-tamboo",
  party: "deco-gates",
  "farewell-party": "deco-gates",
  launch: "sheher-ki-raat",
  "shop-opening": "gift",
  "baby-shower": "bulbule",
  diwali: "diyas",
  eid: "noor-darwaza",
  janmashtami: "sanjhi-roshni",
  onam: "rangoli",
  sankranti: "uday-surya",
  lohri: "lanterns",
  navratri: "lanterns",
  engagement: "phoolon-ki-deewar",
  roka: "jugnu-van",
  haldi: "badal-raag",
  mehendi: "choodi-chakra",
  sangeet: "jugnu-van",
  reception: "sheesh-mahal",
  "save-the-date": "envelope",
  anniversary: "popup-mahal",
  housewarming: "haveli-kiwad",
  annaprashan: "uday-surya",
  holi: "gulaal-bindu",
  christmas: "kaanch-ka-gola",
  reunion: "bioscope",
  retirement: "bioscope",
  graduation: "fireworks",
  "gudi-padwa": "rangoli",
  baisakhi: "lanterns",
  bihu: "rangoli",
  christening: "bagiya-gate",
  "naming-ceremony": "mela-tamboo",
  "raksha-bandhan": "gift",
  "karva-chauth": "odhni",
};
export type OpeningStyle = (typeof OPENING_STYLES)[number];

/**
 * How the names sit on the opening's first screen (owner, 2026-10-19: one cream plate on
 * every opening hid the gate or painting behind it, and every design looked alike). None is
 * a box: the names come big in the welcome and on the pages, so here they only say whose
 * invitation it is.
 * - print: on the art where the plate was, in ivory with a soft glow (the drawn openings)
 * - foot: one line over the ground, above the countdown, the painting left whole
 * - seal: the initials in a small gilt ring at the foot, the names small under it
 * - quiet: not shown; the painting alone, and the names are read out to screen readers
 * Paintings mix them, by the opening, so designs side by side don't greet alike.
 */
export type OpeningNames = "print" | "foot" | "seal" | "quiet";

export function openingNames(style: OpeningStyle): OpeningNames {
  const pick = (looks: readonly OpeningNames[]) => looks[tintIndex(style, looks.length)]!;
  if (isPaintedGate(style)) return pick(["foot", "quiet"]);
  // The tie sits on the seam below the names, so the names keep to the foot
  if (isTiedGate(style)) return "foot";
  // The frames' openings meet in the middle, where the centre picture waits
  if (isDepthOpening(style)) return "foot";
  // The heart waits in the middle, where the flower opens
  if (isBloomOpening(style)) return "foot";
  if (isFreshOpening(style)) return pick(["seal", "foot"]);
  if (isThemedOpening(style)) return pick(["foot", "seal", "quiet"]);
  return "print";
}

/** The openings that suit a wedding, of any faith (HINDU_OPENINGS are kept to Hindu cards). */
const WEDDING_OPENINGS: readonly OpeningStyle[] = [
  "rajwada-pol",
  "chadar",
  "parwaaz",
  "bhanwar",
  "jaali-patta",
  "lapet-khule",
  "taar",
  "pratibimb",
  "mohur",
  "gathbandhan",
  "phuljhadi",
  "semal",
  "thappa",
  "gumbad",
  "ghadi",
  "hindolo",
  "reshmi-gaanth",
  "moti-kaanta",
  "guldasta",
  "neeli-titli",
  "itr-shishi",
  "van-mala",
  "gulband",
  "mudra",
  "shankha-pola",
  "challa",
  "latkan",
  "shakkar-chakri",
  "raghu-maina",
  "taala-chaabi",
  "phool-gend",
  "panna-pat",
  "sikki-dwar",
  "hase-bagilu",
  "kankreet-dwar",
  "chhaap-kiwad",
  "purana-darwaza",
  "bindi-kiwad",
  "masala-almari",
  "kaagaz-pat",
  "rupa-kiwad",
  "ola-vathil",
  "seep-kiwad",
  "aakar-pat",
  "shwet-dwar",
  "moti-dwar",
  "sona-parat",
  "mauni",
  "chowka",
  "khidkiyaan",
  "phool-chhaap",
  "gali-gali",
  "tipki",
  "masala-dabba",
  "phumdi",
  "rupa-jaali",
  "thoranam",
  "seep-mehrab",
  "teen-aakar",
  "galiyara",
  "chamak",
  "yashab-kiwad",
  "usta-kiwad",
  "pixel-kiwad",
  "saaya-kiwad",
  "jad-dwar",
  "natak-dwar",
  "kashi-kiwad",
  "paandaan-pat",
  "marmar-dwar",
  "goa-dwar",
  "haveli-pat",
  "bah-dwar",
  "akeek-pat",
  "sagar-dwar",
  "khet-phatak",
  "yashab-kamal",
  "manoti",
  "chaukor-phool",
  "naariyal-chhaya",
  "kundal",
  "makhmali-chakra",
  "kashi-phool",
  "beeda",
  "farshi-phool",
  "seep-khidki",
  "phundne",
  "japi-chakra",
  "akeek-phool",
  "sagar-seep",
  "khet-chakra",
  "noor-darwaza",
  "haveli-kiwad",
  "shahi-parda",
  "bagiya-gate",
  "deco-gates",
  "sheesh-mahal",
  "popup-mahal",
  "pankhi",
  "odhni",
  "kavad-peti",
  "chhatri-utsav",
  "moti-seep",
  "badal-raag",
  "jugnu-van",
  "taaramandal",
  "thar-ki-ret",
  "sheher-ki-raat",
  "choodi-chakra",
  "chhaya-parda",
  "athangudi-tiles",
  "bioscope",
  "chaand-dwar",
  "ritu-dwar",
  "raag-dwar",
  "karghaa-dwar",
  "navrang-dwar",
  "rekha-dwar",
  "naqsha-pat",
  "kinkhab-parda",
  "taad-patta-dwar",
  "pichwai-pat",
  "chandi-kiwad",
  "swarg-kiwad",
  "firoza-darwaza",
  "jharokha-pat",
  "hina-kiwad",
  "mor-pankh",
  "jugnu-parda",
  "sheesh-kiwad",
  "sunehri-phatak",
  "pattu-thirai",
  "kagaz-kiwad",
  "peetal-kiwad",
  "kaanch-pat",
  "thinnai-kadhavu",
  "meena-pat",
  "rogan-parda",
  "makhmal-parda",
  "sama-dwar",
  "dilli-phatak",
  "nakkashi-pat",
  "gagan-parda",
  "bel-khidki",
  "pankhudi-pat",
  "gulaab-lifafa",
  "os-parda",
  "surkh-dwar",
  "itr-dibbi",
  "gulaab-bhaap",
  "oud-darwaza",
  "tarkashi-jaali",
  "aaina-pat",
  "megh-parda",
  "pehar-jaali",
  "lata-phatak",
  "itr-almari",
  "rang-parda",
  "genda-ladi",
  "kaleen-parda",
  "kaanch-dhakkan",
  "jad-jhalar",
  "deco-dibba",
  "kitaab-jild",
  "jhaadi-deewar",
  "patang-dwar",
  "kumhar-dwar",
  "van-dwar",
  "samundar-parda",
  "gopuram-kadhavu",
  "phoolon-ki-deewar",
  "pushp-varsha",
  "jal-darpan",
  "ghat-dwar",
  "palace",
  "temple",
  "mandap",
  "jharokha",
  "curtain",
  "envelope",
  "phool",
  "scroll",
  "peacock",
  "storybook",
  "lanterns",
  "moonlit",
  "lotus",
  "rangoli",
  "diyas",
];

/**
 * The openings that suit each occasion, its own first: what a design painted without an
 * opening of its own is given (design-openings.ts), so the designs don't all open alike
 * (owner, 2026-10-17). The days around a wedding take the wedding's openings too.
 */
export const OCCASION_OPENINGS: Partial<Record<CategoryId, readonly OpeningStyle[]>> = {
  wedding: WEDDING_OPENINGS,
  engagement: [
    "phoolon-ki-deewar",
    "gulaab-lifafa",
    "surkh-dwar",
    "kaanch-dhakkan",
    "itr-dibbi",
    "pankhudi-pat",
    "os-parda",
    "sheesh-mahal",
    "bagiya-gate",
    "popup-mahal",
    "phool",
    "moonlit",
  ],
  "save-the-date": [
    "envelope",
    "gulaab-lifafa",
    "popup-mahal",
    "taaramandal",
    "kitaab-jild",
    "scroll",
  ],
  roka: ["jugnu-van", "phoolon-ki-deewar", "genda-ladi", "ritu-dwar", "chhatri-utsav", "phool"],
  haldi: ["badal-raag", "genda-ladi", "bel-khidki", "megh-parda", "ritu-dwar", "phool"],
  mehendi: ["choodi-chakra", "odhni", "pankhi", "bel-khidki", "rang-parda", "aaina-pat", "peacock"],
  sangeet: [
    "jugnu-van",
    "raag-dwar",
    "shahi-parda",
    "chhatri-utsav",
    "chhaya-parda",
    "navrang-dwar",
    "truck-darwaza",
    "bioscope",
    "curtain",
    "lanterns",
    "fireworks",
  ],
  reception: [
    "sheesh-mahal",
    "shahi-parda",
    "taaramandal",
    "tarkashi-jaali",
    "deco-dibba",
    "sheher-ki-raat",
    "curtain",
    "fireworks",
  ],
  anniversary: [
    "popup-mahal",
    "shahi-parda",
    "sheesh-mahal",
    "moti-seep",
    "surkh-dwar",
    "chaand-dwar",
    "itr-almari",
    "gulaab-bhaap",
    "kaanch-dhakkan",
    "bagiya-gate",
    "moonlit",
    "envelope",
  ],
  birthday: [
    "mela-tamboo",
    "bulbule",
    "phirki",
    "chhuk-chhuk",
    "van-dwar",
    "gudiya-pat",
    "gol-darwaza",
    "jhaadi-deewar",
    "kitaab-jild",
    "kosh-jild",
    "samundar-parda",
    "shatranj-sandook",
    "truck-darwaza",
    "patang-dwar",
    "kaleen-parda",
    "pati-pat",
    "kaanch-ka-gola",
    "gulaal-bindu",
    "jugnu-van",
    "taaramandal",
    "bioscope",
    "popup-mahal",
    "moti-seep",
    "badal-raag",
    "deco-gates",
    "sheher-ki-raat",
    "balloons",
    "gift",
    "storybook",
    "fireworks",
  ],
  "naming-ceremony": ["mela-tamboo", "bulbule", "uday-surya", "phirki", "kosh-jild", "storybook"],
  "baby-shower": [
    "bulbule",
    "phirki",
    "gol-darwaza",
    "kosh-jild",
    "gudiya-pat",
    "os-parda",
    "pankhudi-pat",
    "lata-phatak",
    "bagiya-gate",
    "badal-raag",
    "balloons",
    "phool",
  ],
  party: [
    "deco-gates",
    "sheher-ki-raat",
    "bioscope",
    "deco-dibba",
    "shatranj-sandook",
    "truck-darwaza",
    "taaramandal",
    "jugnu-van",
    "thar-ki-ret",
    "curtain",
    "fireworks",
    "lanterns",
  ],
  "farewell-party": ["deco-gates", "sheher-ki-raat", "bioscope", "deco-dibba", "lanterns"],
  retirement: ["bioscope", "kitaab-jild", "ritu-dwar", "sheher-ki-raat", "taaramandal"],
  reunion: ["bioscope", "pati-pat", "kitaab-jild", "shatranj-sandook", "sheher-ki-raat"],
  graduation: ["fireworks", "pati-pat", "kitaab-jild", "yantra-pat", "taaramandal"],
  launch: ["sheher-ki-raat", "deco-dibba", "yantra-pat", "taaramandal", "deco-gates"],
  "shop-opening": ["gift", "sheher-ki-raat", "deco-dibba", "deco-gates", "haveli-kiwad"],
  housewarming: [
    "haveli-kiwad",
    "uday-surya",
    "ritu-dwar",
    "gol-darwaza",
    "lata-phatak",
    "karghaa-dwar",
    "athangudi-tiles",
    "naqsha-pat",
    "kinkhab-parda",
    "taad-patta-dwar",
    "pichwai-pat",
    "chandi-kiwad",
    "swarg-kiwad",
    "firoza-darwaza",
    "jharokha-pat",
    "hina-kiwad",
    "mor-pankh",
    "jugnu-parda",
    "sheesh-kiwad",
    "sunehri-phatak",
    "pattu-thirai",
    "kagaz-kiwad",
    "peetal-kiwad",
    "kaanch-pat",
    "thinnai-kadhavu",
    "meena-pat",
    "rogan-parda",
    "makhmal-parda",
    "sama-dwar",
    "dilli-phatak",
    "nakkashi-pat",
    "gagan-parda",
    "bel-khidki",
    "palace",
  ],
  puja: ["rajwada-pol", "gopuram-kadhavu", "jal-darpan", "ghat-dwar", "temple", "lotus", "moonlit"],
  diwali: ["diyas", "kumhar-dwar", "jal-darpan", "sheesh-mahal", "lanterns", "rangoli"],
  navratri: ["lanterns", "choodi-chakra", "navrang-dwar", "chhatri-utsav", "odhni", "peacock"],
  eid: ["noor-darwaza", "chaand-dwar", "tarkashi-jaali", "pehar-jaali", "oud-darwaza", "moonlit"],
  christmas: ["kaanch-ka-gola", "gol-darwaza", "taaramandal", "lanterns", "gift"],
  sankranti: ["uday-surya", "patang-dwar", "badal-raag", "rangoli"],
  janmashtami: ["sanjhi-roshni", "chhaya-parda", "peacock", "jal-darpan"],
  onam: ["rangoli", "pushp-varsha", "athangudi-tiles", "gopuram-kadhavu"],
  holi: ["gulaal-bindu", "rang-parda", "navrang-dwar", "badal-raag"],
  "gudi-padwa": ["rangoli", "uday-surya", "oud-darwaza"],
  bihu: ["rangoli", "badal-raag", "lata-phatak"],
  baisakhi: ["lanterns", "phirki", "genda-ladi"],
  lohri: ["lanterns", "thar-ki-ret", "phirki"],
  "raksha-bandhan": ["gift", "genda-ladi", "rang-parda"],
  "karva-chauth": ["odhni", "chaand-dwar", "moonlit"],
  "ganesh-chaturthi": ["rajwada-pol", "temple", "gopuram-kadhavu", "genda-ladi"],
  "thread-ceremony": ["rajwada-pol", "gopuram-kadhavu", "ghat-dwar", "temple"],
  "prayer-meet": ["rajwada-pol", "diyas", "lotus"],
  annaprashan: ["uday-surya", "bulbule", "kosh-jild"],
  christening: ["bagiya-gate", "os-parda", "lata-phatak"],
};

/** Openings onto a Hindu place or rite (a temple, a mandap, a ghat): for a Hindu card only. */
const HINDU_OPENINGS: readonly OpeningStyle[] = [
  "gopuram-kadhavu",
  "phoolon-ki-deewar",
  "pushp-varsha",
  "jal-darpan",
  "ghat-dwar",
  "sanjhi-roshni",
  "temple",
  "mandap",
  "lotus",
  "rangoli",
  "diyas",
];

/** The days around a wedding, which take its openings too. */
const WEDDING_DAYS: readonly CategoryId[] = [
  "engagement",
  "save-the-date",
  "roka",
  "haldi",
  "mehendi",
  "sangeet",
  "reception",
];

/** Whether an opening suits the occasion and the family's faith. */
export function openingSuits(style: OpeningStyle, category: CategoryId, faith: Faith): boolean {
  if (HINDU_OPENINGS.includes(style) && faith !== "hindu") return false;
  if (OCCASION_OPENINGS[category]?.includes(style)) return true;
  return WEDDING_DAYS.includes(category) && WEDDING_OPENINGS.includes(style);
}

/**
 * A design's own opening, by its id as the gallery names it: the theme for its pages, the
 * theme and "-scene" for its Scene, "card-" and the card for a 3D card.
 */
export function designOpening(
  suite: SuiteId,
  scene: boolean,
  template?: TemplateId,
): OpeningStyle | null {
  if (suite === "classic") return (template && DESIGN_OPENINGS[`card-${template}`]) || null;
  const pages = DESIGN_OPENINGS[suite];
  const painting = DESIGN_OPENINGS[`${suite}-scene`];
  return (scene ? (painting ?? pages) : (pages ?? painting)) ?? null;
}

/** The gods painted for us: the owner's own art from the blessing pages, shown whole. */
export const PAINTED_GODS = [
  "ganesha",
  "ganesha-gold",
  "lakshmi-ganesha",
  "shrinathji",
  "venkateswara",
  "jagannath",
] as const;

/**
 * What sits top-centre above the opening: a god painted for us, or one of the sacred
 * symbols drawn in code for every faith's cards (TRADITIONS.md, 5).
 */
export const OPENING_GODS = [...PAINTED_GODS, ...SYMBOL_IDS] as const;
export type OpeningGod = (typeof OPENING_GODS)[number];

/** The symbol an opening's god is, when it isn't a painting. */
export function godSymbol(god: OpeningGod): SymbolId | null {
  return (SYMBOL_IDS as readonly string[]).includes(god) ? (god as SymbolId) : null;
}

/**
 * The gods and symbols offered over a family's opening: the painted gods and Hindu symbols
 * for a Hindu card, only its own faith's symbols for any other, none for a family that
 * wants no religious lines. An occasion with no religious wording (a birthday) offers what
 * a Hindu card does, as it always has, for families who want Ganesha there.
 */
export function openingGods(faith: Faith, chosen: boolean): readonly OpeningGod[] {
  if (faith === "none") return chosen ? [] : [...PAINTED_GODS, ...FAITH_SYMBOLS.hindu];
  return faith === "hindu" ? [...PAINTED_GODS, ...FAITH_SYMBOLS.hindu] : FAITH_SYMBOLS[faith];
}

export type OpeningChoice = {
  /** Null follows the design: its own opening (openingStyle). */
  style: OpeningStyle | null;
  /** Null opens without a god or symbol. */
  god: OpeningGod | null;
  /** The welcome after it; null picks one that suits the opening, another each visit. */
  welcome: WelcomeScene | null;
};

export const noOpening: OpeningChoice = { style: null, god: null, welcome: null };

/** Each painting's file and its width over height, so it is laid out whole. */
export const GOD_PAINTINGS: Partial<Record<OpeningGod, { src: string; aspect: number }>> = {
  ganesha: { src: "/openings/ganesha.webp", aspect: 583 / 518 },
  "ganesha-gold": { src: "/openings/ganesha-gold.webp", aspect: 707 / 668 },
  "lakshmi-ganesha": { src: "/openings/lakshmi-ganesha.webp", aspect: 768 / 546 },
  shrinathji: { src: "/openings/shrinathji.webp", aspect: 768 / 641 },
  venkateswara: { src: "/openings/venkateswara.webp", aspect: 768 / 600 },
  jagannath: { src: "/openings/jagannath.webp", aspect: 768 / 668 },
};

/**
 * Occasions where a god is not offered by default (TRADITIONS.md: not in party categories).
 * Eid and a christening offer their own faith's symbols (openingGods).
 */
const NO_GODS: readonly CategoryId[] = ["party", "farewell-party", "launch", "retirement"];

export function offersGods(category: CategoryId): boolean {
  return !NO_GODS.includes(category);
}

/** The theme has a cover painting to split as doors. */
export function hasCoverDoors(suite: SuiteId): boolean {
  return SUITES[suite].art !== "card" && Boolean(SUITES[suite].images.cover);
}

/** The styles a host can pick for this theme and kind of invitation. */
export function openingStyles(suite: SuiteId, scene: boolean): readonly OpeningStyle[] {
  return OPENING_STYLES.filter(
    (style) => (style !== "doors" || hasCoverDoors(suite)) && (style !== "none" || scene),
  );
}

/**
 * Each story theme's own gate, painted with its pages: from template 26 its own fresh
 * opening, from template 41 its own tied gate.
 */
const STORY_GATE: Record<StoryId, PaintedGate | FreshOpening | TiedGate> = {
  hashiya: "chadar",
  gara: "parwaaz",
  abri: "bhanwar",
  "neel-chhaap": "jaali-patta",
  lapet: "lapet-khule",
  chandan: "taar",
  "bundi-chitra": "pratibimb",
  banjara: "mohur",
  leheriya: "gathbandhan",
  nirmal: "phuljhadi",
  shola: "semal",
  dabu: "thappa",
  aasmaani: "gumbad",
  "tasveer-khana": "ghadi",
  sankheda: "hindolo",
  "chaand-kalayein": "chaand-dwar",
  "ritu-chakra": "ritu-dwar",
  raagmala: "raag-dwar",
  panchatantra: "van-dwar",
  "patang-udaan": "patang-dwar",
  "diya-ki-kahani": "kumhar-dwar",
  "resham-katha": "karghaa-dwar",
  navrang: "navrang-dwar",
  "nadi-safar": "ghat-dwar",
  "ek-rekha": "rekha-dwar",
  "mahal-yatra": "naqsha-pat",
  kinkhab: "kinkhab-parda",
  "saanjh-kinara": "taad-patta-dwar",
  "nathdwara-raat": "pichwai-pat",
  "chandni-mahal": "chandi-kiwad",
  "aakash-mahal": "swarg-kiwad",
  "firoza-bagh": "firoza-darwaza",
  "gulabi-nagar": "jharokha-pat",
  hina: "hina-kiwad",
  "mor-sarovar": "mor-pankh",
  kumudini: "jugnu-parda",
  darbar: "sheesh-kiwad",
  "sunehri-sarovar": "sunehri-phatak",
  pattu: "pattu-thirai",
  "sona-rekha": "kagaz-kiwad",
  dhokra: "peetal-kiwad",
  "kaanch-chitra": "kaanch-pat",
  "chettinad-veedu": "thinnai-kadhavu",
  meenakari: "meena-pat",
  rogan: "rogan-parda",
  "shab-e-gul": "makhmal-parda",
  sama: "sama-dwar",
  "purani-dilli": "dilli-phatak",
  "chandi-nakkashi": "nakkashi-pat",
  "gagan-safar": "gagan-parda",
  "kagzi-phool": "bel-khidki",
  nilofar: "pankhudi-pat",
  "chini-mitti": "reshmi-gaanth",
  libaas: "moti-kaanta",
  vanaspati: "guldasta",
  kurinji: "neeli-titli",
  kannauj: "itr-shishi",
  "phoolon-ki-ghati": "van-mala",
  tulika: "gulband",
  ubhaar: "mudra",
  rajanigandha: "shankha-pola",
  rumaal: "challa",
  chanderi: "latkan",
  mishri: "shakkar-chakri",
  paithani: "raghu-maina",
  jamawar: "taala-chaabi",
  "phool-bangla": "phool-gend",
  thewa: "panna-pat",
  sikki: "sikki-dwar",
  "hase-chittara": "hase-bagilu",
  chandigarh: "kankreet-dwar",
  "do-rang": "chhaap-kiwad",
  rekhachitra: "purana-darwaza",
  "bhil-chitra": "bindi-kiwad",
  masala: "masala-almari",
  loktak: "kaagaz-pat",
  tarakasi: "rupa-kiwad",
  kuruthola: "ola-vathil",
  sadaf: "seep-kiwad",
  aakar: "aakar-pat",
  "shwet-shyam": "shwet-dwar",
  dhanak: "moti-dwar",
  yashab: "yashab-kiwad",
  "usta-kala": "usta-kiwad",
  chaukhane: "pixel-kiwad",
  saaya: "saaya-kiwad",
  jingkieng: "jad-dwar",
  rangmanch: "natak-dwar",
  kashikari: "kashi-kiwad",
  paan: "paandaan-pat",
  sangemarmar: "marmar-dwar",
  susegad: "goa-dwar",
  paranda: "haveli-pat",
  japi: "bah-dwar",
  akeek: "akeek-pat",
  "samudra-jyoti": "sagar-dwar",
  nazaara: "khet-phatak",
  "sona-gulaab": "gulaab-lifafa",
  shabnam: "os-parda",
  "surkh-gulaab": "surkh-dwar",
  khushboo: "itr-dibbi",
  "ruh-gulaab": "gulaab-bhaap",
  "oud-raat": "oud-darwaza",
  gulabpash: "tarkashi-jaali",
  "shringaar-mez": "aaina-pat",
  meghdoot: "megh-parda",
  "aath-pehar": "pehar-jaali",
  "beej-se-bagh": "lata-phatak",
  "kissa-kitaab": "kitaab-jild",
  "itr-daan": "itr-almari",
  "pakshi-kosh": "kosh-jild",
  "gudiya-ghar": "gudiya-pat",
  "jantar-mantar": "yantra-pat",
  rangrez: "rang-parda",
  "phool-mandi": "genda-ladi",
  "udan-khatola": "kaleen-parda",
  "rang-raste": "truck-darwaza",
  "kaanch-gumbad": "kaanch-dhakkan",
  "chalk-pati": "pati-pat",
  "jadon-ka-pul": "jad-jhalar",
  "gol-matol": "gol-darwaza",
  "bhool-bhulaiya": "jhaadi-deewar",
  "deco-yatra": "deco-dibba",
  "gehra-neela": "samundar-parda",
  "shatranj-baazi": "shatranj-sandook",
};

/**
 * A template's second opening, after its own gate: templates 56 to 70 open with a tied gate
 * and offer their depth opening beside it, and 71 to 85 their bloom opening, all made for
 * the design.
 */
const STORY_SECOND: Partial<Record<StoryId, DepthOpening | BloomOpening>> = {
  thewa: "sona-parat",
  sikki: "mauni",
  "hase-chittara": "chowka",
  chandigarh: "khidkiyaan",
  "do-rang": "phool-chhaap",
  rekhachitra: "gali-gali",
  "bhil-chitra": "tipki",
  masala: "masala-dabba",
  loktak: "phumdi",
  tarakasi: "rupa-jaali",
  kuruthola: "thoranam",
  sadaf: "seep-mehrab",
  aakar: "teen-aakar",
  "shwet-shyam": "galiyara",
  dhanak: "chamak",
  yashab: "yashab-kamal",
  "usta-kala": "manoti",
  chaukhane: "chaukor-phool",
  saaya: "naariyal-chhaya",
  jingkieng: "kundal",
  rangmanch: "makhmali-chakra",
  kashikari: "kashi-phool",
  paan: "beeda",
  sangemarmar: "farshi-phool",
  susegad: "seep-khidki",
  paranda: "phundne",
  japi: "japi-chakra",
  akeek: "akeek-phool",
  "samudra-jyoti": "sagar-seep",
  nazaara: "khet-chakra",
};

/** The design's own openings: its own first, then any second made with it. */
export function ownOpenings(own: OpeningStyle, suite: SuiteId): readonly OpeningStyle[] {
  const second = isStoryId(suite) ? STORY_SECOND[suite] : undefined;
  return second && second !== own ? [own, second] : [own];
}

/**
 * The style the guest sees: the host's pick when it fits, else the design's own: its theme's
 * opening, the gate given to the design when it suits the occasion and the family's faith,
 * the cover split as doors, or the occasion's own.
 */
export function openingStyle(
  choice: Pick<OpeningChoice, "style"> & Partial<OpeningChoice>,
  suite: SuiteId,
  scene: boolean,
  category?: CategoryId,
  card?: { template?: TemplateId; faith: Faith },
): OpeningStyle {
  const offered = openingStyles(suite, scene);
  if (choice.style && offered.includes(choice.style)) return choice.style;
  // A themed opening's own theme opens with it
  if (isThemedOpening(suite)) return suite;
  // A story theme opens with its own gate
  if (isStoryId(suite)) return STORY_GATE[suite];
  const own = designOpening(suite, scene, card?.template);
  if (own && card && openingSuits(own, category ?? "wedding", card.faith)) return own;
  if (hasCoverDoors(suite) && !scene) return "doors";
  return (category && OCCASION_OPENING[category]) ?? "rajwada-pol";
}

/**
 * The god the guest sees, dropped where the occasion doesn't offer one, or where the
 * family's faith doesn't (a Ganesha picked before the card became a Nikah's).
 */
export function openingGod(
  choice: Pick<OpeningChoice, "god"> & Partial<OpeningChoice>,
  category: CategoryId,
  faith?: { faith: Faith; chosen: boolean },
): OpeningGod | null {
  if (!choice.god || !offersGods(category)) return null;
  if (faith && !openingGods(faith.faith, faith.chosen).includes(choice.god)) return null;
  return choice.god;
}

/**
 * The moment between the opening and the pages takes the opening's own feeling: a toran
 * and turning sun rays after a palace door, a lotus opening after flowers, lamps lit one by
 * one, a moon rising, confetti for a party, or a letter unfolding.
 */
export const WELCOME_KINDS = ["royal", "bloom", "lamps", "night", "party", "letter"] as const;
export type WelcomeKind = (typeof WELCOME_KINDS)[number];

/**
 * Every welcome a guest can see: the six feelings' own scenes, and ten more drawn as
 * scenery (welcome-scenes.tsx): a mandala, a peacock's fan, a sunrise, a garden, a rangoli,
 * diyas on the ghat, fireflies, sky lanterns, kites and the sea.
 */
export const WELCOME_SCENES = [
  ...WELCOME_KINDS,
  "mandala",
  "peacock",
  "sunrise",
  "garden",
  "rangoli",
  "ghat",
  "fireflies",
  "sky-lanterns",
  "kites",
  "waves",
] as const;
export type WelcomeScene = (typeof WELCOME_SCENES)[number];

/** The scenes that share each opening's feeling, its own first. */
export const WELCOME_POOLS: Record<WelcomeKind, readonly WelcomeScene[]> = {
  royal: ["royal", "mandala", "peacock", "sunrise"],
  bloom: ["bloom", "garden", "peacock", "rangoli"],
  lamps: ["lamps", "ghat", "fireflies", "rangoli"],
  night: ["night", "sky-lanterns", "fireflies", "waves"],
  party: ["party", "kites", "sunrise", "garden"],
  letter: ["letter", "rangoli", "mandala", "garden"],
};

/**
 * The welcome a guest sees after this opening: the host's pick, else one of the scenes
 * that share the opening's feeling, `pick` (0 to 1) choosing which, so each visit can
 * bring another.
 */
export function welcomeScene(
  choice: Pick<OpeningChoice, "welcome">,
  style: OpeningStyle,
  pick = 0,
): WelcomeScene {
  if (choice.welcome) return choice.welcome;
  const pool = WELCOME_POOLS[welcomeKind(style)];
  return pool[Math.min(pool.length - 1, Math.floor(pick * pool.length))]!;
}

/** Scenes with a night sky or dark water carry ivory words, as the dark feelings do. */
const DARK_SCENES: readonly WelcomeScene[] = [
  "lamps",
  "night",
  "party",
  "peacock",
  "ghat",
  "fireflies",
  "sky-lanterns",
];
export const darkWelcome = (scene: WelcomeScene) => DARK_SCENES.includes(scene);

/** The video draws the six feelings' scenes; each newer scene films as the nearest one. */
const FILMED_AS: Record<WelcomeScene, WelcomeKind> = {
  royal: "royal",
  bloom: "bloom",
  lamps: "lamps",
  night: "night",
  party: "party",
  letter: "letter",
  mandala: "royal",
  peacock: "night",
  sunrise: "royal",
  garden: "bloom",
  rangoli: "bloom",
  ghat: "lamps",
  fireflies: "lamps",
  "sky-lanterns": "night",
  kites: "party",
  waves: "bloom",
};
export const filmedWelcome = (scene: WelcomeScene): WelcomeKind => FILMED_AS[scene];

const WELCOME_KIND: Record<OpeningStyle, WelcomeKind> = {
  ...(Object.fromEntries(DEPTH_IDS.map((id) => [id, depthSpec(id).welcome])) as Record<
    DepthOpening,
    WelcomeKind
  >),
  ...(Object.fromEntries(BLOOM_IDS.map((id) => [id, bloomSpec(id).welcome])) as Record<
    BloomOpening,
    WelcomeKind
  >),
  ...(Object.fromEntries(TIED_IDS.map((id) => [id, tiedSpec(id).welcome])) as Record<
    TiedGate,
    WelcomeKind
  >),
  pankhi: "royal",
  "sheesh-mahal": "royal",
  "popup-mahal": "royal",
  "uday-surya": "royal",
  "athangudi-tiles": "royal",
  pachchikari: "royal",
  "chik-baradari": "royal",
  "konark-chakra": "royal",
  shekhawati: "royal",
  "toran-mala": "royal",
  odhni: "bloom",
  "jal-darpan": "bloom",
  "pushp-varsha": "bloom",
  "moti-seep": "bloom",
  "jaali-vriksh": "bloom",
  lehar: "bloom",
  "ped-ghar": "bloom",
  "jhalar-palna": "bloom",
  "jugnu-van": "lamps",
  "sanjhi-roshni": "lamps",
  "chhaya-parda": "lamps",
  "baori-deep": "lamps",
  jhilmil: "lamps",
  "badal-raag": "night",
  taaramandal: "night",
  "thar-ki-ret": "night",
  "sheher-ki-raat": "night",
  "mandvi-dhow": "night",
  "barf-khidki": "night",
  "chhatri-utsav": "party",
  "choodi-chakra": "party",
  "gulaal-bindu": "party",
  "kaanch-ka-gola": "party",
  phirki: "party",
  bulbule: "party",
  "chhuk-chhuk": "party",
  chadar: "lamps",
  parwaaz: "bloom",
  bhanwar: "royal",
  "jaali-patta": "bloom",
  "lapet-khule": "party",
  taar: "lamps",
  pratibimb: "bloom",
  mohur: "party",
  gathbandhan: "bloom",
  phuljhadi: "lamps",
  semal: "bloom",
  thappa: "bloom",
  gumbad: "royal",
  ghadi: "royal",
  hindolo: "party",
  "irani-carrom": "party",
  channapatna: "party",
  "kavad-peti": "letter",
  bioscope: "letter",
  "ikat-dhaaga": "letter",
  "olai-chuvadi": "letter",
  "naksha-pangong": "letter",
  "howrah-tareekh": "letter",
  "pondy-gali": "letter",
  "rajwada-pol": "royal",
  "gopuram-kadhavu": "royal",
  "haveli-kiwad": "royal",
  "shahi-parda": "royal",
  doors: "royal",
  palace: "royal",
  temple: "royal",
  curtain: "royal",
  mandap: "royal",
  jharokha: "royal",
  "phoolon-ki-deewar": "bloom",
  "bagiya-gate": "bloom",
  lotus: "bloom",
  phool: "bloom",
  peacock: "bloom",
  diyas: "lamps",
  lanterns: "lamps",
  rangoli: "lamps",
  "noor-darwaza": "night",
  moonlit: "night",
  "deco-gates": "party",
  "mela-tamboo": "party",
  "chaand-dwar": "night",
  "ritu-dwar": "bloom",
  "raag-dwar": "royal",
  "van-dwar": "bloom",
  "patang-dwar": "party",
  "kumhar-dwar": "lamps",
  "karghaa-dwar": "royal",
  "navrang-dwar": "bloom",
  "ghat-dwar": "lamps",
  "rekha-dwar": "letter",
  "naqsha-pat": "royal",
  "kinkhab-parda": "royal",
  "taad-patta-dwar": "bloom",
  "pichwai-pat": "night",
  "chandi-kiwad": "night",
  "swarg-kiwad": "bloom",
  "firoza-darwaza": "royal",
  "jharokha-pat": "bloom",
  "hina-kiwad": "bloom",
  "mor-pankh": "bloom",
  "jugnu-parda": "night",
  "sheesh-kiwad": "royal",
  "sunehri-phatak": "lamps",
  "pattu-thirai": "lamps",
  "kagaz-kiwad": "letter",
  "peetal-kiwad": "lamps",
  "kaanch-pat": "royal",
  "thinnai-kadhavu": "lamps",
  "meena-pat": "royal",
  "rogan-parda": "bloom",
  "makhmal-parda": "night",
  "sama-dwar": "party",
  "dilli-phatak": "party",
  "nakkashi-pat": "night",
  "gagan-parda": "party",
  "bel-khidki": "bloom",
  "pankhudi-pat": "bloom",
  "gulaab-lifafa": "letter",
  "os-parda": "bloom",
  "surkh-dwar": "bloom",
  "itr-dibbi": "royal",
  "gulaab-bhaap": "bloom",
  "oud-darwaza": "night",
  "tarkashi-jaali": "royal",
  "aaina-pat": "bloom",
  "megh-parda": "bloom",
  "pehar-jaali": "royal",
  "lata-phatak": "bloom",
  "kitaab-jild": "letter",
  "itr-almari": "royal",
  "kosh-jild": "letter",
  "gudiya-pat": "party",
  "yantra-pat": "night",
  "rang-parda": "party",
  "genda-ladi": "bloom",
  "kaleen-parda": "royal",
  "truck-darwaza": "party",
  "kaanch-dhakkan": "bloom",
  "pati-pat": "letter",
  "jad-jhalar": "bloom",
  "gol-darwaza": "party",
  "jhaadi-deewar": "bloom",
  "deco-dibba": "royal",
  "samundar-parda": "night",
  "shatranj-sandook": "royal",
  fireworks: "party",
  balloons: "party",
  gift: "party",
  envelope: "letter",
  scroll: "letter",
  storybook: "letter",
  none: "letter",
};

export function welcomeKind(style: OpeningStyle): WelcomeKind {
  return WELCOME_KIND[style];
}
