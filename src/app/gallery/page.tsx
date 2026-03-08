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
import TarotCard from '@/components/TarotCard';
import { tarotCards } from '@/data/tarotCards';
import type { TarotCardData } from '@/types/tarot';

export default function CardGallery() {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid #252528' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#c4a96e', flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: '#606068',
              }}
            >
              CARD_GALLERY
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 300,
              color: '#e4e0d8',
              mb: 0.25,
            }}
          >
            Card Gallery
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              fontSize: '0.95rem',
              color: '#606068',
              mb: 0.75,
            }}
          >
            牌卡圖鑑
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: '#3a3a3e',
              letterSpacing: '0.06em',
            }}
          >
            22 MAJOR ARCANA · 點擊查看詳情
          </Typography>
        </Box>

        {/* Grid */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {tarotCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <Box
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                  },
                }}
                onClick={() => handleCardClick(card)}
              >
                <TarotCard
                  card={card}
                  isFlipped={true}
                  size="small"
                  disabled
                />
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Detail Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#0d0d0f',
              border: '1px solid #252528',
              borderRadius: 0,
              boxShadow: 'none',
            },
          }}
        >
          {selectedCard && (
            <DialogContent sx={{ p: 0 }}>
              <IconButton
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: '#606068',
                  zIndex: 1,
                  borderRadius: 0,
                  '&:hover': { color: '#e4e0d8', bgcolor: 'transparent' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' },
                  gap: 0,
                }}
              >
                {/* Card visual */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    p: 4,
                    borderRight: { xs: 'none', md: '1px solid #252528' },
                    borderBottom: { xs: '1px solid #252528', md: 'none' },
                  }}
                >
                  <TarotCard
                    card={selectedCard}
                    isFlipped={true}
                    size="large"
                    disabled
                  />
                </Box>

                {/* Card details */}
                <Box sx={{ p: 4, overflow: 'auto', maxHeight: { md: '80vh' } }}>
                  {/* Identity */}
                  <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #252528' }}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-display)',
                        fontSize: { xs: '1.5rem', md: '1.875rem' },
                        fontWeight: 300,
                        color: '#e4e0d8',
                        mb: 0.25,
                      }}
                    >
                      {selectedCard.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-noto-sans-tc)',
                        color: '#606068',
                        fontSize: '0.95rem',
                        mb: 0.75,
                      }}
                    >
                      {selectedCard.nameZh}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        color: '#888078',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {selectedCard.dogBreed.toUpperCase()} · {selectedCard.dogBreedZh}
                    </Typography>
                  </Box>

                  {/* Metadata */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    {selectedCard.element && (
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6rem',
                          color: '#c4a96e',
                          letterSpacing: '0.08em',
                        }}
                      >
                        ELEMENT · {selectedCard.element.toUpperCase()}
                      </Typography>
                    )}
                    {selectedCard.zodiac && (
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6rem',
                          color: '#c4a96e',
                          letterSpacing: '0.08em',
                        }}
                      >
                        ZODIAC · {selectedCard.zodiac.toUpperCase()}
                      </Typography>
                    )}
                    {selectedCard.numerology !== undefined && (
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6rem',
                          color: '#c4a96e',
                          letterSpacing: '0.08em',
                        }}
                      >
                        NUM · {selectedCard.numerology}
                      </Typography>
                    )}
                  </Box>

                  {/* Description */}
                  {selectedCard.description && (
                    <Box sx={{ mb: 3, pl: 2, borderLeft: '2px solid #252528' }}>
                      <Typography variant="body2" sx={{ color: '#888078', lineHeight: 1.8, fontStyle: 'italic' }}>
                        {selectedCard.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Keywords */}
                  <Box sx={{ mb: 3 }}>
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
                      {selectedCard.keywords.map((keyword, i) => (
                        <Box
                          key={i}
                          sx={{
                            px: 1,
                            py: 0.25,
                            border: '1px solid #252528',
                            bgcolor: '#131316',
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
                            {keyword}{selectedCard.keywordsZh?.[i] ? ` · ${selectedCard.keywordsZh[i]}` : ''}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* Upright */}
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      border: '1px solid #252528',
                      bgcolor: '#131316',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: '#606068',
                        letterSpacing: '0.08em',
                        mb: 1.5,
                      }}
                    >
                      {'> UPRIGHT 正位'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#e4e0d8', lineHeight: 1.8, mb: 1 }}>
                      {selectedCard.upright.meaning}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-noto-sans-tc)',
                        color: '#888078',
                        fontSize: '0.875rem',
                        lineHeight: 1.8,
                      }}
                    >
                      {selectedCard.upright.meaningZh}
                    </Typography>
                  </Box>

                  {/* Reversed */}
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      border: '1px solid #252528',
                      bgcolor: '#131316',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: '#606068',
                        letterSpacing: '0.08em',
                        mb: 1.5,
                      }}
                    >
                      {'> REVERSED 逆位'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#e4e0d8', lineHeight: 1.8, mb: 1 }}>
                      {selectedCard.reversed.meaning}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-noto-sans-tc)',
                        color: '#888078',
                        fontSize: '0.875rem',
                        lineHeight: 1.8,
                      }}
                    >
                      {selectedCard.reversed.meaningZh}
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
