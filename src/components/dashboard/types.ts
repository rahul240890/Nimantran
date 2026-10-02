import type { HostFunction, HostGuest } from "@/lib/guests/list";
import type { Host, HostInvite } from "@/lib/invites/hosts";
import type { PlanId } from "@/lib/plans/catalog";

/** What the dashboard page hands the browser: no draft, only what the screens show. */
export type DashboardView = {
  id: string;
  role: "owner" | "cohost";
  /** Whether this person can change the card itself; guests-only co-hosts can't. */
  canEdit: boolean;
  live: boolean;
  /** The invitation's address when live; personal links add ?g=<token>. */
  url: string | null;
  names: string;
  occasion: string;
  when: string;
  functions: HostFunction[];
  guests: HostGuest[];
  hosts: Host[];
  hostInvites: HostInvite[];
  /** Where co-host links point: <origin>/join/<token>. */
  origin: string;
  /** The invite's edition, once payments are on (Steps 15 to 17). */
  plan: PlanId | null;
  /** Co-hosts the edition includes while editions apply; null for no limit. */
  cohostLimit: number | null;
};
