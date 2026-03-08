'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { tarotCards, spreadTypes } from '@/data/tarotCards';
import type { SpreadKey } from '@/types/tarot';
import type { ReadingRecord } from '@/types/reading';

export default function Journal() {
  const [readings, setReadings] = useState<ReadingRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('tarotHistory');
    return stored ? JSON.parse(stored) : [];
  });
  const [expandedReading, setExpandedReading] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | 'all' | null>(null);

  const handleDelete = (index: number) => {
    setDeleteTarget(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget === 'all') {
      setReadings([]);
      localStorage.removeItem('tarotHistory');
    } else if (typeof deleteTarget === 'number') {
      const newReadings = readings.filter((_, i) => i !== deleteTarget);
      setReadings(newReadings);
      localStorage.setItem('tarotHistory', JSON.stringify(newReadings));
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleClearAll = () => {
    setDeleteTarget('all');
    setDeleteDialogOpen(true);
  };

  const toggleExpand = (index: number) => {
    setExpandedReading(expandedReading === index ? null : index);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid #252528' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#c4a96e', flexShrink: 0 }} />
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  color: '#606068',
                }}
              >
                READING_LOG
              </Typography>
            </Box>
            {readings.length > 0 && (
              <Box
                component="button"
                onClick={handleClearAll}
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  color: '#606068',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  p: 0,
                  '&:hover': { color: '#e4e0d8' },
                }}
              >
                CLEAR_ALL ×
              </Box>
            )}
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
            Reading Journal
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              fontSize: '0.95rem',
              color: '#606068',
              mb: 0.75,
            }}
          >
            占卜日記
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: '#3a3a3e',
              letterSpacing: '0.06em',
            }}
          >
            {readings.length} {readings.length === 1 ? 'ENTRY' : 'ENTRIES'} · 回顧您的占卜記錄
          </Typography>
        </Box>

        {readings.length === 0 ? (
          /* Empty state */
          <Box
            sx={{
              p: 6,
              textAlign: 'center',
              border: '1px solid #252528',
              bgcolor: 'background.paper',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: '#3a3a3e',
                mb: 2,
              }}
            >
              LOG_EMPTY — NO ENTRIES
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-noto-sans-tc)',
                fontSize: '0.875rem',
                color: '#888078',
                mb: 3,
              }}
            >
              您保存的占卜記錄將顯示在這裡
            </Typography>
            <Button
              variant="contained"
              href="/reading"
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                borderRadius: 0,
                bgcolor: '#c4a96e',
                color: '#0d0d0f',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#b89a5e', boxShadow: 'none' },
              }}
            >
              START_READING →
            </Button>
          </Box>
        ) : (
          <AnimatePresence>
            {readings.map((reading, index) => {
              const timestamp = formatTimestamp(reading.date);
              const spread = spreadTypes[reading.spread as SpreadKey] || spreadTypes.single;
              const isExpanded = expandedReading === index;
              const spreadKey = reading.spread.toUpperCase().replace(/\s+/g, '_');

              return (
                <motion.div
                  key={reading.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Box
                    sx={{
                      borderBottom: '1px solid #1a1a1d',
                      '&:first-of-type': { borderTop: '1px solid #1a1a1d' },
                    }}
                  >
                    {/* Row header */}
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                      onClick={() => toggleExpand(index)}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.6rem',
                              color: '#606068',
                              letterSpacing: '0.06em',
                              flexShrink: 0,
                            }}
                          >
                            {timestamp}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.6rem',
                              color: '#c4a96e',
                              letterSpacing: '0.08em',
                            }}
                          >
                            {'TYPE > '}{spreadKey}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: '#e4e0d8',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {spread.name.toUpperCase()}
                          <Box
                            component="span"
                            sx={{
                              fontFamily: 'var(--font-noto-sans-tc)',
                              fontSize: '0.75rem',
                              color: '#888078',
                              ml: 1,
                            }}
                          >
                            {spread.nameZh}
                          </Box>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6rem',
                            color: '#3a3a3e',
                            letterSpacing: '0.06em',
                          }}
                        >
                          {reading.cards.length}c
                        </Typography>
                        <Box
                          component="button"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: '#3a3a3e',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            p: 0,
                            lineHeight: 1,
                            '&:hover': { color: '#888078' },
                          }}
                        >
                          ×
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.55rem',
                            color: '#3a3a3e',
                            userSelect: 'none',
                          }}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Expanded card details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box sx={{ borderTop: '1px solid #1a1a1d', bgcolor: 'background.paper' }}>
                            {reading.cards.map((cardData, cardIndex) => {
                              const card = tarotCards.find(c => c.id === cardData.cardId);
                              if (!card) return null;
                              const meaning = cardData.isReversed ? card.reversed : card.upright;

                              return (
                                <Box
                                  key={cardIndex}
                                  sx={{
                                    px: 2,
                                    py: 1.5,
                                    borderBottom:
                                      cardIndex < reading.cards.length - 1
                                        ? '1px solid #1a1a1d'
                                        : 'none',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
                                    <Typography
                                      sx={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.6rem',
                                        color: '#606068',
                                        letterSpacing: '0.08em',
                                      }}
                                    >
                                      {'POS > '}{cardData.position.toUpperCase().replace(/\s+/g, '_')}
                                    </Typography>
                                    {cardData.isReversed && (
                                      <Typography
                                        sx={{
                                          fontFamily: 'var(--font-mono)',
                                          fontSize: '0.6rem',
                                          color: '#888078',
                                          letterSpacing: '0.08em',
                                        }}
                                      >
                                        REVERSED 逆位
                                      </Typography>
                                    )}
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.75rem',
                                      color: '#e4e0d8',
                                      letterSpacing: '0.06em',
                                      mb: 0.5,
                                    }}
                                  >
                                    {card.name.toUpperCase()} · {card.nameZh}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: '#888078', lineHeight: 1.7, fontSize: '0.8rem' }}
                                  >
                                    {meaning.meaning}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Delete confirmation dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: 'background.default',
              border: '1px solid #252528',
              borderRadius: 0,
              boxShadow: 'none',
            },
          }}
        >
          <DialogContent sx={{ p: 3 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: '#606068',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            >
              {deleteTarget === 'all' ? 'CONFIRM > CLEAR_ALL' : 'CONFIRM > DELETE_ENTRY'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#e4e0d8', mb: 1 }}>
              {deleteTarget === 'all'
                ? 'This will permanently delete all your saved readings.'
                : 'This will permanently delete this reading.'}
            </Typography>
            <Typography
              sx={{ fontFamily: 'var(--font-noto-sans-tc)', fontSize: '0.875rem', color: '#888078' }}
            >
              {deleteTarget === 'all'
                ? '這將永久刪除您所有保存的占卜記錄。'
                : '這將永久刪除此占卜記錄。'}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                borderRadius: 0,
                border: '1px solid #252528',
                color: '#888078',
                '&:hover': { border: '1px solid #c4a96e', color: '#c4a96e', bgcolor: 'transparent' },
              }}
            >
              CANCEL
            </Button>
            <Button
              onClick={confirmDelete}
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                borderRadius: 0,
                bgcolor: '#252528',
                color: '#e4e0d8',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#3a3a3e', boxShadow: 'none' },
              }}
            >
              DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
}
