'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    mystical: {
      gold: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    mystical?: {
      gold?: string;
      dark?: string;
    };
  }
}

export function createAppTheme(mode: 'dark' | 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#c4a96e',
        light: '#d4b97e',
        dark: '#a48950',
      },
      secondary: {
        main: '#888078',
        light: '#b0aa9e',
        dark: '#606068',
      },
      background: {
        default: isDark ? '#0d0d0f' : '#f0ede8',
        paper: isDark ? '#131316' : '#e8e5e0',
      },
      text: {
        primary: isDark ? '#e4e0d8' : '#1a1816',
        secondary: '#888078',
      },
      divider: isDark ? '#252528' : '#c8c5c0',
      mystical: {
        gold: '#c4a96e',
        dark: isDark ? '#0d0d0f' : '#f0ede8',
      },
    },
    typography: {
      fontFamily: 'var(--font-mono), "Space Mono", monospace',
      h1: {
        fontFamily: 'var(--font-display), "Cormorant Garamond", serif',
        fontWeight: 300,
        letterSpacing: '0.02em',
      },
      h2: {
        fontFamily: 'var(--font-display), "Cormorant Garamond", serif',
        fontWeight: 400,
        letterSpacing: '0.02em',
      },
      h3: {
        fontFamily: 'var(--font-display), "Cormorant Garamond", serif',
        fontWeight: 400,
        letterSpacing: '0.02em',
      },
      h4: {
        fontFamily: 'var(--font-mono), "Space Mono", monospace',
        fontWeight: 700,
        letterSpacing: '0.08em',
      },
      h5: {
        fontFamily: 'var(--font-mono), "Space Mono", monospace',
        fontWeight: 700,
        letterSpacing: '0.08em',
      },
      h6: {
        fontFamily: 'var(--font-mono), "Space Mono", monospace',
        fontWeight: 700,
        letterSpacing: '0.08em',
      },
      body1: {
        fontFamily: 'var(--font-noto-sans-tc), "Noto Sans TC", sans-serif',
      },
      body2: {
        fontFamily: 'var(--font-noto-sans-tc), "Noto Sans TC", sans-serif',
      },
      caption: {
        fontFamily: 'var(--font-mono), "Space Mono", monospace',
      },
      button: {
        fontFamily: 'var(--font-mono), "Space Mono", monospace',
      },
      overline: {
        fontFamily: 'var(--font-mono), "Space Mono", monospace',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            textTransform: 'uppercase',
            fontWeight: 700,
            padding: '10px 28px',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            backgroundColor: '#c4a96e',
            color: '#0d0d0f',
            '&:hover': {
              backgroundColor: '#d4b97e',
            },
          },
          outlined: {
            borderColor: isDark ? '#252528' : '#c8c5c0',
            borderWidth: 1,
            color: isDark ? '#e4e0d8' : '#1a1816',
            '&:hover': {
              borderWidth: 1,
              borderColor: '#c4a96e',
              color: '#c4a96e',
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            background: isDark ? '#131316' : '#e8e5e0',
            border: `1px solid ${isDark ? '#252528' : '#c8c5c0'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}

// Default dark theme export for backwards compatibility
export default createAppTheme('dark');
