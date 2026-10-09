"use client";

import {
  Check,
  ImageIcon,
  ImageOff,
  ImagePlus,
  Images,
  LoaderCircle,
  Music2,
  Pause,
  Play,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { photoAspect, type CoupleLayout } from "@/lib/editor/couple-photos";
import type { PhotoCrop } from "@/lib/editor/photo-fit";
import {
  coupleLayouts,
  draftCouple,
  draftFrames,
  draftFrameSlots,
  framedDesign,
} from "@/lib/publish/frames";
import { FramePreview, PhotoAdjust } from "../photo-adjust";
import {
  ASKABLE_QUESTIONS,
  designMusic,
  draftPeople,
  draftQuestions,
  MAX_PHOTOS,
} from "@/lib/editor/draft";
import { deletePhoto, PHOTO_ACCEPT, preparePhoto, savePhoto } from "@/lib/editor/photos";
import type { MusicPlayer } from "@/lib/engine/music-player";
import { arrangement } from "@/lib/engine/music";
import { RAGA_IDS, type RagaId } from "@/lib/templates/ids";
import { cn } from "@/lib/cn";
import { forgetPhotoUrl, rememberPhotoUrl, useClipUrl, usePhotoUrls } from "../use-photo-urls";
import { OwnMusic } from "../own-music";
import { PagePacing } from "../page-pacing";
import { draftShowsScene } from "@/lib/publish/story";
import type { MusicClip } from "@/lib/editor/music-clip";
import type { StepProps } from "./types";
import { useText } from "@/i18n/client";
import { categoriesText } from "@/i18n/copy/categories";
import { editorText } from "@/i18n/copy/editor";

function newId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** Reads, shrinks and saves photos on this device; each one saved is handed to `onAdded`. */
function usePhotoUpload(draft: StepProps["draft"]) {
  const { extrasCopy } = useText(editorText);
  const [busy, setBusy] = useState(false);
  const room = MAX_PHOTOS - draft.photos.length;

  const add = async (
    files: File[],
    onAdded: (photo: { id: string; width: number; height: number }) => void,
    { limit = room, replacing = false }: { limit?: number; replacing?: boolean } = {},
  ) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    // Replacing a frame's photo frees its place first
    const space = replacing ? room + 1 : room;
    if (space <= 0) {
      toast({ title: extrasCopy.full(MAX_PHOTOS), tone: "info" });
      return;
    }
    setBusy(true);
    let unreadable = false;
    let unsaved = false;
    for (const file of images.slice(0, Math.min(limit, space))) {
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
      onAdded({ id, width: prepared.width, height: prepared.height });
    }
    setBusy(false);
    if (unsaved) toast({ title: extrasCopy.storageFailed, tone: "error" });
    else if (unreadable) toast({ title: extrasCopy.photoFailed, tone: "error" });
    if (images.length > Math.min(limit, space) && limit > 1) {
      toast({ title: extrasCopy.full(MAX_PHOTOS), tone: "info" });
    }
  };
  return { add, busy, room };
}

function forgetPhoto(id: string) {
  forgetPhotoUrl(id);
  void deletePhoto(id).catch(() => {
    // Left behind in storage; harmless, and cleared with the next new invite
  });
}

const LAYOUT_ICONS: Record<CoupleLayout, typeof ImageIcon> = {
  none: ImageOff,
  one: ImageIcon,
  two: Images,
};

/**
 * The photos the design itself shows, each in its own upload field (Step 12l's photo page,
 * or a Scene's frame). A design with painted frames always asks for them: one, or one each
 * where it has a two-frame painting. Only a design without painted frames can do without.
 */
function DesignPhotos({ draft, update, errors }: Omit<StepProps, "goTo">) {
  const { extrasCopy, editor } = useText(editorText);
  const ids = draft.photos.map((photo) => photo.id);
  const urls = usePhotoUrls(ids, draft.remoteId);
  const one = draftPeople(draft) === "one";
  const layouts = coupleLayouts(draft);
  const couple = draftCouple(draft);
  const slots = draftFrameSlots(draft);
  const spots = draftFrames(draft);
  const framed = framedDesign(draft);
  const { add, busy } = usePhotoUpload(draft);
  const [adding, setAdding] = useState<number | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Each frame named for whose photo goes in it, by the names typed on the card
  const first = draft.content.first?.trim();
  const second = draft.content.second?.trim();
  const frameName = (frame: number) =>
    slots.length === 1
      ? one
        ? extrasCopy.framePhotos.one
        : extrasCopy.framePhotos.together
      : frame === 0
        ? first
          ? extrasCopy.framePhotos.of(first)
          : extrasCopy.framePhotos.first
        : second
          ? extrasCopy.framePhotos.of(second)
          : extrasCopy.framePhotos.second;

  const setLayout = (layout: CoupleLayout) =>
    update((current) => ({
      ...current,
      couplePhotos: { ...draftCouple(current), layout },
    }));

  const fill = (frame: number, files: File[]) => {
    setAdding(frame);
    const old = slots[frame];
    void add(
      files,
      (photo) => {
        update((current) => {
          const now = draftFrameSlots(current);
          now[frame] = photo.id;
          // The photo it replaces leaves the invite, unless another frame still shows it
          const gone = old && !now.includes(old) ? old : null;
          return {
            ...current,
            photos: [...current.photos.filter((p) => p.id !== gone), photo].slice(0, MAX_PHOTOS),
            couplePhotos: {
              ...draftCouple(current),
              ids: now.map((id) => id ?? ""),
              strict: true,
            },
          };
        });
        if (old && !slots.some((id, i) => i !== frame && id === old)) forgetPhoto(old);
      },
      { limit: 1, replacing: Boolean(old) },
    ).finally(() => setAdding(null));
  };

  const saveCrop = (id: string, crop: PhotoCrop | null) =>
    update((current) => {
      const crops = { ...current.couplePhotos.crops };
      if (crop) crops[id] = crop;
      else delete crops[id];
      return { ...current, couplePhotos: { ...current.couplePhotos, crops } };
    });

  return (
    <section
      aria-labelledby="design-photos-heading"
      data-page-target="couple"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id="design-photos-heading" className="font-display text-xl">
          {framed ? extrasCopy.designPhotosHeading : extrasCopy.coupleHeading}
        </h2>
        <p className="text-sm text-ink-muted">
          {framed
            ? extrasCopy.designPhotosHint(slots.length)
            : one
              ? extrasCopy.photoHintOne
              : extrasCopy.coupleHint}
        </p>
      </div>
      {layouts.length > 1 && (
        <RadioGroup
          label={framed ? extrasCopy.designPhotosHeading : extrasCopy.coupleHeading}
          variant="segment"
          value={couple.layout}
          onValueChange={(next) => setLayout(next as CoupleLayout)}
        >
          {layouts.map((id) => {
            const Icon = LAYOUT_ICONS[id];
            const label =
              one && id !== "two" ? extrasCopy.photoLayoutsOne[id] : extrasCopy.coupleLayouts[id];
            return <RadioItem key={id} value={id} icon={<Icon aria-hidden />} label={label} />;
          })}
        </RadioGroup>
      )}
      {slots.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
          {slots.map((id, frame) => {
            const name = frameName(frame);
            const url = id ? urls[id] : undefined;
            const spot = id ? spots.find((s) => s.id === id) : undefined;
            const aspect = id ? photoAspect(draft.photos, id) : undefined;
            const crop = id ? draft.couplePhotos.crops?.[id] : undefined;
            const error = errors[`frame-${frame}`];
            const errorId = `frame-${frame}-error`;
            return (
              <li
                key={frame}
                className={cn(
                  "flex flex-col gap-3 rounded-lg border-2 bg-surface p-3 shadow-raised transition-colors duration-200",
                  id ? "border-line" : "border-dashed border-line-strong",
                  error && "border-danger",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{name}</span>
                  {id ? (
                    <Badge tone="gold">
                      <Check aria-hidden className="size-3" strokeWidth={3} />
                      {extrasCopy.framePhotoAdded}
                    </Badge>
                  ) : (
                    <span className="text-xs font-semibold text-accent-text">
                      {extrasCopy.framePhotoNeeded}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  aria-label={
                    id ? extrasCopy.changeFramePhoto(name) : extrasCopy.addFramePhoto(name)
                  }
                  aria-describedby={error ? errorId : undefined}
                  data-invalid={error ? true : undefined}
                  disabled={busy}
                  onClick={() => inputs.current[frame]?.click()}
                  className="group/frame relative grid min-h-40 cursor-pointer place-items-center overflow-hidden rounded-md bg-surface-2 transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait motion-safe:active:scale-[0.98]"
                >
                  {id && url && spot && aspect ? (
                    <FramePreview
                      spot={spot}
                      src={url}
                      crop={crop}
                      aspect={aspect}
                      maxHeight="11rem"
                    />
                  ) : id && url ? (
                    // Local object URLs: next/image can't optimise these
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="" className="h-44 w-full object-cover" />
                  ) : (
                    <span className="flex flex-col items-center gap-2 px-4 py-6 text-center text-ink-muted">
                      {adding === frame ? (
                        <LoaderCircle
                          aria-hidden
                          className="size-7 animate-spin motion-reduce:animate-none"
                        />
                      ) : (
                        <ImagePlus aria-hidden className="size-7 text-accent-text" />
                      )}
                      <span className="text-sm font-semibold text-ink">
                        {extrasCopy.addFramePhoto(name)}
                      </span>
                    </span>
                  )}
                </button>
                {id && (
                  <span className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leadingIcon={<ImagePlus aria-hidden />}
                      loading={adding === frame}
                      onClick={() => inputs.current[frame]?.click()}
                    >
                      {extrasCopy.changePhoto}
                    </Button>
                    {url && spot && aspect && (
                      <PhotoAdjust
                        spot={spot}
                        src={url}
                        aspect={aspect}
                        crop={crop}
                        frameName={name}
                        onSave={(next) => saveCrop(id, next)}
                      />
                    )}
                  </span>
                )}
                {error && (
                  <p id={errorId} role="alert" className="text-sm font-medium text-danger">
                    {editor.errors[error as keyof typeof editor.errors]}
                  </p>
                )}
                <input
                  ref={(node) => {
                    inputs.current[frame] = node;
                  }}
                  type="file"
                  accept={PHOTO_ACCEPT}
                  tabIndex={-1}
                  aria-hidden
                  className="sr-only"
                  onChange={(event) => {
                    const files = [...(event.target.files ?? [])];
                    event.target.value = "";
                    fill(frame, files);
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Any other photos, for guests to scroll through: optional, and apart from the frames. */
function MorePhotos({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { extrasCopy } = useText(editorText);
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const framed = new Set(draftFrameSlots(draft).filter((id): id is string => id !== null));
  const photos = draft.photos.filter((photo) => !framed.has(photo.id));
  const urls = usePhotoUrls(
    photos.map((photo) => photo.id),
    draft.remoteId,
  );
  const { add, busy, room } = usePhotoUpload(draft);

  const addMore = (files: File[]) =>
    void add(files, (photo) =>
      update((current) => ({
        ...current,
        photos: [...current.photos, photo].slice(0, MAX_PHOTOS),
        // The frames keep their own photos: these never stand in for them
        couplePhotos: { ...draftCouple(current), ids: frameIds(current), strict: true },
      })),
    );

  const remove = (id: string) => {
    update((current) => ({
      ...current,
      photos: current.photos.filter((photo) => photo.id !== id),
    }));
    forgetPhoto(id);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    addMore([...event.dataTransfer.files]);
  };

  return (
    <section
      aria-labelledby="photos-heading"
      className="flex flex-col gap-4 border-t border-line pt-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="photos-heading" className="font-display text-xl">
          {extrasCopy.galleryHeading}
        </h2>
        <p className="text-sm text-ink-muted">{extrasCopy.galleryHint(MAX_PHOTOS)}</p>
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
            addMore(files);
          }}
        />
      </div>

      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => {
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

/** The frames' photo ids as stored, holding each frame's place. */
function frameIds(draft: StepProps["draft"]): string[] {
  return draftFrameSlots(draft).map((id) => id ?? "");
}

function Music({ draft, update }: Pick<StepProps, "draft" | "update">) {
  const { extrasCopy } = useText(editorText);
  const clip = draft.music.clip;
  const clipUrl = useClipUrl(draft);
  // "Your own music" stays chosen while the host picks a song, before any clip exists
  const [ownChosen, setOwnChosen] = useState(clip !== null);
  const source = clip || ownChosen ? "own" : "raga";
  // Going back to a raga keeps the clip on this device, so switching again brings it back
  const setAside = useRef<MusicClip | null>(null);
  const setClip = (next: MusicClip | null) =>
    update((current) => ({ ...current, music: { ...current.music, clip: next } }));
  const design = designMusic(draft);
  const own = design.raga;
  const value = draft.music.raga ?? own;
  // The design's own raga is heard as the design plays it; any other, its own way
  const heard = value === own ? design : { raga: value };
  const heardKey = JSON.stringify(heard);

  // Hosts hear a raga before they choose it; the player loads only on the first tap
  const player = useRef<MusicPlayer | null>(null);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    player.current?.setTrack(JSON.parse(heardKey) as typeof heard);
  }, [heardKey]);
  useEffect(() => () => player.current?.dispose(), []);
  const listen = async () => {
    if (listening) {
      player.current?.pause();
      setListening(false);
      return;
    }
    try {
      if (!player.current) {
        const { MusicPlayer } = await import("@/lib/engine/music-player");
        player.current = new MusicPlayer(heard);
      }
      await player.current.play();
      setListening(true);
    } catch {
      // No Web Audio: the button simply stays off
      setListening(false);
    }
  };

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
        variant="segment"
        value={source}
        onValueChange={(next) => {
          if (next === "own") {
            player.current?.pause();
            setListening(false);
            setOwnChosen(true);
            if (!clip && setAside.current) setClip(setAside.current);
          } else {
            setOwnChosen(false);
            if (clip) {
              setAside.current = clip;
              setClip(null);
            }
          }
        }}
      >
        <RadioItem value="raga" label={extrasCopy.musicSource.raga} icon={<Music2 aria-hidden />} />
        <RadioItem value="own" label={extrasCopy.musicSource.own} icon={<Upload aria-hidden />} />
      </RadioGroup>
      {source === "own" ? (
        <OwnMusic
          clip={clip}
          url={clipUrl}
          onClip={(next) => {
            setAside.current = null;
            setClip(next);
          }}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="min-w-0 flex-1 basis-48 text-sm text-ink-muted">{extrasCopy.ragaHint}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-pressed={listening}
              leadingIcon={listening ? <Pause aria-hidden /> : <Play aria-hidden />}
              onClick={() => void listen()}
            >
              {listening
                ? extrasCopy.stopListening
                : extrasCopy.listen(extrasCopy.ragaNames[value])}
            </Button>
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
                    {extrasCopy.ragaNames[raga]}
                    {raga === own && <Badge tone="gold">{extrasCopy.designsOwn}</Badge>}
                  </span>
                }
                description={extrasCopy.ragaSound(
                  arrangement(raga === own ? design : { raga }),
                  extrasCopy.ragaMoods[raga],
                )}
              />
            ))}
          </RadioGroup>
        </>
      )}
      <Switch
        label={extrasCopy.playOnOpen}
        description={extrasCopy.playOnOpenHint}
        checked={draft.music.playOnOpen}
        onCheckedChange={(playOnOpen) =>
          update((current) => ({ ...current, music: { ...current.music, playOnOpen } }))
        }
      />
      {!draftShowsScene(draft) && <PagePacing draft={draft} update={update} />}
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

export function ExtrasStep({ draft, update, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* An illustrated card paints its couple, so it has no photos to ask for */}
      {coupleLayouts(draft).some((layout) => layout !== "none") && (
        <DesignPhotos draft={draft} update={update} errors={errors} />
      )}
      <MorePhotos draft={draft} update={update} />
      <Music draft={draft} update={update} />
      <Questions draft={draft} update={update} />
    </div>
  );
}
