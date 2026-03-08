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

const theme = createTheme({
  palette: {
    mode: 'dark',
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
      default: '#0d0d0f',
      paper: '#131316',
    },
    text: {
      primary: '#e4e0d8',
      secondary: '#888078',
    },
    divider: '#252528',
    mystical: {
      gold: '#c4a96e',
      dark: '#0d0d0f',
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
          borderColor: '#252528',
          borderWidth: 1,
          color: '#e4e0d8',
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
          background: '#131316',
          border: '1px solid #252528',
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

export default theme;
