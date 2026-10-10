"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Images, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { knownToken, useGuestName } from "@/components/guest/guest-reply";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useGuestLanguage, useGuestText } from "@/components/guest/guest-language";
import { PHOTO_ACCEPT, preparePhoto } from "@/lib/editor/photos";
import type { WallPhoto } from "@/lib/invites/photo-wall";
import { WALL_RULES, formatWallDate, type WallWindow } from "@/lib/photo-wall/rules";

/*
 * The shared photo wall on the guest's page (Step 24): from the first function onwards,
 * guests add their photos to one album through the same link, and see everyone's. Each
 * photo is shrunk on the phone before it uploads. A random key this phone keeps marks
 * the guest's own photos, so they can take one back.
 */

const DEVICE_KEY = "shubh-wall-device";
const NAME_KEY = "shubh-wall-name";
const PAGE = 24;

function deviceKey(): string {
  try {
    const known = localStorage.getItem(DEVICE_KEY);
    if (known && /^[0-9a-f]{32}$/.test(known)) return known;
  } catch {
    // Storage blocked: a fresh key for this visit
  }
  const key = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  try {
    localStorage.setItem(DEVICE_KEY, key);
  } catch {
    // The photos still upload; taking one back needs this same visit
  }
  return key;
}

function storedName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

type Loaded = { window: WallWindow; photos: WallPhoto[] };

export function PhotoWall({ slug }: { slug: string }) {
  const { wallCopy: copy } = useGuestText();
  const language = useGuestLanguage();
  const headingId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const guestName = useGuestName(slug);
  const deviceRef = useRef("");
  const [state, setState] = useState<Loaded | "loading" | "failed">("loading");
  const [name, setName] = useState(storedName);
  const [nameTouched, setNameTouched] = useState(false);
  const [progress, setProgress] = useState<{ done: number; of: number } | null>(null);
  const [message, setMessage] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  const [shown, setShown] = useState(PAGE);
  const [viewing, setViewing] = useState<number | null>(null);

  const load = useCallback(
    async (key: string) => {
      try {
        const response = await fetch(`/api/i/${slug}/wall?device=${key}`, { cache: "no-store" });
        if (!response.ok) throw new Error(String(response.status));
        setState((await response.json()) as Loaded);
      } catch {
        setState("failed");
      }
    },
    [slug],
  );

  useEffect(() => {
    deviceRef.current = deviceKey();
    void load(deviceRef.current);
  }, [load]);

  // A guest who came by their personal link is named already, unless they typed their own
  const shownName = nameTouched || name ? name : (guestName ?? "");

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const device = deviceRef.current;
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    if (files.length === 0 || typeof state !== "object") return;
    if (files.length > WALL_RULES.perPick) {
      setMessage({ text: copy.tooMany(WALL_RULES.perPick), tone: "error" });
      return;
    }
    const uploader = shownName.trim().slice(0, 80);
    try {
      localStorage.setItem(NAME_KEY, uploader);
    } catch {
      // Remembering the name is only a convenience
    }
    setMessage(null);
    let added = 0;
    let problem: string | null = null;
    for (const [index, file] of files.entries()) {
      setProgress({ done: index + 1, of: files.length });
      const prepared = await preparePhoto(file, WALL_RULES.maxSide).catch(() => null);
      if (!prepared) {
        problem = copy.unreadable;
        continue;
      }
      const query = new URLSearchParams({
        w: String(prepared.width),
        h: String(prepared.height),
        device,
        name: uploader,
        token: knownToken(slug) ?? "",
      });
      const response = await fetch(`/api/i/${slug}/wall?${query}`, {
        method: "POST",
        headers: { "content-type": prepared.blob.type },
        body: prepared.blob,
      }).catch(() => null);
      if (response?.ok) {
        const { photo } = (await response.json()) as { photo: WallPhoto };
        added += 1;
        setState((current) =>
          typeof current === "object"
            ? { ...current, photos: [photo, ...current.photos] }
            : current,
        );
        continue;
      }
      const reason = response
        ? ((await response.json().catch(() => ({}))) as { error?: string }).error
        : null;
      if (reason === "full" || reason === "share") {
        problem = reason === "full" ? copy.full : copy.share;
        break;
      }
      if (reason === "closed") {
        void load(device);
        problem = copy.closed;
        break;
      }
      problem = copy.failed;
    }
    setProgress(null);
    setMessage(
      problem
        ? { text: added ? `${copy.added(added)} ${problem}` : problem, tone: "error" }
        : { text: copy.added(added), tone: "ok" },
    );
  };

  const remove = async (photo: WallPhoto) => {
    const device = deviceRef.current;
    const response = await fetch(
      `/api/i/${slug}/wall?${new URLSearchParams({ device, photo: photo.id })}`,
      { method: "DELETE" },
    ).catch(() => null);
    if (!response?.ok) {
      toast({ title: copy.removeFailed, tone: "error" });
      return;
    }
    setState((current) =>
      typeof current === "object"
        ? { ...current, photos: current.photos.filter((item) => item.id !== photo.id) }
        : current,
    );
    toast({ title: copy.removed, tone: "success" });
  };

  // Nothing shows until the wall is known to be there, so invites without one stay as they were
  if (state === "loading" || state === "failed") return null;
  const { window: wall, photos } = state;
  if (wall.state === "off" && photos.length === 0) return null;

  const visible = photos.slice(0, shown);
  const open = wall.state === "open";
  const uploading = progress !== null;

  return (
    <section
      id="photo-wall"
      aria-labelledby={headingId}
      className="scroll-mt-4 border-t border-line bg-surface-2/40 px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 id={headingId} className="font-display text-[1.75rem] leading-tight sm:text-[2.2rem]">
            {copy.heading}
          </h2>
          <p className="max-w-2xl text-ink-muted">
            {wall.state === "open"
              ? copy.intro
              : wall.state === "soon"
                ? copy.soon(formatWallDate(wall.opensOn, language))
                : copy.closed}
          </p>
        </div>

        {open && (
          <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-4 shadow-raised sm:flex-row sm:items-end sm:p-5">
            <Field
              label={copy.name}
              hint={copy.nameHint}
              optionalLabel={copy.optional}
              className="sm:max-w-xs sm:flex-1"
            >
              <Input
                value={shownName}
                onChange={(event) => {
                  setNameTouched(true);
                  setName(event.target.value);
                }}
                maxLength={80}
                autoComplete="name"
                disabled={uploading}
              />
            </Field>
            <input
              ref={inputRef}
              type="file"
              accept={PHOTO_ACCEPT}
              multiple
              tabIndex={-1}
              aria-hidden
              className="sr-only"
              onChange={(event) => void pick(event)}
            />
            <Button
              size="lg"
              className="sm:mb-7"
              loading={uploading}
              leadingIcon={<ImagePlus aria-hidden />}
              aria-describedby={statusId}
              onClick={() => inputRef.current?.click()}
            >
              {copy.add}
            </Button>
          </div>
        )}
        <p
          id={statusId}
          role="status"
          className={
            message?.tone === "error" ? "text-sm font-medium text-danger" : "text-sm text-ink-muted"
          }
        >
          {progress ? copy.adding(progress.done, progress.of) : (message?.text ?? "")}
        </p>

        {photos.length === 0 ? (
          open && (
            <p className="flex items-center gap-2 text-ink-muted">
              <Images aria-hidden className="size-5 text-accent-text" />
              {copy.empty}
            </p>
          )
        ) : (
          <>
            <p className="font-label text-xs tracking-[0.2em] text-ink-muted uppercase">
              {copy.count(photos.length)}
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {visible.map((photo, index) => (
                <li
                  key={photo.id}
                  className="flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-raised"
                >
                  <button
                    type="button"
                    onClick={() => setViewing(index)}
                    aria-label={copy.view(index + 1)}
                    className="block cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
                    <img
                      src={photo.url}
                      alt={copy.photoAlt(photo.name, index + 1)}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                      decoding="async"
                      className="aspect-square h-auto w-full bg-surface-2 object-cover"
                    />
                  </button>
                  <div className="flex min-h-11 items-center justify-between gap-1 ps-3">
                    <p className="line-clamp-2 min-w-0 py-1.5 text-xs break-words text-ink-muted">
                      {photo.name ? copy.by(photo.name) : copy.byGuest}
                    </p>
                    {photo.mine && (
                      <IconButton
                        variant="ghost"
                        size="sm"
                        label={copy.removeLabel(index + 1)}
                        icon={<Trash2 aria-hidden />}
                        onClick={() => void remove(photo)}
                        className="text-ink-muted hover:text-danger"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {photos.length > shown && (
              <Button
                variant="secondary"
                className="self-center"
                onClick={() => setShown((count) => count + PAGE)}
              >
                {copy.more}
              </Button>
            )}
          </>
        )}
      </div>
      <PhotoViewer photos={visible} index={viewing} onIndex={setViewing} words={copy} />
    </section>
  );
}

type ViewerPhoto = { id: string; url: string; width: number; height: number; name: string };

/** One photo large, with previous and next; arrow keys move too. */
export function PhotoViewer({
  photos,
  index,
  onIndex,
  words,
}: {
  photos: readonly ViewerPhoto[];
  index: number | null;
  onIndex: (index: number | null) => void;
  words: {
    close: string;
    previous: string;
    next: string;
    viewerTitle: (index: number, of: number) => string;
    photoAlt: (name: string, index: number) => string;
  };
}) {
  const photo = index === null ? undefined : photos[index];
  const step = (by: number) => {
    if (index === null || photos.length < 2) return;
    onIndex((index + by + photos.length) % photos.length);
  };
  return (
    <Dialog open={Boolean(photo)} onOpenChange={(next) => !next && onIndex(null)}>
      {photo && index !== null && (
        <DialogContent
          title={words.viewerTitle(index + 1, photos.length)}
          closeLabel={words.close}
          className="max-w-4xl"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
          footer={
            photos.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  leadingIcon={<ChevronLeft aria-hidden className="rtl:-scale-x-100" />}
                  onClick={() => step(-1)}
                >
                  {words.previous}
                </Button>
                <Button
                  variant="secondary"
                  trailingIcon={<ChevronRight aria-hidden className="rtl:-scale-x-100" />}
                  onClick={() => step(1)}
                >
                  {words.next}
                </Button>
              </>
            )
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
          <img
            src={photo.url}
            alt={words.photoAlt(photo.name, index + 1)}
            width={photo.width}
            height={photo.height}
            className="mx-auto max-h-[65dvh] w-auto rounded-md object-contain"
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
