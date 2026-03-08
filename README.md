# Mystical Dog Tarot | 神秘狗狗塔羅

A mystical tarot divination web app where each of the 22 Major Arcana cards is represented by a unique dog breed. Built with Next.js, TypeScript, MUI, and Motion for React.

一個神秘的塔羅牌占卜網站，以可愛的狗狗風格設計。22張大阿爾卡納牌各有獨特的狗狗品種與神秘元素。

## Why This Project

Tarot apps often feel either too generic or too cluttered. This project explores how to build a polished, feature-rich divination experience with:

- **AI-generated card art** — each of the 22 Major Arcana cards is rendered from a unique AI-generated PNG, giving rich, painterly detail without hand-coding graphics
- **WebGL shader effects** — animated card backgrounds via custom GLSL fragment shaders (active in fallback rendering path)
- **Full bilingual support** — English and Traditional Chinese coexist in a single data model, not separate i18n files
- **Client-side persistence** — localStorage for daily cards and reading history, zero backend needed

## Features

- **22 Major Arcana Cards** — each card displays a unique AI-generated dog breed illustration
- **Multiple Reading Spreads** — Single card, Three card, Love reading, Celtic Cross (10 cards)
- **Daily Card** — persisted daily guidance with one card per day
- **Card Gallery** — browse all cards with detailed upright/reversed meanings
- **Reading Journal** — save and review past readings from localStorage
- **Mystical Effects** — particle canvas background, Motion for React card flips, WebGL shader fallback

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 16 (App Router, Turbopack) | File-based routing, SSR support, Emotion compiler integration |
| Language | TypeScript (strict mode) | Full type safety across domain models, components, and pages |
| UI | MUI v5 + Emotion | Rich component library with `sx` prop styling, custom dark theme |
| Animation | Motion for React | Declarative animations for card flips, page transitions, accordions |
| Card Art | AI-generated PNG (`public/cards/`) | Rich painterly illustrations served as static assets via `next/image` |
| Rendering (fallback) | WebGL (GLSL shaders) | Custom animated gradients on card backgrounds when no image asset exists |
| Background | Canvas 2D API | Star and particle system behind all page content |
| Testing | Vitest + React Testing Library | Fast unit and component tests with jsdom |
| Deployment | Vercel | Zero-config Next.js hosting |

## Architecture Decisions

**App Router only** — no Pages Router. All routes live under `src/app/`. Every page is a client component (`'use client'`) since all features rely on browser APIs (localStorage, Canvas, WebGL).

**Single data source** — `src/data/tarotCards.ts` defines all 22 cards with full bilingual content (name, dog breed, upright/reversed meanings for love/career/health, keywords, reflection questions, affirmations). Spreads are also defined here. This avoids scattering card data across components.

**Type-driven domain model** — `src/types/tarot.ts` and `src/types/reading.ts` define shared interfaces (`TarotCardData`, `CardMeaning`, `DrawnCard`, `SpreadType`, `ReadingRecord`). Components and pages import these types, ensuring consistency across the entire app.

**AI-generated image card art (primary path)** — Card art has migrated from programmatic SVG illustrations to AI-generated PNG files stored in `public/cards/` (`card-00.png` through `card-21.png`). The `TarotCardData` type includes an optional `imagePath` field; when present, `CardFront.tsx` renders the image via `next/image` with an SVG overlay for the gold border frame and bilingual text footer. All 22 cards currently have `imagePath` set, so this is the only active rendering path in production. Benefits: far richer visual detail, easier to update art without touching code, maintains Next.js image optimisation (lazy loading, responsive sizes, format conversion).

**SVG illustration components are legacy fallback only** — The 22 dog breed SVG components under `components/cards/` (e.g., `FoolDog.tsx`, `MagicianDog.tsx`) and the WebGL `CardShaderCanvas` are still wired into `CardFront.tsx` as the fallback branch when `card.imagePath` is absent. Since every card currently has an image, these components are unreachable dead code at runtime. **Do not delete them yet** — they serve as a safety net if an image asset goes missing and act as the reference design for each breed. A future cleanup pass should either formally deprecate and remove them or move them behind a dev-only flag. Do not add new SVG illustration logic here; all new card art should go through the `imagePath` pipeline.

**`imagePath` as the art contract** — `TarotCardData.imagePath` (optional `string`) is the single field that controls which rendering path `CardFront.tsx` takes. If you need to swap art for a card, update only `imagePath` in `tarotCards.ts` and drop the new file in `public/cards/`. No component changes required. Keep image files named with the card's zero-padded ID (`card-XX.png`) for predictability.

**SVG overlay on image cards** — even when using AI-generated images, `CardFront.tsx` renders an SVG layer on top for the gold border, corner ornaments, Chinese card name, and keyword text. This keeps the visual frame consistent across both rendering paths and means text/border styling stays in code rather than baked into each image asset.

**MUI theme extension** — the dark mystical palette uses MUI's module augmentation pattern to add a custom `mystical` palette section (purple, gold, pink, blue, dark, glow), keeping all color tokens centralized.

**No global state** — component-level `useState`/`useEffect` with `localStorage` for persistence. The app is simple enough that React Context or a state library would add complexity without benefit.

## Tradeoffs

- **No i18n library** — bilingual strings are co-located in data structures (e.g., `name`/`nameZh`). This is simple for two languages but wouldn't scale to 5+. For this project, co-location keeps translations in sync.
- **Static image assets** — AI-generated PNGs live in `public/cards/` and are served as static files. This keeps deployment simple but means updating card art requires a redeploy. If art changes frequently, a CDN or CMS-backed image pipeline would be worth the complexity.
- **Legacy SVG components** — the original programmatic dog illustrations still exist but are now dead code. They add ~23 files and bundle weight that is never executed. A cleanup task should decide their fate before the codebase grows further.
- **Client-only persistence** — localStorage means data doesn't sync across devices. A backend would add deployment complexity without clear benefit for a personal divination tool.
- **WebGL in jsdom** — the shader component gracefully degrades since jsdom doesn't support `getContext('webgl')`. Tests focus on data and DOM rendering instead. The shader is currently only reachable via the legacy fallback path, so this is low risk.

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
│   ├── CardFront.tsx        # Card front — branches on card.imagePath:
│   │                        #   • imagePath present → next/image + SVG overlay (active path)
│   │                        #   • imagePath absent  → legacy SVG dog + WebGL shader (fallback)
│   ├── CardBack.tsx         # Card back design (SVG mystic pattern)
│   ├── Navigation.tsx       # App-wide navigation bar
│   ├── ParticleBackground.tsx  # Canvas 2D star/particle system
│   ├── cards/               # ⚠️ LEGACY — SVG dog breed illustrations (fallback only)
│   │   ├── index.ts         # DogIllustrations map + GenericDog export
│   │   ├── FoolDog.tsx … WorldDog.tsx  # 22 card-specific SVG components (currently unreachable)
│   │   └── GenericDog.tsx   # Fallback illustration
│   └── shaders/             # ⚠️ LEGACY — only used when card.imagePath is absent
│       ├── CardShaderCanvas.tsx  # WebGL shader renderer
│       └── fragmentShader.ts     # GLSL fragment shader source
├── data/
│   └── tarotCards.ts        # All 22 Major Arcana + spread definitions
│                            # imagePath field points to public/cards/card-XX.png
├── types/
│   ├── tarot.ts             # Domain types (TarotCardData, DrawnCard, SpreadType, etc.)
│   │                        # imagePath?: string controls CardFront rendering path
│   └── reading.ts           # Persistence types (ReadingRecord, DailyCardStorage)
└── theme/
    ├── theme.ts             # MUI dark theme with custom mystical palette
    └── ThemeRegistry.tsx    # Emotion SSR cache provider

public/
└── cards/                   # AI-generated card art (primary card images)
    ├── card-00.png … card-21.png  # One PNG per Major Arcana (zero-padded ID)
    └── card-base.png        # Base template reference
```

## License

GNU General Public License v3.0
