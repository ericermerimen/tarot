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
import type { TarotCardData, DrawnCard, SpreadKey } from '@/types/tarot';
import { generateReadingSummary, getPositionalInterpretation } from '@/utils/readingSummary';
import type { SpreadSummary } from '@/utils/readingSummary';
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
    const spreadSummary = generateReadingSummary(cards, selectedSpread);
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
  positionsZh: string[];
}

function ReadingSummaryPanel({ cards, spreadType, positions, positionsZh }: ReadingSummaryPanelProps) {
  const summary: SpreadSummary | null = generateReadingSummary(cards, spreadType);
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
          {renderBoldText(summary.summary)}
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
          {renderBoldText(summary.summaryZh)}
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
