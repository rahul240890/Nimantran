"use client";

import { useMemo, useState, type ReactNode } from "react";
import { TemplateCover } from "@/components/brand/template-cover";
import { Invitation } from "@/components/invitation/invitation";
import { ReviewHeader } from "@/components/shell/review-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { sampleCopies, type QualityChoice, type SampleCopyId } from "@/content/engine-review";
import {
  fontLabels,
  formatLabels,
  motifLabels,
  slotLabels,
  stockLabels,
  templatesReview as t,
} from "@/content/templates-review";
import { RAGAS } from "@/lib/engine/music";
import { TEMPLATES } from "@/lib/templates/catalog";
import { toCardCopy } from "@/lib/templates/content";
import {
  SLOT_RULES,
  STOCK_ROLES,
  TEMPLATE_IDS,
  type TemplateId,
  type TypeStyle,
} from "@/lib/templates/schema";

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-line py-3 first:border-t-0 first:pt-0 sm:flex-row sm:justify-between sm:gap-6">
      <dt className="shrink-0 font-label text-xs tracking-[0.16em] text-ink-muted uppercase sm:pt-0.5">
        {term}
      </dt>
      <dd className="min-w-0 text-sm text-ink sm:text-end">{children}</dd>
    </div>
  );
}

function describeType(style: TypeStyle): string {
  const parts: string[] = [fontLabels[style.font]];
  if (style.italic) parts.push(t.italic);
  if (style.uppercase) parts.push(t.capitals);
  return parts.join(", ");
}

export function TemplatesReview({
  initialTemplate,
  quality,
}: {
  initialTemplate: TemplateId;
  quality: QualityChoice;
}) {
  const [id, setId] = useState<TemplateId>(initialTemplate);
  const [sample, setSample] = useState<SampleCopyId>("template");
  const template = TEMPLATES[id];
  const copy = useMemo(
    () => toCardCopy(template, sampleCopies[sample].content),
    [template, sample],
  );
  const raga = RAGAS[template.music.raga];

  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewHeader label={t.metaTitle} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-3">
          <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            {t.eyebrow}
          </p>
          <h1 className="font-display text-[2.2rem] leading-[1.05] sm:text-5xl">{t.title}</h1>
          <p className="max-w-2xl text-lg text-ink-muted">{t.intro}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
          <section
            aria-label={t.preview}
            className="relative isolate flex h-[min(78svh,44rem)] min-h-[30rem] flex-col overflow-hidden rounded-xl border border-line bg-surface-2 px-3 pt-3 pb-4 shadow-raised sm:px-5 sm:pb-5 lg:sticky lg:top-24"
          >
            {/* Warm light behind the card */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-square w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 30%, transparent), color-mix(in srgb, var(--rose) 8%, transparent) 60%, transparent)",
              }}
            />
            <Invitation copy={copy} template={template} quality={quality} />
          </section>

          <div className="flex min-w-0 flex-col gap-6">
            <Card className="gap-5 p-5 sm:p-6">
              <h2 className="font-display text-2xl leading-tight">{t.choose}</h2>
              <RadioGroup
                label={t.design}
                variant="card"
                value={id}
                onValueChange={(value) => setId(value as TemplateId)}
                className="grid-cols-2"
              >
                {TEMPLATE_IDS.map((templateId) => (
                  <RadioItem
                    key={templateId}
                    value={templateId}
                    label={TEMPLATES[templateId].name}
                    description={`Raag ${RAGAS[TEMPLATES[templateId].music.raga].name}`}
                    icon={
                      <span className="block w-11">
                        <TemplateCover id={templateId} className="rounded-sm shadow-raised" />
                      </span>
                    }
                  />
                ))}
              </RadioGroup>
              <Field label={t.wording}>
                <Select
                  value={sample}
                  onValueChange={(value) => setSample(value as SampleCopyId)}
                  options={Object.entries(sampleCopies).map(([value, { label }]) => ({
                    value,
                    label,
                  }))}
                />
              </Field>
            </Card>

            <Card className="gap-4 p-5 sm:p-6">
              <div className="flex flex-col gap-1.5">
                <h2 className="font-display text-2xl leading-tight">{t.madeOf}</h2>
                <p className="text-sm text-ink-muted">{template.description}</p>
              </div>

              <section aria-labelledby="scene" className="flex flex-col gap-2">
                <h3 id="scene" className="font-semibold">
                  {t.scene}
                </h3>
                <dl>
                  <Row term={t.format}>{formatLabels[template.scene.format]}</Row>
                  <Row term={t.ornaments}>{motifLabels[template.scene.motif]}</Row>
                  <Row term={t.effects}>
                    <span className="inline-flex flex-wrap items-center gap-2 sm:justify-end">
                      {template.scene.petals.colours.length > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          {t.petals}
                          <span aria-hidden className="inline-flex -space-x-1">
                            {[...new Set(template.scene.petals.colours)].map((token) => (
                              <span
                                key={token}
                                className="size-3.5 rounded-full border border-line-strong"
                                style={{ background: `var(--${token})` }}
                              />
                            ))}
                          </span>
                        </span>
                      )}
                      {template.scene.lanterns && <Badge tone="gold">{t.lanterns}</Badge>}
                    </span>
                  </Row>
                </dl>
              </section>

              <section
                aria-labelledby="stock"
                className="flex flex-col gap-3 border-t border-line pt-4"
              >
                <h3 id="stock" className="font-semibold">
                  {t.colours}
                </h3>
                <ul className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
                  {STOCK_ROLES.map((role) => (
                    <li key={role} className="flex min-w-0 items-center gap-2.5 text-sm">
                      <span
                        aria-hidden
                        className="size-6 shrink-0 rounded-full border border-line-strong shadow-raised"
                        style={{ background: `var(--${template.colours[role]})` }}
                      />
                      <span className="min-w-0">{stockLabels[role]}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="type"
                className="flex flex-col gap-2 border-t border-line pt-4"
              >
                <h3 id="type" className="font-semibold">
                  {t.type}
                </h3>
                <dl>
                  {(["names", "labels", "body"] as const).map((role) => (
                    <Row key={role} term={t.typeRoles[role]}>
                      {describeType(template.fonts[role])}
                    </Row>
                  ))}
                </dl>
              </section>

              <section
                aria-labelledby="music"
                className="flex flex-col gap-2 border-t border-line pt-4"
              >
                <h3 id="music" className="font-semibold">
                  {t.music}
                </h3>
                <p className="text-sm">
                  Raag {raga.name} · {t.tempo(template.music.tempo ?? raga.tempo)}
                </p>
              </section>

              <section
                aria-labelledby="slots"
                className="flex flex-col gap-3 border-t border-line pt-4"
              >
                <h3 id="slots" className="font-semibold">
                  {t.slots}
                </h3>
                <ul className="flex flex-col">
                  {template.slots.map((slot) => {
                    const rule = SLOT_RULES[slot.id];
                    return (
                      <li
                        key={slot.id}
                        className="flex flex-col gap-1 border-t border-line py-2.5 first:border-t-0 first:pt-0"
                      >
                        <span className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{slotLabels[slot.id]}</span>
                          <span className="flex items-center gap-2 text-xs text-ink-muted">
                            {t.characters(rule.maxLength)}
                            {rule.required && <Badge tone="gold">{t.required}</Badge>}
                          </span>
                        </span>
                        <span className="text-sm break-words text-ink-muted">
                          {slot.sample || <em>{t.empty}</em>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-ink-muted sm:px-6 lg:px-8">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}
