# Launch checklist (Step 14)

The code for launch has been merged: privacy policy and terms, visitor analytics, error reports and security headers. What is left happens in dashboards, and only the owner can do it. Work through the list top to bottom; each step says where to click.

## What the code already does

- **Delete account** on the profile page lets hosts erase their own data, as the DPDP Act expects.
- **Privacy policy and terms** are at `/privacy` and `/terms`, with Hindi versions at `/hi/privacy` and `/hi/terms`. The footer on every page links to them, and so does the sign-in page. Both are written for India's Digital Personal Data Protection Act, 2023. The wording lives in `src/content/legal.ts` and `src/content/hi/legal.ts`. Change `LEGAL_UPDATED` in `src/lib/legal.ts` whenever the wording changes.
- **Visitor analytics** use Vercel Web Analytics. It sets no cookies and counts only on the live site. Invitation links, guest codes and anything after `?` are removed before a visit is counted (`src/lib/analytics.ts`), so the numbers never show whose invitation was opened.
- **Error reports**: errors in visitors' browsers and on the server are written to the Vercel logs, one line each:
  - Browser errors start with `[client-error]`.
  - Server errors start with `[server-error]`.
  - Pages that fail show a friendly "Something went wrong" page with a Try again button instead of a blank screen.
- **Security headers** go on every page:
  - The site can't be framed by other sites.
  - Links to other sites (maps, calendars) never pass on a guest's private link.
  - The browser always uses HTTPS.

## Owner steps

### 1. Choose and buy the domain

1. Pick the address, for example `shubhdwar.com` or `shubhdwar.in`. Check both at a registrar such as GoDaddy, Namecheap, Hostinger or Cloudflare.
2. Buy it. Turn on auto-renew.

### 2. Point the domain at Vercel

1. Open vercel.com and go to the **nimantran** project, then **Settings**, then **Domains**.
2. Click **Add Domain**, type the domain, and choose to add both the bare domain and `www`. Pick the bare domain as the main one.
3. Vercel shows one or two DNS records (type, name and value). At your registrar, open **DNS settings** for the domain and add exactly those records.
4. Back in Vercel, wait until both domains show **Valid Configuration**. It usually takes a few minutes and can take up to a day. Vercel sets up HTTPS by itself.

### 3. Tell the site its address and contact email

1. In Vercel, go to **Settings**, then **Environment Variables**.
2. Add these two variables for **Production**:
   - `NEXT_PUBLIC_SITE_URL` set to `https://your-domain`, with no slash at the end.
   - `NEXT_PUBLIC_CONTACT_EMAIL` set to the email address people should write to about their data. It appears on the privacy policy and terms. A new address such as `hello@your-domain` is best.
3. Go to **Deployments**, open the latest one, click **⋯**, then **Redeploy**.

### 4. Let sign-in work on the new address

1. In Supabase, open the project, then **Authentication**, then **URL Configuration**.
2. Set **Site URL** to `https://your-domain`.
3. Under **Redirect URLs**, add `https://your-domain/**`. Keep the existing `vercel.app` entries so previews keep working.
4. In Google Cloud Console, open **APIs & Services**, then **Credentials**, then the OAuth client used for sign-in:
   - Add `https://your-domain` to **Authorized JavaScript origins**.
   - Leave the redirect URI as it is; it points at Supabase.
5. Still in Google Cloud, open the **OAuth consent screen** and fill in:
   - Home page `https://your-domain`.
   - Privacy policy `https://your-domain/privacy`.
   - Terms `https://your-domain/terms`.
   - Add the domain under **Authorized domains**.

### 5. Switch on analytics

1. In Vercel, open the project and click the **Analytics** tab.
2. Click **Enable**. The free plan is enough to start. Visits appear after the next deploy.

### 6. Know where errors show up

- In Vercel, open **Logs** and search for `client-error` or `server-error`.
- On the free Hobby plan, logs are kept only briefly. If you move to Pro, you can add a log drain, or a service such as Sentry, to keep them longer and get emails on new errors. Ask Claude to add Sentry when you want it.

### 7. Make the database launch-ready

1. **Upgrade Supabase to Pro before launch** (about US$25 a month):
   - Free projects pause after a week with no visits, which would break every invitation link.
   - Pro also keeps daily backups.
   - Where: Supabase, then **Organization**, then **Billing**.
2. **Run the pending SQL files**, if you haven't already. They are in the project files:
   - `step12a-card-languages.sql`
   - `step12a-new-designs-seed.sql`

   To run each one: Supabase, then **SQL Editor**, then **New query**, paste the file, then **Run**.

3. Check that the project's region is **Mumbai (ap-south-1)**. It is, and the privacy policy says so.

### 8. Real text messages for sign-in codes

Phone sign-in now uses a test number. Real SMS in India needs DLT registration:

1. Register the business and a sign-in message template on a DLT portal (Jio, Airtel or Vodafone Idea). The SMS provider can help with this.
2. Choose a provider that Supabase supports, such as Twilio, MessageBird or Vonage. For Indian providers such as MSG91, use Supabase's **Send SMS hook**. Ask Claude to set this up.
3. In Supabase, go to **Authentication**, then **Sign In / Providers**, then **Phone**. Enter the provider's details and remove the test numbers.

### 9. Waitlist sign-ups

Set `WAITLIST_WEBHOOK_URL` in Vercel's environment variables to where waitlist entries should go, for example a Google Sheet through Apps Script or Zapier. Until it is set, entries are only written to the logs.

### 10. Legal

1. Have a lawyer familiar with the DPDP Act read `/privacy` and `/terms` in both languages. The pages are written in plain words, but they are not legal advice.
2. The contact email from step 3 is also where requests to see, correct or delete data arrive. Reply within 7 working days, as the policy promises.
3. Hosts can delete their own account from **Profile**, using **Delete account**. It removes every invite they own, with its photos, guest list and replies. It needs `SUPABASE_SERVICE_ROLE_KEY` set in Vercel, which it already is.
4. If someone asks by email instead, do it for them:
   - Open Supabase, then **Authentication**, then **Users**.
   - Find the person, then choose **⋯** and **Delete user**.
   - Photos stay in **Storage** under the invite's id; delete that folder too.

### 11. Search engines

This carries over from Step 12b:

1. Add the domain in Google Search Console and Bing Webmaster Tools.
2. Verify it with the DNS record each one gives you.
3. Submit `https://your-domain/sitemap.xml`.

### 12. Try it on real phones

Follow the checklist in [QUALITY.md](QUALITY.md) on a low-end Android phone and an iPhone, using the live domain.
