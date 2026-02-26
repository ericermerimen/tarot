# Mystical Dog Tarot | 神秘狗狗塔羅

A mystical tarot divination web app where each of the 22 Major Arcana cards is represented by a unique dog breed. Built with Next.js, TypeScript, MUI, and Framer Motion.

一個神秘的塔羅牌占卜網站，以可愛的狗狗風格設計。22張大阿爾卡納牌各有獨特的狗狗品種與神秘元素。

## Why This Project

Tarot apps often feel either too generic or too cluttered. This project explores how to build a polished, feature-rich divination experience with:

- **Pure CSS/SVG illustrations** — no external image assets; every dog breed is drawn programmatically
- **WebGL shader effects** — animated card backgrounds via custom GLSL fragment shaders
- **Full bilingual support** — English and Traditional Chinese coexist in a single data model, not separate i18n files
- **Client-side persistence** — localStorage for daily cards and reading history, zero backend needed

## Features

- **22 Major Arcana Cards** — each card features a unique CSS/SVG dog breed illustration
- **Multiple Reading Spreads** — Single card, Three card, Love reading, Celtic Cross (10 cards)
- **Daily Card** — persisted daily guidance with one card per day
- **Card Gallery** — browse all cards with detailed upright/reversed meanings
- **Reading Journal** — save and review past readings from localStorage
- **Mystical Effects** — WebGL shaders, particle canvas background, Framer Motion card flips

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | File-based routing, SSR support, Emotion compiler integration |
| Language | TypeScript (strict mode) | Full type safety across domain models, components, and pages |
| UI | MUI v5 + Emotion | Rich component library with `sx` prop styling, custom dark theme |
| Animation | Framer Motion | Declarative animations for card flips, page transitions, accordions |
| Rendering | WebGL (GLSL shaders) | Custom animated gradients on card backgrounds |
| Background | Canvas 2D API | Star and particle system behind all page content |
| Testing | Vitest + React Testing Library | Fast unit and component tests with jsdom |
| Deployment | Vercel | Zero-config Next.js hosting |

## Architecture Decisions

**App Router only** — no Pages Router. All routes live under `src/app/`. Every page is a client component (`'use client'`) since all features rely on browser APIs (localStorage, Canvas, WebGL).

**Single data source** — `src/data/tarotCards.ts` defines all 22 cards with full bilingual content (name, dog breed, upright/reversed meanings for love/career/health, keywords, reflection questions, affirmations). Spreads are also defined here. This avoids scattering card data across components.

**Type-driven domain model** — `src/types/tarot.ts` and `src/types/reading.ts` define shared interfaces (`TarotCardData`, `CardMeaning`, `DrawnCard`, `SpreadType`, `ReadingRecord`). Components and pages import these types, ensuring consistency across the entire app.

**CSS/SVG card art** — Each of the 22 dog breeds lives in its own file under `components/cards/` (e.g., `FoolDog.tsx`, `MagicianDog.tsx`) with a barrel export in `index.ts`. `CardFront.tsx` (~190 lines) composes the selected illustration into the card layout. All illustrations use pure SVG primitives — zero external image dependencies, cards scale to any resolution, and individual files enable tree-shaking and code-splitting per card.

**MUI theme extension** — the dark mystical palette uses MUI's module augmentation pattern to add a custom `mystical` palette section (purple, gold, pink, blue, dark, glow), keeping all color tokens centralized.

**No global state** — component-level `useState`/`useEffect` with `localStorage` for persistence. The app is simple enough that React Context or a state library would add complexity without benefit.

## Tradeoffs

- **No i18n library** — bilingual strings are co-located in data structures (e.g., `name`/`nameZh`). This is simple for two languages but wouldn't scale to 5+. For this project, co-location keeps translations in sync.
- **No image assets** — pure SVG illustrations are resolution-independent but limited in artistic detail compared to raster art. The stylized look fits the mystical theme.
- **Client-only persistence** — localStorage means data doesn't sync across devices. A backend would add deployment complexity without clear benefit for a personal divination tool.
- **WebGL in jsdom** — the shader component gracefully degrades since jsdom doesn't support `getContext('webgl')`. Tests focus on data and DOM rendering instead.

## Card Designs

Each Major Arcana is represented by a different dog breed:

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

## Quick Deploy

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ericermerimen/tarot&project-name=mystical-dog-tarot&repository-name=mystical-dog-tarot)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ericermerimen/tarot)

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout (fonts, ThemeRegistry, Navigation, ParticleBackground)
│   ├── page.tsx             # Home page
│   ├── daily/page.tsx       # Daily card feature
│   ├── reading/page.tsx     # Reading spreads (Single, Three-card, Love, Celtic Cross)
│   ├── gallery/page.tsx     # Card gallery with detail dialogs
│   ├── journal/page.tsx     # Reading history / journal
│   ├── error.tsx            # Route-level error boundary
│   └── global-error.tsx     # Global error boundary
├── components/              # Shared React components
│   ├── TarotCard.tsx        # Main card component (flip animation)
│   ├── CardFront.tsx        # Card front layout, border, text overlay (~190 lines)
│   ├── CardBack.tsx         # Card back design (SVG mystic pattern)
│   ├── Navigation.tsx       # App-wide navigation bar
│   ├── ParticleBackground.tsx  # Canvas 2D star/particle system
│   ├── cards/               # Individual dog breed SVG illustration components
│   │   ├── index.ts         # DogIllustrations map + GenericDog export
│   │   ├── FoolDog.tsx … WorldDog.tsx  # 22 card-specific illustrations
│   │   └── GenericDog.tsx   # Fallback illustration
│   └── shaders/
│       ├── CardShaderCanvas.tsx  # WebGL shader renderer
│       └── fragmentShader.ts     # GLSL fragment shader source
├── data/
│   └── tarotCards.ts        # All 22 Major Arcana + spread definitions
├── types/
│   ├── tarot.ts             # Domain types (TarotCardData, DrawnCard, SpreadType, etc.)
│   └── reading.ts           # Persistence types (ReadingRecord, DailyCardStorage)
└── theme/
    ├── theme.ts             # MUI dark theme with custom mystical palette
    └── ThemeRegistry.tsx    # Emotion SSR cache provider
```

## License

GNU General Public License v3.0
