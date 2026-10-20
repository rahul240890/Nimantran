import type { SuiteId } from "./catalog";
import type { GuestStyle } from "./guest-look";
import { hash } from "./section-layouts";

/*
 * The box each celebration's details sit in on the themed guest page (event-box.tsx,
 * guest-sections.css). Each style of page has its own few boxes, so a palace hangs its
 * hours in jharokha windows and Mughal arches, a procession under torans and mandap
 * roofs, a garden on kasavu, lotus petals and lace, and a party on tickets, stamps and
 * gift tags. Each theme gets one of its style's boxes, picked from its id, and every box
 * opens with its own kind of heading: a date seal, a ticket's stub, a ribbon, gilt rules
 * or a large number. Colours stay the theme's own cloth, gilt and jewel.
 */

export const EVENT_BOXES = {
  palace: ["jharokha", "cusped", "corners", "scroll"],
  procession: ["toran", "mandap", "corners", "scroll"],
  garden: ["kasavu", "petal", "scallop"],
  party: ["ticket", "stamp", "tag"],
} as const satisfies Record<GuestStyle, readonly string[]>;

export type EventBox = (typeof EVENT_BOXES)[GuestStyle][number];

/** How a box's heading shows the celebration's name, number and date. */
export type BoxHead = "seal" | "stub" | "ribbon" | "rules" | "number";

export const BOX_HEADS: Record<EventBox, BoxHead> = {
  jharokha: "seal",
  cusped: "rules",
  corners: "ribbon",
  scroll: "rules",
  toran: "stub",
  mandap: "seal",
  kasavu: "number",
  petal: "number",
  scallop: "seal",
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
