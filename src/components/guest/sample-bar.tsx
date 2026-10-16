import { ArrowRight, Eye, Shuffle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Across the top of a design's public sample: it says the names are made up, and leads
 * into the editor with this design, the same as Use this design in the gallery. A demo from
 * the home page also offers another design.
 */
export function SampleBar({
  label,
  note,
  action,
  href,
  another = null,
}: {
  label: string;
  note: string;
  action: string;
  href: string;
  /** The next demo design, when this one came from "Open a live invitation". */
  another?: { href: string; label: string } | null;
}) {
  return (
    <div
      data-sample-bar
      className="fixed inset-x-0 top-0 z-40 border-b border-card-ivory/15 bg-night/85 pt-[env(safe-area-inset-top)] text-card-ivory backdrop-blur-md print:hidden"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
        <p className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="flex min-w-0 items-center gap-1.5 font-label text-[0.65rem] tracking-[0.18em] uppercase">
            <Eye aria-hidden className="size-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </span>
          <span className="truncate text-xs text-card-ivory/75">{note}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          {another && (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="min-w-11 px-2.5 text-card-ivory hover:bg-card-ivory/10 sm:px-3"
            >
              {/* The next demo is picked by its address: a fresh request every time */}
              <Link href={another.href} prefetch={false} aria-label={another.label}>
                <Shuffle aria-hidden />
                <span aria-hidden className="hidden sm:inline">
                  {another.label}
                </span>
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={href}>
              {action}
              <ArrowRight aria-hidden className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
