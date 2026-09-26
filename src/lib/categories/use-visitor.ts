"use client";

import { useSyncExternalStore } from "react";
import { parseMonth, parseRegion, type RankContext } from "./rank";
import { REGION_COOKIE } from "./regions";

const SERVER: RankContext = { month: null, region: null };
let cached: { key: string; value: RankContext } | null = null;

function read(): RankContext {
  const params = new URLSearchParams(window.location.search);
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${REGION_COOKIE}=`))
    ?.slice(REGION_COOKIE.length + 1);
  // ?region= and ?month= preview another place or time, for review and tests
  const region = parseRegion(params.get("region")) ?? parseRegion(cookie);
  const month = parseMonth(params.get("month")) ?? new Date().getMonth() + 1;
  const key = `${region}-${month}`;
  if (cached?.key !== key) cached = { key, value: { region, month } };
  return cached.value;
}

const subscribe = () => () => {};

/**
 * Where and when the visitor is, for ordering categories. The server doesn't know, so it
 * renders the base order and the browser reorders right after hydration.
 */
export function useVisitor(): RankContext {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}
