import { describe, expect, it } from "vitest";
import { arrangement } from "@/lib/engine/music";
import { SCENE_KIN, SUITE_IDS } from "./catalog";
import { themeMusic } from "./music";

const sound = (id: (typeof SUITE_IDS)[number]) => {
  const music = themeMusic(id)!;
  const { lead, taal, beat } = arrangement(music);
  return `${music.raga}:${lead}:${taal}:${Math.round(60 / beat)}`;
};

describe("theme music", () => {
  it("gives every theme music but the plain card colours", () => {
    for (const id of SUITE_IDS) {
      if (id === "classic") expect(themeMusic(id)).toBeNull();
      else expect(themeMusic(id)).not.toBeNull();
    }
  });

  it("plays the painted themes differently from one another", () => {
    const painted = SUITE_IDS.filter((id) => id !== "classic" && !(id in SCENE_KIN));
    expect(new Set(painted.map(sound)).size).toBe(painted.length);
  });

  it("keeps a prayer meeting quiet", () => {
    expect(arrangement(themeMusic("shraddhanjali")!).taal).toBeNull();
  });

  it("varies Scene themes that share a kin", () => {
    const kin = Object.entries(SCENE_KIN).filter(([, painted]) => painted === "gubbara");
    const sounds = new Set(kin.map(([id]) => sound(id as (typeof SUITE_IDS)[number])));
    expect(sounds.size).toBeGreaterThan(1);
  });
});
