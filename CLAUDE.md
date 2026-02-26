# CLAUDE.md — Mystical Dog Tarot

## Project Overview

A mystical tarot divination web app with dog-themed Major Arcana cards. Built with Next.js 16 App Router, TypeScript, MUI v5, and Motion for React. Supports bilingual (EN/ZH) content throughout.

## Common Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
npm test         # Run Vitest tests
npx tsc --noEmit # Type check without emitting
```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, `src/` directory)
- **Language**: TypeScript (strict mode)
- **UI**: Material-UI (MUI) v5 + Emotion CSS-in-JS
- **Animations**: Motion for React (formerly Framer Motion)
- **Icons**: MUI Icons (Material Icons)
- **Fonts**: Cinzel (titles), Noto Sans TC (Chinese) — loaded via `next/font/google` with CSS variables
- **Testing**: Vitest + React Testing Library + @testing-library/jest-dom
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout (fonts, ThemeRegistry, Navigation, ParticleBackground)
│   ├── page.tsx             # Home page
│   ├── daily/page.tsx       # Daily card feature
│   ├── reading/page.tsx     # Reading spreads (Single, Three-card, Love, Celtic Cross)
│   ├── gallery/page.tsx     # Card gallery
│   ├── journal/page.tsx     # Reading history / journal
│   ├── error.tsx            # Route-level error boundary
│   └── global-error.tsx     # Global error boundary
├── components/              # Shared React components
│   ├── TarotCard.tsx        # Main card component (flip animation)
│   ├── CardFront.tsx        # Card front — layout, border, text overlay
│   ├── CardBack.tsx         # Card back design
│   ├── Navigation.tsx       # App-wide navigation bar
│   ├── ParticleBackground.tsx  # Animated particle canvas background (pre-rendered sprites)
│   ├── cards/               # Individual dog breed SVG illustration components
│   │   ├── index.ts         # DogIllustrations map + GenericDog export
│   │   ├── FoolDog.tsx      # Card 0 — The Fool (Golden Retriever)
│   │   ├── ...              # 20 more card-specific illustrations
│   │   └── WorldDog.tsx     # Card 21 — The World (Shiba Inu)
│   └── shaders/
│       ├── CardShaderCanvas.tsx  # WebGL shader renderer
│       └── fragmentShader.ts     # GLSL fragment shader source
├── data/
│   └── tarotCards.ts        # All 22 Major Arcana definitions (EN + ZH meanings, dog breeds)
├── types/
│   ├── tarot.ts             # Domain types (TarotCardData, CardMeaning, DrawnCard, SpreadType, etc.)
│   └── reading.ts           # Persistence types (ReadingRecord, DailyCardStorage)
├── theme/
│   ├── theme.ts             # MUI theme (dark mystical palette, Cinzel/Noto Sans TC typography)
│   └── ThemeRegistry.tsx    # Emotion SSR cache provider wrapping MUI
└── __tests__/
    ├── setup.ts             # Vitest setup (@testing-library/jest-dom matchers)
    ├── tarotCards.test.ts    # Data layer tests (cards, helpers, spreads)
    └── TarotCard.test.tsx   # Component rendering tests
```

## Path Aliases

`@/` maps to `src/` (configured in `tsconfig.json`). Always use `@/` imports rather than relative paths across directories.

## Architecture Notes

- **App Router only** — no Pages Router. All routes live under `src/app/`.
- **ThemeRegistry** (`src/theme/ThemeRegistry.tsx`) handles Emotion's SSR cache so MUI styles work correctly with Next.js server components.
- **ParticleBackground** is rendered inside the root layout and sits behind all page content via CSS z-index.
- **tarotCards.ts** is the single source of truth for card data. Each entry includes: card name, dog breed, upright/reversed meanings in both EN and ZH.
- Card illustrations live in `components/cards/` as individual SVG components — one file per card for maintainability and code-splitting.
- **next.config.mjs** enables the Emotion compiler transform (`compiler.emotion: true`).
- **MUI palette extension** — `theme.ts` uses module augmentation to add a custom `mystical` palette section.

## Key Conventions

- TypeScript (`.ts`/`.tsx`) with strict mode enabled. All components and pages are typed.
- Use `import type` for type-only imports.
- Domain types live in `src/types/`. Prefer shared types over inline type definitions.
- Functional components with hooks only — no class components.
- MUI `sx` prop or `styled()` for component styling; avoid plain inline styles where possible.
- Motion for React `motion.*` components for any new animations (card flips, page transitions). Import from `motion/react`.
- Bilingual strings: keep EN and ZH versions together in the same data structure/component rather than separate i18n files.
- No global state library — component-level `useState`/`useEffect` and `localStorage` for persistence (daily card, journal).

## Testing

- Tests live in `src/__tests__/` and use the `*.test.{ts,tsx}` pattern.
- Vitest config is in `vitest.config.ts` with jsdom environment and `@/` alias resolution.
- Use React Testing Library for component tests with MUI's ThemeProvider wrapper.
- WebGL (Canvas getContext) is not available in jsdom — shader components gracefully degrade.
