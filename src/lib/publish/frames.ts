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
  photoWindows,
  type FrameBox,
} from "@/lib/suites/photo-frames";
import { designLayouts } from "@/lib/suites/photo-layouts";
import { isSceneTheme } from "@/lib/suites/catalog";
import { sceneFrames, scenePage } from "@/lib/suites/scene";
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

/** The photo layouts this invite's design offers (see designLayouts). */
export function coupleLayouts(draft: InviteDraft): CoupleLayout[] {
  return designLayouts(draftSuite(draft), draftShowsScene(draft), draftPeople(draft) === "one");
}

/**
 * Whether the design paints its own photo frames. Their photos are optional: an empty
 * frame on a Scene holds a small gilt flower, and a Story with no photo skips its photo page.
 */
export function framedDesign(draft: InviteDraft): boolean {
  return !coupleLayouts(draft).includes("none");
}

/** Whether the design is a Scene painted with two frames, the bride's and the groom's. */
function pairedScene(draft: InviteDraft): boolean {
  const suite = draftSuite(draft);
  return draftShowsScene(draft) && isSceneTheme(suite) && sceneFrames(suite) === 2;
}

/**
 * The couple's photos as the invite shows them: the host's layout where the design offers
 * it. A framed design keeps its frames: a Scene painted with two frames starts with one
 * photo each, as it always has, and any other starts with one photo.
 */
export function draftCouple(draft: InviteDraft): CouplePhotos {
  const layouts = coupleLayouts(draft);
  const own = draft.couplePhotos.layout;
  // An illustrated card, with its couple painted, offers only "none"
  const start = pairedScene(draft) ? "two" : "one";
  const layout = layouts.includes(own) ? own : layouts.includes(start) ? start : layouts[0]!;
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
  const suite = draftSuite(draft);
  // One guest of honour has one photo, as the pages show it, unless the painting has two frames
  const pair = pairedScene(draft);
  const one = draftPeople(draft) === "one" && !pair;
  const chosen = coupleFrameIds(couple, ids).slice(0, one ? 1 : 2);
  if (chosen.length === 0) return [];
  const page = scene ? scenePage(suite, chosen.length) : photoPage(suite, chosen.length);
  if (!page) return chosen.map((id) => ({ id, image: null, box: null, aspect: ARCH_ASPECT }));
  // One photo on a two-frame painting lies behind both frames, as the guest sees it
  const windows = photoWindows(page.frames, chosen.length);
  return chosen.slice(0, windows.length).map((id, i) => {
    const box = photoBox(windows[i]!);
    return { id, image: page.image, box, aspect: frameAspectOf(box, PAINTING_ASPECT) };
  });
}
