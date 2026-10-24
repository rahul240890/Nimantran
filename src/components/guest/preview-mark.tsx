import { cn } from "@/lib/cn";

/*
 * Across an invitation that hasn't been sent (owner, 2026-10-24: a family preview link passed
 * on to every guest stood in for the invitation itself). As on the preview video, the words run
 * in slanted rows over every screen, the opening and the pages included, so the family can
 * read and check the whole invitation but it can't go out as the real one. Light letters with
 * a dark edge read on a pale painting and a night one alike, and it never takes a tap.
 */

/** Enough rows and repeats to cover a screen of any shape once slanted. */
const ROWS = 18;
const REPEATS = 6;

/** Words in an Indian script: their letters join, so they aren't spaced out like capitals. */
const JOINED = /[ऀ-෿]/;

export function PreviewMark({ words }: { words: string }) {
  const line = Array.from({ length: REPEATS }, () => words).join("   ✦   ");
  const joined = JOINED.test(words);
  return (
    <div
      aria-hidden
      data-preview-mark
      className="pointer-events-none fixed inset-0 z-[75] overflow-hidden select-none"
    >
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] flex-col items-center gap-[clamp(2.5rem,10vmin,5rem)]">
        {Array.from({ length: ROWS }, (_, row) => (
          <p
            key={row}
            // Every other row moves along by half a word, so the words sit like bricks
            className={cn(
              "font-label whitespace-nowrap uppercase text-shadow-sm even:translate-x-[6ch]",
              joined
                ? "text-[clamp(1rem,4.6vmin,1.75rem)] tracking-normal text-card-ivory/50 text-shadow-night/60"
                : "text-[clamp(1.15rem,5.4vmin,2rem)] tracking-[0.28em] text-card-ivory/60 text-shadow-night/70",
            )}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
