# Theme paintings on Cloudflare R2

Owner, 2026-11-20: to cut the hosting bill. `public/suites`, `public/openings` and `public/cards`
are about 600 MB, and Vercel bills every deployment for carrying them. Cloudflare R2 keeps one copy,
is free up to 10 GB, and charges nothing for downloads.

The files stay in this repository; it is still where paintings are added and changed. Each
production build copies new or changed files to R2 (`scripts/media-sync.mjs`) and then leaves the
folders out of the deployment, all but each theme's `preview.jpg`, which the link previews read from
disk. Nothing is deleted from R2, so a rollback to an older deployment still shows its paintings.
Without `NEXT_PUBLIC_MEDIA_URL` the site serves the paintings itself, exactly as before.

How the site reaches them (`src/lib/media.ts`): the `Image` component asks for the R2 address
directly, and `next.config.ts` redirects any other `/suites/…`, `/openings/…` or `/cards/…`
request to R2, so code that names a painting by its path keeps working.

## Setup (once)

1. **Cloudflare account and R2.** Sign up at dash.cloudflare.com, open **R2 Object Storage** and
   turn it on (the free plan asks for a card but charges nothing under 10 GB).
2. **Bucket.** Create a bucket named `shubh-media`, location Asia-Pacific.
3. **Public address.** In the bucket's **Settings › Custom Domains**, connect
   `media.shubhinvitations.com`. This needs the domain's DNS on Cloudflare: if it isn't, add the
   site in Cloudflare (free plan), keep every DNS record it imports (the Vercel ones especially), and
   change the nameservers at the registrar to the two Cloudflare gives. The `r2.dev` address is rate
   limited and not meant for a live site.
4. **CORS.** In the bucket's **Settings › CORS Policy**, paste:

   ```json
   [
     {
       "AllowedOrigins": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 86400
     }
   ]
   ```

   The video maker and the blurred previews fetch paintings from scripts, which needs this.

5. **Upload key.** In **R2 › Manage API tokens**, create a token with **Object Read & Write** on
   `shubh-media` only. Note the Access Key ID, the Secret Access Key, and the Account ID.
6. **Vercel.** In the project's **Settings › Environment Variables**, for Production only, add
   `NEXT_PUBLIC_MEDIA_URL` = `https://media.shubhinvitations.com`, `R2_ACCOUNT_ID`,
   `R2_BUCKET` = `shubh-media`, `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`. Check
   **Settings › Build and Deployment › Build Command** is the default (`npm run build`): a
   build with `NEXT_PUBLIC_MEDIA_URL` set that skipped the copy step stops with an error
   (`next.config.ts`).
7. **Redeploy** production. The first build uploads all ~6,200 files, which takes a few minutes;
   later builds upload only what changed.

If R2 can't be reached, the keys are wrong or the CORS rule is missing, the build fails and the live
site stays on its last deployment. To go back to serving the paintings from Vercel, delete
`NEXT_PUBLIC_MEDIA_URL` and redeploy.
