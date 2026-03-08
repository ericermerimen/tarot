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
import InsightsPanel from '@/components/InsightsPanel';

export default function Journal() {
  const [readings, setReadings] = useState<ReadingRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('tarotHistory');
    return stored ? JSON.parse(stored) : [];
  });
  const [expandedReading, setExpandedReading] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | 'all' | null>(null);
  const [editingReflection, setEditingReflection] = useState<number | null>(null);
  const [reflectionDraft, setReflectionDraft] = useState('');

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

  const saveReflection = (index: number) => {
    const updated = readings.map((r, i) =>
      i === index ? { ...r, reflection: reflectionDraft.trim() || undefined } : r
    );
    setReadings(updated);
    localStorage.setItem('tarotHistory', JSON.stringify(updated));
    setEditingReflection(null);
  };

  const startEditReflection = (index: number, current?: string) => {
    setReflectionDraft(current ?? '');
    setEditingReflection(index);
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
        <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0 }} />
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  color: 'secondary.dark',
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
                  color: 'secondary.dark',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  p: 0,
                  '&:hover': { color: 'text.primary' },
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
              color: 'text.primary',
              mb: 0.25,
            }}
          >
            Reading Journal
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-noto-sans-tc)',
              fontSize: '0.95rem',
              color: 'secondary.dark',
              mb: 0.75,
            }}
          >
            占卜日記
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'secondary.dark',
              letterSpacing: '0.06em',
            }}
          >
            {readings.length} {readings.length === 1 ? 'ENTRY' : 'ENTRIES'} · 回顧您的占卜記錄
          </Typography>
        </Box>

        <InsightsPanel readings={readings} />

        {readings.length === 0 ? (
          /* Empty state */
          <Box
            sx={{
              p: 6,
              textAlign: 'center',
              border: '1px solid', borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: 'secondary.dark',
                mb: 2,
              }}
            >
              LOG_EMPTY — NO ENTRIES
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-noto-sans-tc)',
                fontSize: '0.875rem',
                color: 'text.secondary',
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
                bgcolor: 'primary.main',
                color: 'background.default',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
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
                      borderBottom: '1px solid', borderBottomColor: 'divider',
                      '&:first-of-type': { borderTop: '1px solid', borderTopColor: 'divider' },
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
                              color: 'secondary.dark',
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
                              color: 'primary.main',
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
                            color: 'text.primary',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {spread.name.toUpperCase()}
                          <Box
                            component="span"
                            sx={{
                              fontFamily: 'var(--font-noto-sans-tc)',
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                              ml: 1,
                            }}
                          >
                            {spread.nameZh}
                          </Box>
                        </Typography>
                        {reading.intention && (
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.6rem',
                              color: 'secondary.dark',
                              letterSpacing: '0.08em',
                            }}
                          >
                            {'INTENT > '}{reading.intention.tag.toUpperCase()}
                            {reading.intention.note && (
                              <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                                · {reading.intention.note}
                              </Box>
                            )}
                          </Typography>
                        )}
                        {!isExpanded && reading.reflection && (
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.6rem',
                              color: 'text.secondary',
                              letterSpacing: '0.04em',
                              mt: 0.25,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '60ch',
                            }}
                          >
                            {reading.reflection.slice(0, 80)}{reading.reflection.length > 80 ? '…' : ''}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6rem',
                            color: 'secondary.dark',
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
                            color: 'secondary.dark',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            p: 0,
                            lineHeight: 1,
                            '&:hover': { color: 'text.secondary' },
                          }}
                        >
                          ×
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.55rem',
                            color: 'secondary.dark',
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
                          <Box sx={{ borderTop: '1px solid', borderTopColor: 'divider', bgcolor: 'background.paper' }}>

                            {/* Reading summary */}
                            {reading.summary && (
                              <Box
                                sx={{
                                  px: 2,
                                  py: 2,
                                  borderBottom: '1px solid',
                                  borderBottomColor: 'divider',
                                  bgcolor: 'background.default',
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.55rem',
                                    color: 'primary.main',
                                    letterSpacing: '0.12em',
                                    mb: 1.5,
                                  }}
                                >
                                  READING_RESULT · 占卜結果
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'text.primary',
                                    lineHeight: 1.8,
                                    fontSize: '0.82rem',
                                    whiteSpace: 'pre-line',
                                    mb: 1.5,
                                  }}
                                >
                                  {reading.summary.text}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: 'var(--font-noto-sans-tc)',
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                    fontSize: '0.8rem',
                                    whiteSpace: 'pre-line',
                                  }}
                                >
                                  {reading.summary.textZh}
                                </Typography>
                              </Box>
                            )}

                            {/* Per-card breakdown */}
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
                                    borderBottom: cardIndex < reading.cards.length - 1 ? '1px solid' : 'none',
                                    borderBottomColor: 'divider',
                                  }}
                                >
                                  {/* Position + orientation */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
                                    <Typography
                                      sx={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.6rem',
                                        color: 'secondary.dark',
                                        letterSpacing: '0.08em',
                                      }}
                                    >
                                      {'POS > '}{cardData.position.toUpperCase().replace(/\s+/g, '_')}
                                      {cardData.positionZh && (
                                        <Box component="span" sx={{ fontFamily: 'var(--font-noto-sans-tc)', ml: 0.75 }}>
                                          {cardData.positionZh}
                                        </Box>
                                      )}
                                    </Typography>
                                    {cardData.isReversed && (
                                      <Typography
                                        sx={{
                                          fontFamily: 'var(--font-mono)',
                                          fontSize: '0.6rem',
                                          color: 'text.secondary',
                                          letterSpacing: '0.08em',
                                        }}
                                      >
                                        REVERSED 逆位
                                      </Typography>
                                    )}
                                  </Box>

                                  {/* Card name */}
                                  <Typography
                                    sx={{
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.75rem',
                                      color: 'text.primary',
                                      letterSpacing: '0.06em',
                                      mb: 0.75,
                                    }}
                                  >
                                    {card.name.toUpperCase()} · {card.nameZh}
                                  </Typography>

                                  {/* Meaning EN + ZH */}
                                  <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', lineHeight: 1.7, fontSize: '0.8rem', mb: 0.5 }}
                                  >
                                    {meaning.meaning}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontFamily: 'var(--font-noto-sans-tc)',
                                      fontSize: '0.78rem',
                                      color: 'text.secondary',
                                      lineHeight: 1.7,
                                      mb: 1,
                                    }}
                                  >
                                    {meaning.meaningZh}
                                  </Typography>

                                  {/* Keywords */}
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {card.keywords.map((kw, ki) => (
                                      <Box
                                        key={ki}
                                        sx={{
                                          px: 0.75,
                                          py: 0.2,
                                          border: '1px solid',
                                          borderColor: 'divider',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.55rem',
                                            color: 'secondary.dark',
                                            letterSpacing: '0.04em',
                                          }}
                                        >
                                          {kw}
                                          {card.keywordsZh?.[ki] && (
                                            <Box component="span" sx={{ fontFamily: 'var(--font-noto-sans-tc)', ml: 0.5 }}>
                                              {card.keywordsZh[ki]}
                                            </Box>
                                          )}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                              );
                            })}

                            {/* Reflection */}
                            <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderTopColor: 'divider' }}>
                              <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
                                REFLECTION · 反思
                              </Typography>
                              {editingReflection === index ? (
                                <Box>
                                  <Box
                                    component="textarea"
                                    value={reflectionDraft}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReflectionDraft(e.target.value)}
                                    placeholder="Write your reflection... 寫下你的反思..."
                                    rows={3}
                                    autoFocus
                                    sx={{
                                      width: '100%',
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.7rem',
                                      color: 'text.primary',
                                      bgcolor: 'background.default',
                                      border: '1px solid',
                                      borderColor: 'primary.main',
                                      p: 1,
                                      resize: 'vertical',
                                      outline: 'none',
                                      display: 'block',
                                      mb: 1,
                                      '&::placeholder': { color: 'secondary.dark' },
                                    }}
                                  />
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Box
                                      component="button"
                                      onClick={() => saveReflection(index)}
                                      sx={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em',
                                        color: 'primary.main', cursor: 'pointer', background: 'none', border: 'none', p: 0,
                                        '&:hover': { color: 'text.primary' },
                                      }}
                                    >
                                      SAVE
                                    </Box>
                                    <Box
                                      component="button"
                                      onClick={() => setEditingReflection(null)}
                                      sx={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em',
                                        color: 'secondary.dark', cursor: 'pointer', background: 'none', border: 'none', p: 0,
                                        '&:hover': { color: 'text.secondary' },
                                      }}
                                    >
                                      CANCEL
                                    </Box>
                                  </Box>
                                </Box>
                              ) : (
                                <Box
                                  onClick={() => startEditReflection(index, reading.reflection)}
                                  sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                >
                                  {reading.reflection ? (
                                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.7 }}>
                                      {reading.reflection}
                                    </Typography>
                                  ) : (
                                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', fontStyle: 'italic' }}>
                                      + ADD REFLECTION · 新增反思
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </Box>
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
              border: '1px solid', borderColor: 'divider',
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
                color: 'secondary.dark',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            >
              {deleteTarget === 'all' ? 'CONFIRM > CLEAR_ALL' : 'CONFIRM > DELETE_ENTRY'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
              {deleteTarget === 'all'
                ? 'This will permanently delete all your saved readings.'
                : 'This will permanently delete this reading.'}
            </Typography>
            <Typography
              sx={{ fontFamily: 'var(--font-noto-sans-tc)', fontSize: '0.875rem', color: 'text.secondary' }}
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
                border: '1px solid', borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { border: '1px solid', borderColor: 'primary.main', color: 'primary.main', bgcolor: 'transparent' },
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
                bgcolor: 'divider',
                color: 'text.primary',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'secondary.dark', color: 'text.primary', boxShadow: 'none' },
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
