import { describe, expect, it } from "vitest";
import {
  draftCopy,
  draftProblems,
  draftTemplate,
  mainFunction,
  newDraft,
  parseDraft,
  stepErrors,
  type InviteDraft,
} from "./draft";

function complete(): InviteDraft {
  const draft = newDraft("rose");
  return {
    ...draft,
    content: { first: "Aditya", second: "Priya" },
    functions: {
      ...draft.functions,
      wedding: {
        ...draft.functions.wedding,
        date: "2027-02-14",
        time: "18:30",
        venue: "Taj Falaknuma, Hyderabad",
      },
    },
  };
}

describe("invite draft", () => {
  it("starts with the wedding planned and nothing else", () => {
    const draft = newDraft();
    expect(mainFunction(draft)).toBe("wedding");
    expect(Object.values(draft.functions).filter((fn) => fn.included)).toHaveLength(1);
  });

  it("fills the card from the host's words and the wedding's date and venue", () => {
    const copy = draftCopy(complete());
    expect(copy.first).toBe("Aditya");
    expect(copy.second).toBe("Priya");
    expect(copy.date).toBe("Sunday, 14 February 2027");
    expect(copy.venue).toBe("Taj Falaknuma, Hyderabad");
    // Untouched lines keep the design's wording
    expect(copy.families).toBe("With joy in their hearts");
  });

  it("shows the design's sample until the host writes something", () => {
    const copy = draftCopy(newDraft("marigold"));
    expect(copy.first).toBe("Aarav");
    expect(copy.date).toBe("Saturday, 12 December 2026");
  });

  it("puts the first planned function on the card when there is no wedding", () => {
    const draft = complete();
    draft.functions.wedding.included = false;
    draft.functions.sangeet = { ...draft.functions.sangeet, included: true, venue: "The Lawns" };
    expect(mainFunction(draft)).toBe("sangeet");
    expect(draftCopy(draft).venue).toBe("The Lawns");
  });

  it("asks for names before leaving the couple step", () => {
    expect(stepErrors(newDraft(), "couple")).toEqual({ first: "required", second: "required" });
    expect(stepErrors(complete(), "couple")).toEqual({});
  });

  it("needs at least one function, each with a date, time and venue", () => {
    const draft = newDraft();
    expect(stepErrors(draft, "functions")).toEqual({
      "wedding.date": "required",
      "wedding.time": "required",
      "wedding.venue": "required",
    });
    draft.functions.wedding.included = false;
    expect(stepErrors(draft, "functions")).toEqual({ functions: "no-functions" });
    expect(stepErrors(complete(), "functions")).toEqual({});
  });

  it("lists the steps still to finish", () => {
    expect(draftProblems(newDraft()).map((problem) => problem.step)).toEqual([
      "couple",
      "functions",
    ]);
    expect(draftProblems(complete())).toEqual([]);
  });

  it("plays the chosen raga at its own tempo", () => {
    const draft = complete();
    expect(draftTemplate(draft).music).toEqual({ raga: "khamaj" });
    draft.music.raga = "bhupali";
    expect(draftTemplate(draft).music).toEqual({ raga: "bhupali" });
  });

  it("round-trips through JSON and repairs damaged fields one by one", () => {
    const draft = complete();
    expect(parseDraft(JSON.parse(JSON.stringify(draft)))).toEqual(draft);
    const damaged = parseDraft({
      ...draft,
      templateId: "neon",
      step: 7,
      functions: { ...draft.functions, haldi: { included: "yes", date: "soon" } },
    });
    expect(damaged?.templateId).toBe("marigold");
    expect(damaged?.step).toBe("design");
    expect(damaged?.functions.haldi.included).toBe(false);
    expect(damaged?.functions.haldi.date).toBe("");
    expect(damaged?.functions.wedding.venue).toBe("Taj Falaknuma, Hyderabad");
    expect(parseDraft({ version: 2 })).toBeNull();
  });
});
