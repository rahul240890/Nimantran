import type { CoupleLayout } from "@/lib/editor/couple-photos";
import { isSceneTheme, type SuiteId } from "./catalog";
import { photoPage, PHOTO_PAGE_SUITES } from "./photo-frames";
import { sceneFrames } from "./scene";

/**
 * The photo layouts a design offers. A design that paints its own photo frames (every Scene,
 * and the Story themes with photo pages) always shows them, so it asks for its photos: one,
 * or one each where it has a two-frame painting. A Scene theme painted with the bride's and
 * the groom's frames always asks for both. Only a design without painted frames can leave the
 * photo page out, and an illustrated card, with its couple painted, has none.
 *
 * `scene`: the design shows as one Scene. `one`: the occasion has one guest of honour.
 */
export function designLayouts(suite: SuiteId, scene: boolean, one: boolean): CoupleLayout[] {
  if (scene) {
    if (isSceneTheme(suite)) {
      const frames = sceneFrames(suite);
      if (frames === 0) return ["none"];
      return [!one && frames === 2 ? "two" : "one"];
    }
    return one ? ["one"] : ["one", "two"];
  }
  if (PHOTO_PAGE_SUITES.includes(suite)) {
    const two = photoPage(suite, 2)?.frames.length === 2;
    return one || !two ? ["one"] : ["one", "two"];
  }
  return one ? ["none", "one"] : ["none", "one", "two"];
}
