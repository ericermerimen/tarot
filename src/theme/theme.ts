'use client';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    mystical: {
      purple: string;
      gold: string;
      pink: string;
      blue: string;
      dark: string;
      glow: string;
    };
  }
  interface PaletteOptions {
    mystical?: {
      purple?: string;
      gold?: string;
      pink?: string;
      blue?: string;
      dark?: string;
      glow?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c7cf4',
      light: '#c4a8ff',
      dark: '#6b4bc1',
    },
    secondary: {
      main: '#f4cf7c',
      light: '#ffe4a8',
      dark: '#c19b4c',
    },
    background: {
      default: '#0a0612',
      paper: 'rgba(20, 10, 40, 0.85)',
    },
    text: {
      primary: '#f0e6ff',
      secondary: '#b8a8d4',
    },
    mystical: {
      purple: '#9c7cf4',
      gold: '#f4cf7c',
      pink: '#f47cc4',
      blue: '#7cb8f4',
      dark: '#1a0a2e',
      glow: 'rgba(156, 124, 244, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Noto Sans TC", serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '0.1em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '0.08em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Noto Sans TC", "Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Noto Sans TC", "Roboto", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
          fontSize: '1rem',
        },
        contained: {
          background: 'linear-gradient(135deg, #9c7cf4 0%, #7c5ce0 100%)',
          boxShadow: '0 4px 20px rgba(156, 124, 244, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #b090ff 0%, #9070f0 100%)',
            boxShadow: '0 6px 30px rgba(156, 124, 244, 0.6)',
          },
        },
        outlined: {
          borderColor: '#9c7cf4',
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(156, 124, 244, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(20, 10, 40, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(156, 124, 244, 0.2)',
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
