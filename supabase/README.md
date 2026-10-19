# Supabase

The database, sign-in and file storage behind accounts. The site runs without it (accounts
say they open soon) until the three keys below are set.

- `migrations/` — the schema and its row level security, applied in file-name order.
- `seed.sql` — the category and design catalogs. Generated: run `npm run db:seed` after
  changing `src/lib/categories/catalog.ts` or the templates, and commit the result.
- `src/lib/db/schema.test.ts` runs the migrations and seed in an in-memory Postgres and checks
  every access rule, so `npm test` covers them without a Supabase project.

## Updating the live project

When a pull request adds a file to `migrations/`, open SQL Editor in Supabase, paste that
file's contents and run it once. Migrations only add or widen, so running one on the live
database keeps every invite. Applied so far after the first setup:

- `20260926170000_traditions_ready.sql` — ready for tradition packs (any ceremony id, local
  ceremony names, end times, a tradition and card languages per invite).
- `20260926180000_publish.sql` — publishing (Step 9): the public `published_invite()` read,
  `slug_available()`, and guests reading photos of published invites. Needs the traditions
  migration above first.
- `20260926190000_rsvp.sql` — guest replies (Step 10): `submit_rsvp()` and `guest_reply()` for
  guests with the link, the host's questions on the guest page, and `guests.self_added`.
- `20260926200000_host_dashboard.sql` — the host dashboard (Step 11): co-host links
  (`host_invite_preview()`, `accept_host_invite()`, `event_host_list()`), a label on co-host
  invitations and `guests.reminded_at`.
- `20260928090000_admin_and_editions.sql` — the master admin and editions (Steps 15 to 17):
  `admins`, `app_settings`, `orders`, `event_plans`, `is_admin()`, `checkout_enabled()` and
  `published_invite_plan()`. Then make yourself the first admin (use the email or phone you
  sign in with):

  ```sql
  insert into public.admins (user_id, role)
  select id, 'owner' from auth.users where email = 'you@example.com'
  on conflict (user_id) do nothing;
  ```

- `20260928150000_coupons_invoices_refunds.sql` — coupons and festival offers, GST invoice
  numbers and refunds (Step 17, part 2): `coupons`, `invoice_counters`, new `orders`
  columns, `assign_invoice_no()` and `use_coupon()`.
- `20261002160000_photo_wall.sql` — the shared photo wall (Step 24): `wall_photos`,
  `wall_photos_for()` for guests, and `add_wall_photo()` and `remove_wall_photo()`, which only
  the server's service role can call. Guests' uploads need `SUPABASE_SERVICE_ROLE_KEY` in
  Vercel.
- `20261002170000_guest_opens.sql` — guest list import and opens: `guests.last_opened_at`
  and `guests.open_count`, and `guest_reply()` counting each visit to a personal link once
  per half hour. The guest list still loads before it runs, without visit times.

- `20261002160000_cohost_access.sql` — co-hosts, part 2: what each co-host can do (`access`
  on `event_hosts` and `event_host_invites`, `can_edit_event()`), the co-hosts each edition
  includes (`cohost_limit()`), and the new `event_host_list()` and `accept_host_invite()`.
  Co-hosts who joined earlier keep editing.

- `20261015090000_emails.sql` — emails (docs/EMAILS.md): `email_log`, so each welcome,
  receipt and reminder goes once, and `email_opt_outs` for people who stop reminders. Only
  the server's service role reads or writes them.
- `20261016090000_one_design_per_package.sql` — one payment, one design: `event_plans.design_id`
  and `orders.design_id` / `from_design_id`. **Run it before the code that uses it goes live.**
  Packages bought before it keep working: each is tied to its invite's design on first use.
- `20261017090000_reply_limits.sql` — spam protection for guest replies: `reply_senders` and
  a new `submit_rsvp()` that lets one network add at most 10 new guests to an invite an hour
  and 30 a day. Replies keep working before it runs, just without the limit.
- `20261018090000_publish_through_the_site.sql` — only the site publishes: a host's own
  connection can no longer mark an invite published, or change a live invite's design,
  occasion, theme or card languages, straight through the database, so nobody skips the
  package check. The site does both with `SUPABASE_SERVICE_ROLE_KEY` after checking. Safe to
  run any time after the code is live.
- `20261019090000_site_visits.sql` — visitor counts for the admin's Visitors page:
  `site_visits`, `visit_salts`, `record_visit()` and `visit_summary()`. Counting starts on the
  live site once it runs; before that the page says so and nothing breaks.

## Setting up a project

1. **Create the project** at supabase.com in the Mumbai region (ap-south-1).
2. **Create the tables.** In SQL Editor, run each file in `migrations/` in order, then
   `seed.sql`. (With the Supabase CLI instead: `supabase link` then `supabase db push`, and
   run `seed.sql` once.)
3. **Site address.** Authentication → URL Configuration: Site URL
   `https://nimantran-zeta.vercel.app`, and add these redirect URLs:
   - `https://nimantran-zeta.vercel.app/auth/callback`
   - `https://*-rahul240890s-projects.vercel.app/auth/callback` (preview deployments; use the
     domain your previews actually get)
   - `http://localhost:3000/auth/callback`
4. **Keys in Vercel.** Project Settings → API Keys in Supabase, then Vercel → Settings →
   Environment Variables, for Production and Preview:
   - `NEXT_PUBLIC_SUPABASE_URL` — the Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the publishable key (`sb_publishable_…`), or the
     legacy anon key
   - `SUPABASE_SERVICE_ROLE_KEY` — a secret key (`sb_secret_…`), or the legacy service_role
     key (never exposed to browsers)

   Redeploy after saving so the build picks them up.

5. **Google sign-in.** In Google Cloud Console, create an OAuth client (Web application) with
   the authorised redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`. Paste its
   client ID and secret into Supabase → Authentication → Providers → Google.
6. **Mobile number sign-in.** Supabase → Authentication → Providers → Phone: turn it on and
   pick an SMS provider (Twilio, Twilio Verify, MessageBird, Vonage or Textlocal). Sending SMS
   to Indian numbers needs the sender and template registered on DLT with the provider. While
   that's pending, add test numbers with fixed codes under "Phone numbers for testing".

## Local work and tests

Without keys, set `SHUBHDWAR_AUTH_PREVIEW=1` (see `.env.example`): any mobile number signs in
with code 123456, and invites are kept in the server's memory. Preview mode never runs on the
live site.
