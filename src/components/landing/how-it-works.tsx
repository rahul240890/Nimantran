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
      <ol className="relative grid gap-5 md:grid-cols-3 md:gap-6">
        {/* A gold thread joining the three steps on wide screens */}
        <span
          aria-hidden
          className="absolute top-12 right-[16%] left-[16%] hidden h-px bg-linear-to-r from-transparent via-marigold to-transparent md:block"
        />
        {howItWorks.steps.map((step, index) => {
          const Icon = icons[index]!;
          return (
            <li key={step.title} className="reveal-on-scroll">
              <Card className="h-full items-start gap-4 p-6 sm:p-7 md:items-center md:text-center">
                <span className="relative grid size-12 place-items-center rounded-full bg-surface text-accent-text shadow-float ring-1 ring-line">
                  <Icon aria-hidden className="size-5" />
                  <span className="absolute -end-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-marigold font-label text-xs text-on-marigold">
                    {index + 1}
                  </span>
                </span>
                <h3 className="font-display text-2xl leading-tight">{step.title}</h3>
                <p className="text-ink-muted">{step.body}</p>
              </Card>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
