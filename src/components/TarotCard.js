'use client';

import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CardBack from './CardBack';
import CardFront from './CardFront';

export default function TarotCard({
  card,
  isReversed = false,
  isFlipped = false,
  onClick,
  size = 'medium',
  disabled = false,
  responsive = true,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'), { noSsr: true });

  // Responsive sizes - optimized for mobile touch targets
  const getSizes = () => {
    if (responsive) {
      if (isMobile) {
        switch (size) {
          case 'small': return { width: 90, height: 150 };
          case 'medium': return { width: 150, height: 250 };
          case 'large': return { width: 200, height: 333 };
          default: return { width: 150, height: 250 };
        }
      }
      if (isTablet) {
        switch (size) {
          case 'small': return { width: 100, height: 167 };
          case 'medium': return { width: 160, height: 267 };
          case 'large': return { width: 220, height: 367 };
          default: return { width: 160, height: 267 };
        }
      }
    }
    // Desktop sizes
    switch (size) {
      case 'small': return { width: 120, height: 200 };
      case 'medium': return { width: 180, height: 300 };
      case 'large': return { width: 240, height: 400 };
      default: return { width: 180, height: 300 };
    }
  };

  const { width, height } = getSizes();

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.03, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        perspective: '1000px',
        touchAction: 'manipulation',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          width,
          height,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Card Back */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 16px rgba(156, 124, 244, 0.25)',
          }}
        >
          <CardBack width={width} height={height} />
        </Box>

        {/* Card Front */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(244, 207, 124, 0.3)',
          }}
        >
          <CardFront
            card={card}
            isReversed={isReversed}
            width={width}
            height={height}
          />
        </Box>
      </Box>

      {/* Card Name Below - Responsive text */}
      {isFlipped && card && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: { xs: 1, sm: 1.5 },
              fontFamily: 'Cinzel',
              fontWeight: 600,
              color: 'secondary.main',
              textShadow: '0 0 10px rgba(244, 207, 124, 0.5)',
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
            }}
          >
            {card.name} {isReversed && '↺'}
          </Typography>
          <Typography
            variant="caption"
            align="center"
            display="block"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              fontFamily: 'Noto Sans TC',
            }}
          >
            {card.nameZh} {isReversed && '(逆位)'}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
}
