'use client';

import React, { useState, useSyncExternalStore } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import TarotCard from '@/components/TarotCard';
import { tarotCards } from '@/data/tarotCards';
import { Link } from '@/i18n/navigation';

interface SpreadOption {
  id: string;
  titleKey: string;
  subKey: string;
  descKey: string;
  index: string;
}

const spreadOptions: SpreadOption[] = [
  { id: 'single', titleKey: 'spreadSingle', subKey: 'spreadSingleZh', descKey: 'spreadSingleDesc', index: '01' },
  { id: 'threeCard', titleKey: 'spreadThree', subKey: 'spreadThreeZh', descKey: 'spreadThreeDesc', index: '02' },
  { id: 'love', titleKey: 'spreadLove', subKey: 'spreadLoveZh', descKey: 'spreadLoveDesc', index: '03' },
  { id: 'celticCross', titleKey: 'spreadCeltic', subKey: 'spreadCelticZh', descKey: 'spreadCelticDesc', index: '04' },
];

function pickRandomCards(count: number) {
  return [...tarotCards].sort(() => Math.random() - 0.5).slice(0, count);
}

const subscribe = () => () => {};

export default function Home() {
  const t = useTranslations('home');
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const [randomCards] = useState(() => pickRandomCards(3));

  return (
    <Box sx={{ minHeight: '100vh', pb: { xs: 4, md: 8 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Hero */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pt: { xs: 4, sm: 6, md: 8 },
            pb: { xs: 3, md: 5 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
              <Typography
                sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'secondary.dark' }}
              >
                {t('status')}
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '4rem', md: '6rem' },
                fontWeight: 300,
                fontFamily: 'var(--font-display)',
                color: 'text.primary',
                mb: 1.5,
                lineHeight: 1.1,
              }}
            >
              {t('title')}
            </Typography>

            <Typography
              sx={{ fontFamily: 'var(--font-noto-sans-tc)', fontSize: { xs: '1rem', sm: '1.2rem' }, color: 'secondary.dark', mb: 3 }}
            >
              {t('subtitle')}
            </Typography>

            <Box sx={{ display: 'inline-block', border: '1px solid', borderColor: 'divider', px: { xs: 2, sm: 3 }, py: 1, mb: 4 }}>
              <Typography
                sx={{ fontFamily: 'var(--font-mono)', fontSize: { xs: '0.6rem', sm: '0.7rem' }, letterSpacing: '0.1em', color: 'text.secondary' }}
              >
                {t('deckInfo')}
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', alignItems: 'center' }}>
              <Button
                component={Link}
                href="/daily"
                variant="contained"
                size="large"
                sx={{ minWidth: 200, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                {t('dailyCard')}
              </Button>
              <Button
                component={Link}
                href="/reading"
                variant="outlined"
                size="large"
                sx={{ minWidth: 200, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                {t('startReading')}
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* Featured cards */}
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography
                sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'secondary.dark', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {t('featured')}
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            <Box
              sx={{
                display: 'flex', justifyContent: 'center', gap: { xs: 1.5, sm: 2, md: 4 },
                flexWrap: { xs: 'nowrap', md: 'wrap' }, overflowX: { xs: 'auto', md: 'visible' },
                pb: { xs: 2, md: 0 }, scrollSnapType: 'x mandatory',
                '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none',
              }}
            >
              {!isClient
                ? [0, 1, 2].map((i) => (
                    <Box key={i} sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Skeleton variant="rounded" width={120} height={200} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.06)' }} />
                      <Skeleton width={70} height={16} sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.06)' }} />
                      <Skeleton width={50} height={14} sx={{ mt: 0.5, bgcolor: 'rgba(255,255,255,0.04)' }} />
                    </Box>
                  ))
                : randomCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                      style={{ flexShrink: 0, scrollSnapAlign: 'center' }}
                    >
                      <TarotCard card={card} isFlipped={true} size="small" disabled />
                    </motion.div>
                  ))
              }
            </Box>
          </motion.div>
        </Box>

        {/* Spread selection */}
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <Box sx={{ borderTop: '1px solid', borderTopColor: 'divider' }}>
            {spreadOptions.map((spread, index) => (
              <motion.div
                key={spread.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <Box
                  component={Link}
                  href={`/reading?spread=${spread.id}`}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 },
                    px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2 },
                    borderBottom: '1px solid', borderBottomColor: 'divider',
                    textDecoration: 'none', transition: 'background-color 0.15s ease',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'secondary.dark', letterSpacing: '0.05em', flexShrink: 0, minWidth: '3rem' }}>
                    {spread.index} &gt;
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: { xs: '0.75rem', sm: '0.85rem' }, letterSpacing: '0.08em', color: 'text.primary', mb: 0.25 }}>
                      {t(spread.titleKey)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-noto-sans-tc)', fontSize: '0.7rem', color: 'secondary.dark' }}>
                      {t(spread.subKey)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.05em', display: { xs: 'none', sm: 'block' }, flexShrink: 0 }}>
                    {t(spread.descKey)}
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'secondary.dark', flexShrink: 0, ml: { xs: 0, sm: 1 } }}>
                    →
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Gallery link */}
        <Box sx={{ py: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <Button
              component={Link}
              href="/gallery"
              variant="text"
              sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'secondary.dark', '&:hover': { color: 'text.primary' } }}
            >
              {t('browseAll')} →
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
