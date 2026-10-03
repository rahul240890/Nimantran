import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** centre: heading centred above the content, for sections without a side column. */
  align?: "start" | "centre";
  className?: string;
  children: ReactNode;
};

/**
 * One landing page section: a small label, a display heading and an intro, then the content.
 * Focusable so in-page links can move keyboard focus here; scroll-margin clears the sticky header.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  align = "centre",
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-16 outline-none", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div
          className={cn(
            "flex reveal-on-scroll flex-col gap-4",
            align === "centre" && "mx-auto max-w-2xl items-center text-center",
          )}
        >
          <p className="flex items-center gap-3 font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            <span aria-hidden className="h-px w-6 bg-marigold" />
            {eyebrow}
            <span
              aria-hidden
              className={cn("h-px w-6 bg-marigold", align !== "centre" && "hidden")}
            />
          </p>
          <h2
            id={`${id}-title`}
            className="font-display text-[2.1rem] leading-[1.08] sm:text-5xl lg:text-[3.25rem]"
          >
            {title}
          </h2>
          {intro ? <p className="max-w-xl text-lg text-ink-muted">{intro}</p> : null}
        </div>
        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
