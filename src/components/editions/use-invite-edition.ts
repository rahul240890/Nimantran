"use client";

import { useEffect, useState } from "react";
import { inviteEdition, type InviteEdition } from "@/actions/checkout";
import { editionFor, type PlanId } from "@/lib/plans/catalog";

/** Answers shared by the editor's parts that ask at once, for a few seconds. */
const asked = new Map<string, { at: number; answer: Promise<InviteEdition> }>();
const SHARED_FOR = 5_000;

function ask(inviteId: string, designId: string | null, fresh: boolean): Promise<InviteEdition> {
  const key = `${inviteId}|${designId}`;
  const known = asked.get(key);
  if (!fresh && known && Date.now() - known.at < SHARED_FOR) return known.answer;
  const answer = inviteEdition(inviteId, designId).catch(() => null);
  asked.set(key, { at: Date.now(), answer });
  return answer;
}

/**
 * The invite's package on the design the editor shows, asked again whenever the page comes
 * back into view, so a payment made on the packages page (or in another tab) shows at once
 * instead of the price that was paid.
 */
export function useInviteEdition(inviteId: string | null, designId: string | null): InviteEdition {
  const key = `${inviteId}|${designId}`;
  const [state, setState] = useState<{ key: string; edition: InviteEdition } | null>(null);

  useEffect(() => {
    if (!inviteId) return;
    let live = true;
    const load = (fresh: boolean) =>
      void ask(inviteId, designId, fresh).then((edition) => {
        if (live) setState({ key, edition });
      });
    const onShow = () => {
      if (document.visibilityState === "visible") load(true);
    };
    load(false);
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("pageshow", onShow);
    return () => {
      live = false;
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("pageshow", onShow);
    };
  }, [inviteId, designId, key]);

  return state?.key === key ? state.edition : null;
}

/**
 * Which package each design has: the one paid for shows as paid in the editor, in place of
 * its price, and every other design keeps its price (one payment, one design).
 */
export function usePaidOn(inviteId: string | null): (designId: string) => PlanId {
  const answer = useInviteEdition(inviteId, null);
  return (designId) => (answer ? editionFor(answer.paid, designId).plan : "free");
}
