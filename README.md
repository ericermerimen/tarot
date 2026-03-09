# Mystical Dog Tarot | 神秘狗狗塔羅

A mystical tarot divination web app where each of the 22 Major Arcana cards is represented by a unique dog breed. Built with Next.js 16, TypeScript, MUI v5, and Motion for React.

## Features

- **22 Major Arcana Cards** — AI-generated dog breed illustrations
- **Multiple Reading Spreads** — Single card, Three card, Love reading, Celtic Cross (10 cards)
- **Daily Card** — persisted daily guidance (one card per day via localStorage)
- **Card Gallery** — browse all cards with detailed upright/reversed meanings
- **Reading Journal** — save and review past readings
- **i18n** — URL-based locale routing (`/en`, `/zhTW`, `/jp`) via next-intl
- **State Persistence** — tarot results survive language switches (sessionStorage)
- **Visual Effects** — particle canvas background, card flip animations, WebGL shader fallback

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| UI | MUI v5 + Emotion |
| Animation | Motion for React |
| i18n | next-intl (locale-based URL routing) |
| Card Art | AI-generated PNG (`public/cards/`) |
| Rendering (fallback) | WebGL (GLSL shaders) |
| Background | Canvas 2D particle system |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en
npm run build
npm test
npx tsc --noEmit   # type check
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout shell (passthrough)
│   └── [locale]/                     # Locale-segmented routes
│       ├── layout.tsx                # Locale layout (fonts, providers, NextIntlClientProvider)
│       ├── page.tsx                  # Home page
│       ├── daily/page.tsx            # Daily card
│       ├── reading/page.tsx          # Reading spreads
│       ├── gallery/page.tsx          # Card gallery
│       ├── journal/page.tsx          # Reading journal
│       └── error.tsx                 # Error boundary
├── components/
│   ├── TarotCard.tsx                 # Card component (flip animation)
│   ├── CardFront.tsx                 # Card front (image + SVG overlay, or legacy SVG fallback)
│   ├── CardBack.tsx                  # Card back design
│   ├── Navigation.tsx                # Nav bar + language switcher
│   ├── Footer.tsx                    # Footer
│   ├── ParticleBackground.tsx        # Canvas 2D star/particle system
│   ├── cards/                        # ⚠️ LEGACY — SVG dog illustrations (fallback only)
│   └── shaders/                      # ⚠️ LEGACY — WebGL shader (fallback only)
├── data/
│   └── tarotCards.ts                 # 22 Major Arcana definitions + spread configs
├── i18n/
│   ├── routing.ts                    # Locale config (en, zhTW, jp)
│   ├── request.ts                    # Server-side message loading
│   └── navigation.ts                # Locale-aware Link, useRouter, usePathname
├── hooks/
│   └── useCurrentLocale.ts           # Typed locale hook
├── utils/
│   ├── localeCards.ts                # Locale-aware card data selectors
│   └── readingSummary.ts             # Multi-card reading summary generator
├── types/
│   ├── tarot.ts                      # Domain types (TarotCardData, DrawnCard, SpreadType)
│   └── reading.ts                    # Persistence types (ReadingRecord, DailyCardStorage)
├── theme/
│   ├── theme.ts                      # MUI dark theme + custom mystical palette
│   ├── ThemeRegistry.tsx             # Emotion SSR cache
│   └── ColorModeContext.tsx          # Dark/light mode toggle
├── proxy.ts                          # Next.js 16 locale middleware (was middleware.ts)
└── __tests__/                        # Vitest test suite

messages/
├── en.json                           # English UI strings
├── zhTW.json                         # Traditional Chinese UI strings
└── jp.json                           # Japanese UI strings

public/cards/
├── card-00.png … card-21.png         # AI-generated card art
```

## Internationalization (i18n)

The app uses [next-intl](https://next-intl.dev/) with URL-based locale routing.

### Supported Locales

| Locale | URL Prefix | Language |
|--------|-----------|----------|
| `en` | `/en/...` | English (default) |
| `zhTW` | `/zhTW/...` | Traditional Chinese |
| `jp` | `/jp/...` | Japanese |

### How It Works

1. **Routing** — `src/i18n/routing.ts` defines supported locales. All pages live under `src/app/[locale]/`.
2. **Middleware** — `src/proxy.ts` detects locale from URL prefix, cookies, or Accept-Language header. Redirects `/` → `/en`.
3. **Messages** — UI strings in `messages/{locale}.json`. Loaded per-request via `src/i18n/request.ts`.
4. **Components** — Use `useTranslations('namespace')` for UI text. Use `localeCards.ts` helpers for card data (name, meaning, keywords) based on current locale.
5. **Navigation** — `src/i18n/navigation.ts` exports locale-aware `Link`, `useRouter`, `usePathname`. All internal links automatically include the locale prefix.
6. **Language Switcher** — `EN | 中文 | 日本語` buttons in the nav bar. Uses `router.replace(pathname, { locale })` for client-side locale switching.

### State Persistence During Language Switch

When the user switches language on the reading page, the URL changes (e.g. `/en/reading` → `/zhTW/reading`), which would normally reset React state. To preserve tarot results:

- Reading state (drawn cards, flipped state, spread selection) is continuously saved to `sessionStorage`
- On page mount, the reading page checks `sessionStorage` for saved state and restores it
- State is cleared after successful restoration

This means a user can draw cards, flip them, see results, switch language, and their reading remains intact — only the UI text changes.

### Card Data Localization

Card data (names, meanings, keywords) lives in `src/data/tarotCards.ts` with parallel fields (`name`/`nameZh`, `meaning`/`meaningZh`). The `src/utils/localeCards.ts` module provides selector functions that pick the correct field based on locale:

```ts
getCardName(card, locale)    // → "The Fool" or "愚者"
getMeaning(meaning, locale)  // → { meaning, love, career, health, advice }
getKeywords(card, locale)    // → ["beginnings", ...] or ["新開始", ...]
getPositions(spread, locale) // → ["Past", "Present", "Future"] or ["過去", "現在", "未來"]
```

Japanese (`jp`) currently falls back to English card data. To add full JP card content, add `nameJp`, `meaningJp`, etc. fields to `TarotCardData` and update the selector switch cases.

### Adding a New Locale

1. Add the locale code to `src/i18n/routing.ts` → `locales` array
2. Create `messages/{locale}.json` with all UI string keys
3. Add a label in `Navigation.tsx` → `localeLabels` map
4. Optionally add card data fields in `tarotCards.ts` and selector cases in `localeCards.ts`

## Architecture Decisions

**App Router only** — No Pages Router. All routes under `src/app/[locale]/`. Pages are client components (`'use client'`) since they rely on browser APIs (localStorage, Canvas, WebGL).

**Single card data source** — `src/data/tarotCards.ts` defines all 22 cards with bilingual content (name, breed, upright/reversed meanings, keywords, reflections, affirmations). Spreads defined here too. Avoids scattering card data across components.

**Type-driven domain model** — `src/types/tarot.ts` and `src/types/reading.ts` define shared interfaces. Components and pages import these types for consistency.

**AI-generated image art (primary)** — Card art via `public/cards/card-XX.png`. `CardFront.tsx` renders image + SVG overlay (gold border, text). The `imagePath` field on `TarotCardData` controls the rendering path.

**SVG illustrations are legacy fallback** — The 22 SVG dog components under `components/cards/` and WebGL `CardShaderCanvas` are wired as fallback when `imagePath` is absent. Currently unreachable since all cards have images. Do not delete yet — safety net if an image goes missing.

**No global state** — Component-level `useState`/`useEffect` + `localStorage` for persistence. The app doesn't need Redux or Zustand.

**MUI theme extension** — Dark mystical palette uses module augmentation to add custom `mystical` palette section (purple, gold, pink, blue).

## Tradeoffs

- **Static image assets** — PNGs in `public/cards/`. Simple but requires redeploy for art changes.
- **Legacy SVG components** — ~23 files of dead code. Should be cleaned up or formally deprecated.
- **Client-only persistence** — localStorage doesn't sync across devices. Acceptable for a personal divination tool.
- **JP card data incomplete** — Japanese locale has full UI translations but card data falls back to English. Adding JP card content requires extending the data model.
- **WebGL in jsdom** — Shader component gracefully degrades in tests. Only reachable via legacy fallback path.

## Card Designs

| Card | Dog Breed | 狗狗品種 |
|------|-----------|----------|
| The Fool | Golden Retriever Puppy | 金毛尋回犬幼犬 |
| The Magician | Border Collie | 邊境牧羊犬 |
| The High Priestess | Shiba Inu | 柴犬 |
| The Empress | Corgi | 柯基犬 |
| The Emperor | German Shepherd | 德國牧羊犬 |
| The Hierophant | Saint Bernard | 聖伯納犬 |
| The Lovers | Two Huskies | 兩隻哈士奇 |
| The Chariot | Sled Dogs | 雪橇犬隊 |
| Strength | Pit Bull | 比特犬 |
| The Hermit | Old Akita | 年邁秋田犬 |
| Wheel of Fortune | Dalmatian | 斑點狗 |
| Justice | Doberman | 杜賓犬 |
| The Hanged Man | Basset Hound | 巴吉度獵犬 |
| Death | Black Greyhound | 黑色靈緹犬 |
| Temperance | Australian Shepherd | 澳洲牧羊犬 |
| The Devil | Black Pomeranian | 黑色博美犬 |
| The Tower | Chihuahua | 吉娃娃 |
| The Star | Samoyed | 薩摩耶犬 |
| The Moon | Malamute | 阿拉斯加雪橇犬 |
| The Sun | Labrador | 拉布拉多 |
| Judgement | Angel Collie | 天使牧羊犬 |
| The World | Dancing Shiba | 跳舞柴犬 |

## Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ericermerimen/tarot&project-name=mystical-dog-tarot&repository-name=mystical-dog-tarot)

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ericermerimen/tarot)

## License

GNU General Public License v3.0
