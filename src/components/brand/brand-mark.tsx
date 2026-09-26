import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
};

/**
 * The Shubhdwar mark: the mandala framed by a doorway arch, the "auspicious door"
 * in the name. Lines follow `currentColor`, petals use `--mandala-fill`.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 72"
      className={cn("block", className)}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Doorway: a rounded arch on two posts, with a finial at the crown */}
      <path d="M8 70V32a24 24 0 0 1 48 0v38" strokeWidth="4" />
      <path d="M4 70h56" strokeWidth="4" />
      <circle cx="32" cy="4" r="2.5" fill="currentColor" stroke="none" />
      <g transform="translate(32 40) scale(0.17)">
        <MandalaShapes />
      </g>
    </svg>
  );
}

const PETALS = Array.from({ length: 12 }, (_, i) => i * 30);

/** The mandala reduced for small sizes: one ring, twelve petals, a filled heart. */
function MandalaShapes() {
  return (
    <>
      <circle r="92" strokeWidth="11" />
      {PETALS.map((deg) => (
        <ellipse
          key={deg}
          cx="0"
          cy="-50"
          rx="13"
          ry="24"
          transform={`rotate(${deg})`}
          stroke="none"
          fill="var(--mandala-fill, var(--marigold))"
        />
      ))}
      <circle r="16" stroke="none" fill="var(--mandala-fill, var(--marigold))" />
    </>
  );
}
