import { describe, expect, it } from "vitest";
import { coupleFrameIds, couplePagePhotos } from "./couple-photos";

const names = { first: "Aarav", second: "Meera", joiner: "&" };

describe("couple photo page", () => {
  it("has no photos without a layout or without photos", () => {
    expect(coupleFrameIds({ layout: "none", ids: [] }, ["a", "b"])).toEqual([]);
    expect(coupleFrameIds({ layout: "two", ids: [] }, [])).toEqual([]);
  });

  it("fills frames with the host's choices, else the first photos in order", () => {
    expect(coupleFrameIds({ layout: "one", ids: [] }, ["a", "b"])).toEqual(["a"]);
    expect(coupleFrameIds({ layout: "two", ids: ["c", "a"] }, ["a", "b", "c"])).toEqual(["c", "a"]);
    // A removed photo's frame takes a photo not already chosen
    expect(coupleFrameIds({ layout: "two", ids: ["gone", "a"] }, ["a", "b"])).toEqual(["b", "a"]);
    // One photo for two frames fills one
    expect(coupleFrameIds({ layout: "two", ids: [] }, ["a"])).toEqual(["a"]);
  });

  it("never puts one photo in both frames", () => {
    expect(coupleFrameIds({ layout: "two", ids: ["a", "a"] }, ["a", "b"])).toEqual(["a", "b"]);
  });

  it("describes each photo by who it shows", () => {
    const url = (id: string) => `/p/${id}`;
    expect(couplePagePhotos({ layout: "one", ids: [] }, ["a"], url, names)).toEqual([
      { src: "/p/a", alt: "Aarav & Meera" },
    ]);
    expect(couplePagePhotos({ layout: "two", ids: [] }, ["a", "b"], url, names)).toEqual([
      { src: "/p/a", alt: "Aarav" },
      { src: "/p/b", alt: "Meera" },
    ]);
    // A photo without a link (not uploaded yet) is left out
    expect(couplePagePhotos({ layout: "one", ids: [] }, ["a"], () => undefined, names)).toEqual([]);
  });
});
