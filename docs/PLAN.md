# Nimantran — Build Plan

3D invitations with RSVP and guest tools. Web first (works from any WhatsApp link), wrapped as Android/iOS apps later.

**Documents:** [PRODUCT.md](PRODUCT.md) (full feature catalogue: categories, formats, templates, languages, editions, pricing, add-ons) · [MEMORIES.md](MEMORIES.md) (3D gifts) · [COMPETITORS.md](COMPETITORS.md) (Paperless Post and the Indian market) · [PLAN_REVIEW.md](PLAN_REVIEW.md) (open recommendations).

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

**Step 7. Accounts**
Phone OTP and Google sign-in via Supabase. Profile, my invites list.

**Step 8. Database and security**
Tables: users, events, event_hosts (co-hosts), functions, categories, templates, guests, rsvps, rsvp_questions, scheduled_sends, media. Row Level Security so hosts and co-hosts see only their own events. Migrations and seed data.

**Step 9. Publish, share and schedule**
Unique link (`/i/aarav-weds-meera`), WhatsApp share, rich link preview image (Open Graph), QR code, add-to-calendar. Scheduled sending per function (email and SMS).

**Step 10. Guest experience and RSVP**
Guest opens link → 3D card → function tabs, maps, dress code → one-tap RSVP per function with guest count, plus-ones, message and the host's custom questions (meal choice, arrival date, room needed, pickup from station). Works without login.

**Step 11. Host dashboard and co-hosts**
Live guest list, opened/replied/pending counts, filters, search, CSV export, edit after publishing. Invite co-hosts (both families) to manage one event and guest list. Automatic reminders to guests who haven't replied (email and SMS; WhatsApp in Step 22).

**Step 11a. Event Pages (free line)**
Fast, text-first event page with cover image, details and RSVP, using the same guest tools. Upsell to a 3D invitation.

**Step 12. Languages**
next-intl setup; English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi. Two-language invites with guest toggle.

**Step 13. Quality pass**
End-to-end tests for create → publish → RSVP → dashboard. Accessibility audit, Lighthouse, real-device testing on low-end Android and iPhone.

**Step 14. Launch**
Production Supabase, Vercel deploy, custom domain, analytics, error monitoring, privacy policy and terms.

---

## Phase 2 — Payments and editions

**Step 15.** Editions (Free, Premium, Royal, Wedding bundle) and feature limits. Flat price per event in rupees; never coins or per-guest charges.
**Step 16.** Razorpay checkout (UPI, cards), receipts, GST invoices.
**Step 17.** Watermark on free invites, upgrade flow, coupons and festival offers.
**Step 17a.** Card details included in editions: wax seals, tassels, foil, backgrounds, envelope and door styles.
**Step 18.** Referral credits for hosts and guests.

## Phase 2b — Memories (3D gifts)

Detailed in the Nimantran Memories Plan. Starts once payments work (after Step 18). Launch target: Star Map before Valentine's Day.

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
**Step 21.** MP4 video export for WhatsApp status and Instagram.
**Step 22.** WhatsApp Business reminders and update broadcasts.
**Step 23.** More categories as data: birthdays, baby (godh bharai, naamkaran, mundan), home and religious (griha pravesh, puja, katha), festivals (Diwali, Eid, Holi, Navratri, Onam, Christmas), parties, dining; 30+ templates.
**Step 24.** Photo sharing album after the event, thank-you cards.
**Step 24a.** Greeting Cards line: thank-you, festival greetings, shagun cards, condolence.

## Phase 4 — Business edition

**Step 25.** Business accounts for planners and printers: client workspaces, own branding, bulk edits. Business and education categories: shop openings, launches, office parties, dealer meets, college fests, convocations, fundraisers.
**Step 26.** Subscription billing (monthly/yearly).
**Step 27.** Print partner integration (printed card with QR to the 3D invite).
**Step 27a.** Designer and artist collections with Indian designers, illustrators and textile brands (revenue share).
**Step 28.** Creator marketplace for template designers.
**Step 29.** Wedding websites and custom domains.

## Phase 5 — Global

**Step 30.** Stripe and regional pricing; international templates and categories (Western weddings, Nikah, Chinese, quinceañera, bar and bat mitzvah).
**Step 31.** More languages including Urdu and Arabic (right-to-left).
**Step 32.** Shagun/gift registry and live-stream page.
**Step 33.** Android and iOS apps with Capacitor; push notifications.

---

## Research and specs

All in this folder, so every build session has them:

- [PRODUCT.md](PRODUCT.md): what each step builds towards.
- [MEMORIES.md](MEMORIES.md): Phase 2b in detail.
- [COMPETITORS.md](COMPETITORS.md): what we borrow from Paperless Post and what we avoid (coin pricing, per-guest add-ons, yearly free limit).
- [PLAN_REVIEW.md](PLAN_REVIEW.md): open recommendations on launch scope, payments timing and languages, awaiting the owner's decision.
- [Nimantran_Premium_Plan.pdf](Nimantran_Premium_Plan.pdf): original business plan.
