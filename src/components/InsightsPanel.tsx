'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { tarotCards } from '@/data/tarotCards';
import { computeStreak, topCard, topCardByTag, reversalRate } from '@/lib/journalStats';
import type { ReadingRecord, IntentionTag } from '@/types/reading';

const TAGS: IntentionTag[] = ['career', 'love', 'self', 'finance', 'health', 'general'];

const TAG_LABELS: Record<IntentionTag, string> = {
  career: 'CAREER',
  love: 'LOVE',
  self: 'SELF',
  finance: 'FINANCE',
  health: 'HEALTH',
  general: 'GENERAL',
};

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.75, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.08em' }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'text.primary', letterSpacing: '0.04em' }}>
        {value}
      </Typography>
    </Box>
  );
}

interface InsightsPanelProps {
  readings: ReadingRecord[];
}

export default function InsightsPanel({ readings }: InsightsPanelProps) {
  if (readings.length < 3) return null;

  const streak = computeStreak(readings);
  const topCardId = topCard(readings);
  const topCardData = topCardId !== null ? tarotCards.find((c) => c.id === topCardId) : null;
  const rate = reversalRate(readings);

  // This month's top card
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthReadings = readings.filter((r) => r.date.startsWith(thisMonth));
  const monthTopId = topCard(monthReadings);
  const monthTopCard = monthTopId !== null ? tarotCards.find((c) => c.id === monthTopId) : null;

  // Per-tag insights (only tags with >= 2 readings)
  const tagInsights: { tag: IntentionTag; cardName: string; cardNameZh: string }[] = [];
  for (const tag of TAGS) {
    const tagCount = readings.filter((r) => r.intention?.tag === tag).length;
    if (tagCount < 2) continue;
    const cardId = topCardByTag(readings, tag);
    if (cardId === null) continue;
    const card = tarotCards.find((c) => c.id === cardId);
    if (card) tagInsights.push({ tag, cardName: card.name, cardNameZh: card.nameZh });
  }

  return (
    <Box sx={{ mb: 4, p: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      {/* Panel header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'secondary.dark' }}>
          INSIGHTS
        </Typography>
      </Box>

      {/* Core stats */}
      {topCardData && (
        <StatRow
          label="TOP_CARD (all time)"
          value={`${topCardData.name.toUpperCase()} · ${topCardData.nameZh}`}
        />
      )}
      {monthTopCard && monthReadings.length >= 2 && (
        <StatRow
          label={`TOP_CARD (${thisMonth})`}
          value={`${monthTopCard.name.toUpperCase()} · ${monthTopCard.nameZh}`}
        />
      )}
      <StatRow label="STREAK" value={streak > 0 ? `${streak} DAY${streak === 1 ? '' : 'S'} · 連續 ${streak} 天` : 'NO_STREAK'} />
      <StatRow label="REVERSAL_RATE" value={`${rate}% reversed · ${rate}% 逆位`} />

      {/* Per-tag patterns */}
      {tagInsights.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
            PATTERNS_BY_INTENT ————————
          </Typography>
          {tagInsights.map(({ tag, cardName, cardNameZh }) => (
            <StatRow
              key={tag}
              label={`IN ${TAG_LABELS[tag]}`}
              value={`${cardName.toUpperCase()} · ${cardNameZh}`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
