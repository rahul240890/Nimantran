import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { Mandala } from "./mandala";

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
      <Mandala simple className="size-8 text-accent-text" />
      <span className="font-display text-[1.375rem] leading-none tracking-[0.01em]">
        {site.name}
      </span>
    </Link>
  );
}
