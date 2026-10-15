import { describe, expect, it } from "vitest";
import { csvCell, rupeesCell, toCsv } from "./csv";

describe("payment CSV", () => {
  it("quotes only cells that need it", () => {
    expect(csvCell("Basic")).toBe("Basic");
    expect(csvCell("Aarav, Meera")).toBe('"Aarav, Meera"');
    expect(csvCell('The "big" day')).toBe('"The ""big"" day"');
    expect(csvCell(null)).toBe("");
    expect(csvCell(12)).toBe("12");
  });

  it("never lets a name run as a formula", () => {
    expect(csvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(csvCell("+91 98765")).toBe("'+91 98765");
    expect(csvCell("@me")).toBe("'@me");
  });

  it("writes rows with a byte order mark and rupees with paise", () => {
    expect(
      toCsv([
        ["a", "b"],
        [1, "c,d"],
      ]),
    ).toBe('﻿a,b\r\n1,"c,d"\r\n');
    expect(rupeesCell(49_900)).toBe("499.00");
    expect(rupeesCell(63_920)).toBe("639.20");
  });
});
