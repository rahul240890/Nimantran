# Shubh Invitation — brand and SEO plan

**Decision (27 September 2026):** the product is named **Shubh Invitation**, called **Shubh** for short and in the app. It replaces Shubhdwar (26 September 2026), which replaced Nimantran. "Nimantran" stays as the repository name; "Nimantran" and "Shubhdwar" stay in history and in a few hidden keys (section 4).

Build steps: owner task B1 (secure the name), Step 8b (rename in code), Step 12b (SEO foundations), and ASO in Step 33. See [PLAN.md](PLAN.md).

---

## 1. The brand

|                  |                                                                                                                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App name         | Shubh                                                                                                                                                                                                                                                                                  |
| Full brand name  | Shubh Invitation                                                                                                                                                                                                                                                                       |
| Website name     | Shubh Invitation                                                                                                                                                                                                                                                                       |
| Domain (planned) | `shubhinvitation.com`, not yet bought. The live address comes from `NEXT_PUBLIC_SITE_URL`, so nothing in the code points at it until the owner sets that                                                                                                                               |
| Tagline          | Invitations That Come Alive. (in running copy: "Invitations that come alive.")                                                                                                                                                                                                         |
| Second tagline   | Create. Invite. Celebrate.                                                                                                                                                                                                                                                             |
| Hindi            | शुभ इन्विटेशन; tagline "निमंत्रण, जो जीवंत हो उठें।"                                                                                                                                                                                                                                   |
| Meaning          | _Shubh_ is an auspicious, beautiful beginning. The product is not limited to Indian weddings: weddings, birthdays, anniversaries, baby showers, engagements, festivals, parties, graduations, corporate events, religious occasions and every other celebration, anywhere in the world |

**Positioning:** Shubh is an AI-powered interactive invitation platform for creating beautiful digital, animated and 3D invitations for every occasion.

**App store description:** "Shubh — Create beautiful invitations for every celebration. Design personalized digital, animated and immersive 3D invitations with AI, then share them instantly with friends, family and guests anywhere in the world."

### How to write the name

- Full name: **Shubh Invitation**, two words, capital S and capital I. Use it in page titles, link previews, legal text and the first mention on a page.
- Short name: **Shubh**. Use it in short everyday copy: "Sign in to Shubh", "Welcome to Shubh", "Made with Shubh".
- In code: `site.name` is the full name, `site.shortName` is Shubh, `site.nameDevanagari` is the Hindi name (`src/lib/site.ts`).
- Hindi copy always uses the full name, शुभ इन्विटेशन, because शुभ alone reads as the adjective "auspicious" inside a sentence.
- Never "ShubhInvitation", "Shubh Invitations" or "Shubh-Invitation" in our copy.

### Logo and icon

- **Lockup:** SHUBH above a smaller "Invitation", never both at the same weight. SHUBH in Rozha One, uppercase with wide tracking; "Invitation" in Tenor Sans, small, muted. The mark sits to the left (`src/components/brand/logo.tsx`).
- **Mark:** a card rising from an open envelope, an S on the card and a celebration sparkle. It is the same idea as the app icon and belongs to no religion or region. The vector version (`src/components/brand/brand-mark.tsx`) follows the theme colours; the painted app icon (navy envelope, ivory card, gold S) is the favicon, the app icons and the link-preview badge (`src/app/icon.png`, `apple-icon.png`, `favicon.ico`, `public/brand/shubh-icon.png`).
- The site palette, fonts and tokens stay as they are. The mandala remains an ornament in themes and the footer, no longer the brand mark.

## 2. Earlier names

- **Nimantran** (until 26 September 2026): already used by several invitation products, including a direct competitor ([NIMNTRN](https://nimntrn.com/digital-invitation), [nimantran.app](https://nimantran.app/), [a Google Play app](https://play.google.com/store/apps/details?id=com.argames.nimantran&hl=en_US) and others), so searches would land on competitors and a trademark would be weak.
- **Shubhdwar** (26 to 27 September 2026): "auspicious doorway". Replaced by Shubh Invitation because the product now serves every occasion worldwide, not only Indian weddings, and "Shubh" is easier to say and remember.

## 3. Owner task B1: secure the name

Only the owner can do these. A web search is not a legal check; the trademark search below is.

- [ ] Domains: `shubhinvitation.com` (main), and optionally `shubhinvitation.in` and `shubhinvitation.app` redirecting to it; then set `NEXT_PUBLIC_SITE_URL` in Vercel
- [ ] Trademark search and filing on the IP India registry for "Shubh Invitation" and the icon, classes 9 (software, apps), 35 (online advertising and business services), 42 (software as a service); consider 16 (printed cards) for the print line. "Shubh" alone is a common word, so the full name and the icon are what can be protected
- [ ] Handles: Instagram, YouTube, Facebook, X, LinkedIn, Pinterest, WhatsApp Business
- [ ] Google Play developer account and App Store name reservation for "Shubh Invitation" (app name shown under the icon: "Shubh")
- [ ] Email: hello@, support@, and a sending domain for invites and reminders
- [ ] Google Search Console and Bing Webmaster Tools verified for the main domain

## 4. Step 8b: rename in code

**Done 27 September 2026** (details under Step 8b in PLAN.md). Email and SMS templates and the "Made with Shubh" watermark use `site.shortName` or `site.name` when they are built.

Kept on purpose, because users never see them and changing them would lose data or break links: the repository name `nimantran`, the Vercel address, the database, the browser keys `shubhdwar-locale` and `shubhdwar-rsvp:`, the calendar event ids (`…@shubhdwar`, so calendars update an event instead of adding a copy), and the `SHUBHDWAR_AUTH_PREVIEW` switches.

## 5. Keyword plan

Search volumes are **not yet measured**. Check every cluster in Google Keyword Planner and Search Console before writing pages, and have native speakers confirm regional spellings.

| Cluster            | Example keywords                                                                                                                                                                            | Landing page                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Core (English)     | wedding invitation card maker, digital wedding invitation, e-invite, online invitation card, wedding video invitation, invitation with RSVP, save the date                                  | `/` and `/wedding-invitation-maker`                     |
| Hindi and Hinglish | shaadi card, shadi ka card online, शादी कार्ड, निमंत्रण पत्र, विवाह निमंत्रण                                                                                                                | `/hi/shaadi-card`                                       |
| Regional           | Marathi lagna patrika, Gujarati kankotri, Tamil kalyana pathirikai, Telugu pelli patrika, Bengali biye card, Punjabi wedding card, Malayalam wedding invitation, Kannada wedding invitation | one page per language, written in that language         |
| Tradition          | Ganesh wedding card, Muslim wedding card, Nikah invitation, Sikh Anand Karaj invitation, Christian wedding invitation, Jain wedding card                                                    | `/traditions/<pack>` (from TRADITIONS.md)               |
| Ceremony           | haldi invitation, mehendi invitation, sangeet invitation, engagement invitation, reception invitation, roka invitation                                                                      | `/invitations/<function>`                               |
| Other occasions    | griha pravesh invitation card, birthday invitation, baby shower invitation, naming ceremony invitation, puja invitation, Diwali party invitation                                            | `/invitations/<category>` (from the category catalogue) |
| Features           | 3D invitation, animated wedding card, WhatsApp wedding invitation, RSVP tracker for wedding, guest list manager                                                                             | feature sections and `/features`                        |
| Comparison         | Paperless Post alternative India, video invitation vs digital card                                                                                                                          | comparison pages (later)                                |
| Business           | invitation maker for wedding planners, white-label e-invites                                                                                                                                | `/business` (Phase 5)                                   |

## 6. Step 12b: SEO foundations

### URL and page structure

- Landing pages generated from data: categories (`src/lib/categories`), tradition packs, functions and languages, so each new pack or category adds a page automatically.
- Every template gets an indexable page with a real preview image, its categories and traditions, and a "Use this design" button.
- Language versions under `/<locale>/…` with `hreflang` links between them and an `x-default`.
- Clean, readable slugs in English transliteration; page text in the page's language.

### Technical checklist (Next.js metadata APIs)

- [x] `sitemap.ts` covering landing, template, tradition, category and blog pages in every language
- [x] `robots.ts` allowing public pages and blocking private areas (`/account`, `/create`, `/invites`, `/auth`)
- [x] **Guest invitation pages (`/i/…`) are `noindex, nofollow`** and excluded from the sitemap, so family names, addresses and dates never appear in search; link previews (Open Graph) still work for WhatsApp
- [x] Unique title (under 60 characters) and description (under 155) for every public page, in its language
- [x] Structured data (JSON-LD): Organization, WebSite, SoftwareApplication (with Offer prices), FAQPage on landing pages, BreadcrumbList, and ItemList on template galleries
- [x] Canonical URLs on every page; no duplicate pages across filters
- [ ] Open Graph and X card images per page type
- [ ] Core Web Vitals within Google's "good" range on mobile (the quality bar's Lighthouse 90+ covers most of this); the 3D scene loads after the content so text is crawlable
- [ ] Images with descriptive alt text in the page's language
- [ ] Search Console and Bing connected; sitemap submitted

### Content plan (starts with Step 12b, continues after launch)

- Wording guides per language and tradition (for example "Bengali wedding card wording with samples"), linking to the matching tradition page
- Ceremony explainers (what happens at a Gaye Holud, a Nalangu, a Jaggo) with invitation examples
- Seasonal guides: muhurat dates for the wedding season, Diwali party invitations, griha pravesh dates
- "How to send a wedding invitation on WhatsApp" and "digital vs printed cards" guides
- Two to four articles a month, each reviewed by a native speaker for its language

### Built-in growth

- Every free invite shows "Made with Shubh" with a link to the matching template page.
- Every guest page ends with "Create your own invitation" (without exposing the family's details to search).
- Share-ready template previews for Instagram and Pinterest, each linking back to its template page.

## 7. App store optimisation (Step 33)

- **Google Play title (30 characters):** "Shubh: Invitation Maker" (23)
- **App Store name / subtitle:** "Shubh Invitation" / "Invitations That Come Alive"
- Short description and keywords from the core, Hindi and ceremony clusters
- Screenshots in English and Hindi first, then each launch language; the opening-doors animation as the preview video
- Localised store listings for every launch language

## 8. Measuring

- Search Console: impressions and clicks per cluster and language, monthly
- Analytics: sign-ups and paid invites by landing page
- Target for the first 6 months after launch: every cluster in section 5 has a live page, and the brand name ranks first for "Shubh Invitation" searches
