import {
  OPENING_STYLES,
  isBloomOpening,
  isDepthOpening,
  isFreshOpening,
  isPaintedGate,
  isThemedOpening,
  isTiedGate,
  type OpeningStyle,
} from "./catalog";

/** A gate drawn from paintings, whose picker tile is a picture made ahead (gate-posters.ts). */
export function paintedOpening(style: OpeningStyle): boolean {
  return (
    isPaintedGate(style) ||
    isTiedGate(style) ||
    isDepthOpening(style) ||
    isBloomOpening(style) ||
    isFreshOpening(style) ||
    isThemedOpening(style)
  );
}

/** Every painted gate, in the catalogue's order. */
export const POSTER_GATES: readonly OpeningStyle[] = OPENING_STYLES.filter(paintedOpening);
