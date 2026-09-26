import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { AccountShell } from "@/components/account/account-shell";
import { GuestDashboard } from "@/components/dashboard/guest-dashboard";
import { PageTransition } from "@/components/motion/page-transition";
import { getAccount } from "@/lib/auth/server";
import { hostStore } from "@/lib/invites/hosts";
import { inviteNames, inviteWhen, occasionName } from "@/lib/publish/describe";
import { inviteUrl } from "@/lib/publish/links";
import { requestOrigin } from "@/lib/request-origin";
import { getLocale, getText } from "@/i18n/server";
import { dashboardText } from "@/i18n/copy";

export async function generateMetadata(): Promise<Metadata> {
  const { dashboardCopy } = await getText(dashboardText);
  return {
    title: dashboardCopy.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default async function GuestsPage({ params }: PageProps<"/invites/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(`/invites/${id}`)}`);
  const data = await hostStore()?.dashboard(account, id);
  if (!data) notFound();

  const origin = await requestOrigin();
  return (
    <PageTransition>
      <AccountShell>
        <GuestDashboard
          view={{
            id,
            role: data.role,
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
          }}
        />
      </AccountShell>
    </PageTransition>
  );
}
