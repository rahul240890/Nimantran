import { describe, expect, it } from "vitest";
import { financialYear, gstSplit, invoiceNumber } from "./invoice";

describe("invoices", () => {
  it("number by India's financial year, April to March", () => {
    expect(financialYear(new Date("2026-03-31T12:00:00+05:30"))).toBe("2025-26");
    // Just past midnight on 1 April in India is still 31 March in UTC
    expect(financialYear(new Date("2026-04-01T00:10:00+05:30"))).toBe("2026-27");
    expect(financialYear(new Date("2099-12-01T00:00:00+05:30"))).toBe("2099-00");
    expect(invoiceNumber(new Date("2026-10-20T00:00:00+05:30"), 7)).toBe("SHUBH/2026-27/00007");
  });

  it("split GST out of prices that include it", () => {
    expect(gstSplit(49_900)).toEqual({ taxablePaise: 42_288, cgstPaise: 3_806, sgstPaise: 3_806 });
    for (const amount of [100, 49_900, 1_99_900, 2_99_900, 37_425]) {
      const split = gstSplit(amount);
      expect(split.taxablePaise + split.cgstPaise + split.sgstPaise).toBe(amount);
    }
  });
});
