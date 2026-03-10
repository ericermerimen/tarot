'use client';

import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useTranslations } from 'next-intl';
import TarotCard from '@/components/TarotCard';
import { getRandomCards, spreadTypes, tarotCards } from '@/data/tarotCards';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { Link, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getCardName, getKeywords, getMeaning, getSpreadName, getSpreadDescription, getPositions, selectLocaleText, getReflectionQuestions, getAffirmation } from '@/utils/localeCards';
import { generateReadingSummary, getPositionalInterpretation, detectTheme, buildClosingGuidance } from '@/utils/readingSummary';
import type { TarotCardData, DrawnCard, SpreadKey } from '@/types/tarot';
import type { SpreadSummary } from '@/utils/readingSummary';
import type { ReadingRecord, IntentionTag } from '@/types/reading';
import type { DailyCardStorage } from '@/types/reading';

const READING_STATE_KEY = 'tarotReadingState';

interface ReadingState {
  spread: SpreadKey;
  cards: { cardId: number; isReversed: boolean }[];
  flippedCards: number[];
  readingComplete: boolean;
  intentionTag?: IntentionTag;
  intentionNote?: string;
}

function saveReadingState(state: ReadingState) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(READING_STATE_KEY, JSON.stringify(state));
  }
}

function hydrateCards(saved: { cardId: number; isReversed: boolean }[]): DrawnCard[] {
  return saved.map(({ cardId, isReversed }) => {
    const card = tarotCards.find(c => c.id === cardId);
    return card ? { card, isReversed } : null;
  }).filter(Boolean) as DrawnCard[];
}

function getKeyTakeaway(cards: DrawnCard[], spreadType: SpreadKey, locale: Locale): string {
  if (spreadType === 'single' && cards.length > 0) {
    const meaning = cards[0].isReversed ? cards[0].card.reversed : cards[0].card.upright;
    const advice = selectLocaleText(locale, meaning.advice || '', meaning.adviceZh || '', meaning.adviceJa || '');
    const mainMeaning = selectLocaleText(locale, meaning.meaning, meaning.meaningZh, meaning.meaningJa);
    return advice || mainMeaning;
  }
  const outcomeCard = cards[cards.length - 1];
  const theme = detectTheme(cards);
  const closing = buildClosingGuidance(outcomeCard, theme, cards);
  return selectLocaleText(locale, closing.en, closing.zh, closing.ja);
}

function getReadingReflections(cards: DrawnCard[], locale: Locale): string[] {
  const questions: string[] = [];
  for (const drawn of cards) {
    const cardQuestions = getReflectionQuestions(drawn.card, locale);
    if (cardQuestions && cardQuestions.length > 0) {
      questions.push(cardQuestions[drawn.card.id % cardQuestions.length]);
    }
    if (questions.length >= 3) break;
  }
  return questions;
}

function getReadingAffirmation(cards: DrawnCard[], locale: Locale): string | undefined {
  const outcomeCard = cards[cards.length - 1];
  return getAffirmation(outcomeCard.card, locale);
}

function getDailyCardFromStorage(): { cardId: number; isReversed: boolean } | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('dailyCard');
  if (!stored) return null;
  const data: DailyCardStorage = JSON.parse(stored);
  if (data.date !== new Date().toDateString()) return null;
  return { cardId: data.cardId, isReversed: data.isReversed };
}

function buildCopyText(
  cards: DrawnCard[],
  spreadType: SpreadKey,
  positions: string[],
  locale: Locale,
): string {
  const spreadName = getSpreadName(spreadTypes[spreadType], locale);
  const date = new Date().toLocaleDateString(locale === 'zhTW' ? 'zh-TW' : locale === 'ja' ? 'ja-JP' : 'en-US');
  const lines: string[] = [`${spreadName} — ${date}`, ''];

  cards.forEach((drawn, i) => {
    const name = getCardName(drawn.card, locale);
    const rev = drawn.isReversed ? (locale === 'zhTW' ? '（逆位）' : locale === 'ja' ? '（逆位置）' : ' (Reversed)') : '';
    const meaning = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
    const lm = getMeaning(meaning, locale);
    lines.push(`${positions[i]}: ${name}${rev}`);
    lines.push(`  ${lm.meaning}`);
    lines.push('');
  });

  const takeaway = getKeyTakeaway(cards, spreadType, locale);
  const takeawayLabel = locale === 'zhTW' ? '核心訊息' : locale === 'ja' ? '核心メッセージ' : 'Key Takeaway';
  lines.push(`${takeawayLabel}: ${takeaway.replace(/\*\*/g, '')}`);

  return lines.join('\n');
}

function getPositionDescription(position: string, spreadType: SpreadKey, locale: Locale): string {
  const posLower = position.toLowerCase();
  const descs: Record<string, { en: string; zh: string; ja: string }> = {
    past: { en: 'The energy that shaped your journey here', zh: '塑造你旅程的能量', ja: 'あなたの旅路を形作ったエネルギー' },
    present: { en: 'The energy you are living through right now', zh: '你此刻正在經歷的能量', ja: '今あなたが生きているエネルギー' },
    future: { en: 'The energy gathering ahead of you', zh: '在你前方聚集的能量', ja: 'あなたの前方に集まるエネルギー' },
    you: { en: 'Your energy in this connection', zh: '你在這段連結中的能量', ja: 'この繋がりにおけるあなたのエネルギー' },
    partner: { en: 'Your partner or love interest\'s energy', zh: '你伴侶或心儀對象的能量', ja: 'パートナーや気になる人のエネルギー' },
    connection: { en: 'The bond between you', zh: '你們之間的紐帶', ja: '二人の間の絆' },
    challenge: { en: 'What needs to be worked through', zh: '需要克服的事', ja: '乗り越えるべきこと' },
    outcome: { en: 'Where this path is leading', zh: '這條路通往何方', ja: 'この道が向かう先' },
    above: { en: 'Your conscious goals and aspirations', zh: '你意識層面的目標和願望', ja: 'あなたの意識的な目標と願望' },
    below: { en: 'Hidden patterns beneath the surface', zh: '表面之下隱藏的模式', ja: '表面の下に隠されたパターン' },
    advice: { en: 'Guidance on how to move forward', zh: '如何前進的指引', ja: '前に進むための導き' },
    external: { en: 'Outside forces shaping your situation', zh: '影響你處境的外在力量', ja: 'あなたの状況を形作る外的な力' },
    'hopes/fears': { en: 'What you hope for and fear equally', zh: '你同時渴望和畏懼的事', ja: 'あなたが同時に望み恐れていること' },
    guidance: { en: 'The message for your path', zh: '給你道路的訊息', ja: 'あなたの道へのメッセージ' },
  };
  const desc = descs[posLower];
  if (!desc) return '';
  return selectLocaleText(locale, desc.en, desc.zh, desc.ja);
}

/** Map URL slug to SpreadKey */
export const spreadSlugMap: Record<string, SpreadKey> = {
  single: 'single',
  'three-card': 'threeCard',
  love: 'love',
  'celtic-cross': 'celticCross',
};

/** Map SpreadKey to URL slug */
export const spreadKeyToSlug: Record<SpreadKey, string> = {
  single: 'single',
  threeCard: 'three-card',
  love: 'love',
  celticCross: 'celtic-cross',
};

export interface ReadingViewProps {
  spreadKey: SpreadKey;
}

export default function ReadingView({ spreadKey }: ReadingViewProps) {
  const t = useTranslations('reading');
  const locale = useCurrentLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSpreadSwitch = useCallback((slug: string) => {
    startTransition(() => {
      router.push(`/reading/${slug}`);
    });
  }, [router]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '.MuiTabs-indicator { height: 2px !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Restore state from sessionStorage (survives locale switch)
  const savedStateRef = useRef<ReadingState | null>(null);
  if (savedStateRef.current === null && typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(READING_STATE_KEY);
    if (stored) {
      const parsed: ReadingState = JSON.parse(stored);
      sessionStorage.removeItem(READING_STATE_KEY);
      // Only restore if the saved spread matches this route's spread
      if (parsed.spread === spreadKey) {
        savedStateRef.current = parsed;
      }
    }
  }

  const [cards, setCards] = useState<DrawnCard[]>(() => {
    if (savedStateRef.current) {
      return hydrateCards(savedStateRef.current.cards);
    }
    return [];
  });

  const [flippedCards, setFlippedCards] = useState<number[]>(() => {
    return savedStateRef.current?.flippedCards || [];
  });

  const restoredRef = useRef(false);

  const [showIntentionPhase, setShowIntentionPhase] = useState(() => {
    if (savedStateRef.current) return false;
    return true;
  });
  const [selectedTag, setSelectedTag] = useState<IntentionTag>(() => {
    return savedStateRef.current?.intentionTag || 'general';
  });
  const [intentionNote, setIntentionNote] = useState(() => {
    return savedStateRef.current?.intentionNote || '';
  });
  const [cardsDealt, setCardsDealt] = useState(() => {
    return savedStateRef.current ? true : false;
  });

  const currentSpread = spreadTypes[spreadKey] || spreadTypes.single;
  const [showMeaning, setShowMeaning] = useState<number | null>(null);
  const [readingComplete, setReadingComplete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    if (savedStateRef.current) {
      setReadingComplete(savedStateRef.current.readingComplete);
      return;
    }
  }, []);

  // Save reading state to sessionStorage whenever it changes
  useEffect(() => {
    if (cards.length > 0) {
      const state: ReadingState = {
        spread: spreadKey,
        cards: cards.map(c => ({ cardId: c.card.id, isReversed: c.isReversed })),
        flippedCards,
        readingComplete,
        intentionTag: selectedTag,
        intentionNote: intentionNote || undefined,
      };
      saveReadingState(state);
    }
  }, [cards, flippedCards, readingComplete, spreadKey, selectedTag, intentionNote]);

  // Auto-save to journal when reading completes
  useEffect(() => {
    if (!readingComplete || saved || cards.length === 0) return;
    const reading: ReadingRecord = {
      date: new Date().toISOString(),
      spread: spreadKey,
      cards: cards.map((c, i) => ({
        cardId: c.card.id,
        isReversed: c.isReversed,
        position: (spreadTypes[spreadKey] || spreadTypes.single).positions[i],
        positionZh: (spreadTypes[spreadKey] || spreadTypes.single).positionsZh[i],
      })),
      summary: getReadingSummary(),
      intention: {
        tag: selectedTag,
        note: intentionNote.trim() || undefined,
      },
    };
    const history: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
    history.unshift(reading);
    localStorage.setItem('tarotHistory', JSON.stringify(history.slice(0, 50)));
    setSaved(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingComplete]);

  const drawCards = () => {
    const spreadDef = spreadTypes[spreadKey] || spreadTypes.single;
    const newCards = getRandomCards(spreadDef.count);
    setCards(newCards);
    setFlippedCards([]);
    setShowMeaning(null);
    setReadingComplete(false);
    setSaved(false);
    setCopied(false);
    setShowIntentionPhase(false);
    setCardsDealt(true);
  };

  const startNewReading = () => {
    setShowIntentionPhase(true);
    setCardsDealt(false);
    setCards([]);
    setFlippedCards([]);
    setShowMeaning(null);
    setReadingComplete(false);
    setSaved(false);
    setCopied(false);
    setIntentionNote('');
    // Clear sessionStorage so we don't restore stale state
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(READING_STATE_KEY);
    }
  };

  const handleCopyReading = useCallback(async () => {
    const positionsList = getPositions(currentSpread, locale);
    const text = buildCopyText(cards, spreadKey, positionsList, locale);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [cards, spreadKey, currentSpread, locale]);

  const handleCardClick = (index: number) => {
    if (flippedCards.includes(index)) {
      setShowMeaning(showMeaning === index ? null : index);
      return;
    }
    setFlippedCards([...flippedCards, index]);
    setTimeout(() => setShowMeaning(index), 800);
    if (flippedCards.length + 1 === currentSpread.count) {
      setReadingComplete(true);
    }
  };

  const getReadingSummary = (): import('@/types/reading').ReadingSummary | undefined => {
    if (spreadKey === 'single' && cards.length > 0) {
      const cardData = cards[0];
      const meaning = cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
      const lm = getMeaning(meaning, locale);
      return { text: lm.meaning, textZh: meaning.meaningZh, textJa: meaning.meaningJa };
    }
    const spreadSummary = generateReadingSummary(cards, spreadKey);
    if (spreadSummary) {
      return { text: spreadSummary.summary, textZh: spreadSummary.summaryZh, textJa: spreadSummary.summaryJa };
    }
    return undefined;
  };

  const getCardLayout = (): Record<string, string | number | object> => {
    switch (spreadKey) {
      case 'threeCard': return { gridTemplateColumns: 'repeat(3, 1fr)', maxWidth: 600 };
      case 'love': return {
        gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(5, 1fr)' },
        maxWidth: { xs: 340, sm: 800 },
      };
      case 'celticCross': return { display: 'block' };
      default: return { gridTemplateColumns: '1fr', maxWidth: 250 };
    }
  };

  const positions = getPositions(currentSpread, locale);

  const dailyCardMatch = (() => {
    if (!cardsDealt || cards.length === 0) return null;
    const daily = getDailyCardFromStorage();
    if (!daily) return null;
    const matchIndex = cards.findIndex(c => c.card.id === daily.cardId);
    if (matchIndex === -1) return null;
    return { index: matchIndex, position: positions[matchIndex] };
  })();

  // Build "Go Deeper" spread suggestions (exclude current spread)
  const otherSpreads: { key: SpreadKey; slug: string; labelKey: string }[] = [
    { key: 'single', slug: 'single', labelKey: 'trySingle' },
    { key: 'threeCard', slug: 'three-card', labelKey: 'tryThreeCard' },
    { key: 'love', slug: 'love', labelKey: 'tryLove' },
    { key: 'celticCross', slug: 'celtic-cross', labelKey: 'tryCelticCross' },
  ].filter(s => s.key !== spreadKey);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'secondary.dark' }}>
              {t('header')}
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontFamily: 'var(--font-display)', fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 300, color: 'text.primary', mb: 0.25 }}>
            {getSpreadName(currentSpread, locale)}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-noto-sans-tc)', color: 'secondary.dark', fontSize: '0.95rem' }}>
            {getSpreadDescription(currentSpread, locale)}
          </Typography>
        </Box>

        {/* Spread navigation chips — only shown during intention phase */}
        <Box sx={{
          mb: 3, display: 'flex', gap: 0.75, flexWrap: 'wrap',
          opacity: cardsDealt ? 0.4 : 1,
          pointerEvents: cardsDealt ? 'none' : 'auto',
          transition: 'opacity 0.3s ease',
        }}>
          {([
            { key: 'single', slug: 'single', labelKey: 'single' },
            { key: 'threeCard', slug: 'three-card', labelKey: 'threeCard' },
            { key: 'love', slug: 'love', labelKey: 'love' },
            { key: 'celticCross', slug: 'celtic-cross', labelKey: 'celticCross' },
          ] as const).map((item) => {
            const isActive = item.key === spreadKey;
            return (
              <Box
                key={item.key}
                component="button"
                onClick={() => { if (!isActive) handleSpreadSwitch(item.slug); }}
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  px: 1.25,
                  py: 0.5,
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : 'divider',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: 'transparent',
                  cursor: isActive ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': !isActive ? { borderColor: 'primary.main', color: 'primary.main' } : {},
                }}
              >
                {t(item.labelKey)}
              </Box>
            );
          })}
        </Box>

        {/* Content area — fades during spread switch transition */}
        <Box sx={{ opacity: isPending ? 0.3 : 1, transition: 'opacity 0.2s ease', minHeight: 200 }}>

        {/* PRE-READING: Intention Setting Ritual */}
        <AnimatePresence mode="wait">
          {showIntentionPhase && (
            <motion.div
              key="intention-phase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
                <Box sx={{ mb: 3, p: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'primary.main', letterSpacing: '0.12em', mb: 2 }}>
                    {t('intentPhaseTitle')} ————————
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3 }}>
                    {t('intentPhaseDesc')}
                  </Typography>

                  {/* Intention Tags */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2, justifyContent: 'center' }}>
                    {(['general', 'career', 'loveCat', 'self', 'finance', 'health'] as const).map((tag) => {
                      const intentionTag = tag === 'loveCat' ? 'love' : tag;
                      return (
                        <Box key={tag} component="button" onClick={() => setSelectedTag(intentionTag as IntentionTag)}
                          sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', px: 1.25, py: 0.5, border: '1px solid', borderColor: selectedTag === intentionTag ? 'primary.main' : 'divider', color: selectedTag === intentionTag ? 'primary.main' : 'secondary.dark', bgcolor: 'transparent', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
                          {t(tag)}
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Intention Note */}
                  <Box component="input"
                    placeholder={t('intentNotePlaceholder')}
                    value={intentionNote}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntentionNote(e.target.value)}
                    sx={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'text.primary', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', p: 1.5, mb: 3, outline: 'none', textAlign: 'center', '&:focus': { borderColor: 'primary.main' }, '&::placeholder': { color: 'secondary.dark' } }}
                  />

                  {/* Draw Cards Button */}
                  <Button
                    onClick={drawCards}
                    sx={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em',
                      px: 4, py: 1.5, borderRadius: 0,
                      bgcolor: 'primary.main', color: 'background.default', boxShadow: 'none',
                      '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
                    }}
                  >
                    {t('drawCards')}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* READING PHASE: Cards + Meanings */}
          {cardsDealt && cards.length > 0 && (
            <motion.div
              key="reading-phase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* User's intention displayed as context */}
              {intentionNote && (
                <Box sx={{ mb: 3, p: 1.5, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 0.5 }}>
                    {t('yourQuestion')}
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 300, color: 'text.primary', fontStyle: 'italic' }}>
                    &ldquo;{intentionNote}&rdquo;
                  </Typography>
                </Box>
              )}

              {/* Tap instruction */}
              {!readingComplete && (
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.08em', mb: 2, textAlign: 'center' }}>
                  {t('tapEachCard')}
                </Typography>
              )}

              {/* Daily card echo */}
              {dailyCardMatch && flippedCards.includes(dailyCardMatch.index) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <Box sx={{ mb: 2, p: 1.5, border: '1px solid', borderColor: 'primary.dark', textAlign: 'center', bgcolor: 'background.paper' }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'primary.main', letterSpacing: '0.08em' }}>
                      {t('dailyCardEcho', { position: dailyCardMatch.position, cardName: getCardName(cards[dailyCardMatch.index].card, locale) })}
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* Cards Display */}
              {spreadKey === 'celticCross' ? (
                <CelticCrossLayout
                  cards={cards}
                  flippedCards={flippedCards}
                  onCardClick={handleCardClick}
                  positions={positions}
                  t={t}
                />
              ) : (
                <Box sx={{ display: 'grid', ...getCardLayout(), gap: 3, justifyContent: 'center', mx: 'auto', mb: 4 }}>
                  {cards.map((cardData, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Typography sx={{ display: 'block', mb: 0.5, color: flippedCards.includes(index) ? 'primary.main' : 'secondary.dark', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                        {positions[index]?.toUpperCase()}
                      </Typography>
                      <TarotCard card={cardData.card} isReversed={cardData.isReversed} isFlipped={flippedCards.includes(index)} onClick={() => handleCardClick(index)} size="small" />
                      {!flippedCards.includes(index) && spreadKey !== 'single' && (
                        <Typography sx={{ mt: 0.5, fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'secondary.dark', letterSpacing: '0.04em', maxWidth: 120, mx: 'auto' }}>
                          {getPositionDescription(positions[index], spreadKey, locale)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Per-card meaning reveal (multi-card) */}
              {spreadKey !== 'single' && !readingComplete && (
                <AnimatePresence>
                  {showMeaning !== null && cards[showMeaning] && flippedCards.includes(showMeaning) && (
                    <motion.div
                      key={`card-reveal-${showMeaning}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CardRevealSnippet
                        card={cards[showMeaning].card}
                        isReversed={cards[showMeaning].isReversed}
                        position={positions[showMeaning]}
                        spreadType={spreadKey}
                        locale={locale}
                        t={t}
                        cardNumber={flippedCards.length}
                        totalCards={currentSpread.count}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Single card full meaning */}
              {spreadKey === 'single' && (
                <AnimatePresence>
                  {showMeaning !== null && cards[showMeaning] && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
                      <CardMeaningPanel card={cards[showMeaning].card} isReversed={cards[showMeaning].isReversed} position={positions[showMeaning]} locale={locale} t={t} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* Multi-card full summary (after all flipped) */}
              {spreadKey !== 'single' && (
                <AnimatePresence>
                  {readingComplete && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                      <ReadingSummaryPanel cards={cards} spreadType={spreadKey} positions={positions} locale={locale} t={t} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {/* POST-READING: Actions */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={startNewReading}>
                  {t('newReading')}
                </Button>
                {readingComplete && saved && (
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'primary.main', letterSpacing: '0.08em', alignSelf: 'center' }}>
                    {t('saved')}
                  </Typography>
                )}
                {readingComplete && (
                  <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={handleCopyReading}>
                    {copied ? t('copied') : t('copyReading')}
                  </Button>
                )}
              </Box>

              {/* Key Takeaway + Affirmation + Reflection + Go Deeper */}
              <AnimatePresence>
                {readingComplete && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    {/* Key Takeaway */}
                    <Box sx={{ mt: 4, p: 2.5, border: '1px solid', borderColor: 'primary.dark', bgcolor: 'background.paper', textAlign: 'center' }}>
                      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'primary.main', letterSpacing: '0.12em', mb: 1.5 }}>
                        {t('keyTakeaway')} ————————
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary', fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.8, fontStyle: 'italic' }}>
                        {renderBoldText(getKeyTakeaway(cards, spreadKey, locale))}
                      </Typography>
                    </Box>

                    {/* Affirmation */}
                    {(() => {
                      const affirmation = getReadingAffirmation(cards, locale);
                      if (!affirmation) return null;
                      return (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                          <Box sx={{ mt: 3, p: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', textAlign: 'center' }}>
                            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
                              {t('affirmation')}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary', fontStyle: 'italic', lineHeight: 1.8, fontFamily: 'var(--font-display)', fontWeight: 300 }}>
                              &ldquo;{affirmation}&rdquo;
                            </Typography>
                          </Box>
                        </motion.div>
                      );
                    })()}

                    {/* Reflection Prompts */}
                    {(() => {
                      const reflections = getReadingReflections(cards, locale);
                      if (reflections.length === 0) return null;
                      return (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                          <Box sx={{ mt: 3, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
                            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 2 }}>
                              {t('reflectOn')} ————————
                            </Typography>
                            {reflections.map((q, i) => (
                              <Box key={i} sx={{ mb: 1.5, pl: 1.5, borderLeft: '2px solid', borderLeftColor: 'primary.dark' }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                                  {q}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </motion.div>
                      );
                    })()}

                    {/* Go Deeper */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                      <Box sx={{ mt: 3, p: 2.5, border: '1px solid', borderColor: 'divider' }}>
                        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 2 }}>
                          {t('goDeeper')} ————————
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {otherSpreads.map((s) => (
                            <Link key={s.key} href={`/reading/${s.slug}`} style={{ textDecoration: 'none' }}>
                              <GoDeepLinkBox label={t(s.labelKey)} />
                            </Link>
                          ))}
                          <Link href="/daily" style={{ textDecoration: 'none' }}>
                            <GoDeepLinkBox label={t('tryDaily')} />
                          </Link>
                          <Link href="/journal" style={{ textDecoration: 'none' }}>
                            <GoDeepLinkBox label={t('viewJournal')} />
                          </Link>
                        </Box>
                      </Box>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}
        </AnimatePresence>
        </Box>{/* end content fade wrapper */}
      </motion.div>
    </Container>
  );
}

// --- Sub-components (kept internal to this module) ---

function CardRevealSnippet({
  card, isReversed, position, spreadType, locale, t, cardNumber, totalCards,
}: {
  card: TarotCardData; isReversed: boolean; position: string; spreadType: SpreadKey;
  locale: Locale; t: ReturnType<typeof useTranslations>; cardNumber: number; totalCards: number;
}) {
  const cardName = getCardName(card, locale);
  const meaning = isReversed ? card.reversed : card.upright;
  const lm = getMeaning(meaning, locale);

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'primary.main', letterSpacing: '0.08em' }}>
            {position?.toUpperCase()}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 300, color: 'text.primary' }}>
            {cardName}
            {isReversed && <Box component="span" sx={{ color: 'secondary.dark', fontSize: '0.75em', ml: 0.5 }}>{t('reversedLabel')}</Box>}
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'secondary.dark' }}>
          {cardNumber}/{totalCards}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
        {lm.meaning}
      </Typography>
    </Box>
  );
}

function GoDeepLinkBox({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: 'transparent', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', '& .go-deeper-text': { color: 'primary.main' } } }}>
      <AutoStoriesIcon sx={{ fontSize: 16, color: 'secondary.dark' }} />
      <Typography className="go-deeper-text" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'text.secondary', letterSpacing: '0.04em' }}>
        {label}
      </Typography>
    </Box>
  );
}

interface CelticCrossLayoutProps {
  cards: DrawnCard[];
  flippedCards: number[];
  onCardClick: (index: number) => void;
  positions: string[];
  t: ReturnType<typeof useTranslations>;
}

function CelticCrossLayout({ cards, flippedCards, onCardClick, positions, t }: CelticCrossLayoutProps) {
  const cardSize = 'small';
  const renderCard = (index: number) => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography sx={{ display: 'block', mb: 0.5, color: flippedCards.includes(index) ? 'primary.main' : 'secondary.dark', fontFamily: 'var(--font-mono)', fontSize: { xs: '0.5rem', md: '0.6rem' }, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
        {positions[index]?.toUpperCase()}
      </Typography>
      <TarotCard card={cards[index]?.card} isReversed={cards[index]?.isReversed} isFlipped={flippedCards.includes(index)} onClick={() => onCardClick(index)} size={cardSize} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', mx: 'auto', mb: 4, maxWidth: 900 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gridTemplateRows: 'repeat(3, auto)', gap: { xs: 0.5, md: 1 }, justifyItems: 'center', alignItems: 'center' }}>
        <Box sx={{ gridColumn: '2', gridRow: '1' }}>{renderCard(4)}</Box>
        <Box sx={{ gridColumn: '1', gridRow: '2' }}>{renderCard(2)}</Box>
        <Box sx={{ gridColumn: '2', gridRow: '2', position: 'relative' }}>
          {renderCard(0)}
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(90deg)', opacity: 0.85, pointerEvents: 'none', zIndex: 1 }}>
            <TarotCard card={cards[1]?.card} isReversed={cards[1]?.isReversed} isFlipped={flippedCards.includes(1)} onClick={() => {}} size={cardSize} />
          </Box>
        </Box>
        <Box sx={{ gridColumn: '3', gridRow: '2' }}>{renderCard(3)}</Box>
        <Box sx={{ gridColumn: '2', gridRow: '3' }}>{renderCard(5)}</Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, border: '1px solid', borderColor: 'divider', p: 1, bgcolor: 'background.paper' }}>
        <Typography sx={{ color: 'primary.main', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em' }}>
          {t('crossingCard')}
        </Typography>
        {renderCard(1)}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, md: 1.5 }, alignItems: 'center' }}>
        {[9, 8, 7, 6].map((i) => <Box key={i}>{renderCard(i)}</Box>)}
      </Box>
    </Box>
  );
}

interface CardMeaningPanelProps {
  card: TarotCardData;
  isReversed: boolean;
  position: string;
  locale: Locale;
  t: ReturnType<typeof useTranslations>;
}

function getSingleCardIntro(cardName: string, isReversed: boolean, locale: Locale): string {
  if (locale === 'zhTW') {
    return isReversed
      ? `${cardName}以逆位出現在你的面前，暗示著需要更深入的反思。以下是這張牌此刻要傳達給你的訊息。`
      : `${cardName}出現在你的面前，為你帶來了清晰的指引。以下是這股能量如何在你生活的各個層面展開。`;
  }
  if (locale === 'ja') {
    return isReversed
      ? `${cardName}が逆位置で現れました。より深い内省が求められています。このカードが今あなたに伝えようとしているメッセージをお伝えします。`
      : `${cardName}があなたの前に現れ、明確な導きをもたらしています。このエネルギーがあなたの人生のさまざまな側面でどう展開するかを見ていきましょう。`;
  }
  return isReversed
    ? `${cardName} has appeared reversed, suggesting a need for deeper reflection. Here is what this card is trying to tell you right now.`
    : `${cardName} has come forward to offer you guidance. Here is how this energy unfolds across different areas of your life.`;
}

function getLifeAreaIntro(locale: Locale): string {
  if (locale === 'zhTW') return '讓我們來看看這股能量如何影響你生活的不同面向：';
  if (locale === 'ja') return 'このエネルギーがあなたの生活のさまざまな面にどう影響するか見ていきましょう：';
  return 'Here is how this energy touches different parts of your life:';
}

function CardMeaningPanel({ card, isReversed, position, locale, t }: CardMeaningPanelProps) {
  const meaning = isReversed ? card.reversed : card.upright;
  const lm = getMeaning(meaning, locale);
  const cardName = getCardName(card, locale);
  const keywords = getKeywords(card, locale);
  const intro = getSingleCardIntro(cardName, isReversed, locale);
  const lifeAreaIntro = getLifeAreaIntro(locale);

  return (
    <Box sx={{ mt: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
      <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderBottomColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'primary.main', letterSpacing: '0.08em' }}>
          {position?.toUpperCase()}
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
            <Typography sx={{ fontFamily: 'var(--font-display)', color: 'text.primary', fontWeight: 300, fontSize: { xs: '1.3rem', md: '1.6rem' }, mb: 0.25 }}>
              {cardName}
              {isReversed && <Box component="span" sx={{ color: 'secondary.dark', fontSize: '0.7em', ml: '0.5em' }}>{t('reversedLabel')}</Box>}
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary', mt: 1 }}>
              {intro}
            </Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.08em', mb: 1.5 }}>
              {isReversed ? t('reversed') : t('upright')}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
              {lm.meaning}
            </Typography>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
              {t('keywords')} ————————
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {keywords.map((keyword, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}>
                  <Box sx={{ px: 1, py: 0.25, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'text.secondary', letterSpacing: '0.05em' }}>
                      {keyword}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary', mb: 2 }}>
            {lifeAreaIntro}
          </Typography>
          {[
            { label: t('sectionLove'), text: lm.love },
            { label: t('career'), text: lm.career },
            ...(lm.health ? [{ label: t('sectionHealth'), text: lm.health }] : []),
            ...(lm.advice ? [{ label: t('sectionAdvice'), text: lm.advice }] : []),
          ].map((section, i, arr) => (
            <motion.div key={section.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.15 }}>
              <Box sx={{ mb: i < arr.length - 1 ? 2 : 0, pb: i < arr.length - 1 ? 2 : 0, borderBottom: i < arr.length - 1 ? '1px solid' : 'none', borderBottomColor: 'divider' }}>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.08em', mb: 1 }}>
                  {'>'} {section.label}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
                  {section.text}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
}

function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ fontWeight: 600 }}>{part}</strong> : part
  );
}

interface ReadingSummaryPanelProps {
  cards: DrawnCard[];
  spreadType: SpreadKey;
  positions: string[];
  locale: Locale;
  t: ReturnType<typeof useTranslations>;
}

function ReadingSummaryPanel({ cards, spreadType, positions, locale, t }: ReadingSummaryPanelProps) {
  const summary: SpreadSummary | null = generateReadingSummary(cards, spreadType);
  if (!summary) return null;

  return (
    <Box sx={{ mt: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderBottomColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: { xs: '1.2rem', md: '1.5rem' }, fontWeight: 300, color: 'text.primary' }}>
          {selectLocaleText(locale, summary.title, summary.titleZh, summary.titleJa)}
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
            {t('cards')} ————————
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {cards.map((cardData, index) => (
              <Box key={index} sx={{ px: 1.5, py: 0.75, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', textAlign: 'center', minWidth: 90 }}>
                <Typography sx={{ display: 'block', color: 'primary.main', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.06em', mb: 0.25 }}>
                  {positions[index]?.toUpperCase()}
                </Typography>
                <Typography sx={{ display: 'block', color: 'text.primary', fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 300 }}>
                  {getCardName(cardData.card, locale)}{cardData.isReversed ? ` (${t('reversedLabel')})` : ''}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Divider sx={{ mb: 2.5, borderColor: 'divider' }} />
        <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 2, color: 'text.primary', whiteSpace: 'pre-line' }}>
          {renderBoldText(selectLocaleText(locale, summary.summary, summary.summaryZh, summary.summaryJa))}
        </Typography>
        <Box sx={{ borderTop: '1px solid', borderColor: 'primary.dark', pt: 2, mb: 2 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'primary.light', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1rem' }}>
            {renderBoldText(selectLocaleText(locale, summary.closing, summary.closingZh, summary.closingJa))}
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1.5 }}>
            {t('cardBreakdown')} ————————
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {cards.map((cardData, index) => {
              const interp = getPositionalInterpretation(cardData, positions[index], spreadType);
              return (
                <Box key={index} sx={{ p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'primary.main', letterSpacing: '0.08em', flexShrink: 0 }}>
                      {positions[index]?.toUpperCase()}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 300, color: 'text.secondary' }}>
                      {getCardName(cardData.card, locale)}{cardData.isReversed ? ` (${t('reversedLabel')})` : ''}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.75, color: 'text.primary' }}>
                    {selectLocaleText(locale, interp.text, interp.textZh, interp.textJa)}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
