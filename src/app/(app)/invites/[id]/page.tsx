import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { GuestDashboard } from "@/components/dashboard/guest-dashboard";
import { PageTransition } from "@/components/motion/page-transition";
import { getAccount } from "@/lib/auth/server";
import { listPagesLeft, listReading } from "@/lib/guests/read-list-server";
import { hostStore } from "@/lib/invites/hosts";
import { editionsActive, invitePlan } from "@/lib/payments/editions";
import { cohostLimit, inviteLimit } from "@/lib/plans/catalog";
import { getPricing } from "@/lib/plans/pricing";
import { inviteNames, inviteWhen, occasionName } from "@/lib/publish/describe";
import { inviteUrl } from "@/lib/publish/links";
import { requestOrigin } from "@/lib/request-origin";
import { getLocale, getText } from "@/i18n/server";
import { dashboardText } from "@/i18n/copy/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const { dashboardCopy } = await getText(dashboardText);
  return {
    title: dashboardCopy.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default async function GuestsPage({ params, searchParams }: PageProps<"/invites/[id]">) {
  const { id } = await params;
  const { send } = await searchParams;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}`)}`);
  const data = await hostStore()?.dashboard(account, id);
  if (!data) notFound();

  const origin = await requestOrigin();
  const buying = await editionsActive();
  const edition = buying ? await invitePlan(account, id) : null;
  const plan = edition?.plan ?? null;
  const reading = listReading();
  const pages = reading ? await listPagesLeft(account, id).catch(() => null) : null;
  return (
    <PageTransition>
      <AccountShell>
        <GuestDashboard
          openSend={typeof send === "string" && z.uuid().safeParse(send).success ? send : undefined}
          view={{
            id,
            role: data.role,
            canEdit: data.canEdit,
            live: data.status === "published" && Boolean(data.slug),
            url: data.status === "published" && data.slug ? inviteUrl(origin, data.slug) : null,
            names: inviteNames(data.draft),
            occasion: occasionName(data.draft, await getLocale()),
            when: inviteWhen(data.draft, await getLocale()),
            functions: data.functions,
            guests: data.guests,
            hosts: data.hosts,
            hostInvites: data.hostInvites,
            origin: origin.replace(/\/+$/, ""),
            plan,
            cohostLimit: plan ? cohostLimit(plan) : null,
            inviteLimit: plan ? inviteLimit(plan, await getPricing()) : null,
            listReading: reading && pages ? { pdf: reading.pdf, buy: buying, ...pages } : null,
            schedules: data.schedules,
            now: new Date().toISOString(),
          }}
        />
      </AccountShell>
    </PageTransition>
  );
}
