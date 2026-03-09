'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import { useTranslations } from 'next-intl';
import TarotCard from '@/components/TarotCard';
import { getRandomCards, spreadTypes, tarotCards } from '@/data/tarotCards';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import type { Locale } from '@/i18n/routing';
import { getCardName, getKeywords, getMeaning, getSpreadName, getSpreadDescription, getPositions, selectLocaleText } from '@/utils/localeCards';
import { generateReadingSummary, getPositionalInterpretation } from '@/utils/readingSummary';
import type { TarotCardData, DrawnCard, SpreadKey } from '@/types/tarot';
import type { SpreadSummary } from '@/utils/readingSummary';
import type { ReadingRecord, IntentionTag } from '@/types/reading';

const READING_STATE_KEY = 'tarotReadingState';

interface ReadingState {
  spread: SpreadKey;
  cards: { cardId: number; isReversed: boolean }[];
  flippedCards: number[];
  readingComplete: boolean;
}

function saveReadingState(state: ReadingState) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(READING_STATE_KEY, JSON.stringify(state));
  }
}

function loadAndClearReadingState(): ReadingState | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(READING_STATE_KEY);
  if (stored) {
    sessionStorage.removeItem(READING_STATE_KEY);
    return JSON.parse(stored);
  }
  return null;
}

function hydrateCards(saved: { cardId: number; isReversed: boolean }[]): DrawnCard[] {
  return saved.map(({ cardId, isReversed }) => {
    const card = tarotCards.find(c => c.id === cardId);
    return card ? { card, isReversed } : null;
  }).filter(Boolean) as DrawnCard[];
}

function ReadingContent() {
  const searchParams = useSearchParams();
  const initialSpread = (searchParams.get('spread') || 'single') as SpreadKey;
  const t = useTranslations('reading');
  const locale = useCurrentLocale();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '.MuiTabs-indicator { height: 2px !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Load saved state once and share across initializers.
  // Only restore if the saved spread matches the URL — when the user navigates
  // from the homepage with a specific spread (e.g. ?spread=love), the URL
  // should win over stale sessionStorage.
  const savedStateRef = useRef<ReadingState | null>(null);
  if (savedStateRef.current === null && typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(READING_STATE_KEY);
    if (stored) {
      const parsed: ReadingState = JSON.parse(stored);
      sessionStorage.removeItem(READING_STATE_KEY);
      if (parsed.spread === initialSpread) {
        savedStateRef.current = parsed;
      }
    }
  }

  const [selectedSpread, setSelectedSpread] = useState<SpreadKey>(() => {
    return savedStateRef.current?.spread || initialSpread;
  });

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

  // Handle initial card draw if no saved state
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    if (savedStateRef.current) {
      // State was already restored via useState initializers; just set readingComplete
      setReadingComplete(savedStateRef.current.readingComplete);
      return;
    }

    const currentSpreadDef = spreadTypes[initialSpread] || spreadTypes.single;
    setCards(getRandomCards(currentSpreadDef.count));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentSpread = spreadTypes[selectedSpread] || spreadTypes.single;
  const [showMeaning, setShowMeaning] = useState<number | null>(null);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showIntentionPrompt, setShowIntentionPrompt] = useState(false);
  const [selectedTag, setSelectedTag] = useState<IntentionTag>('general');
  const [intentionNote, setIntentionNote] = useState('');
  const [saved, setSaved] = useState(false);
  const intentionRef = useRef<HTMLDivElement>(null);

  // Save reading state to sessionStorage whenever it changes (for language switch persistence)
  useEffect(() => {
    if (cards.length > 0) {
      const state: ReadingState = {
        spread: selectedSpread,
        cards: cards.map(c => ({ cardId: c.card.id, isReversed: c.isReversed })),
        flippedCards,
        readingComplete,
      };
      saveReadingState(state);
    }
  }, [cards, flippedCards, readingComplete, selectedSpread]);

  const startNewReading = (spread?: SpreadKey) => {
    const target = spread ? (spreadTypes[spread] || spreadTypes.single) : currentSpread;
    const newCards = getRandomCards(target.count);
    setCards(newCards);
    setFlippedCards([]);
    setShowMeaning(null);
    setReadingComplete(false);
    setSaved(false);
  };

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

  const handleSpreadChange = (_event: React.SyntheticEvent, newValue: SpreadKey) => {
    setSelectedSpread(newValue);
    startNewReading(newValue);
  };

  const getReadingSummary = (): import('@/types/reading').ReadingSummary | undefined => {
    if (selectedSpread === 'single' && cards.length > 0) {
      const cardData = cards[0];
      const meaning = cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
      const lm = getMeaning(meaning, locale);
      return { text: lm.meaning, textZh: meaning.meaningZh, textJa: meaning.meaningJa };
    }
    const spreadSummary = generateReadingSummary(cards, selectedSpread);
    if (spreadSummary) {
      return { text: spreadSummary.summary, textZh: spreadSummary.summaryZh, textJa: spreadSummary.summaryJa };
    }
    return undefined;
  };

  const confirmSave = (withIntention: boolean) => {
    const positions = getPositions(currentSpread, locale);
    const reading: ReadingRecord = {
      date: new Date().toISOString(),
      spread: selectedSpread,
      cards: cards.map((c, i) => ({
        cardId: c.card.id,
        isReversed: c.isReversed,
        position: currentSpread.positions[i],
        positionZh: currentSpread.positionsZh[i],
      })),
      summary: getReadingSummary(),
      ...(withIntention && {
        intention: {
          tag: selectedTag,
          note: intentionNote.trim() || undefined,
        },
      }),
    };

    const history: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
    history.unshift(reading);
    localStorage.setItem('tarotHistory', JSON.stringify(history.slice(0, 50)));
    setShowIntentionPrompt(false);
    setSaved(true);
    setIntentionNote('');
  };

  const getCardLayout = (): Record<string, string | number | object> => {
    switch (selectedSpread) {
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

  if (cards.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.1em' }}>
          {t('loading')}
        </Typography>
      </Container>
    );
  }

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
            {t('title')}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-noto-sans-tc)', color: 'secondary.dark', fontSize: '0.95rem' }}>
            {t('subtitle')}
          </Typography>
        </Box>

        {/* Spread Selection Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedSpread}
            onChange={handleSpreadChange}
            centered
            sx={{
              borderBottom: '1px solid', borderBottomColor: 'divider', minHeight: 40,
              '& .MuiTab-root': { color: 'text.secondary', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', minHeight: 40, '&.Mui-selected': { color: 'primary.main' } },
            }}
          >
            <Tab value="single" label={t('single')} />
            <Tab value="threeCard" label={t('threeCard')} />
            <Tab value="love" label={t('love')} />
            <Tab value="celticCross" label={t('celticCross')} />
          </Tabs>
        </Box>

        {/* Spread Info */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: { xs: '1.1rem', md: '1.3rem' }, fontWeight: 300, color: 'text.primary', mb: 0.25 }}>
            {getSpreadName(currentSpread, locale)}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.06em' }}>
            {getSpreadDescription(currentSpread, locale)}
          </Typography>
          {!readingComplete && (
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.08em', mt: 1 }}>
              {t('tapEachCard')}
            </Typography>
          )}
        </Box>

        {/* Cards Display */}
        {selectedSpread === 'celticCross' ? (
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
              </Box>
            ))}
          </Box>
        )}

        {/* Single card meaning */}
        {selectedSpread === 'single' && (
          <AnimatePresence>
            {showMeaning !== null && cards[showMeaning] && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
                <CardMeaningPanel card={cards[showMeaning].card} isReversed={cards[showMeaning].isReversed} position={positions[showMeaning]} locale={locale} t={t} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Multi-card summary */}
        {selectedSpread !== 'single' && (
          <AnimatePresence>
            {readingComplete && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }}>
                <ReadingSummaryPanel cards={cards} spreadType={selectedSpread} positions={positions} locale={locale} t={t} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { startNewReading(); setSaved(false); setShowIntentionPrompt(false); }}>
            {t('newReading')}
          </Button>
          {readingComplete && !saved && (
            <Button variant="outlined" startIcon={<SaveIcon />} onClick={() => { setShowIntentionPrompt(true); setTimeout(() => { intentionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}>
              {t('saveToJournal')}
            </Button>
          )}
          {saved && (
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'primary.main', letterSpacing: '0.08em', alignSelf: 'center' }}>
              {t('saved')}
            </Typography>
          )}
        </Box>

        {/* Intention prompt */}
        <AnimatePresence>
          {showIntentionPrompt && (
            <motion.div ref={intentionRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.25 }}>
              <Box sx={{ mt: 3, p: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 2 }}>
                  {t('intentPrompt')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                  {(['general', 'career', 'loveCat', 'self', 'finance', 'health'] as const).map((tag) => {
                    const intentionTag = tag === 'loveCat' ? 'love' : tag;
                    return (
                      <Box key={tag} component="button" onClick={() => setSelectedTag(intentionTag as IntentionTag)}
                        sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', px: 1.25, py: 0.5, border: '1px solid', borderColor: selectedTag === intentionTag ? 'primary.main' : 'divider', color: selectedTag === intentionTag ? 'primary.main' : 'secondary.dark', bgcolor: 'transparent', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
                        {t(tag)}
                      </Box>
                    );
                  })}
                </Box>
                <Box component="input" placeholder={t('optionalContext')} value={intentionNote} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntentionNote(e.target.value)}
                  sx={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'text.primary', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', p: 1, mb: 2, outline: 'none', '&:focus': { borderColor: 'primary.main' }, '&::placeholder': { color: 'secondary.dark' } }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button onClick={() => confirmSave(true)} sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', borderRadius: 0, bgcolor: 'primary.main', color: 'background.default', boxShadow: 'none', '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' } }}>
                    {t('confirmSave')}
                  </Button>
                  <Button onClick={() => confirmSave(false)} sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', borderRadius: 0, border: '1px solid', borderColor: 'divider', color: 'secondary.dark', '&:hover': { borderColor: 'text.secondary', color: 'text.secondary' } }}>
                    {t('skip')}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
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
        <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Typography sx={{ fontFamily: 'var(--font-display)', color: 'text.primary', fontWeight: 300, fontSize: { xs: '1.3rem', md: '1.6rem' }, mb: 0.25 }}>
            {cardName}
            {isReversed && <Box component="span" sx={{ color: 'secondary.dark', fontSize: '0.7em', ml: '0.5em' }}>{t('reversedLabel')}</Box>}
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary', mt: 1 }}>
            {intro}
          </Typography>
        </Box>
        <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.08em', mb: 1.5 }}>
            {isReversed ? t('reversed') : t('upright')}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
            {lm.meaning}
          </Typography>
        </Box>
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
            {t('keywords')} ————————
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {keywords.map((keyword, i) => (
              <Box key={i} sx={{ px: 1, py: 0.25, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'text.secondary', letterSpacing: '0.05em' }}>
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary', mb: 2 }}>
          {lifeAreaIntro}
        </Typography>
        {[
          { label: t('love'), text: lm.love },
          { label: t('career'), text: lm.career },
          ...(lm.health ? [{ label: t('health'), text: lm.health }] : []),
          ...(lm.advice ? [{ label: t('advice'), text: lm.advice }] : []),
        ].map((section, i, arr) => (
          <Box key={section.label} sx={{ mb: i < arr.length - 1 ? 2 : 0, pb: i < arr.length - 1 ? 2 : 0, borderBottom: i < arr.length - 1 ? '1px solid' : 'none', borderBottomColor: 'divider' }}>
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.08em', mb: 1 }}>
              {'>'} {section.label}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
              {section.text}
            </Typography>
          </Box>
        ))}
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

export default function ReadingPage() {
  const t = useTranslations('reading');
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'secondary.dark', letterSpacing: '0.1em' }}>
          {t('loading')}
        </Typography>
      </Container>
    }>
      <ReadingContent />
    </Suspense>
  );
}
