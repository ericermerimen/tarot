'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            Reading Journal
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mb: 2 }}
          >
            占卜日記
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review your past readings and reflect on your journey
            <br />
            回顧過去的占卜，反思您的旅程
          </Typography>
        </Box>

        {readings.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteSweepIcon />}
              onClick={handleClearAll}
            >
              Clear All 清除全部
            </Button>
          </Box>
        )}

        {readings.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(20, 10, 40, 0.6)',
              border: '1px solid rgba(156, 124, 244, 0.2)',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No readings yet 還沒有占卜記錄
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your saved readings will appear here
              <br />
              您保存的占卜記錄將顯示在這裡
            </Typography>
            <Button
              variant="contained"
              href="/reading"
              sx={{ mt: 3 }}
            >
              Start a Reading 開始占卜
            </Button>
          </Paper>
        ) : (
          <AnimatePresence>
            {readings.map((reading, index) => {
              const { date, time } = formatDate(reading.date);
              const spread = spreadTypes[reading.spread as SpreadKey] || spreadTypes.single;
              const isExpanded = expandedReading === index;

              return (
                <motion.div
                  key={reading.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Paper
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      background: 'rgba(20, 10, 40, 0.7)',
                      border: '1px solid rgba(156, 124, 244, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: '1px solid rgba(156, 124, 244, 0.4)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleExpand(index)}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Cinzel', color: 'secondary.main' }}>
                          {spread.name} · {spread.nameZh}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {date} at {time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`${reading.cards.length} cards`}
                          size="small"
                          sx={{
                            background: 'rgba(156, 124, 244, 0.2)',
                            color: 'primary.light',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(index);
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'text.secondary' }}>
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </Box>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Divider sx={{ borderColor: 'rgba(156, 124, 244, 0.2)' }} />
                          <Box sx={{ p: 2 }}>
                            {reading.cards.map((cardData, cardIndex) => {
                              const card = tarotCards.find(c => c.id === cardData.cardId);
                              if (!card) return null;

                              const meaning = cardData.isReversed ? card.reversed : card.upright;

                              return (
                                <Box
                                  key={cardIndex}
                                  sx={{
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    background: 'rgba(156, 124, 244, 0.1)',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Chip
                                      label={`${cardData.position} · ${cardData.positionZh}`}
                                      size="small"
                                      sx={{
                                        background: 'rgba(244, 207, 124, 0.2)',
                                        color: 'secondary.main',
                                      }}
                                    />
                                    {cardData.isReversed && (
                                      <Chip
                                        label="Reversed 逆位"
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                  <Typography variant="subtitle2" sx={{ fontFamily: 'Cinzel', color: 'primary.light' }}>
                                    {card.name} · {card.nameZh}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {meaning.meaning}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Paper>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              background: 'rgba(20, 10, 40, 0.95)',
              border: '1px solid rgba(156, 124, 244, 0.3)',
            },
          }}
        >
          <DialogTitle>
            {deleteTarget === 'all' ? 'Clear All Readings?' : 'Delete Reading?'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {deleteTarget === 'all'
                ? 'This will permanently delete all your saved readings. This action cannot be undone.'
                : 'This will permanently delete this reading. This action cannot be undone.'}
            </Typography>
            <Typography sx={{ fontFamily: 'Noto Sans TC', mt: 1, color: 'text.secondary' }}>
              {deleteTarget === 'all'
                ? '這將永久刪除您所有保存的占卜記錄。此操作無法撤銷。'
                : '這將永久刪除此占卜記錄。此操作無法撤銷。'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel 取消
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete 刪除
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
}
