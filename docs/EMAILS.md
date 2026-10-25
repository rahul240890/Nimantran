# Emails

The site sends five emails, through [Resend](https://resend.com) from the
`shubhinvitations.com` domain. Nothing is sent until `RESEND_API_KEY` is set in Vercel, and
preview mode never sends.

| Email          | When                                                                                | To                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Sign-in code   | Someone asks to sign in by email (the sign-in page, or Publish in the editor)       | The address typed; at most one every 30 seconds and five an hour per address, 300 an hour in all                          |
| Welcome        | Right after a new account's first sign-in                                           | Google and email sign-ins (phone sign-ins have no email)                                                                  |
| Receipt        | Once a payment is recorded, by the checkout or Razorpay's webhook                   | The buyer, with a link to the printable invoice                                                                           |
| Draft reminder | Daily job: a draft with no package, untouched for a day, under 10 days old          | The invite's owner, once per invite, at most once a week, with a "Stop these reminders" link                              |
| Error alert    | A page breaks on the server, or a browser reports an error that isn't its own noise | `ALERT_EMAIL` (one or more addresses, comma separated), or else every admin's sign-in email; once a day per kind of error |

Error alerts are kept to once a day per kind of error by Resend's idempotency key (one key per error and day), and each server sends at most 10 an hour; they aren't written to `email_log`. Code: `src/lib/errors/alert.ts`.

Every other email is claimed in `email_log` (`kind`, `ref`) before it goes, so a webhook retry or a
second checkout callback never sends it twice. A failed send frees the claim so the next
trigger tries again. Code: `src/lib/email/`. Wording and layout: `src/lib/email/templates.ts`.

Sign-in codes (owner, 2026-10-25): Supabase makes the code with `auth.admin.generateLink`, which also makes the account the first time, and the site sends it itself, so Supabase's own mail settings don't matter. The codes are claimed in `email_log` as `sign_in_code` with a hash of the address, and a day's claims are kept. Needs `supabase/migrations/20261025200000_email_sign_in.sql` (in the project files as `supabase-update-email-sign-in.sql`). `EMAIL_SIGN_IN=off` hides it. Code: `src/lib/auth/email-code.ts`.

## Setting it up

1. **Resend account.** Sign up at resend.com. The free plan sends 3,000 emails a month, 100 a
   day.
2. **Verify the domain.** Resend → Domains → Add domain → `shubhinvitations.com`, region
   Mumbai (ap-south-1) if offered. Resend lists DNS records: a TXT record for DKIM
   (`resend._domainkey`), and an MX and a TXT (SPF) record on a `send` subdomain. Add each one
   where the domain's DNS is managed (Vercel → Domains, or the registrar), exactly as shown,
   then press Verify. Also add a DMARC record: TXT `_dmarc` with
   `v=DMARC1; p=none; rua=mailto:<your email>`.
3. **API key.** Resend → API Keys → Create, with "Sending access" for the domain.
4. **Vercel environment variables** (Production, and Preview if wanted):
   - `RESEND_API_KEY` — the key from step 3
   - `CRON_SECRET` — any long random string; Vercel sends it to the reminder job
   - `EMAIL_FROM` — optional, defaults to `Shubh Invitation <hello@shubhinvitations.com>`
   - `EMAIL_REPLY_TO` — optional, an inbox you read, so replies reach a person
   - `NEXT_PUBLIC_CONTACT_EMAIL` — optional, shown in the footer of every email
   - `ALERT_EMAIL` — optional, where error alerts go instead of the admins' sign-in emails
5. **Database.** Run `supabase/migrations/20261015090000_emails.sql` once in Supabase's SQL
   Editor.
6. **Redeploy** so the new variables apply. The reminder job then runs daily at 10:00 IST
   (`vercel.json`); Vercel → Settings → Cron Jobs shows its runs.
