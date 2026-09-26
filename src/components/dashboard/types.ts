import type { HostFunction, HostGuest } from "@/lib/guests/list";
import type { Host, HostInvite } from "@/lib/invites/hosts";

/** What the dashboard page hands the browser: no draft, only what the screens show. */
export type DashboardView = {
  id: string;
  role: "owner" | "cohost";
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
};
