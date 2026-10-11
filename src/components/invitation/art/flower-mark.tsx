import { FLOWER_PETALS } from "./flower";

/** The gilt flower in place of initials (flower.ts), drawn in the text colour. */
export function FlowerMark({
  className,
  strokeWidth = 1.4,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg aria-hidden viewBox="-20 -20 40 40" className={className}>
      {FLOWER_PETALS.map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-9"
          rx="3.6"
          ry="7.4"
          transform={`rotate(${angle})`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      ))}
      <circle r="3.4" fill="currentColor" />
    </svg>
  );
}
