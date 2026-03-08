# Mission: Instrument-Oracle Retheme — Mystical Dog Tarot

## Context

Restyle the entire site (Next.js 16, MUI v5, Motion) from purple/mystical gradients to a precision instrument aesthetic — think audio equipment panels, technical readout interfaces, monochrome restraint. The feel can range from dark-terminal to light-device (like an audio recorder vs. a portable player), but always precise, sparse, and typographically intentional. Card images (`card.imagePath`, `card-base.png`) and dog SVG illustrations are preserved unchanged. All other chrome, layout, and typography changes.

Reference aesthetic: dark instrument readouts (sparse monospace metadata, `> VALUE` data pairs, thin separator lines) and light tactile device surfaces (near-white panels, fine grid lines, muted warm neutrals). Both palettes are valid — use dark for immersive reading pages, light or neutral for navigation chrome and informational pages.

## Design Tokens — STRICT, no deviations

| Token | Value |
|---|---|
| bg-dark | `#0d0d0f` — immersive/reading pages |
| bg-light | `#f0ede8` — device/chrome surfaces (nav, gallery, journal) |
| bg-surface-dark | `#131316` |
| bg-surface-light | `#e8e5e0` |
| bg-panel | `#1a1a1d` (dark) / `#d8d5d0` (light) |
| border-dark | `#252528` |
| border-light | `#c8c5c0` |
| text-on-dark | `#e4e0d8` |
| text-on-light | `#1a1816` |
| text-secondary | `#888078` (works on both) |
| text-muted | `#b0aa9e` |
| accent-gold | `#c4a96e` (only non-neutral color — use sparingly on both palettes) |
| font-mono | `var(--font-mono)` Space Mono — all UI labels, nav, buttons, metadata |
| font-display | `var(--font-display)` Cormorant Garamond — page titles and card names only |
| font-body | `var(--font-noto-sans-tc)` — Chinese text and prose |

No gradients. No glow filters. No blur. No purple. No rounded corners (borderRadius: 0 everywhere). Accent gold appears only on: active nav underline, CTA primary button bg, data labels, card name text below cards. Page-level surface choice: home/daily/reading → dark; gallery/journal/nav → choose whichever reads cleaner.

## Rules

- **ONE task per iteration.** Complete exactly one numbered task, commit, then stop.
- Do NOT batch multiple tasks into one commit.
- Do NOT modify: `CardBack.tsx`, `CardShaderCanvas.tsx`, `fragmentShader.ts`, `components/cards/` (dog SVGs), `ParticleBackground.tsx`, `tarotCards.ts`, `types/`.
- Do NOT install new npm packages.
- Every color in touched files must come from the Design Tokens above — no ad-hoc hex values outside those listed.
- Read each target file fully before editing it.
- After committing, output status and stop.

## Validation

```bash
npm run lint 2>&1 | tail -10
```

Zero new errors in files you touched. Fix any before committing. Pre-existing errors in untouched files are expected — ignore them.

## Tasks (ONE per iteration)

1. Swap fonts in `src/app/layout.tsx`. Remove Cinzel. Add `Space_Mono` (weight 400/700, variable `--font-mono`) and `Cormorant_Garamond` (weight 300/400/500/600, variable `--font-display`), keep `Noto_Sans_TC`. Update html className to include all three variables. Commit: `style: swap to Space Mono + Cormorant Garamond fonts`

2. Retheme `src/theme/theme.ts`. Apply design tokens (mode dark, primary `#c4a96e`, bg default `#0d0d0f`, paper `#131316`, text primary `#e4e0d8`, secondary `#888078`, divider `#252528`). Update mystical palette augmentation to use `#c4a96e` / `#0d0d0f`. Typography: Space Mono as fontFamily default, h1–h3 use Cormorant Garamond (weight 300/400), h4–h6 use Space Mono (weight 700, letterSpacing 0.08em), body1/body2 Noto Sans TC, caption/button/overline Space Mono. MUI overrides: Button (borderRadius 0, uppercase, no boxShadow, contained = `#c4a96e` bg + `#0d0d0f` text, outlined = `#252528` border + `#e4e0d8` text, hover outlined = `#c4a96e` border + `#c4a96e` text), Card (borderRadius 0, bg `#131316`, border `1px solid #252528`, no shadow), AppBar (flat, no shadow, no backgroundImage). Commit: `style: retheme MUI to instrument palette`

3. Restyle `src/app/globals.css`. Body/html bg: solid `#0d0d0f`. Remove all purple/gradient background references. Scrollbar: 4px wide, track `#131316`, thumb `#3a3a3e`, hover `#4a4a4e`. Remove `float`, `pulse-glow`, `shimmer` keyframes and their utility classes. Keep `rotate-slow`. Selection color: `rgba(196, 169, 110, 0.2)`. Remove `.mystical-glow` and `.gold-glow`. Commit: `style: restyle globals to instrument base`

4. Restyle `src/components/Navigation.tsx`. Remove all MUI icon imports and icon usage. Logo: `<Box width=5 height=5 borderRadius=50% bg=#c4a96e />` gold dot + `DOG_TAROT` in Space Mono (0.75rem, letterSpacing 0.15em, color `#e4e0d8`). Desktop nav: plain `<Link>` with Typography (Space Mono, 0.7rem, letterSpacing 0.12em); active = `#e4e0d8` + 1px solid `#c4a96e` bottom pseudo-element; inactive = `#606068`; hover = `#e4e0d8`. AppBar: bg `#0d0d0f`, borderBottom `1px solid #252528`, no backdropFilter. Mobile drawer: right-anchored, bg `#0d0d0f`, borderLeft `1px solid #252528`; items as rows with monospace index (01, 02…) in `#2e2e34` and label in `#e4e0d8`, separated by `1px solid #1a1a1d` borders; active label color `#c4a96e`. Commit: `style: restyle navigation to instrument aesthetic`

5. Restyle `src/app/page.tsx`. Remove MUI icon imports and all spread color logic. Hero: status line (gold dot + `ORACLE_SYS — INITIALIZED` in Space Mono `#606068`), h1 `Mystical Dog Tarot` in Cormorant Garamond (6rem, color `#e4e0d8`, weight 300), Chinese subtitle in Noto Sans TC `#606068`, data-readout box (border `1px solid #252528`, inline `DECK · 22 / SPREADS · 04 / LANG · EN·ZH` in Space Mono). CTAs: two sharp Buttons (contained + outlined). Featured cards: `FEATURED ————————` label (Space Mono `#2e2e34`) with 1px `#1a1a1d` line. Spread selection: flat list of 4 rows each with `01 >` index (`#2e2e34`), name in monospace uppercase (`#e4e0d8`), Chinese name (`#606068`), description (`#3a3a3e`), `→`; rows divided by 1px `#1a1a1d` borders; hover bg `#131316`. Gallery link: monospace text button. Remove MUI Grid/Card for spread section. Commit: `style: restyle home page to terminal oracle aesthetic`

6. Update `src/components/TarotCard.tsx`. Remove purple from box shadows — both card faces use `0 8px 32px rgba(0,0,0,0.7)` only. Card name label below card: Space Mono, 0.6rem, letterSpacing 0.1em, uppercase, color `#c4a96e`. Chinese name: Noto Sans TC, 0.6rem, color `#606068`. Remove Cinzel fontFamily references. Commit: `style: update TarotCard shadows and label typography`

7. Restyle `src/app/daily/page.tsx`. Read the file first. Apply all design tokens. Header: `DAILY_READING` label + current date in monospace. Card meaning display: use `> UPRIGHT` / `> REVERSED` prefix labels in `#606068` before each meaning text. Keywords: monospace tags with `1px solid #252528` border. Replace any purple/gradient colors. All borders sharp (borderRadius 0). Commit: `style: restyle daily page to instrument aesthetic`

8. Restyle `src/app/reading/page.tsx`. Read the file first. Spread selector: flat monospace option rows with active highlight in `#c4a96e`. Card position labels: `POS_01 > PAST` style in Space Mono. Meaning panels: data rows with `>` prefix labels for keywords/meanings. Remove all purple/gradient. borderRadius 0 throughout. Commit: `style: restyle reading page to instrument aesthetic`

9. Restyle `src/app/gallery/page.tsx`. Read the file first. Header: `DECK_CATALOG — 22 CARDS` in Space Mono. Card grid items: card index label `00 >` in `#2e2e34` monospace above each TarotCard, card name in Space Mono uppercase `#e4e0d8` below, breed in `#606068`. Remove purple/gradient. borderRadius 0. Commit: `style: restyle gallery to instrument aesthetic`

10. Restyle `src/app/journal/page.tsx`. Read the file first. Header: `READING_LOG` in Space Mono. Entries: timestamp left-aligned in monospace `#606068`, spread type as `TYPE > CELTIC_CROSS` label, card names in uppercase monospace. Rows separated by `1px solid #1a1a1d`. No card glows. Empty state: `LOG_EMPTY — NO ENTRIES` in monospace. Commit: `style: restyle journal to instrument aesthetic`

## Completion

When all 10 tasks are done:
```
LOOP_COMPLETE
```
