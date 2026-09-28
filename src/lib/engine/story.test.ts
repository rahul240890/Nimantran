import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/templates/catalog";
import { toCardCopy } from "@/lib/templates/content";
import { FUNCTION_IDS, type FunctionId } from "@/lib/events/functions";
import { uiStrings } from "@/lib/ui-strings";
import {
  BEAT_MIN,
  STORY_MAX_SECONDS,
  STORY_SCENES,
  beatAt,
  beatSeconds,
  lineDelay,
  storyBeats,
  storyLength,
  type StoryFunction,
} from "./story";

const copy = {
  ...toCardCopy(TEMPLATES.marigold, {
    blessing: "Shri Ganeshaya Namah",
    first: "Aanya",
    second: "Vihaan",
    date: "Saturday, 14 February 2027",
    line: "request the pleasure of your company",
  }),
  symbol: "kalash" as const,
};

const fn = (kind: FunctionId, extra: Partial<StoryFunction> = {}): StoryFunction => ({
  kind,
  name: kind[0]!.toUpperCase() + kind.slice(1),
  localName: null,
  date: "Friday, 12 February 2027",
  time: "4:00 PM",
  muhurat: null,
  venue: "The Leela, Udaipur",
  ...extra,
});

const words = uiStrings.storyWords;

describe("event pages", () => {
  it("adds the couple's photo page after the cover, with their names and photos", () => {
    const photos = [
      { src: "/a.webp", alt: "Aarav" },
      { src: "/b.webp", alt: "Meera" },
      { src: "/c.webp", alt: "extra" },
    ];
    const beats = storyBeats({
      copy,
      functions: [fn("wedding")],
      replies: true,
      words,
      couple: photos,
    });
    expect(beats.map((b) => b.id).slice(0, 2)).toEqual(["cover", "couple"]);
    const page = beats[1]!;
    expect(page.photos).toEqual(photos.slice(0, 2));
    expect(page.symbol).toBe(false);
    expect(page.lines.filter((l) => l.style === "display")).toHaveLength(2);
    expect(page.seconds).toBeGreaterThanOrEqual(6);
    // No photos, no page
    expect(
      storyBeats({ copy, functions: [], replies: true, words }).map((b) => b.id),
    ).not.toContain("couple");
  });

  it("opens with the god's page and moves the blessing and symbol there from the cover", () => {
    const beats = storyBeats({
      copy,
      functions: [fn("wedding")],
      replies: true,
      words,
      blessing: true,
    });
    expect(beats.map((b) => b.id).slice(0, 2)).toEqual(["blessing", "cover"]);
    expect(beats[0]!.scene).toBe("blessing");
    expect(beats[0]!.lines).toEqual([{ text: "Shri Ganeshaya Namah", style: "script" }]);
    expect(beats[0]!.seconds).toBeGreaterThanOrEqual(5);
    expect(beats[1]!.lines.map((l) => l.text)).toEqual(["Aanya", "&", "Vihaan"]);
    expect(beats[1]!.symbol).toBe(false);
    // Without it, the cover keeps both
    const plain = storyBeats({ copy, functions: [fn("wedding")], replies: true, words });
    expect(plain[0]!.id).toBe("cover");
    expect(plain[0]!.symbol).toBe(true);
  });

  it("turns through cover, family, each function, then asks for a reply", () => {
    const beats = storyBeats({
      copy,
      functions: [fn("haldi"), fn("sangeet"), fn("wedding")],
      replies: true,
      words,
    });
    expect(beats.map((b) => b.scene)).toEqual([
      "cover",
      "family",
      "haldi",
      "sangeet",
      "wedding",
      "reply",
    ]);
    expect(beats[0]!.symbol).toBe(true);
    expect(beats.at(-1)!.lines[0]!.text).toBe(words.joinUs);
    // Every beat has a unique id, for keys and tests
    expect(new Set(beats.map((b) => b.id)).size).toBe(beats.length);
  });

  it("gives every function its own scene", () => {
    for (const kind of FUNCTION_IDS) expect(STORY_SCENES).toContain(kind);
  });

  it("puts the blessing over the names, in order with the joiner between them", () => {
    const [names] = storyBeats({ copy, functions: [], replies: false, words });
    expect(names!.lines[0]!.text).toBe("Shri Ganeshaya Namah");
    expect(names!.lines.map((l) => l.text)).toEqual(
      expect.arrayContaining(["Aanya", "&", "Vihaan"]),
    );
    const texts = names!.lines.map((l) => l.text);
    expect(texts.indexOf("Aanya")).toBeLessThan(texts.indexOf("Vihaan"));
  });

  it("leaves out empty lines and a blessing nobody wrote", () => {
    const plain = { ...copy, blessing: "", symbol: null };
    const beats = storyBeats({
      copy: plain,
      functions: [fn("mehendi", { time: "", venue: "" }), fn("reception")],
      replies: false,
      words,
    });
    expect(beats[0]!.scene).toBe("cover");
    expect(beats[0]!.symbol).toBe(false);
    for (const beat of beats) for (const line of beat.lines) expect(line.text).not.toBe("");
    const mehendi = beats.find((b) => b.scene === "mehendi")!;
    expect(mehendi.lines.map((l) => l.text)).toEqual(["Mehendi", "Friday, 12 February 2027"]);
    expect(beats.at(-1)!.lines[0]!.text).toBe(words.withLove);
  });

  it("keeps a single function's date on its own page, not the family's", () => {
    const beats = storyBeats({ copy, functions: [fn("wedding")], replies: true, words });
    const family = beats.find((b) => b.scene === "family")!;
    expect(family.lines.map((l) => l.text)).not.toContain(words.saveTheDate);
    expect(family.lines.at(-1)!.text).toBe(copy.line);
  });

  it("puts the family's own wording on its own page, then the invitation and the day", () => {
    const beats = storyBeats({
      copy,
      functions: [fn("haldi"), fn("wedding")],
      replies: true,
      words,
      family: [{ title: "आशीर्वाद", text: "श्रीमती कमला देवी", lang: "hi" }],
    });
    const family = beats.find((b) => b.scene === "family")!;
    expect(family.lines.filter((l) => l.lang === "hi").map((l) => l.text)).toEqual([
      "आशीर्वाद",
      "श्रीमती कमला देवी",
    ]);
    expect(family.lines.map((l) => l.text)).not.toContain(words.saveTheDate);
    const invite = beats[beats.indexOf(family) + 1]!;
    expect(invite.id).toBe("invite");
    expect(invite.scene).toBe("family");
    expect(invite.lines.map((l) => l.text)).toEqual([copy.line, words.saveTheDate, copy.date]);
  });

  it("gives function pages their Directions and calendar links", () => {
    const beats = storyBeats({
      copy,
      functions: [
        fn("haldi", { mapsUrl: "https://maps.example/x", icsUrl: "/ics/haldi" }),
        fn("sangeet"),
      ],
      replies: true,
      words,
    });
    expect(beats.find((b) => b.scene === "haldi")!.links).toEqual({
      maps: "https://maps.example/x",
      calendar: "/ics/haldi",
    });
    expect(beats.find((b) => b.scene === "sangeet")!.links).toBeUndefined();
  });

  it("marks local ceremony names and the muhurat in their own language", () => {
    const beats = storyBeats({
      copy,
      functions: [
        fn("wedding", {
          localName: { text: "विवाह", lang: "hi" },
          muhurat: { text: "शुभ मुहूर्त", lang: "hi" },
          time: "9:47 AM to 10:31 AM",
        }),
      ],
      replies: true,
      words,
    });
    const wedding = beats.find((b) => b.scene === "wedding")!;
    expect(wedding.lines.filter((l) => l.lang === "hi").map((l) => l.text)).toEqual([
      "विवाह",
      "शुभ मुहूर्त",
    ]);
  });

  it("gives each beat time to arrive and be read", () => {
    const short = beatSeconds([{ text: "Haldi", style: "label" }]);
    const long = beatSeconds([
      { text: "Haldi", style: "label" },
      { text: "Friday, 12 February 2027", style: "display" },
      { text: "10:00 AM onwards, followed by lunch", style: "body" },
      { text: "The Leela Palace, Udaipur", style: "small" },
    ]);
    expect(short).toBeGreaterThanOrEqual(3.5);
    expect(long).toBeGreaterThan(short);
    expect(long).toBeLessThan(9);
    expect(lineDelay(0)).toBe(0);
    expect(lineDelay(2)).toBeGreaterThan(lineDelay(1));
  });

  it("keeps a long story under its limit", () => {
    const venue = "A very long venue name at the end of a very long road, Bengaluru";
    const seven = ["roka", "engagement", "haldi", "mehendi", "sangeet", "wedding", "reception"];
    const functions = FUNCTION_IDS.filter((kind) => seven.includes(kind)).map((kind) =>
      fn(kind, { venue }),
    );
    const beats = storyBeats({ copy, functions, replies: true, words });
    expect(storyLength(beats)).toBeLessThanOrEqual(STORY_MAX_SECONDS + 0.5);
    for (const beat of beats) expect(beat.seconds).toBeGreaterThanOrEqual(BEAT_MIN);
  });

  it("never rushes a beat, even with every function planned", () => {
    const functions = FUNCTION_IDS.map((kind) => fn(kind, { venue: "Kankotri Vadi, Rajkot" }));
    const beats = storyBeats({ copy, functions, replies: true, words });
    for (const beat of beats) expect(beat.seconds).toBeGreaterThanOrEqual(BEAT_MIN);
    expect(storyLength(beats)).toBeLessThanOrEqual(
      Math.max(STORY_MAX_SECONDS, beats.length * BEAT_MIN) + 0.5,
    );
  });

  it("finds the beat playing at any moment", () => {
    const beats = storyBeats({ copy, functions: [fn("haldi")], replies: true, words });
    expect(beatAt(beats, 0)).toEqual({ index: 0, progress: 0, done: false });
    const first = beats[0]!.seconds;
    expect(beatAt(beats, first + 0.01).index).toBe(1);
    expect(beatAt(beats, storyLength(beats) + 1).done).toBe(true);
  });
});
