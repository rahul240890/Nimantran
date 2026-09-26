# Nimantran — Build Plan

3D invitations with RSVP and guest tools. Web first (works from any WhatsApp link), wrapped as Android/iOS apps later.

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

## Phase 0 — Foundation

**Step 1. Project setup** ✅ _(this step)_
Next.js + TypeScript strict + Tailwind v4, folder structure, linting, formatting, type-check scripts, fonts, base tokens, branded holding page.

**Step 2. Design system**
Colour, type, spacing, radius and shadow tokens; light and dark themes. Core components: Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, DatePicker, TimePicker, Card, Sheet/Dialog, Toast, Tabs, Badge, Avatar, Skeleton, EmptyState, Stepper. A `/design` page showing every component in every state.

**Step 3. App shell and landing page**
Header, footer, navigation, theme toggle, language switcher. Marketing landing page with live 3D hero, how-it-works, templates preview, pricing preview, FAQ.

---

## Phase 1 — MVP (weddings in India)

**Step 4. 3D invitation engine**
Port the prototype into React Three Fiber. Card formats as components (gate-fold first). Themes, petals, lanterns, music. Automatic quality levels and 2D fallback.

**Step 5. Template system**
Template data schema (scene, colours, fonts, music, text slots). First 6 templates: Marigold Gate, Rose Garden, Emerald Palace, Royal Scroll, Minimal Monogram, Kerala Kasavu.

**Step 6. Invite editor**
Step-by-step editor: choose template → couple details → functions (haldi, mehendi, sangeet, wedding, reception) with date, time, venue, dress code → photos and music → preview. Live 3D preview beside the form; autosave drafts.

**Step 7. Accounts**
Phone OTP and Google sign-in via Supabase. Profile, my invites list.

**Step 8. Database and security**
Tables: users, events, functions, templates, guests, rsvps, media. Row Level Security so hosts see only their own data. Migrations and seed data.

**Step 9. Publish and share**
Unique link (`/i/aarav-weds-meera`), WhatsApp share, rich link preview image (Open Graph), QR code, add-to-calendar.

**Step 10. Guest experience and RSVP**
Guest opens link → 3D card → function tabs, maps, dress code → one-tap RSVP with guest count, meal choice, message. Works without login.

**Step 11. Host dashboard**
Live guest list, opened/replied/pending counts, filters, search, CSV export, edit after publishing.

**Step 12. Languages**
next-intl setup; English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi. Two-language invites with guest toggle.

**Step 13. Quality pass**
End-to-end tests for create → publish → RSVP → dashboard. Accessibility audit, Lighthouse, real-device testing on low-end Android and iPhone.

**Step 14. Launch**
Production Supabase, Vercel deploy, custom domain, analytics, error monitoring, privacy policy and terms.

---

## Phase 2 — Payments and editions

**Step 15.** Editions (Free, Premium, Royal, Wedding bundle) and feature limits.
**Step 16.** Razorpay checkout (UPI, cards), receipts, GST invoices.
**Step 17.** Watermark on free invites, upgrade flow, coupons and festival offers.
**Step 18.** Referral credits for hosts and guests.

## Phase 3 — Growth features

**Step 19.** AI wording in every language (Claude API).
**Step 20.** AI couple art from uploaded photos.
**Step 21.** MP4 video export for WhatsApp status and Instagram.
**Step 22.** WhatsApp Business reminders and update broadcasts.
**Step 23.** More occasions: birthday, anniversary, housewarming, baby shower, festivals; 30+ templates.
**Step 24.** Photo sharing album after the event, thank-you cards.

## Phase 4 — Business edition

**Step 25.** Business accounts for planners and printers: client workspaces, own branding, bulk edits.
**Step 26.** Subscription billing (monthly/yearly).
**Step 27.** Print partner integration (printed card with QR to the 3D invite).
**Step 28.** Creator marketplace for template designers.
**Step 29.** Wedding websites and custom domains.

## Phase 5 — Global

**Step 30.** Stripe and regional pricing; international templates (Western, Nikah, Chinese, quinceañera).
**Step 31.** More languages including Urdu and Arabic (right-to-left).
**Step 32.** Shagun/gift registry and live-stream page.
**Step 33.** Android and iOS apps with Capacitor; push notifications.
