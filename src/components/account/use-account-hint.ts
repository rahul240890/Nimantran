"use client";

import { useSyncExternalStore } from "react";
import { ACCOUNT_HINT_COOKIE, decodeAccountHint, type AccountHint } from "@/lib/auth/hint";

let cached: { raw: string | undefined; value: AccountHint | null } | null = null;
const listeners = new Set<() => void>();

function read(): AccountHint | null {
  const raw = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${ACCOUNT_HINT_COOKIE}=`))
    ?.slice(ACCOUNT_HINT_COOKIE.length + 1);
  if (cached && cached.raw === raw) return cached.value;
  const value = decodeAccountHint(raw);
  cached = { raw, value };
  return value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab signing in or out shows up when this one comes back into view
  const onFocus = () => listener();
  window.addEventListener("focus", onFocus);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("focus", onFocus);
  };
}

/** Re-reads the cookie after signing in or out in this tab. */
export function refreshAccountHint() {
  for (const listener of listeners) listener();
}

/**
 * Who is signed in, from the hint cookie (lib/auth/hint.ts). Null on the server and while
 * hydrating, so pages render the signed-out header first and swap in the menu.
 */
export function useAccountHint(): AccountHint | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
