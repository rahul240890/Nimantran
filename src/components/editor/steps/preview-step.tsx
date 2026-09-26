"use client";

import { format, parseISO } from "date-fns";
import { CircleAlert, Clock, MapPin, PartyPopper, Pencil, Shirt } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { editor, extrasCopy, functionCopy, previewCopy, stepCopy } from "@/content/editor";
import {
  draftProblems,
  includedFunctions,
  templateWithRaga,
  type EditorStep,
} from "@/lib/editor/draft";
import { RAGAS } from "@/lib/engine/music";
import { formatTime } from "@/lib/time";
import { usePhotoUrls } from "../use-photo-urls";
import type { StepProps } from "./types";

function Section({
  title,
  step,
  goTo,
  children,
}: {
  title: string;
  step: EditorStep;
  goTo: (step: EditorStep) => void;
  children: ReactNode;
}) {
  const id = `summary-${step}`;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 border-t border-line pt-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="font-display text-xl">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<Pencil aria-hidden />}
          onClick={() => goTo(step)}
          aria-label={previewCopy.editStep(title)}
        >
          {previewCopy.edit}
        </Button>
      </div>
      {children}
    </section>
  );
}

export function PreviewStep({ draft, goTo, onReset }: StepProps & { onReset: () => void }) {
  const problems = draftProblems(draft);
  const functions = includedFunctions(draft);
  const urls = usePhotoUrls(draft.photos.map((photo) => photo.id));
  const raga = RAGAS[templateWithRaga(draft.templateId, draft.music.raga).music.raga];
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {problems.length === 0 ? (
        <Card
          elevation="flat"
          className="flex-row items-start gap-4 border-success/40 bg-success/5 p-5"
        >
          <PartyPopper aria-hidden className="mt-0.5 size-6 shrink-0 text-success" />
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{previewCopy.ready}</p>
            <p className="text-sm text-ink-muted">{previewCopy.readyBody}</p>
          </div>
        </Card>
      ) : (
        <Card elevation="flat" className="gap-3 border-warning/40 bg-warning/5 p-5">
          <p className="flex items-center gap-2 font-semibold">
            <CircleAlert aria-hidden className="size-5 shrink-0 text-warning" />
            {previewCopy.notReady}
          </p>
          <ul className="flex flex-wrap gap-2">
            {problems.map(({ step }) => (
              <li key={step}>
                <Button variant="secondary" size="sm" onClick={() => goTo(step)}>
                  {previewCopy.fix(stepCopy[step].label)}
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Section title={previewCopy.functionsHeading} step="functions" goTo={goTo}>
        <ol className="flex flex-col gap-3">
          {functions.map((id) => {
            const fn = draft.functions[id];
            return (
              <li
                key={id}
                className="flex flex-col gap-1.5 rounded-md border border-line bg-surface-2/60 p-4"
              >
                <span className="font-display text-lg leading-tight">{functionCopy[id].name}</span>
                <span className="flex items-start gap-2 text-sm">
                  <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                  {fn.date ? format(parseISO(fn.date), "EEE, d MMM yyyy") : "—"}
                  {fn.time ? ` · ${formatTime(fn.time)}` : ""}
                </span>
                <span className="flex items-start gap-2 text-sm break-words">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-muted" />
                  <span className="min-w-0">{fn.venue || "—"}</span>
                </span>
                {fn.dressCode && (
                  <span className="flex items-start gap-2 text-sm text-ink-muted">
                    <Shirt aria-hidden className="mt-0.5 size-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="sr-only">{previewCopy.dressCode}: </span>
                      {fn.dressCode}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </Section>

      <Section title={previewCopy.photosHeading} step="extras" goTo={goTo}>
        {draft.photos.length === 0 ? (
          <p className="text-sm text-ink-muted">{previewCopy.noPhotos}</p>
        ) : (
          <ul className="grid grid-cols-4 gap-2">
            {draft.photos.map((photo, index) => (
              <li
                key={photo.id}
                className="aspect-square overflow-hidden rounded-sm border border-line bg-surface-2"
              >
                {urls[photo.id] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urls[photo.id]}
                    alt={extrasCopy.photo(index + 1)}
                    className="size-full object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={previewCopy.musicHeading} step="extras" goTo={goTo}>
        <p className="text-sm">
          Raag {raga.name}
          {draft.music.playOnOpen ? ` · ${previewCopy.playsOnOpen}` : ""}
        </p>
      </Section>

      <div className="border-t border-line pt-5">
        <Dialog open={confirming} onOpenChange={setConfirming}>
          <DialogTrigger asChild>
            <Button variant="ghost">{previewCopy.startOver}</Button>
          </DialogTrigger>
          <DialogContent
            title={previewCopy.startOverTitle}
            closeLabel={editor.close}
            footer={
              <>
                <DialogClose asChild>
                  <Button variant="secondary">{previewCopy.cancel}</Button>
                </DialogClose>
                <Button
                  variant="danger"
                  onClick={() => {
                    setConfirming(false);
                    onReset();
                  }}
                >
                  {previewCopy.startOverConfirm}
                </Button>
              </>
            }
          >
            <p className="text-ink-muted">{previewCopy.startOverBody}</p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
