"use client";

import { useEffect, useState } from "react";
import { loadReply } from "@/actions/rsvp";
import type { GuestReply } from "@/lib/invites/rsvp";

const STORAGE_PREFIX = "shubhdwar-rsvp:";

/** The token this device holds for an invitation, from an earlier reply. */
export function storedToken(slug: string): string | null {
  try {
    return localStorage.getItem(STORAGE_PREFIX + slug);
  } catch {
    return null;
  }
}

export function storeToken(slug: string, token: string) {
  try {
    localStorage.setItem(STORAGE_PREFIX + slug, token);
  } catch {
    // Storage blocked: the reply is saved; changing it later needs the same page open
  }
}

/** The guest's token: their personal link (?g=) first, else an earlier reply on this device. */
export function knownToken(slug: string): string | null {
  return new URLSearchParams(window.location.search).get("g") ?? storedToken(slug);
}

// One lookup per page, shared by the greeting on the first screen and the reply form
const lookups = new Map<string, Promise<GuestReply | null>>();

export function guestReply(slug: string, token: string): Promise<GuestReply | null> {
  const key = `${slug}\n${token}`;
  let lookup = lookups.get(key);
  if (!lookup) {
    lookup = loadReply(slug, token).catch(() => null);
    lookups.set(key, lookup);
  }
  return lookup;
}

/**
 * The guest's name when they came by their personal link (or replied before on this
 * device), so the first screen can greet them before the invitation opens.
 */
export function useGuestName(slug: string): string | null {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const token = knownToken(slug);
    if (!token) return;
    let cancelled = false;
    void guestReply(slug, token).then((reply) => {
      if (!cancelled && reply?.name.trim()) setName(reply.name.trim());
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);
  return name;
}
