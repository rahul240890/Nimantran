# Shubhdwar — Build Plan

3D invitations with RSVP and guest tools. Web first (works from any WhatsApp link), wrapped as Android/iOS apps later.

**Documents:** [PRODUCT.md](PRODUCT.md) (full feature catalogue: categories, formats, templates, languages, editions, pricing, add-ons) · [MEMORIES.md](MEMORIES.md) (3D gifts) · [COMPETITORS.md](COMPETITORS.md) (Paperless Post and the Indian market) · [TRADITIONS.md](TRADITIONS.md) (regional and religious tradition packs) · [BRAND_SEO.md](BRAND_SEO.md) (name, keywords, SEO) · [MOTION.md](MOTION.md) (regional animation) · [PAYMENTS.md](PAYMENTS.md) (shagun, contributions, tickets) · [PRICING.md](PRICING.md) (personal and business plans) · [PLAN_REVIEW.md](PLAN_REVIEW.md) (open recommendations).

We build one step at a time. Each step ends with working, reviewed code pushed to GitHub. Nothing moves forward with known UI bugs.

---

## UI quality bar (applies to every step)

Every screen must pass all of these before a step is marked done:

- **Responsive:** works from 320px phones to 1440px desktops. No horizontal scroll, no clipped text, no overlapping elements.
- **Themes:** light and dark both designed, not auto-inverted.
- **Accessibility:** WCAG 2.2 AA contrast, full keyboard use, visible focus, screen-reader labels, 44px minimum touch targets.
- **Motion:** smooth 60fps animation; `prefers-reduced-motion` respected.
- **Performance:** Lighthouse 90+ on mobile; invite page usable on slow 3G and low-end Android; lighter 2D fallback when WebGL is weak or missing.
- **States:** every screen has loading, empty, error and success states designed. No blank screens, no raw error text.
- **Forms:** inline validation with clear messages, no data lost on refresh or back.
- **Languages:** no hard-coded text; every string goes through translations; layouts tested with long Tamil/Malayalam text and right-to-left Urdu.
- **Consistency:** only design-system components and tokens; no one-off colours or spacing.
- **Testing:** type-check, lint, unit tests for logic, Playwright end-to-end tests for key flows, visual checks at phone and desktop widths.

---

## Tech stack

| Layer                | Choice                                                                |
| -------------------- | --------------------------------------------------------------------- |
| Framework            | Next.js 16 (App Router), React 19, TypeScript (strict)                |
| Styling              | Tailwind CSS v4 with design tokens                                    |
| UI primitives        | Radix UI (accessible dialogs, menus, selects)                         |
| 3D                   | Three.js via React Three Fiber + Drei                                 |
| Animation            | Motion (Framer Motion) for UI                                         |
| Forms and validation | React Hook Form + Zod                                                 |
| Backend              | Supabase (Postgres, Auth with phone OTP, Storage, Row Level Security) |
| Translations         | next-intl                                                             |
| Payments             | Razorpay (India), Stripe (global)                                     |
| AI                   | Claude API (wording), image API (couple art)                          |
| Testing              | Vitest, Testing Library, Playwright                                   |
| Hosting              | Vercel                                                                |

---

## Product lines

Learned from competitor research (see _Research_ at the end). All lines share one engine, one account, one category system and one checkout.

| Line           | What it is                                                           | Arrives            |
| -------------- | -------------------------------------------------------------------- | ------------------ |
| 3D Invitations | The core product: interactive 3D cards with RSVP                     | Phase 1            |
| Event Pages    | Free, fast, text-first event page with RSVP for casual get-togethers | Phase 1 (Step 11a) |
| Memories       | 3D gifts: star map, travel globe, floating gallery                   | Phase 2b           |
| Greeting Cards | Thank-you, festival, shagun and condolence cards                     | Phase 3 (Step 24a) |

New steps added after work began carry a letter (5a, 11a …) so existing step numbers never change.

---

## Phase 0 — Foundation

**Step 1. Project setup** ✅
Next.js + TypeScript strict + Tailwind v4, folder structure, linting, formatting, type-check scripts, fonts, base tokens, branded holding page.

**Step 2. Design system** ✅
Colour, type, spacing, radius and shadow tokens; light and dark themes. Core components: Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, DatePicker, TimePicker, Card, Sheet/Dialog, Toast, Tabs, Badge, Avatar, Skeleton, EmptyState, Stepper. A `/design` page showing every component in every state.
Added with the owner's approval: a motion and depth layer (3D tilt with light on invitation cards, gold shimmer, buttons that press in, page transitions) with a still version for reduced motion.

**Step 3. App shell and landing page** ✅
Header, footer, navigation, theme toggle, language switcher. Marketing landing page with live 3D hero, how-it-works, templates preview, pricing preview, FAQ.
Added with the owner's approval: a waitlist sign-up, a hero that opens as you scroll and turns under a finger (with a lighter version for slow phones and a still one for reduced motion), and a pricing preview that shows only "Free to start, premium from ₹499" until payments are built.

---

## Phase 1 — MVP (weddings in India)

**Step 4. 3D invitation engine** ✅
Port the prototype into React Three Fiber. Card formats as components (gate-fold first). Themes, petals, lanterns, music. Automatic quality levels and 2D fallback.
Built as: a 2D card that paints at once, with the WebGL scene loaded behind it only on devices that can draw it; six themes matching the launch designs; music composed live in the browser from a raga (no audio downloads); a `/engine` review page.

**Step 5. Template system** ✅
Template data schema (scene, colours, fonts, music, text slots). First 6 templates: Marigold Gate, Rose Garden, Emerald Palace, Royal Scroll, Minimal Monogram, Kerala Kasavu.
Built as: a Zod-checked template schema with validated text slots; ornaments stored as vector data so the 2D card and the 3D card draw identical art; one word layout shared by both; each design with its own ornaments, stock, type and raga (six ragas); a `/templates` review page. All six open as gate-folds for now.

**Step 5a. Category system** ✅
Categories stored as data: name in every language, icon, season, region, default functions and RSVP questions. One template can belong to many categories. Seasonal and regional ordering on the home screen (Onam first in Kerala in August, Durga Puja in Bengal in October). Launch with the wedding journey (roka, engagement, haldi, mehendi, sangeet, wedding, reception, save-the-date); other categories are added as data in Step 23.
Built as: a Zod-checked category schema and catalogue (`src/lib/categories`) naming each occasion in all ten launch languages; a scoring rank (priority + season + region, with a bonus for a short-lived occasion in its own place and time); an "Occasions" section on the home screen printed on each occasion's best design, with the visitor's state read from the host's location header into a cookie and names shown in the local script; an Occasion step first in the editor that plans the occasion's functions, uses its card wording and lists its designs first. Roka and engagement joined the functions; a save-the-date asks only for a date and a city. Indian-language names await a native speaker's review in Step 12.

**Step 6. Invite editor** ✅
Step-by-step editor: choose category and template → couple details → functions (roka, haldi, mehendi, sangeet, wedding, reception) with date, time, venue, dress code → photos and music → preview. Live 3D preview beside the form; autosave drafts.

**Step 7. Accounts** ✅
Phone OTP and Google sign-in via Supabase. Profile, my invites list.
Built as: `/sign-in` (mobile number with a 6-digit SMS code that fills itself from the SMS, or Google), `/account` (name and preferred language), `/invites` (My invites) and an account menu in every header. All sign-in calls go through `src/lib/auth/server.ts`; the proxy keeps the Supabase session fresh and sends signed-out visitors to sign in and back. A small readable cookie tells static pages who is signed in without a request. Without Supabase keys the site says accounts open soon; tests and local work use a preview mode (any number, code 123456) that can never run on the live site.

**Step 8. Database and security** ✅
Tables: users, events, event_hosts (co-hosts), functions, categories, templates, guests, rsvps, rsvp_questions, scheduled_sends, media. Row Level Security so hosts and co-hosts see only their own events. Migrations and seed data.
Built as: `supabase/migrations` (profiles for users, created on sign-up; events with their hosts, co-host invitations, functions, guests with a private link token each, custom RSVP questions per event or function, replies, scheduled sends and media, plus a private `event-media` storage bucket) and `supabase/seed.sql`, generated from the category and template catalogs with `npm run db:seed`. Every table has row level security: hosts and co-hosts reach only their own events, co-hosts can't remove the owner, and the public can read only the catalog. `src/lib/db/schema.test.ts` runs the real migrations in an in-memory Postgres (PGlite) and checks each rule as two different people. The editor now saves each invite to the account a moment after every change (the header says "Saved to your account"), My invites lists them on every device with delete, and a draft made before signing in moves into the account when it's opened. Photos stay on the device until Step 9 uploads them. Setup: `supabase/README.md`.

**Review of Steps 1–8** ✅
Before Step 9, every page was checked at 320px to 1440px in both themes. Fixed: the header wrapping at 1280px after Sign in was added (the theme choice is now one menu button), and the editor widening the page on phones (the Design step's button bar). Added a "Hear an invitation" strip under the home header that plays each design's raga, and pointed the main buttons at the editor now that it saves to accounts. Database: migration `20260926170000_traditions_ready.sql` lets functions use any ceremony id with a local name and an end time (muhurtham windows), gives events a tradition, one or two card languages and religious elements, and pins the search path on three helper functions.

**Owner task B1. Secure the name "Shubhdwar"** (owner only, before Step 8a)
Domains, IP India trademark search and filing (classes 9, 35, 42), social handles, app store names, email and Search Console. Checklist in [BRAND_SEO.md](BRAND_SEO.md), section 3.

**Step 8a. Rename to Shubhdwar**
The product name changes from Nimantran to Shubhdwar before any public share links exist (decided 26 September 2026; reasons in BRAND_SEO.md). Site config, logo wordmark, favicon and icons, Open Graph image, all copy and metadata, watermark text, email and SMS templates, docs titles, tests. Repository, database and package names can stay `nimantran`. Start once task B1 is done or the owner says go.

Built as (the owner said go on 26 September 2026): `site.name` is Shubhdwar with the Devanagari name beside it, a new doorway mark (the mandala inside an arch) in the logo, favicon, app icons and link-preview image ("Invitations that open like doors."), and every page, message, test and doc says Shubhdwar. Kept on purpose: the repository, the Vercel address, the database, and browser storage keys (renaming those would wipe drafts people already have). The preview sign-in switch is now `SHUBHDWAR_AUTH_PREVIEW`.

**Step 9. Publish, share and schedule**
Unique link (`/i/aarav-weds-meera`), WhatsApp share, rich link preview image (Open Graph), QR code, add-to-calendar. Scheduled sending per function (email and SMS).

Built as: **Publish** on the editor's last step picks the link (suggested from the names, checked as you type, with free alternatives when taken) and puts the invite live; the link never changes once shared, and **Stop sharing** takes it down. The share page (`/invites/<id>/share`) has the link, an editable message, WhatsApp, the phone's share sheet, a preview of how WhatsApp shows it, and a QR code to download for print. Guests open `/i/<slug>` without signing in: the 3D card with its music, each function with date, venue, dress code, Google Maps directions and add-to-calendar (Google, or an .ics file for Apple and Outlook; times are India Standard Time), and the photos. Each invite gets its own link-preview image in its design's colours. Guest pages are `noindex`. Photos now upload to the private `event-media` bucket as soon as they're added (signed in), follow the host to other devices, and reach guests through short-lived links. Migration: `20260926180000_publish.sql`. **Not yet:** scheduled sending by email and SMS waits for the decision to move it after launch, and needs an email and SMS provider.

**Step 10. Guest experience and RSVP**
Guest opens link → 3D card → function tabs, maps, dress code → one-tap RSVP per function with guest count, plus-ones, message and the host's custom questions (meal choice, arrival date, room needed, pickup from station). Works without login. Muhurat and lagna times show exactly as written (a window when the host gives an end time), and two-language invites get a language toggle, ready for tradition packs.

Built as: the guest page (`/i/<slug>`) ends with **Will you join us?**, reached from a **Reply to the invitation** button under the card. Guests give their name, choose Joyfully accept, Not sure yet or Regretfully decline for each function (or **Coming to everything**), count adults and children with steppers, answer the host's questions and leave a note, all without signing in. The first reply returns a private key kept on the phone, so coming back shows the reply with **Change my reply**; a personal link with `?g=<token>` does the same, ready for Step 11's guest list. Hosts choose the questions in the editor's Photos & music step (meal, arrival date, room, pickup, a song request; defaults come from the occasion), and the share page shows replies: head counts per function and the latest guests with their notes. Replies go through two database functions that check the invite is live and every function is its own; guests can never read the guest list or other replies. Migration: `20260926190000_rsvp.sql`. **Not yet:** muhurat end times and the two-language toggle arrive with the tradition packs (Step 12a), which add those fields to the editor; the functions are shown as cards rather than tabs, which read better on phones with two to five functions.

**Step 11. Host dashboard and co-hosts**
Live guest list, opened/replied/pending counts, filters, search, CSV export, edit after publishing. Invite co-hosts (both families) to manage one event and guest list. Automatic reminders to guests who haven't replied (email and SMS; WhatsApp in Step 22).

Built as: **Guests** on each invite in My invites (and **Open guest list** on the share page) opens `/invites/<id>`: guests, opened, replied and waiting at the top, head counts per function (children counted separately), then the guest list with search (name, group or number), filters (coming, maybe, can't come, waiting, not opened) and a function filter. Hosts add one guest (name, WhatsApp number, group, how many people, which functions) or paste a whole list from their notes ("Sharma uncle, 98765 43210 (4)"); guests who reply from the shared link join the list by themselves. Each guest has a personal link (`?g=<token>`) sent from the host's own WhatsApp, straight to their number; opening it marks them opened. **Reminders** lists everyone who hasn't replied, each with a WhatsApp button and an editable message, and records when they were reminded. **Download CSV** gives the whole list with every reply, the host's questions and personal links, safe to open in Excel. **Co-hosts**: the owner makes a private single-use link (labelled, for example "Meera's family") and sends it on WhatsApp; whoever opens it and signs in joins, sees the same dashboard and can edit the invite; the owner can withdraw links and remove co-hosts, and co-hosts can leave. Edits after publishing go live straight away through **Edit invite**. Migration: `20260926200000_host_dashboard.sql`. **Not yet:** automatic reminders by SMS and email need an SMS provider with DLT registration (owner task); bulk WhatsApp sending is Step 22.

**Step 11a. Event Pages (free line)** (moved to after launch, 26 September 2026)
Fast, text-first event page with cover image, details and RSVP, using the same guest tools. Upsell to a 3D invitation.

**Step 12. Languages**
next-intl setup; English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi. Two-language invites with guest toggle.

Built as: the whole site in **English and Hindi**. The home page lives at `/` and `/hi`, both static; every other page (sign-in, account, My invites, the editor, share page, guest list, co-host join, and the guest's invitation page) follows the visitor's choice, saved in a cookie, or else their phone's language. A language menu in the header (inside the menu on phones and tablets) and on account pages switches in place; saving English or Hindi as the profile language switches too. Copy lives in typed dictionaries (`src/content/*.ts` and `src/content/hi/*.ts`, joined in `src/i18n/copy.ts`), so a missing or misshapen Hindi string fails the type check; this replaces next-intl, which needed a language segment in every address and would have made the home page dynamic. Dates, times and "3 days ago" follow the language, as do occasion names, WhatsApp messages, calendar entries and the CSV headings. Devanagari uses Noto Sans Devanagari under Karla, with small labels in normal case. A bilingual page answers unknown addresses. The review pages (`/design`, `/engine`, `/templates`) stay in English. **Not yet:** the other eight languages show as "Soon" in the menu until a native speaker proofreads each, and the Hindi also needs that proofread before launch; two-language invitation cards with a guest toggle arrive with the tradition packs in Step 12a, which supply the card wording.

**Step 12a. Tradition packs**
Regional and religious customisation from one choice (spec: [TRADITIONS.md](TRADITIONS.md)). Tradition pack schema and catalogue; a Tradition step after Occasion (region, community, card languages, live previews); religious-elements panel (deity or symbol, invocation, shloka or verse, optional chant); wording panel with labelled blocks (blessings, hosts, requesters, Swagatotsuk, children's line); ceremony lists with local names; respect rules enforced by tests. First six packs: North Indian Hindu, Rajasthani/Marwari, Marathi, Gujarati, Bengali, Tamil. The database columns are already in place (`events.tradition_id`, `languages`, `religious`; `functions.name`, `end_time`, any ceremony id). Each pack needs community reviewers and a native proofreader before it ships.

Built so far (part 1 of 3): six **Rang** designs, one per region the first packs cover, each with its own raga, drawn as vector art from geometry (never traced): **Rang Mahal** (Rajasthani jharokhas and meenakari, Raag Mand), **Paithani Mor** (Maharashtrian peacock fans and temple border, Raag Bhimpalasi), **Bandhani Utsav** (Gujarati tie-dye and mirror-work, Raag Pilu), **Alpona Lal** (Bengali laal paar and alpona lotus, Raag Bhairavi), **Gopuram Pon** (Tamil temple towers, kolam and lamps, Raag Hamsadhwani) and **Phulkari Rang** (Punjabi phulkari on khaddar, Raag Kafi). That makes 12 designs and 12 ragas. The editor shows design names and descriptions in Hindi too. New designs need `supabase/seed.sql` run again. Part 2: a **Tradition** step after Occasion with seven packs (North Indian Hindu, Rajasthani and Marwari, Marathi, Gujarati, Bengali Hindu, Tamil Hindu, and Modern with no religious symbols), the visitor's own first. A pack sets the sacred symbol drawn top-centre on the card (mangal kalash, Om, swastik, diya, Prajapati, Pillaiyar suzhi; geometric or lettered, never copied art), the invocation as the card's blessing line (in its script, in English letters, or off), a wedding's door words, local ceremony names (editor and guest page), the designs shown first, and labelled family wording (Darshanabhilashi, Swagatotsuk, tahuko and so on) shown to guests under the card. The family's own typed words always win. Every pack is marked as a draft in the editor until community review. Stored in `events.tradition_id` and `events.religious`; migration `20260927090000_tradition_packs.sql` returns them to guests. **Not yet:** deity art (content task C1), editable ceremony names, gotra and tithi fields. Part 3: every function can have an end time ("7:00 PM to 11:00 PM"), carried into calendar entries, and past midnight counts as the next day. With a tradition, the wedding's window is labelled with its own word (शुभ मुहूर्त, শুভ লগ্ন, முகூர்த்தம்) and set to the exact minute. Cards can be in one or two languages: the tradition's own and English, or English and Hindi without one. The host writes the second card's names and lines in the couple step (an empty line repeats the main card), the invocation switches between script and English letters, and the date is written in the card's language (Hindi, Marathi, Gujarati, Bengali, Tamil). Guests switch with a toggle above the card, which opens in their own language when the card has it; the editor's preview has the same toggle. Migration `20260927100000_card_languages.sql` returns the languages to guests. **Still wanted for more designs:** other card formats beyond the gate-fold, festival and non-wedding designs, and a recorded music library (shehnai, nadaswaram, dhol) alongside the live ragas.

**Content task C1 (starts now, runs alongside building).** Commission 18 original sacred art pieces (deities and symbols listed in TRADITIONS.md, section 5) from Indian artists with commercial rights; recruit community reviewers and proofreaders. Never use images from Google or other apps.

**Step 12b. SEO foundations**
Keyword landing pages generated from categories, tradition packs, functions and languages; indexable template pages; `hreflang` language versions; sitemap and robots; structured data; guest invitation pages kept `noindex`; titles and descriptions in each language; Search Console. Spec: [BRAND_SEO.md](BRAND_SEO.md), sections 5–6.

Built as: public pages generated from data in English and Hindi: one per occasion (`/invitations/<category>`, 8), per tradition (`/traditions/<pack>`, 7) and per design (`/designs/<id>`, 12), plus the gallery at `/designs`, and the same under `/hi/…`. Each page has its own title and description, a canonical address, `hreflang` links to the other language with English as `x-default`, breadcrumbs, the matching designs as covers, and a button into the editor already set up (`/create?category=`, `?template=`, or the new `?tradition=`). `sitemap.xml` lists every public page with its language versions; `robots.txt` keeps crawlers out of accounts, the editor and guest lists, and every app page is `noindex` (guest invitations stay crawlable only so WhatsApp can draw previews). Structured data: Organization, WebSite, SoftwareApplication (free offer only), FAQPage on the home pages, BreadcrumbList everywhere, and ItemList for design lists. The footer links every page, and the language menu keeps the visitor on the same page. **Not yet (owner tasks):** Search Console and Bing need the final domain (set `NEXT_PUBLIC_SITE_URL` on Vercel when it exists); keyword volumes still need checking in Keyword Planner; content articles and regional-language pages follow after launch.

**Step 12c. Regional motion**
Every tradition opens its own way (spec: [MOTION.md](MOTION.md)). Engine motion hooks: opening timeline, ambient loop, particle counts per quality level, sound only after a tap, skip. Drawn-on stroke reveal for kolam, alpona, rangoli and calligraphy. Openings and particles for the first six packs (North Indian, Rajasthani, Marathi, Gujarati, Bengali, Tamil). Diya countdown on the guest page. Full, Light and Still versions of everything.

Built as: each tradition pack now has an opening (`src/lib/engine/motion.ts`), a six-second timeline of parts that start and finish on their own clocks, played when the guest opens the card. North Indian: the symbol glows, marigold strings drop and swing, two clay diyas light one after the other, marigold petals fall. Rajasthani: glow, marigold strings, petals and floating lanterns. Marathi: a rangoli draws itself behind the card, haldi-kumkum bursts from the seam, turmeric dust floats. Gujarati: kites sweep across the sky and bandhani dots burst out. Bengali: an alpona draws itself, the Prajapati butterfly flies in and settles by the names, red and white petals. Tamil: a kolam weaves itself dot by dot, diyas light, a mango-leaf thoranam drops, jasmine falls. Modern: a fine gold frame and gold motes. The patterns are drawn stroke by stroke from geometry (`src/lib/engine/patterns.ts`), the same data in 3D and on the 2D card. Counts drop with the quality level; Still mode shows the finished scene with nothing moving; a Skip button jumps to the end. The design review page (`/engine`) has an Opening picker. The guest page has a row of seven diyas under the names that light one per day in the last week (all lit on the day), counted in India's time zone. **Not yet:** the Rajasthani elephant procession and the peacock and mirror-work shimmer; sound effects (conch, shehnai) until licensed recordings exist; per-function scenes arrive with the story reveal in Step 12d.

**Step 12d. Story reveal**
Once the doors open, the invitation tells itself one moment at a time, like the video invitations families buy for ₹2,000 to ₹6,000 (review: [VIDEO_INVITES.md](VIDEO_INVITES.md)): the blessing under the sacred symbol, the couple's names, the date, each function in its own scene with its time and venue, then "Will you join us?" with the reply button. Scenes for the wedding functions (haldi, mehendi, sangeet, wedding, reception, roka and engagement), moved here from Step 23. Unlike a video, it stays live: edits, two languages and replies all still work.

Built as: `src/lib/engine/story.ts` turns the card's words and the planned functions into beats, each with lines that rise in one after another and time to read them (a long story is squeezed to 45 seconds). The player (`src/components/invitation/story/`) plays over the opened card in the card's own colours and fonts, with a progress bar per beat like a status update, Back, Next, Pause and Skip under it, taps on the panel to move on or back, arrow keys and Escape, and a pause whenever the tab is hidden. It starts once the tradition's opening has finished, or at once if the guest skips the opening; the last beat waits for the guest, and a Play the story button replays it. Scenes are vector art from geometry, kept to the top and bottom so the words stay readable: turmeric splashing from a brass bowl with marigolds (haldi), henna vines and a paisley drawing themselves (mehendi), stage lights, bulbs, notes and a dholak (sangeet), the havan kund's fire, meeting garlands and falling akshat (wedding), chandelier sparkle and confetti (reception), two rings drawing themselves (roka and engagement), a gold arch round the names, a marigold and mango-leaf toran for the date, and five diyas for the last beat. No figures or deities are drawn; the card's own symbol only glows. Still mode never starts the story on its own: the guest can play it and step through with Next, with nothing moving. It plays on the guest page, in the editor's preview and on `/engine` (a Story switch). **Not yet:** a baraat scene (dhol, horse or vintage car, fireworks) waits for the baraat to become its own function; the tradition-specific scenes (Nalangu, Gaye Holud, Nikah, Anand Karaj) come with their packs in Step 23.

**Step 12e. Event pages and themes**
The story becomes full-screen pages, like the themed PSD bundles sold for Indian weddings (proposal: `event-pages-proposal.md` in the project files): a cover (sacred symbol, blessing, names), a family page (who invites, the tradition's wording, save the date), one page per function, then the reply. The pages use the whole height and width of a phone, so the words are large and clear; on a laptop they are a tall column with the page's own landscape blurred at the sides. Each page is painted in a theme; the theme is only the look, so the tradition still gives the ceremony names, blessing and symbol, and the language the words.

Built as: `src/lib/suites/catalog.ts` lists the themes as data: Rajwada Bagh (a palace garden through a Mughal arch, fountains and lanterns), Shahi Savari (caparisoned elephants with howdahs before a desert fort, bunting), Kayal (a houseboat on the Kerala backwaters, palms and floating lamps) and Card colours (the card's own paper, as in Step 12d). Each has a page turn (arch reveal, sweep, ripple, fade), a matching 3D card design, the traditions that suggest it, and slots for painted backgrounds. Every function has a light (dawn for haldi, day for mehendi, dusk for the wedding, night for sangeet and reception) that repaints the sky, so each page looks different within a theme. The landscapes are vector art (`src/components/invitation/story/suite-backdrop.tsx`); the words sit on a reading plate; the function's own scene keeps its top band and falling petals. Colours are `--suite-*` tokens under `[data-suite]` and `[data-mood]` in `globals.css`. Function pages have Directions and Add to calendar; pages move on after 4.5 to 8 seconds, by tap, swipe or keys; focus stays inside while they cover the screen. The editor's design step has an Event pages picker (the tradition's theme is suggested, and picking a theme also picks its card); the choice is saved as `religious.suite`, so no database change. `/engine` has a Page theme picker (`?suite=`). **Not yet:** painted backgrounds (the owner is generating them; they drop into `SUITES[id].images` with no code change, see [SUITES.md](SUITES.md)); faith-specific themes (a Nikah garden, a chapel, Anand Karaj) with the Muslim, Christian and Sikh packs in Step 23; guests seeing only the functions they are invited to; music per theme.

**Step 12f. Painted event pages** (done): the owner's 27 AI paintings (9 per theme) replace the vector landscapes for Rajwada Bagh, Shahi Savari and Kayal, as 9:16 WebP in `public/suites/`. Painted pages drop the drawn scene and the reading plate: the words sit on the painting itself, as the owner asked, with light lettering on the night paintings; a "Box behind the words" switch (editor, and on the pages while previewing) brings the box back for hosts who want it, the next painting is fetched ahead, and the editor thumbnails show each theme's cover. Four more painted themes followed the same day from the prompts in project files `shubhdwar/image-guide-2.md`: Noor Bagh (Mughal garden, Muslim weddings), Phulkari Haveli (Sikh and Punjabi), Rajbari (suggested for Bengali) and Peshwai Wada (suggested for Marathi). Each painting has a hand-checked text area so the words sit in its calm part, and the family page splits in two when the family has its own blessings. A new theme is now a SUITES entry, a colour block, 9 WebP paintings and their text areas. Discussed in project files `shubhdwar/layouts-discussion.md`: layout lines in the prompts, an animation layer, couple photo frames, birthdays.

**Step 12g. Layout lines and page animation** (done): project files `shubhdwar/theme-recipe.md` is the recipe for every new theme, for any tradition, faith, language or occasion (not only Gujarati or weddings): a style lock, one page prompt per page, and six layout lines (Centre, Window, Sky, Ground, Left, Right) that tell the image tool where to leave plain space for the words, with a map of which page uses which layout so pages vary. Painted pages now carry a light animation layer drawn in CSS, with no video files: petals drift down on the cover, haldi, mehendi and wedding pages, dust motes float on the family page, lights twinkle on sangeet and reception nights, soft fireworks burst over the baraat, and lamps bob on the reply page. The effects take the theme's own colours, never catch taps, and are off in still mode (reduced motion). Code: `src/components/invitation/story/page-effects.tsx`, the `fx-*` classes in `globals.css`.

**Step 12h. Couple photos on the event pages** (planned, premium): the host adds one photo of the couple, or two (bride and groom each in their own frame, names beneath), and they appear on the cover or the page after it, and optionally on the family page. Frames are our own vector art in each theme's style (a jharokha for Rajwada Bagh, a scalloped arch for Shahi Savari and Noor Bagh, a carved wooden frame for Kayal, and so on for every theme), so any photo fits; the host can move and zoom the photo inside its frame. Photo pages are optional and the same for every tradition and language. Plans (PRICING.md): Premium gets one photo, Royal and Wedding bundle get one or two photos plus a photo per function; on Free the host can try it, and the preview carries the "Made with Shubhdwar" watermark across the photo pages until they upgrade (Step 17). Photos are shown only to people with the link, as today.

**Step 12i. Birthdays and other occasions** (planned): each occasion lists its own pages (birthday: cover, "turning one", party, venue, reply; griha pravesh: cover, puja, lunch, reply), and a theme is a set of paintings for one occasion's pages, made with the same recipe and layout lines. Text areas, animation, couple or child photos, the box switch and the watermark rules carry over unchanged. First two birthday themes once the owner generates them.

**Step 13. Quality pass**
End-to-end tests for create → publish → RSVP → dashboard. Accessibility audit, Lighthouse, real-device testing on low-end Android and iPhone.

Built as: create, publish, RSVP and the dashboard were already covered end to end; this step adds a strict accessibility sweep of all 61 pages (WCAG 2.2 AA plus axe's best practices, at 320px and 1440px) and a guest who replies with the keyboard alone. Lighthouse on phones went from 66–89 to 90–94 on the English public pages, 86 on guest invitations (Hindi pages still swing between 73 and 84 on their Devanagari fonts): English pages stopped downloading Devanagari fonts for the footer, pages that only show things stopped sending the form validator, and copy is split so each page ships only its own words. Scores, what changed and a real-phone checklist for the owner: [QUALITY.md](QUALITY.md). **Not yet (owner task):** trying the live site on a low-end Android and an iPhone, using that checklist.

**Step 14. Launch**
Production Supabase, Vercel deploy, custom domain, analytics, error monitoring, privacy policy and terms.

Built as (part 1): a privacy policy and terms in plain words, in English and Hindi (`/privacy`, `/terms`, `/hi/…`), written for India's DPDP Act 2023 and linked from every footer and the sign-in page; Vercel Web Analytics on the live site only, with invitation links, guest codes and query strings removed before counting; browser and server errors written to the Vercel logs as one-line JSON (`[client-error]`, `[server-error]`), with friendly error pages in both languages; and security headers on every response (no framing, strict referrer, HSTS, no `x-powered-by`). The owner's click-by-click list for the domain, Supabase, Google sign-in, analytics, SMS and legal review: [LAUNCH.md](LAUNCH.md). Part 2: **Delete account** on the profile page erases every invite the host owns (photos, functions, guest list, replies) and then the sign-in itself, after a tick to confirm; invites they co-host stay with their owners.

---

## Phase 2 — Payments and editions

**Step 15.** Plan catalogue and entitlements (spec: [PRICING.md](PRICING.md)): Free, Premium, Royal, Wedding bundle, Family Plus and business plans as data; per-event entitlement rows; limits enforced in the editor and guest pages. Flat price per event in rupees; never coins or per-guest charges.
**Step 16.** Razorpay checkout (UPI, cards), receipts, GST invoices.
**Step 16a.** Family Plus yearly plan (₹999): subscription through UPI AutoPay and cards, renewal reminders 7 days ahead, two-tap cancel, sharing with 4 family accounts, ₹500 off wedding passes.
**Step 17.** Watermark on free invites (the card, the event pages and any couple photo pages from Step 12h show "Made with Shubhdwar" until the host upgrades), upgrade flow, coupons and festival offers.
**Step 17a.** Card details included in editions: wax seals, tassels, foil, backgrounds, envelope and door styles.
**Step 17b.** Shagun ledger with direct UPI (free): "Send shagun" opens the guest's UPI app with the family's UPI ID; UPI QR on desktop; self-reported ledger, manual cash entries, CSV export. No money through us. Spec: [PAYMENTS.md](PAYMENTS.md).
**Step 17c.** MP4 video export for WhatsApp status and Instagram (moved from Step 21): the story reveal played into a vertical 30 to 45 second video with the design's raga, made in the host's browser so it costs nothing to run; sold as the "extra MP4" in PRICING.md.
**Owner task L1.** Legal and tax review of platform payments with a fintech lawyer and CA; choose the payment provider (checklist in PAYMENTS.md, section 5). Required before Step 18a.
**Step 18.** Referral credits for hosts and guests.
**Step 18a.** Platform payments with commission, through a licensed provider's split payments (we never hold the money): shagun and group contributions by UPI, card and netbanking; host KYC via linked accounts; fees shown before paying; automatic ledger and receipts; refunds; "verified family" badge, limits and invite reporting against fake money requests.

## Phase 2b — Memories (3D gifts)

Detailed in [MEMORIES.md](MEMORIES.md). Starts once payments work (after Step 18). Launch target: Star Map before Valentine's Day.

**M1.** Memories foundation: tables, entry points on the home screen.
**M2.** Star Map scene: sky maths, star catalogue, constellations, 5 styles.
**M3.** Memory editor with live preview and free watermarked preview.
**M4.** Gift delivery: reveal box, timed unlock, scheduled send, PIN, replies.
**M5.** Gift pricing and checkout.
**M6.** Travel Globe.
**M7.** Floating Gallery and group gifts.
**M8.** Our Story bundle, print orders, video export, saved-date reminders.

## Phase 3 — Growth features

**Step 19.** AI wording in every language (Claude API).
**Step 20.** AI couple art from uploaded photos.
**Step 20a.** Signature scenes: a premium collection of rich painted backgrounds (palace courtyard, marigold mandap, beach sangeet, haldi garden) made once by us, generated or commissioned, then cleaned up and checked by an artist. No deities or faces from AI (sacred art stays with content task C1). Loaded only on capable phones, with the vector card as the fallback.
**Step 21.** Moved to Step 17c (MP4 export of the story reveal).
**Step 22.** WhatsApp Business reminders and update broadcasts.
**Step 23.** More categories as data: birthdays, baby (godh bharai, naamkaran, mundan), home and religious (griha pravesh, puja, katha), festivals (Diwali, Eid, Holi, Navratri, Onam, Christmas), parties, dining; 30+ templates. Tradition packs: Telugu, Kerala (Hindu, Christian, Muslim), Punjabi Sikh, Muslim, Christian, Jain and Modern; the colourful Rang template family (6 designs). Regional motion for the remaining packs, their own function scenes (baraat, Nalangu, Gaye Holud, Nikah, Anand Karaj) and seasonal overlays (MOTION.md).
**Step 24.** Photo sharing album after the event, thank-you cards.
**Step 24a.** Greeting Cards line: thank-you, festival greetings, shagun cards, condolence.

## Phase 4 — Business edition

**Step 25.** Business accounts for planners and printers: client workspaces, own branding, bulk edits. Business and education categories: shop openings, launches, office parties, dealer meets, college fests, convocations, fundraisers.
**Step 25a.** Ticketing for paid events: ticket types, promo codes, QR tickets, check-in scanner, organiser payouts with our per-ticket commission (PAYMENTS.md).
**Step 26.** Business Starter and Pro subscriptions (monthly and yearly, 14-day trial): team members, client workspaces and approval links, reseller pass purchases at 30% off, monthly AI and video allowances (PRICING.md).
**Step 26a.** Enterprise: white-label on the partner's own domain, SSO, API access, custom pricing.
**Step 27.** Print partner integration (printed card with QR to the 3D invite).
**Step 27a.** Designer and artist collections with Indian designers, illustrators and textile brands (revenue share). Includes sacred art and regional designs by named artists.
**Step 28.** Creator marketplace for template designers.
**Step 29.** Wedding websites and custom domains.

## Phase 5 — Global

**Step 30.** Stripe and regional pricing; international templates and categories (Western weddings, Nikah, Chinese, quinceañera, bar and bat mitzvah).
**Step 31.** More languages including Urdu and Arabic (right-to-left).
**Step 32.** Gift registry with partner stores (affiliate commission), vendor referrals and live-stream page. (Shagun moved earlier to Steps 17b and 18a.)
**Step 33.** Android and iOS apps with Capacitor; push notifications. Store listings localised in every launch language, following the app store plan in BRAND_SEO.md.

---

## Research and specs

All in this folder, so every build session has them:

- [PRODUCT.md](PRODUCT.md): what each step builds towards.
- [MEMORIES.md](MEMORIES.md): Phase 2b in detail.
- [BRAND_SEO.md](BRAND_SEO.md): the Shubhdwar name decision, owner task B1, rename checklist (Step 8a), keyword clusters and SEO foundations (Step 12b), app store plan.
- [PRICING.md](PRICING.md): personal passes, Family Plus, business plans, rules, revenue estimates and entitlements (Steps 15, 16, 16a, 17, 26, 26a).
- [SUITES.md](SUITES.md): event page themes, and how painted backgrounds are added.
- [VIDEO_INVITES.md](VIDEO_INVITES.md): review of the video invitations sold on Instagram and what Story mode (Steps 12d, 17c, 20a) takes from them.
- [MOTION.md](MOTION.md): regional opening animations, per-function scenes, particles, drawn-on effects, diya countdown (Steps 12c, 21, 23).
- [PAYMENTS.md](PAYMENTS.md): shagun ledger, platform payments with commission through a licensed provider, ticketing, trust and safety, legal review (Steps 17b, 18a, 25a, 32; owner task L1).
- [TRADITIONS.md](TRADITIONS.md): tradition packs, sacred art library and respect rules (Steps 12a, 23, 27a and content task C1).
- [COMPETITORS.md](COMPETITORS.md): what we borrow from Paperless Post and what we avoid (coin pricing, per-guest add-ons, yearly free limit).
- [PLAN_REVIEW.md](PLAN_REVIEW.md): open recommendations on launch scope, payments timing and languages, awaiting the owner's decision.
- [Nimantran_Premium_Plan.pdf](Nimantran_Premium_Plan.pdf): original business plan.
