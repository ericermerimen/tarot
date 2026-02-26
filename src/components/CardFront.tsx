'use client';

import React from 'react';
import CardShaderCanvas from './shaders/CardShaderCanvas';
import { DogIllustrations, GenericDog } from './cards';
import type { TarotCardData } from '@/types/tarot';

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function toRomanNumeral(num: number): string {
  const numerals = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  return numerals[num] || num.toString();
}

// ─── CardFront ────────────────────────────────────────────────────────────────

interface CardFrontProps {
  card: TarotCardData;
  isReversed: boolean;
  width: number;
  height: number;
}

export default function CardFront({ card, isReversed, width, height }: CardFrontProps) {
  if (!card) return null;

  const DogComponent   = DogIllustrations[card.id] || GenericDog;
  const primaryColor   = card.colors?.[0] || '#FFD700';
  const secondaryColor = card.colors?.[1] || '#9c7cf4';
  const colors         = card.colors || ['#9c7cf4', '#f4cf7c', '#6b4bc1'];

  // Unique SVG filter IDs per card to avoid cross-card conflicts
  const goldId   = `cfGold-${card.id}`;
  const glowId   = `cfGlow-${card.id}`;
  const shadowId = `cfShadow-${card.id}`;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 12,
        overflow: 'hidden',
        transform: isReversed ? 'rotate(180deg)' : 'none',
      }}
    >
      {/* ── WebGL animated shader background (unique per arcana) ── */}
      <CardShaderCanvas
        width={width}
        height={height}
        cardType={card.id}
        colors={colors}
        reversed={false}
        animate={true}
      />

      {/* ── SVG overlay: border, illustrations, text ── */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 180 300"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#f4cf7c" />
            <stop offset="50%"  stopColor="#ffe4a8" />
            <stop offset="100%" stopColor="#c19b4c" />
          </linearGradient>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#000" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* Header dark strip for text legibility */}
        <path d="M12,0 L168,0 Q180,0 180,12 L180,42 L0,42 L0,12 Q0,0 12,0 Z"
          fill="rgba(0,0,0,0.48)" />

        {/* Footer dark strip */}
        <path d="M0,224 L180,224 L180,288 Q180,300 168,300 L12,300 Q0,300 0,288 Z"
          fill="rgba(0,0,0,0.52)" />

        {/* Gold outer border */}
        <rect
          x="5" y="5" width="170" height="290" rx="10"
          fill="none"
          stroke={`url(#${goldId})`}
          strokeWidth="2.5"
          filter={`url(#${glowId})`}
        />
        {/* Inner border */}
        <rect
          x="10" y="10" width="160" height="280" rx="7"
          fill="none"
          stroke={`url(#${goldId})`}
          strokeWidth="0.8"
          opacity="0.4"
        />

        {/* Corner ornaments */}
        {([
          [18, 18, 'M0,14 Q0,0 14,0'],
          [162, 18, 'M0,14 Q0,0 -14,0'],
          [18, 282, 'M0,-14 Q0,0 14,0'],
          [162, 282, 'M0,-14 Q0,0 -14,0'],
        ] as const).map(([cx, cy, d], i) => (
          <g key={i} transform={`translate(${cx},${cy})`} filter={`url(#${glowId})`}>
            <path d={d} fill="none" stroke={`url(#${goldId})`} strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill={`url(#${goldId})`} />
          </g>
        ))}

        {/* Roman numeral */}
        <text
          x="90" y="27"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="14"
          fontWeight="bold"
          fill="#f4cf7c"
          filter={`url(#${shadowId})`}
        >
          {toRomanNumeral(card.id)}
        </text>

        {/* Dog illustration */}
        <g transform="translate(90, 130)">
          <DogComponent primaryColor={primaryColor} secondaryColor={secondaryColor} />
        </g>

        {/* Card name (English) */}
        <text
          x="90" y="244"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="12"
          fontWeight="bold"
          fill="#f4cf7c"
          filter={`url(#${shadowId})`}
          letterSpacing="0.5"
        >
          {card.name.toUpperCase()}
        </text>

        {/* Card name (Chinese) */}
        <text
          x="90" y="260"
          textAnchor="middle"
          fontFamily="Noto Sans TC, sans-serif"
          fontSize="11"
          fill="#d4b8f0"
          filter={`url(#${shadowId})`}
        >
          {card.nameZh}
        </text>

        {/* Keywords */}
        <text
          x="90" y="276"
          textAnchor="middle"
          fontFamily="Noto Sans TC, sans-serif"
          fontSize="7.5"
          fill="#c8b8e0"
          opacity="0.9"
        >
          {card.keywordsZh.slice(0, 2).join(' · ')}
        </text>

        {/* Bottom accent dots */}
        <g transform="translate(90, 291)" filter={`url(#${glowId})`}>
          <circle cx="-16" cy="0" r="3"   fill={`url(#${goldId})`} opacity="0.8" />
          <circle cx="0"   cy="0" r="3.5" fill={primaryColor}       opacity="0.9" />
          <circle cx="16"  cy="0" r="3"   fill={`url(#${goldId})`} opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
