"use client";

import { useMemo } from "react";
import { couplePagePhotos, photoAspect, sceneCouple } from "@/lib/editor/couple-photos";
import type { InviteDraft } from "@/lib/editor/draft";
import type { StoryPhoto } from "@/lib/engine/story";
import type { CardCopy } from "@/lib/templates/content";
import { usePhotoUrls } from "./use-photo-urls";

/**
 * The couple's photo page as the editor previews it, from the photos on this device; with
 * `scene`, the photos One Scene shows, which always has at least one frame.
 */
export function useCouplePhotos(
  draft: InviteDraft,
  copy: CardCopy,
  scene = false,
): readonly StoryPhoto[] {
  const ids = draft.photos.map((photo) => photo.id);
  const urls = usePhotoUrls(ids, draft.remoteId);
  // A stable value while nothing it shows changes, so the pages don't restart
  const key = JSON.stringify(
    couplePagePhotos(
      scene ? sceneCouple(draft.couplePhotos) : draft.couplePhotos,
      ids,
      (id) => urls[id],
      {
        first: copy.first,
        second: copy.second,
        joiner: copy.joiner,
      },
      (id) => photoAspect(draft.photos, id),
    ),
  );
  return useMemo(() => JSON.parse(key) as StoryPhoto[], [key]);
}
