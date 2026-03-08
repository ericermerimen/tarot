'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import TarotCard from '@/components/TarotCard';
import { getRandomCard, tarotCards } from '@/data/tarotCards';
import type { DrawnCard } from '@/types/tarot';
import type { DailyCardStorage } from '@/types/reading';
import { useColorMode } from '@/theme/ColorModeContext';

function loadOrGenerateDaily(): DrawnCard {
  const today = new Date().toDateString();
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('dailyCard');
    if (stored) {
      const { date, cardId, isReversed }: DailyCardStorage = JSON.parse(stored);
      if (date === today) {
        const card = tarotCards.find(c => c.id === cardId);
        if (card) return { card, isReversed };
      }
    }
  }
  const drawn = getRandomCard();
  const storage: DailyCardStorage = {
    date: today,
    cardId: drawn.card.id,
    isReversed: drawn.isReversed,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem('dailyCard', JSON.stringify(storage));
  }
  return drawn;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DailyCard() {
  const [dailyReading, setDailyReading] = useState<DrawnCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    setDailyReading(loadOrGenerateDaily());
  }, []);

  const generateDailyCard = () => {
    const today = new Date().toDateString();
    const drawn = getRandomCard();
    localStorage.setItem('dailyCard', JSON.stringify({ date: today, cardId: drawn.card.id, isReversed: drawn.isReversed } as DailyCardStorage));
    setDailyReading(drawn);
    setIsFlipped(false);
    setShowMeaning(false);
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setTimeout(() => setShowMeaning(true), 800);
    }
  };

  const { mode } = useColorMode();
  const isDark = mode === 'dark';
  const textDim = isDark ? '#2e2e34' : '#9a958e';
  const textFaint = isDark ? '#3a3a3e' : '#7a756e';
  const rowBorder = isDark ? '#1a1a1d' : '#d8d5d0';

  if (!dailyReading) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.1em' }}>
            LOADING...
          </Typography>
        </Box>
      </Container>
    );
  }

  const { card, isReversed } = dailyReading;
  const meaning = isReversed ? card.reversed : card.upright;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  color: 'secondary.dark',
                }}
              >
                DAILY_READING
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: textFaint,
                letterSpacing: '0.06em',
              }}
            >
              {formatDate(new Date())}
            </Typography>
          </Box>
        </Box>

        {/* Card area */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
          }}
        >
          {!isFlipped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ textAlign: 'center', marginBottom: '16px' }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: textFaint,
                  mb: 0.5,
                }}
              >
                TAP_TO_REVEAL
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-noto-sans-tc)',
                  fontSize: '0.75rem',
                  color: textDim,
                }}
              >
                點擊揭示今日指引
              </Typography>
            </motion.div>
          )}

          <TarotCard
            card={card}
            isReversed={isReversed}
            isFlipped={isFlipped}
            onClick={handleCardClick}
            size="large"
          />
        </Box>

        {/* Meaning panel */}
        <AnimatePresence>
          {showMeaning && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Card identity */}
              <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'var(--font-display)',
                    color: 'text.primary',
                    fontWeight: 300,
                    fontSize: { xs: '1.4rem', sm: '1.75rem' },
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
                    mb: 0.5,
                  }}
                >
                  {card.nameZh} {isReversed && '(逆位)'}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'text.secondary',
                    letterSpacing: '0.08em',
                  }}
                >
                  {card.dogBreed.toUpperCase()} · {card.dogBreedZh}
                </Typography>
              </Box>

              {/* Metadata row */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {card.element && (
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'primary.main',
                      letterSpacing: '0.08em',
                    }}
                  >
                    ELEMENT · {card.element.toUpperCase()}
                  </Typography>
                )}
                {card.zodiac && (
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'primary.main',
                      letterSpacing: '0.08em',
                    }}
                  >
                    ZODIAC · {card.zodiac.toUpperCase()}
                  </Typography>
                )}
                {card.numerology !== undefined && (
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'primary.main',
                      letterSpacing: '0.08em',
                    }}
                  >
                    NUM · {card.numerology}
                  </Typography>
                )}
              </Box>

              {/* Main meaning */}
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid', borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
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
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: textDim,
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

              {/* Advice */}
              {meaning.advice && (
                <Box sx={{ mb: 3, pl: 2, borderLeft: '2px solid', borderLeftColor: 'divider' }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'primary.main',
                      letterSpacing: '0.08em',
                      mb: 0.75,
                    }}
                  >
                    {'> ADVICE'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.8, mb: 0.5 }}>
                    {meaning.advice}
                  </Typography>
                  {meaning.adviceZh && (
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-noto-sans-tc)',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        lineHeight: 1.8,
                      }}
                    >
                      {meaning.adviceZh}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Love */}
              <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid', borderTopColor: rowBorder }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'secondary.dark',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  {'> LOVE'}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary', mb: 0.5 }}>
                  {meaning.love}
                </Typography>
                {meaning.loveZh && (
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-noto-sans-tc)',
                      color: 'secondary.dark',
                      lineHeight: 1.8,
                      fontSize: '0.875rem',
                    }}
                  >
                    {meaning.loveZh}
                  </Typography>
                )}
              </Box>

              {/* Career */}
              <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid', borderTopColor: rowBorder }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'secondary.dark',
                    letterSpacing: '0.1em',
                    mb: 1,
                  }}
                >
                  {'> CAREER'}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary', mb: 0.5 }}>
                  {meaning.career}
                </Typography>
                {meaning.careerZh && (
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-noto-sans-tc)',
                      color: 'secondary.dark',
                      lineHeight: 1.8,
                      fontSize: '0.875rem',
                    }}
                  >
                    {meaning.careerZh}
                  </Typography>
                )}
              </Box>

              {/* Health */}
              {meaning.health && (
                <Box sx={{ mb: 3, pt: 2, borderTop: '1px solid', borderTopColor: rowBorder }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'secondary.dark',
                      letterSpacing: '0.1em',
                      mb: 1,
                    }}
                  >
                    {'> HEALTH'}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary', mb: 0.5 }}>
                    {meaning.health}
                  </Typography>
                  {meaning.healthZh && (
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-noto-sans-tc)',
                        color: 'secondary.dark',
                        lineHeight: 1.8,
                        fontSize: '0.875rem',
                      }}
                    >
                      {meaning.healthZh}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Reflection questions */}
              {card.reflectionQuestions && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: rowBorder }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: textDim,
                      letterSpacing: '0.1em',
                      mb: 1.5,
                    }}
                  >
                    REFLECTION ————————
                  </Typography>
                  {card.reflectionQuestions.map((q, i) => (
                    <Box key={i} sx={{ mb: 1.5, pl: 1, borderLeft: '1px solid', borderLeftColor: 'divider' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 0.25 }}>
                        {q}
                      </Typography>
                      {card.reflectionQuestionsZh && (
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-noto-sans-tc)',
                            color: 'secondary.dark',
                            fontSize: '0.8rem',
                            lineHeight: 1.6,
                          }}
                        >
                          {card.reflectionQuestionsZh[i]}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Affirmation */}
              {card.affirmation && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: 'secondary.dark',
                      letterSpacing: '0.1em',
                      mb: 1,
                    }}
                  >
                    {'> AFFIRMATION'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: 'text.primary', fontStyle: 'italic', lineHeight: 1.8, mb: 0.5 }}
                  >
                    &ldquo;{card.affirmation}&rdquo;
                  </Typography>
                  {card.affirmationZh && (
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-noto-sans-tc)',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      「{card.affirmationZh}」
                    </Typography>
                  )}
                </Box>
              )}

              {/* CTA */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={generateDailyCard}
                  size="large"
                  sx={{ flex: { xs: '1 1 100%', sm: '0 1 auto' } }}
                >
                  DRAW NEW CARD 重新抽牌
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
}
