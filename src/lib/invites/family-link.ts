import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { authMode } from "@/lib/auth/mode";

/*
 * Family preview links (owner, 2026-10-24: a wedding is decided together). A host sends
 * /family/<invite>.<signature> on WhatsApp before paying; whoever has it sees the invitation
 * as guests will, marked as a preview, with replies switched off. The signature is the
 * permission, so nothing is stored: it is made with the server's own secret, and a link
 * that was changed by even one letter opens nothing.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
/** 16 bytes of the signature, as 22 URL-safe letters. */
const SIGNATURE_LENGTH = 22;

/** The server's secret: its own if set, else derived from the database's server key. */
function secret(): string | null {
  const own = process.env.FAMILY_LINK_SECRET?.trim();
  if (own) return own;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (service) return `family-links:${service}`;
  return authMode() === "preview" ? "preview-family-links" : null;
}

function sign(eventId: string, key: string): string {
  return createHmac("sha256", key)
    .update(`family:${eventId}`)
    .digest("base64url")
    .slice(0, SIGNATURE_LENGTH);
}

/** The link's last part for an invite, or null when the server has no secret to sign with. */
export function familyToken(eventId: string): string | null {
  const key = secret();
  if (!key || !UUID.test(eventId)) return null;
  return `${eventId}.${sign(eventId, key)}`;
}

/** The invite a link opens, or null for a link that wasn't made by this server. */
export function readFamilyToken(token: string): string | null {
  const key = secret();
  const [eventId, signature, ...rest] = token.split(".");
  if (!key || rest.length || !eventId || !signature || !UUID.test(eventId)) return null;
  const expected = Buffer.from(sign(eventId, key));
  const given = Buffer.from(signature);
  return given.length === expected.length && timingSafeEqual(given, expected) ? eventId : null;
}
