import { cn } from "@/lib/cn";

/*
 * The small flowers that set the design page's parts apart (owner, 2026-11-06: each part
 * of the editor its own section, with a border and a little Indian ornament). They draw in
 * `currentColor` with marigold petals, so they follow the light and dark themes.
 */

const STEP_PETALS = Array.from({ length: 8 }, (_, i) => i * 45);

/** A part's number inside an eight-petalled flower, the rangoli dot at its heart. */
export function StepFlower({ step, className }: { step: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-12 shrink-0 place-items-center text-accent-text",
        className,
      )}
    >
      <svg viewBox="-24 -24 48 48" className="absolute inset-0 size-full" fill="none">
        {STEP_PETALS.map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-15"
            rx="5.2"
            ry="8.4"
            transform={`rotate(${deg})`}
            fill="var(--marigold)"
            fillOpacity="0.3"
            stroke="currentColor"
            strokeOpacity="0.7"
            strokeWidth="1.1"
          />
        ))}
        <circle r="11.5" fill="var(--surface)" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="relative font-display text-base leading-none tabular-nums">{step}</span>
    </span>
  );
}

/** A lotus sprig, faint in a part's corner. */
export function LotusSprig({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      className={cn("block", className)}
    >
      {/* the outer petals, then the side ones, then the one standing up */}
      <path
        d="M32 34 C20 34 8 28 4 18 C14 18 24 24 32 34 Z"
        fill="var(--marigold)"
        fillOpacity="0.14"
      />
      <path
        d="M32 34 C44 34 56 28 60 18 C50 18 40 24 32 34 Z"
        fill="var(--marigold)"
        fillOpacity="0.14"
      />
      <path
        d="M32 34 C22 30 15 20 16 8 C25 13 31 23 32 34 Z"
        fill="var(--marigold)"
        fillOpacity="0.22"
      />
      <path
        d="M32 34 C42 30 49 20 48 8 C39 13 33 23 32 34 Z"
        fill="var(--marigold)"
        fillOpacity="0.22"
      />
      <path
        d="M32 34 C26 26 26 12 32 2 C38 12 38 26 32 34 Z"
        fill="var(--marigold)"
        fillOpacity="0.32"
      />
      <path d="M14 38 H50" strokeLinecap="round" />
      <circle cx="10" cy="38" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="54" cy="38" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A rule with a small flower at its middle, under an open part's heading. */
export function FlowerRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-2 text-accent-text", className)}>
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-line-strong" />
      <svg viewBox="-12 -12 24 24" className="size-4 shrink-0" fill="none">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-6"
            rx="3.2"
            ry="5.2"
            transform={`rotate(${deg})`}
            fill="var(--marigold)"
            fillOpacity="0.45"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="0.8"
          />
        ))}
        <circle r="2.2" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-line-strong" />
    </div>
  );
}
