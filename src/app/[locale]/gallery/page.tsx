'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import { motion } from 'motion/react';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';
import TarotCard from '@/components/TarotCard';
import { tarotCards } from '@/data/tarotCards';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { getCardName, getCardBreed, getKeywords, getMeaning } from '@/utils/localeCards';
import type { TarotCardData } from '@/types/tarot';

export default function CardGallery() {
  const t = useTranslations('gallery');
  const locale = useCurrentLocale();
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = (card: TarotCardData) => {
    setSelectedCard(card);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'secondary.dark' }}>
              {t('header')}
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontFamily: 'var(--font-display)', fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 300, color: 'text.primary', mb: 0.25 }}>
            {t('title')}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-noto-sans-tc)', fontSize: '0.95rem', color: 'secondary.dark', mb: 0.75 }}>
            {t('subtitle')}
          </Typography>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.06em' }}>
            {t('description')}
          </Typography>
        </Box>

        {/* Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {tarotCards.map((card, index) => (
            <motion.div key={card.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.04 }}>
              <Box sx={{ cursor: 'pointer', transition: 'transform 0.2s ease', '&:hover': { transform: 'translateY(-6px)' } }} onClick={() => handleCardClick(card)}>
                <TarotCard card={card} isFlipped={true} size="small" disabled />
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Detail Dialog */}
        <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth
          PaperProps={{ sx: { bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: 0, boxShadow: 'none' } }}>
          {selectedCard && (
            <DialogContent sx={{ p: 0 }}>
              <IconButton onClick={handleClose}
                sx={{ position: 'absolute', right: 8, top: 8, color: 'secondary.dark', zIndex: 1, borderRadius: 0, '&:hover': { color: 'text.primary', bgcolor: 'transparent' } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' }, gap: 0 }}>
                <Box sx={(theme) => ({ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', p: 4, borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` }, borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' } })}>
                  <TarotCard card={selectedCard} isFlipped={true} size="large" disabled />
                </Box>
                <Box sx={{ p: 4, overflow: 'auto', maxHeight: { md: '80vh' } }}>
                  <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
                    <Typography sx={{ fontFamily: 'var(--font-display)', fontSize: { xs: '1.5rem', md: '1.875rem' }, fontWeight: 300, color: 'text.primary', mb: 0.25 }}>
                      {getCardName(selectedCard, locale)}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'text.secondary', letterSpacing: '0.08em' }}>
                      {getCardBreed(selectedCard, locale).toUpperCase()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    {selectedCard.element && (
                      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'primary.main', letterSpacing: '0.08em' }}>
                        {t('element')} · {selectedCard.element.toUpperCase()}
                      </Typography>
                    )}
                    {selectedCard.zodiac && (
                      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'primary.main', letterSpacing: '0.08em' }}>
                        {t('zodiac')} · {selectedCard.zodiac.toUpperCase()}
                      </Typography>
                    )}
                    {selectedCard.numerology !== undefined && (
                      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'primary.main', letterSpacing: '0.08em' }}>
                        {t('num')} · {selectedCard.numerology}
                      </Typography>
                    )}
                  </Box>
                  {selectedCard.description && (
                    <Box sx={{ mb: 3, pl: 2, borderLeft: '2px solid', borderLeftColor: 'divider' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, fontStyle: 'italic' }}>
                        {selectedCard.description}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
                      {t('keywords')} ————————
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getKeywords(selectedCard, locale).map((keyword, i) => (
                        <Box key={i} sx={{ px: 1, py: 0.25, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'text.secondary', letterSpacing: '0.05em' }}>
                            {keyword}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.08em', mb: 1.5 }}>
                      {t('upright')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.8 }}>
                      {getMeaning(selectedCard.upright, locale).meaning}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', letterSpacing: '0.08em', mb: 1.5 }}>
                      {t('reversed')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.8 }}>
                      {getMeaning(selectedCard.reversed, locale).meaning}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          )}
        </Dialog>
      </motion.div>
    </Container>
  );
}
