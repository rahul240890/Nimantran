import type { PageType } from "@/lib/editor/type";
import { ROLES, lettering, type TypeRole, type Voice } from "./lettering";

/*
 * How One Scene's words are set. The faces, leading and spacing are the theme's voice
 * from lettering.ts, the same as on the story pages, so a theme reads the same in both
 * kinds of invitation. Only the sizes are the scene's own: everything shares one
 * painting, so each line is smaller than on a page of its own, but never below what
 * reads comfortably on a phone.
 */

export type SceneRole =
  /** The couple's names under the photos. */
  | "names"
  /** The "&" between them. */
  | "joiner"
  /** The invitation's line under the names. */
  | "line"
  /** The function's name in the slot. */
  | "function"
  /** Its day. */
  | "date"
  /** Its time and venue. */
  | "detail"
  /** "In 5 days". */
  | "countdown";

type SceneSize = {
  role: TypeRole;
  /** Size in rem at the least and most, and in between a share of the painting's width. */
  min: number;
  fluid: number;
  max: number;
};

export const SCENE_SIZES: Record<SceneRole, SceneSize> = {
  names: { role: "names", min: 1.75, fluid: 9.6, max: 3.4 },
  joiner: { role: "joiner", min: 1.1, fluid: 5.6, max: 2 },
  line: { role: "body", min: 0.95, fluid: 4, max: 1.3 },
  function: { role: "display", min: 1.4, fluid: 7.4, max: 2.5 },
  date: { role: "date", min: 1, fluid: 4.6, max: 1.45 },
  detail: { role: "small", min: 0.86, fluid: 3.7, max: 1.12 },
  countdown: { role: "label", min: 0.72, fluid: 2.8, max: 0.9 },
};

/** A scene line's designed size in px on a painting `width` px wide. */
export function sceneSize(role: SceneRole, width: number, rem = 16): number {
  const { min, fluid, max } = SCENE_SIZES[role];
  return Math.min(max * rem, Math.max(min * rem, (fluid * width) / 100));
}

/**
 * The CSS for one line of the scene: the voice's face in the line's script, the host's
 * own lettering over it (Step 12n), and the size, which the scene shrinks with
 * `--scene-fit` when long words would overflow their place on the painting.
 */
export function sceneLine(
  voice: Voice,
  role: SceneRole,
  lang: string | undefined,
  type?: PageType,
): Record<string, string | number | undefined> {
  const { role: typeRole, min, fluid, max } = SCENE_SIZES[role];
  const set = lettering(voice, typeRole, lang);
  const names = ROLES[typeRole].face === "names";
  const own = names ? type?.names : type?.words;
  const couple = role === "names";
  // A face the host picked has its own proportions, so only the script's size applies
  const size = (own ? set.size / set.faceSize : set.size) * (type?.scale ?? 1);
  return {
    fontFamily: own ?? set.family,
    fontWeight: names && type?.bold ? 700 : own ? undefined : set.weight,
    fontStyle: names && type?.italic ? "italic" : undefined,
    fontSize: `calc(clamp(${min}rem, ${fluid}cqw, ${max}rem) * ${size.toFixed(3)} * var(--scene-fit, 1))`,
    lineHeight: set.leading,
    letterSpacing:
      couple && type?.capitals ? "0.04em" : set.tracking ? `${set.tracking}em` : "normal",
    textTransform: set.upper || (couple && type?.capitals) ? "uppercase" : undefined,
    color: couple && type?.colour ? type.colour : undefined,
  };
}
