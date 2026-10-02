"use client";

import { ArrowLeft, Download, Eye, EyeOff, ExternalLink, Images, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteWallPhotos, hideWallPhotos } from "@/actions/photo-wall";
import { PhotoViewer } from "@/components/guest/photo-wall";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { toast } from "@/components/ui/toast";
import { useText } from "@/i18n/client";
import { photoWallText } from "@/i18n/copy/photo-wall";
import type { HostWallPhoto } from "@/lib/invites/photo-wall";
import { zipFiles } from "@/lib/photo-wall/zip";
import { cn } from "@/lib/cn";

/*
 * The host's album (Step 24): every photo guests shared, newest first. Hosts hide a photo
 * from the wall, delete it, download one, or download them all as ZIP files of up to
 * ZIP_SIZE photos each, built in the browser.
 */

const ZIP_SIZE = 150;

function extensionOf(type: string) {
  return type === "image/png" ? "png" : type === "image/jpeg" ? "jpg" : "webp";
}

/** A safe, readable file name: "rohan-mehta-12.webp". */
function fileName(photo: HostWallPhoto, index: number, type: string) {
  const who = photo.name
    .normalize("NFKC")
    .replace(/[\\/:*?"<>|\s]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${who ? `${who}-` : ""}${index}.${extensionOf(type)}`;
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

async function fetchPhoto(photo: HostWallPhoto): Promise<Blob> {
  const response = await fetch(photo.url);
  if (!response.ok) throw new Error(String(response.status));
  return response.blob();
}

export function PhotoAlbum({
  inviteId,
  names,
  status,
  wallUrl,
  photos,
}: {
  inviteId: string;
  names: string;
  status: string;
  wallUrl: string | null;
  photos: HostWallPhoto[];
}) {
  const { albumCopy: copy } = useText(photoWallText);
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<{ part: number; of: number } | null>(null);
  const [viewing, setViewing] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<HostWallPhoto | null>(null);
  const hiddenCount = photos.filter((photo) => photo.hidden).length;

  const toggle = (photo: HostWallPhoto) => {
    setBusyId(photo.id);
    start(async () => {
      const ok = await hideWallPhotos(inviteId, [photo.id], !photo.hidden).catch(() => false);
      setBusyId(null);
      if (!ok) {
        toast({ title: copy.failed, tone: "error" });
        return;
      }
      toast({ title: photo.hidden ? copy.shown : copy.hidden, tone: "success" });
      router.refresh();
    });
  };

  const confirmDelete = () => {
    const photo = deleting;
    if (!photo) return;
    start(async () => {
      const ok = await deleteWallPhotos(inviteId, [photo.id]).catch(() => false);
      if (!ok) {
        toast({ title: copy.failed, tone: "error" });
        return;
      }
      setDeleting(null);
      toast({ title: copy.deleted, tone: "success" });
      router.refresh();
    });
  };

  const downloadOne = async (photo: HostWallPhoto, index: number) => {
    try {
      const blob = await fetchPhoto(photo);
      save(blob, fileName(photo, index, blob.type));
    } catch {
      toast({ title: copy.downloadFailed, tone: "error" });
    }
  };

  const downloadAll = async () => {
    const parts = Math.ceil(photos.length / ZIP_SIZE);
    try {
      for (let part = 0; part < parts; part += 1) {
        setDownloading({ part: part + 1, of: parts });
        const batch = photos.slice(part * ZIP_SIZE, (part + 1) * ZIP_SIZE);
        const entries = [];
        for (const [offset, photo] of batch.entries()) {
          const blob = await fetchPhoto(photo);
          entries.push({
            name: fileName(photo, part * ZIP_SIZE + offset + 1, blob.type),
            data: new Uint8Array(await blob.arrayBuffer()),
            date: new Date(photo.createdAt),
          });
        }
        save(
          zipFiles(entries),
          parts > 1 ? `${copy.fileName}-${part + 1}.zip` : `${copy.fileName}.zip`,
        );
      }
    } catch {
      toast({ title: copy.downloadFailed, tone: "error" });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="flex flex-col gap-4">
        <Link
          href={`/invites/${inviteId}`}
          className="-ms-2 inline-flex min-h-11 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
          {copy.back}
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-[2rem] leading-[1.08] break-words sm:text-[2.6rem]">
              {names}
            </h1>
            <p className="max-w-2xl text-ink-muted">{copy.intro}</p>
            <p className="font-semibold">{status}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {photos.length > 0 && (
              <Button
                size="sm"
                loading={downloading !== null}
                leadingIcon={<Download aria-hidden />}
                onClick={() => void downloadAll()}
              >
                {copy.downloadAll}
              </Button>
            )}
            {wallUrl && (
              <Button asChild size="sm" variant="ghost">
                <a href={wallUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden />
                  {copy.openWall}
                </a>
              </Button>
            )}
          </div>
        </div>
        <p role="status" className="text-sm text-ink-muted">
          {downloading
            ? copy.downloadPart(downloading.part, downloading.of)
            : photos.length > 0
              ? copy.count(photos.length, hiddenCount)
              : ""}
        </p>
      </div>

      {photos.length === 0 ? (
        <EmptyState
          icon={<Images aria-hidden />}
          title={copy.emptyTitle}
          description={copy.emptyBody}
        />
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] sm:gap-4">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className={cn(
                "flex flex-col overflow-hidden rounded-lg border bg-surface shadow-raised",
                photo.hidden ? "border-dashed border-line-strong" : "border-line",
              )}
            >
              <button
                type="button"
                onClick={() => setViewing(index)}
                aria-label={copy.photoAlt(photo.name, index + 1)}
                className="relative block cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed links */}
                <img
                  src={photo.url}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    "aspect-square h-auto w-full bg-surface-2 object-cover",
                    photo.hidden && "opacity-45 grayscale",
                  )}
                />
                {photo.hidden && (
                  <span className="absolute start-2 top-2">
                    <Badge tone="neutral">{copy.hiddenBadge}</Badge>
                  </span>
                )}
              </button>
              <p className="line-clamp-2 px-3 pt-2 text-xs break-words text-ink-muted">
                {copy.by(photo.name)}
              </p>
              <div className="flex items-center justify-end gap-0.5 px-1 pb-1">
                <IconButton
                  variant="ghost"
                  size="sm"
                  label={photo.hidden ? copy.showLabel(index + 1) : copy.hideLabel(index + 1)}
                  icon={photo.hidden ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
                  disabled={pending && busyId === photo.id}
                  onClick={() => toggle(photo)}
                />
                <IconButton
                  variant="ghost"
                  size="sm"
                  label={copy.downloadLabel(index + 1)}
                  icon={<Download aria-hidden />}
                  onClick={() => void downloadOne(photo, index + 1)}
                />
                <IconButton
                  variant="ghost"
                  size="sm"
                  label={copy.deleteLabel(index + 1)}
                  icon={<Trash2 aria-hidden />}
                  onClick={() => setDeleting(photo)}
                  className="text-ink-muted hover:text-danger"
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <PhotoViewer
        photos={photos}
        index={viewing}
        onIndex={setViewing}
        words={{
          close: copy.close,
          previous: copy.previous,
          next: copy.next,
          viewerTitle: copy.viewerTitle,
          photoAlt: copy.photoAlt,
        }}
      />

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent
          title={copy.deleteTitle}
          description={copy.deleteBody}
          closeLabel={copy.close}
          footer={
            <>
              <DialogClose asChild>
                <Button variant="secondary" disabled={pending}>
                  {copy.keep}
                </Button>
              </DialogClose>
              <Button variant="danger" loading={pending} onClick={confirmDelete}>
                {copy.delete}
              </Button>
            </>
          }
        >
          {deleting && (
            // eslint-disable-next-line @next/next/no-img-element -- short-lived signed links
            <img
              src={deleting.url}
              alt={copy.photoAlt(deleting.name, photos.indexOf(deleting) + 1)}
              className="mx-auto max-h-48 w-auto rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
