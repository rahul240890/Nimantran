import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * The "Stop these reminders" link: the account id, signed so nobody can opt someone else
 * out. Signed with the service role key, which only the server holds.
 */

const sign = (secret: string, userId: string) =>
  createHmac("sha256", secret).update(`email-stop:${userId}`).digest("base64url");

export function stopToken(secret: string, userId: string): string {
  return sign(secret, userId);
}

export function stopTokenValid(secret: string, userId: string, token: string): boolean {
  const wanted = Buffer.from(sign(secret, userId));
  const given = Buffer.from(token);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

export function stopUrl(siteUrl: string, secret: string, userId: string): string {
  const params = new URLSearchParams({ u: userId, t: stopToken(secret, userId) });
  return `${siteUrl.replace(/\/$/, "")}/emails/stop?${params}`;
}
