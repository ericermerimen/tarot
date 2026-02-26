'use client';

import React from 'react';
import CardShaderCanvas from './shaders/CardShaderCanvas';

interface CardBackOverlayProps {
  width: number;
  height: number;
}

function CardBackOverlay({ width, height }: CardBackOverlayProps) {
  const vw = 180;
  const vh = 300;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="cbGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f4cf7c" />
          <stop offset="50%"  stopColor="#ffe4a8" />
          <stop offset="100%" stopColor="#c19b4c" />
        </linearGradient>
        <linearGradient id="cbPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#9c7cf4" />
          <stop offset="100%" stopColor="#6b4bc1" />
        </linearGradient>
        <filter id="cbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        x="7" y="7" width="166" height="286" rx="9"
        fill="none"
        stroke="url(#cbGold)"
        strokeWidth="2.2"
        filter="url(#cbGlow)"
      />
      <rect
        x="13" y="13" width="154" height="274" rx="6"
        fill="none"
        stroke="url(#cbGold)"
        strokeWidth="0.9"
        opacity="0.55"
      />

      {([
        [20, 20, 'M0,16 Q0,0 16,0'],
        [160, 20, 'M0,16 Q0,0 -16,0'],
        [20, 280, 'M0,-16 Q0,0 16,0'],
        [160, 280, 'M0,-16 Q0,0 -16,0'],
      ] as const).map(([cx, cy, d], i) => (
        <g key={i} transform={`translate(${cx},${cy})`} filter="url(#cbGlow)">
          <path d={d} fill="none" stroke="url(#cbGold)" strokeWidth="2" />
          <circle cx="0" cy="0" r="2.5" fill="url(#cbGold)" />
        </g>
      ))}

      <g transform="translate(90,44)" filter="url(#cbGlow)">
        <circle cx="-28" cy="0" r="7"  fill="none" stroke="url(#cbGold)" strokeWidth="1" opacity="0.55" />
        <circle cx="0"   cy="0" r="9"  fill="url(#cbGold)" opacity="0.92" />
        <circle cx="28"  cy="0" r="7"  fill="none" stroke="url(#cbGold)" strokeWidth="1" opacity="0.55" />
      </g>

      <g transform="translate(90,152)" filter="url(#cbGlow)">
        <circle cx="0" cy="0" r="48" fill="none" stroke="url(#cbPurple)" strokeWidth="2" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="url(#cbGold)"   strokeWidth="0.8" opacity="0.55" />

        <g transform="translate(0,6)">
          <ellipse cx="0"   cy="10"  rx="14" ry="11" fill="url(#cbGold)" />
          <ellipse cx="-11" cy="-8"  rx="6.5" ry="7.5" fill="url(#cbGold)" />
          <ellipse cx="11"  cy="-8"  rx="6.5" ry="7.5" fill="url(#cbGold)" />
          <ellipse cx="-4"  cy="-17" rx="5.5" ry="6.5" fill="url(#cbGold)" />
          <ellipse cx="4"   cy="-17" rx="5.5" ry="6.5" fill="url(#cbGold)" />
        </g>

        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <g key={i} transform={`rotate(${deg})`}>
            <circle cx="0" cy="-57" r="3.5" fill="url(#cbPurple)" opacity="0.85" />
          </g>
        ))}
      </g>

      <g transform="translate(90,257)">
        {[-28, 0, 28].map((x, i) => (
          <polygon
            key={i}
            points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
            fill="url(#cbGold)"
            opacity={i === 1 ? 1 : 0.6}
            transform={`translate(${x},0) scale(${i === 1 ? 1 : 0.7})`}
            filter={i === 1 ? 'url(#cbGlow)' : undefined}
          />
        ))}
      </g>

      <text
        x="90" y="290"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="7.5"
        fill="url(#cbGold)"
        opacity="0.75"
        letterSpacing="2"
      >
        DOG TAROT
      </text>
    </svg>
  );
}

const CARD_BACK_COLORS = ['#9c7cf4', '#f4cf7c', '#6b4bc1'];

interface CardBackProps {
  width: number;
  height: number;
}

export default function CardBack({ width, height }: CardBackProps) {
  return (
    <div style={{ position: 'relative', width, height, borderRadius: 12, overflow: 'hidden' }}>
      <CardShaderCanvas
        width={width}
        height={height}
        cardType={-1}
        colors={CARD_BACK_COLORS}
        reversed={false}
        animate={true}
      />
      <CardBackOverlay width={width} height={height} />
    </div>
  );
}
