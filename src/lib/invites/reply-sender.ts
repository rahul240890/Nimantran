import "server-only";
import { createHmac } from "node:crypto";
import { isIPv4, isIPv6 } from "node:net";
import { headers } from "next/headers";
import { authMode } from "@/lib/auth/mode";

/*
 * Where a guest's reply came from, for the database's limit on new guests per network
 * (migration 20261017090000_reply_limits.sql). Only a keyed hash leaves this file, never
 * the address, and the hash differs per invitation, so it can't follow anyone between them.
 */

/** An IPv6 address cut to its first 64 bits: one home or phone, however it rotates the rest. */
function ipv6Network(address: string): string | null {
  const [head = "", tail] = address.toLowerCase().split("::");
  const front = head ? head.split(":") : [];
  const back = tail ? tail.split(":") : [];
  const groups =
    tail === undefined
      ? front
      : [...front, ...Array(8 - front.length - back.length).fill("0"), ...back];
  if (groups.length !== 8) return null;
  return groups
    .slice(0, 4)
    .map((group) => group.replace(/^0+(?=.)/, ""))
    .join(":");
}

/**
 * The network a request came from, as Vercel reports it (it overwrites these headers, so
 * they can't be faked): an IPv4 address, or an IPv6 address's /64. Null when unknown.
 */
export function networkOf(list: Pick<Headers, "get">): string | null {
  const raw = (list.get("x-real-ip") ?? list.get("x-forwarded-for")?.split(",")[0] ?? "").trim();
  const mapped = raw.toLowerCase().startsWith("::ffff:") ? raw.slice(7) : raw;
  if (isIPv4(mapped)) return mapped;
  if (isIPv6(mapped)) return ipv6Network(mapped);
  return null;
}

/** A keyed hash of the network, per invitation; null when there's no network or key. */
export function senderHash(slug: string, network: string | null, key: string | undefined) {
  if (!network || !key) return null;
  return createHmac("sha256", key).update(`reply:${slug}:${network}`).digest("base64url");
}

/** The sender the database counts this request's new replies under. */
export async function replySender(slug: string): Promise<string | null> {
  const key = authMode() === "preview" ? "preview" : process.env.SUPABASE_SERVICE_ROLE_KEY;
  return senderHash(slug, networkOf(await headers()), key);
}
