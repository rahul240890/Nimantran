import { LayoutTemplate, PenLine, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { landingText } from "@/i18n/copy/landing";
import type { UiLocale } from "@/i18n/locales";
import { Section } from "./section";

const icons = [LayoutTemplate, PenLine, Send];

export function HowItWorks({ locale }: { locale: UiLocale }) {
  const { howItWorks } = landingText[locale];
  return (
    <Section
      id="how-it-works"
      eyebrow={howItWorks.eyebrow}
      title={howItWorks.title}
      intro={howItWorks.intro}
    >
      <ol className="relative grid gap-4 md:grid-cols-3 md:gap-6">
        {/* A gold thread joining the three steps on wide screens */}
        <span
          aria-hidden
          className="absolute top-[3.25rem] right-[12%] left-[12%] hidden h-px bg-linear-to-r from-transparent via-marigold to-transparent md:block"
        />
        {howItWorks.steps.map((step, index) => {
          const Icon = icons[index]!;
          return (
            <li key={step.title} className="reveal-on-scroll">
              <Card className="relative h-full items-start gap-4 overflow-hidden p-6 sm:p-7">
                {/* The step's number, large and faint behind the words */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -end-2 -top-6 font-display text-[7.5rem] leading-none text-marigold/15 select-none"
                >
                  {index + 1}
                </span>
                <span className="relative grid size-14 place-items-center rounded-2xl bg-marigold text-on-marigold shadow-float">
                  <Icon aria-hidden className="size-6" />
                </span>
                <p className="font-label text-xs tracking-[0.2em] text-accent-text uppercase">
                  {howItWorks.stepLabel(index + 1)}
                </p>
                <h3 className="-mt-2 font-display text-2xl leading-tight">{step.title}</h3>
                <p className="text-ink-muted">{step.body}</p>
              </Card>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
