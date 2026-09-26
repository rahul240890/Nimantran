# Shubhdwar — brand and SEO plan

**Decision (26 September 2026):** the product is named **Shubhdwar** (शुभद्वार, "auspicious doorway"). "Nimantran" stays only as the repository name and in history.

Build steps: owner task B1 (secure the name), Step 8a (rename in code), Step 12b (SEO foundations), and ASO in Step 33. See [PLAN.md](PLAN.md).

---

## 1. Why not "Nimantran"

The name is already used by several invitation products, including a direct competitor:

| Product                                                                                                                                                                     | What it is                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [NIMNTRN](https://nimntrn.com/digital-invitation)                                                                                                                           | Interactive invitations with RSVP, maps, schedules and WhatsApp sharing; run by a registered company; claims 500+ couples |
| [nimantran.app](https://nimantran.app/)                                                                                                                                     | Digital invitation site                                                                                                   |
| [Nimantran (निमंत्रण) on Google Play](https://play.google.com/store/apps/details?id=com.argames.nimantran&hl=en_US)                                                         | Code-based digital invitation app                                                                                         |
| [nimantraninvitation.com](https://www.nimantraninvitation.com/), [nimantran.info](https://nimantran.info/), [Kerala studio](https://nimantranm-kerala-invites.lovable.app/) | Other invitation businesses                                                                                               |

Searches for our name would land on competitors, and trademark protection would be weak. Other common words for invitation are crowded too ("Nyota": [Nyota Invite](https://play.google.com/store/apps/details?id=com.kpro.nyota&hl=en_IN), [thenyota.app](https://thenyota.app/features/), [Pehla Nyota](https://pehlanyota.com/)).

A search on 26 September 2026 found no invitation product named Shubhdwar. That is not a legal check; task B1 does that.

## 2. The name

|               |                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Name          | Shubhdwar                                                                                                    |
| Devanagari    | शुभद्वार                                                                                                     |
| Meaning       | _Shubh_ (auspicious) + _dwar_ (door, gateway)                                                                |
| Say it        | shubh-dwaar                                                                                                  |
| Spelling rule | Always **Shubhdwar**, one word, capital S only. Never "Shubh Dwar", "ShubhDwar" or "Shubhdwaar" in our copy. |
| Other scripts | To be written by native speakers in Step 12 (Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Gurmukhi) |

**Why it fits:** the gate-fold card literally opens like doors; the toran and decorated doorway are how Indian homes welcome guests in every region; it works for weddings, griha pravesh, festivals and every later category; it is unique enough to own in search and to trademark.

### Taglines (pick one; test with users)

- "Open the doors to your celebration."
- "Every celebration begins at the door."
- "Invitations that open like doors." (describes the product; good for ads)
- Hindi: "शुभ शुरुआत, शुभद्वार से।"

### Visual identity notes

- Keep the mandala; consider placing it inside a doorway arch or toran for the logo mark.
- The opening-doors animation is the signature brand moment: use it in the logo animation, app splash and ads.
- Palette, fonts and tokens stay as they are.

## 3. Owner task B1: secure the name (before Step 8a)

Only the owner can do these; code sessions should not rename until this is done or the owner says go.

- [ ] Domains: `shubhdwar.com`, `shubhdwar.in`, and optionally `shubhdwar.app`; the common misspellings `shubhdwaar.com` and `shubh-dwar.com` redirecting to the main site
- [ ] Trademark search and filing on the IP India registry, classes 9 (software, apps), 35 (online advertising and business services), 42 (software as a service); consider 16 (printed cards) for the print line
- [ ] Handles: Instagram, YouTube, Facebook, X, LinkedIn, Pinterest, WhatsApp Business
- [ ] Google Play developer account and App Store name reservation for "Shubhdwar"
- [ ] Email: hello@, support@, and a sending domain for invites and reminders
- [ ] Google Search Console and Bing Webmaster Tools verified for the main domain

## 4. Step 8a: rename in code

**Done 26 September 2026** (details under Step 8a in PLAN.md). Email and SMS templates and the "Made with Shubhdwar" watermark use `site.name` when they are built.

After B1 (or the owner's go-ahead):

- `src/lib/site.ts`: name "Shubhdwar", tagline, description, production URL
- Logo wordmark, favicon, app icons, Open Graph image (`src/app/opengraph-image.tsx`), link-preview text
- All user-facing copy in `src/content`, page titles and metadata, email and SMS templates, the watermark text on free invites ("Made with Shubhdwar")
- README and docs titles (keep the repository name `nimantran` unless the owner renames it on GitHub)
- Tests that assert on the product name
- Screenshot and review pages refreshed

The repository, database and package names can stay "nimantran"; users never see them.

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

- [ ] `sitemap.ts` covering landing, template, tradition, category and blog pages in every language
- [ ] `robots.ts` allowing public pages and blocking private areas (`/account`, `/create`, `/invites`, `/auth`)
- [ ] **Guest invitation pages (`/i/…`) are `noindex, nofollow`** and excluded from the sitemap, so family names, addresses and dates never appear in search; link previews (Open Graph) still work for WhatsApp
- [ ] Unique title (under 60 characters) and description (under 155) for every public page, in its language
- [ ] Structured data (JSON-LD): Organization, WebSite, SoftwareApplication (with Offer prices), FAQPage on landing pages, BreadcrumbList, and ItemList on template galleries
- [ ] Canonical URLs on every page; no duplicate pages across filters
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

- Every free invite shows "Made with Shubhdwar" with a link to the matching template page.
- Every guest page ends with "Create your own invitation" (without exposing the family's details to search).
- Share-ready template previews for Instagram and Pinterest, each linking back to its template page.

## 7. App store optimisation (Step 33)

- **Google Play title (30 characters):** "Shubhdwar: Wedding Card Maker" (29)
- **App Store name / subtitle:** "Shubhdwar" / "3D Wedding Invitation & RSVP"
- Short description and keywords from the core, Hindi and ceremony clusters
- Screenshots in English and Hindi first, then each launch language; the opening-doors animation as the preview video
- Localised store listings for every launch language

## 8. Measuring

- Search Console: impressions and clicks per cluster and language, monthly
- Analytics: sign-ups and paid invites by landing page
- Target for the first 6 months after launch: every cluster in section 5 has a live page, and the brand name ranks first for "Shubhdwar" searches
