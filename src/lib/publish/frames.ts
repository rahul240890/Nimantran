import {
  coupleFrameIds,
  frameCount,
  frameSlots,
  type CoupleLayout,
  type CouplePhotos,
} from "@/lib/editor/couple-photos";
import type { InviteDraft } from "@/lib/editor/draft";
import { draftPeople } from "@/lib/editor/draft";
import { frameAspectOf } from "@/lib/editor/photo-fit";
import {
  ARCH_ASPECT,
  PAINTING_ASPECT,
  photoBox,
  photoPage,
  PHOTO_PAGE_SUITES,
  type FrameBox,
} from "@/lib/suites/photo-frames";
import { isSceneTheme } from "@/lib/suites/catalog";
import { scenePage } from "@/lib/suites/scene";
import { draftShowsScene, draftSuite } from "./story";

/*
 * The frames the host's photos show in, as guests will see them: One Scene's frame, the
 * Story photo page's painted frames, or the plain arches of a theme without them. The
 * photo editor shows each photo inside its own frame from these.
 */

export type FrameSpot = {
  /** The photo in this frame. */
  id: string;
  /** The painting the frame is cut out of, or null for a plain arch. */
  image: string | null;
  /** The photo's box on the painting, in percent; null for a plain arch. */
  box: FrameBox | null;
  /** The frame's width over its height. */
  aspect: number;
};

/**
 * The photo layouts this invite's design offers. A design that paints its own photo frames
 * (every Scene, and the Story themes with photo pages) always shows them, so it asks for its
 * photos: one, or one each where it has a two-frame painting. Only a design without painted
 * frames can leave the photo page out.
 */
export function coupleLayouts(draft: InviteDraft): CoupleLayout[] {
  const one = draftPeople(draft) === "one";
  const suite = draftSuite(draft);
  if (draftShowsScene(draft)) return isSceneTheme(suite) || one ? ["one"] : ["one", "two"];
  if (PHOTO_PAGE_SUITES.includes(suite)) {
    const two = photoPage(suite, 2)?.frames.length === 2;
    return one || !two ? ["one"] : ["one", "two"];
  }
  return one ? ["none", "one"] : ["none", "one", "two"];
}

/** Whether the design paints its own photo frames, which then must be filled. */
export function framedDesign(draft: InviteDraft): boolean {
  return !coupleLayouts(draft).includes("none");
}

/**
 * The couple's photos as the invite shows them: the host's layout where the design offers
 * it. A framed design never goes without its photos: a Scene shows its fullest painting, as
 * it always has, and a Story's photo page starts with one photo.
 */
export function draftCouple(draft: InviteDraft): CouplePhotos {
  const layouts = coupleLayouts(draft);
  const own = draft.couplePhotos.layout;
  const layout = layouts.includes(own) ? own : "one";
  return layout === own ? draft.couplePhotos : { ...draft.couplePhotos, layout };
}

/** Each frame's photo id, or null where the host still has to add one. */
export function draftFrameSlots(draft: InviteDraft): (string | null)[] {
  const couple = draftCouple(draft);
  const ids = draft.photos.map((photo) => photo.id);
  return frameSlots(couple, ids, frameCount(couple.layout));
}

export function draftFrames(draft: InviteDraft): FrameSpot[] {
  const ids = draft.photos.map((photo) => photo.id);
  const scene = draftShowsScene(draft);
  const couple = draftCouple(draft);
  // One guest of honour has one photo, as the pages show it
  const chosen = coupleFrameIds(couple, ids).slice(0, draftPeople(draft) === "one" ? 1 : 2);
  if (chosen.length === 0) return [];
  const suite = draftSuite(draft);
  const page = scene ? scenePage(suite, chosen.length) : photoPage(suite, chosen.length);
  if (!page) return chosen.map((id) => ({ id, image: null, box: null, aspect: ARCH_ASPECT }));
  return chosen.slice(0, page.frames.length).map((id, i) => {
    const box = photoBox(page.frames[i]!);
    return { id, image: page.image, box, aspect: frameAspectOf(box, PAINTING_ASPECT) };
  });
}
