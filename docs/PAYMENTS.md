# Payments — shagun, contributions and tickets

Guests can send shagun (gift money), friends can pool contributions, and events can sell tickets, all from the invitation. We earn a commission on payments made through the platform.

Build order: Step 17b (free shagun ledger with direct UPI), owner task L1 (legal review), Step 18a (payments through a licensed provider, with fees), Step 25a (ticketing), Step 32 (registry and live stream). See [PLAN.md](PLAN.md).

> **Nothing in this document is legal or tax advice.** The payment structure, fees, KYC and tax treatment must be confirmed with a fintech lawyer and a chartered accountant (task L1) before Step 18a is built.

---

## 1. The rule that shapes everything: we never hold the money

Under RBI rules, a company that collects customers' money and passes it on to others must itself be an authorised payment aggregator; platforms doing this must register their payment aggregator activity separately, and new aggregators need a minimum net worth of ₹25 crore ([Trilegal summary](https://trilegal.com/knowledge_repository/rbis-guidelines-on-regulation-of-payment-aggregators-and-payment-gateways/)). That is out of reach, so:

- **Money never enters a Shubhdwar bank account on its way to the family.**
- A licensed payment aggregator moves the money and splits it: most to the family's bank account, our commission to us. Razorpay Route is built for this: it splits incoming payments among multiple third-party linked accounts ([Razorpay Route docs](https://razorpay.com/docs/route/)). Linked accounts must be added before transfers can happen.
- Where no fee is charged, guests pay the family directly by UPI and the money never touches any of our systems.

## 2. Features

### 2.1 Shagun ledger with direct UPI (free) — Step 17b

- Host adds their UPI ID; the guest page shows a "Send shagun" button that opens the guest's UPI app with the family's UPI ID and a note ("Shagun for Aarav and Meera, from Priya").
- Also shows the family's UPI QR for guests on desktop.
- **Ledger:** because money goes directly, the guest taps "I've sent it" and optionally enters the amount; the host sees a ledger of who sent what, can mark entries confirmed, and can add cash and envelope gifts by hand at the wedding.
- Export the ledger (CSV) and send thank-you notes from it (Step 24).
- No money through us, no KYC, no commission. It drives upgrades and goodwill.
- Host can hide amounts from co-hosts if the family prefers.

### 2.2 Shagun and group contributions through the platform — Step 18a

- Guest pays by UPI, card, netbanking or wallet inside the invite.
- The licensed provider splits the payment: the family's linked account receives the gift minus fees; our commission goes to us.
- Ledger fills itself automatically, with receipts.
- **Group contributions:** friends pool money for a gift, a bachelor trip, or destination-wedding costs, with a target, progress bar and contributor list.
- Refunds for cancelled events and failed transfers follow the provider's rules.

### 2.3 Ticketing for paid events — Step 25a (Business edition)

- Birthday bashes, college fests, conferences, workshops, concerts, business launches, charity dinners.
- Ticket types (early bird, VIP, group), limits, promo codes, QR tickets, check-in scanner in the host dashboard.
- Payout to the organiser's linked account minus our commission.
- This is the clearest commission business: organisers expect a per-ticket fee.

### 2.4 Gift registry and vendors — Step 32

- Registry with partner stores; guests buy from the partner, we earn affiliate commission. No money through us.
- Vendor suggestions (makeup, decor, hotels, travel) with referral fees, clearly labelled as partners.

## 3. Pricing and commission (starting proposals)

| Flow                          | Who pays                               | Proposal                                        |
| ----------------------------- | -------------------------------------- | ----------------------------------------------- |
| Direct UPI shagun             | Nobody                                 | Free in every edition                           |
| Shagun through platform, UPI  | Guest or family (host chooses)         | Small flat fee per gift or a low percentage     |
| Shagun through platform, card | Guest                                  | Percentage covering card cost plus our margin   |
| Group contributions           | Contributor                            | Low percentage per contribution                 |
| Tickets                       | Buyer or organiser (organiser chooses) | A few percent per ticket plus a small fixed fee |
| Registry and vendors          | Partner                                | Affiliate commission                            |

Payment provider fees come out of the same amount, so every price above must be set after comparing provider rates and GST on our fee (task L1). Show the exact fee before the guest pays; never hide it.

**Cultural note:** a fee on blessings can feel wrong. Default shagun to direct UPI; offer platform shagun as a convenience (cards, automatic ledger, receipts), with the fee visible and optional.

## 4. Trust and safety

- **Fake invites asking for money are the biggest risk.** Controls:
  - Platform payments only after host KYC through the provider's linked-account onboarding
  - "Verified family" badge on invites with completed KYC
  - Direct UPI shows the UPI ID's registered name before paying (the guest's UPI app does this) plus a warning to check it matches the family
  - Limits per invite and per guest for new hosts; higher limits after the event date passes cleanly
  - "Report this invite" on every guest page; payments paused on reports pending review
- Never ask guests for card details inside our own forms; the provider's checkout handles all payment data.
- Guest payment details are visible only to the host and co-hosts with payment permission.

## 5. Owner task L1: legal and tax review (before Step 18a)

- [ ] Confirm the Route-style split is compliant for gifts between individuals (not just merchants)
- [ ] Linked-account KYC requirements for individual hosts
- [ ] GST on our commission; invoicing; TDS if any
- [ ] Tax treatment of gifts received (explain to hosts in plain words, with a CA's wording)
- [ ] Refund, chargeback and dispute policy
- [ ] Terms of service and privacy policy updates
- [ ] Charity and religious donations (puja, bhandara): allowed or not, and under what rules
- [ ] Compare providers (Razorpay, Cashfree, PayU and others) on split payments, fees, payout speed and individual-host support

## 6. Data

Tables (added in the relevant steps): `payout_accounts` (provider linked-account id, KYC status; no bank details stored by us), `gifts` (ledger entries: guest, amount, method, status, note), `contributions` and `contribution_goals`, `ticket_types`, `tickets`, `payouts`, `payment_events` (provider webhooks). Row Level Security as in Step 8; payment rows readable only by hosts with payment permission.

## 7. Build steps

| Step           | Scope                                                                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **17b**        | Direct UPI shagun button and QR, self-reported ledger, manual entries, CSV export, hide amounts option                                                                                                      |
| **L1** (owner) | Legal and tax review; pick provider                                                                                                                                                                         |
| **18a**        | Platform shagun and group contributions through the provider: linked-account onboarding and KYC, split payments, fees shown upfront, automatic ledger, receipts, refunds, verified badge, limits, reporting |
| **25a**        | Ticketing: ticket types, promo codes, QR tickets, check-in scanner, organiser payouts                                                                                                                       |
| **32**         | Gift registry with partner stores, vendor referrals, live-stream page                                                                                                                                       |
