import type { SuiteId } from "./catalog";
import type { GuestStyle } from "./guest-look";
import { hash } from "./section-layouts";

/*
 * The card each celebration's details sit in on the guest page (ornate-card.tsx,
 * event-cards.css), owner 2026-11-04: a frame with a pearl jhalar and a gilt rod, a
 * jharokha window with latkans, a mandap between pillars under a garland of flowers, a
 * soft card with flowers in its corners, Kutch mirror-work with tassels, or a gilt band
 * with temple bells. Each style of page has its own few cards and each theme gets one,
 * picked from its id; colours stay the theme's own cloth, gilt and jewel.
 */

export const EVENT_BOXES = {
  palace: ["moti", "jharokha", "mandir"],
  procession: ["mandap", "shisha", "moti"],
  garden: ["kamal", "moti", "mandir"],
  party: ["kamal", "shisha", "moti"],
} as const satisfies Record<GuestStyle, readonly string[]>;

export const ORNATE_BOXES = ["moti", "jharokha", "mandir", "mandap", "shisha", "kamal"] as const;
export type EventBox = (typeof ORNATE_BOXES)[number];

/** Stirs a hash's bits (MurmurHash3's finish), so the box doesn't follow the other layouts. */
function stir(h: number): number {
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

/** The box this theme's celebrations sit in: the same every time, on server and client. */
export function eventBox(suite: SuiteId, style: GuestStyle): EventBox {
  const options = EVENT_BOXES[style];
  return options[stir(hash(`${suite}:box`)) % options.length]!;
}

/** The card for a colour-card template, which has no painted theme: picked from its id. */
export function templateBox(templateId: string): EventBox {
  return ORNATE_BOXES[stir(hash(`${templateId}:box`)) % ORNATE_BOXES.length]!;
}
