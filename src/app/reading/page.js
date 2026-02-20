'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Fade,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import TarotCard from '@/components/TarotCard';
import { getRandomCards, spreadTypes, tarotCards } from '@/data/tarotCards';

function ReadingContent() {
  const searchParams = useSearchParams();
  const initialSpread = searchParams.get('spread') || 'single';

  const [selectedSpread, setSelectedSpread] = useState(initialSpread);
  const currentSpread = spreadTypes[selectedSpread] || spreadTypes.single;
  const [cards, setCards] = useState(() => getRandomCards(currentSpread.count));
  const [flippedCards, setFlippedCards] = useState([]);
  const [showMeaning, setShowMeaning] = useState(null);
  const [readingComplete, setReadingComplete] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial mount — lazy initializer already populated cards
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    startNewReading();
  }, [selectedSpread]);

  const startNewReading = () => {
    const newCards = getRandomCards(currentSpread.count);
    setCards(newCards);
    setFlippedCards([]);
    setShowMeaning(null);
    setReadingComplete(false);
  };

  const handleCardClick = (index) => {
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

  const handleSpreadChange = (event, newValue) => {
    setSelectedSpread(newValue);
  };

  const saveReading = () => {
    const reading = {
      date: new Date().toISOString(),
      spread: selectedSpread,
      cards: cards.map((c, i) => ({
        cardId: c.card.id,
        isReversed: c.isReversed,
        position: currentSpread.positions[i],
        positionZh: currentSpread.positionsZh[i],
      })),
    };

    const history = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
    history.unshift(reading);
    localStorage.setItem('tarotHistory', JSON.stringify(history.slice(0, 50)));

    alert('Reading saved to your journal! 占卜已保存到日記！');
  };

  const getCardLayout = () => {
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Cinzel',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              mb: 1,
              background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tarot Reading
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}
          >
            塔羅占卜
          </Typography>
        </Box>

        {/* Spread Selection Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={selectedSpread}
            onChange={handleSpreadChange}
            centered
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                fontFamily: 'Cinzel',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            <Tab value="single" label="Single" />
            <Tab value="threeCard" label="Three Card" />
            <Tab value="love" label="Love" />
            <Tab value="celticCross" label="Celtic Cross" />
          </Tabs>
        </Box>

        {/* Spread Info */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: 'Cinzel', color: 'secondary.main' }}>
            {currentSpread.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}>
            {currentSpread.nameZh}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {currentSpread.description} · {currentSpread.descriptionZh}
          </Typography>
          {!readingComplete && (
            <Typography variant="body2" sx={{ mt: 2, color: 'primary.light', fontStyle: 'italic' }}>
              Click each card to reveal · 點擊每張牌揭示
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
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 1,
                    color: flippedCards.includes(index) ? 'secondary.main' : 'text.secondary',
                    fontFamily: 'Cinzel',
                  }}
                >
                  {currentSpread.positions[index]}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 2,
                    color: 'text.secondary',
                    fontFamily: 'Noto Sans TC',
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

        {/* Card Meaning Display */}
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

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={startNewReading}
          >
            New Reading 重新占卜
          </Button>
          {readingComplete && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={saveReading}
            >
              Save to Journal 保存到日記
            </Button>
          )}
        </Box>
      </motion.div>
    </Container>
  );
}

// Celtic Cross specific layout
function CelticCrossLayout({ cards, flippedCards, onCardClick, positions, positionsZh }) {
  const cardSize = 'small';

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 700, mx: 'auto', height: 550, mb: 4 }}>
      {/* Center cross */}
      {/* 1. Present (center) */}
      <Box sx={{ position: 'absolute', left: '35%', top: '35%', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
          {positions[0]} {positionsZh[0]}
        </Typography>
        <TarotCard
          card={cards[0]?.card}
          isReversed={cards[0]?.isReversed}
          isFlipped={flippedCards.includes(0)}
          onClick={() => onCardClick(0)}
          size={cardSize}
        />
      </Box>

      {/* 2. Challenge (crossing) */}
      <Box sx={{ position: 'absolute', left: '38%', top: '37%', transform: 'rotate(90deg)', zIndex: 2 }}>
        <TarotCard
          card={cards[1]?.card}
          isReversed={cards[1]?.isReversed}
          isFlipped={flippedCards.includes(1)}
          onClick={() => onCardClick(1)}
          size={cardSize}
        />
      </Box>

      {/* 3. Past (left) */}
      <Box sx={{ position: 'absolute', left: '10%', top: '35%', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
          {positions[2]} {positionsZh[2]}
        </Typography>
        <TarotCard
          card={cards[2]?.card}
          isReversed={cards[2]?.isReversed}
          isFlipped={flippedCards.includes(2)}
          onClick={() => onCardClick(2)}
          size={cardSize}
        />
      </Box>

      {/* 4. Future (right) */}
      <Box sx={{ position: 'absolute', right: '25%', top: '35%', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
          {positions[3]} {positionsZh[3]}
        </Typography>
        <TarotCard
          card={cards[3]?.card}
          isReversed={cards[3]?.isReversed}
          isFlipped={flippedCards.includes(3)}
          onClick={() => onCardClick(3)}
          size={cardSize}
        />
      </Box>

      {/* 5. Above */}
      <Box sx={{ position: 'absolute', left: '35%', top: '5%', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
          {positions[4]} {positionsZh[4]}
        </Typography>
        <TarotCard
          card={cards[4]?.card}
          isReversed={cards[4]?.isReversed}
          isFlipped={flippedCards.includes(4)}
          onClick={() => onCardClick(4)}
          size={cardSize}
        />
      </Box>

      {/* 6. Below */}
      <Box sx={{ position: 'absolute', left: '35%', bottom: '5%', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
          {positions[5]} {positionsZh[5]}
        </Typography>
        <TarotCard
          card={cards[5]?.card}
          isReversed={cards[5]?.isReversed}
          isFlipped={flippedCards.includes(5)}
          onClick={() => onCardClick(5)}
          size={cardSize}
        />
      </Box>

      {/* Staff (right column) */}
      {[6, 7, 8, 9].map((i, idx) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            right: '2%',
            top: `${75 - idx * 22}%`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.5rem' }}>
            {positions[i]}
          </Typography>
          <TarotCard
            card={cards[i]?.card}
            isReversed={cards[i]?.isReversed}
            isFlipped={flippedCards.includes(i)}
            onClick={() => onCardClick(i)}
            size={cardSize}
          />
        </Box>
      ))}
    </Box>
  );
}

// Card meaning panel component
function CardMeaningPanel({ card, isReversed, position, positionZh }) {
  const meaning = isReversed ? card.reversed : card.upright;

  return (
    <Paper
      sx={{
        p: 3,
        mt: 2,
        background: 'rgba(20, 10, 40, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(156, 124, 244, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            background: 'rgba(244, 207, 124, 0.2)',
            border: '1px solid rgba(244, 207, 124, 0.4)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'secondary.main' }}>
            {position} · {positionZh}
          </Typography>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ fontFamily: 'Cinzel', color: 'secondary.main' }}>
        {card.name} {isReversed && '(Reversed)'}
      </Typography>
      <Typography variant="subtitle1" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mb: 2 }}>
        {card.nameZh} {isReversed && '(逆位)'}
      </Typography>

      <Typography variant="body1" paragraph>
        {meaning.meaning}
      </Typography>
      <Typography variant="body1" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}>
        {meaning.meaningZh}
      </Typography>

      <Divider sx={{ my: 2, borderColor: 'rgba(156, 124, 244, 0.2)' }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {card.keywords.map((keyword, i) => (
          <Box
            key={i}
            sx={{
              px: 1.5,
              py: 0.25,
              borderRadius: 1,
              background: 'rgba(156, 124, 244, 0.15)',
              fontSize: '0.75rem',
            }}
          >
            {keyword}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    }>
      <ReadingContent />
    </Suspense>
  );
}
