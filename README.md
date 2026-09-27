# Shubh Invitation

Shubh, for short: invitations that come alive, for every celebration. This repository keeps its original name, `nimantran`.

3D invitations your guests open, turn and keep. Create an invite in minutes, share it on WhatsApp, and collect RSVPs in one tap.

The full roadmap lives in [docs/PLAN.md](docs/PLAN.md). We build one step at a time.

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Every design-system component, in every state, is at http://localhost:3000/design.

## Scripts

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Start the local dev server                        |
| `npm run build`     | Production build                                  |
| `npm run start`     | Run the production build                          |
| `npm run typecheck` | TypeScript check                                  |
| `npm run lint`      | ESLint, zero warnings allowed                     |
| `npm run format`    | Format all files with Prettier                    |
| `npm run test`      | Unit tests (Vitest)                               |
| `npm run check`     | Type-check, lint, format check and tests together |

## Project structure

```
src/
  app/                Routes, layouts and global styles (design tokens in globals.css)
  components/
    brand/            Logo and doorway mark, mandala, gate-fold card and design previews
    ui/               Design-system components (Step 2)
    motion/           Tilt cards and page transitions
    shell/            Header, footer, language switcher (Step 3)
    landing/          Landing page sections and the 3D hero (Step 3)
  content/            English copy, shaped for next-intl in Step 12
  features/           Feature modules: editor, invite, dashboard … (from Step 4)
  lib/                Shared helpers and config
  test/               Test setup
docs/
  PLAN.md             Phases and steps
  PLAN_REVIEW.md      Review of the build and business plans
  STEP1_REVIEW.md     Code review of Step 1 against the UI quality bar
  Nimantran_Premium_Plan.pdf  Original business plan (written before the rename): market, editions, pricing, costs
  images/             Landing page screenshots
```

## Conventions

- Colours, fonts and radii come only from the tokens in `src/app/globals.css`.
- Every screen works from 320px to 1440px, in light and dark, with keyboard and screen readers.
- `npm run check` must pass before every commit.
