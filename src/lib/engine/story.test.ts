import { describe, expect, it } from "vitest";
import { TEMPLATES } from "@/lib/templates/catalog";
import { toCardCopy } from "@/lib/templates/content";
import { FUNCTION_IDS, type FunctionId } from "@/lib/events/functions";
import { uiStrings } from "@/lib/ui-strings";
import {
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

describe("story reveal", () => {
  it("tells blessing, names, date, each function, then asks for a reply", () => {
    const beats = storyBeats({
      copy,
      functions: [fn("haldi"), fn("sangeet"), fn("wedding")],
      replies: true,
      words,
    });
    expect(beats.map((b) => b.scene)).toEqual([
      "blessing",
      "names",
      "date",
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

  it("puts the names in order with the joiner between them", () => {
    const [, names] = storyBeats({ copy, functions: [], replies: false, words });
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
    expect(beats[0]!.scene).toBe("names");
    for (const beat of beats) for (const line of beat.lines) expect(line.text).not.toBe("");
    const mehendi = beats.find((b) => b.scene === "mehendi")!;
    expect(mehendi.lines.map((l) => l.text)).toEqual(["Mehendi", "Friday, 12 February 2027"]);
    expect(beats.at(-1)!.lines[0]!.text).toBe(words.withLove);
  });

  it("keeps a single function's date on its own beat and skips the separate date", () => {
    const beats = storyBeats({ copy, functions: [fn("wedding")], replies: true, words });
    expect(beats.map((b) => b.scene)).not.toContain("date");
    expect(beats.find((b) => b.scene === "names")!.lines.at(-1)!.text).toBe(copy.line);
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
    expect(short).toBeGreaterThanOrEqual(2.5);
    expect(long).toBeGreaterThan(short);
    expect(long).toBeLessThan(8);
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
    for (const beat of beats) expect(beat.seconds).toBeGreaterThanOrEqual(2.8);
  });

  it("never rushes a beat, even with every function planned", () => {
    const functions = FUNCTION_IDS.map((kind) => fn(kind, { venue: "Kankotri Vadi, Rajkot" }));
    const beats = storyBeats({ copy, functions, replies: true, words });
    for (const beat of beats) expect(beat.seconds).toBeGreaterThanOrEqual(2.8);
    expect(storyLength(beats)).toBeLessThanOrEqual(beats.length * 2.8 + 0.5);
  });

  it("finds the beat playing at any moment", () => {
    const beats = storyBeats({ copy, functions: [fn("haldi")], replies: true, words });
    expect(beatAt(beats, 0)).toEqual({ index: 0, progress: 0, done: false });
    const first = beats[0]!.seconds;
    expect(beatAt(beats, first + 0.01).index).toBe(1);
    expect(beatAt(beats, storyLength(beats) + 1).done).toBe(true);
  });
});
