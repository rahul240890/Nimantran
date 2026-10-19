import { describe, expect, it } from "vitest";
import { toImportRows } from "./import";
import { pdfPages, readingPrompt, readingSchema, readingSources, textPages } from "./read-list";

describe("guests read by AI", () => {
  const reading = readingSchema.parse({
    problem: "none",
    guests: [
      {
        name: " रमेश  भाई ",
        phone: "98250 12345",
        group: "Mama paksh",
        people: 4,
        unsureName: false,
        unsurePhone: false,
      },
      {
        name: "Geeta ben",
        phone: "9825?12345",
        group: "",
        people: 1,
        unsureName: true,
        unsurePhone: false,
      },
      { name: "", phone: "", group: "", people: 1, unsureName: false, unsurePhone: false },
    ],
  });

  it("become import sources marked with their page, keeping the script they were written in", () => {
    const sources = readingSources(reading, 3);
    expect(sources).toHaveLength(2);
    expect(sources[0]).toMatchObject({
      name: "रमेश भाई",
      group: "Mama paksh",
      partySize: 4,
      page: 3,
    });
    expect(sources[0]!.unsure).toBeUndefined();
    // A "?" in the number means a digit it couldn't read, whatever the flag says
    expect(sources[1]!.unsure).toEqual(["name", "phone"]);
  });

  it("never turn an unreadable number into a real one", () => {
    const rows = toImportRows(readingSources(reading, 1), []);
    expect(rows[0]).toMatchObject({ phone: "+919825012345", error: null, unsure: false });
    expect(rows[1]).toMatchObject({ phone: null, error: "phone", unsure: true });
  });

  it("asks for English letters only when the host wants them", () => {
    expect(readingPrompt({ english: true })).toContain("English letters");
    expect(readingPrompt({ english: false })).toContain("script it was written in");
    expect(readingPrompt({ english: false, text: "Dadi" })).toContain("<list>\nDadi\n</list>");
  });
});

describe("counting pages", () => {
  it("counts a PDF's pages, not its page tree", () => {
    const pdf = new TextEncoder().encode(
      "<< /Type /Pages /Kids [1 0 R 2 0 R] >> << /Type /Page >> << /Type/Page /Parent 3 0 R >>",
    );
    expect(pdfPages(pdf)).toBe(2);
    expect(pdfPages(new Uint8Array())).toBe(1);
  });

  it("counts long text as more than one page", () => {
    expect(textPages("short")).toBe(1);
    expect(textPages("x".repeat(13000))).toBe(3);
  });
});
