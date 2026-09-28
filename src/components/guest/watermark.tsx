/*
 * "Made with Shubh" on a Free invite (Step 17): a faint diagonal pattern over everything the
 * guest sees: the card, the event pages and the couple photo pages. The footer already says
 * "Made with Shubh" on every invite. Drawn as a masked colour, not text, so readers and the contrast check skip it;
 * blended by difference so it shows on the dark paintings and the light pages alike.
 */

const TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="180" viewBox="0 0 260 180"><g transform="rotate(-24 130 90)" font-family="Georgia, serif" font-size="19" letter-spacing="3" text-anchor="middle"><text x="130" y="84">MADE WITH SHUBH</text></g></svg>`,
);
const MASK = `url("data:image/svg+xml,${TILE}")`;

export function WatermarkLayer() {
  return (
    <div
      aria-hidden
      data-watermark
      className="pointer-events-none fixed inset-0 z-20 bg-card-ivory opacity-[0.16] mix-blend-difference print:hidden"
      style={{
        maskImage: MASK,
        WebkitMaskImage: MASK,
        maskRepeat: "repeat",
        WebkitMaskRepeat: "repeat",
      }}
    />
  );
}
