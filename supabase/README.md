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
