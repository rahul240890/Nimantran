"use client";

import { FilePlus2, LayoutList, LogIn, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { signOut } from "@/app/_actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { accountMenu } from "@/content/account";
import { cn } from "@/lib/cn";
import { PersonAvatar } from "./person-avatar";
import { refreshAccountHint, useAccountHint } from "./use-account-hint";

const iconClass = "absolute start-3 size-4.5 text-ink-muted";

/**
 * "Sign in", or the signed-in person's picture opening a menu: My invites, Profile, a new
 * invite, Sign out. Works on static pages because it reads the account hint cookie.
 */
export function AccountMenu({ className, compact }: { className?: string; compact?: boolean }) {
  const hint = useAccountHint();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!hint) {
    const next = pathname && pathname !== "/" && pathname !== "/sign-in" ? pathname : "/invites";
    return (
      <Button asChild variant="ghost" size="sm" className={cn(compact && "px-3", className)}>
        <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>
          {!compact && <LogIn aria-hidden />}
          {accountMenu.signIn}
        </Link>
      </Button>
    );
  }

  const leave = () =>
    startTransition(async () => {
      await signOut();
      refreshAccountHint();
      toast({ title: accountMenu.signedOut, tone: "success" });
      if (pathname?.startsWith("/invites") || pathname?.startsWith("/account")) router.push("/");
      router.refresh();
    });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={accountMenu.menuLabel(hint.name)}
        disabled={pending}
        className={cn(
          "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-[box-shadow,opacity] duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          "hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--marigold)_35%,transparent)] disabled:opacity-60 data-[state=open]:shadow-[0_0_0_3px_var(--marigold)]",
          className,
        )}
      >
        <PersonAvatar
          name={hint.name}
          src={hint.avatarUrl}
          size="sm"
          label={accountMenu.yourAccount}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel className="truncate font-sans text-sm tracking-normal text-ink normal-case">
          {hint.name || accountMenu.yourAccount}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/invites">
            <LayoutList aria-hidden className={iconClass} />
            {accountMenu.invites}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/create">
            <FilePlus2 aria-hidden className={iconClass} />
            {accountMenu.newInvite}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserRound aria-hidden className={iconClass} />
            {accountMenu.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={leave}>
          <LogOut aria-hidden className={iconClass} />
          {accountMenu.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
