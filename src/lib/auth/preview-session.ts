import type { Account } from "./account";

/*
 * Preview mode's session: the account, signed with HMAC so it can't be edited in the
 * browser, in an http-only cookie. Uses Web Crypto so the proxy and the server share it.
 */

export const PREVIEW_COOKIE = "nimantran-preview-session";

const encoder = new TextEncoder();

function secret(): string {
  return process.env.NIMANTRAN_AUTH_PREVIEW_SECRET || "nimantran-preview-only-not-for-production";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toBase64Url(
    new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))),
  );
}

export async function sealPreviewSession(account: Account): Promise<string> {
  const payload = toBase64Url(encoder.encode(JSON.stringify(account)));
  return `${payload}.${await sign(payload)}`;
}

export async function openPreviewSession(value: string | undefined): Promise<Account | null> {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = await sign(payload);
  // Compare without stopping at the first difference
  if (expected.length !== signature.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++)
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    return JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Account;
  } catch {
    return null;
  }
}
