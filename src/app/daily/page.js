'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Fade,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import TarotCard from '@/components/TarotCard';
import { getRandomCard, tarotCards } from '@/data/tarotCards';

export default function DailyCard() {
  const [dailyReading, setDailyReading] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    // Check if we have a stored daily card for today
    const stored = localStorage.getItem('dailyCard');
    if (stored) {
      const { date, cardId, isReversed } = JSON.parse(stored);
      const today = new Date().toDateString();
      if (date === today) {
        const card = tarotCards.find(c => c.id === cardId);
        setDailyReading({ card, isReversed });
        return;
      }
    }
    // Generate new daily card
    generateDailyCard();
  }, []);

  const generateDailyCard = () => {
    const { card, isReversed } = getRandomCard();
    setDailyReading({ card, isReversed });
    setIsFlipped(false);
    setShowMeaning(false);

    // Store for today
    localStorage.setItem('dailyCard', JSON.stringify({
      date: new Date().toDateString(),
      cardId: card.id,
      isReversed,
    }));
  };

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setTimeout(() => setShowMeaning(true), 800);
    }
  };

  const handleNewCard = () => {
    generateDailyCard();
  };

  if (!dailyReading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading your daily guidance...</Typography>
      </Container>
    );
  }

  const { card, isReversed } = dailyReading;
  const meaning = isReversed ? card.reversed : card.upright;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Cinzel',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 1,
              background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Daily Card Reading
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mb: 2 }}
          >
            每日一牌占卜
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>

        {/* Card Display */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          {!isFlipped && (
            <Typography
              variant="body1"
              sx={{ mb: 3, color: 'secondary.main', fontStyle: 'italic' }}
            >
              Click the card to reveal your daily guidance ✨
              <br />
              <span style={{ fontSize: '0.9rem' }}>點擊卡片揭示今日指引</span>
            </Typography>
          )}

          <TarotCard
            card={card}
            isReversed={isReversed}
            isFlipped={isFlipped}
            onClick={handleCardClick}
            size="large"
          />
        </Box>

        {/* Card Meaning */}
        <AnimatePresence>
          {showMeaning && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(20, 10, 40, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(156, 124, 244, 0.3)',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{ fontFamily: 'Cinzel', color: 'secondary.main', mb: 1 }}
                  >
                    {card.name} {isReversed && '(Reversed)'}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}
                  >
                    {card.nameZh} {isReversed && '(逆位)'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'primary.light' }}>
                    {card.dogBreed} · {card.dogBreedZh}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(156, 124, 244, 0.3)' }} />

                {/* Keywords */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="secondary.main" gutterBottom>
                    Keywords 關鍵詞
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {card.keywords.map((keyword, i) => (
                      <Box
                        key={i}
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          background: 'rgba(156, 124, 244, 0.2)',
                          border: '1px solid rgba(156, 124, 244, 0.3)',
                        }}
                      >
                        <Typography variant="body2">
                          {keyword} · {card.keywordsZh[i]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Main Meaning */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="secondary.main" gutterBottom>
                    Today's Message 今日訊息
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {meaning.meaning}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC' }}>
                    {meaning.meaningZh}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(156, 124, 244, 0.3)' }} />

                {/* Love & Career */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="primary.light" gutterBottom>
                      💕 Love 愛情
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {meaning.love}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}>
                      {meaning.loveZh}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary.light" gutterBottom>
                      💼 Career 事業
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {meaning.career}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}>
                      {meaning.careerZh}
                    </Typography>
                  </Box>
                </Box>

                {/* Draw New Card Button */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleNewCard}
                    sx={{ mt: 2 }}
                  >
                    Draw New Card 重新抽牌
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
}
