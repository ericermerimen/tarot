'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import ReadingView, { spreadSlugMap } from '@/components/ReadingView';
import { Link } from '@/i18n/navigation';

function SpreadReadingContent() {
  const params = useParams<{ spread: string }>();
  const t = useTranslations('reading');
  const slug = params.spread;
  const spreadKey = spreadSlugMap[slug];

  if (!spreadKey) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'text.secondary', letterSpacing: '0.1em', mb: 2 }}>
          {t('spreadNotFound')}
        </Typography>
        <Typography
          component={Link}
          href="/reading"
          sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'primary.main', letterSpacing: '0.08em', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          {t('backToSpreads')}
        </Typography>
      </Container>
    );
  }

  return <ReadingView spreadKey={spreadKey} />;
}

export default function SpreadReadingPage() {
  const t = useTranslations('reading');
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'secondary.dark', letterSpacing: '0.1em' }}>
          {t('loading')}
        </Typography>
      </Container>
    }>
      <SpreadReadingContent />
    </Suspense>
  );
}
