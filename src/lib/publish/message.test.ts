import { describe, expect, it } from "vitest";
import { shareCopy } from "@/content/publish";
import { shareCopy as hiShareCopy } from "@/content/hi/publish";
import { chatLines, chatSegments, detailLines, withLink } from "./message";

const invite = {
  names: "Aarav & Meera",
  occasion: "Wedding",
  when: "Thursday, 15 October 2026 · 6:30 PM",
  where: "Taj Falaknuma, Hyderabad",
};

describe("the WhatsApp message", () => {
  it("spaces the greeting, names, details and ask apart", () => {
    expect(shareCopy.message(invite)).toBe(
      [
        "✨ *You're warmly invited* ✨",
        "",
        "to the wedding of",
        "*Aarav & Meera*",
        "",
        "━━━━━━━━━━━━",
        "🗓️ Thursday, 15 October 2026 · 6:30 PM",
        "📍 Taj Falaknuma, Hyderabad",
        "━━━━━━━━━━━━",
        "",
        "Please open your invitation and let us know if you can come 🙏",
      ].join("\n"),
    );
  });

  it("drops the rules when there is no date or place yet", () => {
    const message = shareCopy.message({ ...invite, when: "", where: "" });
    expect(message).not.toContain("━");
    expect(message).not.toMatch(/\n\n\n/);
    expect(message).toContain("*Aarav & Meera*\n\nPlease open");
  });

  it("reads naturally in Hindi", () => {
    const message = hiShareCopy.message({ ...invite, occasion: "विवाह" });
    expect(message).toContain("*Aarav & Meera* के विवाह में\nआप सादर आमंत्रित हैं।");
    expect(message).toContain("📍 Taj Falaknuma, Hyderabad");
  });

  it("puts the link on its own line after a blank one", () => {
    expect(withLink("Hello\n", "https://x.in/i/a")).toBe("Hello\n\nhttps://x.in/i/a");
    expect(withLink("  ", "https://x.in/i/a")).toBe("https://x.in/i/a");
  });

  it("never doubles a blank line or leaves one at the ends", () => {
    expect(chatLines(["", "a", "", "", "b", ""])).toBe("a\n\nb");
    expect(detailLines("", "")).toEqual([]);
  });
});

describe("chat formatting", () => {
  it("finds bold, italic, struck words and links", () => {
    expect(chatSegments("*Aarav* and _Meera_ ~no~ https://x.in/i/a_b")).toEqual([
      { text: "Aarav", style: "bold" },
      { text: " and " },
      { text: "Meera", style: "italic" },
      { text: " " },
      { text: "no", style: "strike" },
      { text: " " },
      { text: "https://x.in/i/a_b", style: "link" },
    ]);
  });

  it("leaves stars that don't hug words alone", () => {
    expect(chatSegments("5 * 3 = 15 *")).toEqual([{ text: "5 * 3 = 15 *" }]);
  });
});
