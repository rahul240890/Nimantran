import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SampleBack } from "./sample-back";

type Step = { href: string; label: string; short: string };

/**
 * Across the top of a design's public sample: Back to where it was opened from, Previous and
 * Next to walk on to other designs as a guest would see them, and Choose this design, which
 * leads into the editor with it. Previous and Next replace the address, so the browser's own
 * back leaves the samples too. That the names are made up is said to screen readers.
 */
export function SampleBar({
  label,
  action,
  actionShort,
  href,
  back,
  nav,
  previous = null,
  next = null,
}: {
  /** "Sample invitation: the names, dates and places are made up". */
  label: string;
  action: string;
  /** Choose this design in a word, for a phone's narrow bar. */
  actionShort: string;
  href: string;
  /** Where Back goes when the sample wasn't opened from this site: its listing, or home. */
  back: { href: string; label: string };
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
        <div className="flex items-center gap-1">
          <SampleBack href={back.href} label={back.label} className={step}>
            <span aria-hidden className="hidden sm:inline">
              {back.label}
            </span>
          </SampleBack>
          {(previous || next) && (
            <nav aria-label={nav} className="flex items-center gap-1">
              {/* Each is a new request: a sample is drawn for its design on the server */}
              {previous && (
                <Button asChild size="sm" variant="ghost" className={step}>
                  <Link
                    href={previous.href}
                    replace
                    prefetch={false}
                    aria-label={previous.label}
                    rel="prev"
                  >
                    <ChevronLeft aria-hidden className="rtl:rotate-180" />
                    <span aria-hidden className="hidden sm:inline">
                      {previous.short}
                    </span>
                  </Link>
                </Button>
              )}
              {next && (
                <Button asChild size="sm" variant="ghost" className={step}>
                  <Link
                    href={next.href}
                    replace
                    prefetch={false}
                    aria-label={next.label}
                    rel="next"
                  >
                    <span aria-hidden className="hidden sm:inline">
                      {next.short}
                    </span>
                    <ChevronRight aria-hidden className="rtl:rotate-180" />
                  </Link>
                </Button>
              )}
            </nav>
          )}
        </div>
        <Button asChild size="sm" className="shrink-0">
          {/* Its full name for screen readers on every screen; a phone shows the first word */}
          <Link href={href} aria-label={action}>
            <span aria-hidden className="sm:hidden">
              {actionShort}
            </span>
            <span aria-hidden className="hidden sm:inline">
              {action}
            </span>
            <ArrowRight aria-hidden className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
