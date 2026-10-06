import type { StoryPhoto } from "@/lib/engine/story";
import type { PhotoCrop } from "./photo-fit";

/*
 * The couple's photo page (Step 12l): no page, one photo of the couple together, or one
 * each for the bride and the groom, filled from the invite's own photos. Kept free of the
 * validator so the guest's page can read it without downloading zod.
 */

export const COUPLE_LAYOUTS = ["none", "one", "two"] as const;
export type CoupleLayout = (typeof COUPLE_LAYOUTS)[number];

export type CouplePhotos = {
  layout: CoupleLayout;
  /** Photo ids by frame; a missing or removed one falls back to the invite's photos in order. */
  ids: string[];
  /** How the host placed each photo in its frame, by photo id; a missing one sits by default. */
  crops?: Record<string, PhotoCrop>;
  /**
   * Set once the host fills the frames from their own upload fields: each frame then shows
   * only the photo chosen for it, never one of the invite's other photos.
   */
  strict?: boolean;
};

export const noCouplePhotos: CouplePhotos = { layout: "none", ids: [] };

/** How many frames a layout has. */
export const frameCount = (layout: CoupleLayout) =>
  layout === "two" ? 2 : layout === "one" ? 1 : 0;

/**
 * The photo ids that fill the frames, in order: the host's choice for each frame while that
 * photo is still on the invite, else the first photos not already used. Fewer photos than
 * frames shows as many as there are; none means no photo page.
 */
export function coupleFrameIds(couple: CouplePhotos, photoIds: readonly string[]): string[] {
  if (couple.strict) {
    return frameSlots(couple, photoIds, frameCount(couple.layout)).filter(
      (id): id is string => id !== null,
    );
  }
  const chosen: string[] = [];
  for (let i = 0; i < frameCount(couple.layout); i++) {
    const pick = couple.ids[i];
    const id =
      pick && photoIds.includes(pick) && !chosen.includes(pick)
        ? pick
        : (photoIds.find((photo) => !chosen.includes(photo) && !couple.ids.includes(photo)) ??
          photoIds.find((photo) => !chosen.includes(photo)));
    if (id) chosen.push(id);
  }
  return chosen;
}

/**
 * Each frame's own photo, by frame, or null where the host hasn't added one yet: what the
 * editor's upload fields show. Older invites, which filled frames from the invite's photos
 * in order, show those photos in their frames.
 */
export function frameSlots(
  couple: CouplePhotos,
  photoIds: readonly string[],
  count: number,
): (string | null)[] {
  if (!couple.strict) {
    const filled = coupleFrameIds({ ...couple, layout: count >= 2 ? "two" : "one" }, photoIds);
    return Array.from({ length: count }, (_, i) => filled[i] ?? null);
  }
  const seen = new Set<string>();
  return Array.from({ length: count }, (_, i) => {
    const id = couple.ids[i];
    if (!id || !photoIds.includes(id) || seen.has(id)) return null;
    seen.add(id);
    return id;
  });
}

/** A scene always shows photos: one of the couple if the host picked one, else one each. */
export function sceneCouple(couple: CouplePhotos): CouplePhotos {
  return { ...couple, layout: couple.layout === "one" ? "one" : "two" };
}

/**
 * The photo page's photos for the story, with the names each one shows and, for a photo the
 * host adjusted, how it sits in its frame (`aspectOf` gives the photo file's width over height).
 */
export function couplePagePhotos(
  couple: CouplePhotos,
  photoIds: readonly string[],
  urlFor: (id: string) => string | undefined,
  names: { first: string; second: string; joiner: string },
  aspectOf?: (id: string) => number | undefined,
): StoryPhoto[] {
  // A birthday's one name has one photo, whatever layout a couple's invite left behind
  const ids = coupleFrameIds(couple, photoIds).slice(0, names.second.trim() ? 2 : 1);
  const together = [names.first, names.second].filter(Boolean).join(` ${names.joiner || "&"} `);
  const alts = ids.length > 1 ? [names.first, names.second] : [together];
  return ids.flatMap((id, i) => {
    const src = urlFor(id);
    if (!src) return [];
    const crop = couple.crops?.[id];
    const aspect = aspectOf?.(id);
    const alt = alts[i] || together;
    return [crop && aspect ? { src, alt, fit: { ...crop, aspect } } : { src, alt }];
  });
}

/** A photo's width over its height, from the invite's photos, if it is one of them. */
export function photoAspect(
  photos: readonly { id: string; width: number; height: number }[],
  id: string,
): number | undefined {
  const photo = photos.find((p) => p.id === id);
  return photo && photo.width > 0 && photo.height > 0 ? photo.width / photo.height : undefined;
}
