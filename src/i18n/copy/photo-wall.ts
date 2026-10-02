import * as enWall from "@/content/photo-wall";
import * as hiWall from "@/content/hi/photo-wall";
import type { Localized } from "../text";

/* Photo wall copy in each site language. */
export const photoWallText: Localized<typeof enWall> = { en: enWall, hi: hiWall };
