# 🐕 Mystical Dog Tarot | 神秘狗狗塔羅

A mystical tarot divination website featuring adorable dog-styled cards. Each of the 22 Major Arcana cards features a unique dog breed with a mystical twist.

一個神秘的塔羅牌占卜網站，以可愛的狗狗風格設計。22張大阿爾卡納牌各有獨特的狗狗品種與神秘元素。

## ✨ Features 功能

- **22 Major Arcana Cards** - Each card features a cute dog with mystical atmosphere
- **Multiple Reading Spreads** - Single card, Three card, Love reading, Celtic Cross
- **Daily Card** - Get your daily guidance with persistence
- **Bilingual Support** - Full English and Chinese translations
- **Card Gallery** - Browse all cards and their meanings
- **Reading Journal** - Save and review your past readings
- **Mystical Effects** - Particle background, card flip animations, glowing effects

## 🎴 Card Designs 卡牌設計

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

## 🚀 Quick Deploy 快速部署

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ericermerimen/tarot&project-name=mystical-dog-tarot&repository-name=mystical-dog-tarot)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ericermerimen/tarot)

## 🛠️ Tech Stack 技術棧

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI) v5
- **Animations**: Framer Motion
- **Styling**: Emotion CSS-in-JS
- **Icons**: Material Icons
- **Fonts**: Cinzel (titles), Noto Sans TC (Chinese)

## 📦 Local Development 本地開發

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure 專案結構

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.js         # Home page
│   ├── daily/          # Daily card page
│   ├── reading/        # Reading spreads page
│   ├── gallery/        # Card gallery page
│   └── journal/        # Reading history page
├── components/         # React components
│   ├── TarotCard.js   # Main card component
│   ├── CardFront.js   # Card front with dog illustrations
│   ├── CardBack.js    # Card back design
│   ├── Navigation.js  # App navigation
│   └── ParticleBackground.js
├── data/
│   └── tarotCards.js  # All 22 cards with meanings
└── theme/
    └── theme.js       # MUI theme configuration
```

## 📄 License 授權

GNU General Public License v3.0

---

Made with 🐕 and ✨ magic
