'use client';

import React, { useState, Suspense } from 'react';
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
import type { ReadingRecord } from '@/types/reading';

function ReadingContent() {
  const searchParams = useSearchParams();
  const initialSpread = (searchParams.get('spread') || 'single') as SpreadKey;

  const [selectedSpread, setSelectedSpread] = useState<SpreadKey>(initialSpread);
  const currentSpread = spreadTypes[selectedSpread] || spreadTypes.single;
  const [cards, setCards] = useState<DrawnCard[]>(() => getRandomCards(currentSpread.count));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [showMeaning, setShowMeaning] = useState<number | null>(null);
  const [readingComplete, setReadingComplete] = useState(false);
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

  const saveReading = () => {
    const reading: ReadingRecord = {
      date: new Date().toISOString(),
      spread: selectedSpread,
      cards: cards.map((c, i) => ({
        cardId: c.card.id,
        isReversed: c.isReversed,
        position: currentSpread.positions[i],
        positionZh: currentSpread.positionsZh[i],
      })),
    };

    const history: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
    history.unshift(reading);
    localStorage.setItem('tarotHistory', JSON.stringify(history.slice(0, 50)));

    alert('Reading saved to your journal! 占卜已保存到日記！');
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #252528' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#c4a96e', flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: '#606068',
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
              color: '#e4e0d8',
              mb: 0.25,
            }}
          >
            Tarot Reading
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              color: '#606068',
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
              borderBottom: '1px solid #252528',
              '& .MuiTab-root': {
                color: '#606068',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                minHeight: 40,
                '&.Mui-selected': {
                  color: '#c4a96e',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#c4a96e',
                height: 1,
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
              color: '#e4e0d8',
              mb: 0.25,
            }}
          >
            {currentSpread.name}
          </Typography>
          <Typography
            sx={{ fontFamily: 'var(--font-noto-sans-tc)', color: '#606068', fontSize: '0.875rem', mb: 0.5 }}
          >
            {currentSpread.nameZh}
          </Typography>
          <Typography
            sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#3a3a3e', letterSpacing: '0.06em' }}
          >
            {currentSpread.description} · {currentSpread.descriptionZh}
          </Typography>
          {!readingComplete && (
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: '#3a3a3e',
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
                    color: flippedCards.includes(index) ? '#c4a96e' : '#3a3a3e',
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
                    color: '#2e2e34',
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
            onClick={() => startNewReading()}
          >
            NEW_READING 重新占卜
          </Button>
          {readingComplete && (
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={saveReading}
            >
              SAVE_TO_JOURNAL 保存到日記
            </Button>
          )}
        </Box>
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
          color: flippedCards.includes(index) ? '#c4a96e' : '#3a3a3e',
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
          color: '#2e2e34',
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
          border: '1px solid #252528',
          p: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          sx={{
            color: '#c4a96e',
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
    <Box sx={{ mt: 2, border: '1px solid #252528', bgcolor: 'background.default' }}>
      {/* Position header */}
      <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #252528', bgcolor: 'background.paper' }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: '#c4a96e',
            letterSpacing: '0.08em',
          }}
        >
          {position.toUpperCase()} · {positionZh}
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Card identity */}
        <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #252528' }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              color: '#e4e0d8',
              fontWeight: 300,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              mb: 0.25,
            }}
          >
            {card.name}
            {isReversed && (
              <span style={{ color: '#606068', fontSize: '0.7em', marginLeft: '0.5em' }}>(Reversed)</span>
            )}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              color: '#606068',
              fontSize: '0.95rem',
            }}
          >
            {card.nameZh} {isReversed && '(逆位)'}
          </Typography>
        </Box>

        {/* Meaning */}
        <Box sx={{ mb: 2, p: 2, border: '1px solid #252528', bgcolor: 'background.paper' }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: '#606068',
              letterSpacing: '0.08em',
              mb: 1.5,
            }}
          >
            {isReversed ? '> REVERSED' : '> UPRIGHT'}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#e4e0d8', mb: 1.5 }}>
            {meaning.meaning}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              color: '#888078',
              lineHeight: 1.8,
              fontSize: '0.9rem',
            }}
          >
            {meaning.meaningZh}
          </Typography>
        </Box>

        {/* Keywords */}
        <Box>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: '#2e2e34',
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
                  border: '1px solid #252528',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: '#888078',
                    letterSpacing: '0.05em',
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface ReadingSummary {
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
}

function generateReadingSummary(cards: DrawnCard[], spreadType: string, positions: string[], positionsZh: string[]): ReadingSummary | null {
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

interface ReadingSummaryPanelProps {
  cards: DrawnCard[];
  spreadType: string;
  positions: string[];
  positionsZh: string[];
}

function ReadingSummaryPanel({ cards, spreadType, positions, positionsZh }: ReadingSummaryPanelProps) {
  const summary = generateReadingSummary(cards, spreadType, positions, positionsZh);
  if (!summary) return null;

  return (
    <Box sx={{ mt: 3, border: '1px solid #252528', bgcolor: 'background.default' }}>
      {/* Summary header */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #252528', bgcolor: 'background.paper' }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            fontWeight: 300,
            color: '#e4e0d8',
            mb: 0.25,
          }}
        >
          {summary.title}
        </Typography>
        <Typography
          sx={{ fontFamily: 'var(--font-noto-sans-tc)', color: '#606068', fontSize: '0.875rem' }}
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
              color: '#2e2e34',
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
                  border: '1px solid #252528',
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                  minWidth: 90,
                }}
              >
                <Typography
                  sx={{
                    display: 'block',
                    color: '#c4a96e',
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
                    color: '#e4e0d8',
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
                    color: '#606068',
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

        <Divider sx={{ mb: 2.5, borderColor: '#252528' }} />

        {/* Holistic interpretation */}
        <Typography
          variant="body1"
          sx={{ lineHeight: 1.8, mb: 2, color: '#e4e0d8', whiteSpace: 'pre-line' }}
        >
          {summary.summary}
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#1a1a1d' }} />

        <Typography
          variant="body1"
          sx={{
            fontFamily: 'var(--font-noto-sans-tc)',
            color: '#888078',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}
        >
          {summary.summaryZh}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#606068', letterSpacing: '0.1em' }}>
          LOADING...
        </Typography>
      </Container>
    }>
      <ReadingContent />
    </Suspense>
  );
}
