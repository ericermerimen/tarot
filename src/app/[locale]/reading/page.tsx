'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { spreadTypes } from '@/data/tarotCards';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { getSpreadName, getSpreadDescription } from '@/utils/localeCards';
import type { SpreadKey } from '@/types/tarot';

const spreads: { key: SpreadKey; slug: string; index: string }[] = [
  { key: 'single', slug: 'single', index: '01' },
  { key: 'threeCard', slug: 'three-card', index: '02' },
  { key: 'love', slug: 'love', index: '03' },
  { key: 'celticCross', slug: 'celtic-cross', index: '04' },
];

export default function ReadingIndexPage() {
  const t = useTranslations('reading');
  const locale = useCurrentLocale();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
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

        {/* Spread Selection */}
        <Box sx={{ borderTop: '1px solid', borderTopColor: 'divider' }}>
          {spreads.map((spread, index) => {
            const spreadDef = spreadTypes[spread.key];
            return (
              <motion.div
                key={spread.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <Box
                  component={Link}
                  href={`/reading/${spread.slug}`}
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
                      {getSpreadName(spreadDef, locale)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-noto-sans-tc)', fontSize: '0.7rem', color: 'secondary.dark' }}>
                      {getSpreadDescription(spreadDef, locale)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.05em', display: { xs: 'none', sm: 'block' }, flexShrink: 0 }}>
                    {spreadDef.count} {spreadDef.count === 1 ? 'card' : 'cards'}
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'secondary.dark', flexShrink: 0, ml: { xs: 0, sm: 1 } }}>
                    →
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </motion.div>
    </Container>
  );
}
