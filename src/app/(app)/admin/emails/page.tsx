import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { TestEmailForm } from "@/components/admin/test-email-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin/access";
import {
  discoverFor,
  sampleReceiptFor,
  sampleReminderFor,
  welcomeFor,
  welcomeFromName,
} from "@/lib/email/notify";
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
      when: `Right after someone first signs in with an email address (Google), from "${welcomeFromName}". A plain note with the six things one invitation gives, as in the first-visit popup, and one link, so Gmail files it in Primary.`,
      email: await welcomeFor(account.id, account.name),
    },
    {
      id: "reminder",
      title: "Not bought yet",
      when: "Once per person, ever, from the daily job: a day after signing in, to anyone who hasn't bought a package and hasn't edited an invite for 12 hours. The designs they tried (yours, here), what one invitation gives in short, and help.",
      email: await sampleReminderFor(
        account.id,
        account.name,
        stopUrl(site.url, "preview", account.id),
      ),
    },
    {
      id: "receipt",
      title: "Receipt",
      when: "Once a payment is recorded. With help by WhatsApp, email and Instagram, the ask to follow on Instagram, and the bigger packages they can move up to (none after Grand). This sample is a Basic purchase.",
      email: await sampleReceiptFor(account.name),
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
        intro="What people are sent. Offers come from Admin, Offers, so a new offer shows in the next email. Accounts that signed in with a phone number only have no email address and get none."
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
            Sends every email here, as your account would get them, with [Test] in the subject.
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
