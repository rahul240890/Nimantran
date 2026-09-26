"use client";

import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { CARD_FORMATS, PLANNED_FORMATS } from "@/components/invitation/formats";
import { Invitation, type EngineStatus } from "@/components/invitation/invitation";
import { ReviewHeader } from "@/components/shell/review-header";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  qualityLabels,
  reasonLabels,
  sampleCopies,
  stateLabels,
  type QualityChoice,
  type SampleCopyId,
} from "@/content/engine-review";
import { cn } from "@/lib/cn";
import { RAGAS } from "@/lib/engine/music";
import { TEMPLATES } from "@/lib/templates/catalog";
import { toCardCopy } from "@/lib/templates/content";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/templates/schema";

/* A swatch of each design's card stock */
const swatches: Record<TemplateId, string> = {
  marigold: "bg-card-ivory border-card-gold",
  rose: "bg-tpl-rose-paper border-tpl-rose-ornament",
  emerald: "bg-tpl-emerald-paper border-tpl-emerald-ornament",
  scroll: "bg-tpl-scroll-paper border-tpl-scroll-ornament",
  monogram: "bg-tpl-monogram-paper border-tpl-monogram-ornament",
  kasavu: "bg-tpl-kasavu-paper border-tpl-kasavu-ornament",
};

/* Frame rate lives outside React state so the invitation doesn't re-render every second */
let fps = 0;
const listeners = new Set<() => void>();
const fpsStore = {
  set(value: number) {
    fps = value;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

function FpsReadout({ active }: { active: boolean }) {
  const value = useSyncExternalStore(
    fpsStore.subscribe,
    () => fps,
    () => 0,
  );
  return <>{active && value > 0 ? `${value} fps` : "Not drawing 3D"}</>;
}

function StatusRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-t border-line py-2.5 first:border-t-0">
      <dt className="font-label text-xs tracking-[0.16em] text-ink-muted uppercase">{term}</dt>
      <dd className="text-end text-sm font-semibold text-ink">{children}</dd>
    </div>
  );
}

export function EngineReview({
  initialQuality,
  initialTheme,
}: {
  initialQuality: QualityChoice;
  initialTheme: TemplateId;
}) {
  const [theme, setTheme] = useState<TemplateId>(initialTheme);
  const [quality, setQuality] = useState<QualityChoice>(initialQuality);
  const [sample, setSample] = useState<SampleCopyId>("template");
  const template = TEMPLATES[theme];
  const copy = useMemo(
    () => toCardCopy(template, sampleCopies[sample].content),
    [template, sample],
  );
  const [musicOnOpen, setMusicOnOpen] = useState(true);
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const onStatus = useCallback((next: EngineStatus) => setStatus(next), []);

  return (
    <div className="flex min-h-dvh flex-col">
      <ReviewHeader label="Invitation engine" />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col gap-3">
          <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            Step 4 · Invitation engine
          </p>
          <h1 className="font-display text-[2.2rem] leading-[1.05] sm:text-5xl">
            The card your guests open
          </h1>
          <p className="max-w-2xl text-lg text-ink-muted">
            Tap the card or the button to open it. Move a mouse over it, or drag sideways with a
            finger, to turn it. Change the design and quality level with the controls.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <section
            aria-label="Invitation preview"
            className="relative isolate flex h-[min(78svh,44rem)] min-h-[30rem] flex-col overflow-hidden rounded-xl border border-line bg-surface-2 px-3 pt-3 pb-4 shadow-raised sm:px-5 sm:pb-5 lg:sticky lg:top-24"
          >
            {/* Warm light behind the card, as on the landing page */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-[42%] left-1/2 -z-10 aspect-square w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 30%, transparent), color-mix(in srgb, var(--rose) 8%, transparent) 60%, transparent)",
              }}
            />
            <Invitation
              copy={copy}
              template={template}
              quality={quality}
              musicOnOpen={musicOnOpen}
              onStatus={onStatus}
              onFps={fpsStore.set}
            />
          </section>

          <div className="flex flex-col gap-6">
            <Card className="gap-5 p-5 sm:p-6">
              <h2 className="font-display text-2xl leading-tight">Try it</h2>

              <div className="flex flex-col gap-2.5">
                <h3 className="font-semibold">Design</h3>
                <RadioGroup
                  label="Design"
                  variant="card"
                  value={theme}
                  onValueChange={(value) => setTheme(value as TemplateId)}
                  className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-2"
                >
                  {TEMPLATE_IDS.map((id) => (
                    <RadioItem
                      key={id}
                      value={id}
                      label={TEMPLATES[id].name}
                      description={`Raag ${RAGAS[TEMPLATES[id].music.raga].name}`}
                      icon={
                        <span
                          className={cn(
                            "block size-6 rounded-full border-2 shadow-raised",
                            swatches[id],
                          )}
                        />
                      }
                    />
                  ))}
                </RadioGroup>
              </div>

              <Field
                label="Quality"
                hint="Automatic picks from this device and steps down if frames run slow."
              >
                <Select
                  value={quality}
                  onValueChange={(value) => setQuality(value as QualityChoice)}
                  options={Object.entries(qualityLabels).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </Field>

              <Field label="Card format">
                <Select
                  value={template.scene.format}
                  onValueChange={() => {}}
                  options={[
                    ...Object.values(CARD_FORMATS).map((f) => ({ value: f.id, label: f.name })),
                    ...PLANNED_FORMATS.map((name) => ({
                      value: name,
                      label: `${name} (later)`,
                      disabled: true,
                    })),
                  ]}
                />
              </Field>

              <Field label="Wording">
                <Select
                  value={sample}
                  onValueChange={(value) => setSample(value as SampleCopyId)}
                  options={Object.entries(sampleCopies).map(([value, { label }]) => ({
                    value,
                    label,
                  }))}
                />
              </Field>

              <Switch
                label="Music starts when the card opens"
                description="Composed live in the browser, so it downloads nothing."
                checked={musicOnOpen}
                onCheckedChange={setMusicOnOpen}
              />
            </Card>

            <Card className="p-5 sm:p-6">
              <h2 className="font-display text-2xl leading-tight">What is running</h2>
              <dl className="mt-3" aria-live="polite">
                <StatusRow term="Now">
                  {status ? stateLabels[status.state] : stateLabels.poster}
                </StatusRow>
                <StatusRow term="Drawing at">
                  {status ? qualityLabels[status.level] : "…"}
                </StatusRow>
                <StatusRow term="This device">
                  {status?.detected ? qualityLabels[status.detected] : "…"}
                </StatusRow>
                <StatusRow term="Why">{status ? reasonLabels[status.reason] : "…"}</StatusRow>
              </dl>
              <dl className="mt-1 border-t border-line">
                <StatusRow term="Frame rate">
                  <FpsReadout active={status?.state === "ready"} />
                </StatusRow>
              </dl>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-ink-muted sm:px-6 lg:px-8">
          Engine in <code>src/components/invitation</code>, maths and music in{" "}
          <code>src/lib/engine</code>
        </p>
      </footer>
    </div>
  );
}
