'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslations } from 'next-intl';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('error');
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ p: 4, background: 'rgba(20, 10, 40, 0.9)', borderRadius: 3, border: '1px solid rgba(196, 169, 110, 0.3)' }}>
        <Typography variant="h4" sx={{ fontFamily: 'Cormorant Garamond', mb: 2, background: 'linear-gradient(135deg, #c4a96e 0%, #e8d5a3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('description')}
        </Typography>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={() => reset()}>
          {t('tryAgain')}
        </Button>
      </Box>
    </Container>
  );
}
