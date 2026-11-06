import { describe, expect, it } from "vitest";
import { publishText } from "@/i18n/copy/publish";
import { newDraft, type InviteDraft } from "@/lib/editor/draft";
import { calendarEntries, inviteLanguage, inviteWhen, occasionName } from "./describe";

/*
 * What a guest gets around the card (the link's preview, the message it is sent with, the
 * calendar entries) speaks the card's language, not the host's site language.
 */

function wedding(languages: InviteDraft["languages"]): InviteDraft {
  const draft = newDraft();
  return {
    ...draft,
    languages,
    functions: {
      ...draft.functions,
      wedding: { ...draft.functions.wedding, included: true, date: "2026-12-12", time: "18:30" },
    },
  };
}

describe("the invitation's words for guests", () => {
  it("follows the card's first language", () => {
    expect(inviteLanguage(wedding(["gu"]))).toBe("gu");
    expect(inviteLanguage(wedding(["hi", "en"]))).toBe("hi");
    expect(inviteLanguage(wedding([]))).toBe("en");
  });

  it("dates a Gujarati card the Gujarati way, with no English pm", () => {
    const when = inviteWhen(wedding(["gu"]), "gu");
    expect(when).toContain("ડિસેમ્બર");
    expect(when).toContain("સાંજે");
    expect(when).not.toMatch(/[A-Za-z]/);
  });

  it("dates a Hindi card in Hindi", () => {
    const when = inviteWhen(wedding(["hi"]), "hi");
    expect(when).toContain("दिसंबर");
    expect(when).toContain("शाम");
    expect(when).not.toMatch(/[A-Za-z]/);
  });

  it("titles a Gujarati card's link preview in Gujarati", () => {
    const draft = wedding(["gu"]);
    const language = inviteLanguage(draft);
    const title = publishText[language].guestCopy.metaTitle(
      "આરવ & મીરા",
      occasionName(draft, language),
    );
    expect(title).not.toMatch(/[A-Za-z]/);
  });

  it("names each function in a guest's calendar as the card does", () => {
    const draft = wedding(["gu"]);
    const [entry] = calendarEntries(draft, { id: "x", url: "https://example.com" }, "gu");
    expect(entry!.title.split(" · ")[0]).not.toMatch(/[A-Za-z]/);
  });
});
