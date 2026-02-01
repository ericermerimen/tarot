'use client';

import React from 'react';

export default function CardBack({ width, height }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient backgrounds */}
        <linearGradient id="cardBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0a2e" />
          <stop offset="50%" stopColor="#2d1b4e" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </linearGradient>

        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4cf7c" />
          <stop offset="50%" stopColor="#ffe4a8" />
          <stop offset="100%" stopColor="#c19b4c" />
        </linearGradient>

        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9c7cf4" />
          <stop offset="100%" stopColor="#6b4bc1" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Star pattern */}
        <pattern id="stars" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="5" cy="5" r="0.5" fill="rgba(255,255,255,0.2)" />
          <circle cx="35" cy="10" r="0.5" fill="rgba(255,255,255,0.25)" />
        </pattern>
      </defs>

      {/* Main background */}
      <rect width="180" height="300" rx="12" fill="url(#cardBackGradient)" />

      {/* Star overlay */}
      <rect width="180" height="300" rx="12" fill="url(#stars)" opacity="0.5" />

      {/* Ornate border */}
      <rect
        x="8"
        y="8"
        width="164"
        height="284"
        rx="8"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="14"
        width="152"
        height="272"
        rx="6"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Corner ornaments */}
      {/* Top Left */}
      <g transform="translate(20, 20)">
        <path d="M0,15 Q0,0 15,0" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="url(#goldGradient)" />
      </g>
      {/* Top Right */}
      <g transform="translate(160, 20)">
        <path d="M0,15 Q0,0 -15,0" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="url(#goldGradient)" />
      </g>
      {/* Bottom Left */}
      <g transform="translate(20, 280)">
        <path d="M0,-15 Q0,0 15,0" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="url(#goldGradient)" />
      </g>
      {/* Bottom Right */}
      <g transform="translate(160, 280)">
        <path d="M0,-15 Q0,0 -15,0" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="url(#goldGradient)" />
      </g>

      {/* Central mystical dog paw design */}
      <g transform="translate(90, 150)" filter="url(#glow)">
        {/* Outer circle */}
        <circle cx="0" cy="0" r="50" fill="none" stroke="url(#purpleGradient)" strokeWidth="2" />
        <circle cx="0" cy="0" r="42" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.6" />

        {/* Dog paw print */}
        <g transform="translate(0, 5)">
          {/* Main pad */}
          <ellipse cx="0" cy="10" rx="15" ry="12" fill="url(#goldGradient)" />
          {/* Toe beans */}
          <ellipse cx="-12" cy="-8" rx="7" ry="8" fill="url(#goldGradient)" />
          <ellipse cx="12" cy="-8" rx="7" ry="8" fill="url(#goldGradient)" />
          <ellipse cx="-5" cy="-18" rx="6" ry="7" fill="url(#goldGradient)" />
          <ellipse cx="5" cy="-18" rx="6" ry="7" fill="url(#goldGradient)" />
        </g>

        {/* Mystical symbols around the paw */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={i} transform={`rotate(${angle})`}>
            <circle cx="0" cy="-60" r="4" fill="url(#purpleGradient)" opacity="0.8" />
            <line x1="0" y1="-52" x2="0" y2="-55" stroke="url(#goldGradient)" strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* Moon phases at top */}
      <g transform="translate(90, 45)">
        <circle cx="-30" cy="0" r="8" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.5" />
        <circle cx="0" cy="0" r="10" fill="url(#goldGradient)" opacity="0.9" />
        <circle cx="30" cy="0" r="8" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Stars at bottom */}
      <g transform="translate(90, 255)">
        {[-30, 0, 30].map((x, i) => (
          <g key={i} transform={`translate(${x}, 0)`}>
            <polygon
              points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
              fill="url(#goldGradient)"
              opacity={i === 1 ? 1 : 0.6}
              transform={`scale(${i === 1 ? 1 : 0.7})`}
            />
          </g>
        ))}
      </g>

      {/* Text */}
      <text
        x="90"
        y="295"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="8"
        fill="url(#goldGradient)"
        opacity="0.7"
      >
        DOG TAROT
      </text>
    </svg>
  );
}
