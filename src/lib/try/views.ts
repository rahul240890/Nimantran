/* The invitation tried before signing in (app/(app)/try/[view]): its website, video and cards. */
import { designPageHref } from "@/lib/editor/design-page";

export const TRY_VIEWS = ["website", "video", "cards"] as const;
export type TryViewName = (typeof TRY_VIEWS)[number];

export const isTryView = (value: string): value is TryViewName =>
  (TRY_VIEWS as readonly string[]).includes(value);

/** Where each tried view is. */
export const tryHref = (view: TryViewName) => `/try/${view}`;

/**
 * Publishing asks for the account, then the design's page carries straight on to publish
 * (?go=publish), packages first as for everyone.
 */
export function publishAfterSignIn(draft: Parameters<typeof designPageHref>[0]): string {
  return `/sign-in?next=${encodeURIComponent(publishNext(draft))}`;
}

/** The design's page, carrying on to publish as it arrives. */
export function publishNext(draft: Parameters<typeof designPageHref>[0]): string {
  return `${designPageHref(draft)}&go=publish`;
}
