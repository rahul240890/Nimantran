import { cn } from "@/lib/cn";

type BrandMarkProps = {
  className?: string;
};

/**
 * The Shubh mark, drawn from the app icon: a card rising from an open envelope,
 * an S on the card and a celebration sparkle beside it. Lines and the S follow
 * `currentColor`; the sparkle uses `--mandala-fill` (marigold by default).
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("block", className)}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* The card, cut off where it slips behind the envelope's front */}
      <path d="M16 34.2V11a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v23.2" strokeWidth="3" />
      {/* The envelope: body and the V of its front pocket */}
      <path d="M6 28v24a5 5 0 0 0 5 5h42a5 5 0 0 0 5-5V28" strokeWidth="4" />
      <path d="M6 28l26 16 26-16" strokeWidth="4" />
      <text
        x="29"
        y="34.5"
        textAnchor="middle"
        fontSize="25"
        fill="currentColor"
        stroke="none"
        className="font-display"
      >
        S
      </text>
      <path
        d="M41.5 11.5q.7 3 3.5 3.5-2.8.5-3.5 3.5-.7-3-3.5-3.5 2.8-.5 3.5-3.5z"
        fill="var(--mandala-fill, var(--marigold))"
        stroke="none"
      />
    </svg>
  );
}
