/*
 * GST sums for invoices. Prices include 18% GST (docs/PRICING.md), so the taxable value is
 * the price divided by 1.18. With no buyer address on record, the place of supply is the
 * seller's state, so the tax is split into CGST and SGST at 9% each.
 */

export const GST_RATE = 18;

/** The Indian financial year a date falls in, as invoices number it: "2026-27". */
export function financialYear(date: Date): string {
  // Invoices are dated in India
  const ist = new Date(date.getTime() + 330 * 60_000);
  const year = ist.getUTCFullYear();
  const start = ist.getUTCMonth() >= 3 ? year : year - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

export const invoiceNumber = (date: Date, n: number) =>
  `SHUBH/${financialYear(date)}/${String(n).padStart(5, "0")}`;

export type GstSplit = { taxablePaise: number; cgstPaise: number; sgstPaise: number };

export function gstSplit(amountPaise: number): GstSplit {
  const taxablePaise = Math.round((amountPaise * 100) / (100 + GST_RATE));
  const tax = amountPaise - taxablePaise;
  const cgstPaise = Math.floor(tax / 2);
  return { taxablePaise, cgstPaise, sgstPaise: tax - cgstPaise };
}
