import { describe, expect, it } from "vitest";
import {
  ceremonyName,
  cardLanguages,
  draftCopy,
  draftTemplate,
  functionOrder,
  includedFunctions,
  mainFunction,
  muhuratName,
  newDraft,
  withCategory,
  withGalleryChoice,
  type InviteDraft,
} from "./draft";
import { CATEGORIES } from "@/lib/categories/catalog";
import { draftProblems, parseDraft, stepErrors } from "./draft-checks";

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
    expect(functionOrder(mehendi).more).toEqual([
      "roka",
      "engagement",
      "tilak",
      "ganesh-puja",
      "grah-shanti",
      "mandap",
      "mameru",
      "garba",
      "bhoj",
      "baraat",
      "baraat-welcome",
      "wedding",
      "vidaai",
      "reception",
    ]);
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

describe("tradition packs", () => {
  const withTradition = (tradition: Partial<InviteDraft["tradition"]>): InviteDraft => {
    const draft = complete();
    return { ...draft, tradition: { ...draft.tradition, ...tradition } };
  };

  it("draw nothing extra until a tradition is chosen", () => {
    const copy = draftCopy(complete());
    expect(copy.symbol).toBeNull();
    expect(copy.blessing).toBe("");
  });

  it("put the invocation and the pack's symbol on the card", () => {
    const copy = draftCopy(withTradition({ id: "marathi" }));
    expect(copy.blessing).toBe("॥ श्री गणेशाय नमः ॥");
    expect(copy.symbol).toBe("kalash");
    expect(copy.doors).toEqual(["Shubh", "Mangal"]);
    // A Marathi card writes its gates in Marathi
    expect(draftCopy({ ...withTradition({ id: "marathi" }), languages: ["mr"] }).doors).toEqual([
      "शुभ",
      "मंगल",
    ]);
  });

  it("follow the family's choices", () => {
    expect(draftCopy(withTradition({ id: "bengali", invocation: "latin" })).blessing).toBe(
      "Prajapataye Namah",
    );
    expect(draftCopy(withTradition({ id: "bengali", invocation: "off" })).blessing).toBe("");
    expect(draftCopy(withTradition({ id: "tamil", symbol: "none" })).symbol).toBeNull();
    expect(draftCopy(withTradition({ id: "tamil", symbol: "diya" })).symbol).toBe("diya");
    // A symbol the pack doesn't offer falls back to its own
    expect(draftCopy(withTradition({ id: "bengali", symbol: "swastik" })).symbol).toBe("prajapati");
  });

  it("never replace words the family typed", () => {
    const draft = withTradition({ id: "north-hindu" });
    const copy = draftCopy({ ...draft, content: { ...draft.content, blessing: "Om Shanti" } });
    expect(copy.blessing).toBe("Om Shanti");
  });

  it("show no symbol or invocation for Modern", () => {
    const copy = draftCopy(withTradition({ id: "modern" }));
    expect(copy.symbol).toBeNull();
    expect(copy.blessing).toBe("");
  });

  it("list a wedding's regional functions first, in the order they happen", () => {
    const gujarati = withTradition({ id: "gujarati" });
    const { suggested, more } = functionOrder(gujarati);
    expect(suggested).toEqual([
      "ganesh-puja",
      "grah-shanti",
      "mandap",
      "mameru",
      "haldi",
      "mehendi",
      "sangeet",
      "garba",
      "bhoj",
      "baraat",
      "baraat-welcome",
      "wedding",
      "vidaai",
      "reception",
    ]);
    expect(more).toEqual(["roka", "engagement", "tilak"]);
    expect(ceremonyName(gujarati, "baraat")?.latin).toBe("Jaan Prasthan");
    expect(ceremonyName(gujarati, "baraat-welcome")?.latin).toBe("Jaan Aagman");
    // Other occasions keep their own short list
    expect(functionOrder(withCategory(gujarati, "mehendi")).suggested).toEqual([
      "haldi",
      "mehendi",
      "sangeet",
    ]);
  });

  it("read old drafts without a tradition", () => {
    const old: Partial<InviteDraft> = complete();
    delete old.tradition;
    expect(parseDraft(old)?.tradition).toEqual(newDraft().tradition);
    expect(parseDraft({ ...complete(), tradition: { id: "gone", symbol: 4 } })?.tradition.id).toBe(
      null,
    );
  });
});

describe("two-language cards", () => {
  const tamil = (languages: InviteDraft["languages"]): InviteDraft => {
    const draft = complete();
    return {
      ...draft,
      tradition: { ...draft.tradition, id: "tamil" },
      languages,
      content: { first: "ஆதித்யா", second: "பிரியா" },
      translation: { first: "Aditya" },
    };
  };

  it("offer the tradition's language and English, or English and Hindi", () => {
    expect(cardLanguages(tamil(["ta", "en"]))).toEqual(["ta", "en"]);
    expect(cardLanguages(complete())).toEqual(["en"]);
    expect(cardLanguages({ ...complete(), languages: ["hi", "en"] })).toEqual(["hi", "en"]);
    // A language the tradition doesn't offer falls away
    expect(cardLanguages({ ...tamil(["mr", "en"]) })).toEqual(["en"]);
    expect(cardLanguages({ ...tamil(["mr"]) })).toEqual(["en"]);
  });

  it("draw each language's own words, repeating the main card's where left empty", () => {
    const draft = tamil(["ta", "en"]);
    const main = draftCopy(draft);
    expect(main.first).toBe("ஆதித்யா");
    expect(main.blessing).toBe("ஸ்ரீ விநாயகர் துணை");
    expect(main.date).toBe("ஞாயிறு, 14 பிப்ரவரி 2027");
    const english = draftCopy(draft, "en");
    expect(english.first).toBe("Aditya");
    expect(english.second).toBe("பிரியா");
    expect(english.blessing).toBe("Sri Vinayagar Thunai");
    expect(english.date).toBe("Sunday, 14 February 2027");
    expect(english.symbol).toBe(main.symbol);
  });

  it("write the invocation in script when the second language is the tradition's", () => {
    const draft = {
      ...tamil(["en", "ta"]),
      tradition: { ...tamil([]).tradition, invocation: "latin" as const },
    };
    expect(draftCopy(draft).blessing).toBe("Sri Vinayagar Thunai");
    expect(draftCopy(draft, "ta").blessing).toBe("ஸ்ரீ விநாயகர் துணை");
    const off = { ...draft, tradition: { ...draft.tradition, invocation: "off" as const } };
    expect(draftCopy(off, "ta").blessing).toBe("");
  });

  it("write dates in Marathi", () => {
    const draft = {
      ...complete(),
      tradition: { ...complete().tradition, id: "marathi" as const },
      languages: ["mr" as const],
    };
    expect(draftCopy(draft).date).toBe("रविवार, 14 फेब्रुवारी 2027");
  });

  it("read old drafts as English only", () => {
    const old: Partial<InviteDraft> = complete();
    delete old.languages;
    delete old.translation;
    const draft = parseDraft(old)!;
    expect(draft.languages).toEqual(["en"]);
    expect(draft.translation).toEqual({});
    expect(parseDraft({ ...complete(), languages: ["en", "en"] })?.languages).toEqual(["en"]);
  });
});

describe("muhurat", () => {
  it("names the wedding's auspicious time in the tradition's words", () => {
    const draft = { ...complete(), tradition: { ...complete().tradition, id: "bengali" as const } };
    expect(muhuratName(draft, "wedding")?.native).toBe("শুভ লগ্ন");
    expect(muhuratName(draft, "sangeet")).toBeNull();
    expect(muhuratName(complete(), "wedding")).toBeNull();
  });

  it("keeps end times and reads bad ones as empty", () => {
    const draft = complete();
    const withEnd = {
      ...draft,
      functions: { ...draft.functions, wedding: { ...draft.functions.wedding, endTime: "10:31" } },
    };
    expect(parseDraft(withEnd)?.functions.wedding.endTime).toBe("10:31");
    const bad = {
      ...draft,
      functions: { ...draft.functions, wedding: { ...draft.functions.wedding, endTime: "25:00" } },
    };
    expect(parseDraft(bad)?.functions.wedding.endTime).toBe("");
  });
});

describe("designs that suit the occasion", () => {
  it("drops a wedding theme and card when the occasion becomes a birthday", () => {
    const wedding = { ...newDraft("paithani"), suite: "peshwai-wada" as const };
    const birthday = withCategory(wedding, "birthday");
    expect(birthday.suite).toBeNull();
    expect(birthday.templateId).toBe(CATEGORIES.birthday.templates[0]);
    // A choice that suits the new occasion stays
    const haldi = withCategory({ ...newDraft("marigold"), suite: "kayal" }, "haldi");
    expect(haldi.suite).toBe("kayal");
    expect(haldi.templateId).toBe("marigold");
  });

  it("opens a theme on an occasion it is painted for", () => {
    const draft = withGalleryChoice(newDraft(), {
      category: "party",
      tradition: null,
      suite: "rajwada-bagh",
      template: null,
    });
    expect(draft.categoryId).toBe("wedding");
    expect(draft.suite).toBe("rajwada-bagh");
  });
});
