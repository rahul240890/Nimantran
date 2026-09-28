import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "@/components/ui/badge";

/** One setting on an admin page: its name, where it lives, and whether it's there. */
export function SettingRow({
  name,
  where,
  value,
  state,
}: {
  name: string;
  where: ReactNode;
  value?: ReactNode;
  state: { tone: BadgeTone; label: string };
}) {
  return (
    <div className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-semibold text-ink">{name}</span>
        <span className="text-sm text-ink-muted">{where}</span>
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
        {value && (
          <code className="max-w-full truncate rounded bg-surface-2 px-2 py-1 font-mono text-sm">
            {value}
          </code>
        )}
        <Badge tone={state.tone} dot>
          {state.label}
        </Badge>
      </div>
    </div>
  );
}
