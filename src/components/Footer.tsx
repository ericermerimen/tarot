'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useColorMode } from '@/theme/ColorModeContext';

export default function Footer() {
  const { mode } = useColorMode();
  const t = useTranslations('footer');
  const isDark = mode === 'dark';

  const bg = isDark ? '#0d0d0f' : '#f0ede8';
  const border = isDark ? '#252528' : '#d8d5d0';
  const textDim = isDark ? '#2e2e34' : '#c0bbb4';

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: bg,
        borderTop: `1px solid ${border}`,
        px: { xs: 2, sm: 4 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.08em',
          color: textDim,
        }}
      >
        {t('copyright', { year: new Date().getFullYear() })}
      </Typography>

      <Box
        component="a"
        href="https://github.com/ericermerimen"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: textDim,
          transition: 'color 0.15s',
          '&:hover': { color: '#c4a96e' },
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 24 24"
          sx={{ width: 13, height: 13, fill: 'currentColor' }}
        >
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </Box>
      </Box>
    </Box>
  );
}
