"use client";

import { Crop, RotateCcw, RotateCw } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { FramedPhoto } from "@/components/invitation/story/framed-photo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useText } from "@/i18n/client";
import { editorText } from "@/i18n/copy/editor";
import { cn } from "@/lib/cn";
import {
  MAX_TILT,
  MAX_ZOOM,
  MIN_ZOOM,
  defaultCrop,
  isDefaultCrop,
  photoPlacement,
  type PhotoCrop,
} from "@/lib/editor/photo-fit";
import type { FrameSpot } from "@/lib/publish/frames";
import { PAINTING_ASPECT, type FrameBox } from "@/lib/suites/photo-frames";

/*
 * The photo editor: the host's photo inside the very frame guests will see it in (a
 * medallion, an arch, a window), cut out of the theme's own painting. Drag to move it,
 * pinch, scroll or slide to zoom, turn it a quarter at a time and straighten a tilted one.
 * Every change shows at once, and the frame is always covered, so no gap can show.
 */

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** The part of the painting shown round the frame: the frame and a margin of the painting. */
function regionAround([x, y, w, h]: FrameBox): FrameBox {
  const mx = w * 0.22;
  const my = h * 0.22;
  const left = clamp(x - mx, 0, 100);
  const top = clamp(y - my, 0, 100);
  return [left, top, clamp(x + w + mx, 0, 100) - left, clamp(y + h + my, 0, 100) - top];
}

const pct = (n: number) => `${n}%`;

/** The shape on screen of the painting round a frame, width over height. */
function regionAspect(box: FrameBox): number {
  const [, , rw, rh] = regionAround(box);
  return (rw / rh) * PAINTING_ASPECT;
}

/** The frame's share of the preview round it, across and down. */
export function frameShare(spot: FrameSpot): { w: number; h: number } {
  if (!spot.box) return { w: 1, h: 1 };
  const [, , rw, rh] = regionAround(spot.box);
  return { w: spot.box[2] / rw, h: spot.box[3] / rh };
}

/** The photo in its frame, at any size: the editor's stage, or the small one in the list. */
export function FramePreview({
  spot,
  src,
  crop,
  aspect,
  maxHeight,
  className,
}: {
  spot: FrameSpot;
  src: string;
  crop: PhotoCrop | undefined;
  /** The photo file's width over its height. */
  aspect: number;
  /** The preview's height at most, as CSS; it is as wide as that allows. */
  maxHeight?: string;
  className?: string;
}) {
  const photo = { src, alt: "", fit: crop ? { ...crop, aspect } : undefined };
  const shape = spot.box ? regionAspect(spot.box) : spot.aspect;
  const size: CSSProperties = maxHeight
    ? { width: `min(100%, calc(${maxHeight} * ${shape.toFixed(4)}))` }
    : {};
  if (!spot.box || !spot.image) {
    // A plain arch, as themes without framed paintings show photos
    return (
      <FramedPhoto
        photo={photo}
        frameAspect={spot.aspect}
        className={cn(
          "aspect-[3/4] rounded-t-full rounded-b-[1.25rem] border-[3px] border-card-gold bg-card-ivory",
          className,
        )}
        style={size}
      />
    );
  }
  const [rx, ry, rw, rh] = regionAround(spot.box);
  const [x, y, w, h] = spot.box;
  // The painting, scaled so the region round the frame fills this box
  const painting: CSSProperties = {
    position: "absolute",
    width: pct((100 / rw) * 100),
    height: pct((100 / rh) * 100),
    left: pct((-rx / rw) * 100),
    top: pct((-ry / rh) * 100),
  };
  return (
    <span
      className={cn("relative block overflow-hidden bg-card-ink", className)}
      style={{ aspectRatio: String(shape), ...size }}
    >
      <span className="block" style={painting}>
        <FramedPhoto
          photo={photo}
          frameAspect={spot.aspect}
          className="absolute bg-card-ivory"
          style={{ left: pct(x), top: pct(y), width: pct(w), height: pct(h) }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- the painting with its frame cut out */}
        <img
          src={spot.image}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 size-full max-w-none select-none"
        />
      </span>
    </span>
  );
}

type Props = {
  spot: FrameSpot;
  src: string;
  /** The photo file's width over its height. */
  aspect: number;
  crop: PhotoCrop | undefined;
  /** The frame's name, as the list shows it: "First frame". */
  frameName: string;
  /** Saves the host's placement; null puts the photo back as the pages place it by default. */
  onSave: (crop: PhotoCrop | null) => void;
};

export function PhotoAdjust({ spot, src, aspect, crop, frameName, onSave }: Props) {
  const { extrasCopy } = useText(editorText);
  const [open, setOpen] = useState(false);
  const start = () => crop ?? defaultCrop(aspect, spot.aspect);
  const [draft, setDraft] = useState<PhotoCrop>(start);
  const zoomId = useId();
  const tiltId = useId();
  const hintId = useId();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(start());
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          aria-label={extrasCopy.adjustLabel(frameName)}
          leadingIcon={<Crop aria-hidden />}
        >
          {extrasCopy.adjust}
        </Button>
      </DialogTrigger>
      <DialogContent
        title={extrasCopy.adjustTitle}
        description={extrasCopy.adjustDescription}
        closeLabel={extrasCopy.closePhoto}
        className="max-w-md"
        footer={
          <>
            <Button
              onClick={() => {
                onSave(isDefaultCrop(draft, aspect, spot.aspect) ? null : clean(draft));
                setOpen(false);
              }}
            >
              {extrasCopy.savePhoto}
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {extrasCopy.cancelPhoto}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Stage
            spot={spot}
            src={src}
            aspect={aspect}
            crop={draft}
            onChange={setDraft}
            label={extrasCopy.adjustStage}
            hintId={hintId}
          />
          <p id={hintId} className="sr-only">
            {extrasCopy.adjustStage}
          </p>
          <div className="flex flex-col gap-1">
            <label htmlFor={zoomId} className="text-sm font-semibold">
              {extrasCopy.zoom}
            </label>
            <input
              id={zoomId}
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={draft.zoom}
              onChange={(event) => setDraft({ ...draft, zoom: Number(event.target.value) })}
              aria-valuetext={`${Math.round(draft.zoom * 100)}%`}
              className="photo-range"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor={tiltId} className="text-sm font-semibold">
              {extrasCopy.straighten}
            </label>
            <input
              id={tiltId}
              type="range"
              min={-MAX_TILT}
              max={MAX_TILT}
              step={0.5}
              value={draft.tilt}
              onChange={(event) => setDraft({ ...draft, tilt: Number(event.target.value) })}
              aria-valuetext={`${draft.tilt}°`}
              className="photo-range"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              aria-label={extrasCopy.turnLabel}
              leadingIcon={<RotateCw aria-hidden />}
              onClick={() =>
                // A turned photo has a new shape, so it starts again from its middle
                setDraft({ ...draft, turn: (draft.turn + 1) % 4, x: 0.5, y: 0.5 })
              }
            >
              {extrasCopy.turn}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leadingIcon={<RotateCcw aria-hidden />}
              onClick={() => setDraft(defaultCrop(aspect, spot.aspect))}
            >
              {extrasCopy.resetPhoto}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Rounds a placement for saving, and keeps the point where the frame stays covered. */
function clean(crop: PhotoCrop): PhotoCrop {
  const r = (n: number, places: number) => Number(n.toFixed(places));
  return {
    x: r(clamp(crop.x, 0, 1), 4),
    y: r(clamp(crop.y, 0, 1), 4),
    zoom: r(clamp(crop.zoom, MIN_ZOOM, MAX_ZOOM), 3),
    turn: ((Math.round(crop.turn) % 4) + 4) % 4,
    tilt: r(clamp(crop.tilt, -MAX_TILT, MAX_TILT), 1),
  };
}

/** The frame to drag in: one finger moves the photo, two pinch to zoom. */
function Stage({
  spot,
  src,
  aspect,
  crop,
  onChange,
  label,
  hintId,
}: {
  spot: FrameSpot;
  src: string;
  aspect: number;
  crop: PhotoCrop;
  onChange: (crop: PhotoCrop) => void;
  label: string;
  hintId: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const latest = useRef(crop);
  useEffect(() => {
    latest.current = crop;
  }, [crop]);

  // The frame's own size on screen, which the photo's movement is measured against
  const frameSize = () => {
    const rect = frame.current?.firstElementChild?.getBoundingClientRect();
    const share = frameShare(spot);
    return rect ? { w: rect.width * share.w, h: rect.height * share.h } : { w: 1, h: 1 };
  };

  /** Moves the photo by (dx, dy) screen pixels, keeping the frame covered. */
  const move = (dx: number, dy: number) => {
    const current = latest.current;
    const fit = { ...current, aspect };
    const place = photoPlacement(fit, spot.aspect);
    const { w, h } = frameSize();
    // The drag in the photo's own tilted directions
    const t = (-place.tilt * Math.PI) / 180;
    const ux = dx * Math.cos(t) - dy * Math.sin(t);
    const uy = dx * Math.sin(t) + dy * Math.cos(t);
    const next = {
      ...current,
      x: place.x - ux / (w * place.width),
      y: place.y - uy / (h * place.height),
    };
    const kept = photoPlacement({ ...next, aspect }, spot.aspect);
    onChange({ ...next, x: kept.x, y: kept.y });
  };

  const zoomTo = (zoom: number) => {
    const current = latest.current;
    const next = { ...current, zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM) };
    const kept = photoPlacement({ ...next, aspect }, spot.aspect);
    onChange({ ...next, x: kept.x, y: kept.y });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = {
        distance: Math.hypot(a!.x - b!.x, a!.y - b!.y),
        zoom: latest.current.zoom,
      };
    }
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const last = pointers.current.get(event.pointerId);
    if (!last) return;
    const now = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, now);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      zoomTo(pinch.current.zoom * (distance / Math.max(1, pinch.current.distance)));
      return;
    }
    if (pointers.current.size === 1) move(now.x - last.x, now.y - last.y);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    zoomTo(latest.current.zoom * Math.exp(-event.deltaY / 400));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 20 : 6;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => move(-step, 0),
      ArrowRight: () => move(step, 0),
      ArrowUp: () => move(0, -step),
      ArrowDown: () => move(0, step),
      "+": () => zoomTo(latest.current.zoom * 1.08),
      "=": () => zoomTo(latest.current.zoom * 1.08),
      "-": () => zoomTo(latest.current.zoom / 1.08),
    };
    const run = keys[event.key];
    if (!run) return;
    event.preventDefault();
    run();
  };

  // The page doesn't scroll while the photo is pinched or scrolled to zoom
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const stop = (event: globalThis.WheelEvent) => event.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    return () => el.removeEventListener("wheel", stop);
  }, []);

  return (
    <div
      ref={frame}
      role="group"
      aria-label={label}
      aria-describedby={hintId}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      className="mx-auto flex w-full cursor-grab touch-none justify-center overflow-hidden rounded-lg bg-night select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing"
    >
      <FramePreview
        spot={spot}
        src={src}
        crop={crop}
        aspect={aspect}
        maxHeight="min(38dvh, 24rem)"
      />
    </div>
  );
}
