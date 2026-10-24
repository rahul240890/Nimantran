"use client";

import { useEffect, useState } from "react";
import type { Trust } from "@/lib/reviews/trust";

/*
 * Invitations sent and approved reviews (lib/reviews/trust.ts), asked from /api/trust once
 * per visit however many places show them, so static pages never wait for them.
 */

let asked: Promise<Trust | null> | null = null;
let known: Trust | null = null;

function ask(): Promise<Trust | null> {
  asked ??= fetch("/api/trust")
    .then((response) => (response.ok ? (response.json() as Promise<Trust>) : null))
    .then((body) => {
      known = body && Array.isArray(body.reviews) ? body : null;
      return known;
    })
    .catch(() => null);
  return asked;
}

/** Null until it arrives, or when there is nothing to say. */
export function useTrust(): Trust | null {
  const [trust, setTrust] = useState(known);
  useEffect(() => {
    let live = true;
    void ask().then((value) => live && setTrust(value));
    return () => {
      live = false;
    };
  }, []);
  return trust;
}
