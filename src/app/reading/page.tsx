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
import TarotCard from '@/components/TarotCard';
import { getRandomCards, spreadTypes, tarotCards } from '@/data/tarotCards';
import type { TarotCardData, DrawnCard, CardMeaning, SpreadKey } from '@/types/tarot';
import type { ReadingRecord, IntentionTag } from '@/types/reading';

function ReadingContent() {
  const searchParams = useSearchParams();
  const initialSpread = (searchParams.get('spread') || 'single') as SpreadKey;

  // Force-fix MUI Tabs indicator height — SWC Emotion compiler caches height:100%
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = '.MuiTabs-indicator { height: 2px !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const [selectedSpread, setSelectedSpread] = useState<SpreadKey>(initialSpread);
  const currentSpread = spreadTypes[selectedSpread] || spreadTypes.single;
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [showMeaning, setShowMeaning] = useState<number | null>(null);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showIntentionPrompt, setShowIntentionPrompt] = useState(false);
  const [selectedTag, setSelectedTag] = useState<IntentionTag>('general');
  const [intentionNote, setIntentionNote] = useState('');
  const [saved, setSaved] = useState(false);
  const intentionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCards(getRandomCards(currentSpread.count));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const startNewReading = (spread?: SpreadKey) => {
    const target = spread ? (spreadTypes[spread] || spreadTypes.single) : currentSpread;
    const newCards = getRandomCards(target.count);
    setCards(newCards);
    setFlippedCards([]);
    setShowMeaning(null);
    setReadingComplete(false);
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
      return { text: meaning.meaning, textZh: meaning.meaningZh };
    }
    const spreadSummary = generateReadingSummary(
      cards, selectedSpread, currentSpread.positions, currentSpread.positionsZh
    );
    if (spreadSummary) {
      return { text: spreadSummary.summary, textZh: spreadSummary.summaryZh };
    }
    return undefined;
  };

  const confirmSave = (withIntention: boolean) => {
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

  const getCardLayout = (): Record<string, string | number> => {
    switch (selectedSpread) {
      case 'threeCard':
        return {
          gridTemplateColumns: 'repeat(3, 1fr)',
          maxWidth: 600,
        };
      case 'love':
        return {
          gridTemplateColumns: 'repeat(5, 1fr)',
          maxWidth: 800,
        };
      case 'celticCross':
        return {
          display: 'block',
        };
      default:
        return {
          gridTemplateColumns: '1fr',
          maxWidth: 250,
        };
    }
  };

  if (cards.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.1em' }}>
          LOADING...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: 'secondary.dark',
              }}
            >
              TAROT_READING
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              fontWeight: 300,
              color: 'text.primary',
              mb: 0.25,
            }}
          >
            Tarot Reading
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              color: 'secondary.dark',
              fontSize: '0.95rem',
            }}
          >
            塔羅占卜
          </Typography>
        </Box>

        {/* Spread Selection Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedSpread}
            onChange={handleSpreadChange}
            centered
            sx={{
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
              minHeight: 40,
              '& .MuiTab-root': {
                color: 'text.secondary',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                minHeight: 40,
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <Tab value="single" label="SINGLE" />
            <Tab value="threeCard" label="THREE_CARD" />
            <Tab value="love" label="LOVE" />
            <Tab value="celticCross" label="CELTIC_CROSS" />
          </Tabs>
        </Box>

        {/* Spread Info */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              fontWeight: 300,
              color: 'text.primary',
              mb: 0.25,
            }}
          >
            {currentSpread.name}
          </Typography>
          <Typography
            sx={{ fontFamily: 'var(--font-noto-sans-tc)', color: 'secondary.dark', fontSize: '0.875rem', mb: 0.5 }}
          >
            {currentSpread.nameZh}
          </Typography>
          <Typography
            sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.06em' }}
          >
            {currentSpread.description} · {currentSpread.descriptionZh}
          </Typography>
          {!readingComplete && (
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'secondary.dark',
                letterSpacing: '0.08em',
                mt: 1,
              }}
            >
              TAP_EACH_CARD_TO_REVEAL · 點擊每張牌揭示
            </Typography>
          )}
        </Box>

        {/* Cards Display */}
        {selectedSpread === 'celticCross' ? (
          <CelticCrossLayout
            cards={cards}
            flippedCards={flippedCards}
            onCardClick={handleCardClick}
            positions={currentSpread.positions}
            positionsZh={currentSpread.positionsZh}
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              ...getCardLayout(),
              gap: 3,
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
            }}
          >
            {cards.map((cardData, index) => (
              <Box key={index} sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    display: 'block',
                    mb: 0.5,
                    color: flippedCards.includes(index) ? 'primary.main' : 'secondary.dark',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  {currentSpread.positions[index].toUpperCase()}
                </Typography>
                <Typography
                  sx={{
                    display: 'block',
                    mb: 1.5,
                    color: 'secondary.dark',
                    fontFamily: 'var(--font-noto-sans-tc)',
                    fontSize: '0.7rem',
                  }}
                >
                  {currentSpread.positionsZh[index]}
                </Typography>
                <TarotCard
                  card={cardData.card}
                  isReversed={cardData.isReversed}
                  isFlipped={flippedCards.includes(index)}
                  onClick={() => handleCardClick(index)}
                  size="small"
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Single card meaning */}
        {selectedSpread === 'single' && (
          <AnimatePresence>
            {showMeaning !== null && cards[showMeaning] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <CardMeaningPanel
                  card={cards[showMeaning].card}
                  isReversed={cards[showMeaning].isReversed}
                  position={currentSpread.positions[showMeaning]}
                  positionZh={currentSpread.positionsZh[showMeaning]}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Multi-card summary */}
        {selectedSpread !== 'single' && (
          <AnimatePresence>
            {readingComplete && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <ReadingSummaryPanel
                  cards={cards}
                  spreadType={selectedSpread}
                  positions={currentSpread.positions}
                  positionsZh={currentSpread.positionsZh}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => { startNewReading(); setSaved(false); setShowIntentionPrompt(false); }}
          >
            NEW_READING 重新占卜
          </Button>
          {readingComplete && !saved && (
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => {
                setShowIntentionPrompt(true);
                setTimeout(() => {
                  intentionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
            >
              SAVE_TO_JOURNAL 保存到日記
            </Button>
          )}
          {saved && (
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'primary.main', letterSpacing: '0.08em', alignSelf: 'center' }}>
              SAVED ✓ · 已保存
            </Typography>
          )}
        </Box>

        {/* Intention prompt */}
        <AnimatePresence>
          {showIntentionPrompt && (
            <motion.div
              ref={intentionRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              <Box sx={{ mt: 3, p: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 2 }}>
                  INTENT {'>'} WHAT ARE YOU ASKING ABOUT? · 你在問什麼？
                </Typography>

                {/* Tag chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                  {(['general', 'career', 'love', 'self', 'finance', 'health'] as const).map((tag) => (
                    <Box
                      key={tag}
                      component="button"
                      onClick={() => setSelectedTag(tag)}
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.08em',
                        px: 1.25,
                        py: 0.5,
                        border: '1px solid',
                        borderColor: selectedTag === tag ? 'primary.main' : 'divider',
                        color: selectedTag === tag ? 'primary.main' : 'secondary.dark',
                        bgcolor: 'transparent',
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                      }}
                    >
                      {tag.toUpperCase()}
                    </Box>
                  ))}
                </Box>

                {/* Optional note */}
                <Box
                  component="input"
                  placeholder="Optional context... (optional 可選)"
                  value={intentionNote}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntentionNote(e.target.value)}
                  sx={{
                    width: '100%',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'text.primary',
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 1,
                    mb: 2,
                    outline: 'none',
                    '&:focus': { borderColor: 'primary.main' },
                    '&::placeholder': { color: 'secondary.dark' },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    onClick={() => confirmSave(true)}
                    sx={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em',
                      borderRadius: 0, bgcolor: 'primary.main', color: 'background.default', boxShadow: 'none',
                      '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
                    }}
                  >
                    CONFIRM_SAVE →
                  </Button>
                  <Button
                    onClick={() => confirmSave(false)}
                    sx={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em',
                      borderRadius: 0, border: '1px solid', borderColor: 'divider', color: 'secondary.dark',
                      '&:hover': { borderColor: 'text.secondary', color: 'text.secondary' },
                    }}
                  >
                    SKIP
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
  positionsZh: string[];
}

function CelticCrossLayout({ cards, flippedCards, onCardClick, positions, positionsZh }: CelticCrossLayoutProps) {
  const cardSize = 'small';

  const renderCard = (index: number) => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        sx={{
          display: 'block',
          mb: 0.5,
          color: flippedCards.includes(index) ? 'primary.main' : 'secondary.dark',
          fontFamily: 'var(--font-mono)',
          fontSize: { xs: '0.5rem', md: '0.6rem' },
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
        }}
      >
        {positions[index].toUpperCase()}
      </Typography>
      <Typography
        sx={{
          display: 'block',
          mb: 0.5,
          color: 'secondary.dark',
          fontFamily: 'var(--font-noto-sans-tc)',
          fontSize: '0.55rem',
        }}
      >
        {positionsZh[index]}
      </Typography>
      <TarotCard
        card={cards[index]?.card}
        isReversed={cards[index]?.isReversed}
        isFlipped={flippedCards.includes(index)}
        onClick={() => onCardClick(index)}
        size={cardSize}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 2, md: 4 },
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        mx: 'auto',
        mb: 4,
        maxWidth: 900,
      }}
    >
      {/* Cross section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          gridTemplateRows: 'repeat(3, auto)',
          gap: { xs: 0.5, md: 1 },
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ gridColumn: '2', gridRow: '1' }}>
          {renderCard(4)}
        </Box>
        <Box sx={{ gridColumn: '1', gridRow: '2' }}>
          {renderCard(2)}
        </Box>
        <Box sx={{ gridColumn: '2', gridRow: '2', position: 'relative' }}>
          {renderCard(0)}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              opacity: 0.85,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <TarotCard
              card={cards[1]?.card}
              isReversed={cards[1]?.isReversed}
              isFlipped={flippedCards.includes(1)}
              onClick={() => {}}
              size={cardSize}
            />
          </Box>
        </Box>
        <Box sx={{ gridColumn: '3', gridRow: '2' }}>
          {renderCard(3)}
        </Box>
        <Box sx={{ gridColumn: '2', gridRow: '3' }}>
          {renderCard(5)}
        </Box>
      </Box>

      {/* Crossing card — standalone clickable */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          border: '1px solid', borderColor: 'divider',
          p: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          sx={{
            color: 'primary.main',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.08em',
          }}
        >
          CROSSING_CARD
        </Typography>
        {renderCard(1)}
      </Box>

      {/* Staff column */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1, md: 1.5 },
          alignItems: 'center',
        }}
      >
        {[9, 8, 7, 6].map((i) => (
          <Box key={i}>{renderCard(i)}</Box>
        ))}
      </Box>
    </Box>
  );
}

interface CardMeaningPanelProps {
  card: TarotCardData;
  isReversed: boolean;
  position: string;
  positionZh: string;
}

function CardMeaningPanel({ card, isReversed, position, positionZh }: CardMeaningPanelProps) {
  const meaning = isReversed ? card.reversed : card.upright;

  return (
    <Box sx={{ mt: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
      {/* Position header */}
      <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderBottomColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'primary.main',
            letterSpacing: '0.08em',
          }}
        >
          {position.toUpperCase()} · {positionZh}
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Card identity */}
        <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              color: 'text.primary',
              fontWeight: 300,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              mb: 0.25,
            }}
          >
            {card.name}
            {isReversed && (
              <Box component="span" sx={{ color: 'secondary.dark', fontSize: '0.7em', ml: '0.5em' }}>(Reversed)</Box>
            )}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              color: 'secondary.dark',
              fontSize: '0.95rem',
            }}
          >
            {card.nameZh} {isReversed && '(逆位)'}
          </Typography>
        </Box>

        {/* Meaning */}
        <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'secondary.dark',
              letterSpacing: '0.08em',
              mb: 1.5,
            }}
          >
            {isReversed ? '> REVERSED' : '> UPRIGHT'}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary', mb: 1.5 }}>
            {meaning.meaning}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              color: 'text.secondary',
              lineHeight: 1.8,
              fontSize: '0.9rem',
            }}
          >
            {meaning.meaningZh}
          </Typography>
        </Box>

        {/* Keywords */}
        <Box sx={{ mb: 2.5 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'secondary.dark',
              letterSpacing: '0.1em',
              mb: 1,
            }}
          >
            KEYWORDS ————————
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {card.keywords.map((keyword, i) => (
              <Box
                key={i}
                sx={{
                  px: 1,
                  py: 0.25,
                  border: '1px solid', borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'text.secondary',
                    letterSpacing: '0.05em',
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Contextual sections */}
        {[
          { label: 'LOVE · 感情', labelZh: null, text: meaning.love, textZh: meaning.loveZh },
          { label: 'CAREER · 事業', labelZh: null, text: meaning.career, textZh: meaning.careerZh },
          ...(meaning.health ? [{ label: 'HEALTH · 健康', labelZh: null, text: meaning.health, textZh: meaning.healthZh }] : []),
          ...(meaning.advice ? [{ label: 'ADVICE · 建議', labelZh: null, text: meaning.advice, textZh: meaning.adviceZh }] : []),
        ].map((section, i, arr) => (
          <Box key={section.label} sx={{ mb: i < arr.length - 1 ? 2 : 0, pb: i < arr.length - 1 ? 2 : 0, borderBottom: i < arr.length - 1 ? '1px solid' : 'none', borderBottomColor: 'divider' }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'secondary.dark',
                letterSpacing: '0.08em',
                mb: 1,
              }}
            >
              {'>'} {section.label}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary', mb: 0.75 }}>
              {section.text}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-noto-sans-tc)',
                color: 'text.secondary',
                lineHeight: 1.8,
                fontSize: '0.9rem',
              }}
            >
              {section.textZh}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

interface SpreadSummary {
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
}

function getPositionalInterpretation(
  cardData: DrawnCard,
  position: string,
  spreadType: string
): { text: string; textZh: string } {
  const meaning = cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
  const name = cardData.card.name;
  const nameZh = cardData.card.nameZh;
  const posLower = position.toLowerCase();

  if (spreadType === 'love') {
    const loveText = meaning.love;
    const loveTextZh = meaning.loveZh;
    const frames: Record<string, { en: string; zh: string }> = {
      you: {
        en: `${name} in the You position reflects the energy you're bringing to your relationship right now: ${loveText}`,
        zh: `「你」位置的${nameZh}反映了你目前帶入關係的能量：${loveTextZh}`,
      },
      partner: {
        en: `${name} in the Partner position shows the energy your partner (or potential love) carries: ${loveText}`,
        zh: `「對方」位置的${nameZh}展示了你伴侶（或心儀對象）帶來的能量：${loveTextZh}`,
      },
      connection: {
        en: `${name} in the Connection position reveals the nature of the bond between you: ${loveText}`,
        zh: `「連結」位置的${nameZh}揭示了你們之間聯繫的本質：${loveTextZh}`,
      },
      challenge: {
        en: `${name} in the Challenge position highlights what needs to be worked through together: ${loveText}`,
        zh: `「挑戰」位置的${nameZh}指出了你們需要共同克服的事：${loveTextZh}`,
      },
      outcome: {
        en: `${name} in the Outcome position reveals where your love story is heading: ${loveText}`,
        zh: `「結果」位置的${nameZh}揭示了你的愛情故事走向：${loveTextZh}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh };
    return { text: loveText, textZh: loveTextZh };
  }

  if (spreadType === 'threeCard') {
    const frames: Record<string, { en: string; zh: string }> = {
      past: {
        en: `${name} in the Past position reveals the energy or experience that shaped where you are now: ${meaning.meaning}`,
        zh: `「過去」位置的${nameZh}揭示了塑造你現在處境的能量或經歷：${meaning.meaningZh}`,
      },
      present: {
        en: `${name} in the Present position reflects what you're actively navigating right now: ${meaning.meaning}`,
        zh: `「現在」位置的${nameZh}反映了你當前正在經歷的能量：${meaning.meaningZh}`,
      },
      future: {
        en: `${name} in the Future position indicates the energy moving toward you: ${meaning.meaning}`,
        zh: `「未來」位置的${nameZh}指示了正向你走來的能量：${meaning.meaningZh}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh };
    return { text: meaning.meaning, textZh: meaning.meaningZh };
  }

  if (spreadType === 'celticCross') {
    const contextText = posLower === 'advice' && meaning.advice ? meaning.advice : meaning.meaning;
    const contextTextZh = posLower === 'advice' && meaning.adviceZh ? meaning.adviceZh : meaning.meaningZh;
    const frames: Record<string, { en: string; zh: string }> = {
      present: {
        en: `${name} at the center defines the heart of your current situation: ${contextText}`,
        zh: `中心位置的${nameZh}定義了你當前處境的核心：${contextTextZh}`,
      },
      challenge: {
        en: `${name} as the Crossing card shows the immediate challenge or opposing force you must face: ${contextText}`,
        zh: `交叉牌位置的${nameZh}展示了你必須面對的直接挑戰或對立力量：${contextTextZh}`,
      },
      past: {
        en: `${name} in the Past position shows the recent events or energies that led directly to this moment: ${contextText}`,
        zh: `「過去」位置的${nameZh}展示了直接導致這一刻的近期事件或能量：${contextTextZh}`,
      },
      future: {
        en: `${name} in the Future position points to what's coming in the near term: ${contextText}`,
        zh: `「未來」位置的${nameZh}指向近期將要發生的事：${contextTextZh}`,
      },
      above: {
        en: `${name} in the Above position reflects your conscious goals and highest aspirations around this question: ${contextText}`,
        zh: `「目標」位置的${nameZh}反映了你圍繞這個問題的意識目標和最高願望：${contextTextZh}`,
      },
      below: {
        en: `${name} in the Below position uncovers the subconscious patterns or hidden roots influencing your situation: ${contextText}`,
        zh: `「潛意識」位置的${nameZh}揭示了影響你處境的潛意識模式或隱藏根源：${contextTextZh}`,
      },
      advice: {
        en: `${name} in the Advice position offers guidance on how to move forward: ${contextText}`,
        zh: `「建議」位置的${nameZh}提供了如何前進的指引：${contextTextZh}`,
      },
      external: {
        en: `${name} in the External position shows the outside forces, people, or circumstances shaping your situation: ${contextText}`,
        zh: `「外在影響」位置的${nameZh}展示了塑造你處境的外部力量、人物或環境：${contextTextZh}`,
      },
      'hopes/fears': {
        en: `${name} in the Hopes/Fears position reveals what you're simultaneously hoping for and dreading — these often mirror each other: ${contextText}`,
        zh: `「希望/恐懼」位置的${nameZh}揭示了你同時渴望和畏懼的事——這兩者往往互為鏡像：${contextTextZh}`,
      },
      outcome: {
        en: `${name} in the Outcome position reveals the most likely result if the current energies continue on their path: ${contextText}`,
        zh: `「結果」位置的${nameZh}揭示了如果當前能量持續下去的最可能結果：${contextTextZh}`,
      },
    };
    const frame = frames[posLower];
    if (frame) return { text: frame.en, textZh: frame.zh };
    return { text: contextText, textZh: contextTextZh };
  }

  return { text: meaning.meaning, textZh: meaning.meaningZh };
}

function generateReadingSummary(cards: DrawnCard[], spreadType: string, positions: string[], positionsZh: string[]): SpreadSummary | null {
  const getMeaning = (cardData: DrawnCard): CardMeaning => {
    return cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
  };

  const getCardLabel = (cardData: DrawnCard): string => {
    const rev = cardData.isReversed ? ' (Reversed)' : '';
    return `${cardData.card.name}${rev}`;
  };

  const getCardLabelZh = (cardData: DrawnCard): string => {
    const rev = cardData.isReversed ? ' (逆位)' : '';
    return `${cardData.card.nameZh}${rev}`;
  };

  if (spreadType === 'threeCard') {
    const [past, present, future] = cards;
    const pastM = getMeaning(past);
    const presentM = getMeaning(present);
    const futureM = getMeaning(future);

    return {
      title: 'Your Timeline Reading',
      titleZh: '你的時間線解讀',
      summary: `Your past, shaped by ${getCardLabel(past)}, speaks of ${pastM.meaning.toLowerCase()} This energy has led you to your present moment, where ${getCardLabel(present)} reveals that ${presentM.meaning.toLowerCase()} Looking ahead, ${getCardLabel(future)} illuminates your path forward: ${futureM.meaning.toLowerCase()} The journey from ${past.card.keywords[0]} through ${present.card.keywords[0]} toward ${future.card.keywords[0]} suggests a meaningful progression unfolding in your life.`,
      summaryZh: `你的過去由${getCardLabelZh(past)}塑造，暗示著${pastM.meaningZh}這股能量引領你來到當下，${getCardLabelZh(present)}揭示了${presentM.meaningZh}展望未來，${getCardLabelZh(future)}照亮了你前進的道路：${futureM.meaningZh}從「${past.card.keywordsZh?.[0] || past.card.keywords[0]}」經過「${present.card.keywordsZh?.[0] || present.card.keywords[0]}」走向「${future.card.keywordsZh?.[0] || future.card.keywords[0]}」，暗示著你生命中正在展開一段有意義的進程。`,
    };
  }

  if (spreadType === 'love') {
    const [you, partner, connection, challenge, outcome] = cards;
    const youM = getMeaning(you);
    const partnerM = getMeaning(partner);
    const connectionM = getMeaning(connection);
    const challengeM = getMeaning(challenge);
    const outcomeM = getMeaning(outcome);

    return {
      title: 'Your Love Reading',
      titleZh: '你的愛情解讀',
      summary: `In matters of the heart, ${getCardLabel(you)} in the You position reveals how you're showing up in love right now: ${youM.love} Your partner or love interest, represented by ${getCardLabel(partner)}, brings this energy: ${partnerM.love} The connection between you, shaped by ${getCardLabel(connection)}, speaks to the bond you share: ${connectionM.love} The challenge you face together, ${getCardLabel(challenge)}, points to: ${challengeM.love} Ultimately, ${getCardLabel(outcome)} as the outcome reveals where this love story is headed: ${outcomeM.love} Trust the wisdom of these cards as you navigate your heart's journey.`,
      summaryZh: `在感情方面，「你」位置的${getCardLabelZh(you)}揭示了你目前在愛情中的狀態：${youM.loveZh}代表對方的${getCardLabelZh(partner)}帶來這樣的能量：${partnerM.loveZh}由${getCardLabelZh(connection)}塑造的連結訴說了你們共同的紐帶：${connectionM.loveZh}你們共同面對的挑戰——${getCardLabelZh(challenge)}，指向：${challengeM.loveZh}最終，${getCardLabelZh(outcome)}作為結果揭示了這段愛情故事的走向：${outcomeM.loveZh}在你的感情旅程中，請相信這些牌的智慧。`,
    };
  }

  if (spreadType === 'celticCross') {
    const [present, challenge, past, future, above, below, advice, external, hopes, outcome] = cards;
    const presentM = getMeaning(present);
    const challengeM = getMeaning(challenge);
    const pastM = getMeaning(past);
    const futureM = getMeaning(future);
    const aboveM = getMeaning(above);
    const belowM = getMeaning(below);
    const adviceM = getMeaning(advice);
    const externalM = getMeaning(external);
    const hopesM = getMeaning(hopes);
    const outcomeM = getMeaning(outcome);

    return {
      title: 'Your Celtic Cross Reading',
      titleZh: '你的凱爾特十字解讀',
      summary: `At the heart of your reading, ${getCardLabel(present)} defines your current situation — ${presentM.meaning.toLowerCase()} Crossing this is ${getCardLabel(challenge)}, representing the challenge you must face: ${challengeM.meaning.toLowerCase()} Your foundation in the past, ${getCardLabel(past)}, tells of ${pastM.meaning.toLowerCase()} The near future brings ${getCardLabel(future)}: ${futureM.meaning.toLowerCase()}

Your highest aspirations are reflected by ${getCardLabel(above)} — ${aboveM.meaning.toLowerCase()} While deep in your subconscious, ${getCardLabel(below)} reveals ${belowM.meaning.toLowerCase()} For guidance, ${getCardLabel(advice)} advises that ${adviceM.meaning.toLowerCase()} External influences from ${getCardLabel(external)} suggest ${externalM.meaning.toLowerCase()}

Your hopes and fears are embodied by ${getCardLabel(hopes)}: ${hopesM.meaning.toLowerCase()} The final outcome, ${getCardLabel(outcome)}, reveals ${outcomeM.meaning.toLowerCase()} Take these insights as a compass for your journey ahead.`,
      summaryZh: `在你的解讀核心，${getCardLabelZh(present)}定義了你的當前處境——${presentM.meaningZh}與之交叉的是${getCardLabelZh(challenge)}，代表你必須面對的挑戰：${challengeM.meaningZh}你過去的根基——${getCardLabelZh(past)}，訴說著${pastM.meaningZh}近期的未來帶來${getCardLabelZh(future)}：${futureM.meaningZh}

你最高的願望由${getCardLabelZh(above)}反映——${aboveM.meaningZh}在你的潛意識深處，${getCardLabelZh(below)}揭示了${belowM.meaningZh}在指導方面，${getCardLabelZh(advice)}建議${adviceM.meaningZh}來自${getCardLabelZh(external)}的外部影響暗示${externalM.meaningZh}

你的希望與恐懼由${getCardLabelZh(hopes)}體現：${hopesM.meaningZh}最終結果——${getCardLabelZh(outcome)}揭示了${outcomeM.meaningZh}將這些洞見作為你前路的指南針。`,
    };
  }

  return null;
}

interface ReadingSummaryPanelProps {
  cards: DrawnCard[];
  spreadType: string;
  positions: string[];
  positionsZh: string[];
}

function ReadingSummaryPanel({ cards, spreadType, positions, positionsZh }: ReadingSummaryPanelProps) {
  const summary: SpreadSummary | null = generateReadingSummary(cards, spreadType, positions, positionsZh);
  if (!summary) return null;

  return (
    <Box sx={{ mt: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
      {/* Summary header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderBottomColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            fontWeight: 300,
            color: 'text.primary',
            mb: 0.25,
          }}
        >
          {summary.title}
        </Typography>
        <Typography
          sx={{ fontFamily: 'var(--font-noto-sans-tc)', color: 'secondary.dark', fontSize: '0.875rem' }}
        >
          {summary.titleZh}
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Card list overview */}
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'secondary.dark',
              letterSpacing: '0.1em',
              mb: 1,
            }}
          >
            CARDS ————————
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {cards.map((cardData, index) => (
              <Box
                key={index}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  border: '1px solid', borderColor: 'divider',
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                  minWidth: 90,
                }}
              >
                <Typography
                  sx={{
                    display: 'block',
                    color: 'primary.main',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    letterSpacing: '0.06em',
                    mb: 0.25,
                  }}
                >
                  {positions[index].toUpperCase()} · {positionsZh[index]}
                </Typography>
                <Typography
                  sx={{
                    display: 'block',
                    color: 'text.primary',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8rem',
                    fontWeight: 300,
                  }}
                >
                  {cardData.card.name}
                  {cardData.isReversed && ' (Rev)'}
                </Typography>
                <Typography
                  sx={{
                    display: 'block',
                    color: 'secondary.dark',
                    fontFamily: 'var(--font-noto-sans-tc)',
                    fontSize: '0.65rem',
                  }}
                >
                  {cardData.card.nameZh}
                  {cardData.isReversed && ' (逆位)'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5, borderColor: 'divider' }} />

        {/* Holistic interpretation */}
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, mb: 2, color: 'text.primary', whiteSpace: 'pre-line' }}
        >
          {summary.summary}
        </Typography>

        <Divider sx={{ my: 2, borderColor: 'divider' }} />

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'var(--font-noto-sans-tc)',
            color: 'text.secondary',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}
        >
          {summary.summaryZh}
        </Typography>

        {/* Per-card position breakdown */}
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'secondary.dark',
              letterSpacing: '0.1em',
              mb: 1.5,
            }}
          >
            CARD_BREAKDOWN ————————
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {cards.map((cardData, index) => {
              const interp = getPositionalInterpretation(cardData, positions[index], spreadType);
              return (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.55rem',
                        color: 'primary.main',
                        letterSpacing: '0.08em',
                        flexShrink: 0,
                      }}
                    >
                      {positions[index].toUpperCase()} · {positionsZh[index]}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.9rem',
                        fontWeight: 300,
                        color: 'text.secondary',
                      }}
                    >
                      {cardData.card.name}{cardData.isReversed ? ' (Rev)' : ''}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-noto-sans-tc)',
                        fontSize: '0.75rem',
                        color: 'secondary.dark',
                      }}
                    >
                      {cardData.card.nameZh}{cardData.isReversed ? ' (逆位)' : ''}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.75, color: 'text.primary', mb: 0.75 }}>
                    {interp.text}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-noto-sans-tc)',
                      color: 'text.secondary',
                      lineHeight: 1.75,
                      fontSize: '0.85rem',
                    }}
                  >
                    {interp.textZh}
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
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'secondary.dark', letterSpacing: '0.1em' }}>
          LOADING...
        </Typography>
      </Container>
    }>
      <ReadingContent />
    </Suspense>
  );
}
