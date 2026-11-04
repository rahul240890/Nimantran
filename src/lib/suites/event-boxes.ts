import type { SuiteId } from "./catalog";
import type { GuestStyle } from "./guest-look";
import { hash } from "./section-layouts";

/*
 * The card each celebration's details sit in on the themed guest page (event-box.tsx,
 * ornate-card.tsx, event-cards.css). Palaces, processions and gardens hang their hours in
 * ornate cards (owner, 2026-11-04): a frame with a pearl jhalar and a gilt rod, a jharokha
 * window with its chhatri and bells, a mandap between pillars under a marigold garland, a
 * lotus with flowers in its corners, Kutch mirror-work with tassels, or a temple crest with
 * bells. A party keeps its tickets, stamps and gift tags. Each theme gets one of its
 * style's cards, picked from its id; colours stay the theme's own cloth, gilt and jewel.
 */

export const EVENT_BOXES = {
  palace: ["moti", "jharokha", "mandir"],
  procession: ["mandap", "shisha", "moti"],
  garden: ["kamal", "moti", "mandir"],
  party: ["ticket", "stamp", "tag"],
} as const satisfies Record<GuestStyle, readonly string[]>;

export type EventBox = (typeof EVENT_BOXES)[GuestStyle][number];

/** The party's boxes; every other box is an ornate card with the hour's painting in it. */
export type PartyBox = (typeof EVENT_BOXES)["party"][number];
export type OrnateBox = Exclude<EventBox, PartyBox>;

export const ORNATE_BOXES = ["moti", "jharokha", "mandir", "mandap", "shisha", "kamal"] as const;

export function isOrnate(box: EventBox): box is OrnateBox {
  return (ORNATE_BOXES as readonly string[]).includes(box);
}

/** How a party box's heading shows the celebration's name, number and date. */
export type BoxHead = "seal" | "stub" | "number";

export const BOX_HEADS: Record<PartyBox, BoxHead> = {
  ticket: "stub",
  stamp: "seal",
  tag: "number",
};

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
