import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { TestEmailForm } from "@/components/admin/test-email-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin/access";
import { discoverFor, welcomeFor } from "@/lib/email/notify";
import { emailConfigured } from "@/lib/email/send";
import { stopUrl } from "@/lib/email/stop-link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Emails" };

/** The emails new accounts get, drawn as they would arrive, and a test send to any address. */
export default async function EmailsPage() {
  const { account } = await requireAdmin("/admin/emails");
  const ready = emailConfigured();
  const emails = [
    {
      id: "welcome",
      title: "Welcome",
      when: "Right after someone first signs in with an email address (Google). With the offers a first booking can use and three new designs.",
      email: await welcomeFor(account.id, account.name),
    },
    {
      id: "discover",
      title: "New designs and offers",
      when: "Once, three days after someone joins, from the daily job. Six new painted designs picked differently for each person, and the offers running that they can use.",
      email: await discoverFor(
        account.id,
        account.name,
        null,
        stopUrl(site.url, "preview", account.id),
      ),
    },
  ];

  return (
    <>
      <AdminHeading
        eyebrow="Marketing"
        title="Emails"
        intro="What new accounts are sent. Offers come from Admin, Offers, so a new offer shows in the next email. Accounts that signed in with a phone number only have no email address and get none."
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Mail aria-hidden className="size-5 text-accent-text" />
            Send a test
            <Badge tone={ready ? "success" : "warning"} dot>
              {ready ? "Sending on" : "Sending off"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Sends both emails, as your account would get them, with [Test] in the subject.
          </CardDescription>
        </CardHeader>
        <CardBody>
          <TestEmailForm initial={account.email ?? ""} />
        </CardBody>
      </Card>
      {emails.map(({ id, title, when, email }) => (
        <Card key={id}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{when}</CardDescription>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <p className="text-sm">
              <span className="font-semibold">Subject:</span> {email.subject}
            </p>
            <iframe
              title={`${title} email`}
              srcDoc={email.html}
              sandbox=""
              className="h-[46rem] w-full rounded-lg border border-line bg-paper"
            />
          </CardBody>
        </Card>
      ))}
    </>
  );
}
