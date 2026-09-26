import { Plus, UserRoundPen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { MyInvites } from "@/components/account/my-invites";
import { PageTransition } from "@/components/motion/page-transition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { firstName } from "@/lib/auth/account";
import { getAccount } from "@/lib/auth/server";
import { inviteStore } from "@/lib/invites/store";
import { getText } from "@/i18n/server";
import { accountText } from "@/i18n/copy";

export async function generateMetadata(): Promise<Metadata> {
  const { invitesCopy } = await getText(accountText);
  return {
    title: invitesCopy.metaTitle,
    robots: { index: false, follow: false },
  };
}

export default async function InvitesPage() {
  const { invitesCopy } = await getText(accountText);
  const account = await getAccount();
  if (!account) redirect("/sign-in?next=%2Finvites");
  const invites = (await inviteStore()?.list(account)) ?? null;

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
                {invitesCopy.eyebrow}
              </p>
              <h1 className="font-display text-[2rem] leading-[1.08] break-words sm:text-[2.6rem]">
                {invitesCopy.greeting(firstName(account))}
              </h1>
              <p className="text-ink-muted">{invitesCopy.intro}</p>
            </div>
            <Button asChild>
              <Link href="/create?new=1">
                <Plus aria-hidden />
                {invitesCopy.newInvite}
              </Link>
            </Button>
          </div>
          {!account.name && (
            <Card
              elevation="flat"
              className="flex-row flex-wrap items-center justify-between gap-4 border-marigold/45 bg-marigold/10 p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <UserRoundPen aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" />
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold">{invitesCopy.addName.title}</p>
                  <p className="text-sm text-ink-muted">{invitesCopy.addName.body}</p>
                </div>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/account">{invitesCopy.addName.action}</Link>
              </Button>
            </Card>
          )}
          <MyInvites invites={invites} />
        </div>
      </AccountShell>
    </PageTransition>
  );
}
