# Nimantran

3D invitations your guests open, turn and keep. Create an invite in minutes, share it on WhatsApp, and collect RSVPs in one tap.

The full roadmap lives in [docs/PLAN.md](docs/PLAN.md). We build one step at a time.

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

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
    brand/            Logo, mandala and brand illustrations
    ui/               Design-system components (Step 2)
  features/           Feature modules: editor, invite, dashboard … (from Step 4)
  lib/                Shared helpers and config
  test/               Test setup
docs/
  PLAN.md             Phases and steps
  PLAN_REVIEW.md      Review of the build and business plans
  STEP1_REVIEW.md     Code review of Step 1 against the UI quality bar
  Nimantran_Premium_Plan.pdf  Business plan: market, editions, pricing, costs
  images/             Landing page screenshots
```

## Conventions

- Colours, fonts and radii come only from the tokens in `src/app/globals.css`.
- Every screen works from 320px to 1440px, in light and dark, with keyboard and screen readers.
- `npm run check` must pass before every commit.
