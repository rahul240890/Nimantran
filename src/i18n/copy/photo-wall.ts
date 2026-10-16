import * as enWall from "@/content/photo-wall";
import * as hiWall from "@/content/hi/photo-wall";
import * as mrWall from "@/content/mr/photo-wall";
import * as guWall from "@/content/gu/photo-wall";
import * as bnWall from "@/content/bn/photo-wall";
import * as taWall from "@/content/ta/photo-wall";
import type { Localized } from "../text";

/* Photo wall copy in each site language. */
export const photoWallText: Localized<typeof enWall> = {
  en: enWall,
  hi: hiWall,
  mr: mrWall,
  gu: guWall,
  bn: bnWall,
  ta: taWall,
};
