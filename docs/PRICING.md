# Pricing — personal and business plans

The single source of truth for what Shubh Invitation charges. [PRODUCT.md](PRODUCT.md) section 9 summarises it; [PAYMENTS.md](PAYMENTS.md) covers shagun, contributions and ticket commission.

Build order: Step 15 (plans and entitlements), Step 16 (one-time checkout), Step 16a (Family Plus subscription), Step 26 (business subscriptions), Step 26a (Enterprise and reseller). See [PLAN.md](PLAN.md).

> Prices are starting proposals. Test them with the first 500 buyers, then fix them. All Indian prices **include 18% GST**.

---

## 1. Who pays, and how

| Group                                                                           | How often              | Model                                        |
| ------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------- |
| Families: weddings and big events                                               | Once or twice in years | **Pay once per event** (passes)              |
| Regular hosts: birthdays, anniversaries, festivals, pujas, housewarmings, gifts | Several times a year   | **Family Plus**, a yearly plan               |
| Businesses: planners, printers, venues, studios, companies, colleges            | Every week             | **Business subscription**, monthly or yearly |

Principles:

- **One clear price, shown before you start.** Never coins, never per-guest charges (the most criticised part of Paperless Post, see [COMPETITORS.md](COMPETITORS.md)).
- **Preview everything free.** Pay only to remove the watermark and send. People buy what they have already seen.
- **Every link stays live until the last function date plus 7 days,** free or paid. Free is limited by features, never by an expiring link.
- **Upgrade any time by paying the difference.**
- **Cancel subscriptions in two taps,** with a reminder 7 days before every renewal.

## 2. Personal: packages per invite (decided 2026-10-09)

Every design has a price the master admin sets (**Admin, Designs**): Free, Premium (default ₹499), Royal (default ₹599) or Signature (default ₹799, for the moving scenes, whose painting plays in layers like a short film). Each invite then picks one of three packages, priced on its design. The admin sets the design prices, the two package add-ons and the invite counts; the defaults are below. Code: `src/lib/plans/catalog.ts` and `src/lib/plans/design-tiers.ts`.

|                                       | Free                    | Basic                      | Celebration (most chosen) | Grand               |
| ------------------------------------- | ----------------------- | -------------------------- | ------------------------- | ------------------- |
| **Price (India, incl. GST)**          | ₹0, free designs only   | **The design's price**     | **Design + ₹500**         | **Design + ₹1,500** |
| On a ₹499 design                      | —                       | ₹499                       | ₹999                      | ₹1,999              |
| On a ₹599 design                      | —                       | ₹599                       | ₹1,099                    | ₹2,099              |
| On a ₹799 design                      | —                       | ₹799                       | ₹1,299                    | ₹2,299              |
| On a free design                      | ₹0                      | ₹0 (same as Free, no mark) | ₹500                      | ₹1,500              |
| Watermark                             | Small “Made with Shubh” | No                         | No                        | No                  |
| Invites by link (guests + open link)  | 50                      | 50                         | 500                       | Unlimited           |
| Functions, RSVP, guest list, own link | Every function          | Every function             | Every function            | Every function      |
| Card languages                        | 1                       | 1                          | 2                         | 2                   |
| Own song                              | —                       | —                          | Yes                       | Yes                 |
| WhatsApp Status and Reels video       | —                       | —                          | One video                 | One per function    |
| Guest photo wall                      | —                       | —                          | 30 days                   | 1 year              |
| Co-hosts                              | 1                       | 1                          | 3                         | Unlimited           |

Rules:

- **Full preview, then pay, then publish.** The editor's last step shows the invite as guests will see it (`/invites/<id>/preview`). Publishing a Free invite while checkout is on opens the packages first; a free design can continue free from the Basic card.
- **Upgrades pay the difference** between packages, and between designs when a paid invite moves to a dearer one.
- An invite remembers the design tier it was bought on (`event_plans.design_tier`), so its package price stays fair if the admin later changes the design's tier.
- Not in any package yet, because they are not built: save-the-date and thank-you cards, PDF and printable QR. Add them to Grand when they exist.

## 3. Personal: Family Plus (yearly)

For families who celebrate often. Offered to every host after their first event, and to every wedding family after the wedding, alongside the first-anniversary star map.

|                 | Family Plus                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Price**       | **₹999 / year** (India, incl. GST) · $29 / year (international)                                                         |
| Invitations     | **Unlimited Premium-level events**: birthdays, anniversaries, festivals, pujas, housewarmings, baby ceremonies, parties |
| Weddings        | Not included; get **₹500 off** a Royal pass or Wedding bundle                                                           |
| Memories gifts  | **2 Gift-level gifts a year** (star map, globe or gallery)                                                              |
| Greeting cards  | Unlimited festival greetings and thank-you cards                                                                        |
| Family members  | Up to 4 accounts share the plan                                                                                         |
| Saved dates     | Birthday and anniversary reminders with a ready invite or gift                                                          |
| Everything else | As Premium                                                                                                              |

Why weddings stay separate: they are our largest single payment and need the Royal features; a yearly plan that covered them would undercut the bundle.

## 4. Business plans

|                              | Starter                                       | Pro                                                   | Enterprise                                                               |
| ---------------------------- | --------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| **Price (India, incl. GST)** | **₹999 / month** or ₹9,999 / year             | **₹2,999 / month** or ₹29,999 / year                  | Custom                                                                   |
| **Price (international)**    | $19 / month or $190 / year                    | $59 / month or $590 / year                            | Custom                                                                   |
| Best for                     | Freelance planners, photographers, decorators | Wedding planners, print shops, venues, event agencies | Venue chains, large printers, corporates, colleges, white-label partners |
| Client events                | 10 a month                                    | Unlimited                                             | Unlimited                                                                |
| Level of each event          | Royal                                         | Royal                                                 | Royal                                                                    |
| Team members                 | 2                                             | 10                                                    | Unlimited                                                                |
| Branding                     | Your logo in the footer                       | Your logo and colours; no Shubh Invitation watermark  | Full white-label on your own domain                                      |
| Client workspace             | Yes                                           | Yes, with client approval links                       | Yes, with SSO                                                            |
| Bulk tools                   | —                                             | Bulk guest import, duplicate events, bulk edits       | Plus API access                                                          |
| Reselling                    | —                                             | Buy passes at 30% off and resell at your own price    | Custom wholesale pricing                                                 |
| AI allowance                 | 30 AI images, 10 MP4 exports a month          | 150 AI images, 50 MP4 exports a month                 | Custom                                                                   |
| Ticketing commission         | Standard                                      | Reduced                                               | Negotiated                                                               |
| Print partner orders         | Yes                                           | Yes, with trade prices                                | Yes, with trade prices                                                   |
| Analytics                    | Per event                                     | Across all clients                                    | Across all clients, exportable                                           |
| Support                      | Chat                                          | Priority chat and phone                               | Account manager                                                          |
| Free trial                   | 14 days                                       | 14 days                                               | Pilot on request                                                         |

Yearly business plans give about two months free. GST invoices carry the business's GSTIN.

## 5. Other income (details elsewhere)

| Source                                                                                                | Where                                |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Add-ons: wedding website, own domain, printed cards, AI voice invitation, live stream, human designer | [PRODUCT.md](PRODUCT.md), section 10 |
| Platform shagun, group contributions, event tickets                                                   | [PAYMENTS.md](PAYMENTS.md)           |
| Memories gifts: ₹199–₹699 each, prints, yearly Our Story plan                                         | [MEMORIES.md](MEMORIES.md)           |
| Gift registry and vendor referrals                                                                    | [PAYMENTS.md](PAYMENTS.md)           |

## 6. Rules

- **Refunds:** full refund within 7 days if the invite has not been sent to any guest; after sending, no refund but free edits until the event.
- **Upgrades:** pay the difference; features unlock instantly.
- **Subscriptions:** UPI AutoPay mandates and cards through the payment provider; renewal reminder 7 days before; cancel any time, access continues to the end of the paid period.
- **Downgrade or lapse:** published invites stay live until their event plus 7 days; nothing a guest has seen ever breaks.
- **Festival offers:** time-limited (Diwali, wedding season); no permanent discounts.
- **Referrals:** ₹100 credit to the host and to the new customer.
- **Students and NGOs:** 50% off Business Starter on proof.

## 7. Revenue picture (planning estimates)

Freemium products usually convert low single digits, so plan with 3–5% of events paying.

| Assumption                                     | Value                                       |
| ---------------------------------------------- | ------------------------------------------- |
| Events created per month                       | 5,000                                       |
| Paying share                                   | 3% to 5%                                    |
| Average pass price paid                        | about ₹700 (mix of Premium, Royal, bundles) |
| Pass revenue per month                         | about ₹1.05 lakh to ₹1.75 lakh              |
| After GST (÷ 1.18) and gateway fees (about 2%) | about ₹87,000 to ₹1.45 lakh                 |

On top, and repeating every month: Family Plus renewals, business subscriptions, add-ons, Memories and payment commission. Running costs at this volume are about ₹60,000 a month ([PRODUCT.md](PRODUCT.md), section 12).

## 8. Entitlements (for the code)

- Plans are **data**: a `plans` catalogue (id, kind: pass, family, business; prices by currency; limits) checked with Zod, like categories and templates.
- Each event gets an **entitlement** row (plan, limits, source: pass, Family Plus, business seat, reseller) instead of checking the user's plan at every screen.
- One function answers every limit question: `can(event, "add_function")`, `limit(event, "guests")`.
- The editor shows locked features with the plan that unlocks them and the price difference; never a dead end.
- Free watermark, limits and upgrade flow are Step 17.

## 9. Build steps

| Step    | Scope                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **15**  | Plan catalogue and entitlements for Free, Basic, Celebration, Grand, Family Plus and business plans; limits enforced in editor and guest pages |
| **16**  | One-time checkout for passes and extras (UPI, cards), receipts, GST invoices                                                                   |
| **16a** | Family Plus subscription: UPI AutoPay and cards, renewals, reminders, cancel, family member sharing, wedding discount                          |
| **17**  | Watermark, locked-feature prompts, upgrade by paying the difference, coupons and festival offers                                               |
| **26**  | Business Starter and Pro subscriptions, trials, team members, client workspaces, reseller pass purchases                                       |
| **26a** | Enterprise: white-label on own domain, SSO, API, custom pricing                                                                                |
