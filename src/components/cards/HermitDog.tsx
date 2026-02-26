import React from 'react';

export default function HermitDog() {
  return (
    <g>
      <polygon points="-45,55 0,-10 45,55" fill="#708090" opacity="0.5" />
      <g transform="translate(-30, -20)">
        <rect x="-5" y="-15" width="10" height="20" fill="#8B4513" />
        <rect x="-8" y="-25" width="16" height="12" rx="3" fill="#FFD700" />
        <circle cx="0" cy="-19" r="4" fill="#FFF8DC" />
      </g>
      <line x1="30" y1="-50" x2="30" y2="50" stroke="#8B4513" strokeWidth="4" />
      <path d="M-30,55 Q0,30 30,55 L25,0 Q0,-15 -25,0 Z" fill="#708090" />
      <ellipse cx="0" cy="25" rx="25" ry="22" fill="#FFFAF0" />
      <circle cx="0" cy="-10" r="26" fill="#FFFAF0" />
      <ellipse cx="0" cy="0" rx="15" ry="12" fill="#E8E8E8" />
      <ellipse cx="-20" cy="-28" rx="12" ry="16" fill="#FFFAF0" />
      <ellipse cx="20" cy="-28" rx="12" ry="16" fill="#FFFAF0" />
      <ellipse cx="-20" cy="-26" rx="8" ry="10" fill="#FFE4B5" />
      <ellipse cx="20" cy="-26" rx="8" ry="10" fill="#FFE4B5" />
      <ellipse cx="-8" cy="-12" rx="4" ry="3" fill="#2d1b4e" />
      <ellipse cx="8" cy="-12" rx="4" ry="3" fill="#2d1b4e" />
      <circle cx="-6" cy="-13" r="1" fill="white" />
      <circle cx="10" cy="-13" r="1" fill="white" />
      <path d="M-14,-18 Q-8,-22 -4,-18" fill="none" stroke="#A9A9A9" strokeWidth="2" />
      <path d="M4,-18 Q8,-22 14,-18" fill="none" stroke="#A9A9A9" strokeWidth="2" />
      <ellipse cx="0" cy="3" rx="5" ry="4" fill="#1a1a1a" />
      <circle cx="-40" cy="-45" r="2" fill="#FFD700" />
      <circle cx="40" cy="-40" r="1.5" fill="#FFD700" />
      <circle cx="0" cy="-55" r="2" fill="#FFD700" />
    </g>
  );
}
