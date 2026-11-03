import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { FunctionId } from "@/lib/events/functions";

/*
 * A small drawing for each celebration on the timeline (owner, 2026-10-27): a haldi bowl, a
 * hennaed hand, a dhol, a mandap. Line art in one stroke, drawn in the theme's gilt, so it
 * sits with the garland and the frames on every ground.
 */
type Drawing =
  | "bowl"
  | "hand"
  | "dhol"
  | "mandap"
  | "rings"
  | "kalash"
  | "chhatri"
  | "thali"
  | "glasses"
  | "cake"
  | "diya"
  | "home"
  | "cradle"
  | "moon"
  | "kite"
  | "tree"
  | "cap"
  | "flower";

const DRAWINGS: Record<Drawing, ReactNode> = {
  bowl: (
    <>
      <path d="M5 16h22a11 9 0 0 1-22 0Z" />
      <path d="M11 28h10" />
      <path d="M16 12c-3-2-3-6 0-9 3 3 3 7 0 9Z" />
      <path d="M10 19.5h.01M16 21h.01M22 19.5h.01" />
    </>
  ),
  hand: (
    <>
      <path d="M11 29v-9l-3.5-4.5a2 2 0 0 1 3.2-2.4L12 15V6a2 2 0 0 1 4 0v8-10a2 2 0 0 1 4 0v10-8a2 2 0 0 1 4 0v14c0 6-3.5 9-8 9Z" />
      <circle cx="18" cy="21" r="2.2" />
      <path d="M18 16.5h.01M14.5 24.5h.01M21.5 24.5h.01" />
    </>
  ),
  dhol: (
    <>
      <ellipse cx="7" cy="16" rx="3" ry="8" />
      <path d="M7 8c6-1.5 12-1.5 18 0M7 24c6 1.5 12 1.5 18 0" />
      <ellipse cx="25" cy="16" rx="3" ry="8" />
      <path d="M10 9.5l4 13 4-13 4 13" />
    </>
  ),
  mandap: (
    <>
      <path d="M4 13c3-4 7-7 12-8.5C21 6 25 9 28 13Z" />
      <path d="M16 4.5V2" />
      <path d="M7 13v14M25 13v14M3 27h26" />
      <path d="M16 25c-2.2-1-2.4-3.4 0-6 2.4 2.6 2.2 5 0 6Z" />
      <path d="M7 16c3 2 6 2 9 0 3 2 6 2 9 0" />
    </>
  ),
  rings: (
    <>
      <circle cx="12" cy="20" r="7" />
      <circle cx="20" cy="20" r="7" />
      <path d="M20 13l-2.5-3 2.5-2.5 2.5 2.5Z" />
    </>
  ),
  kalash: (
    <>
      <path d="M11 15c-4 2-5 7-2 10.5 2.5 3 11.5 3 14 0 3-3.5 2-8.5-2-10.5Z" />
      <path d="M11 15h10M12 12.5h8" />
      <circle cx="16" cy="8.5" r="3.5" />
      <path d="M12.5 12c-3-1.5-5.5-.5-7 2M19.5 12c3-1.5 5.5-.5 7 2" />
      <circle cx="16" cy="21" r="1.4" />
    </>
  ),
  chhatri: (
    <>
      <path d="M4 16C4 10 9.5 6 16 6s12 4 12 10" />
      <path d="M4 16c2-2 4-2 6 0 2-2 4-2 6 0 2-2 4-2 6 0 2-2 4-2 6 0" />
      <path d="M16 6v22a2 2 0 0 1-4 0M16 3v3" />
      <path d="M4 16v3M28 16v3" />
    </>
  ),
  thali: (
    <>
      <circle cx="16" cy="16" r="12" />
      <circle cx="16" cy="16" r="9" strokeDasharray="1 2.4" />
      <circle cx="12" cy="13" r="2.5" />
      <circle cx="20" cy="13" r="2.5" />
      <circle cx="16" cy="20.5" r="2.5" />
    </>
  ),
  glasses: (
    <>
      <path d="M6 6h8c0 5-1 9-4 9s-4-4-4-9ZM10 15v9M7 24h6" />
      <path d="M18 6h8c0 5-1 9-4 9s-4-4-4-9ZM22 15v9M19 24h6" />
      <path d="M16 2v2M12.5 3l1 1.5M19.5 3l-1 1.5" />
    </>
  ),
  cake: (
    <>
      <path d="M7 17h18v10H7ZM4 27h24" />
      <path d="M7 21c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
      <path d="M12 17v-4M16 17v-4M20 17v-4" />
      <path d="M12 10.5c-1-1-1-2 0-3.5 1 1.5 1 2.5 0 3.5ZM16 10.5c-1-1-1-2 0-3.5 1 1.5 1 2.5 0 3.5ZM20 10.5c-1-1-1-2 0-3.5 1 1.5 1 2.5 0 3.5Z" />
    </>
  ),
  diya: (
    <>
      <path d="M4 19h24c-1.5 5-6.5 8-12 8S5.5 24 4 19Z" />
      <path d="M28 19l2-2" />
      <path d="M16 17c-3-2-3-6.5 0-12 3 5.5 3 10 0 12Z" />
      <path d="M16 14v-3" />
    </>
  ),
  home: (
    <>
      <path d="M4 15 16 5l12 10" />
      <path d="M7 13v15h18V13" />
      <path d="M13 28v-7h6v7" />
      <path d="M9 15.5c1.2 1.3 2.4 1.3 3.5 0 1.2 1.3 2.4 1.3 3.5 0 1.2 1.3 2.4 1.3 3.5 0 1.2 1.3 2.4 1.3 3.5 0" />
    </>
  ),
  cradle: (
    <>
      <path d="M6 13h20v6a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5Z" />
      <path d="M4 26c6 3 18 3 24 0" />
      <path d="M9 13V8a7 7 0 0 1 14 0v5" />
      <circle cx="16" cy="9" r="1.6" />
    </>
  ),
  moon: (
    <>
      <path d="M19 4a12 12 0 1 0 9 19A10 10 0 0 1 19 4Z" />
      <path d="M24 7.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3Z" />
    </>
  ),
  kite: (
    <>
      <path d="M16 3l9 11-9 12-9-12Z" />
      <path d="M7 14h18M16 3v23" />
      <path d="M16 26c-2 1.5-1.5 3 .5 3.5s2 2-.5 2.5" />
    </>
  ),
  tree: (
    <>
      <path d="M16 3l-6 8h3.5L8 18.5h4.5L7 26h18l-5.5-7.5H24L18.5 11H22Z" />
      <path d="M16 26v4" />
    </>
  ),
  cap: (
    <>
      <path d="M3 12 16 6l13 6-13 6Z" />
      <path d="M9 15v6c0 2 3 4 7 4s7-2 7-4v-6" />
      <path d="M27 13v7" />
    </>
  ),
  flower: (
    <>
      <circle cx="16" cy="16" r="3" />
      {[0, 60, 120, 180, 240, 300].map((turn) => (
        <ellipse key={turn} cx="16" cy="8" rx="3.2" ry="5" transform={`rotate(${turn} 16 16)`} />
      ))}
    </>
  ),
};

const CELEBRATION_DRAWINGS: Record<FunctionId, Drawing> = {
  roka: "rings",
  engagement: "rings",
  tilak: "rings",
  "ganesh-puja": "kalash",
  "grah-shanti": "kalash",
  mandap: "mandap",
  mameru: "thali",
  haldi: "bowl",
  mehendi: "hand",
  sangeet: "dhol",
  garba: "dhol",
  bhoj: "thali",
  baraat: "chhatri",
  "baraat-welcome": "chhatri",
  wedding: "mandap",
  vidaai: "mandap",
  reception: "glasses",
  birthday: "cake",
  anniversary: "rings",
  party: "glasses",
  "baby-shower": "cradle",
  diwali: "diya",
  housewarming: "home",
  puja: "kalash",
  "thread-ceremony": "kalash",
  annaprashan: "thali",
  christening: "cradle",
  "prayer-meet": "diya",
  retirement: "glasses",
  "farewell-party": "glasses",
  "shop-opening": "home",
  launch: "glasses",
  "ganesh-chaturthi": "kalash",
  navratri: "dhol",
  janmashtami: "kalash",
  onam: "flower",
  sankranti: "kite",
  lohri: "dhol",
  eid: "moon",
  "naming-ceremony": "cradle",
  holi: "dhol",
  christmas: "tree",
  reunion: "glasses",
  graduation: "cap",
  "gudi-padwa": "kalash",
  baisakhi: "dhol",
  bihu: "dhol",
  "raksha-bandhan": "kalash",
  "karva-chauth": "moon",
};

/** The celebration's drawing, in the theme's gilt. Decorative: its name is said beside it. */
export function CelebrationIcon({ kind, className }: { kind: FunctionId; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("guest-celebration-icon", className)}
    >
      {DRAWINGS[CELEBRATION_DRAWINGS[kind] ?? "flower"]}
    </svg>
  );
}
