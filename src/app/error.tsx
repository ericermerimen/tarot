'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Box
        sx={{
          p: 4,
          background: 'rgba(20, 10, 40, 0.9)',
          borderRadius: 3,
          border: '1px solid rgba(156, 124, 244, 0.3)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Cinzel',
            mb: 2,
            background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The mystical energies got a little tangled. Let&apos;s try again.
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => reset()}
        >
          Try Again
        </Button>
      </Box>
    </Container>
  );
}
