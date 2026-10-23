# Android and iOS apps (Step 33)

Planned 2026-10-23, when the owner decided the website is good enough for now and work moves to the apps. This is the plan for Phase 2a in [PLAN.md](PLAN.md): what the apps are for, how they are built, what Apple and Google require, the decisions the owner makes, the steps in order, and the owner's tasks.

## 1. What the apps are for

- **For hosts and co-hosts.** The apps do what a host does on the website (pick a design, make the invitation, publish, share, run the guest list, cards, video, packages), plus what only a phone app can do well: a notification the moment a guest replies, the phone's contacts on any phone, sharing the video straight to WhatsApp Status, saving cards to the gallery, and links that open the app.
- **Not for guests.** Guests keep opening invitations from their WhatsApp link in the browser, with nothing to install. That is the product's promise (COMPETITORS.md), and the apps never get in its way: guest invitations (`/i/…`) never open in the app.
- **Not yet:** iPad and tablet layouts, offline editing, and features the website doesn't have. Phones only, portrait.

## 2. How we build them

**One Capacitor 8 app (Capacitor 8.5 is current) that opens the live website**, with native features added through Capacitor plugins. PLAN.md chose Capacitor in Step 33; this section says how.

The website can't be packed inside the app: its pages are made on the server, sign-in uses cookies, and changes are saved with server actions. So the app opens the live site in the phone's own web view, and the website learns to behave like an app when it is inside one (section 5, Step 33b).

| Way                                                      | For                                                                                                                                                                                      | Against                                                                                                                            |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Capacitor app that opens the live site** (recommended) | One codebase. Every website fix reaches the app at once, without a store release. Native features through plugins. The app download stays small (a few MB), which suits low-end Android. | Needs a connection (an offline screen covers it). Apple may call it a repackaged website unless it does real app work (section 3). |
| React Native or Expo app                                 | Fully native screens                                                                                                                                                                     | Rebuilding every host screen; the 3D card, the painted pages and the video still need a web view; two codebases to keep equal.     |
| Android-only web wrapper (Trusted Web Activity)          | Fastest Play listing                                                                                                                                                                     | No iPhone app, no native contacts or sign-in, and no way to meet Google's billing rule.                                            |

What this means day to day:

- Most work stays website work. The app needs a store release only when its native part changes (a new plugin, permissions, icons). Website changes reach both apps the moment they deploy.
- Capacitor's documentation describes opening a remote address (`server.url`) as meant for development. Many apps ship this way. We accept that, pin plugin versions, and test every Capacitor upgrade against the live site.
- Plugin code loads only inside the app (a dynamic import behind `isApp()`), so website pages don't get heavier and the Lighthouse scores in QUALITY.md stay where they are.

## 3. What the stores require, and how we meet it

Rules as published on 2026-10-23 (sources in section 10). They change; check them again before each submission.

**Apple**

- **4.2 Minimum functionality:** an app must be more than "a repackaged website". We meet it with native sign-in, push notifications, the phone's contacts, native share and save, links that open the app and an offline screen (Steps 33c to 33f). The reviewer's notes list each one.
- **4.8 Login services:** an app that offers Google sign-in must also offer an equivalent private login, which Sign in with Apple is. Step 33c adds it on iPhone. Phone codes are our own sign-in and need nothing extra.
- **3.1.1 In-app purchase:** unlocking features or content in the app must use Apple's in-app purchase, and apps may not unlock content with their own codes or keys. Outside the United States storefront, the app may not link or point to paying elsewhere. Packages are content unlocked in the app, so on iPhone they are bought through Apple (Step 33g).
- **3.1.3(b) Multiplatform services:** what a host bought on the website works in the app, as long as the same packages can also be bought in the app.
- **3.2.1(vii) Monetary gifts:** one person can give another money outside in-app purchase if it's optional and 100% reaches the receiver. That covers shagun by UPI (Step 17b) later, as long as it isn't tied to unlocking anything.
- **5.1.1(v) Account deletion:** apps that make accounts must let people delete them in the app. **Delete account** on the profile page already does.

**Google Play**

- **Billing:** digital goods bought in the app use Google Play Billing. For users in India, an app may also offer its own payment system (Razorpay) **alongside** Play Billing, for 4% less Play fee. That needs PCI DSS certification, Google's reporting API and enrolment. Play Billing alone comes first (Step 33g). Razorpay as a choice next to it comes later (section 6).
- **Target API level:** from 31 August 2026, new apps and updates must target Android 16 (API level 36). Capacitor 8 does.
- **New personal developer accounts** must run a closed test with at least 12 testers for 14 days in a row before they can publish. Organization accounts don't (decision D3).
- **Data safety form and account deletion link:** the listing must say what data the app collects. It must also link to a web page where people can ask for their account to be deleted without reinstalling the app (Step 33c adds `/account/delete`).

**Store fees.** Apple takes 15% under its Small Business Program (up to US$1 million a year, with enrolment) and Google takes 15% on the first US$1 million each year. This is on packages bought in the apps only. Website sales through Razorpay are unchanged.

## 4. Decisions for the owner

Each has a recommendation. Building starts with 33a to 33f, which none of these block, so there is time to decide.

- **D1. Prices in the apps.** The stores take 15% of what is bought in the apps.
  - **(a) Recommended:** the same prices as the website, and we take the 15% cut. Families compare prices on WhatsApp, and many hosts will still buy on the website.
  - **(b)** App prices about 18% higher to cover the fee. The stores allow different prices, but hosts notice.
  - **Offers:** an offer that lowers a price (20% off, a festival offer) works in the apps by charging the store product at the lower price. A **free** offer (100% off) can't be redeemed in the iPhone app, because Apple forbids unlocking content with our own codes. Recommended: free offers work on the website and the Android app, and the iPhone app shows "This offer is used on the website" without a link. That is allowed, because it gives no way to pay.
- **D2. Which first.** Recommended: build both together (it's one codebase) and submit Android first. Most hosts in India use Android, and Play's review is faster. iPhone follows once Apple approves.
- **D3. Developer accounts as the business or as a person.** Recommended: as the business (organization accounts). That needs a D-U-N-S number. The stores then show the business name as the seller, and Play skips the 12-tester, 14-day test. A personal account works, but the owner's own name shows as the seller.
- **D4. App ID.** Recommended: `com.shubhinvitation.app`. It can never change once published.
- **D5. The final domain first.** The app opens the site's address, and app links are tied to it. Changing the domain after launch needs a new app release, and links in old messages may stop opening the app. LAUNCH.md steps 1 to 4 should be done before the first store build.

## 5. Steps

In order. Each step is one or two pull requests, ends with working, reviewed code, and keeps the UI quality bar in PLAN.md. Rough size: 33a to 33f about 6 to 8 pull requests, 33g 2 to 3. Store review, plus Play's 14-day test if the account is personal, add one to three weeks.

### 33a. The app shell

- Capacitor 8 in this repository: `capacitor.config.ts` at the root, the native projects in `mobile/android` and `mobile/ios`, and the plugins in the root `package.json` with exact versions, so the website and the apps always use the same ones.
- App ID from D4. "Shubh" under the icon. The owner's cream and night icons become the launcher icons (Android's adaptive icon puts the mark on cream), with a splash screen of the mark.
- The app opens `<site>/app` (Step 33b) and adds `ShubhApp/<version> (android)` or `(ios)` to its user agent, so the server knows it's the app. The user agent only changes the layout and never decides anything about security.
- Only the site's own address opens inside the app. WhatsApp, maps, UPI apps, phone, email and every other site open in their own app or the browser.
- A bundled offline screen (English and Hindi) shows when the site can't load, with **Try again**. Its colours come from `globals.css` through the build script, so there are no one-off colours.
- The status bar follows the light or dark theme. The Android back button goes back a page and leaves the app from the start screen. The keyboard never covers the field being typed in. Portrait only, iPhone only on iOS.
- Builds in GitHub Actions: a signed Android App Bundle goes to Play's internal test track, and an iPhone build goes to TestFlight (a macOS runner with fastlane). Day-to-day work needs no Mac, and signing keys live in GitHub secrets. macOS minutes cost more on private repositories, so iPhone builds run only on release tags.

**Done when:** an internal test build installs from Play and TestFlight, opens the website, signs in with a phone code, and shows the offline screen in flight mode.

### 33b. App mode on the website

- `src/lib/app/platform.ts` tells the server it's the app (from the user agent), and the page confirms it through Capacitor.
- `/app`, the app's start screen. Signed out: a short welcome with the opening doors, **Sign in** and **Browse designs**. Signed in: My invites. It replaces the marketing home page in the app.
- A bottom tab bar in the app: **Designs**, **My invites**, **Account** (Admin stays inside Account for admins). It replaces the site's header and footer in the app. The footer's links (privacy, terms, refunds, contact) move to Account.
- Things that only make sense on the website are hidden in the app: blog promotions, the waitlist and "get the app" prompts. Razorpay stays only in internal test builds and never reaches the stores (33g replaces it).
- Safe areas around the notch and the home bar (`viewport-fit=cover`). No tap flashes or rubber-band scrolling where an app wouldn't have them. A light haptic tap on publish and on sent reminders.
- An **Update the app** screen when a page needs a newer app than the one installed (`minAppVersion` in `src/lib/app/version.ts`).
- The Playwright tests also run the host journey with the app's user agent, so a website change that breaks app mode fails before it ships.

**Done when:** the whole host journey works in the app on both platforms, from 320 to 430px wide, light and dark, with large system text, TalkBack and VoiceOver. The journey: design, editor, preview, publish, share, guest list, cards, video, packages and account.

### 33c. Sign-in in the app

- **Phone code:** works as it is. The code fills itself in from the SMS (iPhone's one-time-code autofill, and Android's SMS User Consent through a plugin).
- **Google:** Google blocks its sign-in inside app web views, so the app uses native Google sign-in (Credential Manager on Android, Google's SDK on iPhone) through `@capgo/capacitor-social-login`. The ID token goes to a new server action. It calls Supabase's `signInWithIdToken`, which sets the same session cookies the website uses. `googleSignInUrl` in `src/lib/auth/server.ts` stays for the website.
- **Apple:** Sign in with Apple on iPhone (rule 4.8), through the same server path. It can come to the website later.
- **Account deletion:** already in Profile. A public page, `/account/delete` (English and Hindi), says how, for Google Play's deletion link.
- **Reviewers:** a test phone number with a fixed code for Apple's and Google's reviewers (Supabase's test phone numbers), set by the owner.

**Done when:** all three ways work on both platforms. A Google or Apple sign-in with the same email reaches the same account. Google never opens inside the app.

### 33d. Share, save and contacts

Native versions of the website features app web views don't have (section 8):

- The native share sheet for the video, cards, QR code and invitation link, straight to WhatsApp, Status and Instagram.
- Save to the phone's gallery (video and cards) and to Files or Downloads (the guest list and payments CSVs, the invoice as a PDF).
- **Phone contacts for guest import on Android and iPhone.** Today only Android Chrome can pick contacts, and iPhones can't at all. The host picks the contacts, and only the picked names and numbers are added. The permission text is in English and Hindi, and the privacy policy says so.
- The photo, song and guest-sheet pickers checked with the camera, gallery and files on both.
- WhatsApp, UPI, phone and map links open their apps.

**Done when:** every row in section 8 works in the app, and the website behaves as it does today.

### 33e. Push notifications

- Firebase Cloud Messaging for Android and iPhone (Apple's push key goes into Firebase), through `@capacitor/push-notifications`. Sent from `src/lib/push/` with FCM's HTTP v1 API and a service account kept in Vercel (`FIREBASE_SERVICE_ACCOUNT`).
- A `push_devices` table (account, token, platform, app version, language, last seen) with row level security: each account sees only its own devices. A device is removed on sign-out, and when Firebase says it's gone.
- **What sends one:**
  - A guest replies or changes a reply. It goes from `src/lib/invites/rsvp.ts` after `submit_rsvp()`, grouped to one notification per invitation per 10 minutes ("3 new replies for Aarav & Meera: 2 coming, 1 not sure"). Co-hosts who can see replies get it too.
  - A co-host joins.
  - The day's new photos on the wall, once a day.
  - A package is ready after payment.
  - The morning of each function ("Haldi today at 10:00, 46 coming").
- **Settings in Account:** each kind on or off, and quiet hours from 10 pm to 8 am India time (held, then sent at 8).
- The app asks for permission when it helps, after the first publish ("Tell me when guests reply"), never at first launch.
- Tapping a notification opens the right page, for example the guest list on that guest. The text is in the account's language.

**Done when:** a reply on the website reaches the host's phone within a minute on both platforms, and tapping it opens that guest.

### 33f. Links that open the app

- Android App Links and iOS Universal Links for host pages: `/invites/…`, `/join/…` (co-host links), `/account/…` and `/create`. Guest invitations (`/i/…`) and public pages stay in the browser.
- `/.well-known/assetlinks.json` and `/.well-known/apple-app-site-association` are served by the site.
- Links in emails (welcome, draft reminders, offers) open the app when it is installed.
- On the website, a "Get the app" banner on Android and Safari's app banner on iPhone, on host pages only, never on guest invitations.

**Done when:** a co-host link sent on WhatsApp opens the app on both platforms, signed in, on the join page.

### 33g. Buying packages in the app

As decided in D1.

- **Store products:** one product per price (for example `shubh.pay.1099`), because the stores need every price as its own product. A script (`scripts/store-products.ts`) creates them in Play Console and App Store Connect from the prices set in Admin, Designs, including upgrade differences and offer prices.
- **How a purchase goes:**
  1. On the packages page in the app, the server makes an app order (invite, package, price and product).
  2. The app buys through the store with the order's ID attached (Google's `obfuscatedAccountId`, Apple's `appAccountToken`).
  3. The server checks the purchase with Google (Play Developer API) or Apple (App Store Server API).
  4. The server records the order and gives the package through the same code Razorpay orders use.
  5. The app finishes the purchase, so it can't be used twice.
- **Refunds:** refunds made through the stores arrive as notifications (Google's real-time developer notifications, Apple's App Store Server Notifications v2) at `/api/stores/google` and `/api/stores/apple`. They put the invite back on its earlier package, as Razorpay refunds do.
- **Admin, Orders** shows store orders and where each was paid.
- **Receipts:** the store gives the buyer its receipt. Our invoice page says "Paid through Google Play" or "Paid through the App Store", depending on what the CA says about GST on store sales (owner task 10).
- Razorpay never shows in store builds, and the website's checkout doesn't change.
- Keys in Vercel: a Google Play service account, and Apple's In-App Purchase key (key ID, issuer ID and key).

**Done when:** a test purchase (Play licence testers, Apple's sandbox) gives the invite its package, a store refund takes it back, and Razorpay on the website works as before.

### 33h. App quality pass

- **Real phones:** a low-end Android (2 to 3 GB of memory), a mid-range Android, an older iPhone (SE or 11) and a recent one. Use the QUALITY.md checklist, plus:
  - install size, and a cold start in under 3 seconds on 4G
  - smooth gates and 3D card
  - making the video on the phone without running out of memory on 3 GB
  - offline and back online
  - notifications, links and purchases
- **Accessibility:** TalkBack and VoiceOver, system text at its largest, dark mode, reduced motion and 44px touch targets.
- **Automated:** Maestro smoke tests on an Android emulator in GitHub Actions: open, sign in with the test number, make, publish, reply, notification. The website's own tests keep running as they do.
- **Crash reports:** native crashes from Android vitals and Xcode's Organizer. Website errors go through the existing error alerts, now tagged with the platform and app version.

**Done when:** the checklist passes on all four phones and the results are written into QUALITY.md.

### 33i. Store listings and launch

- **Listings** from BRAND_SEO.md section 7: Play title "Shubh: Invitation Maker", and on the App Store "Shubh Invitation" with the subtitle "Invitations That Come Alive". Descriptions and keywords in English and Hindi. Phone screenshots in English and Hindi. The opening doors as the preview video.
- **Privacy:** Google's Data safety form and Apple's privacy labels. They cover phone number, email and name; the guests' names and numbers a host adds; photos; purchases; and crash and usage data. The privacy policy (`src/content/legal.ts`) gains the app's parts: contacts, push tokens and store purchases.
- Content ratings, categories (Events on Play, Lifestyle on the App Store), support address (`/contact`), and review notes listing the app's native features and the test number.
- **Play:** a closed test (12 testers for 14 days if the account is personal), then production in stages of 10%, 50% and 100%. **iPhone:** TestFlight with family and friends, then App Review.

**Done when:** both apps are live in India.

## 6. After both apps are live

- **Wedding-day tools:** the guest list kept on the phone for venues with weak signal. Check-in at the door: each guest's personal link shows as a QR on their invitation, and hosts or co-hosts scan it. Live arrivals per function.
- **Home-screen widget:** countdown to the next function and today's replies (native code on both platforms).
- **Shortcuts:** long-press the icon for New invitation or Guests. Ask for a store rating after a function goes well.
- **Razorpay next to Play Billing on Android in India:** 4% lower Play fee, and UPI through Razorpay. Needs PCI DSS certification and Google's reporting API.
- **Shagun (Step 17b) on guest pages:** UPI apps open from the app as on the website. Apple's rule 3.2.1(vii) allows it.
- **More:** store listings in each new language the site adds, and tablet and iPad layouts.

## 7. Owner tasks

The ones that take longest come first. Start 1 to 3 now: they can take weeks, and Steps 33a to 33f don't wait for them, but the first store build does.

1. **D-U-N-S number** for the business (free from Dun & Bradstreet; it can take a couple of weeks). Needed for organization accounts on both stores (D3).
2. **Apple Developer Program** as an organization (US$99 a year).
3. **Google Play Console** as an organization (US$25 once), with a payments profile for selling.
4. **The final domain live**, from LAUNCH.md steps 1 to 4 (D5).
5. **Firebase project** (free) for notifications. Invite the developer account.
6. **Google sign-in for the apps:** Android and iPhone OAuth client IDs in Google Cloud, added to Supabase's Google provider.
7. **Sign in with Apple:** a key and a Services ID in the Apple Developer account, added to Supabase's Apple provider.
8. **Supabase:** a test phone number with a fixed code for the stores' reviewers.
9. **Selling in the stores:** in App Store Connect, the Paid Apps agreement, bank and tax details, and the Small Business Program. In Play Console, the 15% fee programme.
10. **CA:** who charges GST and issues the invoice on store sales. Add it to owner task L1.
11. **Phones:** a low-end Android and an iPhone for testing, plus 12 testers if the Play account is personal.
12. **Approve** the store text, screenshots and prices (D1).

## 8. Website features that work differently inside an app

Found by searching the code on 2026-10-23. Step 33d fixes these unless another step is named.

| Feature                                                                               | Where                                                                                                                                                                                    | In the app                                                                                                                                          |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sharing files (`navigator.share`)                                                     | `src/components/publish/share-panel.tsx`, `publish/video-card.tsx`, `cards/card-maker.tsx`                                                                                               | Android's web view has no web sharing. Native share sheet with the file.                                                                            |
| Downloads (`download` links, blob addresses)                                          | `share-panel.tsx` (QR), `video-card.tsx`, `card-maker.tsx`, `dashboard/photo-album.tsx`, `dashboard/scheduled-sends.tsx`, `dashboard/guest-import.tsx`, `account/payments`, `guests.csv` | Web views don't save downloads. Save to the gallery or Files, then offer to share.                                                                  |
| Phone contacts (Contact Picker)                                                       | `src/components/dashboard/guest-import.tsx`                                                                                                                                              | Not in app web views. Native contacts on Android and iPhone.                                                                                        |
| Google sign-in (redirect)                                                             | `src/lib/auth/server.ts`                                                                                                                                                                 | Google blocks it in web views. Native sign-in (33c).                                                                                                |
| Razorpay checkout                                                                     | `src/components/editions/edition-picker.tsx`                                                                                                                                             | Not allowed in store builds. Store billing (33g).                                                                                                   |
| Print or save the invoice (`window.print`)                                            | `src/components/editions/print-button.tsx`, `auto-print.tsx`                                                                                                                             | Not reliable in web views. Native print, or save as PDF and share.                                                                                  |
| Links that leave the site (`target="_blank"`, `window.open`, `wa.me`, maps, calendar) | `src/lib/publish/links.ts` and 18 components                                                                                                                                             | Open in WhatsApp, Maps or the browser, never inside the app (33a).                                                                                  |
| File pickers (photos, own song, guest sheets, wall photos)                            | `editor/own-music.tsx`, `editor/steps/photos-music-steps.tsx`, `dashboard/guest-import.tsx`, `guest/photo-wall.tsx`                                                                      | Supported by Capacitor. Test camera, gallery and files on both.                                                                                     |
| Making the video (WebCodecs, mediabunny)                                              | `src/lib/video/encode.ts`                                                                                                                                                                | Android's web view supports it, and iPhone matches Safari. The existing "can't make video here" message stays. Test memory on low-end phones (33h). |
| Analytics and error reports                                                           | `src/lib/analytics.ts`, `src/lib/errors/`                                                                                                                                                | Tag with platform and app version (33b).                                                                                                            |

## 9. Risks

- **Apple says "repackaged website" (4.2).** Covered by the native features in 33c to 33f and the reviewer's notes. If Apple still refuses, the wedding-day check-in from section 6 is the next native feature to add.
- **The store fee** lowers what we keep on app sales by 15% (D1).
- **Website changes reach the app at once.** That's good for fixes, but a change can break app mode. The Playwright run with the app's user agent (33b) catches it before it ships.
- **Old web views on low-end Android.** Capacitor needs a recent Android System WebView, which Play keeps updated. The app tells people to update it when it is too old.
- **A Capacitor or plugin upgrade can break pages loaded from the live site.** Versions are pinned, and each upgrade gets a test build on real phones before release.
- **Changing the domain after launch** needs a new app release (D5).

## 10. Sources

Checked 2026-10-23.

- Apple, [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (3.1.1, 3.1.3(b), 3.2.1(vii), 4.2, 4.8, 5.1.1(v))
- Google, [Changes to Google Play's billing requirements for developers serving users in India](https://support.google.com/googleplay/android-developer/answer/13306652?hl=en) and [Understanding user choice billing on Google Play](https://support.google.com/googleplay/android-developer/answer/13821247?hl=en)
- Google, [Target API level requirements](https://developer.android.com/google/play/requirements/target-sdk)
- The 12-tester, 14-day rule for new personal Play accounts, from reports such as [ExtendsClass](https://extendsclass.com/blog/google-plays-closed-testing-requirement-what-developers-need-to-know-in-2026). Confirm in Play Console when the account is made.
- Apple's [App Store Small Business Program announcement](https://www.businesswire.com/news/home/20201118005376/en/Apple-Announces-App-Store-Small-Business-Program). Confirm the current terms in App Store Connect.
- Supabase, [native mobile sign-in with ID tokens](https://supabase.com/blog/native-mobile-auth), and Capgo, [Supabase with Capacitor social login](https://capgo.app/blog/setup-supabase-with-capacitor-social-login/)
- Capacitor `server.url` being meant for development: [Ionic forum](https://forum.ionicframework.com/t/capacitor-server-url/240196)
