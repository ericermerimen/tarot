'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useColorMode } from '@/theme/ColorModeContext';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useCurrentLocale } from '@/hooks/useCurrentLocale';
import { routing, type Locale } from '@/i18n/routing';

interface NavItem {
  labelKey: string;
  path: string;
}

const navItems: NavItem[] = [
  { labelKey: 'home', path: '/' },
  { labelKey: 'daily', path: '/daily' },
  { labelKey: 'reading', path: '/reading' },
  { labelKey: 'gallery', path: '/gallery' },
  { labelKey: 'journal', path: '/journal' },
];

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  zhTW: '中文',
  ja: '日本語',
};

interface ThemeToggleProps {
  isDark: boolean;
  border: string;
  textMuted: string;
  onToggle: () => void;
  label: string;
}

function ThemeToggle({ isDark, border, textMuted, onToggle, label }: ThemeToggleProps) {
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
        '&:hover': { color: '#c4a96e', borderColor: '#c4a96e' },
      }}
    >
      {label}
    </Box>
  );
}

function LocaleSwitcher({ border, textMuted }: { border: string; textMuted: string }) {
  const locale = useCurrentLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {routing.locales.map((loc) => (
        <Box
          key={loc}
          component="button"
          onClick={() => handleSwitch(loc)}
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.06em',
            color: locale === loc ? '#c4a96e' : textMuted,
            background: 'none',
            border: `1px solid ${locale === loc ? '#c4a96e' : border}`,
            cursor: locale === loc ? 'default' : 'pointer',
            px: 0.75,
            py: 0.3,
            lineHeight: 1.4,
            '&:hover': locale !== loc ? { color: '#c4a96e', borderColor: '#c4a96e' } : {},
          }}
        >
          {localeLabels[loc]}
        </Box>
      ))}
    </Box>
  );
}

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { mode, toggleMode } = useColorMode();
  const t = useTranslations('nav');

  const isDark = mode === 'dark';
  const bg = isDark ? '#0d0d0f' : '#f0ede8';
  const border = isDark ? '#252528' : '#d8d5d0';
  const textPrimary = isDark ? '#e4e0d8' : '#1a1816';
  const textMuted = isDark ? '#606068' : '#888078';
  const textDim = isDark ? '#2e2e34' : '#b0aa9e';
  const rowBorder = isDark ? '#1a1a1d' : '#d8d5d0';
  const hoverBg = isDark ? '#131316' : '#e8e5e0';

  const themeLabel = isDark ? t('light') : t('dark');

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{ width: 280, height: '100%', backgroundColor: bg, borderLeft: `1px solid ${border}`, pt: 2 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ px: 3, pb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#c4a96e', flexShrink: 0 }} />
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: textPrimary }}>
            {t('brand')}
          </Typography>
        </Box>
        <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', gap: 0.5 }}>
          <ThemeToggle isDark={isDark} border={border} textMuted={textMuted} onToggle={toggleMode} label={themeLabel} />
        </Box>
      </Box>
      {/* Locale switcher in drawer */}
      <Box sx={{ px: 3, pb: 2 }} onClick={(e) => e.stopPropagation()}>
        <LocaleSwitcher border={border} textMuted={textMuted} />
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
                display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 1.5,
                borderBottom: `1px solid ${rowBorder}`, textDecoration: 'none',
                '&:hover': { backgroundColor: hoverBg },
              }}
            >
              <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: textDim, flexShrink: 0, userSelect: 'none' }}>
                {idx}
              </Typography>
              <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', color: isActive ? '#c4a96e' : textPrimary, textTransform: 'uppercase' }}>
                {t(item.labelKey)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" elevation={0}
        sx={{ backgroundColor: bg, borderBottom: `1px solid ${border}`, boxShadow: 'none', backgroundImage: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#c4a96e', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.15em', color: textPrimary }}>
              {t('brand')}
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
                    textDecoration: 'none', position: 'relative', pb: 0.25,
                    '&::after': isActive ? { content: '""', position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', backgroundColor: '#c4a96e' } : {},
                    '&:hover .nav-label': { color: textPrimary },
                  }}
                >
                  <Typography className="nav-label"
                    sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: isActive ? textPrimary : textMuted, transition: 'color 0.15s' }}>
                    {t(item.labelKey)}
                  </Typography>
                </Box>
              );
            })}
            <LocaleSwitcher border={border} textMuted={textMuted} />
            <ThemeToggle isDark={isDark} border={border} textMuted={textMuted} onToggle={toggleMode} label={themeLabel} />
          </Box>

          <IconButton
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ color: textMuted, display: { xs: 'inline-flex', md: 'none' }, borderRadius: 0, '&:hover': { color: textPrimary, backgroundColor: 'transparent' } }}
          >
            ☰
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}
        PaperProps={{ sx: { backgroundColor: 'transparent', boxShadow: 'none' } }}>
        {drawer}
      </Drawer>
    </>
  );
}
