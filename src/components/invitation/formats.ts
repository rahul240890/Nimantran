import type { ComponentType } from "react";
import { GateCard, type GateCardCopy } from "@/components/brand/gate-card";

/*
 * Card formats. Each has a 3D scene (in ./three, loaded on demand) and a light 2D card
 * for weaker devices and first paint. Gate-fold is the first; the business plan's
 * other formats plug in here with the same contract.
 */
export type CardFormatId = "gate-fold";

export type CardFormat = {
  id: CardFormatId;
  name: string;
  /** The 2D card: purely visual, reads the --open CSS variable (0 shut, 1 open). */
  Flat: ComponentType<{ copy: GateCardCopy; className?: string }>;
};

export const CARD_FORMATS: Record<CardFormatId, CardFormat> = {
  "gate-fold": { id: "gate-fold", name: "Gate fold", Flat: GateCard },
};

/** Formats in the business plan that are not built yet, for review screens. */
export const PLANNED_FORMATS = [
  "Envelope with wax seal",
  "Royal scroll",
  "Pop-up book",
  "Photo cube",
  "Venue walk-through",
  "Multi-event card",
  "Save-the-date teaser",
] as const;
