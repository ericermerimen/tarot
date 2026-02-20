# CLAUDE.md — Mystical Dog Tarot

## Project Overview

A mystical tarot divination web app with dog-themed Major Arcana cards. Built with Next.js App Router, MUI v5, and Framer Motion. Supports bilingual (EN/ZH) content throughout.

## Common Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, `src/` directory)
- **UI**: Material-UI (MUI) v5 + Emotion CSS-in-JS
- **Animations**: Framer Motion
- **Icons**: MUI Icons (Material Icons)
- **Fonts**: Cinzel (titles), Noto Sans TC (Chinese) — loaded via Google Fonts in `layout.js`
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── layout.js         # Root layout (fonts, ThemeRegistry, Navigation, ParticleBackground)
│   ├── page.js           # Home page
│   ├── daily/page.js     # Daily card feature
│   ├── reading/page.js   # Reading spreads (Single, Three-card, Love, Celtic Cross)
│   ├── gallery/page.js   # Card gallery
│   ├── journal/page.js   # Reading history / journal
│   ├── error.js          # Route-level error boundary
│   └── global-error.js   # Global error boundary
├── components/           # Shared React components
│   ├── TarotCard.js      # Main card component (flip animation)
│   ├── CardFront.js      # Card front — dog breed illustrations via CSS/SVG
│   ├── CardBack.js       # Card back design
│   ├── Navigation.js     # App-wide navigation bar
│   ├── ParticleBackground.js  # Animated particle canvas background
│   └── shaders/          # Any WebGL/shader assets for effects
├── data/
│   └── tarotCards.js     # All 22 Major Arcana definitions (EN + ZH meanings, dog breeds)
└── theme/
    ├── theme.js           # MUI theme (dark mystical palette, Cinzel/Noto Sans TC typography)
    └── ThemeRegistry.js   # Emotion SSR cache provider wrapping MUI
```

## Path Aliases

`@/` maps to `src/` (configured in `jsconfig.json`). Always use `@/` imports rather than relative paths across directories.

## Architecture Notes

- **App Router only** — no Pages Router. All routes live under `src/app/`.
- **ThemeRegistry** (`src/theme/ThemeRegistry.js`) handles Emotion's SSR cache so MUI styles work correctly with Next.js server components.
- **ParticleBackground** is rendered inside the root layout and sits behind all page content via CSS z-index.
- **tarotCards.js** is the single source of truth for card data. Each entry includes: card name, dog breed, upright/reversed meanings in both EN and ZH.
- Card illustrations are generated purely with CSS/SVG inside `CardFront.js` — no external image assets.
- `next.config.js` enables the Emotion compiler transform (`compiler.emotion: true`).

## Key Conventions

- JavaScript (`.js`), not TypeScript. Do not introduce `.ts`/`.tsx` files.
- Functional components with hooks only — no class components.
- MUI `sx` prop or `styled()` for component styling; avoid plain inline styles where possible.
- Framer Motion `motion.*` components for any new animations (card flips, page transitions).
- Bilingual strings: keep EN and ZH versions together in the same data structure/component rather than separate i18n files.
- No global state library — component-level `useState`/`useEffect` and `localStorage` for persistence (daily card, journal).
