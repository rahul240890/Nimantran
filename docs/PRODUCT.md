# Shubhdwar — Product Specification

What we are building, in full. The build order lives in [PLAN.md](PLAN.md); this file is the feature catalogue every step builds from.

Related: [TRADITIONS.md](TRADITIONS.md) (tradition packs), [MEMORIES.md](MEMORIES.md) (3D gifts), [COMPETITORS.md](COMPETITORS.md) (Paperless Post and the Indian market), [PLAN_REVIEW.md](PLAN_REVIEW.md) (open recommendations).

## Built so far

This file describes the full product. Only part of it exists today, so check this list before claiming a feature on the website or in marketing:

- **Built:** the 3D engine with a 2D fallback, the gate-fold format, 6 templates, music composed live from 6 ragas (no track library or uploads yet), the invite editor with autosaved drafts in the browser, and the category system with the wedding journey (roka, engagement, save-the-date, haldi, mehendi, sangeet, wedding, reception) ordered by season and region, accounts (mobile number or Google sign-in, profile, My invites), and the database with row level security, where invites save to the account and follow the host across devices, photos included. Publishing (Step 9): a link like /i/aarav-weds-meera, a share page with WhatsApp, copy, the phone's share sheet and a printable QR code, a link preview drawn in the design's colours, and a guest page with the 3D card, every function with directions and add-to-calendar, and the photos. Guest RSVP (Step 10): guests reply to each function in one tap without signing in, with adults and children, the host's questions and a note, and can change their reply later; the share page shows the replies. The home page plays each design's raga from a strip under the header.
- **Not built yet:** scheduled sending, the host dashboard, languages other than English, tradition packs (the database already stores a tradition, card languages and local ceremony names for them), payments, and every other card format.

---

## 1. Positioning

**Name:** Shubhdwar (शुभद्वार, "auspicious doorway"), decided 26 September 2026. The rename (Step 8a) is done; only the repository, the original business plan and browser storage keys still say Nimantran. Brand and SEO plan: [BRAND_SEO.md](BRAND_SEO.md).

A WhatsApp link that opens a 3D invitation, with real RSVP and guest tools, in the family's own language, for one clear price per event.

- **Families** pay once per event (most host a wedding once).
- **Businesses** (planners, printers, studios, venues) pay a subscription.
- **Start:** Indian weddings → all Indian occasions → the diaspora → global cultures.

## 2. Product lines

All lines share one 3D engine, one account ("My creations"), one category system and one checkout.

| Line           | What it is                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| 3D Invitations | Core product: interactive 3D card, functions, RSVP, host dashboard              |
| Event Pages    | Free, fast, text-first event page with RSVP; upsell to 3D                       |
| Memories       | 3D gifts: Star Map, Travel Globe, Floating Gallery ([MEMORIES.md](MEMORIES.md)) |
| Greeting Cards | Thank-you, festival greetings, shagun cards, condolence                         |

## 3. Categories and occasions

Categories are data, not code: name in every language, icon, season, region, templates, default functions and default RSVP questions. One template can sit in several categories. The home screen reorders categories by season and region.

| Group                   | Occasions                                                                                                       | Phase |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | ----- |
| Wedding journey         | Roka, engagement, haldi, mehendi, sangeet, wedding, reception, save-the-date, Nikah, Anand Karaj                | MVP   |
| Birthdays               | Kids', adult, first birthday, milestone (50th, 60th)                                                            | 3     |
| Baby                    | Baby shower, godh bharai, naamkaran, mundan, annaprashan, announcements                                         | 3     |
| Home and religious      | Griha pravesh, puja, satyanarayan katha, bhoomi pujan, gurdwara and church events                               | 3     |
| Festivals               | Diwali, Eid, Holi, Navratri, Onam, Pongal, Lohri, Christmas, New Year                                           | 3     |
| Parties and dining      | Get-togethers, kitty party, bachelor and bachelorette, farewell, dinner, retirement, iftar, cricket watch party | 3     |
| Business                | Shop openings (udghatan), launches, VIP events, meetings, dealer meets, office Diwali party, conferences        | 4     |
| Education and nonprofit | College fests, school annual day, convocation, reunions, awards, fundraisers                                    | 4     |
| Global                  | Western weddings, quinceañera, bar and bat mitzvah, Chinese weddings, graduation                                | 5     |

## 4. Card formats

| Format                | Description                                          |
| --------------------- | ---------------------------------------------------- |
| Gate-fold             | Two doors swing open (built)                         |
| Envelope              | Wax seal breaks, letter slides out                   |
| Scroll                | Royal scroll unrolls (Rajasthani, Mughal themes)     |
| Pop-up book           | Pages flip, a scene pops up per function             |
| Photo cube / carousel | Rotating 3D gallery of the couple                    |
| Venue walk-through    | Stylised palace, mandap or garden to explore         |
| Multi-event card      | One link, a tab per function                         |
| Save-the-date teaser  | 5–10 second reveal for WhatsApp status and Instagram |

## 5. Templates

Launch with 6 built templates (Marigold Gate, Rose Garden, Emerald Palace, Royal Scroll, Minimal Monogram, Kerala Kasavu); grow to 30+ by the end of Phase 3, adding 10–15 a month timed to seasons.

| Style family         | Look                          | Examples                                                                                          |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| Royal heritage       | Palaces, jharokhas, gold foil | Rajasthani Mahal, Mughal Garden, Mysore Durbar                                                    |
| Regional traditional | State art and customs         | Kerala Kasavu, Bengali Alpona, Tamil Kolam, Punjabi Phulkari, Marathi Paithani, Gujarati Bandhani |
| Faith-based          | Sacred symbols and colours    | Ganesh Vandana, Nikah Crescent, Anand Karaj, Christian Chapel                                     |
| Floral and pastel    | Flowers, watercolour          | Marigold Shower, Jasmine Night, Blush Peony                                                       |
| Modern minimal       | Clean type, subtle motion     | Monogram, Line Art, Glass and Gold                                                                |
| Fun and illustrated  | Caricatures, playful scenes   | Caricature Couple, Baraat on Wheels, Destination Beach                                            |

Customisation levels: **basic** (names, date, venue, message, photo) → **style** (colours, fonts, music, petals) → **advanced** (functions, animations, own artwork; premium).

Card details included in editions, never charged per guest: wax seals, tassels, foil, backgrounds, envelope and door styles.

Later: **designer and artist collections** with Indian designers, illustrators and textile brands (revenue share), and a **creator marketplace** (designers keep 50–70%).

## 5a. Traditions

One choice in the editor (region, community, card languages) sets the deity or sacred symbol, invocation, palette, motifs, ceremony names, host order and wording structure. Twelve launch packs: North Indian Hindu, Rajasthani/Marwari, Marathi, Gujarati, Bengali, Tamil, Telugu, Kerala (Hindu, Christian, Muslim), Punjabi Sikh, Muslim, Christian, Jain, plus a Modern pack without religious symbols. Original commissioned sacred art only; respect rules enforced in code; every pack reviewed by the community before launch. Full spec: [TRADITIONS.md](TRADITIONS.md).

A colourful **Rang** template family (Rang Mahal, Paithani Mor, Bandhani Utsav, Alpona Lal, Gopuram Pon, Phulkari Rang) sits beside the elegant designs.

## 6. Languages

| Phase  | Languages                                                                              |
| ------ | -------------------------------------------------------------------------------------- |
| Launch | English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi |
| Later  | Urdu, Odia, Assamese, Sindhi, Konkani, Nepali                                          |
| Global | Arabic, Spanish, French, Portuguese, Indonesian, Chinese, Swahili                      |

- Two languages per invite; guests switch with one tap.
- Script fonts loaded only when used.
- AI writes wording natively in each language.
- Ready phrases: shlokas, "Shubh Vivah", Bismillah, Ik Onkar, Bible verses.
- Right-to-left layouts for Urdu and Arabic.
- Optional tithi and Hijri dates; local currency and payment methods.

_Open: PLAN_REVIEW.md recommends launching with English and Hindi first and adding the rest one at a time._

## 7. Guest experience (all editions)

- Opens instantly from WhatsApp, SMS, email or QR, on any phone, no install.
- 3D card with music; 2D fallback on weak phones and slow networks.
- Tab per function: date, time, venue map, dress code and colour theme.
- One-tap RSVP per function: guest count, plus-ones, message, host's custom questions (meal, arrival date, room needed, pickup).
- Add to calendar, directions.
- Two-language toggle.

## 8. Host tools

- Step-by-step editor with live 3D preview and autosaved drafts.
- **Co-hosts:** both families manage one event and guest list.
- Live guest list: opened, replied, pending; filters, search, CSV export.
- Import contacts from phone or spreadsheet.
- **Scheduled sending** per function; **automatic reminders** to non-responders (email and SMS; WhatsApp later).
- Broadcast last-minute changes (venue or time moved).
- Edit after publishing.
- Seating, travel and stay details (Royal).
- After the event: shared guest photo album, thank-you cards, memory gallery.

## 9. Editions and pricing

Flat price per event. **Never coins, never per-guest charges.** Every link, free or paid, stays live until the last function date plus 7 days (from PLAN_REVIEW.md).

| Feature               | Free        | Premium                     | Royal                   | Business            |
| --------------------- | ----------- | --------------------------- | ----------------------- | ------------------- |
| Price (India)         | ₹0          | ₹499 / event                | ₹1,999 / event          | ₹999–₹2,999 / month |
| Price (international) | $0          | $19                         | $59                     | $29–$79 / month     |
| Templates             | 10 basic    | All standard                | All incl. exclusive     | All + white-label   |
| Watermark             | Yes         | No                          | No                      | Own brand           |
| Functions per invite  | 1           | Up to 3                     | Unlimited               | Unlimited           |
| Languages per invite  | 1           | 2                           | 2 + wording in each     | All                 |
| Guests with RSVP      | 50          | 500                         | Unlimited               | Unlimited           |
| Music                 | 3 tracks    | Full library                | + own upload            | + own upload        |
| Photos                | 3           | 20                          | Unlimited + video clips | Unlimited           |
| AI wording            | 3 tries     | Unlimited                   | Unlimited               | Unlimited           |
| AI couple art         | —           | 2 images                    | 10 images               | Per client          |
| WhatsApp teaser video | —           | 1                           | All functions           | Unlimited           |
| Guest dashboard       | Basic count | Full list, meals, plus-ones | + seating, travel, stay | Per client          |
| Custom link           | —           | Yes                         | + own domain            | Yes                 |
| Support               | Help centre | Chat                        | Personal designer       | Account manager     |

**Wedding bundle** (all functions, Royal): ₹2,999 / $79.

**Business Starter** ₹999/month or ₹9,999/year (freelance planners, photographers). **Business Pro** ₹2,999/month or ₹29,999/year (planners, print shops, venues): unlimited client invites, own logo and colours, client management, bulk edits, reseller pricing, monthly AI allowance.

**Pricing tactics:** free watermarked preview before paying; regional pricing abroad; festival and early-bird offers; upgrade later by paying the difference; referral credit ₹100 for host and guest; pay-per-extra (more guests, photos, AI images).

The Free column's 10 basic templates assumes the catalogue has grown past the 6 built today. Prices are starting proposals; revisit after the first 500 sales. Headline prices include GST (PLAN_REVIEW.md).

## 10. Add-ons

| Add-on                           | Price (India)         |
| -------------------------------- | --------------------- |
| AI couple portrait (5 images)    | ₹199                  |
| Cinematic MP4 export             | ₹299 / video          |
| AI voice invitation              | ₹199                  |
| Wedding website                  | ₹999                  |
| Own domain                       | ₹1,499 / year         |
| Printed cards with QR            | Partner commission    |
| WhatsApp bulk send and reminders | Message cost + margin |
| Seating and travel planner       | ₹499                  |
| Shagun and gift registry         | Small fee per gift    |
| Live-stream page                 | ₹499                  |
| Memory album (forever)           | ₹299                  |
| Thank-you cards                  | ₹199                  |
| Human designer touch-up          | ₹999+                 |

## 11. Business edition

- Client workspaces, own branding, bulk edits, reseller pricing.
- Business and education categories (section 3).
- Print partner orders: printed card with a QR code to the 3D invite.
- Subscription billing.

## 12. Technical choices

Next.js 16, React 19, TypeScript strict, Tailwind v4, Radix UI, React Three Fiber, Motion, React Hook Form + Zod, Supabase (Postgres, phone OTP auth, storage, Row Level Security), next-intl, Razorpay (India), Stripe (global), Claude API for wording, an image API for couple art, Vitest, Playwright, Vercel.

**Cost to serve:** AI and hosting about ₹2–₹20 per invite.

| Stage   | Invites / month | Running cost (estimate) |
| ------- | --------------- | ----------------------- |
| Launch  | 500             | ~₹7,000                 |
| Growing | 5,000           | ~₹60,000                |
| Scale   | 50,000          | ~₹4.6 lakh              |

## 13. Risks

| Risk                     | Response                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Competitors add 3D       | Win on guest tools, languages, multi-function weddings                                 |
| Old phones               | Automatic 2D fallback                                                                  |
| Free WhatsApp images     | Generous free edition; watermark spreads the brand                                     |
| Seasonal sales           | Festivals, birthdays, business invites, Memories fill quiet months                     |
| AI misuse of real photos | Host-uploaded photos only, content checks                                              |
| Guest data privacy       | Consent, data kept only while the invite is live, follow India's data protection rules |
