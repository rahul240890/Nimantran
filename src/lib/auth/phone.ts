/*
 * Phone numbers for sign-in. Families type numbers every way ("98765 43210", "+91-98765-43210",
 * "098765 43210"); we keep one form, E.164 (+919876543210), and show it grouped.
 */

export type PhoneError = "required" | "invalid";

/** Indian mobiles are 10 digits starting 6 to 9. Other countries: 8 to 15 digits in all. */
export function normalizePhone(input: string): { phone: string } | { error: PhoneError } {
  const trimmed = input.trim();
  if (!trimmed) return { error: "required" };
  if (/[^\d\s()+.-]/.test(trimmed)) return { error: "invalid" };
  const international = trimmed.startsWith("+") || trimmed.startsWith("00");
  let digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("00")) digits = digits.slice(2);

  if (!international) {
    // A leading 0 is the trunk prefix people add out of habit
    const local = digits.replace(/^0/, "");
    if (/^[6-9]\d{9}$/.test(local)) return { phone: `+91${local}` };
    if (/^91[6-9]\d{9}$/.test(digits)) return { phone: `+${digits}` };
    return { error: "invalid" };
  }
  if (digits.startsWith("91")) {
    return /^91[6-9]\d{9}$/.test(digits) ? { phone: `+${digits}` } : { error: "invalid" };
  }
  return /^[1-9]\d{7,14}$/.test(digits) ? { phone: `+${digits}` } : { error: "invalid" };
}

/** "+91 98765 43210" for Indian numbers; other numbers as stored. */
export function formatPhone(phone: string): string {
  const match = /^\+91(\d{5})(\d{5})$/.exec(phone);
  return match ? `+91 ${match[1]} ${match[2]}` : phone;
}

/** "+91 ••••• •3210", for saying where a code went without showing the whole number. */
export function maskPhone(phone: string): string {
  const shown = formatPhone(phone);
  const prefix = shown.startsWith("+91 ") ? "+91 " : shown.slice(0, 3);
  const rest = shown.slice(prefix.length);
  let digitsLeft = rest.replace(/\D/g, "").length;
  return prefix + rest.replace(/\d/g, (digit) => (digitsLeft-- > 4 ? "•" : digit));
}

export const OTP_LENGTH = 6;

export function isOtp(value: string): boolean {
  return new RegExp(`^\\d{${OTP_LENGTH}}$`).test(value);
}
