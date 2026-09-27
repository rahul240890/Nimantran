import type { StoryPhoto } from "@/lib/engine/story";

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

/** The photo page's photos for the story, with the names each one shows. */
export function couplePagePhotos(
  couple: CouplePhotos,
  photoIds: readonly string[],
  urlFor: (id: string) => string | undefined,
  names: { first: string; second: string; joiner: string },
): StoryPhoto[] {
  const ids = coupleFrameIds(couple, photoIds);
  const together = [names.first, names.second].filter(Boolean).join(` ${names.joiner || "&"} `);
  const alts = ids.length > 1 ? [names.first, names.second] : [together];
  return ids.flatMap((id, i) => {
    const src = urlFor(id);
    return src ? [{ src, alt: alts[i] || together }] : [];
  });
}
