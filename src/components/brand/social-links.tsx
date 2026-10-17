import type { SVGProps } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/*
 * The brand's own channels (site.social): Instagram, the WhatsApp channel and YouTube.
 * Round icon links in the footers; on Contact, each with its name beside it. They open in
 * a new tab, and rel="me" tells the networks the profiles belong to this site.
 */

export type SocialChannel = keyof typeof site.social;

const CHANNELS: readonly SocialChannel[] = ["instagram", "whatsapp", "youtube"];

export type SocialLabels = Record<SocialChannel, string>;

/** The channels' marks, drawn in the same line style as the site's other icons. */
export function SocialIcon({
  channel,
  ...props
}: { channel: SocialChannel } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {channel === "instagram" && (
        <>
          <rect x="2" y="2" width="20" height="20" rx="5.5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
        </>
      )}
      {channel === "whatsapp" && (
        <>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path
            d="M9.1 7.9c.3-.3.8-.3 1 .1l.8 1.5c.2.3.1.7-.1.9l-.6.6a6.4 6.4 0 0 0 2.8 2.8l.6-.6c.2-.2.6-.3.9-.1l1.5.8c.4.2.4.7.1 1l-.7.7c-.6.6-1.5.8-2.3.4a9 9 0 0 1-4.2-4.2c-.4-.8-.2-1.7.4-2.3Z"
            fill="currentColor"
            stroke="none"
          />
        </>
      )}
      {channel === "youtube" && (
        <>
          <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

export function SocialLinks({
  labels,
  named = false,
  className,
}: {
  labels: SocialLabels;
  /** Each channel's name beside its mark (Contact); otherwise the marks alone, named for screen readers. */
  named?: boolean;
  className?: string;
}) {
  return (
    <ul className={cn(named ? "flex flex-col gap-2" : "flex flex-wrap gap-2", className)}>
      {CHANNELS.map((channel) => (
        <li key={channel}>
          <a
            href={site.social[channel]}
            target="_blank"
            rel="me noopener noreferrer"
            data-social={channel}
            aria-label={named ? undefined : labels[channel]}
            title={named ? undefined : labels[channel]}
            className={cn(
              "inline-flex items-center text-ink-muted transition-colors hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-still:transition-none",
              named
                ? "min-h-11 gap-3 rounded-md font-semibold text-ink underline-offset-4 hover:underline"
                : "size-11 justify-center rounded-full border border-line bg-surface hover:border-line-strong",
            )}
          >
            <SocialIcon channel={channel} className={named ? "size-6 shrink-0" : "size-5"} />
            {named && labels[channel]}
          </a>
        </li>
      ))}
    </ul>
  );
}
