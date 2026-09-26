import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
};

export function Section({ id, eyebrow, title, intro, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-40 lg:scroll-mt-28">
      <div className="mb-6 flex flex-col gap-2 sm:mb-8">
        <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">{eyebrow}</p>
        <h2 id={`${id}-title`} className="font-display text-3xl leading-tight sm:text-4xl">
          {title}
        </h2>
        {intro ? <p className="max-w-2xl text-ink-muted">{intro}</p> : null}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

type SpecimenProps = {
  title: string;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Classes for the inner stage that holds the examples. */
  stageClassName?: string;
};

/** A labelled panel holding one component's examples. */
export function Specimen({ title, note, children, className, stageClassName }: SpecimenProps) {
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border border-line bg-surface/60 shadow-raised",
        className,
      )}
    >
      <div className="flex flex-col gap-1 border-b border-line px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-6">
        <h3 className="font-semibold text-ink">{title}</h3>
        {note ? <p className="text-sm text-ink-muted">{note}</p> : null}
      </div>
      <div className={cn("p-4 sm:p-6", stageClassName)}>{children}</div>
    </div>
  );
}

/** A small caption above one state of a component, such as "Disabled". */
export function StateLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 font-label text-[0.7rem] tracking-[0.16em] text-ink-muted uppercase">
      {children}
    </p>
  );
}
