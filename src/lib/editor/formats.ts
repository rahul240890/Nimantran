/*
 * The two kinds of painted invitation. A Scene is one painting that holds the photos,
 * the names and every celebration, each flying in by turn. A Story is a painted page for
 * every celebration, played one after another. The 3D cards are a third kind of design,
 * chosen by picking a card rather than a painted theme.
 */
export const INVITE_FORMATS = ["story", "scene"] as const;
export type InviteFormat = (typeof INVITE_FORMATS)[number];

export function isInviteFormat(value: unknown): value is InviteFormat {
  return (INVITE_FORMATS as readonly unknown[]).includes(value);
}
