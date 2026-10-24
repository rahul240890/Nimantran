import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

/** Five stars, the first `value` filled (halves round to the nearest), for a review or an average. */
export function Stars({
  value,
  label,
  className,
}: {
  value: number;
  /** What a screen reader says instead, such as "5 out of 5 stars". */
  label: string;
  className?: string;
}) {
  const filled = Math.round(value);
  return (
    <span role="img" aria-label={label} className={cn("inline-flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            "size-4",
            index <= filled ? "fill-current text-accent-text" : "text-line-strong",
          )}
        />
      ))}
    </span>
  );
}
