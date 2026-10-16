import { describe, expect, it } from "vitest";
import { designById, kindDesigns, type GalleryDesign } from "@/lib/gallery/catalog";
import { catalogEntry } from "@/lib/gallery/filters";
import { sampleWalk } from "./browse";
import { LIVE_DEMOS, tourOrder } from "./paths";

const design = (id: string): GalleryDesign => designById(id)!;
const walk = (id: string, query = "") => sampleWalk(design(id), new URLSearchParams(query));
const idOf = (href: string | null) => href && /^\/sample\/([^?]+)/.exec(href)![1]!;

describe("a sample's Previous and Next", () => {
  it("walk the home page's tour in its own order, round from the last to the first", () => {
    const order = tourOrder("k3x");
    const middle = walk(order[5]!, "tour=k3x");
    expect(middle.previous).toBe(`/sample/${order[4]}?tour=k3x`);
    expect(middle.next).toBe(`/sample/${order[6]}?tour=k3x`);
    expect(idOf(walk(order.at(-1)!, "tour=k3x").next)).toBe(order[0]);
    expect(idOf(walk(order[0]!, "tour=k3x").previous)).toBe(order.at(-1));
    // Choose this design opens the editor for the sample's own occasion
    expect(middle.choose).toBeNull();
  });

  it("stay among a wedding tradition's designs when opened from its page", () => {
    const gujarati = kindDesigns("gujarati").map((item) => item.id);
    const first = gujarati[0]!;
    const { previous, next, choose } = walk(first, "tradition=gujarati");
    for (const href of [previous, next]) {
      expect(href).toMatch(/\?tradition=gujarati$/);
      expect(catalogEntry(design(idOf(href)!)).kinds).toContain("gujarati");
    }
    expect(choose).toMatch(/category=wedding/);
    expect(choose).toMatch(/tradition=gujarati/);
  });

  it("stay among an occasion's designs, and a collection's", () => {
    const birthday = walk("gubbara", "occasion=birthday");
    for (const href of [birthday.previous, birthday.next]) {
      expect(href).toMatch(/\?occasion=birthday$/);
      expect(catalogEntry(design(idOf(href)!)).occasions).toContain("birthday");
    }
    const royal = walk("rajwada-bagh", "collection=royal-wedding");
    if (royal.next?.includes("collection=")) {
      expect(catalogEntry(design(idOf(royal.next)!)).collection).toBe("royal-wedding");
    }
  });

  it("fall back to the design's own occasion with no listing, or one it isn't in", () => {
    for (const query of ["", "occasion=birthday", "tour=k3x", "tour=../x"]) {
      const { previous, next, choose } = walk("kayal-scene", query);
      expect(previous).toMatch(/\?occasion=wedding$/);
      expect(next).toMatch(/\?occasion=wedding$/);
      expect(choose).toBeNull();
    }
    // A 3D card walks the 3D cards
    const card = walk("card-marigold");
    expect(card.next).toMatch(/^\/sample\/card-[a-z-]+\?format=card$/);
  });

  it("offer every demo on a tour", () => {
    for (const id of LIVE_DEMOS) {
      const { previous, next } = walk(id, "tour=abc");
      expect(previous, id).toMatch(/\?tour=abc$/);
      expect(next, id).toMatch(/\?tour=abc$/);
    }
  });
});
