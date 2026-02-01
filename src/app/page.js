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
import TarotCard from '@/components/TarotCard';
import { tarotCards } from '@/data/tarotCards';

const spreadOptions = [
  {
    id: 'single',
    title: 'Single Card',
    titleZh: '單牌占卜',
    description: 'Quick guidance for your day',
    descriptionZh: '為今日獲得快速指引',
    icon: <AutoAwesomeIcon sx={{ fontSize: 40 }} />,
    color: '#9c7cf4',
  },
  {
    id: 'three-card',
    title: 'Three Card',
    titleZh: '三牌陣',
    description: 'Past, Present, Future',
    descriptionZh: '過去、現在、未來',
    icon: <StyleIcon sx={{ fontSize: 40 }} />,
    color: '#f4cf7c',
  },
  {
    id: 'love',
    title: 'Love Reading',
    titleZh: '愛情占卜',
    description: 'Matters of the heart',
    descriptionZh: '探索愛情的奧秘',
    icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
    color: '#f47cc4',
  },
  {
    id: 'celtic-cross',
    title: 'Celtic Cross',
    titleZh: '凱爾特十字',
    description: 'Comprehensive 10-card reading',
    descriptionZh: '全面的十牌占卜',
    icon: <SelfImprovementIcon sx={{ fontSize: 40 }} />,
    color: '#7cb8f4',
  },
];

export default function Home() {
  const featuredCards = [tarotCards[0], tarotCards[17], tarotCards[19]]; // Fool, Star, Sun

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pt: { xs: 4, md: 8 },
            pb: 6,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                fontFamily: 'Cinzel',
                background: 'linear-gradient(135deg, #c4a8ff 0%, #f4cf7c 50%, #f47cc4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: '0 0 40px rgba(156, 124, 244, 0.3)',
              }}
            >
              Mystical Dog Tarot
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontFamily: 'Noto Sans TC',
                color: 'text.secondary',
                mb: 4,
              }}
            >
              神秘狗狗塔羅占卜
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h6"
              sx={{
                maxWidth: 600,
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.8,
              }}
            >
              Let our adorable canine companions guide you through the mysteries of tarot.
              Each card features a unique dog to bring you wisdom and insight.
              <br />
              讓可愛的狗狗夥伴引導您探索塔羅的奧秘。每張牌都有獨特的狗狗為您帶來智慧與洞見。
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                component={Link}
                href="/daily"
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon />}
                sx={{ minWidth: 200 }}
              >
                Daily Card 每日一牌
              </Button>
              <Button
                component={Link}
                href="/reading"
                variant="outlined"
                size="large"
                startIcon={<StyleIcon />}
                sx={{ minWidth: 200 }}
              >
                Start Reading 開始占卜
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* Featured Cards Display */}
        <Box sx={{ py: 6 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
                flexWrap: 'wrap',
              }}
            >
              {featuredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <TarotCard
                    card={card}
                    isFlipped={true}
                    size="medium"
                    disabled
                  />
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* Reading Options */}
        <Box sx={{ py: 6 }}>
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontFamily: 'Cinzel',
              mb: 1,
              color: 'primary.light',
            }}
          >
            Choose Your Reading
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontFamily: 'Noto Sans TC',
              mb: 6,
              color: 'text.secondary',
            }}
          >
            選擇您的占卜方式
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {spreadOptions.map((spread, index) => (
              <Grid item xs={12} sm={6} md={3} key={spread.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(20, 10, 40, 0.7)',
                      border: `1px solid ${spread.color}33`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        border: `1px solid ${spread.color}`,
                        boxShadow: `0 0 30px ${spread.color}40`,
                        transform: 'translateY(-5px)',
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/reading?spread=${spread.id}`}
                      sx={{ height: '100%', p: 2 }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ color: spread.color, mb: 2 }}>
                          {spread.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{ fontFamily: 'Cinzel', mb: 0.5 }}
                        >
                          {spread.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary', mb: 1 }}
                        >
                          {spread.titleZh}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {spread.description}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: 'Noto Sans TC', color: 'text.secondary' }}
                        >
                          {spread.descriptionZh}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer info */}
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            🐕 22 Major Arcana Cards · Cute Dog Designs · Bilingual Interpretations
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Noto Sans TC' }}>
            22張大阿爾卡納 · 可愛狗狗設計 · 中英雙語解讀
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
