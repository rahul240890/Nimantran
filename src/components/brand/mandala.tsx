import { cn } from "@/lib/cn";

type MandalaProps = {
  className?: string;
  /** Show only the fine outline rings (for small sizes such as the logo). */
  simple?: boolean;
  title?: string;
};

const OUTER_PETALS = Array.from({ length: 16 }, (_, i) => i * 22.5);
const INNER_PETALS = Array.from({ length: 12 }, (_, i) => i * 30 + 15);
const DOTS = Array.from({ length: 32 }, (_, i) => i * 11.25);

/**
 * The Shubhdwar mandala. Draws in `currentColor` for lines and `--mandala-fill`
 * (defaults to marigold) for filled petals, so it adapts to any theme.
 */
export function Mandala({ className, simple = false, title }: MandalaProps) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox="-100 -100 200 200"
      className={cn("block", className)}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={title}
      fill="none"
      stroke="currentColor"
    >
      <circle r="96" strokeWidth={simple ? 6 : 2.5} />
      {!simple && <circle r="88" strokeWidth="1.2" />}
      <circle r="52" strokeWidth={simple ? 5 : 2} />
      <circle r="20" strokeWidth={simple ? 5 : 2} />

      {OUTER_PETALS.map((deg) => (
        <ellipse
          key={`o${deg}`}
          cx="0"
          cy="-70"
          rx={simple ? 10 : 8.5}
          ry={simple ? 18 : 16}
          transform={`rotate(${deg})`}
          strokeWidth={simple ? 5 : 2}
          fill="var(--mandala-fill, var(--marigold))"
          fillOpacity={simple ? 0 : 0.18}
        />
      ))}

      {INNER_PETALS.map((deg) => (
        <ellipse
          key={`i${deg}`}
          cx="0"
          cy="-36"
          rx="6"
          ry="12"
          transform={`rotate(${deg})`}
          stroke="none"
          fill="var(--mandala-fill, var(--marigold))"
        />
      ))}

      {!simple &&
        DOTS.map((deg) => (
          <circle
            key={`d${deg}`}
            cx="0"
            cy="-92"
            r="2"
            transform={`rotate(${deg})`}
            stroke="none"
            fill="currentColor"
          />
        ))}

      <circle r="10" stroke="none" fill="var(--mandala-fill, var(--marigold))" />
    </svg>
  );
}
