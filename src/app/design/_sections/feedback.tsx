"use client";

import { CloudOff, Inbox, RotateCcw, SearchX, UserPlus } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton, SkeletonText, LoadingRegion } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Section, Specimen } from "./layout";

const rows = [
  {
    name: "Kabir Singh",
    detail: "Sangeet, wedding · 3 guests",
    status: "Attending",
    tone: "success" as const,
  },
  {
    name: "Ananya Rao",
    detail: "All functions · 2 guests",
    status: "Awaiting reply",
    tone: "warning" as const,
  },
  {
    name: "Farhan Qureshi",
    detail: "Reception · 1 guest",
    status: "Declined",
    tone: "danger" as const,
  },
];

function GuestList() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Switch label="Show loading state" checked={loading} onCheckedChange={setLoading} />
      <LoadingRegion
        loading={loading}
        label="Loading guests"
        className="rounded-lg border border-line bg-surface"
      >
        <ul className="divide-y divide-line">
          {loading
            ? rows.map((row) => (
                <li key={row.name} className="flex items-center gap-3 p-4">
                  <Skeleton className="size-11 shrink-0 rounded-full" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                  <Skeleton className="hidden h-7 w-24 rounded-full min-[400px]:block" />
                </li>
              ))
            : rows.map((row) => (
                <li key={row.name} className="flex items-center gap-3 p-4">
                  <Avatar name={row.name} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold">{row.name}</span>
                    <span className="truncate text-sm text-ink-muted">{row.detail}</span>
                  </div>
                  <Badge tone={row.tone} dot className="hidden min-[400px]:inline-flex">
                    {row.status}
                  </Badge>
                </li>
              ))}
        </ul>
      </LoadingRegion>
    </div>
  );
}

function RetryDemo() {
  const [state, setState] = useState<"error" | "loading" | "done">("error");
  if (state === "loading") {
    return (
      <LoadingRegion
        loading
        label="Loading replies"
        className="flex flex-col gap-4 rounded-lg border border-line p-6"
      >
        <Skeleton className="h-6 w-1/3" />
        <SkeletonText lines={3} />
      </LoadingRegion>
    );
  }
  if (state === "done") {
    return (
      <EmptyState
        live
        icon={<Inbox />}
        title="Replies are up to date"
        description="New replies will appear here as guests respond."
        action={
          <Button variant="ghost" onClick={() => setState("error")}>
            Show the error again
          </Button>
        }
      />
    );
  }
  return (
    <EmptyState
      tone="error"
      live
      icon={<CloudOff />}
      title="We couldn't load replies"
      description="Your guests' answers are safe. Check your connection and try again."
      action={
        <Button
          variant="secondary"
          leadingIcon={<RotateCcw aria-hidden />}
          onClick={() => {
            setState("loading");
            window.setTimeout(() => setState("done"), 1400);
          }}
        >
          Try again
        </Button>
      }
    />
  );
}

export function Feedback() {
  return (
    <Section
      id="feedback"
      eyebrow="09 · Feedback"
      title="Loading, empty and error states"
      intro="No screen is ever blank. Skeletons match the shape of what's coming, and every empty or failed state says what happened and offers one next step."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen title="Skeleton">
          <GuestList />
        </Specimen>
        <Specimen title="Error and retry" note="Try again to see loading, then success">
          <RetryDemo />
        </Specimen>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen title="Empty">
          <EmptyState
            icon={<UserPlus />}
            title="No guests yet"
            description="Add guests one by one, or import them from your phone's contacts."
            action={<Button leadingIcon={<UserPlus aria-hidden />}>Add your first guest</Button>}
          />
        </Specimen>
        <Specimen title="No results">
          <EmptyState
            icon={<SearchX />}
            title="No guests match “Sharma”"
            description="Check the spelling or clear the filters."
            action={<Button variant="secondary">Clear filters</Button>}
          />
        </Specimen>
      </div>
    </Section>
  );
}
