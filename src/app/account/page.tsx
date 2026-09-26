import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountShell } from "@/components/account/account-shell";
import { ProfileForm } from "@/components/account/profile-form";
import { PageTransition } from "@/components/motion/page-transition";
import { profileCopy } from "@/content/account";
import { getAccount } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: profileCopy.metaTitle,
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const account = await getAccount();
  // The proxy sends signed-out visitors to sign in; this covers a session that just ended
  if (!account) redirect("/sign-in?next=%2Faccount");

  return (
    <PageTransition>
      <AccountShell>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
          <div className="flex flex-col gap-2">
            <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
              {profileCopy.eyebrow}
            </p>
            <h1 className="font-display text-[2rem] leading-[1.08] sm:text-[2.6rem]">
              {profileCopy.title}
            </h1>
            <p className="text-ink-muted">{profileCopy.intro}</p>
          </div>
          <ProfileForm account={account} />
        </div>
      </AccountShell>
    </PageTransition>
  );
}
