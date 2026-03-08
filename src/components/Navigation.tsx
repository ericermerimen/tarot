'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  Typography,
} from '@mui/material';
import { useColorMode } from '@/theme/ColorModeContext';

interface NavItem {
  label: string;
  labelZh: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Home', labelZh: '首頁', path: '/' },
  { label: 'Daily Card', labelZh: '每日一牌', path: '/daily' },
  { label: 'Reading', labelZh: '占卜', path: '/reading' },
  { label: 'Gallery', labelZh: '牌卡圖鑑', path: '/gallery' },
  { label: 'Journal', labelZh: '占卜日記', path: '/journal' },
];

interface ThemeToggleProps {
  isDark: boolean;
  border: string;
  textMuted: string;
  onToggle: () => void;
}

function ThemeToggle({ isDark, border, textMuted, onToggle }: ThemeToggleProps) {
  return (
    <Box
      component="button"
      onClick={onToggle}
      sx={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        color: textMuted,
        background: 'none',
        border: `1px solid ${border}`,
        cursor: 'pointer',
        px: 1,
        py: 0.5,
        lineHeight: 1.4,
        '&:hover': {
          color: '#c4a96e',
          borderColor: '#c4a96e',
        },
      }}
    >
      {isDark ? 'LIGHT' : 'DARK'}
    </Box>
  );
}

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { mode, toggleMode } = useColorMode();

  const isDark = mode === 'dark';
  const bg = isDark ? '#0d0d0f' : '#f0ede8';
  const border = isDark ? '#252528' : '#c8c5c0';
  const textPrimary = isDark ? '#e4e0d8' : '#1a1816';
  const textMuted = isDark ? '#606068' : '#888078';
  const textDim = isDark ? '#2e2e34' : '#b0aa9e';
  const rowBorder = isDark ? '#1a1a1d' : '#d8d5d0';
  const hoverBg = isDark ? '#131316' : '#e8e5e0';

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        backgroundColor: bg,
        borderLeft: `1px solid ${border}`,
        pt: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ px: 3, pb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#c4a96e',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: textPrimary,
            }}
          >
            DOG_TAROT
          </Typography>
        </Box>
        <Box onClick={(e) => e.stopPropagation()}>
          <ThemeToggle isDark={isDark} border={border} textMuted={textMuted} onToggle={toggleMode} />
        </Box>
      </Box>
      <Box>
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const idx = String(index + 1).padStart(2, '0');
          return (
            <Box
              key={item.path}
              component={Link}
              href={item.path}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 3,
                py: 1.5,
                borderBottom: `1px solid ${rowBorder}`,
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: hoverBg,
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: textDim,
                  flexShrink: 0,
                  userSelect: 'none',
                }}
              >
                {idx}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  color: isActive ? '#c4a96e' : textPrimary,
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: bg,
          borderBottom: `1px solid ${border}`,
          boxShadow: 'none',
          backgroundImage: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#c4a96e',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: textPrimary,
              }}
            >
              DOG_TAROT
            </Typography>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Box
                  key={item.path}
                  component={Link}
                  href={item.path}
                  sx={{
                    textDecoration: 'none',
                    position: 'relative',
                    pb: 0.25,
                    '&::after': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '1px',
                          backgroundColor: '#c4a96e',
                        }
                      : {},
                    '&:hover .nav-label': {
                      color: textPrimary,
                    },
                  }}
                >
                  <Typography
                    className="nav-label"
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? textPrimary : textMuted,
                      transition: 'color 0.15s',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
            <ThemeToggle isDark={isDark} border={border} textMuted={textMuted} onToggle={toggleMode} />
          </Box>

          <IconButton
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              color: textMuted,
              display: { xs: 'inline-flex', md: 'none' },
              borderRadius: 0,
              '&:hover': {
                color: textPrimary,
                backgroundColor: 'transparent',
              },
            }}
          >
            ☰
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
