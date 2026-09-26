import { describe, expect, it } from "vitest";
import {
  draftCopy,
  draftProblems,
  draftTemplate,
  functionOrder,
  includedFunctions,
  mainFunction,
  newDraft,
  withCategory,
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
    expect(damaged?.step).toBe("occasion");
    expect(damaged?.functions.haldi.included).toBe(false);
    expect(damaged?.functions.haldi.date).toBe("");
    expect(damaged?.functions.wedding.venue).toBe("Taj Falaknuma, Hyderabad");
    expect(parseDraft({ version: 2 })).toBeNull();
  });

  it("reads drafts saved before occasions existed as weddings", () => {
    const old: Partial<InviteDraft> = { ...complete(), step: "design" };
    delete old.categoryId;
    const draft = parseDraft(old);
    expect(draft?.categoryId).toBe("wedding");
    expect(draft?.step).toBe("design");
    expect(draft?.functions.roka.included).toBe(false);
    expect(draft?.functions.wedding.venue).toBe("Taj Falaknuma, Hyderabad");
  });

  it("plans the occasion's functions and keeps everything already typed", () => {
    const roka = withCategory(complete(), "roka");
    expect(includedFunctions(roka)).toEqual(["roka"]);
    expect(mainFunction(roka)).toBe("roka");
    // The wedding's details survive, ready if the host switches back
    expect(roka.functions.wedding.venue).toBe("Taj Falaknuma, Hyderabad");
    expect(roka.content.first).toBe("Aditya");
    const back = withCategory(roka, "wedding");
    expect(includedFunctions(back)).toEqual(["wedding"]);
    expect(draftCopy(back).venue).toBe("Taj Falaknuma, Hyderabad");
  });

  it("lists the occasion's own functions first", () => {
    const mehendi = withCategory(newDraft(), "mehendi");
    expect(functionOrder(mehendi).suggested).toEqual(["haldi", "mehendi", "sangeet"]);
    expect(functionOrder(mehendi).more).toEqual(["roka", "engagement", "wedding", "reception"]);
    // A save-the-date announces the wedding and nothing else
    expect(functionOrder(withCategory(newDraft(), "save-the-date"))).toEqual({
      suggested: ["wedding"],
      more: [],
    });
  });

  it("uses the occasion's wording until the host writes their own", () => {
    const sangeet = withCategory(complete(), "sangeet");
    expect(draftCopy(sangeet).line).toBe("invite you to an evening of music and dance");
    expect(draftCopy(sangeet).doors).toEqual(["Sangeet", "Sandhya"]);
    const written = { ...sangeet, content: { ...sangeet.content, line: "come and dance" } };
    expect(draftCopy(written).line).toBe("come and dance");
    // A wedding keeps each design's own voice
    expect(draftCopy(complete()).line).toBe(
      "would love you to join them as they begin their life together",
    );
  });

  it("asks a save-the-date for a date and a city, not a time", () => {
    const base = withCategory(complete(), "save-the-date");
    const draft = {
      ...base,
      functions: { ...base.functions, wedding: { ...base.functions.wedding, time: "" } },
    };
    expect(stepErrors(draft, "functions")).toEqual({});
    const wedding = withCategory(draft, "wedding");
    expect(stepErrors(wedding, "functions")).toEqual({ "wedding.time": "required" });
  });

  it("puts the roka's date on a roka card even when the wedding is planned too", () => {
    const base = withCategory(complete(), "roka");
    const draft = {
      ...base,
      functions: {
        ...base.functions,
        roka: {
          ...base.functions.roka,
          date: "2026-11-02",
          time: "11:00",
          venue: "Home, Amritsar",
        },
        wedding: { ...base.functions.wedding, included: true },
      },
    };
    expect(mainFunction(draft)).toBe("roka");
    expect(draftCopy(draft).venue).toBe("Home, Amritsar");
    expect(draftCopy(draft).date).toBe("Monday, 2 November 2026");
  });
});
