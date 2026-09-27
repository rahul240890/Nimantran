import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { BrandMark } from "./brand-mark";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label={`${site.name} home`}
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-md text-ink transition-opacity hover:opacity-85",
        className,
      )}
    >
      <BrandMark className="size-9 text-accent-text" />
      {/* SHUBH is the brand people remember; Invitation, smaller, says what it is. */}
      <span className="flex flex-col gap-1">
        <span className="font-display text-[1.375rem] leading-none tracking-[0.08em] uppercase">
          {site.shortName}
        </span>
        <span className="font-label text-[0.6875rem] leading-none tracking-[0.24em] text-ink-muted">
          Invitation
        </span>
      </span>
    </Link>
  );
}
