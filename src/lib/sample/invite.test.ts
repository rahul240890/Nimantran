import { describe, expect, it } from "vitest";
import { designById } from "@/lib/gallery/catalog";
import { draftCopy, draftFaith } from "@/lib/editor/draft";
import { sampleFaith, sampleInvite } from "./invite";

const design = (id: string) => {
  const found = designById(id);
  if (!found) throw new Error(id);
  return found;
};

describe("a design's sample", () => {
  it("blesses in the faith of the weddings it's made for", () => {
    expect(sampleFaith(design("phulkari-haveli"))).toBe("sikh");
    expect(sampleFaith(design("noor-bagh"))).toBe("muslim");
    expect(sampleFaith(design("chapel"))).toBe("christian");
    expect(sampleFaith(design("rajwada-bagh"))).toBe("hindu");
    expect(sampleFaith(design("card-bandhani"))).toBe("hindu");
  });

  it("starts with that faith's own blessing and names, in either language", () => {
    const sikh = sampleInvite(design("phulkari-haveli"), "en").draft;
    expect(draftFaith(sikh)).toBe("sikh");
    expect(draftCopy(sikh).blessing).toBe("Ik Onkar Satgur Prasad");
    expect(sikh.content.first).toBe("Arjan");
    const nikah = sampleInvite(design("noor-bagh"), "hi").draft;
    expect(draftCopy(nikah).blessing).not.toMatch(/गणे/);
    expect(nikah.content.second).toBe("ज़ोया");
    const church = sampleInvite(design("chapel"), "en").draft;
    expect(draftCopy(church).blessing).not.toMatch(/Ganesh/);
    // A Hindu palace garden keeps Ganesha's blessing and the usual couple
    const palace = sampleInvite(design("rajwada-bagh"), "en").draft;
    expect(draftCopy(palace).blessing).toBe("With the blessings of Lord Ganesha");
    expect(palace.content.first).toBe("Arjun");
  });
});
