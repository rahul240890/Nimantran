import { cn } from "@/lib/cn";
import { SUITES, type Mood, type SuiteId } from "@/lib/suites/catalog";
import { SuiteBackdrop } from "./suite-backdrop";

/** A small portrait of a theme's page, for pickers. The card-colour theme shows paper. */
export function SuiteThumb({
  id,
  mood = "dusk",
  className,
}: {
  id: SuiteId;
  mood?: Mood;
  className?: string;
}) {
  const suite = SUITES[id];
  return (
    <span
      aria-hidden
      data-suite={id}
      data-mood={mood}
      className={cn(
        "relative block aspect-[9/16] overflow-hidden rounded-md border border-card-gold/60 bg-card-ivory shadow-raised",
        className,
      )}
    >
      {suite.art === "card" ? (
        <span className="absolute inset-[12%] rounded-sm border border-card-gold" />
      ) : (
        <SuiteBackdrop suite={suite} image={suite.images.cover} className="absolute inset-0" />
      )}
      <span className="absolute inset-x-[16%] top-[36%] h-[22%] rounded-sm border border-card-gold/70 bg-card-ivory/90" />
    </span>
  );
}
