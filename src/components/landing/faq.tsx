import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { landingText } from "@/i18n/copy";
import type { UiLocale } from "@/i18n/locales";
import { Section } from "./section";

export function Faq({ locale }: { locale: UiLocale }) {
  const { faq } = landingText[locale];
  return (
    <Section id="faq" eyebrow={faq.eyebrow} title={faq.title}>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {faq.items.map((item, index) => (
          <AccordionItem key={item.q} value={`q${index}`} title={item.q}>
            <p>{item.a}</p>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
