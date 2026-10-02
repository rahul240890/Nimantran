import type { PageType } from "@/lib/editor/type";
import { ROLES, lettering, type TypeRole, type Voice } from "./lettering";

/*
 * How One Scene's words are set. The faces, leading and spacing are the theme's voice
 * from lettering.ts, the same as on the story pages, so a theme reads the same in both
 * kinds of invitation. Only the sizes are the scene's own: everything shares one
 * painting, so each line is a share of the painting's width. The whole scene then keeps
 * its composition at any size, a phone's or the gallery's small preview, and only the
 * floors and ceilings stop it from getting unreadably small or oversized.
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
  names: { role: "names", min: 1.25, fluid: 9.6, max: 3.4 },
  joiner: { role: "joiner", min: 0.8, fluid: 5.6, max: 2 },
  line: { role: "body", min: 0.72, fluid: 3.9, max: 1.3 },
  function: { role: "display", min: 1.05, fluid: 7, max: 2.4 },
  date: { role: "date", min: 0.78, fluid: 4.1, max: 1.35 },
  detail: { role: "small", min: 0.7, fluid: 3.5, max: 1.1 },
  countdown: { role: "label", min: 0.6, fluid: 2.6, max: 0.85 },
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

/** One line of the scene as a canvas font (the video), the same choices as `sceneLine`. */
export type SceneFont = {
  family: string;
  /** The CSS font prefix: style and weight. */
  prefix: string;
  /** Size in px, before any fitting. */
  size: number;
  leading: number;
  /** Letter spacing in em. */
  tracking: number;
  upper: boolean;
  /** The host's own colour for the names, if they picked one. */
  colour?: string;
};

/** The scene's lettering for a line on a painting `width` px wide, for drawing on a canvas. */
export function sceneFont(
  voice: Voice,
  role: SceneRole,
  lang: string | undefined,
  width: number,
  type?: PageType,
  rem = 16,
): SceneFont {
  const { role: typeRole } = SCENE_SIZES[role];
  const set = lettering(voice, typeRole, lang);
  const names = ROLES[typeRole].face === "names";
  const own = names ? type?.names : type?.words;
  const couple = role === "names";
  const scale = (own ? set.size / set.faceSize : set.size) * (type?.scale ?? 1);
  const weight = names && type?.bold ? 700 : own ? undefined : set.weight;
  const italic = names && type?.italic ? "italic " : "";
  return {
    family: own ?? set.family,
    prefix: `${italic}${weight ? `${weight} ` : ""}`,
    size: sceneSize(role, width, rem) * scale,
    leading: set.leading,
    tracking: couple && type?.capitals ? 0.04 : set.tracking,
    upper: set.upper || (couple && Boolean(type?.capitals)),
    colour: couple && type?.colour ? type.colour : undefined,
  };
}
