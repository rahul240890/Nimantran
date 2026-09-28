import { Mails } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { planCopy } from "@/content/editions";
import { requireAdmin } from "@/lib/admin/access";
import { getCategory, isCategoryId } from "@/lib/categories/catalog";
import { adminInvites } from "@/lib/payments/editions";

export const metadata: Metadata = { title: "Invites" };

const STATUS: Record<string, { tone: BadgeTone; label: string }> = {
  draft: { tone: "neutral", label: "Draft" },
  published: { tone: "success", label: "Published" },
  archived: { tone: "warning", label: "Archived" },
};

const when = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });

/** Every invite made on the site, newest first, with its host and edition. */
export default async function InvitesPage() {
  await requireAdmin("/admin/invites");
  const { invites, accounts, total } = await adminInvites();
  const published = invites.filter((invite) => invite.status === "published").length;

  const counts = [
    { label: "Invites", value: total ?? invites.length },
    {
      label: "Published",
      value: published,
      note: total && total > invites.length ? "in the latest 100" : undefined,
    },
    { label: "Accounts", value: accounts ?? "–" },
  ];

  return (
    <>
      <AdminHeading
        eyebrow="People"
        title="Invites"
        intro="The newest invites, drafts included. Open a published one to see it as guests do. Hosts' guest lists and replies stay private and aren't shown here."
      />

      <div className="flex flex-col gap-6">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-2xl">
          {counts.map((count) => (
            <div
              key={count.label}
              className="flex flex-col gap-1 rounded-lg border border-line bg-surface px-4 py-4 shadow-raised"
            >
              <dt className="font-label text-[0.7rem] tracking-[0.2em] text-ink-muted uppercase">
                {count.label}
              </dt>
              <dd className="font-display text-3xl leading-none tabular-nums">{count.value}</dd>
              {count.note && <dd className="text-xs text-ink-muted">{count.note}</dd>}
            </div>
          ))}
        </dl>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mails aria-hidden className="size-5 text-accent-text" />
              Latest invites
            </CardTitle>
          </CardHeader>
          <CardBody>
            {invites.length === 0 ? (
              <EmptyState
                icon={<Mails aria-hidden />}
                title="No invites yet"
                description="They appear here as soon as a host saves one."
              />
            ) : (
              <ul className="-my-2 divide-y divide-line">
                {invites.map((invite) => {
                  const status = STATUS[invite.status] ?? STATUS.draft!;
                  return (
                    <li
                      key={invite.id}
                      className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="font-semibold break-words">
                          {invite.names || "Untitled invite"}
                        </span>
                        <span className="text-sm text-ink-muted">
                          {[
                            isCategoryId(invite.categoryId)
                              ? getCategory(invite.categoryId).names.en
                              : invite.categoryId,
                            invite.owner,
                            when.format(new Date(invite.createdAt)),
                          ].join(" · ")}
                        </span>
                        {invite.slug && invite.status === "published" && (
                          <a
                            href={`/i/${invite.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="self-start text-sm break-all text-accent-text underline-offset-4 hover:underline"
                          >
                            /i/{invite.slug}
                          </a>
                        )}
                      </div>
                      <span className="flex shrink-0 flex-wrap gap-1.5">
                        <Badge tone={status.tone} dot>
                          {status.label}
                        </Badge>
                        <Badge tone={invite.plan === "free" ? "neutral" : "gold"}>
                          {planCopy[invite.plan].name}
                        </Badge>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
