import "server-only";
import type { User } from "@supabase/supabase-js";
import type { Account } from "@/lib/auth/account";
import { authMode } from "@/lib/auth/mode";
import { previewDb } from "@/lib/invites/preview-db";
import { isPlanId, type PlanId } from "@/lib/plans/catalog";
import { supabaseService } from "@/lib/supabase/service";

/*
 * Support for any host (Admin, Invites): find a host's invites by their name, email, phone,
 * link or payment, and step in to help. Helping makes the admin a co-host who edits, named
 * "Shubh support" on the host's list, so the ordinary editor, video and cards work for the
 * admin exactly as they do for the host, and the host can see who is helping. Everything
 * here reads and writes as the server; the admin pages and actions check the admin first.
 */

export const SUPPORT_SIDE = "Shubh support";

export type HostDetails = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  joinedAt: string | null;
};

export type SupportInvite = {
  id: string;
  names: string;
  categoryId: string;
  status: string;
  slug: string | null;
  plan: PlanId;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
};

export type SupportHost = {
  userId: string;
  name: string;
  role: "owner" | "cohost";
  side: string;
  access: "edit" | "guests";
};

const isPreview = () => authMode() === "preview";

function namesOf(content: Record<string, string> | null | undefined): string {
  const first = content?.first?.trim() ?? "";
  const second = content?.second?.trim() ?? "";
  return [first, second].filter(Boolean).join(" & ");
}

const userName = (user: User) => {
  const meta = user.user_metadata ?? {};
  const name = [meta.name, meta.full_name].find(
    (value): value is string => typeof value === "string" && Boolean(value.trim()),
  );
  return (name ?? "").trim();
};

/** Phone numbers compared by their digits, so "+91 98765 43210" finds "919876543210". */
const digits = (value: string) => value.replace(/\D/g, "");

type EventRow = {
  id: string;
  category_id: string;
  status: string;
  slug: string | null;
  content: Record<string, string> | null;
  created_at: string;
  updated_at: string;
  owner_id: string;
  profiles: { name: string | null } | null;
  event_plans: { plan_id: string } | { plan_id: string }[] | null;
};

/*
 * events reaches profiles both by its owner and through event_hosts (by host and by who
 * added them), so each join names its key: PostgREST refuses an ambiguous one outright.
 */
const EVENT_SELECT =
  "id, category_id, status, slug, content, created_at, updated_at, owner_id, profiles!events_owner_id_fkey(name), event_plans(plan_id)";

function inviteFromRow(row: EventRow): SupportInvite {
  const plan = Array.isArray(row.event_plans) ? row.event_plans[0] : row.event_plans;
  return {
    id: row.id,
    names: namesOf(row.content),
    categoryId: row.category_id,
    status: row.status,
    slug: row.slug,
    plan: isPlanId(plan?.plan_id) ? plan.plan_id : "free",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ownerId: row.owner_id,
    ownerName: row.profiles?.name || "No name yet",
  };
}

/** One invite as the support page lists it; null when there's no such invite. */
export async function supportInvite(id: string): Promise<SupportInvite | null> {
  if (isPreview()) {
    const stored = previewDb.invites.get(id);
    if (!stored) return null;
    return previewInvite(stored);
  }
  const service = supabaseService();
  if (!service) return null;
  const { data } = await service.from("events").select(EVENT_SELECT).eq("id", id).maybeSingle();
  return data ? inviteFromRow(data as unknown as EventRow) : null;
}

function previewInvite(stored: NonNullable<ReturnType<typeof previewDb.invites.get>>) {
  const owner = stored.hosts?.find((host) => host.role === "owner");
  return {
    id: stored.event.id,
    names: namesOf(stored.event.content),
    categoryId: stored.event.category_id,
    status: stored.event.status,
    slug: stored.event.slug,
    plan: "free" as PlanId,
    createdAt: stored.publishedAt ?? stored.event.updated_at,
    updatedAt: stored.event.updated_at,
    ownerId: stored.owner,
    ownerName: owner?.name || stored.owner.replace(/^preview-/, ""),
  };
}

/** Every invite a host made, newest first. */
export async function invitesOf(ownerId: string): Promise<SupportInvite[]> {
  if (isPreview()) {
    return [...previewDb.invites.values()]
      .filter((stored) => stored.owner === ownerId)
      .map(previewInvite)
      .reverse();
  }
  const service = supabaseService();
  if (!service) return [];
  const { data } = await service
    .from("events")
    .select(EVENT_SELECT)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(50);
  return ((data ?? []) as unknown as EventRow[]).map(inviteFromRow);
}

/** Who a host is: their name with the email and phone they signed in with. */
export async function hostDetails(userId: string): Promise<HostDetails | null> {
  if (isPreview()) {
    const host = [...previewDb.invites.values()]
      .flatMap((stored) => stored.hosts ?? [])
      .find((item) => item.userId === userId);
    const phone = userId.startsWith("preview-") ? `+${userId.slice("preview-".length)}` : null;
    return { id: userId, name: host?.name ?? "", email: null, phone, joinedAt: null };
  }
  const service = supabaseService();
  if (!service) return null;
  const [{ data }, { data: profile }] = await Promise.all([
    service.auth.admin.getUserById(userId),
    service.from("profiles").select("name").eq("id", userId).maybeSingle(),
  ]);
  const user = data.user;
  if (!user && !profile) return null;
  return {
    id: userId,
    name: (profile?.name as string | undefined) || (user ? userName(user) : ""),
    email: user?.email || null,
    phone: user?.phone ? `+${digits(user.phone)}` : null,
    joinedAt: user?.created_at ?? null,
  };
}

/** Accounts whose email or phone matches, read page by page from the sign-in records. */
async function accountsMatching(query: string): Promise<string[]> {
  const service = supabaseService();
  if (!service) return [];
  const needle = query.toLowerCase();
  const number = digits(query);
  const found: string[] = [];
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data) break;
    for (const user of data.users) {
      const email = user.email?.toLowerCase() ?? "";
      const phone = digits(user.phone ?? "");
      if (
        (email && email.includes(needle)) ||
        (number.length >= 6 && phone.endsWith(number.replace(/^0+/, "")))
      ) {
        found.push(user.id);
      }
    }
    if (data.users.length < 1000) break;
  }
  return found.slice(0, 20);
}

/**
 * Invites matching what the admin typed: a link or slug, a Razorpay payment or order id,
 * an email, a phone number, or the names on the card or the host's name.
 */
export async function searchInvites(
  raw: string,
  paymentInvite: (id: string) => Promise<string | null>,
): Promise<SupportInvite[]> {
  const query = raw.trim().slice(0, 120);
  if (!query) return [];
  const slug = query.match(/\/i\/([^/?#\s]+)/)?.[1] ?? null;
  if (isPreview()) {
    const needle = (slug ?? query).toLowerCase();
    return [...previewDb.invites.values()]
      .filter(
        (stored) =>
          stored.event.slug === needle ||
          stored.event.id === needle ||
          stored.owner.includes(digits(needle) || "\u0000") ||
          namesOf(stored.event.content).toLowerCase().includes(needle),
      )
      .map(previewInvite)
      .reverse();
  }
  const service = supabaseService();
  if (!service) return [];
  const byIds = async (column: "id" | "owner_id" | "slug", values: string[]) => {
    if (!values.length) return [];
    const { data } = await service
      .from("events")
      .select(EVENT_SELECT)
      .in(column, values)
      .order("created_at", { ascending: false })
      .limit(50);
    return ((data ?? []) as unknown as EventRow[]).map(inviteFromRow);
  };

  if (/^(pay|order)_[A-Za-z0-9]+$/.test(query)) {
    const id = await paymentInvite(query);
    return id ? byIds("id", [id]) : [];
  }
  if (/^[0-9a-f-]{36}$/i.test(query)) return byIds("id", [query.toLowerCase()]);
  if (slug) return byIds("slug", [slug.toLowerCase()]);
  if (query.includes("@") || digits(query).length >= 6) {
    return byIds("owner_id", await accountsMatching(query));
  }
  // Names: on the card, the host's profile, or the link itself
  const like = `%${query.replace(/[%_,()]/g, " ")}%`;
  const [cards, profiles] = await Promise.all([
    service
      .from("events")
      .select(EVENT_SELECT)
      .or(`content->>first.ilike.${like},content->>second.ilike.${like},slug.ilike.${like}`)
      .order("created_at", { ascending: false })
      .limit(50),
    service.from("profiles").select("id").ilike("name", like).limit(20),
  ]);
  const owned = await byIds(
    "owner_id",
    (profiles.data ?? []).map((row) => row.id as string),
  );
  const seen = new Set<string>();
  return [...((cards.data ?? []) as unknown as EventRow[]).map(inviteFromRow), ...owned].filter(
    (invite) => !seen.has(invite.id) && Boolean(seen.add(invite.id)),
  );
}

/** Everyone who runs an invite, owner first. */
export async function supportHosts(eventId: string): Promise<SupportHost[]> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    return (stored?.hosts ?? []).map((host) => ({
      userId: host.userId,
      name: host.name,
      role: host.role,
      side: host.side,
      access: host.access ?? "edit",
    }));
  }
  const service = supabaseService();
  if (!service) return [];
  const { data } = await service
    .from("event_hosts")
    .select("user_id, role, side, access, created_at, profiles!event_hosts_user_id_fkey(name)")
    .eq("event_id", eventId)
    .order("created_at");
  type Row = {
    user_id: string;
    role: "owner" | "cohost";
    side: string | null;
    access: string | null;
    profiles: { name: string | null } | null;
  };
  return ((data ?? []) as unknown as Row[])
    .map((row) => ({
      userId: row.user_id,
      name: row.profiles?.name ?? "",
      role: row.role,
      side: row.side ?? "",
      access: row.access === "guests" ? ("guests" as const) : ("edit" as const),
    }))
    .sort((a, b) => Number(b.role === "owner") - Number(a.role === "owner"));
}

/**
 * Makes the admin a co-host who edits the invite, named "Shubh support", so its editor,
 * video and cards open for them as for the host. Added as the server, past the package's
 * co-host limit: support never takes a place the host paid for.
 */
export async function startHelping(eventId: string, admin: Account): Promise<boolean> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    if (!stored) return false;
    const hosts = stored.hosts ?? [];
    if (!hosts.some((host) => host.userId === admin.id)) {
      stored.hosts = [
        ...hosts,
        {
          userId: admin.id,
          name: admin.name,
          role: "cohost",
          side: SUPPORT_SIDE,
          access: "edit",
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return true;
  }
  const service = supabaseService();
  if (!service) return false;
  const { data: event } = await service
    .from("events")
    .select("owner_id")
    .eq("id", eventId)
    .maybeSingle();
  if (!event) return false;
  // The admin's own invite needs no help
  if (event.owner_id === admin.id) return true;
  const { error } = await service.from("event_hosts").upsert(
    {
      event_id: eventId,
      user_id: admin.id,
      role: "cohost",
      side: SUPPORT_SIDE,
      access: "edit",
      added_by: admin.id,
    },
    { onConflict: "event_id,user_id" },
  );
  return !error;
}

/** Takes the admin off an invite they were helping with; never the owner. */
export async function stopHelping(eventId: string, admin: Account): Promise<boolean> {
  if (isPreview()) {
    const stored = previewDb.invites.get(eventId);
    if (!stored) return false;
    stored.hosts = (stored.hosts ?? []).filter(
      (host) => host.role === "owner" || host.userId !== admin.id,
    );
    return true;
  }
  const service = supabaseService();
  if (!service) return false;
  const { error } = await service
    .from("event_hosts")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", admin.id)
    .eq("role", "cohost");
  return !error;
}
