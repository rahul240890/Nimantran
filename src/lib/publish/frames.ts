import { coupleFrameIds, sceneCouple } from "@/lib/editor/couple-photos";
import type { InviteDraft } from "@/lib/editor/draft";
import { draftPeople } from "@/lib/editor/draft";
import { frameAspectOf } from "@/lib/editor/photo-fit";
import {
  ARCH_ASPECT,
  PAINTING_ASPECT,
  photoBox,
  photoPage,
  type FrameBox,
} from "@/lib/suites/photo-frames";
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

export function draftFrames(draft: InviteDraft): FrameSpot[] {
  const ids = draft.photos.map((photo) => photo.id);
  const scene = draftShowsScene(draft);
  const couple = scene ? sceneCouple(draft.couplePhotos) : draft.couplePhotos;
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
