'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import SpaIcon from '@mui/icons-material/Spa';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShareIcon from '@mui/icons-material/Share';
import TarotCard from '@/components/TarotCard';
import { getRandomCard, tarotCards } from '@/data/tarotCards';

export default function DailyCard() {
  const [dailyReading, setDailyReading] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [expandedSection, setExpandedSection] = useState('meaning');

  useEffect(() => {
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
    generateDailyCard();
  }, []);

  const generateDailyCard = () => {
    const { card, isReversed } = getRandomCard();
    setDailyReading({ card, isReversed });
    setIsFlipped(false);
    setShowMeaning(false);

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

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  if (!dailyReading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        </motion.div>
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          Consulting the cards... 正在占卜...
        </Typography>
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
        {/* Header - Mobile Optimized */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Cinzel',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              mb: 0.5,
              background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Daily Card 每日一牌
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date().toLocaleDateString('zh-TW', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </Typography>
        </Box>

        {/* Card Display - Centered and Mobile Friendly */}
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
            >
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: 'secondary.main',
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                Tap the card to reveal your guidance
                <br />
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>點擊卡片揭示今日指引</span>
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

        {/* Card Meaning - Mobile First Accordion Layout */}
        <AnimatePresence>
          {showMeaning && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Card Title & Basic Info */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 2,
                  background: 'rgba(20, 10, 40, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(156, 124, 244, 0.3)',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Cinzel',
                      color: 'secondary.main',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}
                  >
                    {card.name} {isReversed && '(Reversed)'}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}
                  >
                    {card.nameZh} {isReversed && '(逆位)'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', mt: 1 }}>
                    {card.dogBreed} · {card.dogBreedZh}
                  </Typography>
                </Box>

                {/* Element & Zodiac Chips */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    size="small"
                    label={`Element: ${card.element}`}
                    sx={{ background: 'rgba(156, 124, 244, 0.2)', color: 'primary.light' }}
                  />
                  <Chip
                    size="small"
                    label={`${card.zodiac}`}
                    sx={{ background: 'rgba(244, 207, 124, 0.2)', color: 'secondary.main' }}
                  />
                  {card.numerology !== undefined && (
                    <Chip
                      size="small"
                      label={`#${card.numerology}`}
                      variant="outlined"
                      sx={{ borderColor: 'primary.main', color: 'primary.light' }}
                    />
                  )}
                </Box>

                {/* Keywords */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {card.keywords.map((keyword, i) => (
                    <Chip
                      key={i}
                      size="small"
                      label={keyword}
                      sx={{
                        background: 'rgba(156, 124, 244, 0.15)',
                        color: 'text.primary',
                        fontSize: '0.75rem',
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Detailed Meanings - Accordion Style for Mobile */}
              <Box sx={{ mb: 2 }}>
                {/* Core Meaning */}
                <Accordion
                  expanded={expandedSection === 'meaning'}
                  onChange={handleAccordionChange('meaning')}
                  sx={{
                    background: 'rgba(20, 10, 40, 0.8)',
                    border: '1px solid rgba(156, 124, 244, 0.2)',
                    borderRadius: '12px !important',
                    mb: 1,
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TipsAndUpdatesIcon sx={{ color: 'secondary.main' }} />
                      <Typography sx={{ fontWeight: 600 }}>Today's Message 今日訊息</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                      {meaning.meaning}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', lineHeight: 1.8 }}>
                      {meaning.meaningZh}
                    </Typography>
                    {meaning.advice && (
                      <Box sx={{ mt: 2, p: 2, background: 'rgba(244, 207, 124, 0.1)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'secondary.main', mb: 1 }}>
                          💡 Advice 建議
                        </Typography>
                        <Typography variant="body2">{meaning.advice}</Typography>
                        {meaning.adviceZh && (
                          <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mt: 1 }}>
                            {meaning.adviceZh}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>

                {/* Love */}
                <Accordion
                  expanded={expandedSection === 'love'}
                  onChange={handleAccordionChange('love')}
                  sx={{
                    background: 'rgba(20, 10, 40, 0.8)',
                    border: '1px solid rgba(244, 124, 196, 0.2)',
                    borderRadius: '12px !important',
                    mb: 1,
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#f47cc4' }} />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FavoriteIcon sx={{ color: '#f47cc4' }} />
                      <Typography sx={{ fontWeight: 600 }}>Love 愛情</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                      {meaning.love}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', lineHeight: 1.8 }}>
                      {meaning.loveZh}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                {/* Career */}
                <Accordion
                  expanded={expandedSection === 'career'}
                  onChange={handleAccordionChange('career')}
                  sx={{
                    background: 'rgba(20, 10, 40, 0.8)',
                    border: '1px solid rgba(124, 184, 244, 0.2)',
                    borderRadius: '12px !important',
                    mb: 1,
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#7cb8f4' }} />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon sx={{ color: '#7cb8f4' }} />
                      <Typography sx={{ fontWeight: 600 }}>Career 事業</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                      {meaning.career}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', lineHeight: 1.8 }}>
                      {meaning.careerZh}
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                {/* Health (if available) */}
                {meaning.health && (
                  <Accordion
                    expanded={expandedSection === 'health'}
                    onChange={handleAccordionChange('health')}
                    sx={{
                      background: 'rgba(20, 10, 40, 0.8)',
                      border: '1px solid rgba(152, 251, 152, 0.2)',
                      borderRadius: '12px !important',
                      mb: 1,
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#98FB98' }} />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpaIcon sx={{ color: '#98FB98' }} />
                        <Typography sx={{ fontWeight: 600 }}>Health 健康</Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                        {meaning.health}
                      </Typography>
                      {meaning.healthZh && (
                        <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', lineHeight: 1.8 }}>
                          {meaning.healthZh}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>

              {/* Reflection Questions */}
              {card.reflectionQuestions && (
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 2,
                    background: 'linear-gradient(135deg, rgba(156, 124, 244, 0.1) 0%, rgba(244, 207, 124, 0.1) 100%)',
                    border: '1px solid rgba(156, 124, 244, 0.3)',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'secondary.main' }}>
                    🔮 Reflection Questions 反思問題
                  </Typography>
                  {card.reflectionQuestions.map((q, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 0.5, fontStyle: 'italic' }}>
                        {q}
                      </Typography>
                      {card.reflectionQuestionsZh && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Noto Sans TC' }}>
                          {card.reflectionQuestionsZh[i]}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Paper>
              )}

              {/* Affirmation */}
              {card.affirmation && (
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 2,
                    background: 'rgba(244, 207, 124, 0.1)',
                    border: '1px solid rgba(244, 207, 124, 0.3)',
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: 'secondary.main', mb: 1 }}>
                    ✨ Daily Affirmation 每日肯定語
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                    "{card.affirmation}"
                  </Typography>
                  {card.affirmationZh && (
                    <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}>
                      「{card.affirmationZh}」
                    </Typography>
                  )}
                </Paper>
              )}

              {/* Action Buttons - Mobile Friendly */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleNewCard}
                  size="large"
                  sx={{ flex: { xs: '1 1 100%', sm: '0 1 auto' } }}
                >
                  Draw New Card 重新抽牌
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  );
}
