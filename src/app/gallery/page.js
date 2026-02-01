'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import TarotCard from '@/components/TarotCard';
import { tarotCards } from '@/data/tarotCards';

export default function CardGallery() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
            Card Gallery
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mb: 2 }}
          >
            牌卡圖鑑
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore all 22 Major Arcana cards and their meanings
            <br />
            探索全部22張大阿爾卡納牌及其含義
          </Typography>
        </Box>

        {/* Card Grid */}
        <Grid container spacing={3} justifyContent="center">
          {tarotCards.map((card, index) => (
            <Grid item key={card.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Box
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
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
            </Grid>
          ))}
        </Grid>

        {/* Card Detail Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(20, 10, 40, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(156, 124, 244, 0.3)',
              borderRadius: 3,
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
                  color: 'text.secondary',
                  zIndex: 1,
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' },
                  gap: 4,
                  p: 4,
                }}
              >
                {/* Card Display */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <TarotCard
                    card={selectedCard}
                    isFlipped={true}
                    size="large"
                    disabled
                  />
                </Box>

                {/* Card Details */}
                <Box>
                  <Typography
                    variant="h3"
                    sx={{ fontFamily: 'Cinzel', color: 'secondary.main', mb: 1 }}
                  >
                    {selectedCard.name}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mb: 2 }}
                  >
                    {selectedCard.nameZh}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${selectedCard.dogBreed}`}
                      size="small"
                      sx={{
                        background: 'rgba(156, 124, 244, 0.2)',
                        color: 'primary.light',
                      }}
                    />
                    <Chip
                      label={selectedCard.dogBreedZh}
                      size="small"
                      sx={{
                        background: 'rgba(244, 207, 124, 0.2)',
                        color: 'secondary.main',
                      }}
                    />
                    <Chip
                      label={`Element: ${selectedCard.element}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'primary.main', color: 'primary.light' }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph sx={{ fontStyle: 'italic' }}>
                    {selectedCard.description}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: 'rgba(156, 124, 244, 0.3)' }} />

                  {/* Keywords */}
                  <Typography variant="subtitle2" color="secondary.main" gutterBottom>
                    Keywords 關鍵詞
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {selectedCard.keywords.map((keyword, i) => (
                      <Chip
                        key={i}
                        label={`${keyword} · ${selectedCard.keywordsZh[i]}`}
                        size="small"
                        sx={{
                          background: 'rgba(156, 124, 244, 0.15)',
                          color: 'text.primary',
                        }}
                      />
                    ))}
                  </Box>

                  {/* Upright Meaning */}
                  <Typography variant="subtitle2" color="primary.light" gutterBottom>
                    ⬆️ Upright 正位
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedCard.upright.meaning}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mb: 3 }}>
                    {selectedCard.upright.meaningZh}
                  </Typography>

                  {/* Reversed Meaning */}
                  <Typography variant="subtitle2" color="error.light" gutterBottom>
                    ⬇️ Reversed 逆位
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedCard.reversed.meaning}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}>
                    {selectedCard.reversed.meaningZh}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          )}
        </Dialog>
      </motion.div>
    </Container>
  );
}
