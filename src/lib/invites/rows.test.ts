import { describe, expect, it } from "vitest";
import { newDraft, withCategory, type InviteDraft } from "@/lib/editor/draft";
import { draftToRows, rowsToDraft, summarize, type EventRow } from "./rows";

const ID = "7d7f1f5e-3c55-4d3a-9d1c-2b1e6f0b9a11";

function sample(): InviteDraft {
  const draft = withCategory(newDraft("kasavu"), "engagement");
  return {
    ...draft,
    step: "functions",
    content: { first: "Aditya", second: "Priya", joiner: "weds" },
    functions: {
      ...draft.functions,
      engagement: {
        ...draft.functions.engagement,
        included: true,
        date: "2026-12-12",
        time: "18:30",
        venue: "Taj Lake Palace",
        address: "Udaipur",
        dressCode: "Pastels",
      },
    },
    music: { raga: null, playOnOpen: false },
  };
}

function asStored(draft: InviteDraft): {
  event: EventRow;
  functions: ReturnType<typeof draftToRows>["functions"];
} {
  const { event, functions } = draftToRows(draft);
  return {
    event: {
      ...event,
      id: ID,
      status: "draft",
      slug: null,
      updated_at: "2026-09-26T10:00:00.000Z",
    },
    // Postgres hands times back with seconds
    functions: functions.map((row) => ({
      ...row,
      start_time: row.start_time ? `${row.start_time}:00` : null,
      end_time: row.end_time ? `${row.end_time}:00` : null,
    })),
  };
}

describe("invite rows", () => {
  it("stores only the planned functions, in order, with empty values as null", () => {
    const { event, functions } = draftToRows(sample());
    expect(event).toMatchObject({
      category_id: "engagement",
      template_id: "kasavu",
      editor_step: "functions",
    });
    const engagement = functions.find((row) => row.kind === "engagement");
    expect(engagement).toMatchObject({ date: "2026-12-12", start_time: "18:30" });
    expect(functions.every((row, i) => i === 0 || row.position > functions[i - 1]!.position)).toBe(
      true,
    );
    expect(functions.filter((row) => !row.date).every((row) => row.start_time === null)).toBe(true);
  });

  it("round-trips a draft through the database shape", () => {
    const draft = sample();
    const { event, functions } = asStored(draft);
    const back = rowsToDraft(event, functions);
    expect(back.remoteId).toBe(ID);
    expect(back.updatedAt).toBe(Date.parse("2026-09-26T10:00:00.000Z"));
    expect(back.content).toEqual(draft.content);
    expect(back.functions).toEqual(draft.functions);
    expect(back.photos).toEqual([]);
    expect({ ...back, remoteId: null, updatedAt: 0 }).toEqual({ ...draft, remoteId: null });
  });

  it("keeps the box behind the words, and reads older invites without it as off", () => {
    const { event, functions } = asStored({ ...sample(), textBox: true });
    expect(rowsToDraft(event, functions).textBox).toBe(true);
    const older = { ...event, religious: { ...event.religious, textBox: undefined } };
    expect(rowsToDraft(older, functions).textBox).toBe(false);
  });

  it("keeps the family's tradition", () => {
    const draft = {
      ...sample(),
      tradition: {
        id: "gujarati" as const,
        symbol: "none" as const,
        invocation: "latin" as const,
        wording: { children: "મારા મામાના લગ્નમાં જરૂર આવજો" },
      },
    };
    const { event, functions } = asStored(draft);
    expect(event.tradition_id).toBe("gujarati");
    expect(rowsToDraft(event, functions).tradition).toEqual(draft.tradition);
    // Saved before tradition packs, or an unknown pack: no tradition
    expect(
      rowsToDraft({ ...event, tradition_id: null, religious: null }, functions).tradition.id,
    ).toBe(null);
    expect(rowsToDraft({ ...event, tradition_id: "gone" }, functions).tradition.id).toBe(null);
  });

  it("keeps end times, card languages and the second language's words", () => {
    const base = sample();
    const draft: InviteDraft = {
      ...base,
      functions: {
        ...base.functions,
        engagement: { ...base.functions.engagement, endTime: "22:45" },
      },
      languages: ["hi", "en"],
      translation: { first: "Aditya", line: "With love" },
    };
    const { event, functions } = asStored(draft);
    expect(event.languages).toEqual(["hi", "en"]);
    expect(functions.find((row) => row.kind === "engagement")?.end_time).toBe("22:45:00");
    const back = rowsToDraft(event, functions);
    expect(back.functions.engagement.endTime).toBe("22:45");
    expect(back.languages).toEqual(["hi", "en"]);
    expect(back.translation).toEqual(draft.translation);
    // Saved before two-language cards
    const old = rowsToDraft({ ...event, languages: undefined, religious: {} }, functions);
    expect(old.languages).toEqual(["en"]);
    expect(old.translation).toEqual({});
  });

  it("reads unknown values leniently", () => {
    const { event, functions } = asStored(sample());
    const back = rowsToDraft(
      { ...event, template_id: "gone", category_id: "gone", editor_step: "gone" },
      functions,
    );
    expect(back.templateId).toBe("marigold");
    expect(back.categoryId).toBe("wedding");
    expect(back.step).toBe("occasion");
  });

  it("summarises an invite by its occasion's main function", () => {
    const { event, functions } = asStored(sample());
    expect(summarize(event, functions)).toMatchObject({
      id: ID,
      categoryId: "engagement",
      first: "Aditya",
      second: "Priya",
      joiner: "weds",
      mainFunction: "engagement",
      date: "2026-12-12",
      status: "draft",
    });
  });
});

describe("published invites and photos", () => {
  it("carries the link only while published, and photos in order", () => {
    const { event, functions } = asStored(sample());
    const photos = [
      { id: "b", width: 800, height: 600, position: 1 },
      { id: "a", width: null, height: null, position: 0 },
    ];
    const draft = rowsToDraft({ ...event, slug: "a-and-b" }, functions, photos);
    expect(draft.slug).toBeNull();
    expect(draft.photos).toEqual([
      { id: "a", width: 1, height: 1 },
      { id: "b", width: 800, height: 600 },
    ]);
    const live = rowsToDraft({ ...event, status: "published", slug: "a-and-b" }, functions);
    expect(live.slug).toBe("a-and-b");
    expect(summarize({ ...event, status: "published", slug: "a-and-b" }, functions).slug).toBe(
      "a-and-b",
    );
  });
});
