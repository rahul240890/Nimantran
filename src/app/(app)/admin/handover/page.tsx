import { Gift } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading } from "@/components/admin/admin-shell";
import { HandoverControls } from "@/components/admin/handover-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireAdmin } from "@/lib/admin/access";
import { getCategory, isCategoryId } from "@/lib/categories/catalog";
import { HANDOVER_DAYS, handoverStore } from "@/lib/invites/handover";
import { inviteStore } from "@/lib/invites/store";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Hand over" };

/**
 * We'll make it for you (update 5): the admin makes an invitation in the editor, signed in
 * as themselves, then makes its hand-over link here and sends it to the family. Whoever
 * opens it and signs in becomes its owner, and it leaves the admin's account.
 */
export default async function HandoverPage() {
  const admin = await requireAdmin("/admin/handover");
  const invites = ((await inviteStore()?.list(admin.account)) ?? []).filter(
    (invite) => invite.role === "owner",
  );
  const links = (await handoverStore()?.open(invites.map((invite) => invite.id))) ?? new Map();

  return (
    <>
      <AdminHeading
        eyebrow="People"
        title="Hand over"
        intro={`Make an invitation for a family who asked us to, then send them its link. When they open it and sign in, the invitation moves to their account: they pay for it, send it, and the guest list and replies are theirs. A link works once, for ${HANDOVER_DAYS} days.`}
      />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardBody>
            <ol className="flex list-decimal flex-col gap-2 ps-5 text-ink-muted">
              <li>
                Make the invitation in the editor while signed in to this account: the
                family&rsquo;s names, functions, venues and photos.
              </li>
              <li>Come back here and make its hand-over link.</li>
              <li>Send the link on WhatsApp. The family opens it and signs in.</li>
              <li>
                The invitation leaves this account. Start a new one for the next family with New
                invite.
              </li>
            </ol>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/create?new=1">New invite</Link>
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift aria-hidden className="size-5 text-accent-text" />
              Your invitations
            </CardTitle>
          </CardHeader>
          <CardBody>
            {invites.length === 0 ? (
              <EmptyState
                icon={<Gift aria-hidden />}
                title="No invitations in this account yet"
                description="Make one in the editor, and it appears here to hand over."
              />
            ) : (
              <ul className="-my-2 divide-y divide-line" data-handover-list>
                {invites.map((invite) => {
                  const names = [invite.first, invite.second].filter(Boolean).join(" & ");
                  return (
                    <li
                      key={invite.id}
                      data-invite={invite.id}
                      className="flex flex-col gap-3 py-4 lg:flex-row lg:items-start lg:justify-between"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="font-semibold break-words">
                          {names || "Untitled invite"}
                        </span>
                        <span className="text-sm text-ink-muted">
                          {isCategoryId(invite.categoryId)
                            ? getCategory(invite.categoryId).names.en
                            : invite.categoryId}
                        </span>
                        <span className="flex flex-wrap gap-1.5">
                          <Badge tone={invite.status === "published" ? "success" : "neutral"} dot>
                            {invite.status === "published" ? "Published" : "Draft"}
                          </Badge>
                        </span>
                      </div>
                      <div className="lg:max-w-md">
                        <HandoverControls
                          eventId={invite.id}
                          initial={links.get(invite.id) ?? null}
                          origin={site.url}
                          names={names}
                        />
                      </div>
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
