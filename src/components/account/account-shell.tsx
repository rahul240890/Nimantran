import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeMenu } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { uiText } from "@/i18n/copy/ui";
import { getText } from "@/i18n/server";
import { AccountMenu } from "./account-menu";

/** The frame around sign-in and account pages: a slim header and a centred page. */
export async function AccountShell({
  children,
  menu = true,
}: {
  children: ReactNode;
  menu?: boolean;
}) {
  const { uiStrings } = await getText(uiText);
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Logo className="max-[359px]:[&>span]:sr-only" />
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <ThemeMenu labels={uiStrings.theme} />
            {menu && <AccountMenu />}
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {children}
      </main>
    </div>
  );
}
