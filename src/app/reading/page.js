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

        {/* Reading Result Display */}
        {/* For single card: show individual meaning when card is clicked */}
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

        {/* For multi-card spreads: show holistic summary when all cards revealed */}
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

  const renderCard = (index) => (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 0.5,
          color: flippedCards.includes(index) ? 'secondary.main' : 'text.secondary',
          fontFamily: 'Cinzel',
          fontSize: { xs: '0.55rem', md: '0.65rem' },
          whiteSpace: 'nowrap',
        }}
      >
        {positions[index]}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 0.5,
          color: 'text.secondary',
          fontFamily: 'Noto Sans TC',
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
      {/* Cross section - uses CSS grid for the traditional cross shape */}
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
        {/* Row 1: Above (top center) */}
        <Box sx={{ gridColumn: '2', gridRow: '1' }}>
          {renderCard(4)}
        </Box>

        {/* Row 2: Past | Present+Challenge | Future */}
        <Box sx={{ gridColumn: '1', gridRow: '2' }}>
          {renderCard(2)}
        </Box>
        <Box sx={{ gridColumn: '2', gridRow: '2', position: 'relative' }}>
          {renderCard(0)}
          {/* Challenge card - offset below to avoid blocking Present */}
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

        {/* Row 3: Below (bottom center) */}
        <Box sx={{ gridColumn: '2', gridRow: '3' }}>
          {renderCard(5)}
        </Box>
      </Box>

      {/* Challenge card - standalone clickable version */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          order: { xs: 0, md: 0 },
          border: '1px solid rgba(244, 207, 124, 0.2)',
          borderRadius: 2,
          p: 1,
          background: 'rgba(244, 207, 124, 0.05)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'secondary.main',
            fontFamily: 'Cinzel',
            fontSize: '0.6rem',
          }}
        >
          Crossing Card
        </Typography>
        {renderCard(1)}
      </Box>

      {/* Staff column (right side - 4 cards vertically) */}
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

// Card meaning panel component - used only for single card readings
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

// Generate holistic reading summary based on spread type
function generateReadingSummary(cards, spreadType, positions, positionsZh) {
  const getMeaning = (cardData) => {
    const m = cardData.isReversed ? cardData.card.reversed : cardData.card.upright;
    return m;
  };

  const getCardLabel = (cardData) => {
    const rev = cardData.isReversed ? ' (Reversed)' : '';
    return `${cardData.card.name}${rev}`;
  };

  const getCardLabelZh = (cardData) => {
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
      summary: `In matters of the heart, ${getCardLabel(you)} represents your current energy — ${youM.meaning.toLowerCase()} Your partner or love interest carries the energy of ${getCardLabel(partner)}: ${partnerM.meaning.toLowerCase()} The connection between you is defined by ${getCardLabel(connection)}, suggesting ${connectionM.meaning.toLowerCase()} The challenge you face together, ${getCardLabel(challenge)}, points to ${challengeM.meaning.toLowerCase()} Ultimately, ${getCardLabel(outcome)} as the outcome reveals that ${outcomeM.meaning.toLowerCase()} Trust the wisdom of these cards as you navigate your heart's journey.`,
      summaryZh: `在感情方面，${getCardLabelZh(you)}代表你當前的能量——${youM.meaningZh}你的伴侶或心儀對象攜帶著${getCardLabelZh(partner)}的能量：${partnerM.meaningZh}你們之間的連結由${getCardLabelZh(connection)}定義，暗示著${connectionM.meaningZh}你們共同面對的挑戰——${getCardLabelZh(challenge)}，指向${challengeM.meaningZh}最終，${getCardLabelZh(outcome)}作為結果揭示了${outcomeM.meaningZh}在你的感情旅程中，請相信這些牌的智慧。`,
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

// Reading summary panel for multi-card spreads
function ReadingSummaryPanel({ cards, spreadType, positions, positionsZh }) {
  const summary = generateReadingSummary(cards, spreadType, positions, positionsZh);
  if (!summary) return null;

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 4 },
        mt: 3,
        background: 'linear-gradient(135deg, rgba(20, 10, 40, 0.95) 0%, rgba(30, 15, 60, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(244, 207, 124, 0.3)',
        borderRadius: 2,
      }}
    >
      {/* Summary header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Cinzel',
            fontSize: { xs: '1.3rem', md: '1.6rem' },
            background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {summary.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mt: 0.5 }}
        >
          {summary.titleZh}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'rgba(244, 207, 124, 0.2)' }} />

      {/* Card list overview */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, justifyContent: 'center' }}>
        {cards.map((cardData, index) => (
          <Box
            key={index}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              background: 'rgba(156, 124, 244, 0.1)',
              border: '1px solid rgba(156, 124, 244, 0.25)',
              textAlign: 'center',
              minWidth: 100,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'secondary.main',
                fontFamily: 'Cinzel',
                fontSize: '0.65rem',
                mb: 0.25,
              }}
            >
              {positions[index]} · {positionsZh[index]}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.primary',
                fontSize: '0.7rem',
              }}
            >
              {cardData.card.name}
              {cardData.isReversed && ' (Rev)'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.secondary',
                fontFamily: 'Noto Sans TC',
                fontSize: '0.65rem',
              }}
            >
              {cardData.card.nameZh}
              {cardData.isReversed && ' (逆位)'}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'rgba(156, 124, 244, 0.15)' }} />

      {/* Holistic interpretation */}
      <Typography
        variant="body1"
        sx={{ lineHeight: 1.8, mb: 2, whiteSpace: 'pre-line' }}
      >
        {summary.summary}
      </Typography>

      <Divider sx={{ my: 2, borderColor: 'rgba(156, 124, 244, 0.15)' }} />

      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Noto Sans TC',
          color: 'text.secondary',
          lineHeight: 1.8,
          whiteSpace: 'pre-line',
        }}
      >
        {summary.summaryZh}
      </Typography>
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
