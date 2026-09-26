# Step 1 code review

Reviewed 2026-09-26 against the UI quality bar in [PLAN.md](PLAN.md), on `main` at `02ddd48`.

How it was checked: fresh `npm ci`, `npm run check`, `npm run build`, then the production build in Chromium at 320px and 1440px, light and dark, closed and open, plus keyboard tabbing. Colour contrast was computed from the tokens in `src/app/globals.css`.

## Summary

The foundation is solid. Tooling is strict (strict TypeScript with `noUncheckedIndexedAccess`, zero-warning lint, Prettier), tokens are clean and themed properly, there is no horizontal scroll at any width, focus rings are visible, the logo meets the 44px target, and reduced motion is respected. The findings below are mostly about things the quality bar requires that Step 1 does not yet enforce.

## Fixed in this PR

1. **`npm run check` failed on a fresh clone.** `src/app/layout.tsx` uses Next's generated `LayoutProps` type, which only exists after a build. The `typecheck` script now runs `next typegen` first.
2. **`dark:` classes ignored the OS dark mode.** The tokens switch on `prefers-color-scheme`, but the `dark` variant only matched `data-theme="dark"`, so for example the card's darker ground shadow never appeared for most dark-mode users. The variant now follows the same rules as the tokens.
3. **Toggle button announced its state twice.** The card button changed both its label ("Open…"/"Close…") and `aria-pressed`, so screen readers read "Close the sample invitation, pressed". The label is now fixed and `aria-pressed` carries the state.

## Open findings

### Must fix before Step 2 is marked done

1. **No CI.** There is no `.github/workflows`, so nothing enforces `npm run check` or the build on each push. Add a workflow that runs `npm ci`, `npm run check` and `npm run build`.
2. **No end-to-end or visual tests yet.** The quality bar requires Playwright and visual checks at phone and desktop widths; Step 1 has one unit test for `cn`. Add Playwright now with a smoke test that loads `/` at 320px and 1440px in both themes, fails on horizontal scroll, and runs an automated accessibility scan (axe). Every later step then inherits it.
3. **Header badge wraps at 320px.** "In development" breaks onto two lines beside the logo. Preventing the wrap pushes it off-screen (logo plus badge need about 330px against 288px available), so this needs a design choice: shorten the text, show only the dot on the narrowest screens, or let the badge drop below the logo.
4. **Card text is too small and too low in contrast.** At 320px the card's labels render at 6.6 to 10.6px, and at about 70% of that once the card opens. The gold (`--card-gold` on ivory, 2.83:1) and orange (`--card-accent` on ivory, 2.84:1) text fail WCAG AA. The card is marked decorative here, so it is not a hard failure on the holding page, but these tokens become the real invitation text in Step 4. Darken both for text (keep the current values for borders and ornaments) and set a minimum text size for card content.

### Should fix

5. **No link preview image.** The metadata declares a large image card but there is no `opengraph-image`. Shared on WhatsApp the link shows no picture, which matters for a product that lives on WhatsApp shares. Add `src/app/opengraph-image.tsx`.
6. **Production URL falls back to localhost.** If `NEXT_PUBLIC_SITE_URL` is missing on Vercel, `metadataBase` becomes `http://localhost:3000` and preview links break. Fall back to Vercel's own URL variables, or fail the build.
7. **`--ink-faint` is 3.61:1 on paper.** It is unused today; note in the token comment that it is for non-text use or large text only, or darken it.
8. **Fonts load through Fontsource CSS, not `next/font`.** It works, but `next/font` preloads the font and adjusts fallback metrics to avoid layout shift, which helps the Lighthouse 90 target. Worth switching before Step 3.
9. **Theme colour is duplicated.** `viewport.themeColor` repeats the paper hex values from the tokens. Harmless, but put them in one place (for example `src/lib/site.ts`) so a token change doesn't miss them.
10. **No theme toggle yet (planned for Step 3).** When it arrives, set `data-theme` before first paint with a tiny inline script so the page doesn't flash the wrong theme.

### Plan items not yet met (expected)

Translations (next-intl), loading, empty and error states, and a Lighthouse run are not in Step 1's scope. The holding page has no `loading.tsx`, `error.tsx` or custom `not-found.tsx`; add the latter two when the app shell lands in Step 3.
