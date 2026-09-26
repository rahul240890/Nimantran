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
    event: { ...event, id: ID, status: "draft", updated_at: "2026-09-26T10:00:00.000Z" },
    // Postgres hands times back with seconds
    functions: functions.map((row) => ({
      ...row,
      start_time: row.start_time ? `${row.start_time}:00` : null,
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
