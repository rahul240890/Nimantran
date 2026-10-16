import { ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Across the top of a design's public sample: it says the names are made up, and leads
 * into the editor with this design, the same as Use this design in the gallery.
 */
export function SampleBar({
  label,
  note,
  action,
  href,
}: {
  label: string;
  note: string;
  action: string;
  href: string;
}) {
  return (
    <div
      data-sample-bar
      className="fixed inset-x-0 top-0 z-40 border-b border-card-ivory/15 bg-night/85 pt-[env(safe-area-inset-top)] text-card-ivory backdrop-blur-md print:hidden"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
        <p className="flex min-w-0 flex-col leading-tight">
          <span className="flex items-center gap-1.5 font-label text-[0.65rem] tracking-[0.18em] uppercase">
            <Eye aria-hidden className="size-3.5 shrink-0" />
            {label}
          </span>
          <span className="truncate text-xs text-card-ivory/75">{note}</span>
        </p>
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
