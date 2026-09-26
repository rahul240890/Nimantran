import type { ComponentType } from "react";
import { GateCard } from "@/components/brand/gate-card";
import type { CardCopy } from "@/lib/templates/content";
import type { FormatId, Template } from "@/lib/templates/schema";

/*
 * Card formats. Each has a 3D scene (in ./three, loaded on demand) and a light 2D card
 * for weaker devices and first paint. Gate-fold is the first; the business plan's
 * other formats plug in here with the same contract.
 */
export type CardFormatId = FormatId;

export type CardFormat = {
  id: CardFormatId;
  name: string;
  /** The 2D card: purely visual, reads the --open CSS variable (0 shut, 1 open). */
  Flat: ComponentType<{ copy: CardCopy; template: Template; className?: string }>;
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
