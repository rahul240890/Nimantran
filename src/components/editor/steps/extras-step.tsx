"use client";

import { ImagePlus, ImageIcon, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ASKABLE_QUESTIONS, draftQuestions, MAX_PHOTOS } from "@/lib/editor/draft";
import { deletePhoto, PHOTO_ACCEPT, preparePhoto, savePhoto } from "@/lib/editor/photos";
import { RAGAS } from "@/lib/engine/music";
import { TEMPLATES } from "@/lib/templates/catalog";
import { RAGA_IDS, type RagaId } from "@/lib/templates/ids";
import { cn } from "@/lib/cn";
import { forgetPhotoUrl, rememberPhotoUrl, usePhotoUrls } from "../use-photo-urls";
import type { StepProps } from "./types";
import { useText } from "@/i18n/client";
import { categoriesText } from "@/i18n/copy/categories";
import { editorText } from "@/i18n/copy/editor";

function newId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function Photos({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { extrasCopy } = useText(editorText);
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const urls = usePhotoUrls(
    draft.photos.map((photo) => photo.id),
    draft.remoteId,
  );
  const room = MAX_PHOTOS - draft.photos.length;

  const add = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    if (room <= 0) {
      toast({ title: extrasCopy.full(MAX_PHOTOS), tone: "info" });
      return;
    }
    setBusy(true);
    let unreadable = false;
    let unsaved = false;
    for (const file of images.slice(0, room)) {
      let prepared;
      try {
        prepared = await preparePhoto(file);
      } catch {
        unreadable = true;
        continue;
      }
      const id = newId();
      try {
        await savePhoto(id, prepared.blob);
      } catch {
        unsaved = true;
        break;
      }
      rememberPhotoUrl(id, prepared.blob);
      update((current) => ({
        ...current,
        photos: [...current.photos, { id, width: prepared.width, height: prepared.height }].slice(
          0,
          MAX_PHOTOS,
        ),
      }));
    }
    setBusy(false);
    if (unsaved) toast({ title: extrasCopy.storageFailed, tone: "error" });
    else if (unreadable) toast({ title: extrasCopy.photoFailed, tone: "error" });
    if (images.length > room) toast({ title: extrasCopy.full(MAX_PHOTOS), tone: "info" });
  };

  const remove = (id: string) => {
    update((current) => ({
      ...current,
      photos: current.photos.filter((photo) => photo.id !== id),
    }));
    forgetPhotoUrl(id);
    void deletePhoto(id).catch(() => {
      // Left behind in storage; harmless, and cleared with the next new invite
    });
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void add([...event.dataTransfer.files]);
  };

  return (
    <section aria-labelledby="photos-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="photos-heading" className="font-display text-xl">
          {extrasCopy.photosHeading}
        </h2>
        <p className="text-sm text-ink-muted">{extrasCopy.photosHint(MAX_PHOTOS)}</p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors duration-200",
          dragging ? "border-marigold bg-marigold/10" : "border-line-strong bg-surface-2/60",
        )}
      >
        <Button
          variant="secondary"
          leadingIcon={<ImagePlus aria-hidden />}
          loading={busy}
          disabled={room <= 0}
          onClick={() => input.current?.click()}
        >
          {extrasCopy.addPhotos}
        </Button>
        <p aria-hidden className="hidden text-sm text-ink-muted sm:block">
          {extrasCopy.dropHere}
        </p>
        <p className="text-sm text-ink-muted" aria-live="polite">
          {busy
            ? extrasCopy.processing
            : room <= 0
              ? extrasCopy.full(MAX_PHOTOS)
              : `${draft.photos.length}/${MAX_PHOTOS}`}
        </p>
        <input
          ref={input}
          type="file"
          accept={PHOTO_ACCEPT}
          multiple
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onChange={(event) => {
            const files = [...(event.target.files ?? [])];
            event.target.value = "";
            void add(files);
          }}
        />
      </div>

      {draft.photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {draft.photos.map((photo, index) => {
            const url = urls[photo.id];
            return (
              <li
                key={photo.id}
                className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line bg-surface-2 shadow-raised"
              >
                {url ? (
                  // Local object URLs: next/image can't optimise these
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={extrasCopy.photo(index + 1)}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="grid size-full place-items-center text-ink-faint">
                    <ImageIcon aria-hidden className="size-8" />
                    <span className="sr-only">{extrasCopy.photo(index + 1)}</span>
                  </span>
                )}
                <IconButton
                  label={extrasCopy.removePhoto(index + 1)}
                  icon={<X />}
                  size="sm"
                  variant="secondary"
                  showTooltip={false}
                  onClick={() => remove(photo.id)}
                  className="absolute end-1.5 top-1.5 rounded-full bg-surface/90 backdrop-blur-sm"
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Music({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { extrasCopy } = useText(editorText);
  const own = TEMPLATES[draft.templateId].music.raga;
  const value = draft.music.raga ?? own;

  return (
    <section
      aria-labelledby="music-heading"
      className="flex flex-col gap-4 border-t border-line pt-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="music-heading" className="font-display text-xl">
          {extrasCopy.musicHeading}
        </h2>
        <p className="text-sm text-ink-muted">{extrasCopy.musicHint}</p>
      </div>
      <RadioGroup
        label={extrasCopy.musicHeading}
        variant="card"
        value={value}
        onValueChange={(next) =>
          update((current) => ({
            ...current,
            // Choosing the design's own raga follows the design if it changes later
            music: { ...current.music, raga: next === own ? null : (next as RagaId) },
          }))
        }
        className="grid-cols-1 min-[400px]:grid-cols-2"
      >
        {RAGA_IDS.map((raga) => (
          <RadioItem
            key={raga}
            value={raga}
            label={
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                Raag {RAGAS[raga].name}
                {raga === own && <Badge tone="gold">{extrasCopy.designsOwn}</Badge>}
              </span>
            }
            description={extrasCopy.ragaMoods[raga]}
          />
        ))}
      </RadioGroup>
      <Switch
        label={extrasCopy.playOnOpen}
        description={extrasCopy.playOnOpenHint}
        checked={draft.music.playOnOpen}
        onCheckedChange={(playOnOpen) =>
          update((current) => ({ ...current, music: { ...current.music, playOnOpen } }))
        }
      />
    </section>
  );
}

function Questions({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { questionLabels } = useText(categoriesText);
  const { extrasCopy } = useText(editorText);
  const asked = draftQuestions(draft);
  return (
    <section
      aria-labelledby="questions-heading"
      className="flex flex-col gap-3 border-t border-line pt-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="questions-heading" className="font-display text-xl">
          {extrasCopy.questionsHeading}
        </h2>
        <p className="text-sm text-ink-muted">{extrasCopy.questionsHint}</p>
      </div>
      <ul aria-labelledby="questions-heading" className="flex flex-col">
        {ASKABLE_QUESTIONS.map((id) => (
          <li key={id}>
            <Checkbox
              label={questionLabels[id]}
              description={extrasCopy.questionHints[id]}
              checked={asked.includes(id)}
              onCheckedChange={(checked) =>
                update((current) => {
                  const now = draftQuestions(current);
                  const next = checked === true ? [...now, id] : now.filter((q) => q !== id);
                  return {
                    ...current,
                    questions: ASKABLE_QUESTIONS.filter((q) => next.includes(q)),
                  };
                })
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ExtrasStep({ draft, update }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <Photos draft={draft} update={update} />
      <Music draft={draft} update={update} />
      <Questions draft={draft} update={update} />
    </div>
  );
}
