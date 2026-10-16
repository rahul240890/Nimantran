"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Back from a sample to the page it was opened from. Previous and Next replace the address
 * instead of adding one, so the browser's own back returns there too. A sample opened from
 * outside (a shared link, a new tab) goes to `href`: its listing, or the home page.
 */
export function SampleBack({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(buttonClasses({ variant: "ghost", size: "sm" }), className)}
      onClick={(event) => {
        if (!cameFromSite()) return;
        event.preventDefault();
        router.back();
      }}
    >
      <ArrowLeft aria-hidden className="rtl:rotate-180" />
      {children}
    </Link>
  );
}

/** Whether this tab came to the sample from a page of this site, so going back returns to it. */
function cameFromSite(): boolean {
  if (window.history.length < 2 || !document.referrer) return false;
  try {
    const from = new URL(document.referrer);
    return from.origin === window.location.origin && !from.pathname.startsWith("/sample");
  } catch {
    return false;
  }
}
