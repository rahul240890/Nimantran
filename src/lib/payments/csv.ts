/*
 * Spreadsheet files (RFC 4180): a cell with a comma, quote or line break is quoted. Cells
 * hold names hosts type, so one starting like a formula (=, +, -, @) is opened as text,
 * never run by the spreadsheet.
 */

export function csvCell(value: string | number | null | undefined): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Rows to a CSV file, with a byte order mark so Excel reads Hindi and ₹ correctly. */
export function toCsv(rows: readonly (readonly (string | number | null | undefined)[])[]): string {
  return `﻿${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

/** Paise as rupees for a spreadsheet: 49900 is "499.00". */
export const rupeesCell = (paise: number) => (paise / 100).toFixed(2);
