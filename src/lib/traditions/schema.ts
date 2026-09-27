import type { Locale, RegionCode } from "@/lib/categories/schema";
import type { FunctionId } from "@/lib/events/functions";
import type { TemplateId } from "@/lib/templates/schema";

/*
 * Tradition packs (docs/TRADITIONS.md): data that sets an invite's sacred symbol,
 * invocation, local ceremony names and wording blocks from one choice in the editor.
 * Every pack is a draft until people from its community have reviewed it, and everything
 * a pack sets stays editable.
 */

export const TRADITION_IDS = [
  "north-hindu",
  "rajasthani",
  "marathi",
  "gujarati",
  "bengali",
  "tamil",
  "modern",
] as const;
export type TraditionId = (typeof TRADITION_IDS)[number];

/**
 * Sacred symbols drawn from geometry or set as a letter, never copied artwork. Deities
 * arrive as commissioned art (content task C1).
 */
export const SYMBOL_IDS = ["om", "kalash", "swastik", "diya", "prajapati", "suzhi"] as const;
export type SymbolId = (typeof SYMBOL_IDS)[number];

/** How the invocation is written on the card: in its own script, in English letters, or not at all. */
export const INVOCATION_MODES = ["script", "latin", "off"] as const;
export type InvocationMode = (typeof INVOCATION_MODES)[number];

/** Labelled wording the family fills in, shown under the card on the guest page. */
export const WORDING_IDS = ["blessingsFrom", "requesters", "welcome", "children"] as const;
export type WordingId = (typeof WORDING_IDS)[number];
export const WORDING_MAX = 200;

export type Community = "hindu" | "modern";
export type HostOrder = "groom-first" | "bride-first" | "both";

export type TraditionPack = {
  id: TraditionId;
  community: Community;
  /** Where the tradition is most followed; the editor lists local packs first. */
  regions: readonly RegionCode[];
  /** The card's main language. */
  language: Locale;
  /** The tradition's name in its own script, shown beside the site-language name. */
  nativeName: string;
  invocation: {
    script: string;
    latin: string;
  } | null;
  symbols: {
    /** What the card shows until the family picks another; null shows none. */
    default: SymbolId | null;
    options: readonly SymbolId[];
  };
  /** Designs shown first in the design step. */
  templates: readonly TemplateId[];
  /**
   * The functions this tradition's cards usually list beyond the occasion's own, in the
   * editor's first list for a wedding (a Gujarati kankotri's Mameru, Garba and Jaan Aagman).
   */
  functions: readonly FunctionId[];
  /** Local ceremony names, in script and in English letters. */
  ceremonies: Partial<Record<FunctionId, { native: string; latin: string }>>;
  hostOrder: HostOrder;
  /** What the tradition calls the wedding's auspicious time, shown beside its exact window. */
  muhurat: { native: string; latin: string } | null;
  /** The wording blocks this tradition's cards carry, with their heading in its own script. */
  wording: Partial<Record<WordingId, { title: string; example: string }>>;
  /** Door words for a wedding card, in English letters. */
  doors?: readonly [string, string];
  /** "draft" until community reviewers and a proofreader sign off (TRADITIONS.md, section 10). */
  status: "draft" | "reviewed";
  reviewedBy: readonly string[];
};
