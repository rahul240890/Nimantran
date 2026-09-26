import { Logo } from "@/components/brand/logo";
import { StillModeSwitch } from "@/components/motion/still-mode-switch";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { uiStrings } from "@/lib/ui-strings";

/** The slim header on review pages: the logo, the page's name, still mode and theme. */
export function ReviewHeader({ label }: { label: string }) {
  return (
    <header className="z-40 border-b border-line bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md sm:sticky sm:top-0">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-1.5 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Logo className="max-[359px]:[&>span]:sr-only" />
          <span className="hidden font-label text-xs tracking-[0.24em] text-ink-muted uppercase md:inline">
            {label}
          </span>
        </div>
        <div className="contents sm:flex sm:items-center sm:gap-5">
          <StillModeSwitch className="gap-3 py-0 max-sm:order-last max-sm:w-full max-sm:border-t max-sm:border-line max-sm:pt-1.5" />
          <ThemeToggle labels={uiStrings.theme} />
        </div>
      </div>
    </header>
  );
}
