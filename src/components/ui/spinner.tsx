import { cn } from "@/lib/cn";

type SpinnerProps = {
  className?: string;
  /** Read by screen readers. Leave empty when the parent already announces loading. */
  label?: string;
};

/** A small ring that turns. In still mode it shows as a steady partial ring. */
export function Spinner({ className, label }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex size-5 shrink-0", className)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="size-full animate-spin motion-still:animate-none"
      >
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <path
          d="M21.5 12A9.5 9.5 0 0 0 12 2.5"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
