'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StyleIcon from '@mui/icons-material/Style';
import CollectionsIcon from '@mui/icons-material/Collections';
import BookIcon from '@mui/icons-material/Book';

const navItems = [
  { label: 'Home', labelZh: '首頁', path: '/', icon: <HomeIcon /> },
  { label: 'Daily Card', labelZh: '每日一牌', path: '/daily', icon: <AutoAwesomeIcon /> },
  { label: 'Reading', labelZh: '占卜', path: '/reading', icon: <StyleIcon /> },
  { label: 'Gallery', labelZh: '牌卡圖鑑', path: '/gallery', icon: <CollectionsIcon /> },
  { label: 'Journal', labelZh: '占卜日記', path: '/journal', icon: <BookIcon /> },
];

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        background: 'linear-gradient(180deg, #1a0a2e 0%, #0a0612 100%)',
        pt: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ px: 3, pb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Cinzel',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🐕 Dog Tarot
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              selected={pathname === item.path}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  background: 'rgba(156, 124, 244, 0.2)',
                  '&:hover': {
                    background: 'rgba(156, 124, 244, 0.3)',
                  },
                },
                '&:hover': {
                  background: 'rgba(156, 124, 244, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.labelZh}
                primaryTypographyProps={{ fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '0.75rem', color: 'text.secondary' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(10, 6, 18, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(156, 124, 244, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Cinzel',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🐕 Mystical Dog Tarot
            </Typography>
          </Link>

          {isMobile ? (
            <IconButton
              color="primary"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: 'primary.light' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  href={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: pathname === item.path ? 'primary.main' : 'text.secondary',
                    fontWeight: pathname === item.path ? 600 : 400,
                    '&:hover': {
                      color: 'primary.light',
                      background: 'rgba(156, 124, 244, 0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            background: 'transparent',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
