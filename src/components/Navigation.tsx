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

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

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
        backgroundColor: '#0d0d0f',
        borderLeft: '1px solid #252528',
        pt: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ px: 3, pb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            color: '#e4e0d8',
          }}
        >
          DOG_TAROT
        </Typography>
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
                borderBottom: '1px solid #1a1a1d',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: '#131316',
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: '#2e2e34',
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
                  color: isActive ? '#c4a96e' : '#e4e0d8',
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
          backgroundColor: '#0d0d0f',
          borderBottom: '1px solid #252528',
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
                color: '#e4e0d8',
              }}
            >
              DOG_TAROT
            </Typography>
          </Link>

          <IconButton
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              color: '#606068',
              display: { xs: 'inline-flex', md: 'none' },
              borderRadius: 0,
              '&:hover': {
                color: '#e4e0d8',
                backgroundColor: 'transparent',
              },
            }}
          >
            ☰
          </IconButton>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
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
                      color: '#e4e0d8',
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
                      color: isActive ? '#e4e0d8' : '#606068',
                      transition: 'color 0.15s',
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
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
