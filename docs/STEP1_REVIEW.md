# Step 1 code review

Reviewed 2026-09-26 against the UI quality bar in [PLAN.md](PLAN.md), on `main` at `02ddd48`.

How it was checked: fresh `npm ci`, `npm run check`, `npm run build`, then the production build in Chromium at 320px and 1440px, light and dark, closed and open, plus keyboard tabbing. Colour contrast was computed from the tokens in `src/app/globals.css`.

## Summary

The foundation is solid. Tooling is strict (strict TypeScript with `noUncheckedIndexedAccess`, zero-warning lint, Prettier), tokens are clean and themed properly, there is no horizontal scroll at any width, focus rings are visible, the logo meets the 44px target, and reduced motion is respected. Everything the quality bar needed from Step 1 is fixed below; the open items belong to later steps.

## Fixed in PR #1

1. **`npm run check` failed on a fresh clone.** `src/app/layout.tsx` uses Next's generated `LayoutProps` type, which only exists after a build. The `typecheck` script now runs `next typegen` first.
2. **`dark:` classes ignored the OS dark mode.** The tokens switch on `prefers-color-scheme`, but the `dark` variant only matched `data-theme="dark"`, so for example the card's darker ground shadow never appeared for most dark-mode users. The variant now follows the same rules as the tokens.
3. **Toggle button announced its state twice.** The card button changed both its label ("Open…"/"Close…") and `aria-pressed`, so screen readers read "Close the sample invitation, pressed". The label is now fixed and `aria-pressed` carries the state.
4. **No CI.** `.github/workflows/ci.yml` now runs `npm run check`, the build and the browser tests on every push and pull request.
5. **No end-to-end or visual tests.** Playwright now loads the production build at 320px and 1440px in light and dark, and fails on horizontal scroll, a wrapped header, accessibility violations (axe, WCAG 2.2 AA), a broken keyboard toggle or a missing link preview. Run locally with `npm run build && npm run test:e2e`.
6. **Header badge wrapped at 320px.** Below 360px the badge shows only the dot; "In development" stays available to screen readers.
7. **Card text failed contrast.** New `--card-gold-text` (4.9:1) and `--card-accent-text` (5.1:1) tokens are used for all card text; the brighter gold and orange stay on borders and ornaments. A minimum text size for real invitation content still belongs in Step 4.
8. **No link preview image.** `src/app/opengraph-image.tsx` renders a 1200×630 preview with the headline and a gate-fold card.
9. **Production URL fell back to localhost.** `site.url` now falls back to Vercel's production or deployment URL before localhost.

## Open findings

### Should fix (later steps)

1. **Fonts load through Fontsource CSS, not `next/font`.** It works, but `next/font` preloads the font and adjusts fallback metrics to avoid layout shift, which helps the Lighthouse 90 target. Worth switching before Step 3.
2. **Theme colour is duplicated.** `viewport.themeColor` repeats the paper hex values from the tokens. Harmless, but put them in one place (for example `src/lib/site.ts`) so a token change doesn't miss them.
3. **No theme toggle yet (planned for Step 3).** When it arrives, set `data-theme` before first paint with a tiny inline script so the page doesn't flash the wrong theme.

### Plan items not yet met (expected)

Translations (next-intl), loading, empty and error states, and a Lighthouse run are not in Step 1's scope. The holding page has no `loading.tsx`, `error.tsx` or custom `not-found.tsx`; add the latter two when the app shell lands in Step 3.
