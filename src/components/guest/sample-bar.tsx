import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Step = { href: string; label: string; short: string };

/**
 * Across the top of a design's public sample: Previous and Next to walk on to other designs
 * as a guest would see them, and Choose this design, which leads into the editor with it.
 * That the names are made up is said to screen readers; sighted visitors see the sample.
 */
export function SampleBar({
  label,
  action,
  href,
  nav,
  previous = null,
  next = null,
}: {
  /** "Sample invitation: the names, dates and places are made up". */
  label: string;
  action: string;
  href: string;
  /** The name of the Previous and Next pair. */
  nav: string;
  previous?: Step | null;
  next?: Step | null;
}) {
  const step =
    "min-w-11 px-2.5 text-card-ivory hover:bg-card-ivory/10 focus-visible:outline-card-ivory sm:px-3";
  return (
    <div
      data-sample-bar
      className="fixed inset-x-0 top-0 z-40 border-b border-card-ivory/15 bg-night/85 pt-[env(safe-area-inset-top)] text-card-ivory backdrop-blur-md print:hidden"
    >
      <p className="sr-only">{label}</p>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:px-4">
        {previous || next ? (
          <nav aria-label={nav} className="flex items-center gap-1">
            {/* Each is a new request: a sample is drawn for its design on the server */}
            {previous && (
              <Button asChild size="sm" variant="ghost" className={step}>
                <Link href={previous.href} prefetch={false} aria-label={previous.label} rel="prev">
                  <ChevronLeft aria-hidden className="rtl:rotate-180" />
                  <span aria-hidden className="hidden sm:inline">
                    {previous.short}
                  </span>
                </Link>
              </Button>
            )}
            {next && (
              <Button asChild size="sm" variant="ghost" className={step}>
                <Link href={next.href} prefetch={false} aria-label={next.label} rel="next">
                  <span aria-hidden className="hidden sm:inline">
                    {next.short}
                  </span>
                  <ChevronRight aria-hidden className="rtl:rotate-180" />
                </Link>
              </Button>
            )}
          </nav>
        ) : (
          <span />
        )}
        <Button asChild size="sm" className="shrink-0">
          <Link href={href}>
            {action}
            <ArrowRight aria-hidden className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
