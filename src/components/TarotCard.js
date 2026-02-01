'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CardBack from './CardBack';
import CardFront from './CardFront';

export default function TarotCard({
  card,
  isReversed = false,
  isFlipped = false,
  onClick,
  size = 'medium',
  showMeaning = false,
  disabled = false,
}) {
  const sizes = {
    small: { width: 120, height: 200 },
    medium: { width: 180, height: 300 },
    large: { width: 240, height: 400 },
  };

  const { width, height } = sizes[size];

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05, y: -10 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        perspective: '1000px',
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
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(156, 124, 244, 0.3)',
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
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(244, 207, 124, 0.4)',
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

      {/* Card Name Below */}
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
              mt: 2,
              fontFamily: 'Cinzel',
              fontWeight: 600,
              color: 'secondary.main',
              textShadow: '0 0 10px rgba(244, 207, 124, 0.5)',
            }}
          >
            {card.name} {isReversed && '(Reversed)'}
          </Typography>
          <Typography
            variant="caption"
            align="center"
            display="block"
            sx={{ color: 'text.secondary' }}
          >
            {card.nameZh} {isReversed && '(逆位)'}
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
}
