import type { PhotoFit } from "@/lib/editor/photo-fit";
import type { PublicPhoto } from "@/lib/invites/public";

/** One of the invite's photos as the guest page shows it, placed as the host placed it. */
export type GuestPhoto = PublicPhoto & { fit?: PhotoFit };

/** The guest page's photo frames (the welcome's and the gallery's), width over height. */
export const GALLERY_ASPECT = 4 / 5;
