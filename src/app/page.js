'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StyleIcon from '@mui/icons-material/Style';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CollectionsIcon from '@mui/icons-material/Collections';
import TarotCard from '@/components/TarotCard';
import { tarotCards } from '@/data/tarotCards';

const spreadOptions = [
  {
    id: 'single',
    title: 'Single Card',
    titleZh: '單牌占卜',
    description: 'Quick guidance',
    descriptionZh: '快速指引',
    icon: <AutoAwesomeIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
    color: '#9c7cf4',
  },
  {
    id: 'three-card',
    title: 'Three Card',
    titleZh: '三牌陣',
    description: 'Past · Present · Future',
    descriptionZh: '過去·現在·未來',
    icon: <StyleIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
    color: '#f4cf7c',
  },
  {
    id: 'love',
    title: 'Love Reading',
    titleZh: '愛情占卜',
    description: 'Matters of the heart',
    descriptionZh: '探索愛情',
    icon: <FavoriteIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
    color: '#f47cc4',
  },
  {
    id: 'celtic-cross',
    title: 'Celtic Cross',
    titleZh: '凱爾特十字',
    description: 'Deep 10-card reading',
    descriptionZh: '深度十牌占卜',
    icon: <SelfImprovementIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />,
    color: '#7cb8f4',
  },
];

export default function Home() {
  const featuredCards = [tarotCards[0], tarotCards[17], tarotCards[19]]; // Fool, Star, Sun

  return (
    <Box sx={{ minHeight: '100vh', pb: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Hero Section - Mobile Optimized */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pt: { xs: 2, sm: 4, md: 6 },
            pb: { xs: 3, md: 5 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                fontFamily: 'Cinzel',
                background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 50%, #f47cc4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Mystical Dog Tarot
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.75rem' },
                fontFamily: 'Noto Sans TC',
                color: 'text.secondary',
                mb: { xs: 2, md: 3 },
              }}
            >
              神秘狗狗塔羅占卜
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Typography
              variant="body1"
              sx={{
                maxWidth: { xs: '100%', sm: 500 },
                color: 'text.secondary',
                mb: { xs: 2, md: 3 },
                lineHeight: 1.7,
                fontSize: { xs: '0.9rem', sm: '1rem' },
                px: { xs: 1, sm: 0 },
              }}
            >
              Let adorable canine companions guide you through the mysteries of tarot.
              <br />
              讓可愛的狗狗夥伴引導您探索塔羅的奧秘
            </Typography>
          </motion.div>

          {/* CTA Buttons - Stack on Mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ width: '100%' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1.5, sm: 2 },
                justifyContent: 'center',
                alignItems: 'center',
                px: { xs: 2, sm: 0 },
              }}
            >
              <Button
                component={Link}
                href="/daily"
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon />}
                fullWidth
                sx={{
                  maxWidth: { xs: '100%', sm: 220 },
                  py: { xs: 1.5, sm: 1.5 },
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                }}
              >
                Daily Card 每日一牌
              </Button>
              <Button
                component={Link}
                href="/reading"
                variant="outlined"
                size="large"
                startIcon={<StyleIcon />}
                fullWidth
                sx={{
                  maxWidth: { xs: '100%', sm: 220 },
                  py: { xs: 1.5, sm: 1.5 },
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                }}
              >
                Start Reading 開始占卜
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* Featured Cards - Horizontal Scroll on Mobile */}
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 1.5, sm: 2, md: 4 },
                flexWrap: { xs: 'nowrap', md: 'wrap' },
                overflowX: { xs: 'auto', md: 'visible' },
                pb: { xs: 2, md: 0 },
                px: { xs: 1, sm: 0 },
                scrollSnapType: 'x mandatory',
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {featuredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                  style={{ flexShrink: 0, scrollSnapAlign: 'center' }}
                >
                  <TarotCard
                    card={card}
                    isFlipped={true}
                    size="small"
                    disabled
                  />
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* Reading Options - Mobile Grid */}
        <Box sx={{ py: { xs: 2, md: 4 } }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: 'Cinzel',
              mb: 0.5,
              color: 'primary.light',
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
            }}
          >
            Choose Your Reading
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              fontFamily: 'Noto Sans TC',
              mb: { xs: 3, md: 4 },
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            選擇您的占卜方式
          </Typography>

          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} justifyContent="center">
            {spreadOptions.map((spread, index) => (
              <Grid item xs={6} sm={6} md={3} key={spread.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(20, 10, 40, 0.7)',
                      border: `1px solid ${spread.color}33`,
                      borderRadius: { xs: 2, sm: 3 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: `1px solid ${spread.color}`,
                        boxShadow: `0 0 20px ${spread.color}30`,
                        transform: 'translateY(-3px)',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/reading?spread=${spread.id}`}
                      sx={{
                        height: '100%',
                        p: { xs: 1.5, sm: 2 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: { xs: '8px !important', sm: 2 } }}>
                        <Box sx={{ color: spread.color, mb: { xs: 1, sm: 1.5 } }}>
                          {spread.icon}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontFamily: 'Cinzel',
                            mb: 0.25,
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            fontWeight: 600,
                          }}
                        >
                          {spread.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'Noto Sans TC',
                            color: 'text.secondary',
                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                            mb: 0.5,
                          }}
                        >
                          {spread.titleZh}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            display: { xs: 'none', sm: 'block' },
                          }}
                        >
                          {spread.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Gallery Link */}
        <Box sx={{ py: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              component={Link}
              href="/gallery"
              variant="text"
              startIcon={<CollectionsIcon />}
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.light' },
              }}
            >
              Browse All 22 Cards 瀏覽全部牌卡
            </Button>
          </motion.div>
        </Box>

        {/* Footer info */}
        <Box sx={{ py: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              lineHeight: 1.6,
            }}
          >
            🐕 22 Major Arcana · Cute Dogs · Bilingual
            <br />
            <span style={{ fontFamily: 'Noto Sans TC' }}>
              22張大阿爾卡納 · 可愛狗狗 · 中英雙語
            </span>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
