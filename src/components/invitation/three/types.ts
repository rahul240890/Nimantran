import type { RefObject } from "react";
import type { GateCardCopy } from "@/components/brand/gate-card";
import type { QualitySettings } from "@/lib/engine/quality";
import type { ResolvedStock } from "@/lib/engine/themes";

/**
 * What every card format's 3D scene receives. The stage animates `openRef` (0 shut,
 * 1 open) and tilts the card; the format draws the card and moves its own parts.
 */
export type FormatSceneProps = {
  copy: GateCardCopy;
  stock: ResolvedStock;
  settings: QualitySettings;
  openRef: RefObject<number>;
  /** How far the format may open for the current screen shape, in degrees. */
  maxAngleRef: RefObject<number>;
  onToggle: () => void;
  /** Called once the card's textures are painted and it is ready to show. */
  onBuilt: () => void;
};
